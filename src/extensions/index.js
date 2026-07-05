import { Extension, InputRule } from '@tiptap/core';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import Highlight from '@tiptap/extension-highlight';
import { TextStyle } from '@tiptap/extension-text-style';
import Color from '@tiptap/extension-color';
import FontFamily from '@tiptap/extension-font-family';
import TextAlign from '@tiptap/extension-text-align';
import TaskList from '@tiptap/extension-task-list';
import TaskItem from '@tiptap/extension-task-item';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import { Table, TableRow, TableHeader, TableCell } from '@tiptap/extension-table';
import Subscript from '@tiptap/extension-subscript';
import Superscript from '@tiptap/extension-superscript';
import Placeholder from '@tiptap/extension-placeholder';
import CharacterCount from '@tiptap/extension-character-count';
import Mention from '@tiptap/extension-mention';
import Dropcursor from '@tiptap/extension-dropcursor';
import Gapcursor from '@tiptap/extension-gapcursor';
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight';
import GlobalDragHandle from 'tiptap-extension-global-drag-handle';
import { ReactNodeViewRenderer } from '@tiptap/react';
import { common, createLowlight } from 'lowlight';
import { FontSize } from './FontSize.js';
import { LineHeight } from './LineHeight.js';
import { Callout } from './Callout.js';
import { Video } from './Video.js';
import { Audio } from './Audio.js';
import { Hashtag } from './Hashtag.js';
import { SlashCommand } from './SlashCommand.jsx';
import CodeBlock from '../components/CodeBlock.jsx';
import { ImageNodeView } from '../components/ImageNodeView.jsx';
import { VideoNodeView } from '../components/VideoNodeView.jsx';
import { YoutubeNodeView } from '../components/YoutubeNodeView.jsx';
import suggestion from './suggestions.jsx';
import { Math } from './Math.jsx';
import Youtube from '@tiptap/extension-youtube';

const lowlight = createLowlight(common);

// Emoji shortcodes: :heart: → ❤️  :smile: → 😊  :rocket: → 🚀  :fire: → 🔥
const EmojiInputRules = Extension.create({
  name: 'emojiInputRules',
  addInputRules() {
    return [
      new InputRule({ find: /:heart:$/, handler: ({ state, range }) => { state.tr.insertText('❤️', range.from, range.to); } }),
      new InputRule({ find: /:smile:$/, handler: ({ state, range }) => { state.tr.insertText('😊', range.from, range.to); } }),
      new InputRule({ find: /:rocket:$/, handler: ({ state, range }) => { state.tr.insertText('🚀', range.from, range.to); } }),
      new InputRule({ find: /:fire:$/, handler: ({ state, range }) => { state.tr.insertText('🔥', range.from, range.to); } }),
    ];
  },
});

/**
 * Shared extension factory for both Editor and Viewer.
 *
 * @param {Object} config
 * @param {string} [config.placeholder]
 * @param {Object} [config.mentionOptions]
 * @param {boolean} [config.isEditable]
 * @returns {Array}
 */
