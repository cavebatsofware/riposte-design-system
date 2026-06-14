import react__default, { RefObject } from 'react';

interface PopoverPickerProps {
    variant?: "popover" | "inline";
    open: boolean;
    onOpenChange: (v: boolean) => void;
    className: string;
    toggleAriaLabel: string;
    toggleIcon: react__default.ReactNode;
    popoverAriaLabel: string;
    popoverRef?: react__default.Ref<HTMLDivElement> | null;
    inlineRef?: react__default.Ref<HTMLDivElement> | null;
    children: react__default.ReactNode;
}
declare function PopoverPicker({ variant, open, onOpenChange, className, toggleAriaLabel, toggleIcon, popoverAriaLabel, popoverRef, inlineRef, children, }: PopoverPickerProps): react__default.JSX.Element;

interface RovingFocusOptions {
    /** CSS selector for the navigable items. Defaults to the ARIA menu roles. */
    selector?: string;
    /** Arrow-key axis. Defaults to vertical. */
    orientation?: "vertical" | "horizontal";
    /** Wrap from the last item back to the first (and vice versa). Default true. */
    wrap?: boolean;
    /** Move DOM focus into the list on activation. Default true. */
    autoFocus?: boolean;
}
declare function useRovingFocus(containerRef: RefObject<HTMLElement | null>, active: boolean, { selector, orientation, wrap, autoFocus, }?: RovingFocusOptions): void;

export { PopoverPicker, type PopoverPickerProps, type RovingFocusOptions, useRovingFocus };
