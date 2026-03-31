import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  ArrowUpRight,
  Github,
  ExternalLink,
  GitPullRequest,
  BookOpen,
  Link2,
  ChevronDown,
  AlertCircle,
  Scale,
  Wrench,
  CircleCheck,
  type LucideIcon,
} from "lucide-react";
import type { Project, ProjectChallenge, ProjectNarrativeBlock } from "./model/types";
import TiltCard from "@/shared/components/TiltCard";
import FadeInView from "@/shared/components/FadeInView";
import StaggerInView from "@/shared/components/StaggerInView";
import CodeWindow from "@/shared/components/CodeWindow";
import {
  JokaIntroArchitectureDiagram,
  JokaSystemArchitectureTriptych,
  JokaObservabilityFlowDiagram,
  JokaAccessControlDiagram,
  JokaPlatformLayersDiagram,
} from "./joka/JokaProjectVisuals";
import {
  LocusGridFlowDiagram,
  LocusMemoryFlowDiagram,
  LocusMobileUxDiagram,
  LocusSdkFlowDiagram,
  LocusSentryGuardDiagram,
} from "./locus/LocusProjectVisuals";
import { MintDiArchitectureDiagram, MintErrorSchemaDecisionDiagram } from "./mint/MintProjectVisuals";
import {
  MiniGitCommandDispatchDiagram,
  MiniGitObjectStorageDiagram,
  MiniGitCommitFlowDiagram,
} from "./minigit/MiniGitProjectVisuals";
import { HanzaCursorPaginationDiagram, HanzaPrefetchDecisionDiagram } from "./hanza/HanzaProjectVisuals";
import { highlightKeywords } from "./joka/highlightKeywords";

function isJokaDocProject(project: Project): boolean {
  return project.id === 1;
}

const narrativeSectionIcon: Record<string, LucideIcon> = {
  problem: AlertCircle,
  approach: Scale,
  solution: Wrench,
  outcome: CircleCheck,
};

interface ProjectDetailProps {
  project: Project;
  onBack: () => void;
}

interface TocItem {
  id: string;
  label: string;
  /** 0 = 기본, 1 = 목차 들여쓰기 (하위 항목) */
  depth?: number;
  parentId?: string;
}

function usesChallenges(project: Project): boolean {
  return Boolean(project.challenges && project.challenges.length > 0);
}

function challengeAnchorId(challenge: ProjectChallenge): string {
  return `challenge-${challenge.id}`;
}

function challengeSubsectionId(challenge: ProjectChallenge, subsection: string): string {
  return `${challengeAnchorId(challenge)}--${subsection}`;
}

function narrativeSectionLabel(key: string): string {
  const map: Record<string, string> = {
    problem: "문제",
    approach: "고민",
    solution: "해결",
    outcome: "결과",
  };
  return map[key] ?? key;
}

function challengeTocSubsections(challenge: ProjectChallenge): { key: string; label: string }[] {
  const subs: { key: string; label: string }[] = [
    { key: "problem", label: narrativeSectionLabel("problem") },
  ];
  if (challenge.approach) {
    subs.push({ key: "approach", label: narrativeSectionLabel("approach") });
  }
  subs.push({ key: "solution", label: narrativeSectionLabel("solution") });
  if (challenge.outcome) {
    subs.push({ key: "outcome", label: narrativeSectionLabel("outcome") });
  }
  return subs;
}

function buildTocItems(project: Project): TocItem[] {
  const items: TocItem[] = [{ id: "intro", label: "개요" }];

  if (usesChallenges(project)) {
    project.challenges!.forEach((c) => {
      items.push({
        id: challengeAnchorId(c),
        label: c.tocLabel ?? c.title,
        depth: 0,
      });
      challengeTocSubsections(c).forEach((sub) => {
        items.push({
          id: challengeSubsectionId(c, sub.key),
          label: sub.label,
          depth: 1,
          parentId: challengeAnchorId(c),
        });
      });
    });
    if (project.wikiCard) {
      items.push({ id: "wiki", label: "레퍼런스" });
    }
    if (project.closing) {
      items.push({
        id: "retrospective",
        label: project.closing.title ?? "결과 및 회고",
      });
    }
  } else if (project.narrative) {
    items.push(
      { id: "problem", label: "문제" },
      { id: "approach", label: "고민" },
      { id: "solution", label: "해결" },
    );
    if (project.wikiCard) {
      items.push({ id: "wiki", label: "레퍼런스" });
    }
    items.push({ id: "outcome", label: "결과" });
  } else {
    items.push({ id: "detail", label: "상세" });
    if (project.wikiCard) {
      items.push({ id: "wiki", label: "레퍼런스" });
    }
  }

  items.push({ id: "resources", label: "리소스" });
  return items;
}

const cardVariants = {
  hidden: { opacity: 0, y: 24 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.45, ease: [0.22, 1, 0.36, 1] as const },
  }),
};
const solidSectionCard = "px-1 py-2 md:px-2 md:py-3";

