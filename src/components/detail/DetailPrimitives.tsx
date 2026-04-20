import React, { useState } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";

// ─── Typography ─────────────────────────────────────────────────────────────

const DOC_H2_SIZE = 34;
const DOC_H3_SIZE = 19;
const DOC_BODY_SIZE = 16;
const DOC_H3_MARGIN_TOP = 40;
const DOC_H3_MARGIN_BOTTOM = 14;

export function Lead({ children }: { children: React.ReactNode }) {
  return (
    <p
      className="mb-4"
      style={{
        fontSize: DOC_BODY_SIZE,
        lineHeight: 1.8,
        color: "var(--doc-ink-2)",
        letterSpacing: "-0.01em",
      }}
    >
      {children}
    </p>
  );
}

export function H2({ children }: { children: React.ReactNode }) {
  return (
    <h2
      className="mb-6"
      style={{
        fontSize: DOC_H2_SIZE,
        fontWeight: 700,
        letterSpacing: "-0.03em",
        lineHeight: 1.2,
        color: "var(--doc-ink)",
      }}
    >
      {children}
    </h2>
  );
}

export function H3({ children }: { children: React.ReactNode }) {
  return (
    <h3
      style={{
        fontSize: DOC_H3_SIZE,
        fontWeight: 600,
        letterSpacing: "-0.02em",
        lineHeight: 1.35,
        color: "var(--doc-ink)",
        marginTop: DOC_H3_MARGIN_TOP,
        marginBottom: DOC_H3_MARGIN_BOTTOM,
      }}
    >
      {children}
    </h3>
  );
}

// ─── Bullet list ────────────────────────────────────────────────────────────

export function BulletList({ items }: { items: React.ReactNode[] }) {
  return (
    <ul className="list-none p-0 m-0 mb-4 flex flex-col gap-2.5">
      {items.map((item, i) => (
        <li key={i} className="flex gap-3 items-start">
          <span
            className="mt-[0.55em] w-1 h-1 rounded-full shrink-0"
            style={{ background: "var(--doc-ink-4)" }}
          />
          <span
            style={{
              fontSize: DOC_BODY_SIZE,
              lineHeight: 1.8,
              color: "var(--doc-ink-2)",
              letterSpacing: "-0.01em",
            }}
          >
            {item}
          </span>
        </li>
      ))}
    </ul>
  );
}

// ─── Section label ──────────────────────────────────────────────────────────

const SECTION_BADGE_SIZE = 22;

export function SectionDivider({ number, label }: { number: string; label: string }) {
  return (
    <div
      className="inline-flex items-center gap-2.5 font-mono uppercase"
      style={{
        fontSize: 12,
        fontWeight: 500,
        letterSpacing: "0.08em",
        color: "var(--doc-accent)",
        marginBottom: 14,
      }}
    >
      <span
        className="inline-flex items-center justify-center shrink-0"
        style={{
          width: SECTION_BADGE_SIZE,
          height: SECTION_BADGE_SIZE,
          borderRadius: 6,
          background: "var(--doc-accent-soft)",
          color: "var(--doc-accent-ink)",
          fontSize: 11,
          fontWeight: 600,
        }}
      >
        {number}
      </span>
      {label}
    </div>
  );
}

// ─── Callout ────────────────────────────────────────────────────────────────

export function Callout({ label, children }: {
  label?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className="mb-5"
      style={{
        borderLeft: "3px solid var(--doc-accent)",
        padding: "14px 20px",
        background: "var(--doc-accent-soft)",
        borderRadius: "0 8px 8px 0",
      }}
    >
      {label && (
        <p
          className="font-bold uppercase mb-2 font-mono"
          style={{
            fontSize: 11,
            letterSpacing: "0.08em",
            color: "var(--doc-accent-ink)",
          }}
        >
          {label}
        </p>
      )}
      <div
        style={{
          fontSize: 14,
          lineHeight: 1.65,
          color: "var(--doc-accent-ink)",
        }}
      >
        {children}
      </div>
    </div>
  );
}

// ─── Inline code ────────────────────────────────────────────────────────────

