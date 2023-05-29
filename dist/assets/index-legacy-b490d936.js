;
(function () {
  System.register([], function (exports, module) {
    'use strict';

    return {
      execute: function () {
        false && function polyfill() {
          const relList = document.createElement('link').relList;
          if (relList && relList.supports && relList.supports('modulepreload')) {
            return;
          }
          for (const link of document.querySelectorAll('link[rel="modulepreload"]')) {
            processPreload(link);
          }
          new MutationObserver(mutations => {
            for (const mutation of mutations) {
              if (mutation.type !== 'childList') {
                continue;
              }
              for (const node of mutation.addedNodes) {
                if (node.tagName === 'LINK' && node.rel === 'modulepreload') processPreload(node);
              }
            }
          }).observe(document, {
            childList: true,
            subtree: true
          });
          function getFetchOpts(link) {
            const fetchOpts = {};
            if (link.integrity) fetchOpts.integrity = link.integrity;
            if (link.referrerPolicy) fetchOpts.referrerPolicy = link.referrerPolicy;
            if (link.crossOrigin === 'use-credentials') fetchOpts.credentials = 'include';else if (link.crossOrigin === 'anonymous') fetchOpts.credentials = 'omit';else fetchOpts.credentials = 'same-origin';
            return fetchOpts;
          }
          function processPreload(link) {
            if (link.ep)
              // ep marker = processed
              return;
            link.ep = true;
            // prepopulate the load record
            const fetchOpts = getFetchOpts(link);
            fetch(link.href, fetchOpts);
          }
        }();

        // @ts-check

        /**
         * Returns the multiplier to scale the `layer` by.
         * For example, if padding is 0% then the return value will be 1.
         * @param {import('./types').Layer} layer
         */
        function getScale(layer) {
          return 1 - layer.padding / 100;
        }

        /**
         * Render layer to given canvas.
         *
         * The canvas will be cleared and the layer will be drawn depending on its
         * various properties.
         *
         * @param {import('./types').Layer} layer Layer to render.
         * @param {import('./types').CanvasContainer} canvas Canvas container.
         * @param {'light' | 'dark'} colorScheme Current color scheme.
         */
        function drawLayer(layer, canvas, colorScheme) {
          const {
            ctx,
            size
          } = canvas;
          ctx.clearRect(0, 0, size, size);
          let width = getScale(layer) * size;
          let height = width;
          ctx.globalCompositeOperation = 'source-over';
          if (layer.src) {
            // If image layer...
            const {
              height: srcHeight,
              width: srcWidth
            } = layer.src;
            const srcRatio = srcWidth / srcHeight;
            if (layer.fit === 'fill') ;else if (layer.fit === 'contain' ? srcRatio > 1 : srcRatio < 1) {
              height = width / srcRatio;
            } else {
              width = height * srcRatio;
            }
            const insetX = (size - width) / 2 + layer.x;
            const insetY = (size - height) / 2 + layer.y;
            ctx.globalAlpha = 1;
            ctx.drawImage(layer.src, insetX, insetY, width, height);
            ctx.globalCompositeOperation = 'source-atop';
          }
          const insetX = (size - width) / 2 + layer.x;
          const insetY = (size - height) / 2 + layer.y;
          ctx.fillStyle = canvas.fill[colorScheme];
          ctx.globalAlpha = layer.alpha / 100;
          ctx.fillRect(insetX, insetY, width, height);
        }

        /**
         * Scale an existing canvas element.
         *
         * @param {HTMLCanvasElement} canvas Canvas element to modify.
         * @param {number} size Width and height of the square canvas element.
         * @param {number} scale Scale factor for the canvas, based on display density.
         * @returns {import('./types').CanvasContainer}
         */
        function scaleCanvas(canvas, size, scale = 1) {
          canvas.width = size * scale;
          canvas.height = size * scale;
          const ctx = canvas.getContext('2d');
          ctx.scale(scale, scale);
          return {
            canvas,
            ctx,
            size,
            fill: {
              light: canvas.dataset.light || '#000',
              dark: canvas.dataset.dark || '#fff'
            }
          };
        }

        // @ts-check

        /**
         * Create a new image from a blob.
         * @param {File | string} source URL or File for the icon.
         * If a File/Blob, an object URL is created and displayed.
         * If a string, the string is used as a URL directly.
         * @returns {Promise<HTMLImageElement>}
         */
        async function createImage(source) {
          const img = new Image();
          if (typeof source === 'string') {
            img.src = source;
          } else {
            img.src = URL.createObjectURL(source);
          }
          await img.decode();
          if (typeof source !== 'string') {
            URL.revokeObjectURL(img.src);
          }
          return img;
        }

        /**
         * Create a layer from a source file.
         * @param {File | string} source
         * @returns {Promise<import("./types").Layer>}
         */
        async function layerFromSource(source) {
          const img = await createImage(source);
          const layer = createLayer(img);
          if (typeof source === 'string') {
            layer.name = source;
          } else {
            layer.name = source.name;
          }
          return layer;
        }

        /**
         * Create a new image or color canvas.
         * @param {import("./types").CanvasImageSourceNum} [src]
         * @returns {import("./types").Layer}
         */
        function createLayer(src) {
          return {
            src,
            name: 'Layer',
            padding: 0,
            x: 0,
            y: 0,
            alpha: 100,
            locked: false,
            fit: 'contain'
          };
        }
        const scriptRel = 'modulepreload';
        const assetsURL = function (dep) {
          return "/" + dep;
        };
        const seen = {};
        const __vitePreload = function preload(baseModule, deps, importerUrl) {
          // @ts-expect-error false will be replaced with boolean later
          if (!false || !deps || deps.length === 0) {
            return baseModule();
          }
          const links = document.getElementsByTagName('link');
          return Promise.all(deps.map(dep => {
            // @ts-expect-error assetsURL is declared before preload.toString()
            dep = assetsURL(dep);
            if (dep in seen) return;
            seen[dep] = true;
            const isCss = dep.endsWith('.css');
            const cssSelector = isCss ? '[rel="stylesheet"]' : '';
            const isBaseRelative = !!importerUrl;
            // check if the file is already preloaded by SSR markup
            if (isBaseRelative) {
              // When isBaseRelative is true then we have `importerUrl` and `dep` is
              // already converted to an absolute URL by the `assetsURL` function
              for (let i = links.length - 1; i >= 0; i--) {
                const link = links[i];
                // The `links[i].href` is an absolute URL thanks to browser doing the work
                // for us. See https://html.spec.whatwg.org/multipage/common-dom-interfaces.html#reflecting-content-attributes-in-idl-attributes:idl-domstring-5
                if (link.href === dep && (!isCss || link.rel === 'stylesheet')) {
                  return;
                }
              }
            } else if (document.querySelector(`link[href="${dep}"]${cssSelector}`)) {
              return;
            }
            const link = document.createElement('link');
            link.rel = isCss ? 'stylesheet' : scriptRel;
            if (!isCss) {
              link.as = 'script';
              link.crossOrigin = '';
            }
            link.href = dep;
            document.head.appendChild(link);
            if (isCss) {
              return new Promise((res, rej) => {
                link.addEventListener('load', res);
                link.addEventListener('error', () => rej(new Error(`Unable to preload CSS for ${dep}`)));
              });
            }
          })).then(() => baseModule());
        };

        /// <reference types="types-wm" />

        if (window.customElements) {
          __vitePreload(() => module.import('./filedrop-legacy-2a01a941.js'), false ? "__VITE_PRELOAD__" : void 0);
          __vitePreload(() => module.import('./dark-mode-toggle.min-legacy-9ff7553f.js'), false ? "__VITE_PRELOAD__" : void 0);
        }

        /** @type {import('dark-mode-toggle').DarkModeToggle} */
        const toggle = document.querySelector('dark-mode-toggle');
        /** @type {HTMLElement} */
        const ad = document.querySelector('[data-ea-publisher]');
        /** @type {HTMLImageElement} */
        const notificationImage = document.querySelector('.preview--android_notification .preview__background');

        /**
         * Set or remove the `dark` class on body and ads.
         * @param {boolean} darkMode
         */
        function updateDarkModeClasses(darkMode) {
          document.body.classList.toggle('dark', darkMode);
          ad.classList.toggle('dark', darkMode);
        }

        // Initialize the toggle based on `prefers-color-scheme`, defaulting to 'light'.
        toggle.mode = matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
        // Set or remove the `dark` class the first time.
        updateDarkModeClasses(toggle.mode === 'dark');

        // Listen for toggle changes (which includes `prefers-color-scheme` changes)
        // and toggle the `dark` class accordingly.
        toggle.addEventListener('colorschemechange', () => {
          updateDarkModeClasses(toggle.mode === 'dark');
          notificationImage.src = `previews/android_notification_${toggle.mode}.svg`;
        });
        if (document.monetization) {
          function onMonetizationStart() {
            if (document.monetization.state === 'started') {
              console.log('Payment started, hiding ads');
              ad.hidden = true;
            }
          }
          document.monetization.addEventListener('monetizationstart', onMonetizationStart);
        }

        // @ts-check

        // @ts-ignore
        const IS_FIREFOX = typeof InstallTrigger !== 'undefined';
        const DPR = window.devicePixelRatio || 1;
        const ICON_CANVASES = Array.from(document.querySelectorAll('canvas')).map(canvas => scaleCanvas(canvas, canvas.width, DPR));

        // @ts-ignore
        window.ICON_CANVASES = ICON_CANVASES;

        /** @type {import('./types').Layer | undefined} */
        let currentLayer;

        /**
         * Sanitize a demo source on Firefox,
         * which has bugs loading relative path SVGs into the canvas.
         *
         * @param {string} source Source URL of the image.
         */
        function sanitizeDemoSource(source) {
          if (IS_FIREFOX && source.startsWith('demo/')) {
            return source.replace('.svg', '.png');
          } else {
            return source;
          }
        }

        /**
         * Changes the displayed icon in the center of the screen.
         *
         * @param {File | string | undefined} source URL or File for the icon.
         * If a File/Blob, an object URL is created and displayed.
         * If a string, the string is used as a URL directly.
         * If undefined (or falsy), nothing happens.
         */
        async function updateDisplayedIcon(source) {
          if (!source) return;
          const layerAsync = layerFromSource(source);
          /** @type {HTMLImageElement} */
          const originalImg = document.querySelector('.icon__original .icon');
          const oldUrl = originalImg.src;
          if (oldUrl.startsWith('blob:')) {
            URL.revokeObjectURL(oldUrl);
          }

          // Update the URL bar
          if (typeof source === 'string') {
            history.replaceState(undefined, '', `?demo=${source}`);
          } else {
            // Create a URL corresponding to the file.
            source = URL.createObjectURL(source);
            history.replaceState(undefined, '', '.');
          }
          updateSource(source);
          currentLayer = await layerAsync;
          ICON_CANVASES.forEach(canvas => {
            drawLayer(currentLayer, canvas, toggle.mode);
          });
          originalImg.src = source;
        }
        toggle.addEventListener('colorschemechange', () => {
          if (currentLayer) {
            ICON_CANVASES.forEach(canvas => {
              drawLayer(currentLayer, canvas, toggle.mode);
            });
          }
        });

        /**
         * Changes the "Icon from" credits at the bottom of the app.
         * The credits are embedded in the HTML of the demo icons at the top of the screen.
         * The `alt` attribute is used for the human-readable portion of the link.
         * The `data-source` attribute is used for the URL of the link.
         *
         * @param {string | undefined} source Source URL of the displayed icon.
         * If the URL does not correspond to one of the demo icons, then the credits text is hidden.
         */
        function updateSource(source) {
          /** @type {HTMLElement} */
          const sourceDisplay = document.querySelector('.source');
          /** @type {HTMLAnchorElement} */
          const sourceLink = sourceDisplay.querySelector('.source__link');

          /** @type {HTMLImageElement | null} */
          const preview = source && document.querySelector(`.demo__preview[src$="${source}"],.demo__preview[data-png="${source}"]`);
          if (preview) {
            sourceDisplay.hidden = false;
            sourceLink.href = preview.dataset.source;
            sourceLink.textContent = preview.alt;
          } else {
            sourceDisplay.hidden = true;
          }
        }

        /** @type {HTMLInputElement} The "Open icon file" button */
        const fileInput = document.querySelector('#icon_file');
        /** @type {import('file-drop-element').FileDropElement} The invisible file drop area */
        const fileDrop = document.querySelector('#icon_drop');

        // Update the displayed icon when the "Open icon file" button is used
        fileInput.addEventListener('change', () => updateDisplayedIcon(fileInput.files[0]));
        // Update the displayed icon when a file is dropped in
        fileDrop.addEventListener('filedrop', evt => updateDisplayedIcon(evt.files[0]));

        // File input focus polyfill for Firefox
        fileInput.addEventListener('focus', () => fileInput.classList.add('focus'), {
          passive: true
        });
        fileInput.addEventListener('blur', () => fileInput.classList.remove('focus'), {
          passive: true
        });

        // If there's a URL present in the "?demo" query parameter, use it as the icon URL.
        const demoUrl = new URL(location.href).searchParams.get('demo');
        updateDisplayedIcon(sanitizeDemoSource(demoUrl || 'demo/spec.svg'));

        /** @type {HTMLUListElement} */
        const demoLinks = document.querySelector('.demo__list');
        demoLinks.addEventListener('click', evt => {
          const target = /** @type {HTMLElement} */evt.target;
          /** @type {HTMLAnchorElement} */
          const link = target.closest('.demo__link');
          if (link != null) {
            evt.preventDefault();
            const demoUrl = new URL(link.href).searchParams.get('demo');
            updateDisplayedIcon(sanitizeDemoSource(demoUrl));
          }
        });

        /** @type {HTMLElement} */
        const container = document.querySelector('.icon__grid');
        document.querySelector('.controls').addEventListener('change', evt => {
          const checkbox = /** @type {HTMLInputElement} */evt.target;
          switch (checkbox.name) {
            case 'shrink':
              {
                // Shrink the icon to 1/4 size
                const size = checkbox.checked ? '0.25' : '1';
                container.style.transform = `scale(${size})`;
                break;
              }
            case 'original':
              // Show ghost image behind icon
              container.classList.toggle('icon--original', checkbox.checked);
              break;
          }
        });

        // @ts-check

        /** @type {Map<string, HTMLInputElement>} */
        const accessKeys = new Map();
        /** @type {NodeListOf<HTMLInputElement>} */
        const focusable = document.querySelectorAll('input[accesskey]');
        focusable.forEach(input => {
          accessKeys.set(input.accessKey, input);
        });
        document.addEventListener('keydown', evt => {
          if (evt.repeat) return; // Ignore holding down keys
          const input = accessKeys.get(evt.key);
          if (input) {
            evt.preventDefault();
            input.click();
          }
        });
      }
    };
  });
})();
