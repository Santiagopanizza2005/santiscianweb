import type { Metadata } from "next";
import { ProjectStory } from "../../components/project-story";
import { ProjectVideo } from "../../components/project-video";

export const metadata: Metadata = { title: "Ecohabit | Santi Scian" };

export default async function ProjectPage({ searchParams }: { searchParams: Promise<{ lang?: string }> }) {
  const { lang } = await searchParams;
  const subtitle = lang === "en" ? "An agent for your sales team." : "Un agente para tu equipo de ventas.";
  return (
    <>
      <ProjectVideo language={lang === "en" ? "en" : "es"} subtitle={subtitle} name="Ecohabit" src="/ecohabit-video.mp4" />
      <ProjectStory project="ecohabit" language={lang === "en" ? "en" : "es"} />
    </>
  );
}
