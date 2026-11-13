/**
 * @file Interfaces.js
 * @description Core SOLID abstractions and contracts for the ASCII Rendering Engine.
 * Follows Interface Segregation Principle (ISP) and Open/Closed Principle (OCP).
 */

/**
 * Interface contract for entities with time-based updates.
 * @interface
 */
export class Updatable {
  /**
   * Updates state based on elapsed time.
   * @param {number} deltaTime - Time elapsed since last frame in seconds.
   * @param {number} timestamp - Total elapsed time in milliseconds.
   */
  update(deltaTime, timestamp) {
    throw new Error('Method update(deltaTime, timestamp) must be implemented.');
  }
}

/**
 * Interface contract for entities capable of rendering to an AsciiBuffer.
 * @interface
 */
export class Renderable {
  /**
   * Renders entity contents into the character buffer.
   * @param {import('./AsciiBuffer.js').AsciiBuffer} buffer
   */
  render(buffer) {
    throw new Error('Method render(buffer) must be implemented.');
  }
}

/**
 * Interface contract for color-aware entities.
 * @interface
 */
export class Colorizable {
  /**
   * Returns current primary color.
   * @returns {string}
   */
  getColor() {
    throw new Error('Method getColor() must be implemented.');
  }

  /**
   * Sets primary color.
   * @param {string} color
   */
  setColor(color) {
    throw new Error('Method setColor(color) must be implemented.');
  }
}

/**
 * Base abstract class combining Updatable and Renderable contracts.
 * Conforms to Open/Closed Principle (OCP): new visual elements extend AsciiRenderable
 * without requiring modifications to AsciiRenderEngine.
 * @extends Updatable
 * @implements {Renderable}
 */
export class AsciiRenderable extends Updatable {
  constructor() {
    super();
    this.visible = true;
    this.zIndex = 0;
  }

  /**
   * Updates entity physics/animations.
   * @param {number} deltaTime - Seconds since last frame.
   * @param {number} timestamp - Total milliseconds.
   */
  update(deltaTime, timestamp) {
    // Default no-op
  }

  /**
   * Renders entity into buffer.
   * @param {import('./AsciiBuffer.js').AsciiBuffer} buffer
   */
  render(buffer) {
    // Default no-op
  }
}

/**
 * Base contract for interchangeable scene views (Liskov Substitution Principle).
 * CountdownView and ChristmasTreeView both derive from SceneView and can be
 * substituted transparently by the AppOrchestrator.
 * @extends AsciiRenderable
 */
export class SceneView extends AsciiRenderable {
  /**
   * Called when view becomes active.
   */
  onEnter() {}

  /**
   * Called when view is replaced or deactivated.
   */
  onExit() {}
}
