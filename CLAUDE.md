# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Proyecto

Tema Shopify OS 2.0 personalizado para **Line Commercial** — tienda de bienestar premium. Stack: Liquid, CSS nativo con custom properties, JavaScript vanilla/ES modules, Three.js (partículas/3D) y GSAP + ScrollTrigger (animaciones de scroll).

---

## REGLAS DURAS — cumplimiento obligatorio

| # | Regla |
|---|---|
| 1 | **NUNCA** ejecutar `shopify theme push --live`, `shopify theme publish` ni ningún comando que publique o afecte el tema live sin autorización explícita del propietario. |
| 2 | Trabajar **siempre** contra el entorno `development` (tema no publicado). |
| 3 | Antes de editar cualquier archivo, correr `shopify theme pull --environment=development` para sincronizar cambios del editor visual y no pisar trabajo. |
| 4 | Correr `shopify theme check` antes de cada `shopify theme push` y corregir todos los errores y warnings antes de continuar. |
| 5 | El tema `production` es **solo lectura**. Ningún agente puede modificarlo directamente. |
| 6 | Nunca hardcodear texto visible al usuario en Liquid — todo va en `{% schema %}` (editable) y referenciado desde `locales/`. |
| 7 | Toda animación 3D/pesada debe cargarse de forma lazy (IntersectionObserver) y desactivarse en móvil (≤768px) y con `prefers-reduced-motion`. |

---

## Comandos

```bash
# Desarrollo local con hot reload
shopify theme dev --environment=development

# Subir cambios al tema de desarrollo
shopify theme push --environment=development

# Bajar cambios desde el editor visual (SIEMPRE antes de editar)
shopify theme pull --environment=development

# Linter oficial — correr antes de cada push
shopify theme check

# Ver temas disponibles
shopify theme list --store=TU-TIENDA.myshopify.com
```

---

## Stack tecnológico

| Capa | Tecnología |
|---|---|
| Templates | Liquid / Online Store 2.0 (JSON templates) |
| Estilos | CSS nativo + custom properties (tokens en `snippets/css-variables.liquid`) |
| Animaciones scroll | GSAP 3 + ScrollTrigger (`assets/gsap.min.js`, `assets/ScrollTrigger.min.js`) |
| 3D / Partículas | Three.js (`assets/three.min.js`) |
| Cargador lazy | `assets/line-anim.js` (IntersectionObserver) |
| Íconos | SVG inline en `snippets/icon-*.liquid` |
| Fuentes | Bricolage Grotesque 800 (títulos) + Hanken Grotesk 400/500/600 (cuerpo) |

---

## Arquitectura

```
Line Commercial/          ← raíz del tema (este directorio)
  assets/
    line-anim.js          ← Cargador lazy + registro de componentes de animación
    line-theme.css        ← Estilos globales
    three.min.js          ← Three.js vendorizado
    gsap.min.js           ← GSAP vendorizado
    ScrollTrigger.min.js  ← GSAP ScrollTrigger vendorizado
  config/
    settings_schema.json  ← Controles globales del editor de temas
    settings_data.json    ← Valores actuales
  layout/
    theme.liquid          ← Root layout: fuentes, variables CSS, scripts globales
  locales/
    es.json               ← Strings en español (idioma principal)
    en.default.json       ← Strings en inglés
  sections/
    header.liquid         ← Nav global fixed, efecto transparente→pastel en scroll
    hero-line.liquid      ← Hero: imagen + partículas 3D + título + CTA + confianza
    categorias.liquid     ← Grid de 6 categorías con entrada GSAP ScrollTrigger
    footer.liquid         ← Footer global
  snippets/
    css-variables.liquid  ← Tokens CSS globales de LINE (colores, tipografía)
    particles-3d.liquid   ← Canvas Three.js reutilizable (parámetros por render)
    icon-*.liquid         ← Iconos SVG inline
  templates/
    index.json            ← Página principal (JSON template OS 2.0)
```

## Convenciones

- **BEM con prefijo de sección**: `.line-hero__title`, `.line-header__nav`, `.line-cat__card`
- **CSS de sección**: dentro de `{% stylesheet %}` en la propia section
- **JS de sección**: en `{% javascript %}` o en `assets/` con `defer`
- **Imágenes**: siempre `image_url` + `image_tag` de Shopify para responsive/lazy automático
- **Texto visible**: siempre `{{ 'clave' | t }}` + definido en `locales/es.json`
- **Schema**: toda section tiene `name`, `settings`, `presets` y `blocks` cuando aplica
