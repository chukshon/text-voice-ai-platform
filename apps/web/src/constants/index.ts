import { LayoutDashboard, Library, Mic, MessageSquareText } from "lucide-react";

export const NAV_LINKS = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Voice Library", href: "/voices/library", icon: Library },
  { label: "My Voices", href: "/voices", icon: Mic },
  { label: "Text to Speech", href: "/tts", icon: MessageSquareText },
];
