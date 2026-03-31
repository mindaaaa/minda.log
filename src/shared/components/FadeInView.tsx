import { motion, useReducedMotion } from "framer-motion";

interface FadeInViewProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  y?: number;
  x?: number;
  blur?: boolean;
  scale?: boolean;
  duration?: number;
}

export default function FadeInView({
  children,
  className = "",
  delay = 0,
  y = 20,
  x = 0,
  blur = false,
  scale = false,
  duration = 0.75,
}: FadeInViewProps) {
  const prefersReducedMotion = useReducedMotion();
  const canAnimateBlur = blur && !prefersReducedMotion;

  return (
    <motion.div
      className={className}
      initial={{
        opacity: prefersReducedMotion ? 1 : 0,
        y: prefersReducedMotion ? 0 : y,
        x: prefersReducedMotion ? 0 : x,
        filter: canAnimateBlur ? "blur(5px)" : "none",
        scale: prefersReducedMotion ? 1 : scale ? 0.97 : 1,
      }}
      whileInView={{
        opacity: 1,
        y: 0,
        x: 0,
        filter: "none",
        scale: 1,
      }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{
        duration: prefersReducedMotion ? 0 : duration,
        delay,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      {children}
    </motion.div>
  );
}
