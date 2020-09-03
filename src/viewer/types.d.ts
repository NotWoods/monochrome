/** `CanvasImageSource` variant that has number width/height */
type CanvasImageSourceNum =
  | HTMLImageElement
  | HTMLVideoElement
  | HTMLCanvasElement
  | ImageBitmap
  | OffscreenCanvas;

export type ColorScheme = 'light' | 'dark';

/**
 * Data class representing a layer that can be drawn onto the canvas.
 */
export interface Layer {
  /**
   * Original image of the layer, unless it's only a color
   */
  src?: CanvasImageSourceNum;
  /**
   * Name of the layer. Defaults to filename.
   */
  name: string;
  /**
   * Value from [0-100] representing the layer opacity.
   */
  alpha: number;
  padding: number;
  x: number;
  y: number;
  locked: boolean;
  /**
   * Fit style for image layers. No effect on color layers.
   * - fill:    The image dimensions will match the canvas, discarding the
   *            aspect ratio.
   * - contain: The image will be scaled down so that it is entirely visible.
   * - cover:   The image will be scaled up so that its smaller side matches
   *            the canvas size.
   */
  fit: 'fill' | 'contain' | 'cover';
}

/**
 * Wrapper around canvas element with reference to rendering context and size.
 */
export interface CanvasContainer {
  /**
   * The referenced canvas element.
   */
  canvas: HTMLCanvasElement;
  /**
   * Rendering context for `canvas`.
   */
  ctx: CanvasRenderingContext2D;
  /**
   * Width and height of the square `canvas`.
   */
  size: number;
  /**
   * Fill color dependent on color scheme.
   */
  fill: Record<ColorScheme, CanvasFillStrokeStyles['fillStyle']>;
}

export interface DarkModeToggleElement extends HTMLElement {
  mode: ColorScheme;
}

declare global {
  interface Monetization extends EventTarget {
    readonly state: 'pending' | 'started'
  }

  interface Document {
    monetization: Monetization
  }
}
