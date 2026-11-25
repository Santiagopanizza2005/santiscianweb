"use client";

export type Language = "es" | "en";

export function LanguageSwitcher({
  language,
  onToggle,
}: {
  language: Language;
  onToggle: () => void;
}) {
  function toggleLanguage() {
    onToggle();
  }

  return (
    <button
      aria-label={language === "es" ? "Cambiar a inglés" : "Switch to Spanish"}
      className="language-button"
      onClick={toggleLanguage}
      type="button"
    >
      <svg
        aria-hidden="true"
        className="language-button__icon"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.6"
        viewBox="0 0 24 24"
      >
        <circle cx="12" cy="12" r="9" />
        <path d="M3 12h18" />
        <path d="M12 3a14 14 0 0 1 0 18a14 14 0 0 1 0-18Z" />
      </svg>
      <span>{language === "es" ? "English" : "Español"}</span>
    </button>
  );
}
