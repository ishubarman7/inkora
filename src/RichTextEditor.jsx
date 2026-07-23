'use client';

import React, { useEffect, useState, useMemo, useCallback, useRef } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import { createEditorExtensions } from './extensions/index.js';
import { editorStyles } from './styles.js';
import Toolbar from './components/Toolbar.jsx';
import BubbleMenu from './components/BubbleMenu.jsx';
import TableResizeHandle from './components/TableResizeHandle.jsx';

const LIGHT_VARS = {
  '--rte-page': '#ffffff',
  '--rte-bar': '#ffffff',
  '--rte-pill': '#f6f8fc',
  '--rte-hover': 'rgba(60,64,67,.09)',
  '--rte-border': '#e4e7eb',
  '--rte-table-border': '#b6bac2',
  '--rte-ink': '#202124',
  '--rte-muted': '#5f6368',
  '--rte-accent': '#0b57d0',
  '--rte-accent-soft': '#d3e3fd',
  '--rte-shadow': '0 1px 2px rgba(0,0,0,.08),0 8px 28px rgba(0,0,0,.08)',
};

const DARK_VARS = {
  '--rte-page': '#1f2023',
  '--rte-bar': '#26272b',
  '--rte-pill': '#2b2c30',
  '--rte-hover': 'rgba(255,255,255,.09)',
  '--rte-border': '#3c4043',
  '--rte-table-border': '#5f6368',
  '--rte-ink': '#e8eaed',
  '--rte-muted': '#9aa0a6',
  '--rte-accent': '#8ab4f8',
  '--rte-accent-soft': '#1e3a5f',
  '--rte-shadow': '0 1px 2px rgba(0,0,0,.5),0 10px 30px rgba(0,0,0,.45)',
};

/**
 * InkoraEditor — full-featured plug-and-play rich text editor.
 *
 * Props:
 *   initialContent  {Object}   Initial content (TipTap JSON). Optional.
 *   onChange        {Function} Called with TipTap JSON on every keystroke.
 *   onSave          {Function} Called with TipTap JSON (debounced auto-save). Optional.
 *   onUpload        {Function} (file: File) => Promise<{ src: string }>  — media upload handler.
 *   resolveMediaUrl {Function} (src: string) => string  — maps stored refs to URLs.
 *   onToggleTheme   {Function} Called when the user clicks the dark-mode toggle.
 *   theme           {'light'|'dark'}  Default: 'light'
 *   placeholder     {string}   Placeholder text.
 *   width           {string|number}  CSS width. Default: '100%'
 *   height          {string|number}  Fixed height for the scroll container. Optional.
 *   minHeight       {number}         Min height (px) of the scroll container. Default: 420.
 *
 * Usage:
 *   import { InkoraEditor } from 'inkora';
 *   <InkoraEditor width="100%" minHeight={500} onChange={setContent} theme={theme} />
 */
