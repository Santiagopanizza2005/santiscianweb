"use client";

import { useRouter } from "next/navigation";
import type { Language } from "./language-switcher";

export function BackButton({ language }: { language: Language }) {
  const router = useRouter();

  return (
    <button className="back-link" type="button" onClick={() => {
      if (window.history.length > 1) router.back();
      else router.push(`/?lang=${language}`);
    }}>
      <svg aria-hidden="true" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M19 12H5m7-7-7 7 7 7" />
      </svg>
      <span>{language === "es" ? "Volver" : "Back"}</span>
    </button>
  );
}
