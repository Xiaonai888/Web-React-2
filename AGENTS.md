# Shadow Web Development Rules

## Scope
These rules apply to the entire repository.

## Required New Page Sources
Before creating a new user-facing page, inspect these files first:
- `src/templates/NewPageTemplate.jsx`
- `src/components/common/PagePrimitives.jsx`
- `src/index.css`
- `src/utils/displayLanguage.js`
- `src/i18n/registerTranslations.js`

Use `src/templates/NewPageTemplate.jsx` as the default architecture for new pages unless the requested page has a clearly different existing pattern that should be preserved.

Prefer the reusable exports from `src/components/common/PagePrimitives.jsx` before writing page-local equivalents:
- `PageShell`
- `PageHeader`
- `SurfaceCard`
- `PageLoadingState`
- `PageErrorState`
- `PageEmptyState`
- `FilterChip`

Do not recreate these primitives inside an individual page when an existing primitive already fits the job.

## Before Editing or Creating UI
- Inspect the target page, its imported reusable components, and `src/index.css` before changing styles.
- Inspect similar existing pages when matching established product behavior or layout.
- Reuse existing utilities/components before creating new ones.
- Do not duplicate Dark Mode rules when the Global Compatibility Layer already handles the class.
- Preserve existing API, routing, cache, business logic, and translation behavior unless the task explicitly requires changing them.
- Do not modify `src/templates/NewPageTemplate.jsx` or `src/components/common/PagePrimitives.jsx` just to satisfy one page-specific design unless the reusable system itself genuinely needs improvement.

## Dark Mode Standard
Every new page and new reusable UI component must support Light Mode and Dark Mode before it is considered complete.

Prefer existing semantic classes and CSS variables:
- `app-page`
- `app-card`
- `app-elevated`
- `app-soft`
- `app-title`
- `app-subtitle`
- `app-muted`
- `app-tertiary`
- `app-icon-box`
- `app-nav`
- `app-border`
- `app-input`
- `app-overlay`
- `app-shadow`
- `app-accent`
- `app-danger`
- `app-success`
- `app-warning`
- `--shadow-bg-page`
- `--shadow-bg-surface`
- `--shadow-bg-elevated`
- `--shadow-bg-soft`
- `--shadow-bg-hover`
- `--shadow-input-bg`
- `--shadow-text-primary`
- `--shadow-text-secondary`
- `--shadow-text-tertiary`
- `--shadow-text-disabled`
- `--shadow-placeholder`
- `--shadow-border`
- `--shadow-border-strong`
- `--shadow-icon`
- `--shadow-nav-bg`
- `--shadow-overlay`
- `--shadow-shadow`

Rules:
- A normal page root should use `PageShell` or the existing `app-page` semantic page class.
- Prefer `PageHeader`, `SurfaceCard`, and the reusable page states instead of rebuilding their theme behavior.
- Headers/navigation, cards, sheets, modals, inputs, menus, loading states, error states, and empty states must all work in both themes.
- Hard-coded colors such as `bg-white`, `text-black`, `text-[#111827]`, gray borders, or light backgrounds are allowed only when:
  1. the Global Compatibility Layer already handles them correctly, or
  2. an explicit `dark:*` counterpart / semantic token is provided, or
  3. the design is intentionally theme-preserved.
- Do not add unnecessary `dark:*` classes when `src/index.css` already provides the correct Dark Mode behavior.
- Inline SVG icons should use `currentColor` when they are expected to follow theme text/icon color.
- Preserve intentional brand/accent colors such as warning, success, danger, premium gold, or branded gradients unless the design specifically requires changing them.
- Reader-specific theme pages/components may intentionally use their own paper/sepia/dark theme system and should not be forced into the global page theme.
- Do not modify `src/index.css` to solve a page-local styling issue unless the problem is genuinely global.

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
- Do not create another i18n/localization system.
- Do not hard-code user-visible English, Khmer, Chinese, Japanese, or Korean strings directly in JSX.
- Translate headings, labels, buttons, tabs, placeholders, helper text, errors, empty states, loading text, dialog text, tooltips, `aria-label`, and other user-facing strings.
- Keep dynamic server/content data as data; do not translate user-created titles, names, posts, or backend content unless the existing system explicitly does so.
- Use interpolation such as `{{count}}` for dynamic translated values.
- When a page creates its own translation namespace, include entries for all 5 supported languages.
- Keep translation keys grouped by page/component namespace.
- Reusable layout primitives should normally receive already-translated strings through props rather than registering page-specific translations themselves.

