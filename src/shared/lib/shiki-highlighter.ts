import { getSingletonHighlighter } from "shiki";

let highlighterPromise: ReturnType<typeof getSingletonHighlighter> | null = null;

export function ensureShikiHighlighter() {
  if (!highlighterPromise) {
    highlighterPromise = getSingletonHighlighter({
      themes: ["one-dark-pro"],
      langs: [
        "typescript",
        "javascript",
        "tsx",
        "jsx",
        "json",
        "kotlin",
        "bash",
        "shell",
        "html",
        "css",
      ],
    });
  }
  return highlighterPromise;
}
