import React, { useState, useEffect, useRef } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { DetailTOC } from "./DetailTOC";
import { DetailProvider } from "./DetailContext";
import { DetailStickyNav } from "./DetailStickyNav";
import { HeroVideo } from "./HeroVideo";
import { PortfolioFooter } from "@/components/layout/PortfolioFooter";
import type { HeroVideoProps } from "./HeroVideo";
import type { TOCItem } from "./DetailTOC";

// ─── Constants ──────────────────────────────────────────────────────────────

const ACTIVATION_RATIO = 0.3;
const SCROLL_OFFSET = 60;
const CONTENT_MAX_WIDTH = 720;
const LAYOUT_MAX_WIDTH = 1180;
const HERO_TABS_MARGIN_TOP = 40;
const STICKY_NAV_HEIGHT = 48;
const TOC_TOP_GAP = 32;
const TOC_TOP_OFFSET = STICKY_NAV_HEIGHT + TOC_TOP_GAP;
const SECTION_SCROLL_MARGIN = STICKY_NAV_HEIGHT + 24;

// Responsive paddings using clamp()
const BREADCRUMB_PADDING = "clamp(16px, 4vw, 24px) clamp(20px, 5vw, 48px) 0";
const HERO_PADDING = "clamp(24px, 5vw, 40px) clamp(20px, 5vw, 48px) clamp(40px, 6vw, 60px)";
const DOC_MAIN_PADDING = "clamp(24px, 5vw, 40px) clamp(20px, 5vw, 48px) clamp(60px, 12vw, 120px)";
// ─── Section reveal animation ───────────────────────────────────────────────

const sectionVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] as const } },
};

// ─── Detail Layout ──────────────────────────────────────────────────────────

