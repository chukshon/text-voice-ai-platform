import { formatBytes } from "@/lib/utils/voice";

type FileInfoProps = {
  fileName: string;
  sizeBytes: number;
  mimeType: string;
};
const FileInfo = ({ fileName, sizeBytes, mimeType }: FileInfoProps) => {
  return (
    <div className="flex items-center gap-2 border-t border-border/20 px-4 py-1.5">
      {fileName && (
        <span className="truncate text-[11px] text-muted-foreground/40">{fileName}</span>
      )}
      {sizeBytes != null && (
        <>
          <span className="text-[11px] text-muted-foreground/20">·</span>
          <span className="text-[11px] text-muted-foreground/40">{formatBytes(sizeBytes)}</span>
        </>
      )}
      {mimeType && (
        <>
          <span className="text-[11px] text-muted-foreground/20">·</span>
          <span className="text-[11px] text-muted-foreground/40">
            {mimeType.split("/")[1]?.toUpperCase()}
          </span>
        </>
      )}
    </div>
  );
};

export default FileInfo;
