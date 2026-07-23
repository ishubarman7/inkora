'use client';
import React, { useState, useRef, useLayoutEffect } from 'react';
import { NodeViewWrapper, NodeViewContent } from '@tiptap/react';

// ── Themes ────────────────────────────────────────────────────────────────────
const THEMES = {
  'vscode-dark': {
    name: 'VS Code Dark',
    bg: '#1e1e1e', headerBg: '#252526', border: '#303030',
    lineNumColor: '#4a4a4a', textColor: '#d4d4d4',
    syntax: {
      comment: '#6a9955', keyword: '#569cd6', string: '#ce9178',
      number: '#b5cea8', func: '#dcdcaa', variable: '#9cdcfe',
      type: '#4ec9b0', operator: '#d4d4d4', attr: '#9cdcfe',
    },
  },
  'vscode-light': {
    name: 'VS Code Light',
    bg: '#ffffff', headerBg: '#f3f3f3', border: '#e0e0e0',
    lineNumColor: '#a0a0a0', textColor: '#000000',
    syntax: {
      comment: '#008000', keyword: '#0000ff', string: '#a31515',
      number: '#098658', func: '#795e26', variable: '#001080',
      type: '#267f99', operator: '#000000', attr: '#e50000',
    },
  },
  'github-dark': {
    name: 'GitHub Dark',
    bg: '#0d1117', headerBg: '#161b22', border: '#30363d',
    lineNumColor: '#484f58', textColor: '#c9d1d9',
    syntax: {
      comment: '#8b949e', keyword: '#ff7b72', string: '#a5d6ff',
      number: '#79c0ff', func: '#d2a8ff', variable: '#ffa657',
      type: '#79c0ff', operator: '#ff7b72', attr: '#79c0ff',
    },
  },
  'dracula': {
    name: 'Dracula',
    bg: '#282a36', headerBg: '#21222c', border: '#44475a',
    lineNumColor: '#6272a4', textColor: '#f8f8f2',
    syntax: {
      comment: '#6272a4', keyword: '#ff79c6', string: '#f1fa8c',
      number: '#bd93f9', func: '#50fa7b', variable: '#8be9fd',
      type: '#8be9fd', operator: '#ff79c6', attr: '#50fa7b',
    },
  },
  'monokai': {
    name: 'Monokai',
    bg: '#272822', headerBg: '#1e1f1c', border: '#3e3d32',
    lineNumColor: '#75715e', textColor: '#f8f8f2',
    syntax: {
      comment: '#75715e', keyword: '#f92672', string: '#e6db74',
      number: '#ae81ff', func: '#a6e22e', variable: '#66d9e8',
      type: '#66d9e8', operator: '#f92672', attr: '#a6e22e',
    },
  },
  'solarized-light': {
    name: 'Solarized Light',
    bg: '#fdf6e3', headerBg: '#eee8d5', border: '#d3cbb8',
    lineNumColor: '#93a1a1', textColor: '#657b83',
    syntax: {
      comment: '#93a1a1', keyword: '#859900', string: '#2aa198',
      number: '#d33682', func: '#268bd2', variable: '#268bd2',
      type: '#b58900', operator: '#859900', attr: '#268bd2',
    },
  },
  'night-owl': {
    name: 'Night Owl',
    bg: '#011627', headerBg: '#01111d', border: '#1d3b53',
    lineNumColor: '#4b6479', textColor: '#d6deeb',
    syntax: {
      comment: '#637777', keyword: '#c792ea', string: '#ecc48d',
      number: '#f78c6c', func: '#82aaff', variable: '#addb67',
      type: '#ffcb8b', operator: '#c792ea', attr: '#addb67',
    },
  },
};

// ── Scoped syntax CSS for one block ──────────────────────────────────────────
// Uses a data attribute selector so it works regardless of how TipTap wraps the node.
function themeCss(id, s) {
  const sel = `[data-block-id="${id}"]`;
  return `
    ${sel} pre, ${sel} code { color: ${s.textColor} !important; }
    ${sel} .hljs-comment, ${sel} .hljs-quote { color: ${s.syntax.comment} !important; font-style: italic; }
    ${sel} .hljs-keyword, ${sel} .hljs-selector-tag, ${sel} .hljs-literal { color: ${s.syntax.keyword} !important; }
    ${sel} .hljs-number { color: ${s.syntax.number} !important; }
    ${sel} .hljs-string, ${sel} .hljs-subst { color: ${s.syntax.string} !important; }
    ${sel} .hljs-function, ${sel} .hljs-title { color: ${s.syntax.func} !important; }
    ${sel} .hljs-variable, ${sel} .hljs-name, ${sel} .hljs-selector-id,
    ${sel} .hljs-selector-class, ${sel} .hljs-tag { color: ${s.syntax.variable} !important; }
    ${sel} .hljs-built_in, ${sel} .hljs-params { color: ${s.syntax.string} !important; }
    ${sel} .hljs-type { color: ${s.syntax.type} !important; }
    ${sel} .hljs-operator, ${sel} .hljs-punctuation { color: ${s.syntax.operator} !important; }
    ${sel} .hljs-attr, ${sel} .hljs-attribute { color: ${s.syntax.attr} !important; }
  `;
}

