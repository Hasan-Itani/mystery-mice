"use client";
import { useEffect, useRef, useState } from "react";

export default function ClearanceBadge({
  digit = 1,
  size = "260px",
  offset = "0",
  playKey = null,
  onDecrement,
  className = "",
}) {
  const rootRef = useRef(null);

  const [fireFrame, setFireFrame] = useState(1);
  const clamp1to9 = (n) => ((n - 1 + 9) % 9) + 1;

  const [shifting, setShifting] = useState(false);
  const [renderCur, setRenderCur] = useState(Number(digit) || 1);
  const [renderNext, setRenderNext] = useState(
    clamp1to9((Number(digit) || 1) - 1)
  );

  const curChars = String(renderCur).split("");
  const nextChars = String(renderNext).split("");

  const widthPctFor = (len) => (len === 2 ? 38 : 22);
  const slotWidthPct = Math.max(
    widthPctFor(curChars.length),
    widthPctFor(nextChars.length)
  );
  const gapPct = (len) => (len === 2 ? 6 : 0);
  const imgWidthPct = (len) => (len === 2 ? 46 : 100);

  useEffect(() => {
    if (playKey === null) return;

    const el = rootRef.current;
    if (!el) return;

    el.classList.remove("playing");
    void el.offsetHeight;
    el.classList.add("playing");

    const startShiftTimer = setTimeout(() => runDigitShift(), 1020);

    const stopPlayingTimer = setTimeout(
      () => el.classList.remove("playing"),
      1200
    );

    return () => {
      clearTimeout(startShiftTimer);
      clearTimeout(stopPlayingTimer);
    };
  }, [playKey]);
  useEffect(() => {
    if (!shifting) {
      const d = Number(digit) || 1;
      setRenderCur(d);
      setRenderNext(clamp1to9(d - 1));
    }
  }, [digit, shifting]); 

  const runDigitShift = () => {
    const el = rootRef.current;
    if (!el) return;

    const base = Number(digit) || renderCur;
    const next = clamp1to9(base - 1);

    setRenderCur(base);
    setRenderNext(next);
    setShifting(true);
    el.classList.add("digit-shifting");

    setFireFrame(1);
    const FRAMES = 8;
    const INTERVAL = 55;
    let f = 1;
    const frameTimer = setInterval(() => {
      f = f >= FRAMES ? 1 : f + 1;
      setFireFrame(f);
    }, INTERVAL);

    const commitTimer = setTimeout(() => {
      onDecrement?.(next);
      setRenderCur(next);
    }, 240);

    const endTimer = setTimeout(() => {
      clearInterval(frameTimer);
      setShifting(false);
      el.classList.remove("digit-shifting");
    }, 560);

    return () => {
      clearInterval(frameTimer);
      clearTimeout(commitTimer);
      clearTimeout(endTimer);
    };
  };

  return (
    <div style={{ width: size, marginTop: offset }} className={className}>
      <div ref={rootRef} className="fx-badge">
        <img className="layer glow" src="/symbols/clearance/glow.png" alt="" />

        <img
          className="layer bottomPaper"
          src="/symbols/clearance/bottom_paper.png"
          alt=""
        />
        <img
          className="layer topPaper"
          src="/symbols/clearance/top_paper.png"
          alt=""
        />
        <img
          className="layer paper"
          src="/symbols/clearance/paper.png"
          alt=""
        />

        <img
          className="layer border"
          src="/symbols/clearance/inner_border.png"
          alt=""
        />

        <img className="layer starL" src="/symbols/clearance/star.png" alt="" />
        <img className="layer starR" src="/symbols/clearance/star.png" alt="" />
        <img
          className="layer levelTxt"
          src="/symbols/clearance/level.png"
          alt="LEVEL"
        />
        <img
          className="layer clearTxt"
          src="/symbols/clearance/clearance.png"
          alt="CLEARANCE"
        />

        <div
          className="layer digitWrap"
          style={{ width: `${slotWidthPct}%`, left: "44%", top: "46%" }}
        >
          <div
            className="digits-cur"
            style={{ gap: `${gapPct(curChars.length)}%` }}
          >
            {curChars.map((ch, i) => (
              <img
                key={`cur-${i}`}
                src={`/symbols/clearance/digits/${ch}.png`}
                alt={ch}
                style={{ width: `${imgWidthPct(curChars.length)}%` }}
              />
            ))}
          </div>

          <div
            className="digits-next"
            style={{ gap: `${gapPct(nextChars.length)}%` }}
          >
            {nextChars.map((ch, i) => (
              <img
                key={`next-${i}`}
                src={`/symbols/clearance/digits/${ch}.png`}
                alt={ch}
                style={{ width: `${imgWidthPct(nextChars.length)}%` }}
              />
            ))}
          </div>
        </div>

        <div
          className="fireMask"
          style={{ visibility: shifting ? "visible" : "hidden" }}
        >
          <img
            className="fireOverlay"
            src={`/ui/fire/fire-${fireFrame}.png`}
            alt=""
          />
        </div>

        <img
          className="layer winMark"
          src="/symbols/clearance/win_mark.png"
          alt="WIN"
        />
        <img
          className="layer printMark"
          src="/symbols/clearance/print_win_mark.png"
          alt="PRINTER"
        />
      </div>
    </div>
  );
}
