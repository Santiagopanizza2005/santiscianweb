"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { AppGallery } from "./app-gallery";
import { ProjectCarousel } from "./project-carousel";
import { PhotoStack } from "./photo-stack";
import { CareerTimeline } from "./career-timeline";
import type { Language } from "./language-switcher";
import { SiteHeader } from "./site-header";
import { SiteFooter } from "./site-footer";
import { Services } from "./services";
import { WorkProcess } from "./work-process";

const copy = {
  es: {
    title: ["Tu próximo empleado", "no será un humano."],
    description:
      "Ayudo a empresas a crear su propio software e instalar agentes de inteligencia artificial para solucionar un problema y que su empresa sea más efectiva y ahorre en costos.",
    cta: "Hablemos de tu proyecto",
    secondaryCta: "Más información",
    contactCta: "Busquemos una solución",
    trustpilotRating: "4.8 · Excelente",
    trustpilotLink: "Ver en Trustpilot ↗",
  },
  en: {
    title: ["Custom software", "for businesses."],
    description:
      "I help companies build their own software and install AI agents to solve a problem and make their business more effective while cutting costs.",
    cta: "Let's talk about your project",
    secondaryCta: "Learn more",
    contactCta: "Let's find a solution",
    trustpilotRating: "4.8 · Excellent",
    trustpilotLink: "View on Trustpilot ↗",
  },
} as const;

export function HomePage() {
  const [selectedLanguage, setSelectedLanguage] = useState<Language | null>(null);
  const [isTitleReady, setIsTitleReady] = useState(false);
  const [isVideoPlayingWithSound, setIsVideoPlayingWithSound] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const language = selectedLanguage ?? "es";
  const text = copy[language];

  const restartVideoWithSound = () => {
    const video = videoRef.current;
    if (!video) return;
    video.currentTime = 0;
    video.muted = false;
    video.volume = 1;
    void video.play().then(() => setIsVideoPlayingWithSound(true)).catch(() => {});
  };

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => setIsTitleReady(true));
    return () => window.cancelAnimationFrame(frame);
  }, []);

  return (
    <>
      <main className="home-page">
      <SiteHeader language={language} onToggle={() => setSelectedLanguage(language === "es" ? "en" : "es")} />

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
        <div className="figma-frame">
          <h1 className={`figma-frame__title${isTitleReady ? " figma-frame__title--ready" : ""}`} id="main-title">
            {text.title.map((line) => <span key={line}>{line}</span>)}
          </h1>
        </div>
        <p className={`intro-description${isTitleReady ? " intro-description--ready" : ""}`}>
          {text.description}
        </p>
        <div className={`intro-actions${isTitleReady ? " intro-actions--ready" : ""}`}>
          <a className="secondary-cta" href="#sobre-mi">
            {text.secondaryCta}
          </a>
          <Link className="primary-cta" href={`/contact?lang=${language}`}>
            {text.contactCta}
          </Link>
        </div>
        <div className={`intro-video-frame${isTitleReady ? " intro-video-frame--ready" : ""}`}>
          <video
            aria-label={language === "es" ? "Reproducir video desde el inicio con sonido" : "Play video from the beginning with sound"}
            className="intro-video"
            controls={isVideoPlayingWithSound}
            autoPlay
            loop
            muted
            onClick={isVideoPlayingWithSound ? undefined : restartVideoWithSound}
            onKeyDown={isVideoPlayingWithSound ? undefined : (event) => {
              if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                restartVideoWithSound();
              }
            }}
            role={isVideoPlayingWithSound ? undefined : "button"}
            tabIndex={isVideoPlayingWithSound ? undefined : 0}
            ref={videoRef}
            playsInline
            preload="metadata"
            src="/1002.mp4"
          />
          {!isVideoPlayingWithSound && (
            <button
              aria-label={language === "es" ? "Reproducir con sonido" : "Play with sound"}
              className="intro-video__play"
              onClick={restartVideoWithSound}
              type="button"
            >
              <svg aria-hidden="true" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M7 4.5a1 1 0 0 1 1.5-.86l12 7.5a1 1 0 0 1 0 1.72l-12 7.5A1 1 0 0 1 7 19.5z" />
              </svg>
            </button>
          )}
        </div>
      </section>
      <ProjectCarousel language={language} />
      <Services language={language} />
      <WorkProcess language={language} />
      <PhotoStack language={language} />
      <CareerTimeline language={language} />
      <AppGallery language={language} />
      </main>
      <SiteFooter language={language} />
    </>
  );
}
