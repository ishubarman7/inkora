'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import { createEditorExtensions } from './extensions/index.js';
import { editorStyles } from './styles.js';

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

export function InkoraViewer({ content, theme = 'light' }) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => { setIsMounted(true); }, []);

  const extensions = useMemo(() => createEditorExtensions({ isEditable: false }), []);

  const editor = useEditor({
    extensions,
    content,
    editable: false,
    immediatelyRender: false,
    editorProps: {
      attributes: { class: 'rte-content' },
    },
  });

  useEffect(() => {
    if (editor && content && !editor.isDestroyed) {
      editor.commands.setContent(content);
    }
  }, [content, editor]);

  const cssVars = theme === 'dark' ? DARK_VARS : LIGHT_VARS;

  if (!isMounted) {
    return (
      <div style={{ ...cssVars, background: 'var(--rte-page)', borderRadius: 8, padding: '16px 20px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {[['55%', 28], ['100%', 14], ['83%', 14], ['70%', 14]].map(([w, h], i) => (
            <div key={i} style={{
              width: w, height: h, borderRadius: 4,
              background: 'var(--rte-border)',
            }} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div
      className={`inkora-viewer ${theme}`}
      style={{
        ...cssVars,
        width: '100%',
        background: 'var(--rte-page)',
        color: 'var(--rte-ink)',
        borderRadius: 8,
      }}
    >
      <style dangerouslySetInnerHTML={{ __html: editorStyles }} />
      <div className="viewer-inner" style={{ padding: '16px 20px', width: '100%' }}>
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}