interface ResourceCard {
  icon: ReactNode;
  label: string;
  sub: string;
  url: string;
  accent: string;
  glow: string;
}

function buildCards(project: Project): ResourceCard[] {
  const cards: ResourceCard[] = [
    {
      icon: <Github className="w-5 h-5" />,
      label: "GitHub 저장소",
      sub: "소스 코드와 변경 이력 확인",
      url: project.github,
      accent: "from-slate-500 to-slate-700",
      glow: "rgba(148,163,184,0.22)",
    },
    {
      icon: <ExternalLink className="w-5 h-5" />,
      label: "데모 보기",
      sub: "실제 동작 확인",
      url: project.live,
      accent: "from-pink-500 to-purple-600",
      glow: "rgba(236,72,153,0.28)",
    },
  ];

  if (project.pr) {
    cards.push({
      icon: <GitPullRequest className="w-5 h-5" />,
      label: "PR 내역",
      sub: "병합된 변경 확인",
      url: project.pr,
      accent: "from-emerald-400 to-teal-600",
      glow: "rgba(52,211,153,0.22)",
    });
  }

  if (project.docs) {
    cards.push({
      icon: <BookOpen className="w-5 h-5" />,
      label: "문서",
      sub: "가이드/레퍼런스/API 문서",
      url: project.docs,
      accent: "from-blue-400 to-indigo-600",
      glow: "rgba(96,165,250,0.22)",
    });
  }

  project.resources?.forEach((res) => {
    cards.push({
      icon: <Link2 className="w-5 h-5" />,
      label: res.label,
      sub: "외부 리소스",
      url: res.url,
      accent: "from-amber-400 to-orange-500",
      glow: "rgba(251,191,36,0.22)",
    });
  });

  return cards;
}

