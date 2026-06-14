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
import { useEffect, type ReactNode } from "react";
import { useTranslation } from "react-i18next";
import useFocusTrap from "./useFocusTrap";

export interface DrawerProps {
  /** Whether the drawer is open. The host owns this state. */
  open: boolean;
  /** Called on backdrop click, Escape, or close-button press. */
  onClose: () => void;
  /** Accessible name for the dialog. Falls back to `title` when it is a string. */
  label?: string;
  /** Optional standard header: renders this title and a close button. */
  title?: ReactNode;
  /** Close-button label. Prop > `t("drawer.close")` > "Close". */
  closeLabel?: string;
  /** i18next namespace holding the `drawer.*` keys. Defaults to `common`. */
  namespace?: string;
  /** Extra class names appended to the panel. */
  className?: string;
  /** Drawer body. The host supplies its own content (nav, links, etc.). */
  children: ReactNode;
}

/// Headless slide-in drawer: backdrop, an off-canvas panel, focus trap, body
/// scroll lock, and Escape / backdrop-click to close. It renders no navigation
/// of its own; the host composes content as `children` (and, optionally, a
/// standard header via `title`).
///
/// The panel stays mounted in both states (open state is a `data-open`
/// attribute) so the slide transition runs and the focus-trap ref is stable.
/// Visibility and the slide come from the styles bundle's `.drawer*` rules.
export default function Drawer({
  open,
  onClose,
  label,
  title,
  closeLabel,
  namespace = "common",
  className = "",
  children,
}: DrawerProps) {
  const { t } = useTranslation(namespace);
  const panelRef = useFocusTrap<HTMLDivElement>(open, { onEscape: onClose });

  // Lock body scroll while open. Focus trap and Escape are handled by the hook.
  useEffect(() => {
    if (!open) return undefined;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const close = closeLabel ?? t("drawer.close", { defaultValue: "Close" });
  const dialogLabel = label ?? (typeof title === "string" ? title : undefined);
  const panelClass = className ? `drawer-panel ${className}` : "drawer-panel";

  return (
    <div className="drawer" data-open={open ? "true" : "false"} aria-hidden={!open}>
      {/* Backdrop is aria-hidden; keyboard users dismiss with Escape (handled
          by the focus trap). */}
      <div className="drawer-backdrop" onClick={onClose} aria-hidden="true" />
      <div ref={panelRef} className={panelClass} role="dialog" aria-modal="true" aria-label={dialogLabel}>
        {title != null && (
          <div className="drawer-header">
            <span className="drawer-title">{title}</span>
            <button type="button" className="drawer-close" aria-label={close} onClick={onClose}>
              ×
            </button>
          </div>
        )}
        {children}
      </div>
    </div>
  );
}
