import { createClient } from "@supabase/supabase-js";
import { testimonialFields, validateTestimonialField } from "../../../lib/testimonial-validation";

export const runtime = "nodejs";

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Datos inválidos." }, { status: 400 });
  }
  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return Response.json({ error: "Datos inválidos." }, { status: 400 });
  }
  const data = body as Record<string, unknown>;
  if (data.website) return Response.json({ ok: true });
  if (testimonialFields.some((field) => validateTestimonialField(field, data[field]))) {
    return Response.json({ error: "Completá los campos con un email válido y entre 1 y 5 estrellas." }, { status: 400 });
  }

  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SECRET_KEY;
  if (!url || !key) {
    return Response.json({ error: "El envío de testimonios todavía no está configurado." }, { status: 503 });
  }
  try {
    const supabase = createClient(url, key, { auth: { autoRefreshToken: false, persistSession: false } });
    const { error } = await supabase.from("testimonial_requests").insert({
      name: (data.name as string).trim(),
      email: (data.email as string).trim(),
      rating: data.rating,
      description: (data.description as string).trim(),
    });
    if (error) {
      console.error("Unable to save testimonial", error.code);
      return Response.json({ error: "No pudimos enviar tu testimonio. Probá nuevamente." }, { status: 500 });
    }
    return Response.json({ ok: true }, { status: 201 });
  } catch {
    return Response.json({ error: "No pudimos enviar tu testimonio. Probá nuevamente." }, { status: 500 });
  }
}
