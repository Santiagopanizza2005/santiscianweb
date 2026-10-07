import type { Language } from "./language-switcher";
import { Fragment } from "react";
import { ProjectStoryStack } from "./project-story-stack";
import { ServiceTimeline } from "./service-timeline";

const illustrations = [
  { path: "M21 11.5a8.4 8.4 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.4 8.4 0 0 1-3.8-.9L3 21l1.9-5.7a8.4 8.4 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.4 8.4 0 0 1 3.8-.9H13a8.5 8.5 0 0 1 8 8v.5Z", es: ["Conocemos tu operación", "Discover"], en: ["Understanding your business", "Discover"] },
  { path: "M9 18h6M10 22h4M8.1 14.5a6 6 0 1 1 7.8 0C14.8 15.4 15 17 15 18H9c0-1 .2-2.6-.9-3.5Z", es: ["Dónde tiene sentido la IA", "Discover"], en: ["Where AI makes sense", "Discover"] },
  { path: "M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6ZM14 2v6h6M8 13h8M8 17h6", es: ["El alcance del agente", "Build"], en: ["Your agent's scope", "Build"] },
  { path: "m8 6-6 6 6 6m8-12 6 6-6 6m-3-15-2 18", es: ["Un agente a medida", "Build"], en: ["A tailored agent", "Build"] },
  { path: "m9 12 2 2 4-4M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z", es: ["Integrado a tus sistemas", "Build"], en: ["Connected to your systems", "Build"] },
  { path: "M3 14v-3a9 9 0 0 1 18 0v3M5 12H3v7h4v-7H5Zm14 0h2v7h-4v-7h2Zm2 7v1a2 2 0 0 1-2 2h-5", es: ["Seguimiento y mejora", "Operate"], en: ["Monitoring and improvement", "Operate"] },
];

const content = {
  es: {
    heading: "Cómo trabajamos",
    steps: [
      { title: "Entendemos tu empresa", description: "Conocemos cómo trabaja tu equipo, qué sistemas usa y qué problema querés resolver. Si ya tenés una idea clara, partimos de ella." },
      { title: "Evaluamos dónde sirve la IA", description: "Analizamos qué puede resolver un agente y qué no. Si aporta valor, detectamos oportunidades y definimos cuál conviene construir." },
      { title: "Definimos el alcance y la hoja de ruta", description: "Acordamos qué hará el agente, sus límites, las integraciones, el presupuesto y cómo vamos a medir los resultados." },
      { title: "Diseñamos y construimos el agente", description: "Desarrollamos el agente a medida, compartimos avances y validamos su funcionamiento junto a tu equipo." },
      { title: "Lo integramos a tu operación", description: "Conectamos el agente con tus sistemas, lo probamos con casos reales y acompañamos a tu equipo en la puesta en marcha." },
      { title: "Definimos su operación y mejora", description: "Acordamos cómo supervisar el agente, atender incidencias y mejorar su funcionamiento a partir de los resultados." },
    ],
  },
  en: {
    heading: "How we work",
    steps: [
      { title: "We understand your business", description: "We learn how your team works, which systems you use and what problem you want to solve. If you already have a clear idea, we start there." },
      { title: "We evaluate where AI helps", description: "We assess what an agent can solve and what it can't. If it adds value, we identify opportunities and define which agent makes sense to build." },
      { title: "We define the scope and roadmap", description: "We agree on the agent's tasks, limits, integrations, budget and how we will measure results." },
      { title: "We design and build the agent", description: "We develop a tailored agent, share progress and validate how it works alongside your team." },
      { title: "We integrate it into your operations", description: "We connect the agent to your systems, test it with real cases and support your team through launch." },
      { title: "We plan its operation and improvement", description: "We agree on how to monitor the agent, handle issues and improve its performance based on results." },
    ],
  },
};

export function WorkProcess({ language }: { language: Language }) {
  const text = content[language];

  return (
    <>
    <section className="work-process" id="como-trabajo" aria-labelledby="work-process-title">
      <h2 id="work-process-title">{text.heading}</h2>
      <ProjectStoryStack variant="process">
      <ol className="work-process__steps">
        {text.steps.map((step, index) => (
          <Fragment key={index}>
          <li className="work-process__anchor" aria-hidden="true" role="presentation" />
          <li className="work-process__step">
            <span className="work-process__number" aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
            <div className="work-process__illustration" aria-hidden="true">
              <span className="work-process__icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d={illustrations[index].path} /></svg>
              </span>
              <span className="work-process__preview-title">{illustrations[index][language][0]}</span>
              <span className="work-process__tag">{illustrations[index][language][1]}</span>
            </div>
            <div className="work-process__copy">
              <h3>{step.title}</h3>
              <p>{step.description}</p>
            </div>
          </li>
          </Fragment>
        ))}
      </ol>
      </ProjectStoryStack>
    </section>
    <ServiceTimeline language={language} />
    </>
  );
}
