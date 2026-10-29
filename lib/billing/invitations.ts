import "server-only";
import { createHmac, timingSafeEqual } from "node:crypto";
import { billingConfig } from "./mercadopago";

const lifetime = 30 * 86400;
export const validSubscriptionId = (id: string) => /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);
export function validPayerEmail(value: unknown): string | null {
  const email = String(value ?? "").trim().toLowerCase();
  return email.length <= 254 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ? email : null;
}
function signature(id: string, payload: string) {
  const secret = process.env.SUPABASE_SECRET_KEY;
  if (!secret || secret.length < 32) throw new Error("Falta configurar los enlaces privados.");
  const key = createHmac("sha256", secret).update("santiscian:billing-invitations:v1").digest();
  return createHmac("sha256", key).update(`${id}:${payload}`).digest("hex");
}
export function invitationToken(id: string, environment: string, created: string) {
  const seconds = Math.floor(new Date(created).getTime() / 1000);
  if (!validSubscriptionId(id) || !["test", "production"].includes(environment) || !Number.isFinite(seconds)) throw new Error("Enlace inválido.");
  const payload = `${environment}.${seconds}`;
  return `${payload}.${signature(id, payload)}`;
}
export function verifyInvitationToken(id: string, token: string, now = Date.now()) {
  if (!validSubscriptionId(id) || token.length > 120) return null;
  const match = /^(test|production)\.(\d{10})\.([a-f0-9]{64})$/.exec(token);
  if (!match) return null;
  const seconds = Number(match[2]);
  if (seconds > now / 1000 + 60 || now / 1000 - seconds > lifetime) return null;
  try {
    const expected = signature(id, `${match[1]}.${match[2]}`);
    if (!timingSafeEqual(Buffer.from(match[3]), Buffer.from(expected))) return null;
    return { environment: match[1], seconds };
  } catch { return null; }
}
export function invitationUrl(row: { id: string; environment: string; invitation_created_at?: string | null }) {
  const config = billingConfig();
  if (!config || !row.invitation_created_at || config.environment !== row.environment) return null;
  try {
    const token = invitationToken(row.id, row.environment, row.invitation_created_at);
    return verifyInvitationToken(row.id, token) ? `${config.origin}/suscripciones/pagar/${row.id}?token=${token}` : null;
  } catch { return null; }
}
