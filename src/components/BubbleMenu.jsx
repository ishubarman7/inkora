'use client';
import React, { useState, useEffect } from 'react';
import { BubbleMenu as TiptapBubbleMenu } from '@tiptap/react/menus';
import { LinkIcon } from './Icons.jsx';

const BUBBLE_CSS = `
.rte-bubble {
  display: flex; align-items: center; gap: 1px;
  background: var(--rte-bar, #fff);
  border: 1px solid var(--rte-border, #e4e7eb);
  border-radius: 10px;
  box-shadow: var(--rte-shadow, 0 8px 26px rgba(0,0,0,.22));
  padding: 4px;
  z-index: 300;
  font-family: 'Outfit', 'Inter', Arial, sans-serif;
}
.rte-bubble .bb {
  display: inline-flex; align-items: center; justify-content: center;
  height: 32px; min-width: 30px; padding: 0 4px;
  border: none; background: transparent;
  color: var(--rte-ink, #202124);
  border-radius: 6px; cursor: pointer; transition: background 0.15s, transform 0.1s;
}
.rte-bubble .bb:hover { background: var(--rte-hover, rgba(60,64,67,.09)); }
.rte-bubble .bb.active {
  background: var(--rte-accent-soft, #d3e3fd);
  color: var(--rte-accent, #0b57d0);
}
.rte-bubble .bb-sep {
  width: 1px; height: 20px;
  background: var(--rte-border, #e4e7eb);
  margin: 0 4px; flex-shrink: 0;
}
/* Color Picker Styles */
.rte-bubble-panel {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 2px 6px;
}
.rte-swatch-list {
  display: flex;
  align-items: center;
  gap: 5px;
}
.rte-swatch {
  width: 18px;
  height: 18px;
  border-radius: 50%;
  cursor: pointer;
  border: 1.5px solid var(--rte-border, #e4e7eb);
  transition: transform 0.15s ease, border-color 0.15s ease;
  position: relative;
}
.rte-swatch:hover {
  transform: scale(1.2);
  border-color: var(--rte-accent, #0b57d0);
}
.rte-swatch.active-swatch {
  border-color: var(--rte-accent, #0b57d0);
  box-shadow: 0 0 0 1px var(--rte-accent, #0b57d0);
}
.rte-swatch.swatch-clear {
  background: var(--bg-tertiary, #f3f4f6);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #ef4444;
  font-size: 10px;
  font-weight: 700;
}
.rte-swatch.swatch-clear::after {
  content: "";
  position: absolute;
  width: 14px;
  height: 1.5px;
  background: #ef4444;
  transform: rotate(45deg);
}
`;

const HIGHLIGHT_COLORS = [
  { name: 'Yellow', value: '#ffe066' },
  { name: 'Green', value: '#a9e08f' },
  { name: 'Blue', value: '#96f2d7' },
  { name: 'Sky', value: '#a5d8ff' },
  { name: 'Pink', value: '#ffc9c9' },
  { name: 'Purple', value: '#eebefa' },
];

const TEXT_COLORS = [
  { name: 'Ink', value: '#202124' },
  { name: 'Blue', value: '#0b57d0' },
  { name: 'Red', value: '#dc2626' },
  { name: 'Green', value: '#16a34a' },
  { name: 'Purple', value: '#7c3aed' },
  { name: 'Orange', value: '#ea580c' },
];

