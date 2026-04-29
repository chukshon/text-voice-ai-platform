import { Button } from "@/components/ui/button";
import React from "react";
import { useRouter } from "nextjs-toploader/app";
import { ROUTES } from "@/constants";

const EmptyState = () => {
  const router = useRouter();
  const handleBackToVoices = () => {
    router.push(ROUTES.VOICES);
  };
  return (
    <div className="flex flex-col items-center justify-center py-20">
      <p className="text-sm text-muted-foreground">Voice not found</p>
      <Button variant="outline" className="mt-4" onClick={handleBackToVoices}>
        Back to voices
      </Button>
    </div>
  );
};

export default EmptyState;
