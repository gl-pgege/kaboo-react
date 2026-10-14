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
import "@pgege/kaboo-react/styles.css";
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

## Questions and approvals

The question card, the approval card, the batch bar and the permission list use
the same tokens (`--kaboo-card`, `--kaboo-border`, `--kaboo-muted`,
`--kaboo-success`, `--kaboo-success-bg`, `--kaboo-accent`, `--kaboo-warning`)
and a stable set of class names, so you restyle them instead of rebuilding them.
These names are part of the public surface and change only with an entry in the
upgrade guide.

| Element | Class |
|---|---|
| Any request card | `kaboo-interrupt` (with `kaboo-interrupt-approval`, `kaboo-interrupt-form` or `kaboo-interrupt-custom`) |
| Card heading | `kaboo-interrupt-header`, `kaboo-interrupt-message` |
| Buttons | `kaboo-interrupt-btn`, plus `-approve`, `-reject`, `-next`, `-back`, `-skip` |
| Question text, steps | `kaboo-interrupt-question`, `kaboo-interrupt-progress` |
| Options | `kaboo-interrupt-choices`, `kaboo-interrupt-option`, `kaboo-interrupt-option-selected` |
| The Other row | `kaboo-interrupt-option-other`, `kaboo-interrupt-other-input` |
| What a wider approval covers ("Applies to …"), input | `kaboo-approval-covers`, `kaboo-interrupt-details`, `kaboo-interrupt-pre` |
| Approval buttons | `kaboo-approval-actions`, `kaboo-approval-scope` (`-thread`, `-always`), `kaboo-approval-dismiss` |
| Deny with a reason | `kaboo-approval-deny`, `kaboo-approval-reason` |
| Deadline | `kaboo-approval-expiry`, `kaboo-approval-expired` |
| Approve all / Deny all | `kaboo-approval-batch`, `kaboo-approval-batch-count` |
| Answered | `kaboo-interrupt-responded` |
| Remembered permissions | `kaboo-permissions`, `kaboo-permission`, `kaboo-permission-label`, `kaboo-permission-scope`, `kaboo-permission-revoke` |

For example, pill-shaped options and a brand-coloured selection:

```css
.kaboo-interrupt-option {
  border-radius: 999px;
}
.kaboo-interrupt-option-selected,
.kaboo-interrupt-btn-approve {
  border-color: var(--primary);
  background: color-mix(in srgb, var(--primary) 12%, transparent);
  color: var(--primary);
}
```

Replace a card entirely with `interruptRenderers` only when its structure must
change — see [Human-in-the-loop](hitl.md#custom-renderers).
