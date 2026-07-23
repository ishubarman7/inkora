'use client';
import React, { useState, useRef, useEffect } from 'react';
import katex from 'katex';
import {
  BoldIcon, ItalicIcon, UnderlineIcon, StrikeIcon, CodeBlockIcon,
  LinkIcon, AlignLeftIcon, AlignCenterIcon, AlignRightIcon, AlignJustifyIcon,
  BulletListIcon, OrderedListIcon, TaskListIcon, QuoteIcon, HrIcon,
  ImageIcon, VideoIcon, AudioIcon, UndoIcon, RedoIcon,
  SubIcon, SupIcon, ChevronDownIcon, SunIcon, MoonIcon,
  PlusRowIcon, PlusColIcon, MinusRowIcon, MinusColIcon, MergeCellsIcon, CalloutIcon,
  MaximizeIcon, MinimizeIcon,
} from './Icons.jsx';

const TOOLBAR_CSS = `
.rte-toolbar { font-family: 'Roboto', Arial, sans-serif; }
.rte-toolbar * { box-sizing: border-box; }
.rte-btn {
  display: inline-flex; align-items: center; justify-content: center;
  height: 24px; min-width: 24px; padding: 0 2px; border: none;
  background: transparent; color: var(--rte-ink); border-radius: 7px;
  cursor: pointer; transition: background 0.1s, color 0.1s; flex-shrink: 0;
}
.rte-btn:hover { background: var(--rte-hover); }
.rte-btn.is-active { background: var(--rte-accent-soft); color: var(--rte-accent); }
.rte-btn:disabled { opacity: 0.38; cursor: not-allowed; pointer-events: none; }
.rte-menu-btn {
  padding: 4px 6px; border: none; background: transparent;
  color: var(--rte-ink); font-family: 'Roboto', Arial, sans-serif;
  font-size: 12px; border-radius: 6px; cursor: pointer;
  transition: background 0.1s; white-space: nowrap;
}
.rte-menu-btn:hover, .rte-menu-btn.open { background: var(--rte-hover); }
.rte-drop-panel {
  position: absolute; top: calc(100% + 5px); left: 0; min-width: 220px;
  background: var(--rte-bar); border: 1px solid var(--rte-border);
  border-radius: 10px; box-shadow: 0 8px 28px rgba(0,0,0,.18);
  padding: 6px; z-index: 200;
}
.rte-drop-item {
  display: flex; width: 100%; align-items: center; gap: 10px;
  padding: 7px 12px; background: transparent; border: none;
  color: var(--rte-ink); font-family: 'Roboto', Arial, sans-serif;
  font-size: 13px; text-align: left; border-radius: 6px; cursor: pointer;
  transition: background 0.1s;
}
.rte-drop-item:hover { background: var(--rte-hover); }
.rte-drop-sep { height: 1px; background: var(--rte-border); margin: 5px 6px; }
.rte-kbd { margin-left: auto; color: var(--rte-muted); font-size: 12px; white-space: nowrap; }
.rte-swatch {
  width: 22px; height: 22px; border-radius: 50%;
  border: 1.5px solid var(--rte-border); cursor: pointer;
  transition: transform 0.1s, border-color 0.1s; flex-shrink: 0;
}
.rte-swatch:hover { transform: scale(1.15); border-color: var(--rte-muted); }
.rte-swatch.active { border-color: var(--rte-accent); border-width: 2.5px; }

.rte-drop-item-container {
  position: relative;
  width: 100%;
}
.rte-submenu-panel {
  position: absolute;
  top: -6px;
  left: calc(100% - 2px);
  min-width: 195px;
  background: var(--rte-bar);
  border: 1px solid var(--rte-border);
  border-radius: 10px;
  box-shadow: 0 8px 28px rgba(0,0,0,.18);
  padding: 6px;
  z-index: 250;
}

.rte-modal-overlay {
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(15, 23, 42, 0.45);
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);
  display: flex; align-items: center; justify-content: center;
  z-index: 500;
  animation: rte-fade-in 0.2s ease-out;
}
.rte-modal {
  background: var(--rte-bar);
  border: 1px solid var(--rte-border);
  border-radius: 12px;
  width: 90%; max-width: 460px;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.15), 0 10px 10px -5px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  animation: rte-scale-up 0.2s cubic-bezier(0.16, 1, 0.3, 1);
}
.rte-modal-header {
  display: flex; align-items: center; justify-content: space-between;
  padding: 14px 18px;
  border-bottom: 1px solid var(--rte-border);
}
.rte-modal-title {
  font-size: 15px; font-weight: 600; color: var(--rte-ink);
}
.rte-modal-close {
  background: transparent; border: none; cursor: pointer; color: var(--rte-muted);
  display: inline-flex; align-items: center; justify-content: center;
  padding: 4px; border-radius: 6px; transition: background 0.1s;
}
.rte-modal-close:hover {
  background: var(--rte-hover); color: var(--rte-ink);
}
.rte-modal-body {
  padding: 18px;
}
.rte-modal-footer {
  padding: 12px 18px; border-top: 1px solid var(--rte-border);
  display: flex; justify-content: flex-end; gap: 8px;
  background: var(--rte-pill);
}
.rte-input {
  width: 100%; padding: 8px 12px; font-size: 13.5px; border-radius: 6px;
  border: 1.5px solid var(--rte-border); background: var(--rte-page); color: var(--rte-ink);
  outline: none; transition: border-color 0.15s;
}
.rte-input:focus {
  border-color: var(--rte-accent);
}
.rte-btn-primary {
  background: var(--rte-accent); color: white; border: none; padding: 7px 16px;
  font-size: 13px; font-weight: 500; border-radius: 6px; cursor: pointer; transition: opacity 0.1s;
}
.rte-btn-primary:hover { opacity: 0.9; }
.rte-btn-secondary {
  background: transparent; color: var(--rte-ink); border: 1px solid var(--rte-border);
  padding: 7px 16px; font-size: 13px; font-weight: 500; border-radius: 6px; cursor: pointer;
  transition: background 0.1s;
}
.rte-btn-secondary:hover { background: var(--rte-hover); }
.rte-modal-btn {
  background: var(--rte-pill); color: var(--rte-ink); border: 1px solid var(--rte-border);
  padding: 7px 14px; font-size: 13px; font-weight: 500; border-radius: 6px; cursor: pointer;
  transition: background 0.1s;
}
.rte-modal-btn:hover { background: var(--rte-hover); }
.rte-modal-btn-primary {
  background: var(--rte-accent) !important; color: #fff !important; border-color: transparent !important;
}
.rte-modal-btn-primary:hover { opacity: 0.9; }

.rte-gif-grid {
  display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; max-height: 200px; overflow-y: auto; margin-top: 12px;
}
.rte-gif-item {
  border-radius: 6px; overflow: hidden; height: 70px; border: 1.5px solid transparent; cursor: pointer; position: relative;
}
.rte-gif-item img {
  width: 100%; height: 100%; object-fit: cover; transition: transform 0.2s;
}
.rte-gif-item:hover img {
  transform: scale(1.08);
}
.rte-gif-item:hover {
  border-color: var(--rte-accent);
}
.rte-gif-label {
  position: absolute; bottom: 0; left: 0; right: 0; background: rgba(0,0,0,0.6); color: white; font-size: 9px; text-align: center; padding: 2px 0; font-weight: 500;
}

.rte-shape-grid {
  display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; margin-bottom: 14px;
}
.rte-shape-item {
  aspect-ratio: 1; border: 1px solid var(--rte-border); border-radius: 8px; display: flex; align-items: center; justify-content: center; cursor: pointer; background: var(--rte-page); transition: transform 0.1s, border-color 0.1s;
}
.rte-shape-item:hover {
  transform: scale(1.05); border-color: var(--rte-accent);
}
.rte-shape-item.active {
  border-color: var(--rte-accent); border-width: 2px; background: var(--rte-accent-soft);
}

@keyframes rte-fade-in {
  from { opacity: 0; } to { opacity: 1; }
}
@keyframes rte-scale-up {
  from { transform: scale(0.96); opacity: 0; } to { transform: scale(1); opacity: 1; }
}
`;

const TEXT_COLORS = [
  '#202124','#5f6368','#9aa0a6','#d93025','#e8710a','#f9ab00','#1e8e3e',
  '#188038','#1a73e8','#0b57d0','#7b34d6','#a142f4','#e52592','#ffffff',
];

const HIGHLIGHT_COLORS = [
  '#fff475','#ccff90','#a7ffeb','#cbf0f8','#fdcfe8',
  '#ffc8aa','#d7aefb','#fdd663','#ffffff', null,
];

const FONTS = [
  { label: 'Default', value: '' },
  { label: 'Arial', value: 'Arial' },
  { label: 'Georgia', value: 'Georgia' },
  { label: 'Times New Roman', value: 'Times New Roman' },
  { label: 'Roboto', value: 'Roboto' },
  { label: 'Verdana', value: 'Verdana' },
  { label: 'Courier New', value: 'Courier New' },
];

function Sep() {
  return <div style={{ width: 1, height: 16, background: 'var(--rte-border)', margin: '0 3px', flexShrink: 0 }} />;
}
function DropSep() {
  return <div className="rte-drop-sep" />;
}

function DropItem({ children, kbd, onAction, style }) {
  return (
    <button
      className="rte-drop-item"
      style={style}
      onMouseDown={e => { e.preventDefault(); onAction && onAction(); }}
    >
      {children}
      {kbd && <span className="rte-kbd">{kbd}</span>}
    </button>
  );
}

