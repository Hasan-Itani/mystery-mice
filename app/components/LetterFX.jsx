"use client";
import { useEffect, useRef, useState } from "react";

export default function LetterFX({
  letterSrc,
  size = "240px",
  playKey = 0,
  underFrames = 7,
  fireFrames = 8,
  underFrameMs = 70,
  fireFrameMs = 70,
  pauseMs = 500,
}) {
  const [phase, setPhase] = useState("idle");
  const [underIdx, setUnderIdx] = useState(1);
  const [particleIdx, setParticleIdx] = useState(1);
  const [fireIdx, setFireIdx] = useState(1);
  const timers = useRef({});

  const underDurationMs = underFrames * underFrameMs;
  const fireDurationMs  = fireFrames * fireFrameMs;

  useEffect(() => {
    cleanup();
    setPhase("under");
    setUnderIdx(1);
    setParticleIdx(1);
    setFireIdx(1);

    let u = 1;
    timers.current.under = setInterval(() => {
      u += 1;
      if (u > underFrames) {
        clearInterval(timers.current.under);
        setPhase("wait");
        timers.current.pause = setTimeout(() => startFire(), pauseMs);
        return;
      }
      setUnderIdx(u);
      const p = Math.min(5, Math.floor(((u - 1) * 5) / Math.max(1, underFrames - 1)) + 1);
      setParticleIdx(p);
    }, underFrameMs);

    return cleanup;
  }, [playKey]);

  function startFire() {
    setPhase("fire");
    let f = 1;
    timers.current.fire = setInterval(() => {
      f += 1;
      if (f > fireFrames) {
        clearInterval(timers.current.fire);
        setPhase("done");
        return;
      }
      setFireIdx(f);
    }, fireFrameMs);
  }

  function cleanup() {
    if (timers.current.under) clearInterval(timers.current.under);
    if (timers.current.fire) clearInterval(timers.current.fire);
    if (timers.current.pause) clearTimeout(timers.current.pause);
    timers.current = {};
  }

  const inner = "w-[72%] h-[72%] object-contain";

  return (
    <div className="relative select-none" style={{ width: size, height: size }}>
      <img
        src={letterSrc}
        alt="letter"
        className={[
          "absolute inset-0 m-auto z-10",
          inner,
          phase === "under" ? "fx-letter-arc" : "",
          phase === "wait"  ? "fx-letter-hold" : "",
          phase === "fire"  ? "fx-letter-blink2" : "",
        ].join(" ")}
        style={{
          animationDuration:
            phase === "under" ? `${underDurationMs}ms`
            : phase === "fire" ? `${fireDurationMs}ms`
            : undefined,
          transformOrigin: "50% 90%",
        }}
        key={`letter-${playKey}-${phase}`}
      />

      {phase === "under" && (
        <>
          <div className="absolute inset-0 grid place-items-center pointer-events-none z-20" key={`under-${playKey}`}>
            <img src={`/ui/fire/fire_under_${underIdx}.png`} alt="" className={inner} />
          </div>
          <div className="absolute inset-0 grid place-items-center pointer-events-none z-20" key={`particles-${playKey}`}>
            <img
              src={`/ui/glowing_particles/particle_${particleIdx}.png`}
              alt=""
              className={inner}
              style={{ filter: "drop-shadow(0 0 10px rgba(255,255,255,0.35))" }}
            />
          </div>
        </>
      )}

      {phase === "fire" && (
        <div className="absolute inset-0 grid place-items-center pointer-events-none z-20" key={`fire-${playKey}`}>
          <img src={`/ui/fire/fire-${fireIdx}.png`} alt="" className={inner} />
        </div>
      )}

      <style jsx>{`
        /* === Improved arc-like rise + sway (more natural path) ===
           - quicker lift, slight right drift, then deeper left lean, then settle */
        @keyframes fx-letter-arc {
          0%   { transform: translateY(0) translateX(0) rotate(0deg);
                 filter: drop-shadow(0 0 0 rgba(255,255,255,0)); }
          15%  { transform: translateY(-6%) translateX(1.2%) rotate(0.8deg); }
          38%  { transform: translateY(-11%) translateX(-2.2%) rotate(-3deg);
                 filter: drop-shadow(0 4px 10px rgba(255,255,255,0.20)); }
          62%  { transform: translateY(-8%) translateX(2.0%) rotate(2.1deg); }
          82%  { transform: translateY(-4%) translateX(-1.1%) rotate(-1.2deg); }
          100% { transform: translateY(-2%) translateX(0) rotate(0deg);
                 filter: drop-shadow(0 0 0 rgba(255,255,255,0)); }
        }
        .fx-letter-arc {
          animation-name: fx-letter-arc;
          animation-timing-function: cubic-bezier(.22,1,.36,1); /* easeOutBack-ish */
          animation-iteration-count: 1;
          animation-fill-mode: both; /* hold end pose into WAIT */
        }

        /* Hold class (no motion) to be explicit during WAIT */
        .fx-letter-hold {
          animation: none;
        }

        /* FIRE phase: blink twice → end hidden */
        @keyframes fx-letter-blink2 {
          0%   { opacity: 1; }
          30%  { opacity: 0; }  /* out */
          65%  { opacity: 1; }  /* back in */
          100% { opacity: 0; }  /* out again */
        }
        .fx-letter-blink2 {
          animation-name: fx-letter-blink2;
          animation-timing-function: ease-in-out;
          animation-iteration-count: 1;
          animation-fill-mode: both;
        }
      `}</style>
    </div>
  );
}
