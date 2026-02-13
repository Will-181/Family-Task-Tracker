# Changelog

All notable changes to this project are documented in this file.

## [1.0.1] - 2026-02-10

### Added

- **Palette**: Five hex colors documented in `app/globals.css` (teal, tan, brown, burgundy, dark) for consistent theming.
- **Dark mode**: Theme toggle in the header; preference persisted in `localStorage` and respected on first load (with system preference fallback). Sun/moon icon indicates current mode.

### Fixed

- **Viewports**: Calendar header on small devices (e.g. 360×740) no longer overflows; month/week/day buttons stack and stay visible instead of the day button being cut off on the right.

---

## [1.0.0]

Initial release: tasks, Kanban, calendar, passcode gate, requestors, materials, tools.
