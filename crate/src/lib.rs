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
//! Following `i18n-md-email-templates`' split, this crate owns the email
//! *mechanism* and *brand presentation*; the *content* (the per-locale string
//! catalogs) belongs to the consuming application, which configures and
//! overrides it per deployment. So this crate ships:
//!
//! - [`EMAIL_LAYOUT`] / [`email_layout`]: the shared, inline-safe HTML email
//!   shell (brand presentation).
//! - [`deep_merge`] and [`build_catalog`]: layer per-deployment operator
//!   overrides over an application's default catalogs into a ready
//!   [`i18n_md_email_templates::Catalog`].
//! - [`stylesheet`] and the `*_CSS` constants: the same palette / token /
//!   component CSS the npm package ships, for serving or server-side rendering.
//!
//! It deliberately does **not** embed any email copy.

use i18n_md_email_templates::Catalog;
use serde_json::Value;

/// The Riposte-branded shared email shell: the `{{content}}` / `{{footer}}`
/// slots and the single inline-safe `<style>` block all transactional emails
/// share. Pass it as `EmailTemplate.layout`. Exposed as a `const` so callers can
/// bind it in a `const` context.
pub const EMAIL_LAYOUT: &str = include_str!("../assets/email/layout.html");

/// Accessor for [`EMAIL_LAYOUT`].
pub fn email_layout() -> &'static str {
    EMAIL_LAYOUT
}

/// Deep-merge `overlay` into `base`: objects merge key-by-key (recursively); any
/// non-object overlay value, or a key absent from `base`, replaces or sets the
/// value. So an operator override can change just `order_confirmation.body`
/// while inheriting every other string.
pub fn deep_merge(base: &mut Value, overlay: &Value) {
    match (base, overlay) {
        (Value::Object(b), Value::Object(o)) => {
            for (k, v) in o {
                deep_merge(b.entry(k.clone()).or_insert(Value::Null), v);
            }
        }
        (b, o) => *b = o.clone(),
    }
}

/// Build a localized email [`Catalog`] by deep-merging per-locale `overrides`
/// over an application's `defaults`.
///
/// Both are `(locale_code, json)` pairs. An override for a locale is merged onto
/// that locale's defaults (or stands alone if the locale has no defaults).
/// `fallback` is the locale used when a requested one is missing. Pass an empty
/// `overrides` to get the defaults unchanged.
pub fn build_catalog(
    defaults: impl IntoIterator<Item = (String, Value)>,
    overrides: impl IntoIterator<Item = (String, Value)>,
    fallback: impl Into<String>,
) -> Catalog {
    use std::collections::BTreeMap;
    let mut by_locale: BTreeMap<String, Value> = defaults.into_iter().collect();
    for (code, ov) in overrides {
        by_locale
            .entry(code)
            .and_modify(|base| deep_merge(base, &ov))
            .or_insert(ov);
    }
    Catalog::new(by_locale.into_iter().collect(), fallback)
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
    use serde_json::json;

    #[test]
    fn deep_merge_overrides_one_leaf_and_keeps_siblings() {
        let mut base = json!({
            "order_confirmation": { "subject": "Order received", "body": "default body" },
            "invite": { "subject": "You are invited" }
        });
        let overlay = json!({ "order_confirmation": { "body": "personal note" } });
        deep_merge(&mut base, &overlay);
        assert_eq!(base["order_confirmation"]["body"], "personal note");
        // Sibling key and sibling object are untouched.
        assert_eq!(base["order_confirmation"]["subject"], "Order received");
        assert_eq!(base["invite"]["subject"], "You are invited");
    }

    #[test]
    fn build_catalog_merges_overrides_over_defaults() {
        let defaults = [(
            "en".to_string(),
            json!({ "invite": { "subject": "Default subject", "body": "Default body" } }),
        )];
        let overrides = [(
            "en".to_string(),
            json!({ "invite": { "body": "Custom body" } }),
        )];
        let cat = build_catalog(defaults, overrides, "en");
        assert_eq!(cat.get("en", "invite.subject").as_deref(), Some("Default subject"));
        assert_eq!(cat.get("en", "invite.body").as_deref(), Some("Custom body"));
    }

    #[test]
    fn build_catalog_with_no_overrides_is_defaults() {
        let defaults = [("en".to_string(), json!({ "invite": { "subject": "Hello" } }))];
        let cat = build_catalog(defaults, std::iter::empty(), "en");
        assert_eq!(cat.get("en", "invite.subject").as_deref(), Some("Hello"));
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
