/** Query param carrying the theme id (e.g. `forest-dark`). */
declare const THEME_PARAM = "rs_theme";
/** Query param carrying the locale code (e.g. `es`). */
declare const LOCALE_PARAM = "rs_locale";
/** localStorage key i18next's detector reads in the social SPA. */
declare const DEFAULT_LOCALE_STORAGE_KEY = "rs_locale_v1";
/** The Riposte launch locales; the default allow-list for `consume`. */
declare const DEFAULT_LOCALES: string[];
interface HandoffOptions {
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
declare function appendHandoffParams(href: string, options?: HandoffOptions): string;
declare function consumeHandoffParams(options?: HandoffOptions): void;

export { DEFAULT_LOCALES, DEFAULT_LOCALE_STORAGE_KEY, type HandoffOptions, LOCALE_PARAM, THEME_PARAM, appendHandoffParams, consumeHandoffParams };
