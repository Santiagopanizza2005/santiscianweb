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
    services: [
      {
        value: "agent-discovery",
        title: "Diagnóstico de IA",
        subtitle: "Para empresas que quieren implementar agentes de IA, pero todavía no saben dónde. Analizamos procesos, detectamos oportunidades y definimos qué agente conviene construir.",
        features: ["Análisis de tus procesos", "Identificación de oportunidades", "Evaluación de viabilidad y límites", "Priorización de casos de uso", "Definición del agente y su alcance", "Hoja de ruta para su desarrollo"],
      },
      {
        value: "agent-build",
        title: "Desarrollo de agentes",
        subtitle: "Incluye el diagnóstico de IA completo, además del diseño, desarrollo e integración del agente en tus sistemas.",
        features: ["Todo lo incluido en Diagnóstico de IA", "Diseño del agente y sus flujos", "Desarrollo a medida", "Integración con tus sistemas", "Pruebas y ajustes", "Implementación y puesta en marcha", "Documentación y transferencia al equipo"],
      },
    ],
  },
  en: {
    heading: "Services",
    price: "Price",
    custom: "Tailored quote",
    includes: "Everything included",
    cta: "Check availability",
    services: [
      {
        value: "agent-discovery",
        title: "Agent Discovery",
        subtitle: "For companies that want to implement AI agents but aren't sure where to start. We analyze processes, identify opportunities and define which agent makes sense to build.",
        features: ["Process analysis", "Opportunity identification", "Feasibility and limitations assessment", "Use case prioritization", "Agent definition and scope", "Development roadmap"],
      },
      {
        value: "agent-build",
        title: "Agent Build",
        subtitle: "Includes the full Agent Discovery service, plus agent design, development and integration into your systems.",
        features: ["Everything included in Agent Discovery", "Agent and workflow design", "Custom development", "Integration with your systems", "Testing and refinements", "Implementation and launch", "Documentation and team handover"],
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
              {service.features.map((feature) => (
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
