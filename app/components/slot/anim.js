export const raf = () => new Promise((res) => requestAnimationFrame(res));
export const sleep = (ms) => new Promise((res) => setTimeout(res, ms));

export const waitTransitionEndProp = (el, ms, prop = "transform") =>
  new Promise((resolve) => {
    if (!el) return resolve();
    let done = false;
    const onEnd = (e) => {
      if (e.propertyName === prop) {
        done = true;
        el.removeEventListener("transitionend", onEnd);
        resolve();
      }
    };
    el.addEventListener("transitionend", onEnd);
    setTimeout(() => {
      if (!done) {
        el.removeEventListener("transitionend", onEnd);
        resolve();
      }
    }, ms + 50);
  });

export async function animateToTranslateY(pieceRefs, id, distance, durationMs = 300) {
  await raf();
  const el = pieceRefs.current.get(id);
  if (!el) return;

  el.style.willChange = "transform";
  el.style.transition = "none";
  el.style.transform = "translate3d(0, 0, 0)";
  void el.getBoundingClientRect();

  const dur = Math.max(1, Math.round(durationMs));
  el.style.transition = `transform ${dur}ms cubic-bezier(0.22, 1, 0.36, 1)`;
  el.style.transform = `translate3d(0, ${distance}px, 0)`;
  await waitTransitionEndProp(el, dur, "transform");
}

export async function landingBounce(pieceRefs, id, distance, cellH, bumpPx) {
  const el = pieceRefs.current.get(id);
  if (!el) return;
  if (!bumpPx) bumpPx = Math.max(6, Math.min(12, Math.round(cellH * 0.18)));
  if (distance <= 0) return;

  const downDur = 110;
  el.style.transition = `transform ${downDur}ms ease-out`;
  el.style.transform = `translate3d(0, ${distance + bumpPx}px, 0)`;
  await waitTransitionEndProp(el, downDur, "transform");

  const upDur = 130;
  el.style.transition = `transform ${upDur}ms ease-in`;
  el.style.transform = `translate3d(0, ${distance}px, 0)`;
  await waitTransitionEndProp(el, upDur, "transform");
}

export async function fadeOutOpacity(pieceRefs, id, durationMs = 250) {
  await raf();
  const el = pieceRefs.current.get(id);
  if (!el) return;

  el.style.willChange = "opacity";
  el.style.transition = "none";
  el.style.opacity = "1";
  void el.getBoundingClientRect();

  const dur = Math.max(1, Math.round(durationMs));
  el.style.transition = `opacity ${dur}ms ease-out`;
  el.style.opacity = "0";
  await waitTransitionEndProp(el, dur, "opacity");
}
