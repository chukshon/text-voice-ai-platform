import { LayoutDashboard, Library, Mic, MessageSquareText } from "lucide-react";

export const NAV_LINKS = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Voice Library", href: "/voices/library", icon: Library },
  { label: "My Voices", href: "/voices", icon: Mic },
  { label: "Text to Speech", href: "/tts", icon: MessageSquareText },
];

export const DASHBOARD_QUICK_ACTIONS = [
  {
    title: "Voice Library",
    description: "Browse community voices",
    href: "/voices/library",
    icon: Library,
  },
  {
    title: "My Voices",
    description: "Manage your custom voices",
    href: "/voices",
    icon: Mic,
  },
  {
    title: "Text to Speech",
    description: "Generate speech from text",
    href: "/tts",
    icon: MessageSquareText,
  },
];

export const ROUTES = {
  DASHBOARD: "/",

  // LOG IN
  LOGIN: "/login",
  REGISTER: "/register",
};

export const PUBLIC_PATHS = [ROUTES.LOGIN, ROUTES.REGISTER];
