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
      {language === "es" ? "English" : "Español"}
    </button>
  );
}
