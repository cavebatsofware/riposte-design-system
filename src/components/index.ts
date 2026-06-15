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

// Shared app-agnostic components. Each user-facing string accepts an optional
// label prop that overrides the i18n bundle (prop > bundle > built-in default),
// so a consumer can localize via the ./i18n bundle or inject strings directly.

export { default as SkeletonCard } from "./SkeletonCard";
export type { SkeletonCardProps } from "./SkeletonCard";

export { default as LoadingBar } from "./LoadingBar";
export type { LoadingBarProps } from "./LoadingBar";

export { default as CookieBanner } from "./CookieBanner";
export type { CookieBannerProps } from "./CookieBanner";

export { default as Drawer } from "./Drawer";
export type { DrawerProps } from "./Drawer";

export { default as useFocusTrap } from "./useFocusTrap";
export type { FocusTrapOptions } from "./useFocusTrap";

// Admin/app UI primitives (extracted from admin-frontend). Token-styled with
// `rds-`-prefixed classes so they never collide with a consumer's own classes.
export { default as Button } from "./Button";
export type { ButtonProps, ButtonVariant, ButtonSize } from "./Button";

export { default as Badge } from "./Badge";
export type { BadgeProps, BadgeVariant } from "./Badge";

export { default as Alert } from "./Alert";
export type { AlertProps, AlertVariant } from "./Alert";

export { default as FormGroup } from "./FormGroup";
export type { FormGroupProps } from "./FormGroup";

export { default as ToggleSwitch } from "./ToggleSwitch";
export type { ToggleSwitchProps } from "./ToggleSwitch";

export { default as StatCard } from "./StatCard";
export type { StatCardProps } from "./StatCard";

export { default as Table } from "./Table";
export type {
  TableProps,
  TableColumn,
  TablePagination,
  TableLabels,
} from "./Table";

export { default as Modal } from "./Modal";
export type { ModalProps } from "./Modal";

// The loading bucket that <LoadingBar> renders. An app's data layer calls
// startLoad/endLoad around requests; resetLoadCount clears it (e.g. on route
// change).
export {
  startLoad,
  endLoad,
  resetLoadCount,
  subscribeLoading,
  getLoadingSnapshot,
} from "./loadingState";
export type { LoadingState, LoadOptions } from "./loadingState";
