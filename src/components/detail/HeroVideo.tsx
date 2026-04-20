import React, { useState, useRef, useCallback } from "react";
import { motion, useReducedMotion } from "framer-motion";
import type { HeroVideoLayout } from "./DetailContext";

// ─── Types ──────────────────────────────────────────────────────────────────

export interface VideoSource {
  src?: string;
  srcFallback?: string;
  poster?: string;
  caption?: string;
}

export interface VideoTab extends VideoSource {
  key: string;
  label: string;
  orientation: "landscape" | "portrait";
}

export interface HeroVideoProps {
  layout: HeroVideoLayout;
  projectName: string;
  single?: VideoSource;
  tabs?: VideoTab[];
}

// ─── Constants ──────────────────────────────────────────────────────────────

const PHONE_FRAME_WIDTH = "min(280px, 70vw)";
const PHONE_FRAME_BORDER = 6;
const PHONE_BORDER_RADIUS = 28;
const VIDEO_BORDER_RADIUS = 14;
const VIDEO_ASPECT_LANDSCAPE = "16 / 9";
const VIDEO_ASPECT_LANDSCAPE_INLINE = "16 / 10";
const VIDEO_ASPECT_PORTRAIT = "9 / 19";
const PLACEHOLDER_FONT_SIZE = 14;
const PLACEHOLDER_GRADIENT = "linear-gradient(135deg, #2D1F4B, #1A1229)";
const TAB_BAR_PADDING = 4;
const TAB_BAR_GAP = 2;
const TAB_BUTTON_PADDING_X = 16;
const TAB_BUTTON_PADDING_Y = 6;
const TAB_FONT_SIZE = 12;
const TAB_LETTER_SPACING = "0.08em";
const PHONE_BOX_SHADOW = "0 12px 40px rgba(80, 50, 130, 0.2)";
const TAB_ACTIVE_SHADOW = "0 1px 3px rgba(0,0,0,0.08)";
const TAB_BAR_BG = "rgba(26,18,41,0.05)";
const TAB_BAR_RADIUS = 999;
const TABS_VIDEO_MARGIN_TOP = 16;

const ENTRY_ANIMATION = {
  initial: { opacity: 0, scale: 0.98 },
  animate: { opacity: 1, scale: 1 },
  transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as const },
};

// ─── Helpers ────────────────────────────────────────────────────────────────

function formatAspectLabel(aspect: string): string {
  return aspect.replace(/\s*\/\s*/, " : ");
}

function hasVideoSrc(src?: string): boolean {
  return typeof src === "string" && src.length > 0;
}

// ─── VideoPlaceholder ───────────────────────────────────────────────────────

function VideoPlaceholder({ aspectRatio }: { aspectRatio: string }) {
  return (
    <div
      style={{
        width: "100%",
        aspectRatio,
        background: PLACEHOLDER_GRADIENT,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
      }}
    >
      <span
        style={{
          fontFamily: "monospace",
          fontSize: PLACEHOLDER_FONT_SIZE,
          color: "rgba(255,255,255,0.5)",
          letterSpacing: "0.06em",
          userSelect: "none",
        }}
      >
        ▶ DEMO VIDEO
      </span>
      <span
        style={{
          position: "absolute",
          top: 10,
          right: 12,
          fontFamily: "monospace",
          fontSize: 11,
          color: "rgba(255,255,255,0.3)",
          letterSpacing: "0.04em",
        }}
      >
        {formatAspectLabel(aspectRatio)}
      </span>
    </div>
  );
}

// ─── VideoPlayer ────────────────────────────────────────────────────────────

