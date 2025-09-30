"use client";
import { useCallback, useRef, useState } from "react";
import SlotBoard from "./components/SlotBoard";
import BetControls from "./components/BetControls";
import GameLoading from "./components/GameLoading";

export default function Home() {
  const [ready, setReady] = useState(false);
  const slotRef = useRef(null);

  const [credit, setCredit] = useState(100000);
  const [totalBet, setTotalBet] = useState(24);
  const [boardState, setBoardState] = useState("idle");
  const [roundWin, setRoundWin] = useState(0);
  const [lastWinItems, setLastWinItems] = useState([]);

  const handleSpin = useCallback(
    (wager, options = {}) => {
      if (boardState !== "idle") return false;
      const spinBet = typeof wager === "number" ? wager : totalBet;
      if (credit < spinBet) return false;

      const turboActive = !!options?.turbo;
      const speedMultiplier = turboActive ? 3 : 1;
      const started = !!slotRef.current?.tumbleAll?.({ speedMultiplier });
      if (!started) return false;

      setBoardState("spinning");
      setRoundWin(0);
      setLastWinItems([]);
      setCredit((c) => c - spinBet);
      return true;
    },
    [boardState, credit, totalBet]
  );

  const handleWin = useCallback((result) => {
    const amt =
      typeof result === "number" ? result : Number(result?.total || 0);
    const items =
      typeof result === "object" && result?.items ? result.items : [];
    setRoundWin((w) => w + amt);
    setCredit((c) => c + amt);
    if (items?.length) setLastWinItems(items);
  }, []);

  const handleBoardStateChange = useCallback((state) => {
    setBoardState(state || "idle");
  }, []);

  if (!ready) return <GameLoading onComplete={() => setReady(true)} />;

  return (
    <main className="relative h-dvh w-dvw overflow-hidden bg-[#0b0f1a]">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: "url('/ui/city.png')" }}
      />
      <div className="absolute inset-0 z-5 pointer-events-none">
        <img
          src="/ui/bluefade.png"
          alt="blue fade left"
          className="absolute bottom-30 right-80 h-full 
                    w-[25%] sm:w-[20%] md:w-[15%] lg:w-[12%] 
                    z-0 animate-pulse-bright"
        />
        <img
          src="/ui/bluefade_2.png"
          alt="blue fade right"
          className="absolute bottom-30 left-80 h-full 
                    w-[25%] sm:w-[20%] md:w-[15%] lg:w-[12%] 
                    z-0 animate-pulse-bright"
        />
        <img
          src="/ui/buildings.png"
          alt="buildings"
          className="absolute inset-0 bg-cover bg-center h-[90%]
                     sm:w-[110%] md:w-[100%] lg:w-full"
        />

        <img
            src="/ui/orange_fade_left.png"
            alt="orange fade left"
            className="absolute bottom-0 left-[5%] weak-fade
                      w-[250%] sm:w-[40%] md:w-[35%] lg:w-[50%] h-[25%]"
          />
        <img
          src="/ui/orange_fade_right_1.png"
          alt="orange fade right 1"
          className="absolute bottom-0 right-[10%] weak-fade
                     w-[250%] sm:w-[40%] md:w-[35%] lg:w-[50%] h-[25%]"
        />
        <img
          src="/ui/orange_fade_right_2.png"
          alt="orange fade right 2"
          className="absolute bottom-0 right-[-10%] weak-fade
                     w-[250%] sm:w-[40%] md:w-[35%] lg:w-[50%] h-[20%]"
        />
        <img
          src="/ui/orange_fade_up.png"
          alt="orange fade up"
          className="absolute bottom-100 right-20 weak-fade
                     w-[250%] sm:w-[40%] md:w-[35%] lg:w-[50%] h-[20%]"
        />
        <img
          src="/ui/orange_fade_up_2.png"
          alt="orange fade up 2"
          className="absolute bottom-[20%] left-80 weak-fade
                     w-[26%] sm:w-[20%] md:w-[18%] lg:w-[20%] h-[30%]"
        />
        <img
          src="/ui/orange_fade_up_big.png"
          alt="orange fade up big"
          className="absolute bottom-[40%] left-1/2 -translate-x-1/2 weak-fade
                     w-[40%] sm:w-[30%] md:w-[25%]"
        />
      </div>

      <div className="absolute bottom-0 w-[75%] z-0">
        <img
          src="/ui/bet_background.png"
          alt="bet background"
          className="w-full object-cover"
        />
      </div>

      <div className="absolute top-0 left-0 right-0 z-10 flex justify-center">
        <div style={{ height: "90vh", aspectRatio: "900/630" }}>
          <SlotBoard
            ref={slotRef}
            totalBet={totalBet}
            onWin={handleWin}
            onStateChange={handleBoardStateChange}
          />
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 z-20 h-[10vh] pointer-events-none">
        <div className="h-full flex items-end justify-center pointer-events-auto">
          <BetControls
            credit={credit}
            totalBet={totalBet}
            setTotalBet={setTotalBet}
            onSpin={handleSpin}
            canSpin={boardState === "idle"}
            roundWin={roundWin}
            lastWinItems={lastWinItems}
            maxWidth={1070}
            vwWidth={95}
          />
        </div>
      </div>
    </main>
  );
}
