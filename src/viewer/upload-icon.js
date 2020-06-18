import {
  ICON_CANVASES,
  drawMonochromeIcon,
  createImage,
  colorMonochromeIcon,
} from './canvas.js';
import { toggle, fillStyle } from './libs.js';

// @ts-ignore
const isFirefox = typeof InstallTrigger !== 'undefined';

/**
 * Changes the displayed icon in the center of the screen.
 *
 * @param {Blob | string | undefined} source URL or File for the icon.
 * If a File/Blob, an object URL is created and displayed.
 * If a string, the string is used as a URL directly.
 * If undefined (or falsy), nothing happens.
 */
async function updateDisplayedIcon(source) {
  if (!source) return;

  let toDisplay = source;
  if (isFirefox && typeof source === 'string' && source.startsWith('demo/')) {
    // Firefox can't display SVG in Canvas
    toDisplay = source.replace('.svg', '.png');
  }

  const iconAsync = createImage(toDisplay);
  /** @type {HTMLImageElement} */
  const originalImg = document.querySelector('.icon__original .icon');

  // Update the URL bar
  if (typeof source === 'string') {
    history.replaceState(undefined, '', `?demo=${source}`);
    updateSource(source);
  } else {
    history.replaceState(undefined, '', '.');
    updateSource(undefined);
  }

  const icon = await iconAsync;
  window.icon = icon;
  ICON_CANVASES.forEach((canvas) => {
    drawMonochromeIcon(canvas, icon);
    colorMonochromeIcon(canvas, fillStyle(canvas));
  });
  originalImg.src = source;
}

updateDisplayedIcon('demo/spec.svg');
toggle.addEventListener('colorschemechange', () => {
  ICON_CANVASES.forEach((canvas) => {
    drawMonochromeIcon(canvas, canvas.lastIcon);
    colorMonochromeIcon(canvas, fillStyle(canvas));
  });
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

  /** @type {HTMLImageElement | undefined | false} */
  const preview =
    source && document.querySelector(`.demo__preview[src$="${source}"]`);
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
updateDisplayedIcon(demoUrl);

/** @type {HTMLUListElement} */
const demoLinks = document.querySelector('.demo__list');
demoLinks.addEventListener('click', (evt) => {
  const target = /** @type {HTMLElement} */ (evt.target);
  const link = target.closest('.demo__link');
  if (link != null) {
    evt.preventDefault();
    const demoUrl = new URL(link.href).searchParams.get('demo');
    updateDisplayedIcon(demoUrl);
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
