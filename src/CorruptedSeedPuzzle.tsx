import React, { useState, useEffect } from "react";
import { Shield, AlertCircle, Timer, CheckCircle } from "lucide-react";

// Rune data structure
interface Rune {
  id: number;
  name: string;
  symbol: string;
  description: string;
  codeSnippet: string;
}

// Rune spot structure
interface RuneSpot {
  id: number;
  correctRuneId: number;
  angle: number;
}

interface CorruptedSeedPuzzleProps {
  onComplete: () => void;
}

const CorruptedSeedPuzzle: React.FC<CorruptedSeedPuzzleProps> = ({
  onComplete,
}) => {
  const [puzzleStarted, setPuzzleStarted] = useState(false);
  const [activeRune, setActiveRune] = useState<number | null>(null);
  const [placedRunes, setPlacedRunes] = useState<number[]>([]);
  const [remainingTime, setRemainingTime] = useState(60);
  const [isPuzzleComplete, setIsPuzzleComplete] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Runes data
  const runes: Rune[] = [
    {
      id: 0,
      name: "Aetheria",
      symbol: "Ω",
      description: "The binding force of reality's illusion",
      codeSnippet: "function initSimulation() { return new Eden(); }",
    },
    {
      id: 1,
      name: "Digitara",
      symbol: "⌘",
      description: "Guardian of the digital realm",
      codeSnippet: "if (reality.perception > 0.85) { reveal(); }",
    },
    {
      id: 2,
      name: "Virtuon",
      symbol: "⏣",
      description: "Keeper of virtual boundaries",
      codeSnippet: "const world = new VirtualEnvironment({ seed: 'empyrea' });",
    },
    {
      id: 3,
      name: "Pixelion",
      symbol: "⋰",
      description: "Weaver of digital illusions",
      codeSnippet: "await system.repair(['core', 'memory', 'visuals']);",
    },
    {
      id: 4,
      name: "Bytenoth",
      symbol: "⎔",
      description: "Ancient data that powers the seed",
      codeSnippet: "Eden.prototype.reboot = function() { this.initialize(); }",
    },
    {
      id: 5,
      name: "Quantarus",
      symbol: "⍟",
      description: "Bridge between magic and technology",
      codeSnippet: "export class MagicSystem extends TechSystem { }",
    },
  ];

  // Destination spots for runes
  const runeSpots: RuneSpot[] = [
    { id: 0, correctRuneId: 3, angle: 0 },
    { id: 1, correctRuneId: 5, angle: 60 },
    { id: 2, correctRuneId: 0, angle: 120 },
    { id: 3, correctRuneId: 4, angle: 180 },
    { id: 4, correctRuneId: 1, angle: 240 },
    { id: 5, correctRuneId: 2, angle: 300 },
  ];

  // Start the puzzle timer
  useEffect(() => {
    if (puzzleStarted) {
      const timer = setInterval(() => {
        setRemainingTime((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [puzzleStarted]);

  // Check for puzzle completion
  useEffect(() => {
    if (placedRunes.length >= 6) {
      setIsPuzzleComplete(true);
      setTimeout(() => {
        onComplete();
      }, 5000);
    }
  }, [placedRunes, onComplete]);

  // Handle puzzle start
  const startPuzzle = () => {
    setPuzzleStarted(true);
  };

  // Handle rune placement
  const placeRune = (runeId: number, spotId: number) => {
    const targetSpot = runeSpots[spotId];

    // Check if this is the correct rune for this spot
    if (targetSpot.correctRuneId === runeId) {
      setPlacedRunes((prev) => [...prev, runeId]);
      setErrorMessage("");

      // Play success sound (if implemented)
      playSuccessSound();
    } else {
      // Show error message
      setErrorMessage("Syntax Error—Rune Mismatch");

      // Play error sound (if implemented)
      playErrorSound();

      // Create venom effect on error
      const venomElement = document.querySelector(".venom-takeover");
      if (venomElement) {
        // Intensify the venom effect with error coloring
        venomElement.classList.add("venom-error");

        // Create random "venom" tendrils spreading from the error point
        const errorPoint = document.createElement("div");
        errorPoint.style.position = "fixed";
        errorPoint.style.left = "0";
        errorPoint.style.top = "0";
        errorPoint.style.width = "100vw";
        errorPoint.style.height = "100vh";
        errorPoint.style.zIndex = "99";
        errorPoint.style.pointerEvents = "none";
        errorPoint.style.setProperty("--x", `${Math.random() * 100}%`);
        errorPoint.style.setProperty("--y", `${Math.random() * 100}%`);
        errorPoint.className = "error-venom";

        document.body.appendChild(errorPoint);

        setTimeout(() => {
          venomElement.classList.remove("venom-error");
          document.body.removeChild(errorPoint);
        }, 1200);
      }
    }

    // Reset active rune
    setActiveRune(null);
  };

  // Mock sound functions (replace with actual audio implementation if desired)
  const playSuccessSound = () => {
    console.log("Success sound played");
  };

  const playErrorSound = () => {
    console.log("Error sound played");
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 bg-[#050510] z-0">
        {/* Digital circuit patterns */}
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `radial-gradient(circle at 15% 50%, rgba(0, 200, 255, 0.1) 0%, transparent 25%),
              radial-gradient(circle at 85% 30%, rgba(255, 0, 128, 0.1) 0%, transparent 25%)`,
          }}
        ></div>

        <div className="absolute inset-0">
          {[...Array(50)].map((_, i) => (
            <div
              key={`circuit-${i}`}
              className="absolute bg-blue-500/20"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                width: `${Math.random() * 150 + 50}px`,
                height: "1px",
                transform: `rotate(${Math.random() * 360}deg)`,
              }}
            ></div>
          ))}
        </div>
      </div>

      {/* Main puzzle content */}
      <div className="container mx-auto z-10 px-4 py-12">
        {!puzzleStarted ? (
          // Puzzle intro
          <div className="max-w-2xl mx-auto text-center bg-black/50 backdrop-blur-md p-8 rounded-lg border border-blue-500/30">
            <Shield className="text-blue-400 mx-auto mb-4" size={48} />
            <h2 className="text-3xl font-light text-blue-100 mb-6">
              The Corrupted Seed
            </h2>

            <p className="text-blue-200/80 mb-8">
              A giant glowing seed hovers in the center, flickering between a
              botanical heart and a circuit board. It's wrapped in a swirling
              pattern of ASCII runes and magical glyphs.
            </p>

            <div className="italic text-blue-300/70 mb-8 border-l-2 border-blue-500/50 pl-4 py-2">
              "Merge the runes with the code. Restore our seed, or watch Empyrea
              unravel."
            </div>

            <button
              className="px-6 py-3 bg-blue-900/50 border border-blue-400/50 text-blue-300 hover:bg-blue-800/60 transition-all duration-300 rounded-lg shadow-lg hover:shadow-blue-900/50 flex items-center space-x-2 mx-auto"
              onClick={startPuzzle}
            >
              <AlertCircle size={20} />
              <span>Begin Restoration</span>
            </button>
          </div>
        ) : (
          // Active puzzle
          <div className="relative">
            {/* Timer and progress */}
            <div className="absolute top-0 right-0 flex items-center bg-black/50 backdrop-blur-md rounded-lg p-3 border border-red-500/30">
              <Timer className="text-red-400 mr-2" size={20} />
              <span
                className={`font-mono ${
                  remainingTime < 15
                    ? "text-red-500 animate-pulse"
                    : "text-white/80"
                }`}
              >
                {remainingTime}s
              </span>
            </div>

            {/* Error message */}
            {errorMessage && (
              <div className="absolute top-0 left-1/2 transform -translate-x-1/2 bg-red-900/70 text-red-200 px-4 py-2 rounded font-mono text-sm backdrop-blur-md border border-red-500/50 flex items-center">
                <AlertCircle className="mr-2 text-red-400" size={16} />
                {errorMessage}
              </div>
            )}

            {/* Completed message */}
            {isPuzzleComplete && (
              <div className="absolute inset-0 flex items-center justify-center z-50 bg-black/80 backdrop-blur-md">
                <div className="max-w-2xl mx-auto text-center p-8 rounded-lg border border-green-500/50 bg-black/70 animate-success">
                  <CheckCircle
                    className="text-green-400 mx-auto mb-4"
                    size={64}
                  />
                  <h2 className="text-4xl font-light text-green-100 mb-6">
                    Simulation Restored
                  </h2>

                  <p className="text-green-200/80 mb-8">
                    The seed bursts into a shockwave of shimmering particles.
                    Empyrea is restored to a gorgeous, stable fantasy state.
                  </p>

                  <div className="italic text-green-300/70 mb-8 border-l-2 border-green-500/50 pl-4 py-2">
                    "You have saved Empyrea—and proven that magic and technology
                    can harmonize."
                  </div>

                  <button className="px-8 py-4 bg-green-900/50 border border-green-400/50 text-green-300 hover:bg-green-800/60 transition-all duration-300 rounded-lg shadow-lg hover:shadow-green-900/50 text-lg tracking-wider uppercase">
                    Complete the Tech-Fest Journey
                  </button>
                </div>
              </div>
            )}

            {/* Main seed */}
            <div
              className="relative mx-auto"
              style={{ width: "500px", height: "500px" }}
            >
              {/* Circuit/Venom Effects */}
              {puzzleStarted && (
                <>
                  {[...Array(12)].map((_, i) => (
                    <div
                      key={`circuit-${i}`}
                      className={
                        errorMessage ? "critical-circuit-path" : "circuit-path"
                      }
                      style={{
                        left: `${
                          250 + 180 * Math.cos((i * 30 * Math.PI) / 180)
                        }px`,
                        top: `${
                          250 + 180 * Math.sin((i * 30 * Math.PI) / 180)
                        }px`,
                        height: `${100 + Math.random() * 80}px`,
                        animationDelay: `${i * 0.2}s`,
                        transform: `translateY(${-100}px) rotate(${i * 30}deg)`,
                        transformOrigin: "bottom center",
                        opacity: errorMessage
                          ? 1
                          : remainingTime < 30
                          ? 0.8
                          : 0.4,
                      }}
                    />
                  ))}
                </>
              )}

              {/* Central seed */}
              <div
                className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 w-40 h-40 rounded-full bg-gradient-to-br from-emerald-500/20 to-blue-500/20 backdrop-filter backdrop-blur-sm border-4 border-cyan-500/30 animate-pulse z-20"
                style={{
                  boxShadow:
                    "0 0 20px rgba(6, 182, 212, 0.3), 0 0 40px rgba(6, 182, 212, 0.2)",
                }}
              >
                <div className="absolute inset-0 rounded-full overflow-hidden opacity-50">
                  <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBzdHJva2U9IiMwYmYiIHN0cm9rZS13aWR0aD0iMC4yIj48Y2lyY2xlIGN4PSIxMDAiIGN5PSIxMDAiIHI9IjgwIi8+PGNpcmNsZSBjeD0iMTAwIiBjeT0iMTAwIiByPSI2MCIvPjxjaXJjbGUgY3g9IjEwMCIgY3k9IjEwMCIgcj0iNDAiLz48cGF0aCBkPSJNMTAwIDIwdjE2MG0wLTgwaC04MG04MCAwaDgwbS02MC02MGw0MCA0MG0wLTQwbC00MCA0MG02MCAwbC00MCA0MG00MCAwbC00MCA0MCIvPjwvZz48L3N2Zz4=')]"></div>
                </div>
              </div>

              {/* Rune spots in a circle around the seed */}
              {runeSpots.map((spot) => {
                const isCorrectlyFilled = placedRunes.includes(
                  spot.correctRuneId
                );
                return (
                  <div
                    key={`spot-${spot.id}`}
                    className={`absolute w-16 h-16 rounded-full flex items-center justify-center cursor-pointer transition-all duration-300 ${
                      isCorrectlyFilled
                        ? "bg-green-800/20 border-2 border-green-500/50"
                        : "bg-blue-900/20 border border-blue-500/30"
                    }`}
                    style={{
                      left: `${
                        250 + 180 * Math.cos((spot.angle * Math.PI) / 180)
                      }px`,
                      top: `${
                        250 + 180 * Math.sin((spot.angle * Math.PI) / 180)
                      }px`,
                      boxShadow: isCorrectlyFilled
                        ? "0 0 15px rgba(74, 222, 128, 0.3)"
                        : "",
                      zIndex: 10,
                    }}
                    onClick={() =>
                      activeRune !== null && placeRune(activeRune, spot.id)
                    }
                  >
                    {isCorrectlyFilled ? (
                      <div className="text-3xl text-green-400">
                        {runes[spot.correctRuneId].symbol}
                      </div>
                    ) : (
                      <div className="text-3xl text-blue-500/40 animate-pulse">
                        ?
                      </div>
                    )}
                  </div>
                );
              })}

              {/* Lines connecting rune spots to seed */}
              {runeSpots.map((spot) => {
                const isCorrectlyFilled = placedRunes.includes(
                  spot.correctRuneId
                );
                return (
                  <div
                    key={`line-${spot.id}`}
                    className={`absolute left-1/2 top-1/2 origin-left h-px w-[180px] transition-all duration-500 ${
                      isCorrectlyFilled ? "bg-green-400/60" : "bg-blue-500/30"
                    }`}
                    style={{
                      transform: `rotate(${spot.angle}deg)`,
                      zIndex: 5,
                    }}
                  >
                    {isCorrectlyFilled && (
                      <>
                        <div className="absolute left-1/4 w-2 h-2 rounded-full bg-green-400/80 -mt-1 animate-pulse"></div>
                        <div className="absolute left-2/4 w-2 h-2 rounded-full bg-green-400/80 -mt-1 animate-pulse animate-delay-150"></div>
                        <div className="absolute left-3/4 w-2 h-2 rounded-full bg-green-400/80 -mt-1 animate-pulse animate-delay-300"></div>
                      </>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Available runes */}
            <div className="mt-12 bg-black/50 backdrop-blur-sm p-6 rounded-lg border border-blue-500/20 max-w-3xl mx-auto">
              <h3 className="text-blue-300 mb-4 font-light text-center">
                Place Runes to Heal the Seed
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {runes
                  .filter((rune) => !placedRunes.includes(rune.id))
                  .map((rune) => (
                    <div
                      key={`rune-${rune.id}`}
                      className={`p-4 rounded-lg backdrop-blur-md bg-blue-900/20 border border-blue-500/30 cursor-pointer transition-all duration-300 hover:bg-blue-800/30 hover:border-blue-400/40 ${
                        activeRune === rune.id
                          ? "ring-2 ring-blue-400 bg-blue-800/40"
                          : ""
                      }`}
                      onClick={() => setActiveRune(rune.id)}
                    >
                      <div className="flex items-center mb-2">
                        <div className="text-3xl text-blue-400 mr-3">
                          {rune.symbol}
                        </div>
                        <h4 className="text-blue-200">{rune.name}</h4>
                      </div>
                      <p className="text-blue-300/70 text-sm">
                        {rune.description}
                      </p>
                      <div className="mt-3 font-mono text-xs bg-blue-950/50 p-2 rounded text-blue-300/60 border-l-2 border-blue-600/40">
                        {rune.codeSnippet}
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CorruptedSeedPuzzle;
