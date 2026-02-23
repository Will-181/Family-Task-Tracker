"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

export type ColorPalette = "default" | "ocean" | "violet";

const STORAGE_KEY = "family-task-tracker-color-palette";

type ColorPaletteContextValue = {
  colorPalette: ColorPalette;
  setColorPalette: (palette: ColorPalette) => void;
};

const ColorPaletteContext = createContext<ColorPaletteContextValue | null>(null);

function getInitialPalette(): ColorPalette {
  if (typeof window === "undefined") return "default";
  const stored = localStorage.getItem(STORAGE_KEY) as ColorPalette | null;
  if (stored === "default" || stored === "ocean" || stored === "violet")
    return stored;
  return "default";
}

export function ColorPaletteProvider({ children }: { children: React.ReactNode }) {
  const [colorPalette, setColorPaletteState] = useState<ColorPalette>("default");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setColorPaletteState(getInitialPalette());
  }, []);

  useEffect(() => {
    if (!mounted) return;
    const root = document.documentElement;
    root.removeAttribute("data-color-theme");
    if (colorPalette !== "default") {
      root.setAttribute("data-color-theme", colorPalette);
    }
    localStorage.setItem(STORAGE_KEY, colorPalette);
  }, [colorPalette, mounted]);

  const setColorPalette = useCallback((next: ColorPalette) => {
    setColorPaletteState(next);
  }, []);

  const value: ColorPaletteContextValue = { colorPalette, setColorPalette };

  return (
    <ColorPaletteContext.Provider value={value}>
      {children}
    </ColorPaletteContext.Provider>
  );
}

export function useColorPalette() {
  const ctx = useContext(ColorPaletteContext);
  if (!ctx) throw new Error("useColorPalette must be used within ColorPaletteProvider");
  return ctx;
}
