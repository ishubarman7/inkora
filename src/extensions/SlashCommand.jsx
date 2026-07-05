import { Extension } from '@tiptap/core';
import Suggestion from '@tiptap/suggestion';
import { ReactRenderer } from '@tiptap/react';
import tippy from 'tippy.js';
import React from 'react';
import {
  TypeIcon,
  BulletListIcon,
  OrderedListIcon,
  TaskListIcon,
  QuoteIcon,
  CodeBlockIcon,
  TableIcon,
  CalloutIcon,
  HrIcon,
} from '../components/Icons.jsx';

// ─── Command list ──────────────────────────────────────────────────────────────
// Only commands that run directly through editor.chain() are included here —
// commands that need a modal (image, video, math, YouTube) live in Toolbar.jsx
// and aren't wired to the slash menu yet.

const HeadingGlyph = ({ level }) => (
  <span style={{ fontSize: 11, fontWeight: 700 }}>{`H${level}`}</span>
);

const SLASH_ITEMS = [
  {
    title: 'Text',
    description: 'Plain paragraph',
    keywords: ['paragraph', 'text', 'p'],
    icon: TypeIcon,
    command: ({ editor, range }) => editor.chain().focus().deleteRange(range).setParagraph().run(),
  },
  {
    title: 'Heading 1',
    description: 'Big section heading',
    keywords: ['h1', 'heading', 'title'],
    icon: () => <HeadingGlyph level={1} />,
    command: ({ editor, range }) => editor.chain().focus().deleteRange(range).setNode('heading', { level: 1 }).run(),
  },
  {
    title: 'Heading 2',
    description: 'Medium section heading',
    keywords: ['h2', 'heading', 'subtitle'],
    icon: () => <HeadingGlyph level={2} />,
    command: ({ editor, range }) => editor.chain().focus().deleteRange(range).setNode('heading', { level: 2 }).run(),
  },
  {
    title: 'Heading 3',
    description: 'Small section heading',
    keywords: ['h3', 'heading'],
    icon: () => <HeadingGlyph level={3} />,
    command: ({ editor, range }) => editor.chain().focus().deleteRange(range).setNode('heading', { level: 3 }).run(),
  },
  {
    title: 'Bullet List',
    description: 'Unordered list of items',
    keywords: ['ul', 'bullet', 'list'],
    icon: BulletListIcon,
    command: ({ editor, range }) => editor.chain().focus().deleteRange(range).toggleBulletList().run(),
  },
  {
    title: 'Numbered List',
    description: 'Ordered list of items',
    keywords: ['ol', 'ordered', 'numbered', 'list'],
    icon: OrderedListIcon,
    command: ({ editor, range }) => editor.chain().focus().deleteRange(range).toggleOrderedList().run(),
  },
  {
    title: 'Task List',
    description: 'Checkbox to-do list',
    keywords: ['todo', 'checkbox', 'task', 'check'],
    icon: TaskListIcon,
    command: ({ editor, range }) => editor.chain().focus().deleteRange(range).toggleTaskList().run(),
  },
  {
    title: 'Quote',
    description: 'Blockquote callout',
    keywords: ['blockquote', 'quote', 'citation'],
    icon: QuoteIcon,
    command: ({ editor, range }) => editor.chain().focus().deleteRange(range).toggleBlockquote().run(),
  },
  {
    title: 'Code Block',
    description: 'Syntax-highlighted code',
    keywords: ['code', 'codeblock', 'pre', 'snippet'],
    icon: CodeBlockIcon,
    command: ({ editor, range }) => editor.chain().focus().deleteRange(range).toggleCodeBlock().run(),
  },
  {
    title: 'Table',
    description: '3 × 3 table',
    keywords: ['table', 'grid', 'rows', 'columns'],
    icon: TableIcon,
    command: ({ editor, range }) => editor.chain().focus().deleteRange(range).insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run(),
  },
  {
    title: 'Callout',
    description: 'Highlighted note block',
    keywords: ['callout', 'note', 'info', 'banner'],
    icon: CalloutIcon,
    command: ({ editor, range }) => editor.chain().focus().deleteRange(range).setCallout().run(),
  },
  {
    title: 'Divider',
    description: 'Horizontal rule',
    keywords: ['hr', 'divider', 'horizontal rule', 'separator'],
    icon: HrIcon,
    command: ({ editor, range }) => editor.chain().focus().deleteRange(range).setHorizontalRule().run(),
  },
];

