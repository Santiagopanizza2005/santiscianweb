"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState, useSyncExternalStore } from "react";
import { testimonialFields, validateTestimonialField, type TestimonialField, type TestimonialError } from "../../lib/testimonial-validation";
import type { Language } from "./language-switcher";
import { SiteHeader } from "./site-header";
import { SiteFooter } from "./site-footer";

const subscribe = () => () => {};
const getServerLanguage = (): Language => "es";
const getBrowserLanguage = (): Language => (navigator.languages?.[0] || navigator.language).toLowerCase().startsWith("es") ? "es" : "en";
const copy = {
  es: {
    title: "Testimoneo",
    description: "Contame cómo fue tu experiencia trabajando conmigo.",
    name: "Nombre y apellido", email: "Correo electrónico", rating: "¿Cómo calificarías tu experiencia?", detail: "Descripción de tu experiencia",
    stars: "estrellas", star: "estrella", select: "Seleccioná de 1 a 5 estrellas", cancel: "Cancelar", submit: "Enviar testimonio",
    success: "¡Gracias por compartir tu experiencia! Recibí tu testimonio.", error: "No pudimos enviar tu testimonio. Probá nuevamente.", invalidEmail: "Ingresá un correo electrónico válido", length: "El texto es demasiado largo",
    missing: { name: "Falta tu nombre y apellido", email: "Falta tu correo electrónico", rating: "Seleccioná de 1 a 5 estrellas", description: "Contame tu experiencia" },
  },
  en: {
    title: "Testimonial",
    description: "Tell me about your experience working with me.",
    name: "Full name", email: "Email address", rating: "How would you rate your experience?", detail: "Describe your experience",
    stars: "stars", star: "star", select: "Select 1 to 5 stars", cancel: "Cancel", submit: "Send testimonial",
    success: "Thank you for sharing your experience! I received your testimonial.", error: "We could not send your testimonial. Please try again.", invalidEmail: "Enter a valid email address", length: "The text is too long",
    missing: { name: "Enter your full name", email: "Enter your email address", rating: "Select 1 to 5 stars", description: "Describe your experience" },
  },
} as const;

