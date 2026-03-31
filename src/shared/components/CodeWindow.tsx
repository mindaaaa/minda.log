import { useCallback, useEffect, useMemo, useState } from "react";
import type { BundledLanguage } from "shiki";
import { Check, Copy } from "lucide-react";
import { ensureShikiHighlighter } from "@/shared/lib/shiki-highlighter";

export interface CodeWindowProps {
  filename: string;
  language: string;
  code: string;
  className?: string;
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

const LANG_ALIASES: Record<string, BundledLanguage> = {
  ts: "typescript",
  js: "javascript",
  jsx: "jsx",
  tsx: "tsx",
  kt: "kotlin",
  kts: "kotlin",
  sh: "bash",
};

function normalizeLang(language: string): BundledLanguage {
  const key = language.trim().toLowerCase();
  return (LANG_ALIASES[key] ?? (key as BundledLanguage)) as BundledLanguage;
}

export default function CodeWindow({ filename, language, code, className = "" }: CodeWindowProps) {
  const [html, setHtml] = useState<string>("");
  const [highlightFailed, setHighlightFailed] = useState(false);
  const [copied, setCopied] = useState(false);

  const lang = useMemo(() => normalizeLang(language), [language]);

  useEffect(() => {
    let cancelled = false;
    setHtml("");
    setHighlightFailed(false);

    void (async () => {
      try {
        const highlighter = await ensureShikiHighlighter();
        const out = highlighter.codeToHtml(code, {
          lang,
          theme: "one-dark-pro",
        });
        if (!cancelled) setHtml(out);
      } catch {
        if (!cancelled) {
          setHighlightFailed(true);
          setHtml(`<pre class="shiki-fallback" tabindex="0"><code>${escapeHtml(code)}</code></pre>`);
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [code, lang]);

  const onCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      /* ignore */
    }
  }, [code]);

  return (
    <div
      className={`group/code overflow-hidden rounded-xl border border-black/40 shadow-[0_12px_40px_rgba(0,0,0,0.35)] ${className}`}
      style={{ background: "#1e2127" }}
    >
      <div
        className="flex h-9 shrink-0 items-center gap-2 border-b border-black/35 px-3"
        style={{ background: "#21252b" }}
      >
        <div className="flex items-center gap-1.5 pr-2" aria-hidden="true">
          <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
        </div>
        <span
          className="min-w-0 flex-1 truncate text-center font-mono text-[11px] text-white/55"
          title={filename}
        >
          {filename}
        </span>
        <button
          type="button"
          onClick={() => void onCopy()}
          className="inline-flex shrink-0 items-center gap-1 rounded-md px-2 py-1 text-[11px] font-medium text-white/50 transition-colors hover:bg-white/8 hover:text-white/85"
          aria-label="코드 복사"
        >
          {copied ? (
            <>
              <Check className="h-3.5 w-3.5 text-emerald-400" />
              복사됨
            </>
          ) : (
            <>
              <Copy className="h-3.5 w-3.5" />
              Copy
            </>
          )}
        </button>
      </div>
      <div
        className="code-window-shiki max-h-[min(28rem,70vh)] overflow-auto text-[13px] leading-relaxed [&_pre]:m-0 [&_pre]:rounded-none [&_pre]:!bg-[#282c34] [&_pre]:p-4 [&_code]:font-mono"
        // Shiki injects inline colors; One Dark 배경과 맞춤
        style={{ background: "#282c34" }}
      >
        {html ? (
          <div dangerouslySetInnerHTML={{ __html: html }} />
        ) : (
          <pre className="p-4 font-mono text-white/35">하이라이트 준비 중…</pre>
        )}
      </div>
      {highlightFailed && (
        <p className="border-t border-white/5 px-3 py-1.5 text-[10px] text-amber-200/50">
          일부 언어는 Shiki에서 지원되지 않아 일반 텍스트로 표시했습니다.
        </p>
      )}
    </div>
  );
}
