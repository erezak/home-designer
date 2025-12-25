# AGENTS.md

This repository is a modern front-end starter using **Vite, React, TypeScript, Tailwind CSS v4, and pnpm**.

You are an automated coding agent working on this codebase. Follow these instructions unless the human explicitly tells you otherwise.

## Project overview

- Single-page React application built with **Vite** and **TypeScript**.
- Styling uses **Tailwind CSS v4**, integrated via the official `@tailwindcss/vite` plugin and CSS-first configuration.
- **pnpm is the package manager of record.** Do not introduce `npm` or `yarn` commands unless the human explicitly asks for them. Make sure you're up to date on the pnpm syntax.

If anything in this file conflicts with direct human instructions, the human wins.

## Stack and conventions

- **Runtime and tooling**
  - Node: use the current active LTS if not specified otherwise.
  - Package manager: **pnpm**.
  - Bundler/dev server: **Vite** (React + TS template).
- **Framework**
  - React with function components and hooks.
  - TypeScript for all application code (`.ts` and `.tsx`).
- **Styling**
  - Tailwind CSS v4, via `@tailwindcss/vite`.
  - Global stylesheet imports Tailwind with `@import "tailwindcss";`.
  - Prefer utility classes and extracted components, not large custom CSS files.
- **Quality**
  - Type checking with TypeScript.
  - Linting with ESLint.
  - Testing with Vitest and React Testing Library (if present; otherwise propose them as defaults).
  - Formatting with Prettier.

If you need to introduce new tools or config files, keep them small, focused, and conventional.

## Setup commands

Run these from the repository root.

### Install, run, build

- Install dependencies:

  ```bash
  pnpm install
  ```

- Start development server:

  ```bash
  pnpm dev
  ```

- Build for production:

  ```bash
  pnpm build
  ```

## Contributing Insights

When working on this codebase, if you discover helpful insights about the code—such as non-obvious patterns, gotchas, architectural decisions, or tips that would benefit future sessions—add them to the **Agent Insights About the Code** section below. Keep entries concise and actionable.

## Agent Insights About the Code

<!-- Add insights below this line -->

- **Tailwind CSS v4 syntax**: This project uses Tailwind v4 with `@tailwindcss/vite` plugin. The v4 CSS-first config differs from v3—avoid `@layer components { @apply ... }` patterns that worked in v3. Use utility classes directly in JSX instead.

- **TypeScript verbatimModuleSyntax**: The tsconfig enables `verbatimModuleSyntax`, requiring explicit `type` keyword for type-only imports: `import { type DesignElement } from '../types'`.

- **Number inputs pattern**: For measurement inputs, use `<input type="text" inputMode="decimal">` with `defaultValue` and `onBlur` instead of controlled `value`/`onChange`. This avoids React 19 quirks with number inputs and cursor position issues.

- **Canvas scale calculation**: The canvas converts cm to pixels using `(cm / scale) * 50`. At scale 1:20, 1cm = 2.5px. The `toPixels` and `toCm` helpers in components handle this conversion.

- **State persistence**: The app auto-saves to localStorage under key `home_designer_autosave`. The `DesignContext` loads from localStorage on mount and saves on every state change.

- **Overflow handling**: The canvas uses `overflow: hidden` to clip elements. Any measurement labels or distance indicators must be positioned inside their parent element bounds, not outside (e.g., no `right: '100%'` positioning for labels that extend beyond the canvas edge).

- **Element positioning modes**: Elements support `auto` (computed top-to-bottom, left-to-right) and `absolute` (manual x/y). Dragging an element automatically switches it to `absolute` mode via `moveElement()`.

- **Distance markers feature**: The `showAllDistances` flag in CanvasConfig controls global visibility of distance markers. When enabled, ElementRenderer shows orange distance indicators for all elements (not just selected ones). Distance calculation uses `siblingElements` to find nearest neighbors in each direction, considering both overlap and proximity.

- **Critical: computedPosition must be set on load**: When loading state from localStorage, `loadFromLocalStorage()` MUST call `computeAllPositions()` to set `computedPosition` on all elements. Without this, elements render correctly (ElementRenderer uses `positioning.position` as fallback) but gap calculations fail because they depend on `computedPosition`. This was a bug that caused 0 gaps to be found until fixed.