## Loading, Error, and Empty States
Every data-driven new page must explicitly consider:
- loading
- error
- empty
- success/content

Prefer:
- `PageLoadingState`
- `PageErrorState`
- `PageEmptyState`

Do not add placeholder English text to these states. Pass translated values from the page.

## Data Fetch / API Efficiency Standard

This section is mandatory for every new or modified data-driven page, component, API endpoint, controller, service, feed, list, history, library, comments/replies view, notification view, search result, dashboard table, or other feature that can grow over time.

Before writing or changing data-fetching UI, inspect the related frontend fetch code and the related backend route/controller/query when available. Do not review only Dark Mode and translations.

### List and Growing Data Rules
- Never design a growing list to fetch all rows by default.
- Use pagination, cursor pagination, `.range()`, or `.limit()` for data that can grow.
- Default page size should normally be about 30 items.
- Backend must enforce a safe maximum page size, normally no more than 100 items per request unless the feature has a documented reason.
- Frontend must load the first page only, then use Load More, infinite scroll, pagination controls, or another intentional continuation pattern.
- Do not rely on frontend slicing after downloading the full dataset.

### Database Query Rules
- Do not use `select('*')` or nested `relation(*)` for list endpoints unless every returned column is genuinely required.
- Select only fields used by the current UI or required business logic.
- Large nested collections such as replies, episodes, comments, reactions, followers, logs, orders, or child records must have their own limit/pagination strategy.
- Prefer database-side filtering, sorting, counting, and aggregation instead of loading rows into Node or the browser just to process them.
- Counts should use a database count query when possible instead of fetching hundreds of rows and counting them in application code.

### Request Rules
- Do not send one HTTP request per item for a bulk user action when the backend can perform the operation in one request.
- Bulk delete, bulk clear, bulk update, bulk approve, bulk archive, and similar actions should normally use one dedicated backend endpoint.
- Avoid `Promise.all(items.map(() => fetch(...)))` for unbounded item collections.
- Avoid duplicate fetches for the same resource during one page load when the result can be shared or reused.
- GET endpoints should not perform unrelated cleanup/delete/update work on every read request.

### Cache Rules
- Consider cache for read-heavy data that does not need instant freshness.
- Cache is optional for user-private, highly dynamic, or security-sensitive data and must not be added blindly.
- Reuse existing cache helpers/patterns before creating a new cache system.
- Cache TTL must match the freshness requirement of the feature.
- Mutation endpoints must invalidate or bypass affected cached data when necessary.

### Frontend Data State Rules
Every data-driven page must explicitly handle:
- initial loading
- error
- empty result
- loaded content
- loading more / next page when pagination is used
- end of results when applicable

Do not mark a data-driven page complete just because the first 20–30 records display correctly.

### Cross-Repo Inspection Rule
For frontend work that fetches Shadow API data:
1. Inspect the frontend page/component making the request.
2. Identify the exact API endpoint.
3. Inspect the matching backend route.
4. Inspect the matching controller/service/database query.
5. Verify limit/pagination, selected fields, nested data size, count strategy, bulk actions, and cache behavior.
6. If the endpoint can grow without a bound, treat it as incomplete even if the UI currently has little data.

For backend work that returns collections:
1. Identify every known frontend consumer when practical.
2. Preserve response compatibility unless the task intentionally changes the API contract.
3. Add pagination metadata or continuation state when pagination is introduced.
4. Do not silently break existing consumers.

