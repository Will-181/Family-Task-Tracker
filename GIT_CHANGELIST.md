# Git change list — v1.0.3

**Version:** 1.0.3  
**Updated date:** February 22, 2026

---

## Summary of changes

### Added
- **3-dot menu** in header: Settings (color theme: Default, Ocean, Violet), About, Version
- **Task counts** on Tasks page: column headers show count in brackets, e.g. New / Open (3)

### Changed
- **Add task:** Only + icon in top bar; removed "New Task" text and mobile bottom bar
- **New task flow:** Redirect to Dashboard after create; form shows only Summary, Description, Requested by
- **Updated date:** February 22, 2026

### Fixed
- **Settings (portrait):** Color Theme moved into main menu (no submenu) so it stays on screen in portrait; no off-screen opening

---

## Files to commit (push to git)

```
CHANGELOG.md
package.json
lib/app-config.ts
lib/color-palette.tsx
app/globals.css
app/layout.tsx
app/tasks/new/page.tsx
components/header.tsx
components/header-menu.tsx
components/kanban-column.tsx
components/providers.tsx
```

---

## Suggested commit message

```
Release v1.0.3

- Add 3-dot menu: Settings (color themes Default/Ocean/Violet), About, Version
- Add task counts in brackets on Tasks page column headers
- Single add-task entry: + icon only; remove New Task text and mobile bottom bar
- New task: redirect to Dashboard after create; minimal form (Summary, Description, Requester)
- Updated date: February 22, 2026
- Settings: Color Theme inline in main menu (no submenu) so it stays on screen in portrait
```
