/**
 * @file Math3D.js
 * @description 3D transformation, projection, and geometry utilities for ASCII 3D rendering.
 */

export class Math3D {
  /**
   * Rotates a point around the Y axis by angle in radians.
   * @param {number} x
   * @param {number} y
   * @param {number} z
   * @param {number} angle
   * @returns {{ x: number, y: number, z: number }}
   */
  static rotateY(x, y, z, angle) {
    const cos = Math.cos(angle);
    const sin = Math.sin(angle);
    return {
      x: x * cos - z * sin,
      y: y,
      z: x * sin + z * cos,
    };
  }

  /**
   * Rotates a point around the X axis by angle in radians.
   * @param {number} x
   * @param {number} y
   * @param {number} z
   * @param {number} angle
   * @returns {{ x: number, y: number, z: number }}
   */
  static rotateX(x, y, z, angle) {
    const cos = Math.cos(angle);
    const sin = Math.sin(angle);
    return {
      x: x,
      y: y * cos - z * sin,
      z: y * sin + z * cos,
    };
  }

  /**
   * Projects a 3D point to 2D screen coordinates with perspective and font aspect correction.
   * @param {{ x: number, y: number, z: number }} point
   * @param {number} cameraDistance
   * @param {number} fov
   * @param {number} centerX
   * @param {number} centerY
   * @param {number} [fontAspect=0.52] - Monospace character height/width ratio compensation.
   * @returns {{ screenX: number, screenY: number, scale: number, zDepth: number } | null}
   */
  static project(point, cameraDistance, fov, centerX, centerY, fontAspect = 0.52) {
    const zCam = point.z + cameraDistance;
    if (zCam <= 1.0) {
      return null; // Point behind camera or too close
    }

    const scale = fov / zCam;
    const screenX = Math.round(centerX + point.x * scale);
    const screenY = Math.round(centerY - point.y * scale * fontAspect);

    return {
      screenX,
      screenY,
      scale,
      zDepth: point.z,
    };
  }
}
