import "server-only";

export type Preapproval = {
  id: string; collector_id: number; external_reference: string; status: string;
  init_point?: string; next_payment_date?: string;
  auto_recurring: { transaction_amount: number; currency_id: string; frequency: number; frequency_type: string };
};
export type Invoice = {
  id: number; preapproval_id: string; status: string; transaction_amount: number; currency_id: string;
  debit_date?: string; payment?: { id?: number; status?: string };
};
export function billingConfig() {
  const token = process.env.MERCADOPAGO_ACCESS_TOKEN;
  const collector = process.env.MERCADOPAGO_COLLECTOR_ID;
  const environment = process.env.MERCADOPAGO_ENVIRONMENT;
  const origin = process.env.BILLING_PUBLIC_ORIGIN;
  const webhookSecret = process.env.MERCADOPAGO_WEBHOOK_SECRET;
  if (!token || !collector || !/^\d+$/.test(collector) || !["test", "production"].includes(environment ?? "") || !origin || !webhookSecret || webhookSecret.length < 32) return null;
  try {
    const url = new URL(origin);
    if (url.protocol !== "https:" || url.username || url.password || url.pathname !== "/" || url.search || url.hash) return null;
    return { token, collector, environment: environment as "test" | "production", origin: url.origin };
  } catch { return null; }
}
export class MercadoPagoError extends Error {
  constructor(public status: number) { super(`Mercado Pago no pudo completar la operación (${status}).`); }
}
export async function mpRequest<T>(path: string, method = "GET", body?: unknown, idempotencyKey?: string): Promise<T> {
  const config = billingConfig();
  if (!config) throw new Error("Falta activar la integración de Mercado Pago.");
  if (!/^\/(preapproval|authorized_payments|v1\/payments|users\/me)(\/|\?|$)/.test(path)) throw new Error("Recurso inválido.");
  const response = await fetch(`https://api.mercadopago.com${path}`, {
    method, headers: { Authorization: `Bearer ${config.token}`, "Content-Type": "application/json",
      ...(idempotencyKey ? { "X-Idempotency-Key": idempotencyKey } : {}) },
    body: body === undefined ? undefined : JSON.stringify(body),
    cache: "no-store", signal: AbortSignal.timeout(15000), redirect: "error",
  });
  if (!response.ok) throw new MercadoPagoError(response.status);
  return response.json() as Promise<T>;
}

export async function verifyBillingAccount() {
  const config = billingConfig();
  if (!config) throw new Error("Falta activar la integración de Mercado Pago.");
  const account = await mpRequest<{ id: number; tags?: string[] }>("/users/me");
  const isTestAccount = account.tags?.includes("test_user") === true;
  if (String(account.id) !== config.collector || isTestAccount !== (config.environment === "test")) {
    throw new Error("La cuenta de Mercado Pago no corresponde al entorno configurado.");
  }
  return config;
}
