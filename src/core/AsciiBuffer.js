/**
 * @file AsciiBuffer.js
 * @description High-performance 2D Character Buffer with Color, Glow, and Z-Buffer support.
 */

export class AsciiBuffer {
  /**
   * @param {number} cols - Number of columns in character grid.
   * @param {number} rows - Number of rows in character grid.
   */
  constructor(cols = 80, rows = 40) {
    this.cols = Math.max(1, Math.floor(cols));
    this.rows = Math.max(1, Math.floor(rows));
    this.size = this.cols * this.rows;

    this.chars = new Array(this.size).fill(' ');
    this.colors = new Array(this.size).fill(null);
    this.glows = new Array(this.size).fill(null);
    this.zBuffer = new Float32Array(this.size).fill(-Infinity);
  }

  /**
   * Resizes buffer dimensions and resets contents.
   * @param {number} cols
   * @param {number} rows
   */
  resize(cols, rows) {
    this.cols = Math.max(1, Math.floor(cols));
    this.rows = Math.max(1, Math.floor(rows));
    this.size = this.cols * this.rows;

    this.chars = new Array(this.size).fill(' ');
    this.colors = new Array(this.size).fill(null);
    this.glows = new Array(this.size).fill(null);
    this.zBuffer = new Float32Array(this.size).fill(-Infinity);
  }

  /**
   * Clears buffer cells and resets depth buffer.
   * @param {string} bgChar
   * @param {string|null} bgColor
   */
  clear(bgChar = ' ', bgColor = null) {
    this.chars.fill(bgChar);
    this.colors.fill(bgColor);
    this.glows.fill(null);
    this.zBuffer.fill(-Infinity);
  }

  /**
   * Writes a single character with Z-depth testing.
   * @param {number} x - Column index.
   * @param {number} y - Row index.
   * @param {string} char - ASCII character.
   * @param {string|null} color - CSS color code.
   * @param {number} z - Depth value (higher means closer to camera).
   * @param {string|null} glow - Glow color.
   * @returns {boolean} Whether character was written.
   */
  setCell(x, y, char, color = null, z = 0, glow = null) {
    const ix = Math.floor(x);
    const iy = Math.floor(y);

    if (ix < 0 || ix >= this.cols || iy < 0 || iy >= this.rows) {
      return false;
    }

    const idx = iy * this.cols + ix;
    if (z >= this.zBuffer[idx]) {
      this.chars[idx] = char;
      this.colors[idx] = color;
      this.zBuffer[idx] = z;
      this.glows[idx] = glow;
      return true;
    }
    return false;
  }

  /**
   * Writes a horizontal string to the buffer.
   * @param {number} startX
   * @param {number} y
   * @param {string} str
   * @param {string|null} color
   * @param {number} z
   * @param {string|null} glow
   */
  writeString(startX, y, str, color = null, z = 0, glow = null) {
    const iy = Math.floor(y);
    if (iy < 0 || iy >= this.rows) return;

    for (let i = 0; i < str.length; i++) {
      const char = str[i];
      if (char !== ' ') {
        this.setCell(startX + i, iy, char, color, z, glow);
      }
    }
  }

  /**
   * Writes an array of strings (multi-line ASCII art) to the buffer.
   * @param {number} startX
   * @param {number} startY
   * @param {string[]} lines
   * @param {string|null} color
   * @param {number} z
   * @param {string|null} glow
   * @param {boolean} transparent - If true, spaces do not overwrite background.
   */
  writeBlock(startX, startY, lines, color = null, z = 0, glow = null, transparent = true) {
    for (let r = 0; r < lines.length; r++) {
      const line = lines[r];
      const curY = startY + r;
      if (curY < 0 || curY >= this.rows) continue;

      for (let c = 0; c < line.length; c++) {
        const char = line[c];
        if (transparent && char === ' ') continue;
        this.setCell(startX + c, curY, char, color, z, glow);
      }
    }
  }

  /**
   * Renders the buffer contents onto an HTML5 Canvas context.
   * @param {CanvasRenderingContext2D} ctx
   * @param {number} cellWidth - Width of a character in pixels.
   * @param {number} cellHeight - Height of a character in pixels.
   * @param {string} defaultColor - Fallback character color.
   */
  renderToCanvas(ctx, cellWidth, cellHeight, defaultColor = '#e2e8f0') {
    const baseline = cellHeight * 0.8;
    let lastColor = '';
    let lastGlow = '';

    for (let y = 0; y < this.rows; y++) {
      const rowOffset = y * this.cols;
      const posY = y * cellHeight + baseline;

      for (let x = 0; x < this.cols; x++) {
        const idx = rowOffset + x;
        const char = this.chars[idx];

        if (char === ' ') continue;

        const color = this.colors[idx] || defaultColor;
        const glow = this.glows[idx];

        // Update fillStyle only when changed
        if (color !== lastColor) {
          ctx.fillStyle = color;
          lastColor = color;
        }

        // Update shadow / glow
        if (glow !== lastGlow) {
          if (glow) {
            ctx.shadowColor = glow;
            ctx.shadowBlur = 8;
          } else {
            ctx.shadowBlur = 0;
          }
          lastGlow = glow;
        }

        ctx.fillText(char, x * cellWidth, posY);
      }
    }

    // Reset shadow blur to avoid side effects
    ctx.shadowBlur = 0;
  }
}
