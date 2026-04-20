import { useEffect, useRef, useState } from "react";

export const DOT_SIZE = 5;
export const RING_SIZE = 28;
export const RING_SIZE_HOVER = 40;
export const PILL_HEIGHT = 28;
export const PILL_PADDING_X = 16;
export const PILL_WIDTH_FALLBACK = 68;
export const LABEL_OFFSET_Y = 22;
export const RING_COLOR_IDLE = "rgba(26, 18, 41, 0.25)";
export const RING_COLOR_HOVER = "rgba(123, 97, 255, 0.5)";
export const PILL_BG = "rgba(26, 18, 41, 0.92)";
export const DOT_COLOR = "#1A1229";
export const LABEL_COLOR = "#4A36B0";
export const LABEL_COLOR_PILL = "#FFFFFF";
export const RING_BORDER_IDLE = "1px";
export const RING_BORDER_HOVER = "1.5px";

const LERP_FACTOR = 0.22;
const LABEL_DEFAULT = "VIEW";
const OFFSCREEN_INIT = -9999;

type CursorVariant = "default" | "pill";

interface CursorState {
  hover: boolean;
  variant: CursorVariant;
  label: string;
}

function resolveCursorState(target: EventTarget | null): CursorState {
  if (!(target instanceof Element)) {
    return { hover: false, variant: "default", label: "" };
  }
  const el = target.closest<HTMLElement>(
    '[data-cursor="pill"], [data-cursor-label], a, button, [role="button"]'
  );
  if (!el) {
    return { hover: false, variant: "default", label: "" };
  }
  const variant = el.getAttribute("data-cursor") === "pill" ? "pill" : "default";
  const attr = el.getAttribute("data-cursor-label");
  const label = attr === null ? LABEL_DEFAULT : attr;
  return { hover: true, variant, label };
}

function isTextInput(el: EventTarget | null): boolean {
  return el instanceof HTMLInputElement || el instanceof HTMLTextAreaElement;
}

