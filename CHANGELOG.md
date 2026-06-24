# Changelog

All notable changes to Inkora are documented here.

Format follows [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).
Versions follow [Semantic Versioning](https://semver.org/).

---

## [0.1.1] — 2026-06-25

### Fixed
- Added `'use client'` banner to ESM and CJS dist output so Next.js App Router consumers no longer need to wrap imports in their own `'use client'` file.
- Removed accidental self-referencing `"inkora"` entry from `dependencies` in `package.json`.

### Added
- TypeScript type declarations (`types/index.d.ts`) — full prop types for `InkoraEditor`, `InkoraBasicEditor`, `InkoraViewer`, `createEditorExtensions`, and `editorStyles`.
- README badges: npm version, CI status, license, TypeScript-ready.
- `CHANGELOG.md`.

---

## [0.1.0] — 2026-06-25

### Added
- Initial release.
- `InkoraEditor` — full-featured editor with menu bar, format bar, bubble menu, media (image, video, audio, YouTube, GIF), tables, KaTeX math, @mentions, #hashtags, emoji shortcodes, code blocks with syntax highlighting, callout blocks, drag-handle, dark mode, fullscreen, HTML source editor, word count, keyboard shortcuts modal, link modal.
- `InkoraBasicEditor` — lightweight single-toolbar editor.
- `InkoraViewer` — read-only renderer with shimmer skeleton.
- `createEditorExtensions` — extension factory for custom `useEditor` setups.
- `editorStyles` — shared CSS string for custom setups.
- CSS variable theming system (`--rte-*`) — zero Tailwind dependency.
- Light and dark mode with runtime switching.
- GitHub Actions CI, issue templates, PR template, branch ruleset.
