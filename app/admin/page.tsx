import { AdminLoginForm } from "./admin-login-form";
import { AdminNavigation } from "./admin-navigation";
import { hasAdminSession } from "../../lib/admin-auth";

export default async function AdminPage() {
  const isAuthenticated = await hasAdminSession();

  if (isAuthenticated) {
    return (
      <main className="admin-dashboard" aria-label="Panel de administración">
        <AdminNavigation active="home" />
        <section className="admin-dashboard__content" aria-label="Contenido del panel" />
      </main>
    );
  }

  return (
    <main className="admin-page">
      <section className="admin-shell" aria-labelledby="admin-title">
        <p className="admin-eyebrow">Santiago Scian</p>
        <h1 id="admin-title">Administración</h1>
        <p className="admin-description">Ingresá la contraseña para continuar.</p>
        <AdminLoginForm />
      </section>
    </main>
  );
}