function VideoPlayer({
  source,
  aspectRatio,
  projectName,
}: {
  source: VideoSource;
  aspectRatio: string;
  projectName: string;
}) {
  const prefersReducedMotion = useReducedMotion();

  if (prefersReducedMotion) {
    if (source.poster) {
      return (
        <img
          src={source.poster}
          alt={`${projectName} 데모 영상`}
          style={{ width: "100%", aspectRatio, objectFit: "cover" }}
        />
      );
    }
    return <VideoPlaceholder aspectRatio={aspectRatio} />;
  }

  return (
    <video
      autoPlay
      loop
      muted
      playsInline
      preload="metadata"
      poster={source.poster}
      aria-label={`${projectName} 데모 영상`}
      style={{ width: "100%", aspectRatio, objectFit: "cover", display: "block" }}
    >
      <source src={source.src} type="video/webm" />
      {source.srcFallback && (
        <source src={source.srcFallback} type="video/mp4" />
      )}
    </video>
  );
}

// ─── VideoContainer ─────────────────────────────────────────────────────────

function VideoContainer({
  source,
  aspectRatio,
  projectName,
}: {
  source?: VideoSource;
  aspectRatio: string;
  projectName: string;
}) {
  const hasSrc = hasVideoSrc(source?.src);

  return hasSrc && source ? (
    <VideoPlayer source={source} aspectRatio={aspectRatio} projectName={projectName} />
  ) : (
    <VideoPlaceholder aspectRatio={aspectRatio} />
  );
}

// ─── PhoneFrame ─────────────────────────────────────────────────────────────

function PhoneFrame({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      style={{
        width: PHONE_FRAME_WIDTH,
        border: `${PHONE_FRAME_BORDER}px solid #1A1229`,
        borderRadius: PHONE_BORDER_RADIUS,
        overflow: "hidden",
        boxShadow: PHONE_BOX_SHADOW,
        flexShrink: 0,
      }}
    >
      {children}
    </div>
  );
}

// ─── InlineLandscape ────────────────────────────────────────────────────────

function InlineLandscape({
  source,
  projectName,
}: {
  source?: VideoSource;
  projectName: string;
}) {
  const prefersReducedMotion = useReducedMotion();

  return (
    <motion.div
      style={{
        borderRadius: VIDEO_BORDER_RADIUS,
        overflow: "hidden",
        border: "1px solid var(--doc-line)",
        boxShadow: "0 4px 16px rgba(0,0,0,0.08)",
      }}
      {...(prefersReducedMotion ? {} : ENTRY_ANIMATION)}
    >
      <VideoContainer
        source={source}
        aspectRatio={VIDEO_ASPECT_LANDSCAPE_INLINE}
        projectName={projectName}
      />
      {source?.caption && (
        <Caption text={source.caption} />
      )}
    </motion.div>
  );
}

// ─── InlinePortrait ─────────────────────────────────────────────────────────

function InlinePortrait({
  source,
  projectName,
}: {
  source?: VideoSource;
  projectName: string;
}) {
  const prefersReducedMotion = useReducedMotion();

  return (
    <motion.div
      style={{ display: "flex", flexDirection: "column", alignItems: "center" }}
      {...(prefersReducedMotion ? {} : ENTRY_ANIMATION)}
    >
      <PhoneFrame>
        <VideoContainer
          source={source}
          aspectRatio={VIDEO_ASPECT_PORTRAIT}
          projectName={projectName}
        />
      </PhoneFrame>
      {source?.caption && (
        <Caption text={source.caption} style={{ marginTop: 12 }} />
      )}
    </motion.div>
  );
}

// ─── TabsLayout ─────────────────────────────────────────────────────────────