function MenuBarMenu({ label, name, open, onToggle, children, panelStyle }) {
  return (
    <div style={{ position: 'relative' }}>
      <button
        className={`rte-menu-btn${open === name ? ' open' : ''}`}
        onMouseDown={e => { e.preventDefault(); onToggle(name); }}
      >
        {label}
      </button>
      {open === name && (
        <div className="rte-drop-panel" style={panelStyle}>{children}</div>
      )}
    </div>
  );
}

// ─── Table Grid Picker (inline, no overflow) ──────────────────────────────────

function TableGridPicker({ editor, label, tableHover, setTableHover, subOpen, setSubOpen, onClose }) {
  return (
    <div>
      <button
        className="rte-drop-item"
        style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}
        onMouseDown={e => {
          e.preventDefault();
          setSubOpen(subOpen === 'table' ? null : 'table');
        }}
      >
        <span style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontSize: 12 }}>⊞</span>
          {label}
        </span>
        <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
          <path d={subOpen === 'table' ? 'M2 7l3-4 3 4' : 'M2 3l3 4 3-4'} />
        </svg>
      </button>
      {subOpen === 'table' && (
        <div 
          style={{ padding: '6px 6px 8px', borderTop: '1px solid var(--rte-border)', marginTop: 2 }}
          onMouseLeave={() => setTableHover({ rows: 0, cols: 0 })}
        >
          <div style={{
            fontSize: 11, fontWeight: 600, textAlign: 'center', marginBottom: 6,
            color: tableHover.rows > 0 ? 'var(--rte-accent)' : 'var(--rte-muted)',
          }}>
            {tableHover.rows > 0 ? `${tableHover.rows} × ${tableHover.cols} Table` : 'Hover to select size'}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(10, 1fr)', gap: 2 }}>
            {Array.from({ length: 100 }, (_, i) => {
              const r = Math.floor(i / 10);
              const c = i % 10;
              const active = r < tableHover.rows && c < tableHover.cols;
              return (
                <div
                  key={i}
                  onMouseEnter={() => setTableHover({ rows: r + 1, cols: c + 1 })}
                  onMouseDown={e => {
                    e.preventDefault();
                    editor?.chain().focus().insertTable({ rows: r + 1, cols: c + 1, withHeaderRow: true }).run();
                    onClose();
                    setSubOpen(null);
                    setTableHover({ rows: 0, cols: 0 });
                  }}
                  style={{
                    aspectRatio: '1', borderRadius: 2, cursor: 'pointer',
                    background: active ? 'var(--rte-accent)' : 'var(--rte-pill)',
                    border: `1.5px solid ${active ? 'var(--rte-accent)' : 'var(--rte-border)'}`,
                    transition: 'background .05s, border-color .05s',
                  }}
                />
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Row 1: Menu Bar ───────────────────────────────────────────────────────────

function MenuBar({ editor, open, onToggle, onClose, onToggleTheme, theme, imageRef, videoRef, audioRef, onSelectModal, isFullscreen, onToggleFullscreen }) {
  const [subOpen, setSubOpen] = useState(null);
  const [tableHover, setTableHover] = useState({ rows: 0, cols: 0 });

  const insertLink = () => { onClose(); onSelectModal('link'); };

  const insertImage = () => { onClose(); imageRef.current?.click(); };
  const insertVideo = () => { onClose(); videoRef.current?.click(); };
  const insertAudio = () => { onClose(); audioRef.current?.click(); };

  const insertTable = () => {
    onClose();
    editor?.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run();
  };

  const exportHtml = () => { onClose(); onSelectModal('html_editor'); };

  const newDoc = () => { onClose(); onSelectModal('confirm_clear'); };

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 1, padding: '3px 6px', borderBottom: '1px solid var(--rte-border)', position: 'relative', zIndex: 100, borderTopLeftRadius: 13, borderTopRightRadius: 13 }}>

      <MenuBarMenu label="File" name="file" open={open} onToggle={onToggle}>
        <DropItem onAction={newDoc}>New File</DropItem>
        <DropItem onAction={() => { onClose(); editor?.chain().focus().clearContent().run(); }}>Clear</DropItem>
        <DropSep />
        <DropItem onAction={exportHtml}>Export HTML</DropItem>
        <DropItem onAction={() => { onClose(); window.print(); }} kbd="⌘P">Print</DropItem>
      </MenuBarMenu>

      <MenuBarMenu label="Edit" name="edit" open={open} onToggle={onToggle}>
        <DropItem onAction={() => { onClose(); editor?.chain().focus().undo().run(); }} kbd="⌘Z">Undo</DropItem>
        <DropItem onAction={() => { onClose(); editor?.chain().focus().redo().run(); }} kbd="⌘Y">Redo</DropItem>
        <DropSep />
        <DropItem onAction={() => {
          onClose();
          const text = window.getSelection()?.toString() || '';
          if (text) {
            navigator.clipboard?.writeText(text).then(() => {
              editor?.chain().focus().deleteSelection().run();
            }).catch(() => document.execCommand('cut'));
          }
        }}>Cut</DropItem>
        <DropItem onAction={() => {
          onClose();
          const text = window.getSelection()?.toString() || '';
          if (text) navigator.clipboard?.writeText(text).catch(() => document.execCommand('copy'));
        }}>Copy</DropItem>
        <DropSep />
        <DropItem onAction={() => { onClose(); editor?.commands.selectAll(); }} kbd="⌘A">Select all</DropItem>
      </MenuBarMenu>

      <MenuBarMenu label="View" name="view" open={open} onToggle={onToggle}>
        <DropItem onAction={() => { onClose(); onToggleTheme && onToggleTheme(); }}>Toggle dark mode</DropItem>
        <DropItem onAction={() => { onClose(); onSelectModal('html_editor'); }}>HTML Editor</DropItem>
        <DropItem onAction={() => {
          onClose();
          if (!document.fullscreenElement) document.documentElement.requestFullscreen?.();
          else document.exitFullscreen?.();
        }}>Full screen</DropItem>
        <DropSep />
        <div
          className="rte-drop-item-container"
          onMouseEnter={() => setSubOpen('view_styles')}
          onMouseLeave={() => setSubOpen(null)}
        >
          <button className="rte-drop-item" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }} onMouseDown={e => e.preventDefault()}>
            Paragraph style
            <span style={{ fontSize: 9, color: 'var(--rte-muted)' }}>▶</span>
          </button>
          {subOpen === 'view_styles' && (
            <div className="rte-submenu-panel">
              <DropItem onAction={() => { editor?.chain().focus().setParagraph().run(); onClose(); }}>Normal text</DropItem>
              <DropItem style={{ fontSize: 16, fontWeight: 600 }} onAction={() => { editor?.chain().focus().toggleHeading({ level: 1 }).run(); onClose(); }}>Heading 1</DropItem>
              <DropItem style={{ fontSize: 14, fontWeight: 600 }} onAction={() => { editor?.chain().focus().toggleHeading({ level: 2 }).run(); onClose(); }}>Heading 2</DropItem>
              <DropItem style={{ fontSize: 12, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.04em', color: 'var(--rte-muted)' }} onAction={() => { editor?.chain().focus().toggleHeading({ level: 3 }).run(); onClose(); }}>Heading 3</DropItem>
              <DropItem style={{ fontStyle: 'italic', color: 'var(--rte-muted)' }} onAction={() => { editor?.chain().focus().toggleBlockquote().run(); onClose(); }}>Quote</DropItem>
              <DropItem style={{ fontFamily: "'Roboto Mono', monospace", fontSize: 12 }} onAction={() => { editor?.chain().focus().setCodeBlock().run(); onClose(); }}>Code block</DropItem>
            </div>
          )}
        </div>
        <div
          className="rte-drop-item-container"
          onMouseEnter={() => setSubOpen('view_fonts')}
          onMouseLeave={() => setSubOpen(null)}
        >
          <button className="rte-drop-item" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }} onMouseDown={e => e.preventDefault()}>
            Font family
            <span style={{ fontSize: 9, color: 'var(--rte-muted)' }}>▶</span>
          </button>
          {subOpen === 'view_fonts' && (
            <div className="rte-submenu-panel">
              {FONTS.map(f => (
                <DropItem
                  key={f.value}
                  style={{ fontFamily: f.value || 'inherit', fontSize: 12.5 }}
                  onAction={() => {
                    if (f.value) editor?.chain().focus().setFontFamily(f.value).run();
                    else editor?.chain().focus().unsetFontFamily().run();
                    onClose();
                  }}
                >
                  {f.label}
                </DropItem>
              ))}
            </div>
          )}
        </div>
      </MenuBarMenu>

      <MenuBarMenu label="Insert" name="insert" open={open} onToggle={onToggle}>
        {/* Upload File Submenu */}
        <div
          className="rte-drop-item-container"
          onMouseEnter={() => setSubOpen('upload')}
          onMouseLeave={() => setSubOpen(null)}
        >
          <button className="rte-drop-item" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }} onMouseDown={e => e.preventDefault()}>
            Upload File
            <span style={{ fontSize: 9, color: 'var(--rte-muted)' }}>▶</span>
          </button>
          {subOpen === 'upload' && (
            <div className="rte-submenu-panel">
              <DropItem onAction={insertImage}>Image</DropItem>
              <DropItem onAction={insertVideo}>Video</DropItem>
              <DropItem onAction={insertAudio}>Audio</DropItem>
            </div>
          )}
        </div>

        {/* Media Embed Submenu */}
        <div
          className="rte-drop-item-container"
          onMouseEnter={() => setSubOpen('media')}
          onMouseLeave={() => setSubOpen(null)}
        >
          <button className="rte-drop-item" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }} onMouseDown={e => e.preventDefault()}>
            Media Embed
            <span style={{ fontSize: 9, color: 'var(--rte-muted)' }}>▶</span>
          </button>
          {subOpen === 'media' && (
            <div className="rte-submenu-panel">
              <DropItem onAction={() => { onClose(); onSelectModal('image_url'); }}>Image URL</DropItem>
              <DropItem onAction={() => { onClose(); onSelectModal('video_url'); }}>Video URL</DropItem>
              <DropItem onAction={() => { onClose(); onSelectModal('audio_url'); }}>Audio URL</DropItem>
              <DropItem onAction={() => { onClose(); onSelectModal('gif'); }}>Animated GIF</DropItem>
              <DropItem onAction={() => { onClose(); onSelectModal('video_embed'); }}>Video Embed (YouTube)</DropItem>
            </div>
          )}
        </div>

        <DropSep />

        <DropItem onAction={() => { onClose(); onSelectModal('shape'); }}>
          <span style={{ display: 'inline-flex', width: 14, justifyContent: 'center', fontSize: 12 }}>⬡</span>
          Vector Shape
        </DropItem>
        <DropItem onAction={() => { onClose(); onSelectModal('math'); }}>
          <span style={{ display: 'inline-flex', width: 14, justifyContent: 'center', fontSize: 12 }}>∑</span>
          Math Formula (LaTeX)
        </DropItem>
        <DropSep />
        <TableGridPicker
          editor={editor}
          label="Table"
          tableHover={tableHover}
          setTableHover={setTableHover}
          subOpen={subOpen}
          setSubOpen={setSubOpen}
          onClose={onClose}
        />
        <DropItem onAction={insertLink}>
          <LinkIcon size={14} />
          Link
          <span className="rte-kbd">⌘K</span>
        </DropItem>
        <DropSep />
        <DropItem onAction={() => { onClose(); editor?.chain().focus().setHorizontalRule().run(); }}>
          <span style={{ fontSize: 13 }}>—</span>
          Horizontal line
        </DropItem>
        <DropItem onAction={() => { onClose(); editor?.chain().focus().setCodeBlock().run(); }}>
          <span style={{ fontFamily: 'monospace', fontSize: 12 }}>&lt;&gt;</span>
          Code block
        </DropItem>
        <DropItem onAction={() => { onClose(); editor?.chain().focus().setCallout().run(); }}>
          <CalloutIcon size={14} />
          Callout
        </DropItem>
      </MenuBarMenu>

      <MenuBarMenu label="Format" name="format" open={open} onToggle={onToggle}>
        <DropItem onAction={() => { onClose(); editor?.chain().focus().toggleBold().run(); }} kbd="⌘B">
          <span style={{ fontWeight: 700 }}>Bold</span>
        </DropItem>
        <DropItem onAction={() => { onClose(); editor?.chain().focus().toggleItalic().run(); }} kbd="⌘I">
          <span style={{ fontStyle: 'italic' }}>Italic</span>
        </DropItem>
        <DropItem onAction={() => { onClose(); editor?.chain().focus().toggleUnderline().run(); }} kbd="⌘U">
          <span style={{ textDecoration: 'underline' }}>Underline</span>
        </DropItem>
        <DropItem onAction={() => { onClose(); editor?.chain().focus().toggleStrike().run(); }}>
          <span style={{ textDecoration: 'line-through' }}>Strikethrough</span>
        </DropItem>
        <DropSep />
        <DropItem onAction={() => { onClose(); editor?.chain().focus().toggleSubscript().run(); }}>Subscript</DropItem>
        <DropItem onAction={() => { onClose(); editor?.chain().focus().toggleSuperscript().run(); }}>Superscript</DropItem>
        <DropSep />
        <div
          className="rte-drop-item-container"
          onMouseEnter={() => setSubOpen('lineheight')}
          onMouseLeave={() => setSubOpen(null)}
        >
          <button className="rte-drop-item" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }} onMouseDown={e => e.preventDefault()}>
            Line spacing
            <span style={{ fontSize: 9, color: 'var(--rte-muted)' }}>▶</span>
          </button>
          {subOpen === 'lineheight' && (
            <div className="rte-submenu-panel">
              <DropItem onAction={() => { editor?.chain().focus().setLineHeight('1').run(); onClose(); }}>Single</DropItem>
              <DropItem onAction={() => { editor?.chain().focus().setLineHeight('1.15').run(); onClose(); }}>1.15</DropItem>
              <DropItem onAction={() => { editor?.chain().focus().setLineHeight('1.5').run(); onClose(); }}>1.5</DropItem>
              <DropItem onAction={() => { editor?.chain().focus().setLineHeight('2').run(); onClose(); }}>Double</DropItem>
              <DropItem onAction={() => { editor?.chain().focus().setLineHeight('2.5').run(); onClose(); }}>2.5</DropItem>
              <DropItem onAction={() => { editor?.chain().focus().setLineHeight('3').run(); onClose(); }}>Triple</DropItem>
            </div>
          )}
        </div>
        <DropSep />
        <DropItem onAction={() => { onClose(); editor?.chain().focus().toggleHeading({ level: 1 }).run(); }}
          style={{ fontSize: 18, fontWeight: 600 }}>Heading 1</DropItem>
        <DropItem onAction={() => { onClose(); editor?.chain().focus().toggleHeading({ level: 2 }).run(); }}
          style={{ fontSize: 15, fontWeight: 600 }}>Heading 2</DropItem>
        <DropItem onAction={() => { onClose(); editor?.chain().focus().toggleHeading({ level: 3 }).run(); }}
          style={{ fontSize: 13, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.04em', color: 'var(--rte-muted)' }}>HEADING 3</DropItem>
        <DropItem onAction={() => { onClose(); editor?.chain().focus().setParagraph().run(); }}>Normal text</DropItem>
        <DropSep />
        <DropItem onAction={() => { onClose(); editor?.chain().focus().unsetAllMarks().clearNodes().run(); }} kbd="⌘\">
          Clear formatting
        </DropItem>
      </MenuBarMenu>

      <MenuBarMenu label="Tools" name="tools" open={open} onToggle={onToggle}>
        <DropItem onAction={() => { onClose(); onSelectModal('word_count'); }}>Word count</DropItem>
      </MenuBarMenu>

      <MenuBarMenu label="Help" name="help" open={open} onToggle={onToggle}>
        <DropItem onAction={() => { onClose(); onSelectModal('shortcuts'); }}>Keyboard shortcuts</DropItem>
        <DropItem onAction={onClose}>About Inkora</DropItem>
      </MenuBarMenu>

      <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 2 }}>
        <button className="rte-btn" title="Undo ⌘Z" disabled={!editor?.can().undo()}
          onMouseDown={e => { e.preventDefault(); editor?.chain().focus().undo().run(); }}>
          <UndoIcon size={14} />
        </button>
        <button className="rte-btn" title="Redo ⌘Y" disabled={!editor?.can().redo()}
          onMouseDown={e => { e.preventDefault(); editor?.chain().focus().redo().run(); }}>
          <RedoIcon size={14} />
        </button>
        <Sep />
        <button
          className="rte-btn"
          title={isFullscreen ? 'Minimize screen' : 'Full screen'}
          onMouseDown={e => { e.preventDefault(); onToggleFullscreen && onToggleFullscreen(); }}
        >
          {isFullscreen ? <MinimizeIcon size={14} /> : <MaximizeIcon size={14} />}
        </button>
      </div>
    </div>
  );
}

