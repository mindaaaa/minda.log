import React from "react";

// ─── Constants ──────────────────────────────────────────────────────────────

const ICON_SIZE = 15;
const PADDING_Y = 10;
const PADDING_X = 18;
const BORDER_RADIUS = 10;
const FONT_SIZE = 14;
const GAP = 8;

const PRIMARY_BG = "linear-gradient(180deg, #2D1F4B 0%, #1A1229 100%)";
const PRIMARY_SHADOW = "0 4px 12px rgba(50, 20, 100, 0.25)";
const PRIMARY_HOVER_SHADOW = "0 6px 16px rgba(50, 20, 100, 0.35)";

const GHOST_BG = "rgba(255, 255, 255, 0.6)";
const GHOST_BORDER = "1px solid rgba(255, 255, 255, 0.7)";
const GHOST_HOVER_BG = "rgba(255, 255, 255, 0.85)";

// ─── Types ──────────────────────────────────────────────────────────────────

interface DetailActionButtonProps {
  variant: "primary" | "ghost";
  icon: React.ReactNode;
  label: string;
  href?: string;
}

// ─── Component ──────────────────────────────────────────────────────────────

export function DetailActionButton({ variant, icon, label, href }: DetailActionButtonProps) {
  const isPrimary = variant === "primary";

  const style: React.CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    gap: GAP,
    padding: `${PADDING_Y}px ${PADDING_X}px`,
    borderRadius: BORDER_RADIUS,
    fontSize: FONT_SIZE,
    fontWeight: 500,
    textDecoration: "none",
    transition: "all 0.2s",
    border: isPrimary ? "1px solid transparent" : GHOST_BORDER,
    background: isPrimary ? PRIMARY_BG : GHOST_BG,
    color: isPrimary ? "#fff" : "var(--doc-ink)",
    boxShadow: isPrimary ? PRIMARY_SHADOW : undefined,
    cursor: "pointer",
  };

  const handleMouseEnter = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const el = e.currentTarget;
    if (isPrimary) {
      el.style.transform = "translateY(-1px)";
      el.style.boxShadow = PRIMARY_HOVER_SHADOW;
    } else {
      el.style.background = GHOST_HOVER_BG;
    }
  };

  const handleMouseLeave = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const el = e.currentTarget;
    if (isPrimary) {
      el.style.transform = "translateY(0)";
      el.style.boxShadow = PRIMARY_SHADOW;
    } else {
      el.style.background = GHOST_BG;
    }
  };

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (!href || href === "#") {
      e.preventDefault();
    }
  };

  const resolvedHref = href || "#";
  const isExternal = href && href !== "#";

  return (
    <a
      href={resolvedHref}
      target={isExternal ? "_blank" : undefined}
      rel={isExternal ? "noopener noreferrer" : undefined}
      data-cursor="pill"
      data-cursor-label="OPEN"
      style={style}
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <span style={{ width: ICON_SIZE, height: ICON_SIZE, display: "flex", alignItems: "center", justifyContent: "center" }}>
        {icon}
      </span>
      {label}
    </a>
  );
}

// ─── Action Row Container ───────────────────────────────────────────────────

const ACTION_ROW_GAP = 10;
const ACTION_ROW_MARGIN_TOP = 28;

export function ActionRow({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="flex flex-wrap"
      style={{ gap: ACTION_ROW_GAP, marginTop: ACTION_ROW_MARGIN_TOP }}
    >
      {children}
    </div>
  );
}
