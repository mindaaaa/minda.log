import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import FadeInView from "@/shared/components/FadeInView";

interface EasterEggProps {
  onClose: () => void;
}

const containerVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.09, delayChildren: 0.1 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 18, filter: "blur(5px)" },
  show: {
    opacity: 1, y: 0, filter: "blur(0px)",
    transition: { duration: 0.75, ease: [0.22, 1, 0.36, 1] as const },
  },
};

const sections = [
  {
    icon: "🗺️",
    label: "My Process",
    accent: "rgba(251,191,36,0.3)",
    accentLine: "rgba(251,191,36,0.8)",
    content: `I start every project with one question: what should this feel like? Not what it should look like — how it should feel. Before any code, before Figma, I just sit with that. Then I build outward from the motion: what happens when you hover? When you scroll? When you arrive?

    This portfolio was no exception. The glassmorphism aesthetic emerged from wanting something that felt like looking through frosted glass at a dreamscape — present but soft. I built the parallax background before a single component existed, just to feel the space I was designing for.`,
  },
  {
    icon: "🎨",
    label: "Design Iterations",
    accent: "rgba(167,139,250,0.3)",
    accentLine: "rgba(167,139,250,0.8)",
    content: `This portfolio went through four full directions before landing here.

    v1 was dark cyberpunk — neon grids, angular cards, very "developer bravado." I built it in a weekend and hated it by Monday. v2 swung the other way: pure white, Swiss-grid minimalism, almost no color. It looked like every other dev portfolio. v3 was a brutalist experiment with heavy typography and raw layouts — interesting, but too aggressive for the content.

    v4 (this one) started with the background image. Everything built from that rose-desert light.`,
  },
  {
    icon: "🔩",
    label: "Challenges & Solutions",
    accent: "rgba(52,211,153,0.3)",
    accentLine: "rgba(52,211,153,0.8)",
    content: `The parallax background was re-written three times. The first version used CSS transforms on scroll events (janky). The second used a third-party library (too heavy). The third — what you're seeing — is a raw RAF loop with lerp interpolation. 5ms per frame, zero layout shifts.

    The timeline animation went through seven iterations. Getting the alternating left/right cards to reveal with directional motion without the center line "jumping" was fiddly. The solution was giving the FadeInView component an x-axis offset prop and keeping the center line absolutely positioned outside the animation tree.

    The glassmorphism depth was the quietest challenge. Too much blur looks like a bad Figma mockup. Too little and the depth disappears. The sweet spot is backdrop-blur-md with a border opacity of 0.08–0.12 depending on what's behind it.`,
  },
  {
    icon: "💭",
    label: "Personal Thoughts",
    accent: "rgba(251,113,133,0.3)",
    accentLine: "rgba(251,113,133,0.8)",
    content: `Shipping something this personal is uncomfortable. Every design decision is a small self-disclosure — what you think is beautiful, what you think matters, how you want to be perceived.

    I deleted probably three times as many components as you can see here. A sprawling "Skills" matrix. An animated code block that auto-typed. A contact form with too many fields. They all felt like overexplaining.

    What's here now feels honest. Not minimal for minimalism's sake — minimal because that's what was left after I stopped trying to impress and started trying to communicate.`,
  },
];

export default function EasterEgg({ onClose }: EasterEggProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.93, filter: "blur(14px)" }}
      animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
      exit={{ opacity: 0, scale: 0.96, filter: "blur(8px)" }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className="pb-20 max-w-3xl mx-auto"
    >
      {/* Back */}
      <div className="pt-6 mb-8">
        <button
          onClick={onClose}
          className="flex items-center gap-2 text-sm text-white/35 hover:text-white/70 transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform duration-200" />
          <span>Back</span>
        </button>
      </div>

      {/* Hero header */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="mb-12"
      >
        <motion.div variants={itemVariants} className="flex items-center gap-3 mb-4">
          <span className="text-xs text-amber-300/50 tracking-[0.3em] uppercase font-medium">
            ✦ classified
          </span>
          <div className="h-px flex-1 bg-amber-300/15" />
        </motion.div>

        <motion.h1
          variants={itemVariants}
          className="text-4xl md:text-5xl font-bold tracking-tight mb-3 leading-tight"
        >
          Behind the{" "}
          <span
            className="bg-clip-text text-transparent"
            style={{ backgroundImage: "linear-gradient(135deg, #fbbf24, #f59e0b, #fcd34d)" }}
          >
            Scenes.
          </span>
        </motion.h1>

        <motion.p variants={itemVariants} className="text-base text-white/50 leading-relaxed max-w-xl">
          You found it. This is the part I don't usually share — the process, the dead ends, the honest thoughts behind what you just scrolled through.
        </motion.p>
      </motion.div>

      {/* Content sections */}
      <div className="flex flex-col gap-5 mb-8">
        {sections.map((section, i) => (
          <FadeInView key={section.label} delay={0.08 * i} blur scale>
            <div
              className="glass rounded-2xl p-6 relative overflow-hidden"
              style={{ boxShadow: `0 4px 24px rgba(0,0,0,0.2)` }}
            >
              <div
                className="absolute top-0 left-0 w-1 h-full rounded-l-2xl"
                style={{ background: `linear-gradient(to bottom, ${section.accentLine}, transparent)` }}
              />
              <div
                className="absolute top-0 right-0 bottom-0 left-0 pointer-events-none rounded-2xl"
                style={{ background: `radial-gradient(ellipse at top left, ${section.accent}, transparent 55%)` }}
              />
              <div className="relative z-10">
                <div className="flex items-center gap-2.5 mb-4">
                  <span className="text-xl">{section.icon}</span>
                  <h2 className="text-sm font-semibold text-white/50 uppercase tracking-[0.18em]">
                    {section.label}
                  </h2>
                </div>
                <p className="text-sm md:text-base text-white/65 leading-relaxed whitespace-pre-line">
                  {section.content}
                </p>
              </div>
            </div>
          </FadeInView>
        ))}
      </div>

      {/* Secret footer */}
      <FadeInView delay={0.4}>
        <p className="text-center text-[10px] text-white/15 tracking-[0.2em] uppercase mt-10">
          you made it to the end — that's the kind of curiosity I like to work with.
        </p>
      </FadeInView>
    </motion.div>
  );
}
