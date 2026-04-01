"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useSettings } from "./SettingsContext";

type EffectiveTheme = "light" | "dark";

interface ThemeContextType {
  effectiveTheme: EffectiveTheme;
}

const ThemeContext = createContext<ThemeContextType>({
  effectiveTheme: "dark",
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const { settings, loading } = useSettings();
  const [effectiveTheme, setEffectiveTheme] = useState<EffectiveTheme>("dark");

  useEffect(() => {
    if (loading) return;
    
    const root = window.document.documentElement;
    const isSystemDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    
    let activeTheme: EffectiveTheme = "dark";
    
    if (settings.theme === "system") {
      activeTheme = isSystemDark ? "dark" : "light";
    } else {
      activeTheme = settings.theme as EffectiveTheme;
    }

    setEffectiveTheme(activeTheme);

    if (activeTheme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
    
    // Listen for system changes
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = (e: MediaQueryListEvent) => {
      if (settings.theme === "system") {
        const newTheme = e.matches ? "dark" : "light";
        setEffectiveTheme(newTheme);
        if (newTheme === "dark") {
          root.classList.add("dark");
        } else {
          root.classList.remove("dark");
        }
      }
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);

  }, [settings.theme, loading]);

  // Optionally set initial class statically or via script in layout to avoid flash,
  // but since we are a simple SPA/PWA, this effect works reasonably well.
  
  return (
    <ThemeContext.Provider value={{ effectiveTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);
