import React from "react";
import { Loader2, Upload } from "lucide-react";

import { Button } from "@/components/ui/button";

interface SampleUploadProps {
  isUploadingSample: boolean;
  handleUploadSample: (event: React.ChangeEvent<HTMLInputElement>) => void;
  fileRef: React.RefObject<HTMLInputElement | null>;
}
const SampleUpload = ({ isUploadingSample, handleUploadSample, fileRef }: SampleUploadProps) => {
  return (
    <div className="flex flex-col items-center gap-3 rounded-lg border border-dashed border-border p-6">
      <Upload className="size-8 text-muted-foreground/50" />
      <div className="text-center">
        <p className="text-sm font-medium">Audio Samples</p>
        <p className="mt-0.5 text-xs text-muted-foreground">
          MP3, WAV, OGG, FLAC, MP4, WebM — max 50 MB
        </p>
      </div>
      <Button
        variant="outline"
        size="sm"
        disabled={isUploadingSample}
        onClick={() => fileRef.current?.click()}
      >
        {isUploadingSample ? (
          <>
            <Loader2 className="size-3.5 animate-spin" />
            Uploading...
          </>
        ) : (
          <>
            <Upload className="size-3.5" />
            Choose file
          </>
        )}
      </Button>
      <input
        ref={fileRef}
        type="file"
        className="hidden"
        accept="audio/mpeg,audio/wav,audio/ogg,audio/flac,audio/mp4,audio/webm"
        onChange={handleUploadSample}
      />
    </div>
  );
};

export default SampleUpload;
