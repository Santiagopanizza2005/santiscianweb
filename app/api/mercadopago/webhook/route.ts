import { getSupabaseAdminClient } from "../../../../lib/supabase-admin";
import { billingConfig, mpRequest, type Preapproval, type Invoice } from "../../../../lib/billing/mercadopago";
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
  try {
    if (Number(request.headers.get("content-length") ?? 0) > 16384) return new Response(null, { status: 413 });
    const raw = await readLimitedBody(request);
    if (raw.length > 16384) return new Response(null, { status: 413 });
    const body = raw ? JSON.parse(raw) : {};
    if (body.data?.id !== undefined && String(body.data.id).toLowerCase() !== queryId.toLowerCase()) return new Response(null, { status: 400 });
    const type = body.type ?? url.searchParams.get("topic");
    if (body.live_mode !== undefined && body.live_mode !== (config.environment === "production")) return new Response(null, { status: 200 });
    if (body.user_id !== undefined && String(body.user_id) !== config.collector) return new Response(null, { status: 200 });
    if (type === "subscription_preapproval") {
      await syncPreapproval(await mpRequest<Preapproval>(`/preapproval/${queryId}`));
    } else if (type === "subscription_authorized_payment") {
      await syncInvoice(await mpRequest<Invoice>(`/authorized_payments/${queryId}`));
    } else if (type === "payment") {
      const db = getSupabaseAdminClient();
      const { data, error } = await db.from("billing_payments").select("mp_invoice_id")
        .eq("environment", config.environment).eq("mp_payment_id", queryId).maybeSingle();
      if (error) throw new Error("Payment lookup failed");
      if (data) await syncInvoice(await mpRequest<Invoice>(`/authorized_payments/${encodeURIComponent(data.mp_invoice_id)}`));
    }
    return new Response(null, { status: 200 });
  } catch (error) {
    if (error instanceof SyntaxError) return new Response(null, { status: 400 });
    if (error instanceof RangeError) return new Response(null, { status: 413 });
    // No payloads, payer details or credentials in logs/responses; 5xx asks MP to retry.
    return new Response(null, { status: 500 });
  }
}
