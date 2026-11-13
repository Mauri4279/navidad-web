/**
 * @file main.js
 * @description Entry point for the 100% ASCII Art Christmas interactive web application.
 * Instantiates Singletons and wires dependencies via AppOrchestrator.
 */

import { TimeGateController } from './core/TimeGateController.js';
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

  console.info(
    '%c🎄 ASCII Art Christmas Engine Initialized!',
    'color: #22c55e; font-size: 16px; font-weight: bold;'
  );
  console.info(
    '%cComandos de consola disponibles:\n' +
    '  - window.forceChristmasMode() : Muestra el árbol 3D y banner\n' +
    '  - window.forceCountdownMode() : Muestra la cuenta regresiva con reloj de arena\n' +
    '  - window.resetAutomaticMode() : Vuelve al tiempo del sistema\n' +
    '  - URL Param: ?debug=christmas o ?state=unlocked',
    'color: #38bdf8; font-size: 12px;'
  );
});
