import * as react from 'react';
import { ReactNode, ButtonHTMLAttributes, Key } from 'react';

interface SkeletonCardProps {
    /** Render the image-shaped block. Defaults to true. */
    withMedia?: boolean;
}
declare function SkeletonCard({ withMedia }: SkeletonCardProps): react.JSX.Element;

interface LoadingBarProps {
    /**
     * Accessible label for the progressbar. Overrides the i18n bundle.
     * Precedence: this prop > `t("loading")` > "Loading…".
     */
    label?: string;
    /** i18next namespace holding the `loading` key. Defaults to `common`. */
    namespace?: string;
}
declare function LoadingBar({ label, namespace }: LoadingBarProps): react.JSX.Element;

interface CookieBannerProps {
    /** Region (landmark) label. Prop > `t("cookieBanner.regionLabel")` > default. */
    regionLabel?: string;
    /** Banner body text. Prop > `t("cookieBanner.text")` > default. */
    text?: string;
    /** Acknowledge button label. Prop > `t("cookieBanner.ack")` > default. */
    ackLabel?: string;
    /** i18next namespace holding the `cookieBanner.*` keys. Defaults to `common`. */
    namespace?: string;
    /** localStorage key for the persisted acknowledgment. */
    storageKey?: string;
}
declare function CookieBanner({ regionLabel, text, ackLabel, namespace, storageKey, }: CookieBannerProps): react.JSX.Element | null;

interface DrawerProps {
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
declare function Drawer({ open, onClose, label, title, closeLabel, namespace, className, children, }: DrawerProps): react.JSX.Element;

interface FocusTrapOptions {
    onEscape?: (e: KeyboardEvent) => void;
    restoreFocus?: boolean;
}
declare function useFocusTrap<T extends HTMLElement = HTMLElement>(active: boolean, { onEscape, restoreFocus }?: FocusTrapOptions): react.RefObject<T | null>;

type ButtonVariant = "primary" | "secondary" | "success" | "danger";
type ButtonSize = "sm" | "md";
interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    /** Visual weight + intent. Defaults to `primary`. */
    variant?: ButtonVariant;
    /** `sm` for compact rows/toolbars; `md` (default) otherwise. */
    size?: ButtonSize;
    /** Stretch to the container width. */
    fullWidth?: boolean;
}
declare function Button({ variant, size, fullWidth, className, type, ...rest }: ButtonProps): react.JSX.Element;

type BadgeVariant = "primary" | "success" | "danger" | "warning" | "info" | "gray";
interface BadgeProps {
    /** Intent color. Defaults to `gray`. */
    variant?: BadgeVariant;
    /** Smaller padding + font, for dense tables. */
    small?: boolean;
    className?: string;
    children: ReactNode;
}
declare function Badge({ variant, small, className, children, }: BadgeProps): react.JSX.Element;

type AlertVariant = "error" | "success" | "warning" | "info";
interface AlertProps {
    /** Intent. Defaults to `info`. */
    variant?: AlertVariant;
    className?: string;
    children: ReactNode;
}
declare function Alert({ variant, className, children, }: AlertProps): react.JSX.Element;

interface FormGroupProps {
    /** Field label. Omit to render an unlabeled group (e.g. a checkbox row). */
    label?: ReactNode;
    /** `for`/`id` association to the control. */
    htmlFor?: string;
    /** Helper text rendered under the control. */
    hint?: ReactNode;
    className?: string;
    children: ReactNode;
}
declare function FormGroup({ label, htmlFor, hint, className, children, }: FormGroupProps): react.JSX.Element;

interface ToggleSwitchProps {
    checked: boolean;
    onChange: (checked: boolean) => void;
    disabled?: boolean;
    /** Visible text beside the switch; also the accessible name. */
    label?: ReactNode;
    /** Used as the input id and to label the control when `label` is text. */
    id?: string;
    className?: string;
}
declare function ToggleSwitch({ checked, onChange, disabled, label, id, className, }: ToggleSwitchProps): react.JSX.Element;

interface StatCardProps {
    /** Caption above the value. */
    label: ReactNode;
    /** The headline figure. */
    value: ReactNode;
    className?: string;
}
declare function StatCard({ label, value, className }: StatCardProps): react.JSX.Element;

interface TableColumn<Row> {
    /** Property on the row passed to `render`'s first arg, and the cell key. */
    key: string;
    header: ReactNode;
    /** Custom cell renderer; defaults to the raw `row[key]` value. */
    render?: (value: unknown, row: Row) => ReactNode;
}
interface TablePagination {
    page: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}
interface TableLabels {
    loading?: string;
    empty?: string;
    first?: string;
    previous?: string;
    next?: string;
    last?: string;
    /** Page indicator text builder. */
    pageInfo?: (page: number, totalPages: number) => string;
}
interface TableProps<Row> {
    columns: TableColumn<Row>[];
    data: Row[];
    /** Unique row key. Defaults to `row.id`. */
    getRowKey?: (row: Row) => Key;
    /** Extra class for a row (e.g. to flag a failed or current-user row). */
    getRowClassName?: (row: Row) => string;
    loading?: boolean;
    /** Convenience override for `labels.empty` (kept for back-compat). */
    emptyMessage?: string;
    pagination?: TablePagination;
    labels?: TableLabels;
}
declare function Table<Row extends object>({ columns, data, getRowKey, getRowClassName, loading, emptyMessage, pagination, labels, }: TableProps<Row>): react.JSX.Element;

interface ModalProps {
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
declare function Modal({ open, onClose, title, children, footer, closeLabel, className, }: ModalProps): react.JSX.Element | null;

/**
 * Bucket-based loading state for the header progress bar (rendered by
 * <LoadingBar>).
 *
 * A caller reserves one unit on `startLoad` and closes it on `endLoad`. The
 * bar is visible while any unit is open; width is the ratio of closed to total
 * units.
 *
 * Sequential loop callers pass `hasProgress: [batchNumber, totalBatches]` so
 * the loop counts as one logical unit even though it makes N calls. The first
 * batch (`current === 1`) reserves the unit; each batch's `endLoad` closes
 * `1 / totalBatches` of that unit.
 *
 * When the bucket drains (closed >= total) it resets so the next flurry starts
 * at 0%. `resetLoadCount` is exposed for explicit resets, e.g. on route change.
 */
interface LoadingState {
    /** 0-100. Width of the bar. */
    progress: number;
    /** Whether the bar should be on screen (drives opacity). */
    visible: boolean;
}
interface LoadOptions {
    /** `[batchNumber, totalBatches]` for serial loop callers. */
    hasProgress?: [number, number];
}
type Listener = () => void;
declare function startLoad(opts?: LoadOptions): void;
declare function endLoad(opts?: LoadOptions): void;
declare function resetLoadCount(): void;
declare function subscribeLoading(l: Listener): () => void;
declare function getLoadingSnapshot(): LoadingState;

export { Alert, type AlertProps, type AlertVariant, Badge, type BadgeProps, type BadgeVariant, Button, type ButtonProps, type ButtonSize, type ButtonVariant, CookieBanner, type CookieBannerProps, Drawer, type DrawerProps, type FocusTrapOptions, FormGroup, type FormGroupProps, type LoadOptions, LoadingBar, type LoadingBarProps, type LoadingState, Modal, type ModalProps, SkeletonCard, type SkeletonCardProps, StatCard, type StatCardProps, Table, type TableColumn, type TableLabels, type TablePagination, type TableProps, ToggleSwitch, type ToggleSwitchProps, endLoad, getLoadingSnapshot, resetLoadCount, startLoad, subscribeLoading, useFocusTrap };
