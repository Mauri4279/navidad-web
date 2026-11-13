/**
 * @file ChristmasTreeView.js
 * @description View 2: Volumetric 3D rotating ASCII Christmas Tree with ornaments, glowing garlands,
 * apex star with radiant light rays, perspective ground reflection, and stylized top banner.
 * Extends SceneView (Liskov Substitution Principle).
 */

import { SceneView } from '../core/Interfaces.js';
import { Math3D } from '../utils/Math3D.js';
import { AsciiBanner } from './AsciiBanner.js';

export class ChristmasTreeView extends SceneView {
  constructor() {
    super();
    this.time = 0;
    this.rotationAngle = 0;
    this.rotationSpeed = 0.55; // Radians per second

    // 3D Geometry specifications
    this.treeHeight = 50;
    this.baseRadius = 15;
    this.cameraDistance = 40;
    this.fov = 48;

    // Components
    this.banner = new AsciiBanner();

    // Geometric Point Clouds
    this.foliagePoints = [];
    this.ornamentPoints = [];
    this.garlandPoints = [];
    this.starPoints = [];
    this.groundPoints = [];

    this.#initGeometry();
  }

  /**
   * Generates mathematical 3D point cloud for tree, ornaments, garlands, star, and ground.
   * @private
   */
  #initGeometry() {
    this.#generateFoliage();
    this.#generateOrnaments();
    this.#generateGarlands();
    this.#generateStar();
    this.#generateGround();
  }

  /**
   * Generates volumetric cone foliage with branch tiers.
   * @private
   */
  #generateFoliage() {
    this.foliagePoints = [];
    const totalPoints = 1800;
    const tiers = 7;

    for (let i = 0; i < totalPoints; i++) {
      // Height from 0 (base) to treeHeight (apex)
      // Slight bias toward base for lush appearance
      const hNorm = Math.pow(Math.random(), 0.85);
      const y = hNorm * this.treeHeight;

      // Base radius decreases toward apex, with slight tier bulging
      const maxRadiusAtY = this.baseRadius * (1 - y / this.treeHeight);
      const tierBulge = 1 + 0.18 * Math.sin((y / this.treeHeight) * tiers * Math.PI * 2);

      // Volume distribution: denser on surface, but with interior depth
      const radiusFactor = 0.4 + 0.6 * Math.sqrt(Math.random());
      const r = maxRadiusAtY * tierBulge * radiusFactor;

      const angle = Math.random() * Math.PI * 2;
      const x = Math.cos(angle) * r;
      const z = Math.sin(angle) * r;

      // Density characters and color grading
      const chars = ['#', '%', '@', '*', '+', '=', '-', '.'];
      const densityChar = chars[Math.floor(Math.random() * chars.length)];

      this.foliagePoints.push({
        x,
        y: y - this.treeHeight * 0.45, // Center vertically
        z,
        origR: r,
        char: densityChar,
      });
    }
  }

  /**
   * Generates spherical red baubles on the tree mantle.
   * @private
   */
  #generateOrnaments() {
    this.ornamentPoints = [];
    const count = 75;

    for (let i = 0; i < count; i++) {
      // Evenly distribute heights along the tree
      const hNorm = 0.08 + (i / count) * 0.82;
      const y = hNorm * this.treeHeight;
      const maxR = this.baseRadius * (1 - y / this.treeHeight);

      // Position right on the outer surface so they shine
      const r = maxR * 0.98;
      // Golden ratio angle distribution for organic dispersion
      const angle = i * 2.39996;

      const x = Math.cos(angle) * r;
      const z = Math.sin(angle) * r;

      const ornamentChars = ['O', '@', '0', '8'];
      const char = ornamentChars[i % ornamentChars.length];

      this.ornamentPoints.push({
        x,
        y: y - this.treeHeight * 0.45,
        z,
        char,
        color: i % 5 === 0 ? '#ff3366' : '#ef4444',
        glow: '#f87171',
      });
    }
  }

  /**
   * Generates dual-spiral golden/yellow garlands.
   * @private
   */
  #generateGarlands() {
    this.garlandPoints = [];
    const pointsPerSpiral = 180;
    const spirals = 2;

    for (let s = 0; s < spirals; s++) {
      const phase = s * Math.PI;

      for (let i = 0; i < pointsPerSpiral; i++) {
        const hNorm = i / pointsPerSpiral;
        const y = hNorm * (this.treeHeight * 0.92);
        const r = this.baseRadius * (1 - y / this.treeHeight) * 1.02;

        const angle = hNorm * Math.PI * 8 + phase;
        const x = Math.cos(angle) * r;
        const z = Math.sin(angle) * r;

        this.garlandPoints.push({
          x,
          y: y - this.treeHeight * 0.45,
          z,
          char: i % 3 === 0 ? '*' : (i % 3 === 1 ? 'o' : '+'),
          phase: Math.random() * Math.PI * 2,
        });
      }
    }
  }

  /**
   * Generates apex glowing star with ASCII light rays.
   * @private
   */
  #generateStar() {
    this.starPoints = [];
    const apexY = this.treeHeight * 0.55;

    // Radiant Light Rays radiating from apex
    const rays = [
      // Top vertical ray
      { dx: 0, dy: 3.5, dz: 0, char: '|' },
      { dx: 0, dy: 2.5, dz: 0, char: '|' },
      { dx: 0, dy: 1.5, dz: 0, char: '|' },
      // Top diagonal rays
      { dx: -2.0, dy: 2.8, dz: 0, char: '\\' },
      { dx: -1.0, dy: 1.8, dz: 0, char: '\\' },
      { dx: 2.0, dy: 2.8, dz: 0, char: '/' },
      { dx: 1.0, dy: 1.8, dz: 0, char: '/' },
      // Horizontal rays
      { dx: -3.0, dy: 0.2, dz: 0, char: '-' },
      { dx: -2.0, dy: 0.2, dz: 0, char: '-' },
      { dx: -1.0, dy: 0.2, dz: 0, char: '-' },
      { dx: 1.0, dy: 0.2, dz: 0, char: '-' },
      { dx: 2.0, dy: 0.2, dz: 0, char: '-' },
      { dx: 3.0, dy: 0.2, dz: 0, char: '-' },
    ];

    // Star Core cluster (tiered luminous star like reference image)
    const core = [
      { dx: 0, dy: 0.8, dz: 0, char: '#' },
      { dx: -0.6, dy: 0.4, dz: 0, char: '*' },
      { dx: 0, dy: 0.4, dz: 0, char: '#' },
      { dx: 0.6, dy: 0.4, dz: 0, char: '*' },
      { dx: -1.0, dy: 0.0, dz: 0, char: '#' },
      { dx: -0.5, dy: 0.0, dz: 0, char: '#' },
      { dx: 0, dy: 0.0, dz: 0, char: '*' },
      { dx: 0.5, dy: 0.0, dz: 0, char: '#' },
      { dx: 1.0, dy: 0.0, dz: 0, char: '#' },
      { dx: -0.6, dy: -0.4, dz: 0, char: '*' },
      { dx: 0, dy: -0.4, dz: 0, char: '#' },
      { dx: 0.6, dy: -0.4, dz: 0, char: '*' },
    ];

    for (const p of rays) {
      this.starPoints.push({
        x: p.dx,
        y: apexY + p.dy,
        z: p.dz,
        char: p.char,
        isRay: true,
      });
    }

    for (const p of core) {
      this.starPoints.push({
        x: p.dx,
        y: apexY + p.dy,
        z: p.dz,
        char: p.char,
        isRay: false,
      });
    }
  }

  /**
   * Generates concentric perspective ground reflection discs.
   * @private
   */
  #generateGround() {
    this.groundPoints = [];
    const groundY = -this.treeHeight * 0.48;
    const rings = 12;
    const maxGroundRadius = this.baseRadius * 1.75;

    for (let r = 1; r <= rings; r++) {
      const radius = (r / rings) * maxGroundRadius;
      const pointsInRing = Math.floor(20 + r * 8);

      for (let p = 0; p < pointsInRing; p++) {
        const angle = (p / pointsInRing) * Math.PI * 2;
        const x = Math.cos(angle) * radius;
        const z = Math.sin(angle) * radius;

        // Choose character based on distance from center
        let char = '.';
        if (r < 4) char = '=';
        else if (r < 7) char = '-';
        else if (r < 10) char = ':';

        this.groundPoints.push({
          x,
          y: groundY,
          z,
          char,
          radiusNorm: r / rings,
        });
      }
    }
  }

  /**
   * Updates rotation and dynamic elements.
   * @param {number} deltaTime
   * @param {number} timestamp
   */
  update(deltaTime, timestamp) {
    this.time += deltaTime;
    this.rotationAngle += this.rotationSpeed * deltaTime;
    this.banner.update(deltaTime);
  }

  /**
   * Renders the complete 3D scene (ground, tree, ornaments, lights, star, banner) into buffer.
   * @param {import('../core/AsciiBuffer.js').AsciiBuffer} buffer
   */
  render(buffer) {
    const cols = buffer.cols;
    const rows = buffer.rows;
    const centerX = cols * 0.5;
    const centerY = rows * 0.60;

    // 1. Render Top Banner
    this.banner.render(buffer);

    // 2. Render Ground Reflection / Snow Base (Perspective Rings)
    for (let i = 0; i < this.groundPoints.length; i++) {
      const pt = this.groundPoints[i];
      const proj = Math3D.project(pt, this.cameraDistance, this.fov, centerX, centerY);

      if (proj) {
        // Ground color gradation from white near tree center to slate gray outward
        let groundColor = '#cbd5e1';
        if (pt.radiusNorm < 0.35) groundColor = '#f8fafc';
        else if (pt.radiusNorm > 0.75) groundColor = '#475569';

        buffer.setCell(proj.screenX, proj.screenY, pt.char, groundColor, proj.zDepth - 5);
      }
    }

    // 3. Render 3D Rotating Foliage
    for (let i = 0; i < this.foliagePoints.length; i++) {
      const pt = this.foliagePoints[i];
      const rot = Math3D.rotateY(pt.x, pt.y, pt.z, this.rotationAngle);
      const proj = Math3D.project(rot, this.cameraDistance, this.fov, centerX, centerY);

      if (proj) {
        // Depth-based color shading: front is brighter, back is darker
        // Depth range is roughly -baseRadius to +baseRadius
        const depthNorm = (rot.z + this.baseRadius) / (this.baseRadius * 2);

        let foliageColor = '#15803d';
        let glowColor = null;

        if (depthNorm > 0.75) {
          foliageColor = '#4ade80'; // Bright front foliage
          glowColor = '#22c55e';
        } else if (depthNorm > 0.5) {
          foliageColor = '#22c55e'; // Mid foliage
        } else if (depthNorm > 0.25) {
          foliageColor = '#16a34a';
        } else {
          foliageColor = '#14532d'; // Deep shadow foliage in back
        }

        buffer.setCell(proj.screenX, proj.screenY, pt.char, foliageColor, proj.zDepth, glowColor);
      }
    }

    // 4. Render Golden / Yellow Garlands
    for (let i = 0; i < this.garlandPoints.length; i++) {
      const pt = this.garlandPoints[i];
      const rot = Math3D.rotateY(pt.x, pt.y, pt.z, this.rotationAngle);
      const proj = Math3D.project(rot, this.cameraDistance, this.fov, centerX, centerY);

      if (proj) {
        // Twinkling animation
        const twinkle = Math.sin(this.time * 6 + pt.phase);
        const goldColor = twinkle > 0.2 ? '#fef08a' : '#fbbf24';
        const glowColor = twinkle > 0 ? '#ffd700' : null;

        buffer.setCell(proj.screenX, proj.screenY, pt.char, goldColor, proj.zDepth + 0.5, glowColor);
      }
    }

    // 5. Render Red Ornaments (Baubles)
    for (let i = 0; i < this.ornamentPoints.length; i++) {
      const pt = this.ornamentPoints[i];
      const rot = Math3D.rotateY(pt.x, pt.y, pt.z, this.rotationAngle);
      const proj = Math3D.project(rot, this.cameraDistance, this.fov, centerX, centerY);

      if (proj) {
        buffer.setCell(proj.screenX, proj.screenY, pt.char, pt.color, proj.zDepth + 1.0, pt.glow);
      }
    }

    // 6. Render Apex Star & Light Rays (Fixed facing front or subtly pulsating)
    const starGlowIntensity = Math.sin(this.time * 4) * 0.3 + 0.7;
    const starColor = starGlowIntensity > 0.8 ? '#ffee33' : '#ffd700';

    for (let i = 0; i < this.starPoints.length; i++) {
      const pt = this.starPoints[i];
      // Star rays have slight 3D depth, stays at top
      const rot = Math3D.rotateY(pt.x, pt.y, pt.z, this.rotationAngle * 0.2);
      const proj = Math3D.project(rot, this.cameraDistance, this.fov, centerX, centerY);

      if (proj) {
        const color = pt.isRay ? '#fef08a' : starColor;
        const glow = pt.isRay ? null : '#ffee33';
        buffer.setCell(proj.screenX, proj.screenY, pt.char, color, 30 + (pt.isRay ? 0 : 5), glow);
      }
    }

    // 7. Retro Timer Overlay in top right corner (as seen in reference screenshot: `t 09.67s`)
    const timerStr = `t ${this.time.toFixed(2).padStart(5, '0')}s`;
    buffer.writeString(cols - timerStr.length - 2, 1, timerStr, '#ef4444', 100);
  }
}