export default function BubbleMenu({ editor }) {
  const [activePanel, setActivePanel] = useState(null); // null, 'highlight', 'color'

  // Return the editor wrapper lazily. Tippy calls appendTo() when it first shows
  // the bubble (not on mount), so the element is guaranteed to be in the DOM.
  // Appending inside the editor wrapper avoids CSS transform clipping that
  // affects position:fixed elements when an ancestor has a transform (e.g. animated sidebars).
  const getEditorEl = () =>
    editor?.options?.element?.closest?.('.inkora-editor') ?? document.body;

  const getScrollEl = () =>
    editor?.options?.element?.closest?.('.rte-scroll-container') ?? document.body;

  useEffect(() => {
    if (!editor) return;
    // Reset panel when selection changes
    const handleSelection = () => {
      setActivePanel(null);
    };
    editor.on('selectionUpdate', handleSelection);
    return () => {
      editor.off('selectionUpdate', handleSelection);
    };
  }, [editor]);

  const [showLinkModal, setShowLinkModal] = useState(false);

  if (!editor) return null;

  const insertLink = (e) => { e.preventDefault(); setShowLinkModal(true); };

  const handleSelectHighlight = (color) => {
    if (color) {
      editor.chain().focus().setHighlight({ color }).run();
    } else {
      editor.chain().focus().unsetHighlight().run();
    }
    setActivePanel(null);
  };

  const handleSelectColor = (color) => {
    if (color) {
      editor.chain().focus().setColor(color).run();
    } else {
      editor.chain().focus().unsetColor().run();
    }
    setActivePanel(null);
  };

  const currentHighlightColor = editor.getAttributes('highlight').color;
  const currentTextColor = editor.getAttributes('textStyle').color;

  return (
    <>
      <style>{BUBBLE_CSS}</style>
      <TiptapBubbleMenu
        editor={editor}
        tippyOptions={{
          duration: 120,
          placement: 'bottom',
          interactive: true,
          // Append inside the editor wrapper so the bubble is not affected by
          // CSS transforms on ancestor elements (which break position:fixed).
          appendTo: getScrollEl,
          popperOptions: {
            // absolute strategy positions relative to the nearest positioned
            // ancestor (the editor wrapper with position:relative), so it's
            // immune to ancestor transform/filter contexts.
            strategy: 'absolute',
            modifiers: [
              {
                name: 'preventOverflow',
                options: {
                  boundary: 'clippingParents',
                  padding: 8,
                  altAxis: false,
                },
              },
              {
                name: 'flip',
                options: {
                  boundary: 'clippingParents',
                  padding: 8,
                },
              },
            ],
          },
        }}
        shouldShow={({ editor, from, to }) =>
          from !== to &&
          !editor.isActive('codeBlock') &&
          !editor.isActive('image') &&
          !editor.isActive('video')
        }
      >
        <div className="rte-bubble">
          {/* Main Formatting Panel */}
          {activePanel === null && (
            <>
              <button
                className={`bb${editor.isActive('bold') ? ' active' : ''}`}
                title="Bold ⌘B"
                onMouseDown={e => { e.preventDefault(); editor.chain().focus().toggleBold().run(); }}
                style={{ fontSize: 15, fontWeight: 700 }}
              >B</button>

              <button
                className={`bb${editor.isActive('italic') ? ' active' : ''}`}
                title="Italic ⌘I"
                onMouseDown={e => { e.preventDefault(); editor.chain().focus().toggleItalic().run(); }}
                style={{ fontSize: 15, fontStyle: 'italic', fontFamily: 'Georgia, serif' }}
              >I</button>

              <button
                className={`bb${editor.isActive('underline') ? ' active' : ''}`}
                title="Underline ⌘U"
                onMouseDown={e => { e.preventDefault(); editor.chain().focus().toggleUnderline().run(); }}
                style={{ fontSize: 15, textDecoration: 'underline' }}
              >U</button>

              <div className="bb-sep" />

              {/* Highlight Trigger */}
              <button
                className={`bb${editor.isActive('highlight') ? ' active' : ''}`}
                title="Highlight Options"
                onMouseDown={e => { e.preventDefault(); setActivePanel('highlight'); }}
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 15l-4 4-3-3 4-4"/><path d="M14.5 4.5l5 5L11 18l-5-5 8.5-8.5Z"/><path d="M4 21h7"/>
                </svg>
              </button>

              {/* Color Trigger */}
              <button
                className={`bb${editor.isActive('textStyle', { color: currentTextColor }) ? ' active' : ''}`}
                title="Text Color Options"
                onMouseDown={e => { e.preventDefault(); setActivePanel('color'); }}
                style={{ flexDirection: 'column', gap: 1 }}
              >
                <span style={{ fontSize: 12, fontWeight: 700, lineHeight: 1 }}>A</span>
                <span style={{ width: 14, height: 3, borderRadius: 2, background: currentTextColor || 'var(--rte-ink, #202124)' }} />
              </button>

              <div className="bb-sep" />

              <button
                className={`bb${editor.isActive('link') ? ' active' : ''}`}
                title="Link ⌘K"
                onMouseDown={insertLink}
              >
                <LinkIcon size={16} />
              </button>

              <button
                className={`bb${editor.isActive('strike') ? ' active' : ''}`}
                title="Strikethrough"
                onMouseDown={e => { e.preventDefault(); editor.chain().focus().toggleStrike().run(); }}
                style={{ fontSize: 14, textDecoration: 'line-through' }}
              >S</button>

              <button
                className={`bb${editor.isActive('code') ? ' active' : ''}`}
                title="Inline code"
                onMouseDown={e => { e.preventDefault(); editor.chain().focus().toggleCode().run(); }}
                style={{ fontFamily: 'monospace', fontSize: 13 }}
              >{'<>'}</button>
            </>
          )}

          {/* Highlight Color Picker Panel */}
          {activePanel === 'highlight' && (
            <div className="rte-bubble-panel">
              <button 
                className="bb" 
                title="Back"
                onMouseDown={e => { e.preventDefault(); setActivePanel(null); }}
                style={{ minWidth: 26, padding: 0 }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <polyline points="15 18 9 12 15 6"/>
                </svg>
              </button>
              
              <div className="rte-swatch-list">
                {/* Clear Swatch */}
                <div 
                  className={`rte-swatch swatch-clear`}
                  title="No Highlight"
                  onMouseDown={e => { e.preventDefault(); handleSelectHighlight(null); }}
                />
                
                {HIGHLIGHT_COLORS.map(c => (
                  <div 
                    key={c.value}
                    className={`rte-swatch${currentHighlightColor === c.value ? ' active-swatch' : ''}`}
                    style={{ backgroundColor: c.value }}
                    title={c.name}
                    onMouseDown={e => { e.preventDefault(); handleSelectHighlight(c.value); }}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Text Color Picker Panel */}
          {activePanel === 'color' && (
            <div className="rte-bubble-panel">
              <button 
                className="bb" 
                title="Back"
                onMouseDown={e => { e.preventDefault(); setActivePanel(null); }}
                style={{ minWidth: 26, padding: 0 }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <polyline points="15 18 9 12 15 6"/>
                </svg>
              </button>

              <div className="rte-swatch-list">
                {/* Clear Swatch */}
                <div 
                  className={`rte-swatch swatch-clear`}
                  title="Default Color"
                  onMouseDown={e => { e.preventDefault(); handleSelectColor(null); }}
                />

                {TEXT_COLORS.map(c => (
                  <div 
                    key={c.value}
                    className={`rte-swatch${currentTextColor === c.value ? ' active-swatch' : ''}`}
                    style={{ backgroundColor: c.value }}
                    title={c.name}
                    onMouseDown={e => { e.preventDefault(); handleSelectColor(c.value); }}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </TiptapBubbleMenu>
      {showLinkModal && <BubbleLinkModal editor={editor} onClose={() => setShowLinkModal(false)} />}
    </>
  );
}

function BubbleLinkModal({ editor, onClose }) {
  const [url, setUrl] = React.useState(() => editor?.getAttributes('link').href || '');
  const inputRef = React.useRef(null);
  React.useEffect(() => { inputRef.current?.focus(); inputRef.current?.select(); }, []);
  const apply = () => {
    if (!url.trim()) { editor.chain().focus().unsetLink().run(); }
    else { editor.chain().focus().setLink({ href: url.trim() }).run(); }
    onClose();
  };
  return (
    <div
      style={{ position: 'fixed', inset: 0, zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,.3)' }}
      onMouseDown={onClose}
    >
      <div
        style={{ background: 'var(--rte-bar, #fff)', border: '1px solid var(--rte-border, #e4e7eb)', borderRadius: 10, padding: '18px 20px', width: 340, display: 'flex', flexDirection: 'column', gap: 12, boxShadow: '0 8px 32px rgba(0,0,0,.18)' }}
        onMouseDown={e => e.stopPropagation()}
      >
        <div style={{ fontWeight: 600, fontSize: 14, color: 'var(--rte-ink, #202124)' }}>Insert link</div>
        <input
          ref={inputRef}
          type="url"
          placeholder="https://example.com"
          value={url}
          onChange={e => setUrl(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); apply(); } if (e.key === 'Escape') onClose(); }}
          style={{ width: '100%', padding: '8px 12px', fontSize: 14, borderRadius: 7, border: '1.5px solid var(--rte-border, #e4e7eb)', background: 'var(--rte-page, #fff)', color: 'var(--rte-ink, #202124)', outline: 'none', boxSizing: 'border-box' }}
        />
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
          {editor?.isActive('link') && (
            <button onClick={() => { editor.chain().focus().unsetLink().run(); onClose(); }} style={{ padding: '6px 12px', fontSize: 13, border: 'none', borderRadius: 6, cursor: 'pointer', background: 'transparent', color: 'var(--rte-muted, #5f6368)' }}>Remove</button>
          )}
          <button onClick={onClose} style={{ padding: '6px 12px', fontSize: 13, border: 'none', borderRadius: 6, cursor: 'pointer', background: 'transparent', color: 'var(--rte-muted, #5f6368)' }}>Cancel</button>
          <button onClick={apply} style={{ padding: '6px 14px', fontSize: 13, border: 'none', borderRadius: 6, cursor: 'pointer', background: 'var(--rte-accent, #0b57d0)', color: '#fff', fontWeight: 600 }}>Apply</button>
        </div>
      </div>
    </div>
  );
}