### Data Efficiency Completion Checklist
Before marking a new or modified data-driven feature DONE, verify:
- Related frontend and backend files were inspected.
- Growing lists do not fetch all rows by default.
- A safe limit/pagination strategy exists.
- Only required database fields are selected.
- Nested growing collections are limited or paginated.
- Counts are performed efficiently.
- Bulk actions do not create unbounded N-request loops.
- GET requests do not perform unnecessary cleanup mutations.
- Cache was considered and used only when appropriate.
- Loading More / next-page behavior works when applicable.
- Existing API consumers remain compatible.
- Production build/checks still pass.

### AI Mandatory Workflow for Data-Driven Work
When asked to create or modify a page, AI must first decide whether the feature reads or writes data that can grow.

If YES, AI must inspect the related API/backend implementation before calling the task complete, even when the user's request appears to be frontend-only.

AI must not limit its review to Dark Mode and display translations.

For every data-driven feature, AI must explicitly check:
1. Limit / pagination
2. Selected database fields
3. Nested collection size
4. Request count
5. Bulk action behavior
6. Count/aggregation strategy
7. Cache suitability
8. Loading/error/empty/load-more states

If an existing implementation violates these rules, do not copy the unsafe pattern into a new page. Reuse the UI pattern where appropriate, but use the safer data-access pattern.

## New Page Standard
Before marking a new page DONE, verify all of the following:
- `src/templates/NewPageTemplate.jsx` was inspected.
- Existing reusable components were inspected before creating new ones.
- Page root follows the existing semantic theme system.
- Light Mode works.
- Dark Mode works.
- Header/navigation works in both modes.
- Cards/surfaces work in both modes.
- Loading state works in both modes when applicable.
- Error state works in both modes when applicable.
- Empty state works in both modes when applicable.
- All user-visible UI text uses the display translation system.
- All 5 supported languages are included when a new namespace is added.
- Imported reusable components were checked for theme/language compatibility.
- No duplicate component or utility was created when an existing one already solves the same problem.
- Existing API, routing, caching, and business logic remain unchanged unless specifically requested.
- The page-standard checker passes for the changed page.
- The application build succeeds.

## Verification Commands
Available repository commands:
- `npm run audit:i18n`
- `npm run audit:pages`
- `npm run audit:pages:strict`
- `npm run check`

For a specific new or modified page, the preferred targeted check is:

`npm run audit:pages:strict -- src/pages/YourPage.jsx`

For the current changed UI files plus production build, run:

`npm run check`

Do not mark a new page DONE when the strict page audit reports errors or the build fails.

Review-level audit warnings are not automatically defects. Inspect them against `src/index.css` and the existing theme system before deciding whether a code change is needed.

## AI Workflow
When asked to create a page:
1. Read `AGENTS.md`.
2. Inspect `src/templates/NewPageTemplate.jsx`.
3. Inspect `src/components/common/PagePrimitives.jsx`.
4. Inspect the most relevant existing page/components.
5. Inspect relevant global theme compatibility in `src/index.css`.
6. Reuse the existing display-language pattern.
7. Build the page using existing primitives and semantic theme tokens first.
8. Add only the page-specific UI and business logic that is actually required.
9. Run the page-standard checker.
10. Run the build before calling the page complete.

When asked to modify an existing page:
1. Inspect the target file.
2. Inspect substantial imported UI components that affect the requested page.
3. Inspect existing theme/global compatibility rules relevant to the styles being changed.
4. Inspect the existing display-language pattern used by similar pages.
5. Reuse the existing pattern instead of inventing a new theme or translation system.
6. Implement the smallest safe change.
7. Run the relevant checker/build before calling the work complete.

## Completion Rule
A new page is NOT complete if:
- it only works visually in Light Mode,
- user-visible UI text is hard-coded outside the existing display-language system,
- it unnecessarily duplicates an existing page primitive,
- the strict page-standard audit reports errors,
- or the production build fails.
