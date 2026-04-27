import React from "react";

const ROOT_PATH_FONT_SIZE = 16;
const CHILD_PATH_FONT_SIZE = 14;
const TARGET_CHIP_ALPHA = "1f"; // 약 12% opacity

export interface FileTreeItem {
  path: string;
  color: string;
  target: string;
  description: React.ReactNode;
}

interface FileTreeProps {
  rootItem?: FileTreeItem;
  items: FileTreeItem[];
}

function FileTreeRow({
  item,
  isRoot,
  isLast,
}: {
  item: FileTreeItem;
  isRoot: boolean;
  isLast: boolean;
}) {
  return (
    <div style={{ marginBottom: isLast ? 0 : 18 }}>
      <div
        className="flex items-baseline"
        style={{ gap: isRoot ? 12 : 8, marginBottom: 6, flexWrap: "wrap" }}
      >
        {!isRoot && (
          <span
            aria-hidden
            style={{
              fontFamily: "var(--app-font-mono)",
              fontSize: 14,
              color: "var(--doc-ink-4)",
            }}
          >
            └
          </span>
        )}
        <code
          style={{
            fontFamily: "var(--app-font-mono)",
            fontSize: isRoot ? ROOT_PATH_FONT_SIZE : CHILD_PATH_FONT_SIZE,
            fontWeight: 700,
            color: item.color,
          }}
        >
          {item.path}
        </code>
        <span
          className="font-mono"
          style={{
            fontSize: 11,
            padding: "2px 9px",
            borderRadius: 5,
            background: `${item.color}${TARGET_CHIP_ALPHA}`,
            color: item.color,
          }}
        >
          {item.target}
        </span>
      </div>
      <p
        style={{
          margin: `0 0 0 ${isRoot ? 14 : 22}px`,
          fontSize: 13.5,
          lineHeight: 1.6,
          color: "var(--doc-ink-2)",
        }}
      >
        {item.description}
      </p>
    </div>
  );
}

export function FileTree({ rootItem, items }: FileTreeProps) {
  return (
    <div
      style={{
        background: "#fff",
        border: "1px solid var(--doc-line)",
        borderRadius: 14,
        padding: "24px clamp(20px, 3vw, 28px)",
        margin: "16px 0 28px",
      }}
    >
      {rootItem && (
        <>
          <FileTreeRow item={rootItem} isRoot isLast={false} />
          <hr
            style={{
              border: 0,
              borderTop: "1px dashed var(--doc-line)",
              margin: "20px 0",
            }}
          />
        </>
      )}
      {items.map((item, i) => (
        <FileTreeRow
          key={item.path}
          item={item}
          isRoot={false}
          isLast={i === items.length - 1}
        />
      ))}
    </div>
  );
}
