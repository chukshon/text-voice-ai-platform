import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import React from "react";

interface HeaderProps {
  handleCreateVoice: () => void;
}
const header = ({ handleCreateVoice }: HeaderProps) => {
  return (
    <div className="mb-6 flex items-center justify-between">
      <div>
        <h1 className="text-2xl font-bold">My Voices</h1>
        <p className="text-sm text-muted-foreground">Create and manage your custom voices</p>
      </div>
      <Button onClick={handleCreateVoice}>
        <Plus className="size-4" />
        Create Voice
      </Button>
    </div>
  );
};

export default header;
