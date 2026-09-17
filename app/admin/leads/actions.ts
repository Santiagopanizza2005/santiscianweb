"use server";

import { revalidatePath } from "next/cache";
import { hasAdminSession } from "../../../lib/admin-auth";
import { getSupabaseAdminClient } from "../../../lib/supabase-admin";

const LEAD_STATUSES = ["new", "contacted", "qualified", "won", "discarded"] as const;
const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export async function updateLeadStatus(formData: FormData) {
  if (!(await hasAdminSession())) {
    throw new Error("No autorizado.");
  }

  const leadId = formData.get("leadId");
  const status = formData.get("status");

  if (
    typeof leadId !== "string" ||
    !UUID_PATTERN.test(leadId) ||
    typeof status !== "string" ||
    !LEAD_STATUSES.includes(status as (typeof LEAD_STATUSES)[number])
  ) {
    throw new Error("Clasificación inválida.");
  }

  const { error } = await getSupabaseAdminClient()
    .from("contact_requests")
    .update({ status })
    .eq("id", leadId);

  if (error) {
    console.error("Unable to update lead status", error);
    throw new Error("No se pudo actualizar el lead.");
  }

  revalidatePath("/admin/leads");
}
