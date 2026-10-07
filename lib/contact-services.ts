export const contactServices = [
  { value: "agent-discovery", es: "Diagnóstico de IA", en: "Agent Discovery" },
  { value: "agent-build", es: "Desarrollo de agentes", en: "Agent Build" },
  { value: "other", es: "Otro", en: "Other" },
] as const;

export function isContactService(value: unknown): value is typeof contactServices[number]["value"] {
  return contactServices.some((service) => service.value === value);
}
