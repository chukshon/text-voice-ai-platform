import { Check } from "lucide-react";

import { VoiceT } from "@/services/voices/types";

import { Badge } from "@/components/ui/badge";
import { VoiceAvatar } from "@/components/ui/voice-avatar";

interface VoiceCardProps {
  voice: VoiceT;
  onChange: (voice: VoiceT) => void;
  setOpen: (open: boolean) => void;
  setSearch: (search: string) => void;
  selected: boolean;
}
const VoiceCard = ({ voice, onChange, setOpen, setSearch, selected }: VoiceCardProps) => {
  return (
    <button
      type="button"
      onClick={() => {
        onChange(voice);
        setOpen(false);
        setSearch("");
      }}
      className={`flex w-full items-center gap-3 px-3 py-2 text-left transition-colors hover:bg-foreground/[0.04] ${selected ? "bg-foreground/[0.03]" : ""}`}
    >
      <div className="relative">
        <VoiceAvatar name={voice.name} size="sm" />
        {selected && (
          <div className="absolute -bottom-0.5 -right-0.5 flex size-4 items-center justify-center rounded-full bg-foreground">
            <Check className="size-2.5 text-background" />
          </div>
        )}
      </div>
      <div className="min-w-0 flex-1">
        <div className="truncate text-sm font-medium">{voice.name}</div>
        {voice.description && (
          <div className="mt-0.5 truncate text-[11px] text-muted-foreground/50">
            {voice.description}
          </div>
        )}
      </div>
      <div className="flex shrink-0 items-center gap-1">
        <Badge
          variant="outline"
          className="border-border/30 px-1.5 py-0 text-[9px] font-normal text-muted-foreground/50"
        >
          {voice.language}
        </Badge>
        <Badge
          variant="outline"
          className="border-border/30 px-1.5 py-0 text-[9px] font-normal text-muted-foreground/50"
        >
          {voice.gender}
        </Badge>
      </div>
    </button>
  );
};

export default VoiceCard;
