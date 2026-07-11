# Theming

kaboo-react ships a single stylesheet and styles everything with CSS variables,
so it blends into your app's design system and is easy to override.

## How styling works

Components read standard design-system tokens with neutral fallbacks:

- `--background`, `--foreground`
- `--card`
- `--muted`, `--muted-foreground`
- `--border`

If your app already defines these (as most design systems / shadcn setups do),
kaboo-react inherits them automatically. Otherwise it falls back to sensible
neutral defaults.

## Import the stylesheet

Import it once, near your app root:

```ts
import "@kaboo/react/styles.css";
```

The package sets `"sideEffects": ["*.css"]`, so bundlers keep the stylesheet even
with tree-shaking enabled.

## Override tokens

Status colors and other accents are exposed as `--kaboo-*` variables. Set them on
any parent element (e.g. `:root`) to override:

```css
:root {
  --kaboo-running: #d97706;
  --kaboo-warning: #f59e0b;
  --kaboo-success: #16a34a;
}
```

## Dark mode

Because components read `--background` / `--foreground` / `--card` etc., dark mode
works by toggling those tokens the same way you do for the rest of your app (for
example, a `.dark` class on `<html>` that redefines the variables). No
kaboo-specific dark-mode configuration is required.