export function Inline({ children }: { children: React.ReactNode }) {
  return (
    <code
      className="font-mono px-1.5 py-0.5"
      style={{
        fontSize: "0.88em",
        background: "var(--doc-bg-soft)",
        borderRadius: 4,
        color: "var(--doc-accent-ink)",
      }}
    >
      {children}
    </code>
  );
}

// ─── Table ──────────────────────────────────────────────────────────────────

export function DetailTable({
  headers,
  rows,
}: {
  headers: string[];
  rows: { cells: React.ReactNode[]; chosen?: boolean }[];
}) {
  return (
    <div className="overflow-hidden my-5" style={{ border: "1px solid var(--doc-line)", borderRadius: 10 }}>
      <table className="w-full border-collapse">
        <thead>
          <tr style={{ background: "var(--doc-bg-soft)", borderBottom: "1px solid var(--doc-line)" }}>
            {headers.map((h) => (
              <th
                key={h}
                className="px-4 py-2.5 text-left font-mono uppercase"
                style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.08em", color: "var(--doc-ink-4)" }}
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr
              key={i}
              style={{
                borderBottom: "1px solid var(--doc-line-soft)",
                background: row.chosen ? "var(--doc-accent-soft)" : "#fff",
              }}
            >
              {row.cells.map((cell, j) => (
                <td
                  key={j}
                  className="px-4 py-2.5 align-top"
                  style={{
                    fontSize: 14,
                    lineHeight: 1.6,
                    color: j === 0 && row.chosen ? "var(--doc-accent-ink)" : "var(--doc-ink-2)",
                    fontWeight: j === 0 ? 600 : 400,
                  }}
                >
                  {j === 0 && row.chosen && (
                    <span
                      className="inline-block font-mono mr-1.5 align-middle"
                      style={{
                        fontSize: 10,
                        fontWeight: 600,
                        padding: "1px 6px",
                        borderRadius: 4,
                        background: "var(--doc-accent)",
                        color: "#fff",
                      }}
                    >
                      선택
                    </span>
                  )}
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ─── Code block ─────────────────────────────────────────────────────────────

const COPY_FEEDBACK_DELAY_MS = 2000;
const CODE_BG = "#1A1422";
const CODE_FONT = "'JetBrains Mono', 'Fira Code', 'Cascadia Code', ui-monospace, monospace";

const codeCustomStyle = {
  ...oneDark,
  'pre[class*="language-"]': {
    ...oneDark['pre[class*="language-"]'],
    background: CODE_BG,
    margin: 0,
    padding: "20px 22px",
    fontSize: "13px",
    lineHeight: "1.7",
    fontFamily: CODE_FONT,
  },
  'code[class*="language-"]': {
    ...oneDark['code[class*="language-"]'],
    background: "transparent",
    fontFamily: CODE_FONT,
  },
};

export function CodeBlock({ code, language = "typescript", filename }: {
  code: string;
  language?: string;
  filename?: string;
}) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), COPY_FEEDBACK_DELAY_MS);
  };

  return (
    <div className="my-5 overflow-hidden" style={{ borderRadius: 10 }}>
      {/* Optional filename bar */}
      {filename && (
        <div
          className="flex items-center justify-between px-5 py-2 font-mono"
          style={{
            background: CODE_BG,
            borderBottom: "1px solid rgba(255,255,255,0.06)",
            fontSize: 12,
            color: "rgba(255,255,255,0.35)",
          }}
        >
          <span>{filename}</span>
          <button
            onClick={handleCopy}
            data-cursor="pill"
            data-cursor-label="COPY"
            className="bg-transparent border-none font-mono"
            style={{ fontSize: 11, color: copied ? "#9FE1CB" : "rgba(255,255,255,0.3)" }}
          >
            {copied ? "복사됨" : "복사"}
          </button>
        </div>
      )}

      <SyntaxHighlighter
        language={language}
        style={codeCustomStyle}
        showLineNumbers={false}
        wrapLines={false}
        PreTag="div"
      >
        {code.trim()}
      </SyntaxHighlighter>
    </div>
  );
}
