import Link from "next/link";
export default function SubscriptionReturnPage() {
  return <main style={{ minHeight: "100svh", display: "grid", placeItems: "center", background: "#fff", padding: 24 }}>
    <section style={{ maxWidth: 520, textAlign: "center", color: "#171717" }}>
      <p style={{ color: "#0071e3", fontSize: 13 }}>Santiago Scian · Mantenimiento</p>
      <h1 style={{ fontSize: 36, lineHeight: 1.15, fontWeight: 500, letterSpacing: "-.04em" }}>Gracias por gestionar tu suscripción.</h1>
      <p style={{ color: "#6e6e73", lineHeight: 1.7, margin: "24px 0" }}>Mercado Pago nos informará el estado de tu autorización y de cada cobro. Volver a esta página no confirma por sí solo que el pago esté aprobado.</p>
      <p style={{ color: "#6e6e73", lineHeight: 1.7 }}>Podés consultar los detalles de tu suscripción desde tu cuenta de Mercado Pago.</p>
      <Link href="/" style={{ display: "inline-block", background: "#0071e3", color: "#fff", padding: "14px 24px", borderRadius: 999, marginTop: 20, textDecoration: "none" }}>Volver al inicio</Link>
    </section>
  </main>;
}
