# Changelog

All notable changes to this project are documented in this file.

## [1.0.3] - 2026-02-22

### Added

- **3-dot menu** in the header with:
  - **Settings** → Color theme: Default, Ocean, Violet (Ocean and Violet palettes added).
  - **About** → Brief description of the app and what it does.
  - **Version** → Displays version and update date.
- **Task counts** on the Tasks page: each column header shows the number of tasks in brackets, e.g. New / Open (3), In Progress (2), Completed (5).

### Changed

- **Add task**: Single entry point—only the + icon in the top bar; removed the "New Task" text button and the mobile bottom bar.
- **New task flow**: After creating a task, redirect to the Dashboard instead of the task detail view. New task form shows only Summary, Description, and Requested by.

### Fixed

- **Settings submenu (portrait)**: Color Theme submenu now drops below Settings instead of opening off screen to the left on portrait devices.

---

## [1.0.2] - 2026-02-10

### Added

- **Palette**: Five hex colors documented in `app/globals.css` (teal, tan, brown, burgundy, dark) for consistent theming.
- **Dark mode**: Theme toggle in the header; preference persisted in `localStorage` and respected on first load (with system preference fallback). Sun/moon icon indicates current mode.

### Fixed

- **Viewports**: Calendar header on small devices (e.g. 360×740) no longer overflows; month/week/day buttons stack and stay visible instead of the day button being cut off on the right.

---

## [1.0.0]

Initial release: tasks, Kanban, calendar, passcode gate, requestors, materials, tools.
