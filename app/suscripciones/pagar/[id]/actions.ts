"use server";
import { startCustomerCheckout } from "../../../../lib/billing/customer-checkout";
export async function continueSubscription(_previous: { error?: string; url?: string }, form: FormData) {
  const id = String(form.get("id") ?? "");
  const token = String(form.get("token") ?? "");
  return startCustomerCheckout(id, token, form.get("payer_email"));
}
