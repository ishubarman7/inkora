# Inkora

[![npm version](https://img.shields.io/npm/v/inkora?color=0b57d0&label=npm)](https://www.npmjs.com/package/inkora)
[![CI](https://github.com/ishubarman7/inkora/actions/workflows/ci.yml/badge.svg)](https://github.com/ishubarman7/inkora/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-ready-blue?logo=typescript&logoColor=white)](types/index.d.ts)

> Plug-and-play rich text editor for React — built on TipTap v3 and ProseMirror.

Inkora gives you a production-ready WYSIWYG editor in one import. No configuration required to get started, fully customisable when you need it. Ships with a full menu-bar editor, a lightweight toolbar editor, and a read-only viewer — all styled with CSS variables so they adapt to any design system.

---

## Table of contents

- [Features](#features)
- [Installation](#installation)
- [Quick start](#quick-start)
- [Components](#components)
  - [InkoraEditor](#inkoraeditor)
  - [InkoraBasicEditor](#inkorabasiceditor)
  - [InkoraViewer](#inkoraviewer)
- [Props reference](#props-reference)
- [Media uploads](#media-uploads)
- [@ Mentions](#-mentions)
- [Theming with CSS variables](#theming-with-css-variables)
- [Dark mode](#dark-mode)
- [Using your own editor setup](#using-your-own-editor-setup)
- [Keyboard shortcuts](#keyboard-shortcuts)
- [Built-in extensions](#built-in-extensions)
- [Framework notes](#framework-notes)
- [Contributing](#contributing)
- [Contributors](#contributors)
- [License](#license)

---

## Features

**Formatting**
- Bold, Italic, Underline, Strikethrough, Inline code
- Superscript, Subscript
- Font family, font size (8 – 96 pt)
- Text colour, highlight colour (multi-colour)
- Text alignment (left, centre, right, justify)
- Line height
- Clear all formatting

**Structure**
- Headings H1 – H6
- Bullet list, ordered list, task list (checkboxes)
- Nested indentation
- Blockquote
- Horizontal rule
- Code block with syntax highlighting (100+ languages via `lowlight`)
- Callout blocks (info, success, warning, danger) with emoji icons

**Media**
- Image insert — file upload or paste URL; resize, align, shape (rect / circle), frame, filters
- Video insert — file upload or URL
- Audio insert — file upload
- YouTube / Vimeo embed
- GIF picker (curated + URL paste)
- SVG shape inserter (circle, square, star, arrows …)

**Tables**
- Insert via grid picker (up to 10 × 10)
- Add / delete rows and columns
- Merge and split cells
- Resizable columns

**Advanced**
- `/` Slash command menu — type `/` to insert headings, lists, quotes, code blocks, tables, callouts, and more
- LaTeX math formulas (KaTeX, optional peer dep)
- @ Mentions with custom data source
- `#` Hashtags
- Emoji shortcodes (`:heart:` → ❤️, `:smile:` → 😊, `:rocket:` → 🚀, `:fire:` → 🔥)
- Hyperlinks with modal dialog
- Global drag-handle for reordering blocks
- Bubble menu (formatting pop-up on text selection)
- Character / word count
- Auto-save with debounce
- Fullscreen mode
- HTML source editor
- Undo / Redo

**Themes**
- Light and dark mode — switch at runtime
- All colours exposed as CSS variables (`--rte-*`) for easy overriding
- Zero Tailwind dependency — safe in any project

---

## Installation

Install Inkora and its peer dependencies.

```bash
npm install inkora \
  @tiptap/core @tiptap/pm @tiptap/react @tiptap/starter-kit \
  @tiptap/extension-character-count \
  @tiptap/extension-code-block-lowlight \
  @tiptap/extension-color \
  @tiptap/extension-dropcursor \
  @tiptap/extension-font-family \
  @tiptap/extension-gapcursor \
  @tiptap/extension-highlight \
  @tiptap/extension-image \
  @tiptap/extension-link \
  @tiptap/extension-mention \
  @tiptap/extension-placeholder \
  @tiptap/extension-subscript \
  @tiptap/extension-superscript \
  @tiptap/suggestion \
  @tiptap/extension-table \
  @tiptap/extension-task-item \
  @tiptap/extension-task-list \
  @tiptap/extension-text-align \
  @tiptap/extension-text-style \
  @tiptap/extension-underline \
  @tiptap/extension-youtube \
  react react-dom
```

**Math formulas (optional)**

If you want KaTeX math blocks, install the optional peer dependency and import the KaTeX stylesheet once in your app root:

```bash
npm install katex
```

```js
import 'katex/dist/katex.min.css';
```

---

## Quick start

```jsx
import { InkoraEditor } from 'inkora';

export default function App() {
  return (
    <InkoraEditor
      onChange={(json) => console.log(json)}
    />
  );
}
```

That is all. The editor mounts with a full toolbar, dark-mode toggle, and every extension enabled.

---

## Components

### InkoraEditor

Full-featured editor with menu bar, format bar, bubble menu, media support, tables, math, and more.

```jsx
import { InkoraEditor } from 'inkora';

<InkoraEditor
  initialContent={myDocumentJson}
  theme="light"
  width="100%"
  minHeight={500}
  onChange={(json) => setContent(json)}
  onSave={(json) => saveToDatabase(json)}
  onUpload={async (file) => {
    const url = await uploadToStorage(file);
    return { src: url };
  }}
  resolveMediaUrl={(src) => `https://cdn.example.com/${src}`}
  onToggleTheme={() => setTheme(t => t === 'light' ? 'dark' : 'light')}
/>
```

---

### InkoraBasicEditor

Lightweight editor with a single compact toolbar. Ideal for comments, short-form inputs, and forms.

```jsx
import { InkoraBasicEditor } from 'inkora';

<InkoraBasicEditor
  value={content}
  onChange={setContent}
  minHeight={150}
  theme="light"
/>
```

Render saved content read-only by passing `readOnly`:

```jsx
<InkoraBasicEditor value={content} readOnly />
```

---

### InkoraViewer

Read-only renderer for TipTap JSON. Renders the same visual styles as the editor with no editing controls. Shows a shimmer skeleton during SSR / before hydration.

```jsx
import { InkoraViewer } from 'inkora';

<InkoraViewer content={savedDocumentJson} theme="light" />
```

---

## Props reference

### InkoraEditor

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `initialContent` | `Object` | `undefined` | TipTap JSON document to pre-populate the editor. |
| `onChange` | `(json: Object) => void` | — | Fired on every keystroke with the current TipTap JSON. |
| `onSave` | `(json: Object) => void` | — | Auto-save callback. Fires after 1 s of idle typing. |
| `onUpload` | `(file: File) => Promise<{ src: string }>` | — | Media upload handler. Must return a promise resolving to `{ src }`. |
| `resolveMediaUrl` | `(src: string) => string` | — | Maps stored `src` values to live, displayable URLs. |
| `onToggleTheme` | `() => void` | — | Called when the user clicks the dark-mode toggle button. |
| `theme` | `'light' \| 'dark'` | `'light'` | Controls the colour scheme. |
| `placeholder` | `string` | `'Start writing…'` | Empty-state placeholder text. |
| `width` | `string \| number` | `'100%'` | CSS width of the outer container. |
| `height` | `string \| number` | `undefined` | Fixed height for the scrollable content area. |
| `minHeight` | `number` | `420` | Minimum height (px) of the scrollable content area. |
| `mentionOptions` | `Object` | `{}` | Forwarded to the TipTap Mention extension's `suggestion` config. |

### InkoraBasicEditor

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `value` | `Object` | `undefined` | TipTap JSON document. |
| `onChange` | `(json: Object) => void` | — | Fired on every change with the current TipTap JSON. |
| `onSave` | `(json: Object) => void` | — | Auto-save callback (debounced 1 s). |
| `placeholder` | `string` | `'Start writing…'` | Empty-state placeholder text. |
| `theme` | `'light' \| 'dark'` | `'light'` | Controls the colour scheme. |
| `width` | `string \| number` | `'100%'` | CSS width of the outer container. |
| `height` | `string \| number` | `undefined` | Fixed height for the content area. |
| `minHeight` | `number` | `150` | Minimum height (px) of the content area. |
| `readOnly` | `boolean` | `false` | Hides the toolbar and disables all editing. |

### InkoraViewer

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `content` | `Object` | `undefined` | TipTap JSON document to display. |
| `theme` | `'light' \| 'dark'` | `'light'` | Controls the colour scheme. |

---

## Media uploads

Inkora does not upload files itself — you provide the upload function. The editor calls it with the selected `File` and expects a promise that resolves to `{ src: string }`.

```jsx
<InkoraEditor
  onUpload={async (file) => {
    // Example: S3 presigned-URL upload
    const { url, key } = await fetch('/api/upload-url', {
      method: 'POST',
      body: JSON.stringify({ name: file.name, type: file.type }),
      headers: { 'Content-Type': 'application/json' },
    }).then(r => r.json());

    await fetch(url, { method: 'PUT', body: file });

    // Return the key that gets stored in the TipTap document JSON
    return { src: key };
  }}
  resolveMediaUrl={(src) => `https://your-bucket.s3.amazonaws.com/${src}`}
/>
```

`resolveMediaUrl` is called at render time to convert stored keys back into displayable URLs. If your `onUpload` already returns a full absolute URL, you can omit `resolveMediaUrl`.

---

## @ Mentions

Pass a `mentionOptions` prop with an async `items` function. The editor calls it as the user types after `@`.

```jsx
<InkoraEditor
  mentionOptions={{
    suggestion: {
      items: async ({ query }) => {
        const users = await fetchUsers(query);
        // Must return an array of objects with at least { id, label }
        return users.map(u => ({ id: u.id, label: u.name }));
      },
    },
  }}
/>
```

The mention node renders as `<span class="rte-mention">` in HTML output. Style it in your own stylesheet:

```css
.rte-mention {
  background: #d3e3fd;
  color: #0b57d0;
  border-radius: 4px;
  padding: 1px 4px;
  font-weight: 500;
}
```

---

## Theming with CSS variables

All colours are driven by CSS custom properties on the wrapper element. Override any variable in your own stylesheet:

```css
/* Example: purple accent */
.inkora-editor {
  --rte-accent: #7c3aed;
  --rte-accent-soft: #ede9fe;
}
```

**Full variable reference**

| Variable | Light | Dark | Role |
|----------|-------|------|------|
| `--rte-page` | `#ffffff` | `#1f2023` | Editor content background |
| `--rte-bar` | `#ffffff` | `#26272b` | Toolbar / panel background |
| `--rte-pill` | `#f6f8fc` | `#2b2c30` | Subtle chip / button fill |
| `--rte-hover` | `rgba(60,64,67,.09)` | `rgba(255,255,255,.09)` | Button hover background |
| `--rte-border` | `#e4e7eb` | `#3c4043` | Panel and input borders |
| `--rte-ink` | `#202124` | `#e8eaed` | Primary text colour |
| `--rte-muted` | `#5f6368` | `#9aa0a6` | Secondary / disabled text |
| `--rte-accent` | `#0b57d0` | `#8ab4f8` | Links, active states, focus rings |
| `--rte-accent-soft` | `#d3e3fd` | `#1e3a5f` | Selected-node highlight tint |
| `--rte-shadow` | subtle | deeper | Outer box shadow |

---

## Dark mode

Pass `theme="dark"` to switch the colour scheme. The component is fully controlled — your app owns the state:

```jsx
const [theme, setTheme] = useState('light');

<InkoraEditor
  theme={theme}
  onToggleTheme={() => setTheme(t => t === 'light' ? 'dark' : 'light')}
/>
```

The built-in toggle button in the toolbar calls `onToggleTheme` when clicked. Wire it up to update your `theme` state so the prop changes and the editor re-renders with the new scheme.

---

## Using your own editor setup

**Extension factory**

`createEditorExtensions` returns the full array of TipTap extensions used internally. Use it when building a custom `useEditor` instance:

```jsx
import { createEditorExtensions, editorStyles } from 'inkora';
import { useEditor, EditorContent } from '@tiptap/react';
import { useMemo } from 'react';

function MyEditor({ placeholder }) {
  const extensions = useMemo(
    () => createEditorExtensions({ placeholder, isEditable: true }),
    [placeholder]
  );

  const editor = useEditor({ extensions });

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: editorStyles }} />
      <EditorContent editor={editor} />
    </>
  );
}
```

**`createEditorExtensions` options**

| Key | Type | Default | Description |
|-----|------|---------|-------------|
| `placeholder` | `string` | `'Start writing…'` | Placeholder shown in the empty editor. |
| `mentionOptions` | `Object` | `{}` | Forwarded into the Mention extension's `suggestion` config. |
| `isEditable` | `boolean` | `true` | Pass `false` to skip loading the drag-handle extension. |

**Styles**

`editorStyles` is a plain CSS string containing all `.rte-*` class definitions. The built-in components inject it automatically. Only import it manually if you are building a custom editor without `InkoraEditor` / `InkoraBasicEditor`.

```jsx
import { editorStyles } from 'inkora';

<style dangerouslySetInnerHTML={{ __html: editorStyles }} />
```

---

## Keyboard shortcuts

> Substitute `⌘` with `Ctrl` on Windows / Linux.

| Shortcut | Action |
|----------|--------|
| `⌘ B` | Bold |
| `⌘ I` | Italic |
| `⌘ U` | Underline |
| `⌘ Shift S` | Strikethrough |
| `⌘ K` | Insert / edit link |
| `⌘ E` | Inline code |
| `⌘ Z` | Undo |
| `⌘ Y` | Redo |
| `⌘ A` | Select all |
| `⌘ ,` | Subscript |
| `⌘ .` | Superscript |
| `⌘ \` | Clear all formatting |

---

## Built-in extensions

These TipTap extensions are loaded automatically. You do not need to configure them individually unless you use `createEditorExtensions` directly.

| Extension | What it provides |
|-----------|-----------------|
| `StarterKit` | Document, paragraph, headings, bold, italic, code, blockquote, HR, lists, history (undo/redo) |
| `Underline` | Underline mark |
| `Highlight` | Multi-colour highlight marks |
| `TextStyle` | Inline style container (required by Color and FontFamily) |
| `Color` | Text colour |
| `FontFamily` | Font family |
| `FontSize` *(custom)* | Font size (8 – 96 pt) |
| `LineHeight` *(custom)* | Line height per block |
| `TextAlign` | Left / centre / right / justify alignment on blocks |
| `TaskList` + `TaskItem` | Interactive checkbox lists (nested supported) |
| `Link` | Hyperlink mark — opens in new tab, `rel="noopener noreferrer"` |
| `Image` *(extended)* | Images with resize handles, shape, frame, filters, alignment |
| `Table` + rows / cells | Full table support with resizable columns |
| `Subscript` | Subscript mark |
| `Superscript` | Superscript mark |
| `Callout` *(custom)* | Coloured callout blocks (blue, green, yellow, red) |
| `Video` *(custom)* | Block video player with resize / shape / filters |
| `Audio` *(custom)* | Block audio player |
| `Math` *(custom)* | KaTeX block math formulas (click to edit) |
| `Youtube` *(extended)* | YouTube / Vimeo embeds |
| `Hashtag` *(custom)* | `#tag` input rule |
| `Mention` | `@mention` with configurable suggestion source |
| `SlashCommand` *(custom)* | `/` menu to insert headings, lists, quotes, code blocks, tables, callouts, dividers |
| `Placeholder` | Ghost placeholder text |
| `CharacterCount` | Character and word count data |
| `Dropcursor` | Drag-and-drop position indicator |
| `Gapcursor` | Cursor in gaps between block nodes |
| `CodeBlockLowlight` *(extended)* | Fenced code blocks with syntax highlighting and collapse toggle |
| `GlobalDragHandle` | Drag handle on the left of every block node |
| `EmojiInputRules` *(custom)* | `:heart:` → ❤️  `:smile:` → 😊  `:rocket:` → 🚀  `:fire:` → 🔥 |

---

## Framework notes

**Next.js (App Router)**

All Inkora components include `'use client'` at the top. Import them inside a client component, or lazy-load to skip SSR:

```jsx
'use client';
import { InkoraEditor } from 'inkora';
```

```jsx
// Skip SSR entirely
import dynamic from 'next/dynamic';

const InkoraEditor = dynamic(
  () => import('inkora').then(m => m.InkoraEditor),
  { ssr: false }
);
```

**Vite / Create React App**

No special configuration needed. Import and use directly.

**KaTeX stylesheet**

If you use math blocks, add the KaTeX stylesheet once at your app root:

```js
// _app.js, layout.js, or main.jsx
import 'katex/dist/katex.min.css';
```

---

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md) for how to set up the dev environment, submit pull requests, and report bugs.

---

## Contributors

Thanks to everyone who has helped build Inkora:

- [Ishu Barman](https://github.com/ishubarman7) — creator and maintainer
- [Vaibhav Rawat](https://github.com/VaibhavRawat27) — slash command menu

---

## License

MIT © Inkora contributors
