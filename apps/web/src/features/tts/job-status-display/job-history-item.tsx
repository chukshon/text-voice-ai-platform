import { CheckCircle2, XCircle, Loader2 } from "lucide-react";
import { JobStatus } from "@/constants/tts";
import { JobT } from "@/services/tts/types";

interface JobHistoryItemProps {
  job: JobT;
  isActive?: boolean;
  onClick?: () => void;
}

const JobHistoryItem = ({ job, isActive, onClick }: JobHistoryItemProps) => {
  const time = new Date(job.createdAt);
  const isToday = new Date().toDateString() === time.toDateString();

  const label = job.inputText
    ? job.inputText.length > 40
      ? job.inputText.slice(0, 40) + "…"
      : job.inputText
    : job.id.slice(0, 8);

  const renderJobStatusIcon = () => {
    switch (job.status) {
      case JobStatus.COMPLETED:
        return <CheckCircle2 className="size-3.5 text-emerald-500/60" />;
      case JobStatus.FAILED:
        return <XCircle className="size-3.5 text-destructive/60" />;
      case JobStatus.PROCESSING:
        return <Loader2 className="size-3.5 animate-spin text-foreground/40" />;
      case JobStatus.PENDING:
        return <div className="size-2 rounded-full bg-foreground/20" />;
      default:
        return null;
    }
  };
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex w-full items-center gap-3 rounded-md px-2.5 py-2 text-left transition-colors hover:bg-foreground/[0.05] ${
        isActive ? "bg-foreground/[0.06]" : ""
      }`}
    >
      <div className="flex size-6 shrink-0 items-center justify-center">
        {renderJobStatusIcon()}
      </div>
      <div className="min-w-0 flex-1">
        <div className="truncate text-xs">{label}</div>
        <div className="mt-0.5 flex items-center gap-1.5">
          <span
            className={`text-[10px] ${
              job.status === JobStatus.COMPLETED
                ? "text-emerald-500/60"
                : job.status === JobStatus.FAILED
                  ? "text-destructive/60"
                  : "text-muted-foreground/40"
            }`}
          >
            {job.status}
          </span>
          <span className="text-[10px] text-muted-foreground/30">
            {isToday
              ? time.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
              : time.toLocaleDateString([], { month: "short", day: "numeric" })}
          </span>
        </div>
      </div>
    </button>
  );
};

export default JobHistoryItem;
