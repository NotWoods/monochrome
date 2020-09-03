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
export async function layerFromSource(source) {
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
export function createLayer(src) {
  return {
    src,
    name: 'Layer',
    padding: 0,
    x: 0,
    y: 0,
    alpha: 100,
    locked: false,
    fit: 'contain',
  };
}
