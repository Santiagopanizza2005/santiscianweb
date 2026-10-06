import Image from "next/image";
import Link from "next/link";
import { Fragment } from "react";
import type { Language } from "./language-switcher";
import { projectStories, type ProjectStoryKey } from "./project-stories";
import { projectImages } from "./project-images";
import { ProjectStoryStack } from "./project-story-stack";

function RichText({ text }: { text: string }) {
  return text.split("**").map((part, index) => (
    <Fragment key={index}>{index % 2 ? <strong>{part}</strong> : part}</Fragment>
  ));
}

export function ProjectStory({ project, language }: { project: ProjectStoryKey; language: Language }) {
  const story = projectStories[project];

  return (
    <section className={`project-story project-story--${project}`} aria-label={language === "es" ? "El proyecto en detalle" : "Inside the project"}>
      <ProjectStoryStack>
      {story.sections.map((section) => (
        <Fragment key={section.images[0].file}>
        <div className="project-story__anchor" aria-hidden="true" />
        <section className="project-story__section">
          <div className={`project-story__images${section.images.length > 1 ? " project-story__images--group" : ""}${section.images[0].height > section.images[0].width ? " project-story__images--portrait" : ""}`}>
            {section.images.map((asset) => (
              <Image
                key={asset.file}
                src={projectImages[asset.file]}
                alt={asset.alt[language]}
                width={asset.width}
                height={asset.height}
                sizes={asset.height > asset.width ? "(max-width: 600px) 42vw, 304px" : "(max-width: 1000px) 92vw, 960px"}
              />
            ))}
          </div>
          <div className="project-story__copy">
            <h3>{section.label[language]}</h3>
            {section.paragraphs.map((paragraph, paragraphIndex) => <p key={paragraphIndex}><RichText text={paragraph[language]} /></p>)}
          </div>
        </section>
        </Fragment>
      ))}
      </ProjectStoryStack>
      <div className="project-story__invitation">
        <h3>{language === "es" ? "¿Te gustaría ser mi siguiente caso de éxito?" : "Would you like to be my next success story?"}</h3>
        <div className="project-story__invitation-actions">
          <Link className="secondary-cta" href={`/?lang=${language}`}>
            {language === "es" ? "No, quiero" : "No, thanks"}
          </Link>
          <Link className="primary-cta" href={`/contact?lang=${language}`}>
            {language === "es" ? "Sí, quiero" : "Yes, I want to"}
          </Link>
        </div>
      </div>
    </section>
  );
}
