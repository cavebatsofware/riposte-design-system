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
import type { ReactNode } from "react";

export type BadgeVariant =
  | "primary"
  | "success"
  | "danger"
  | "warning"
  | "info"
  | "gray";

export interface BadgeProps {
  /** Intent color. Defaults to `gray`. */
  variant?: BadgeVariant;
  /** Smaller padding + font, for dense tables. */
  small?: boolean;
  className?: string;
  children: ReactNode;
}

/// Small status pill (role, order state, log action). Token-colored, so it
/// tracks the active colorway.
export default function Badge({
  variant = "gray",
  small = false,
  className = "",
  children,
}: BadgeProps) {
  const classes = [
    "rds-badge",
    `rds-badge-${variant}`,
    small && "rds-badge-sm",
    className,
  ]
    .filter(Boolean)
    .join(" ");
  return <span className={classes}>{children}</span>;
}
