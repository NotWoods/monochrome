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
export function drawLayer(layer, canvas, colorScheme) {
  const { ctx, size } = canvas;
  ctx.clearRect(0, 0, size, size);
  let width = getScale(layer) * size;
  let height = width;

  ctx.globalCompositeOperation = 'source-over';
  if (layer.src) {
    // If image layer...
    const { height: srcHeight, width: srcWidth } = layer.src;
    const srcRatio = srcWidth / srcHeight;

    if (layer.fit === 'fill') {
      // leave width and height as default
    } else if (layer.fit === 'contain' ? srcRatio > 1 : srcRatio < 1) {
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
 * Creates a blob URL or data URL for the canvas.
 * @param {HTMLCanvasElement} canvas
 * @param {boolean} blob If true, try to return Blob URL.
 */
export async function toUrl(canvas, blob) {
  if (blob && canvas.toBlob) {
    const blob = await new Promise((resolve) =>
      canvas.toBlob(resolve, 'image/png')
    );
    return URL.createObjectURL(blob);
  } else {
    // No blob API, fallback to data URL
    return canvas.toDataURL('image/png');
  }
}

/**
 * Create a new canvas element.
 *
 * @param {number} size Width and height of the square canvas element.
 * @param {number} scale Scale factor for the canvas, based on display density.
 * @returns {import('./types').CanvasContainer}
 */
export function createCanvas(size, scale = 1) {
  const canvas = document.createElement('canvas');
  return scaleCanvas(canvas, size, scale);
}

/**
 * Scale an existing canvas element.
 *
 * @param {HTMLCanvasElement} canvas Canvas element to modify.
 * @param {number} size Width and height of the square canvas element.
 * @param {number} scale Scale factor for the canvas, based on display density.
 * @returns {import('./types').CanvasContainer}
 */
export function scaleCanvas(canvas, size, scale = 1) {
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
      dark: canvas.dataset.dark || '#fff',
    },
  };
}
