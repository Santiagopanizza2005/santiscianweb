"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { SiteHeader } from "./site-header";
import type { Language } from "./language-switcher";

export function ToolsPage({ initialLanguage }: { initialLanguage: Language }) {
  const [language, setLanguage] = useState(initialLanguage);

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  return (
    <main className="tools-page" aria-label={language === "es" ? "Herramientas" : "Tools"}>
      <SiteHeader language={language} onToggle={() => setLanguage(language === "es" ? "en" : "es")} />
      <section className="tools-page__content" aria-labelledby="tools-title">
        <div className="project-video-page__heading">
          <h1 id="tools-title">{language === "es" ? "Herramientas" : "Tools"}</h1>
          <p>{language === "es" ? "Desarrolladas por Santiscian" : "Developed by Santiscian"}</p>
        </div>
        <a className="tools-page__preview project-carousel__card" href="https://loom.santiscian.com" aria-label={language === "es" ? "Visitar Loom" : "Visit Loom"}>
          <Image src="/imagenes/loom-preview.png" alt={language === "es" ? "Vista previa de la página de inicio de Loom" : "Preview of the Loom homepage"} width={3840} height={2160} unoptimized priority />
          <h2 className="project-carousel__name" id="loom-title">Loom</h2>
          <div className="project-carousel__caption">
            <h3>{language === "es" ? "Tu asistente inmobiliario con IA." : "Your AI real estate assistant."}</h3>
            <p>{language === "es" ? "Compará propiedades, explorá referencias del mercado y recibí una tasación orientativa desde un chat. Loom reúne mapas, comparables e informes para ayudarte a analizar cada propiedad, organizar la información y trabajar con tu equipo en un solo lugar." : "Compare properties, explore market references and get an indicative valuation through a chat. Loom brings maps, comparables and reports together to help you analyze each property, organize information and work with your team in one place."}</p>
          </div>
        </a>
      </section>
    </main>
  );
}
