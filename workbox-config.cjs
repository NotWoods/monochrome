module.exports = {
  cacheId: 'monochrome.fyi',
  globDirectory: '.',
  globPatterns: [
    '*.{html,svg}',
    'css/*.css',
    'src/**/*.js',
    'web_modules/*.js',
    'demo/*.{png,svg}',
    'favicon/favicon_*.png',
    'previews/*.svg',
    'toggle/*.svg',
  ],
  globIgnores: ['**/node_modules/**', '**/sw.js', 'src/*/bundle.js'],
  swDest: 'sw.js',
  ignoreURLParametersMatching: [/demo/, /fbclid/],
};
