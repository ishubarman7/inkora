import type { ReactElement } from 'react';

// ─── Shared ────────────────────────────────────────────────────────────────────

/** TipTap JSON document node — the format returned by editor.getJSON() */
export type JSONContent = Record<string, unknown>;

/** 'light' or 'dark' colour scheme */
export type Theme = 'light' | 'dark';

// ─── InkoraEditor ──────────────────────────────────────────────────────────────

export interface InkoraEditorProps {
  /**
   * Initial TipTap JSON document to pre-populate the editor.
   * Leave undefined to start empty.
   */
  initialContent?: JSONContent;

  /**
   * Fired on every keystroke with the current TipTap JSON.
   */
  onChange?: (json: JSONContent) => void;

  /**
   * Auto-save callback. Fires after ~1 s of idle typing.
   */
  onSave?: (json: JSONContent) => void;

  /**
   * Media upload handler. Called with the selected File.
   * Must return a promise resolving to `{ src: string }`.
   *
   * @example
   * onUpload={async (file) => {
   *   const url = await uploadToStorage(file);
   *   return { src: url };
   * }}
   */
  onUpload?: (file: File) => Promise<{ src: string }>;

  /**
   * Maps a stored `src` value to a live, displayable URL.
   * Only needed when `onUpload` returns a key/ID rather than a full URL.
   */
  resolveMediaUrl?: (src: string) => string;

  /**
   * Called when the user clicks the dark-mode toggle in the toolbar.
   * Update your `theme` state here.
   */
  onToggleTheme?: () => void;

  /** Colour scheme. Default: 'light' */
  theme?: Theme;

  /** Placeholder text shown in the empty editor. Default: 'Start writing…' */
  placeholder?: string;

  /** CSS width of the outer container. Default: '100%' */
  width?: string | number;

  /** Fixed height for the scrollable content area. */
  height?: string | number;

  /** Minimum height (px) of the scrollable content area. Default: 420 */
  minHeight?: number;

  /**
   * Forwarded to the TipTap Mention extension's suggestion config.
   * Provide an `items` function to power @mention autocomplete.
   *
   * @example
   * mentionOptions={{
   *   suggestion: {
   *     items: async ({ query }) => fetchUsers(query),
   *   },
   * }}
   */
  mentionOptions?: {
    suggestion?: {
      items?: (opts: { query: string }) => unknown[] | Promise<unknown[]>;
      [key: string]: unknown;
    };
    [key: string]: unknown;
  };
}

export declare function InkoraEditor(props: InkoraEditorProps): ReactElement | null;

// ─── InkoraBasicEditor ─────────────────────────────────────────────────────────

export interface InkoraBasicEditorProps {
  /** TipTap JSON document. */
  value?: JSONContent;

  /** Fired on every change with the current TipTap JSON. */
  onChange?: (json: JSONContent) => void;

  /** Auto-save callback (debounced ~1 s). */
  onSave?: (json: JSONContent) => void;

  /** Placeholder text. Default: 'Start writing…' */
  placeholder?: string;

  /** Colour scheme. Default: 'light' */
  theme?: Theme;

  /** CSS width of the outer container. Default: '100%' */
  width?: string | number;

  /** Fixed height for the content area. */
  height?: string | number;

  /** Minimum height (px) of the content area. Default: 150 */
  minHeight?: number;

  /** Hides the toolbar and disables editing. Default: false */
  readOnly?: boolean;
}

export declare function InkoraBasicEditor(props: InkoraBasicEditorProps): ReactElement | null;

// ─── InkoraViewer ──────────────────────────────────────────────────────────────

export interface InkoraViewerProps {
  /** TipTap JSON document to display. */
  content?: JSONContent;

  /** Colour scheme. Default: 'light' */
  theme?: Theme;
}

export declare function InkoraViewer(props: InkoraViewerProps): ReactElement | null;

// ─── createEditorExtensions ────────────────────────────────────────────────────

export interface CreateEditorExtensionsConfig {
  /** Placeholder text shown in the empty editor. */
  placeholder?: string;

  /**
   * Forwarded to the Mention extension's suggestion config.
   */
  mentionOptions?: {
    suggestion?: {
      items?: (opts: { query: string }) => unknown[] | Promise<unknown[]>;
      [key: string]: unknown;
    };
    [key: string]: unknown;
  };

  /**
   * Pass `false` to skip the GlobalDragHandle extension.
   * Useful when building a read-only viewer.
   * Default: true
   */
  isEditable?: boolean;
}

/**
 * Returns the full array of TipTap extensions used by InkoraEditor.
 * Use this when building a custom `useEditor` instance.
 *
 * @example
 * const extensions = useMemo(
 *   () => createEditorExtensions({ placeholder: 'Write here…' }),
 *   []
 * );
 * const editor = useEditor({ extensions });
 */
export declare function createEditorExtensions(config?: CreateEditorExtensionsConfig): unknown[];

// ─── editorStyles ──────────────────────────────────────────────────────────────

/**
 * A plain CSS string containing all `.rte-*` class definitions.
 * The built-in components inject this automatically.
 * Only needed when building a custom editor without the Inkora components.
 *
 * @example
 * <style dangerouslySetInnerHTML={{ __html: editorStyles }} />
 */
export declare const editorStyles: string;
