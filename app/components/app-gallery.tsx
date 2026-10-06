"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { appGalleryRows } from "./app-gallery-images";
import type { Language } from "./language-switcher";

const galleryImages = appGalleryRows.flat();

export function AppGallery({ language }: { language: Language }) {
  const galleryRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const gallery = galleryRef.current;
    if (!gallery) return;
    const rows = gallery.querySelectorAll<HTMLElement>(".app-gallery__reveal");
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let frame = 0;

    const update = () => {
      frame = 0;
      const rowProgress = Array.from(rows ?? []).map((row) => {
        const rowTop = row.getBoundingClientRect().top;
        return reducedMotion.matches
          ? 1
          : Math.min(1, Math.max(0, (window.innerHeight * 0.95 - rowTop) / (window.innerHeight * 0.25)));
      });

      rows?.forEach((row, index) => {
        const reveal = rowProgress[index];
        row.style.setProperty("--row-opacity", `${reveal}`);
        row.style.setProperty("--row-offset", `${(1 - reveal) * 24}px`);
      });
    };

    const scheduleUpdate = () => {
      if (!frame) frame = window.requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", scheduleUpdate, { passive: true });
    window.addEventListener("resize", scheduleUpdate);
    reducedMotion.addEventListener("change", scheduleUpdate);

    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", scheduleUpdate);
      window.removeEventListener("resize", scheduleUpdate);
      reducedMotion.removeEventListener("change", scheduleUpdate);
    };
  }, []);

  return (
    <section
      aria-label={language === "es" ? "Galería de aplicaciones" : "App gallery"}
      className="app-gallery"
      id="empresas-felices"
      ref={galleryRef}
    >
        <div className="app-gallery__reveal">
          <div className="app-gallery__row">
            <div className="app-gallery__track app-gallery__track--right">
              {[0, 1].map((copyIndex) => (
                <div aria-hidden={copyIndex === 1 ? true : undefined} className="app-gallery__group" key={copyIndex}>
                  {[...galleryImages, ...galleryImages].map((image, imageIndex) => (
                    <div
                      aria-hidden={imageIndex >= galleryImages.length ? true : undefined}
                      className={`app-gallery__image${image.width > image.height ? " app-gallery__image--landscape" : ""}`}
                      key={`${image.src}-${imageIndex}`}
                      style={{ width: `calc(var(--gallery-height) * ${image.width / image.height})` }}
                    >
                      <Image
                        alt={copyIndex === 1 || imageIndex >= galleryImages.length ? "" : `${image.app} · ${language === "es" ? "captura" : "screenshot"} ${image.number}`}
                        height={image.height}
                        sizes={image.width > image.height ? "(max-width: 768px) 192px, 288px" : "(max-width: 768px) 56px, 84px"}
                        src={image.src}
                        width={image.width}
                      />
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
    </section>
  );
}
