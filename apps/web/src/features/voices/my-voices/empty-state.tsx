import { Button } from "@/components/ui/button";
import { Mic, Plus } from "lucide-react";

interface EmptyStateProps {
  handleCreateVoice: () => void;
}
const EmptyState = ({ handleCreateVoice }: EmptyStateProps) => {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <Mic className="mb-3 size-10 text-muted-foreground/50" />
      <p className="text-sm font-medium text-muted-foreground">No voices yet</p>
      <p className="mt-1 text-xs text-muted-foreground/70">
        Create your first custom voice to get started
      </p>
      <Button className="mt-4" onClick={handleCreateVoice}>
        <Plus className="size-4" />
        Create Voice
      </Button>
    </div>
  );
};

export default EmptyState;
