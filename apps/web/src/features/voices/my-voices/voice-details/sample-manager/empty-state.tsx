import { Mic } from "lucide-react";
import React from "react";

const EmptyState = () => {
  return (
    <div className="flex flex-col items-center py-8 text-center">
      <Mic className="mb-2 size-8 text-muted-foreground/40" />
      <p className="text-sm text-muted-foreground">No samples yet</p>
      <p className="mt-0.5 text-xs text-muted-foreground/70">
        Upload audio files to use for voice cloning
      </p>
    </div>
  );
};

export default EmptyState;
