"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import type { Language } from "./language-switcher";

const content = {
  es: {
    heading: "Servicios",
    price: "Precio",
    custom: "Cotización a medida",
    includes: "Todo lo que incluye",
    cta: "Consultar disponibilidad",
    support: "1 mes de soporte gratis",
    services: [
      {
        value: "ai-agents",
        title: "Agentes de IA",
        subtitle: "Automatizá tareas y atendé a tus clientes con un agente hecho para tu empresa.",
        features: ["Análisis de tus necesidades", "Diseño y desarrollo del agente", "Integración con tus herramientas", "Pruebas y ajustes", "Implementación y puesta en marcha", "Documentación y acompañamiento"],
      },
      {
        value: "web-native-apps",
        title: "Apps Web y Nativas",
        subtitle: "Convertí tu idea en una app para la web o el celular, diseñada a medida.",
        features: ["Análisis y definición del proyecto", "Diseño de la interfaz y experiencia", "Desarrollo a medida", "Integraciones y base de datos", "Pruebas y control de calidad", "Implementación y lanzamiento"],
      },
    ],
  },
  en: {
    heading: "Services",
    price: "Price",
    custom: "Tailored quote",
    includes: "Everything included",
    cta: "Check availability",
    support: "1 month of free support",
    services: [
      {
        value: "ai-agents",
        title: "AI Agents",
        subtitle: "Automate tasks and support your customers with an agent built for your business.",
        features: ["Analysis of your needs", "Agent design and development", "Integration with your tools", "Testing and refinements", "Implementation and launch", "Documentation and guidance"],
      },
      {
        value: "web-native-apps",
        title: "Web & Native Apps",
        subtitle: "Turn your idea into a web or mobile app, designed around your needs.",
        features: ["Project analysis and planning", "Interface and experience design", "Custom development", "Integrations and database", "Testing and quality assurance", "Implementation and launch"],
      },
    ],
  },
};

export function Services({ language }: { language: Language }) {
  const text = content[language];
  const sectionRef = useRef<HTMLElement>(null);
  const frameRef = useRef<HTMLSpanElement>(null);
  const activeCardRef = useRef<HTMLElement | null>(null);

  const moveFrame = (card: HTMLElement) => {
    const frame = frameRef.current;
    if (!frame) return;
    activeCardRef.current = card;
    frame.style.transform = `translate(${card.offsetLeft - 8}px, ${card.offsetTop - 8}px)`;
    frame.style.width = `${card.offsetWidth + 16}px`;
    frame.style.height = `${card.offsetHeight + 16}px`;
    frame.dataset.visible = "true";
  };

  useEffect(() => {
    const grid = frameRef.current?.parentElement;
    if (!grid) return;
    const observer = new ResizeObserver(() => {
      if (activeCardRef.current) moveFrame(activeCardRef.current);
    });
    observer.observe(grid);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches || !("IntersectionObserver" in window)) return;
    const elements = sectionRef.current?.querySelectorAll<HTMLElement>("h2, .service-card");
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        (entry.target as HTMLElement).dataset.serviceReveal = "visible";
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.12 });
    elements?.forEach((element) => {
      element.dataset.serviceReveal = "pending";
      observer.observe(element);
    });
    return () => {
      observer.disconnect();
      elements?.forEach((element) => { delete element.dataset.serviceReveal; });
    };
  }, [language]);

  return (
    <section className="services" aria-labelledby="services-title" id="servicios" ref={sectionRef}>
      <h2 id="services-title">{text.heading}</h2>
      <div className="services__grid" onPointerLeave={() => {
        activeCardRef.current = null;
        if (frameRef.current) frameRef.current.dataset.visible = "false";
      }} onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) {
          activeCardRef.current = null;
          if (frameRef.current) frameRef.current.dataset.visible = "false";
        }
      }}>
        {text.services.map((service) => (
          <article className="service-card" key={service.title} onPointerEnter={(event) => {
            if (event.pointerType === "mouse") moveFrame(event.currentTarget);
          }} onFocus={(event) => moveFrame(event.currentTarget)}>
            <h3>{service.title}</h3>
            <p className="service-card__subtitle">{service.subtitle}</p>
            <div className="service-card__price">
              <span>{text.price}</span>
              <p>{text.custom}</p>
            </div>
            <hr />
            <h4>{text.includes}</h4>
            <ul>
              {[...service.features, text.support].map((feature) => (
                <li key={feature}><span aria-hidden="true">✓</span>{feature}</li>
              ))}
            </ul>
            <Link className="primary-cta service-card__cta" href={`/contact?lang=${language}&service=${service.value}`}>{text.cta}</Link>
          </article>
        ))}
        <span className="service-card__frame" aria-hidden="true" ref={frameRef}>
          <span /><span /><span /><span />
        </span>
      </div>
    </section>
  );
}
