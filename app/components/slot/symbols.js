export const IMG_BASE = "/symbols";
export const SYMBOLS = [
  "A.png",
  "K.png",
  "Q.png",
  "cigarate.png",
  "level_clearance.png",
  "cap.png",
  "police_mice.png",
  "detective_mice.png",
  "mafia_mice.png",
];
 
const CLEARANCE_IMG = "level_clearance.png";
const CLEARANCE_WEIGHTS = [10, 9, 8, 7, 6, 5, 4, 3, 2, 1];
 
function weightedPick(weights) {
  const total = weights.reduce((a, b) => a + b, 0);
  let r = Math.random() * total;
  for (let i = 0; i < weights.length; i++) {
    r -= weights[i];
    if (r < 0) return i;
  }
  return weights.length - 1;
}
 
export function rollClearanceValue() {
  return weightedPick(CLEARANCE_WEIGHTS) + 1;
}
 
export function isClearance(sym) {
  return sym && sym.img === CLEARANCE_IMG;
}
 
export const makeRandomGrid = () =>
  Array.from({ length: 6 }, () =>
    Array.from({ length: 6 }, () => {
      const img = SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)];
      if (img === CLEARANCE_IMG) {
        return { img, clearance: rollClearanceValue() };
      }
      return { img };
    })
  );