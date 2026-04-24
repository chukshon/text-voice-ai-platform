import { LayoutDashboard, Library, Mic, MessageSquareText } from "lucide-react";

export const ROUTES = {
  DASHBOARD: "/dashboard",

  // LOG IN
  LOGIN: "/login",
  REGISTER: "/register",

  // VOICES
  VOICES: "/voices",
  VOICES_LIBRARY: "/voices/library",
  VOICES_SAMPLE: "/voices/sample",

  // TEXT TO SPEECH
  TEXT_TO_SPEECH: "/tts",
};

export const NAV_LINKS = [
  { label: "Dashboard", href: ROUTES.DASHBOARD, icon: LayoutDashboard },
  { label: "Voice Library", href: ROUTES.VOICES_LIBRARY, icon: Library },
  { label: "My Voices", href: ROUTES.VOICES, icon: Mic },
  { label: "Text to Speech", href: ROUTES.TEXT_TO_SPEECH, icon: MessageSquareText },
];

export const DASHBOARD_QUICK_ACTIONS = [
  {
    title: "Voice Library",
    description: "Browse community voices",
    href: ROUTES.VOICES_LIBRARY,
    icon: Library,
  },
  {
    title: "My Voices",
    description: "Manage your custom voices",
    href: ROUTES.VOICES,
    icon: Mic,
  },
  {
    title: "Text to Speech",
    description: "Generate speech from text",
    href: ROUTES.TEXT_TO_SPEECH,
    icon: MessageSquareText,
  },
];

export const PUBLIC_PATHS = [ROUTES.LOGIN, ROUTES.REGISTER];
