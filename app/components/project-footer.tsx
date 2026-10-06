"use client";

import { useSearchParams } from "next/navigation";
import { SiteFooter } from "./site-footer";

export function ProjectFooter() {
  const language = useSearchParams().get("lang") === "en" ? "en" : "es";
  return <SiteFooter language={language} />;
}
