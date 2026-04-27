"use client";
import { Button } from "@/components/ui/button";
import { ArrowRight, AudioWaveform, MessageSquareText } from "lucide-react";
import Link from "next/link";

interface HeroSectionProps {
  name: string;
}

const HeroSection = ({ name }: HeroSectionProps) => {
  return (
    <div className="relative mb-10 overflow-hidden rounded-xl border border-border/50 bg-card/50 px-8 py-10">
      <div className="relative z-10">
        <h1 className="text-2xl font-bold">Welcome back, {name?.split(" ")[0]}</h1>
        <p className="mt-1 max-w-md text-sm text-muted-foreground">
          Generate lifelike speech, clone voices, and build audio experiences with AI.
        </p>
        <div className="mt-5 flex gap-3">
          <Button asChild>
            <Link href="/tts">
              <MessageSquareText className="size-4" />
              Generate Speech
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/voices/library">
              Browse Voices
              <ArrowRight className="size-4" />
            </Link>
          </Button>
        </div>
      </div>

      {/* Decorative waveform */}
      <div className="absolute -right-4 top-1/2 -translate-y-1/2 opacity-[0.04]">
        <AudioWaveform className="size-48" />
      </div>
    </div>
  );
};

export default HeroSection;
