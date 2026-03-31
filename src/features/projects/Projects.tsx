import { useState } from "react";
import { ArrowRight, ExternalLink, Github } from "lucide-react";
import FadeInView from "@/shared/components/FadeInView";
import StaggerInView from "@/shared/components/StaggerInView";
import { cn } from "@/shared/lib/utils";
import type { Project } from "./model/types";
import { projects } from "./data/projects";

interface ProjectsProps {
  onSelectProject: (project: Project) => void;
}

/** 데스크톱 벤토 그리드 시각 순서 (모바일도 동일 DOM 순으로 스택) */
const BENTO_ORDER = [2, 4, 3, 1, 5] as const;

const BENTO_ITEM_CLASS: Record<number, string> = {
  1: "projects-bento-item--joka",
  2: "projects-bento-item--locus",
  3: "projects-bento-item--mint",
  4: "projects-bento-item--minigit",
  5: "projects-bento-item--kanji",
};

function splitProjectTitle(title: string): { headline: string; subtitle: string } {
  const m = /^(.+?)\s*\((.+)\)\s*$/.exec(title);
  if (m) {
    return { headline: m[1].trim(), subtitle: m[2].trim() };
  }
  return { headline: title, subtitle: "" };
}

export default function Projects({ onSelectProject }: ProjectsProps) {
  const [hoveredId, setHoveredId] = useState<number | null>(null);

  const byId = new Map(projects.map((p) => [p.id, p]));
  const ordered = BENTO_ORDER.map((id) => byId.get(id)).filter(
    (p): p is Project => p != null,
  );

  return (
    <div className="h-full pt-8 pb-12 w-full max-w-7xl mx-auto px-4 md:px-6">
      <StaggerInView className="mb-10 flex flex-col gap-4" stagger={0.2} y={20}>
        <h2 className="text-4xl md:text-6xl font-bold tracking-tight text-white">
          <span className="gradient-text">Projects</span>
        </h2>
        <p className="text-white/60 text-lg md:text-xl max-w-2xl">
          문제 해결 과정을 시각적으로 전달하는 프레젠테이션형 포트폴리오
        </p>
      </StaggerInView>

      <FadeInView className="w-full" y={24}>
        <div className="projects-bento-grid w-full">
          {ordered.map((project) => {
            const { headline, subtitle } = splitProjectTitle(project.title);
            const isLarge = project.id === 2;
            const itemClass = BENTO_ITEM_CLASS[project.id] ?? "";

            return (
              <div
                key={project.id}
                className={cn("min-h-0", itemClass)}
              >
                <button
                  type="button"
                  onClick={() => onSelectProject(project)}
                  onMouseEnter={() => setHoveredId(project.id)}
                  onMouseLeave={() => setHoveredId(null)}
                  className={cn(
                    "relative h-full min-h-[220px] w-full overflow-hidden rounded-2xl text-left",
                    "bg-gradient-to-br",
                    project.gradient,
                    "transition-all duration-500 ease-out",
                    "group cursor-pointer",
                    hoveredId === project.id
                      ? "scale-[1.02] shadow-2xl shadow-slate-300/50"
                      : "scale-100",
                  )}
                >
                  <div className="absolute inset-0 bg-white/18 transition-colors duration-300 group-hover:bg-white/12" />

                  <div className="pointer-events-none absolute right-4 top-4 z-10 flex gap-2 opacity-0 transition-opacity duration-300 group-hover:pointer-events-auto group-hover:opacity-100">
                    <a
                      href={project.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="pointer-events-auto flex h-9 w-9 items-center justify-center rounded-full bg-white/70 text-slate-700 backdrop-blur-md transition-colors hover:bg-white hover:text-slate-900"
                      title="GitHub"
                    >
                      <Github className="h-4 w-4" />
                    </a>
                    <a
                      href={project.live}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="pointer-events-auto flex h-9 w-9 items-center justify-center rounded-full bg-white/70 text-slate-700 backdrop-blur-md transition-colors hover:bg-white hover:text-slate-900"
                      title="데모"
                    >
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  </div>

                  <div className="relative flex h-full flex-col justify-between p-6 md:p-8">
                    <div>
                      {project.period ? (
                        <div className="mb-2 text-xs font-medium uppercase tracking-widest text-slate-600">
                          {project.period}
                        </div>
                      ) : null}
                      <h3
                        className={cn(
                          "mb-2 font-bold text-slate-900",
                          isLarge
                            ? "text-4xl md:text-5xl"
                            : "text-2xl md:text-3xl lg:text-4xl",
                        )}
                      >
                        {headline}
                      </h3>
                      {subtitle ? (
                        <p
                          className={cn(
                            "mb-3 text-slate-700",
                            isLarge ? "text-base md:text-lg" : "text-sm md:text-base",
                          )}
                        >
                          {subtitle}
                        </p>
                      ) : null}
                      {isLarge ? (
                        <p className="text-sm leading-relaxed text-slate-700 md:text-[0.9375rem]">
                          {project.description}
                        </p>
                      ) : null}
                    </div>

                    <div className="mt-6 flex items-end justify-between gap-3">
                      <div className="flex flex-wrap gap-2">
                        {project.tags.slice(0, isLarge ? 4 : 3).map((tag) => (
                          <span
                            key={tag}
                            className="rounded-md border border-slate-200 bg-white/75 px-2 py-1 text-xs text-slate-700 backdrop-blur-sm"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                      <ArrowRight
                        className={cn(
                          "h-5 w-5 shrink-0 text-slate-700 transition-transform duration-300",
                          hoveredId === project.id ? "translate-x-1" : "translate-x-0",
                        )}
                      />
                    </div>
                  </div>

                  <div
                    className={cn(
                      "pointer-events-none absolute inset-0 rounded-2xl border-2 transition-colors duration-300",
                      hoveredId === project.id ? "border-slate-200/90" : "border-slate-200/0",
                    )}
                  />
                </button>
              </div>
            );
          })}
        </div>
      </FadeInView>
    </div>
  );
}
