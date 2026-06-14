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
import { en } from "./components/en";
import { de } from "./components/de";
import { es } from "./components/es";
import { fr } from "./components/fr";
import { zh } from "./components/zh";

/// Base-UI translation fragments for the shared components, keyed by language
/// (en, de, es, fr, zh). Each value is a tree of `loading`, `cookieBanner`, and
/// `drawer` keys meant to be merged into your i18next namespace (default
/// `common`):
///
///   import { componentResources } from "@cavebatsofware/riposte-design-system/i18n";
///   for (const [lng, res] of Object.entries(componentResources)) {
///     i18n.addResourceBundle(lng, "common", res, true, true);
///   }
///
/// Every component also accepts label props that override these, so merging the
/// bundle is optional: with no bundle and no props, components fall back to a
/// built-in English string.
export const componentResources = {
  en,
  de,
  es,
  fr,
  zh,
};