export function InkoraEditor({
  initialContent,
  onSave,
  onChange,
  onUpload,
  resolveMediaUrl,
  onToggleTheme,
  theme = 'light',
  placeholder = 'Start writing…',
  width = '100%',
  height,
  minHeight = 420,
  syncInstantly = false,
}) {
  const [isMounted, setIsMounted] = useState(false);
  const [saveStatus, setSaveStatus] = useState('saved');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const editorRef = useRef(null);

  useEffect(() => { setIsMounted(true); }, []);

  // Sync fullscreen state with document events (handles Esc key exits)
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(document.fullscreenElement === editorRef.current);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  const toggleFullscreen = () => {
    if (!editorRef.current) return;
    if (!document.fullscreenElement) {
      editorRef.current.requestFullscreen?.().then(() => {
        setIsFullscreen(true);
      }).catch(err => {
        console.error('Error entering fullscreen:', err);
      });
    } else {
      document.exitFullscreen?.();
      setIsFullscreen(false);
    }
  };

  const cssVars = theme === 'dark' ? DARK_VARS : LIGHT_VARS;

  const extensions = useMemo(() => createEditorExtensions({
    placeholder,
    isEditable: true,
  }), [placeholder]);

  const handleSave = useCallback((json) => {
    if (onSave) {
      setSaveStatus('saving');
      onSave(json);
      setTimeout(() => setSaveStatus('saved'), 700);
    }
  }, [onSave]);

  const editor = useEditor({
    extensions,
    content: initialContent,
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      const json = editor.getJSON();
      if (onChange) onChange(json);
      setSaveStatus('unsaved');
    },
    editorProps: {
      attributes: {
        class: 'rte-content',
      },
      handleDrop: (view, event, slice, moved) => {
        if (!moved && event.dataTransfer?.files?.[0]) {
          const file = event.dataTransfer.files[0];
          const coords = view.posAtCoords({ left: event.clientX, top: event.clientY });
          if (!coords) return false;
          const kind = file.type.startsWith('image/') ? 'image'
            : file.type.startsWith('video/') ? 'video'
            : file.type.startsWith('audio/') ? 'audio'
            : null;
          if (!kind) return false;
          if (onUpload) {
            onUpload(file).then(result => {
              const node = view.state.schema.nodes[kind]?.create({ src: result.src });
              if (node) view.dispatch(view.state.tr.insert(coords.pos, node));
            });
          } else if (kind === 'image') {
            const reader = new FileReader();
            reader.onload = (readerEvent) => {
              const src = readerEvent.target.result;
              const node = view.state.schema.nodes.image?.create({ src });
              if (node) view.dispatch(view.state.tr.insert(coords.pos, node));
            };
            reader.readAsDataURL(file);
          } else {
            alert(`Missing 'onUpload' adapter prop to upload ${kind} files.`);
          }
          return true;
        }
        return false;
      },
      handlePaste: (view, event) => {
        const items = Array.from(event.clipboardData?.items || []);
        const imageItem = items.find(i => i.type.startsWith('image/'));
        if (imageItem) {
          const file = imageItem.getAsFile();
          if (onUpload) {
            onUpload(file).then(result => {
              const node = view.state.schema.nodes.image?.create({ src: result.src });
              if (node) view.dispatch(view.state.tr.replaceSelectionWith(node));
            });
          } else {
            const reader = new FileReader();
            reader.onload = (readerEvent) => {
              const src = readerEvent.target.result;
              const node = view.state.schema.nodes.image?.create({ src });
              if (node) view.dispatch(view.state.tr.replaceSelectionWith(node));
            };
            reader.readAsDataURL(file);
          }
          return true;
        }
        return false;
      },
    },
  });

  useEffect(() => {
    if (!editor || !onSave) return;
    const delay = syncInstantly ? 0 : 1000;
    const t = setTimeout(() => handleSave(editor.getJSON()), delay);
    return () => clearTimeout(t);
  }, [editor, onSave, editor?.state.doc, handleSave, syncInstantly]);

  const wordCount = editor?.storage.characterCount.words() ?? 0;
  const charCount = editor?.storage.characterCount.characters() ?? 0;

  if (!isMounted) {
    return (
      <div style={{ ...cssVars, borderRadius: 14, border: '1px solid var(--rte-border)', overflow: 'hidden', background: 'var(--rte-bar)', boxShadow: 'var(--rte-shadow)' }}>
        <div style={{ height: 44, background: 'var(--rte-bar)', borderBottom: '1px solid var(--rte-border)' }} />
        <div style={{ height: 48, background: 'var(--rte-pill)', borderBottom: '1px solid var(--rte-border)' }} />
        <div style={{ padding: '26px 34px', minHeight: 420, background: 'var(--rte-page)' }}>
          <div style={{ height: 28, borderRadius: 4, background: 'var(--rte-border)', width: '55%', marginBottom: 18 }} />
          <div style={{ height: 15, borderRadius: 4, background: 'var(--rte-border)', width: '100%', marginBottom: 10 }} />
          <div style={{ height: 15, borderRadius: 4, background: 'var(--rte-border)', width: '85%', marginBottom: 10 }} />
          <div style={{ height: 15, borderRadius: 4, background: 'var(--rte-border)', width: '70%' }} />
        </div>
      </div>
    );
  }

  return (
    <div
      ref={editorRef}
      className={`inkora-editor ${theme}${isFullscreen ? ' is-fullscreen' : ''}`}
      style={{
        ...cssVars,
        fontFamily: "'Roboto', Arial, sans-serif",
        width: isFullscreen ? '100%' : (typeof width === 'number' ? `${width}px` : width),
        borderRadius: isFullscreen ? 0 : 14,
        border: isFullscreen ? 'none' : '1px solid var(--rte-border)',
        overflow: 'visible',
        background: 'var(--rte-bar)',
        boxShadow: isFullscreen ? 'none' : 'var(--rte-shadow)',
        position: 'relative',
        height: isFullscreen ? '100vh' : 'auto',
        display: isFullscreen ? 'flex' : 'block',
        flexDirection: isFullscreen ? 'column' : 'unset',
      }}
    >
      <style dangerouslySetInnerHTML={{ __html: editorStyles }} />

      <Toolbar
        editor={editor}
        onUpload={onUpload}
        onToggleTheme={onToggleTheme}
        theme={theme}
        isFullscreen={isFullscreen}
        onToggleFullscreen={toggleFullscreen}
      />

      {/* Editing surface */}
      <div className="rte-scroll-container" style={{ background: 'var(--rte-page)', overflowY: 'auto', ...(isFullscreen ? { flex: 1 } : height ? { height: typeof height === 'number' ? `${height}px` : height } : { minHeight }) }}>
        <BubbleMenu editor={editor} />
        <TableResizeHandle editor={editor} />
        <div style={{ padding: '26px 34px', width: '100%' }}>
          <EditorContent editor={editor} />
        </div>
      </div>

      {/* Footer */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 16,
        padding: '8px 16px', borderTop: '1px solid var(--rte-border)',
        background: 'var(--rte-bar)', fontSize: 12, color: 'var(--rte-muted)',
        borderBottomLeftRadius: 13, borderBottomRightRadius: 13,
      }}>
        <span>{wordCount} {wordCount === 1 ? 'word' : 'words'}</span>
        <span>{charCount} {charCount === 1 ? 'character' : 'characters'}</span>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <path d="M8 9l-5 3 5 3M16 9l5 3-5 3M14 5l-4 14" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Type{' '}
          <span style={{ fontFamily: 'monospace', background: 'var(--rte-hover)', padding: '1px 6px', borderRadius: 4, margin: '0 2px' }}>/</span>
          {' '}for commands
        </span>
        <span style={{ marginLeft: 'auto', display: 'inline-flex', alignItems: 'center', gap: 6 }}>
          {saveStatus === 'saving' && (
            <>
              <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#f9ab00' }} />
              Saving…
            </>
          )}
          {saveStatus !== 'saving' && onSave && (
            <>
              <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#1e8e3e' }} />
              Saved
            </>
          )}
        </span>
      </div>
    </div>
  );
}
