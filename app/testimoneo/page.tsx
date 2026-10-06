import type { Metadata } from "next";
import { Suspense } from "react";
import { TestimonialForm } from "../components/testimonial-form";

export const metadata: Metadata = {
  title: "Testimoneo | Santi Scian",
  description: "Compartí tu experiencia trabajando con Santiago Scian.",
};

export default function TestimonialPage() {
  return <Suspense><TestimonialForm /></Suspense>;
}
