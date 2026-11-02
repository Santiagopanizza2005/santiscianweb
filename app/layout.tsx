import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Santi Scian",
  },
  title: "Santi Scian",
  description: "Apps and tools by Santi Scian.",
};

export const viewport: Viewport = {
  colorScheme: "light",
  themeColor: "#ffffff",
  viewportFit: "cover",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
