import { Loader2, Upload } from "lucide-react";
import React from "react";
import { Button } from "@/components/ui/button";

interface SampleUploadProps {
  uploading: boolean;
  handleUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  fileRef: React.RefObject<HTMLInputElement | null>;
}
const SampleUpload = ({ uploading, handleUpload, fileRef }: SampleUploadProps) => {
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
        disabled={uploading}
        onClick={() => fileRef.current?.click()}
      >
        {uploading ? (
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
        onChange={handleUpload}
      />
    </div>
  );
};

export default SampleUpload;
