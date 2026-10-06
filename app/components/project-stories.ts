type Copy = { es: string; en: string };
type StoryImage = { file: string; width: number; height: number; alt: Copy };
type StorySection = {
  layout: "split" | "reverse" | "wide-top" | "phones" | "phones-reverse";
  label: Copy;
  title: Copy;
  paragraphs: Copy[];
  images: StoryImage[];
};
type Story = { headline: Copy; introduction: Copy; sections: StorySection[]; closingTitle: Copy; closing: Copy };
const copy = (es: string, en: string): Copy => ({ es, en });
const desktop = (file: string, es: string, en: string): StoryImage => ({ file, width: file === "mind2" ? 2871 : 2880, height: 1800, alt: copy(es, en) });
const phone = (file: string, es: string, en: string): StoryImage => ({ file, width: ({ mobi2: 1236, mobi4: 1241, mobi6: 1241, mobi7: 1245 } as Record<string, number>)[file] ?? 1242, height: 2688, alt: copy(es, en) });

export const projectStories = {
  ecohabit: {
    headline: copy("De una tarea pendiente a un hábito que crece.", "From a pending task to a growing habit."),
    introduction: copy("Junto a Mindpraxis, desarrollé Ecohabit para conectar **el trabajo diario de los vendedores con su aprendizaje**. El desafío era reunir lo que una persona necesita hacer, lo que está aprendiendo y lo que su equipo necesita medir, sin convertirlo en otra herramienta difícil de usar.", "Together with Mindpraxis, I developed Ecohabit to connect **salespeople’s daily work with their learning**. The challenge was bringing tasks, learning and team measurement together without creating another difficult tool."),
    sections: [
      {
        layout: "split", label: copy("El día a día", "Everyday work"), title: copy("Saber por dónde empezar.", "Know where to start."),
        paragraphs: [copy("Diseñé un inicio que reúne **objetivos, tareas del día y evolución de los hábitos**. La información deja de estar repartida entre distintas pantallas: el vendedor puede entender qué tiene pendiente y cómo viene avanzando.", "I designed a home screen that brings together **goals, today’s tasks and habit progress**. Instead of searching through separate screens, a salesperson can see what needs attention and how they are progressing."), copy("El chat forma parte de ese mismo espacio. No es una conversación aislada: tiene herramientas para consultar la agenda, los objetivos y el contexto de trabajo.", "The chat belongs to this same workspace. It is connected to tools that can consult the agenda, goals and work context.")],
        images: [desktop("mind2", "Inicio de Ecohabit con objetivos, tareas y evolución semanal", "Ecohabit home with goals, tasks and weekly progress")],
      },
      {
        layout: "wide-top", label: copy("Inteligencia artificial", "Artificial intelligence"), title: copy("Preguntar. Entender. Pasar a la acción.", "Ask. Understand. Take action."),
        paragraphs: [copy("Desarrollé un asistente que conecta la conversación con **herramientas y datos de la empresa**. Una consulta sobre productividad puede convertirse en un reporte, en lugar de terminar en una respuesta genérica.", "I developed an assistant that connects conversation with **company tools and data**. A productivity question can become a report rather than a generic answer."), copy("Las respuestas se muestran mientras se generan y las herramientas disponibles respetan los permisos del usuario. Así, el acceso a información sigue las mismas reglas que el resto de la plataforma.", "Responses appear as they are generated, and the available tools respect user permissions. Access to information follows the same rules as the rest of the platform.")],
        images: [desktop("mind3", "Asistente de Ecohabit generando un reporte de productividad", "Ecohabit assistant generating a productivity report")],
      },
      {
        layout: "reverse", label: copy("Agenda y hábitos", "Agenda and habits"), title: copy("La constancia también se diseña.", "Consistency can be designed."),
        paragraphs: [copy("Unifiqué **rutinas, tareas, formularios y eventos** en una agenda ordenada por fecha. La idea es que el vendedor encuentre el próximo paso sin tener que reconstruir su día a partir de mensajes o recordatorios sueltos.", "I brought **routines, tasks, forms and events** into a date-based agenda. Salespeople can find their next step without piecing the day together from scattered messages and reminders.")],
        images: [desktop("mind4", "Agenda de Ecohabit con tareas, hábitos y eventos por fecha", "Ecohabit agenda showing tasks, habits and events by date")],
      },
      {
        layout: "split", label: copy("Experiencia personal", "Personal experience"), title: copy("Una herramienta que se siente propia.", "A workspace that feels personal."),
        paragraphs: [copy("Incorporé opciones de **personalización visual** para adaptar la apariencia del espacio de trabajo. Elegir colores y modo de visualización es una decisión pequeña que acompaña una experiencia pensada para usarse todos los días.", "I added **visual customization** so people can adapt their workspace. Color and display preferences support an experience designed for everyday use.")],
        images: [desktop("mind5", "Opciones de personalización de colores en Ecohabit", "Ecohabit color customization options")],
      },
      {
        layout: "wide-top", label: copy("Gestión de equipos", "Team management"), title: copy("Simple para quien vende. Completo para quien gestiona.", "Simple for salespeople. Complete for managers."),
        paragraphs: [copy("Construí el entorno de gestión para organizar **usuarios, roles, sucursales y actividades**. Las rutinas, evaluaciones y desafíos conviven con la gestión comercial dentro de una misma plataforma.", "I built the management workspace to organize **users, roles, branches and activities**. Routines, assessments and challenges share the same platform with commercial management."), copy("Los permisos se verifican también en el servidor. No alcanza con ocultar un botón: cada operación debe comprobar que la persona puede realizarla.", "Permissions are checked on the server too. Hiding a button is not enough: each operation must verify that the person is allowed to perform it.")],
        images: [desktop("mind6", "Entorno de gestión de Ecohabit y herramientas de administración", "Ecohabit management workspace and administration tools")],
      },
      {
        layout: "reverse", label: copy("Datos comerciales", "Commercial data"), title: copy("Ver el resultado. Entender el recorrido.", "See results. Understand the journey."),
        paragraphs: [copy("Desarrollé vistas que reúnen **facturación, tickets, unidades y cumplimiento de objetivos**. La información por fecha permite comparar períodos y observar cómo evoluciona el trabajo comercial.", "I developed views that bring together **revenue, tickets, units and goal completion**. Date-based information makes it possible to compare periods and follow commercial progress."), copy("Mi foco fue transformar registros en una lectura útil: que el equipo pueda identificar qué necesita atención y acompañar a sus vendedores con contexto.", "My focus was turning records into useful information, so managers can identify what needs attention and support salespeople with context.")],
        images: [desktop("mind7", "Tabla de métricas comerciales y objetivos de Ecohabit", "Ecohabit commercial metrics and goals table")],
      },
      {
        layout: "wide-top", label: copy("Aprendizaje", "Learning"), title: copy("El desarrollo de un equipo también se puede observar.", "Team development can be observed too."),
        paragraphs: [copy("Los formularios y las evaluaciones permiten comparar respuestas y seguir **el aprendizaje de cada vendedor**. Complementan las métricas de venta: no solo importa el resultado comercial, también qué habilidades y hábitos se están construyendo.", "Forms and assessments make it possible to compare responses and follow **each salesperson’s learning**. They complement sales metrics: results matter, but so do the skills and habits being built.")],
        images: [desktop("mind8", "Comparación de respuestas y evaluaciones de vendedores en Ecohabit", "Comparison of salesperson responses and assessments in Ecohabit")],
      },
    ],
    closingTitle: copy("Una plataforma conectada, de punta a punta.", "A connected platform, end to end."),
    closing: copy("Desarrollé la interfaz y la lógica de la plataforma con **Next.js y TypeScript**, una base de datos con permisos y un asistente con herramientas para consultar información. El trabajo fue conectar esas piezas para que la IA, la agenda y la gestión respondan al mismo contexto de empresa y usuario.", "I developed the interface and platform logic with **Next.js and TypeScript**, a database with permissions and an assistant with information tools. The work was connecting these pieces so AI, the agenda and management share the same company and user context."),
  },
  izr: {
    headline: copy("Que una llamada fuera de horario no termine en una oportunidad perdida.", "An after-hours call should not become a missed opportunity."),
    introduction: copy("Desarrollé un **agente de voz para Izrastzoff** que atiende fuera del horario laboral, identifica el motivo de la consulta y reúne los datos que necesita el equipo inmobiliario. La conversación es solo el comienzo: detrás construí el sistema para registrar, clasificar y entregar esa información.", "I developed a **voice agent for Izrastzoff** that answers outside business hours, identifies the reason for the call and gathers the information the real estate team needs. The conversation is only the beginning: I also built the system to record, classify and deliver that information."),
    sections: [
      {
        layout: "wide-top", label: copy("Operación", "Operations"), title: copy("Un agente que atiende. Un equipo que puede supervisarlo.", "An agent that answers. A team that can oversee it."),
        paragraphs: [copy("Construí un panel que reúne **el estado del agente, las llamadas y la actividad reciente**. La atención automática necesita visibilidad: el equipo debe poder saber qué está pasando sin entrar en herramientas técnicas.", "I built a dashboard bringing together **agent status, calls and recent activity**. Automated answering needs visibility: the team should know what is happening without using technical tools."), copy("El agente diferencia búsquedas de propiedades, consultas de tasación y otros motivos. Esa clasificación define qué información necesita pedir durante la conversación.", "The agent distinguishes property searches, valuation requests and other enquiries. This classification determines what information it needs to gather during the conversation.")],
        images: [desktop("izr1", "Panel de Izrastzoff con estado del agente y actividad de llamadas", "Izrastzoff dashboard with agent status and call activity")],
      },
      {
        layout: "reverse", label: copy("Métricas", "Metrics"), title: copy("Automatizar sin perder visibilidad.", "Automate while staying informed."),
        paragraphs: [copy("El panel de métricas permite revisar **volumen de llamadas, duración y consumo de IA**. Así, la operación no queda como una caja negra: se puede observar su uso y entender el costo del servicio.", "The metrics dashboard shows **call volume, duration and AI usage**. The operation is not a black box: its activity and service cost can be reviewed."), copy("Registré la información de las conversaciones y su consumo para alimentar estas vistas con datos del sistema.", "I recorded conversation information and usage to supply these views with system data.")],
        images: [desktop("izr2", "Métricas de llamadas, duración y gasto de IA de Izrastzoff", "Izrastzoff call, duration and AI cost metrics")],
      },
      {
        layout: "split", label: copy("Seguimiento comercial", "Commercial follow-up"), title: copy("Del teléfono a una consulta lista para continuar.", "From a call to an enquiry ready for follow-up."),
        paragraphs: [copy("Convertí cada conversación en **un prospecto con datos estructurados**: contacto, motivo, resumen y detalles de la consulta. El asesor puede retomar la atención con contexto, sin tener que escuchar toda la llamada para entender qué necesita la persona.", "I turned each conversation into **a prospect with structured information**: contact details, purpose, summary and enquiry details. Advisers can pick up with context rather than listening to the whole call."), copy("El sistema conserva datos mientras la llamada avanza y consolida el registro al finalizar. La conversación y la información comercial quedan conectadas.", "The system retains information during the call and consolidates the record when it ends. The conversation and commercial information stay connected.")],
        images: [desktop("izr3", "Listado de prospectos y motivos de consulta de Izrastzoff", "Izrastzoff prospects and enquiry categories")],
      },
      {
        layout: "wide-top", label: copy("Distribución", "Distribution"), title: copy("La información tiene que llegar a la persona correcta.", "Information must reach the right person."),
        paragraphs: [copy("Desarrollé la configuración de destinatarios para distribuir los correos según **el tipo de consulta**. Una búsqueda y una tasación pueden requerir equipos distintos; el sistema contempla esa diferencia.", "I developed recipient settings to route emails according to **enquiry type**. A property search and a valuation may need different teams, and the system accounts for that."), copy("El registro de la consulta se conserva aunque falle el envío del correo. La persistencia de los datos y la notificación son pasos separados para que un error de entrega no borre una oportunidad.", "The enquiry remains saved even if email delivery fails. Data storage and notification are separate steps, so a delivery error does not erase an opportunity.")],
        images: [desktop("izr4", "Configuración de destinatarios de correos según consulta inmobiliaria", "Email recipient settings by real estate enquiry type")],
      },
      {
        layout: "reverse", label: copy("Control del servicio", "Service controls"), title: copy("La tecnología al servicio de la operación.", "Technology that supports operations."),
        paragraphs: [copy("El equipo puede **activar la atención y elegir o probar la voz** desde una interfaz clara. Estas decisiones operativas dejan de depender de cambios en el código.", "The team can **enable answering and select or test the voice** through a clear interface. These operational choices do not require code changes."), copy("Detrás integré la telefonía con audio en tiempo real y el modelo de voz. El agente puede escuchar, responder y manejar interrupciones durante la conversación.", "Behind the interface, I integrated telephony, real-time audio and the voice model. The agent can listen, respond and handle interruptions during conversation.")],
        images: [desktop("izr5", "Configuración y prueba de voz del agente de Izrastzoff", "Izrastzoff agent voice settings and preview")],
      },
    ],
    closingTitle: copy("No solo una voz: un circuito completo de atención.", "More than a voice: a complete enquiry workflow."),
    closing: copy("Conecté **telefonía SIP/Asterisk, una IA de voz en tiempo real, PostgreSQL y correo electrónico** con un panel web. Cada parte cumple una función: conversar, conservar la consulta, entregarla al equipo y hacer visible la operación. El resultado es un flujo que continúa después de colgar.", "I connected **SIP/Asterisk telephony, real-time voice AI, PostgreSQL and email** with a web dashboard. Each part has a purpose: converse, preserve the enquiry, deliver it to the team and make operations visible. The workflow continues after the caller hangs up."),
  },
  "mobihunter-admin": {
    headline: copy("Detrás de cada aventura, un equipo con el control.", "Behind every adventure, a team in control."),
    introduction: copy("Desarrollé el panel de Mobihunter para que el equipo pueda **crear experiencias y gestionar su operación** desde un mismo lugar. No se trata solo de cargar preguntas: también hay que comprender cómo se juega, qué ingresos genera cada experiencia y en qué parte se interrumpe el recorrido.", "I developed Mobihunter’s dashboard so the team can **create experiences and manage operations** in one place. Beyond adding questions, they need to understand how people play, what revenue each experience generates and where participation stops."),
    sections: [
      {
        layout: "split", label: copy("Centro de gestión", "Management hub"), title: copy("Todo empieza con una estructura clara.", "It starts with a clear structure."),
        paragraphs: [copy("Organicé el panel alrededor de las tareas del equipo: **juegos, preguntas, métricas e ingresos**. Cada área tiene su lugar y comparte la información con la experiencia que ve el jugador.", "I organized the dashboard around the team’s tasks: **games, questions, metrics and revenue**. Each area has its place and shares information with the player experience.")],
        images: [desktop("mobiadmin1", "Inicio del panel de administración de Mobihunter", "Mobihunter administration home")],
      },
      {
        layout: "wide-top", label: copy("Experiencia de juego", "Gameplay experience"), title: copy("Entender cómo se juega para saber qué mejorar.", "Understand play to know what to improve."),
        paragraphs: [copy("Construí métricas para revisar **participación, tiempos, respuestas y ayudas**. Los gráficos dan una lectura general y la tabla permite bajar al detalle de las partidas.", "I built metrics to review **participation, timing, answers and hints**. Charts give an overview, while the table provides session-level detail."), copy("Los filtros permiten acotar el análisis por juego y período. Así, el equipo puede estudiar una experiencia concreta sin mezclarla con el resto del catálogo.", "Filters narrow the analysis by game and period, allowing the team to study a specific experience without mixing it with the entire catalogue.")],
        images: [desktop("mobiadmin2", "Métricas de participación y partidas de Mobihunter", "Mobihunter participation and game-session metrics")],
      },
      {
        layout: "reverse", label: copy("Ingresos", "Revenue"), title: copy("El negocio también necesita una pantalla propia.", "The business needs its own view too."),
        paragraphs: [copy("Desarrollé una vista de **ganancias basada en las compras registradas**, con filtros y detalle de movimientos. Permite seguir los ingresos de las experiencias y consultar las operaciones que los componen.", "I developed a **revenue view based on recorded purchases**, with filters and transaction details. It lets the team follow experience revenue and inspect the transactions behind it.")],
        images: [desktop("mobiadmin3", "Panel de ganancias y compras de Mobihunter", "Mobihunter revenue and purchases dashboard")],
      },
      {
        layout: "split", label: copy("Abandono", "Drop-off"), title: copy("Lo que no se termina también cuenta.", "Unfinished experiences matter too."),
        paragraphs: [copy("Separé el seguimiento de **compras que no terminaron en una partida completada**. Mirar solo los resultados finales dejaría afuera una parte importante del recorrido.", "I added separate tracking for **purchases that did not lead to a completed session**. Looking only at final results would miss an important part of the journey."), copy("Esta vista ayuda a detectar casos para revisar. Los datos muestran dónde investigar; no sustituyen la conversación con los usuarios ni explican por sí solos el motivo del abandono.", "This view helps identify cases worth reviewing. Data shows where to investigate; it does not replace talking to users or explain the reasons for drop-off on its own.")],
        images: [desktop("mobiadmin4", "Seguimiento de abandono y partidas sin completar en Mobihunter", "Mobihunter drop-off and incomplete-session tracking")],
      },
      {
        layout: "wide-top", label: copy("Contenido", "Content"), title: copy("Crear el próximo juego sin empezar de cero.", "Create the next game without starting from scratch."),
        paragraphs: [copy("Construí el catálogo para **crear, editar y activar juegos**, organizar sus consignas y gestionar el contenido. La publicación de una experiencia pasa por el panel, sin tener que rehacer la aplicación para cada aventura.", "I built the catalogue to **create, edit and activate games**, organize challenges and manage content. Experiences are published through the dashboard without rebuilding the app for each adventure.")],
        images: [desktop("mobiadmin5", "Catálogo de juegos con edición y activación en Mobihunter", "Mobihunter game catalogue with editing and activation")],
      },
      {
        layout: "reverse", label: copy("Reglas de juego", "Game rules"), title: copy("Cada pregunta tiene una lógica detrás.", "Every question has logic behind it."),
        paragraphs: [copy("Desarrollé la gestión de preguntas y **respuestas admitidas**, contemplando distintos tipos de contenido. El equipo define qué se pregunta y cómo se valida la respuesta; el jugador encuentra esa lógica dentro de su partida.", "I developed question management and **accepted-answer rules**, supporting different content types. The team defines questions and validation, and players encounter that logic during their session.")],
        images: [desktop("mobiadmin6", "Gestión de preguntas y respuestas aceptadas de Mobihunter", "Mobihunter question and accepted-answer management")],
      },
    ],
    closingTitle: copy("Una misma base para crear, jugar y medir.", "One foundation to create, play and measure."),
    closing: copy("Desarrollé el panel con **Next.js, TypeScript y Firebase**, conectado a los datos que usa la app. La gestión de contenido, las compras y los resultados forman parte del mismo sistema: el equipo administra la experiencia y puede observar lo que sucede cuando la gente la juega.", "I developed the dashboard with **Next.js, TypeScript and Firebase**, connected to the app’s data. Content management, purchases and results belong to the same system: the team manages experiences and can observe what happens when people play them."),
  },
  "mobihunter-app": {
    headline: copy("El celular como puerta de entrada a una aventura.", "A phone becomes the gateway to an adventure."),
    introduction: copy("Desarrollé la experiencia de Mobihunter para acompañar al jugador **desde la elección de un juego hasta su resultado final**. El objetivo fue conectar descubrimiento, acceso, desafíos y progreso con una interfaz pensada para el celular.", "I developed Mobihunter’s player experience to guide people **from choosing a game to their final results**. The goal was to connect discovery, access, challenges and progress through an interface designed for phones."),
    sections: [
      {
        layout: "phones", label: copy("Elegir la aventura", "Choose an adventure"), title: copy("Antes de jugar, saber qué te espera.", "Know what awaits before you play."),
        paragraphs: [copy("Construí el catálogo y la ficha de cada experiencia para mostrar **ubicación, duración, descripción e instrucciones**. Las dos pantallas cuentan el mismo paso del recorrido: descubrir una propuesta y entenderla antes de empezar.", "I built the catalogue and experience details to show **location, duration, description and instructions**. These two screens serve the same step: discover an experience and understand it before starting."), copy("La descarga y el acceso forman parte de la ficha. La información del juego viene del panel de administración, manteniendo conectados el contenido y la experiencia del jugador.", "Download and access belong to the detail screen. Game information comes from the administration dashboard, keeping content and player experience connected.")],
        images: [phone("mobi2", "Tarjetas de experiencias y juegos de Mobihunter", "Mobihunter experience and game cards"), phone("mobi3", "Ficha de un juego de Mobihunter con descripción e instrucciones", "Mobihunter game details with description and instructions")],
      },
      {
        layout: "phones-reverse", label: copy("Acceso compartido", "Shared access"), title: copy("Una invitación que cabe en un QR.", "An invitation that fits in a QR code."),
        paragraphs: [copy("Incorporé **un código QR y opciones para compartir el enlace** del juego. El acceso se puede abrir desde otro celular sin buscar manualmente la experiencia dentro del catálogo.", "I added **a QR code and link-sharing options** for each game. Another phone can open the experience without manually searching the catalogue.")],
        images: [phone("mobi4", "Código QR y opciones para compartir un juego de Mobihunter", "QR code and sharing options for a Mobihunter game")],
      },
      {
        layout: "phones", label: copy("Exploración", "Exploration"), title: copy("¿Adónde vamos hoy?", "Where are we going today?"),
        paragraphs: [copy("La pantalla principal reúne **búsqueda, categorías y juegos disponibles**. Diseñé una navegación que permite recorrer las propuestas y volver a las secciones principales desde la barra inferior.", "The home screen brings together **search, categories and available games**. I designed navigation that supports exploring experiences and returning to main sections through the bottom bar."), copy("Cada tarjeta comunica lo esencial antes de entrar a la ficha. La elección de una aventura empieza con información que se puede leer de un vistazo.", "Each card communicates the essentials before opening the detail screen. Choosing an adventure starts with information that can be understood at a glance.")],
        images: [phone("mobi5", "Inicio de Mobihunter con búsqueda, categorías y navegación inferior", "Mobihunter home with search, categories and bottom navigation")],
      },
      {
        layout: "phones-reverse", label: copy("Resultados y comunidad", "Results and community"), title: copy("Terminar la partida. Ver hasta dónde llegaste.", "Finish the game. See how far you got."),
        paragraphs: [copy("Al finalizar, el jugador puede revisar **tiempo, respuestas correctas, errores y ayudas utilizadas**. Después, el ranking conecta su resultado con el de otras personas.", "After finishing, players can review **time, correct answers, mistakes and hints used**. The ranking then connects their result with other players’ performance."), copy("Estas dos pantallas cierran el mismo recorrido: entender el desempeño, comparar la posición y valorar la experiencia. Los resultados también alimentan las métricas que consulta el equipo en el admin.", "These two screens close the same journey: understand performance, compare placement and rate the experience. Results also feed the metrics the team reviews in the dashboard.")],
        images: [phone("mobi6", "Resumen de partida con tiempo, respuestas y ayudas de Mobihunter", "Mobihunter session summary with time, answers and hints"), phone("mobi7", "Ranking de jugadores y valoración de una experiencia de Mobihunter", "Mobihunter player ranking and experience rating")],
      },
    ],
    closingTitle: copy("La experiencia y su gestión, conectadas.", "Player experience and management, connected."),
    closing: copy("Construí una aplicación web orientada al celular con **Next.js, TypeScript y Firebase**. Conecté el catálogo, la validación de respuestas, el progreso y los resultados con el panel de gestión. Una misma experiencia tiene dos perspectivas: la de quien juega y la de quien la hace posible.", "I built a mobile-focused web application with **Next.js, TypeScript and Firebase**. I connected the catalogue, answer validation, progress and results with the management dashboard. The same experience has two perspectives: the player’s and the team’s."),
  },
} satisfies Record<string, Story>;

export type ProjectStoryKey = keyof typeof projectStories;
