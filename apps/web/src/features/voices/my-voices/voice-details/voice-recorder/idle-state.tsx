import { motion } from "framer-motion";
import { Mic } from "lucide-react";

const IdleState = ({ onRecord }: { onRecord: () => void }) => {
  return (
    <motion.button
      type="button"
      onClick={onRecord}
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.2 }}
      className="flex w-full flex-col items-center justify-center rounded-lg border border-dashed border-border/50 py-8 transition-colors hover:border-border hover:bg-foreground/[0.01]"
    >
      <Mic className="mb-2 size-6 text-muted-foreground/20" />
      <span className="text-xs font-medium text-muted-foreground/50">Record a voice sample</span>
      <span className="mt-1 text-[10px] text-muted-foreground/30">
        Up to 5 minutes · saves as WAV
      </span>
    </motion.button>
  );
};

export default IdleState;
