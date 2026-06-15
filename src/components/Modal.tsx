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
import { useFocusTrap } from "./useFocusTrap";

export interface ModalProps {
  /** Render gate. Defaults to true so a conditionally-mounted modal just works. */
  open?: boolean;
  onClose: () => void;
  /** Heading text/node; when a string it also names the dialog. */
  title?: ReactNode;
  children: ReactNode;
  /** Action row pinned to the bottom (e.g. Cancel / Save buttons). */
  footer?: ReactNode;
  /** Accessible label for the close button. Defaults to `Close`. */
  closeLabel?: string;
  className?: string;
}

/// Centered modal dialog over a dimmed overlay. Focus is trapped while open,
/// Escape and overlay-click close it, and focus returns to the trigger on close
/// (via the shared focus-trap hook). Header always carries a close button.
export default function Modal({
  open = true,
  onClose,
  title,
  children,
  footer,
  closeLabel = "Close",
  className = "",
}: ModalProps) {
  const ref = useFocusTrap<HTMLDivElement>(open, { onEscape: onClose });
  if (!open) return null;
  const classes = ["rds-modal", className].filter(Boolean).join(" ");
  return (
    <div
      className="rds-modal-overlay"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        ref={ref}
        className={classes}
        role="dialog"
        aria-modal="true"
        aria-label={typeof title === "string" ? title : undefined}
      >
        <div className="rds-modal-header">
          {title != null && <h2 className="rds-modal-title">{title}</h2>}
          <button
            type="button"
            className="rds-modal-close"
            aria-label={closeLabel}
            onClick={onClose}
          >
            &times;
          </button>
        </div>
        <div className="rds-modal-body">{children}</div>
        {footer != null && <div className="rds-modal-footer">{footer}</div>}
      </div>
    </div>
  );
}
