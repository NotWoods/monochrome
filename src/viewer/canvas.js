// @ts-check

/**
 * @typedef {object} CanvasContainer
 * @prop {HTMLCanvasElement} canvas
 * @prop {CanvasRenderingContext2D} ctx
 * @prop {number} size
 * @prop {{light: string, dark: string}} fill
 * @prop {CanvasImageSource} [lastIcon]
 */

const dpr = window.devicePixelRatio || 1;
export const ICON_CANVASES = Array.from(
  document.querySelectorAll('canvas')
).map((canvas) => toContainer(canvas, canvas.width, dpr));

/**
 * Scale an existing canvas element and return a container object.
 * @param {HTMLCanvasElement} canvas
 * @param {number} size
 * @param {number} scale
 * @returns {CanvasContainer}
 */
function toContainer(canvas, size, scale = 1) {
  canvas.width = size * scale;
  canvas.height = size * scale;
  const ctx = canvas.getContext('2d');
  ctx.scale(scale, scale);
  const fill = { light: canvas.dataset.light, dark: canvas.dataset.dark };
  return { canvas, ctx, size, fill };
}

/**
 * Draw a monochrome icon on the canvas that needs to be colored.
 * @param {CanvasContainer} canvas
 * @param {CanvasImageSource} icon
 */
export function drawMonochromeIcon(canvas, icon) {
  canvas.lastIcon = icon;
  canvas.ctx.globalCompositeOperation = 'source-over';
  canvas.ctx.clearRect(0, 0, canvas.size, canvas.size);
  canvas.ctx.drawImage(icon, 0, 0, canvas.size, canvas.size);
}

/**
 * Color the monochrome icon already on the canvas.
 * @param {CanvasContainer} canvas
 * @param {string | CanvasGradient | CanvasPattern} fillStyle
 */
export function colorMonochromeIcon(canvas, fillStyle) {
  canvas.ctx.globalCompositeOperation = 'source-in';
  canvas.ctx.fillStyle = fillStyle;
  canvas.ctx.fillRect(0, 0, canvas.size, canvas.size);
}

/**
 * Create a new image from a blob.
 * @param {File | string} source URL or File for the icon.
 * If a File/Blob, an object URL is created and displayed.
 * If a string, the string is used as a URL directly.
 * @returns {Promise<HTMLImageElement>}
 */
export async function createImage(source) {
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
