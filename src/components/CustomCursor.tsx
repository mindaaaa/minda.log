import {
  DOT_COLOR,
  DOT_SIZE,
  LABEL_COLOR,
  PILL_HEIGHT,
  PILL_PADDING_X,
  RING_BORDER_IDLE,
  RING_COLOR_IDLE,
  RING_SIZE,
  useCustomCursor,
} from "@/hooks/useCustomCursor";

const CURSOR_Z = 9999;
const RING_Z = 9998;

const RING_TRANSITION = [
  "width 0.28s cubic-bezier(0.2, 0.8, 0.2, 1)",
  "height 0.28s cubic-bezier(0.2, 0.8, 0.2, 1)",
  "border-radius 0.28s cubic-bezier(0.2, 0.8, 0.2, 1)",
  "border-color 0.25s",
  "border-width 0.25s",
  "background 0.2s",
  "opacity 0.2s",
].join(", ");

const DOT_TRANSITION = [
  "width 0.25s",
  "height 0.25s",
  "opacity 0.2s",
].join(", ");

const LABEL_TRANSITION = [
  "opacity 0.2s",
  "color 0.2s",
].join(", ");

export default function CustomCursor() {
  const { dotRef, ringRef, labelRef, isEnabled } = useCustomCursor();

  if (!isEnabled) {
    return null;
  }

  return (
    <>
      <div
        ref={dotRef}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: DOT_SIZE,
          height: DOT_SIZE,
          borderRadius: "50%",
          background: DOT_COLOR,
          pointerEvents: "none",
          zIndex: CURSOR_Z,
          opacity: 0,
          willChange: "transform",
          transition: DOT_TRANSITION,
        }}
      />
      <div
        ref={ringRef}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: RING_SIZE,
          height: RING_SIZE,
          borderRadius: "50%",
          border: `${RING_BORDER_IDLE} solid ${RING_COLOR_IDLE}`,
          background: "transparent",
          pointerEvents: "none",
          zIndex: RING_Z,
          opacity: 0,
          willChange: "transform",
          boxSizing: "border-box",
          transition: RING_TRANSITION,
        }}
      />
      <span
        ref={labelRef}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          display: "inline-block",
          fontFamily: "'JetBrains Mono', ui-monospace, SFMono-Regular, Menlo, monospace",
          fontSize: 10,
          fontWeight: 500,
          letterSpacing: "0.15em",
          textTransform: "uppercase",
          color: LABEL_COLOR,
          padding: `0 ${PILL_PADDING_X}px`,
          height: PILL_HEIGHT,
          lineHeight: `${PILL_HEIGHT}px`,
          whiteSpace: "nowrap",
          pointerEvents: "none",
          userSelect: "none",
          zIndex: CURSOR_Z,
          opacity: 0,
          willChange: "transform",
          transition: LABEL_TRANSITION,
        }}
      />
    </>
  );
}
