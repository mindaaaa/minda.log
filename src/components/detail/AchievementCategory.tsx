import React from "react";

const GROUP_BOX_RADIUS = 14;
const GROUP_BOX_PADDING_Y = 24;

const ITEM_TITLE_SIZE = 15.5;
const ITEM_BODY_SIZE = 13.5;
const SINGLE_TITLE_SIZE = 16;

// ─── CategoryBlock — 라벨(번호·이름·부제) + 회색 그룹 박스 ──────────────────

export function CategoryBlock({
  num,
  name,
  sub,
  children,
}: {
  num: string;
  name: string;
  sub?: string;
  children: React.ReactNode;
}) {
  return (
    <>
      <p
        className="font-mono"
        style={{
          fontSize: 11,
          fontWeight: 600,
          letterSpacing: "0.08em",
          textTransform: "uppercase",
          color: "var(--doc-ink-3)",
          margin: "32px 0 12px",
          display: "flex",
          alignItems: "baseline",
          flexWrap: "wrap",
          gap: 10,
        }}
      >
        <span style={{ color: "var(--doc-accent)", fontWeight: 700 }}>{num}</span>
        <span style={{ color: "var(--doc-ink-4)", margin: "0 -4px" }}>·</span>
        <span>{name}</span>
        {sub && (
          <span
            style={{
              fontFamily: "var(--app-font-sans)",
              fontSize: 12.5,
              fontWeight: 400,
              letterSpacing: "-0.01em",
              textTransform: "none",
              color: "var(--doc-ink-4)",
            }}
          >
            {sub}
          </span>
        )}
      </p>
      <div
        style={{
          background: "var(--doc-line-soft)",
          borderRadius: GROUP_BOX_RADIUS,
          padding: `${GROUP_BOX_PADDING_Y}px clamp(18px, 3vw, 28px)`,
        }}
      >
        {children}
      </div>
    </>
  );
}

// ─── CategoryList — 박스 안 bullet 항목 시리즈 ───────────────────────────

export interface CategoryListItem {
  title: string;
  body: React.ReactNode;
}

export function CategoryList({ items }: { items: CategoryListItem[] }) {
  return (
    <ul
      style={{
        listStyle: "none",
        padding: 0,
        margin: 0,
        display: "flex",
        flexDirection: "column",
        gap: 20,
      }}
    >
      {items.map((item, i) => (
        <li
          key={i}
          style={{
            display: "grid",
            gridTemplateColumns: "14px 1fr",
            gap: 14,
            alignItems: "start",
          }}
        >
          <span
            aria-hidden
            style={{
              width: 6,
              height: 6,
              borderRadius: "50%",
              background: "var(--doc-accent)",
              marginTop: 10,
              marginLeft: 4,
            }}
          />
          <div>
            <p
              style={{
                fontSize: ITEM_TITLE_SIZE,
                fontWeight: 700,
                letterSpacing: "-0.02em",
                lineHeight: 1.4,
                color: "var(--doc-ink)",
                margin: "0 0 6px",
              }}
            >
              {item.title}
            </p>
            <p
              style={{
                fontSize: ITEM_BODY_SIZE,
                lineHeight: 1.75,
                color: "var(--doc-ink-2)",
                margin: 0,
              }}
            >
              {item.body}
            </p>
          </div>
        </li>
      ))}
    </ul>
  );
}

// ─── CategorySingle — 박스 안 단독 항목 (+ 한계 인라인 박스) ──────────────

export interface CategoryLimit {
  label: string;
  body: React.ReactNode;
}

export function CategorySingle({
  title,
  body,
  limit,
}: {
  title: string;
  body: React.ReactNode;
  limit?: CategoryLimit;
}) {
  return (
    <>
      <p
        style={{
          fontSize: SINGLE_TITLE_SIZE,
          fontWeight: 700,
          letterSpacing: "-0.02em",
          lineHeight: 1.4,
          color: "var(--doc-ink)",
          margin: "0 0 8px",
        }}
      >
        {title}
      </p>
      <p
        style={{
          fontSize: ITEM_BODY_SIZE,
          lineHeight: 1.75,
          color: "var(--doc-ink-2)",
          margin: 0,
        }}
      >
        {body}
      </p>
      {limit && (
        <div
          style={{
            marginTop: 16,
            padding: "11px 16px",
            background: "rgba(154, 148, 168, 0.1)",
            borderLeft: "2px solid var(--doc-ink-4)",
            borderRadius: "0 6px 6px 0",
          }}
        >
          <p
            className="font-mono"
            style={{
              fontSize: 10.5,
              fontWeight: 600,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              color: "var(--doc-ink-4)",
              margin: "0 0 4px",
            }}
          >
            {limit.label}
          </p>
          <p
            style={{
              fontSize: 12.5,
              color: "var(--doc-ink-3)",
              lineHeight: 1.65,
              margin: 0,
            }}
          >
            {limit.body}
          </p>
        </div>
      )}
    </>
  );
}
