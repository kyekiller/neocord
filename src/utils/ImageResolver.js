/*
 * Copyright (c) 2020. MeLike2D All Rights Reserved.
 * Neo is licensed under the MIT License.
 * See the LICENSE file in the project root for more details.
 */

import { Readable } from "stream";
import { existsSync, promises as fs } from "fs";
import fetch from "node-fetch";
import { ImageFormats } from "./Constants";

export class ImageResolver {
  /**
   * Whether a buffer is of the jpeg format.
   * @param {Buffer} buffer
   * @returns {boolean}
   */
  static isJpg(buffer) {
    return (
      buffer.length > 3 &&
      buffer[0] === 0xff &&
      buffer[1] === 0xd8 &&
      buffer[2] === 0xff
    );
  }

  /**
   * Whether a buffer is of the png format.
   * @param {Buffer} buffer
   * @returns {boolean}
   */
  static isPng(buffer) {
    return (
      buffer.length > 8 &&
      buffer[0] === 0x89 &&
      buffer[1] === 0x50 &&
      buffer[2] === 0x4e &&
      buffer[3] === 0x47 &&
      buffer[4] === 0x0d &&
      buffer[5] === 0x0a &&
      buffer[6] === 0x1a &&
      buffer[7] === 0x0a
    );
  }

  /**
   * Whether a buffer is of the webp format.
   * @param {Buffer} buffer
   * @returns {boolean}
   */
  static isWebp(buffer) {
    return (
      buffer.length > 12 &&
      buffer[0] === 0x52 &&
      buffer[1] === 0x49 &&
      buffer[2] === 0x46 &&
      buffer[3] === 0x46 &&
      buffer[8] === 0x57 &&
      buffer[9] === 0x45 &&
      buffer[10] === 0x42 &&
      buffer[11] === 0x50
    );
  }

  /**
   * Whether a buffer is of the gif format
   * @param {Buffer} buffer
   * @returns {boolean}
   */
  static isGif(buffer) {
    return (
      buffer.length > 6 &&
      buffer[0] === 0x47 &&
      buffer[1] === 0x49 &&
      buffer[2] === 0x46 &&
      buffer[3] === 0x38 &&
      buffer[4] === 0x39 &&
      buffer[5] === 0x61
    );
  }

  /**
   * Get the image format of a buffer.
   * @param {Buffer} buffer
   * @returns {ImageFormats | null}
   */
  static getImageFormat(buffer) {
    if (this.isGif(buffer)) {
      return ImageFormats.GIF;
    }
    if (this.isJpg(buffer)) {
      return ImageFormats.JPEG;
    }
    if (this.isPng(buffer)) {
      return ImageFormats.PNG;
    }
    if (this.isWebp(buffer)) {
      return ImageFormats.WEBP;
    }
    return null;
  }

  /**
   * Resolves a buffer into a base64 string.
   * @param {Buffer } data
   * @returns {string}
   */
  static resolveBase64(data) {
    if (Buffer.isBuffer(data)) {
      const format = this.getImageFormat(data) ?? ImageFormats.JPEG;
      return `data:${format};base64,${data.toString("base64")}`;
    }

    return data;
  }

  /**
   * Resolves a file.
   * @param {ImageResolvable} resource
   * @returns {Promise<Buffer>}
   */
  static async resolveFile(resource) {
    if (resource instanceof Readable) {
      const buffers = [];
      for await (const buffer of resource) {
        buffers.push(buffer);
      }

      return Buffer.concat(buffers);
    }

    if (Buffer.isBuffer(resource)) {
      return resource;
    } else if (/^https?:\/\//.test(resource)) {
      return (await fetch(resource)).buffer;
    } else if (existsSync(resource)) {
      return fs.readFile(resource);
    }
    return Buffer.from(resource);
  }

  /**
   * Resolve an image into a base64
   * @param {ImageResolvable} data
   * @returns {Promise<string>}
   */
  static async resolveImage(data) {
    const file = await this.resolveFile(data);
    return this.resolveBase64(file);
  }
}

/**
 * @typedef {Buffer | Readable} ImageResolvable
 */

