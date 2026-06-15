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

export interface ToggleSwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
  /** Visible text beside the switch; also the accessible name. */
  label?: ReactNode;
  /** Used as the input id and to label the control when `label` is text. */
  id?: string;
  className?: string;
}

/// Checkbox styled as a sliding switch. A native `<input type="checkbox">`
/// drives state, so keyboard + screen-reader behavior is the platform's.
export default function ToggleSwitch({
  checked,
  onChange,
  disabled = false,
  label,
  id,
  className = "",
}: ToggleSwitchProps) {
  const classes = ["rds-toggle", className].filter(Boolean).join(" ");
  return (
    <label className={classes}>
      <input
        type="checkbox"
        id={id}
        checked={checked}
        disabled={disabled}
        onChange={(e) => onChange(e.target.checked)}
      />
      <span className="rds-toggle-slider" aria-hidden="true" />
      {label != null && <span className="rds-toggle-label">{label}</span>}
    </label>
  );
}
