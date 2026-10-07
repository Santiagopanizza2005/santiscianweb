"use client";

import { useEffect, useRef } from "react";
import type { Language } from "./language-switcher";

const content = {
  es: {
    heading: "Cómo podemos ayudarte",
    cards: [
      {
        title: "Evaluación de preparación para IA",
        description: "Un análisis sincero de en qué punto está tu organización (herramientas, datos, talento y postura de seguridad) antes de que alguien recomiende cualquier cosa.",
      },
      {
        title: "Diseño de flujos de trabajo con agentes de IA",
        description: "Mapear y construir flujos de trabajo donde la IA autónoma tenga sentido, manteniendo supervisión humana clara en las decisiones importantes.",
      },
      {
        title: "Modelo operativo de marketing",
        description: "Rediseñar cómo funciona el marketing de punta a punta (creatividad, medios, medición) para que esté estructurado alrededor de valor acumulativo, no de entregas aisladas.",
      },
      {
        title: "Seguridad y gestión de riesgos",
        description: "Entender qué riesgos realmente introduce la IA (gobernanza de datos, riesgo de modelos, dependencia de proveedores) e incorporar esas consideraciones al diseño desde el primer día.",
      },
      {
        title: "Sistemas de contenido y producción",
        description: "Construir la infraestructura para producir contenido a escala: pipelines editoriales, producción asistida por IA y una capa humana que mantenga todo coherente.",
      },
      {
        title: "Producto digital y crecimiento",
        description: "Para equipos que necesitan construir apps, herramientas o plataformas. Diseñan y lanzan productos incorporando IA solo donde realmente aporta valor.",
      },
    ],
  },
  en: {
    heading: "How we can help",
    cards: [
      {
        title: "AI readiness assessment",
        description: "An honest assessment of where your organization stands (tools, data, talent and security posture) before anyone recommends anything.",
      },
      {
        title: "AI agent workflow design",
        description: "Map and build workflows where autonomous AI makes sense, keeping clear human oversight of important decisions.",
      },
      {
        title: "Marketing operating model",
        description: "Redesign how marketing works from end to end (creative, media and measurement) so it is structured around compounding value, rather than isolated deliverables.",
      },
      {
        title: "Security and risk management",
        description: "Understand the risks AI actually introduces (data governance, model risk and vendor dependency) and account for them in the design from day one.",
      },
      {
        title: "Content and production systems",
        description: "Build the infrastructure to produce content at scale: editorial pipelines, AI-assisted production and a human layer that keeps everything coherent.",
      },
      {
        title: "Digital product and growth",
        description: "For teams that need to build apps, tools or platforms. Design and launch products with AI only where it truly adds value.",
      },
    ],
  },
} as const;

export function CapabilityCards({ language }: { language: Language }) {
  const text = content[language];
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches || !("IntersectionObserver" in window)) return;

    const mobileLayout = window.matchMedia("(max-width: 768px)");
    let elements: HTMLElement[] = [];
    let observer: IntersectionObserver | null = null;

    const observeReveals = () => {
      observer?.disconnect();
      elements.forEach((element) => { delete element.dataset.capabilityReveal; });
      elements = Array.from(sectionRef.current?.querySelectorAll<HTMLElement>(
        mobileLayout.matches ? "h2, .capabilities__grid" : "h2, .capability-card",
      ) ?? []);

      const nextObserver = new IntersectionObserver((entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          (entry.target as HTMLElement).dataset.capabilityReveal = "visible";
          nextObserver.unobserve(entry.target);
        }
      }, { threshold: 0.12, rootMargin: "0px 0px -32px 0px" });

      elements.forEach((element) => {
        element.dataset.capabilityReveal = "pending";
        nextObserver.observe(element);
      });
      observer = nextObserver;
    };

    observeReveals();
    mobileLayout.addEventListener("change", observeReveals);

    return () => {
      mobileLayout.removeEventListener("change", observeReveals);
      observer?.disconnect();
      elements.forEach((element) => { delete element.dataset.capabilityReveal; });
    };
  }, [language]);

  return (
    <section className="capabilities" aria-labelledby="capabilities-title" ref={sectionRef}>
      <h2 id="capabilities-title">{text.heading}</h2>
      <ol className="capabilities__grid" aria-label={text.heading} tabIndex={0}>
        {text.cards.map((card, index) => (
          <li className="capability-card" key={card.title}>
            <h3>{card.title}</h3>
            <p>{card.description}</p>
            <span className="capability-card__number" aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
          </li>
        ))}
      </ol>
    </section>
  );
}
