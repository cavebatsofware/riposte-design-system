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

// Shared chassis: the accessible toggle/popover/focus shell and the
// roving-focus keyboard hook. The pickers (riposte-pickers) and the shared
// components both build on this foundation.
export { default as PopoverPicker } from "./PopoverPicker";
export type { PopoverPickerProps } from "./PopoverPicker";

export { default as useRovingFocus } from "./useRovingFocus";
export type { RovingFocusOptions } from "./useRovingFocus";
