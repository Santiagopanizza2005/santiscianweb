"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState, useSyncExternalStore } from "react";
import type { Language } from "./language-switcher";
import { SiteHeader } from "./site-header";
import { SiteFooter } from "./site-footer";
import { getContactMethod, validateContact, type ContactError } from "../../lib/contact-validation";
import { contactServices, isContactService } from "../../lib/contact-services";
import { ContactSelect } from "./contact-select";

const subscribe = () => () => {};
const getServerLanguage = (): Language => "es";
const fieldNames = ["name", "company", "service", "budget", "contact", "message"] as const;
type FieldName = typeof fieldNames[number];
type FieldError = ContactError;

function validateField(field: FieldName, value: string): FieldError | undefined {
  if (!value.trim()) return "required";
  if (field === "service" && !isContactService(value)) return "required";
  if (field === "contact") return validateContact(value);
}

function getPreferredLanguage(): Language {
  const locale = navigator.languages?.[0] || navigator.language;
  return locale.toLowerCase().startsWith("es") ? "es" : "en";
}

const copy = {
  es: {
    back: "Volver",
    eyebrow: "Contacto",
    title: "Contame sobre tu proyecto.",
    description: "Completá estos datos y vemos cómo puedo ayudarte.",
    name: "Tu nombre",
    company: "Nombre de tu empresa",
    service: "¿Qué servicio necesitás?",
    budget: "¿Cuál es tu presupuesto estimado?",
    budgetOptions: [
      { value: "1000-2500", label: "De 1.000 a 2.500" },
      { value: "2500-4000", label: "De 2.500 a 4.000" },
      { value: "4000-6000", label: "De 4.000 a 6.000" },
      { value: "6000-10000", label: "De 6.000 a 10.000" },
      { value: "10000-20000", label: "De 10.000 a 20.000" },
      { value: "20000+", label: "Más de 20.000" },
    ],
    contact: "Email o número",
    contactHint: "nombre@empresa.com o +54 9 11 1234 5678",
    message: "Contame brevemente qué necesitás",
    submit: "Enviar consulta",
    cancel: "Cancelar",
    required: "Todos los campos son obligatorios.",
    success: "¡Gracias! Recibí tu consulta y te voy a responder pronto.",
    error: "No pudimos enviar la consulta. Probá nuevamente.",
    missing: {
      name: "Falta tu nombre",
      company: "Falta tu empresa",
      service: "Seleccioná un servicio",
      budget: "Seleccioná un presupuesto",
      contact: "Falta tu email o número",
      message: "Contanos qué necesitás",
    },
    invalidEmail: "Ingresá un email válido",
    invalidPhone: "Número inválido: incluí país y código de área",
    missingAreaCode: "Incluí país y área. Ej.: +54 9 11 1234 5678",
  },
  en: {
    back: "Back",
    eyebrow: "Contact",
    title: "Tell me about your project.",
    description: "Fill in these details and we can see how I can help.",
    name: "Your name",
    company: "Your company name",
    service: "Which service do you need?",
    budget: "What is your estimated budget?",
    budgetOptions: [
      { value: "1000-2500", label: "1,000 to 2,500" },
      { value: "2500-4000", label: "2,500 to 4,000" },
      { value: "4000-6000", label: "4,000 to 6,000" },
      { value: "6000-10000", label: "6,000 to 10,000" },
      { value: "10000-20000", label: "10,000 to 20,000" },
      { value: "20000+", label: "More than 20,000" },
    ],
    contact: "Email or phone number",
    contactHint: "name@company.com or +1 212 555 0123",
    message: "Briefly tell me what you need",
    submit: "Send enquiry",
    cancel: "Cancel",
    required: "All fields are required.",
    success: "Thank you! I received your enquiry and will get back to you soon.",
    error: "We could not send your enquiry. Please try again.",
    missing: {
      name: "Enter your name",
      company: "Enter your company",
      service: "Select a service",
      budget: "Select a budget",
      contact: "Enter your email or phone number",
      message: "Tell us what you need",
    },
    invalidEmail: "Enter a valid email",
    invalidPhone: "Invalid number: include country and area code",
    missingAreaCode: "Include country and area code. E.g. +1 212 555 0123",
  },
} as const;

