import { jsxs, jsx } from 'react/jsx-runtime';
import { useSyncExternalStore, useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

// src/components/SkeletonCard.tsx
function SkeletonCard({ withMedia = true }) {
  return /* @__PURE__ */ jsxs("article", { className: "skeleton-card", "aria-hidden": "true", children: [
    /* @__PURE__ */ jsxs("header", { className: "skeleton-meta", children: [
      /* @__PURE__ */ jsx("span", { className: "skeleton-avatar" }),
      /* @__PURE__ */ jsxs("span", { className: "skeleton-lines", children: [
        /* @__PURE__ */ jsx("span", { className: "skeleton-line skeleton-line-md" }),
        /* @__PURE__ */ jsx("span", { className: "skeleton-line skeleton-line-sm" })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "skeleton-body", children: [
      /* @__PURE__ */ jsx("span", { className: "skeleton-line skeleton-line-full" }),
      /* @__PURE__ */ jsx("span", { className: "skeleton-line skeleton-line-full" }),
      /* @__PURE__ */ jsx("span", { className: "skeleton-line skeleton-line-3q" })
    ] }),
    withMedia && /* @__PURE__ */ jsx("div", { className: "skeleton-media" })
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
  const { t } = useTranslation(namespace);
  const { progress, visible } = useSyncExternalStore(
    subscribeLoading,
    getLoadingSnapshot,
    getLoadingSnapshot
  );
  return /* @__PURE__ */ jsx(
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
  const { t } = useTranslation(namespace);
  const [acknowledged, setAcknowledged] = useState(() => {
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
  return /* @__PURE__ */ jsxs("section", { className: "cookie-banner", "aria-label": region, children: [
    /* @__PURE__ */ jsx("p", { children: body }),
    /* @__PURE__ */ jsx("button", { type: "button", className: "cookie-banner-ack", onClick: handleAck, children: ack })
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
  const containerRef = useRef(null);
  const restoreRef = useRef(null);
  const onEscapeRef = useRef(onEscape);
  useEffect(() => {
    onEscapeRef.current = onEscape;
  }, [onEscape]);
  useEffect(() => {
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
  const { t } = useTranslation(namespace);
  const panelRef = useFocusTrap_default(open, { onEscape: onClose });
  useEffect(() => {
    if (!open) return void 0;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);
  const close = closeLabel ?? t("drawer.close", { defaultValue: "Close" });
  const dialogLabel = label ?? (typeof title === "string" ? title : void 0);
  const panelClass = className ? `drawer-panel ${className}` : "drawer-panel";
  return /* @__PURE__ */ jsxs("div", { className: "drawer", "data-open": open ? "true" : "false", "aria-hidden": !open, children: [
    /* @__PURE__ */ jsx("div", { className: "drawer-backdrop", onClick: onClose, "aria-hidden": "true" }),
    /* @__PURE__ */ jsxs("div", { ref: panelRef, className: panelClass, role: "dialog", "aria-modal": "true", "aria-label": dialogLabel, children: [
      title != null && /* @__PURE__ */ jsxs("div", { className: "drawer-header", children: [
        /* @__PURE__ */ jsx("span", { className: "drawer-title", children: title }),
        /* @__PURE__ */ jsx("button", { type: "button", className: "drawer-close", "aria-label": close, onClick: onClose, children: "\xD7" })
      ] }),
      children
    ] })
  ] });
}
function Button({
  variant = "primary",
  size = "md",
  fullWidth = false,
  className = "",
  type = "button",
  ...rest
}) {
  const classes = [
    "rds-btn",
    `rds-btn-${variant}`,
    size === "sm" && "rds-btn-sm",
    fullWidth && "rds-btn-full",
    className
  ].filter(Boolean).join(" ");
  return /* @__PURE__ */ jsx("button", { type, className: classes, ...rest });
}
function Badge({
  variant = "gray",
  small = false,
  className = "",
  children
}) {
  const classes = [
    "rds-badge",
    `rds-badge-${variant}`,
    small && "rds-badge-sm",
    className
  ].filter(Boolean).join(" ");
  return /* @__PURE__ */ jsx("span", { className: classes, children });
}
function Alert({
  variant = "info",
  className = "",
  children
}) {
  const classes = ["rds-alert", `rds-alert-${variant}`, className].filter(Boolean).join(" ");
  return /* @__PURE__ */ jsx("div", { className: classes, role: variant === "error" ? "alert" : "status", children });
}
function FormGroup({
  label,
  htmlFor,
  hint,
  className = "",
  children
}) {
  const classes = ["rds-form-group", className].filter(Boolean).join(" ");
  return /* @__PURE__ */ jsxs("div", { className: classes, children: [
    label != null && /* @__PURE__ */ jsx("label", { htmlFor, children: label }),
    children,
    hint != null && /* @__PURE__ */ jsx("small", { children: hint })
  ] });
}
function ToggleSwitch({
  checked,
  onChange,
  disabled = false,
  label,
  id,
  className = ""
}) {
  const classes = ["rds-toggle", className].filter(Boolean).join(" ");
  return /* @__PURE__ */ jsxs("label", { className: classes, children: [
    /* @__PURE__ */ jsx(
      "input",
      {
        type: "checkbox",
        id,
        checked,
        disabled,
        onChange: (e) => onChange(e.target.checked)
      }
    ),
    /* @__PURE__ */ jsx("span", { className: "rds-toggle-slider", "aria-hidden": "true" }),
    label != null && /* @__PURE__ */ jsx("span", { className: "rds-toggle-label", children: label })
  ] });
}
function StatCard({ label, value, className = "" }) {
  const classes = ["rds-stat-card", className].filter(Boolean).join(" ");
  return /* @__PURE__ */ jsxs("div", { className: classes, children: [
    /* @__PURE__ */ jsx("div", { className: "rds-stat-label", children: label }),
    /* @__PURE__ */ jsx("div", { className: "rds-stat-value", children: value })
  ] });
}
var DEFAULTS = {
  loading: "Loading\u2026",
  empty: "No data available",
  first: "First",
  previous: "Previous",
  next: "Next",
  last: "Last",
  pageInfo: (page, totalPages) => `Page ${page} of ${totalPages}`
};
function Table({
  columns,
  data,
  getRowKey = (row) => row.id ?? JSON.stringify(row),
  getRowClassName,
  loading = false,
  emptyMessage,
  pagination,
  labels
}) {
  const l = { ...DEFAULTS, ...labels };
  const empty = emptyMessage ?? l.empty;
  if (loading) {
    return /* @__PURE__ */ jsx("div", { className: "rds-table-loading", children: l.loading });
  }
  if (!data || data.length === 0) {
    return /* @__PURE__ */ jsx("div", { className: "rds-table-empty", children: /* @__PURE__ */ jsx("p", { children: empty }) });
  }
  return /* @__PURE__ */ jsxs("div", { className: "rds-table-container", children: [
    /* @__PURE__ */ jsxs("table", { className: "rds-data-table", children: [
      /* @__PURE__ */ jsx("thead", { children: /* @__PURE__ */ jsx("tr", { children: columns.map((col) => /* @__PURE__ */ jsx("th", { children: col.header }, col.key)) }) }),
      /* @__PURE__ */ jsx("tbody", { children: data.map((row) => /* @__PURE__ */ jsx(
        "tr",
        {
          className: getRowClassName ? getRowClassName(row) : void 0,
          children: columns.map((col) => /* @__PURE__ */ jsx("td", { children: col.render ? col.render(row[col.key], row) : row[col.key] ?? null }, col.key))
        },
        getRowKey(row)
      )) })
    ] }),
    pagination && pagination.totalPages > 1 && /* @__PURE__ */ jsxs("div", { className: "rds-pagination", children: [
      /* @__PURE__ */ jsx(
        "button",
        {
          type: "button",
          onClick: () => pagination.onPageChange(1),
          disabled: pagination.page === 1,
          className: "rds-pagination-btn",
          children: l.first
        }
      ),
      /* @__PURE__ */ jsx(
        "button",
        {
          type: "button",
          onClick: () => pagination.onPageChange(pagination.page - 1),
          disabled: pagination.page === 1,
          className: "rds-pagination-btn",
          children: l.previous
        }
      ),
      /* @__PURE__ */ jsx("span", { className: "rds-pagination-info", children: l.pageInfo(pagination.page, pagination.totalPages) }),
      /* @__PURE__ */ jsx(
        "button",
        {
          type: "button",
          onClick: () => pagination.onPageChange(pagination.page + 1),
          disabled: pagination.page === pagination.totalPages,
          className: "rds-pagination-btn",
          children: l.next
        }
      ),
      /* @__PURE__ */ jsx(
        "button",
        {
          type: "button",
          onClick: () => pagination.onPageChange(pagination.totalPages),
          disabled: pagination.page === pagination.totalPages,
          className: "rds-pagination-btn",
          children: l.last
        }
      )
    ] })
  ] });
}
function Modal({
  open = true,
  onClose,
  title,
  children,
  footer,
  closeLabel = "Close",
  className = ""
}) {
  const ref = useFocusTrap(open, { onEscape: onClose });
  if (!open) return null;
  const classes = ["rds-modal", className].filter(Boolean).join(" ");
  return /* @__PURE__ */ jsx(
    "div",
    {
      className: "rds-modal-overlay",
      onClick: (e) => {
        if (e.target === e.currentTarget) onClose();
      },
      children: /* @__PURE__ */ jsxs(
        "div",
        {
          ref,
          className: classes,
          role: "dialog",
          "aria-modal": "true",
          "aria-label": typeof title === "string" ? title : void 0,
          children: [
            /* @__PURE__ */ jsxs("div", { className: "rds-modal-header", children: [
              title != null && /* @__PURE__ */ jsx("h2", { className: "rds-modal-title", children: title }),
              /* @__PURE__ */ jsx(
                "button",
                {
                  type: "button",
                  className: "rds-modal-close",
                  "aria-label": closeLabel,
                  onClick: onClose,
                  children: "\xD7"
                }
              )
            ] }),
            /* @__PURE__ */ jsx("div", { className: "rds-modal-body", children }),
            footer != null && /* @__PURE__ */ jsx("div", { className: "rds-modal-footer", children: footer })
          ]
        }
      )
    }
  );
}

export { Alert, Badge, Button, CookieBanner, Drawer, FormGroup, LoadingBar, Modal, SkeletonCard, StatCard, Table, ToggleSwitch, endLoad, getLoadingSnapshot, resetLoadCount, startLoad, subscribeLoading, useFocusTrap_default };
//# sourceMappingURL=chunk-2S5E4OKE.js.map
//# sourceMappingURL=chunk-2S5E4OKE.js.map