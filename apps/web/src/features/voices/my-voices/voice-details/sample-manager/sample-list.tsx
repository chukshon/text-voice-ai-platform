import React from "react";

import { VoiceSampleT } from "@/services/voice-samples/types";
import SampleCard from "./sample-card";
import EmptyState from "./empty-state";
import LoadingState from "./loading-state";

interface SampleListProps {
  samples?: VoiceSampleT[];
  deletingId: string | null;
  handleDeleteSample: (sampleId: string) => void;
  isLoadingVoiceSamples: boolean;
}
const SampleList = ({
  samples,
  deletingId,
  handleDeleteSample,
  isLoadingVoiceSamples,
}: SampleListProps) => {
  if (isLoadingVoiceSamples) {
    return <LoadingState />;
  }
  if (samples?.length === 0) {
    return <EmptyState />;
  }
  return (
    <div className="space-y-2">
      {samples?.map((sample) => (
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
