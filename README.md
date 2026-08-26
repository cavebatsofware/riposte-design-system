# @cavebatsofware/riposte-design-system

The shared design foundation for Riposte Social and the SPAs deployed alongside
it. It owns the canonical design tokens, the theme engine, an accessible
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
  typography/spacing/radius/shadow scale in `tokens.css`. A size-constrained
  consumer can take one colorway instead of all sixteen blocks:
  `palette/<colorway>.css` carries that colorway's light and dark blocks and
  nothing else.
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
`./styles/components.css` individually, plus
`./styles/palette/<colorway>.css` for a single colorway):

```ts
// One colorway, about 2.3 KB instead of the 19 KB catalog. The document sets
// data-theme itself; these files carry no `:root` default.
import "@cavebatsofware/riposte-design-system/styles/palette/forest.css";
```

## Rust crate

The repo is polyglot: alongside the npm package, `crate/` is a Rust crate
(`riposte-design-system`) that gives a Rust backend the branded email *mechanism*
and the shared CSS. It owns the mechanism and brand presentation, not the
email content (the per-locale string catalogs belong to the consuming app,
which configures them per deployment):

- `EMAIL_LAYOUT` / `email_layout()`: the shared, inline-safe HTML email shell.
- `deep_merge()` / `build_catalog()`: layer per-deployment operator overrides
  over an app's default catalogs into a ready `i18n_md_email_templates::Catalog`.
- `stylesheet()` and the `*_CSS` constants: the same palette / token / component
  CSS the npm package ships (read from `styles/` via `include_str!`), for serving
  or server-side rendering.

Consume it as a git dependency (the crate lives in `crate/`, discovered via the
root workspace manifest):

```toml
riposte-design-system = { git = "https://github.com/cavebatsofware/riposte-design-system.git" }
```

```sh
cargo test   # builds the crate and checks locale parity + asset wiring
```

## Develop

```sh
bun install
bun run build         # splits the palette, then tsup: ESM + CJS + .d.ts
bun run typecheck     # tsc --noEmit
bun run palette:check # per-colorway files still match styles/palette.css
```

`styles/palette/*.css` is generated from `styles/palette.css` by
`scripts/split-palette.ts`, which `bun run build` runs first. Edit the
concatenated file; the parts follow.

## License

GPL-3.0-only. Copyright (C) 2026 Grant DeFayette.
