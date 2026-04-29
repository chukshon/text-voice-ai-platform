import { FileAudio, Trash2, Loader2 } from "lucide-react";
import { formatBytes } from "@/lib/utils/voice";
import { Button } from "@/components/ui/button";

interface SampleCardProps {
  sampleFileName: string;
  sampleSizeBytes: number;
  sampleDurationMs: number | null;
  sampleMimeType: string;
  sampleId: string;
  deletingId: string;
  handleDelete: (sampleId: string) => void;
}
const SampleCard = ({
  sampleFileName,
  sampleSizeBytes,
  sampleDurationMs,
  sampleMimeType,
  sampleId,
  handleDelete,
  deletingId,
}: SampleCardProps) => {
  return (
    <div className="flex items-center gap-3 rounded-md border border-border/50 p-3">
      <div className="flex size-8 items-center justify-center rounded bg-foreground/[0.06]">
        <FileAudio className="size-4 text-muted-foreground" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium">{sampleFileName}</p>
        <p className="text-xs text-muted-foreground">
          {formatBytes(sampleSizeBytes)}
          {sampleDurationMs ? ` · ${(sampleDurationMs / 1000).toFixed(1)}s` : ""}
          {" · "}
          {sampleMimeType.split("/")[1]?.toUpperCase()}
        </p>
      </div>
      <Button
        variant="ghost"
        size="icon"
        className="size-8 text-muted-foreground hover:text-destructive"
        disabled={deletingId === sampleId}
        onClick={() => handleDelete(sampleId)}
      >
        {deletingId === sampleId ? (
          <Loader2 className="size-3.5 animate-spin" />
        ) : (
          <Trash2 className="size-3.5" />
        )}
      </Button>
    </div>
  );
};

export default SampleCard;
