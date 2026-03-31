import { Fragment, type ReactNode } from "react";

const PINK =
  "font-semibold text-pink-300/95 [text-shadow:0_0_24px_rgba(244,114,182,0.12)]";

const MINT = "font-semibold text-teal-300/90";

const RULES: { re: RegExp; cls: string }[] = [
  { re: /\b(ErrorBoundary|beforeSend|fingerprint|unhandledrejection|Breadcrumbs|operationId|mediaState)\b/g, cls: PINK },
  { re: /\b(Sentry|MTTI|PII|PWA|OAuth|Whitelist)\b/gi, cls: PINK },
  { re: /\b(TanStack Query|React 19|TypeScript|Vite 6)\b/g, cls: MINT },
  { re: /\b(Turborepo|pnpm|Drizzle|Husky|lint-staged)\b/gi, cls: MINT },
  { re: /\b(FSD|vite-plugin-pwa)\b/gi, cls: MINT },
  { re: /\b(apps\/web|packages\/domain-media|infra\/cloudflare|domain-media)\b/g, cls: MINT },
];

type Chunk = { t: "text" | "hit" | "code"; v: string; cls?: string };

function applyRuleToText(text: string, re: RegExp, cls: string): Chunk[] {
  const out: Chunk[] = [];
  let last = 0;
  const flags = re.flags.includes("g") ? re.flags : `${re.flags}g`;
  const r = new RegExp(re.source, flags);
  let m: RegExpExecArray | null = r.exec(text);
  while (m !== null) {
    if (m.index > last) out.push({ t: "text", v: text.slice(last, m.index) });
    out.push({ t: "hit", v: m[0], cls });
    last = m.index + m[0].length;
    m = r.exec(text);
  }
  if (last < text.length) out.push({ t: "text", v: text.slice(last) });
  return out.length > 0 ? out : [{ t: "text", v: text }];
}

function applyRules(chunks: Chunk[]): Chunk[] {
  let current = chunks;
  for (const { re, cls } of RULES) {
    const next: Chunk[] = [];
    for (const ch of current) {
      if (ch.t === "hit" || ch.t === "code") {
        next.push(ch);
        continue;
      }
      next.push(...applyRuleToText(ch.v, re, cls));
    }
    current = next;
  }
  return current;
}

export function highlightKeywords(text: string): ReactNode {
  if (!text) return null;
  const raw = text.split(/(`[^`]+`)/g).filter(Boolean);
  const preprocessed: Chunk[] = raw.map((part) => {
    if (part.startsWith("`") && part.endsWith("`") && part.length > 2) {
      return { t: "code", v: part.slice(1, -1) };
    }
    return { t: "text", v: part };
  });
  const chunks = applyRules(preprocessed);
  return (
    <>
      {chunks.map((c, i) =>
        c.t === "hit" && c.cls ? (
          <span key={i} className={c.cls}>
            {c.v}
          </span>
        ) : c.t === "code" ? (
          <code
            key={i}
            className="rounded bg-white/10 px-1.5 py-px font-mono text-[0.9em] text-teal-200/95"
          >
            {c.v}
          </code>
        ) : (
          <Fragment key={i}>{c.v}</Fragment>
        ),
      )}
    </>
  );
}
