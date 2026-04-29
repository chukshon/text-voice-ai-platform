import { Badge } from "@/components/ui/badge";
import { VoiceAvatar } from "@/components/ui/voice-avatar";
import { Globe } from "lucide-react";
import { useRouter } from "nextjs-toploader/app";

interface VoiceCardProps {
  voiceId: string;
  voiceName: string;
  voiceDescription: string | null;
  voiceCategory: string;
  voiceLanguage: string;
  voiceIsPublic: boolean;
}
const VoiceCard = ({
  voiceId,
  voiceName,
  voiceDescription,
  voiceCategory,
  voiceLanguage,
  voiceIsPublic,
}: VoiceCardProps) => {
  const router = useRouter();
  const handleSelectVoice = () => {
    router.push(`/voices/${voiceId}`);
  };
  return (
    <button
      key={voiceId}
      onClick={handleSelectVoice}
      className="flex cursor-pointer w-full items-center gap-3 rounded-lg border border-border/50 p-4 text-left transition-colors hover:border-border hover:bg-foreground/[0.02]"
    >
      <VoiceAvatar name={voiceName} />
      <div className="min-w-0 flex-1">
        <h3 className="text-sm font-medium">{voiceName}</h3>
        {voiceDescription && (
          <p className="mt-0.5 truncate text-xs text-muted-foreground">{voiceDescription}</p>
        )}
      </div>

      <div className="flex items-center gap-1.5">
        <Badge variant="secondary" className="text-[10px]">
          {voiceCategory}
        </Badge>
        <Badge variant="outline" className="text-[10px]">
          <Globe className="mr-0.5 size-2.5" />
          {voiceLanguage}
        </Badge>
        <Badge variant="outline" className="text-[10px]">
          {voiceIsPublic ? "Public" : "Private"}
        </Badge>
      </div>
    </button>
  );
};

export default VoiceCard;
