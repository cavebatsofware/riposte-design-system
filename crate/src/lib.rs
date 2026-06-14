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

//! Rust side of the Riposte design system.
//!
//! The TypeScript package ships the frontend (tokens, theme engine, components);
//! this crate exposes the branded assets a Rust backend also needs, from the
//! same source of truth:
//!
//! - [`email_catalog`]: the localized `email` string catalogs, embedded and
//!   parsed once into an [`i18n_md_email_templates::Catalog`] (fallback `en`).
//! - [`email_layout`]: the shared, inline-safe HTML email shell.
//! - [`stylesheet`] and the `*_CSS` constants: the same palette / token /
//!   component CSS the npm package ships, for serving or server-side rendering.

use std::sync::OnceLock;

use i18n_md_email_templates::Catalog;

/// Supported email locales. Keep in sync with the frontend's `SUPPORTED_LOCALES`
/// and the backend's `crate::profile::locale::SUPPORTED_LOCALES`.
const EMAIL_LOCALES: [(&str, &str); 5] = [
    ("en", include_str!("../assets/email/en.json")),
    ("es", include_str!("../assets/email/es.json")),
    ("fr", include_str!("../assets/email/fr.json")),
    ("zh", include_str!("../assets/email/zh.json")),
    ("de", include_str!("../assets/email/de.json")),
];

/// Fallback locale used when a requested one is missing.
pub const FALLBACK_LOCALE: &str = "en";

/// The process-wide email string catalog, parsed once. Fallback locale is `en`.
///
/// Panics on first use if any embedded catalog is not valid JSON; that is a
/// build-time content error, caught by tests and never reachable in a shipped
/// binary.
pub fn email_catalog() -> &'static Catalog {
    static CATALOG: OnceLock<Catalog> = OnceLock::new();
    CATALOG.get_or_init(|| {
        let locales = EMAIL_LOCALES
            .into_iter()
            .map(|(code, raw)| {
                let value = serde_json::from_str(raw)
                    .unwrap_or_else(|e| panic!("invalid email catalog for {code}: {e}"));
                (code.to_string(), value)
            })
            .collect();
        Catalog::new(locales, FALLBACK_LOCALE)
    })
}

/// The Riposte-branded shared email shell: the `{{content}}` / `{{footer}}`
/// slots and the single inline-safe `<style>` block all transactional emails
/// share. Pass it as `EmailTemplate.layout`. Exposed as a `const` so callers can
/// bind it in a `const` context.
pub const EMAIL_LAYOUT: &str = include_str!("../assets/email/layout.html");

/// Accessor for [`EMAIL_LAYOUT`].
pub fn email_layout() -> &'static str {
    EMAIL_LAYOUT
}

/// Color palette: the per-colorway `[data-theme]` blocks (8 colorways, light +
/// dark, including the 3 WCAG accessibility colorways).
pub const PALETTE_CSS: &str = include_str!("../../styles/palette.css");

/// Shared non-color scale: typography, spacing, radius, shadow tokens.
pub const TOKENS_CSS: &str = include_str!("../../styles/tokens.css");

/// Styles for the shared components (skeleton, loading bar, cookie banner,
/// drawer).
pub const COMPONENTS_CSS: &str = include_str!("../../styles/components.css");

/// The full design-system stylesheet: tokens, then palette, then component
/// styles, in the same order the npm package's `styles/index.css` imports them.
/// Use this to serve or inline the canonical CSS from a Rust backend.
pub fn stylesheet() -> String {
    format!("{TOKENS_CSS}\n{PALETTE_CSS}\n{COMPONENTS_CSS}")
}

#[cfg(test)]
mod tests {
    use super::*;
    use serde_json::Value;
    use std::collections::BTreeSet;

    /// Recursively collect dotted leaf keys from a catalog object so locales can
    /// be compared for structural parity.
    fn collect_keys(value: &Value, prefix: &str, out: &mut BTreeSet<String>) {
        match value {
            Value::Object(map) => {
                for (k, v) in map {
                    let path = if prefix.is_empty() {
                        k.clone()
                    } else {
                        format!("{prefix}.{k}")
                    };
                    collect_keys(v, &path, out);
                }
            }
            _ => {
                out.insert(prefix.to_string());
            }
        }
    }

    fn keys_for(raw: &str) -> BTreeSet<String> {
        let value: Value = serde_json::from_str(raw).expect("catalog is valid JSON");
        let mut out = BTreeSet::new();
        collect_keys(&value, "", &mut out);
        out
    }

    #[test]
    fn every_locale_parses_and_builds() {
        // Exercises the same path as production: parse all catalogs and build.
        let _ = email_catalog();
    }

    #[test]
    fn locales_have_the_same_keys_as_en() {
        let reference = keys_for(EMAIL_LOCALES[0].1);
        assert_eq!(EMAIL_LOCALES[0].0, FALLBACK_LOCALE);
        for (code, raw) in EMAIL_LOCALES.into_iter().skip(1) {
            let keys = keys_for(raw);
            let missing: Vec<_> = reference.difference(&keys).collect();
            let extra: Vec<_> = keys.difference(&reference).collect();
            assert!(
                missing.is_empty() && extra.is_empty(),
                "email catalog '{code}' diverges from '{FALLBACK_LOCALE}': missing={missing:?} extra={extra:?}",
            );
        }
    }

    #[test]
    fn stylesheet_includes_tokens_and_palette() {
        let css = stylesheet();
        assert!(css.contains("--color-primary"), "palette tokens present");
        assert!(css.contains("--spacing-1"), "scale tokens present");
    }

    #[test]
    fn email_layout_has_slots() {
        let layout = email_layout();
        assert!(layout.contains("{{content}}"));
        assert!(layout.contains("{{heading}}"));
    }
}
