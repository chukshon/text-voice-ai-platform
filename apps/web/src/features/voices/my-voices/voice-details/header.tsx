import { Button } from "@/components/ui/button";
import { VoiceAvatar } from "@/components/ui/voice-avatar";
import { Badge } from "@/components/ui/badge";
import { Globe, Trash2 } from "lucide-react";

type HeaderProps = {
  voiceName?: string;
  voiceCategory?: string;
  voiceLanguage?: string;
  voiceGender?: string;
  voiceAccent?: string | null;
  voiceIsPublic?: boolean;
  handleShowDeleteDialog: () => void;
};
const Header = ({
  voiceName,
  voiceCategory,
  voiceLanguage,
  voiceGender,
  voiceAccent,
  voiceIsPublic,
  handleShowDeleteDialog,
}: HeaderProps) => {
  return (
    <div className="mb-8 flex items-start justify-between">
      <div className="flex items-center gap-4">
        <VoiceAvatar name={voiceName as string} size="lg" />
        <div>
          <h1 className="text-xl font-bold">{voiceName}</h1>
          <div className="mt-1.5 flex items-center gap-1.5">
            <Badge variant="secondary" className="text-[10px]">
              {voiceCategory}
            </Badge>
            <Badge variant="outline" className="text-[10px]">
              <Globe className="mr-0.5 size-2.5" />
              {voiceLanguage}
            </Badge>
            <Badge variant="outline" className="text-[10px]">
              {voiceGender}
            </Badge>
            {voiceAccent && (
              <Badge variant="outline" className="text-[10px]">
                {voiceAccent}
              </Badge>
            )}
            <Badge variant="outline" className="text-[10px]">
              {voiceIsPublic ? "Public" : "Private"}
            </Badge>
          </div>
        </div>
      </div>
      <Button
        variant="ghost"
        size="icon"
        className="text-muted-foreground hover:text-destructive"
        onClick={handleShowDeleteDialog}
      >
        <Trash2 className="size-4" />
      </Button>
    </div>
  );
};

export default Header;
