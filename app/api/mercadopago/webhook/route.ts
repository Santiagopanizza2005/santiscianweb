import { getSupabaseAdminClient } from "../../../../lib/supabase-admin";
import { billingConfig, MercadoPagoError, mpRequest, type Preapproval, type Invoice } from "../../../../lib/billing/mercadopago";
import { verifySignature } from "../../../../lib/billing/model";
import { syncInvoice, syncPreapproval } from "../../../../lib/billing/sync";

export const dynamic = "force-dynamic";
async function readLimitedBody(request: Request) {
  const reader = request.body?.getReader();
  if (!reader) return "";
  let size = 0;
  const chunks: Uint8Array[] = [];
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    size += value.byteLength;
    if (size > 16384) { await reader.cancel(); throw new RangeError("Body too large"); }
    chunks.push(value);
  }
  return Buffer.concat(chunks).toString("utf8");
}
export async function POST(request: Request) {
  const config = billingConfig();
  const signatureSecret = process.env.MERCADOPAGO_WEBHOOK_SECRET ?? "";
  if (!config || !signatureSecret) return new Response(null, { status: 503 });
  const url = new URL(request.url);
  const queryId = url.searchParams.get("data.id") ?? url.searchParams.get("id") ?? "";
  if (!/^[a-zA-Z0-9_-]{1,128}$/.test(queryId)) return new Response(null, { status: 400 });
  // Webhook events are authenticated using the secret generated in MP's dashboard.
  // The payload is only a hint; all authoritative data is fetched from MP's API.
  const authorized = verifySignature(request.headers.get("x-signature"), request.headers.get("x-request-id"), queryId, signatureSecret);
  if (!authorized) return new Response(null, { status: 401 });
  let stage = "request_body";
  try {
    if (Number(request.headers.get("content-length") ?? 0) > 16384) return new Response(null, { status: 413 });
    const raw = await readLimitedBody(request);
    if (raw.length > 16384) return new Response(null, { status: 413 });
    const body = raw ? JSON.parse(raw) : {};
    if (body.data?.id !== undefined && String(body.data.id).toLowerCase() !== queryId.toLowerCase()) return new Response(null, { status: 400 });
    const type = body.type ?? url.searchParams.get("topic");
    // Test accounts using APP_USR credentials emit live_mode=true too.
    // syncPreapproval verifies the account's test_user tag before any write.
    if (body.live_mode !== undefined && typeof body.live_mode !== "boolean") return new Response(null, { status: 400 });
    if (config.environment === "production" && body.live_mode === false) return new Response(null, { status: 200 });
    if (body.user_id !== undefined && String(body.user_id) !== config.collector) return new Response(null, { status: 200 });
    if (type === "subscription_preapproval") {
      stage = "subscription_lookup";
      const remote = await mpRequest<Preapproval>(`/preapproval/${queryId}`);
      stage = "subscription_sync";
      await syncPreapproval(remote);
    } else if (type === "subscription_authorized_payment") {
      stage = "invoice_lookup";
      const invoice = await mpRequest<Invoice>(`/authorized_payments/${queryId}`);
      stage = "invoice_sync";
      await syncInvoice(invoice);
    } else if (type === "payment") {
      stage = "payment_lookup";
      const db = getSupabaseAdminClient();
      const { data, error } = await db.from("billing_payments").select("mp_invoice_id")
        .eq("environment", config.environment).eq("mp_payment_id", queryId).maybeSingle();
      if (error) throw new Error("Payment lookup failed");
      if (data) {
        stage = "payment_sync";
        await syncInvoice(await mpRequest<Invoice>(`/authorized_payments/${encodeURIComponent(data.mp_invoice_id)}`));
      }
    }
    return new Response(null, { status: 200 });
  } catch (error) {
    if (error instanceof SyntaxError) return new Response(null, { status: 400 });
    if (error instanceof RangeError) return new Response(null, { status: 413 });
    // Fixed categories only: never log provider bodies, payer details or credentials.
    const databaseFailures: Record<string, string> = {
      "No se pudo consultar la suscripción.": "database_read",
      "No se pudo guardar el estado de Mercado Pago. Actualizá la suscripción.": "database_write",
      "No se pudo guardar el cobro.": "database_write",
      "La suscripción no pertenece a esta cuenta.": "merchant_mismatch",
      "Los datos de Mercado Pago no coinciden con la suscripción guardada.": "subscription_mismatch",
    };
    const failure = error instanceof MercadoPagoError ? `provider_${error.status}`
      : error instanceof Error && databaseFailures[error.message] ? databaseFailures[error.message]
      : error instanceof Error && error.name === "TimeoutError" ? "provider_timeout"
      : error instanceof TypeError ? "network_or_type" : "internal";
    console.error("Mercado Pago webhook failed", { stage, failure });
    // 5xx asks Mercado Pago to retry delivery.
    return new Response(null, { status: 500 });
  }
}
