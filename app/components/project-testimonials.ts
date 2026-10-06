import type { Language } from "./language-switcher";

// Draft testimonial copy requested for the design; pending validation by each person.
export const projectTestimonials: Record<string, { name: string; role: string; text: Record<Language, string> }> = {
  "/ecohabit-video.mp4": {
    name: "Marcelo",
    role: "Founder @Mindpraxis",
    text: {
      es: "Santi entendió muy bien lo que queríamos lograr con Ecohabit y lo convirtió en una herramienta simple de usar. Destaco su capacidad para escuchar, proponer soluciones y cuidar los detalles en cada etapa del proyecto.",
      en: "Santi understood what we wanted to achieve with Ecohabit and turned it into an easy-to-use tool. I especially value his ability to listen, suggest solutions and pay attention to detail at every stage of the project.",
    },
  },
  "/izr-ivr-video.mp4": {
    name: "Iuri",
    role: "CEO @Izrastzoff",
    text: {
      es: "Necesitábamos una forma de atender las consultas cuando nuestro equipo no estaba disponible. Santi entendió el desafío y desarrolló un agente de voz pensado para nuestra operación, con un panel claro para seguir las llamadas y retomar cada contacto.",
      en: "We needed a way to handle enquiries when our team was unavailable. Santi understood the challenge and built a voice agent around our operations, with a clear dashboard to track calls and follow up on each contact.",
    },
  },
  "/mobi-video.mp4": {
    name: "Mauri",
    role: "Co-founder @Mindpraxis",
    text: {
      es: "Santi logró reunir la gestión de Mobihunter en un panel claro y práctico. Supo ordenar nuestras ideas y convertirlas en una herramienta que facilita administrar los juegos, organizar el contenido y entender lo que pasa en cada partida.",
      en: "Santi brought Mobihunter’s management tools together in a clear, practical dashboard. He organized our ideas into a tool that makes it easier to manage games, organize content and understand what happens in each session.",
    },
  },
  "/mobicelular-video.mp4": {
    name: "Mauri",
    role: "Co-founder @Mindpraxis",
    text: {
      es: "Queríamos que jugar en Mobihunter fuera una experiencia sencilla y entretenida. Santi cuidó cada paso de la app, desde elegir un juego hasta completar los desafíos y consultar el ranking, manteniendo todo conectado con nuestro panel de gestión.",
      en: "We wanted playing Mobihunter to feel simple and fun. Santi paid attention to every step in the app, from choosing a game to completing challenges and checking the rankings, keeping everything connected to our management dashboard.",
    },
  },
};
