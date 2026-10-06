"use client";

import Link from "next/link";
import { useEffect, useRef, useState, type CSSProperties, type PointerEvent } from "react";
import type { Language } from "./language-switcher";

const PREVIEW_SECONDS = 10;

const projects: { name: string; slug: string; src: string; title?: Record<Language, string>; description?: Record<Language, string> }[] = [
  {
    name: "Ecohabit",
    slug: "ecohabit",
    src: "/ecohabit-video.mp4",
    title: { es: "Un coach para tus vendedores.", en: "A coach for your sales team." },
    description: {
      es: "Junto a Mindpraxis, desarrollé Ecohabit, una solución que permite a las empresas convertir las tareas de sus vendedores en hábitos. Ecohabit permite medir el aprendizaje y ayudar a los vendedores a desarrollar hábitos de forma progresiva.",
      en: "Together with Mindpraxis, I developed Ecohabit, a solution that helps companies turn their sales teams’ tasks into habits. Ecohabit measures learning and helps salespeople develop habits progressively.",
    },
  },
  {
    name: "Izrastzoff",
    slug: "izr",
    src: "/izr-ivr-video.mp4",
    title: { es: "Su propio agente de voz.", en: "Their own voice agent." },
    description: {
      es: "Desarrollé para Izrastoff, una agencia inmobiliaria, un agente de voz que atiende las llamadas de todas sus sucursales fuera del horario laboral. Así, la agencia puede responder consultas y evitar perder potenciales clientes cuando su equipo no está disponible.",
      en: "I developed a voice agent for Izrastoff, a real estate agency, that answers calls across all its branches outside business hours. It helps the agency respond to enquiries and avoid losing potential clients when its team is unavailable.",
    },
  },
  {
    name: "Mobihunter Admin",
    slug: "mobihunter-admin",
    src: "/mobi-video.mp4",
    title: { es: "El admin que todo juego necesita.", en: "The admin every game needs." },
    description: {
      es: "Desarrollé para Mobihunter un panel de administración que permite gestionar juegos, desafíos, preguntas, eventos y usuarios desde un solo lugar. También reúne métricas de las partidas, ingresos y tasas de abandono para que el equipo pueda seguir el rendimiento de sus juegos y mejorar la experiencia de los jugadores.",
      en: "I developed an admin panel for Mobihunter to manage games, challenges, questions, events and users in one place. It also brings together game metrics, revenue and abandonment rates so the team can track performance and improve the player experience.",
    },
  },
  {
    name: "Mobihunter App",
    slug: "mobihunter-app",
    src: "/appmobi-video.mp4",
    title: { es: "Una aventura en tu celular.", en: "An adventure on your phone." },
    description: {
      es: "Desarrollé la app de Mobihunter para que los jugadores puedan elegir sus juegos, resolver preguntas y completar desafíos desde el celular. La experiencia reúne el progreso de cada partida, los resultados y el ranking en un solo lugar, conectado con el panel de administración.",
      en: "I developed the Mobihunter app so players can choose games, answer questions and complete challenges on their phones. It brings together game progress, results and rankings in one place, connected to the admin panel.",
    },
  },
];

function getSlideDistance(viewport: HTMLDivElement) {
  const card = viewport.querySelector<HTMLElement>(".project-carousel__card");
  const track = viewport.querySelector<HTMLElement>(".project-carousel__track");
  return (card?.getBoundingClientRect().width ?? viewport.clientWidth) + (track ? parseFloat(getComputedStyle(track).gap) || 0 : 0);
}

