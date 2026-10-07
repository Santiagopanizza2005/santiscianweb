import Link from "next/link";
import type { Language } from "./language-switcher";

export function HomeFooter({ language }: { language: Language }) {
  const spanish = language === "es";

  return (
    <footer className="home-footer" id="pie-de-pagina">
      <div className="home-footer__content">
        <h2>{spanish ? "Hablemos de tu proyecto." : "Let’s talk about your project."}</h2>
        <p>{spanish ? "Contame tu idea y veamos cómo llevarla a la práctica." : "Tell me your idea and let’s explore how to bring it to life."}</p>
        <Link className="home-footer__cta" href={`/contact?lang=${language}`}>
          {spanish ? "Iniciar una conversación" : "Start a conversation"}
        </Link>
        <nav className="home-footer__links" aria-label={spanish ? "Enlaces del pie de página" : "Footer links"}>
          <Link href={`/?lang=${language}`}>{spanish ? "Inicio" : "Home"}</Link>
          <Link href={`/contact?lang=${language}`}>{spanish ? "Contacto" : "Contact"}</Link>
          <Link href={`/testimoneo?lang=${language}`}>{spanish ? "Dejá tu testimonio" : "Leave a testimonial"}</Link>
        </nav>
        <div className="home-footer__bottom">
          <span>Santiago Scian.</span>
          <small>© {new Date().getFullYear()} Santiago Scian</small>
        </div>
      </div>
    </footer>
  );
}
