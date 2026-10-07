import type { Metadata } from "next";
import { ProjectStory } from "../../components/project-story";
import { ProjectVideo } from "../../components/project-video";

export const metadata: Metadata = { title: "Mobihunter App | Santi Scian" };

export default async function ProjectPage({ searchParams }: { searchParams: Promise<{ lang?: string }> }) {
  const { lang } = await searchParams;
  const subtitle = lang === "en" ? "AI applied to a mobile experience." : "IA aplicada a una experiencia móvil.";
  return (
    <>
      <ProjectVideo language={lang === "en" ? "en" : "es"} subtitle={subtitle} name="Mobihunter App" src="/mobicelular-video.mp4" />
      <ProjectStory project="mobihunter-app" language={lang === "en" ? "en" : "es"} />
    </>
  );
}
