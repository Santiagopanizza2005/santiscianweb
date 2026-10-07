import type { Language } from "./language-switcher";

export const projectDescriptions: Record<string, Record<Language, string[]>> = {
  "/ecohabit-video.mp4": {
    es: [
      "Junto a Mindpraxis, desarrollé Ecohabit como **una plataforma construida alrededor de un agente de IA**. Conecté el agente con la agenda, los objetivos, el conocimiento interno y las métricas comerciales para acompañar el trabajo y el aprendizaje de los vendedores.",
      "El agente puede **consultar datos, apoyar la creación de reportes y ejecutar acciones de gestión** mediante herramientas con permisos y confirmación. Construí también las interfaces donde el equipo revisa la información y los resultados: conversación, datos y operación forman parte del mismo sistema.",
    ],
    en: [
      "Together with Mindpraxis, I developed Ecohabit as **a platform built around an AI agent**. I connected the agent to the agenda, goals, internal knowledge and commercial metrics to support salespeople’s work and learning.",
      "The agent can **retrieve data, support report creation and perform management actions** through tools with permissions and confirmation. I also built the interfaces where the team reviews information and results: conversation, data and operations belong to the same system.",
    ],
  },
  "/izr-ivr-video.mp4": {
    es: [
      "Diseñé y desarrollé para Izrastzoff **un agente de voz integrado a su flujo de atención inmobiliaria**. Atiende fuera del horario laboral, distingue búsquedas de propiedades, pedidos de tasación y otras consultas, y reúne la información necesaria para el equipo.",
      "Conecté la conversación con **herramientas de registro, fichas de prospectos y notificaciones por correo**. El agente prepara la consulta para que un asesor humano continúe; el panel permite revisar llamadas, consumo de IA, actividad y configuración del servicio.",
    ],
    en: [
      "I designed and developed for Izrastzoff **a voice agent integrated into its real estate enquiry workflow**. It answers outside business hours, distinguishes property searches, valuation requests and other enquiries, and gathers the information the team needs.",
      "I connected conversation to **record-saving tools, prospect records and email notifications**. The agent prepares the enquiry for a human adviser to continue. The dashboard provides visibility into calls, AI usage, activity and service settings.",
    ],
  },
  "/mobi-video.mp4": {
    es: [
      "Desarrollé el panel de Mobihunter e integré **traducción de contenido con IA** en la gestión de juegos, preguntas y desafíos. El equipo genera versiones en español, inglés y portugués desde el editor, las revisa y decide qué guardar y publicar.",
      "Conecté ese flujo con la app y con **métricas de partidas, ingresos y abandono**. Es un caso de IA aplicada a una tarea concreta, con revisión humana e integración a los sistemas que sostienen la operación del negocio.",
    ],
    en: [
      "I developed Mobihunter’s dashboard and integrated **AI-powered content translation** into game, question and challenge management. The team generates Spanish, English and Portuguese versions in the editor, reviews them and decides what to save and publish.",
      "I connected that workflow to the app and **session, revenue and drop-off metrics**. It is a case of AI applied to a specific task, with human review and integration into the systems that support business operations.",
    ],
  },
  "/mobicelular-video.mp4": {
    es: [
      "Desarrollé la experiencia móvil de Mobihunter conectando **el contenido preparado y traducido con IA en el panel** con el catálogo, las preguntas y los desafíos que recibe el jugador. Las versiones guardadas se presentan en el idioma elegido por el usuario.",
      "Integré acceso, progreso, resultados y ranking con **los datos de gestión del negocio**. La app completa el recorrido: el contenido llega al jugador y sus partidas alimentan las métricas que consulta el equipo en el panel.",
    ],
    en: [
      "I developed Mobihunter’s mobile experience by connecting **content prepared and translated with AI in the dashboard** to the catalogue, questions and challenges players receive. Saved versions are presented in the user’s chosen language.",
      "I integrated access, progress, results and rankings with **business management data**. The app completes the journey: content reaches players and their sessions feed the metrics the team reviews in the dashboard.",
    ],
  },
};
