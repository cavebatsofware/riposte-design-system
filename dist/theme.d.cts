import * as react from 'react';
import { ReactNode } from 'react';

interface Colorway {
    /** Stable id; must match a `[data-theme="<id>"]` block in your CSS. */
    id: string;
    /** Fallback display label (i18n catalog labels take precedence in the UI). */
    label: string;
    /** CSS `background` value for the picker swatch (color or gradient). */
    swatch: string;
}
type ThemeMode = "light" | "dark";
interface ThemeContextValue {
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
declare const COLORWAYS: Colorway[];
declare const DEFAULT_COLORWAY = "forest";
declare const DEFAULT_STORAGE_KEY = "rs_theme_v1";
declare function useTheme(): ThemeContextValue;
/** Light/dark default. `system` (or unset) tracks the OS preference. */
type ThemeShade = ThemeMode | "system";
interface ThemeProviderProps {
    children: ReactNode;
    /** Colorway catalog. Defaults to the bundled riposte `COLORWAYS`. */
    colorways?: Colorway[];
    /** Colorway used when no choice is stored. Defaults to `forest`. */
    defaultColorway?: string;
    /**
     * Light/dark used when no choice is stored. `light`/`dark` force the shade and
     * stop tracking the OS; `system` (default) follows the OS preference. Never
     * persisted, so an explicit user choice always wins.
     */
    defaultShade?: ThemeShade;
    /** localStorage key for the persisted choice. Defaults to `rs_theme_v1`. */
    storageKey?: string;
}
declare function ThemeProvider({ children, colorways, defaultColorway, defaultShade, storageKey, }: ThemeProviderProps): react.JSX.Element;

export { COLORWAYS, type Colorway, DEFAULT_COLORWAY, DEFAULT_STORAGE_KEY, type ThemeContextValue, type ThemeMode, ThemeProvider, type ThemeProviderProps, type ThemeShade, useTheme };
