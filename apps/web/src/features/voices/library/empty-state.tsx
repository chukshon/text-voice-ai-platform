import { Mic } from "lucide-react";

const EmptyState = () => {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <Mic className="mb-3 size-10 text-muted-foreground/50" />
      <p className="text-sm font-medium text-muted-foreground">No voices found</p>
      <p className="mt-1 text-xs text-muted-foreground/70">Try adjusting your search or filters</p>
    </div>
  );
};

export default EmptyState;
