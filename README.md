# 🎄 ASCII Art Christmas Interactive Experience

Una aplicación web interactiva de Navidad de alto rendimiento renderizada al 100% en **ASCII Art** utilizando Vanilla JavaScript con ES6 Modules y un motor de buffer de caracteres optimizado en HTML5 Canvas a 60 FPS con soporte de paleta retro RGB, brillo CRT (*text-shadow glow*), simulación de viento sinusoidal y proyección volumétrica 3D con Z-Buffer.

---

## 📸 Referencia Visual
Inspirado en estética de terminales retro y demoscene:
- **Árbol de Navidad 3D**: Cono volumétrico con rotación continua en el eje Y.
- **Follaje**: Gradientes de densidad verde (`#`, `%`, `@`, `*`, `+`, `=`, `-`, `.`).
- **Adornos**: Esferas rojas brillantes (`O`, `@`, `0`) que rotan junto a la geometría del cono.
- **Guirnaldas**: Espirales doradas de luz con efecto de parpadeo (`*`, `o`, `+`).
- **Estrella en la Cima**: Núcleo radiante con haces de luz en ASCII (`\`, `|`, `/`, `-`, `*`).
- **Suelo Reflectante**: Anillos concéntricos en perspectiva simulando reflejo de nieve.
- **Banner ASCII**: `"Mauri te desea feliz navidad!!!"` centrado en la parte superior.
- **Sistema de Nieve**: Partículas multi-capa con deriva de viento sinusoidal persistentes en ambas vistas.

---

## 🏛️ Arquitectura de Software & Clean Code

### 1. Patrones de Diseño (Singleton)
- **`TimeGateController` (Singleton):** Única fuente de verdad temporal.
  - **Estado `LOCKED` (Cuenta Regresiva):** Del 2 de enero al 24 de diciembre. Calcula días, horas, minutos y segundos restantes hacia el 25 de diciembre a las 00:00:00.
  - **Estado `UNLOCKED` (Modo Navidad):** Del 25 de diciembre al 1 de enero. Desbloquea automáticamente el árbol de Navidad 3D y el banner.
  - **Observer / Suscripciones:** Emite notificaciones reactivas ante cambios de estado de bloqueo.
- **`AsciiRenderEngine` (Singleton):** Motor central con bucle `requestAnimationFrame`. Administra un `AsciiBuffer` 2D con Z-Buffer de profundidad para oclusión geométrica 3D y renderizado por capas (Fondo -> Suelo -> Escena Principal -> Banner/HUD).

### 2. Principios SOLID Aplicados
- **S (Single Responsibility):** Módulos desacoplados para proyección matemática 3D (`Math3D`), partículas (`SnowSystem`), fuentes FIGlet (`AsciiFont`) y control de tiempo (`TimeGateController`).
- **O (Open/Closed):** Todas las entidades extienden `AsciiRenderable` implementando `update(dt)` y `render(buffer)`. Nuevos efectos pueden añadirse al motor sin alterar su código fuente.
- **L (Liskov Substitution):** Las vistas `CountdownView` y `ChristmasTreeView` extienden `SceneView` y son intercambiables de forma transparente por el orquestador.
- **I (Interface Segregation):** Contratos segregados para actualización (`Updatable`), renderizado (`Renderable`) y vistas con ciclo de vida (`SceneView`).
- **D (Dependency Inversion):** `AppOrchestrator` recibe dependencias inyectadas en su constructor, dependiendo de abstracciones.

---

## 📁 Estructura del Proyecto
```
Navidad web/
├── index.html                      # Documento principal y contenedor CRT
├── package.json                    # Scripts npm y metadatos
├── README.md                       # Documentación completa
├── test-engine.mjs                 # Suite de pruebas unitarias automatizadas
├── src/
│   ├── main.js                     # Punto de entrada de la aplicación
│   ├── core/
│   │   ├── Interfaces.js           # Contratos SOLID (Updatable, Renderable, SceneView)
│   │   ├── AsciiBuffer.js          # Buffer 2D con color, glow y Z-Buffer
│   │   ├── TimeGateController.js   # Singleton de control temporal y cuenta regresiva
│   │   ├── AsciiRenderEngine.js    # Singleton del motor de renderizado y bucle 60 FPS
│   │   └── AppOrchestrator.js      # Orquestador e inyección de dependencias
│   ├── components/
│   │   ├── SnowSystem.js           # Partículas de nieve multi-profundidad
│   │   ├── CountdownView.js        # Vista 1: Reloj gigante ASCII FIGlet y mensaje
│   │   ├── ChristmasTreeView.js    # Vista 2: Árbol 3D, estrella, adornos y suelo
│   │   └── AsciiBanner.js          # Cartel estilizado: Mauri te desea feliz navidad!!!
│   ├── utils/
│   │   ├── AsciiFont.js            # Generador de tipografía ASCII bloque / FIGlet
│   │   └── Math3D.js               # Matemáticas de rotación 3D y proyección en perspectiva
│   └── styles/
│       └── crt.css                 # Estilos monitor CRT retro (scanlines, vignette, HUD)
```

---

## 🚀 Instrucciones para Levantar el Servidor Local

Dado que la aplicación utiliza módulos ES6 nativos (`import`/`export`), debe servirse mediante un servidor HTTP local.

### Opción A: Con Node.js / npx (Recomendado)
```bash
# Iniciar servidor estático en el puerto 3000
npm start
# O directamente:
npx serve . -l 3000
```
Luego abre tu navegador en: [http://localhost:3000](http://localhost:3000)

### Opción B: Con Python
```bash
python -m http.server 3000
```
Luego abre tu navegador en: [http://localhost:3000](http://localhost:3000)

---

## 🔍 Cómo Probar y Auditar el Árbol de Navidad (Modo Debug)

Para verificar y auditar el Árbol 3D rotatorio sin alterar la fecha de tu sistema operativo:

### 1. Vía Barra de Control Retro (HUD en Pantalla):
Haz clic en el botón inferior:
`[ 🎄 Navidad (Debug) ]` para activar el árbol de inmediato, o `[ ⏳ Cuenta Regresiva ]` para volver a la cuenta regresiva.

### 2. Vía Parámetro URL:
Simplemente agrega `?debug=christmas` en la barra de direcciones del navegador:
```
http://localhost:3000/?debug=christmas
```

### 3. Vía Consola del Navegador (DevTools):
Abre la consola con `F12` y ejecuta:
```javascript
window.forceChristmasMode();  // Muestra el árbol 3D y el banner
window.forceCountdownMode();  // Muestra la cuenta regresiva
window.resetAutomaticMode();  // Vuelve a la fecha real del sistema
```

---

## 🧪 Pruebas Unitarias
Para ejecutar la suite de pruebas unitarias (validación de estados del TimeGate, Z-Buffer, proyección 3D y fuentes ASCII):
```bash
npm test
```

---

## 🌿 Flujo de Trabajo Git
- Desarrollado bajo **Git Flow**:
  - `main`: Código en producción con release `v1.0.0`.
  - `develop`: Rama de integración activa.
  - Ramas de funcionalidades: `feature/core-engine`, `feature/snow-system`, `feature/ascii-countdown`, `feature/3d-ascii-tree`, `feature/ui-integration`.
  - Todos los commits siguen el estándar **Conventional Commits** y fusiones `--no-ff`.
