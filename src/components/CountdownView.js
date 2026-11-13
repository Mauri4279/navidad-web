/**
 * @file CountdownView.js
 * @description View 1: Real-time Christmas countdown with compact digital ASCII numerals.
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
    this.pulse = (Math.sin(this.time * 3) + 1) * 0.5;
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
   * Renders the compact countdown into the ASCII buffer.
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

    // Compact 3-line ASCII numerals
    const blockDays = AsciiFont.renderCompact(daysStr, 0);
    const blockColon = AsciiFont.renderCompact(':', 0);
    const blockHours = AsciiFont.renderCompact(hoursStr, 0);
    const blockMins = AsciiFont.renderCompact(minsStr, 0);
    const blockSecs = AsciiFont.renderCompact(secsStr, 0);

    const separator = '  ';
    const combinedLines = ['', '', ''];

    for (let r = 0; r < 3; r++) {
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
    const clockHeight = 3;

    // Centering layout
    const contentHeight = 11;
    const startY = Math.max(2, Math.floor((rows - contentHeight) / 2));
    const clockX = Math.floor((cols - clockWidth) / 2);

    // Colors
    const goldColor = '#ffd700';
    const cyanColor = '#38bdf8';
    const greenColor = '#22c55e';
    const silverColor = '#94a3b8';
    const redColor = this.pulse > 0.5 ? '#ff2244' : '#b91c1c';
    const z = 10;

    // 1. Decorative Top Border
    const borderWidth = Math.max(clockWidth + 8, 48);
    const borderX = Math.floor((cols - borderWidth) / 2);
    const borderLine = '+' + '-'.repeat(borderWidth - 2) + '+';
    buffer.writeString(borderX, startY, borderLine, greenColor, z);

    // 2. Title
    const titleText = '* * * CUENTA REGRESIVA PARA NAVIDAD * * *';
    const titleX = Math.floor((cols - titleText.length) / 2);
    buffer.writeString(titleX, startY + 2, titleText, goldColor, z, '#fbbf24');

    // 3. Compact Countdown Clock
    const clockY = startY + 5;
    for (let r = 0; r < clockHeight; r++) {
      let curX = clockX;

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

    // 4. Units Labels
    const labelsY = clockY + 3;
    const unitDays = ' DIAS ';
    const unitHours = ' HORAS ';
    const unitMins = ' MINS ';
    const unitSecs = ' SEGS ';

    let curLabelX = clockX;
    buffer.writeString(curLabelX, labelsY, unitDays, silverColor, z);
    curLabelX += blockDays[0].length + separator.length + blockColon[0].length + separator.length;
    buffer.writeString(curLabelX, labelsY, unitHours, silverColor, z);
    curLabelX += blockHours[0].length + separator.length + blockColon[0].length + separator.length;
    buffer.writeString(curLabelX, labelsY, unitMins, silverColor, z);
    curLabelX += blockMins[0].length + separator.length + blockColon[0].length + separator.length;
    buffer.writeString(curLabelX, labelsY, unitSecs, silverColor, z);

    // 5. Decorative Bottom Border
    buffer.writeString(borderX, startY + 10, borderLine, greenColor, z);
  }
}
