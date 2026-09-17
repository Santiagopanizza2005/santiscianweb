import { redirect } from "next/navigation";
import { AdminNavigation } from "../admin-navigation";
import { updateLeadStatus } from "./actions";
import { hasAdminSession } from "../../../lib/admin-auth";
import { getSupabaseAdminClient } from "../../../lib/supabase-admin";

const statusLabels = {
  new: "Nuevo",
  contacted: "Contactado",
  qualified: "Calificado",
  won: "Ganado",
  discarded: "Descartado",
} as const;

const statusOptions = Object.entries(statusLabels) as Array<
  [keyof typeof statusLabels, string]
>;

type Lead = {
  budget: string;
  company: string;
  contact_method: "email" | "whatsapp";
  contact_value: string;
  created_at: string;
  id: string;
  message: string;
  name: string;
  status: keyof typeof statusLabels;
};

function formatDate(value: string) {
  return new Intl.DateTimeFormat("es-AR", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

export default async function LeadsPage() {
  if (!(await hasAdminSession())) {
    redirect("/admin");
  }

  const { data, error } = await getSupabaseAdminClient()
    .from("contact_requests")
    .select("id, name, company, budget, contact_method, contact_value, message, status, created_at")
    .order("created_at", { ascending: false });

  if (error) {
    return (
      <main className="admin-dashboard" aria-label="Panel de administración">
        <AdminNavigation active="leads" />
        <section className="admin-dashboard__content admin-leads" aria-labelledby="leads-title">
          <div className="admin-leads__heading">
            <div>
              <p className="admin-eyebrow">Solicitudes</p>
              <h1 id="leads-title">Leads</h1>
            </div>
          </div>
          <div className="admin-leads__setup-notice">
            <h2>Falta actualizar la tabla de solicitudes.</h2>
            <p>
              Ejecutá una vez el archivo <code>supabase/add_lead_budget.sql</code> en el SQL Editor de Supabase y recargá esta página.
            </p>
          </div>
        </section>
      </main>
    );
  }

  const leads = (data ?? []) as Lead[];

  return (
    <main className="admin-dashboard" aria-label="Panel de administración">
      <AdminNavigation active="leads" />
      <section className="admin-dashboard__content admin-leads" aria-labelledby="leads-title">
        <div className="admin-leads__heading">
          <div>
            <p className="admin-eyebrow">Solicitudes</p>
            <h1 id="leads-title">Leads</h1>
          </div>
          <p>{leads.length} {leads.length === 1 ? "lead" : "leads"}</p>
        </div>

        {leads.length === 0 ? (
          <p className="admin-leads__empty">Todavía no recibiste solicitudes.</p>
        ) : (
          <div className="admin-leads__table-wrap">
            <table className="admin-leads__table">
              <thead>
                <tr>
                  <th>Persona</th>
                  <th>Empresa</th>
                  <th>Contacto</th>
                  <th>Presupuesto</th>
                  <th>Consulta</th>
                  <th>Fecha</th>
                  <th>Clasificación</th>
                </tr>
              </thead>
              <tbody>
                {leads.map((lead) => (
                  <tr key={lead.id}>
                    <td>{lead.name}</td>
                    <td>{lead.company}</td>
                    <td>
                      <span className="admin-leads__contact-method">{lead.contact_method}</span>
                      <a href={lead.contact_method === "email" ? `mailto:${lead.contact_value}` : `https://wa.me/${lead.contact_value.replace(/\D/g, "")}`}>
                        {lead.contact_value}
                      </a>
                    </td>
                    <td>{lead.budget}</td>
                    <td className="admin-leads__message">{lead.message}</td>
                    <td>{formatDate(lead.created_at)}</td>
                    <td>
                      <form action={updateLeadStatus} className="admin-leads__status-form">
                        <input name="leadId" type="hidden" value={lead.id} />
                        <select defaultValue={lead.status} name="status">
                          {statusOptions.map(([value, label]) => (
                            <option key={value} value={value}>{label}</option>
                          ))}
                        </select>
                        <button type="submit">Guardar</button>
                      </form>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </main>
  );
}
