"use client";

import { Fragment, useEffect, useRef, useState } from "react";
import type { Language } from "./language-switcher";

const years: { year: number; milestones: Record<Language, string[]> }[] = [
  {
    year: 2026,
    milestones: {
      es: ["Experimenté con un dispositivo para ayudar a dejar de fumar y después encontré mi foco en el desarrollo de software y apps. Ya publiqué más de 3 apps en la App Store y trabajé con empresas de distintos rubros."],
      en: ["I experimented with a device to help people quit smoking, then found my focus in software and app development. I have published more than 3 apps on the App Store and worked with businesses in different industries."],
    },
  },
  {
    year: 2025,
    milestones: {
      es: ["Empecé a trabajar con automatizaciones y agentes de inteligencia artificial, creando soluciones para ayudar a las empresas a automatizar la atención al cliente y sus tareas diarias."],
      en: ["I began working with AI automations and agents, creating solutions to help businesses automate customer support and everyday tasks."],
    },
  },
  {
    year: 2024,
    milestones: {
      es: ["Empecé a dedicarme al marketing digital y a trabajar con distintos negocios, ayudándolos con sus estrategias de marketing y desarrollando sus páginas web y tiendas online."],
      en: ["I began focusing on digital marketing and working with different businesses, helping them with their marketing strategies and building their websites and online stores."],
    },
  },
  {
    year: 2023,
    milestones: {
      es: ["A los 18 años lancé mi primer emprendimiento: un e-commerce de llaveros. Ahí aprendí a vender, crear contenido y convertir una idea en un negocio real."],
      en: ["At 18, I launched my first business: an e-commerce store selling keychains. That is where I learned to sell, create content and turn an idea into a real business."],
    },
  },
];

export function CareerTimeline({ language }: { language: Language }) {
  const viewport = useRef<HTMLDivElement>(null);
  const [edges, setEdges] = useState({ start: true, end: true });

  useEffect(() => {
    const element = viewport.current;
    if (!element) return;
    const update = () => setEdges({ start: element.scrollLeft < 2, end: element.scrollLeft + element.clientWidth >= element.scrollWidth - 2 });
    update();
    element.addEventListener("scroll", update, { passive: true });
    const observer = new ResizeObserver(update);
    observer.observe(element);
    return () => { element.removeEventListener("scroll", update); observer.disconnect(); };
  }, []);

  function move(direction: number) {
    const element = viewport.current;
    if (!element) return;
    element.scrollBy({ left: direction * element.clientWidth * 0.8, behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth" });
  }

  return (
    <section className="career-timeline" aria-label={language === "es" ? "Mi recorrido desde 2023" : "My journey since 2023"}>
      <div className="career-timeline__viewport" ref={viewport} tabIndex={0}>
        <ol className="career-timeline__years">
          {years.map(({ year, milestones }) => (
            <li className="career-timeline__year" key={year}>
              <h3>{year}</h3>
              <div className="career-timeline__milestones">
                {milestones[language].map((milestone) => (
                  <p key={milestone}>
                    {milestone.split(/(más de 3 apps en la App Store|desarrollo de software y apps|automatizaciones y agentes de inteligencia artificial|automatizar la atención al cliente|marketing digital|páginas web y tiendas online|mi primer emprendimiento|e-commerce de llaveros|more than 3 apps on the App Store|software and app development|AI automations and agents|automate customer support|digital marketing|websites and online stores|my first business|e-commerce store selling keychains)/g).map((part, index) => (
                      <Fragment key={index}>{index % 2 === 1 ? <strong>{part}</strong> : part}</Fragment>
                    ))}
                  </p>
                ))}
              </div>
            </li>
          ))}
        </ol>
      </div>
      {!edges.start && <button className="career-timeline__arrow career-timeline__arrow--previous" onClick={() => move(-1)} aria-label={language === "es" ? "Años más recientes" : "More recent years"} type="button">‹</button>}
      {!edges.end && <button className="career-timeline__arrow career-timeline__arrow--next" onClick={() => move(1)} aria-label={language === "es" ? "Años anteriores" : "Earlier years"} type="button">›</button>}
    </section>
  );
}
