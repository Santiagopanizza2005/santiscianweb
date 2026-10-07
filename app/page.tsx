import type { Viewport } from "next";
import { HomePage } from "./components/home-page";

export const viewport: Viewport = {
  themeColor: "#02040c",
};

export default function Home() {
  return <HomePage />;
}
