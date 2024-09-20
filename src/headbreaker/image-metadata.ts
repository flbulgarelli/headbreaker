import vector, { Vector } from './vector';

/**
 * ImageMetadata interface
 */
export interface ImageMetadata {
  id?: string;
  content: HTMLImageElement | HTMLCanvasElement;
  offset: Vector;
  scale: number;
}

/**
 * ImageLike type
 */
export type ImageLike = HTMLImageElement | HTMLCanvasElement | ImageMetadata;

/**
 * Converts an image-like object into a true ImageMetadata object
 *
 * @param {ImageLike} imageLike
 * @returns {ImageMetadata}
 */
function asImageMetadata(imageLike: ImageLike): ImageMetadata {
  if (
    imageLike instanceof HTMLImageElement ||
    imageLike instanceof HTMLCanvasElement
  ) {
    return {
      content: imageLike,
      offset: vector(1, 1),
      scale: 1,
    };
  }
  return imageLike as ImageMetadata;
}

export default asImageMetadata;
