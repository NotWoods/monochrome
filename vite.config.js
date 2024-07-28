import { defineConfig } from 'vite';
import legacy from '@vitejs/plugin-legacy';
import { VitePWA as pwa } from 'vite-plugin-pwa';
import { ViteWebfontDownload as webfont } from 'vite-plugin-webfont-dl';

export default defineConfig({
  build: {
    minify: false,
  },
  plugins: [
    webfont(
      'https://fonts.googleapis.com/css2?family=Lato:wght@400;900&display=swap',
    ),
    pwa({
      manifest: false,
      workbox: {
        cacheId: 'monochrome.fyi',
        globPatterns: [
          '*.{html,css,svg,woff2}',
          'assets/*.js',
          'demo/*.{png,svg}',
          'favicon/favicon_*.png',
          'previews/*.svg',
          'toggle/*.svg',
        ],
        globIgnores: ['assets/*-legacy.*.js', 'open'],
        ignoreURLParametersMatching: [/demo/, /fbclid/],
      },
    }),
    legacy({
      targets: ['defaults', 'not IE 11', 'kaios >= 2'],
    }),
  ],
  test: {
    environment: 'jsdom',
  },
});
