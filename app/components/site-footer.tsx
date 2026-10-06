import Link from "next/link";
import type { Language } from "./language-switcher";

export function SiteFooter({ language, contactHref }: { language: Language; contactHref?: string }) {
  return (
    <footer className="site-footer">
      <div className="site-footer__inner">
        <div className="site-footer__top">
          <div>
            <p className="site-footer__eyebrow">{language === "es" ? "Tu próximo proyecto" : "Your next project"}</p>
            <h2>{language === "es" ? "Una idea. Un buen comienzo." : "An idea. A great start."}</h2>
            <p>{language === "es" ? "Siempre estoy abierto a escuchar sobre tu próximo proyecto." : "I’m always open to hearing about your next project."}</p>
          </div>
          <Link className="site-footer__cta" href={contactHref ?? `/contact?lang=${language}`}>
            {language === "es" ? "Hablemos de tu proyecto" : "Let’s talk about your project"} <span className="site-footer__arrow" aria-hidden="true">↗</span>
          </Link>
        </div>
        <p aria-hidden="true" className="site-footer__name">Santiago Scian.</p>
        <nav className="site-footer__nav" aria-label={language === "es" ? "Enlaces del pie de página" : "Footer links"}>
          <Link href={`/?lang=${language}`}>{language === "es" ? "Inicio" : "Home"}</Link>
          <Link href={contactHref ?? `/contact?lang=${language}`}>{language === "es" ? "Contacto" : "Contact"}</Link>
          <Link href={`/testimoneo?lang=${language}`}>{language === "es" ? "Dejá tu testimonio" : "Leave a testimonial"}<span aria-hidden="true"> ↗</span></Link>
        </nav>
        <div className="site-footer__bottom">
          <span>© 2026 Santiago Scian</span>
          <span>{language === "es" ? "Desarrollo de software a medida" : "Custom software development"}</span>
        </div>
      </div>
    </footer>
  );
}
