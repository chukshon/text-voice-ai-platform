import React from "react";
import { Send, Sparkles, History, Keyboard } from "lucide-react";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { VoiceT } from "@/services/voices/types";
import VoicePicker from "./voice-picker";

interface TopToolbarProps {
  voice: VoiceT;
  setVoice: (voice: VoiceT) => void;
  accessToken: string;
  format: string;
  setFormat: (format: string) => void;
  showHistory: boolean;
  setShowHistory: (showHistory: boolean) => void;
}

const TopToolbar = ({
  voice,
  setVoice,
  accessToken,
  format,
  setFormat,
  showHistory,
  setShowHistory,
}: TopToolbarProps) => {
  return (
    <div className="flex items-center justify-between border-b border-border/30 px-6 py-3">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <Sparkles className="size-4 text-muted-foreground/40" />
          <h1 className="text-sm font-semibold">Speech Synthesis</h1>
        </div>
        <div className="h-4 w-px bg-border/30" />
        <div className="w-[280px]">
          <VoicePicker value={voice} onChange={setVoice} token={accessToken || undefined} />
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Select value={format} onValueChange={setFormat}>
          <SelectTrigger className="h-8 w-[80px] border-border/30 bg-transparent text-xs">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="mp3">MP3</SelectItem>
            <SelectItem value="wav">WAV</SelectItem>
          </SelectContent>
        </Select>

        <button
          type="button"
          onClick={() => setShowHistory(!showHistory)}
          className={`flex size-8 items-center justify-center rounded-md transition-colors ${
            showHistory
              ? "bg-foreground/[0.08] text-foreground"
              : "text-muted-foreground/40 hover:text-muted-foreground"
          }`}
          title="Toggle history"
        >
          <History className="size-4" />
        </button>
      </div>
    </div>
  );
};

export default TopToolbar;
