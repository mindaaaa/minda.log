import React, { useCallback } from "react";
import { toast } from "sonner";
import { SOCIAL_ITEMS } from "@/data/social";
import type { SocialLinkItem } from "@/data/social";

// ─── Constants ──────────────────────────────────────────────────────────────

const DIVIDER_HEIGHT = 18;
const ICON_SIZE = 13;
const ICON_GAP = 5;
const ICON_ONLY_SIZE = 30;
const TOAST_DURATION_MS = 2000;

// ─── Icons ──────────────────────────────────────────────────────────────────

function GitHubIcon({ size = ICON_SIZE }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
    </svg>
  );
}

function TistoryIcon({ size = ICON_SIZE }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <circle cx="12" cy="4" r="3.5" />
      <circle cx="4" cy="12" r="3.5" />
      <circle cx="12" cy="12" r="3.5" />
      <circle cx="20" cy="12" r="3.5" />
      <circle cx="12" cy="20" r="3.5" />
    </svg>
  );
}

function ResumeIcon({ size = ICON_SIZE }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
      <polyline points="10 9 9 9 8 9" />
    </svg>
  );
}

function EmailIcon({ size = ICON_SIZE }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
    </svg>
  );
}

const ICON_MAP: Record<string, React.FC<{ size?: number }>> = {
  github: GitHubIcon,
  tistory: TistoryIcon,
  resume: ResumeIcon,
  email: EmailIcon,
};

// ─── ARIA labels ────────────────────────────────────────────────────────────

const ARIA_LABELS: Record<string, string> = {
  github: "GitHub 프로필 열기",
  tistory: "Tistory 블로그 열기",
  resume: "이력서 열기",
  email: "이메일 주소 복사",
};

// ─── SocialLinks ────────────────────────────────────────────────────────────

export function SocialLinks() {
  const handleEmailClick = useCallback((e: React.MouseEvent, email: string) => {
    e.preventDefault();
    navigator.clipboard.writeText(email).then(
      () => {
        toast("복사되었습니다", { duration: TOAST_DURATION_MS });
      },
      () => {
        window.location.href = `mailto:${email}`;
      },
    );
  }, []);

  return (
    <>
      {/* Divider */}
      <div
        className="hidden min-[1024px]:block"
        style={{
          width: 1,
          height: DIVIDER_HEIGHT,
          background: "rgba(26, 18, 41, 0.12)",
          flexShrink: 0,
        }}
      />

      {/* Links */}
      <ul
        className="hidden min-[1024px]:flex items-center"
        style={{ gap: 18, listStyle: "none", margin: 0, padding: 0 }}
      >
        {SOCIAL_ITEMS.filter((item) => item.url).map((item) => (
          <li key={item.key}>
            <SocialLink item={item} onEmailClick={handleEmailClick} />
          </li>
        ))}
      </ul>
    </>
  );
}

// ─── Single Link ────────────────────────────────────────────────────────────

function SocialLink({
  item,
  onEmailClick,
}: {
  item: SocialLinkItem;
  onEmailClick: (e: React.MouseEvent, email: string) => void;
}) {
  const Icon = ICON_MAP[item.key];
  const ariaLabel = ARIA_LABELS[item.key];
  const cursorLabel = item.isEmail ? "COPY" : "OPEN";

  const linkContent = (
    <>
      {Icon && (
        <span className="inline-flex" style={{ marginRight: ICON_GAP }}>
          <Icon />
        </span>
      )}
      {/* Full label: desktop 1200px+ */}
      <span className="hidden min-[1200px]:inline">{item.label}</span>
    </>
  );

  const sharedStyle: React.CSSProperties = {
    fontSize: 13,
    fontWeight: 500,
    color: "var(--doc-ink-3)",
    textDecoration: "none",
    transition: "color 0.15s, background 0.15s",
    whiteSpace: "nowrap",
    display: "inline-flex",
    alignItems: "center",
  };

  // Icon-only mode (1024-1200px): square button
  const iconOnlyStyle: React.CSSProperties = {
    width: ICON_ONLY_SIZE,
    height: ICON_ONLY_SIZE,
    justifyContent: "center",
    borderRadius: 6,
  };

  if (item.isEmail) {
    return (
      <button
        data-cursor="pill"
        data-cursor-label={cursorLabel}
        aria-label={ariaLabel}
        onClick={(e) => onEmailClick(e, item.url)}
        className="min-[1200px]:hover:!text-[var(--doc-ink)] max-[1199px]:min-[1024px]:hover:bg-[rgba(26,18,41,0.06)]"
        style={{
          ...sharedStyle,
          background: "none",
          border: "none",
          cursor: "pointer",
        }}
        title={item.label}
      >
        {/* Icon-only wrapper for tablet */}
        <span className="min-[1200px]:hidden min-[1024px]:inline-flex min-[1024px]:items-center min-[1024px]:justify-center" style={iconOnlyStyle}>
          {Icon && <Icon />}
        </span>
        {/* Full content for desktop */}
        <span className="hidden min-[1200px]:inline-flex min-[1200px]:items-center">
          {linkContent}
        </span>
      </button>
    );
  }

  return (
    <a
      href={item.url}
      target="_blank"
      rel="noopener noreferrer"
      data-cursor="pill"
      data-cursor-label={cursorLabel}
      aria-label={ariaLabel}
      className="min-[1200px]:hover:!text-[var(--doc-ink)] max-[1199px]:min-[1024px]:hover:bg-[rgba(26,18,41,0.06)]"
      style={sharedStyle}
      title={item.label}
    >
      {/* Icon-only wrapper for tablet */}
      <span className="min-[1200px]:hidden min-[1024px]:inline-flex min-[1024px]:items-center min-[1024px]:justify-center" style={iconOnlyStyle}>
        {Icon && <Icon />}
      </span>
      {/* Full content for desktop */}
      <span className="hidden min-[1200px]:inline-flex min-[1200px]:items-center">
        {linkContent}
      </span>
    </a>
  );
}