// ─── Row 2: Format Bar ─────────────────────────────────────────────────────────

function ColorDropdown({ editor, open, onToggle, onClose, textColor, onTextColorChange }) {
  return (
    <div style={{ position: 'relative' }}>
      <button
        className={`rte-btn${open === 'color' ? ' is-active' : ''}`}
        title="Text color"
        onMouseDown={e => { e.preventDefault(); onToggle('color'); }}
        style={{ flexDirection: 'column', gap: 1 }}
      >
        <span style={{ fontSize: 13, fontWeight: 700, lineHeight: 1 }}>A</span>
        <span style={{ width: 16, height: 3, borderRadius: 2, background: textColor }} />
      </button>
      {open === 'color' && (
        <div className="rte-drop-panel" style={{ minWidth: 'auto', width: 'auto' }}>
          <div style={{ fontSize: 11, color: 'var(--rte-muted)', marginBottom: 8, padding: '0 4px' }}>Text color</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 22px)', gap: 7, padding: '0 4px 4px' }}>
            {TEXT_COLORS.map(c => (
              <button
                key={c}
                className={`rte-swatch${textColor === c ? ' active' : ''}`}
                style={{ background: c }}
                onMouseDown={e => {
                  e.preventDefault();
                  editor?.chain().focus().setColor(c).run();
                  onTextColorChange(c);
                  onClose();
                }}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function HiliteDropdown({ editor, open, onToggle, onClose }) {
  return (
    <div style={{ position: 'relative' }}>
      <button
        className={`rte-btn${open === 'hilite' ? ' is-active' : ''}`}
        title="Highlight color"
        onMouseDown={e => { e.preventDefault(); onToggle('hilite'); }}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 15l-4 4-3-3 4-4"/><path d="M14.5 4.5l5 5L11 18l-5-5 8.5-8.5Z"/><path d="M4 21h7"/>
        </svg>
      </button>
      {open === 'hilite' && (
        <div className="rte-drop-panel" style={{ minWidth: 'auto', width: 'auto' }}>
          <div style={{ fontSize: 11, color: 'var(--rte-muted)', marginBottom: 8, padding: '0 4px' }}>Highlight</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 22px)', gap: 7, padding: '0 4px 4px' }}>
            {HIGHLIGHT_COLORS.map((c, i) => (
              <button
                key={i}
                className="rte-swatch"
                title={c === null ? 'None' : c}
                style={{
                  background: c || 'var(--rte-bar)',
                  position: 'relative', overflow: 'hidden',
                }}
                onMouseDown={e => {
                  e.preventDefault();
                  if (c === null) editor?.chain().focus().unsetHighlight().run();
                  else editor?.chain().focus().setHighlight({ color: c }).run();
                  onClose();
                }}
              >
                {c === null && (
                  <span style={{ position: 'absolute', left: 1, top: 9, width: 20, height: 1.5, background: '#d93025', transform: 'rotate(-45deg)' }} />
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function AlignDropdown({ editor, open, onToggle, onClose }) {
  const currentAlign = editor?.isActive({ textAlign: 'center' }) ? 'center'
    : editor?.isActive({ textAlign: 'right' }) ? 'right'
    : editor?.isActive({ textAlign: 'justify' }) ? 'justify'
    : 'left';

  const icons = {
    left: <AlignLeftIcon size={14} />,
    center: <AlignCenterIcon size={14} />,
    right: <AlignRightIcon size={14} />,
    justify: <AlignJustifyIcon size={14} />,
  };

  return (
    <div style={{ position: 'relative' }}>
      <button
        className={`rte-btn${open === 'align' ? ' is-active' : ''}`}
        title="Alignment"
        onMouseDown={e => { e.preventDefault(); onToggle('align'); }}
        style={{ gap: 2 }}
      >
        {icons[currentAlign]}
        <ChevronDownIcon size={11} />
      </button>
      {open === 'align' && (
        <div className="rte-drop-panel" style={{ minWidth: 'auto', display: 'flex', gap: 2, padding: 6 }}>
          {Object.entries(icons).map(([align, icon]) => (
            <button
              key={align}
              className={`rte-btn${currentAlign === align ? ' is-active' : ''}`}
              title={align.charAt(0).toUpperCase() + align.slice(1)}
              onMouseDown={e => {
                e.preventDefault();
                editor?.chain().focus().setTextAlign(align).run();
                onClose();
              }}
            >
              {icon}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function SpacingDropdown({ editor, open, onToggle, onClose }) {
  const spacings = [
    { label: 'Single', value: '1' },
    { label: '1.15', value: '1.15' },
    { label: '1.5', value: '1.5' },
    { label: 'Double', value: '2' },
    { label: '2.5', value: '2.5' },
    { label: 'Triple', value: '3' },
  ];

  return (
    <div style={{ position: 'relative' }}>
      <button
        className={`rte-btn${open === 'space' ? ' is-active' : ''}`}
        title="Line spacing"
        onMouseDown={e => { e.preventDefault(); onToggle('space'); }}
        style={{ gap: 2 }}
      >
        <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 6H8M21 12H8M21 18H8M4 4v16M4 4l-2 2M4 4l2 2M4 20l-2-2M4 20l2-2"/>
        </svg>
        <ChevronDownIcon size={11} />
      </button>
      {open === 'space' && (
        <div className="rte-drop-panel" style={{ minWidth: 110 }}>
          {spacings.map(s => (
            <DropItem
              key={s.value}
              onAction={() => {
                editor?.chain().focus().setLineHeight(s.value).run();
                onClose();
              }}
            >
              {s.label}
            </DropItem>
          ))}
        </div>
      )}
    </div>
  );
}

function ListDropdown({ editor, open, onToggle, onClose }) {
  const isTask     = editor?.isActive('taskList');
  const isBullet   = editor?.isActive('bulletList');
  const isOrdered  = editor?.isActive('orderedList');

  const currentIcon = isTask ? (
    <TaskListIcon size={14} />
  ) : isOrdered ? (
    <OrderedListIcon size={14} />
  ) : (
    <BulletListIcon size={14} />
  );

  return (
    <div style={{ position: 'relative' }}>
      <button
        className={`rte-btn${(isTask || isBullet || isOrdered) ? ' is-active' : ''}${open === 'list' ? ' is-active' : ''}`}
        title="Lists & indent"
        onMouseDown={e => { e.preventDefault(); onToggle('list'); }}
        style={{ gap: 2 }}
      >
        {currentIcon}
        <ChevronDownIcon size={11} />
      </button>
      {open === 'list' && (
        <div className="rte-drop-panel" style={{ minWidth: 'auto', padding: 6, display: 'flex', flexDirection: 'column', gap: 2 }}>
          {/* List type row */}
          <div style={{ display: 'flex', gap: 2 }}>
            <button
              className={`rte-btn${isTask ? ' is-active' : ''}`}
              title="Task list"
              onMouseDown={e => { e.preventDefault(); editor?.chain().focus().toggleTaskList().run(); onClose(); }}
            >
              <TaskListIcon size={14} />
            </button>
            <button
              className={`rte-btn${isBullet ? ' is-active' : ''}`}
              title="Bullet list"
              onMouseDown={e => { e.preventDefault(); editor?.chain().focus().toggleBulletList().run(); onClose(); }}
            >
              <BulletListIcon size={14} />
            </button>
            <button
              className={`rte-btn${isOrdered ? ' is-active' : ''}`}
              title="Numbered list"
              onMouseDown={e => { e.preventDefault(); editor?.chain().focus().toggleOrderedList().run(); onClose(); }}
            >
              <OrderedListIcon size={14} />
            </button>
          </div>
          {/* Indent row */}
          <div style={{ display: 'flex', gap: 2, borderTop: '1px solid var(--rte-border)', paddingTop: 4, marginTop: 2 }}>
            <button
              className="rte-btn"
              title="Decrease indent"
              onMouseDown={e => { e.preventDefault(); editor?.chain().focus().liftListItem('listItem').run(); onClose(); }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 6H10M21 12H10M21 18H3M7 9l-4 3 4 3"/>
              </svg>
            </button>
            <button
              className="rte-btn"
              title="Increase indent"
              onMouseDown={e => { e.preventDefault(); editor?.chain().focus().sinkListItem('listItem').run(); onClose(); }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 6H10M21 12H10M21 18H3M3 9l4 3-4 3"/>
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function FormatBar({ editor, open, onToggle, onClose, fontSize, onFontSizeChange, textColor, onTextColorChange, onHtmlEditor, onSelectModal }) {
  const changeFontSize = (dir) => {
    const next = Math.max(8, Math.min(96, fontSize + (dir === 'up' ? 1 : -1)));
    onFontSizeChange(next);
    editor?.chain().focus().setFontSize(`${Math.round(next * 1.333)}px`).run();
  };

  const insertLink = () => { onClose(); onSelectModal('link'); };
  const isInTable = editor?.isActive('table') || editor?.isActive('tableCell') || editor?.isActive('tableHeader');

  return (
    <div style={{
      display: 'flex', flexWrap: 'nowrap', alignItems: 'center', gap: 1,
      padding: '3px 4px', borderBottom: '1px solid var(--rte-border)',
      background: 'var(--rte-pill)', position: 'relative', zIndex: 50,
    }}>



      {/* Font size */}
      <div style={{ display: 'inline-flex', alignItems: 'center', gap: 2 }}>
        <button className="rte-btn" title="Decrease font size" style={{ fontSize: 16, minWidth: 22, height: 24 }}
          onMouseDown={e => { e.preventDefault(); changeFontSize('down'); }}>−</button>
        <span style={{
          minWidth: 24, height: 24, display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 12, border: '1px solid var(--rte-border)', borderRadius: 6, background: 'var(--rte-bar)',
          padding: '0 4px',
        }}>{fontSize}</span>
        <button className="rte-btn" title="Increase font size" style={{ fontSize: 16, minWidth: 22, height: 24 }}
          onMouseDown={e => { e.preventDefault(); changeFontSize('up'); }}>+</button>
      </div>

      <Sep />

      {/* Bold / Italic / Underline */}
      <button className={`rte-btn${editor?.isActive('bold') ? ' is-active' : ''}`} title="Bold ⌘B"
        style={{ fontWeight: 700, fontSize: 14 }}
        onMouseDown={e => { e.preventDefault(); editor?.chain().focus().toggleBold().run(); }}>B</button>
      <button className={`rte-btn${editor?.isActive('italic') ? ' is-active' : ''}`} title="Italic ⌘I"
        style={{ fontStyle: 'italic', fontSize: 14, fontFamily: 'Georgia, serif' }}
        onMouseDown={e => { e.preventDefault(); editor?.chain().focus().toggleItalic().run(); }}>I</button>
      <button className={`rte-btn${editor?.isActive('underline') ? ' is-active' : ''}`} title="Underline ⌘U"
        style={{ textDecoration: 'underline', fontSize: 14 }}
        onMouseDown={e => { e.preventDefault(); editor?.chain().focus().toggleUnderline().run(); }}>U</button>

      {/* Text color & Highlight */}
      <ColorDropdown editor={editor} open={open} onToggle={onToggle} onClose={onClose} textColor={textColor} onTextColorChange={onTextColorChange} />
      <HiliteDropdown editor={editor} open={open} onToggle={onToggle} onClose={onClose} />

      <Sep />

      {/* Alignment */}
      <AlignDropdown editor={editor} open={open} onToggle={onToggle} onClose={onClose} />

      {/* Lists & Indent dropdown */}
      <ListDropdown editor={editor} open={open} onToggle={onToggle} onClose={onClose} />

      <Sep />

      {/* Clear formatting */}
      <button className="rte-btn" title="Clear formatting ⌘\"
        onMouseDown={e => { e.preventDefault(); editor?.chain().focus().unsetAllMarks().clearNodes().run(); }}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M6 7V5h13v2"/><path d="M11 5l-2 14M14 12l6 6M20 12l-6 6"/>
        </svg>
      </button>

      <Sep />

      {/* HTML Editor */}
      <button className="rte-btn" title="HTML Editor"
        onMouseDown={e => { e.preventDefault(); onHtmlEditor && onHtmlEditor(); }}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/>
        </svg>
      </button>

      {/* Table operations — contextual, shown while the cursor is inside a table */}
      {isInTable && <>
        <Sep />
        <button className="rte-btn" title="Insert row above" style={{ gap: 1 }}
          onMouseDown={e => { e.preventDefault(); editor?.chain().focus().addRowBefore().run(); }}>
          <PlusRowIcon size={15} /><span style={{ fontSize: 10, lineHeight: 1 }}>↑</span>
        </button>
        <button className="rte-btn" title="Insert row below" style={{ gap: 1 }}
          onMouseDown={e => { e.preventDefault(); editor?.chain().focus().addRowAfter().run(); }}>
          <PlusRowIcon size={15} /><span style={{ fontSize: 10, lineHeight: 1 }}>↓</span>
        </button>
        <button className="rte-btn" title="Delete row"
          onMouseDown={e => { e.preventDefault(); editor?.chain().focus().deleteRow().run(); }}>
          <MinusRowIcon size={15} />
        </button>
        <Sep />
        <button className="rte-btn" title="Insert column left" style={{ gap: 1 }}
          onMouseDown={e => { e.preventDefault(); editor?.chain().focus().addColumnBefore().run(); }}>
          <PlusColIcon size={15} /><span style={{ fontSize: 10, lineHeight: 1 }}>←</span>
        </button>
        <button className="rte-btn" title="Insert column right" style={{ gap: 1 }}
          onMouseDown={e => { e.preventDefault(); editor?.chain().focus().addColumnAfter().run(); }}>
          <PlusColIcon size={15} /><span style={{ fontSize: 10, lineHeight: 1 }}>→</span>
        </button>
        <button className="rte-btn" title="Delete column"
          onMouseDown={e => { e.preventDefault(); editor?.chain().focus().deleteColumn().run(); }}>
          <MinusColIcon size={15} />
        </button>
        <Sep />
        <button className="rte-btn" title="Merge cells" disabled={!editor?.can().mergeCells()}
          onMouseDown={e => { e.preventDefault(); editor?.chain().focus().mergeCells().run(); }}>
          <MergeCellsIcon size={15} />
        </button>
        <button className="rte-btn" title="Split cell" disabled={!editor?.can().splitCell()}
          onMouseDown={e => { e.preventDefault(); editor?.chain().focus().splitCell().run(); }}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="18" height="18" rx="2"/><line x1="3" y1="12" x2="21" y2="12"/><polyline points="10 9 6 12 10 15"/><polyline points="14 9 18 12 14 15"/>
          </svg>
        </button>
        <button className="rte-btn" title="Toggle header row"
          onMouseDown={e => { e.preventDefault(); editor?.chain().focus().toggleHeaderRow().run(); }}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="18" height="18" rx="2"/><line x1="3" y1="9" x2="21" y2="9"/><rect x="3" y="3" width="18" height="6" rx="2" fill="currentColor" fillOpacity=".25" stroke="none"/>
          </svg>
        </button>
        <button className="rte-btn" title="Delete table"
          onMouseDown={e => { e.preventDefault(); editor?.chain().focus().deleteTable().run(); }}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="18" height="18" rx="2"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="12" y1="3" x2="12" y2="21"/><line x1="5" y1="5" x2="19" y2="19" stroke="#d93025" strokeWidth="2.2"/>
          </svg>
        </button>
      </>}
    </div>
  );
}

// ─── Toolbar Modal Component ──────────────────────────────────────────────────

function ToolbarModal({ type, editor, onClose, theme }) {
  const [inputVal, setInputVal] = useState('');
  const [selectedShape, setSelectedShape] = useState('circle');
  const [shapeColor, setShapeColor] = useState('#1a73e8');
  const [katexError, setKatexError] = useState('');
  const mathPreviewRef = useRef(null);

  // Curated GIFs list
  const CURATED_GIFS = [
    { label: 'Success', src: 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExM3BndjI5dWZobXl4ZXp3ZW51bzh3bTdxb3J0dzhsb24wa2Rwcml3MCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/3oz8xAFtqoOUUrEl8c/giphy.gif' },
    { label: 'Mind Blown', src: 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExdWdzZHJ3NndwdXJhMXN1cGN3MmZ3cGdtc2E2djdhdHJidm5lZnprMyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/2zqzd8h2bHjdm/giphy.gif' },
    { label: 'Thumbs Up', src: 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExanJtdDNhZDNrMGFoOG1jMG82aTFibnZnaTA2cDFnaGNlZXZicjM5dyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/tIeCLkB8geYtW/giphy.gif' },
    { label: 'Coding', src: 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExdzB0dHpxMWo0YWNnY3p3NXl2ZXZtZGx2MDZ5OHhndGFmaXZoamxtdiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/QuxqWk7m9ffxyfoa0a/giphy.gif' },
    { label: 'Celebration', src: 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExYnl2ZHptbzRyNzR3eGNzMDd0cW1oZmtxZHk5ODdyczI3NDM0OW8xbiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/l3q2zVr6cu95nF6O4/giphy.gif' },
    { label: 'Confused', src: 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExMzQ1czNqdnp3OGFvOXJ4bzU1OWF4NHp6a3JmbGRvN2d5dWFpMHd4dyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/26gR0YFZxW5Y1jOfC/giphy.gif' },
  ];

  const SHAPES = [
    { id: 'circle', name: 'Circle', draw: (color) => `<circle cx="50" cy="50" r="45" fill="${color}" stroke="${theme === 'dark' ? '#555' : '#ccc'}" stroke-width="2"/>` },
    { id: 'square', name: 'Square', draw: (color) => `<rect x="8" y="8" width="84" height="84" rx="6" fill="${color}" stroke="${theme === 'dark' ? '#555' : '#ccc'}" stroke-width="2"/>` },
    { id: 'triangle', name: 'Triangle', draw: (color) => `<polygon points="50,6 94,88 6,88" fill="${color}" stroke="${theme === 'dark' ? '#555' : '#ccc'}" stroke-width="2"/>` },
    { id: 'star', name: 'Star', draw: (color) => `<polygon points="50,6 64,36 97,36 70,56 81,89 50,69 19,89 30,56 3,36 36,36" fill="${color}" stroke="${theme === 'dark' ? '#555' : '#ccc'}" stroke-width="2"/>` },
    { id: 'arrow-right', name: 'Arrow Right', draw: (color) => `<path d="M10,35 L60,35 L60,18 L90,50 L60,82 L60,65 L10,65 Z" fill="${color}" stroke="${theme === 'dark' ? '#555' : '#ccc'}" stroke-width="2"/>` },
    { id: 'arrow-left', name: 'Arrow Left', draw: (color) => `<path d="M90,35 L40,35 L40,18 L10,50 L40,82 L40,65 L90,65 Z" fill="${color}" stroke="${theme === 'dark' ? '#555' : '#ccc'}" stroke-width="2"/>` },
    { id: 'arrow-up', name: 'Arrow Up', draw: (color) => `<path d="M35,90 L35,40 L18,40 L50,10 L82,40 L65,40 L65,90 Z" fill="${color}" stroke="${theme === 'dark' ? '#555' : '#ccc'}" stroke-width="2"/>` },
    { id: 'arrow-down', name: 'Arrow Down', draw: (color) => `<path d="M35,10 L35,60 L18,60 L50,90 L82,60 L65,60 L65,10 Z" fill="${color}" stroke="${theme === 'dark' ? '#555' : '#ccc'}" stroke-width="2"/>` },
  ];

  const SHAPE_COLORS = [
    { label: 'Blue', value: '#1a73e8' },
    { label: 'Green', value: '#1e8e3e' },
    { label: 'Red', value: '#d93025' },
    { label: 'Yellow', value: '#f9ab00' },
    { label: 'Purple', value: '#7b34d6' },
    { label: 'Slate', value: '#5f6368' },
    { label: 'Ink', value: '#202124' },
    { label: 'White', value: '#ffffff' },
  ];

  // Render latex preview
  useEffect(() => {
    if (type === 'math' && mathPreviewRef.current) {
      const latex = inputVal || 'e = mc^2';
      try {
        katex.render(latex, mathPreviewRef.current, {
          throwOnError: false,
          displayMode: true,
        });
        setKatexError('');
      } catch (err) {
        setKatexError(err.message);
      }
    }
  }, [inputVal, type]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!editor) return;

    if (type === 'image_url') {
      if (inputVal) editor.chain().focus().setImage({ src: inputVal }).run();
    } else if (type === 'video_url') {
      if (inputVal) editor.commands.setVideo({ src: inputVal });
    } else if (type === 'audio_url') {
      if (inputVal) editor.commands.setAudio({ src: inputVal });
    } else if (type === 'gif') {
      if (inputVal) editor.chain().focus().setImage({ src: inputVal, alt: 'GIF' }).run();
    } else if (type === 'video_embed') {
      if (inputVal) {
        // Simple YouTube/Vimeo embedding
        editor.commands.setYoutubeVideo({ src: inputVal });
      }
    } else if (type === 'math') {
      const latex = inputVal || 'e = mc^2';
      editor.chain().focus().setMathFormula({ latex }).run();
    } else if (type === 'shape') {
      const shapeObj = SHAPES.find(s => s.id === selectedShape);
      if (shapeObj) {
        const svgContent = shapeObj.draw(shapeColor);
        const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">${svgContent}</svg>`;
        const src = `data:image/svg+xml;base64,${btoa(svg)}`;
        editor.chain().focus().setImage({ src, alt: shapeObj.name }).run();
      }
    }
    onClose();
  };

  const titles = {
    image_url: 'Insert Image from URL',
    video_url: 'Insert Video from URL',
    audio_url: 'Insert Audio from URL',
    gif: 'Insert Animated GIF',
    video_embed: 'Insert Embedded Video',
    shape: 'Insert Vector Shape',
    math: 'Insert Mathematical Equation (LaTeX)',
  };

  return (
    <div className="rte-modal-overlay" onMouseDown={onClose}>
      <div className="rte-modal" onMouseDown={e => e.stopPropagation()}>
        <div className="rte-modal-header">
          <div className="rte-modal-title">{titles[type]}</div>
          <button className="rte-modal-close" onClick={onClose} type="button">✕</button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="rte-modal-body">
            {(type === 'image_url' || type === 'video_url' || type === 'audio_url') && (
              <div>
                <label style={{ display: 'block', fontSize: 12, color: 'var(--rte-muted)', marginBottom: 6 }}>Source URL</label>
                <input 
                  type="url" 
                  className="rte-input" 
                  placeholder="https://" 
                  value={inputVal} 
                  onChange={e => setInputVal(e.target.value)} 
                  autoFocus 
                  required
                />
              </div>
            )}

            {type === 'video_embed' && (
              <div>
                <label style={{ display: 'block', fontSize: 12, color: 'var(--rte-muted)', marginBottom: 6 }}>YouTube or Vimeo URL</label>
                <input
                  type="url"
                  className="rte-input"
                  placeholder="https://www.youtube.com/watch?v=..."
                  value={inputVal}
                  onChange={e => setInputVal(e.target.value)}
                  autoFocus
                  required
                />
                <div style={{ fontSize: 11, color: 'var(--rte-muted)', marginTop: 6 }}>
                  Paste a YouTube or Vimeo link. Once inserted, drag the handles to resize.
                </div>
              </div>
            )}

            {type === 'gif' && (
              <div>
                <label style={{ display: 'block', fontSize: 12, color: 'var(--rte-muted)', marginBottom: 6 }}>GIF URL</label>
                <input 
                  type="url" 
                  className="rte-input" 
                  placeholder="https://media.giphy.com/media/.../giphy.gif" 
                  value={inputVal} 
                  onChange={e => setInputVal(e.target.value)} 
                  autoFocus 
                />
                
                <div style={{ display: 'flex', alignItems: 'center', margin: '14px 0 8px' }}>
                  <div style={{ height: 1, background: 'var(--rte-border)', flex: 1 }} />
                  <span style={{ fontSize: 10, color: 'var(--rte-muted)', padding: '0 8px', textTransform: 'uppercase', fontWeight: 600 }}>Curated Quick-Insert GIFs</span>
                  <div style={{ height: 1, background: 'var(--rte-border)', flex: 1 }} />
                </div>

                <div className="rte-gif-grid">
                  {CURATED_GIFS.map((g, i) => (
                    <div 
                      key={i} 
                      className="rte-gif-item" 
                      onClick={() => {
                        editor?.chain().focus().setImage({ src: g.src, alt: g.label }).run();
                        onClose();
                      }}
                    >
                      <img src={g.src} alt={g.label} loading="lazy" />
                      <div className="rte-gif-label">{g.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {type === 'math' && (
              <div>
                <label style={{ display: 'block', fontSize: 12, color: 'var(--rte-muted)', marginBottom: 6 }}>LaTeX Expression</label>
                <textarea 
                  className="rte-input" 
                  style={{ fontFamily: 'monospace', minHeight: 80, resize: 'vertical' }}
                  placeholder="e = mc^2 \quad \text{or} \quad \int_{a}^{b} f(x)dx" 
                  value={inputVal} 
                  onChange={e => setInputVal(e.target.value)} 
                  autoFocus 
                  required
                />
                
                <label style={{ display: 'block', fontSize: 12, color: 'var(--rte-muted)', margin: '14px 0 6px' }}>Render Preview</label>
                <div 
                  style={{ 
                    padding: 12, 
                    borderRadius: 6, 
                    background: 'var(--rte-pill)', 
                    border: '1px dashed var(--rte-border)',
                    minHeight: 60,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    overflowX: 'auto',
                  }}
                >
                  {katexError ? (
                    <div style={{ color: '#ef4444', fontSize: 12 }}>{katexError}</div>
                  ) : (
                    <div ref={mathPreviewRef} style={{ fontSize: 16 }} />
                  )}
                </div>
              </div>
            )}

            {type === 'shape' && (
              <div>
                <label style={{ display: 'block', fontSize: 12, color: 'var(--rte-muted)', marginBottom: 8 }}>Select Vector Shape</label>
                <div className="rte-shape-grid">
                  {SHAPES.map(s => {
                    const svgMarkup = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="36" height="36">${s.draw(shapeColor)}</svg>`;
                    return (
                      <button
                        key={s.id}
                        type="button"
                        className={`rte-shape-item${selectedShape === s.id ? ' active' : ''}`}
                        onClick={() => setSelectedShape(s.id)}
                        title={s.name}
                      >
                        <div dangerouslySetInnerHTML={{ __html: svgMarkup }} />
                      </button>
                    );
                  })}
                </div>

                <label style={{ display: 'block', fontSize: 12, color: 'var(--rte-muted)', marginBottom: 8 }}>Shape Fill Color</label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(8, 1fr)', gap: 8 }}>
                  {SHAPE_COLORS.map(c => (
                    <button
                      key={c.value}
                      type="button"
                      className={`rte-swatch${shapeColor === c.value ? ' active' : ''}`}
                      style={{ background: c.value, width: 28, height: 28 }}
                      onClick={() => setShapeColor(c.value)}
                      title={c.label}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
          <div className="rte-modal-footer">
            <button type="button" className="rte-btn-secondary" onClick={onClose}>Cancel</button>
            <button type="submit" className="rte-btn-primary">Insert</button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─── HTML Editor Modal ────────────────────────────────────────────────────────

function LinkModal({ editor, onClose }) {
  const [url, setUrl] = useState(() => editor?.getAttributes('link').href || '');
  const inputRef = useRef(null);
  useEffect(() => { inputRef.current?.focus(); inputRef.current?.select(); }, []);

  const apply = () => {
    if (!editor) return;
    if (!url.trim()) { editor.chain().focus().unsetLink().run(); }
    else { editor.chain().focus().setLink({ href: url.trim() }).run(); }
    onClose();
  };

  return (
    <div className="rte-modal-overlay" onMouseDown={onClose}>
      <div className="rte-modal" style={{ maxWidth: 420, width: '96%' }} onMouseDown={e => e.stopPropagation()}>
        <div className="rte-modal-header">
          <span className="rte-modal-title">Insert link</span>
          <button className="rte-modal-close" onClick={onClose} type="button">✕</button>
        </div>
        <div className="rte-modal-body" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <input
            ref={inputRef}
            type="url"
            placeholder="https://example.com"
            value={url}
            onChange={e => setUrl(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); apply(); } if (e.key === 'Escape') onClose(); }}
            style={{ width: '100%', padding: '9px 12px', fontSize: 14, borderRadius: 7, border: '1.5px solid var(--rte-border)', background: 'var(--rte-page)', color: 'var(--rte-ink)', outline: 'none', boxSizing: 'border-box' }}
          />
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
            {editor?.isActive('link') && (
              <button className="rte-modal-btn" onClick={() => { editor.chain().focus().unsetLink().run(); onClose(); }} style={{ background: 'transparent', color: 'var(--rte-muted)' }}>
                Remove link
              </button>
            )}
            <button className="rte-modal-btn" onClick={onClose} style={{ background: 'transparent', color: 'var(--rte-muted)' }}>Cancel</button>
            <button className="rte-modal-btn rte-modal-btn-primary" onClick={apply}>Apply</button>
          </div>
        </div>
      </div>
    </div>
  );
}

function ConfirmModal({ message, onConfirm, onClose }) {
  return (
    <div className="rte-modal-overlay" onMouseDown={onClose}>
      <div className="rte-modal" style={{ maxWidth: 340, width: '96%' }} onMouseDown={e => e.stopPropagation()}>
        <div className="rte-modal-header">
          <span className="rte-modal-title">Confirm</span>
          <button className="rte-modal-close" onClick={onClose} type="button">✕</button>
        </div>
        <div className="rte-modal-body" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <p style={{ margin: 0, fontSize: 14, color: 'var(--rte-ink)' }}>{message}</p>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
            <button className="rte-modal-btn" onClick={onClose} style={{ background: 'transparent', color: 'var(--rte-muted)' }}>Cancel</button>
            <button className="rte-modal-btn rte-modal-btn-primary" onClick={() => { onConfirm(); onClose(); }}>Clear</button>
          </div>
        </div>
      </div>
    </div>
  );
}

function WordCountModal({ editor, onClose }) {
  const text = editor?.getText() || '';
  const words = text.trim() ? text.trim().split(/\s+/).length : 0;
  const chars = text.length;
  const charsNoSpace = text.replace(/\s/g, '').length;
  const paragraphs = (editor?.getJSON()?.content || []).filter(n => n.type === 'paragraph').length;
  return (
    <div className="rte-modal-overlay" onMouseDown={onClose}>
      <div className="rte-modal" style={{ maxWidth: 300, width: '96%' }} onMouseDown={e => e.stopPropagation()}>
        <div className="rte-modal-header">
          <span className="rte-modal-title">Word count</span>
          <button className="rte-modal-close" onClick={onClose} type="button">✕</button>
        </div>
        <div className="rte-modal-body" style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {[['Words', words], ['Characters', chars], ['Characters (no spaces)', charsNoSpace], ['Paragraphs', paragraphs]].map(([label, val]) => (
            <div key={label} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14 }}>
              <span style={{ color: 'var(--rte-muted)' }}>{label}</span>
              <strong style={{ color: 'var(--rte-ink)' }}>{val}</strong>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ShortcutsModal({ onClose }) {
  const shortcuts = [
    ['Bold', '⌘ B'], ['Italic', '⌘ I'], ['Underline', '⌘ U'],
    ['Strikethrough', '⌘ Shift S'], ['Link', '⌘ K'],
    ['Undo', '⌘ Z'], ['Redo', '⌘ Y'], ['Select all', '⌘ A'],
    ['Subscript', '⌘ ,'], ['Superscript', '⌘ .'],
    ['Inline code', '⌘ E'], ['Clear formatting', '⌘ \\'],
  ];
  return (
    <div className="rte-modal-overlay" onMouseDown={onClose}>
      <div className="rte-modal" style={{ maxWidth: 360, width: '96%' }} onMouseDown={e => e.stopPropagation()}>
        <div className="rte-modal-header">
          <span className="rte-modal-title">Keyboard shortcuts</span>
          <button className="rte-modal-close" onClick={onClose} type="button">✕</button>
        </div>
        <div className="rte-modal-body" style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {shortcuts.map(([label, kbd]) => (
            <div key={label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 13 }}>
              <span style={{ color: 'var(--rte-ink)' }}>{label}</span>
              <kbd style={{ background: 'var(--rte-pill)', border: '1px solid var(--rte-border)', borderRadius: 5, padding: '2px 8px', fontSize: 12, fontFamily: 'monospace', color: 'var(--rte-muted)' }}>{kbd}</kbd>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function HtmlEditorModal({ editor, onClose }) {
  const [html, setHtml] = useState(() => {
    const raw = editor?.getHTML() || '';
    // Basic pretty-print: add newlines after closing block tags
    return raw
      .replace(/></g, '>\n<')
      .replace(/^\n/, '');
  });
  const textareaRef = useRef(null);

  useEffect(() => { textareaRef.current?.focus(); }, []);

  const handleApply = () => {
    if (editor) editor.commands.setContent(html, false);
    onClose();
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      const el = e.target;
      const start = el.selectionStart;
      const end = el.selectionEnd;
      const next = html.substring(0, start) + '  ' + html.substring(end);
      setHtml(next);
      requestAnimationFrame(() => { el.selectionStart = el.selectionEnd = start + 2; });
    }
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault();
      handleApply();
    }
  };

  return (
    <div className="rte-modal-overlay" onMouseDown={onClose}>
      <div
        className="rte-modal"
        style={{ maxWidth: 860, width: '96%', display: 'flex', flexDirection: 'column', maxHeight: '90vh' }}
        onMouseDown={e => e.stopPropagation()}
      >
        <div className="rte-modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/>
            </svg>
            <span className="rte-modal-title">HTML Editor</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 11, color: 'var(--rte-muted)' }}>⌘↵ to apply</span>
            <button className="rte-modal-close" onClick={onClose} type="button">✕</button>
          </div>
        </div>

        <div className="rte-modal-body" style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column', gap: 8 }}>
          <div style={{ fontSize: 11, color: 'var(--rte-muted)' }}>
            Edit the raw HTML source. Click <strong>Apply</strong> to update the editor.
          </div>
          <textarea
            ref={textareaRef}
            value={html}
            onChange={e => setHtml(e.target.value)}
            onKeyDown={handleKeyDown}
            className="rte-input"
            style={{
              fontFamily: "'Roboto Mono', 'Courier New', monospace",
              fontSize: 12.5,
              lineHeight: 1.65,
              flex: 1,
              minHeight: 420,
              resize: 'none',
              whiteSpace: 'pre',
              overflowX: 'auto',
              overflowY: 'auto',
              tabSize: 2,
              background: 'var(--rte-page)',
            }}
            spellCheck={false}
            autoCorrect="off"
            autoCapitalize="off"
          />
        </div>

        <div className="rte-modal-footer">
          <div style={{ marginRight: 'auto', fontSize: 11, color: 'var(--rte-muted)' }}>
            {html.length} chars · Tab inserts 2 spaces
          </div>
          <button type="button" className="rte-btn-secondary" onClick={onClose}>Cancel</button>
          <button type="button" className="rte-btn-primary" onClick={handleApply}>Apply</button>
        </div>
      </div>
    </div>
  );
}

// ─── Media Format Bar (shown when image/video is selected) ────────────────────

const IMG_SHAPES = [
  { id: 'rect',      label: 'Original' },
  { id: 'rounded',   label: 'Rounded' },
  { id: 'pill',      label: 'Pill' },
  { id: 'circle',    label: 'Circle' },
  { id: 'square',    label: 'Square' },
  { id: 'landscape', label: 'Landscape' },
  { id: 'portrait',  label: 'Portrait' },
];
const VID_SHAPES = [
  { id: 'rect',      label: 'Original' },
  { id: 'rounded',   label: 'Rounded' },
  { id: 'pill',      label: 'Pill' },
  { id: 'circle',    label: 'Circle' },
  { id: 'landscape', label: 'Landscape' },
];

function ShapeIcon({ id, active }) {
  const c = active ? 'var(--rte-accent)' : 'var(--rte-muted)';
  const s = { fill: 'none', stroke: c, strokeWidth: 1.5 };
  const icons = {
    rect:      <svg width="32" height="22" viewBox="0 0 32 22"><rect x="1" y="1" width="30" height="20" rx="1.5" {...s}/></svg>,
    rounded:   <svg width="32" height="22" viewBox="0 0 32 22"><rect x="1" y="1" width="30" height="20" rx="7" {...s}/></svg>,
    pill:      <svg width="32" height="22" viewBox="0 0 32 22"><rect x="1" y="1" width="30" height="20" rx="10" {...s}/></svg>,
    circle:    <svg width="22" height="22" viewBox="0 0 22 22"><circle cx="11" cy="11" r="10" {...s}/></svg>,
    square:    <svg width="22" height="22" viewBox="0 0 22 22"><rect x="1" y="1" width="20" height="20" rx="1.5" {...s}/></svg>,
    landscape: <svg width="32" height="20" viewBox="0 0 32 20"><rect x="1" y="1" width="30" height="18" rx="1.5" {...s}/></svg>,
    portrait:  <svg width="18" height="26" viewBox="0 0 18 26"><rect x="1" y="1" width="16" height="24" rx="1.5" {...s}/></svg>,
  };
  return icons[id] || icons.rect;
}
const MEDIA_FRAMES = [
  { id: 'none',    label: 'None' },
  { id: 'shadow',  label: 'Shadow' },
  { id: 'border',  label: 'Border' },
  { id: 'thick',   label: 'Thick' },
  { id: 'glow',    label: 'Glow' },
  { id: 'vintage', label: 'Vintage' },
  { id: 'dark',    label: 'Dark' },
];
const MEDIA_FILTERS = [
  { id: 'invert',    label: 'Invert' },
  { id: 'grayscale', label: 'Grayscale' },
  { id: 'sepia',     label: 'Sepia' },
  { id: 'blur',      label: 'Blur' },
  { id: 'bright',    label: 'Brighten' },
  { id: 'contrast',  label: 'Contrast' },
];

function MediaFormatBar({ editor, mediaType, open, onToggle, onClose, onHtmlEditor }) {
  const attrs = editor?.getAttributes(mediaType) || {};
  const filtersArr = attrs.filters ? attrs.filters.split(',').filter(Boolean) : [];
  const align = attrs.align || 'left';
  const frame = attrs.frame || 'none';
  const shape = attrs.shape || 'rect';

  const update = (patch) => editor.chain().focus().updateAttributes(mediaType, patch).run();
  const toggleFilter = (f) => {
    const next = filtersArr.includes(f) ? filtersArr.filter(x => x !== f) : [...filtersArr, f];
    update({ filters: next.join(',') });
  };

  const shapes = mediaType === 'image' ? IMG_SHAPES : VID_SHAPES;
  const shapeLabel = shapes.find(s => s.id === shape)?.label || 'Free';
  const frameLabel = MEDIA_FRAMES.find(f => f.id === frame)?.label || 'None';
  const filtersLabel = filtersArr.length === 0 ? 'Filters' : `Filters (${filtersArr.length})`;

  return (
    <div style={{
      display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 2,
      padding: '5px 10px', borderBottom: '1px solid var(--rte-border)',
      background: 'var(--rte-pill)', position: 'relative', zIndex: 50,
    }}>

      {/* Media badge */}
      <span style={{
        fontSize: 11, fontWeight: 600, color: 'var(--rte-accent)',
        background: 'var(--rte-accent-soft)', borderRadius: 6,
        padding: '2px 8px', marginRight: 4, userSelect: 'none',
      }}>
        {mediaType === 'image' ? '🖼 Image' : '🎬 Video'}
      </span>

      <Sep />

      {/* Layout */}
      <span style={{ fontSize: 11, color: 'var(--rte-muted)', marginRight: 2 }}>Layout</span>
      <button className={`rte-btn${align === 'left'   ? ' is-active' : ''}`} title="Align left"
        onMouseDown={e => { e.preventDefault(); update({ align: 'left' }); }}
      ><AlignLeftIcon size={17} /></button>
      <button className={`rte-btn${align === 'center' ? ' is-active' : ''}`} title="Align center"
        onMouseDown={e => { e.preventDefault(); update({ align: 'center' }); }}
      ><AlignCenterIcon size={17} /></button>
      <button className={`rte-btn${align === 'right'  ? ' is-active' : ''}`} title="Align right"
        onMouseDown={e => { e.preventDefault(); update({ align: 'right' }); }}
      ><AlignRightIcon size={17} /></button>

      <Sep />

      {/* Shape — dropdown */}
      <div style={{ position: 'relative' }}>
        <button
          className={`rte-menu-btn${open === 'media-shape' ? ' open' : ''}`}
          style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 12.5 }}
          onMouseDown={e => { e.preventDefault(); onToggle('media-shape'); }}
        >
          Shape: <strong>{shapeLabel}</strong>
          <ChevronDownIcon size={11} />
        </button>
        {open === 'media-shape' && (
          <div className="rte-drop-panel" style={{
            display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)',
            gap: 4, padding: 8, minWidth: 200,
          }}>
            {shapes.map(s => (
              <button
                key={s.id}
                onMouseDown={e => { e.preventDefault(); update({ shape: s.id }); onClose(); }}
                style={{
                  display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                  gap: 5, padding: '8px 4px', border: 'none', borderRadius: 8, cursor: 'pointer',
                  background: shape === s.id ? 'var(--rte-accent-soft)' : 'transparent',
                  outline: shape === s.id ? '1.5px solid var(--rte-accent)' : '1.5px solid transparent',
                  transition: 'background .1s',
                }}
                onMouseEnter={e => { if (shape !== s.id) e.currentTarget.style.background = 'var(--rte-hover)'; }}
                onMouseLeave={e => { if (shape !== s.id) e.currentTarget.style.background = 'transparent'; }}
              >
                <ShapeIcon id={s.id} active={shape === s.id} />
                <span style={{
                  fontSize: 10.5, fontWeight: shape === s.id ? 600 : 400,
                  color: shape === s.id ? 'var(--rte-accent)' : 'var(--rte-ink)',
                  whiteSpace: 'nowrap',
                }}>{s.label}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      <Sep />

      {/* Frame — dropdown */}
      <div style={{ position: 'relative' }}>
        <button
          className={`rte-menu-btn${open === 'media-frame' ? ' open' : ''}`}
          style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 12.5 }}
          onMouseDown={e => { e.preventDefault(); onToggle('media-frame'); }}
        >
          Frame: <strong>{frameLabel}</strong>
          <ChevronDownIcon size={11} />
        </button>
        {open === 'media-frame' && (
          <div className="rte-drop-panel" style={{ minWidth: 130 }}>
            {MEDIA_FRAMES.map(fr => (
              <DropItem
                key={fr.id}
                onAction={() => { update({ frame: fr.id }); onClose(); }}
                style={{ fontWeight: frame === fr.id ? 700 : 400, color: frame === fr.id ? 'var(--rte-accent)' : undefined }}
              >{fr.label}</DropItem>
            ))}
          </div>
        )}
      </div>

      <Sep />

      {/* Filters — multi-select dropdown */}
      <div style={{ position: 'relative' }}>
        <button
          className={`rte-menu-btn${open === 'media-filters' ? ' open' : ''}`}
          style={{
            display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 12.5,
            color: filtersArr.length > 0 ? 'var(--rte-accent)' : undefined,
          }}
          onMouseDown={e => { e.preventDefault(); onToggle('media-filters'); }}
        >
          <strong>{filtersLabel}</strong>
          <ChevronDownIcon size={11} />
        </button>
        {open === 'media-filters' && (
          <div className="rte-drop-panel" style={{ minWidth: 150 }}>
            {MEDIA_FILTERS.map(f => (
              <button
                key={f.id}
                className="rte-drop-item"
                style={{
                  fontWeight: filtersArr.includes(f.id) ? 700 : 400,
                  color: filtersArr.includes(f.id) ? 'var(--rte-accent)' : undefined,
                }}
                onMouseDown={e => { e.preventDefault(); toggleFilter(f.id); }}
              >
                <span style={{
                  display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                  width: 16, height: 16, borderRadius: 4,
                  border: `1.5px solid ${filtersArr.includes(f.id) ? 'var(--rte-accent)' : 'var(--rte-border)'}`,
                  background: filtersArr.includes(f.id) ? 'var(--rte-accent)' : 'transparent',
                  marginRight: 2, flexShrink: 0,
                }}>
                  {filtersArr.includes(f.id) && (
                    <svg width="10" height="10" viewBox="0 0 12 12" fill="white"><path d="M2 6l3 3 5-5" stroke="white" strokeWidth="1.8" fill="none" strokeLinecap="round"/></svg>
                  )}
                </span>
                {f.label}
              </button>
            ))}
            {filtersArr.length > 0 && (
              <>
                <div className="rte-drop-sep" />
                <DropItem
                  onAction={() => { update({ filters: '' }); onClose(); }}
                  style={{ color: '#d93025' }}
                >✕ Reset all</DropItem>
              </>
            )}
          </div>
        )}
      </div>

      <Sep />

      {/* HTML Editor */}
      <button className="rte-btn" title="HTML Editor"
        onMouseDown={e => { e.preventDefault(); onHtmlEditor && onHtmlEditor(); }}>
        <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/>
        </svg>
      </button>
    </div>
  );
}

// ─── Main Export ───────────────────────────────────────────────────────────────

export default function Toolbar({ editor, onUpload, onToggleTheme, theme, isFullscreen, onToggleFullscreen }) {
  const [open, setOpen] = useState(null);
  const [activeModal, setActiveModal] = useState(null);
  const [fontSize, setFontSize] = useState(11);
  const [textColor, setTextColor] = useState('#202124');
  const toolbarRef = useRef(null);
  const imageInputRef = useRef(null);
  const videoInputRef = useRef(null);
  const audioInputRef = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (toolbarRef.current && !toolbarRef.current.contains(e.target)) {
        setOpen(null);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // Force re-render on every transaction so isActive checks stay in sync
  const [, setSelectionTime] = useState(0);

  useEffect(() => {
    if (!editor) return;
    const handler = () => {
      setSelectionTime(Date.now());

      const currentFontSizeAttr = editor.getAttributes('textStyle').fontSize;
      if (currentFontSizeAttr) {
        const sizePx = parseInt(currentFontSizeAttr, 10);
        if (!isNaN(sizePx)) {
          setFontSize(Math.round(sizePx / 1.333));
        }
      } else {
        setFontSize(11);
      }

      const currentTextColorAttr = editor.getAttributes('textStyle').color;
      if (currentTextColorAttr) {
        setTextColor(currentTextColorAttr);
      } else {
        setTextColor('#202124');
      }
    };
    editor.on('transaction', handler);
    return () => {
      editor.off('transaction', handler);
    };
  }, [editor]);

  const toggle = (name) => setOpen(prev => prev === name ? null : name);
  const close = () => setOpen(null);

  const handleUpload = (type) => async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (onUpload) {
      try {
        const result = await onUpload(file);
        if (result?.src) {
          if (type === 'image') editor?.chain().focus().setImage({ src: result.src }).run();
          else if (type === 'video') editor?.commands.setVideo({ src: result.src });
          else if (type === 'audio') editor?.commands.setAudio({ src: result.src });
        }
      } catch (err) {
        console.error('Upload failed:', err);
      }
    } else if (type === 'image') {
      const reader = new FileReader();
      reader.onload = (readerEvent) => {
        const src = readerEvent.target.result;
        editor?.chain().focus().setImage({ src }).run();
      };
      reader.readAsDataURL(file);
    } else {
      console.warn(`[Inkora] Missing 'onUpload' prop — cannot upload ${type} files.`);
    }
    e.target.value = '';
  };

  return (
    <div ref={toolbarRef} className="rte-toolbar" style={{ background: 'var(--rte-bar)', borderTopLeftRadius: 13, borderTopRightRadius: 13, position: 'sticky', top: -32, zIndex: 100 }}>
      <style>{TOOLBAR_CSS}</style>

      <MenuBar
        editor={editor}
        open={open}
        onToggle={toggle}
        onClose={close}
        onToggleTheme={onToggleTheme}
        theme={theme}
        imageRef={imageInputRef}
        videoRef={videoInputRef}
        audioRef={audioInputRef}
        onSelectModal={setActiveModal}
        isFullscreen={isFullscreen}
        onToggleFullscreen={onToggleFullscreen}
      />

      {(() => {
        const mediaType = editor?.isActive('image') ? 'image' : editor?.isActive('video') ? 'video' : null;
        return mediaType ? (
          <MediaFormatBar
            editor={editor}
            mediaType={mediaType}
            open={open}
            onToggle={toggle}
            onClose={close}
            onHtmlEditor={() => setActiveModal('html_editor')}
          />
        ) : (
          <FormatBar
            editor={editor}
            open={open}
            onToggle={toggle}
            onClose={close}
            fontSize={fontSize}
            onFontSizeChange={setFontSize}
            textColor={textColor}
            onTextColorChange={setTextColor}
            onHtmlEditor={() => setActiveModal('html_editor')}
            onSelectModal={setActiveModal}
          />
        );
      })()}

      <input ref={imageInputRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleUpload('image')} />
      <input ref={videoInputRef} type="file" accept="video/*" style={{ display: 'none' }} onChange={handleUpload('video')} />
      <input ref={audioInputRef} type="file" accept="audio/*" style={{ display: 'none' }} onChange={handleUpload('audio')} />

      {activeModal === 'link' && <LinkModal editor={editor} onClose={() => setActiveModal(null)} />}
      {activeModal === 'confirm_clear' && <ConfirmModal message="Clear all content? This cannot be undone." onConfirm={() => editor?.commands.clearContent(true)} onClose={() => setActiveModal(null)} />}
      {activeModal === 'word_count' && <WordCountModal editor={editor} onClose={() => setActiveModal(null)} />}
      {activeModal === 'shortcuts' && <ShortcutsModal onClose={() => setActiveModal(null)} />}
      {activeModal === 'html_editor' && <HtmlEditorModal editor={editor} onClose={() => setActiveModal(null)} />}
      {activeModal && !['link','confirm_clear','word_count','shortcuts','html_editor'].includes(activeModal) && (
        <ToolbarModal type={activeModal} editor={editor} onClose={() => setActiveModal(null)} theme={theme} />
      )}
    </div>
  );
}
