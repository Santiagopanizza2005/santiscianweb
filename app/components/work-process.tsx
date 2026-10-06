import type { Language } from "./language-switcher";
import { Fragment } from "react";
import { ProjectStoryStack } from "./project-story-stack";

const illustrations = [
  { path: "M21 11.5a8.4 8.4 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.4 8.4 0 0 1-3.8-.9L3 21l1.9-5.7a8.4 8.4 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.4 8.4 0 0 1 3.8-.9H13a8.5 8.5 0 0 1 8 8v.5Z", es: ["Contame tu idea", "Escuchar"], en: ["Tell me your idea", "Listen"] },
  { path: "M9 18h6M10 22h4M8.1 14.5a6 6 0 1 1 7.8 0C14.8 15.4 15 17 15 18H9c0-1 .2-2.6-.9-3.5Z", es: ["Una solución a medida", "Propuesta"], en: ["A tailored solution", "Proposal"] },
  { path: "M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6ZM14 2v6h6M8 13h8M8 17h6", es: ["El plan de tu proyecto", "Hoja de ruta"], en: ["Your project plan", "Roadmap"] },
  { path: "m8 6-6 6 6 6m8-12 6 6-6 6m-3-15-2 18", es: ["Tu idea toma forma", "Desarrollo"], en: ["Your idea takes shape", "Development"] },
  { path: "m9 12 2 2 4-4M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z", es: ["Listo para usar", "Entrega"], en: ["Ready to use", "Delivery"] },
  { path: "M3 14v-3a9 9 0 0 1 18 0v3M5 12H3v7h4v-7H5Zm14 0h2v7h-4v-7h2Zm2 7v1a2 2 0 0 1-2 2h-5", es: ["Seguimos en contacto", "1 mes gratis"], en: ["We stay in touch", "1 month free"] },
];

const content = {
  es: {
    heading: "Cómo trabajo",
    steps: [
      { title: "Primero entiendo tu problema", description: "Conversamos sobre lo que necesitás, cómo trabajás hoy y qué querés mejorar." },
      { title: "Te propongo una solución", description: "Te presento una propuesta pensada para resolver ese problema y adaptarse a tu empresa." },
      { title: "Presupuesto y hoja de ruta", description: "Definimos el alcance, el presupuesto y los pasos del proyecto antes de empezar." },
      { title: "Comienzo a desarrollar", description: "Construyo la solución y comparto los avances para que puedas seguir el proceso." },
      { title: "Entrega del proyecto", description: "Probamos el resultado y te entrego el proyecto listo para usar, con lo necesario para empezar." },
      { title: "Un mes de soporte gratis", description: "Después de la entrega, te acompaño durante un mes para resolver dudas y atender los problemas que puedan surgir." },
    ],
  },
  en: {
    heading: "How I work",
    steps: [
      { title: "First, I understand your problem", description: "We discuss what you need, how you work today and what you want to improve." },
      { title: "I propose a solution", description: "I present a proposal designed to solve that problem and fit your business." },
      { title: "Quote and roadmap", description: "We agree on the scope, budget and project steps before getting started." },
      { title: "Development begins", description: "I build the solution and share progress so you can follow the process." },
      { title: "Project delivery", description: "We test the result and I deliver the project ready to use, with what you need to get started." },
      { title: "One month of free support", description: "After delivery, I support you for a month to answer questions and address any issues that arise." },
    ],
  },
};

export function WorkProcess({ language }: { language: Language }) {
  const text = content[language];

  return (
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
  );
}
