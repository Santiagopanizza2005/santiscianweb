"use client";

import { useEffect, useId, useRef, useState, type KeyboardEvent } from "react";

type ContactSelectProps = {
  name: string;
  label: string;
  options: readonly { value: string; label: string }[];
  value: string;
  onChange: (value: string) => void;
  error?: string;
};

export function ContactSelect({ name, label, options, value, onChange, error }: ContactSelectProps) {
  const id = useId();
  const containerRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const selectedIndex = options.findIndex((option) => option.value === value);

  useEffect(() => {
    if (!open) return;
    function closeOutside(event: PointerEvent) {
      if (event.target instanceof Node && !containerRef.current?.contains(event.target)) setOpen(false);
    }
    document.addEventListener("pointerdown", closeOutside);
    return () => document.removeEventListener("pointerdown", closeOutside);
  }, [open]);

  function expand(index = Math.max(selectedIndex, 0)) {
    setActiveIndex(index);
    setOpen(true);
  }

  function choose(index: number) {
    onChange(options[index].value);
    setOpen(false);
  }

  function handleKeyDown(event: KeyboardEvent<HTMLButtonElement>) {
    if (event.key === "Tab") {
      setOpen(false);
      return;
    }
    if (event.key === "Escape") {
      event.preventDefault();
      setOpen(false);
      return;
    }
    if (["ArrowDown", "ArrowUp", "Home", "End"].includes(event.key)) {
      event.preventDefault();
      if (!open) {
        expand(event.key === "End" ? options.length - 1 : Math.max(selectedIndex, 0));
      } else {
        setActiveIndex((index) => event.key === "Home" ? 0
          : event.key === "End" ? options.length - 1
          : (index + (event.key === "ArrowDown" ? 1 : -1) + options.length) % options.length);
      }
    } else if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      if (open) choose(activeIndex);
      else expand();
    } else if (event.key.length === 1 && !event.ctrlKey && !event.metaKey && !event.altKey) {
      const matches = options.map((option, index) => ({ ...option, index }))
        .filter((option) => option.label.toLocaleLowerCase().startsWith(event.key.toLocaleLowerCase()));
      const match = matches.find((option) => option.index > activeIndex) ?? matches[0];
      if (match) {
        event.preventDefault();
        expand(match.index);
      }
    }
  }

  return (
    <div className="contact-floating-field contact-select-field">
      <div
        className="contact-field-control contact-select"
        data-open={open}
        data-filled={!!value}
        data-invalid={!!error}
        ref={containerRef}
        onBlur={(event) => {
          if (!event.currentTarget.contains(event.relatedTarget)) setOpen(false);
        }}
      >
        <input type="hidden" name={name} value={value} />
        <span className={`contact-floating-label${error ? " contact-field-error" : ""}`} id={error ? `${name}-error` : undefined} aria-live={error ? "polite" : undefined}>
          {error ?? label}
        </span>
        <button
          type="button"
          className="contact-select__trigger"
          role="combobox"
          aria-label={label}
          aria-expanded={open}
          aria-controls={`${id}-options`}
          aria-haspopup="listbox"
          aria-required="true"
          aria-invalid={!!error}
          aria-describedby={error ? `${name}-error` : undefined}
          aria-activedescendant={open ? `${id}-option-${activeIndex}` : undefined}
          data-field={name}
          onClick={() => open ? setOpen(false) : expand()}
          onKeyDown={handleKeyDown}
        >
          <span>{selectedIndex >= 0 ? options[selectedIndex].label : "\u00a0"}</span>
          <svg className="contact-select__chevron" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true"><path d="m6 9 6 6 6-6" /></svg>
        </button>
        <div className="contact-select__panel" inert={!open} aria-hidden={!open}>
          <div className="contact-select__panel-inner">
            <ul className="contact-select__options" id={`${id}-options`} role="listbox" aria-label={label}>
              {options.map((option, index) => (
                <li
                  key={option.value}
                  id={`${id}-option-${index}`}
                  role="option"
                  aria-selected={option.value === value}
                  data-active={index === activeIndex}
                  onPointerMove={() => setActiveIndex(index)}
                  onMouseDown={(event) => event.preventDefault()}
                  onClick={() => choose(index)}
                >
                  {option.label}
                  {option.value === value && <span aria-hidden="true">✓</span>}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
