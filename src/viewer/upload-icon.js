// @ts-check

import { drawLayer, scaleCanvas } from './canvas.js';
import { layerFromSource } from './layer.js';
import { toggle } from './libs.js';

// @ts-ignore
const IS_FIREFOX = typeof InstallTrigger !== 'undefined';
const DPR = window.devicePixelRatio || 1;

const ICON_CANVASES = Array.from(
  document.querySelectorAll('canvas')
).map((canvas) => scaleCanvas(canvas, canvas.width, DPR));

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
  ICON_CANVASES.forEach((canvas) => {
    drawLayer(currentLayer, canvas, toggle.mode);
  });
  originalImg.src = source;
}

toggle.addEventListener('colorschemechange', () => {
  if (currentLayer) {
    ICON_CANVASES.forEach((canvas) => {
      drawLayer(currentLayer, canvas, toggle.mode);
    });
  }
});

function cachePreviewMap() {
  /** @type {NodeListOf<HTMLImageElement>} */
  const previews = document.querySelectorAll('.demo__preview');
  /** @type {Map<string, HTMLImageElement>} */
  const map = new Map();

  for (const preview of previews) {
    map.set(sanitizeDemoSource(preview.src), preview);
  }

  return map;
}

const previewMap = cachePreviewMap();

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
  const preview =
    source &&
    document.querySelector(
      `.demo__preview[src$="${source}"],.demo__preview[data-png="${source}"]`
    );
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
fileInput.addEventListener('change', () =>
  updateDisplayedIcon(fileInput.files[0])
);
// Update the displayed icon when a file is dropped in
fileDrop.addEventListener('filedrop', (evt) =>
  updateDisplayedIcon(evt.files[0])
);

// File input focus polyfill for Firefox
fileInput.addEventListener('focus', () => fileInput.classList.add('focus'), {
  passive: true,
});
fileInput.addEventListener('blur', () => fileInput.classList.remove('focus'), {
  passive: true,
});

// If there's a URL present in the "?demo" query parameter, use it as the icon URL.
const demoUrl = new URL(location.href).searchParams.get('demo');
updateDisplayedIcon(sanitizeDemoSource(demoUrl || 'demo/spec.svg'));

/** @type {HTMLUListElement} */
const demoLinks = document.querySelector('.demo__list');
demoLinks.addEventListener('click', (evt) => {
  const target = /** @type {HTMLElement} */ (evt.target);
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
document.querySelector('.controls').addEventListener('change', (evt) => {
  const checkbox = /** @type {HTMLInputElement} */ (evt.target);
  switch (checkbox.name) {
    case 'shrink':
      // Shrink the icon to 1/4 size
      const size = checkbox.checked ? '0.25' : '1';
      container.style.transform = `scale(${size})`;
      break;
    case 'original':
      // Show ghost image behind icon
      container.classList.toggle('icon--original', checkbox.checked);
      break;
  }
});
