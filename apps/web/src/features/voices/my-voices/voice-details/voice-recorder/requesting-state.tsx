import { Loader2 } from "lucide-react";
import { motion } from "framer-motion";

const RequestingState = () => {
  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.2 }}
      className="flex items-center justify-center gap-2 rounded-lg border border-border/40 py-8"
    >
      <Loader2 className="size-4 animate-spin text-muted-foreground/50" />
      <span className="text-xs font-medium text-muted-foreground/50">
        Requesting microphone access...
      </span>
    </motion.div>
  );
};

export default RequestingState;
