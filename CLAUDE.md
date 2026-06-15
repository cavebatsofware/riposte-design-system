# riposte-design-system

The shared design foundation for the Riposte platform: design tokens, the theme
engine, an accessible popover/roving-focus chassis, shared components, the email
mechanism, and the canonical CSS. Consumed by every Riposte SPA (social now,
admin soon) and by host-built SPAs that extend the core (e.g. the
picnic-table-configurator). Keep it app-agnostic: domain UI, content, contexts,
and routing belong in the consuming app, never here.

## Polyglot package

One repo, two artifacts:
- npm package at the root: TS + CSS built with `tsup` to `dist/` (ESM + CJS +
  types). Subpath exports: `./theme`, `./shared`, `./components`, `./i18n`,
  `./styles` (+ `palette.css` / `tokens.css` / `components.css`).
- Rust crate in `crate/`: the branded email layout shell, a catalog merge
  helper, and accessors for the shared CSS. Backends consume it as a cargo git
  dependency.

## Commands

```bash
bun install
bun run build       # tsup → dist/ (ESM + CJS + .d.ts)
bun run typecheck   # tsc --noEmit
cd crate && cargo test
```

- `dist/` IS committed. Consumers install via `github:` (npm) or cargo git, which
  run no build step, so rebuild and recommit `dist/` whenever `src/` or `styles/`
  changes; a push without fresh `dist/` ships stale output.

## Architecture

- `src/theme/`: `ThemeProvider`, `useTheme`, `COLORWAYS`. The colorway catalog
  is injectable so a host SPA can ship its own.
- `src/shared/`: `PopoverPicker`, `useRovingFocus`: the chassis the pickers and
  components build on.
- `src/components/`: app-agnostic components (SkeletonCard, LoadingBar,
  CookieBanner, headless Drawer, useFocusTrap) and the LoadingBar store.
- `src/i18n/`: resource bundles a consumer merges into its own i18next instance.
- `styles/`: `palette.css` (8 colorways x light/dark, including 3 WCAG
  accessibility colorways), `tokens.css`, `components.css`. The single source of
  truth for design tokens.
- `crate/`: Rust side; default email copy lives in the consuming app, not here.

## Conventions

- Tokens are the single source of truth. Never hardcode hex; read `--color-*`,
  `--spacing-*`, `--radius-*`, `--font-*`.
- Components stay consumer-agnostic. Every user-facing string is an optional
  label prop that overrides the i18n bundle: prop > bundle > built-in English
  default. No app vocabulary, no app contexts, no router imports.
- Tooling and scripts: bun only. Never npm, never python.
- No em-dash (U+2014) anywhere: comments, prose, commits, any output.
- Comments are not commit messages: describe current behavior, never the change.
  Explain once at the implementation, not at call sites or wrappers. Default to
  none; otherwise the minimum that clarifies what non-obvious code does, a fuller
  WHY only when needed. Verbosity is a cost, not a virtue.
- `riposte-pickers` depends on this package for the engine and chassis; never
  add a dependency back on pickers (no cycle).
