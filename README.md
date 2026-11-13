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
- **Banner ASCII**: `"Mauri te desea una feliz navidad!"` centrado sobre la copa del árbol.
- **Música de Fondo Navideña**: Integración con YouTube API (`_P95hlQIMzE`) durante el modo Navidad.
- **Sistema de Nieve**: Partículas multi-capa con deriva de viento sinusoidal persistentes en ambas vistas.
- **100% Responsive**: Ajuste dinámico de tipografía y proyección 3D para celulares, tablets y escritorios.

---

## 🏛️ Arquitectura de Software & Clean Code

### 1. Patrones de Diseño (Singleton)
- **`TimeGateController` (Singleton):** Única fuente de verdad temporal.
  - **Estado `LOCKED` (Cuenta Regresiva):** Del 2 de enero al 24 de diciembre.
  - **Estado `UNLOCKED` (Modo Navidad):** Del 25 de diciembre al 1 de enero. Desbloquea automáticamente el árbol 3D, el banner y la música navideña.
- **`AsciiRenderEngine` (Singleton):** Motor central con bucle `requestAnimationFrame`. Administra un `AsciiBuffer` 2D con Z-Buffer de profundidad para oclusión geométrica 3D.
- **`AudioController` (Singleton):** Control del reproductor de fondo en YouTube.

### 2. Principios SOLID Aplicados
- **S (Single Responsibility):** Módulos desacoplados para proyección matemática 3D (`Math3D`), partículas (`SnowSystem`), tipografía digital (`AsciiFont`) y control de tiempo (`TimeGateController`).
- **O (Open/Closed):** Todas las entidades extienden `AsciiRenderable` implementando `update(dt)` y `render(buffer)`.
- **L (Liskov Substitution):** Las vistas `CountdownView` y `ChristmasTreeView` extienden `SceneView` y son intercambiables por el orquestador.
- **I (Interface Segregation):** Contratos segregados para actualización (`Updatable`), renderizado (`Renderable`) y vistas (`SceneView`).
- **D (Dependency Inversion):** `AppOrchestrator` recibe dependencias inyectadas en su constructor.

---

## 📁 Estructura del Proyecto
```
Navidad web/
├── .github/workflows/deploy.yml    # Workflow de despliegue automático a GitHub Pages
├── .nojekyll                       # Desactiva Jekyll en GitHub Pages para soporte ES Modules
├── index.html                      # Contenedor principal del lienzo y capas CRT
├── package.json                    # Scripts npm y metadatos
├── README.md                       # Documentación completa
├── test-engine.mjs                 # Suite de pruebas unitarias automatizadas
├── src/
│   ├── main.js                     # Inyector de dependencias y bootstrap de la app
│   ├── core/
│   │   ├── Interfaces.js           # Contratos SOLID (Updatable, Renderable, SceneView)
│   │   ├── AsciiBuffer.js          # Buffer matricial 2D con Z-Buffer, color y glow
│   │   ├── TimeGateController.js   # Singleton de control temporal y cuenta regresiva
│   │   ├── AsciiRenderEngine.js    # Singleton del motor de renderizado a 60 FPS
│   │   ├── AudioController.js      # Controlador de música de fondo (YouTube API)
│   │   └── AppOrchestrator.js      # Orquestador desacoplado (DIP) y controlador de escenas
│   ├── components/
│   │   ├── SnowSystem.js           # Partículas de nieve multi-profundidad
│   │   ├── CountdownView.js        # Vista 1: Reloj digital compacto (LOCKED)
│   │   ├── ChristmasTreeView.js    # Vista 2: Árbol 3D rotatorio, estrella, adornos y suelo
│   │   └── AsciiBanner.js          # Cartel estilizado: Mauri te desea una feliz navidad!
│   ├── utils/
│   │   ├── AsciiFont.js            # Generador tipográfico digital ASCII
│   │   └── Math3D.js               # Proyección de perspectiva y rotaciones tridimensionales
│   └── styles/
│       └── crt.css                 # Estilos terminal CRT (scanlines, vignette, 100dvh mobile)
```

---

## 🌐 Despliegue en GitHub Pages

El proyecto está 100% preparado y optimizado para GitHub Pages (rutas relativas `./`, `.nojekyll` y GitHub Action automatizada).

### Pasos para publicar:
1. **Crear el repositorio en GitHub**:
   Crea un nuevo repositorio en [github.com/new](https://github.com/new) (por ejemplo: `navidad-web`).

2. **Vincular y subir los cambios**:
   ```bash
   git remote add origin https://github.com/<TU_USUARIO>/navidad-web.git
   git push -u origin main
   git push origin develop --tags
   ```

3. **Activar GitHub Pages**:
   - Ve a tu repositorio en GitHub $\to$ **Settings** $\to$ **Pages**.
   - En **Build and deployment** $\to$ **Source**:
     - **Opción A (Recomendada con Action)**: Selecciona **GitHub Actions**. El workflow `.github/workflows/deploy.yml` compilará y desplegará la web en segundos de forma automática.
     - **Opción B (Clásica)**: Selecciona **Deploy from a branch** $\to$ rama `main` $\to$ carpeta `/ (root)` $\to$ **Save**.

Tu página estará disponible en: `https://<TU_USUARIO>.github.io/navidad-web/`

---

## 🚀 Servidor Local para Pruebas

```bash
# Con Node.js
npm start

# Con Python
npm run serve:py
```
Abre en tu navegador: [http://localhost:3000](http://localhost:3000)

---

## 🔍 Modo Debug (Auditar Árbol de Inmediato)
Agrega `?debug=christmas` a la URL:
```
http://localhost:3000/?debug=christmas
```
O desde la consola (F12):
```javascript
window.forceChristmasMode();  // Muestra el árbol 3D, banner y reproduce música
window.forceCountdownMode();  // Muestra la cuenta regresiva
window.resetAutomaticMode();  // Vuelve a la fecha real del sistema
window.toggleAudio();         // Alterna pausa/reproducción de música
```
