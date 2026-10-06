import { isValidPhoneNumber } from "libphonenumber-js/max";

export type ContactMethod = "email" | "whatsapp";
export type ContactError = "required" | "email" | "phone" | "areaCode";

export function getContactMethod(value: string): ContactMethod {
  return /[@a-z]/i.test(value) ? "email" : "whatsapp";
}

export function validateContact(value: string, method = getContactMethod(value)): ContactError | undefined {
  const contact = value.trim();
  if (!contact) return "required";
  if (method === "email") {
    if (!/^[^\s@.]+(?:\.[^\s@.]+)*@[a-z\d](?:[a-z\d-]*[a-z\d])?(?:\.[a-z\d](?:[a-z\d-]*[a-z\d])?)+$/i.test(contact)) return "email";
    return;
  }
  if (!contact.startsWith("+")) return "areaCode";
  if (!/^\+[\d\s().-]+$/.test(contact) || !isValidPhoneNumber(contact)) return "phone";
}