export function TestimonialForm() {
  const searchParams = useSearchParams();
  const browserLanguage = useSyncExternalStore(subscribe, getBrowserLanguage, getServerLanguage);
  const langParam = searchParams.get("lang");
  const [selectedLanguage, setSelectedLanguage] = useState<Language | null>(null);
  const language = selectedLanguage ?? (langParam === "en" || langParam === "es" ? langParam : browserLanguage);
  const text = copy[language];
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [errors, setErrors] = useState<Partial<Record<TestimonialField, TestimonialError>>>({});
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [submitAttempt, setSubmitAttempt] = useState(0);

  useEffect(() => { document.documentElement.lang = language; }, [language]);

  function errorMessage(field: TestimonialField) {
    return errors[field] === "email" ? text.invalidEmail : errors[field] === "length" ? text.length : text.missing[field];
  }

  function handleChange(event: React.FormEvent<HTMLFormElement>) {
    const control = event.target;
    if (!(control instanceof HTMLInputElement || control instanceof HTMLTextAreaElement)) return;
    const field = control.name as TestimonialField;
    if (!testimonialFields.includes(field) || !errors[field]) return;
    setErrors((current) => ({ ...current, [field]: validateTestimonialField(field, field === "rating" ? Number(control.value) : control.value) }));
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (status === "submitting") return;
    const form = event.currentTarget;
    const formData = new FormData(form);
    const payload = {
      name: formData.get("name"), email: formData.get("email"), rating,
      description: formData.get("description"), website: formData.get("website"),
    };
    const nextErrors: Partial<Record<TestimonialField, TestimonialError>> = {};
    for (const field of testimonialFields) {
      const error = validateTestimonialField(field, payload[field]);
      if (error) nextErrors[field] = error;
    }
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) {
      setStatus("idle");
      setSubmitAttempt((attempt) => attempt + 1);
      const field = testimonialFields.find((item) => nextErrors[item]);
      form.querySelector<HTMLElement>(`[name="${field}"]`)?.focus();
      return;
    }
    setStatus("submitting");
    try {
      const response = await fetch("/api/testimonials", {
        method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload),
      });
      const result = await response.json();
      if (!response.ok || !result.ok) throw new Error("Submission failed");
      form.reset();
      setRating(0);
      setHoverRating(0);
      setStatus("success");
    } catch {
      setStatus("error");
    }
  }

  function inputField(field: "name" | "email" | "description", label: string) {
    const attributes = {
      "aria-label": label, "aria-invalid": !!errors[field], "aria-describedby": errors[field] ? `testimonial-${field}-error` : undefined,
      name: field, placeholder: " ", required: true, maxLength: field === "name" ? 120 : field === "email" ? 160 : 2960,
    };
    return (
      <label className="contact-floating-field">
        <div className="contact-field-control">
          {errors[field]
            ? <span aria-live="polite" className="contact-floating-label contact-field-error" id={`testimonial-${field}-error`}>{errorMessage(field)}</span>
            : <span className="contact-floating-label">{label}</span>}
          {field === "description" ? <textarea {...attributes} rows={5} />
            : <input {...attributes} autoComplete={field} type={field === "email" ? "email" : "text"} autoCapitalize={field === "email" ? "none" : "words"} />}
        </div>
      </label>
    );
  }

  return (
    <>
      <main className="contact-page">
        <SiteHeader language={language} onToggle={() => setSelectedLanguage(language === "es" ? "en" : "es")} />
        <section className="contact-form-wrap" aria-labelledby="testimonial-title">
          <h1 id="testimonial-title">{text.title}</h1>
          <p className="contact-description">{text.description}</p>
          <form className={`contact-form contact-form--attempt-${submitAttempt % 2}`} noValidate onChange={handleChange} onSubmit={handleSubmit}>
            {inputField("name", text.name)}
            {inputField("email", text.email)}
            <fieldset className="testimonial-rating" data-invalid={!!errors.rating} aria-describedby={errors.rating ? "testimonial-rating-error" : "testimonial-rating-hint"}>
              <legend>{text.rating}</legend>
              <div className="testimonial-rating__stars" onMouseLeave={() => setHoverRating(0)}>
                {[1, 2, 3, 4, 5].map((value) => (
                  <label key={value} className="testimonial-rating__option" onMouseEnter={() => setHoverRating(value)}>
                    <input aria-label={`${value} ${value === 1 ? text.star : text.stars}`} checked={rating === value} name="rating" onChange={() => setRating(value)} required type="radio" value={value} />
                    <span aria-hidden="true" className={(hoverRating || rating) >= value ? "testimonial-rating__star is-active" : "testimonial-rating__star"}>★</span>
                  </label>
                ))}
              </div>
              {errors.rating
                ? <span className="contact-field-error" id="testimonial-rating-error" aria-live="polite">{errorMessage("rating")}</span>
                : <span className="testimonial-rating__hint" id="testimonial-rating-hint" aria-live="polite">{rating ? `${rating} / 5` : text.select}</span>}
            </fieldset>
            {inputField("description", text.detail)}
            <label aria-hidden="true" className="contact-honeypot"><span>Website</span><input autoComplete="off" name="website" tabIndex={-1} type="text" /></label>
            <div className="contact-form-actions">
              <Link className="secondary-cta contact-cancel" href={`/?lang=${language}`}>{text.cancel}</Link>
              <button aria-busy={status === "submitting"} className="primary-cta" disabled={status === "submitting"} type="submit">{status === "submitting" ? "…" : text.submit}</button>
            </div>
            {(status === "success" || status === "error") && <p aria-live="polite" className={`contact-feedback contact-feedback--${status}`}>{status === "success" ? text.success : text.error}</p>}
          </form>
        </section>
      </main>
      <SiteFooter language={language} />
    </>
  );
}
