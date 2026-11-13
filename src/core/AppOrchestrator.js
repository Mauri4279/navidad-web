/**
 * @file AppOrchestrator.js
 * @description High-level orchestrator coordinating views, TimeGate state transitions,
 * and debug overrides. Adheres to Dependency Inversion Principle (DIP).
 */

import { TimeGateState } from './TimeGateController.js';

export class AppOrchestrator {
  /**
   * @param {Object} dependencies
   * @param {import('./TimeGateController.js').TimeGateController} dependencies.timeGate
   * @param {import('./AsciiRenderEngine.js').AsciiRenderEngine} dependencies.engine
   * @param {import('../components/SnowSystem.js').SnowSystem} dependencies.snow
   * @param {import('../components/CountdownView.js').CountdownView} dependencies.countdownView
   * @param {import('../components/ChristmasTreeView.js').ChristmasTreeView} dependencies.treeView
   */
  constructor({ timeGate, engine, snow, countdownView, treeView }) {
    if (!timeGate || !engine || !snow || !countdownView || !treeView) {
      throw new Error('[AppOrchestrator] Missing required dependencies.');
    }

    this.timeGate = timeGate;
    this.engine = engine;
    this.snow = snow;
    this.countdownView = countdownView;
    this.treeView = treeView;

    this.currentView = null;
    this.unsubscribeTimeGate = null;
  }

  /**
   * Initializes the application, registers layers and binds state listeners.
   * @param {HTMLCanvasElement} canvas
   */
  init(canvas) {
    this.engine.init(canvas);

    // Layer 0: Always active background snow
    this.engine.setLayer(0, this.snow);

    // Subscribe to TimeGate state changes
    this.unsubscribeTimeGate = this.timeGate.subscribe(this.#handleStateChange.bind(this));

    // Register TimeGate update tick in engine Layer 10 (invisible utility)
    this.engine.setLayer(10, {
      update: (dt) => this.timeGate.update(dt),
      render: () => {},
    });

    // Set initial view according to current state
    const initialState = this.timeGate.getState();
    this.#applyState(initialState);

    // Expose global debug controls for console inspection
    this.#exposeGlobalDebugControls();

    // Start engine animation loop
    this.engine.start();
  }

  /**
   * Switches active view based on state.
   * @param {string} state - 'LOCKED' | 'UNLOCKED'
   * @private
   */
  #applyState(state) {
    const nextView = state === TimeGateState.UNLOCKED ? this.treeView : this.countdownView;

    if (this.currentView !== nextView) {
      if (this.currentView && typeof this.currentView.onExit === 'function') {
        this.currentView.onExit();
      }

      this.currentView = nextView;

      if (this.currentView && typeof this.currentView.onEnter === 'function') {
        this.currentView.onEnter();
      }

      // Layer 2 is the primary scene layer
      this.engine.setLayer(2, this.currentView);
    }
  }

  /**
   * Observer handler triggered when TimeGate transitions.
   * @param {{ currentState: string, oldState: string }} transition
   * @private
   */
  #handleStateChange({ currentState }) {
    this.#applyState(currentState);
  }

  /**
   * Exposes methods on window for console auditing and UI buttons.
   * @private
   */
  #exposeGlobalDebugControls() {
    if (typeof window === 'undefined') return;

    window.timeGate = this.timeGate;
    window.renderEngine = this.engine;

    // Easy helper to force Christmas mode
    window.forceChristmasMode = () => {
      this.timeGate.setDebugOverride(TimeGateState.UNLOCKED);
      console.log('🎄 [Debug] Modo Navidad (UNLOCKED) forzado exitosamente.');
    };

    // Easy helper to force Countdown mode
    window.forceCountdownMode = () => {
      this.timeGate.setDebugOverride(TimeGateState.LOCKED);
      console.log('⏳ [Debug] Modo Cuenta Regresiva (LOCKED) forzado exitosamente.');
    };

    // Reset to system date
    window.resetAutomaticMode = () => {
      this.timeGate.setDebugOverride(null);
      console.log('⏱️ [Debug] Modo Automático restablecido según la fecha del sistema.');
    };

    // Toggle between states
    window.toggleMode = () => {
      const current = this.timeGate.getState();
      if (current === TimeGateState.UNLOCKED) {
        window.forceCountdownMode();
      } else {
        window.forceChristmasMode();
      }
    };
  }

  /**
   * Destroys listeners and stops engine.
   */
  destroy() {
    if (this.unsubscribeTimeGate) {
      this.unsubscribeTimeGate();
    }
    this.engine.stop();
  }
}
