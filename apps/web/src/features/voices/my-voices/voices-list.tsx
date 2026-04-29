import { VoiceT } from "@/services/voices/types";
import LoadingState from "@/features/voices/loading-state";
import EmptyState from "@/features/voices/my-voices/empty-state";
import VoiceCard from "./voice-card";

interface VoicesListProps {
  voices?: VoiceT[];
  isLoading: boolean;
  handleCreateVoice: () => void;
}
const VoicesList = ({ voices, isLoading, handleCreateVoice }: VoicesListProps) => {
  if (isLoading) {
    return <LoadingState />;
  }
  if (isLoading || voices?.length === 0) {
    return <EmptyState handleCreateVoice={handleCreateVoice} />;
  }
  return (
    <div className="space-y-2">
      {voices?.map((voice) => (
        <VoiceCard
          key={voice.id}
          voiceId={voice.id}
          voiceName={voice.name}
          voiceDescription={voice.description}
          voiceCategory={voice.category}
          voiceLanguage={voice.language}
          voiceIsPublic={voice.isPublic}
        />
      ))}
    </div>
  );
};

export default VoicesList;
