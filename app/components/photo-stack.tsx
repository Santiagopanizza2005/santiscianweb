"use client";

import Image from "next/image";
import { useState, type CSSProperties } from "react";
import type { Language } from "./language-switcher";

const photos = ["/fotos-about/1.webp", "/fotos-about/photo-2.webp", "/fotos-about/photo-3.webp", "/fotos-about/photo-4.webp", "/fotos-about/photo-5.webp"];
const rotations = [-5, 7, -9, 4, -2];
const socialProfiles = [
  { name: "Instagram", href: "https://www.instagram.com/santiscian/" },
  { name: "LinkedIn", href: "https://www.linkedin.com/in/santi-scian-99908b2b6/" },
  { name: "TikTok", href: "https://www.tiktok.com/@santi.scian" },
  { name: "Contra", href: "https://contra.com/santiago_panizza_p1mqqp7u?referralExperimentNid=SOCIAL_REFERRAL_PROGRAM&referrerUsername=santiago_panizza_p1mqqp7u" },
];

function SocialLogo({ name }: { name: string }) {
  return (
    <svg role="img" aria-label={name} viewBox="0 0 24 24" width="22" height="22" fill="currentColor">
      {name === "Instagram" ? <>
        <rect x="3" y="3" width="18" height="18" rx="5" fill="none" stroke="currentColor" strokeWidth="2" />
        <circle cx="12" cy="12" r="4" fill="none" stroke="currentColor" strokeWidth="2" />
        <circle cx="17.5" cy="6.5" r="1.2" />
      </> : name === "LinkedIn" ? <path d="M20.45 2H3.55C2.69 2 2 2.68 2 3.52v16.96c0 .84.69 1.52 1.55 1.52h16.9c.86 0 1.55-.68 1.55-1.52V3.52c0-.84-.69-1.52-1.55-1.52ZM8 19H5V9h3v10ZM6.5 7.7a1.75 1.75 0 1 1 0-3.5 1.75 1.75 0 0 1 0 3.5ZM19 19h-3v-5.2c0-1.24-.02-2.83-1.73-2.83-1.73 0-2 1.35-2 2.74V19h-3V9h2.88v1.37h.04c.4-.76 1.38-1.56 2.84-1.56 3.04 0 3.6 2 3.6 4.6V19Z" />
        : name === "TikTok" ? <path d="M16.6 2c.32 2.75 1.86 4.4 4.4 4.57v3.1a8.24 8.24 0 0 1-4.4-1.34v7.12a6.55 6.55 0 1 1-5.65-6.49v3.2a3.39 3.39 0 1 0 2.5 3.29V2h3.15Z" />
          : <path d="M10.5 0 9.93168 2.85907C9.22181 6.4302 6.4302 9.22181 2.85907 9.93168L0 10.5v3l2.85907.5683c3.57112.7099 6.36274 3.5015 7.07261 7.0726L10.5 24h3l.5683-2.8591c.7099-3.5711 3.5015-6.3627 7.0726-7.0726L24 13.5v-3l-2.8591-.56832c-3.5711-.70987-6.3627-3.50148-7.0726-7.07261L13.5 0h-3Z" />}
    </svg>
  );
}

export function PhotoStack({ language }: { language: Language }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <section id="sobre-mi" className="photo-stack" aria-label={language === "es" ? "Mis fotos" : "My photos"}>
      <button
        className={`photo-stack__stage${expanded ? " photo-stack__stage--expanded" : ""}`}
        type="button"
        aria-expanded={expanded}
        aria-label={language === "es" ? "Desplegar o apilar fotos" : "Spread or stack photos"}
        onMouseEnter={() => {
          if (window.matchMedia("(hover: hover)").matches) setExpanded(true);
        }}
        onMouseLeave={() => setExpanded(false)}
        onFocus={() => {
          if (window.matchMedia("(hover: hover)").matches) setExpanded(true);
        }}
        onBlur={() => setExpanded(false)}
        onClick={(event) => {
          if (event.detail === 0 || window.matchMedia("(hover: none)").matches) setExpanded((value) => !value);
        }}
      >
        {photos.map((src, index) => (
          <span
            className="photo-stack__card"
            key={src}
            style={{ "--photo-index": index, "--photo-rotation": `${rotations[index]}deg`, zIndex: photos.length - index } as CSSProperties}
          >
            <Image src={src} alt={`${language === "es" ? "Foto" : "Photo"} ${index + 1}`} fill sizes="(max-width: 700px) 45vw, 240px" />
          </span>
        ))}
      </button>
      <div className="photo-stack__mobile-carousel" role="region" aria-label={language === "es" ? "Carrusel de fotos; deslizá para ver más" : "Photo carousel; swipe to see more"} tabIndex={0}>
        <ul className="photo-stack__mobile-track">
          {photos.map((src, index) => (
            <li className="photo-stack__card" key={src}>
              <Image src={src} alt={`${language === "es" ? "Foto" : "Photo"} ${index + 1}`} fill sizes="(max-width: 700px) 65vw, 240px" />
            </li>
          ))}
        </ul>
      </div>
      <p className="photo-stack__swipe-hint">{language === "es" ? "Deslizá para ver más fotos" : "Swipe to see more photos"} <span aria-hidden="true">→</span></p>
      <div className="photo-stack__bio">
        <h2>Santiago Scian</h2>
        <p>Developer. Argentina, Buenos Aires</p>
        <ul className="photo-stack__socials" aria-label={language === "es" ? "Redes sociales" : "Social media"}>
          {socialProfiles.map(({ name, href }) => (
            <li key={name}>
              <a href={href} aria-label={name} target="_blank" rel="noopener noreferrer">
                <SocialLogo name={name} />
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
