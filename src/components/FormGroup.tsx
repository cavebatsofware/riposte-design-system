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

export interface FormGroupProps {
  /** Field label. Omit to render an unlabeled group (e.g. a checkbox row). */
  label?: ReactNode;
  /** `for`/`id` association to the control. */
  htmlFor?: string;
  /** Helper text rendered under the control. */
  hint?: ReactNode;
  className?: string;
  children: ReactNode;
}

/// Label + control + optional hint, with the form-control styling applied to
/// nested input/textarea/select via the styles bundle.
export default function FormGroup({
  label,
  htmlFor,
  hint,
  className = "",
  children,
}: FormGroupProps) {
  const classes = ["rds-form-group", className].filter(Boolean).join(" ");
  return (
    <div className={classes}>
      {label != null && <label htmlFor={htmlFor}>{label}</label>}
      {children}
      {hint != null && <small>{hint}</small>}
    </div>
  );
}
