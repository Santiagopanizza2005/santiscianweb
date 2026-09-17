"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState, useSyncExternalStore } from "react";
import { LanguageSwitcher, type Language } from "./language-switcher";

const subscribe = () => () => {};
const getServerLanguage = (): Language => "es";

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
    budget: "¿Cuál es tu presupuesto estimado?",
    budgetPlaceholder: "Seleccioná una opción",
    budgetOptions: [
      { value: "1000-2500", label: "De 1.000 a 2.500" },
      { value: "2500-4000", label: "De 2.500 a 4.000" },
      { value: "4000-6000", label: "De 4.000 a 6.000" },
      { value: "6000-10000", label: "De 6.000 a 10.000" },
      { value: "10000-20000", label: "De 10.000 a 20.000" },
      { value: "20000+", label: "Más de 20.000" },
    ],
    method: "¿Cómo preferís que te contacte?",
    whatsapp: "WhatsApp",
    email: "Email",
    contact: "Tu WhatsApp",
    contactHint: "Incluí el código de área. Ej.: +54 9 11 1234 5678",
    message: "Contame brevemente qué necesitás",
    submit: "Enviar consulta",
    required: "Todos los campos son obligatorios.",
    success: "¡Gracias! Recibí tu consulta y te voy a responder pronto.",
    error: "No pudimos enviar la consulta. Probá nuevamente.",
  },
  en: {
    back: "Back",
    eyebrow: "Contact",
    title: "Tell me about your project.",
    description: "Fill in these details and we can see how I can help.",
    name: "Your name",
    company: "Your company name",
    budget: "What is your estimated budget?",
    budgetPlaceholder: "Select an option",
    budgetOptions: [
      { value: "1000-2500", label: "1,000 to 2,500" },
      { value: "2500-4000", label: "2,500 to 4,000" },
      { value: "4000-6000", label: "4,000 to 6,000" },
      { value: "6000-10000", label: "6,000 to 10,000" },
      { value: "10000-20000", label: "10,000 to 20,000" },
      { value: "20000+", label: "More than 20,000" },
    ],
    method: "How would you prefer I contact you?",
    whatsapp: "WhatsApp",
    email: "Email",
    contact: "Your WhatsApp",
    contactHint: "Include your area code. E.g. +1 212 555 0123",
    message: "Briefly tell me what you need",
    submit: "Send enquiry",
    required: "All fields are required.",
    success: "Thank you! I received your enquiry and will get back to you soon.",
    error: "We could not send your enquiry. Please try again.",
  },
} as const;

export function ContactForm() {
  const searchParams = useSearchParams();
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
  const [contactMethod, setContactMethod] = useState<"whatsapp" | "email">("whatsapp");
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [feedback, setFeedback] = useState("");
  const text = copy[language];
  const isWhatsapp = contactMethod === "whatsapp";

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;

    if (!form.reportValidity() || !contactMethod) {
      setStatus("error");
      setFeedback(text.required);
      return;
    }

    const formData = new FormData(form);
    setFeedback("");
    setStatus("submitting");

    try {
      const response = await fetch("/api/contact", {
        body: JSON.stringify({
          company: formData.get("company"),
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
      setContactMethod("whatsapp");
      setStatus("success");
      setFeedback(text.success);
    } catch (error) {
      setStatus("error");
      setFeedback(error instanceof Error ? error.message : text.error);
    }
  }

  return (
    <main className="contact-page">
      <header className="contact-header">
        <Link className="back-link" href={`/?lang=${language}`}>← {text.back}</Link>
        <LanguageSwitcher
          language={language}
          onToggle={() => setSelectedLanguage(language === "es" ? "en" : "es")}
        />
      </header>

      <section className="contact-form-wrap" aria-labelledby="contact-title">
        <h1 id="contact-title">{text.title}</h1>
        <p className="contact-description">{text.description}</p>

        <form className="contact-form" onSubmit={handleSubmit}>
          <label>
            <span>{text.name}</span>
            <input autoComplete="name" name="name" required type="text" />
          </label>

          <label>
            <span>{text.company}</span>
            <input autoComplete="organization" name="company" required type="text" />
          </label>

          <label>
            <span>{text.budget}</span>
            <select defaultValue="" name="budget" required>
              <option disabled value="">{text.budgetPlaceholder}</option>
              {text.budgetOptions.map((option) => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
          </label>

          <fieldset>
            <legend>{text.method}</legend>
            <div className="contact-methods">
              <label>
                <input
                  checked={contactMethod === "whatsapp"}
                  name="contact-method"
                  onChange={() => setContactMethod("whatsapp")}
                  required
                  type="radio"
                  value="whatsapp"
                />
                <span>{text.whatsapp}</span>
              </label>
              <label>
                <input
                  checked={contactMethod === "email"}
                  name="contact-method"
                  onChange={() => setContactMethod("email")}
                  required
                  type="radio"
                  value="email"
                />
                <span>{text.email}</span>
              </label>
            </div>
          </fieldset>

          {contactMethod && (
            <label>
              <span>{isWhatsapp ? text.contact : text.email}</span>
              <input
                autoComplete={isWhatsapp ? "tel" : "email"}
                inputMode={isWhatsapp ? "tel" : "email"}
                name="contact"
                placeholder={isWhatsapp ? text.contactHint : "nombre@empresa.com"}
                required
                type={isWhatsapp ? "tel" : "email"}
              />
            </label>
          )}

          <label>
            <span>{text.message}</span>
            <textarea name="message" required rows={5} />
          </label>

          <label aria-hidden="true" className="contact-honeypot">
            <span>Website</span>
            <input autoComplete="off" name="website" tabIndex={-1} type="text" />
          </label>

          <button className="primary-cta" disabled={status === "submitting"} type="submit">
            {status === "submitting" ? "…" : text.submit}
          </button>

          {feedback && (
            <p aria-live="polite" className={`contact-feedback contact-feedback--${status}`}>
              {feedback}
            </p>
          )}
        </form>
      </section>
    </main>
  );
}
