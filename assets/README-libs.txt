LIBRERÍAS VENDORIZADAS — LINE COMMERCIAL THEME
================================================

Estas librerías deben descargarse y colocarse en esta carpeta (assets/).
NO usar CDN externo en producción para no bloquear la carga y evitar fallos
de Content Security Policy de Shopify.

DESCARGAR:

1. Three.js (r167 o latest stable)
   → https://cdn.jsdelivr.net/npm/three@0.167.0/build/three.min.js
   Guardar como: assets/three.min.js

2. GSAP (3.12.x)
   → https://cdn.jsdelivr.net/npm/gsap@3.12.5/dist/gsap.min.js
   Guardar como: assets/gsap.min.js

3. GSAP ScrollTrigger
   → https://cdn.jsdelivr.net/npm/gsap@3.12.5/dist/ScrollTrigger.min.js
   Guardar como: assets/ScrollTrigger.min.js

COMANDO RÁPIDO (PowerShell):
   Invoke-WebRequest -Uri "https://cdn.jsdelivr.net/npm/three@0.167.0/build/three.min.js" -OutFile "three.min.js"
   Invoke-WebRequest -Uri "https://cdn.jsdelivr.net/npm/gsap@3.12.5/dist/gsap.min.js" -OutFile "gsap.min.js"
   Invoke-WebRequest -Uri "https://cdn.jsdelivr.net/npm/gsap@3.12.5/dist/ScrollTrigger.min.js" -OutFile "ScrollTrigger.min.js"

NOTA: Ejecutar estos comandos dentro de la carpeta assets/ del tema.
