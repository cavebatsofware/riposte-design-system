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
import { useState } from "react";
import { useTranslation } from "react-i18next";

const DEFAULT_STORAGE_KEY = "rs_cookie_ack_v1";

export interface CookieBannerProps {
  /** Region (landmark) label. Prop > `t("cookieBanner.regionLabel")` > default. */
  regionLabel?: string;
  /** Banner body text. Prop > `t("cookieBanner.text")` > default. */
  text?: string;
  /** Acknowledge button label. Prop > `t("cookieBanner.ack")` > default. */
  ackLabel?: string;
  /** i18next namespace holding the `cookieBanner.*` keys. Defaults to `common`. */
  namespace?: string;
  /** localStorage key for the persisted acknowledgment. */
  storageKey?: string;
}

/// Lightweight cookie disclosure banner. The default copy describes a site that
/// uses only strictly-necessary cookies (auth, CSRF); override `text` for a
/// different cookie profile. Tracking-grade cookies would need an opt-in, not
/// this acknowledge-only pattern.
///
/// Acknowledgment is persisted in localStorage so the banner shows once per
/// device. It does not gate the site; strictly-necessary cookies still flow
/// whether or not the visitor acknowledges (per ePrivacy guidance).
export default function CookieBanner({
  regionLabel,
  text,
  ackLabel,
  namespace = "common",
  storageKey = DEFAULT_STORAGE_KEY,
}: CookieBannerProps) {
  const { t } = useTranslation(namespace);
  // Resolve from localStorage during initial render so the banner state is
  // correct on first paint and never flashes in after mount.
  const [acknowledged, setAcknowledged] = useState(() => {
    try {
      return localStorage.getItem(storageKey) === "1";
    } catch {
      // Browsers in private mode without storage access. Don't block.
      return true;
    }
  });

  function handleAck() {
    try {
      localStorage.setItem(storageKey, "1");
    } catch {
      // ignore; banner just won't persist
    }
    setAcknowledged(true);
  }

  if (acknowledged) {
    return null;
  }

  const region = regionLabel ?? t("cookieBanner.regionLabel", { defaultValue: "Cookie notice" });
  const body =
    text ??
    t("cookieBanner.text", {
      defaultValue:
        "This site uses cookies that are strictly necessary for sign-in and security. It does not use tracking, analytics, or advertising cookies.",
    });
  const ack = ackLabel ?? t("cookieBanner.ack", { defaultValue: "OK" });

  return (
    <section className="cookie-banner" aria-label={region}>
      <p>{body}</p>
      <button type="button" className="cookie-banner-ack" onClick={handleAck}>
        {ack}
      </button>
    </section>
  );
}
