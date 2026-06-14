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
import React, { useEffect, useRef } from "react";

/// Shared toggle-button + popover shell used by the theme and language
/// pickers. Owns the close-on-outside-interaction listeners (mousedown,
/// focusin, Escape) and the wrapper JSX. Open/close state is controlled by
/// the parent so the parent can drive other hooks from the same flag.
///
/// Two variants:
/// - `popover` (default): renders a toggle button that toggles a
///   `role="dialog"` popover containing the content.
/// - `inline`: renders only the content (no toggle, always visible),
///   wrapped in a `${className}-inline` div for use inside layouts where
///   vertical space is abundant (e.g. a mobile drawer).
///
/// Class names follow a `${className}` / `${className}-popover` /
/// `${className}-toggle` / `${className}-inline` convention so each caller
/// can keep its own styles.
function mergeRefs<T>(...refs: Array<React.Ref<T> | null | undefined>) {
  return (el: T | null) => {
    refs.forEach((r) => {
      if (typeof r === "function") r(el);
      else if (r != null) (r as React.MutableRefObject<T | null>).current = el;
    });
  };
}

export interface PopoverPickerProps {
  variant?: "popover" | "inline";
  open: boolean;
  onOpenChange: (v: boolean) => void;
  className: string;
  toggleAriaLabel: string;
  toggleIcon: React.ReactNode;
  popoverAriaLabel: string;
  popoverRef?: React.Ref<HTMLDivElement> | null;
  inlineRef?: React.Ref<HTMLDivElement> | null;
  children: React.ReactNode;
}

export default function PopoverPicker({
  variant = "popover",
  open,
  onOpenChange,
  className,
  toggleAriaLabel,
  toggleIcon,
  popoverAriaLabel,
  popoverRef = null,
  inlineRef = null,
  children,
}: PopoverPickerProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const internalPopoverRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (variant !== "popover" || !open) return undefined;

    // Move focus into the popover so keyboard users land on the first
    // tabbable item rather than staying on the toggle (which would make
    // arrow keys scroll the page and Tab skip past the popover because it
    // sits before the toggle in DOM order). If a consumer hook has already
    // moved focus inside, leave it alone.
    const popover = internalPopoverRef.current;
    if (popover && !popover.contains(document.activeElement)) {
      const focusable = popover.querySelector<HTMLElement>(
        '[tabindex="0"], button:not([disabled]):not([tabindex="-1"]), a[href]:not([tabindex="-1"])',
      );
      focusable?.focus();
    }

    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        onOpenChange(false);
      }
    }
    // Close when focus moves out of the picker container. Without this a
    // keyboard user can Tab from this picker to an adjacent picker's toggle
    // and open the second one while this one stays open, since mousedown
    // never fires.
    function handleFocusOut(e: FocusEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        onOpenChange(false);
      }
    }
    function handleEsc(e: KeyboardEvent) {
      if (e.key === "Escape") {
        onOpenChange(false);
        triggerRef.current?.focus();
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("focusin", handleFocusOut);
    document.addEventListener("keydown", handleEsc);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("focusin", handleFocusOut);
      document.removeEventListener("keydown", handleEsc);
    };
  }, [open, variant, onOpenChange]);

  if (variant === "inline") {
    return (
      <div ref={inlineRef} className={`${className}-inline`}>
        {children}
      </div>
    );
  }

  return (
    <div className={className} ref={containerRef}>
      {open && (
        <div
          ref={mergeRefs(internalPopoverRef, popoverRef)}
          className={`${className}-popover`}
          role="dialog"
          aria-label={popoverAriaLabel}
        >
          {children}
        </div>
      )}
      <button
        ref={triggerRef}
        type="button"
        className={`${className}-toggle`}
        aria-label={toggleAriaLabel}
        aria-expanded={open}
        onClick={() => onOpenChange(!open)}
      >
        {toggleIcon}
      </button>
    </div>
  );
}
