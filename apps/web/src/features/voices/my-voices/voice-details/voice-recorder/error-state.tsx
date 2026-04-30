import { motion } from "framer-motion";
import { AlertCircle, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ErrorStateProps {
  message: string;
  onRetry: () => void;
  onDismiss: () => void;
}
const ErrorState = ({ message, onDismiss, onRetry }: ErrorStateProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.2 }}
      className="overflow-hidden rounded-xl border border-destructive/30 bg-destructive/[0.04]"
    >
      <div className="flex items-start gap-3 px-4 py-3">
        <AlertCircle className="mt-0.5 size-4 shrink-0 text-destructive/60" />
        <div className="flex-1">
          <p className="text-sm font-medium text-destructive/80">Recording failed</p>
          <p className="mt-0.5 text-xs text-destructive/50">{message}</p>
        </div>
      </div>
      <div className="flex items-center gap-2 border-t border-destructive/10 px-4 py-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={onDismiss}
          className="text-xs text-muted-foreground/60"
        >
          Dismiss
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={onRetry}
          className="gap-1.5 border-destructive/20 text-xs text-destructive/70"
        >
          <RotateCcw className="size-3" />
          Retry
        </Button>
      </div>
    </motion.div>
  );
};

export default ErrorState;
