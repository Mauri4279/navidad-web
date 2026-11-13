/**
 * @file main.js
 * @description Entry point for the 100% ASCII Art Christmas interactive web application.
 * Instantiates Singletons, wires dependencies via AppOrchestrator, and handles HUD bindings.
 */

import { TimeGateController, TimeGateState } from './core/TimeGateController.js';
import { AsciiRenderEngine } from './core/AsciiRenderEngine.js';
import { SnowSystem } from './components/SnowSystem.js';
import { CountdownView } from './components/CountdownView.js';
import { ChristmasTreeView } from './components/ChristmasTreeView.js';
import { AppOrchestrator } from './core/AppOrchestrator.js';

document.addEventListener('DOMContentLoaded', () => {
  const canvas = document.getElementById('ascii-canvas');
  if (!canvas) {
    console.error('Canvas element #ascii-canvas not found.');
    return;
  }

  // 1. Dependency Resolution & Instantiation (SOLID DIP)
  const timeGate = TimeGateController.getInstance();
  const engine = AsciiRenderEngine.getInstance();
  const snow = new SnowSystem(140);
  const countdownView = new CountdownView(timeGate);
  const treeView = new ChristmasTreeView();

  // 2. High-level Orchestration
  const orchestrator = new AppOrchestrator({
    timeGate,
    engine,
    snow,
    countdownView,
    treeView,
  });

  orchestrator.init(canvas);

  // 3. UI HUD Status & Debug Controls Binding
  const hudStatus = document.getElementById('hud-status');
  const btnForceChristmas = document.getElementById('btn-force-christmas');
  const btnForceCountdown = document.getElementById('btn-force-countdown');
  const btnAutoTime = document.getElementById('btn-auto-time');
  const btnToggleCrt = document.getElementById('btn-toggle-crt');
  const crtScanlines = document.getElementById('crt-scanlines');

  function updateHudBadge(state) {
    if (!hudStatus) return;
    hudStatus.textContent = state;
    if (state === TimeGateState.UNLOCKED) {
      hudStatus.className = 'hud-status-badge unlocked';
    } else {
      hudStatus.className = 'hud-status-badge locked';
    }
  }

  // Initial HUD state
  updateHudBadge(timeGate.getState());

  // Listen to TimeGate transitions to update HUD badge
  timeGate.subscribe(({ currentState }) => {
    updateHudBadge(currentState);
  });

  // Button Listeners
  if (btnForceChristmas) {
    btnForceChristmas.addEventListener('click', () => {
      window.forceChristmasMode();
      btnForceChristmas.classList.add('active');
      btnForceCountdown?.classList.remove('active');
      btnAutoTime?.classList.remove('active');
    });
  }

  if (btnForceCountdown) {
    btnForceCountdown.addEventListener('click', () => {
      window.forceCountdownMode();
      btnForceCountdown.classList.add('active');
      btnForceChristmas?.classList.remove('active');
      btnAutoTime?.classList.remove('active');
    });
  }

  if (btnAutoTime) {
    btnAutoTime.addEventListener('click', () => {
      window.resetAutomaticMode();
      btnAutoTime.classList.add('active');
      btnForceChristmas?.classList.remove('active');
      btnForceCountdown?.classList.remove('active');
    });
  }

  if (btnToggleCrt && crtScanlines) {
    let crtEnabled = true;
    btnToggleCrt.addEventListener('click', () => {
      crtEnabled = !crtEnabled;
      crtScanlines.style.display = crtEnabled ? 'block' : 'none';
      btnToggleCrt.style.opacity = crtEnabled ? '1' : '0.5';
    });
  }

  console.info(
    '%c🎄 ASCII Art Christmas Engine Initialized!',
    'color: #22c55e; font-size: 16px; font-weight: bold;'
  );
  console.info(
    '%cComandos de consola disponibles:\n' +
    '  - window.forceChristmasMode() : Muestra el árbol 3D y banner\n' +
    '  - window.forceCountdownMode() : Muestra la cuenta regresiva\n' +
    '  - window.resetAutomaticMode() : Vuelve al tiempo del sistema\n' +
    '  - URL Param: ?debug=christmas o ?state=unlocked',
    'color: #38bdf8; font-size: 12px;'
  );
});
