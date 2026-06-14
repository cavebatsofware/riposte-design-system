# @cavebatsofware/riposte-design-system

The shared design foundation for Riposte Social and the SPAs deployed alongside
it (the picnic-table-configurator and other per-deployment configurators). It
owns the canonical design tokens, the theme engine, an accessible
popover/roving-focus chassis, and the shared, app-agnostic components.

`@cavebatsofware/riposte-pickers` (the theme and language pickers) builds on this
package; so does `social-frontend`. `admin-frontend` normalizes on it over time.

> Status: Phase 0 scaffold. The package builds and publishes its export surface,
> but the modules are being populated by the extraction described in
> `riposte-social/docs/design-system-extraction-plan.md`.

## What it provides

- **Design tokens** (`./styles`): eight colorways, each with a light and dark
  variant, including three WCAG 2.1 accessibility colorways (`daltonia`,
  `tritan`, `achroma`). Color tokens in `palette.css`, the shared
  typography/spacing/radius/shadow scale in `tokens.css`.
- **Theme engine** (`./theme`): `ThemeProvider` / `useTheme`, a
  localStorage-backed colorway + light/dark store that tracks the OS preference
  until the user makes an explicit choice. The colorway catalog is injectable,
  so a downstream SPA can ship its own.
- **Chassis** (`./shared`): `PopoverPicker` and `useRovingFocus`, the accessible
  toggle/popover/keyboard foundation the pickers and menus are built on.
- **Components** (`./components`): app-agnostic UI (visibility badge/menu/picker,
  skeleton card, loading bar, cookie banner, a headless drawer).
- **i18n** (`./i18n`): resource bundles in all five base languages, merged into
  your i18next instance. Components also accept label props that override the
  bundle (prop > bundle > English default).

## Install

```sh
bun add @cavebatsofware/riposte-design-system
```

Peer dependencies: `react >=18`, `react-dom >=18`, `react-i18next >=13`.

## Usage

```tsx
// Tokens + component styles (once, at the app root).
import "@cavebatsofware/riposte-design-system/styles";

import { ThemeProvider } from "@cavebatsofware/riposte-design-system/theme";

export function App({ children }) {
  return <ThemeProvider>{children}</ThemeProvider>;
}
```

Subpath exports: `.`, `./theme`, `./shared`, `./components`, `./i18n`,
`./styles` (and `./styles/palette.css`, `./styles/tokens.css`,
`./styles/components.css` individually).

## Develop

```sh
bun install
bun run build       # tsup: ESM + CJS + .d.ts for every entry
bun run typecheck   # tsc --noEmit
```

## License

GPL-3.0-only. Copyright (C) 2026 Grant DeFayette.
