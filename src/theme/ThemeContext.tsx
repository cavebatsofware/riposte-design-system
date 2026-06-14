/*  This file is part of @cavebatsofware/riposte-design-system
 *  Copyright (C) 2026 Grant DeFayette
 *
 *  This program is free software: you can redistribute it and/or modify
 *  it under the terms of the GNU General Public License as published by
 *  the Free Software Foundation, version 3 of the License (GPL-3.0-only).
 *
 *  This program is distributed in the hope that it will be useful,
 *  but WITHOUT ANY WARRANTY; without even the implied warranty of
 *  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *  GNU General Public License for more details.
 *
 *  You should have received a copy of the GNU General Public License
 *  along with this program.  If not, see <https://www.gnu.org/licenses/gpl-3.0.html>.
 */
import {
  createContext,
  useContext,
  useEffect,
  useLayoutEffect,
  useState,
  type ReactNode,
} from "react";

export interface Colorway {
  /** Stable id; must match a `[data-theme="<id>"]` block in your CSS. */
  id: string;
  /** Fallback display label (i18n catalog labels take precedence in the UI). */
  label: string;
  /** CSS `background` value for the picker swatch (color or gradient). */
  swatch: string;
}

export type ThemeMode = "light" | "dark";

export interface ThemeContextValue {
  /** Resolved theme id of record, e.g. `forest` or `forest-dark`. */
  theme: string;
  /** Set the theme by id; ignored if the id is not in the catalog. */
  setTheme: (id: string) => void;
  /** The active catalog. */
  colorways: Colorway[];
  /** Derived light/dark mode for the current theme. */
  mode: ThemeMode;
  /** Flip just the mode, keeping the current colorway. */
  setMode: (mode: ThemeMode) => void;
}

/// Default colorways. Each one has a light and a dark variant in the bundled
/// `styles/palette.css` under `[data-theme="<id>"]` and `[data-theme="<id>-dark"]`.
/// The picker UI splits this into two axes: colorway and mode (light/dark).
///
/// The catalog mixes evocative aesthetic colorways with descriptive
/// accessibility colorways. The accessibility entries are named after
/// the deficiency they target so users can pick the right one without
/// having to learn the project's poetic naming.
export const COLORWAYS: Colorway[] = [
  { id: "forest", label: "Forest & Cream", swatch: "#2d4a37" },
  { id: "warm", label: "Warm Editorial", swatch: "#1d3557" },
  { id: "plum", label: "Plum & Apricot", swatch: "#5b1f4d" },
  // Avernus & Clouds: opposite-pole light/dark. The picker swatch shows
  // both halves at once via a diagonal gradient so the dichotomy is
  // visible at a glance.
  {
    id: "avernus",
    label: "Avernus & Clouds",
    swatch: "linear-gradient(135deg, #4f6dab 50%, #ed5e3a 50%)",
  },
  { id: "mineral", label: "Rocks & Minerals", swatch: "#8e4a1f" },
  // Accessibility colorways. Each swatch shows the theme's signature
  // accent so the picker telegraphs the palette's actual aesthetic.
  { id: "daltonia", label: "Red-Green Accessible", swatch: "#d4a334" },
  { id: "tritan", label: "Blue-Yellow Accessible", swatch: "#c25d4a" },
  {
    id: "achroma",
    label: "High Contrast",
    swatch: "linear-gradient(135deg, #000000 50%, #ffffff 50%)",
  },
];

export const DEFAULT_COLORWAY = "forest";
export const DEFAULT_STORAGE_KEY = "rs_theme_v1";

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error("useTheme must be used within ThemeProvider");
  }
  return ctx;
}

function isValidThemeId(id: string | null, colorways: Colorway[]): id is string {
  if (!id) return false;
  const colorway = id.endsWith("-dark") ? id.slice(0, -"-dark".length) : id;
  return colorways.some((c) => c.id === colorway);
}

function resolveInitialTheme(
  colorways: Colorway[],
  defaultColorway: string,
  storageKey: string,
): string {
  let stored: string | null = null;
  try {
    stored = localStorage.getItem(storageKey);
  } catch {
    // private mode without storage access; defaults stand
  }
  if (isValidThemeId(stored, colorways)) return stored;

  // No explicit user choice yet: honor the OS-level preference.
  let prefersDark = false;
  try {
    prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  } catch {
    // matchMedia unavailable (rare); default to light
  }
  return prefersDark ? `${defaultColorway}-dark` : defaultColorway;
}

export interface ThemeProviderProps {
  children: ReactNode;
  /** Colorway catalog. Defaults to the bundled riposte `COLORWAYS`. */
  colorways?: Colorway[];
  /** Colorway used when no choice is stored. Defaults to `forest`. */
  defaultColorway?: string;
  /** localStorage key for the persisted choice. Defaults to `rs_theme_v1`. */
  storageKey?: string;
}

/// Apply the theme to the document and persist the user's choice.
///
/// State of record is the resolved id (e.g. `forest-dark`); the picker UI
/// derives colorway and mode from it. The DOM attribute is applied in
/// useLayoutEffect so the first paint and every subsequent change pick up
/// the correct theme without a flash.
export function ThemeProvider({
  children,
  colorways = COLORWAYS,
  defaultColorway = DEFAULT_COLORWAY,
  storageKey = DEFAULT_STORAGE_KEY,
}: ThemeProviderProps) {
  const [theme, setThemeState] = useState(() =>
    resolveInitialTheme(colorways, defaultColorway, storageKey),
  );
  useLayoutEffect(() => {
    document.documentElement.dataset.theme = theme;
  }, [theme]);

  // Subscribe to OS preference changes so a fresh visitor (no explicit
  // choice yet) tracks their system theme, and stop tracking the moment
  // they pick. Pure subscription effect; no state-from-effect on mount.
  useEffect(() => {
    let media: MediaQueryList;
    try {
      media = window.matchMedia("(prefers-color-scheme: dark)");
    } catch {
      return undefined;
    }
    function onChange(e: MediaQueryListEvent) {
      let stored: string | null = null;
      try {
        stored = localStorage.getItem(storageKey);
      } catch {
        // ignore
      }
      // User has made an explicit choice; don't override it.
      if (isValidThemeId(stored, colorways)) return;
      const next = e.matches ? `${defaultColorway}-dark` : defaultColorway;
      setThemeState(next);
    }
    media.addEventListener?.("change", onChange);
    return () => {
      media.removeEventListener?.("change", onChange);
    };
  }, [colorways, defaultColorway, storageKey]);

  function setTheme(id: string) {
    if (!isValidThemeId(id, colorways)) return;
    setThemeState(id);
    try {
      localStorage.setItem(storageKey, id);
    } catch {
      // ignore; the in-memory state still reflects the choice for this session
    }
  }

  // Convenience: flip just the mode while keeping the colorway. The picker
  // exposes this as a separate row so users can change one without
  // accidentally re-picking the other.
  function setMode(nextMode: ThemeMode) {
    if (nextMode !== "light" && nextMode !== "dark") return;
    const colorway = theme.endsWith("-dark") ? theme.slice(0, -"-dark".length) : theme;
    setTheme(nextMode === "dark" ? `${colorway}-dark` : colorway);
  }

  const mode: ThemeMode = theme.endsWith("-dark") ? "dark" : "light";

  return (
    <ThemeContext.Provider value={{ theme, setTheme, colorways, mode, setMode }}>
      {children}
    </ThemeContext.Provider>
  );
}
