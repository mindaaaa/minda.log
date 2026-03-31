import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { Minus, Maximize2, X } from "lucide-react";

interface WindowChromeProps {
  title: string;
  isMinimized: boolean;
  onMinimize: () => void;
  onExpand: () => void;
  onShiftMinimize?: () => void;
  onShiftExpand?: () => void;
}

interface TooltipState {
  visible: boolean;
  x: number;
  y: number;
}

function useButtonTooltip(color: "amber" | "green") {
  const ref = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState(false);
  const [tooltip, setTooltip] = useState<TooltipState>({ visible: false, x: 0, y: 0 });
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const onEnter = () => {
    setHovered(true);
    if (ref.current) {
      const rect = ref.current.getBoundingClientRect();
      setTooltip((t) => ({ ...t, x: rect.left + rect.width / 2, y: rect.bottom + 8 }));
    }
    timerRef.current = setTimeout(() => setTooltip((t) => ({ ...t, visible: true })), 280);
  };

  const onLeave = () => {
    setHovered(false);
    setTooltip((t) => ({ ...t, visible: false }));
    if (timerRef.current) clearTimeout(timerRef.current);
  };

  useEffect(() => () => { if (timerRef.current) clearTimeout(timerRef.current); }, []);

  useEffect(() => {
    if (!hovered) return;
    const onMove = (e: MouseEvent) => {
      if (!ref.current) return;
      const rect = ref.current.getBoundingClientRect();
      const buf = 20;
      if (e.clientX < rect.left - buf || e.clientX > rect.right + buf || e.clientY < rect.top - buf || e.clientY > rect.bottom + buf) {
        setHovered(false);
        setTooltip((t) => ({ ...t, visible: false }));
        if (timerRef.current) clearTimeout(timerRef.current);
      }
    };
    document.addEventListener("mousemove", onMove);
    return () => document.removeEventListener("mousemove", onMove);
  }, [hovered]);

  const borderColor = color === "amber" ? "rgba(251,191,36,0.18)" : "rgba(52,211,153,0.18)";
  const textColor = color === "amber" ? "rgba(253,230,138,0.55)" : "rgba(110,231,183,0.55)";
  const arrowColor = color === "amber" ? "rgba(251,191,36,0.2)" : "rgba(52,211,153,0.2)";

  const tooltipEl = createPortal(
    <div
      className="pointer-events-none fixed whitespace-nowrap"
      style={{
        left: tooltip.x,
        top: tooltip.y,
        transform: `translateX(-50%) translateY(${tooltip.visible ? "0px" : "-5px"})`,
        opacity: tooltip.visible ? 1 : 0,
        transition: "opacity 0.25s ease, transform 0.25s ease",
        zIndex: 99999,
      }}
    >
      <div
        className="absolute left-1/2 -translate-x-1/2 -top-[5px]"
        style={{
          width: 0, height: 0,
          borderLeft: "4px solid transparent",
          borderRight: "4px solid transparent",
          borderBottom: `5px solid ${arrowColor}`,
        }}
      />
      <div
        className="px-2.5 py-1.5 rounded-lg text-[10px] tracking-[0.12em] font-medium"
        style={{
          background: "rgba(18,14,8,0.85)",
          border: `1px solid ${borderColor}`,
          backdropFilter: "blur(10px)",
          boxShadow: "0 4px 20px rgba(0,0,0,0.5)",
          color: textColor,
        }}
      >
        try shift + click
      </div>
    </div>,
    document.body
  );

  return { ref, hovered, onEnter, onLeave, tooltipEl };
}

