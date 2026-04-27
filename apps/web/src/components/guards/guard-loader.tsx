import { AudioWaveform } from "lucide-react";
import { Spinner } from "@/components/ui/spinner";

const GuardLoader = () => {
  return (
    <div className="flex flex-col justify-center items-center h-screen">
      <div className="flex h-14 items-center gap-2.5 px-5">
        <div className="flex size-7 items-center justify-center rounded-md bg-foreground">
          <AudioWaveform className="size-3.5 text-background" />
        </div>
        <span className="text-sm font-bold tracking-tight">Text to Voice AI</span>
      </div>
      <Spinner />
    </div>
  );
};

export default GuardLoader;
