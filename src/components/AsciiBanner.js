/**
 * @file AsciiBanner.js
 * @description Renders the styled Christmas banner above the 3D tree:
 * "Mauri te desea feliz navidad!!!"
 */

import { AsciiRenderable } from '../core/Interfaces.js';

export class AsciiBanner extends AsciiRenderable {
  constructor() {
    super();
    this.time = 0;
    this.zIndex = 50; // Above background, below/alongside main content
  }

  /**
   * Updates banner animation (color cycling / sparkle).
   * @param {number} deltaTime
   */
  update(deltaTime) {
    this.time += deltaTime;
  }

  /**
   * Renders the stylized banner into the ASCII buffer.
   * @param {import('../core/AsciiBuffer.js').AsciiBuffer} buffer
   */
  render(buffer) {
    const cols = buffer.cols;

    // Stylized ASCII Art Header
    // Adaptable between wide screens and standard terminal widths
    const isWide = cols >= 88;

    const bannerLinesWide = [
      '  __  __                  _   _            _                       _     _           _ _ _ ',
      ' |  \\/  | __ _ _   _ _ __(_) | |_ ___   __| | ___  ___  ___  __ _  | |__ (_) _____  | | | |',
      " | |\\/| |/ _` | | | | '__| | | __/ _ \\ / _` |/ _ \\/ __|/ _ \\/ _` | | '_ \\| |/ / _ \\ | | | |",
      ' | |  | | (_| | |_| | |  | | | ||  __/| (_| |  __/\\__ \\  __/ (_| | | | | |   <  __/ |_|_|_|',
      ' |_|  |_|\\__,_|\\__,_|_|  |_|  \\__\\___| \\__,_|\\___||___/\\___|\\__,_| |_| |_|_|\\_\\___| (_|_|_)',
    ];

    const bannerLinesCompact = [
      '╔═══════════════════════════════════════════════════════════════╗',
      '║       *  *  *  Mauri te desea feliz navidad!!!  *  *  *       ║',
      '╚═══════════════════════════════════════════════════════════════╝',
    ];

    const lines = isWide ? bannerLinesWide : bannerLinesCompact;
    const bannerWidth = lines[0].length;
    const startX = Math.max(0, Math.floor((cols - bannerWidth) / 2));
    const startY = 1;

    // Golden / festive holiday color
    const goldColor = '#ffd700';
    const accentColor = '#ef4444';
    const whiteColor = '#f8fafc';

    // Sparkle effect
    const sparkleChars = ['*', '+', '✦', '·'];
    const sparkleChar = sparkleChars[Math.floor(this.time * 4) % sparkleChars.length];

    for (let r = 0; r < lines.length; r++) {
      const line = lines[r];
      const curY = startY + r;
      if (curY >= buffer.rows) break;

      // Color gradient or alternating festive tones
      const lineColor = isWide
        ? (r === 0 || r === 4 ? goldColor : whiteColor)
        : (r === 1 ? goldColor : accentColor);

      const glowColor = r === 2 || r === 1 ? '#fbbf24' : null;
      buffer.writeString(startX, curY, line, lineColor, this.zIndex, glowColor);
    }

    // Add glowing stars on the left and right sides of banner if space permits
    if (startX >= 4) {
      buffer.setCell(startX - 3, startY + 1, sparkleChar, goldColor, this.zIndex, '#fef08a');
      buffer.setCell(startX + bannerWidth + 2, startY + 1, sparkleChar, goldColor, this.zIndex, '#fef08a');
    }
  }
}
