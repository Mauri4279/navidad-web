/**
 * @file main.js
 * @description Entry point for the 100% ASCII Art Christmas interactive web application.
 * Instantiates Singletons, wires dependencies via AppOrchestrator and manages background audio.
 */

import { TimeGateController } from './core/TimeGateController.js';
import { AsciiRenderEngine } from './core/AsciiRenderEngine.js';
import { AudioController } from './core/AudioController.js';
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
  const audio = AudioController.getInstance();
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
    audio,
  });

  orchestrator.init(canvas);

  console.info(
    '%c🎄 ASCII Art Christmas Engine Initialized!',
    'color: #22c55e; font-size: 16px; font-weight: bold;'
  );
  console.info(
    '%cComandos de consola disponibles:\n' +
    '  - window.forceChristmasMode() : Muestra el árbol 3D, banner y activa la música de fondo\n' +
    '  - window.forceCountdownMode() : Muestra la cuenta regresiva y pausa la música\n' +
    '  - window.resetAutomaticMode() : Vuelve al tiempo del sistema\n' +
    '  - window.toggleAudio()        : Alterna pausa/reproducción de música\n' +
    '  - URL Param: ?debug=christmas o ?state=unlocked',
    'color: #38bdf8; font-size: 12px;'
  );
});
