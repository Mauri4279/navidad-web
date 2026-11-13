/**
 * @file TimeGateController.js
 * @description Singleton TimeGate controller managing Christmas lock/unlock state and real-time countdown.
 */

export const TimeGateState = Object.freeze({
  LOCKED: 'LOCKED',
  UNLOCKED: 'UNLOCKED',
});

export class TimeGateController {
  static #instance = null;

  /**
   * Private constructor implementing the Singleton pattern.
   */
  constructor() {
    if (TimeGateController.#instance) {
      throw new Error('TimeGateController is a Singleton. Use TimeGateController.getInstance().');
    }

    this.debugOverride = null; // null | 'LOCKED' | 'UNLOCKED'
    this.subscribers = new Set();
    this.lastState = null;

    this.#initUrlDebugParameters();
    this.lastState = this.getState();
  }

  /**
   * Retrieves the singleton instance.
   * @returns {TimeGateController}
   */
  static getInstance() {
    if (!TimeGateController.#instance) {
      TimeGateController.#instance = new TimeGateController();
    }
    return TimeGateController.#instance;
  }

  /**
   * Inspects URL query params for debug override flags (?debug=christmas or ?state=unlocked).
   * @private
   */
  #initUrlDebugParameters() {
    if (typeof window === 'undefined' || !window.location) return;

    try {
      const params = new URLSearchParams(window.location.search);
      if (params.get('debug') === 'christmas' || params.get('state') === 'unlocked') {
        this.debugOverride = TimeGateState.UNLOCKED;
        console.info('[TimeGateController] Debug Christmas mode activated via URL parameter.');
      } else if (params.get('state') === 'locked') {
        this.debugOverride = TimeGateState.LOCKED;
        console.info('[TimeGateController] Debug Locked mode activated via URL parameter.');
      }
    } catch (e) {
      console.warn('[TimeGateController] Failed to parse URL search params:', e);
    }
  }

  /**
   * Overrides state for auditing/testing without changing system clock.
   * @param {string|null} state - 'LOCKED' | 'UNLOCKED' | null
   */
  setDebugOverride(state) {
    if (state !== null && state !== TimeGateState.LOCKED && state !== TimeGateState.UNLOCKED) {
      console.error(`Invalid state: ${state}. Expected 'LOCKED', 'UNLOCKED', or null.`);
      return;
    }
    this.debugOverride = state;
    this.#checkStateChange();
  }

  /**
   * Determines the current state based on system time and debug overrides.
   * - UNLOCKED: Dec 25 00:00:00 through Jan 1 23:59:59.
   * - LOCKED: Jan 2 00:00:00 through Dec 24 23:59:59.
   * @param {Date} [currentDate=new Date()]
   * @returns {string} 'LOCKED' | 'UNLOCKED'
   */
  getState(currentDate = new Date()) {
    if (this.debugOverride !== null) {
      return this.debugOverride;
    }

    const month = currentDate.getMonth(); // 0-indexed: 0 = Jan, 11 = Dec
    const day = currentDate.getDate();

    // Dec 25 - Dec 31
    if (month === 11 && day >= 25) {
      return TimeGateState.UNLOCKED;
    }

    // Jan 1
    if (month === 0 && day === 1) {
      return TimeGateState.UNLOCKED;
    }

    // Jan 2 - Dec 24
    return TimeGateState.LOCKED;
  }

  /**
   * Calculates the target date for countdown.
   * If LOCKED: targets the upcoming Dec 25 at 00:00:00.
   * If UNLOCKED: targets the end of the holiday season (Jan 2 at 00:00:00).
   * @param {Date} [currentDate=new Date()]
   * @returns {Date}
   */
  getTargetDate(currentDate = new Date()) {
    const year = currentDate.getFullYear();
    const state = this.getState(currentDate);

    if (state === TimeGateState.UNLOCKED) {
      // Targets Jan 2 at 00:00:00
      const targetYear = currentDate.getMonth() === 11 ? year + 1 : year;
      return new Date(targetYear, 0, 2, 0, 0, 0, 0);
    } else {
      // Targets Dec 25 at 00:00:00 of the current year
      return new Date(year, 11, 25, 0, 0, 0, 0);
    }
  }

  /**
   * Returns complete countdown metrics down to the millisecond.
   * @param {Date} [currentDate=new Date()]
   * @returns {{
   *   state: string,
   *   targetDate: Date,
   *   days: number,
   *   hours: number,
   *   minutes: number,
   *   seconds: number,
   *   totalMs: number,
   *   isOverridden: boolean
   * }}
   */
  getCountdown(currentDate = new Date()) {
    const state = this.getState(currentDate);
    const targetDate = this.getTargetDate(currentDate);
    const diff = Math.max(0, targetDate.getTime() - currentDate.getTime());

    const seconds = Math.floor((diff / 1000) % 60);
    const minutes = Math.floor((diff / (1000 * 60)) % 60);
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    return {
      state,
      targetDate,
      days,
      hours,
      minutes,
      seconds,
      totalMs: diff,
      isOverridden: this.debugOverride !== null,
    };
  }

  /**
   * Subscribes a listener to state transition notifications.
   * @param {Function} callback
   * @returns {Function} Unsubscribe callback.
   */
  subscribe(callback) {
    this.subscribers.add(callback);
    return () => this.subscribers.delete(callback);
  }

  /**
   * Checks if state has transitioned and notifies listeners.
   * @param {Date} [currentDate=new Date()]
   * @private
   */
  #checkStateChange(currentDate = new Date()) {
    const currentState = this.getState(currentDate);
    if (currentState !== this.lastState) {
      const oldState = this.lastState;
      this.lastState = currentState;
      const info = this.getCountdown(currentDate);
      this.subscribers.forEach((cb) => {
        try {
          cb({ currentState, oldState, ...info });
        } catch (err) {
          console.error('[TimeGateController] Error in subscriber callback:', err);
        }
      });
    }
  }

  /**
   * Periodic tick hook (called by engine or timer) to check transitions.
   * @param {number} deltaTime
   */
  update(deltaTime) {
    this.#checkStateChange();
  }
}