function NarrativeBody({
  block,
  sectionKey,
  docLayout = false,
  rightSlot,
}: {
  block: ProjectNarrativeBlock;
  sectionKey: string;
  docLayout?: boolean;
  /** JOKA doc: 본문 위, 다이어그램·코드 아래(단일 열, 전체 너비) */
  rightSlot?: ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const hasDeep = Boolean(block.deepDive);
  const bullets = block.bulletPoints && block.bulletPoints.length > 0 ? block.bulletPoints : null;

  const docTextBlock = (
    <StaggerInView className="flex min-w-0 flex-col gap-6" stagger={0.2} y={20} amount={0.12}>
      {block.tldr ? (
        <blockquote className="rounded-r-xl border-l-[3px] border-pink-300/85 bg-white/80 px-5 py-4 text-[17px] font-semibold leading-[1.85] tracking-[-0.02em] text-slate-900 shadow-[0_2px_16px_rgba(148,163,184,0.22)] backdrop-blur-[28px] md:text-[18px]">
          {highlightKeywords(block.tldr)}
        </blockquote>
      ) : null}
      {bullets ? (
        <ul className="list-none space-y-4 pl-0">
          {bullets.map((line) => (
            <li
              key={line}
              className="relative max-w-none pl-5 text-[17px] leading-[1.85] tracking-[-0.02em] text-slate-700 md:text-[18px] before:absolute before:left-0 before:top-[0.62em] before:h-2 before:w-2 before:rounded-full before:bg-pink-400/70"
            >
              {highlightKeywords(line)}
            </li>
          ))}
        </ul>
      ) : (
        <p className="whitespace-pre-wrap text-[17px] leading-[1.85] tracking-[-0.02em] text-slate-700 md:text-[18px]">
          {highlightKeywords(block.body)}
        </p>
      )}
      {bullets && block.body?.trim() ? (
        <p className="text-[15px] leading-[1.8] tracking-[-0.01em] text-[#c8c8c8] md:text-[16px]">{highlightKeywords(block.body)}</p>
      ) : null}
    </StaggerInView>
  );

  const docDeepDive =
    hasDeep && block.deepDive && docLayout ? (
      <div className="w-full min-w-0 pt-2">
        <button
          type="button"
          id={`${sectionKey}-deepdive-trigger`}
          aria-expanded={open}
          onClick={() => setOpen((o) => !o)}
          className="group flex w-full min-w-0 items-center justify-between gap-3 py-2 text-left text-sm text-slate-700 transition-colors hover:text-slate-900"
        >
          <span className="font-medium">{block.deepDive.title}</span>
          <ChevronDown
            className={`h-4 w-4 shrink-0 text-slate-500 transition-transform duration-200 group-hover:text-slate-600 ${open ? "rotate-180" : ""}`}
          />
        </button>
        <AnimatePresence initial={false}>
          {open && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
              className="overflow-hidden"
            >
              <p className="w-full pt-4 text-[16px] leading-[1.85] tracking-[-0.02em] text-slate-700 whitespace-pre-wrap md:text-[17px]">
                {highlightKeywords(block.deepDive.content)}
              </p>
              {block.deepDive.codeSnippet && (
                <div className="mt-4 w-full min-w-0">
                  <CodeWindow
                    filename={block.deepDive.codeSnippet.filename}
                    language={block.deepDive.codeSnippet.language}
                    code={block.deepDive.codeSnippet.code}
                    className="w-full max-w-none"
                  />
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    ) : null;

  const docVisualStack =
    docLayout && (rightSlot || block.asideNote || block.codeSnippet) ? (
      <div className="flex w-full min-w-0 flex-col gap-10">
        {block.asideNote && (
          <aside className="w-full rounded-xl border border-slate-200/80 bg-white/80 px-5 py-4 text-[15px] leading-[1.8] text-slate-700 shadow-[0_2px_14px_rgba(148,163,184,0.18)] backdrop-blur-[28px] md:text-[16px]">
            <span className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.14em] text-teal-600/95">
              왜 이 선택인가
            </span>
            <div>{highlightKeywords(block.asideNote)}</div>
          </aside>
        )}
        {rightSlot ? <div className="w-full min-w-0 [&>*]:max-w-none">{rightSlot}</div> : null}
        {block.codeSnippet ? (
          <div className="w-full min-w-0">
            <CodeWindow
              filename={block.codeSnippet.filename}
              language={block.codeSnippet.language}
              code={block.codeSnippet.code}
              className="w-full max-w-none"
            />
          </div>
        ) : null}
      </div>
    ) : null;

  if (!docLayout) {
    return (
      <div>
        {block.tldr && <p className="mb-3 font-semibold text-slate-800">{block.tldr}</p>}
        {bullets ? (
          <ul className="list-disc space-y-2 pl-5 text-slate-700">
            {bullets.map((line) => (
              <li key={line} className="leading-relaxed">
                {line}
              </li>
            ))}
          </ul>
        ) : (
          <p className="whitespace-pre-wrap text-slate-700 leading-relaxed">{block.body}</p>
        )}
        {bullets && block.body?.trim() ? (
          <p className="mt-3 text-sm leading-relaxed text-slate-500">{block.body}</p>
        ) : null}
        {rightSlot ? (
          <div className="mt-6 w-full min-w-0">
            <div className="w-full min-w-0 [&>*]:max-w-none">{rightSlot}</div>
          </div>
        ) : null}
        {block.codeSnippet && (
          <div className="mt-4">
            <CodeWindow
              filename={block.codeSnippet.filename}
              language={block.codeSnippet.language}
              code={block.codeSnippet.code}
            />
          </div>
        )}
        {hasDeep && block.deepDive && (
          <div className="mt-4 overflow-hidden rounded-xl border border-slate-200 bg-white/75 backdrop-blur-[28px]">
            <button
              type="button"
              id={`${sectionKey}-deepdive-trigger`}
              aria-expanded={open}
              onClick={() => setOpen((o) => !o)}
              className="w-full flex items-center justify-between gap-3 px-4 py-3 text-left text-sm text-slate-800 hover:bg-slate-100/70 transition-colors"
            >
              <span className="font-medium">{block.deepDive.title}</span>
              <ChevronDown
                className={`w-4 h-4 text-slate-500 shrink-0 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
              />
            </button>
            <AnimatePresence initial={false}>
              {open && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                  className="overflow-hidden border-t border-slate-200/80"
                >
                  <p className="px-4 py-3 text-sm text-slate-600 leading-relaxed whitespace-pre-wrap">
                    {block.deepDive.content}
                  </p>
                  {block.deepDive.codeSnippet && (
                    <div className="px-4 pb-3">
                      <CodeWindow
                        filename={block.deepDive.codeSnippet.filename}
                        language={block.deepDive.codeSnippet.language}
                        code={block.deepDive.codeSnippet.code}
                      />
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="w-full min-w-0 space-y-8">
      {docTextBlock}
      {docVisualStack}
      {docDeepDive}
    </div>
  );
}

function SectionHeading({ children }: { children: ReactNode }) {
  return (
    <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500 mb-3">{children}</h3>
  );
}

function ChallengeSection({
  challenge,
  index,
  baseDelay,
  project,
}: {
  challenge: ProjectChallenge;
  index: number;
  baseDelay: number;
  project: Project;
}) {
  const docLayout = isJokaDocProject(project);
  const anchorId = challengeAnchorId(challenge);
  const pieces: { key: string; label: string; block: ProjectNarrativeBlock }[] = [
    { key: "problem", label: narrativeSectionLabel("problem"), block: challenge.problem },
  ];
  if (challenge.approach) {
    pieces.push({
      key: "approach",
      label: narrativeSectionLabel("approach"),
      block: challenge.approach,
    });
  }
  pieces.push({
    key: "solution",
    label: narrativeSectionLabel("solution"),
    block: challenge.solution,
  });
  if (challenge.outcome) {
    pieces.push({
      key: "outcome",
      label: narrativeSectionLabel("outcome"),
      block: challenge.outcome,
    });
  }

  const challengeHeader = docLayout ? (
    <StaggerInView className="flex flex-col gap-2" stagger={0.2} y={20} amount={0.2}>
      <p className="text-[10px] font-medium uppercase tracking-[0.22em] text-slate-400">
        Challenge {(index + 1).toString().padStart(2, "0")}
      </p>
      <h2 className="text-xl font-semibold leading-snug tracking-tight text-slate-900 md:text-2xl">{challenge.title}</h2>
    </StaggerInView>
  ) : (
    <>
      <p className="mb-2 text-[10px] font-medium uppercase tracking-[0.22em] text-slate-400">
        Challenge {(index + 1).toString().padStart(2, "0")}
      </p>
      <h2 className="text-xl font-semibold leading-snug tracking-tight text-slate-900 md:text-2xl">{challenge.title}</h2>
    </>
  );

  const body = (
    <>
      <header id={anchorId} data-toc-section className="scroll-mt-20 snap-start">
        {challengeHeader}
      </header>
      <div
        className={
          docLayout ? "mt-10 space-y-0 [&>section]:mb-16 md:[&>section]:mb-20 [&>section]:last:mb-0" : "mt-6 space-y-6 pt-6"
        }
      >
        {pieces.map((p) => {
          const Icon = narrativeSectionIcon[p.key] ?? AlertCircle;
          let approachDiagram: ReactNode | undefined;
          if (project.id === 1 && p.key === "approach") {
            if (challenge.id === "joka-observability") approachDiagram = <JokaObservabilityFlowDiagram />;
            else if (challenge.id === "joka-access") approachDiagram = <JokaAccessControlDiagram />;
            else if (challenge.id === "joka-platform") approachDiagram = <JokaPlatformLayersDiagram />;
          } else if (project.id === 2 && p.key === "approach") {
            if (challenge.id === "locus-grid-query") approachDiagram = <LocusGridFlowDiagram />;
            else if (challenge.id === "locus-memory-visible") approachDiagram = <LocusMemoryFlowDiagram />;
            else if (challenge.id === "locus-sdk-raf") approachDiagram = <LocusSdkFlowDiagram />;
            else if (challenge.id === "locus-mobile-ux") approachDiagram = <LocusMobileUxDiagram />;
            else if (challenge.id === "locus-logging-sentry") approachDiagram = <LocusSentryGuardDiagram />;
          } else if (project.id === 3 && p.key === "approach") {
            if (challenge.id === "mint-pipeline") approachDiagram = <MintDiArchitectureDiagram />;
            else if (challenge.id === "mint-errors") approachDiagram = <MintErrorSchemaDecisionDiagram />;
          } else if (project.id === 4 && p.key === "approach") {
            if (challenge.id === "minigit-dispatch") approachDiagram = <MiniGitCommandDispatchDiagram />;
            else if (challenge.id === "minigit-storage") approachDiagram = <MiniGitObjectStorageDiagram />;
            else if (challenge.id === "minigit-commit-flow") approachDiagram = <MiniGitCommitFlowDiagram />;
          } else if (project.id === 5 && p.key === "approach") {
            if (challenge.id === "hanzawa-api") approachDiagram = <HanzaCursorPaginationDiagram />;
            else if (challenge.id === "hanzawa-client") approachDiagram = <HanzaPrefetchDecisionDiagram />;
          }
          return (
            <section
              key={p.key}
              id={challengeSubsectionId(challenge, p.key)}
              data-toc-section
              className="scroll-mt-20 snap-start"
            >
              <h3
                className={`flex items-center gap-2.5 text-xs font-semibold uppercase tracking-[0.2em] ${docLayout ? "mb-6 text-slate-600" : "mb-4 text-slate-500"}`}
              >
                <Icon className="h-4 w-4 shrink-0 text-[var(--porto-section-label-color)]" aria-hidden />
                {p.label}
              </h3>
              <NarrativeBody
                docLayout={docLayout}
                block={p.block}
                sectionKey={`${challenge.id}-${p.key}`}
                rightSlot={approachDiagram}
              />
            </section>
          );
        })}
      </div>
    </>
  );

  if (docLayout) {
    return <article className={`scroll-mt-20 ${index === 0 ? "pt-10 md:pt-12" : "pt-16 md:pt-20"}`}>{body}</article>;
  }

  return (
    <FadeInView delay={baseDelay + index * 0.035}>
      <div className={solidSectionCard}>{body}</div>
    </FadeInView>
  );
}

function WikiCardSection({
  wikiCard,
  delay,
}: {
  wikiCard: NonNullable<Project["wikiCard"]>;
  delay: number;
}) {
  return (
    <section id="wiki" data-toc-section className="scroll-mt-20 snap-start">
      <FadeInView delay={delay}>
        <div className="relative overflow-hidden p-1 md:p-2">
          <div
            className="absolute -right-20 -top-20 w-40 h-40 rounded-full opacity-40 blur-3xl pointer-events-none"
            style={{ background: "rgba(236,72,153,0.35)" }}
          />
          <p className="text-sm text-slate-600 mb-3 max-w-xl relative">{wikiCard.teaser}</p>
          <a
            href={wikiCard.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--porto-section-label-color)] hover:text-slate-700 transition-colors relative"
          >
            {wikiCard.linkLabel}
            <ArrowUpRight className="w-4 h-4" />
          </a>
        </div>
      </FadeInView>
    </section>
  );
}

export default function ProjectDetail({ project, onBack }: ProjectDetailProps) {
  const resourceCards = buildCards(project);
  const tocItems = useMemo(() => buildTocItems(project), [project]);
  const [activeId, setActiveId] = useState(tocItems[0]?.id ?? "intro");
  const [expandedParentId, setExpandedParentId] = useState<string | null>(null);
  const [hoveredParentId, setHoveredParentId] = useState<string | null>(null);
  const scrollLockRef = useRef(false);
  const childCountByParent = useMemo(() => {
    const map = new Map<string, number>();
    tocItems.forEach((item) => {
      if (!item.parentId) return;
      map.set(item.parentId, (map.get(item.parentId) ?? 0) + 1);
    });
    return map;
  }, [tocItems]);

  const resolveActiveParent = useCallback(
    (id: string): string | null => {
      const current = tocItems.find((item) => item.id === id);
      if (current?.parentId) return current.parentId;
      if ((childCountByParent.get(id) ?? 0) > 0) return id;
      return null;
    },
    [childCountByParent, tocItems],
  );
  const resolvedExpandedParentId = hoveredParentId ?? expandedParentId;

  const scrollToId = useCallback((id: string) => {
    scrollLockRef.current = true;
    setActiveId(id);
    const parent = resolveActiveParent(id);
    setExpandedParentId(parent);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
    window.setTimeout(() => {
      scrollLockRef.current = false;
    }, 700);
  }, [resolveActiveParent]);

  useEffect(() => {
    const ids = tocItems.map((t) => t.id);
    const elements = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => Boolean(el));

    if (elements.length === 0) return;

    const anchorOffset = 140;
    const updateActiveByScroll = () => {
      if (scrollLockRef.current) return;

      let currentId = elements[0]?.id ?? ids[0];
      for (const el of elements) {
        const top = el.getBoundingClientRect().top;
        if (top <= anchorOffset) {
          currentId = el.id;
        } else {
          break;
        }
      }

      if (currentId) {
        setActiveId((prev) => (prev === currentId ? prev : currentId));
      }
    };

    const scrollRoot = elements[0]?.closest(".custom-scrollbar");
    const scrollTarget: HTMLElement | Window = scrollRoot instanceof HTMLElement ? scrollRoot : window;

    updateActiveByScroll();
    scrollTarget.addEventListener("scroll", updateActiveByScroll, { passive: true });
    window.addEventListener("resize", updateActiveByScroll);
    return () => {
      scrollTarget.removeEventListener("scroll", updateActiveByScroll);
      window.removeEventListener("resize", updateActiveByScroll);
    };
  }, [tocItems]);

  useEffect(() => {
    setActiveId(tocItems[0]?.id ?? "intro");
    setExpandedParentId(null);
    setHoveredParentId(null);
  }, [project.id, tocItems]);

  useEffect(() => {
    const parent = resolveActiveParent(activeId);
    setExpandedParentId(parent);
  }, [activeId, resolveActiveParent]);

  const narrativeBeforeWiki = ["problem", "approach", "solution"] as const;
  const challengeMode = usesChallenges(project);
  const jokaDoc = isJokaDocProject(project);

  return (
    <div className="project-detail-surface h-full w-full px-4 pb-12 md:px-8 lg:px-10">
      <button
        type="button"
        onClick={onBack}
        className="flex items-center gap-2 text-slate-500 hover:text-slate-800 transition-colors mb-8 group"
      >
        <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
        <span className="text-sm font-medium">프로젝트 목록으로</span>
      </button>

      <div
        className={`w-full h-44 sm:h-52 rounded-2xl bg-gradient-to-br ${project.gradient} relative overflow-hidden mb-8`}
      >
        <div className="absolute inset-0 bg-white/12" />
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: "radial-gradient(circle at 2px 2px, white 1px, transparent 0)",
            backgroundSize: "24px 24px",
          }}
        />
        <div className="absolute inset-0 flex flex-col justify-end p-6 sm:p-8">
          <StaggerInView className="flex flex-col gap-3" stagger={0.2} y={20} amount={0.35}>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-900 leading-tight">
              {project.title}
            </h1>
            <div className="flex flex-wrap gap-2">
              {project.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-xs font-medium px-2.5 py-1 rounded-md bg-white/70 backdrop-blur-[28px] border border-slate-200 text-slate-700"
                >
                  {tag}
                </span>
              ))}
            </div>
          </StaggerInView>
        </div>
      </div>

      <div className="flex flex-col gap-8 lg:flex-row lg:gap-12 xl:gap-16 lg:items-start">
        {/* Main column — left on desktop */}
        <div className={`order-2 min-w-0 flex-1 lg:order-1 ${jokaDoc ? "space-y-0" : "space-y-10"}`}>
          <section id="intro" data-toc-section className="scroll-mt-20 snap-start">
            {jokaDoc ? (
              <StaggerInView className="flex flex-col gap-6 pb-4 md:pb-8" stagger={0.2} y={20} amount={0.12}>
                <h2 className="text-lg font-semibold tracking-tight text-slate-900 md:text-xl">프로젝트 요약</h2>
                {(project.period || project.role) && (
                  <p className="text-[12px] leading-relaxed text-slate-500 md:text-[13px]">
                    {project.period}
                    {project.period && project.role ? " · " : ""}
                    {project.role}
                  </p>
                )}
                <p className="max-w-3xl text-[15px] leading-[1.7] text-slate-700 md:text-base md:leading-[1.75]">
                  {highlightKeywords(project.description)}
                </p>

                {project.metrics && project.metrics.length > 0 ? (
                  <div>
                    <h2 className="text-lg font-semibold tracking-tight text-slate-900 md:text-xl">핵심 지표</h2>
                    <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
                      {project.metrics.map((m) => (
                        <div
                          key={m.label}
                          className="rounded-xl border border-slate-200 bg-white/75 px-4 py-3 backdrop-blur-[28px] md:py-4"
                        >
                          <p className="text-[10px] uppercase tracking-wider text-slate-500">{m.label}</p>
                          <p className="mt-1.5 text-lg font-semibold text-slate-900">{m.value}</p>
                          {m.hint && <p className="mt-1 text-[11px] leading-snug text-slate-500">{m.hint}</p>}
                        </div>
                      ))}
                    </div>
                  </div>
                ) : null}

                <div>
                  <h2 className="text-lg font-semibold tracking-tight text-slate-900 md:text-xl">기술 스택</h2>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {project.tags.map((tag) => (
                      <span
                        key={`chip-${tag}`}
                        className="rounded-full border border-slate-200 bg-white px-2.5 py-1 text-[11px] text-slate-700"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                <JokaIntroArchitectureDiagram />
                <JokaSystemArchitectureTriptych />
              </StaggerInView>
            ) : (
              <FadeInView delay={0.05}>
                <div className={solidSectionCard}>
                  <SectionHeading>프로젝트 요약</SectionHeading>
                  {(project.period || project.role) && (
                    <p className="mb-4 text-[11px] leading-relaxed text-slate-500">
                      {project.period}
                      {project.period && project.role ? " · " : ""}
                      {project.role}
                    </p>
                  )}
                  <p className="text-slate-700 text-base leading-relaxed mb-6">{project.description}</p>

                  {project.metrics && project.metrics.length > 0 && (
                    <>
                      <SectionHeading>핵심 지표</SectionHeading>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-2">
                        {project.metrics.map((m) => (
                          <div
                            key={m.label}
                            className="rounded-xl border border-slate-200 bg-white/75 px-4 py-3 backdrop-blur-[28px]"
                          >
                            <p className="text-[10px] uppercase tracking-wider text-slate-500 mb-1">{m.label}</p>
                            <p className="text-lg font-semibold text-slate-900">{m.value}</p>
                            {m.hint && <p className="text-[11px] text-slate-500 mt-1">{m.hint}</p>}
                          </div>
                        ))}
                      </div>
                    </>
                  )}

                  <SectionHeading>기술 스택</SectionHeading>
                  <div className="flex flex-wrap gap-2">
                    {project.tags.map((tag) => (
                      <span
                        key={`chip-${tag}`}
                        className="text-[11px] px-2.5 py-1 rounded-full bg-white border border-slate-200 text-slate-700"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </FadeInView>
            )}
          </section>

          {challengeMode && project.challenges ? (
            <>
              {project.challenges.map((ch, idx) => (
                <ChallengeSection key={ch.id} project={project} challenge={ch} index={idx} baseDelay={0.06} />
              ))}
              {project.wikiCard &&
                (jokaDoc ? (
                  <section id="wiki" data-toc-section className="scroll-mt-20 snap-start pt-16 md:pt-20">
                    <StaggerInView className="flex flex-col gap-3" stagger={0.2} y={20} amount={0.15}>
                      <h2 className="text-lg font-semibold tracking-tight text-slate-900 md:text-xl">레퍼런스</h2>
                      <p className="max-w-2xl text-sm leading-relaxed text-slate-600">{project.wikiCard.teaser}</p>
                      <a
                        href={project.wikiCard.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-sm font-medium text-[var(--porto-section-label-color)] hover:text-slate-700 transition-colors"
                      >
                        {project.wikiCard.linkLabel}
                        <ArrowUpRight className="w-4 h-4" />
                      </a>
                    </StaggerInView>
                  </section>
                ) : (
                  <WikiCardSection wikiCard={project.wikiCard} delay={0.06 + project.challenges.length * 0.035 + 0.02} />
                ))}
              {project.closing && (
                <section id="retrospective" data-toc-section className={`scroll-mt-20 snap-start ${jokaDoc ? "pt-16 md:pt-20" : ""}`}>
                  {jokaDoc ? (
                    <StaggerInView className="flex flex-col gap-4" stagger={0.2} y={20} amount={0.15}>
                      <h2 className="text-lg font-semibold tracking-tight text-slate-900 md:text-xl">
                        {project.closing.title ?? "결과 및 회고"}
                      </h2>
                      {project.closing.tldr ? (
                        <p className="max-w-3xl text-[15px] font-semibold leading-[1.7] text-slate-900 md:text-base md:leading-[1.75]">
                          {highlightKeywords(project.closing.tldr)}
                        </p>
                      ) : null}
                      {project.closing.bulletPoints && project.closing.bulletPoints.length > 0 ? (
                        <ul className="max-w-3xl list-none space-y-3 pl-0">
                          {project.closing.bulletPoints.map((line) => (
                            <li
                              key={line}
                              className="relative pl-4 text-[14px] leading-[1.7] text-slate-700 md:text-[15px] before:absolute before:left-0 before:top-[0.55em] before:h-1.5 before:w-1.5 before:rounded-full before:bg-[var(--porto-section-label-color)]"
                            >
                              {highlightKeywords(line)}
                            </li>
                          ))}
                        </ul>
                      ) : null}
                      {project.closing.body?.trim() ? (
                        <p className="max-w-3xl whitespace-pre-wrap text-[15px] leading-[1.7] text-slate-600 md:text-base md:leading-[1.75]">
                          {highlightKeywords(project.closing.body)}
                        </p>
                      ) : null}
                    </StaggerInView>
                  ) : (
                    <FadeInView delay={0.06 + project.challenges.length * 0.035 + 0.06}>
                      <div className={solidSectionCard}>
                        <SectionHeading>{project.closing.title ?? "결과 및 회고"}</SectionHeading>
                        <p className="text-slate-700 leading-relaxed whitespace-pre-wrap">{project.closing.body}</p>
                      </div>
                    </FadeInView>
                  )}
                </section>
              )}
            </>
          ) : project.narrative ? (
            <>
              {narrativeBeforeWiki.map((key, idx) => {
                const block = project.narrative![key];
                return (
                  <section key={key} id={key} data-toc-section className="scroll-mt-20 snap-start">
                    <FadeInView delay={0.06 + idx * 0.02}>
                      <div className={solidSectionCard}>
                        <SectionHeading>{narrativeSectionLabel(key)}</SectionHeading>
                        <NarrativeBody block={block} sectionKey={key} />
                      </div>
                    </FadeInView>
                  </section>
                );
              })}
              {project.wikiCard && <WikiCardSection wikiCard={project.wikiCard} delay={0.12} />}
              <section id="outcome" data-toc-section className="scroll-mt-20 snap-start">
                <FadeInView delay={0.14}>
                  <div className={solidSectionCard}>
                    <SectionHeading>{narrativeSectionLabel("outcome")}</SectionHeading>
                    <NarrativeBody block={project.narrative.outcome} sectionKey="outcome" />
                  </div>
                </FadeInView>
              </section>
            </>
          ) : (
            <section id="detail" data-toc-section className="scroll-mt-20 snap-start">
              <FadeInView delay={0.08}>
                <div className={solidSectionCard}>
                  <SectionHeading>상세</SectionHeading>
                  <p className="text-slate-700 leading-relaxed whitespace-pre-wrap">{project.longDescription}</p>
                </div>
              </FadeInView>
            </section>
          )}

          {!challengeMode && !project.narrative && project.wikiCard && (
            <WikiCardSection wikiCard={project.wikiCard} delay={0.1} />
          )}

          <section id="resources" data-toc-section className="scroll-mt-20 snap-start pb-4">
            <FadeInView delay={0.12}>
              <h2 className="text-lg font-semibold text-slate-900 mb-5">리소스 &amp; 링크</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {resourceCards.map((card, i) => (
                  <motion.div
                    key={card.url + card.label}
                    custom={i}
                    variants={cardVariants}
                    initial="hidden"
                    animate="show"
                  >
                    <TiltCard
                      as="a"
                      href={card.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      maxTilt={6}
                      liftPx={7}
                      className="group relative flex flex-col gap-4 p-4 rounded-xl overflow-hidden cursor-pointer w-full"
                      style={{
                        background: "rgba(255,255,255,0.6)",
                        backdropFilter: "blur(20px)",
                        WebkitBackdropFilter: "blur(20px)",
                        border: "0",
                        boxShadow: "none",
                        display: "flex",
                      }}
                    >
                      <div
                        className="absolute inset-0 rounded-2xl pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-400"
                        style={{
                          boxShadow: `0 0 40px 6px ${card.glow}, inset 0 1px 0 rgba(255,255,255,0.14)`,
                        }}
                      />
                      <div className="flex items-start justify-between">
                        <div
                          className={`w-11 h-11 rounded-xl bg-gradient-to-br ${card.accent} flex items-center justify-center text-white shadow-lg flex-shrink-0`}
                        >
                          {card.icon}
                        </div>
                        <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-slate-700 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-200" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-slate-900 mb-1">{card.label}</p>
                        <p className="text-xs text-slate-500 leading-relaxed">{card.sub}</p>
                      </div>
                    </TiltCard>
                  </motion.div>
                ))}
              </div>
            </FadeInView>
          </section>
        </div>

        {/* Sticky TOC — 우측, 테두리 없는 문서형 인덱스 */}
        <aside className="order-1 shrink-0 lg:order-2 lg:w-52 xl:w-56">
          <nav aria-label="프로젝트 목차" className="lg:sticky lg:top-4">
            <p className="mb-2.5 hidden text-[11px] font-medium tracking-wide text-slate-500 lg:block">
              On this page
            </p>

            <div className="lg:hidden">
              <p className="mb-2 text-[10px] font-medium uppercase tracking-[0.14em] text-slate-500">목차</p>
              <div className="-mx-0.5 flex gap-1.5 overflow-x-auto pb-1 [scrollbar-width:thin]">
                <AnimatePresence initial={false}>
                  {tocItems.map((item) => {
                    if (item.depth === 1 && item.parentId !== resolvedExpandedParentId) return null;
                    const isActive = activeId === item.id;
                    const hasChildren = (childCountByParent.get(item.id) ?? 0) > 0;
                    const isChild = item.depth === 1;
                    return (
                      <motion.button
                        key={item.id}
                        type="button"
                        onClick={() => scrollToId(item.id)}
                        onMouseEnter={() => {
                          if (item.depth === 1 && item.parentId) {
                            setHoveredParentId(item.parentId);
                            return;
                          }
                          if (hasChildren) setHoveredParentId(item.id);
                        }}
                        onMouseLeave={() => setHoveredParentId(null)}
                        initial={isChild ? { opacity: 0, x: -6, scale: 0.98 } : false}
                        animate={{ opacity: 1, x: 0, scale: 1 }}
                        exit={isChild ? { opacity: 0, x: -6, scale: 0.98 } : { opacity: 1 }}
                        transition={{ duration: isChild ? 0.18 : 0.12, ease: [0.22, 1, 0.36, 1] }}
                        className={`max-w-[200px] shrink-0 truncate rounded-full py-1 text-[11px] transition-colors ${
                          item.depth === 1 ? "px-2.5 opacity-92" : "px-3"
                        } ${
                          isActive
                            ? "bg-[color:var(--porto-section-label-color)]/15 text-slate-900"
                            : "bg-slate-100 text-slate-500 hover:bg-slate-200/70 hover:text-slate-700"
                        }`}
                      >
                        {item.label}
                      </motion.button>
                    );
                  })}
                </AnimatePresence>
              </div>
            </div>

            <ul
              className="relative ml-0.5 mt-1 hidden space-y-0.5 border-l border-slate-200/80 lg:block"
              onMouseLeave={() => setHoveredParentId(null)}
            >
              <AnimatePresence initial={false}>
                {tocItems.map((item) => {
                  if (item.depth === 1 && item.parentId !== resolvedExpandedParentId) return null;
                  const isActive = activeId === item.id;
                  const depthPad = item.depth === 1 ? "pl-5 text-[12px]" : "pl-3 text-[13px]";
                  const hasChildren = (childCountByParent.get(item.id) ?? 0) > 0;
                  const isChild = item.depth === 1;
                  return (
                    <motion.li
                      key={item.id}
                      className="relative"
                      initial={isChild ? { opacity: 0, x: -8, height: 0 } : false}
                      animate={{ opacity: 1, x: 0, height: "auto" }}
                      exit={isChild ? { opacity: 0, x: -8, height: 0 } : { opacity: 1 }}
                      transition={{ duration: isChild ? 0.2 : 0.14, ease: [0.22, 1, 0.36, 1] }}
                    >
                      <button
                        type="button"
                        title={item.label}
                        onClick={() => scrollToId(item.id)}
                        onMouseEnter={() => {
                          if (item.depth === 1 && item.parentId) {
                            setHoveredParentId(item.parentId);
                            return;
                          }
                          if (hasChildren) setHoveredParentId(item.id);
                        }}
                        className={`-ml-px block w-full border-l-2 py-1.5 text-left leading-snug transition-[color,border-color] duration-200 ${depthPad} ${
                          isActive
                            ? "border-[var(--porto-section-label-color)] text-slate-900"
                            : "border-transparent text-slate-500 hover:text-slate-700"
                        }`}
                      >
                        <span className="line-clamp-2 align-middle">{item.label}</span>
                      </button>
                    </motion.li>
                  );
                })}
              </AnimatePresence>
            </ul>
          </nav>
        </aside>
      </div>
    </div>
  );
}
