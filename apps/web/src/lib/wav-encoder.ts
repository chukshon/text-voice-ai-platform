/**
 * Takes raw sound samples and makes a WAV file.
 * Output is a normal WAV: mono, 16-bit.
 */
export function encodeWav(audioSamples: Float32Array, sampleRateHz: number): Blob {
  const numChannels = 1;
  const bitsPerSample = 16;
  const bytesPerSample = bitsPerSample / 8;
  const dataLength = audioSamples.length * bytesPerSample;
  const headerLength = 44;
  const wavBuffer = new ArrayBuffer(headerLength + dataLength);
  const dataView = new DataView(wavBuffer);

  // Small helper to write text into the file bytes
  const writeString = (offset: number, str: string) => {
    for (let i = 0; i < str.length; i++) {
      dataView.setUint8(offset + i, str.charCodeAt(i));
    }
  };

  // WAV file header
  writeString(0, "RIFF");
  dataView.setUint32(4, 36 + dataLength, true);
  writeString(8, "WAVE");

  // Audio format info (sample rate, channels, bit depth) chunk
  writeString(12, "fmt ");
  dataView.setUint32(16, 16, true); // chunk size
  dataView.setUint16(20, 1, true); // PCM format
  dataView.setUint16(22, numChannels, true);
  dataView.setUint32(24, sampleRateHz, true);
  dataView.setUint32(28, sampleRateHz * numChannels * bytesPerSample, true); // byte rate
  dataView.setUint16(32, numChannels * bytesPerSample, true); // block align
  dataView.setUint16(34, bitsPerSample, true);

  // Audio data chunk (actual audio samples)
  writeString(36, "data");
  dataView.setUint32(40, dataLength, true);

  // Turn float samples (-1 to 1) into 16-bit values
  let offset = headerLength;
  for (let i = 0; i < audioSamples.length; i++) {
    const clamped = Math.max(-1, Math.min(1, audioSamples[i]));
    dataView.setInt16(offset, clamped < 0 ? clamped * 0x8000 : clamped * 0x7fff, true);
    offset += 2;
  }

  return new Blob([wavBuffer], { type: "audio/wav" });
}
