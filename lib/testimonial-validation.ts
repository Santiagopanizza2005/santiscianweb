import { validateContact } from "./contact-validation";

export const testimonialFields = ["name", "email", "rating", "description"] as const;
export type TestimonialField = (typeof testimonialFields)[number];
export type TestimonialError = "required" | "email" | "rating" | "length";

export function validateTestimonialField(field: TestimonialField, value: unknown): TestimonialError | undefined {
  if (field === "rating") {
    return typeof value === "number" && Number.isInteger(value) && value >= 1 && value <= 5 ? undefined : "rating";
  }
  if (typeof value !== "string" || !value.trim()) return "required";
  const maxLength = field === "name" ? 120 : field === "email" ? 160 : 2960;
  if (value.trim().length > maxLength) return "length";
  if (field === "email" && validateContact(value, "email")) return "email";
}
