import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Santi Scian",
  description: "Software para resolver problemas de negocio.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
