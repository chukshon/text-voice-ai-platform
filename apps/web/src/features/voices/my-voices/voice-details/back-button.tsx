import { ArrowLeft } from "lucide-react";

interface BackButtonProps {
  handleBackToVoices: () => void;
}
const BackButton = ({ handleBackToVoices }: BackButtonProps) => {
  return (
    <button
      onClick={handleBackToVoices}
      className="cursor-pointer mb-6 flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
    >
      <ArrowLeft className="size-3.5" />
      My Voices
    </button>
  );
};

export default BackButton;
