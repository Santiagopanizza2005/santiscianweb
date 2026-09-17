import { createClient } from "@supabase/supabase-js";

export const runtime = "nodejs";

const MAX_NAME_LENGTH = 120;
const MAX_COMPANY_LENGTH = 160;
const MAX_CONTACT_LENGTH = 160;
const MAX_MESSAGE_LENGTH = 2_960;

type ContactMethod = "email" | "whatsapp";

const BUDGETS = ["1000-2500", "2500-4000", "4000-6000", "6000-10000", "10000-20000", "20000+"] as const;
type Budget = (typeof BUDGETS)[number];

function isNonEmptyString(value: unknown, maxLength: number): value is string {
  return typeof value === "string" && value.trim().length > 0 && value.trim().length <= maxLength;
}

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function isContactMethod(value: unknown): value is ContactMethod {
  return value === "email" || value === "whatsapp";
}

function isBudget(value: unknown): value is Budget {
  return typeof value === "string" && BUDGETS.includes(value as Budget);
}

export async function POST(request: Request) {
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseSecretKey = process.env.SUPABASE_SECRET_KEY;

  if (!supabaseUrl || !supabaseSecretKey) {
    return Response.json(
      { error: "La integración de contactos todavía no está configurada." },
      { status: 503 },
    );
  }

  let body: Record<string, unknown>;

  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Datos inválidos." }, { status: 400 });
  }

  const { name, company, budget, contactMethod, contact, message, website } = body;

  if (website) {
    return Response.json({ ok: true });
  }

  if (
    !isNonEmptyString(name, MAX_NAME_LENGTH) ||
    !isNonEmptyString(company, MAX_COMPANY_LENGTH) ||
    !isBudget(budget) ||
    !isContactMethod(contactMethod) ||
    !isNonEmptyString(contact, MAX_CONTACT_LENGTH) ||
    !isNonEmptyString(message, MAX_MESSAGE_LENGTH)
  ) {
    return Response.json({ error: "Completá todos los campos correctamente." }, { status: 400 });
  }

  const trimmedContact = contact.trim();

  if (contactMethod === "email" && !isValidEmail(trimmedContact)) {
    return Response.json({ error: "Ingresá un email válido." }, { status: 400 });
  }

  const supabase = createClient(supabaseUrl, supabaseSecretKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });

  const { error } = await supabase.from("contact_requests").insert({
    budget,
    company: company.trim(),
    contact_method: contactMethod,
    contact_value: trimmedContact,
    message: message.trim(),
    name: name.trim(),
  });

  if (error) {
    console.error("Unable to save contact request", error);
    return Response.json(
      { error: "No pudimos enviar tu consulta. Probá nuevamente." },
      { status: 500 },
    );
  }

  return Response.json({ ok: true }, { status: 201 });
}