export default function WindowChrome({
  title,
  isMinimized,
  onMinimize,
  onExpand,
  onShiftMinimize,
  onShiftExpand,
}: WindowChromeProps) {
  const [groupHovered, setGroupHovered] = useState(false);
  const [redActive, setRedActive] = useState(false);
  const [redHovered, setRedHovered] = useState(false);
  const shiftHeld = useRef(false);

  const yellow = useButtonTooltip("amber");
  const green = useButtonTooltip("green");

  // Track Shift key state globally — more reliable than e.shiftKey in some environments
  useEffect(() => {
    const onDown = (e: KeyboardEvent) => { if (e.key === "Shift") shiftHeld.current = true; };
    const onUp = (e: KeyboardEvent) => { if (e.key === "Shift") shiftHeld.current = false; };
    window.addEventListener("keydown", onDown);
    window.addEventListener("keyup", onUp);
    return () => {
      window.removeEventListener("keydown", onDown);
      window.removeEventListener("keyup", onUp);
    };
  }, []);

  const handleRed = () => {
    setRedActive(true);
    setTimeout(() => setRedActive(false), 500);
  };

  const handleYellow = (e: React.MouseEvent) => {
    if ((e.shiftKey || shiftHeld.current) && onShiftMinimize) onShiftMinimize();
    else isMinimized ? onExpand() : onMinimize();
  };

  const handleGreen = (e: React.MouseEvent) => {
    if ((e.shiftKey || shiftHeld.current) && onShiftExpand) onShiftExpand();
    else onExpand();
  };

  return (
    <div
      className="flex items-center gap-3 px-4 py-3 flex-shrink-0 select-none border-b border-white/[0.08]"
      style={{ background: "rgba(255,255,255,0.04)" }}
      onMouseEnter={() => setGroupHovered(true)}
      onMouseLeave={() => setGroupHovered(false)}
    >
      <div className="flex items-center gap-[7px]">

        {/* ── Red ── decorative bounce, warmer glow on hover */}
        <button
          onClick={handleRed}
          onMouseEnter={() => setRedHovered(true)}
          onMouseLeave={() => setRedHovered(false)}
          className={`relative w-[13px] h-[13px] rounded-full flex items-center justify-center transition-all duration-300 ${
            redActive ? "scale-125" : "hover:scale-110"
          }`}
          style={{
            background: redHovered ? "rgba(255,80,72,1)" : "rgba(255,95,87,0.9)",
            boxShadow: redHovered
              ? "0 0 10px rgba(255,80,72,0.65), 0 0 22px rgba(255,80,72,0.2)"
              : "0 0 6px rgba(255,95,87,0.5)",
            transition: "box-shadow 0.3s ease, background 0.3s ease",
          }}
        >
          {groupHovered && (
            <X className="absolute w-[8px] h-[8px] text-red-900/70 pointer-events-none" strokeWidth={3} />
          )}
        </button>

        {/* ── Yellow — Shift+click → Behind the Scenes ── */}
        <div ref={yellow.ref} onMouseEnter={yellow.onEnter} onMouseLeave={yellow.onLeave}>
          <button
            onClick={handleYellow}
            className="relative w-[13px] h-[13px] rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110"
            style={{
              background: yellow.hovered ? "rgba(255,210,80,1)" : "rgba(255,189,46,0.9)",
              boxShadow: yellow.hovered
                ? "0 0 10px rgba(255,210,80,0.7), 0 0 22px rgba(255,189,46,0.25)"
                : "0 0 6px rgba(255,189,46,0.4), 0 0 14px rgba(255,189,46,0.08)",
            }}
          >
            {groupHovered && (
              <Minus className="absolute w-[9px] h-[9px] text-yellow-900/70 pointer-events-none" strokeWidth={3} />
            )}
          </button>
        </div>

        {/* ── Green — Shift+click → Dev Philosophy ── */}
        <div ref={green.ref} onMouseEnter={green.onEnter} onMouseLeave={green.onLeave}>
          <button
            onClick={handleGreen}
            className="relative w-[13px] h-[13px] rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110"
            style={{
              background: green.hovered ? "rgba(34,210,90,1)" : "rgba(40,200,64,0.9)",
              boxShadow: green.hovered
                ? "0 0 10px rgba(34,210,90,0.65), 0 0 22px rgba(52,211,153,0.2)"
                : "0 0 6px rgba(40,200,64,0.4), 0 0 14px rgba(40,200,64,0.08)",
            }}
          >
            {groupHovered && (
              <Maximize2 className="absolute w-[7px] h-[7px] text-green-900/70 pointer-events-none" strokeWidth={3} />
            )}
          </button>
        </div>
      </div>

      {/* Centered title */}
      <div className="flex-1 text-center">
        <span className="text-[11px] font-medium text-white/35 tracking-[0.14em] uppercase">
          {title}
        </span>
      </div>

      <div className="w-[52px]" />

      {yellow.tooltipEl}
      {green.tooltipEl}
    </div>
  );
}
