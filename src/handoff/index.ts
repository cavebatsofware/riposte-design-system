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

// Cross-origin theme + locale handoff. The Riposte SPAs (social, store) run on
// different subdomains, so their `localStorage` choices (theme `rs_theme_v1`,
// locale `rs_locale_v1`) are origin-isolated. To carry the choice across an
// intentional cross-app link, the source decorates the link with `?rs_theme=`
// and `?rs_locale=` (`appendHandoffParams`) and the destination reads, persists,
// and strips them on load (`consumeHandoffParams`). Framework-agnostic and
// dependency-free so a pre-paint inline script can mirror the same logic before
// the bundle (and the theme/i18n providers) initialize.

import { COLORWAYS, DEFAULT_STORAGE_KEY } from "../theme/ThemeContext";

/** Query param carrying the theme id (e.g. `forest-dark`). */
export const THEME_PARAM = "rs_theme";
/** Query param carrying the locale code (e.g. `es`). */
export const LOCALE_PARAM = "rs_locale";
/** localStorage key i18next's detector reads in the social SPA. */
export const DEFAULT_LOCALE_STORAGE_KEY = "rs_locale_v1";
/** The Riposte launch locales; the default allow-list for `consume`. */
export const DEFAULT_LOCALES = ["en", "es", "fr", "zh", "de"];

function isValidTheme(id: string | null | undefined): id is string {
  if (!id) return false;
  const base = id.endsWith("-dark") ? id.slice(0, -"-dark".length) : id;
  return COLORWAYS.some((c) => c.id === base);
}

export interface HandoffOptions {
  /** localStorage key for the theme. Defaults to `rs_theme_v1`. */
  themeStorageKey?: string;
  /** localStorage key for the locale. Defaults to `rs_locale_v1`. */
  localeStorageKey?: string;
  /**
   * Allowed locale codes. The locale set is app-owned (the store is
   * English-only; social ships five), so the consumer supplies it. Defaults to
   * the Riposte five.
   */
  allowedLocales?: string[];
}

/// Append the current theme + locale to a cross-app link, read live from
/// localStorage. Skips a param that is absent or invalid. Returns an absolute
/// URL (the links are cross-origin); a no-op outside the browser.
export function appendHandoffParams(href: string, options: HandoffOptions = {}): string {
  if (typeof window === "undefined" || !href) return href;
  const themeKey = options.themeStorageKey ?? DEFAULT_STORAGE_KEY;
  const localeKey = options.localeStorageKey ?? DEFAULT_LOCALE_STORAGE_KEY;

  let theme: string | null = null;
  let locale: string | null = null;
  try {
    theme = localStorage.getItem(themeKey);
    locale = localStorage.getItem(localeKey);
  } catch {
    // storage blocked (private mode); nothing to forward
  }

  let url: URL;
  try {
    url = new URL(href, window.location.href);
  } catch {
    return href;
  }
  if (isValidTheme(theme)) url.searchParams.set(THEME_PARAM, theme);
  if (locale) url.searchParams.set(LOCALE_PARAM, locale);
  return url.toString();
}

/// On load, persist any handoff params into localStorage (validated), then
/// strip them from the address bar so a copied URL or refresh is clean. Must run
/// before the theme provider and i18next read localStorage; the pre-paint inline
/// scripts mirror this. A no-op outside the browser or when no params are present.
export function consumeHandoffParams(options: HandoffOptions = {}): void {
  if (typeof window === "undefined") return;
  const themeKey = options.themeStorageKey ?? DEFAULT_STORAGE_KEY;
  const localeKey = options.localeStorageKey ?? DEFAULT_LOCALE_STORAGE_KEY;
  const allowed = options.allowedLocales ?? DEFAULT_LOCALES;

  let url: URL;
  try {
    url = new URL(window.location.href);
  } catch {
    return;
  }
  const params = url.searchParams;
  const theme = params.get(THEME_PARAM);
  const locale = params.get(LOCALE_PARAM);
  if (theme === null && locale === null) return;

  try {
    if (isValidTheme(theme)) localStorage.setItem(themeKey, theme);
    if (locale && allowed.includes(locale)) localStorage.setItem(localeKey, locale);
  } catch {
    // storage blocked; the params still get stripped below
  }

  params.delete(THEME_PARAM);
  params.delete(LOCALE_PARAM);
  const query = params.toString();
  const cleaned = url.pathname + (query ? `?${query}` : "") + url.hash;
  try {
    window.history.replaceState(window.history.state, "", cleaned);
  } catch {
    // history blocked; non-fatal
  }
}