export const createEditorExtensions = (config = {}) => {
  const { isEditable = true } = config;

  const extensions = [
    StarterKit.configure({
      codeBlock: false,
      code: {
        HTMLAttributes: { class: 'rte-inline-code' },
      },
      heading: { levels: [1, 2, 3, 4, 5, 6] },
    }),
    Underline,
    EmojiInputRules,
    Highlight.configure({ multicolor: true }),
    TextStyle,
    Color,
    FontFamily,
    FontSize,
    TextAlign.configure({ types: ['heading', 'paragraph'] }),
    TaskList,
    TaskItem.configure({ nested: true }),
    Link.configure({
      openOnClick: false,
      HTMLAttributes: {
        class: 'rte-link',
        rel: 'noopener noreferrer',
        target: '_blank',
      },
    }),
    Image.extend({
      inline: false,
      group: 'block',
      draggable: true,
      selectable: true,
      addAttributes() {
        return {
          ...this.parent?.(),
          width: {
            default: '100%',
            parseHTML: el => el.getAttribute('data-width') || el.style.width || '100%',
            renderHTML: attrs => ({ 'data-width': attrs.width, style: `width:${attrs.width}` }),
          },
          shape: {
            default: 'rect',
            parseHTML: el => el.getAttribute('data-shape') || 'rect',
            renderHTML: attrs => ({ 'data-shape': attrs.shape }),
          },
          frame: {
            default: 'none',
            parseHTML: el => el.getAttribute('data-frame') || 'none',
            renderHTML: attrs => ({ 'data-frame': attrs.frame }),
          },
          filters: {
            default: '',
            parseHTML: el => el.getAttribute('data-filters') || '',
            renderHTML: attrs => ({ 'data-filters': attrs.filters }),
          },
          align: {
            default: 'left',
            parseHTML: el => el.getAttribute('data-align') || 'left',
            renderHTML: attrs => ({ 'data-align': attrs.align }),
          },
        };
      },
      addNodeView() {
        return ReactNodeViewRenderer(ImageNodeView);
      },
    }).configure({ allowBase64: true }),
    Table.configure({ resizable: true }),
    TableRow.extend({
      addAttributes() {
        return {
          ...this.parent?.(),
          rowheight: {
            default: null,
            parseHTML: el => {
              const h = el.style.height;
              return h ? parseInt(h, 10) : null;
            },
            renderHTML: attrs => attrs.rowheight ? { style: `height:${attrs.rowheight}px` } : {},
          },
        };
      },
    }),
    TableHeader,
    TableCell,
    Subscript.extend({
      addKeyboardShortcuts() {
        return { 'Mod-,': () => this.editor.commands.toggleSubscript() };
      },
    }),
    Superscript.extend({
      addKeyboardShortcuts() {
        return { 'Mod-.': () => this.editor.commands.toggleSuperscript() };
      },
    }),
    Callout,
    Video.extend({
      addAttributes() {
        return {
          ...this.parent?.(),
          shape: { default: 'rect', parseHTML: el => el.getAttribute('data-shape'), renderHTML: attrs => ({ 'data-shape': attrs.shape }) },
          frame: { default: 'none', parseHTML: el => el.getAttribute('data-frame'), renderHTML: attrs => ({ 'data-frame': attrs.frame }) },
          filters: { default: '', parseHTML: el => el.getAttribute('data-filters'), renderHTML: attrs => ({ 'data-filters': attrs.filters }) },
          align: { default: 'left', parseHTML: el => el.getAttribute('data-align') || 'left', renderHTML: attrs => ({ 'data-align': attrs.align }) },
        };
      },
      addNodeView() {
        return ReactNodeViewRenderer(VideoNodeView);
      },
    }),
    Audio,
    Math,
    Youtube.extend({
      addNodeView() {
        return ReactNodeViewRenderer(YoutubeNodeView);
      },
    }).configure({ width: 640, height: 360 }),
    LineHeight,
    Hashtag,
    Placeholder.configure({ placeholder: config.placeholder || 'Start writing...' }),
    CharacterCount,
    Mention.configure({
      HTMLAttributes: { class: 'rte-mention' },
      suggestion: {
        ...suggestion,
        ...config.mentionOptions?.suggestion,
      },
    }),
    Dropcursor.configure({ color: '#3b82f6', width: 2 }),
    Gapcursor,
    // CodeBlock: addNodeView MUST be in .extend(), not .configure()
    CodeBlockLowlight.extend({
      addAttributes() {
        return {
          ...this.parent?.(),
          collapsed: {
            default: false,
            parseHTML: el => el.getAttribute('data-collapsed') === 'true',
            renderHTML: attrs => ({ 'data-collapsed': attrs.collapsed }),
          },
          codeTheme: {
            default: 'vscode-dark',
            parseHTML: el => el.getAttribute('data-code-theme') || 'vscode-dark',
            renderHTML: attrs => ({ 'data-code-theme': attrs.codeTheme }),
          },
        };
      },
      addNodeView() {
        return ReactNodeViewRenderer(CodeBlock);
      },
    }).configure({ lowlight }),
  ];

  if (isEditable) {
    extensions.push(
      GlobalDragHandle.configure({ dragHandleWidth: 20, scrollTreshold: 100 }),
      SlashCommand
    );
  }

  return extensions;
};
