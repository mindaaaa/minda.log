import React from "react";

// ─── Constants ──────────────────────────────────────────────────────────────

const GROUP_BOX_RADIUS = 14;

const TREE_DOT_SIZE = 17;
const TREE_LINE_WIDTH = 1.5;
const TREE_LINE_LEFT = 8;
const TREE_NODE_PADDING_LEFT = 32;
const TREE_NODE_PADDING_BOTTOM = 18;

const PROS_COLOR = "#10a86a";
const CONS_COLOR = "#c2632e";

const CHOSEN_GRADIENT = "linear-gradient(180deg, #fff 0%, rgba(238, 233, 255, 0.55) 100%)";
const CHOSEN_SHADOW = "0 0 0 3px rgba(123, 97, 255, 0.07)";

// ─── GroupBox ───────────────────────────────────────────────────────────────

export function GroupBox({
  eyebrow,
  children,
}: {
  eyebrow?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      style={{
        background: "var(--doc-line-soft)",
        borderRadius: GROUP_BOX_RADIUS,
        padding: "24px clamp(18px, 3vw, 28px)",
        margin: "16px 0 28px",
      }}
    >
      {eyebrow && (
        <p
          className="font-mono"
          style={{
            fontSize: 10.5,
            fontWeight: 600,
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            color: "var(--doc-accent-ink)",
            margin: "0 0 18px",
          }}
        >
          {eyebrow}
        </p>
      )}
      {children}
    </div>
  );
}

// ─── DecisionTree (02 ① 결정트리) ──────────────────────────────────────────

export interface TreeOptionItem {
  letter: string;
  title: string;
  sub?: string;
  chosen?: boolean;
}

export function DecisionTree({ children }: { children: React.ReactNode }) {
  return (
    <ol style={{ listStyle: "none", padding: 0, margin: 0, position: "relative" }}>
      <span
        aria-hidden
        style={{
          position: "absolute",
          left: TREE_LINE_LEFT,
          top: 14,
          bottom: 14,
          width: TREE_LINE_WIDTH,
          background: "linear-gradient(180deg, rgba(123, 97, 255, 0.35) 0%, rgba(123, 97, 255, 0.7) 100%)",
        }}
      />
      {children}
    </ol>
  );
}

function TreeNodeBase({
  isFinal = false,
  children,
}: {
  isFinal?: boolean;
  children: React.ReactNode;
}) {
  return (
    <li
      style={{
        position: "relative",
        padding: `0 0 ${TREE_NODE_PADDING_BOTTOM}px ${TREE_NODE_PADDING_LEFT}px`,
      }}
    >
      <span
        aria-hidden
        style={{
          position: "absolute",
          left: 0,
          top: 4,
          width: TREE_DOT_SIZE,
          height: TREE_DOT_SIZE,
          borderRadius: "50%",
          background: isFinal ? "var(--doc-accent)" : "var(--doc-line-soft)",
          border: "2px solid var(--doc-accent)",
          boxSizing: "border-box",
        }}
      />
      {children}
    </li>
  );
}

function TreeEyebrow({ children }: { children: React.ReactNode }) {
  return (
    <p
      className="font-mono"
      style={{
        fontSize: 10,
        fontWeight: 600,
        letterSpacing: "0.14em",
        textTransform: "uppercase",
        color: "var(--doc-accent)",
        margin: "0 0 4px",
      }}
    >
      {children}
    </p>
  );
}

export function TreeQuestion({ eyebrow, text }: { eyebrow: string; text: string }) {
  return (
    <TreeNodeBase>
      <TreeEyebrow>{eyebrow}</TreeEyebrow>
      <h4
        style={{
          fontSize: 16,
          fontWeight: 700,
          letterSpacing: "-0.02em",
          lineHeight: 1.4,
          color: "var(--doc-ink)",
          margin: 0,
        }}
      >
        {text}
      </h4>
    </TreeNodeBase>
  );
}

export function TreeOptions({ options }: { options: TreeOptionItem[] }) {
  return (
    <TreeNodeBase>
      <TreeEyebrow>옵션 비교</TreeEyebrow>
      <div className="grid grid-cols-1 sm:grid-cols-2" style={{ gap: 10, marginTop: 4 }}>
        {options.map((opt) => (
          <TreeOption key={opt.letter} {...opt} />
        ))}
      </div>
    </TreeNodeBase>
  );
}

