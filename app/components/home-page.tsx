"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { LanguageSwitcher, type Language } from "./language-switcher";

const copy = {
  es: {
    title: ["Desarrollo software", "a medida para empresas."],
    description:
      "Creo herramientas web simples para automatizar tareas, ordenar procesos y resolver problemas específicos de tu negocio.",
    cta: "Hablemos de tu proyecto",
    trustpilotRating: "4.8 · Excelente",
    trustpilotLink: "Ver en Trustpilot ↗",
    socialProof: "+5 empresas felices",
    carouselLabel: "Proyectos seleccionados",
    carouselTitle: "Algunos proyectos que desarrollé.",
    footerTitle: "¿Hablamos?",
    footerDescription: "Siempre estoy abierto a escuchar sobre tu próximo proyecto.",
    footerCta: "Hablemos de tu proyecto",
    footerCopyright: "© 2026 Santiago Scian",
    footerMade: "Desarrollo de software a medida",
    historyTitle: "Mi camino hasta acá.",
    history: [
      {
        year: "2023",
        title: "Mi primer emprendimiento.",
        description:
          "A los 18 años lancé un e-commerce de llaveros. Ahí aprendí a vender, crear contenido y convertir una idea en un negocio real.",
      },
      {
        year: "2024",
        title: "Empecé a programar.",
        description:
          "Creé mi primer sistema: una app que ayudaba a armar estrategias de marketing con inteligencia artificial.",
      },
      {
        year: "2025",
        title: "Resolver problemas reales.",
        description:
          "Dejé ese proyecto y trabajé con agencias inmobiliarias para automatizar la atención al cliente y sus tareas diarias.",
      },
      {
        year: "1-2026",
        title: "Experimenté más allá del software.",
        description:
          "A comienzos de 2026 trabajé en un proyecto de software y experimenté con un dispositivo para ayudar a dejar de fumar. Combinar hardware y software me permitió explorar una forma distinta de resolver un problema cotidiano.",
      },
      {
        year: "2-2026",
        title: "Encontré mi foco.",
        description:
          "Después de esa experiencia, me enfoqué en desarrollar software y apps, que es lo que más me apasiona. Ya publiqué más de 3 apps en la App Store y trabajé con empresas de distintos rubros.",
      },
    ],
  },
  en: {
    title: ["Custom software", "for businesses."],
    description:
      "I create simple web tools to automate tasks, organize processes and solve specific problems in your business.",
    cta: "Let's talk about your project",
    trustpilotRating: "4.8 · Excellent",
    trustpilotLink: "View on Trustpilot ↗",
    socialProof: "5+ happy companies",
    carouselLabel: "Selected projects",
    carouselTitle: "A selection of projects I’ve developed.",
    footerTitle: "Let’s talk.",
    footerDescription: "I’m always open to hearing about your next project.",
    footerCta: "Let’s talk about your project",
    footerCopyright: "© 2026 Santiago Scian",
    footerMade: "Custom software development",
    historyTitle: "How I got here.",
    history: [
      {
        year: "2023",
        title: "My first business.",
        description:
          "At 18, I launched an e-commerce business selling keychains. That is where I learned to sell, create content and turn an idea into a real business.",
      },
      {
        year: "2024",
        title: "I started coding.",
        description:
          "I built my first system: an app that helped create marketing strategies using artificial intelligence.",
      },
      {
        year: "2025",
        title: "Solving real problems.",
        description:
          "I set that project aside and worked with real estate agencies to automate customer support and day-to-day tasks.",
      },
      {
        year: "1-2026",
        title: "I experimented beyond software.",
        description:
          "At the start of 2026, I worked on a software project and experimented with a device designed to help people quit smoking. Combining hardware and software let me explore a different way to solve an everyday problem.",
      },
      {
        year: "2-2026",
        title: "I found my focus.",
        description:
          "After that experience, I focused on building software and apps, which is what I truly enjoy. I have already released more than three apps on the App Store and worked with businesses across different industries.",
      },
    ],
  },
} as const;

