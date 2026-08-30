---
name: design-token-guardian
description: Enforce iHeartTheatre's canonical gold/red design system. Use when reviewing, editing, or generating any CSS/HTML to detect palette drift (purple #667eea/#764ba2 is DEPRECATED), wrong theme-color, purple gradients, and design token misuse. Produces a drift report and fixes. DO NOT USE FOR content writing.
---

# design-token-guardian

The canonical design system is the **gold/red curtain** palette. The legacy purple palette (`#667eea`, `#764ba2`) is DEPRECATED and must never be introduced or reintroduced.

## Canonical tokens

| Purpose | Value |
|---|---|
| Primary accent (gold) | `#e8b923` |
| Secondary accent (curtain red) | `#b91c1c` |
| Bright gold | `#ffd700` |
| Primary gradient | `linear-gradient(135deg, #e8b923 0%, #b91c1c 100%)` |
| Gold gradient | `linear-gradient(135deg, #ffd700 0%, #ffb347 100%)` |
| Background base | `#050508` · panels `#0a0a0f` · elevated `#12121a` |
| Text primary | `#f5f5f5` · secondary `#c0c0d0` |
| theme-color meta + manifest | `#e8b923` |

## Audit checklist (run against changed/all files)

1. Search for purple literals: `#667eea`, `#764ba2`, and rgba of `102,126,234` / `118,75,162`.
   Replace with gold/red equivalents (`#e8b923` / `#b91c1c`).
2. Every `<meta name="theme-color">` must be `#e8b923`. Flag `#667eea`, `#8B0000`, `#764ba2`.
3. `manifest.json` `theme_color` must be `#e8b923`.
4. Gradient headings/CTAs must use the gold→red or gold gradients — never purple→violet.
5. Icons/favicons must reference existing files: `icons/icon-192x192.png`, `icons/icon-512x512.png`, `/images/icons/iht-icon.svg`. Flag `images/icons/icon-192.png` or `icon-512.png` (do not exist).
6. `apple-touch-icon` present on app-shell pages.
7. Dark theme only — no light backgrounds; `#050508` base.

## Reporting
For each hit report `file:line`, the offending value, and the canonical replacement. Apply fixes automatically when instructed; otherwise emit a table.

## Hard rules
- Never introduce purple/violet accents for new work.
- Gold = primary interactive; red = curtain/brand accents; `#ffd700` reserved for stars/ratings.
- Keep Playfair Display headings + Inter body.
