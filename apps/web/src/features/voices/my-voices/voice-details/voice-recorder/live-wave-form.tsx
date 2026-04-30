import { useEffect, useRef } from "react";

const LiveWaveForm = ({ analyserNode }: { analyserNode: AnalyserNode | null }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);
  const historyRef = useRef<number[]>([]);
  const smoothedRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !analyserNode) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Handle retina / hi-DPI displays
    const dpr = window.devicePixelRatio || 1;
    const resizeCanvas = () => {
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.scale(dpr, dpr);
    };
    resizeCanvas();

    const observer = new ResizeObserver(resizeCanvas);
    observer.observe(canvas);

    const bufferLength = analyserNode.fftSize;
    const dataArray = new Float32Array(bufferLength);

    const BAR_W = 2.5;
    const GAP = 1.5;

    const draw = () => {
      animRef.current = requestAnimationFrame(draw);

      // Get time-domain data and compute RMS amplitude
      analyserNode.getFloatTimeDomainData(dataArray);
      let sum = 0;
      for (let i = 0; i < bufferLength; i++) sum += dataArray[i] * dataArray[i];
      const rms = Math.sqrt(sum / bufferLength);

      // Smooth the value to avoid jitter
      smoothedRef.current += (rms - smoothedRef.current) * 0.3;
      const level = Math.min(1, smoothedRef.current * 4); // boost for visibility

      // Push to rolling history
      const rect = canvas.getBoundingClientRect();
      const w = rect.width;
      const h = rect.height;
      const maxBars = Math.ceil(w / (BAR_W + GAP));
      historyRef.current.push(level);
      if (historyRef.current.length > maxBars) {
        historyRef.current = historyRef.current.slice(-maxBars);
      }

      ctx.clearRect(0, 0, w, h);

      const history = historyRef.current;
      const startX = w - history.length * (BAR_W + GAP);

      for (let i = 0; i < history.length; i++) {
        const val = history[i];
        const barH = Math.max(2, val * (h - 4));
        const x = startX + i * (BAR_W + GAP);
        const y = (h - barH) / 2;

        // Fade older bars slightly
        const age = 1 - (history.length - 1 - i) / maxBars;
        const alpha = 0.25 + age * 0.45;

        ctx.fillStyle = `rgba(99, 102, 241, ${alpha})`;
        ctx.beginPath();
        ctx.roundRect(x, y, BAR_W, barH, 1);
        ctx.fill();
      }
    };

    draw();
    return () => {
      cancelAnimationFrame(animRef.current);
      observer.disconnect();
    };
  }, [analyserNode]);

  return <canvas ref={canvasRef} className="h-12 w-full rounded-md" />;
};

export default LiveWaveForm;
