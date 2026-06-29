'use strict';

var react = require('react');
var jsxRuntime = require('react/jsx-runtime');

// src/theme/ThemeContext.tsx
var COLORWAYS = [
  { id: "forest", label: "Forest & Cream", swatch: "#2d4a37" },
  { id: "warm", label: "Warm Editorial", swatch: "#1d3557" },
  { id: "plum", label: "Plum & Apricot", swatch: "#5b1f4d" },
  // Avernus & Clouds: opposite-pole light/dark. The picker swatch shows
  // both halves at once via a diagonal gradient so the dichotomy is
  // visible at a glance.
  {
    id: "avernus",
    label: "Avernus & Clouds",
    swatch: "linear-gradient(135deg, #4f6dab 50%, #ed5e3a 50%)"
  },
  { id: "mineral", label: "Rocks & Minerals", swatch: "#8e4a1f" },
  // Accessibility colorways. Each swatch shows the theme's signature
  // accent so the picker telegraphs the palette's actual aesthetic.
  { id: "daltonia", label: "Red-Green Accessible", swatch: "#d4a334" },
  { id: "tritan", label: "Blue-Yellow Accessible", swatch: "#c25d4a" },
  {
    id: "achroma",
    label: "High Contrast",
    swatch: "linear-gradient(135deg, #000000 50%, #ffffff 50%)"
  }
];
var DEFAULT_COLORWAY = "forest";
var DEFAULT_STORAGE_KEY = "rs_theme_v1";
var ThemeContext = react.createContext(null);
function useTheme() {
  const ctx = react.useContext(ThemeContext);
  if (!ctx) {
    throw new Error("useTheme must be used within ThemeProvider");
  }
  return ctx;
}
function isValidThemeId(id, colorways) {
  if (!id) return false;
  const colorway = id.endsWith("-dark") ? id.slice(0, -"-dark".length) : id;
  return colorways.some((c) => c.id === colorway);
}
function resolveInitialTheme(colorways, defaultColorway, storageKey, defaultShade) {
  let stored = null;
  try {
    stored = localStorage.getItem(storageKey);
  } catch {
  }
  if (isValidThemeId(stored, colorways)) return stored;
  if (defaultShade === "light") return defaultColorway;
  if (defaultShade === "dark") return `${defaultColorway}-dark`;
  let prefersDark = false;
  try {
    prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  } catch {
  }
  return prefersDark ? `${defaultColorway}-dark` : defaultColorway;
}
function ThemeProvider({
  children,
  colorways = COLORWAYS,
  defaultColorway = DEFAULT_COLORWAY,
  defaultShade = "system",
  storageKey = DEFAULT_STORAGE_KEY
}) {
  const [theme, setThemeState] = react.useState(
    () => resolveInitialTheme(colorways, defaultColorway, storageKey, defaultShade)
  );
  react.useLayoutEffect(() => {
    document.documentElement.dataset.theme = theme;
  }, [theme]);
  react.useEffect(() => {
    if (defaultShade === "light" || defaultShade === "dark") return void 0;
    let media;
    try {
      media = window.matchMedia("(prefers-color-scheme: dark)");
    } catch {
      return void 0;
    }
    function onChange(e) {
      let stored = null;
      try {
        stored = localStorage.getItem(storageKey);
      } catch {
      }
      if (isValidThemeId(stored, colorways)) return;
      const next = e.matches ? `${defaultColorway}-dark` : defaultColorway;
      setThemeState(next);
    }
    media.addEventListener?.("change", onChange);
    return () => {
      media.removeEventListener?.("change", onChange);
    };
  }, [colorways, defaultColorway, defaultShade, storageKey]);
  function setTheme(id) {
    if (!isValidThemeId(id, colorways)) return;
    setThemeState(id);
    try {
      localStorage.setItem(storageKey, id);
    } catch {
    }
  }
  function setMode(nextMode) {
    if (nextMode !== "light" && nextMode !== "dark") return;
    const colorway = theme.endsWith("-dark") ? theme.slice(0, -"-dark".length) : theme;
    setTheme(nextMode === "dark" ? `${colorway}-dark` : colorway);
  }
  const mode = theme.endsWith("-dark") ? "dark" : "light";
  return /* @__PURE__ */ jsxRuntime.jsx(ThemeContext.Provider, { value: { theme, setTheme, colorways, mode, setMode }, children });
}

exports.COLORWAYS = COLORWAYS;
exports.DEFAULT_COLORWAY = DEFAULT_COLORWAY;
exports.DEFAULT_STORAGE_KEY = DEFAULT_STORAGE_KEY;
exports.ThemeProvider = ThemeProvider;
exports.useTheme = useTheme;
//# sourceMappingURL=chunk-NLTAEOG2.cjs.map
//# sourceMappingURL=chunk-NLTAEOG2.cjs.map