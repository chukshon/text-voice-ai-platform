import { Keyboard, Send } from "lucide-react";

import { VoiceT } from "@/services/voices/types";
import { Button } from "@/components/ui/button";

interface BottomBarProps {
  voice?: VoiceT | null;
  text: string;
  setText: (text: string) => void;
  handleSubmit: () => void;
  submitting: boolean;
  isActive: boolean;
}
const BottomBar = ({ voice, text, handleSubmit, submitting, isActive }: BottomBarProps) => {
  const MAX_CHARS = 5000;
  const charPercent = (text.length / MAX_CHARS) * 100;
  return (
    <div className="border-t border-border/30 px-6 py-3">
      <div className="mx-auto flex max-w-3xl items-center justify-between">
        <div className="flex items-center gap-3">
          {/* Character count with progress ring */}
          <div className="flex items-center gap-2">
            <svg className="size-5 -rotate-90" viewBox="0 0 20 20">
              <circle
                cx="10"
                cy="10"
                r="8"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="text-foreground/[0.06]"
              />
              <circle
                cx="10"
                cy="10"
                r="8"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeDasharray={`${charPercent * 0.5} 50`}
                className={charPercent > 90 ? "text-destructive/60" : "text-foreground/30"}
              />
            </svg>
            <span className="text-[11px] tabular-nums text-muted-foreground">
              {text.length.toLocaleString()} / {MAX_CHARS.toLocaleString()}
            </span>
          </div>

          <div className="h-3.5 w-px bg-border/30" />

          <div className="flex items-center gap-1 text-[11px] text-muted-foreground">
            <Keyboard className="size-3" />
            <span>⌘↵ to generate</span>
          </div>
        </div>

        <Button
          onClick={handleSubmit}
          disabled={!voice || !text.trim() || submitting || !!isActive}
          size="sm"
          className="gap-2 px-5"
        >
          {submitting ? (
            <div className="size-3.5 animate-spin rounded-full border-2 border-background/30 border-t-background" />
          ) : (
            <Send className="size-3.5" />
          )}
          Generate
        </Button>
      </div>
    </div>
  );
};

export default BottomBar;
