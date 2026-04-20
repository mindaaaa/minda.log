import React, { useState, useEffect, useRef } from "react";
import { ChevronLeft } from "lucide-react";

// ─── Constants ──────────────────────────────────────────────────────────────

const SCROLL_THRESHOLD = 120;
const MOUNT_DELAY_MS = 300;
const NAV_HEIGHT = 48;
const NAV_PADDING_X = "clamp(16px, 4vw, 40px)";
const NAV_PADDING_Y = 12;
const BACK_FONT_SIZE = 12;
const TITLE_FONT_SIZE = 13;
const BACK_ICON_SIZE = 14;
const BACK_PADDING_X = 10;
const BACK_PADDING_Y = 4;
const BACK_RADIUS = 6;
const BACK_GAP = 6;

// ─── Component ──────────────────────────────────────────────────────────────

export function DetailStickyNav({
  projectName,
  onBack,
  scrollContainer,
}: {
  projectName: string;
  onBack: () => void;
  scrollContainer: HTMLElement | null;
}) {
  const [visible, setVisible] = useState(false);
  const [mountReady, setMountReady] = useState(false);
  const ticking = useRef(false);

  // Delay activation after mount to avoid layoutId animation conflict
  useEffect(() => {
    const timer = setTimeout(() => setMountReady(true), MOUNT_DELAY_MS);
    return () => clearTimeout(timer);
  }, []);

  // Scroll tracking on the actual scroll container
  useEffect(() => {
    if (!scrollContainer) {
      return;
    }

    const handleScroll = () => {
      if (ticking.current) {
        return;
      }
      ticking.current = true;
      requestAnimationFrame(() => {
        setVisible(scrollContainer.scrollTop > SCROLL_THRESHOLD);
        ticking.current = false;
      });
    };

    scrollContainer.addEventListener("scroll", handleScroll, { passive: true });
    return () => scrollContainer.removeEventListener("scroll", handleScroll);
  }, [scrollContainer]);

  const isShown = visible && mountReady;

  return (
    <div
      style={{
        position: "sticky",
        top: 0,
        zIndex: 20,
        height: isShown ? NAV_HEIGHT : 0,
        overflow: "hidden",
        transition: "height 0.3s cubic-bezier(0.2, 0.8, 0.2, 1)",
      }}
    >
      <div
        style={{
          height: NAV_HEIGHT,
          padding: `${NAV_PADDING_Y}px ${NAV_PADDING_X}`,
          display: "flex",
          alignItems: "center",
          gap: 12,
          background: "rgba(251, 250, 252, 0.92)",
          backdropFilter: "blur(20px) saturate(180%)",
          WebkitBackdropFilter: "blur(20px) saturate(180%)",
          borderBottom: "1px solid rgba(180, 160, 210, 0.2)",
          transform: isShown ? "translateY(0)" : "translateY(-100%)",
          opacity: isShown ? 1 : 0,
          transition: "transform 0.3s cubic-bezier(0.2, 0.8, 0.2, 1), opacity 0.2s",
        }}
      >
        {/* Back button */}
        <button
          onClick={onBack}
          data-cursor-label="BACK"
          className="font-mono"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: BACK_GAP,
            fontSize: BACK_FONT_SIZE,
            color: "var(--doc-ink-3)",
            padding: `${BACK_PADDING_Y}px ${BACK_PADDING_X}px`,
            borderRadius: BACK_RADIUS,
            background: "transparent",
            border: "none",
            cursor: "pointer",
            transition: "all 0.15s",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "rgba(123, 97, 255, 0.08)";
            e.currentTarget.style.color = "var(--doc-accent-ink)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "transparent";
            e.currentTarget.style.color = "var(--doc-ink-3)";
          }}
        >
          <ChevronLeft size={BACK_ICON_SIZE} />
          Projects
        </button>

        {/* Separator */}
        <span style={{ color: "var(--doc-line)", fontSize: 13 }}>/</span>

        {/* Project name */}
        <span
          style={{
            fontSize: TITLE_FONT_SIZE,
            fontWeight: 600,
            color: "var(--doc-ink)",
          }}
        >
          {projectName}
        </span>
      </div>
    </div>
  );
}
