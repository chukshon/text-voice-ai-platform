export interface SynthesizePayloadT {
  text: string;
  voice_id: string;
  language?: string;
  output_format?: string;
  speed?: number;
}

export interface SynthesizeResponseT {
  audioBuffer: Buffer;
  durationMs: number | null;
  sampleRate: number | null;
  engine: string | null;
  voiceId: string | null;
}
