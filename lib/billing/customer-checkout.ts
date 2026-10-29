import "server-only";
import { getSupabaseAdminClient } from "../supabase-admin";
import { billingConfig, MercadoPagoError, mpRequest, verifyBillingAccount, type Preapproval } from "./mercadopago";
import { syncPreapproval } from "./sync";
import { checkoutUrl } from "./model";
import { validPayerEmail, verifyInvitationToken } from "./invitations";

export async function loadInvitation(id: string, token: string) {
  const signed = verifyInvitationToken(id, token);
  const config = billingConfig();
  if (!signed || !config || signed.environment !== config.environment) return null;
  const { data: row, error } = await getSupabaseAdminClient().from("billing_subscriptions").select("id,environment,invitation_created_at,status,mp_id,checkout_url,service,amount")
    .eq("id", id).eq("environment", config.environment).maybeSingle();
  if (error || !row || !row.invitation_created_at || Math.floor(new Date(row.invitation_created_at).getTime() / 1000) !== signed.seconds) return null;
  return row;
}
export async function startCustomerCheckout(id: string, token: string, value: unknown): Promise<{ url?: string; error?: string }> {
  const email = validPayerEmail(value);
  if (!email) return { error: "Ingresá un correo válido para el pago." };
  try {
    const row = await loadInvitation(id, token);
    if (!row) return { error: "El enlace no está disponible o venció. Pedí un nuevo enlace al estudio." };
    if (row.status === "pending" && row.mp_id) {
      const url = checkoutUrl(row.checkout_url);
      return url ? { url } : { error: "Estamos verificando tu enlace con Mercado Pago." };
    }
    if (row.status !== "draft" || row.mp_id) return { error: "Esta solicitud ya fue procesada o está siendo verificada. No se generará otra suscripción." };
    await verifyBillingAccount();
    const db = getSupabaseAdminClient();
    const { data: locked, error } = await db.from("billing_subscriptions").update({ status: "creating", payer_email: email })
      .eq("id", id).eq("environment", row.environment).eq("status", "draft").eq("invitation_created_at", row.invitation_created_at).select("id").maybeSingle();
    if (error || !locked) return { error: "La solicitud ya está siendo procesada. Esperá unos instantes antes de continuar." };
    try {
      const remote = await mpRequest<Preapproval>("/preapproval", "POST", {
        reason: row.service, payer_email: email, external_reference: id,
        auto_recurring: { frequency: 1, frequency_type: "months", transaction_amount: Number(row.amount), currency_id: "ARS" },
        back_url: `${billingConfig()!.origin}/suscripciones/resultado`, status: "pending",
      }, id);
      if (!(await syncPreapproval(remote))) throw new Error("Subscription not persisted");
      const url = checkoutUrl(remote.init_point);
      if (!url) throw new Error("Missing checkout URL");
      return { url };
    } catch (failure) {
      const definitive = failure instanceof MercadoPagoError && [400, 401, 403, 404, 422].includes(failure.status);
      await db.from("billing_subscriptions").update({ status: definitive ? "draft" : "create_unknown" }).eq("id", id).eq("environment", row.environment).eq("status", "creating");
      return { error: definitive ? "Mercado Pago no pudo preparar el pago. Revisá el correo e intentá nuevamente." : "No pudimos confirmar la creación. Contactá al estudio antes de volver a intentar para evitar duplicados." };
    }
  } catch { return { error: "No pudimos conectar con el servicio. Intentá de nuevo en unos instantes." }; }
}
