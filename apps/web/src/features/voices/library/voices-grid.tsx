import { VoiceT } from "@/services/voices/types";
import VoiceCard from "@/features/voices/library/voice-card";
import EmptyState from "@/features/voices/library/empty-state";
import LoadingState from "@/features/voices/loading-state";

interface VoicesGridProps {
  isLoading: boolean;
  voices?: VoiceT[];
}
const VoicesGrid = ({ isLoading, voices }: VoicesGridProps) => {
  if (isLoading) {
    return <LoadingState />;
  }
  if (isLoading || voices?.length === 0) {
    return <EmptyState />;
  }
  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {voices?.map((voice) => (
        <VoiceCard
          key={voice.id}
          name={voice.name}
          description={voice.description}
          category={voice.category}
          language={voice.language}
          gender={voice.gender}
          accent={voice.accent}
          id={voice.id}
        />
      ))}
    </div>
  );
};

export default VoicesGrid;
