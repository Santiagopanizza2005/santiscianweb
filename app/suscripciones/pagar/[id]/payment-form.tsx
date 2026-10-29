"use client";
import { useActionState, useEffect } from "react";
import { continueSubscription } from "./actions";
export function PaymentForm({ id, token }: { id: string; token: string }) {
  const [state, action, pending] = useActionState(continueSubscription, {});
  useEffect(() => { if (state.url) window.location.assign(state.url); }, [state.url]);
  return <form action={action} className="subscription-checkout__form">
    <input type="hidden" name="id" value={id} /><input type="hidden" name="token" value={token} />
    <label htmlFor="payer-email">Correo para el pago</label>
    <input id="payer-email" name="payer_email" type="email" required maxLength={254} autoComplete="email" placeholder="tu@correo.com" />
    <p className="subscription-checkout__hint">Ingresá el correo que vas a utilizar para pagar. Si usás tu cuenta de Mercado Pago, ingresá el correo de esa cuenta.</p>
    <button disabled={pending || !!state.url}>{pending || state.url ? "Preparando tu pago…" : "Continuar a Mercado Pago"}</button>
    {state.error && <p role="alert" className="subscription-checkout__error">{state.error}</p>}
  </form>;
}
