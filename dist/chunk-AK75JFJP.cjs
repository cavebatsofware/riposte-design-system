'use strict';

var jsxRuntime = require('react/jsx-runtime');
var react = require('react');
var reactI18next = require('react-i18next');

// src/components/SkeletonCard.tsx
function SkeletonCard({ withMedia = true }) {
  return /* @__PURE__ */ jsxRuntime.jsxs("article", { className: "skeleton-card", "aria-hidden": "true", children: [
    /* @__PURE__ */ jsxRuntime.jsxs("header", { className: "skeleton-meta", children: [
      /* @__PURE__ */ jsxRuntime.jsx("span", { className: "skeleton-avatar" }),
      /* @__PURE__ */ jsxRuntime.jsxs("span", { className: "skeleton-lines", children: [
        /* @__PURE__ */ jsxRuntime.jsx("span", { className: "skeleton-line skeleton-line-md" }),
        /* @__PURE__ */ jsxRuntime.jsx("span", { className: "skeleton-line skeleton-line-sm" })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "skeleton-body", children: [
      /* @__PURE__ */ jsxRuntime.jsx("span", { className: "skeleton-line skeleton-line-full" }),
      /* @__PURE__ */ jsxRuntime.jsx("span", { className: "skeleton-line skeleton-line-full" }),
      /* @__PURE__ */ jsxRuntime.jsx("span", { className: "skeleton-line skeleton-line-3q" })
    ] }),
    withMedia && /* @__PURE__ */ jsxRuntime.jsx("div", { className: "skeleton-media" })
  ] });
}

// src/components/loadingState.ts
var MIN_VISIBLE_PROGRESS = 8;
var EPSILON = 1e-6;
var total = 0;
var closed = 0;
var snapshot = { progress: 0, visible: false };
var listeners = /* @__PURE__ */ new Set();
function compute() {
  const visible = total > 0 && closed < total - EPSILON;
  let progress = total > 0 ? closed / total * 100 : 0;
  if (visible && progress < MIN_VISIBLE_PROGRESS) progress = MIN_VISIBLE_PROGRESS;
  if (progress > 100) progress = 100;
  return { progress, visible };
}
function emit() {
  snapshot = compute();
  for (const l of listeners) l();
  if (closed > 0 && closed >= total - EPSILON) {
    total = 0;
    closed = 0;
  }
}
function startLoad(opts) {
  if (opts?.hasProgress) {
    const [current] = opts.hasProgress;
    if (current === 1) total += 1;
  } else {
    total += 1;
  }
  emit();
}
function endLoad(opts) {
  if (opts?.hasProgress) {
    const [, target] = opts.hasProgress;
    if (target > 0) closed += 1 / target;
  } else {
    closed += 1;
  }
  emit();
}
function resetLoadCount() {
  total = 0;
  closed = 0;
  snapshot = compute();
  for (const l of listeners) l();
}
function subscribeLoading(l) {
  listeners.add(l);
  return () => {
    listeners.delete(l);
  };
}
function getLoadingSnapshot() {
  return snapshot;
}
function LoadingBar({ label, namespace = "common" }) {
  const { t } = reactI18next.useTranslation(namespace);
  const { progress, visible } = react.useSyncExternalStore(
    subscribeLoading,
    getLoadingSnapshot,
    getLoadingSnapshot
  );
  return /* @__PURE__ */ jsxRuntime.jsx(
    "div",
    {
      className: `loading-bar ${visible ? "is-visible" : ""}`,
      style: { width: `${progress}%` },
      role: "progressbar",
      "aria-label": label ?? t("loading", { defaultValue: "Loading\u2026" }),
      "aria-hidden": !visible,
      "aria-valuemin": 0,
      "aria-valuemax": 100,
      "aria-valuenow": Math.round(progress)
    }
  );
}
var DEFAULT_STORAGE_KEY = "rs_cookie_ack_v1";
function CookieBanner({
  regionLabel,
  text,
  ackLabel,
  namespace = "common",
  storageKey = DEFAULT_STORAGE_KEY
}) {
  const { t } = reactI18next.useTranslation(namespace);
  const [acknowledged, setAcknowledged] = react.useState(() => {
    try {
      return localStorage.getItem(storageKey) === "1";
    } catch {
      return true;
    }
  });
  function handleAck() {
    try {
      localStorage.setItem(storageKey, "1");
    } catch {
    }
    setAcknowledged(true);
  }
  if (acknowledged) {
    return null;
  }
  const region = regionLabel ?? t("cookieBanner.regionLabel", { defaultValue: "Cookie notice" });
  const body = text ?? t("cookieBanner.text", {
    defaultValue: "This site uses cookies that are strictly necessary for sign-in and security. It does not use tracking, analytics, or advertising cookies."
  });
  const ack = ackLabel ?? t("cookieBanner.ack", { defaultValue: "OK" });
  return /* @__PURE__ */ jsxRuntime.jsxs("section", { className: "cookie-banner", "aria-label": region, children: [
    /* @__PURE__ */ jsxRuntime.jsx("p", { children: body }),
    /* @__PURE__ */ jsxRuntime.jsx("button", { type: "button", className: "cookie-banner-ack", onClick: handleAck, children: ack })
  ] });
}
var FOCUSABLE_SELECTOR = [
  "a[href]",
  "area[href]",
  "button:not([disabled])",
  'input:not([disabled]):not([type="hidden"])',
  "select:not([disabled])",
  "textarea:not([disabled])",
  "iframe",
  "object",
  "embed",
  "audio[controls]",
  "video[controls]",
  "summary",
  '[contenteditable]:not([contenteditable="false"])',
  '[tabindex]:not([tabindex="-1"])'
].join(",");
function getFocusable(container) {
  if (!container) return [];
  const nodes = container.querySelectorAll(FOCUSABLE_SELECTOR);
  return Array.from(nodes).filter((el) => {
    if (el.hasAttribute("disabled")) return false;
    if (el.getAttribute("aria-hidden") === "true") return false;
    if (el.offsetParent === null && el.getClientRects().length === 0) {
      return false;
    }
    return true;
  });
}
function useFocusTrap(active, { onEscape, restoreFocus = true } = {}) {
  const containerRef = react.useRef(null);
  const restoreRef = react.useRef(null);
  const onEscapeRef = react.useRef(onEscape);
  react.useEffect(() => {
    onEscapeRef.current = onEscape;
  }, [onEscape]);
  react.useEffect(() => {
    if (!active) return void 0;
    const container = containerRef.current;
    if (!container) return void 0;
    restoreRef.current = restoreFocus && document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const initial = getFocusable(container);
    let addedTabindex = false;
    if (initial.length > 0) {
      initial[0].focus();
    } else {
      if (!container.hasAttribute("tabindex")) {
        container.setAttribute("tabindex", "-1");
        addedTabindex = true;
      }
      container.focus();
    }
    function onKeyDown(e) {
      if (e.key === "Escape" && onEscapeRef.current) {
        e.stopPropagation();
        onEscapeRef.current(e);
        return;
      }
      if (e.key !== "Tab") return;
      if (!container) return;
      const focusable = getFocusable(container);
      if (focusable.length === 0) {
        e.preventDefault();
        return;
      }
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      const activeEl = document.activeElement;
      if (e.shiftKey) {
        if (activeEl === first || !container.contains(activeEl)) {
          e.preventDefault();
          last.focus();
        }
      } else if (activeEl === last) {
        e.preventDefault();
        first.focus();
      }
    }
    container.addEventListener("keydown", onKeyDown);
    return () => {
      container.removeEventListener("keydown", onKeyDown);
      if (addedTabindex) {
        container.removeAttribute("tabindex");
      }
      if (restoreFocus && restoreRef.current && document.contains(restoreRef.current)) {
        restoreRef.current.focus();
      }
      restoreRef.current = null;
    };
  }, [active, restoreFocus]);
  return containerRef;
}
var useFocusTrap_default = useFocusTrap;
function Drawer({
  open,
  onClose,
  label,
  title,
  closeLabel,
  namespace = "common",
  className = "",
  children
}) {
  const { t } = reactI18next.useTranslation(namespace);
  const panelRef = useFocusTrap_default(open, { onEscape: onClose });
  react.useEffect(() => {
    if (!open) return void 0;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);
  const close = closeLabel ?? t("drawer.close", { defaultValue: "Close" });
  const dialogLabel = label ?? (typeof title === "string" ? title : void 0);
  const panelClass = className ? `drawer-panel ${className}` : "drawer-panel";
  return /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "drawer", "data-open": open ? "true" : "false", "aria-hidden": !open, children: [
    /* @__PURE__ */ jsxRuntime.jsx("div", { className: "drawer-backdrop", onClick: onClose, "aria-hidden": "true" }),
    /* @__PURE__ */ jsxRuntime.jsxs("div", { ref: panelRef, className: panelClass, role: "dialog", "aria-modal": "true", "aria-label": dialogLabel, children: [
      title != null && /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "drawer-header", children: [
        /* @__PURE__ */ jsxRuntime.jsx("span", { className: "drawer-title", children: title }),
        /* @__PURE__ */ jsxRuntime.jsx("button", { type: "button", className: "drawer-close", "aria-label": close, onClick: onClose, children: "\xD7" })
      ] }),
      children
    ] })
  ] });
}

exports.CookieBanner = CookieBanner;
exports.Drawer = Drawer;
exports.LoadingBar = LoadingBar;
exports.SkeletonCard = SkeletonCard;
exports.endLoad = endLoad;
exports.getLoadingSnapshot = getLoadingSnapshot;
exports.resetLoadCount = resetLoadCount;
exports.startLoad = startLoad;
exports.subscribeLoading = subscribeLoading;
exports.useFocusTrap_default = useFocusTrap_default;
//# sourceMappingURL=chunk-AK75JFJP.cjs.map
//# sourceMappingURL=chunk-AK75JFJP.cjs.map