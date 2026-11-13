/**
 * @file AsciiRenderEngine.js
 * @description Central Singleton rendering engine and animation loop (requestAnimationFrame).
 * Coordinates layered rendering (Background/Snow -> Ground -> Main Content -> Banner/HUD).
 */

import { AsciiBuffer } from './AsciiBuffer.js';

export class AsciiRenderEngine {
  static #instance = null;

  /**
   * Private constructor enforcing Singleton pattern.
   */
  constructor() {
    if (AsciiRenderEngine.#instance) {
      throw new Error('AsciiRenderEngine is a Singleton. Use AsciiRenderEngine.getInstance().');
    }

    this.canvas = null;
    this.ctx = null;
    this.buffer = null;

    // Typography & Cell Grid metrics
    this.fontSize = 14;
    this.fontFamily = '"Courier New", Courier, monospace';
    this.cellWidth = 8.5;
    this.cellHeight = 16;
    this.cols = 80;
    this.rows = 40;

    // Layer management: 0: Background/Snow, 1: Ground, 2: Main Content, 3: Banner/HUD
    this.layers = new Map();

    // Loop state
    this.isRunning = false;
    this.lastFrameTime = 0;
    this.animationFrameId = null;

    // Performance metrics
    this.fps = 60;
    this.frameCount = 0;
    this.fpsTimer = 0;

    this.#handleResize = this.#handleResize.bind(this);
    this.#loop = this.#loop.bind(this);
  }

  /**
   * Retrieves singleton instance.
   * @returns {AsciiRenderEngine}
   */
  static getInstance() {
    if (!AsciiRenderEngine.#instance) {
      AsciiRenderEngine.#instance = new AsciiRenderEngine();
    }
    return AsciiRenderEngine.#instance;
  }

  /**
   * Initializes engine with target canvas element.
   * @param {HTMLCanvasElement} canvas
   */
  init(canvas) {
    if (!canvas) {
      throw new Error('AsciiRenderEngine.init requires a valid HTMLCanvasElement.');
    }

    this.canvas = canvas;
    this.ctx = canvas.getContext('2d', { alpha: false });

    window.addEventListener('resize', this.#handleResize);
    this.#updateGridMetrics();
    this.#handleResize();
  }

  /**
   * Measures monospace character dimensions accurately.
   * @private
   */
  #updateGridMetrics() {
    if (!this.ctx) return;

    this.ctx.font = `${this.fontSize}px ${this.fontFamily}`;
    const metrics = this.ctx.measureText('M');
    this.cellWidth = Math.ceil(metrics.width);
    this.cellHeight = Math.ceil(this.fontSize * 1.15);
  }

  /**
   * Recalculates canvas dimensions and buffer grid when window resizes.
   * @private
   */
  #handleResize() {
    if (!this.canvas || !this.ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const displayWidth = window.innerWidth;
    const displayHeight = window.innerHeight;

    this.canvas.width = Math.floor(displayWidth * dpr);
    this.canvas.height = Math.floor(displayHeight * dpr);
    this.canvas.style.width = `${displayWidth}px`;
    this.canvas.style.height = `${displayHeight}px`;

    this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    // Dynamic grid size
    const newCols = Math.max(40, Math.floor(displayWidth / this.cellWidth));
    const newRows = Math.max(25, Math.floor(displayHeight / this.cellHeight));

    if (!this.buffer) {
      this.buffer = new AsciiBuffer(newCols, newRows);
    } else {
      this.buffer.resize(newCols, newRows);
    }

    this.cols = newCols;
    this.rows = newRows;
  }

  /**
   * Registers or replaces an AsciiRenderable in a specific layer.
   * @param {number} layerIndex - 0: Background, 1: Ground, 2: Main, 3: Overlay/Banner
   * @param {import('./Interfaces.js').AsciiRenderable} renderable
   */
  setLayer(layerIndex, renderable) {
    this.layers.set(layerIndex, renderable);
  }

  /**
   * Removes a layer.
   * @param {number} layerIndex
   */
  removeLayer(layerIndex) {
    this.layers.delete(layerIndex);
  }

  /**
   * Starts the 60 FPS animation loop.
   */
  start() {
    if (this.isRunning) return;
    this.isRunning = true;
    this.lastFrameTime = performance.now();
    this.animationFrameId = requestAnimationFrame(this.#loop);
  }

  /**
   * Stops the animation loop.
   */
  stop() {
    this.isRunning = false;
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
  }

  /**
   * Main animation loop coordinating updates and layered rendering.
   * @param {number} timestamp
   * @private
   */
  #loop(timestamp) {
    if (!this.isRunning) return;

    // Calculate delta time in seconds (capped at 0.1s to prevent jumps on tab focus)
    const deltaMs = timestamp - this.lastFrameTime;
    const deltaTime = Math.min(deltaMs / 1000, 0.1);
    this.lastFrameTime = timestamp;

    // Track FPS
    this.frameCount++;
    this.fpsTimer += deltaMs;
    if (this.fpsTimer >= 1000) {
      this.fps = this.frameCount;
      this.frameCount = 0;
      this.fpsTimer = 0;
    }

    // 1. Update entities
    const sortedLayers = Array.from(this.layers.entries()).sort((a, b) => a[0] - b[0]);
    for (const [, entity] of sortedLayers) {
      if (entity && typeof entity.update === 'function') {
        entity.update(deltaTime, timestamp);
      }
    }

    // 2. Clear buffer & screen
    this.buffer.clear(' ', null);

    // Deep retro terminal black clear
    this.ctx.fillStyle = '#05050a';
    this.ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);

    // 3. Render entities into buffer by layer
    for (const [, entity] of sortedLayers) {
      if (entity && entity.visible !== false && typeof entity.render === 'function') {
        entity.render(this.buffer);
      }
    }

    // 4. Flush character buffer to canvas
    this.ctx.font = `${this.fontSize}px ${this.fontFamily}`;
    this.ctx.textBaseline = 'alphabetic';
    this.buffer.renderToCanvas(this.ctx, this.cellWidth, this.cellHeight);

    this.animationFrameId = requestAnimationFrame(this.#loop);
  }

  /**
   * Helper to get current grid dimensions.
   */
  getGridDimensions() {
    return { cols: this.cols, rows: this.rows };
  }
}
