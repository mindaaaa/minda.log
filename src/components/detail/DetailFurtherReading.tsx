import React from "react";

// ─── Types ───────────────────────────────────────────────────────────────────

export type FurtherReadingType = "ADR" | "Wiki" | "Blog" | "Spec";

export interface FurtherReadingItem {
  type: FurtherReadingType;
  title: string;
  description: string;
  href: string;
}

// ─── Constants ───────────────────────────────────────────────────────────────

const HEADER_FONT_SIZE = 12;
const HEADER_LETTER_SPACING = "0.12em";
const COUNT_FONT_SIZE = 11;
const TAG_FONT_SIZE = 10;
const TITLE_FONT_SIZE = 14;
const DESC_FONT_SIZE = 12;
const ARROW_SIZE = 14;
const HOVER_TRANSLATE = "translate(2px, -2px)";
const TRANSITION_DURATION = "0.2s";
const TAG_COLUMN_WIDTH = 60;

// ─── Component ───────────────────────────────────────────────────────────────

export function DetailFurtherReading({
  items,
}: {
  items?: FurtherReadingItem[];
}) {
  if (!items || items.length === 0) {
    return null;
  }

  return (
    <div style={{ marginTop: 48 }}>
      {/* Divider */}
      <div
        style={{
          borderTop: "1px solid var(--doc-line)",
          paddingTop: 24,
        }}
      />

      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "baseline",
          marginBottom: 20,
        }}
      >
        <span
          style={{
            fontFamily: "monospace",
            fontSize: HEADER_FONT_SIZE,
            textTransform: "uppercase",
            letterSpacing: HEADER_LETTER_SPACING,
            color: "var(--doc-accent-ink)",
            fontWeight: 600,
          }}
        >
          Further reading
        </span>
        <span
          style={{
            fontFamily: "monospace",
            fontSize: COUNT_FONT_SIZE,
            color: "var(--doc-ink-4)",
          }}
        >
          {items.length} document{items.length !== 1 ? "s" : ""}
        </span>
      </div>

      {/* List */}
      <div>
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <FurtherReadingRow key={`${item.type}-${item.title}`} item={item} isLast={isLast} />
          );
        })}
      </div>
    </div>
  );
}

// ─── Row ─────────────────────────────────────────────────────────────────────

function FurtherReadingRow({
  item,
  isLast,
}: {
  item: FurtherReadingItem;
  isLast: boolean;
}) {
  const [hovered, setHovered] = React.useState(false);

  return (
    <a
      href={item.href}
      target="_blank"
      rel="noopener noreferrer"
      data-cursor="pill"
      data-cursor-label="READ"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: "grid",
        gridTemplateColumns: `${TAG_COLUMN_WIDTH}px 1fr auto`,
        alignItems: "center",
        gap: 0,
        padding: "14px 0",
        borderBottom: isLast ? "none" : "1px solid var(--doc-line-soft)",
        textDecoration: "none",
        color: "inherit",
        transition: `color ${TRANSITION_DURATION}`,
      }}
    >
      {/* Tag */}
      <span
        style={{
          fontFamily: "monospace",
          fontSize: TAG_FONT_SIZE,
          textTransform: "uppercase",
          color: "var(--doc-ink-4)",
          fontWeight: 500,
          letterSpacing: "0.04em",
        }}
      >
        {item.type}
      </span>

      {/* Title + Description */}
      <div style={{ minWidth: 0 }}>
        <div
          style={{
            fontSize: TITLE_FONT_SIZE,
            fontWeight: 500,
            color: hovered ? "var(--doc-accent-ink)" : "var(--doc-ink)",
            transition: `color ${TRANSITION_DURATION}`,
            lineHeight: 1.4,
          }}
        >
          {item.title}
        </div>
        <div
          style={{
            fontSize: DESC_FONT_SIZE,
            color: "var(--doc-ink-4)",
            lineHeight: 1.5,
            marginTop: 2,
          }}
        >
          {item.description}
        </div>
      </div>

      {/* Arrow */}
      <svg
        width={ARROW_SIZE}
        height={ARROW_SIZE}
        viewBox="0 0 14 14"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{
          marginLeft: 16,
          color: hovered ? "var(--doc-accent)" : "var(--doc-ink-4)",
          transform: hovered ? HOVER_TRANSLATE : "translate(0, 0)",
          transition: `color ${TRANSITION_DURATION}, transform ${TRANSITION_DURATION}`,
        }}
      >
        <path d="M1 13L13 1M7 1h6v6" />
      </svg>
    </a>
  );
}
