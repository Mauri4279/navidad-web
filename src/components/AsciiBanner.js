/**
 * @file AsciiBanner.js
 * @description Renders the styled Christmas banner above the 3D tree:
 * "Mauri te desea una feliz navidad!"
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
   * @param {import('../core/AsciiBuffer.js').AsciiBuffer} buffer
   */
  render(buffer) {
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

    if (cols >= 78) {
      // Single-line ornate ribbon on wide screens
      const innerText = ` ${sp1}  *  Mauri te desea una feliz navidad!  *  ${sp2} `;
      const boxWidth = innerText.length + 4;
      const startX = Math.max(0, Math.floor((cols - boxWidth) / 2));
      const startY = 1;

      const topLine = '╔' + '═'.repeat(boxWidth - 2) + '╗';
      const midLine = '║ ' + innerText + ' ║';
      const botLine = '╚' + '═'.repeat(boxWidth - 2) + '╝';

      buffer.writeString(startX, startY, topLine, goldColor, this.zIndex, '#fef08a');
      buffer.writeString(startX, startY + 1, midLine, whiteColor, this.zIndex, amberColor);
      buffer.writeString(startX, startY + 2, botLine, goldColor, this.zIndex, '#fef08a');
    } else {
      // Responsive two-line ribbon for compact/mobile viewports
      const line1Text = ` ${sp1} Mauri te desea ${sp2} `;
      const line2Text = ` ~*~ una feliz navidad! ~*~ `;
      const contentWidth = Math.max(line1Text.length, line2Text.length) + 4;
      const boxWidth = Math.min(cols - 2, contentWidth);
      const startX = Math.max(0, Math.floor((cols - boxWidth) / 2));
      const startY = 1;

      const topLine = '╔' + '═'.repeat(boxWidth - 2) + '╗';
      const pad1 = Math.max(0, Math.floor((boxWidth - 2 - line1Text.length) / 2));
      const pad2 = Math.max(0, Math.floor((boxWidth - 2 - line2Text.length) / 2));

      const midLine1 = '║' + ' '.repeat(pad1) + line1Text + ' '.repeat(Math.max(0, boxWidth - 2 - line1Text.length - pad1)) + '║';
      const midLine2 = '║' + ' '.repeat(pad2) + line2Text + ' '.repeat(Math.max(0, boxWidth - 2 - line2Text.length - pad2)) + '║';
      const botLine = '╚' + '═'.repeat(boxWidth - 2) + '╝';

      buffer.writeString(startX, startY, topLine, goldColor, this.zIndex, '#fef08a');
      buffer.writeString(startX, startY + 1, midLine1, amberColor, this.zIndex, '#fef08a');
      buffer.writeString(startX, startY + 2, midLine2, whiteColor, this.zIndex, redAccent);
      buffer.writeString(startX, startY + 3, botLine, goldColor, this.zIndex, '#fef08a');
    }
  }
}
