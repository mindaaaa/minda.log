import React, { useCallback } from "react";
import { toast } from "sonner";
import { SOCIAL_ITEMS } from "@/data/social";

// ─── Constants ──────────────────────────────────────────────────────────────

const FOOTER_PADDING = "40px 48px 60px";
const FOOTER_MAX_WIDTH = 1180;
const SEPARATOR_SIZE = 3;
const LINK_FONT_SIZE = 13;
const COPYRIGHT_FONT_SIZE = 13;
const ICON_SIZE = 13;
const ICON_GAP = 5;
const TOAST_DURATION_MS = 2000;

// ─── Icons (inline — same as SocialLinks) ───────────────────────────────────

function GitHubIcon() {
  return (
    <svg
      width={ICON_SIZE}
      height={ICON_SIZE}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      style={{ marginRight: ICON_GAP }}
    >
      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
    </svg>
  );
}

// ─── ARIA labels ────────────────────────────────────────────────────────────

const ARIA_LABELS: Record<string, string> = {
  github: "GitHub 프로필 열기",
  tistory: "Tistory 블로그 열기",
  resume: "이력서 열기",
  email: "이메일 주소 복사",
};

// ─── PortfolioFooter ────────────────────────────────────────────────────────

export function PortfolioFooter() {
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
    <footer
      className="mx-auto flex flex-col sm:flex-row justify-between items-center flex-wrap"
      style={{
        maxWidth: FOOTER_MAX_WIDTH,
        padding: FOOTER_PADDING,
        borderTop: "1px solid rgba(180, 160, 210, 0.3)",
        gap: 20,
      }}
    >
      {/* Left: copyright */}
      <div
        style={{
          fontFamily: "monospace",
          fontSize: COPYRIGHT_FONT_SIZE,
          color: "var(--doc-ink-3)",
        }}
      >
        &copy; 2026 &middot; Minda
      </div>

      {/* Right: links */}
      <ul
        className="flex items-center flex-wrap justify-center"
        style={{
          gap: 6,
          listStyle: "none",
          margin: 0,
          padding: 0,
          fontSize: LINK_FONT_SIZE,
        }}
      >
        {SOCIAL_ITEMS.filter((item) => item.url).map((item, i) => (
          <React.Fragment key={item.key}>
            {i > 0 && (
              <li aria-hidden="true" style={{ display: "flex", alignItems: "center" }}>
                <span
                  style={{
                    width: SEPARATOR_SIZE,
                    height: SEPARATOR_SIZE,
                    borderRadius: "50%",
                    background: "var(--doc-ink-4)",
                    display: "inline-block",
                    margin: "0 6px",
                  }}
                />
              </li>
            )}
            <li>
              {item.isEmail ? (
                <button
                  data-cursor="pill"
                  data-cursor-label="COPY"
                  aria-label={ARIA_LABELS[item.key]}
                  onClick={(e) => handleEmailClick(e, item.url)}
                  style={{
                    fontSize: LINK_FONT_SIZE,
                    color: "var(--doc-ink-2)",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    textDecoration: "none",
                    transition: "color 0.15s",
                    display: "inline-flex",
                    alignItems: "center",
                  }}
                  className="hover:!text-[var(--doc-accent-ink)]"
                >
                  {item.label}
                </button>
              ) : (
                <a
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-cursor="pill"
                  data-cursor-label="OPEN"
                  aria-label={ARIA_LABELS[item.key]}
                  style={{
                    color: "var(--doc-ink-2)",
                    textDecoration: "none",
                    transition: "color 0.15s",
                    display: "inline-flex",
                    alignItems: "center",
                  }}
                  className="hover:!text-[var(--doc-accent-ink)]"
                >
                  {item.key === "github" && <GitHubIcon />}
                  {item.label}
                </a>
              )}
            </li>
          </React.Fragment>
        ))}
      </ul>
    </footer>
  );
}
