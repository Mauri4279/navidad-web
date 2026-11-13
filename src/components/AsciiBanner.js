/**
 * @file AsciiBanner.js
 * @description Renders the styled Christmas banner above the 3D tree:
 * "Mauri te desea una feliz navidad!"
 * Fully responsive for mobile devices and wide desktop displays.
 */

import { AsciiRenderable } from '../core/Interfaces.js';

export class AsciiBanner extends AsciiRenderable {
  constructor() {
    super();
    this.time = 0;
    this.zIndex = 50;
  }

  /**
   * Updates banner animation (sparkling stars & color pulsing).
   * @param {number} deltaTime
   */
  update(deltaTime) {
    this.time += deltaTime;
  }

  /**
   * Renders the banner into the ASCII buffer.
   * Dynamically adapts to narrow mobile screens or wide viewports.
   * @param {import('../core/AsciiBuffer.js').AsciiBuffer} buffer
   * @param {number|null} [targetY=null] - Optional dynamically computed Y row position.
   */
  render(buffer, targetY = null) {
    const cols = buffer.cols;

    // Golden & festive colors
    const goldColor = '#ffd700';
    const amberColor = '#fbbf24';
    const whiteColor = '#ffffff';
    const redAccent = '#ef4444';

    // Animated sparkles
    const sparkles = ['★', '✦', '*', '·'];
    const sp1 = sparkles[Math.floor(this.time * 3) % sparkles.length];
    const sp2 = sparkles[Math.floor(this.time * 3 + 2) % sparkles.length];

    if (cols >= 68) {
      // Single-line ornate ribbon on wide screens
      const innerText = ` ${sp1}  *  M A U R I   T E   D E S E A   U N A   F E L I Z   N A V I D A D !  *  ${sp2} `;
      const boxWidth = Math.min(cols - 2, innerText.length + 4);
      const startX = Math.max(0, Math.floor((cols - boxWidth) / 2));
      const startY = targetY !== null ? Math.max(1, targetY) : 1;

      const topLine = '╔' + '═'.repeat(boxWidth - 2) + '╗';
      const midLine = '║ ' + innerText + ' ║';
      const botLine = '╚' + '═'.repeat(boxWidth - 2) + '╝';

      buffer.writeString(startX, startY, topLine, goldColor, this.zIndex, '#fef08a');
      buffer.writeString(startX, startY + 1, midLine, whiteColor, this.zIndex, amberColor);
      buffer.writeString(startX, startY + 2, botLine, goldColor, this.zIndex, '#fef08a');
    } else {
      // Bold two-line ribbon for mobile viewports
      const useSpaced = cols >= 48;
      const line1Text = useSpaced
        ? `${sp1}  *  M A U R I   T E   D E S E A  *  ${sp2}`
        : `${sp1} Mauri te desea ${sp2}`;
      const line2Text = useSpaced
        ? `✦  U N A   F E L I Z   N A V I D A D !  ✦`
        : `~*~ una feliz navidad! ~*~`;

      const maxTextLen = Math.max(line1Text.length, line2Text.length);
      const boxWidth = Math.min(cols - 2, maxTextLen + 4);
      const startX = Math.max(0, Math.floor((cols - boxWidth) / 2));
      const startY = targetY !== null ? Math.max(1, targetY) : 1;

      const topLine = '╔' + '═'.repeat(Math.max(0, boxWidth - 2)) + '╗';
      const pad1 = Math.max(0, Math.floor((boxWidth - 2 - line1Text.length) / 2));
      const pad2 = Math.max(0, Math.floor((boxWidth - 2 - line2Text.length) / 2));

      const midLine1 = '║' + ' '.repeat(pad1) + line1Text + ' '.repeat(Math.max(0, boxWidth - 2 - line1Text.length - pad1)) + '║';
      const midLine2 = '║' + ' '.repeat(pad2) + line2Text + ' '.repeat(Math.max(0, boxWidth - 2 - line2Text.length - pad2)) + '║';
      const botLine = '╚' + '═'.repeat(Math.max(0, boxWidth - 2)) + '╝';

      buffer.writeString(startX, startY, topLine, goldColor, this.zIndex, '#fef08a');
      buffer.writeString(startX, startY + 1, midLine1, amberColor, this.zIndex, '#fef08a');
      buffer.writeString(startX, startY + 2, midLine2, whiteColor, this.zIndex, redAccent);
      buffer.writeString(startX, startY + 3, botLine, goldColor, this.zIndex, '#fef08a');
    }
  }
}
