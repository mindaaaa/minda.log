import React from "react";

// ─── Types ──────────────────────────────────────────────────────────────────

export interface FlowNode {
  label: string;
  description?: string;
  highlight?: boolean;
}

export interface FlowBranch {
  trigger: string;
  command: string;
  highlight?: boolean;
}

// ─── Constants ──────────────────────────────────────────────────────────────

const CONTAINER_STYLE: React.CSSProperties = {
  background: "#fff",
  border: "1px solid var(--doc-line)",
  borderRadius: 10,
  padding: "22px 20px",
};

const TITLE_STYLE: React.CSSProperties = {
  fontSize: 11,
  letterSpacing: "0.08em",
  color: "var(--doc-ink-4)",
  marginBottom: 18,
};

const ARROW_STYLE: React.CSSProperties = {
  fontSize: 14,
  color: "var(--doc-ink-4)",
  lineHeight: 1,
};

const NODE_PADDING = "8px 12px";
const NODE_RADIUS = 8;
const NODE_MIN_WIDTH = 92;

// ─── CommandFlow — linear horizontal flow of command chips ──────────────────

export function CommandFlow({
  title,
  nodes,
}: {
  title?: string;
  nodes: FlowNode[];
}) {
  return (
    <div className="my-6" style={CONTAINER_STYLE}>
      {title && (
        <p className="font-mono uppercase" style={TITLE_STYLE}>
          {title}
        </p>
      )}
      <div className="flex flex-wrap items-center gap-x-2 gap-y-3">
        {nodes.map((node, i) => (
          <React.Fragment key={`${node.label}-${i}`}>
            <CommandNode node={node} />
            {i < nodes.length - 1 && (
              <span className="font-mono" style={ARROW_STYLE}>
                →
              </span>
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}

function CommandNode({ node }: { node: FlowNode }) {
  const background = node.highlight ? "var(--doc-accent-soft)" : "var(--doc-bg-soft)";
  const borderColor = node.highlight ? "var(--doc-accent)" : "var(--doc-line)";
  const labelColor = node.highlight ? "var(--doc-accent-ink)" : "var(--doc-ink)";

  return (
    <div
      style={{
        background,
        border: `1px solid ${borderColor}`,
        borderRadius: NODE_RADIUS,
        padding: NODE_PADDING,
        minWidth: NODE_MIN_WIDTH,
      }}
    >
      <div
        className="font-mono"
        style={{ fontSize: 13, fontWeight: 600, color: labelColor, lineHeight: 1.3 }}
      >
        {node.label}
      </div>
      {node.description && (
        <div
          style={{
            fontSize: 11,
            color: "var(--doc-ink-3)",
            marginTop: 3,
            lineHeight: 1.4,
          }}
        >
          {node.description}
        </div>
      )}
    </div>
  );
}

// ─── CommandTriggers — trigger → command branch list ────────────────────────

export function CommandTriggers({
  title,
  branches,
}: {
  title?: string;
  branches: FlowBranch[];
}) {
  return (
    <div className="my-6" style={CONTAINER_STYLE}>
      {title && (
        <p className="font-mono uppercase" style={TITLE_STYLE}>
          {title}
        </p>
      )}
      <div className="flex flex-col gap-2">
        {branches.map((branch) => (
          <BranchRow key={branch.trigger} branch={branch} />
        ))}
      </div>
    </div>
  );
}

function BranchRow({ branch }: { branch: FlowBranch }) {
  const commandBg = branch.highlight ? "var(--doc-accent-soft)" : "var(--doc-bg-soft)";
  const commandBorder = branch.highlight ? "var(--doc-accent)" : "var(--doc-line)";
  const commandColor = branch.highlight ? "var(--doc-accent-ink)" : "var(--doc-ink)";

  return (
    <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
      <div
        style={{
          background: "#fff",
          border: "1px dashed var(--doc-line)",
          borderRadius: NODE_RADIUS,
          padding: NODE_PADDING,
          fontSize: 13,
          color: "var(--doc-ink-2)",
          minWidth: 170,
          lineHeight: 1.3,
        }}
      >
        {branch.trigger}
      </div>
      <span className="font-mono shrink-0" style={ARROW_STYLE}>
        →
      </span>
      <div
        className="font-mono"
        style={{
          background: commandBg,
          border: `1px solid ${commandBorder}`,
          borderRadius: NODE_RADIUS,
          padding: NODE_PADDING,
          fontSize: 13,
          fontWeight: 600,
          color: commandColor,
          lineHeight: 1.3,
        }}
      >
        {branch.command}
      </div>
    </div>
  );
}
