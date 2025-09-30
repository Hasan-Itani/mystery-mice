"use client";
import { useEffect, useRef, useState } from "react";

export default function GameLoading({ durationMs = 3500, onComplete }) {
  const [progress, setProgress] = useState(0);
  const doneRef = useRef(false);

  useEffect(() => {
    let raf;
    const start = performance.now();
    const tick = (now) => {
      const t = Math.min(1, (now - start) / durationMs);
      const pct = Math.floor(t * 100);
      setProgress(pct);
      if (t < 1) {
        raf = requestAnimationFrame(tick);
      } else if (!doneRef.current) {
        doneRef.current = true;
        onComplete?.();
      }
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [durationMs, onComplete]);

  return (
    <div
      className="w-screen h-screen flex items-center justify-center bg-cover bg-center"
      style={{ backgroundImage: `url('/ui/loading.png')` }}
    >
      <div className="relative w-[90vw] max-w-[700px] aspect-[1000/200]">
        <img
          src="ui/logo.png"
          alt="logo"
          className="absolute left-0 top-[-240px] w-[100%] h-[120%] object-contain z-20"
          />
        <img
          src="/ui/progressbar.png"
          alt="progress frame"
          className="absolute inset-0 w-full h-full object-contain z-10"
        />

        <img
          src="/ui/progress_hollow.png"
          alt="progress hollow"
          className="absolute left-[7%] top-[35%] w-[86%] h-[30%] object-contain z-20"
        />

        <div
          className="absolute left-[7%] top-[35%] h-[30%] overflow-hidden z-30"
          style={{ width: `${Math.min(progress, 85)}%` }}
        >
          <img
            src="/ui/progress_active.png"
            alt="progress active"
            className="w-full h-full object-cover"
          />
        </div>

        <div
          className="absolute top-0 z-40 transition-all bottom-10"
          style={{
            left: `${Math.min(progress * 0.96 + 12, 93)}%`,
            transform: "translateX(-50%)",
          }}
        >
          <img
            src="/ui/progress_fire.png"
            alt="progress fire"
            className="h-[120px] object-contain bottom-20"
          />
        </div>
      </div>
    </div>
  );
}
