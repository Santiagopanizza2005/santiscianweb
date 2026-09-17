import Link from "next/link";

type AdminNavigationProps = {
  active: "home" | "leads";
};

export function AdminNavigation({ active }: AdminNavigationProps) {
  return (
    <aside className="admin-sidebar">
      <p className="admin-sidebar__brand">Santiago Scian</p>
      <nav aria-label="Navegación del panel" className="admin-sidebar__nav">
        <Link
          className={`admin-sidebar__link${active === "home" ? " admin-sidebar__link--active" : ""}`}
          href="/admin"
        >
          Inicio
        </Link>
        <Link
          className={`admin-sidebar__link${active === "leads" ? " admin-sidebar__link--active" : ""}`}
          href="/admin/leads"
        >
          Leads
        </Link>
      </nav>
    </aside>
  );
}
