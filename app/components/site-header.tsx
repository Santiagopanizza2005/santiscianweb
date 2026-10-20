"use client";

import Link from "next/link";
import Image from "next/image";
import { LanguageSwitcher, type Language } from "./language-switcher";

export function SiteHeader({ language, onToggle }: { language: Language; onToggle: () => void }) {
  return (
    <header className="site-header">
      <Link className="site-header__logo" href={`/?lang=${language}`} aria-label={language === "es" ? "Santiago Scian — Inicio" : "Santiago Scian — Home"} onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
        <Image src="/logo.svg" alt="Santiago Scian" width={44} height={44} unoptimized />
      </Link>
      <nav className="site-header__nav" aria-label={language === "es" ? "Navegación principal" : "Main navigation"}>
        <Link href={`/?lang=${language}#servicios`}>{language === "es" ? "Servicios" : "Services"}</Link>
        <Link href={`/herramientas?lang=${language}`}>{language === "es" ? "Herramientas" : "Tools"}</Link>
        <Link href={`/?lang=${language}#sobre-mi`}>{language === "es" ? "Quién soy" : "About me"}</Link>
      </nav>
      <LanguageSwitcher language={language} onToggle={onToggle} />
      <Link className="header-cta" href={`/contact?lang=${language}`}>
        {language === "es" ? "Hablemos de tu proyecto" : "Let's talk about your project"}
      </Link>
    </header>
  );
}
