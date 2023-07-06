/**
 * @module ImageMetadata
 */

import vector, { Vector } from "./vector";

export interface ImageMetadata {
  content: HTMLImageElement | HTMLCanvasElement;
  offset?: Vector;
  scale?: number;
}

export type ImageLike = HTMLImageElement | HTMLCanvasElement | ImageMetadata;


/**
 * Converts an image-like object into a true {@link ImageMetadata} object
 *
 * @param {ImageLike} imageLike
 * @returns {ImageMetadata}
 */
export function asImageMetadata(imageLike: ImageLike): ImageMetadata {
  if (imageLike instanceof HTMLImageElement || imageLike instanceof HTMLCanvasElement) {
    return {
      content: imageLike,
      offset: vector(1, 1),
      scale: 1
    };
  }
  return imageLike;
}
