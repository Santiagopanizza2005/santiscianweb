import type { Metadata } from "next";
import { ToolsPage } from "../components/tools-page";

export const metadata: Metadata = { title: "Herramientas | Santi Scian" };

export default async function Page({ searchParams }: { searchParams: Promise<{ lang?: string }> }) {
  const { lang } = await searchParams;
  return <ToolsPage initialLanguage={lang === "en" ? "en" : "es"} />;
}