function TabsLayout({
  tabs,
  projectName,
}: {
  tabs: VideoTab[];
  projectName: string;
}) {
  const [activeIndex, setActiveIndex] = useState(0);
  const tabListRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "ArrowRight") {
        e.preventDefault();
        setActiveIndex((prev) => (prev + 1) % tabs.length);
        focusTab((activeIndex + 1) % tabs.length);
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        setActiveIndex((prev) => (prev - 1 + tabs.length) % tabs.length);
        focusTab((activeIndex - 1 + tabs.length) % tabs.length);
      }
    },
    [activeIndex, tabs.length],
  );

  const focusTab = (index: number) => {
    const buttons = tabListRef.current?.querySelectorAll<HTMLButtonElement>('[role="tab"]');
    buttons?.[index]?.focus();
  };

  const activeTab = tabs[activeIndex];
  const isPortrait = activeTab.orientation === "portrait";
  const aspectRatio = isPortrait ? VIDEO_ASPECT_PORTRAIT : VIDEO_ASPECT_LANDSCAPE;

  return (
    <motion.div {...(prefersReducedMotion ? {} : ENTRY_ANIMATION)}>
      {/* Tab bar */}
      <div
        ref={tabListRef}
        role="tablist"
        aria-label="데모 영상 탭"
        style={{
          display: "inline-flex",
          background: TAB_BAR_BG,
          borderRadius: TAB_BAR_RADIUS,
          padding: TAB_BAR_PADDING,
          gap: TAB_BAR_GAP,
        }}
        onKeyDown={handleKeyDown}
      >
        {tabs.map((tab, i) => (
          <button
            key={tab.key}
            role="tab"
            id={`tab-${tab.key}`}
            aria-selected={i === activeIndex}
            aria-controls={`tabpanel-${tab.key}`}
            tabIndex={i === activeIndex ? 0 : -1}
            onClick={() => setActiveIndex(i)}
            style={{
              padding: `${TAB_BUTTON_PADDING_Y}px ${TAB_BUTTON_PADDING_X}px`,
              fontFamily: "monospace",
              fontSize: TAB_FONT_SIZE,
              letterSpacing: TAB_LETTER_SPACING,
              border: "none",
              borderRadius: TAB_BAR_RADIUS,
              cursor: "pointer",
              transition: "all 0.15s ease",
              background: i === activeIndex ? "white" : "transparent",
              boxShadow: i === activeIndex ? TAB_ACTIVE_SHADOW : "none",
              color: i === activeIndex ? "var(--doc-ink)" : "var(--doc-ink-3)",
              fontWeight: i === activeIndex ? 600 : 400,
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab panel */}
      <div
        role="tabpanel"
        id={`tabpanel-${activeTab.key}`}
        aria-labelledby={`tab-${activeTab.key}`}
        style={{ marginTop: TABS_VIDEO_MARGIN_TOP }}
      >
        {isPortrait ? (
          <div style={{ display: "flex", justifyContent: "center" }}>
            <PhoneFrame>
              <VideoContainer
                source={activeTab}
                aspectRatio={aspectRatio}
                projectName={projectName}
              />
            </PhoneFrame>
          </div>
        ) : (
          <div
            style={{
              borderRadius: VIDEO_BORDER_RADIUS,
              overflow: "hidden",
              border: "1px solid var(--doc-line)",
              boxShadow: "0 4px 16px rgba(0,0,0,0.08)",
            }}
          >
            <VideoContainer
              source={activeTab}
              aspectRatio={aspectRatio}
              projectName={projectName}
            />
          </div>
        )}
        {activeTab.caption && (
          <Caption
            text={activeTab.caption}
            style={isPortrait ? { textAlign: "center", marginTop: 12 } : { marginTop: 10 }}
          />
        )}
      </div>
    </motion.div>
  );
}

// ─── Caption ────────────────────────────────────────────────────────────────

function Caption({ text, style }: { text: string; style?: React.CSSProperties }) {
  return (
    <p
      style={{
        fontFamily: "monospace",
        fontSize: 12,
        color: "var(--doc-ink-3)",
        margin: "8px 0 0",
        lineHeight: 1.5,
        ...style,
      }}
    >
      {text}
    </p>
  );
}

// ─── HeroVideo (exported) ───────────────────────────────────────────────────

export function HeroVideo({ layout, projectName, single, tabs }: HeroVideoProps) {
  switch (layout) {
    case "inline-landscape":
      return <InlineLandscape source={single} projectName={projectName} />;
    case "inline-portrait":
      return <InlinePortrait source={single} projectName={projectName} />;
    case "tabs": {
      if (!tabs || tabs.length === 0) {
        return null;
      }
      return <TabsLayout tabs={tabs} projectName={projectName} />;
    }
    default:
      return null;
  }
}
