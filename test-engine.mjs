import { TimeGateController, TimeGateState } from './src/core/TimeGateController.js';
import { AsciiBuffer } from './src/core/AsciiBuffer.js';
import { Math3D } from './src/utils/Math3D.js';
import { AsciiFont } from './src/utils/AsciiFont.js';

console.log('--- RUNNING UNIT TESTS FOR ASCII CHRISTMAS ENGINE ---');

// 1. Test TimeGateController
const timeGate = TimeGateController.getInstance();

// Test Dec 24 at 23:59:59 (should be LOCKED)
const dec24 = new Date(2026, 11, 24, 23, 59, 59);
if (timeGate.getState(dec24) !== TimeGateState.LOCKED) {
  throw new Error(`Expected Dec 24 to be LOCKED, got ${timeGate.getState(dec24)}`);
}

// Test Dec 25 at 00:00:00 (should be UNLOCKED)
const dec25 = new Date(2026, 11, 25, 0, 0, 0);
if (timeGate.getState(dec25) !== TimeGateState.UNLOCKED) {
  throw new Error(`Expected Dec 25 to be UNLOCKED, got ${timeGate.getState(dec25)}`);
}

// Test Dec 31 at 23:59:59 (should be UNLOCKED)
const dec31 = new Date(2026, 11, 31, 23, 59, 59);
if (timeGate.getState(dec31) !== TimeGateState.UNLOCKED) {
  throw new Error(`Expected Dec 31 to be UNLOCKED, got ${timeGate.getState(dec31)}`);
}

// Test Jan 1 at 12:00:00 (should be UNLOCKED)
const jan1 = new Date(2027, 0, 1, 12, 0, 0);
if (timeGate.getState(jan1) !== TimeGateState.UNLOCKED) {
  throw new Error(`Expected Jan 1 to be UNLOCKED, got ${timeGate.getState(jan1)}`);
}

// Test Jan 2 at 00:00:00 (should be LOCKED again)
const jan2 = new Date(2027, 0, 2, 0, 0, 0);
if (timeGate.getState(jan2) !== TimeGateState.LOCKED) {
  throw new Error(`Expected Jan 2 to be LOCKED, got ${timeGate.getState(jan2)}`);
}

// Test Debug Override
timeGate.setDebugOverride(TimeGateState.UNLOCKED);
if (timeGate.getState(jan2) !== TimeGateState.UNLOCKED) {
  throw new Error(`Expected debug override to return UNLOCKED on Jan 2`);
}
timeGate.setDebugOverride(null);
if (timeGate.getState(jan2) !== TimeGateState.LOCKED) {
  throw new Error(`Expected clearing debug override to restore LOCKED on Jan 2`);
}
console.log('✓ TimeGateController logic passed!');

// 2. Test AsciiBuffer & Z-Buffering
const buffer = new AsciiBuffer(20, 10);
buffer.clear();
// Set background cell at z = -10
buffer.setCell(5, 5, '.', '#ffffff', -10);
if (buffer.chars[5 * 20 + 5] !== '.') throw new Error('Failed to set cell');

// Set foreground cell at z = 10
buffer.setCell(5, 5, 'O', '#ff0000', 10);
if (buffer.chars[5 * 20 + 5] !== 'O') throw new Error('Failed to overwrite with closer z');

// Try setting cell behind at z = 5 (should be rejected by Z-buffer)
buffer.setCell(5, 5, '#', '#00ff00', 5);
if (buffer.chars[5 * 20 + 5] !== 'O') throw new Error('Z-buffer failed to reject occluded cell');
console.log('✓ AsciiBuffer & Z-buffering passed!');

// 3. Test Math3D
const p = { x: 10, y: 0, z: 0 };
const rot90 = Math3D.rotateY(p.x, p.y, p.z, Math.PI / 2);
if (Math.abs(rot90.x) > 0.001 || Math.abs(rot90.z - 10) > 0.001) {
  throw new Error(`Rotation failed: x=${rot90.x}, z=${rot90.z}`);
}
const proj = Math3D.project(rot90, 50, 50, 40, 20);
if (!proj || typeof proj.screenX !== 'number') {
  throw new Error('Projection failed');
}
console.log('✓ Math3D rotation and projection passed!');

// 4. Test AsciiFont
const fontOutput = AsciiFont.render('25');
if (fontOutput.length !== 5 || fontOutput[0].length === 0) {
  throw new Error('AsciiFont rendering failed');
}
console.log('✓ AsciiFont passed!');

console.log('ALL UNIT TESTS PASSED SUCCESSFULLY! 🚀');
