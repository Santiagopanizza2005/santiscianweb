import { createHmac, timingSafeEqual } from "node:crypto";

export type BillingSubscription = {
  id: string; client_name: string; company: string; email: string; service: string;
  notes: string; amount: number; environment: "test" | "production"; status: string;
  mp_id: string | null; checkout_url: string | null; next_payment_at: string | null;
  last_synced_at: string | null; created_at: string;
};
export const statusLabels: Record<string, string> = {
  draft: "Borrador", creating: "Generando enlace", create_unknown: "Verificar creación",
  pending: "Esperando autorización", authorized: "Autorizada", paused: "Pausada", cancelled: "Cancelada",
};
export function parseAmount(value: unknown) {
  const text = String(value ?? "").trim();
  if (!/^\d{1,9}([.,]\d{1,2})?$/.test(text)) throw new Error("Ingresá un importe en pesos, sin separadores de miles y con hasta dos decimales.");
  const amount = Number(text.replace(",", "."));
  if (!Number.isFinite(amount) || amount <= 0 || amount > 999999999) throw new Error("El importe debe ser mayor a cero.");
  return amount;
}
export function checkoutUrl(value: unknown): string | null {
  try {
    const url = new URL(String(value));
    return url.protocol === "https:" && url.hostname === "www.mercadopago.com.ar" && !url.username && !url.password
      && url.pathname === "/subscriptions/checkout" ? url.toString() : null;
  } catch { return null; }
}
export function verifySignature(signature: string | null, requestId: string | null, dataId: string, secret: string) {
  if (!secret || !signature || !requestId || !/^[a-zA-Z0-9_-]{1,128}$/.test(dataId)) return false;
  const entries = signature.split(",").map(part => part.trim().split("="));
  if (entries.filter(([k]) => k === "ts").length !== 1 || entries.filter(([k]) => k === "v1").length !== 1) return false;
  const parts = Object.fromEntries(entries);
  if (!/^\d+$/.test(parts.ts ?? "") || !/^[a-f0-9]{64}$/i.test(parts.v1 ?? "")) return false;
  const expected = createHmac("sha256", secret).update(`id:${dataId.toLowerCase()};request-id:${requestId};ts:${parts.ts};`).digest("hex");
  return timingSafeEqual(Buffer.from(expected, "hex"), Buffer.from(parts.v1, "hex"));
}