// ── Component ─────────────────────────────────────────────────────────────────
export default function CodeBlock({ node, updateAttributes, extension, editor }) {
  const { language: defaultLanguage, collapsed: collapsedAttr, codeTheme } = node.attrs;
  const isEditable = editor?.isEditable ?? true;
  const [isCopied, setIsCopied] = useState(false);
  const [themeOpen, setThemeOpen] = useState(false);
  // In viewer mode, collapsed is local state (updateAttributes is a no-op on read-only editors)
  const [localCollapsed, setLocalCollapsed] = useState(collapsedAttr);
  const collapsed = isEditable ? collapsedAttr : localCollapsed;

  const toggleCollapsed = () => {
    if (isEditable) {
      updateAttributes({ collapsed: !collapsed });
    } else {
      setLocalCollapsed(c => !c);
    }
  };

  // Stable unique ID so scoped CSS never bleeds between blocks
  const blockId = useRef(`cb-${Math.random().toString(36).slice(2, 9)}`).current;

  const activeThemeKey = codeTheme || 'vscode-dark';
  const theme = THEMES[activeThemeKey] || THEMES['vscode-dark'];

  const lineCount = (node.textContent.match(/\n/g) || []).length + 1;
  const displayLang = defaultLanguage || 'plaintext';

  const preRef = useRef(null);
  const gutterRef = useRef(null);
  const hiddenRef = useRef(null);

  const lines = node.textContent.split('\n');

  useLayoutEffect(() => {
    if (!preRef.current || !gutterRef.current || !hiddenRef.current) return;

    const resizeObserver = new ResizeObserver(() => {
      if (!preRef.current || !gutterRef.current || !hiddenRef.current) return;
      const preWidth = preRef.current.clientWidth;
      const contentWidth = Math.max(0, preWidth - 32);
      
      hiddenRef.current.style.width = `${contentWidth}px`;

      const hiddenDivs = hiddenRef.current.children;
      const gutterDivs = gutterRef.current.children;

      for (let i = 0; i < hiddenDivs.length; i++) {
        if (hiddenDivs[i] && gutterDivs[i]) {
          const height = hiddenDivs[i].getBoundingClientRect().height;
          gutterDivs[i].style.height = `${height}px`;
          gutterDivs[i].style.lineHeight = '24px';
        }
      }
    });

    resizeObserver.observe(preRef.current);

    // Initial measurement
    const preWidth = preRef.current.clientWidth;
    const contentWidth = Math.max(0, preWidth - 32);
    hiddenRef.current.style.width = `${contentWidth}px`;

    const hiddenDivs = hiddenRef.current.children;
    const gutterDivs = gutterRef.current.children;

    for (let i = 0; i < hiddenDivs.length; i++) {
      if (hiddenDivs[i] && gutterDivs[i]) {
        const height = hiddenDivs[i].getBoundingClientRect().height;
        gutterDivs[i].style.height = `${height}px`;
        gutterDivs[i].style.lineHeight = '24px';
      }
    }

    return () => {
      resizeObserver.disconnect();
    };
  }, [node.textContent, collapsed]);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(node.textContent).then(() => {
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    });
  };

  // Muted colours derived from theme
  const mutedColor = theme.textColor + '80'; // 50% opacity via hex
  const hoverBg = 'rgba(128,128,128,.12)';

  return (
    <NodeViewWrapper
      data-block-id={blockId}
      style={{
        display: 'block',
        margin: '20px 0',
        borderRadius: 12,
        border: `1px solid ${theme.border}`,
        background: theme.bg,
        boxShadow: '0 4px 16px rgba(0,0,0,.25)',
        fontFamily: "'Fira Code', 'Cascadia Code', Consolas, monospace",
        position: 'relative',
      }}
    >
      {/* Scoped syntax highlighting for this block's theme */}
      <style dangerouslySetInnerHTML={{ __html: themeCss(blockId, theme) }} />

      {/* Header */}
      <div contentEditable={false} style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '8px 14px',
        background: theme.headerBg,
        borderBottom: collapsed ? 'none' : `1px solid ${theme.border}`,
        userSelect: 'none',
        borderRadius: collapsed ? '11px' : '11px 11px 0 0',
      }}>
        {/* Left: traffic lights + language */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ display: 'flex', gap: 5 }}>
            <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#ff5f57' }} />
            <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#febc2e' }} />
            <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#28c840' }} />
          </div>
          {isEditable ? (
            <select
              value={displayLang}
              onChange={e => updateAttributes({ language: e.target.value })}
              onMouseDown={e => e.stopPropagation()}
              style={{
                background: 'rgba(128,128,128,.15)',
                color: theme.textColor,
                fontSize: 11,
                fontFamily: 'inherit',
                padding: '2px 20px 2px 7px',
                borderRadius: 4,
                border: `1px solid ${theme.border}`,
                outline: 'none',
                cursor: 'pointer',
                appearance: 'none',
                backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6' viewBox='0 0 10 6'%3E%3Cpath d='M0 0l5 6 5-6z' fill='%23888'/%3E%3C/svg%3E\")",
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'right 6px center',
              }}
            >
              <option value="plaintext">plaintext</option>
              {extension.options.lowlight.listLanguages().sort().map(lang => (
                <option key={lang} value={lang}>{lang}</option>
              ))}
            </select>
          ) : (
            <span style={{
              background: 'rgba(128,128,128,.15)',
              color: theme.textColor,
              fontSize: 11,
              fontFamily: 'inherit',
              padding: '2px 8px',
              borderRadius: 4,
              border: `1px solid ${theme.border}`,
            }}>{displayLang}</span>
          )}
        </div>

        {/* Right: theme picker (editor only) + collapse + copy */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>

          {/* Theme picker — only in editor */}
          {isEditable && <div style={{ position: 'relative' }}>
            <button
              onMouseDown={e => { e.preventDefault(); e.stopPropagation(); }}
              onClick={() => setThemeOpen(o => !o)}
              title="Code theme"
              style={{
                display: 'flex', alignItems: 'center', gap: 5,
                background: themeOpen ? hoverBg : 'transparent',
                border: 'none', cursor: 'pointer',
                fontSize: 11, color: theme.textColor,
                padding: '3px 8px', borderRadius: 4, transition: 'background .12s',
              }}
              onMouseEnter={e => { e.currentTarget.style.background = hoverBg; }}
              onMouseLeave={e => { if (!themeOpen) e.currentTarget.style.background = 'transparent'; }}
            >
              {/* Palette icon */}
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="13.5" cy="6.5" r=".5" fill="currentColor"/>
                <circle cx="17.5" cy="10.5" r=".5" fill="currentColor"/>
                <circle cx="8.5" cy="7.5" r=".5" fill="currentColor"/>
                <circle cx="6.5" cy="12.5" r=".5" fill="currentColor"/>
                <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z"/>
              </svg>
              {theme.name}
            </button>
            {themeOpen && (
              <div
                onMouseDown={e => { e.preventDefault(); e.stopPropagation(); }}
                style={{
                  position: 'absolute', right: 0, top: '100%', marginTop: 4, zIndex: 999,
                  background: theme.headerBg, border: `1px solid ${theme.border}`,
                  borderRadius: 8, overflow: 'hidden', minWidth: 160,
                  boxShadow: '0 8px 24px rgba(0,0,0,.4)',
                }}>
                {Object.entries(THEMES).map(([key, t]) => (
                  <button
                    key={key}
                    onMouseDown={e => { e.preventDefault(); e.stopPropagation(); }}
                    onClick={() => { updateAttributes({ codeTheme: key }); setThemeOpen(false); }}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 8, width: '100%',
                      padding: '7px 12px', border: 'none', cursor: 'pointer', textAlign: 'left',
                      background: key === activeThemeKey ? 'rgba(128,128,128,.2)' : 'transparent',
                      color: theme.textColor, fontSize: 12,
                      fontFamily: 'inherit',
                      transition: 'background .1s',
                    }}
                    onMouseEnter={e => { e.currentTarget.style.background = 'rgba(128,128,128,.15)'; }}
                    onMouseLeave={e => { e.currentTarget.style.background = key === activeThemeKey ? 'rgba(128,128,128,.2)' : 'transparent'; }}
                  >
                    {/* Colour swatch */}
                    <span style={{
                      width: 14, height: 14, borderRadius: 3, flexShrink: 0,
                      background: t.bg, border: `2px solid ${t.border}`,
                    }} />
                    {t.name}
                    {key === activeThemeKey && (
                      <svg style={{ marginLeft: 'auto' }} width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                        <polyline points="20 6 9 17 4 12"/>
                      </svg>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>}

          {/* Collapse */}
          <button
            onMouseDown={e => { e.preventDefault(); e.stopPropagation(); }}
            onClick={toggleCollapsed}
            style={{
              background: 'transparent', border: 'none', cursor: 'pointer',
              fontSize: 11, color: theme.textColor, padding: '3px 7px', borderRadius: 4,
            }}
            onMouseEnter={e => { e.currentTarget.style.background = hoverBg; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}
          >
            {collapsed ? '▶ Expand' : '▼ Collapse'}
          </button>

          {/* Copy */}
          <button
            onMouseDown={e => { e.preventDefault(); e.stopPropagation(); }}
            onClick={copyToClipboard}
            style={{
              display: 'flex', alignItems: 'center', gap: 5,
              background: isCopied ? 'rgba(52,211,153,.15)' : 'transparent',
              border: 'none', cursor: 'pointer',
              fontSize: 11, fontWeight: 500,
              color: isCopied ? '#34d399' : theme.textColor,
              padding: '3px 9px', borderRadius: 4, transition: 'all .15s',
            }}
            onMouseEnter={e => { if (!isCopied) e.currentTarget.style.background = hoverBg; }}
            onMouseLeave={e => { if (!isCopied) e.currentTarget.style.background = 'transparent'; }}
          >
            {isCopied ? (
              <>
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
                Copied
              </>
            ) : (
              <>
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
                  <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
                </svg>
                Copy
              </>
            )}
          </button>
        </div>
      </div>

      {/* Code body */}
      {!collapsed && (
        <div style={{ display: 'flex', fontFamily: 'inherit', fontSize: 13, lineHeight: '24px', borderRadius: '0 0 11px 11px', overflow: 'hidden', position: 'relative' }}>
          {/* Line numbers */}
          <div
            ref={gutterRef}
            contentEditable={false}
            aria-hidden="true"
            style={{
              userSelect: 'none', textAlign: 'right',
              color: theme.lineNumColor,
              background: theme.bg,
              borderRight: `1px solid ${theme.border}`,
              padding: '16px 10px', minWidth: '2.8rem',
              flexShrink: 0, fontSize: 12,
            }}
          >
            {lines.map((_, i) => (
              <div key={i} style={{ height: '24px', lineHeight: '24px' }}>{i + 1}</div>
            ))}
          </div>
          {/* Code content */}
          <pre ref={preRef} style={{ flex: 1, padding: '16px', margin: 0, background: 'transparent', overflowX: 'auto', color: theme.textColor }}>
            <NodeViewContent as="code" className={`language-${displayLang}`} style={{ display: 'block', color: 'inherit' }} />
          </pre>

          {/* Hidden replica to measure wrapped line heights */}
          <div
            ref={hiddenRef}
            contentEditable={false}
            aria-hidden="true"
            style={{
              position: 'absolute',
              visibility: 'hidden',
              height: 0,
              overflow: 'hidden',
              pointerEvents: 'none',
              fontFamily: "'Fira Code', 'Cascadia Code', Consolas, Monaco, monospace",
              fontSize: '0.875rem',
              lineHeight: '24px',
              left: '4.8rem',
            }}
          >
            {lines.map((line, i) => (
              <div
                key={i}
                style={{
                  whiteSpace: 'pre-wrap',
                  wordBreak: 'break-all',
                  overflowWrap: 'break-word',
                }}
              >
                {line || ' '}
              </div>
            ))}
          </div>
        </div>
      )}

      {collapsed && (
        <div contentEditable={false} style={{
          padding: '8px 14px', color: theme.lineNumColor, fontSize: 12,
          fontFamily: 'inherit', fontStyle: 'italic',
          borderRadius: '0 0 11px 11px',
        }}>
          {lineCount} line{lineCount !== 1 ? 's' : ''} hidden — click Expand to show
        </div>
      )}
    </NodeViewWrapper>
  );
}