function TreeOption({ letter, title, sub, chosen = false }: TreeOptionItem) {
  return (
    <div
      style={{
        background: chosen ? CHOSEN_GRADIENT : "#fff",
        border: chosen ? "1.5px solid var(--doc-accent)" : "1px solid var(--doc-line)",
        borderRadius: 9,
        padding: "14px 16px",
        display: "grid",
        gridTemplateColumns: "22px 1fr",
        gap: "4px 12px",
        alignItems: "start",
        boxShadow: chosen ? CHOSEN_SHADOW : undefined,
      }}
    >
      <span
        className="inline-flex items-center justify-center font-mono"
        style={{
          gridRow: "1 / 3",
          alignSelf: "start",
          width: 22,
          height: 22,
          fontSize: 10.5,
          fontWeight: 600,
          letterSpacing: "0.04em",
          borderRadius: 5,
          background: chosen ? "var(--doc-accent)" : "var(--doc-line-soft)",
          color: chosen ? "#fff" : "var(--doc-ink-4)",
        }}
      >
        {letter}
      </span>
      <p
        style={{
          fontSize: 14,
          fontWeight: 600,
          color: chosen ? "var(--doc-ink)" : "var(--doc-ink-4)",
          lineHeight: 1.4,
          margin: 0,
          textDecoration: chosen ? "none" : "line-through",
        }}
      >
        {title}
      </p>
      {sub && (
        <p
          style={{
            gridColumn: 2,
            fontSize: 12.5,
            lineHeight: 1.55,
            color: chosen ? "var(--doc-ink-2)" : "var(--doc-ink-3)",
            margin: 0,
          }}
        >
          {sub}
        </p>
      )}
    </div>
  );
}

export function TreeFinal({
  title,
  discoveryLabel = "실제 발견",
  discovery,
}: {
  title: string;
  discoveryLabel?: string;
  discovery?: React.ReactNode;
}) {
  return (
    <li
      style={{
        position: "relative",
        padding: `0 0 0 ${TREE_NODE_PADDING_LEFT}px`,
      }}
    >
      <span
        aria-hidden
        style={{
          position: "absolute",
          left: 0,
          top: 4,
          width: TREE_DOT_SIZE,
          height: TREE_DOT_SIZE,
          borderRadius: "50%",
          background: "var(--doc-accent)",
          border: "2px solid var(--doc-accent)",
          boxSizing: "border-box",
        }}
      />
      <TreeEyebrow>최종 결정</TreeEyebrow>
      <h4
        style={{
          fontSize: 16,
          fontWeight: 700,
          letterSpacing: "-0.02em",
          lineHeight: 1.4,
          color: "var(--doc-ink)",
          margin: 0,
        }}
      >
        {title}
      </h4>
      {discovery && (
        <p
          style={{
            margin: "8px 0 0",
            fontSize: 13,
            lineHeight: 1.65,
            color: "var(--doc-ink-3)",
          }}
        >
          <span
            className="font-mono"
            style={{
              fontSize: 10,
              fontWeight: 600,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: "var(--doc-ink-4)",
              marginRight: 6,
            }}
          >
            {discoveryLabel}
          </span>
          {discovery}
        </p>
      )}
    </li>
  );
}

// ─── ChosenCard + ChosenGrid (02 ②③) ───────────────────────────────────────

interface ChosenCardProps {
  letter: string;
  title: string;
  pros: React.ReactNode;
  cons: React.ReactNode;
}

export function ChosenCard({ letter, title, pros, cons }: ChosenCardProps) {
  return (
    <div
      style={{
        background: CHOSEN_GRADIENT,
        border: "1.5px solid var(--doc-accent)",
        borderRadius: 11,
        padding: "18px 20px 16px",
        boxShadow: CHOSEN_SHADOW,
      }}
    >
      <span
        className="inline-flex items-center font-mono"
        style={{
          gap: 6,
          fontSize: 11,
          fontWeight: 600,
          letterSpacing: "0.04em",
          background: "var(--doc-accent)",
          color: "#fff",
          padding: "4px 11px",
          borderRadius: 999,
          marginBottom: 12,
        }}
      >
        {letter}
        <span
          aria-hidden
          style={{
            display: "inline-block",
            width: 3,
            height: 3,
            background: "rgba(255,255,255,0.7)",
            borderRadius: "50%",
          }}
        />
        선택
      </span>
      <h4
        style={{
          fontSize: 15.5,
          fontWeight: 700,
          letterSpacing: "-0.02em",
          lineHeight: 1.4,
          color: "var(--doc-ink)",
          margin: "0 0 12px",
        }}
      >
        {title}
      </h4>
      <ChosenCardRow label="장점" tone="pros">{pros}</ChosenCardRow>
      <ChosenCardRow label="단점" tone="cons">{cons}</ChosenCardRow>
    </div>
  );
}