const carousels = [
  ["puff1", "Puff2", "Puff3", "puff4", "puff5", "puff6", "puff7", "puff8", "mobi1", "mobi2", "mobi3", "mobi4"],
  ["mobi5", "mobi6", "mobi7", "coco1", "coco2", "coco3", "coco4", "coco5", "mind1", "mind2", "mind3"],
  ["mind4", "mind5", "mind6", "mind7", "mind8", "izr1", "izr2", "unseg1", "unseg2", "unseg4", "Frame%2093"],
];

const clientLogos = ["1", "2", "3", "4", "5", "6"];

function ProjectCarouselImage({ src }: { src: string }) {
  const [isLoaded, setIsLoaded] = useState(false);
  const imageRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const image = imageRef.current;

    if (image?.complete && image.naturalWidth > 0) setIsLoaded(true);
  }, []);

  return (
    <div className="project-carousel__image-frame">
      {!isLoaded && <span aria-hidden="true" className="image-skeleton" />}
      <img
        alt=""
        className={`project-carousel__image${isLoaded ? " project-carousel__image--loaded" : ""}`}
        decoding="async"
        onError={() => setIsLoaded(false)}
        onLoad={() => setIsLoaded(true)}
        ref={imageRef}
        src={src}
      />
    </div>
  );
}

