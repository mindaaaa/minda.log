import React from "react";
import { Check, AlertTriangle } from "lucide-react";

// ─── Constants ──────────────────────────────────────────────────────────────

const OPTION_BADGE_SIZE = 22;
const OPTION_BADGE_RADIUS = 6;
const METRIC_VALUE_SIZE = 34;
const METRIC_UNIT_SIZE = 16;
const METRIC_LABEL_SIZE = 12;
const METRIC_DESC_SIZE = 13;
const METRIC_PADDING = "24px 20px";
const METRIC_GAP = 2;
const STACK_CHIP_SIZE = 12;

// ─── OptionCard — Ideation 비교 카드 ────────────────────────────────────────

interface OptionCardProps {
  letter: string;
  title: string;
  pros: React.ReactNode;
  cons: React.ReactNode;
  chosen?: boolean;
}

export function OptionCard({ letter, title, pros, cons, chosen = false }: OptionCardProps) {
  return (
    <div
      className="relative p-5 transition-all"
      style={{
        background: chosen
          ? "linear-gradient(180deg, #fff 0%, rgba(238, 233, 255, 0.3) 100%)"
          : "#fff",
        border: chosen
          ? "1px solid var(--doc-accent)"
          : "1px solid var(--doc-line)",
        borderRadius: 10,
        boxShadow: chosen ? "0 0 0 1px rgba(123, 97, 255, 0.2)" : undefined,
      }}
    >
      {/* Letter badge + chosen badge */}
      <div className="flex items-center gap-2 mb-3">
        <span
          className="inline-flex items-center justify-center font-mono shrink-0"
          style={{
            width: OPTION_BADGE_SIZE,
            height: OPTION_BADGE_SIZE,
            borderRadius: OPTION_BADGE_RADIUS,
            fontSize: 11,
            fontWeight: 600,
            background: chosen ? "var(--doc-accent)" : "var(--doc-line-soft)",
            color: chosen ? "#fff" : "var(--doc-ink-3)",
          }}
        >
          {letter}
        </span>
        {chosen && (
          <span
            className="font-mono"
            style={{
              fontSize: 11,
              padding: "2px 8px",
              borderRadius: 4,
              background: "var(--doc-accent-soft)",
              color: "var(--doc-accent-ink)",
              letterSpacing: "0.04em",
            }}
          >
            선택
          </span>
        )}
      </div>

      {/* Title */}
      <h4
        className="mb-3"
        style={{
          fontSize: 15,
          fontWeight: 600,
          lineHeight: 1.4,
          color: "var(--doc-ink)",
          margin: "0 0 12px",
        }}
      >
        {title}
      </h4>

      {/* Pros */}
      <div className="flex gap-2 mb-1" style={{ fontSize: 13, lineHeight: 1.55, color: "var(--doc-ink-2)" }}>
        <span className="font-mono font-semibold shrink-0" style={{ color: "#10a86a" }}>+</span>
        <span>{pros}</span>
      </div>

      {/* Cons */}
      <div className="flex gap-2" style={{ fontSize: 13, lineHeight: 1.55, color: "var(--doc-ink-2)" }}>
        <span className="font-mono font-semibold shrink-0" style={{ color: "var(--doc-ink-4)" }}>−</span>
        <span>{cons}</span>
      </div>
    </div>
  );
}

export function OptionCardGrid({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 my-6">
      {children}
    </div>
  );
}

// ─── StatCard — Result 정량 지표 (metrics grid) ─────────────────────────────

interface StatCardProps {
  metric: string;
  label: string;
  context: string;
  unit?: string;
}

export function StatCard({ metric, label, context, unit }: StatCardProps) {
  return (
    <div style={{ background: "#fff", padding: METRIC_PADDING }}>
      <p
        className="font-mono uppercase"
        style={{
          fontSize: METRIC_LABEL_SIZE,
          color: "var(--doc-ink-4)",
          letterSpacing: "0.05em",
          marginBottom: 8,
        }}
      >
        {label}
      </p>
      <p
        style={{
          fontSize: METRIC_VALUE_SIZE,
          fontWeight: 700,
          letterSpacing: "-0.03em",
          color: "var(--doc-ink)",
          lineHeight: 1,
          marginBottom: 4,
        }}
      >
        {metric}
        {unit && (
          <span
            style={{
              fontSize: METRIC_UNIT_SIZE,
              color: "var(--doc-ink-3)",
              fontWeight: 500,
              marginLeft: 2,
            }}
          >
            {unit}
          </span>
        )}
      </p>
      <p style={{ fontSize: METRIC_DESC_SIZE, color: "var(--doc-ink-3)" }}>
        {context}
      </p>
    </div>
  );
}

export function StatCardGrid({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="grid grid-cols-1 sm:grid-cols-3 my-6 overflow-hidden"
      style={{
        gap: METRIC_GAP,
        background: "var(--doc-line-soft)",
        borderRadius: 10,
      }}
    >
      {children}
    </div>
  );
}

// ─── AchievementCard — Result 정성적 성과 ───────────────────────────────────

interface AchievementCardProps {
  title: string;
  description: React.ReactNode;
}