function ChosenCardRow({
  label,
  tone,
  children,
}: {
  label: string;
  tone: "pros" | "cons";
  children: React.ReactNode;
}) {
  const labelColor = tone === "pros" ? PROS_COLOR : CONS_COLOR;
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "36px 1fr",
        gap: 10,
        alignItems: "baseline",
        fontSize: 13,
        lineHeight: 1.55,
        color: "var(--doc-ink-2)",
        marginBottom: 3,
      }}
    >
      <span
        className="font-mono"
        style={{
          fontSize: 10.5,
          fontWeight: 700,
          letterSpacing: "0.06em",
          color: labelColor,
        }}
      >
        {label}
      </span>
      <span>{children}</span>
    </div>
  );
}

const CHOSEN_GRID_CLASS: Record<1 | 2 | 3, string> = {
  1: "grid grid-cols-1",
  2: "grid grid-cols-1 sm:grid-cols-2",
  3: "grid grid-cols-1 sm:grid-cols-3",
};

export function ChosenGrid({
  cols,
  children,
}: {
  cols: 1 | 2 | 3;
  children: React.ReactNode;
}) {
  return (
    <div className={CHOSEN_GRID_CLASS[cols]} style={{ gap: 10 }}>
      {children}
    </div>
  );
}

// ─── ExcludedRow + Heading ──────────────────────────────────────────────────

export function ExcludedHeading({
  children = "검토 후 제외",
  noTopMargin = false,
}: {
  children?: React.ReactNode;
  noTopMargin?: boolean;
}) {
  return (
    <p
      className="font-mono"
      style={{
        fontSize: 10.5,
        fontWeight: 600,
        letterSpacing: "0.1em",
        textTransform: "uppercase",
        color: "var(--doc-ink-4)",
        margin: noTopMargin ? "0 0 10px" : "22px 0 10px",
      }}
    >
      {children}
    </p>
  );
}

interface ExcludedRowProps {
  letter: string;
  title: string;
  cons: React.ReactNode;
  stacked?: boolean;
}

export function ExcludedRow({ letter, title, cons, stacked = false }: ExcludedRowProps) {
  if (stacked) {
    return (
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "24px 1fr",
          gap: 14,
          alignItems: "start",
          padding: "12px 16px",
          background: "#fff",
          border: "1px solid var(--doc-line)",
          borderRadius: 8,
          marginBottom: 6,
          fontSize: 13,
        }}
      >
        <span
          className="font-mono"
          style={{
            fontSize: 11.5,
            fontWeight: 600,
            color: "var(--doc-ink-4)",
          }}
        >
          {letter}
        </span>
        <div>
          <p
            style={{
              textDecoration: "line-through",
              color: "var(--doc-ink-4)",
              fontWeight: 500,
              margin: "0 0 4px",
            }}
          >
            {title}
          </p>
          <p
            style={{
              color: "var(--doc-ink-4)",
              fontSize: 12.5,
              margin: 0,
            }}
          >
            {cons}
          </p>
        </div>
      </div>
    );
  }
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "24px 1fr auto",
        gap: 14,
        alignItems: "center",
        padding: "12px 16px",
        background: "#fff",
        border: "1px solid var(--doc-line)",
        borderRadius: 8,
        marginBottom: 6,
        fontSize: 13,
      }}
    >
      <span
        className="font-mono"
        style={{
          fontSize: 11.5,
          fontWeight: 600,
          color: "var(--doc-ink-4)",
        }}
      >
        {letter}
      </span>
      <span
        style={{
          textDecoration: "line-through",
          color: "var(--doc-ink-4)",
          fontWeight: 500,
        }}
      >
        {title}
      </span>
      <span
        style={{
          textAlign: "right",
          color: "var(--doc-ink-3)",
          fontSize: 12.5,
        }}
      >
        {cons}
      </span>
    </div>
  );
}

// ─── DiscoveryBlock — "실제로는" 발견 흔적 ────────────────────────────────

export function DiscoveryBlock({
  label = "실제로는",
  children,
}: {
  label?: string;
  children: React.ReactNode;
}) {
  return (
    <div style={{ marginTop: 14, padding: "12px 4px 0" }}>
      <p
        className="font-mono"
        style={{
          fontSize: 10.5,
          fontWeight: 600,
          letterSpacing: "0.1em",
          textTransform: "uppercase",
          color: "var(--doc-ink-4)",
          margin: "0 0 6px",
        }}
      >
        {label}
      </p>
      <p
        style={{
          fontSize: 13.5,
          lineHeight: 1.7,
          color: "var(--doc-ink-2)",
          margin: 0,
        }}
      >
        {children}
      </p>
    </div>
  );
}

// ─── SplitLayout (02 ④⑤) ─────────────────────────────────────────────────

export function SplitLayout({
  chosen,
  excluded,
}: {
  chosen: React.ReactNode;
  excluded: React.ReactNode;
}) {
  return (
    <div
      className="grid grid-cols-1 sm:grid-cols-2"
      style={{ gap: 18, alignItems: "start" }}
    >
      <div>{chosen}</div>
      <div>{excluded}</div>
    </div>
  );
}
