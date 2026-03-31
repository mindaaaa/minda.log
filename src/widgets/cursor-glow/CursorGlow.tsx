import { useEffect, useRef } from "react";

export default function CursorGlow() {
  const glowRef = useRef<HTMLDivElement>(null);
  const dotRef  = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let raf: number;
    const pos  = { x: -500, y: -500 };
    const ring = { x: -500, y: -500 };
    const glow = { x: -500, y: -500 };
    let hovering = false;
    let visible  = false;

    /* ── exact position (dot) ── */
    const onMove = (e: MouseEvent) => {
      pos.x = e.clientX;
      pos.y = e.clientY;

      if (dotRef.current) {
        dotRef.current.style.left = `${pos.x}px`;
        dotRef.current.style.top  = `${pos.y}px`;
      }

      if (!visible) {
        visible = true;
        if (dotRef.current)  dotRef.current.style.opacity  = "1";
        if (ringRef.current) ringRef.current.style.opacity = "1";
      }
    };

    /* ── RAF lerp (ring + glow) ── */
    const tick = () => {
      ring.x += (pos.x - ring.x) * 0.156;
      ring.y += (pos.y - ring.y) * 0.156;
      glow.x += (pos.x - glow.x) * 0.0715;
      glow.y += (pos.y - glow.y) * 0.0715;

      if (ringRef.current) {
        ringRef.current.style.left = `${ring.x}px`;
        ringRef.current.style.top  = `${ring.y}px`;
      }
      if (glowRef.current) {
        glowRef.current.style.left = `${glow.x}px`;
        glowRef.current.style.top  = `${glow.y}px`;
      }
      raf = requestAnimationFrame(tick);
    };

    /* ── hover detection ── */
    const setHover = (state: boolean) => {
      if (hovering === state) return;
      hovering = state;

      if (dotRef.current) {
        dotRef.current.style.transform = `translate(-50%, -50%) scale(${state ? 0 : 1})`;
      }
      if (ringRef.current) {
        ringRef.current.style.transform   = `translate(-50%, -50%) scale(${state ? 1.6 : 1})`;
        ringRef.current.style.borderColor = state
          ? "rgba(236,72,153,0.55)"
          : "rgba(255,255,255,0.16)";
        ringRef.current.style.background = state
          ? "rgba(236,72,153,0.07)"
          : "rgba(255,255,255,0.025)";
        ringRef.current.style.boxShadow = state
          ? "0 0 18px rgba(236,72,153,0.2), inset 0 0 8px rgba(236,72,153,0.08)"
          : "none";
      }
    };

    const onOver = (e: MouseEvent) => {
      const el = e.target as HTMLElement;
      setHover(
        !!el.closest(
          'a, button, [role="button"], input, select, textarea, label, [data-cursor]'
        )
      );
    };

    const onLeave = () => {
      visible = false;
      if (dotRef.current)  dotRef.current.style.opacity  = "0";
      if (ringRef.current) ringRef.current.style.opacity = "0";
    };

    const onEnter = () => {
      visible = true;
      if (dotRef.current)  dotRef.current.style.opacity  = "1";
      if (ringRef.current) ringRef.current.style.opacity = "1";
    };

    window.addEventListener("mousemove",   onMove);
    document.addEventListener("mouseover", onOver);
    document.addEventListener("mouseleave", onLeave);
    document.addEventListener("mouseenter", onEnter);
    raf = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("mousemove",   onMove);
      document.removeEventListener("mouseover", onOver);
      document.removeEventListener("mouseleave", onLeave);
      document.removeEventListener("mouseenter", onEnter);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <>
      {/* ── Dot — snaps to cursor exactly ── */}
      <div
        ref={dotRef}
        className="fixed pointer-events-none"
        style={{
          zIndex: 99997,
          width: 6,
          height: 6,
          borderRadius: "50%",
          background: "rgba(255,255,255,0.92)",
          transform: "translate(-50%, -50%)",
          transition: "transform 0.22s cubic-bezier(0.22,1,0.36,1)",
          opacity: 0,
          willChange: "left, top",
          mixBlendMode: "difference",
        }}
      />

      {/* ── Ring — lerped, glass style ── */}
      <div
        ref={ringRef}
        className="fixed pointer-events-none"
        style={{
          zIndex: 99996,
          width: 36,
          height: 36,
          borderRadius: "50%",
          border: "1px solid rgba(255,255,255,0.16)",
          background: "rgba(255,255,255,0.025)",
          backdropFilter: "blur(2px)",
          transform: "translate(-50%, -50%)",
          transition:
            "transform 0.32s cubic-bezier(0.22,1,0.36,1), border-color 0.28s ease, background 0.28s ease, box-shadow 0.28s ease",
          opacity: 0,
          willChange: "left, top",
        }}
      />

      {/* ── Ambient glow — dreamy trail ── */}
      <div
        ref={glowRef}
        className="fixed pointer-events-none"
        style={{
          zIndex: 20,
          width: 700,
          height: 700,
          transform: "translate(-50%, -50%)",
          background:
            "radial-gradient(circle at center, rgba(236,72,153,0.09) 0%, rgba(139,92,246,0.06) 38%, transparent 68%)",
          filter: "blur(36px)",
          willChange: "left, top",
        }}
      />
    </>
  );
}
