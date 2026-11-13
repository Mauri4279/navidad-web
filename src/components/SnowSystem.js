/**
 * @file SnowSystem.js
 * @description Persistent multi-depth ASCII Art snow particle system with sinusoidal wind drift.
 * Implements AsciiRenderable contract (Single Responsibility & Open/Closed Principles).
 */

import { AsciiRenderable } from '../core/Interfaces.js';

export class SnowSystem extends AsciiRenderable {
  /**
   * @param {number} [particleCount=120] - Total snowflakes in simulation.
   */
  constructor(particleCount = 120) {
    super();
    this.particleCount = particleCount;
    this.particles = [];
    this.time = 0;
    this.zIndex = -100; // Background layer depth

    this.#initParticles();
  }

  /**
   * Initializes snowflakes across 3 distinct depth layers.
   * @private
   */
  #initParticles() {
    this.particles = [];

    // Snowflake character & styling sets per depth tier
    const tiers = [
      // Far tier: subtle, slow, small characters
      {
        chars: ['·', '.', '`'],
        colors: ['#475569', '#64748b'],
        speedRange: [1.2, 2.5],
        amplitudeRange: [0.5, 1.2],
        freqRange: [0.8, 1.5],
        z: -150,
        glow: null,
        weight: 0.5, // 50% of snowflakes
      },
      // Mid tier: medium speed, standard snowflakes
      {
        chars: ['.', '*', '+', ':'],
        colors: ['#94a3b8', '#cbd5e1'],
        speedRange: [2.5, 4.5],
        amplitudeRange: [1.0, 2.2],
        freqRange: [1.2, 2.2],
        z: -100,
        glow: null,
        weight: 0.35, // 35% of snowflakes
      },
      // Near tier: crisp, prominent, slight glow
      {
        chars: ['*', '❄', '+', 'o'],
        colors: ['#f8fafc', '#ffffff'],
        speedRange: [4.5, 7.0],
        amplitudeRange: [1.5, 3.5],
        freqRange: [1.5, 3.0],
        z: -50,
        glow: '#e2e8f0',
        weight: 0.15, // 15% of snowflakes
      },
    ];

    for (let i = 0; i < this.particleCount; i++) {
      // Pick tier based on distribution weights
      const rand = Math.random();
      let tier = tiers[0];
      if (rand > 0.85) {
        tier = tiers[2];
      } else if (rand > 0.5) {
        tier = tiers[1];
      }

      this.particles.push(this.#createParticle(tier, true));
    }
  }

  /**
   * Spawns or resets a particle.
   * @param {Object} tier - Tier configuration.
   * @param {boolean} randomizeY - If true, randomizes Y position across viewport.
   * @private
   */
  #createParticle(tier, randomizeY = false) {
    const char = tier.chars[Math.floor(Math.random() * tier.chars.length)];
    const color = tier.colors[Math.floor(Math.random() * tier.colors.length)];
    const speed = tier.speedRange[0] + Math.random() * (tier.speedRange[1] - tier.speedRange[0]);
    const amplitude = tier.amplitudeRange[0] + Math.random() * (tier.amplitudeRange[1] - tier.amplitudeRange[0]);
    const frequency = tier.freqRange[0] + Math.random() * (tier.freqRange[1] - tier.freqRange[0]);
    const phase = Math.random() * Math.PI * 2;

    return {
      x: Math.random() * 200, // normalized initial X
      y: randomizeY ? Math.random() * 100 : -1,
      speedY: speed,
      amplitude,
      frequency,
      phase,
      char,
      color,
      glow: tier.glow,
      z: tier.z,
      tier,
    };
  }

  /**
   * Updates particle positions with falling physics and sinusoidal horizontal drift.
   * @param {number} deltaTime
   * @param {number} timestamp
   */
  update(deltaTime, timestamp) {
    this.time += deltaTime;

    for (let i = 0; i < this.particles.length; i++) {
      const p = this.particles[i];

      // Vertical fall
      p.y += p.speedY * deltaTime;

      // Reset when particle falls below standard grid height (will be normalized in render)
      if (p.y > 105) {
        p.y = -2;
        p.x = Math.random() * 200;
        p.phase = Math.random() * Math.PI * 2;
      }
    }
  }

  /**
   * Renders snowflakes onto the ASCII buffer.
   * @param {import('../core/AsciiBuffer.js').AsciiBuffer} buffer
   */
  render(buffer) {
    const cols = buffer.cols;
    const rows = buffer.rows;

    for (let i = 0; i < this.particles.length; i++) {
      const p = this.particles[i];

      // Sinusoidal wind sway
      const sway = Math.sin(this.time * p.frequency + p.phase) * p.amplitude;

      // Map normalized coordinates (0..200 for X, 0..100 for Y) into current buffer dimensions
      const screenX = Math.floor(((p.x + sway) % cols + cols) % cols);
      const screenY = Math.floor((p.y / 100) * rows);

      if (screenX >= 0 && screenX < cols && screenY >= 0 && screenY < rows) {
        buffer.setCell(screenX, screenY, p.char, p.color, p.z, p.glow);
      }
    }
  }
}
