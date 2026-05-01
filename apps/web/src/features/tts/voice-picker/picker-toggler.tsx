import { ChevronDown } from "lucide-react";

import { VoiceAvatar } from "@/components/ui/voice-avatar";
import { VoiceT } from "@/services/voices/types";

interface PickerTogglerProps {
  isOpen: boolean;
  setOpen: (open: boolean) => void;
  value?: VoiceT | null;
}
const PickerToggler = ({ isOpen, setOpen, value }: PickerTogglerProps) => {
  return (
    <button
      type="button"
      onClick={() => setOpen(!isOpen)}
      className="flex h-10 w-full items-center gap-2.5 rounded-lg border border-border/50 bg-transparent px-3 text-left text-sm transition-colors hover:border-border"
    >
      {value ? (
        <VoiceAvatar name={value.name} size="xs" />
      ) : (
        <div className="flex size-6 items-center justify-center rounded-full bg-foreground/[0.06]">
          <div className="size-3 rounded-full bg-foreground/20" />
        </div>
      )}
      <span className={`flex-1 truncate ${value ? "text-foreground" : "text-muted-foreground/40"}`}>
        {value ? value.name : "Choose a voice"}
      </span>
      {value && (
        <span className="text-[10px] text-muted-foreground/50">
          {value.language} · {value.gender}
        </span>
      )}
      <ChevronDown
        className={`size-3.5 text-muted-foreground/40 transition-transform ${isOpen ? "rotate-180" : ""}`}
      />
    </button>
  );
};

export default PickerToggler;
