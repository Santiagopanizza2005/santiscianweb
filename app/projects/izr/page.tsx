import type { Metadata } from "next";
import { ProjectStory } from "../../components/project-story";
import { ProjectVideo } from "../../components/project-video";

export const metadata: Metadata = { title: "Izrastzoff | Santi Scian" };

export default async function ProjectPage({ searchParams }: { searchParams: Promise<{ lang?: string }> }) {
  const { lang } = await searchParams;
  const subtitle = lang === "en" ? "Their own voice agent." : "Su propio agente de voz.";
  return (
    <>
      <ProjectVideo language={lang === "en" ? "en" : "es"} subtitle={subtitle} name="Izrastzoff" src="/izr-ivr-video.mp4" />
      <ProjectStory project="izr" language={lang === "en" ? "en" : "es"} />
    </>
  );
}
