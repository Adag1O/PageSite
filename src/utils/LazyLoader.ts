/**
 * LazyLoader – Skill de carga diferida de imágenes.
 *
 * Usa IntersectionObserver para cargar imágenes sólo cuando están a punto
 * de entrar al viewport, reduciendo el peso inicial de la página.
 *
 * Uso en HTML:
 *   <img data-src="/ruta/imagen.webp" alt="..." class="lazy" />
 *   <source data-srcset="/ruta/imagen.avif" />
 *
 * Uso en script:
 *   import { LazyLoader } from '../utils/LazyLoader';
 *   document.addEventListener('DOMContentLoaded', () => LazyLoader.init());
 *
 * Para imágenes añadidas dinámicamente:
 *   LazyLoader.observe(imgElement);
 */

export class LazyLoader {
  private static observer: IntersectionObserver | null = null;

  /** Inicializa el observer y observa todos los elementos con data-src/data-srcset. */
  static init(selector = 'img[data-src], source[data-srcset]') {
    if (typeof IntersectionObserver === 'undefined') {
      // Fallback: carga inmediata en navegadores sin soporte
      this.applyAll(selector);
      return;
    }

    this.observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          this.load(entry.target as HTMLElement);
          this.observer!.unobserve(entry.target);
        });
      },
      { rootMargin: '300px 0px' }, // pre-cargar 300 px antes de ser visible
    );

    document.querySelectorAll<HTMLElement>(selector).forEach((el) => {
      this.observer!.observe(el);
    });
  }

  /** Observa un elemento individual (útil para imágenes añadidas dinámicamente). */
  static observe(el: HTMLElement) {
    if (!this.observer) this.init();
    this.observer!.observe(el);
  }

  /** Carga todos los elementos de forma inmediata (sin observer). */
  static loadAll(selector = 'img[data-src], source[data-srcset]') {
    this.applyAll(selector);
  }

  // ── Privados ───────────────────────────────────────────────────────────────

  private static load(el: HTMLElement) {
    if (el instanceof HTMLImageElement && el.dataset.src) {
      el.src = el.dataset.src;
      delete el.dataset.src;
      el.classList.add('lazy-loaded');
    } else if (el instanceof HTMLSourceElement && el.dataset.srcset) {
      el.srcset = el.dataset.srcset;
      delete el.dataset.srcset;
    }
  }

  private static applyAll(selector: string) {
    document.querySelectorAll<HTMLElement>(selector).forEach((el) => this.load(el));
  }
}
