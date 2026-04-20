import { createContext, useContext } from "react";

type HeroVideoLayout = "inline-landscape" | "inline-portrait" | "tabs";

interface DetailContextValue {
  accent: string;
  heroLayout?: HeroVideoLayout;
}

const DetailContext = createContext<DetailContextValue>({ accent: "#9B8EC4" });

export function DetailProvider({
  accent,
  heroLayout,
  children,
}: {
  accent: string;
  heroLayout?: HeroVideoLayout;
  children: React.ReactNode;
}) {
  return (
    <DetailContext.Provider value={{ accent, heroLayout }}>
      {children}
    </DetailContext.Provider>
  );
}

export function useDetailAccent() {
  return useContext(DetailContext).accent;
}

export function useHeroLayout() {
  return useContext(DetailContext).heroLayout;
}

export type { HeroVideoLayout };
