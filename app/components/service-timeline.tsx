"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import type { Language } from "./language-switcher";

const copy = {
  es: {
    heading: "Plazos",
    day: "Día",
    month: "+ 1 mes",
    scroll: "Deslizá para ver el cronograma completo →",
    previous: "Ver la parte anterior del cronograma",
    next: "Ver la siguiente parte del cronograma",
    phases: ["Diagnóstico", "Diseño del agente", "Desarrollo", "Instalación", "Monitoreo"],
    durations: ["7 días", "5 días", "2 semanas", "2 días", "1 mes"],
    descriptions: ["Análisis y oportunidades", "Flujos y alcance del agente", "Construcción y pruebas", "Integración en tus sistemas", "Seguimiento y mejora"],
  },
  en: {
    heading: "Timeline",
    day: "Day",
    month: "+ 1 month",
    scroll: "Swipe to see the full timeline →",
    previous: "See the previous part of the timeline",
    next: "See the next part of the timeline",
    phases: ["Discovery", "Agent design", "Development", "Installation", "Monitoring"],
    durations: ["7 days", "5 days", "2 weeks", "2 days", "1 month"],
    descriptions: ["Analysis and opportunities", "Agent workflows and scope", "Development and testing", "Integration into your systems", "Monitoring and improvement"],
  },
};

const phaseDays = [7, 5, 14, 2, 30];
const chartDays = 58;
const installationDays = 28;
const stages = phaseDays.map((days, index) => ({
  index,
  start: phaseDays.slice(0, index).reduce((sum, previous) => sum + previous, 0),
  days,
}));

function getScrollBounds(viewport: HTMLDivElement) {
  const max = Math.max(0, viewport.scrollWidth - viewport.clientWidth);
  return { left: Math.max(0, Math.min(max, viewport.scrollLeft)), max };
}

function getScrollEdges(viewport: HTMLDivElement) {
  const { left, max } = getScrollBounds(viewport);
  return {
    start: left <= 2,
    end: max - left <= 2,
  };
}

export function ServiceTimeline({ language }: { language: Language }) {
  const text = copy[language];
  const sectionRef = useRef<HTMLElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [revealed, setRevealed] = useState(false);
  const [edges, setEdges] = useState({ start: true, end: false });

  useEffect(() => {
    const viewport = scrollRef.current;
    if (!viewport) return;
    const mobileLayout = window.matchMedia("(max-width: 768px)");
    let idleTimer = 0;
    let touching = false;

    const settleEdges = () => {
      if (touching || !mobileLayout.matches) return;
      const { left, max } = getScrollBounds(viewport);
      const target = left <= 16 ? 0 : max - left <= 16 ? max : left;
      if (Math.abs(viewport.scrollLeft - target) > 0.5) {
        viewport.scrollTo({ left: target, behavior: "instant" });
      }
      setEdges(getScrollEdges(viewport));
    };

    const updateEdges = () => {
      setEdges(getScrollEdges(viewport));
      window.clearTimeout(idleTimer);
      idleTimer = window.setTimeout(settleEdges, 140);
    };

    const startTouch = () => { touching = true; window.clearTimeout(idleTimer); };
    const endTouch = () => { touching = false; updateEdges(); };

    viewport.addEventListener("scroll", updateEdges, { passive: true });
    viewport.addEventListener("touchstart", startTouch, { passive: true });
    viewport.addEventListener("touchend", endTouch, { passive: true });
    viewport.addEventListener("touchcancel", endTouch, { passive: true });
    const observer = new ResizeObserver(updateEdges);
    observer.observe(viewport);
    const chart = viewport.firstElementChild;
    if (chart) observer.observe(chart);
    return () => {
      observer.disconnect();
      window.clearTimeout(idleTimer);
      viewport.removeEventListener("scroll", updateEdges);
      viewport.removeEventListener("touchstart", startTouch);
      viewport.removeEventListener("touchend", endTouch);
      viewport.removeEventListener("touchcancel", endTouch);
    };
  }, []);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      setRevealed(true);
      observer.disconnect();
    }, { threshold: 0.2 });
    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  const move = (direction: number) => {
    const viewport = scrollRef.current;
    if (!viewport) return;
    const { left, max } = getScrollBounds(viewport);
    const target = Math.max(0, Math.min(max, left + direction * viewport.clientWidth * 0.8));
    if (target === left) {
      setEdges(getScrollEdges(viewport));
      return;
    }
    viewport.scrollTo({
      left: target,
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth",
    });
  };

  return (
    <section className={`service-timeline${revealed ? " service-timeline--revealed" : ""}`} id="cronograma" aria-labelledby="service-timeline-title" ref={sectionRef}>
      <div className="service-timeline__heading">
        <h2 id="service-timeline-title">{text.heading}</h2>
      </div>
      <p className="service-timeline__hint">{text.scroll}</p>
      <div className="service-timeline__viewport">
        <div className="service-timeline__scroll" tabIndex={0} role="region" aria-label={text.heading} ref={scrollRef}>
          <div className="service-timeline__chart" id="service-timeline-chart">
            <div className="service-timeline__ruler" aria-hidden="true">
              {Array.from({ length: chartDays + 1 }, (_, day) => day).filter((day) => ![0, 7, 12, 28, chartDays].includes(day)).map((day) => (
                <i className="service-timeline__tick" key={`tick-${day}`} style={{ left: `${day / chartDays * 100}%` }} />
              ))}
              {[0, 7, 12, 28].map((day) => (
                <span key={day} style={{ left: `${day / chartDays * 100}%` }}>{text.day} {day}</span>
              ))}
              <span className="service-timeline__end" style={{ left: `${(installationDays + 30) / chartDays * 100}%` }}>{text.month}</span>
            </div>
            <ol className="service-timeline__stages">
              {stages.map(({ index, start, days }) => (
                <li key={index} className={`service-timeline__stage service-timeline__stage--${index}`} style={{ "--stage-index": index, "--stage-start": `${start / chartDays * 100}%`, "--stage-width": `${days / chartDays * 100}%` } as CSSProperties}>
                  <div className="service-timeline__bar"><strong>{text.phases[index]}</strong></div>
                  <p className="service-timeline__detail">{text.descriptions[index]} <span>· {text.durations[index]}</span></p>
                </li>
              ))}
            </ol>
          </div>
        </div>
        {!edges.start && (
          <button className="service-timeline__arrow service-timeline__arrow--previous" type="button" aria-label={text.previous} aria-controls="service-timeline-chart" onClick={() => move(-1)}>‹</button>
        )}
        {!edges.end && (
          <button className="service-timeline__arrow service-timeline__arrow--next" type="button" aria-label={text.next} aria-controls="service-timeline-chart" onClick={() => move(1)}>›</button>
        )}
      </div>
    </section>
  );
}
