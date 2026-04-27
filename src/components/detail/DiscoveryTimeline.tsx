import React from "react";

const TIMELINE_DOT_SIZE = 12;
const TIMELINE_LINE_WIDTH = 2;
const TIMELINE_DOT_LEFT = 4;
const TIMELINE_LINE_LEFT = 9;
const TIMELINE_STEP_PADDING_LEFT = 30;
const TIMELINE_STEP_PADDING_BOTTOM = 18;

const TIMELINE_TITLE_SIZE = 14.5;
const TIMELINE_META_SIZE = 12.5;
const TIMELINE_NUM_SIZE = 10;

export interface DiscoveryStepMeta {
  key: string;
  body: React.ReactNode;
}

export interface DiscoveryStep {
  num: string;
  eyebrow?: string;
  title: string;
  metas: DiscoveryStepMeta[];
  isFinal?: boolean;
}

interface DiscoveryTimelineProps {
  title: string;
  steps: DiscoveryStep[];
}

export function DiscoveryTimeline({ title, steps }: DiscoveryTimelineProps) {
  return (
    <div style={{ padding: "8px 0 8px 4px", margin: "20px 0 24px" }}>
      <p
        className="font-mono"
        style={{
          fontSize: 11,
          fontWeight: 700,
          letterSpacing: "0.1em",
          textTransform: "uppercase",
          color: "var(--doc-accent-ink)",
          margin: "0 0 14px",
        }}
      >
        {title}
      </p>
      <ol style={{ listStyle: "none", padding: 0, margin: 0, position: "relative" }}>
        <span
          aria-hidden
          style={{
            position: "absolute",
            left: TIMELINE_LINE_LEFT,
            top: 8,
            bottom: 8,
            width: TIMELINE_LINE_WIDTH,
            background: "linear-gradient(180deg, rgba(123, 97, 255, 0.4) 0%, rgba(123, 97, 255, 0.2) 100%)",
          }}
        />
        {steps.map((step, i) => {
          const isLast = i === steps.length - 1;
          return (
            <li
              key={step.num}
              style={{
                position: "relative",
                paddingLeft: TIMELINE_STEP_PADDING_LEFT,
                paddingBottom: isLast ? 0 : TIMELINE_STEP_PADDING_BOTTOM,
              }}
            >
              <span
                aria-hidden
                style={{
                  position: "absolute",
                  left: TIMELINE_DOT_LEFT,
                  top: 6,
                  width: TIMELINE_DOT_SIZE,
                  height: TIMELINE_DOT_SIZE,
                  borderRadius: "50%",
                  background: step.isFinal ? "var(--doc-accent)" : "#fff",
                  border: "2px solid var(--doc-accent)",
                  boxSizing: "border-box",
                }}
              />
              <p
                className="font-mono"
                style={{
                  fontSize: TIMELINE_NUM_SIZE,
                  fontWeight: 700,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  color: "var(--doc-accent-ink)",
                  margin: "0 0 2px",
                }}
              >
                {step.num}
                {step.eyebrow ? ` · ${step.eyebrow}` : ""}
              </p>
              <h4
                style={{
                  fontSize: TIMELINE_TITLE_SIZE,
                  fontWeight: 600,
                  lineHeight: 1.4,
                  color: "var(--doc-ink)",
                  margin: "0 0 6px",
                }}
              >
                {step.title}
              </h4>
              {step.metas.map((meta, j) => (
                <p
                  key={j}
                  style={{
                    fontSize: TIMELINE_META_SIZE,
                    lineHeight: 1.6,
                    color: "var(--doc-ink-2)",
                    margin: "0 0 4px",
                  }}
                >
                  <span
                    className="font-mono"
                    style={{
                      fontSize: 10.5,
                      letterSpacing: "0.06em",
                      textTransform: "uppercase",
                      color: "var(--doc-ink-4)",
                      marginRight: 6,
                    }}
                  >
                    {meta.key}
                  </span>
                  {meta.body}
                </p>
              ))}
            </li>
          );
        })}
      </ol>
    </div>
  );
}
