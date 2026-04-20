import { useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSplashController } from "@/hooks/useSplashController";
import assetGradient from "@assets/about/gradient-pastel.jpg";
import assetMoon from "@assets/about/moon.png";

const DURATION_MS = 2500;
const BAR_WIDTH_PX = 280;

export default function LoadingScreen() {
  const percentRef = useRef<HTMLSpanElement>(null);
  const barFillRef = useRef<HTMLDivElement>(null);

  const {
    showLoading,
    isExiting,
    isBgFading,
    isDone,
    onExitComplete,
    onBgFadeComplete,
  } = useSplashController({
    durationMs: DURATION_MS,
    onTick: (progress, percent) => {
      if (percentRef.current) {
        percentRef.current.textContent = percent.toString().padStart(2, "0");
      }
      if (barFillRef.current) {
        barFillRef.current.style.transform = `scaleX(${progress})`;
      }
    },
  });

  if (!showLoading || isDone) {
    return null;
  }

  const exitTransition = { duration: 0.4, ease: "easeOut" as const };

  return (
    <motion.div
      className="fixed inset-0 overflow-hidden"
      style={{
        zIndex: 100000,
        backgroundImage: `url(${assetGradient})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        willChange: "opacity",
      }}
      animate={{ opacity: isBgFading ? 0 : 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      onAnimationComplete={onBgFadeComplete}
    >
      {/* Darken overlay for contrast */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, rgba(20,15,30,0.28) 0%, rgba(20,15,30,0.58) 100%)",
        }}
      />

      {/* Moon — upper-right floating accent */}
      <motion.img
        src={assetMoon}
        alt=""
        aria-hidden
        initial={{ y: 24, opacity: 0 }}
        animate={{
          y: isExiting ? -48 : 0,
          opacity: isExiting ? 0 : 0.85,
        }}
        transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
        style={{
          position: "absolute",
          top: "16%",
          right: "12%",
          width: "140px",
          height: "auto",
          filter: "drop-shadow(0 0 48px rgba(255,240,220,0.35))",
          willChange: "transform, opacity",
        }}
      />

      <div className="relative w-full h-full flex items-center justify-center">
        <div className="flex flex-col items-center">
          <AnimatePresence onExitComplete={onExitComplete}>
            {!isExiting && (
              <>
                {/* Serif name — movie title card */}
                <motion.div
                  key="name"
                  initial={{ y: 32, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{
                    y: -24,
                    opacity: 0,
                    transition: { ...exitTransition, delay: 0 },
                  }}
                  transition={{
                    duration: 0.9,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                >
                  <span
                    style={{
                      fontFamily:
                        "'Cormorant Garamond', 'Playfair Display', serif",
                      fontSize: "104px",
                      fontWeight: 300,
                      fontStyle: "italic",
                      letterSpacing: "0.04em",
                      color: "#fdfaf5",
                      lineHeight: 1,
                      display: "inline-block",
                      willChange: "transform, opacity",
                    }}
                  >
                    minda
                  </span>
                </motion.div>

                {/* Thin progress line */}
                <motion.div
                  key="bar"
                  initial={{ opacity: 0, scaleX: 0.6 }}
                  animate={{ opacity: 1, scaleX: 1 }}
                  exit={{
                    opacity: 0,
                    y: -12,
                    transition: { ...exitTransition, delay: 0.08 },
                  }}
                  transition={{ duration: 0.7, delay: 0.25 }}
                  style={{
                    width: `${BAR_WIDTH_PX}px`,
                    marginTop: "36px",
                    height: "1px",
                    backgroundColor: "rgba(253,250,245,0.22)",
                    position: "relative",
                    overflow: "hidden",
                    willChange: "transform, opacity",
                  }}
                >
                  <div
                    ref={barFillRef}
                    style={{
                      width: "100%",
                      height: "100%",
                      background: "rgba(253,250,245,0.9)",
                      transform: "scaleX(0)",
                      transformOrigin: "left center",
                      willChange: "transform",
                    }}
                  />
                </motion.div>

                {/* Timecode */}
                <motion.div
                  key="timecode"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{
                    opacity: 0,
                    y: -8,
                    transition: { ...exitTransition, delay: 0.16 },
                  }}
                  transition={{ duration: 0.6, delay: 0.45 }}
                  style={{ marginTop: "20px", willChange: "opacity" }}
                >
                  <span
                    style={{
                      fontFamily: "'JetBrains Mono', 'Menlo', monospace",
                      fontSize: "10px",
                      letterSpacing: "0.32em",
                      color: "rgba(253,250,245,0.55)",
                      textTransform: "uppercase",
                    }}
                  >
                    loading · <span ref={percentRef}>00</span> / 100
                  </span>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}
