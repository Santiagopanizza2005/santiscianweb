"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { SiteHeader } from "./site-header";

export function ProjectHeader() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const language = searchParams.get("lang") === "en" ? "en" : "es";

  return <SiteHeader language={language} onToggle={() => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("lang", language === "es" ? "en" : "es");
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  }} />;
}
