/**
 * @file AsciiHourglass.js
 * @description Infinite animated ASCII Art Hourglass inspired by reference pixel art.
 * Conforms to AsciiRenderable contract (Single Responsibility Principle).
 */

import { AsciiRenderable } from '../core/Interfaces.js';

export class AsciiHourglass extends AsciiRenderable {
  constructor() {
    super();
    this.time = 0;
    this.width = 28;
    this.height = 17;
  }

  /**
   * Updates internal animation timer.
   * @param {number} deltaTime
   */
  update(deltaTime) {
    this.time += deltaTime;
  }

  /**
   * Renders the animated infinite hourglass at specified buffer coordinates.
   * @param {import('../core/AsciiBuffer.js').AsciiBuffer} buffer
   * @param {number} startX
   * @param {number} startY
   */
  renderAt(buffer, startX, startY) {
    const goldColor = '#fbbf24';
    const sandBright = '#fef08a';
    const glassColor = '#38bdf8';
    const frameColor = '#cbd5e1';
    const pillarColor = '#94a3b8';
    const z = 15;

    // Static outer structural frame (matching the reference image)
    const frame = [
      '  .------------------------.  ', // 0: Top cap
      ' (==========================) ', // 1: Top rim
      "  |  \\''''''''''''''''''''/  |", // 2: Glass upper rim
      '  |   \\                  /   |', // 3: Upper bulb row 1
      '  |    \\                /    |', // 4: Upper bulb row 2
      '  |     \\              /     |', // 5: Upper bulb row 3
      '  |<><>  \\            /  <><>|', // 6: Upper bulb row 4 + pillar diamond
      "  |       '--.    .--'       |", // 7: Funnel slope
      '  |           )  (           |', // 8: Neck waist
      "  |       .--'    '--.       |", // 9: Bottom neck flare
      '  |<><>  /            \\  <><>|', // 10: Lower bulb row 1 + pillar diamond
      '  |     /              \\     |', // 11: Lower bulb row 2
      '  |    /                \\    |', // 12: Lower bulb row 3
      '  |   /                  \\   |', // 13: Lower bulb row 4
      '  |  /....................\\  |', // 14: Glass lower rim
      ' (==========================) ', // 15: Bottom rim
      "  '------------------------'  ", // 16: Bottom cap
    ];

    // 1. Render the wooden / metal / glass frame
    for (let r = 0; r < frame.length; r++) {
      const line = frame[r];
      const curY = startY + r;
      if (curY < 0 || curY >= buffer.rows) continue;

      for (let c = 0; c < line.length; c++) {
        const ch = line[c];
        if (ch === ' ') continue;

        let color = frameColor;
        let glow = null;

        if (r === 0 || r === 1 || r === 15 || r === 16) {
          color = frameColor; // Caps
        } else if (c === 2 || c === 27) {
          color = pillarColor; // Outer posts
        } else if ((r === 6 || r === 10) && (c >= 3 && c <= 6 || c >= 23 && c <= 26)) {
          color = goldColor; // Pillar decorative diamonds
          glow = '#ffd700';
        } else if (ch === '\\' || ch === '/' || ch === "'" || ch === '.' || ch === ')' || ch === '(') {
          color = glassColor; // Glass edges
        }

        buffer.setCell(startX + c, curY, ch, color, z, glow);
      }
    }

    // 2. Render dynamic sand particles in upper bulb (slowly draining funnel)
    const upperRows = [
      { y: 3, minX: 8, maxX: 21 },
      { y: 4, minX: 9, maxX: 20 },
      { y: 5, minX: 10, maxX: 19 },
      { y: 6, minX: 11, maxX: 18 },
      { y: 7, minX: 13, maxX: 16 },
    ];

    const sandChars = ['.', ':', '*', '·'];

    for (let i = 0; i < upperRows.length; i++) {
      const { y, minX, maxX } = upperRows[i];
      const curY = startY + y;
      if (curY < 0 || curY >= buffer.rows) continue;

      for (let x = minX; x <= maxX; x++) {
        // Continuous organic sand grain pattern using pseudo-random sine hash
        const seed = Math.sin(x * 12.9898 + y * 78.233 + Math.floor(this.time * 2) * 0.1);
        if (seed > -0.2) {
          const charIdx = Math.floor(Math.abs(seed * 100)) % sandChars.length;
          const char = sandChars[charIdx];
          const isSparkle = seed > 0.75;
          buffer.setCell(
            startX + x,
            curY,
            char,
            isSparkle ? sandBright : goldColor,
            z + 1,
            isSparkle ? '#ffd700' : null
          );
        }
      }
    }

    // 3. Falling sand stream through the neck (Infinite trickling flow)
    const streamY = [7, 8, 9, 10];
    const streamCycle = Math.floor(this.time * 14);

    for (let i = 0; i < streamY.length; i++) {
      const curY = startY + streamY[i];
      if (curY < 0 || curY >= buffer.rows) continue;

      const streamChars = [':', '|', '.', '*'];
      const char = streamChars[(streamCycle + i) % streamChars.length];
      buffer.setCell(startX + 14, curY, char, sandBright, z + 2, '#ffd700');
    }

    // 4. Render accumulating mound in lower bulb (rippling outward endlessly)
    const lowerRows = [
      { y: 10, minX: 13, maxX: 16 },
      { y: 11, minX: 11, maxX: 18 },
      { y: 12, minX: 10, maxX: 19 },
      { y: 13, minX: 9, maxX: 20 },
      { y: 14, minX: 7, maxX: 22 },
    ];

    for (let i = 0; i < lowerRows.length; i++) {
      const { y, minX, maxX } = lowerRows[i];
      const curY = startY + y;
      if (curY < 0 || curY >= buffer.rows) continue;

      for (let x = minX; x <= maxX; x++) {
        const seed = Math.sin(x * 9.123 + y * 31.456 + Math.floor(this.time * 1.5) * 0.08);
        if (seed > -0.3) {
          const charIdx = Math.floor(Math.abs(seed * 50)) % sandChars.length;
          const char = sandChars[charIdx];
          const isSparkle = seed > 0.8;
          buffer.setCell(
            startX + x,
            curY,
            char,
            isSparkle ? sandBright : goldColor,
            z + 1,
            isSparkle ? '#ffd700' : null
          );
        }
      }
    }
  }

  /**
   * AsciiRenderable render hook.
   * @param {import('../core/AsciiBuffer.js').AsciiBuffer} buffer
   */
  render(buffer) {
    const startX = Math.floor((buffer.cols - this.width) / 2);
    const startY = Math.max(1, Math.floor((buffer.rows - this.height) / 2));
    this.renderAt(buffer, startX, startY);
  }
}
