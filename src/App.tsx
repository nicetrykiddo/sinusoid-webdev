import React, { useState, useEffect, useRef, lazy, Suspense } from "react";
import {
  Sparkles,
  Moon,
  Sun,
  Trees as Tree,
  Mountain,
  Cloud,
  AlertTriangle,
  RefreshCw,
  Code,
  Cpu,
  Binary,
  X,
} from "lucide-react";
// Lazy load the puzzle component to improve initial load time
const CorruptedSeedPuzzle = lazy(() => import("./CorruptedSeedPuzzle"));

function App() {
  const [scrollY, setScrollY] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [showPlotTwist, setShowPlotTwist] = useState(false);
  const [showPuzzle, setShowPuzzle] = useState(false);
  const [isPuzzleComplete, setIsPuzzleComplete] = useState(false);
  const morningVideoRef = useRef<HTMLVideoElement>(null);
  const nightVideoRef = useRef<HTMLVideoElement>(null);
  const [throttle, setThrottle] = useState(false);
  const [hasPassedFeatureSection, setHasPassedFeatureSection] = useState(false);
  const featuresRef = useRef<HTMLDivElement>(null);

  // Initialize with a scroll check to ensure elements are visible on page load
  useEffect(() => {
    const checkInitialScroll = () => {
      const scrollPos = window.scrollY;
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;

      const percentScrolled = (scrollPos / (documentHeight - windowHeight)) * 100;
      setScrollProgress(percentScrolled);
      setIsDark(percentScrolled > 30);
      setShowPlotTwist(percentScrolled > 90);
      setScrollY(scrollPos);

      // Check if features section is in view on initial load
      if (featuresRef.current) {
        const featureRect = featuresRef.current.getBoundingClientRect();
        const featureInView = featureRect.top < windowHeight && featureRect.bottom > 0;
        if (featureInView || scrollPos > 500) {
          setHasPassedFeatureSection(true);
        }
      }

      document.documentElement.style.setProperty(
        "--scroll-progress",
        `${percentScrolled}%`
      );

      setIsLoaded(true);
    };

    checkInitialScroll();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (throttle) return;

      setThrottle(true);

      setTimeout(() => setThrottle(false), 50);

      const darkThresholdPercent = 30;
      const plotTwistThresholdPercent = 90;
      const percentScrolled =
        (window.scrollY /
          (document.documentElement.scrollHeight - window.innerHeight)) *
        100;
      setScrollProgress(percentScrolled);
      setIsDark(percentScrolled > darkThresholdPercent);
      setShowPlotTwist(percentScrolled > plotTwistThresholdPercent);
      setScrollY(window.scrollY);

      // Check if we've scrolled to the features section
      if (featuresRef.current) {
        const featureRect = featuresRef.current.getBoundingClientRect();
        const featureInView = featureRect.top < window.innerHeight && featureRect.bottom > 0;
        if (featureInView || window.scrollY > 500) {
          setHasPassedFeatureSection(true);
        }
      }

      document.documentElement.style.setProperty(
        "--scroll-progress",
        `${percentScrolled}%`
      );
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [throttle]);

  const getMorningOpacity = () => {
    if (scrollProgress < 25) return 1;
    if (scrollProgress > 35) return 0;
    return 1 - (scrollProgress - 25) / 10;
  };

  const getNightOpacity = () => {
    if (scrollProgress < 25) return 0;
    if (scrollProgress > 35) return 1;
    return (scrollProgress - 25) / 10;
  };

  const codeSnippets = [
    "function initSimulation() { return new Promise(() => {}); }",
    "class Empyrea extends VirtualEnvironment { constructor() { super(); }}",
    "ERROR: Memory allocation failed at 0x7FFE23A991B0",
    "await Project.Eden.load('./assets/simulation_core.json');",
    "if (user.awareness > thresholdValue) triggerReveal();",
    "const magicEffect = new Proxy(techEffect, { get: function() {} });",
  ];

  const openPuzzleModal = () => {
    setShowPuzzle(true);
    document.body.style.overflow = "hidden";
  };

  const closePuzzleModal = () => {
    setShowPuzzle(false);
    document.body.style.overflow = "auto";
  };

  const handlePuzzleComplete = () => {
    setIsPuzzleComplete(true);
    setShowPuzzle(false);
    document.body.style.overflow = "auto";
  };

  return (
    <div
      className={`relative overflow-hidden transition-all duration-1000 min-h-screen ${
        isDark ? "text-white smooth-dark" : "text-[#2a2a2a]"
      } ${isPuzzleComplete ? "puzzle-complete" : ""}`}
    >
      {/* Video Background */}
      <div className="fixed inset-0 w-full h-full z-0">
        <video
          ref={morningVideoRef}
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover transition-opacity duration-1000"
          style={{ opacity: getMorningOpacity() }}
        >
          <source src="../assets/morning.mp4" type="video/mp4" />
        </video>

        <video
          ref={nightVideoRef}
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover transition-opacity duration-1000"
          style={{ opacity: getNightOpacity() }}
        >
          <source src="../assets/night.mp4" type="video/mp4" />
        </video>

        <div
          className="absolute inset-0 transition-all duration-1000"
          style={{
            background: `linear-gradient(to top, 
              rgba(${isDark ? "10, 10, 40" : "135, 206, 235"}, ${
              isDark ? 0.7 : 0.3
            }) 0%, 
              rgba(${isDark ? "10, 10, 40" : "135, 206, 235"}, ${
              isDark ? 0.4 : 0.1
            }) 50%,
              rgba(${isDark ? "10, 10, 40" : "135, 206, 235"}, 0) 100%)`,
            opacity:
              scrollProgress > 20
                ? scrollProgress > 80
                  ? 0.9
                  : 0.5 + (scrollProgress - 20) / 150
                : 0.5,
          }}
        ></div>
      </div>

      {/* Animated Background Elements */}
      <div className="fixed inset-0 pointer-events-none z-10">
        <div
          className="absolute transition-all duration-1000"
          style={{
            right: "10%",
            top: isDark ? "80%" : "20%",
            transform: `translateY(${scrollY * 0.2}px) scale(${
              isDark ? 0.8 : 1
            })`,
            opacity: isLoaded ? 1 : 0,
          }}
        >
          <Sun
            className={`w-20 h-20 text-yellow-400 animate-float-1 transition-opacity duration-1000`}
            style={{ opacity: getMorningOpacity() }}
          />
        </div>

        <div
          className="absolute transition-all duration-1000"
          style={{
            right: "10%",
            top: "80%",
            transform: `translateY(${scrollY * 0.2}px) scale(${
              isDark ? 1 : 0.8
            })`,
            opacity: isLoaded ? 1 : 0,
          }}
        >
          <Moon
            className={`w-16 h-16 text-gray-200 animate-float-0 transition-opacity duration-1000`}
            style={{ opacity: getNightOpacity() }}
          />
        </div>

        <div className="absolute inset-0">
          {[...Array(6)].map((_, i) => (
            <Cloud
              key={`cloud-${i}`}
              className={`absolute transition-all duration-1000 ${`animate-float-${
                i % 3
              }`}`}
              style={{
                left: `${i * 20 + Math.sin(i) * 10}%`,
                top: `${10 + i * 5}%`,
                transform: `translateX(${scrollY * (0.1 + i * 0.05)}px) scale(${
                  1 + i * 0.2
                })`,
                opacity: isLoaded ? (isDark ? 0.3 : 0.8) : 0,
                color: isDark ? "#1a1a2a" : "white",
                transitionDelay: `${i * 100}ms`,
              }}
            />
          ))}
        </div>

        <div className="absolute bottom-0 w-full">
          {[...Array(3)].map((_, i) => (
            <Mountain
              key={`mountain-${i}`}
              className="absolute bottom-0 transition-all duration-1000"
              style={{
                left: `${i * 40 - 10}%`,
                transform: `translateX(${
                  scrollY * (0.05 + i * 0.02)
                }px) scale(${2 + i * 0.5})`,
                zIndex: i,
                opacity: isLoaded ? 1 : 0,
                color: isDark ? "#151530" : "#1b4726",
                transitionDelay: `${i * 200 + 300}ms`,
              }}
            />
          ))}
        </div>

        <div className="absolute bottom-0 w-full">
          {[...Array(8)].map((_, i) => (
            <Tree
              key={`tree-${i}`}
              className="absolute bottom-0 transition-all duration-1000"
              style={{
                left: `${i * 15}%`,
                transform: `translateX(${scrollY * (0.1 + i * 0.03)}px) scale(${
                  1 + (i % 3) * 0.3
                })`,
                zIndex: 10,
                opacity: isLoaded ? 1 : 0,
                color: isDark ? "#101038" : "#0d5c1f",
                transitionDelay: `${i * 100 + 600}ms`,
              }}
            />
          ))}
        </div>

        <div className="absolute inset-0">
          {[...Array(50)].map((_, i) => (
            <Sparkles
              key={`star-${i}`}
              className="absolute animate-twinkle transition-all duration-1000"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 60}%`,
                transform: `scale(${0.2 + Math.random() * 0.3})`,
                animationDelay: `${i * 0.1}s`,
                opacity: getNightOpacity() * 0.8,
                color: `rgba(255, 255, 255, ${0.4 + Math.random() * 0.6})`,
              }}
              size={4}
            />
          ))}
        </div>
      </div>

      <div className="relative z-20">
        <nav
          className="fixed top-0 left-0 right-0 bg-black/30 backdrop-blur-md border-b border-blue-500/20 py-4 px-6 flex justify-between items-center"
          style={{
            opacity: scrollProgress > 10 ? 1 : 0,
            transform:
              scrollProgress > 10 ? "translateY(0)" : "translateY(-100%)",
            transition: "all 0.5s ease",
            zIndex: 50,
          }}
        >
          {isDark && scrollProgress > 40 && scrollProgress < 85 && (
            <>
              {[...Array(5)].map((_, i) => (
                <div
                  key={`nav-tendril-${i}`}
                  className="absolute top-full left-0 w-px z-40 pointer-events-none"
                  style={{
                    height: `${Math.min(
                      20 + (scrollProgress - 40) * 0.8,
                      60
                    )}px`,
                    left: `${20 + i * 25}%`,
                    background: `linear-gradient(to bottom, 
                      rgba(${60 + i * 20}, ${20 + i * 40}, ${
                      180 - i * 20
                    }, 0.8),
                      transparent)`,
                    boxShadow: `0 0 4px rgba(${80 + i * 20}, ${60 + i * 30}, ${
                      200 - i * 20
                    }, 0.5)`,
                    filter: "blur(0.6px)",
                    opacity: 0.6,
                  }}
                />
              ))}
            </>
          )}

          <div className="flex items-center">
            <span className="text-lg font-light mr-1">PROJECT</span>
            <span className="text-blue-400 text-lg">_</span>
            <span className="text-lg font-light">EDEN</span>
          </div>

          <div className="hidden md:flex space-x-8">
            <a
              href="#"
              className={`text-sm hover:text-blue-400 transition-colors ${
                isDark ? "text-gray-300" : "text-gray-800"
              }`}
            >
              Overview
            </a>
            <a
              href="#"
              className={`text-sm hover:text-blue-400 transition-colors ${
                isDark ? "text-gray-300" : "text-gray-800"
              }`}
            >
              Features
            </a>
            <a
              href="#"
              className={`text-sm hover:text-blue-400 transition-colors ${
                isDark ? "text-gray-300" : "text-gray-800"
              }`}
            >
              Gameplay
            </a>
            <a
              href="#"
              className={`text-sm hover:text-blue-400 transition-colors ${
                isDark ? "text-gray-300" : "text-gray-800"
              }`}
            >
              Community
            </a>
          </div>

          <button className="bg-blue-500/20 text-blue-400 border border-blue-500/40 px-4 py-2 rounded-md text-sm hover:bg-blue-500/30 transition-colors">
            Download
          </button>
        </nav>

        <div
          className="fixed bottom-8 right-8 bg-black/30 backdrop-blur-md p-4 rounded-lg border border-blue-500/20 flex gap-6 text-xs md:text-sm"
          style={{
            opacity: scrollProgress > 15 ? 1 : 0,
            transform:
              scrollProgress > 15 ? "translateY(0)" : "translateY(20px)",
            transition: "all 0.5s ease",
            zIndex: 40,
          }}
        >
          <div className="flex flex-col items-center">
            <div className="text-blue-400 font-mono mb-1">SYSTEM</div>
            <div className="font-semibold">
              {Math.min(100, Math.floor(scrollProgress))}%
            </div>
          </div>
          <div className="flex flex-col items-center">
            <div className="text-green-400 font-mono mb-1">MEMORY</div>
            <div className="font-semibold">
              {Math.min(16, Math.floor(scrollProgress / 6))}GB
            </div>
          </div>
          <div className="flex flex-col items-center">
            <div className="text-orange-400 font-mono mb-1">ERRORS</div>
            <div className="font-semibold">
              {Math.min(12, Math.floor(scrollProgress / 10))}
            </div>
          </div>
        </div>

        <section className="min-h-screen flex items-center justify-center">
          <div
            className="text-center transform transition-all duration-1000"
            style={{
              transform: isLoaded
                ? `translateY(${
                    scrollProgress < 20 ? 0 : -scrollProgress * 0.5
                  }px)`
                : "translateY(10px)",
              opacity: isLoaded
                ? scrollProgress > 80
                  ? 1 - (scrollProgress - 80) / 20
                  : 1
                : 0,
            }}
          >
            <h1 className="text-6xl md:text-8xl font-light mb-6 tracking-wider">
              PROJECT<span className="text-blue-400">_</span>EDEN
            </h1>
            <p
              className="text-lg md:text-xl tracking-[0.2em] uppercase transition-colors duration-1000"
              style={{
                color: isDark
                  ? "rgba(191, 219, 254, 0.8)"
                  : "rgba(22, 101, 52, 1)",
              }}
            >
              Reality is Just a Simulation
            </p>
          </div>
        </section>

        <section className="relative py-32 backdrop-blur-sm bg-white/5" ref={featuresRef}>
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-16 mb-32">
                {[
                  {
                    icon: Code,
                    title: "Digital Realms",
                    description:
                      "Explore vast procedurally generated worlds where code and reality intertwine",
                  },
                  {
                    icon: Cpu,
                    title: "Neural Networks",
                    description:
                      "Solve complex puzzles that adapt to your unique playstyle and strategies",
                  },
                  {
                    icon: Sparkles,
                    title: "Memory Fragments",
                    description:
                      "Uncover hidden story elements through exploration and interaction",
                  },
                  {
                    icon: Binary,
                    title: "System Override",
                    description:
                      "Master the art of hacking as you reshape the simulation from within",
                  },
                ].map((feature, i) => (
                  <div
                    key={i}
                    className="group relative backdrop-blur-md rounded-lg p-6 overflow-hidden transition-all duration-500 hover:scale-105"
                    style={{
                      background: isDark
                        ? "rgba(15, 15, 40, 0.2)"
                        : "rgba(255, 255, 255, 0.1)",
                      borderColor: isDark
                        ? "rgba(59, 130, 246, 0.2)"
                        : "rgba(22, 101, 52, 0.2)",
                      borderWidth: "1px",
                      transform: hasPassedFeatureSection
                        ? "translateY(0) scale(1)"
                        : `translateY(${50 + i * 20}px) scale(0.95)`,
                      opacity: hasPassedFeatureSection ? 1 : 0,
                      transitionDelay: `${i * 150}ms`,
                      boxShadow: isDark
                        ? "0 4px 20px rgba(10, 10, 40, 0.3)"
                        : "0 4px 20px rgba(0, 100, 0, 0.1)",
                    }}
                  >
                    <div
                      className="absolute inset-0 opacity-10 transition-opacity duration-500 group-hover:opacity-20"
                      style={{
                        background: isDark
                          ? "radial-gradient(circle at 30% 30%, rgba(59, 130, 246, 0.6), transparent 70%)"
                          : "radial-gradient(circle at 30% 30%, rgba(22, 163, 74, 0.6), transparent 70%)",
                      }}
                    ></div>
                    <div className="mb-6 relative">
                      <div className="w-14 h-14 flex items-center justify-center rounded-lg bg-gradient-to-br from-blue-500/20 to-purple-500/20 backdrop-blur-sm group-hover:scale-110 transition-all duration-500">
                        <feature.icon
                          className="transition-all duration-500"
                          style={{
                            color: isDark
                              ? "rgb(96, 165, 250)"
                              : "rgb(21, 128, 61)",
                          }}
                          size={28}
                        />
                      </div>
                    </div>
                    <h3 className="text-2xl font-light mb-2 tracking-wide flex items-center">
                      {feature.title}
                      <span className="ml-2 text-xs px-2 py-1 rounded-full bg-blue-500/20 text-blue-400">
                        NEW
                      </span>
                    </h3>
                    <p
                      className="leading-relaxed transition-colors duration-1000 mb-4"
                      style={{
                        color: isDark
                          ? "rgba(191, 219, 254, 0.6)"
                          : "rgba(22, 101, 52, 0.8)",
                      }}
                    >
                      {feature.description}
                    </p>
                    <div className="flex justify-between items-center mt-2 pt-3 border-t border-blue-500/20">
                      <div className="text-xs font-mono opacity-70">
                        LEVEL {i + 1}
                      </div>
                      <div className="text-xs text-blue-400">EXPLORE →</div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-16 mb-24 flex flex-col md:flex-row justify-center items-center gap-10 px-4 opacity-70">
                <div className="flex items-center gap-6">
                  <div className="h-14 w-14 rounded-full bg-black/30 flex items-center justify-center">
                    <div className="text-xl font-bold">16+</div>
                  </div>
                  <div className="text-left">
                    <div className="text-sm uppercase tracking-wider mb-1 opacity-70">
                      Age Rating
                    </div>
                    <div className="text-xs opacity-50">Violence, Language</div>
                  </div>
                </div>

                <div className="hidden md:block w-px h-14 bg-current opacity-20"></div>

                <div className="flex items-center gap-6">
                  <div className="text-right">
                    <div className="text-sm uppercase tracking-wider mb-1 opacity-70">
                      Release Date
                    </div>
                    <div className="text-xs opacity-50">Coming Q2 2024</div>
                  </div>
                  <div className="h-14 w-14 rounded-full bg-black/30 flex items-center justify-center">
                    <div className="text-2xl">🎮</div>
                  </div>
                </div>
              </div>

              <div className="text-center">
                <h2
                  className="text-4xl md:text-5xl font-light mb-6 md:mb-8 tracking-wide"
                  style={{
                    opacity: scrollY > 800 ? 1 : 0,
                    transform:
                      scrollY > 800 ? "translateY(0)" : "translateY(30px)",
                    transition: "opacity 1s ease, transform 1s ease",
                  }}
                >
                  Enter Project Eden
                </h2>
                <div
                  className="flex flex-col sm:flex-row items-center justify-center gap-4 md:gap-6 px-4 relative z-10"
                  style={{
                    opacity: scrollY > 850 ? 1 : 0,
                    transform:
                      scrollY > 850 ? "translateY(0)" : "translateY(30px)",
                    transition: "all 1s ease 0.2s",
                  }}
                >
                  <button
                    className="w-full sm:w-auto px-6 py-4 rounded-lg tracking-widest uppercase text-sm transition-all duration-500 relative overflow-hidden group flex items-center justify-center"
                    style={{
                      background: isDark
                        ? "rgba(37, 99, 235, 0.15)"
                        : "rgba(21, 128, 61, 0.15)",
                      borderColor: isDark
                        ? "rgba(59, 130, 246, 0.4)"
                        : "rgba(22, 101, 52, 0.4)",
                      borderWidth: "1px",
                      color: isDark
                        ? "rgba(191, 219, 254, 1)"
                        : "rgba(20, 83, 45, 1)",
                      boxShadow: isDark
                        ? "0 4px 20px rgba(37, 99, 235, 0.15)"
                        : "0 4px 20px rgba(21, 128, 61, 0.15)",
                      minWidth: "180px",
                    }}
                    onClick={openPuzzleModal}
                  >
                    <span className="relative z-10 flex items-center">
                      <svg
                        className="w-5 h-5 mr-2 group-hover:translate-x-1 transition-transform"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M5 12h14m-7-7 7 7-7 7"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      Start Game
                    </span>
                    <div
                      className="absolute inset-0 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"
                      style={{
                        background: isDark
                          ? "linear-gradient(90deg, rgba(37, 99, 235, 0.3) 0%, rgba(37, 99, 235, 0.5) 100%)"
                          : "linear-gradient(90deg, rgba(21, 128, 61, 0.3) 0%, rgba(21, 128, 61, 0.5) 100%)",
                      }}
                    ></div>
                  </button>

                  <button
                    className="w-full sm:w-auto px-6 py-4 rounded-lg tracking-widest text-sm transition-all duration-500 relative overflow-hidden group flex items-center justify-center mt-3 sm:mt-0 backdrop-blur-sm"
                    style={{
                      background: isDark
                        ? "rgba(30, 58, 138, 0.1)"
                        : "rgba(20, 83, 45, 0.05)",
                      borderColor: isDark
                        ? "rgba(59, 130, 246, 0.2)"
                        : "rgba(20, 83, 45, 0.2)",
                      borderWidth: "1px",
                      color: isDark
                        ? "rgba(147, 197, 253, 0.9)"
                        : "rgba(20, 83, 45, 0.9)",
                      minWidth: "180px",
                    }}
                  >
                    <span className="relative z-10 flex items-center">
                      <svg
                        className="w-5 h-5 mr-2"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M5 3l14 9-14 9V3z"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      Watch Trailer
                    </span>
                  </button>
                </div>

                <div
                  className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto px-4"
                  style={{
                    opacity: scrollY > 900 ? 1 : 0,
                    transform:
                      scrollY > 900 ? "translateY(0)" : "translateY(20px)",
                    transition: "all 1s ease 0.4s",
                  }}
                >
                  {[
                    { label: "Immersive World", value: "8+" },
                    { label: "Unique Characters", value: "56" },
                    { label: "Hours of Gameplay", value: "100+" },
                    { label: "Player Reviews", value: "★★★★★" },
                  ].map((stat, i) => (
                    <div
                      key={i}
                      className="rounded-lg py-3 px-2 backdrop-blur-sm"
                      style={{
                        background: isDark
                          ? "rgba(15, 23, 42, 0.3)"
                          : "rgba(255, 255, 255, 0.1)",
                        borderColor: isDark
                          ? "rgba(59, 130, 246, 0.15)"
                          : "rgba(22, 101, 52, 0.15)",
                        borderWidth: "1px",
                      }}
                    >
                      <div
                        className="text-sm opacity-70 mb-1"
                        style={{
                          color: isDark
                            ? "rgb(186, 230, 253)"
                            : "rgb(20, 83, 45)",
                        }}
                      >
                        {stat.label}
                      </div>
                      <div
                        className="font-semibold"
                        style={{
                          color: isDark
                            ? "rgb(191, 219, 254)"
                            : "rgb(20, 83, 45)",
                        }}
                      >
                        {stat.value}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {showPlotTwist && (
                <section className="relative min-h-screen flex items-center justify-center plot-twist-reveal">
                  <div className="absolute inset-0 pointer-events-none">
                    {[...Array(20)].map((_, i) => (
                      <div
                        key={`star-${i}`}
                        className="absolute bg-blue-500/10"
                        style={{
                          left: `${Math.random() * 100}%`,
                          top: `${Math.random() * 100}%`,
                          width: `${Math.random() * 2 + 1}px`,
                          height: `${Math.random() * 2 + 1}px`,
                          boxShadow: "0 0 4px rgba(59, 130, 246, 0.5)",
                          borderRadius: "50%",
                          opacity: 0.6 + Math.random() * 0.4,
                          animation: `twinkle ${
                            2 + Math.random() * 3
                          }s infinite alternate ease-in-out`,
                          zIndex: 5,
                        }}
                      />
                    ))}

                    <div
                      className="absolute inset-0 opacity-10"
                      style={{
                        backgroundImage: `
                          linear-gradient(to right, rgba(59, 130, 246, 0.1) 1px, transparent 1px),
                          linear-gradient(to bottom, rgba(59, 130, 246, 0.1) 1px, transparent 1px)
                        `,
                        backgroundSize: "30px 30px",
                        zIndex: 6,
                      }}
                    />

                    <div className="absolute inset-0 flex flex-wrap justify-around items-center p-20 z-10 pointer-events-none">
                      {codeSnippets.map((snippet, i) => (
                        <div
                          key={`code-${i}`}
                          className="font-mono text-xs md:text-sm p-2 rounded bg-black/20 backdrop-blur-sm border border-blue-500/20 mb-4 opacity-70 shadow-lg"
                          style={{
                            maxWidth: "300px",
                            color: "rgba(191, 219, 254, 0.9)",
                            transform: `rotate(${Math.random() * 2 - 1}deg)`,
                            animation: `float-${i % 3} ${
                              3 + i
                            }s infinite ease-in-out`,
                          }}
                        >
                          {snippet}
                        </div>
                      ))}
                    </div>
                  </div>

                  {showPlotTwist && (
                    <div className="container mx-auto z-30 relative px-6">
                      <div className="bg-black/50 backdrop-blur-md p-8 rounded-lg border border-blue-500/30 max-w-4xl mx-auto shadow-lg">
                        <div className="flex items-center mb-6">
                          <AlertTriangle
                            className="text-blue-400 mr-3"
                            size={32}
                          />
                          <h2 className="text-blue-300 text-3xl font-light tracking-wide uppercase">
                            System Anomaly Detected
                          </h2>
                        </div>

                        <div className="space-y-6 prose prose-invert max-w-none">
                          <p className="text-xl md:text-2xl font-light mb-4 leading-relaxed">
                            Empyrea was never just a realm—it's an experimental
                            simulation. You're inside Project Eden, a tech-fest
                            exhibit that merges AI, VR, and illusions. The
                            system needs recalibration.
                          </p>

                          <div className="font-mono text-sm bg-black/30 p-4 rounded-lg border-l-2 border-blue-500/50 mb-6 text-blue-200/90">
                            &gt; STATUS: SIMULATION_INTEGRITY_COMPROMISED
                            <br />
                            &gt; FACADE_SUBSYSTEM_NEEDS_RECALIBRATION
                            <br />
                            &gt; REQUESTING_USER_AUTHORIZATION_FOR_SYSTEM_REPAIR
                          </div>

                          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8 mt-12">
                            <button
                              className="w-full sm:w-auto px-6 py-3 bg-blue-900/40 border border-blue-400/50 text-blue-300 hover:bg-blue-800/50 transition-all duration-300 rounded-lg shadow-lg hover:shadow-blue-900/30 flex items-center space-x-2 group"
                              onClick={openPuzzleModal}
                            >
                              <RefreshCw
                                size={20}
                                className="group-hover:rotate-180 transition-transform duration-700"
                              />
                              <span>Repair System</span>
                            </button>

                            <button className="w-full sm:w-auto mt-3 sm:mt-0 px-6 py-3 bg-purple-900/30 border border-purple-400/40 text-purple-300 hover:bg-purple-800/40 transition-all duration-300 rounded-lg shadow-lg hover:shadow-purple-900/30 flex items-center space-x-2">
                              <Code size={20} />
                              <span>View Source Code</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </section>
              )}

              {showPuzzle && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                  <div
                    className="absolute inset-0 bg-black/80 backdrop-blur-md"
                    onClick={closePuzzleModal}
                  ></div>

                  <button
                    onClick={closePuzzleModal}
                    className="absolute top-4 right-4 md:top-6 md:right-6 z-[60] p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
                    aria-label="Close puzzle"
                  >
                    <X size={24} />
                  </button>

                  <div className="relative w-full max-w-6xl z-[55] overflow-hidden rounded-lg flex items-center justify-center h-[90vh]">
                    <Suspense
                      fallback={
                        <div className="flex items-center justify-center bg-black/80 w-full h-full text-white">
                          <div className="flex flex-col items-center">
                            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-400 mb-4"></div>
                            <p className="text-blue-300">Loading puzzle...</p>
                          </div>
                        </div>
                      }
                    >
                      <CorruptedSeedPuzzle onComplete={handlePuzzleComplete} />
                    </Suspense>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

export default App;
