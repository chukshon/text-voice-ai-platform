import React, { useRef, useState } from "react";
import SampleUpload from "./sample-upload";
import SampleList from "./sample-list";
import {
  useCreateVoiceSampleMutation,
  useDeleteVoiceSampleMutation,
} from "@/services/voice-samples/mutations";
import { useGetVoiceSamples } from "@/services/voice-samples/queries";

interface SampleManagerProps {
  voiceId: string;
}
const SampleManager = ({ voiceId }: SampleManagerProps) => {
  const sampleFileRef = useRef<HTMLInputElement>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const { data: voiceSamples, isLoading: isLoadingVoiceSamples } = useGetVoiceSamples(voiceId);
  const { mutate: createVoiceSample, isPending: isCreatingVoiceSample } =
    useCreateVoiceSampleMutation();
  const { mutate: deleteVoiceSample, isPending: isDeletingVoiceSample } =
    useDeleteVoiceSampleMutation();

  const handleUploadSample = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      createVoiceSample({ file, voiceId });
    }
  };

  const handleDeleteSample = (sampleId: string) => {
    setDeletingId(sampleId);
    deleteVoiceSample(
      { voiceId, sampleId },
      {
        onSuccess: () => {
          setDeletingId(null);
        },
      },
    );
  };

  return (
    <div>
      <div className="space-y-4">
        {/* Upload area */}
        <SampleUpload
          isUploadingSample={isCreatingVoiceSample}
          handleUploadSample={handleUploadSample}
          fileRef={sampleFileRef}
        />

        {/* Sample list */}
        <SampleList
          samples={voiceSamples?.data}
          deletingId={deletingId}
          handleDeleteSample={handleDeleteSample}
          isLoadingVoiceSamples={isLoadingVoiceSamples}
        />
      </div>
    </div>
  );
};

export default SampleManager;
