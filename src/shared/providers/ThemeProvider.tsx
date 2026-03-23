import { createContext, useContext, useState, useEffect } from 'react';
import { themes, type Theme, type ThemeId } from '@/shared/lib/themes';

interface ThemeContextValue {
  theme: Theme;
  themeId: ThemeId;
  setTheme: (id: ThemeId) => void;
}

const ThemeContext = createContext<ThemeContextValue>({
  theme: themes.aurora,
  themeId: 'aurora',
  setTheme: () => {},
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [themeId, setThemeId] = useState<ThemeId>(() => {
    return (localStorage.getItem('spot-theme') as ThemeId) ?? 'aurora';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', themeId);
    localStorage.setItem('spot-theme', themeId);
  }, [themeId]);

  return (
    <ThemeContext.Provider
      value={{ theme: themes[themeId], themeId, setTheme: setThemeId }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
