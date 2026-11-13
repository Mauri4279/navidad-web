/**
 * @file CountdownView.js
 * @description View 1: Real-time Christmas countdown rendered in large FIGlet ASCII art.
 * Extends SceneView (Liskov Substitution Principle).
 */

import { SceneView } from '../core/Interfaces.js';
import { AsciiFont } from '../utils/AsciiFont.js';
import { TimeGateController } from '../core/TimeGateController.js';

export class CountdownView extends SceneView {
  /**
   * @param {TimeGateController} [timeGateController] - Injected dependency (Dependency Inversion).
   */
  constructor(timeGateController = null) {
    super();
    this.timeGate = timeGateController || TimeGateController.getInstance();
    this.time = 0;
    this.countdownData = this.timeGate.getCountdown();
    this.pulse = 0;
  }

  /**
   * Updates timer metrics and animation pulsation.
   * @param {number} deltaTime
   * @param {number} timestamp
   */
  update(deltaTime, timestamp) {
    this.time += deltaTime;
    this.pulse = (Math.sin(this.time * 3) + 1) * 0.5; // 0..1 smooth pulse
    this.countdownData = this.timeGate.getCountdown();
  }

  /**
   * Helper to format numbers with leading zero.
   * @param {number} num
   * @returns {string}
   */
  #pad(num) {
    return String(Math.max(0, num)).padStart(2, '0');
  }

  /**
   * Renders the countdown view into the ASCII buffer.
   * @param {import('../core/AsciiBuffer.js').AsciiBuffer} buffer
   */
  render(buffer) {
    const { days, hours, minutes, seconds } = this.countdownData;
    const cols = buffer.cols;
    const rows = buffer.rows;

    const daysStr = this.#pad(days);
    const hoursStr = this.#pad(hours);
    const minsStr = this.#pad(minutes);
    const secsStr = this.#pad(seconds);

    // Render 5-line ASCII blocks for each component
    const blockDays = AsciiFont.render(daysStr, 1);
    const blockColon = AsciiFont.render(':', 1);
    const blockHours = AsciiFont.render(hoursStr, 1);
    const blockMins = AsciiFont.render(minsStr, 1);
    const blockSecs = AsciiFont.render(secsStr, 1);

    // Merge into combined 5 lines
    const combinedLines = ['', '', '', '', ''];
    const separator = '   ';

    for (let r = 0; r < 5; r++) {
      combinedLines[r] =
        blockDays[r] + separator +
        blockColon[r] + separator +
        blockHours[r] + separator +
        blockColon[r] + separator +
        blockMins[r] + separator +
        blockColon[r] + separator +
        blockSecs[r];
    }

    const clockWidth = combinedLines[0].length;
    const clockHeight = 5;

    // Header & Subtitle
    const titleText = '* * * CUENTA REGRESIVA PARA NAVIDAD * * *';
    const unlockMsg = 'EL REGALO SE DESBLOQUEARA EN NAVIDAD (25 DE DICIEMBRE)';
    const statusMsg = '[ ESTADO: LOCKED | TimeGateController ACTIVO ]';

    // Calculate vertical centering
    const totalContentHeight = 16;
    const startY = Math.max(2, Math.floor((rows - totalContentHeight) / 2));
    const startX = Math.max(2, Math.floor((cols - clockWidth) / 2));

    // Colors
    const goldColor = '#ffd700';
    const cyanColor = '#38bdf8';
    const greenColor = '#22c55e';
    const silverColor = '#94a3b8';
    const redColor = this.pulse > 0.5 ? '#ff2244' : '#b91c1c';
    const z = 10;

    // 1. Decorative Top Border
    const borderWidth = Math.min(cols - 4, Math.max(clockWidth + 12, 64));
    const borderX = Math.floor((cols - borderWidth) / 2);
    const borderLine = '+' + '-'.repeat(borderWidth - 2) + '+';
    buffer.writeString(borderX, startY, borderLine, greenColor, z);

    // 2. Title
    const titleX = Math.floor((cols - titleText.length) / 2);
    buffer.writeString(titleX, startY + 2, titleText, goldColor, z, '#fbbf24');

    // 3. Render ASCII Digit Block
    const clockY = startY + 5;
    for (let r = 0; r < clockHeight; r++) {
      const line = combinedLines[r];
      // Draw with color: numbers in bright cyan, colons with red pulse
      let curX = startX;

      // Days
      buffer.writeString(curX, clockY + r, blockDays[r], cyanColor, z, '#38bdf8');
      curX += blockDays[r].length + separator.length;

      // Colon 1
      buffer.writeString(curX, clockY + r, blockColon[r], redColor, z);
      curX += blockColon[r].length + separator.length;

      // Hours
      buffer.writeString(curX, clockY + r, blockHours[r], cyanColor, z, '#38bdf8');
      curX += blockHours[r].length + separator.length;

      // Colon 2
      buffer.writeString(curX, clockY + r, blockColon[r], redColor, z);
      curX += blockColon[r].length + separator.length;

      // Minutes
      buffer.writeString(curX, clockY + r, blockMins[r], cyanColor, z, '#38bdf8');
      curX += blockMins[r].length + separator.length;

      // Colon 3
      buffer.writeString(curX, clockY + r, blockColon[r], redColor, z);
      curX += blockColon[r].length + separator.length;

      // Seconds
      buffer.writeString(curX, clockY + r, blockSecs[r], cyanColor, z, '#38bdf8');
    }

    // 4. Labels under units
    const labelsY = clockY + 6;
    const unitDays = '  DIAS  ';
    const unitHours = ' HORAS  ';
    const unitMins = 'MINUTOS ';
    const unitSecs = 'SEGUNDOS';

    let curLabelX = startX;
    buffer.writeString(curLabelX + 1, labelsY, unitDays, silverColor, z);
    curLabelX += blockDays[0].length + separator.length + blockColon[0].length + separator.length;
    buffer.writeString(curLabelX + 1, labelsY, unitHours, silverColor, z);
    curLabelX += blockHours[0].length + separator.length + blockColon[0].length + separator.length;
    buffer.writeString(curLabelX + 1, labelsY, unitMins, silverColor, z);
    curLabelX += blockMins[0].length + separator.length + blockColon[0].length + separator.length;
    buffer.writeString(curLabelX + 1, labelsY, unitSecs, silverColor, z);

    // 5. Unlock Notice Message
    const msgX = Math.floor((cols - unlockMsg.length) / 2);
    buffer.writeString(msgX, startY + 13, unlockMsg, goldColor, z, '#ffd700');

    // 6. Controller Status
    const statusX = Math.floor((cols - statusMsg.length) / 2);
    buffer.writeString(statusX, startY + 15, statusMsg, '#64748b', z);

    // 7. Decorative Bottom Border
    buffer.writeString(borderX, startY + 17, borderLine, greenColor, z);
  }
}
