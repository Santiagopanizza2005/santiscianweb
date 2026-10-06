"use client";

import { Fragment, useLayoutEffect, useRef, useState } from "react";
import Link from "next/link";
import type { Language } from "./language-switcher";
import { projectDescriptions } from "./project-descriptions";

const projectLinks: Record<string, { website: string; project?: string }> = {
  "/ecohabit-video.mp4": { website: "https://mindpraxis.net/", project: "https://mindpraxis.net/soluciones#ecohabit" },
  "/izr-ivr-video.mp4": { website: "https://www.izr.com.ar/" },
  "/mobi-video.mp4": { website: "https://mobihunter.io/" },
  "/appmobi-video.mp4": { website: "https://mobihunter.io/", project: "https://app.mobihunter.io/" },
};

export function ProjectVideo({ name, src, subtitle, language = "es" }: { name: string; src: string; subtitle: string; language?: Language }) {
  const links = projectLinks[src];
  const pageRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playingWithSound, setPlayingWithSound] = useState(false);

  useLayoutEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches || !("IntersectionObserver" in window)) return;

    const elements = pageRef.current?.querySelectorAll<HTMLElement>(".project-video-page__links, .project-video-page__description");
    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        (entry.target as HTMLElement).dataset.reveal = "visible";
        observer.unobserve(entry.target);
      }
    }, { threshold: 0.12 });

    elements?.forEach((element) => {
      element.dataset.reveal = "pending";
      observer.observe(element);
    });

    return () => {
      observer.disconnect();
      elements?.forEach((element) => { delete element.dataset.reveal; });
    };
  }, [src]);

  const restartWithSound = () => {
    const video = videoRef.current;
    if (!video) return;
    video.currentTime = 0;
    video.muted = false;
    video.volume = 1;
    void video.play().then(() => setPlayingWithSound(true)).catch(() => {});
  };

  return (
    <main className="project-video-page" ref={pageRef}>
      <div className="project-video-page__heading">
        <h1>{name}</h1>
        <p>{subtitle}</p>
      </div>
      <div className="project-video-page__frame">
        <video
          aria-label={name}
          className="project-video-page__video"
          autoPlay
          loop={!playingWithSound}
          muted={!playingWithSound}
          controls={playingWithSound}
          onClick={playingWithSound ? undefined : restartWithSound}
          onKeyDown={playingWithSound ? undefined : (event) => {
            if (event.key === "Enter" || event.key === " ") {
              event.preventDefault();
              restartWithSound();
            }
          }}
          role={playingWithSound ? undefined : "button"}
          tabIndex={playingWithSound ? undefined : 0}
          ref={videoRef}
          playsInline
          preload="metadata"
          src={src}
        />
        {!playingWithSound && (
          <button aria-label={`Reproducir ${name} desde el inicio con sonido`} className="intro-video__play" onClick={restartWithSound} type="button">
            <svg aria-hidden="true" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d="M7 4.5a1 1 0 0 1 1.5-.86l12 7.5a1 1 0 0 1 0 1.72l-12 7.5A1 1 0 0 1 7 19.5z" />
            </svg>
          </button>
        )}
      </div>
      <nav className="project-video-page__links" aria-label="Enlaces del proyecto">
        <Link href={`/contact?lang=${language}`} aria-label={language === "es" ? "Contacto" : "Contact"} title={language === "es" ? "Contacto" : "Contact"}>
          <svg aria-hidden="true" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="5" width="18" height="14" rx="3" /><path d="m3 6 9 7 9-7" />
          </svg>
        </Link>

        {links && (
        <a href={links.website} target="_blank" rel="noopener noreferrer" aria-label={language === "es" ? "Sitio web" : "Website"} title={language === "es" ? "Sitio web" : "Website"}>
          <svg aria-hidden="true" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="9" /><ellipse cx="12" cy="12" rx="4" ry="9" /><path d="M3 12h18" />
          </svg>
        </a>
        )}
        {links?.project && (
        <a href={links.project} target="_blank" rel="noopener noreferrer" aria-label={language === "es" ? "Ir al proyecto" : "Open project"} title={language === "es" ? "Ir al proyecto" : "Open project"}>
          <svg aria-hidden="true" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M7 17 17 7M7 7h10v10" />
          </svg>
        </a>
        )}
      </nav>
      <div className="project-video-page__description">
        {projectDescriptions[src]?.[language].map((paragraph) => (
          <p key={paragraph}>
            {paragraph.split("**").map((part, index) => (
              <Fragment key={index}>{index % 2 === 1 ? <strong>{part}</strong> : part}</Fragment>
            ))}
          </p>
        ))}
      </div>
    </main>
  );
}
