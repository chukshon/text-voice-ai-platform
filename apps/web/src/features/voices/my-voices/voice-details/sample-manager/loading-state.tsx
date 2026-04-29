import { Skeleton } from "@/components/ui/skeleton";
import React from "react";

const LoadingState = () => {
  return (
    <div className="space-y-2">
      {[1, 2].map((i) => (
        <div key={i} className="flex items-center gap-3 rounded-md border border-border/50 p-3">
          <Skeleton className="size-8 rounded" />
          <div className="flex-1 space-y-1.5">
            <Skeleton className="h-3.5 w-32" />
            <Skeleton className="h-3 w-20" />
          </div>
        </div>
      ))}
    </div>
  );
};

export default LoadingState;
