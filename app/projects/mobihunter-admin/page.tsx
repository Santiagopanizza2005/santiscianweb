import type { Metadata } from "next";
import { ProjectStory } from "../../components/project-story";
import { ProjectVideo } from "../../components/project-video";

export const metadata: Metadata = { title: "Mobihunter Admin | Santi Scian" };

export default async function ProjectPage({ searchParams }: { searchParams: Promise<{ lang?: string }> }) {
  const { lang } = await searchParams;
  const subtitle = lang === "en" ? "AI integrated into content operations." : "IA integrada a la gestión de contenido.";
  return (
    <>
      <ProjectVideo language={lang === "en" ? "en" : "es"} subtitle={subtitle} name="Mobihunter Admin" src="/mobi-video.mp4" />
      <ProjectStory project="mobihunter-admin" language={lang === "en" ? "en" : "es"} />
    </>
  );
}
