export type ThemeId = "aurora" | "midnight" | "verdant";

export interface Theme {
  id: ThemeId;
  name: string;
  dot: string;
  gradStart: string;
  gradMid: string;
  gradEnd: string;
  overlayColor: string;
  orb1: string;
  orb2: string;
  orb3: string;
  iconActive: string;
  sectionLabel: string;
  avatarFrom: string;
  avatarTo: string;
  avatarGlow: string;
  avatarInner: string;
}

export const themes: Record<ThemeId, Theme> = {
  aurora: {
    id: "aurora",
    name: "Aurora",
    dot: "#f472b6",
    gradStart: "#ff6b9d",
    gradMid: "#c084fc",
    gradEnd: "#60a5fa",
    overlayColor: "rgba(10, 5, 20, 0.60)",
    orb1: "rgba(236, 72, 153, 0.30)",
    orb2: "rgba(139, 92, 246, 0.30)",
    orb3: "rgba(59, 130, 246, 0.30)",
    iconActive: "#f472b6",
    sectionLabel: "#f472b6",
    avatarFrom: "#ec4899",
    avatarTo: "#7c3aed",
    avatarGlow: "rgba(236,72,153,0.35)",
    avatarInner: "#130b24",
  },
  midnight: {
    id: "midnight",
    name: "Midnight",
    dot: "#22d3ee",
    gradStart: "#0ea5e9",
    gradMid: "#22d3ee",
    gradEnd: "#818cf8",
    overlayColor: "rgba(0, 5, 18, 0.72)",
    orb1: "rgba(14, 165, 233, 0.22)",
    orb2: "rgba(99, 102, 241, 0.22)",
    orb3: "rgba(34, 211, 238, 0.18)",
    iconActive: "#22d3ee",
    sectionLabel: "#22d3ee",
    avatarFrom: "#0ea5e9",
    avatarTo: "#6366f1",
    avatarGlow: "rgba(34,211,238,0.30)",
    avatarInner: "#000d1a",
  },
  verdant: {
    id: "verdant",
    name: "Verdant",
    dot: "#10b981",
    gradStart: "#10b981",
    gradMid: "#34d399",
    gradEnd: "#d97706",
    overlayColor: "rgba(4, 12, 6, 0.65)",
    orb1: "rgba(16, 185, 129, 0.25)",
    orb2: "rgba(217, 119, 6, 0.20)",
    orb3: "rgba(52, 211, 153, 0.18)",
    iconActive: "#10b981",
    sectionLabel: "#10b981",
    avatarFrom: "#10b981",
    avatarTo: "#d97706",
    avatarGlow: "rgba(16,185,129,0.35)",
    avatarInner: "#051209",
  },
};

export const themeList: Theme[] = Object.values(themes);