export function ContactForm() {
  const searchParams = useSearchParams();
  const serviceParam = searchParams.get("service");
  const initialService = isContactService(serviceParam) ? serviceParam : "";
  const browserLanguage = useSyncExternalStore<Language>(
    subscribe,
    getPreferredLanguage,
    getServerLanguage,
  );
  const languageParam = searchParams.get("lang");
  const languageFromUrl: Language | null = languageParam === "en" || languageParam === "es"
    ? languageParam
    : null;
  const [selectedLanguage, setSelectedLanguage] = useState<Language | null>(null);
  const language = selectedLanguage ?? languageFromUrl ?? browserLanguage;
  const [contactValue, setContactValue] = useState("");
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [feedback, setFeedback] = useState("");
  const [errors, setErrors] = useState<Partial<Record<FieldName, FieldError>>>({});
  const [submitAttempt, setSubmitAttempt] = useState(0);
  const [serviceSelection, setServiceSelection] = useState({ source: initialService, value: initialService });
  const serviceValue = serviceSelection.source === initialService ? serviceSelection.value : initialService;
  const [budgetValue, setBudgetValue] = useState("");
  const text = copy[language];
  const contactMethod = getContactMethod(contactValue);

  function errorMessage(field: FieldName) {
    if (!errors[field]) return undefined;
    return errors[field] === "email" ? text.invalidEmail
      : errors[field] === "phone" ? text.invalidPhone
      : errors[field] === "areaCode" ? text.missingAreaCode
      : text.missing[field];
  }

  function fieldError(field: FieldName) {
    const message = errorMessage(field);
    return message ? <span aria-live="polite" className="contact-floating-label contact-field-error" id={`${field}-error`}>{message}</span> : null;
  }

  function selectValue(field: "service" | "budget", value: string) {
    if (field === "service") setServiceSelection({ source: initialService, value });
    else setBudgetValue(value);
    setErrors((current) => ({ ...current, [field]: validateField(field, value) }));
  }

  function handleChange(event: React.FormEvent<HTMLFormElement>) {
    const control = event.target;
    if (!(control instanceof HTMLInputElement || control instanceof HTMLSelectElement || control instanceof HTMLTextAreaElement)) return;
    const field = control.name as FieldName;
    if (!fieldNames.includes(field) || !errors[field]) return;
    const error = validateField(field, control.value);
    setErrors((current) => ({ ...current, [field]: error }));
  }

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  useEffect(() => {
    if (!contactValue.trim()) return;
    const timeout = setTimeout(() => {
      const error = validateField("contact", contactValue);
      setErrors((current) => ({ ...current, contact: error }));
    }, 700);
    return () => clearTimeout(timeout);
  }, [contactValue]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (status === "submitting") return;
    const form = event.currentTarget;
    const formData = new FormData(form);
    const nextErrors: Partial<Record<FieldName, FieldError>> = {};
    fieldNames.forEach((field) => {
      const error = validateField(field, String(formData.get(field) ?? ""));
      if (error) nextErrors[field] = error;
    });
    setErrors(nextErrors);
    setFeedback("");
    if (Object.keys(nextErrors).length) {
      setStatus("idle");
      setSubmitAttempt((attempt) => attempt + 1);
      const firstInvalid = fieldNames.find((field) => nextErrors[field]);
      const customControl = form.querySelector<HTMLButtonElement>(`[data-field="${firstInvalid}"]`);
      const control = form.elements.namedItem(firstInvalid!);
      if (customControl) customControl.focus();
      else if (control instanceof HTMLElement) control.focus();
      return;
    }
    setFeedback("");
    setStatus("submitting");

    try {
      const response = await fetch("/api/contact", {
        body: JSON.stringify({
          company: formData.get("company"),
          service: formData.get("service"),
          budget: formData.get("budget"),
          contact: formData.get("contact"),
          contactMethod,
          message: formData.get("message"),
          name: formData.get("name"),
          website: formData.get("website"),
        }),
        headers: { "Content-Type": "application/json" },
        method: "POST",
      });
      const data = (await response.json()) as { error?: string; ok?: boolean };

      if (!response.ok || !data.ok) {
        throw new Error(data.error || text.error);
      }

      form.reset();
      setServiceSelection({ source: initialService, value: initialService });
      setBudgetValue("");
      setContactValue("");
      setStatus("success");
      setFeedback(text.success);
    } catch (error) {
      setStatus("error");
      setFeedback(error instanceof Error ? error.message : text.error);
    }
  }

  return (
    <>
    <main className="contact-page">
      <SiteHeader language={language} onToggle={() => setSelectedLanguage(language === "es" ? "en" : "es")} />

      <section className="contact-form-wrap" aria-labelledby="contact-title">
        <h1 id="contact-title">{text.title}</h1>
        <p className="contact-description">{text.description}</p>

        <form className={`contact-form contact-form--attempt-${submitAttempt % 2}`} noValidate onChange={handleChange} onSubmit={handleSubmit}>
          <label className="contact-floating-field">
            <div className="contact-field-control">
              {errors.name ? fieldError("name") : <span className="contact-floating-label">{text.name}</span>}
            <input aria-label={text.name} aria-invalid={!!errors.name} aria-describedby={errors.name ? "name-error" : undefined} autoComplete="name" maxLength={120} name="name" placeholder=" " required type="text" />
            </div>
          </label>

          <label className="contact-floating-field">
            <div className="contact-field-control">
              {errors.company ? fieldError("company") : <span className="contact-floating-label">{text.company}</span>}
            <input aria-label={text.company} aria-invalid={!!errors.company} aria-describedby={errors.company ? "company-error" : undefined} autoComplete="organization" maxLength={160} name="company" placeholder=" " required type="text" />
            </div>
          </label>

          <ContactSelect name="service" label={text.service} options={contactServices.map((service) => ({ value: service.value, label: service[language] }))} value={serviceValue} onChange={(value) => selectValue("service", value)} error={errorMessage("service")} />

          <ContactSelect name="budget" label={text.budget} options={text.budgetOptions} value={budgetValue} onChange={(value) => selectValue("budget", value)} error={errorMessage("budget")} />

          <label className="contact-floating-field">
            <div className="contact-field-control">
              {errors.contact ? fieldError("contact") : <span className="contact-floating-label">{text.contact}</span>}
            <input
              aria-label={text.contact}
              aria-invalid={!!errors.contact}
              aria-describedby={errors.contact ? "contact-error" : undefined}
              autoCapitalize="none"
              autoCorrect="off"
              name="contact"
              value={contactValue}
              onChange={(event) => setContactValue(event.currentTarget.value)}
              onBlur={(event) => {
                const error = validateField("contact", event.currentTarget.value);
                setErrors((current) => ({ ...current, contact: error }));
              }}
              maxLength={160}
              placeholder=" "
              required
              type="text"
            />
            </div>
          </label>

          <label className="contact-floating-field">
            <div className="contact-field-control">
              {errors.message ? fieldError("message") : <span className="contact-floating-label">{text.message}</span>}
            <textarea aria-label={text.message} aria-invalid={!!errors.message} aria-describedby={errors.message ? "message-error" : undefined} maxLength={2960} name="message" placeholder=" " required rows={5} />
            </div>
          </label>

          <label aria-hidden="true" className="contact-honeypot">
            <span>Website</span>
            <input autoComplete="off" name="website" tabIndex={-1} type="text" />
          </label>

          <div className="contact-form-actions">
            <Link className="secondary-cta contact-cancel" href={`/?lang=${language}`}>
              {text.cancel}
            </Link>
            <button aria-busy={status === "submitting"} className="primary-cta" type="submit">
              {status === "submitting" ? "…" : text.submit}
            </button>
          </div>

          {feedback && (
            <p aria-live="polite" className={`contact-feedback contact-feedback--${status}`}>
              {feedback}
            </p>
          )}
        </form>
      </section>
    </main>
    <SiteFooter language={language} />
    </>
  );
}
