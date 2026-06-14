import * as react from 'react';
import { ReactNode } from 'react';

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

export { CookieBanner, type CookieBannerProps, Drawer, type DrawerProps, type FocusTrapOptions, type LoadOptions, LoadingBar, type LoadingBarProps, type LoadingState, SkeletonCard, type SkeletonCardProps, endLoad, getLoadingSnapshot, resetLoadCount, startLoad, subscribeLoading, useFocusTrap };
