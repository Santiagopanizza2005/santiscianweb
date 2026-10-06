"use client";

import { useEffect, useRef, type ReactNode } from "react";

export function ProjectStoryStack({ children, variant = "projects" }: { children: ReactNode; variant?: "projects" | "process" }) {
  const stackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const stack = stackRef.current;
    if (!stack) return;
    const cards = Array.from(stack.querySelectorAll<HTMLElement>(variant === "process" ? ".work-process__step" : ".project-story__section"));
    const anchors = Array.from(stack.querySelectorAll<HTMLElement>(variant === "process" ? ".work-process__anchor" : ".project-story__anchor"));
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let frame = 0;
    let tops: number[] = [];

    const update = () => {
      frame = 0;
      if (reducedMotion.matches) return;
      const positions = anchors.map((anchor) => anchor.getBoundingClientRect().top);
      cards.forEach((card, index) => {
        const next = cards[index + 1];
        const settledTop = 104 + index * 12;
        const progress = next
          ? Math.min(1, Math.max(0, (window.innerHeight - positions[index + 1]) / (window.innerHeight - settledTop - 12)))
          : 0;
        const settledScale = 0.96 + index / cards.length * 0.025;
        card.style.setProperty("--stack-scale", String(1 - progress * (1 - settledScale)));
        card.style.setProperty("--stack-top", `${tops[index] + progress * (settledTop - tops[index])}px`);
      });
    };

    const scheduleUpdate = () => {
      if (!frame) frame = window.requestAnimationFrame(update);
    };

    const measure = () => {
      if (reducedMotion.matches) {
        delete stack.dataset.stacking;
        return;
      }
      // Read tall cards first, then settle them into fixed layers as the next arrives.
      tops = cards.map((card, index) => Math.min(104 + index * 12, window.innerHeight - card.offsetHeight - 24));
      cards.forEach((card, index) => {
        card.style.setProperty("--stack-top", `${tops[index]}px`);
        card.style.setProperty("--stack-layer", String(index + 1));
      });
      stack.dataset.stacking = "true";
      scheduleUpdate();
    };

    const resizeObserver = new ResizeObserver(measure);
    cards.forEach((card) => resizeObserver.observe(card));
    measure();
    window.addEventListener("scroll", scheduleUpdate, { passive: true });
    window.addEventListener("resize", measure);
    reducedMotion.addEventListener("change", measure);

    return () => {
      window.cancelAnimationFrame(frame);
      resizeObserver.disconnect();
      window.removeEventListener("scroll", scheduleUpdate);
      window.removeEventListener("resize", measure);
      reducedMotion.removeEventListener("change", measure);
      delete stack.dataset.stacking;
      cards.forEach((card) => {
        ["--stack-top", "--stack-layer", "--stack-scale"].forEach((property) => card.style.removeProperty(property));
      });
    };
  }, [variant]);

  return <div className="project-story__stack" ref={stackRef}>{children}</div>;
}
