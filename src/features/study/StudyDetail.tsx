import { motion } from "framer-motion";
import { ArrowLeft, ArrowUpRight, BookOpen, Github, Globe, FolderOpen } from "lucide-react";
import type { StudyItem, StudyResource } from "./data/studyData";
import FadeInView from "@/shared/components/FadeInView";

interface StudyDetailProps {
  study: StudyItem;
  onBack: () => void;
}

function resourceIcon(type: StudyResource["type"]) {
  if (type === "repo") return <Github className="w-4 h-4" />;
  if (type === "project") return <FolderOpen className="w-4 h-4" />;
  if (type === "docs") return <BookOpen className="w-4 h-4" />;
  return <Globe className="w-4 h-4" />;
}

const resourceAccent: Record<StudyResource["type"], { gradient: string; glow: string }> = {
  docs:      { gradient: "from-blue-400 to-cyan-500",    glow: "rgba(34,211,238,0.3)" },
  repo:      { gradient: "from-violet-400 to-purple-500", glow: "rgba(139,92,246,0.3)" },
  reference: { gradient: "from-pink-400 to-rose-500",    glow: "rgba(244,114,182,0.3)" },
  project:   { gradient: "from-emerald-400 to-teal-500", glow: "rgba(16,185,129,0.3)" },
};

const sectionVariants = {
  hidden: { opacity: 0, y: 20 },
  show: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.1, duration: 0.5, ease: [0.22, 1, 0.36, 1] as const },
  }),
};

export default function StudyDetail({ study, onBack }: StudyDetailProps) {
  const Icon = study.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -16 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      className="pb-12"
    >
      {/* Back */}
      <div className="pt-2 mb-6">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-sm text-white/40 hover:text-white/80 transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform duration-200" />
          <span>뒤로</span>
        </button>
      </div>

      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-3">
          <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${study.accentGradient} flex items-center justify-center text-white shadow-lg`}>
            <Icon className="w-5 h-5" />
          </div>
          <span className="text-xs text-white/35 tracking-[0.2em] uppercase font-medium">{study.phase}</span>
          <span className="text-xs text-white/25">·</span>
          <span className="text-xs text-white/35 tracking-wider">{study.period}</span>
        </div>
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-1">{study.title}</h1>
        <p className="theme-section-label text-sm font-medium tracking-wide">{study.tagline}</p>
      </div>

      {/* Keywords */}
      <FadeInView delay={0.05} className="flex flex-wrap gap-2 mb-8">
        {study.keywords.map((kw) => (
          <span key={kw} className="glass px-3 py-1.5 rounded-full text-xs text-white/70 tracking-wide">
            {kw}
          </span>
        ))}
      </FadeInView>

      {/* Section 1 — 학습한 내용 */}
      <motion.div custom={1} variants={sectionVariants} initial="hidden" animate="show" className="mb-6">
        <div className="glass-strong rounded-2xl p-6 md:p-8 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1 h-full rounded-l-2xl"
            style={{ background: `linear-gradient(to bottom, ${study.glow.replace("0.35", "0.8")}, transparent)` }}
          />
          <div className="flex items-center gap-2 mb-4">
            <div className={`w-6 h-6 rounded-lg bg-gradient-to-br ${study.accentGradient} flex items-center justify-center text-[10px] font-bold text-white`}>1</div>
            <h2 className="text-base font-semibold text-white/90 tracking-wide">학습한 내용</h2>
          </div>
          <p className="text-white/70 leading-relaxed text-sm md:text-base">{study.whatILearned}</p>
        </div>
      </motion.div>

      {/* Section 2 — 적용 방법 */}
      <motion.div custom={2} variants={sectionVariants} initial="hidden" animate="show" className="mb-6">
        <div className="glass rounded-2xl p-6 md:p-8 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1 h-full rounded-l-2xl"
            style={{ background: `linear-gradient(to bottom, rgba(255,255,255,0.3), transparent)` }}
          />
          <div className="flex items-center gap-2 mb-4">
            <div className={`w-6 h-6 rounded-lg bg-gradient-to-br ${study.accentGradient} flex items-center justify-center text-[10px] font-bold text-white`}>2</div>
            <h2 className="text-base font-semibold text-white/90 tracking-wide">적용 방법</h2>
          </div>
          <p className="text-white/70 leading-relaxed text-sm md:text-base">{study.howIApplied}</p>
        </div>
      </motion.div>

      {/* Section 3 — 결과와 인사이트 */}
      <motion.div custom={3} variants={sectionVariants} initial="hidden" animate="show" className="mb-10">
        <div className="glass rounded-2xl p-6 md:p-8 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1 h-full rounded-l-2xl"
            style={{ background: `linear-gradient(to bottom, rgba(255,255,255,0.2), transparent)` }}
          />
          <div className="flex items-center gap-2 mb-4">
            <div className={`w-6 h-6 rounded-lg bg-gradient-to-br ${study.accentGradient} flex items-center justify-center text-[10px] font-bold text-white`}>3</div>
            <h2 className="text-base font-semibold text-white/90 tracking-wide">결과와 인사이트</h2>
          </div>
          <p className="text-white/70 leading-relaxed text-sm md:text-base">{study.results}</p>
        </div>
      </motion.div>

      {/* Resources */}
      <FadeInView delay={0.15}>
        <h2 className="text-base font-semibold text-white/60 uppercase tracking-[0.15em] mb-4">리소스</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {study.resources.map((res) => {
            const acc = resourceAccent[res.type];
            return (
              <a
                key={res.url}
                href={res.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group glass rounded-xl p-4 flex flex-col gap-3 hover:bg-white/10 transition-all duration-300 hover:-translate-y-0.5"
                style={{
                  boxShadow: "0 4px 20px rgba(0,0,0,0.2)",
                }}
                onMouseEnter={e => (e.currentTarget.style.boxShadow = `0 4px 24px ${acc.glow}`)}
                onMouseLeave={e => (e.currentTarget.style.boxShadow = "0 4px 20px rgba(0,0,0,0.2)")}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${acc.gradient} flex items-center justify-center text-white shrink-0`}>
                    {resourceIcon(res.type)}
                  </div>
                  <ArrowUpRight className="w-3.5 h-3.5 text-white/25 group-hover:text-white/60 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-200 shrink-0 mt-0.5" />
                </div>
                <div>
                  <p className="text-sm font-medium text-white/85 mb-1 leading-tight">{res.label}</p>
                  <p className="text-xs text-white/40 leading-relaxed">{res.description}</p>
                </div>
              </a>
            );
          })}
        </div>
      </FadeInView>
    </motion.div>
  );
}
