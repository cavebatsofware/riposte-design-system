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
import { useEffect, type RefObject } from "react";

export interface RovingFocusOptions {
  /** CSS selector for the navigable items. Defaults to the ARIA menu roles. */
  selector?: string;
  /** Arrow-key axis. Defaults to vertical. */
  orientation?: "vertical" | "horizontal";
  /** Wrap from the last item back to the first (and vice versa). Default true. */
  wrap?: boolean;
  /** Move DOM focus into the list on activation. Default true. */
  autoFocus?: boolean;
}

const DEFAULT_SELECTOR =
  '[role="menuitem"], [role="menuitemradio"], [role="menuitemcheckbox"]';

/// Wire roving-focus keyboard navigation onto a popover container.
///
/// Listens for Arrow / Home / End on the container element while `active`
/// is true and moves focus across the matching descendants (default: any
/// element with a `menuitem`, `menuitemradio`, or `menuitemcheckbox` role).
///
/// Implements the WAI-ARIA menu pattern's roving tabindex: only one item is
/// in the tab order at a time (`tabindex="0"`), and arrow keys move both DOM
/// focus and the tab-order anchor across items. Tab from inside the menu
/// therefore exits to the next focusable element in the document instead of
/// cycling through siblings.
///
/// On activation the active item (or the first item if none is marked active)
/// receives focus so screen reader users land inside the menu without an extra
/// Tab. Consumers that need a focus trap should compose with a trap hook.
export function useRovingFocus(
  containerRef: RefObject<HTMLElement | null>,
  active: boolean,
  {
    selector = DEFAULT_SELECTOR,
    orientation = "vertical",
    wrap = true,
    autoFocus = true,
  }: RovingFocusOptions = {},
) {
  useEffect(() => {
    if (!active) return undefined;
    const container = containerRef.current;
    if (!container) return undefined;

    function items(): HTMLElement[] {
      return Array.from(
        container!.querySelectorAll<HTMLElement>(selector),
      ).filter((el) => !el.hasAttribute("disabled"));
    }

    function setRovingTabIndex(list: HTMLElement[], focusedIndex: number) {
      list.forEach((el, i) => {
        el.tabIndex = i === focusedIndex ? 0 : -1;
      });
    }

    const initial = items();
    if (initial.length > 0) {
      // Anchor the tab order on the first menuitemradio that's already
      // checked, otherwise the first item.
      const checkedIdx = initial.findIndex(
        (el) => el.getAttribute("aria-checked") === "true",
      );
      const startIdx = checkedIdx >= 0 ? checkedIdx : 0;
      setRovingTabIndex(initial, startIdx);
      if (autoFocus) initial[startIdx].focus();
    }

    const nextKey = orientation === "horizontal" ? "ArrowRight" : "ArrowDown";
    const prevKey = orientation === "horizontal" ? "ArrowLeft" : "ArrowUp";

    function onKeyDown(e: KeyboardEvent) {
      if (![nextKey, prevKey, "Home", "End"].includes(e.key)) return;
      const list = items();
      if (list.length === 0) return;
      const current = document.activeElement as HTMLElement | null;
      const idx = current ? list.indexOf(current) : -1;
      let next: number;
      if (e.key === "Home") {
        next = 0;
      } else if (e.key === "End") {
        next = list.length - 1;
      } else if (e.key === nextKey) {
        next = idx + 1;
        if (next >= list.length) next = wrap ? 0 : list.length - 1;
      } else {
        next = idx - 1;
        if (next < 0) next = wrap ? list.length - 1 : 0;
      }
      e.preventDefault();
      setRovingTabIndex(list, next);
      list[next].focus();
    }

    // Click on any item also re-anchors the tab order. Without this, a
    // consumer that updates selection state via click leaves the tab-order
    // anchor stuck on the previously-selected item: aria-checked follows
    // React state, but tabindex was set imperatively at activation and never
    // moves.
    function onClick(e: MouseEvent) {
      const target = (e.target as HTMLElement | null)?.closest<HTMLElement>(
        selector,
      );
      if (!target) return;
      const list = items();
      const idx = list.indexOf(target);
      if (idx >= 0) setRovingTabIndex(list, idx);
    }

    container.addEventListener("keydown", onKeyDown);
    container.addEventListener("click", onClick);
    return () => {
      container.removeEventListener("keydown", onKeyDown);
      container.removeEventListener("click", onClick);
      // Restore items to default tab order on cleanup so the next mount
      // starts from a clean slate.
      items().forEach((el) => {
        el.removeAttribute("tabindex");
      });
    };
  }, [active, containerRef, selector, orientation, wrap, autoFocus]);
}

export default useRovingFocus;
