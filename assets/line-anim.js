/**
 * LINE Animation System
 * Cargador lazy de librerías + registro de componentes animados.
 * Nada se carga hasta que la sección entra en el viewport.
 */

(function () {
  'use strict';

  const BASE = window.Shopify?.routes?.root || '/';

  // --- Cargador perezoso de librerías ---

  const _loaded = {};
  const _pending = {};

  function libUrl(name) {
    const map = {
      three: `${BASE}cdn/shop/t/1/assets/three.min.js`,
      gsap: `${BASE}cdn/shop/t/1/assets/gsap.min.js`,
      ScrollTrigger: `${BASE}cdn/shop/t/1/assets/ScrollTrigger.min.js`,
    };
    // Shopify sirve assets via CDN; en dev la URL es relativa al tema
    return `${window.location.origin}/cdn/shop/t/1/assets/${name.replace('ScrollTrigger', 'ScrollTrigger.min').replace('three', 'three.min').replace('gsap', 'gsap.min')}.js`;
  }

  window.LINE = window.LINE || {};

  /**
   * Inyecta un script solo una vez. Devuelve Promise.
   * loadLib('three') | loadLib('gsap') | loadLib('ScrollTrigger')
   */
  window.LINE.loadLib = function (name) {
    if (_loaded[name]) return Promise.resolve();
    if (_pending[name]) return _pending[name];

    _pending[name] = new Promise((resolve, reject) => {
      const script = document.createElement('script');
      // Shopify assets URL real — se reemplaza en build/theme push
      script.src = `{{ 'three.min.js' | asset_url }}`.includes('asset_url')
        ? `/cdn/shop/t/1/assets/${name.endsWith('.min') ? name : name + '.min'}.js`
        : '';

      // Fallback: construir URL a partir del primer <script> del tema
      const themeAssets = (() => {
        const s = document.querySelector('script[src*="/assets/line-anim"]');
        return s ? s.src.replace(/line-anim\.js.*$/, '') : '/cdn/shop/t/1/assets/';
      })();
      script.src = themeAssets + (name === 'ScrollTrigger' ? 'ScrollTrigger.min.js' : name + '.min.js');

      script.defer = true;
      script.onload = () => { _loaded[name] = true; resolve(); };
      script.onerror = () => reject(new Error(`LINE: no se pudo cargar ${name}`));
      document.head.appendChild(script);
    });

    return _pending[name];
  };

  // --- Registro de componentes de animación ---

  const _registry = [];

  /**
   * Registra un componente de animación.
   * @param {string|Element} selector  - CSS selector o elemento DOM
   * @param {Function} initFn          - función de inicialización; recibe el elemento
   * @param {string[]} [libs]          - librerías a cargar antes de init (ej. ['gsap','ScrollTrigger'])
   * @param {string} [rootMargin]      - margen del IntersectionObserver (default '200px')
   */
  window.LINE.registerAnim = function (selector, initFn, libs = [], rootMargin = '200px') {
    _registry.push({ selector, initFn, libs, rootMargin });
  };

  function shouldSkip3D() {
    const mobile = window.matchMedia('(max-width: 768px)').matches;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    return mobile || reduced;
  }

  function initRegistry() {
    _registry.forEach(({ selector, initFn, libs, rootMargin }) => {
      const elements = typeof selector === 'string'
        ? document.querySelectorAll(selector)
        : [selector];

      elements.forEach((el) => {
        if (!el) return;

        const needs3D = libs.includes('three');
        if (needs3D && shouldSkip3D()) {
          el.classList.add('line-anim--fallback');
          return;
        }

        const observer = new IntersectionObserver(
          (entries, obs) => {
            entries.forEach((entry) => {
              if (!entry.isIntersecting) return;
              obs.unobserve(entry.target);
              Promise.all(libs.map(window.LINE.loadLib))
                .then(() => initFn(entry.target))
                .catch((err) => console.warn('LINE anim init error:', err));
            });
          },
          { rootMargin }
        );

        observer.observe(el);
      });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initRegistry);
  } else {
    initRegistry();
  }
})();