export function ProjectCarousel({ language }: { language: Language }) {
  const [slide, setSlide] = useState(0);
  const controlsRef = useRef<HTMLDivElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const [controlsVisible, setControlsVisible] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState(0);
  const [slideDistance, setSlideDistance] = useState(1);
  const dragStart = useRef<{ x: number; y: number; id: number } | null>(null);
  const suppressClick = useRef(false);
  const [paused, setPaused] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const videos = useRef<(HTMLVideoElement | null)[]>([]);
  const previousSlide = useRef(-1);
  const advancing = useRef(false);
  const [playback, setPlayback] = useState(projects.map(() => ({ time: 0, duration: 0 })));
  const { time: currentTime, duration } = playback[slide];
  const progress = duration > 0 ? currentTime / duration * 100 : 0;
  const destination = Math.max(0, Math.min(projects.length - 1, slide + (dragOffset < 0 ? 1 : -1)));
  const gestureProgress = destination === slide ? 0 : Math.min(1, Math.abs(dragOffset) / slideDistance);

  const finishDrag = (event: PointerEvent<HTMLDivElement>, cancelled = false) => {
    const start = dragStart.current;
    if (!start || start.id !== event.pointerId) return;
    const distance = event.clientX - start.x;
    if (cancelled || Math.hypot(distance, event.clientY - start.y) > 8) suppressClick.current = true;
    if (!cancelled && Math.abs(distance) > 50 && Math.abs(distance) > Math.abs(event.clientY - start.y)) {
      setSlide((current) => Math.max(0, Math.min(projects.length - 1, current + (distance < 0 ? 1 : -1))));
    }
    dragStart.current = null;
    setIsDragging(false);
    setDragOffset(0);
  };

  useEffect(() => {
    const viewport = viewportRef.current;
    if (!viewport) return;
    let accumulated = 0;
    let gestureTimer = 0;
    let gestureSlide = 0;
    let distance = 1;
    let gesturing = false;

    const handleWheel = (event: WheelEvent) => {
      if (event.ctrlKey || dragStart.current || Math.abs(event.deltaX) <= Math.abs(event.deltaY)) return;
      event.preventDefault();
      if (!gesturing) {
        gesturing = true;
        gestureSlide = previousSlide.current;
        distance = getSlideDistance(viewport);
        setSlideDistance(distance);
        setIsDragging(true);
      }
      const unit = event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? viewport.clientWidth : 1;
      accumulated = Math.max(-distance, Math.min(distance, accumulated + event.deltaX * unit));
      const atEdge = (gestureSlide === 0 && accumulated < 0) || (gestureSlide === projects.length - 1 && accumulated > 0);
      if (atEdge) accumulated = 0;
      setDragOffset(-accumulated);
      window.clearTimeout(gestureTimer);
      gestureTimer = window.setTimeout(() => {
        if (Math.abs(accumulated) >= Math.min(80, distance * 0.15)) {
          setSlide(Math.max(0, Math.min(projects.length - 1, gestureSlide + (accumulated > 0 ? 1 : -1))));
        }
        setIsDragging(false);
        setDragOffset(0);
        accumulated = 0;
        gesturing = false;
      }, 160);
    };

    viewport.addEventListener("wheel", handleWheel, { passive: false });
    return () => {
      viewport.removeEventListener("wheel", handleWheel);
      window.clearTimeout(gestureTimer);
    };
  }, []);

  useEffect(() => {
    const controls = controlsRef.current;
    if (!controls) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setControlsVisible(true);
        observer.disconnect();
      }
    }, { threshold: 0.5 });
    observer.observe(controls);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const viewport = viewportRef.current;
    if (!viewport) return;
    let inView = false;
    const updateVisibility = () => setIsVisible(inView && document.visibilityState === "visible");
    const observer = new IntersectionObserver(([entry]) => {
      inView = entry.isIntersecting && entry.intersectionRatio >= 0.35;
      updateVisibility();
    }, { threshold: [0, 0.35] });
    observer.observe(viewport);
    document.addEventListener("visibilitychange", updateVisibility);
    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", updateVisibility);
    };
  }, []);

  useEffect(() => {
    advancing.current = false;
    videos.current.forEach((video, index) => {
      if (!video) return;
      if (index === slide) {
        const previewDuration = Math.min(PREVIEW_SECONDS, video.duration);
        if (previousSlide.current !== slide && video.currentTime >= previewDuration) video.currentTime = 0;
        if (paused || !isVisible) video.pause();
        else void video.play().catch(() => {});
      } else {
        video.pause();
      }
    });
    previousSlide.current = slide;

  }, [slide, paused, isVisible]);

  function updatePlayback(index: number, video: HTMLVideoElement) {
    setPlayback((current) => current.map((entry, entryIndex) => entryIndex === index
      ? { time: Math.min(PREVIEW_SECONDS, video.currentTime), duration: Number.isFinite(video.duration) ? Math.min(PREVIEW_SECONDS, video.duration) : 0 }
      : entry));
  }

  function advancePreview(index: number) {
    if (index !== previousSlide.current || paused || !isVisible || advancing.current) return;
    advancing.current = true;
    const video = videos.current[index];
    if (video) {
      video.pause();
      if (video.currentTime > PREVIEW_SECONDS) video.currentTime = PREVIEW_SECONDS;
    }
    setSlide((index + 1) % projects.length);
  }

  return (
    <section aria-labelledby="projects-title" aria-roledescription="carousel" className="project-carousel" style={{ "--project-controls-width": `${4.5 + projects.length * 1.5}rem` } as CSSProperties}>
      <h2 id="projects-title">{language === "es" ? "Mis proyectos" : "My projects"}</h2>
      <div
        ref={viewportRef}
        className={`project-carousel__viewport${isDragging ? " project-carousel__viewport--dragging" : ""}`}
        onPointerDown={(event) => {
          if (!event.isPrimary || event.button !== 0) return;
          setSlideDistance(getSlideDistance(event.currentTarget));
          dragStart.current = { x: event.clientX, y: event.clientY, id: event.pointerId };
          suppressClick.current = false;
          setIsDragging(true);
        }}
        onPointerMove={(event) => {
          const start = dragStart.current;
          if (!start || start.id !== event.pointerId) return;
          if (Math.hypot(event.clientX - start.x, event.clientY - start.y) > 8) {
            suppressClick.current = true;
            if (!event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.setPointerCapture(event.pointerId);
          }
          const distance = Math.max(-slideDistance, Math.min(slideDistance, event.clientX - start.x));
          setDragOffset((slide === 0 && distance > 0) || (slide === projects.length - 1 && distance < 0) ? 0 : distance);
        }}
        onPointerUp={(event) => finishDrag(event)}
        onPointerCancel={(event) => finishDrag(event, true)}
        onLostPointerCapture={(event) => finishDrag(event, true)}
      >
        <div
          className={`project-carousel__track${isDragging ? "" : " project-carousel__track--animated"}`}
          style={{ "--project-slide": slide, "--project-drag": `${dragOffset}px` } as CSSProperties}
        >
          {projects.map((project, index) => (
            <Link
              aria-hidden={index !== slide}
              aria-label={`${language === "es" ? "Ver proyecto" : "View project"} ${project.name}`}
              className="project-carousel__card"
              draggable={false}
              href={`/projects/${project.slug}?lang=${language}`}
              key={project.slug}
              tabIndex={index === slide ? 0 : -1}
              onClick={(event) => {
                if (suppressClick.current && event.detail > 0) event.preventDefault();
              }}
            >
              <video
                aria-label={project.name}
                muted
                playsInline
                preload={isVisible && (index === slide || index === (slide + 1) % projects.length) ? "auto" : "metadata"}
                ref={(video) => { videos.current[index] = video; }}
                onLoadedMetadata={(event) => {
                  updatePlayback(index, event.currentTarget);
                }}
                onPlay={(event) => updatePlayback(index, event.currentTarget)}
                onSeeked={(event) => updatePlayback(index, event.currentTarget)}
                onTimeUpdate={(event) => {
                  const video = event.currentTarget;
                  updatePlayback(index, video);
                  if (index === slide && video.currentTime >= PREVIEW_SECONDS) advancePreview(index);
                }}
                onEnded={() => advancePreview(index)}
                src={project.src}
              />
              <span className="project-carousel__name">{project.name}</span>
              {project.title && project.description && (
                <div className="project-carousel__caption">
                  <h3>{project.title[language]}</h3>
                  <p>{project.description[language]}</p>
                </div>
              )}
            </Link>
          ))}
        </div>
      </div>
      <div className={`project-carousel__controls${controlsVisible ? " project-carousel__controls--visible" : ""}`} ref={controlsRef} inert={!controlsVisible}>
        <div aria-label={language === "es" ? "Elegir proyecto" : "Choose project"} className="project-carousel__dots">
          {projects.map((project, index) => (
            <span
              className={`project-carousel__indicator${index === slide ? " project-carousel__indicator--active" : ""}`}
              key={project.name}
              style={isDragging ? { width: `${index === slide ? 3 - 2.5 * gestureProgress : index === destination ? 0.5 + 2.5 * gestureProgress : 0.5}rem`, transition: "none" } : undefined}
            >
            {index === slide ? (
            <input
              aria-label={`${project.name}: ${language === "es" ? "tiempo de reproducción" : "playback time"}`}
              className="project-carousel__progress"
              key={project.name}
              max={duration || 1}
              min={0}
              onChange={(event) => {
                const video = videos.current[slide];
                if (!video || !Number.isFinite(video.duration)) return;
                video.currentTime = Number(event.currentTarget.value);
                updatePlayback(slide, video);
              }}
              step="0.1"
              style={{ "--project-progress": `${progress}%` } as CSSProperties}
              type="range"
              value={currentTime}
            />
          ) : (
            <button
              aria-label={project.name}
              className="project-carousel__dot"
              key={project.name}
              onClick={() => setSlide(index)}
              type="button"
            />
            )}
            </span>
          ))}
        </div>
        <button
          aria-label={paused ? (language === "es" ? "Continuar carrusel" : "Resume carousel") : (language === "es" ? "Pausar carrusel" : "Pause carousel")}
          className="project-carousel__pause"
          onClick={() => setPaused((current) => !current)}
          type="button"
        >
          <svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            {paused ? <path d="M7 4.5a1 1 0 0 1 1.5-.86l12 7.5a1 1 0 0 1 0 1.72l-12 7.5A1 1 0 0 1 7 19.5z" /> : <><rect x="5" y="4" width="5" height="16" rx="1.5" /><rect x="14" y="4" width="5" height="16" rx="1.5" /></>}
          </svg>
        </button>
      </div>
    </section>
  );
}