export function HomePage() {
  const [selectedLanguage, setSelectedLanguage] = useState<Language | null>(null);
  const [hasStartedVideoWithSound, setHasStartedVideoWithSound] = useState(false);
  const language = selectedLanguage ?? "es";
  const text = copy[language];
  const carouselTitleRef = useRef<HTMLHeadingElement>(null);
  const carouselsRef = useRef<HTMLElement>(null);
  const introVideoRef = useRef<HTMLVideoElement>(null);

  const restartVideoWithSound = (video: HTMLVideoElement) => {
    video.currentTime = 0;
    video.muted = false;
    video.controls = true;
    setHasStartedVideoWithSound(true);
    void video.play().catch(() => {});
  };

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  useEffect(() => {
    const title = carouselTitleRef.current;
    const carousels = carouselsRef.current;

    if (!title || !carousels) return;
    const titleElement = title;
    const carouselElement = carousels;
    const characters = Array.from(
      titleElement.querySelectorAll<HTMLElement>(".carousel-title__character"),
    );

    function updateTitleColor() {
      const { height, top } = carouselElement.getBoundingClientRect();
      const progress = Math.min(1, Math.max(0, (window.innerHeight - top) / height));
      characters.forEach((character, index) => {
        const characterProgress = Math.min(1, Math.max(0, progress * characters.length - index));
        const channel = Math.round(174 - 151 * characterProgress);
        character.style.color = `rgb(${channel}, ${channel}, ${channel})`;
      });
    }

    updateTitleColor();
    window.addEventListener("scroll", updateTitleColor, { passive: true });
    window.addEventListener("resize", updateTitleColor);

    return () => {
      window.removeEventListener("scroll", updateTitleColor);
      window.removeEventListener("resize", updateTitleColor);
    };
  }, [language]);

  return (
    <>
      <main className="home-page">
      <header className="site-header">
        <LanguageSwitcher
          language={language}
          onToggle={() => setSelectedLanguage(language === "es" ? "en" : "es")}
        />
      </header>

      <section className="intro" aria-labelledby="main-title">
        <p className="intro-tag">
          <span aria-hidden="true" className="intro-tag__stars">
            {Array.from({ length: 5 }, (_, index) => <span key={index}>★</span>)}
          </span>
          <span className="intro-tag__label">
            {text.trustpilotRating} <span aria-hidden="true">|</span>{" "}
            <a href="https://www.trustpilot.com/" rel="noreferrer" target="_blank">
              {text.trustpilotLink}
            </a>
          </span>
        </p>
        <h1 id="main-title">
          {text.title.map((line) => <span key={line}>{line}</span>)}
        </h1>
        <p>{text.description}</p>
        <div className="intro-video-frame">
          <video
            aria-label={language === "es" ? "Presentación de Santi Scian" : "Santi Scian introduction"}
            autoPlay
            className="intro-video"
            loop
            muted
            onClick={(event) => {
              if (!hasStartedVideoWithSound) restartVideoWithSound(event.currentTarget);
            }}
            playsInline
            preload="none"
            ref={introVideoRef}
          >
            <source src="/santiscian.web.mp4" type="video/mp4" />
          </video>
          {!hasStartedVideoWithSound && (
            <button
              aria-label={language === "es" ? "Reproducir con sonido desde el inicio" : "Play with sound from the beginning"}
              className="intro-video__play"
              onClick={() => {
                if (introVideoRef.current) restartVideoWithSound(introVideoRef.current);
              }}
              type="button"
            >
              <span aria-hidden="true">▶</span>
            </button>
          )}
        </div>
        <Link className="primary-cta" href={`/contact?lang=${language}`}>
          {text.cta}
        </Link>
        <div className="social-proof">
          <p>{text.socialProof}</p>
          <div aria-label={text.socialProof} className="logo-row">
            {clientLogos.map((logo) => (
              <div className="logo-slot" key={logo}>
                <Image
                  alt=""
                  className="logo-slot__image"
                  height={1500}
                  sizes="(max-width: 600px) 4rem, 6rem"
                  src={`/logos/${logo}.webp?v=20260827-1038`}
                  width={1500}
                />
              </div>
            ))}
          </div>
        </div>
        <h2 aria-label={text.carouselTitle} className="carousel-title" ref={carouselTitleRef}>
          {Array.from(text.carouselTitle).map((character, index) => (
            <span aria-hidden="true" className="carousel-title__character" key={`${character}-${index}`}>
              {character}
            </span>
          ))}
        </h2>
        <section aria-label={text.carouselLabel} className="project-carousels" ref={carouselsRef}>
          {carousels.map((images, carouselIndex) => (
            <div className="project-carousel" key={carouselIndex}>
              <div className={`project-carousel__track project-carousel__track--${carouselIndex}`}>
                {[0, 1, 2].map((groupIndex) => (
                  <div aria-hidden={groupIndex > 0} className="project-carousel__group" key={groupIndex}>
                    {images.map((image) => (
                      <ProjectCarouselImage
                        key={image}
                        src={`/imagenes/${image}.webp${["mind", "mobi", "puff", "izr"].some((project) => image.toLowerCase().startsWith(project)) ? "?v=20260915-1416" : ""}`}
                      />
                    ))}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </section>
        <section aria-labelledby="history-title" className="history">
          <h2 id="history-title">{text.historyTitle}</h2>
          <div className="history__timeline">
            {text.history.map((entry) => (
              <article className="history-entry" key={entry.year}>
                <div className="history-entry__photo">
                  <Image
                    alt={`${entry.year} — ${entry.title}`}
                    height={1600}
                    sizes="(max-width: 700px) calc(100vw - 3rem), 30rem"
                    src={`/historia/${entry.year}.webp?v=20260915-1329`}
                    width={1200}
                  />
                </div>
                <div className="history-entry__content">
                  <p className="history-entry__year">{entry.year}</p>
                  <h3>{entry.title}</h3>
                  <p>{entry.description}</p>
                </div>
              </article>
            ))}
          </div>
        </section>
      </section>
      </main>
      <footer className="site-footer">
        <div className="site-footer__inner">
          <div className="site-footer__top">
            <div>
              <h2>{text.footerTitle}</h2>
              <p>{text.footerDescription}</p>
            </div>
            <Link className="site-footer__cta" href={`/contact?lang=${language}`}>
              {text.footerCta} <span aria-hidden="true">↗</span>
            </Link>
          </div>
          <p aria-hidden="true" className="site-footer__name">Santiago Scian.</p>
          <div className="site-footer__bottom">
            <span>{text.footerCopyright}</span>
            <span>{text.footerMade}</span>
          </div>
        </div>
      </footer>
    </>
  );
}
