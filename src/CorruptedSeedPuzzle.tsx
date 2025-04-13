import React, {
  useState,
  useEffect,
  useMemo,
  useCallback,
  useRef,
} from "react";
import { Shield, AlertCircle, Timer, CheckCircle, X } from "lucide-react";

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
  const [effectsLevel, setEffectsLevel] = useState("high");
  const [isMobile, setIsMobile] = useState(false);

  const puzzleContainerRef = useRef<HTMLDivElement>(null);

  const runes = useMemo<Rune[]>(
    () => [
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
        codeSnippet:
          "const world = new VirtualEnvironment({ seed: 'empyrea' });",
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
        codeSnippet:
          "Eden.prototype.reboot = function() { this.initialize(); }",
      },
      {
        id: 5,
        name: "Quantarus",
        symbol: "⍟",
        description: "Bridge between magic and technology",
        codeSnippet: "export class MagicSystem extends TechSystem { }",
      },
    ],
    []
  );

  const runeSpots = useMemo<RuneSpot[]>(
    () => [
      { id: 0, correctRuneId: 3, angle: 0 },
      { id: 1, correctRuneId: 5, angle: 60 },
      { id: 2, correctRuneId: 0, angle: 120 },
      { id: 3, correctRuneId: 4, angle: 180 },
      { id: 4, correctRuneId: 1, angle: 240 },
      { id: 5, correctRuneId: 2, angle: 300 },
    ],
    []
  );

  const circuitCount = useMemo(() => {
    if (isMobile) return 4; // Always use low settings on mobile

    switch (effectsLevel) {
      case "low":
        return 4;
      case "medium":
        return 8;
      case "high":
      default:
        return 12;
    }
  }, [effectsLevel, isMobile]);

  // Handle window resize to check for mobile and adjust puzzle display
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);

      // Dynamically adjust puzzle container size based on viewport
      if (puzzleContainerRef.current) {
        const viewportHeight = window.innerHeight;
        const viewportWidth = window.innerWidth;
        const minDimension = Math.min(
          viewportHeight * 0.7,
          viewportWidth * 0.8
        );

        // Ensure puzzle size is responsive but doesn't exceed reasonable bounds
        const puzzleSize = Math.min(500, minDimension);
        puzzleContainerRef.current.style.width = `${puzzleSize}px`;
        puzzleContainerRef.current.style.height = `${puzzleSize}px`;
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // Add smooth transition effect when puzzle is completed
  useEffect(() => {
    if (isPuzzleComplete) {
      // Add gentle pulse effect to signal completion
      const elements = document.querySelectorAll(".rune-spot");
      elements.forEach((el, index) => {
        (el as HTMLElement).style.animationDelay = `${index * 0.1}s`;
        el.classList.add("animate-pulse-green");
      });
    }
  }, [isPuzzleComplete]);

  useEffect(() => {
    if (puzzleStarted && !isPuzzleComplete) {
      const timer = setInterval(() => {
        setRemainingTime((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      // Performance check - reduce visual effects on slower devices
      const checkPerformance = () => {
        const startTime = performance.now();
        let result = 0;
        for (let i = 0; i < 1000; i++) {
          result += Math.sin(i) * Math.cos(i);
        }
        const endTime = performance.now();
        const elapsedTime = endTime - startTime;

        if (elapsedTime > 10) {
          setEffectsLevel("low");
        } else if (elapsedTime > 5) {
          setEffectsLevel("medium");
        }
      };

      checkPerformance();

      return () => clearInterval(timer);
    }
  }, [puzzleStarted, isPuzzleComplete]);

  // Check for puzzle completion
  useEffect(() => {
    if (placedRunes.length >= 6) {
      setIsPuzzleComplete(true);
      setTimeout(() => {
        onComplete();
      }, 2000);
    }
  }, [placedRunes, onComplete]);

  const startPuzzle = () => {
    setPuzzleStarted(true);
    setRemainingTime(60);
  };

  const placeRune = useCallback(
    (runeId: number, spotId: number) => {
      const targetSpot = runeSpots[spotId];

      if (targetSpot.correctRuneId === runeId) {
        setPlacedRunes((prev) => [...prev, runeId]);
        setErrorMessage("");
        // Play success sound effect (visual feedback instead)
        const successEl = document.createElement("div");
        successEl.className =
          "fixed inset-0 bg-green-500/10 z-50 pointer-events-none animate-success";
        document.body.appendChild(successEl);
        setTimeout(() => document.body.removeChild(successEl), 1000);
      } else {
        setErrorMessage("Syntax Error—Rune Mismatch");
        // Play error sound effect (visual feedback instead)
        const errorEl = document.createElement("div");
        errorEl.className =
          "fixed inset-0 bg-red-500/10 z-50 pointer-events-none error-venom";
        errorEl.style.setProperty("--x", `50%`);
        errorEl.style.setProperty("--y", `50%`);
        document.body.appendChild(errorEl);
        setTimeout(() => document.body.removeChild(errorEl), 1000);

        setTimeout(() => {
          setErrorMessage("");
        }, 1500);
      }

      setActiveRune(null);
    },
    [runeSpots]
  );

  // Generate puzzle circuit patterns for visual effect
  const generateCircuitPatterns = useCallback(() => {
    const circuits = [];

    for (let i = 0; i < circuitCount; i++) {
      const angle = (i / circuitCount) * 360;
      const length = 40 + Math.random() * 60;
      const delay = Math.random() * 5;

      circuits.push(
        <div
          key={`circuit-${i}`}
          className="absolute bg-blue-400/30 animate-pulse-slow"
          style={{
            height: "1px",
            width: `${length}px`,
            left: "50%",
            top: "50%",
            transform: `rotate(${angle}deg) translateX(100px)`,
            animationDelay: `${delay}s`,
            boxShadow: "0 0 8px rgba(56, 189, 248, 0.8)",
            opacity: 0.7,
          }}
        />
      );
    }

    return circuits;
  }, [circuitCount]);

  return (
    <div className="relative flex flex-col items-center justify-center overflow-hidden h-full w-full">
      <div className="absolute inset-0 bg-[#050510] z-0">
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `radial-gradient(circle at 15% 50%, rgba(0, 200, 255, 0.1) 0%, transparent 25%),
              radial-gradient(circle at 85% 30%, rgba(255, 0, 128, 0.1) 0%, transparent 25%)`,
          }}
        ></div>
      </div>

      <div className="container mx-auto z-10 px-4 py-8 flex flex-col items-center justify-center h-full">
        {!puzzleStarted ? (
          <div className="max-w-2xl mx-auto text-center bg-black/50 backdrop-blur-md p-6 md:p-8 rounded-lg border border-blue-500/30 animate-scaleIn">
            <Shield className="text-blue-400 mx-auto mb-4" size={48} />
            <h2 className="text-2xl md:text-3xl font-light text-blue-100 mb-4 md:mb-6">
              The Corrupted Seed
            </h2>

            <p className="text-blue-200/80 mb-6 md:mb-8">
              A giant glowing seed hovers in the center, flickering between a
              botanical heart and a circuit board. It's wrapped in a swirling
              pattern of ASCII runes and magical glyphs.
            </p>

            <div className="italic text-blue-300/70 mb-6 md:mb-8 border-l-2 border-blue-500/50 pl-4 py-2">
              "Merge the runes with the code. Restore our seed, or watch Empyrea
              unravel."
            </div>

            <button
              className="px-6 py-3 bg-blue-900/50 border border-blue-400/50 text-blue-300 hover:bg-blue-800/60 transition-all duration-300 rounded-lg shadow-lg hover:shadow-blue-900/50 flex items-center space-x-2 mx-auto group"
              onClick={startPuzzle}
            >
              <AlertCircle
                size={20}
                className="group-hover:text-blue-200 transition-colors"
              />
              <span className="group-hover:translate-x-1 transition-transform">
                Begin Restoration
              </span>
            </button>
          </div>
        ) : (
          <div className="relative w-full h-full flex flex-col items-center justify-center">
            <div className="absolute top-0 right-0 flex items-center bg-black/50 backdrop-blur-md rounded-lg p-3 border border-red-500/30 animate-fadeIn">
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

            {errorMessage && (
              <div className="absolute top-0 left-1/2 transform -translate-x-1/2 mt-2 md:mt-0 bg-red-900/70 text-red-200 px-4 py-2 rounded font-mono text-sm backdrop-blur-md border border-red-500/50 flex items-center animate-scaleIn">
                <AlertCircle className="mr-2 text-red-400" size={16} />
                {errorMessage}
              </div>
            )}

            {isPuzzleComplete && (
              <div className="absolute inset-0 flex items-center justify-center z-50 bg-black/80 backdrop-blur-md transition-opacity duration-500 animate-fadeIn">
                <div className="max-w-2xl mx-auto text-center p-6 md:p-8 rounded-lg border border-green-500/50 bg-black/70 transition-all duration-500 transform scale-100 animate-scaleIn">
                  <CheckCircle
                    className="text-green-400 mx-auto mb-4 animate-pulse"
                    size={64}
                  />
                  <h2 className="text-3xl md:text-4xl font-light text-green-100 mb-6">
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

                  <button className="px-6 md:px-8 py-3 md:py-4 bg-green-900/50 border border-green-400/50 text-green-300 hover:bg-green-800/60 transition-all duration-300 rounded-lg shadow-lg hover:shadow-green-900/50 text-base md:text-lg tracking-wider uppercase">
                    Complete the Tech-Fest Journey
                  </button>
                </div>
              </div>
            )}

            <div
              ref={puzzleContainerRef}
              className="relative mx-auto my-4"
              style={{ width: "500px", height: "500px" }}
            >
              {/* Circuit patterns */}
              {puzzleStarted && generateCircuitPatterns()}

              {/* Center seed */}
              <div
                className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 w-40 h-40 rounded-full bg-gradient-to-br from-emerald-500/20 to-blue-500/20 backdrop-filter backdrop-blur-sm border-4 border-cyan-500/30 z-20"
                style={{
                  boxShadow: "0 0 20px rgba(6, 182, 212, 0.3)",
                  animation:
                    effectsLevel === "low"
                      ? "none"
                      : "pulse 3s infinite ease-in-out",
                }}
              >
                <div className="absolute inset-0 flex items-center justify-center text-cyan-300 text-6xl animate-rotate-slow">
                  {isPuzzleComplete ? "✓" : "⌘"}
                </div>
              </div>

              {/* Rune spots/slots */}
              {runeSpots.map((spot) => (
                <div
                  key={`spot-${spot.id}`}
                  className={`absolute w-16 h-16 rounded-full flex items-center justify-center transition-all duration-300 ${
                    activeRune !== null
                      ? "bg-blue-500/30 border border-blue-400/50"
                      : "bg-blue-900/20 border border-blue-500/30"
                  } rune-spot`}
                  style={{
                    left: "calc(50% - 8px)",
                    top: "calc(50% - 8px)",
                    transform: `rotate(${spot.angle}deg) translate(120px) rotate(-${spot.angle}deg)`,
                    cursor: activeRune !== null ? "pointer" : "default",
                    opacity: placedRunes.includes(spot.correctRuneId)
                      ? 1
                      : activeRune !== null
                      ? 0.9
                      : 0.6,
                  }}
                  onClick={() => {
                    if (
                      activeRune !== null &&
                      !placedRunes.includes(spot.correctRuneId)
                    ) {
                      placeRune(activeRune, spot.id);
                    }
                  }}
                >
                  {placedRunes.includes(spot.correctRuneId) && (
                    <div className="text-3xl text-cyan-400 animate-appear">
                      {runes.find((r) => r.id === spot.correctRuneId)?.symbol}
                    </div>
                  )}
                </div>
              ))}

              {/* Connection lines */}
              {runeSpots.map((spot) => (
                <div
                  key={`line-${spot.id}`}
                  className="absolute left-1/2 top-1/2 w-[120px] h-[1px] origin-left"
                  style={{
                    transform: `rotate(${spot.angle}deg)`,
                    background: placedRunes.includes(spot.correctRuneId)
                      ? "linear-gradient(90deg, rgba(34, 211, 238, 0.7), rgba(34, 211, 238, 0.1))"
                      : "linear-gradient(90deg, rgba(186, 230, 253, 0.3), rgba(186, 230, 253, 0.05))",
                    boxShadow: placedRunes.includes(spot.correctRuneId)
                      ? "0 0 8px rgba(34, 211, 238, 0.4)"
                      : "none",
                    opacity: placedRunes.includes(spot.correctRuneId) ? 1 : 0.4,
                    transition: "all 0.5s ease-in-out",
                  }}
                ></div>
              ))}
            </div>

            <div className="mt-4 md:mt-8 bg-black/50 backdrop-blur-sm p-4 md:p-6 rounded-lg border border-blue-500/20 w-full max-w-4xl mx-auto">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-blue-300 font-light text-xl">
                  Available Runes
                </h3>
                <div className="text-sm text-blue-200/70">
                  {placedRunes.length}/6 Placed
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 gap-3 md:gap-4">
                {runes.map((rune) => (
                  <div
                    key={`rune-${rune.id}`}
                    className={`p-3 md:p-4 rounded-lg transition-all duration-300 cursor-pointer relative overflow-hidden ${
                      activeRune === rune.id
                        ? "bg-blue-800/50 border-2 border-blue-400/80"
                        : placedRunes.includes(rune.id)
                        ? "bg-green-900/30 border border-green-500/30 opacity-70"
                        : "bg-blue-900/30 border border-blue-500/30 hover:bg-blue-800/40"
                    }`}
                    onClick={() => {
                      if (!placedRunes.includes(rune.id)) {
                        setActiveRune(activeRune === rune.id ? null : rune.id);
                      }
                    }}
                  >
                    <div
                      className="absolute inset-0 opacity-20"
                      style={{
                        background:
                          activeRune === rune.id
                            ? "radial-gradient(circle at 30% 30%, rgba(59, 130, 246, 0.8), transparent 70%)"
                            : placedRunes.includes(rune.id)
                            ? "radial-gradient(circle at 30% 30%, rgba(34, 197, 94, 0.4), transparent 70%)"
                            : "none",
                      }}
                    />

                    <div className="flex items-start mb-2">
                      <div className="text-3xl mr-3 text-cyan-400/90">
                        {rune.symbol}
                      </div>
                      <div>
                        <h4 className="font-medium text-blue-200">
                          {rune.name}
                        </h4>
                        <div className="text-xs text-blue-300/70 mt-0.5">
                          {placedRunes.includes(rune.id)
                            ? "PLACED"
                            : "AVAILABLE"}
                        </div>
                      </div>
                    </div>

                    <div className="text-xs font-mono bg-black/40 p-2 rounded text-blue-300/80 mt-2 opacity-90 overflow-hidden text-ellipsis whitespace-nowrap">
                      {rune.codeSnippet}
                    </div>

                    {placedRunes.includes(rune.id) && (
                      <div className="absolute top-2 right-2 text-green-400">
                        <CheckCircle size={16} />
                      </div>
                    )}
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
