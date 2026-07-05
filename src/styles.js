export const editorStyles = `
  .rte-content {
    outline: none;
    min-height: 100px;
    font-family: Arial, sans-serif;
    font-size: 14.67px;
    line-height: 1.25;
    color: var(--rte-ink, #202124);
  }

  .rte-content p.is-editor-empty:first-child::before {
    content: attr(data-placeholder);
    float: left;
    color: var(--rte-muted, #9ca3af);
    pointer-events: none;
    height: 0;
    font-style: italic;
  }

  /* Headings */
  .rte-content h1 {
    font-size: 24px;
    font-weight: 600;
    line-height: 1.25;
    letter-spacing: -0.01em;
    margin: 0.4em 0 0.2em;
  }
  .rte-content h2 {
    font-size: 19px;
    font-weight: 600;
    line-height: 1.3;
    margin: 0.7em 0 0.2em;
  }
  .rte-content h3 {
    font-size: 15px;
    font-weight: 600;
    line-height: 1.35;
    margin: 0.7em 0 0.2em;
    color: var(--rte-muted, #5f6368);
    text-transform: uppercase;
    letter-spacing: 0.04em;
  }
  .rte-content h4 { font-size: 14px; font-weight: 600; margin: 0.6em 0 0.2em; }
  .rte-content h5 { font-size: 13px; font-weight: 600; margin: 0.5em 0 0.15em; }
  .rte-content h6 { font-size: 12px; font-weight: 600; margin: 0.5em 0 0.15em; color: var(--rte-muted, #5f6368); }

  .rte-content h1:first-child,
  .rte-content h2:first-child,
  .rte-content h3:first-child { margin-top: 0; }

  .rte-content p { margin: 0 0 0.5em; }
  .rte-content p:last-child { margin-bottom: 0; }

  /* Links */
  .rte-content a, .rte-link {
    color: var(--rte-accent, #0b57d0);
    text-decoration: underline;
    text-underline-offset: 2px;
  }
  .rte-content a:hover, .rte-link:hover { opacity: 0.8; }

  /* Inline code */
  .rte-content code:not(pre code), .rte-inline-code {
    display: inline;
    background: var(--rte-pill, #f3f4f6);
    color: #dc2626;
    border-radius: 4px;
    padding: 1px 5px;
    font-family: 'Roboto Mono', 'Fira Code', Consolas, monospace;
    font-size: 0.875em;
    border: 1px solid var(--rte-border, #e5e7eb);
  }

  /* Mention chip */
  .rte-mention {
    background: var(--rte-accent-soft, #d3e3fd);
    color: var(--rte-accent, #0b57d0);
    border-radius: 4px;
    padding: 1px 5px;
    font-weight: 500;
  }

  /* Hashtag */
  .rte-hashtag {
    color: var(--rte-accent, #0b57d0);
    cursor: pointer;
  }
  .rte-hashtag:hover { text-decoration: underline; }

  /* Lists */
  .rte-content ul {
    list-style-type: disc;
    padding-left: 1.5em;
    margin: 0 0 0.7em;
  }
  .rte-content ol {
    list-style-type: decimal;
    padding-left: 1.5em;
    margin: 0 0 0.7em;
  }
  .rte-content li { margin: 0.18em 0; line-height: 1.6; }
  .rte-content li > p { margin-bottom: 0.18em; }
  .rte-content ul ul, .rte-content ol ol,
  .rte-content ul ol, .rte-content ol ul {
    margin-top: 0.1em;
    margin-bottom: 0.1em;
  }

  /* Task Lists */
  .rte-content ul[data-type="taskList"] {
    list-style: none;
    padding-left: 0.2em;
    margin: 0 0 0.7em;
  }
  .rte-content ul[data-type="taskList"] li {
    display: flex;
    gap: 0.5rem;
    align-items: flex-start;
    margin: 0.3em 0;
  }
  .rte-content ul[data-type="taskList"] li > label { flex-shrink: 0; margin-top: 2px; }
  .rte-content ul[data-type="taskList"] input[type="checkbox"] {
    cursor: pointer; width: 15px; height: 15px; border-radius: 3px;
    accent-color: var(--rte-accent, #0b57d0);
  }
  .rte-content ul[data-type="taskList"] li[data-checked="true"] > div {
    color: var(--rte-muted, #9ca3af); text-decoration: line-through;
  }

  /* Blockquote */
  .rte-content blockquote {
    border-left: 3px solid var(--rte-accent, #0b57d0);
    margin: 0 0 0.8em;
    padding: 0.25em 0 0.25em 1.1em;
    color: var(--rte-muted, #5f6368);
    font-style: italic;
  }

  /* Horizontal Rule */
  .rte-content hr {
    border: none;
    border-top: 1px solid var(--rte-border, #e4e7eb);
    margin: 1.1em 0;
  }

  /* Callout (custom node) */
  .rte-content [data-type="callout"],
  .rte-content .callout {
    background: var(--rte-accent-soft, #d3e3fd);
    border: 1px solid var(--rte-accent, #0b57d0);
    border-left: 4px solid var(--rte-accent, #0b57d0);
    border-radius: 6px;
    padding: 0.75rem 1rem;
    margin: 0.8em 0;
  }

  /* Images */
  .rte-content img {
    max-width: 100%;
    height: auto;
    border-radius: 6px;
    margin: 0.5em 0;
    display: block;
  }
  .rte-content img.ProseMirror-selectednode {
    outline: 2px solid var(--rte-accent, #0b57d0);
    outline-offset: 2px;
  }

  /* Code Blocks - VS Code Dark Theme */
  .code-block-wrapper {
    position: relative;
    margin: 1.25rem 0;
  }
  .code-block-wrapper pre {
    background: #1e1e1e !important;
    color: #d4d4d4;
    font-family: 'Fira Code', 'Cascadia Code', Consolas, Monaco, monospace;
    font-size: 0.875rem;
    tab-size: 2;
  }

  /* Syntax highlighting colours are scoped per-block by CodeBlock.jsx */

  /* Tables */
  .rte-content .tableWrapper {
    overflow-x: auto;
    margin: 0.5em 0 0.8em;
    padding: 2px 0;
  }
  .rte-content table {
    border-collapse: collapse;
    table-layout: fixed;
    width: 100%;
    margin: 0;
    border: 2px solid var(--rte-table-border, #b6bac2);
  }
  .rte-content td, .rte-content th {
    min-width: 3em;
    border: 1px solid var(--rte-table-border, #b6bac2);
    padding: 7px 11px;
    vertical-align: top;
    box-sizing: border-box;
    position: relative;
  }
  .rte-content th {
    font-weight: 600;
    text-align: left;
    background: var(--rte-pill, #f6f8fc);
    font-size: 12px;
    text-transform: uppercase;
    letter-spacing: 0.04em;
    color: var(--rte-muted, #5f6368);
    border-bottom: 2px solid var(--rte-table-border, #b6bac2);
  }
  .rte-content .selectedCell:after {
    z-index: 2; position: absolute; content: "";
    left: 0; right: 0; top: 0; bottom: 0;
    background: rgba(11,87,208,.1);
    pointer-events: none;
  }
  .rte-content .column-resize-handle {
    position: absolute; right: -2px; top: 0; bottom: -2px;
    width: 4px; background: var(--rte-accent, #0b57d0);
    pointer-events: none;
    z-index: 20;
  }
  .rte-content.resize-cursor { cursor: col-resize; }
  .rte-content.resize-cursor * { cursor: col-resize; }

  /* Highlight Mark style */
  .rte-content mark,
  .viewer-inner mark {
    background-color: #fff475;
    color: #202124;
    border-radius: 4px;
    padding: 1px 4px;
    margin: 0 1px;
  }
  .rte-content span[style*="color"] mark,
  .viewer-inner span[style*="color"] mark {
    color: inherit;
  }

  /* Mention */
  .mention {
    background: var(--rte-accent-soft, #d3e3fd);
    color: var(--rte-accent, #0b57d0);
    border-radius: 4px;
    padding: 0 4px;
    font-weight: 500;
  }

  /* Hashtag */
  .hashtag {
    color: #7b34d6;
    font-weight: 500;
  }

  /* Drag handle */
  .drag-handle {
    position: fixed;
    opacity: 1;
    transition: opacity 0.2s;
    border-radius: 0.25rem;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 10 10' style='fill: rgba(0,0,0,0.35)'%3E%3Cpath d='M3,2 C2.44771525,2 2,1.55228475 2,1 C2,0.44771525 2.44771525,0 3,0 C3.55228475,0 4,0.44771525 4,1 C4,1.55228475 3.55228475,2 3,2 Z M3,6 C2.44771525,6 2,5.55228475 2,5 C2,4.44771525 2.44771525,4 3,4 C3.55228475,4 4,4.44771525 4,5 C4,5.55228475 3.55228475,6 3,6 Z M3,10 C2.44771525,10 2,9.55228475 2,9 C2,8.44771525 2.44771525,8 3,8 C3.55228475,8 4,8.44771525 4,9 C4,9.55228475 3.55228475,10 3,10 Z M7,2 C6.44771525,2 6,1.55228475 6,1 C6,0.44771525 6.44771525,0 7,0 C7.55228475,0 8,0.44771525 8,1 C8,1.55228475 7.55228475,2 7,2 Z M7,6 C6.44771525,6 6,5.55228475 6,5 C6,4.44771525 6.44771525,4 7,4 C7.55228475,4 8,4.44771525 8,5 C8,5.55228475 7.55228475,6 7,6 Z M7,10 C6.44771525,10 6,9.55228475 6,9 C6,8.44771525 6.44771525,8 7,8 C7.55228475,8 8,8.44771525 8,9 C8,9.55228475 7.55228475,10 7,10 Z'%3E%3C/path%3E%3C/svg%3E");
    background-size: calc(0.5em + 0.375rem) calc(0.5em + 0.375rem);
    background-repeat: no-repeat;
    background-position: center;
    width: 1.2rem;
    height: 1.5rem;
    z-index: 50;
    cursor: grab;
  }
  .drag-handle:hover { background-color: rgba(0, 0, 0, 0.06); }
  .drag-handle:active { cursor: grabbing; }
  .drag-handle.hide { opacity: 0; pointer-events: none; }

  /* Dark mode overrides */
  .dark .rte-content code:not(pre code) {
    background: #2b2c30;
    color: #f87171;
    border-color: #3c4043;
  }
  .dark .rte-content mark,
  .dark .viewer-inner mark {
    background-color: #d1b01c;
    color: #1f2023 !important;
  }

  .dark .drag-handle {
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 10 10' style='fill: rgba(255,255,255,0.3)'%3E%3Cpath d='M3,2 C2.44771525,2 2,1.55228475 2,1 C2,0.44771525 2.44771525,0 3,0 C3.55228475,0 4,0.44771525 4,1 C4,1.55228475 3.55228475,2 3,2 Z M3,6 C2.44771525,6 2,5.55228475 2,5 C2,4.44771525 2.44771525,4 3,4 C3.55228475,4 4,4.44771525 4,5 C4,5.55228475 3.55228475,6 3,6 Z M3,10 C2.44771525,10 2,9.55228475 2,9 C2,8.44771525 2.44771525,8 3,8 C3.55228475,8 4,8.44771525 4,9 C4,9.55228475 3.55228475,10 3,10 Z M7,2 C6.44771525,2 6,1.55228475 6,1 C6,0.44771525 6.44771525,0 7,0 C7.55228475,0 8,0.44771525 8,1 C8,1.55228475 7.55228475,2 7,2 Z M7,6 C6.44771525,6 6,5.55228475 6,5 C6,4.44771525 6.44771525,4 7,4 C7.55228475,4 8,4.44771525 8,5 C8,5.55228475 7.55228475,6 7,6 Z M7,10 C6.44771525,10 6,9.55228475 6,9 C6,8.44771525 6.44771525,8 7,8 C7.55228475,8 4,8.44771525 4,9 C4,9.55228475 3.55228475,10 3,10 Z'%3E%3C/path%3E%3C/svg%3E");
  }
  .dark .drag-handle:hover { background-color: rgba(255, 255, 255, 0.08); }

  /* Slash command menu */
  .rte-slash-menu {
    display: flex;
    flex-direction: column;
    gap: 1px;
    min-width: 220px;
    max-height: 320px;
    overflow-y: auto;
    padding: 4px;
    background: var(--rte-bar, #fff);
    border: 1px solid var(--rte-border, #e4e7eb);
    border-radius: 10px;
    box-shadow: var(--rte-shadow, 0 8px 26px rgba(0,0,0,.18));
    font-family: inherit;
  }
  .rte-slash-item {
    display: flex;
    align-items: center;
    gap: 10px;
    width: 100%;
    padding: 7px 8px;
    border: none;
    border-radius: 6px;
    background: transparent;
    color: var(--rte-ink, #202124);
    text-align: left;
    cursor: pointer;
  }
  .rte-slash-item.active,
  .rte-slash-item:hover {
    background: var(--rte-accent-soft, #d3e3fd);
  }
  .rte-slash-icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    width: 26px;
    height: 26px;
    border-radius: 6px;
    background: var(--rte-pill, #f6f8fc);
    color: var(--rte-ink, #202124);
  }
  .rte-slash-text {
    display: flex;
    flex-direction: column;
    min-width: 0;
  }
  .rte-slash-title {
    font-size: 13px;
    font-weight: 500;
    line-height: 1.3;
  }
  .rte-slash-desc {
    font-size: 11.5px;
    color: var(--rte-muted, #5f6368);
    line-height: 1.3;
  }
  .rte-slash-empty {
    padding: 10px 12px;
    font-size: 13px;
    font-style: italic;
    color: var(--rte-muted, #9aa0a6);
  }
`;