export function DetailLayout({
  projectName,
  accent = "#9B8EC4",
  toc,
  tocClassName,
  heroContent,
  heroImage,
  heroVideo,
  children,
  onBack,
}: {
  projectName: string;
  accent?: string;
  toc: readonly TOCItem[];
  tocClassName: string;
  heroContent: React.ReactNode;
  heroImage?: string;
  heroVideo?: HeroVideoProps;
  children: React.ReactNode;
  onBack: () => void;
}) {
  const [activeSection, setActiveSection] = useState<string>(toc[0].id);
  const containerRef = useRef<HTMLDivElement>(null);
  const tocRef = useRef<HTMLElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const progressTextRef = useRef<HTMLSpanElement>(null);
  const scrollPending = useRef(false);
  const [scrollContainer, setScrollContainer] = useState<HTMLElement | null>(null);
  const prefersReducedMotion = useReducedMotion();

  // Find scrollable ancestor
  useEffect(() => {
    let el: HTMLElement | null = containerRef.current;
    while (el) {
      const ov = getComputedStyle(el).overflowY;
      if (ov === "auto" || ov === "scroll") {
        setScrollContainer(el);
        break;
      }
      el = el.parentElement;
    }
  }, []);

  // Scroll tracking: active section + reading progress
  useEffect(() => {
    if (!scrollContainer) {
      return;
    }

    const update = () => {
      // Active section tracking
      if (scrollContainer.scrollTop < SCROLL_OFFSET) {
        setActiveSection((prev) => prev === toc[0].id ? prev : toc[0].id);
      } else {
        const containerRect = scrollContainer.getBoundingClientRect();
        const activationLine = containerRect.top + containerRect.height * ACTIVATION_RATIO;
        let current: string = toc[0].id;
        for (const { id } of toc) {
          const el = document.getElementById(id);
          if (!el) {
            continue;
          }
          if (el.getBoundingClientRect().top <= activationLine) {
            current = id;
          }
        }
        setActiveSection((prev) => prev === current ? prev : current);
      }

      // Reading progress — DOM direct update (no setState)
      const { scrollTop, scrollHeight, clientHeight } = scrollContainer;
      const maxScroll = scrollHeight - clientHeight;
      const progress = maxScroll > 0 ? Math.min(scrollTop / maxScroll, 1) : 0;
      const percent = Math.round(progress * 100);
      if (progressBarRef.current) {
        progressBarRef.current.style.width = `${percent}%`;
      }
      if (progressTextRef.current) {
        progressTextRef.current.textContent = `${percent}%`;
      }
    };

    // RAF-throttled scroll handler — max 1 update per frame
    const onScroll = () => {
      if (scrollPending.current) {
        return;
      }
      scrollPending.current = true;
      requestAnimationFrame(() => {
        update();
        scrollPending.current = false;
      });
    };

    scrollContainer.addEventListener("scroll", onScroll, { passive: true });
    const raf = requestAnimationFrame(update);
    return () => {
      scrollContainer.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
  }, [scrollContainer, toc]);

  return (
    <DetailProvider accent={accent} heroLayout={heroVideo?.layout}>
      <div
        ref={containerRef}
        className="min-h-full"
        style={{ background: "var(--doc-bg)" }}
      >
        {/* ── Sticky mini header ── */}
        <DetailStickyNav
          projectName={projectName}
          onBack={onBack}
          scrollContainer={scrollContainer}
        />

        {/* ── Enter-veil: hero gradient header ── */}
        <div className="relative" style={{ paddingTop: 24 }}>
          {/* Gradient background */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: "linear-gradient(180deg, #E8DBFF 0%, #F3E7FB 40%, var(--doc-bg) 100%)",
            }}
          />
          {/* Pink radial overlay */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: "radial-gradient(ellipse 60% 40% at 50% 30%, rgba(255,180,220,0.25), transparent 70%)",
            }}
          />

          {/* Breadcrumb */}
          <nav
            className="relative z-10 mx-auto"
            style={{ maxWidth: LAYOUT_MAX_WIDTH, padding: BREADCRUMB_PADDING }}
          >
            <ol className="flex items-center gap-1.5 text-sm" style={{ color: "var(--doc-ink-3)" }}>
              <li>
                <button
                  onClick={onBack}
                  data-cursor-label="BACK"
                  className="bg-transparent border-none transition-colors hover:text-foreground font-medium"
                  style={{ color: "var(--doc-ink-3)" }}
                >
                  Projects
                </button>
              </li>
              <li className="opacity-50">/</li>
              <li>
                <span className="font-normal" style={{ color: "var(--doc-ink)" }}>{projectName}</span>
              </li>
            </ol>
          </nav>

          {/* Hero */}
          {(() => {
            const isInlineLayout = heroVideo?.layout === "inline-landscape"
              || heroVideo?.layout === "inline-portrait";
            const isTabsLayout = heroVideo?.layout === "tabs";
            const isPortrait = heroVideo?.layout === "inline-portrait";

            if (isInlineLayout && heroVideo) {
              return (
                <div
                  className={`relative z-10 mx-auto grid items-start sm:items-center gap-8 min-[720px]:gap-12 ${
                    isPortrait
                      ? "grid-cols-1 min-[720px]:grid-cols-[1fr_auto]"
                      : "grid-cols-1 min-[720px]:grid-cols-2"
                  }`}
                  style={{
                    maxWidth: LAYOUT_MAX_WIDTH,
                    padding: HERO_PADDING,
                  }}
                >
                  <div>{heroContent}</div>
                  <div
                    className={
                      isPortrait
                        ? "flex justify-center min-[720px]:justify-start"
                        : undefined
                    }
                    style={{ width: "100%" }}
                  >
                    <HeroVideo {...heroVideo} />
                  </div>
                </div>
              );
            }

            if (isTabsLayout && heroVideo) {
              return (
                <div
                  className="relative z-10 mx-auto"
                  style={{ maxWidth: LAYOUT_MAX_WIDTH, padding: HERO_PADDING }}
                >
                  {heroContent}
                  <div style={{ marginTop: HERO_TABS_MARGIN_TOP }}>
                    <HeroVideo {...heroVideo} />
                  </div>
                </div>
              );
            }

            return (
              <div
                className="relative z-10 mx-auto"
                style={{ maxWidth: LAYOUT_MAX_WIDTH, padding: HERO_PADDING }}
              >
                {heroContent}

                {/* Hero image */}
                {heroImage && (
                  <motion.div
                    className="mt-8 rounded-xl overflow-hidden border shadow-lg"
                    style={{ borderColor: "var(--doc-line)" }}
                    initial={prefersReducedMotion ? false : { opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <img
                      src={heroImage}
                      alt={`${projectName} hero`}
                      className="w-full h-auto block"
                    />
                  </motion.div>
                )}
              </div>
            );
          })()}
        </div>

        {/* ── Doc-main: 2-column grid (body + TOC) ── */}
        <div
          className="mx-auto grid grid-cols-1 min-[960px]:grid-cols-[1fr_220px] min-[960px]:gap-20"
          style={{
            maxWidth: LAYOUT_MAX_WIDTH,
            padding: DOC_MAIN_PADDING,
          }}
        >
          {/* Main article */}
          <article style={{ minWidth: 0, maxWidth: CONTENT_MAX_WIDTH }}>
            {children}
          </article>

          {/* TOC sidebar — right column, sticky */}
          <div
            className="hidden min-[960px]:block"
            style={{ alignSelf: "start", position: "sticky", top: TOC_TOP_OFFSET }}
          >
            <DetailTOC
              toc={toc}
              activeId={activeSection}
              asideRef={tocRef}
              tocClassName={tocClassName}
              progressBarRef={progressBarRef}
              progressTextRef={progressTextRef}
            />
          </div>
        </div>

        {/* ── Footer ── */}
        <PortfolioFooter />
      </div>
    </DetailProvider>
  );
}

// ─── Section wrapper with scroll-reveal ─────────────────────────────────────

export function DetailSection({
  id,
  children,
}: {
  id: string;
  isLast?: boolean;
  children: React.ReactNode;
}) {
  const prefersReducedMotion = useReducedMotion();

  return (
    <motion.section
      id={id}
      className="mb-18"
      style={{ scrollMarginTop: SECTION_SCROLL_MARGIN }}
      variants={sectionVariants}
      initial={prefersReducedMotion ? "visible" : "hidden"}
      whileInView="visible"
      viewport={{ once: true, margin: "-60px" }}
    >
      {children}
    </motion.section>
  );
}

// ─── Section spacing wrapper ────────────────────────────────────────────────

export function SectionGap({ children }: { children: React.ReactNode }) {
  return (
    <div className="pt-20">
      {children}
    </div>
  );
}