const getSlashItems = ({ query }) => {
  const q = query.toLowerCase().trim();
  if (!q) return SLASH_ITEMS.slice(0, 10);
  return SLASH_ITEMS.filter(item =>
    item.title.toLowerCase().includes(q) || item.keywords.some(k => k.includes(q))
  ).slice(0, 10);
};

// ─── Dropdown UI ───────────────────────────────────────────────────────────────

const SlashList = React.forwardRef((props, ref) => {
  const [selectedIndex, setSelectedIndex] = React.useState(0);

  React.useEffect(() => setSelectedIndex(0), [props.items]);

  const selectItem = (index) => {
    const item = props.items[index];
    if (item) props.command(item);
  };

  React.useImperativeHandle(ref, () => ({
    onKeyDown: ({ event }) => {
      if (event.key === 'ArrowUp') {
        setSelectedIndex((selectedIndex + props.items.length - 1) % props.items.length);
        return true;
      }
      if (event.key === 'ArrowDown') {
        setSelectedIndex((selectedIndex + 1) % props.items.length);
        return true;
      }
      if (event.key === 'Enter') {
        selectItem(selectedIndex);
        return true;
      }
      return false;
    },
  }), [selectedIndex, props.items]);

  if (!props.items.length) {
    return (
      <div className="rte-slash-menu">
        <div className="rte-slash-empty">No matching blocks</div>
      </div>
    );
  }

  return (
    <div className="rte-slash-menu">
      {props.items.map((item, index) => {
        const Icon = item.icon;
        return (
          <button
            key={item.title}
            type="button"
            className={`rte-slash-item${index === selectedIndex ? ' active' : ''}`}
            onMouseEnter={() => setSelectedIndex(index)}
            onClick={() => selectItem(index)}
          >
            <span className="rte-slash-icon"><Icon /></span>
            <span className="rte-slash-text">
              <span className="rte-slash-title">{item.title}</span>
              <span className="rte-slash-desc">{item.description}</span>
            </span>
          </button>
        );
      })}
    </div>
  );
});

SlashList.displayName = 'SlashList';

// ─── Extension ─────────────────────────────────────────────────────────────────

export const SlashCommand = Extension.create({
  name: 'slashCommand',

  addOptions() {
    return {
      suggestion: {
        char: '/',
        allowSpaces: false,
        startOfLine: false,
        // Disable inside code blocks — a literal '/' there shouldn't open the menu.
        allow: ({ state, range }) => {
          const $from = state.doc.resolve(range.from);
          return $from.parent.type.name !== 'codeBlock';
        },
        items: getSlashItems,
        command: ({ editor, range, props }) => {
          props.command({ editor, range });
        },
        render: () => {
          let component;
          let popup;

          // Append inside the editor wrapper (not document.body) so the popup
          // inherits the --rte-* theme variables, matching BubbleMenu's approach.
          const getEditorEl = (editor) =>
            editor?.options?.element?.closest?.('.inkora-editor') ?? document.body;

          return {
            onStart: props => {
              component = new ReactRenderer(SlashList, {
                props,
                editor: props.editor,
              });

              if (!props.clientRect) return;

              popup = tippy('body', {
                getReferenceClientRect: props.clientRect,
                appendTo: () => getEditorEl(props.editor),
                content: component.element,
                showOnCreate: true,
                interactive: true,
                trigger: 'manual',
                placement: 'bottom-start',
              });
            },

            onUpdate(props) {
              component.updateProps(props);
              if (!props.clientRect) return;
              popup[0].setProps({ getReferenceClientRect: props.clientRect });
            },

            onKeyDown(props) {
              if (props.event.key === 'Escape') {
                popup[0].hide();
                return true;
              }
              return component.ref?.onKeyDown(props);
            },

            onExit() {
              popup[0].destroy();
              component.destroy();
            },
          };
        },
      },
    };
  },

  addProseMirrorPlugins() {
    return [
      Suggestion({
        editor: this.editor,
        ...this.options.suggestion,
      }),
    ];
  },
});
