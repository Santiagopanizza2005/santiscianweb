import { Suspense } from "react";
import { ContactForm } from "../components/contact-form";

export default function ContactPage() {
  return (
    <Suspense>
      <ContactForm />
    </Suspense>
  );
}
