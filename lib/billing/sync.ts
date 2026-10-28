import "server-only";
import { getSupabaseAdminClient } from "../supabase-admin";
import { billingConfig, mpRequest, verifyBillingAccount, type Preapproval, type Invoice } from "./mercadopago";
import { checkoutUrl } from "./model";

// Shared with the public site's webhook receiver. Keep both copies in sync.
export async function syncPreapproval(remote: Preapproval) {
  const config = billingConfig();
  if (!config || String(remote.collector_id) !== config.collector) throw new Error("La suscripción no pertenece a esta cuenta.");
  await verifyBillingAccount();
  const db = getSupabaseAdminClient();
  const { data: row, error } = await db.from("billing_subscriptions").select("id,mp_id,amount,environment")
    .eq("id", remote.external_reference).eq("environment", config.environment).maybeSingle();
  if (error) throw new Error("No se pudo consultar la suscripción.");
  if (!row) return false;
  if ((row.mp_id && row.mp_id !== remote.id) || !["pending", "authorized", "paused", "cancelled"].includes(remote.status)
    || remote.auto_recurring?.currency_id !== "ARS" || remote.auto_recurring?.frequency !== 1
    || remote.auto_recurring?.frequency_type !== "months" || Math.round(Number(remote.auto_recurring.transaction_amount) * 100) !== Math.round(Number(row.amount) * 100)) {
    throw new Error("Los datos de Mercado Pago no coinciden con la suscripción guardada.");
  }
  const { error: writeError } = await db.from("billing_subscriptions").update({
    mp_id: remote.id, status: remote.status, checkout_url: checkoutUrl(remote.init_point),
    next_payment_at: remote.next_payment_date ?? null, last_synced_at: new Date().toISOString(),
  }).eq("id", row.id).eq("environment", config.environment);
  if (writeError) throw new Error("No se pudo guardar el estado de Mercado Pago. Actualizá la suscripción.");
  return true;
}
export async function syncInvoice(invoice: Invoice) {
  const config = billingConfig();
  if (!config || !/^[a-zA-Z0-9_-]+$/.test(invoice.preapproval_id)) throw new Error("Factura inválida.");
  const remote = await mpRequest<Preapproval>(`/preapproval/${invoice.preapproval_id}`);
  if (!(await syncPreapproval(remote))) return false;
  let paymentStatus = "pending";
  let paymentId: string | null = null;
  if (invoice.payment?.id) {
    const payment = await mpRequest<{ id: number; collector_id: number; status: string; transaction_amount: number; currency_id: string; live_mode: boolean }>(`/v1/payments/${invoice.payment.id}`);
    if (String(payment.collector_id) !== config.collector || payment.currency_id !== "ARS"
      // APP_USR credentials of test accounts also return live_mode=true.
      // The account's test_user tag was verified by syncPreapproval above.
      || (config.environment === "production" && payment.live_mode !== true)
      || Math.round(Number(payment.transaction_amount) * 100) !== Math.round(Number(invoice.transaction_amount) * 100)) throw new Error("El pago no coincide con la factura.");
    paymentId = String(payment.id); paymentStatus = payment.status;
  }
  const { error } = await getSupabaseAdminClient().from("billing_payments").upsert({
    mp_invoice_id: String(invoice.id), subscription_id: remote.external_reference,
    environment: config.environment, mp_payment_id: paymentId, invoice_status: invoice.status,
    payment_status: paymentStatus, amount: invoice.transaction_amount, currency: invoice.currency_id ?? "ARS",
    debit_at: invoice.debit_date ?? null, synced_at: new Date().toISOString(),
  }, { onConflict: "environment,mp_invoice_id" });
  if (error) throw new Error("No se pudo guardar el cobro.");
  return true;
}
export async function refreshSubscription(id: string) {
  const db = getSupabaseAdminClient();
  const config = billingConfig();
  if (!config) throw new Error("Falta activar Mercado Pago.");
  const { data: row, error } = await db.from("billing_subscriptions").select("id,mp_id,environment,status,email").eq("id", id).eq("environment", config.environment).single();
  if (error || !row) throw new Error("No se encontró la suscripción en este entorno.");
  let mpId = row.mp_id;
  if (!mpId) {
    // payer_email is a documented filter; external_reference is not a search parameter.
    // Check every matching page before deciding there is one existing subscription.
    const matches: Preapproval[] = [];
    let complete = false;
    for (let offset = 0; offset < 1000; offset += 100) {
      const found = await mpRequest<{ results: Preapproval[]; paging?: { total: number } }>(`/preapproval/search?payer_email=${encodeURIComponent(row.email)}&limit=100&offset=${offset}`);
      matches.push(...(found.results ?? []).filter(item => String(item.external_reference) === id && String(item.collector_id) === config.collector));
      if ((found.results?.length ?? 0) < 100 || offset + 100 >= (found.paging?.total ?? Infinity)) { complete = true; break; }
    }
    if (!complete) throw new Error("Hay demasiadas suscripciones para este correo. Revisá la creación en Mercado Pago antes de continuar.");
    if (matches.length !== 1) throw new Error(matches.length ? "Hay varias coincidencias. Revisá Mercado Pago antes de continuar." : "Mercado Pago todavía no devolvió una suscripción. No se generará otra para evitar duplicados.");
    mpId = matches[0].id;
  }
  if (!/^[a-zA-Z0-9_-]+$/.test(mpId)) throw new Error("Identificador inválido.");
  await syncPreapproval(await mpRequest<Preapproval>(`/preapproval/${mpId}`));
  for (let offset = 0; offset < 100;) {
    // Use MP's supported default page size (currently 12), not a guessed limit.
    const invoices = await mpRequest<{ results: Invoice[]; paging?: { total: number } }>(`/authorized_payments/search?preapproval_id=${encodeURIComponent(mpId)}${offset ? `&offset=${offset}` : ""}`);
    const page = invoices.results ?? [];
    for (const invoice of page.slice(0, 100 - offset)) await syncInvoice(invoice);
    if (!page.length || offset + page.length >= (invoices.paging?.total ?? Infinity)) return;
    offset += page.length;
  }
  throw new Error("Se actualizaron los últimos 100 cobros; el historial anterior se conserva.");
}
