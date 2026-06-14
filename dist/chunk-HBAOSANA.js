import { useRef, useEffect } from 'react';
import { jsx, jsxs } from 'react/jsx-runtime';

// src/shared/PopoverPicker.tsx
function mergeRefs(...refs) {
  return (el) => {
    refs.forEach((r) => {
      if (typeof r === "function") r(el);
      else if (r != null) r.current = el;
    });
  };
}
function PopoverPicker({
  variant = "popover",
  open,
  onOpenChange,
  className,
  toggleAriaLabel,
  toggleIcon,
  popoverAriaLabel,
  popoverRef = null,
  inlineRef = null,
  children
}) {
  const containerRef = useRef(null);
  const triggerRef = useRef(null);
  const internalPopoverRef = useRef(null);
  useEffect(() => {
    if (variant !== "popover" || !open) return void 0;
    const popover = internalPopoverRef.current;
    if (popover && !popover.contains(document.activeElement)) {
      const focusable = popover.querySelector(
        '[tabindex="0"], button:not([disabled]):not([tabindex="-1"]), a[href]:not([tabindex="-1"])'
      );
      focusable?.focus();
    }
    function handleClickOutside(e) {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        onOpenChange(false);
      }
    }
    function handleFocusOut(e) {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        onOpenChange(false);
      }
    }
    function handleEsc(e) {
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
    return /* @__PURE__ */ jsx("div", { ref: inlineRef, className: `${className}-inline`, children });
  }
  return /* @__PURE__ */ jsxs("div", { className, ref: containerRef, children: [
    open && /* @__PURE__ */ jsx(
      "div",
      {
        ref: mergeRefs(internalPopoverRef, popoverRef),
        className: `${className}-popover`,
        role: "dialog",
        "aria-label": popoverAriaLabel,
        children
      }
    ),
    /* @__PURE__ */ jsx(
      "button",
      {
        ref: triggerRef,
        type: "button",
        className: `${className}-toggle`,
        "aria-label": toggleAriaLabel,
        "aria-expanded": open,
        onClick: () => onOpenChange(!open),
        children: toggleIcon
      }
    )
  ] });
}
var DEFAULT_SELECTOR = '[role="menuitem"], [role="menuitemradio"], [role="menuitemcheckbox"]';
function useRovingFocus(containerRef, active, {
  selector = DEFAULT_SELECTOR,
  orientation = "vertical",
  wrap = true,
  autoFocus = true
} = {}) {
  useEffect(() => {
    if (!active) return void 0;
    const container = containerRef.current;
    if (!container) return void 0;
    function items() {
      return Array.from(
        container.querySelectorAll(selector)
      ).filter((el) => !el.hasAttribute("disabled"));
    }
    function setRovingTabIndex(list, focusedIndex) {
      list.forEach((el, i) => {
        el.tabIndex = i === focusedIndex ? 0 : -1;
      });
    }
    const initial = items();
    if (initial.length > 0) {
      const checkedIdx = initial.findIndex(
        (el) => el.getAttribute("aria-checked") === "true"
      );
      const startIdx = checkedIdx >= 0 ? checkedIdx : 0;
      setRovingTabIndex(initial, startIdx);
      if (autoFocus) initial[startIdx].focus();
    }
    const nextKey = orientation === "horizontal" ? "ArrowRight" : "ArrowDown";
    const prevKey = orientation === "horizontal" ? "ArrowLeft" : "ArrowUp";
    function onKeyDown(e) {
      if (![nextKey, prevKey, "Home", "End"].includes(e.key)) return;
      const list = items();
      if (list.length === 0) return;
      const current = document.activeElement;
      const idx = current ? list.indexOf(current) : -1;
      let next;
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
    function onClick(e) {
      const target = e.target?.closest(
        selector
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
      items().forEach((el) => {
        el.removeAttribute("tabindex");
      });
    };
  }, [active, containerRef, selector, orientation, wrap, autoFocus]);
}
var useRovingFocus_default = useRovingFocus;

export { PopoverPicker, useRovingFocus_default };
//# sourceMappingURL=chunk-HBAOSANA.js.map
//# sourceMappingURL=chunk-HBAOSANA.js.map