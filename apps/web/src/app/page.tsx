import type { Metadata } from "next";
import { HomeLanding } from "@/features/landing/home-landing";

export const metadata: Metadata = {
  title: "Text to Voice AI",
  description: "Generate realistic voice from text with an AI-powered text-to-voice platform.",
};

export default function Home() {
  return <HomeLanding />;
}
