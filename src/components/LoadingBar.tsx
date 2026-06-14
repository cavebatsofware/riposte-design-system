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
import { useSyncExternalStore } from "react";
import { useTranslation } from "react-i18next";
import {
  getLoadingSnapshot,
  subscribeLoading,
  type LoadingState,
} from "./loadingState";

export interface LoadingBarProps {
  /**
   * Accessible label for the progressbar. Overrides the i18n bundle.
   * Precedence: this prop > `t("loading")` > "Loading…".
   */
  label?: string;
  /** i18next namespace holding the `loading` key. Defaults to `common`. */
  namespace?: string;
}

/// Thin progress strip fixed to the top of the viewport. Subscribes to the
/// global loading bucket (see `loadingState`) and renders its `progress` /
/// `visible` values directly; all state transitions live in `loadingState`.
///
/// The vertical offset is `var(--loading-bar-top, 0)`, so an app with a fixed
/// header can drop the bar below it by setting `--loading-bar-top`.
export default function LoadingBar({ label, namespace = "common" }: LoadingBarProps) {
  const { t } = useTranslation(namespace);
  const { progress, visible }: LoadingState = useSyncExternalStore(
    subscribeLoading,
    getLoadingSnapshot,
    getLoadingSnapshot,
  );
  return (
    <div
      className={`loading-bar ${visible ? "is-visible" : ""}`}
      style={{ width: `${progress}%` }}
      role="progressbar"
      aria-label={label ?? t("loading", { defaultValue: "Loading…" })}
      aria-hidden={!visible}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(progress)}
    />
  );
}