export function AchievementCard({ title, description }: AchievementCardProps) {
  return (
    <div
      style={{
        background: "#fff",
        border: "1px solid var(--doc-line)",
        borderRadius: 10,
        padding: 20,
      }}
    >
      <div className="flex gap-2.5 items-start">
        <span
          className="flex items-center justify-center shrink-0"
          style={{
            width: 20,
            height: 20,
            borderRadius: "50%",
            marginTop: 2,
            background: "var(--doc-accent-soft)",
          }}
        >
          <Check size={12} strokeWidth={2.5} style={{ color: "var(--doc-accent-ink)" }} />
        </span>
        <div>
          <p style={{ fontSize: 15, fontWeight: 600, color: "var(--doc-ink)", lineHeight: 1.4, marginBottom: 4 }}>
            {title}
          </p>
          <p style={{ fontSize: 13, lineHeight: 1.55, color: "var(--doc-ink-2)" }}>{description}</p>
        </div>
      </div>
    </div>
  );
}

export function AchievementGrid({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 my-6">
      {children}
    </div>
  );
}

// ─── LimitationCard — Result 한계/후속 과제 ─────────────────────────────────

interface LimitationCardProps {
  item: string;
  status: string;
  note: string;
}

export function LimitationCard({ item, status, note }: LimitationCardProps) {
  return (
    <div
      style={{
        background: "#fff",
        border: "1px solid var(--doc-line)",
        borderRadius: 10,
        padding: 20,
      }}
    >
      <div className="flex gap-2.5 items-start">
        <span
          className="flex items-center justify-center shrink-0"
          style={{
            width: 20,
            height: 20,
            borderRadius: "50%",
            marginTop: 2,
            background: "var(--doc-line-soft)",
          }}
        >
          <AlertTriangle size={11} strokeWidth={2.5} style={{ color: "var(--doc-ink-4)" }} />
        </span>
        <div>
          <p style={{ fontSize: 15, fontWeight: 600, color: "var(--doc-ink)", lineHeight: 1.4, marginBottom: 2 }}>
            {item}
          </p>
          <p style={{ fontSize: 13, color: "var(--doc-ink-2)", lineHeight: 1.55, marginBottom: 2 }}>
            {status}
          </p>
          <p style={{ fontSize: 12, color: "var(--doc-ink-4)", lineHeight: 1.5 }}>{note}</p>
        </div>
      </div>
    </div>
  );
}

export function LimitationGrid({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 my-6">
      {children}
    </div>
  );
}

// ─── LayerCard — Joka 로거/FSD 레이어 ──────────────────────────────────────

interface LayerCardProps {
  name: string;
  color: string;
  target: string;
  description: string;
}

export function LayerCard({ name, color, target, description }: LayerCardProps) {
  return (
    <div
      className="flex gap-3 items-start"
      style={{
        background: "#fff",
        border: "1px solid var(--doc-line)",
        borderLeft: `3px solid ${color}`,
        borderRadius: "0 10px 10px 0",
        padding: "14px 20px",
      }}
    >
      <div className="flex-1 min-w-0">
        <div className="flex items-baseline gap-2 mb-0.5">
          <code className="font-mono font-bold" style={{ fontSize: 14, color }}>{name}</code>
          <span className="font-mono" style={{ fontSize: 11, color: "var(--doc-ink-4)" }}>{target}</span>
        </div>
        <p style={{ fontSize: 13, lineHeight: 1.55, color: "var(--doc-ink-2)" }}>{description}</p>
      </div>
    </div>
  );
}

export function LayerStack({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-2 my-6">
      {children}
    </div>
  );
}

// ─── StackChip — Hero 기술 스택 (모노스페이스 칩) ───────────────────────────

export function StackChip({ label }: { label: string }) {
  return (
    <span
      className="font-mono"
      style={{
        fontSize: STACK_CHIP_SIZE,
        padding: "3px 9px",
        borderRadius: 4,
        background: "var(--doc-bg-soft)",
        color: "var(--doc-ink-2)",
      }}
    >
      {label}
    </span>
  );
}

export function StackRow({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-wrap items-center gap-1.5">
      {children}
    </div>
  );
}

// ─── DocMeta — 히어로 메타 행 (역할 · 기간 · 스택) ─────────────────────────

interface DocMetaItem {
  key: string;
  value: React.ReactNode;
}

export function DocMeta({ items }: { items: DocMetaItem[] }) {
  return (
    <div
      className="flex flex-wrap items-center gap-5 font-mono"
      style={{
        fontSize: 13,
        color: "var(--doc-ink-3)",
        paddingTop: 24,
        borderTop: "1px solid var(--doc-line)",
      }}
    >
      {items.map((item, i) => (
        <React.Fragment key={item.key}>
          {i > 0 && (
            <span
              className="shrink-0"
              style={{
                width: 3,
                height: 3,
                borderRadius: "50%",
                background: "var(--doc-ink-4)",
              }}
            />
          )}
          <div className="flex items-center gap-2">
            <span style={{ color: "var(--doc-ink-4)", marginRight: 8 }}>{item.key}</span>
            {item.value}
          </div>
        </React.Fragment>
      ))}
    </div>
  );
}
