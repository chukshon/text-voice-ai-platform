import { Globe } from "lucide-react";

import { VoiceCategoryEnum } from "@/constants/voice";
import { VoiceGenderEnum } from "@/constants/voice";

import { Badge } from "@/components/ui/badge";
import { VoiceAvatar } from "@/components/ui/voice-avatar";

interface VoiceCardProps {
  name: string;
  description: string | null;
  category: VoiceCategoryEnum;
  language: string;
  gender: VoiceGenderEnum;
  accent: string | null;
  id: string;
}
const VoiceCard = ({
  name,
  description,
  category,
  language,
  gender,
  accent,
  id,
}: VoiceCardProps) => {
  return (
    <div
      key={id}
      className="group flex items-start gap-3 rounded-lg border border-border/50 p-4 transition-colors hover:border-border hover:bg-foreground/[0.02]"
    >
      <VoiceAvatar name={name} />
      <div className="min-w-0 flex-1">
        <h3 className="text-sm font-medium">{name}</h3>
        {description && (
          <p className="mt-0.5 line-clamp-2 text-xs text-muted-foreground">{description}</p>
        )}
        <div className="mt-2 flex flex-wrap gap-1.5">
          <Badge variant="secondary" className="text-[10px]">
            {category}
          </Badge>
          <Badge variant="outline" className="text-[10px]">
            <Globe className="mr-0.5 size-2.5" />
            {language}
          </Badge>
          <Badge variant="outline" className="text-[10px]">
            {gender}
          </Badge>
          {accent && (
            <Badge variant="outline" className="text-[10px]">
              {accent}
            </Badge>
          )}
        </div>
      </div>
    </div>
  );
};

export default VoiceCard;
