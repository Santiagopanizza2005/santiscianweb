"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ProjectCarousel } from "./project-carousel";
import { CapabilityCards } from "./capability-cards";
import { PhotoStack } from "./photo-stack";
import { CareerTimeline } from "./career-timeline";
import type { Language } from "./language-switcher";
import { SiteHeader } from "./site-header";
import { HomeFooter } from "./home-footer";
import { Services } from "./services";
import { WorkProcess } from "./work-process";

const copy = {
  es: {
    title: ["Tu próximo empleado", "no será un humano."],
    description:
      "Nos integramos a tu empresa para evaluar qué puede hacer realmente la IA y qué no, y diseñamos juntos una mejor forma de trabajar.",
    cta: "Hablemos de tu proyecto",
    secondaryCta: "Más información",
    contactCta: "Iniciar una conversación",
  },
  en: {
    title: ["Custom software", "for businesses."],
    description:
      "We embed in your company to evaluate what AI can actually do and what it can't, and together we design a better way of working.",
    cta: "Let's talk about your project",
    secondaryCta: "Learn more",
    contactCta: "Start a conversation",
  },
} as const;

export function HomePage() {
  const [selectedLanguage, setSelectedLanguage] = useState<Language | null>(null);
  const [isTitleReady, setIsTitleReady] = useState(false);
  const language = selectedLanguage ?? "es";
  const text = copy[language];

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => setIsTitleReady(true));
    return () => window.cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    let hideTimer: ReturnType<typeof setTimeout>;
    const showScrollbar = () => {
      root.classList.add("home-is-scrolling");
      clearTimeout(hideTimer);
      hideTimer = setTimeout(() => root.classList.remove("home-is-scrolling"), 900);
    };
    window.addEventListener("scroll", showScrollbar, { passive: true });
    return () => {
      window.removeEventListener("scroll", showScrollbar);
      clearTimeout(hideTimer);
      root.classList.remove("home-is-scrolling");
    };
  }, []);

  return (
    <>
      <main className="home-page">
      <SiteHeader language={language} onToggle={() => setSelectedLanguage(language === "es" ? "en" : "es")} />

      <section className="intro" aria-labelledby="main-title">
        <div className="figma-frame">
          <h1 className={`figma-frame__title${isTitleReady ? " figma-frame__title--ready" : ""}`} id="main-title">
            {text.title.map((line) => <span key={line}>{line}</span>)}
          </h1>
        </div>
        <p className={`intro-description${isTitleReady ? " intro-description--ready" : ""}`}>
          {text.description}
        </p>
        <div className={`intro-actions${isTitleReady ? " intro-actions--ready" : ""}`}>
          <a className="secondary-cta" href="#como-trabajo">
            {text.secondaryCta}
          </a>
          <Link className="primary-cta" href="#servicios">
            {text.contactCta}
          </Link>
        </div>
        <div className="intro-space" aria-hidden="true" />
      </section>
      <ProjectCarousel language={language} />
      <CapabilityCards language={language} />
      <Services language={language} />
      <WorkProcess language={language} />
      <PhotoStack language={language} />
      <CareerTimeline language={language} />
      </main>
      <HomeFooter language={language} />
    </>
  );
}
