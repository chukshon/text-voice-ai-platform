import React from "react";
import SampleCard from "./sample-card";
import EmptyState from "./empty-state";
import LoadingState from "./loading-state";
import { VoiceSampleT } from "@/services/voice-samples/types";

interface SampleListProps {
  samples: VoiceSampleT[];
  deletingId: string;
  handleDeleteSample: (sampleId: string) => void;
  isLoading: boolean;
}
const SampleList = ({ samples, deletingId, handleDeleteSample, isLoading }: SampleListProps) => {
  if (isLoading) {
    return <LoadingState />;
  }
  if (samples.length === 0) {
    return <EmptyState />;
  }
  return (
    <div className="space-y-2">
      {samples.map((sample) => (
        <SampleCard
          key={sample.id}
          sampleFileName={sample.fileName}
          sampleSizeBytes={sample.sizeBytes}
          sampleDurationMs={sample.durationMs}
          sampleMimeType={sample.mimeType}
          sampleId={sample.id}
          deletingId={deletingId}
          handleDelete={handleDeleteSample}
        />
      ))}
    </div>
  );
};

export default SampleList;
