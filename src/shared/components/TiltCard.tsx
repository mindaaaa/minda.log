import { useRef, useState, useCallback } from "react";

interface TiltCardProps {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  maxTilt?: number;
  liftPx?: number;
  /* forward as div or anchor */
  as?: "div" | "a";
  href?: string;
  target?: string;
  rel?: string;
  onClick?: (e: React.MouseEvent) => void;
}

export default function TiltCard({
  children,
  className = "",
  style,
  maxTilt = 7,
  liftPx = 8,
  as = "div",
  href,
  target,
  rel,
  onClick,
}: TiltCardProps) {
  const ref = useRef<HTMLElement>(null);
  const [transform, setTransform] = useState("perspective(900px) rotateX(0deg) rotateY(0deg) translateY(0px)");
  const [shine, setShine] = useState<{ x: number; y: number } | null>(null);
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLElement>) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const nx = (e.clientX - cx) / (rect.width / 2);   // -1 … +1
    const ny = (e.clientY - cy) / (rect.height / 2);  // -1 … +1
    const rotX = -ny * maxTilt;
    const rotY =  nx * maxTilt;
    setTransform(
      `perspective(900px) rotateX(${rotX}deg) rotateY(${rotY}deg) translateY(-${liftPx}px)`
    );
    // shine position as percentage inside card
    const sx = ((e.clientX - rect.left) / rect.width) * 100;
    const sy = ((e.clientY - rect.top) / rect.height) * 100;
    setShine({ x: sx, y: sy });
  }, [maxTilt, liftPx]);

  const handleMouseEnter = useCallback(() => setIsHovered(true), []);

  const handleMouseLeave = useCallback(() => {
    setIsHovered(false);
    setShine(null);
    setTransform("perspective(900px) rotateX(0deg) rotateY(0deg) translateY(0px)");
  }, []);

  const sharedProps = {
    ref: ref as React.RefObject<HTMLDivElement>,
    className,
    style: {
      ...style,
      transform,
      transition: isHovered
        ? "transform 0.12s ease-out"
        : "transform 0.55s cubic-bezier(0.22,1,0.36,1)",
      transformStyle: "preserve-3d" as const,
      willChange: "transform",
    },
    onMouseMove: handleMouseMove,
    onMouseEnter: handleMouseEnter,
    onMouseLeave: handleMouseLeave,
    onClick,
  };

  const inner = (
    <>
      {/* Moving light reflection */}
      <div
        className="absolute inset-0 rounded-[inherit] pointer-events-none z-10 transition-opacity duration-300"
        style={{
          opacity: shine ? 1 : 0,
          background: shine
            ? `radial-gradient(circle at ${shine.x}% ${shine.y}%, rgba(255,255,255,0.13) 0%, transparent 55%)`
            : "none",
        }}
      />
      {/* Subtle top-edge sheen always present */}
      <div className="absolute top-0 left-0 right-0 h-px rounded-t-[inherit] pointer-events-none bg-gradient-to-r from-transparent via-white/20 to-transparent" />
      {children}
    </>
  );

  if (as === "a") {
    return (
      <a
        {...(sharedProps as React.AnchorHTMLAttributes<HTMLAnchorElement>)}
        ref={ref as React.RefObject<HTMLAnchorElement>}
        href={href}
        target={target}
        rel={rel}
      >
        {inner}
      </a>
    );
  }

  return (
    <div {...(sharedProps as React.HTMLAttributes<HTMLDivElement>)}>
      {inner}
    </div>
  );
}
