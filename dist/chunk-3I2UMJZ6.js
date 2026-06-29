import { DEFAULT_STORAGE_KEY, COLORWAYS } from './chunk-5BMLKUPG.js';

// src/handoff/index.ts
var THEME_PARAM = "rs_theme";
var LOCALE_PARAM = "rs_locale";
var DEFAULT_LOCALE_STORAGE_KEY = "rs_locale_v1";
var DEFAULT_LOCALES = ["en", "es", "fr", "zh", "de"];
function isValidTheme(id) {
  if (!id) return false;
  const base = id.endsWith("-dark") ? id.slice(0, -"-dark".length) : id;
  return COLORWAYS.some((c) => c.id === base);
}
function appendHandoffParams(href, options = {}) {
  if (typeof window === "undefined" || !href) return href;
  const themeKey = options.themeStorageKey ?? DEFAULT_STORAGE_KEY;
  const localeKey = options.localeStorageKey ?? DEFAULT_LOCALE_STORAGE_KEY;
  let theme = null;
  let locale = null;
  try {
    theme = localStorage.getItem(themeKey);
    locale = localStorage.getItem(localeKey);
  } catch {
  }
  let url;
  try {
    url = new URL(href, window.location.href);
  } catch {
    return href;
  }
  if (isValidTheme(theme)) url.searchParams.set(THEME_PARAM, theme);
  if (locale) url.searchParams.set(LOCALE_PARAM, locale);
  return url.toString();
}
function consumeHandoffParams(options = {}) {
  if (typeof window === "undefined") return;
  const themeKey = options.themeStorageKey ?? DEFAULT_STORAGE_KEY;
  const localeKey = options.localeStorageKey ?? DEFAULT_LOCALE_STORAGE_KEY;
  const allowed = options.allowedLocales ?? DEFAULT_LOCALES;
  let url;
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
  }
  params.delete(THEME_PARAM);
  params.delete(LOCALE_PARAM);
  const query = params.toString();
  const cleaned = url.pathname + (query ? `?${query}` : "") + url.hash;
  try {
    window.history.replaceState(window.history.state, "", cleaned);
  } catch {
  }
}

export { DEFAULT_LOCALES, DEFAULT_LOCALE_STORAGE_KEY, LOCALE_PARAM, THEME_PARAM, appendHandoffParams, consumeHandoffParams };
//# sourceMappingURL=chunk-3I2UMJZ6.js.map
//# sourceMappingURL=chunk-3I2UMJZ6.js.map