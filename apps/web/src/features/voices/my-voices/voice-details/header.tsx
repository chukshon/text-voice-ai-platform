import { Globe, Trash2 } from "lucide-react";

import { VoiceT } from "@/services/voices/types";

import { Button } from "@/components/ui/button";
import { VoiceAvatar } from "@/components/ui/voice-avatar";
import { Badge } from "@/components/ui/badge";

type HeaderProps = {
  voice?: VoiceT;
  handleShowDeleteDialog: () => void;
};
const Header = ({ voice, handleShowDeleteDialog }: HeaderProps) => {
  return (
    <div className="mb-8 flex items-start justify-between">
      <div className="flex items-center gap-4">
        <VoiceAvatar name={voice?.name as string} size="lg" />
        <div>
          <h1 className="text-xl font-bold">{voice?.name}</h1>
          <div className="mt-1.5 flex items-center gap-1.5">
            <Badge variant="secondary" className="text-[10px]">
              {voice?.category}
            </Badge>
            <Badge variant="outline" className="text-[10px]">
              <Globe className="mr-0.5 size-2.5" />
              {voice?.language}
            </Badge>
            <Badge variant="outline" className="text-[10px]">
              {voice?.gender}
            </Badge>
            {voice?.accent && (
              <Badge variant="outline" className="text-[10px]">
                {voice?.accent}
              </Badge>
            )}
            <Badge variant="outline" className="text-[10px]">
              {voice?.isPublic ? "Public" : "Private"}
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
