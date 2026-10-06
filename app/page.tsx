import type { Viewport } from "next";
import { HomePage } from "./components/home-page";

export const viewport: Viewport = {
  themeColor: "#bce3ed",
};

export default function Home() {
  return <HomePage />;
}
