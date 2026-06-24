import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.js'],
  format: ['esm', 'cjs'],
  outDir: 'dist',
  sourcemap: true,
  clean: true,
  // 'use client' tells Next.js App Router that all exports are client components.
  banner: { js: "'use client';" },
  // Keep React and all TipTap packages out of the bundle —
  // consumers must have them installed as peer dependencies.
  external: [
    'react',
    'react-dom',
    'react/jsx-runtime',
    /^@tiptap\//,
    'katex',
  ],
  // Inline lowlight, tippy.js, and the drag-handle (they are in dependencies).
  esbuildOptions(options) {
    options.jsx = 'automatic';
    options.loader = { ...options.loader, '.js': 'jsx' };
  },
});
