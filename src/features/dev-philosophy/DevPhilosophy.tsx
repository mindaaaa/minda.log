import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";

interface DevPhilosophyProps {
  onClose: () => void;
}

const statements = [
  { num: "01", text: "Code should read like prose — clear, intentional, with a point of view." },
  { num: "02", text: "Motion is a language. Use it to say something, not just to fill silence." },
  { num: "03", text: "Build for the person who notices the details. They exist, and they remember." },
  { num: "04", text: "The best interface is the one that gets out of the way at exactly the right moment." },
  { num: "05", text: "Never ship something you'd be embarrassed by at 3am." },
  { num: "06", text: "Simplicity is not the absence of complexity — it's complexity resolved." },
  { num: "07", text: "Write code for the next person, not the machine." },
  { num: "08", text: "A finished product that ships beats a perfect product that doesn't." },
];

const containerVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1, delayChildren: 0.15 } },
};

const itemVariants = {
  hidden: { opacity: 0, x: -16, filter: "blur(4px)" },
  show: {
    opacity: 1, x: 0, filter: "blur(0px)",
    transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] as const },
  },
};

export default function DevPhilosophy({ onClose }: DevPhilosophyProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.94, filter: "blur(12px)" }}
      animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
      exit={{ opacity: 0, scale: 0.97, filter: "blur(6px)" }}
      transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
      className="pb-24 max-w-2xl mx-auto"
    >
      {/* Back */}
      <div className="pt-6 mb-10">
        <button
          onClick={onClose}
          className="flex items-center gap-2 text-sm text-white/35 hover:text-white/70 transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform duration-200" />
          <span>Back</span>
        </button>
      </div>

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 14, filter: "blur(6px)" }}
        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="mb-14"
      >
        <p
          className="text-[10px] tracking-[0.35em] uppercase font-mono mb-5"
          style={{ color: "rgba(52,211,153,0.45)" }}
        >
          ✦ dev.philosophy
        </p>

        <h1 className="text-4xl md:text-5xl font-bold tracking-tight leading-tight mb-4">
          On{" "}
          <span
            className="bg-clip-text text-transparent"
            style={{
              backgroundImage: "linear-gradient(135deg, #34d399, #10b981, #6ee7b7)",
            }}
          >
            Building.
          </span>
        </h1>

        <p className="text-sm text-white/40 leading-relaxed max-w-md">
          A few things I try to hold onto. Not rules — just patterns I keep returning to.
        </p>

        <div className="mt-8 h-px" style={{ background: "linear-gradient(to right, rgba(52,211,153,0.2), transparent)" }} />
      </motion.div>

      {/* Statements */}
      <motion.ol
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="flex flex-col"
      >
        {statements.map((item) => (
          <motion.li
            key={item.num}
            variants={itemVariants}
            className="flex gap-6 py-6 border-b border-white/[0.06] group"
          >
            <span
              className="font-mono text-xs pt-[3px] shrink-0 w-7 tabular-nums transition-colors duration-300"
              style={{ color: "rgba(52,211,153,0.35)" }}
            >
              {item.num}
            </span>
            <p className="text-base md:text-lg text-white/60 leading-relaxed group-hover:text-white/80 transition-colors duration-300 font-light">
              {item.text}
            </p>
          </motion.li>
        ))}
      </motion.ol>

      {/* Footer */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.1, duration: 0.6 }}
        className="mt-12 flex items-center gap-4"
      >
        <div className="h-px flex-1" style={{ background: "rgba(52,211,153,0.1)" }} />
        <p className="text-[10px] tracking-[0.25em] uppercase font-mono" style={{ color: "rgba(52,211,153,0.25)" }}>
          still evolving
        </p>
        <div className="h-px flex-1" style={{ background: "rgba(52,211,153,0.1)" }} />
      </motion.div>
    </motion.div>
  );
}
