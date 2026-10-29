import type { Metadata } from "next";
import { loadInvitation } from "../../../../lib/billing/customer-checkout";
import { PaymentForm } from "./payment-form";
import "./payment.css";
export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Tu mantenimiento mensual · Santi Scian", robots: { index: false, follow: false }, referrer: "no-referrer" };
export default async function SubscriptionPaymentPage({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<{ token?: string }> }) {
  const { id } = await params;
  const { token = "" } = await searchParams;
  const row = await loadInvitation(id, token);
  const available = row && ["draft", "pending"].includes(row.status);
  const money = new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS" });
  return <main className="subscription-checkout"><section className="subscription-checkout__card">
    <p className="subscription-checkout__brand">Santi Scian · Mantenimiento</p>
    {!row ? <><h1>Este enlace no está disponible.</h1><p>Puede haber vencido. Contactá al estudio para recibir un nuevo enlace.</p></> : !available ? <><h1>{row.status === "authorized" ? "Tu suscripción ya está autorizada." : row.status === "cancelled" ? "Esta suscripción está cancelada." : "Estamos verificando tu suscripción."}</h1><p>No hace falta realizar otra autorización. Si necesitás ayuda, contactá al estudio.</p></> : <>
      <h1>Tu mantenimiento, en marcha.</h1><p>{row.service}</p>
      <div className="subscription-checkout__amount">{money.format(Number(row.amount))}<span> por mes</span></div>
      {row.environment === "test" && <p className="subscription-checkout__hint">Suscripción de prueba.</p>}
      <PaymentForm id={id} token={token} />
      <p className="subscription-checkout__footer">En el siguiente paso elegís tu medio de pago y autorizás el cobro mensual en Mercado Pago. Ingresar tu correo aquí no autoriza ningún débito.</p>
    </>}
  </section></main>;
}
