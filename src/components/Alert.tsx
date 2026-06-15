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

export type AlertVariant = "error" | "success" | "warning" | "info";

export interface AlertProps {
  /** Intent. Defaults to `info`. */
  variant?: AlertVariant;
  className?: string;
  children: ReactNode;
}

/// Inline page/form feedback banner. `error` gets `role="alert"` (assertive);
/// the rest get `role="status"` (polite).
export default function Alert({
  variant = "info",
  className = "",
  children,
}: AlertProps) {
  const classes = ["rds-alert", `rds-alert-${variant}`, className]
    .filter(Boolean)
    .join(" ");
  return (
    <div className={classes} role={variant === "error" ? "alert" : "status"}>
      {children}
    </div>
  );
}
