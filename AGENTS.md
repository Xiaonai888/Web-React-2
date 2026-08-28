# Shadow Web Development Rules

## Scope
These rules apply to the entire repository.

## Before Editing or Creating UI
- Inspect the target page, its imported reusable components, and `src/index.css` before changing styles.
- Reuse existing utilities/components before creating new ones.
- Do not duplicate Dark Mode rules when the Global Compatibility Layer already handles the class.
- Preserve existing API, routing, cache, business logic, and translation behavior unless the task explicitly requires changing them.

## Dark Mode Standard
Every new page and new reusable UI component must support Light Mode and Dark Mode before it is considered complete.

- Prefer existing semantic classes and CSS variables:
  - `app-page`
  - `app-card`
  - `app-elevated`
  - `app-soft`
  - `app-title`
  - `app-subtitle`
  - `app-muted`
  - `app-tertiary`
  - `app-nav`
  - `app-border`
  - `app-input`
  - `--shadow-bg-page`
  - `--shadow-bg-surface`
  - `--shadow-bg-elevated`
  - `--shadow-bg-soft`
  - `--shadow-bg-hover`
  - `--shadow-text-primary`
  - `--shadow-text-secondary`
  - `--shadow-text-tertiary`
  - `--shadow-border`
  - `--shadow-border-strong`
  - `--shadow-nav-bg`
- A page root should normally use `app-page`.
- Headers/navigation should use existing semantic styling or explicit Dark Mode variants.
- Cards, sheets, modals, inputs, menus, loading states, error states, and empty states must all work in both themes.
- Hard-coded colors such as `bg-white`, `text-black`, `text-[#111827]`, gray borders, or light backgrounds are allowed only when:
  1. the Global Compatibility Layer already handles them correctly, or
  2. an explicit `dark:*` counterpart / semantic token is provided, or
  3. the design is intentionally theme-preserved.
- Do not add unnecessary `dark:*` classes when `src/index.css` already provides the correct Dark Mode behavior.
- Inline SVG icons must use `currentColor` when they are expected to follow theme text/icon color.
- Preserve intentional brand/accent colors such as warning, success, danger, premium gold, or branded gradients unless the design specifically requires changing them.
- Reader-specific theme pages/components may intentionally use their own paper/sepia/dark theme system and should not be forced into the global page theme.

## Display Language Standard
Every new user-visible page and reusable UI component must support all current display languages before it is considered complete.

Supported languages:
- `km`
- `en`
- `zh`
- `ja`
- `ko`

Use the existing system:
- `useDisplayTranslation()` from `src/utils/displayLanguage.js`
- `registerTranslationNamespace()` from `src/i18n/registerTranslations.js`
- Render user-visible text with `t(...)`

Rules:
- Do not hard-code user-visible English, Khmer, Chinese, Japanese, or Korean strings directly in JSX.
- Translate headings, labels, buttons, tabs, placeholders, helper text, errors, empty states, loading text, dialog text, tooltips, `aria-label`, and other user-facing strings.
- Keep dynamic server/content data as data; do not translate user-created titles, names, posts, or backend content unless the existing system explicitly does so.
- Use interpolation such as `{{count}}` for dynamic translated values.
- When a page creates its own translation namespace, include entries for all 5 supported languages.
- Keep translation keys grouped by page/component namespace.

## New Page Standard
Before marking a new page DONE, verify all of the following:
- Page root follows the existing semantic theme system.
- Light Mode works.
- Dark Mode works.
- Header/navigation works in both modes.
- Cards/surfaces work in both modes.
- Loading state works in both modes.
- Error state works in both modes.
- Empty state works in both modes.
- All user-visible UI text uses the display translation system.
- All 5 supported languages are included when a new namespace is added.
- Imported reusable components were checked for theme/language compatibility.
- No duplicate component or utility was created when an existing one already solves the same problem.
- Existing API, routing, caching, and business logic remain unchanged unless specifically requested.

## AI Workflow
When asked to create or modify a page:
1. Inspect the target file.
2. Inspect substantial imported UI components that affect the requested page.
3. Inspect existing theme/global compatibility rules relevant to the styles being changed.
4. Inspect the existing display-language pattern used by similar pages.
5. Reuse the existing pattern instead of inventing a new theme or translation system.
6. Implement the smallest safe change.
7. Check Dark Mode + Light Mode + all display languages before calling the work complete.

## Completion Rule
A new page is NOT complete if it only works visually in Light Mode or if user-visible UI text is hard-coded outside the existing display-language system.
