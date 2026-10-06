export const contactServices = [
  { value: "ai-agents", es: "Agentes de IA", en: "AI Agents" },
  { value: "web-native-apps", es: "Apps Web y Nativas", en: "Web & Native Apps" },
  { value: "other", es: "Otro", en: "Other" },
] as const;

export function isContactService(value: unknown): value is typeof contactServices[number]["value"] {
  return contactServices.some((service) => service.value === value);
}
