import React, { useCallback } from "react";

// ─── TOC item type ──────────────────────────────────────────────────────────

export interface TOCItem {
  readonly id: string;
  readonly label: string;
}

// ─── Constants ──────────────────────────────────────────────────────────────

const ACTIVE_BAR_WIDTH = 2;
const ACTIVE_BAR_HEIGHT = 14;
const TOC_SCROLL_OFFSET = 80;

// ─── Sidebar (Documentation-style) ─────────────────────────────────────────

export function DetailTOC({
  toc,
  activeId,
  asideRef,
  tocClassName,
  progressBarRef,
  progressTextRef,
}: {
  toc: readonly TOCItem[];
  activeId: string;
  asideRef: React.RefObject<HTMLElement | null>;
  tocClassName: string;
  githubUrl?: string;
  demoUrl?: string;
  progressBarRef?: React.RefObject<HTMLDivElement | null>;
  progressTextRef?: React.RefObject<HTMLSpanElement | null>;
}) {
  const scrollTo = useCallback((id: string) => {
    const el = document.getElementById(id);
    if (!el) {
      return;
    }

    let sc: HTMLElement | null = el.parentElement;
    while (sc && sc !== document.body) {
      const ov = getComputedStyle(sc).overflowY;
      if (ov === "auto" || ov === "scroll") {
        break;
      }
      sc = sc.parentElement;
    }
    if (!sc) {
      return;
    }

    const scRect = sc.getBoundingClientRect();
    const elRect = el.getBoundingClientRect();
    sc.scrollBy({ top: elRect.top - scRect.top - TOC_SCROLL_OFFSET, behavior: "smooth" });
  }, []);

  return (
    <aside
      ref={asideRef as React.RefObject<HTMLElement>}
      className={tocClassName}
      style={{
        fontSize: 13,
        paddingLeft: 18,
        borderLeft: "1px solid var(--doc-line)",
      }}
    >
      {/* Label */}
      <p
        className="font-mono uppercase"
        style={{
          fontSize: 11,
          letterSpacing: "0.12em",
          color: "var(--doc-ink-4)",
          marginBottom: 16,
        }}
      >
        On this page
      </p>

      {/* TOC nav */}
      <nav className="flex flex-col">
        {toc.map((s) => {
          const isActive = activeId === s.id;
          return (
            <button
              key={s.id}
              onClick={() => scrollTo(s.id)}
              data-cursor-label=""
              className="relative text-left bg-transparent border-none transition-colors duration-150"
              style={{
                padding: "2px 0",
                marginBottom: 10,
                fontWeight: isActive ? 500 : 400,
                color: isActive ? "var(--doc-ink)" : "var(--doc-ink-3)",
                lineHeight: 1.5,
              }}
            >
              {/* Active indicator bar */}
              {isActive && (
                <span
                  className="absolute"
                  style={{
                    left: -19,
                    top: "50%",
                    transform: "translateY(-50%)",
                    width: ACTIVE_BAR_WIDTH,
                    height: ACTIVE_BAR_HEIGHT,
                    background: "var(--doc-accent)",
                    borderRadius: 1,
                  }}
                />
              )}
              {s.label}
            </button>
          );
        })}
      </nav>

      {/* Reading progress */}
      <div
        style={{
          marginTop: 28,
          paddingTop: 20,
          borderTop: "1px solid var(--doc-line)",
        }}
      >
        <div
          className="flex justify-between items-baseline font-mono"
          style={{
            fontSize: 11,
            color: "var(--doc-ink-4)",
            letterSpacing: "0.05em",
            marginBottom: 8,
          }}
        >
          <span>Reading</span>
          <span ref={progressTextRef}>0%</span>
        </div>
        <div
          style={{
            height: 2,
            background: "var(--doc-line)",
            borderRadius: 1,
            overflow: "hidden",
          }}
        >
          <div
            ref={progressBarRef}
            style={{
              height: "100%",
              width: "0%",
              background: "var(--doc-accent)",
            }}
          />
        </div>
      </div>
    </aside>
  );
}