export function useCustomCursor() {
  const dotRef = useRef<HTMLDivElement | null>(null);
  const ringRef = useRef<HTMLDivElement | null>(null);
  const labelRef = useRef<HTMLSpanElement | null>(null);
  const [isEnabled, setIsEnabled] = useState<boolean>(() => {
    if (typeof window === "undefined") {
      return false;
    }
    return window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  });

  useEffect(() => {
    const mql = window.matchMedia("(hover: hover) and (pointer: fine)");
    const onChange = () => setIsEnabled(mql.matches);
    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    if (!isEnabled) {
      return;
    }
    const dot = dotRef.current;
    const ring = ringRef.current;
    const label = labelRef.current;
    if (!dot || !ring || !label) {
      return;
    }

    const mouse = { x: OFFSCREEN_INIT, y: OFFSCREEN_INIT };
    const ringPos = { x: OFFSCREEN_INIT, y: OFFSCREEN_INIT };
    const state: CursorState = { hover: false, variant: "default", label: "" };
    let visible = false;
    let suppressed = false;
    let rafId = 0;

    const refreshOpacity = () => {
      const shown = visible && !suppressed;
      dot.style.opacity = shown && !state.hover ? "1" : "0";
      ring.style.opacity = shown ? "1" : "0";
      label.style.opacity = shown && state.hover && state.label ? "1" : "0";
    };

    const applyHoverStyle = () => {
      if (!state.hover) {
        dot.style.width = `${DOT_SIZE}px`;
        dot.style.height = `${DOT_SIZE}px`;
        ring.style.width = `${RING_SIZE}px`;
        ring.style.height = `${RING_SIZE}px`;
        ring.style.borderRadius = "50%";
        ring.style.borderColor = RING_COLOR_IDLE;
        ring.style.borderWidth = RING_BORDER_IDLE;
        ring.style.background = "transparent";
        label.textContent = "";
      } else if (state.variant === "pill") {
        dot.style.width = "0px";
        dot.style.height = "0px";
        label.textContent = state.label;
        label.style.color = LABEL_COLOR_PILL;
        const measured = state.label ? label.offsetWidth : 0;
        const width = Math.max(measured, PILL_WIDTH_FALLBACK);
        ring.style.width = `${width}px`;
        ring.style.height = `${PILL_HEIGHT}px`;
        ring.style.borderRadius = "999px";
        ring.style.borderColor = RING_COLOR_HOVER;
        ring.style.borderWidth = RING_BORDER_HOVER;
        ring.style.background = PILL_BG;
      } else {
        dot.style.width = "0px";
        dot.style.height = "0px";
        ring.style.width = `${RING_SIZE_HOVER}px`;
        ring.style.height = `${RING_SIZE_HOVER}px`;
        ring.style.borderRadius = "50%";
        ring.style.borderColor = RING_COLOR_HOVER;
        ring.style.borderWidth = RING_BORDER_HOVER;
        ring.style.background = "transparent";
        label.textContent = state.label;
        label.style.color = LABEL_COLOR;
      }
      refreshOpacity();
    };

    const onMouseMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      if (!visible) {
        visible = true;
        ringPos.x = e.clientX;
        ringPos.y = e.clientY;
        refreshOpacity();
      }
    };

    const onMouseOver = (e: MouseEvent) => {
      const next = resolveCursorState(e.target);
      if (
        next.hover === state.hover &&
        next.variant === state.variant &&
        next.label === state.label
      ) {
        return;
      }
      state.hover = next.hover;
      state.variant = next.variant;
      state.label = next.label;
      applyHoverStyle();
    };

    const onDocMouseLeave = () => {
      visible = false;
      refreshOpacity();
    };

    const onDocMouseEnter = () => {
      visible = true;
      refreshOpacity();
    };

    const onFocusIn = (e: FocusEvent) => {
      if (!isTextInput(e.target)) {
        return;
      }
      suppressed = true;
      document.documentElement.dataset.cursorMode = "native";
      refreshOpacity();
    };

    const onFocusOut = (e: FocusEvent) => {
      if (!isTextInput(e.target)) {
        return;
      }
      suppressed = false;
      delete document.documentElement.dataset.cursorMode;
      refreshOpacity();
    };

    const tick = () => {
      ringPos.x += (mouse.x - ringPos.x) * LERP_FACTOR;
      ringPos.y += (mouse.y - ringPos.y) * LERP_FACTOR;
      dot.style.transform = `translate(${mouse.x}px, ${mouse.y}px) translate(-50%, -50%)`;
      ring.style.transform = `translate(${ringPos.x}px, ${ringPos.y}px) translate(-50%, -50%)`;
      if (state.hover && state.variant === "pill") {
        label.style.transform = `translate(${ringPos.x}px, ${ringPos.y}px) translate(-50%, -50%)`;
      } else {
        label.style.transform = `translate(${mouse.x}px, ${mouse.y + LABEL_OFFSET_Y}px) translate(-50%, -50%)`;
      }
      rafId = requestAnimationFrame(tick);
    };

    applyHoverStyle();

    window.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseover", onMouseOver);
    document.documentElement.addEventListener("mouseleave", onDocMouseLeave);
    document.documentElement.addEventListener("mouseenter", onDocMouseEnter);
    document.addEventListener("focusin", onFocusIn);
    document.addEventListener("focusout", onFocusOut);
    rafId = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseover", onMouseOver);
      document.documentElement.removeEventListener("mouseleave", onDocMouseLeave);
      document.documentElement.removeEventListener("mouseenter", onDocMouseEnter);
      document.removeEventListener("focusin", onFocusIn);
      document.removeEventListener("focusout", onFocusOut);
      cancelAnimationFrame(rafId);
      delete document.documentElement.dataset.cursorMode;
    };
  }, [isEnabled]);

  return { dotRef, ringRef, labelRef, isEnabled };
}
