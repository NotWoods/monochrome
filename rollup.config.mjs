import multi from '@rollup/plugin-multi-entry';
import { defineConfig } from 'rollup';
import { absolutePath } from './lib/absolute-path.mjs';
import { ignore } from './lib/ignore.mjs';

export default defineConfig({
  input: [
    'src/viewer/polyfill.js',
    'src/viewer/keys.js',
    'src/viewer/upload-icon.js',
  ],
  output: {
    file: 'src/viewer-bundle.js',
    format: 'iife',
  },
  plugins: [
    multi(),
    ignore({
      // Don't bother with custom elements on old browsers
      matches: (id) =>
        id.includes('dark-mode-toggle') || id.includes('file-drop-element'),
    }),
    absolutePath(),
  ],
});
