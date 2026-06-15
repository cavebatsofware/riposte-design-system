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
import type { ButtonHTMLAttributes } from "react";

export type ButtonVariant = "primary" | "secondary" | "success" | "danger";
export type ButtonSize = "sm" | "md";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** Visual weight + intent. Defaults to `primary`. */
  variant?: ButtonVariant;
  /** `sm` for compact rows/toolbars; `md` (default) otherwise. */
  size?: ButtonSize;
  /** Stretch to the container width. */
  fullWidth?: boolean;
}

/// Themed button. Color comes from design tokens, so it tracks the active
/// colorway. `type` defaults to `button` (not `submit`) to avoid accidental
/// form submits.
export default function Button({
  variant = "primary",
  size = "md",
  fullWidth = false,
  className = "",
  type = "button",
  ...rest
}: ButtonProps) {
  const classes = [
    "rds-btn",
    `rds-btn-${variant}`,
    size === "sm" && "rds-btn-sm",
    fullWidth && "rds-btn-full",
    className,
  ]
    .filter(Boolean)
    .join(" ");
  // eslint-disable-next-line react/button-has-type
  return <button type={type} className={classes} {...rest} />;
}
