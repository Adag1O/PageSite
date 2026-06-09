/**
 * FramePlayer – Agente de animación de fotogramas por scroll.
 *
 * Renderiza secuencias de imágenes sobre un <canvas> usando requestAnimationFrame,
 * lo que elimina el re-flujo del DOM y garantiza una animación fluida.
 *
 * Estrategia de carga:
 *  - Los primeros 10 fotogramas se marcan como de alta prioridad.
 *  - `onReady` se dispara cuando se ha cargado `readyThreshold` fracción del total.
 *  - `onProgress` reporta el porcentaje global para mostrar en la barra de carga.
 */

export interface FramePlayerOptions {
  /** Índice del último fotograma (0-based). */
  totalFrames: number;
  /** Función que devuelve la URL de cada fotograma dado su índice. */
  framePathFn: (index: number) => string;
  /** Callback con la fracción (0–1) de fotogramas cargados. */
  onProgress?: (fraction: number) => void;
  /** Callback que se dispara cuando hay suficientes fotogramas para empezar. */
  onReady?: () => void;
  /** Fracción mínima de fotogramas cargados para disparar onReady (default 0.12). */
  readyThreshold?: number;
}

export class FramePlayer {
  private ctx: CanvasRenderingContext2D;
  private frames: (HTMLImageElement | null)[];
  private loadedCount = 0;
  private currentFrame = -1;
  private pendingFrame = 0;
  private rafId: number | null = null;
  private ready = false;

  constructor(
    private readonly canvas: HTMLCanvasElement,
    private readonly opts: FramePlayerOptions,
  ) {
    this.ctx    = canvas.getContext('2d')!;
    this.frames = new Array(opts.totalFrames + 1).fill(null);
  }

  /** Inicializa el tamaño del canvas y arranca la precarga de fotogramas. */
  init() {
    this.resize();
    window.addEventListener('resize', () => this.resize(), { passive: true });
    this.preload();
  }

  /**
   * Mueve la reproducción al punto correspondiente al progreso dado (0–1).
   * Usa requestAnimationFrame para no dibujar más de una vez por ciclo de pintura.
   */
  seekToProgress(progress: number) {
    const frame = Math.min(
      Math.floor(progress * this.opts.totalFrames),
      this.opts.totalFrames,
    );
    this.pendingFrame = frame;
    if (this.rafId !== null) return; // ya hay un frame programado
    this.rafId = requestAnimationFrame(() => {
      this.rafId = null;
      if (this.currentFrame !== this.pendingFrame) {
        this.currentFrame = this.pendingFrame;
        this.draw(this.currentFrame);
      }
    });
  }

  // ── Privados ───────────────────────────────────────────────────────────────

  private resize() {
    this.canvas.width  = window.innerWidth;
    this.canvas.height = window.innerHeight;
    // Redibujar fotograma actual tras el resize
    if (this.currentFrame >= 0) this.draw(this.currentFrame);
  }

  private preload() {
    const { totalFrames, framePathFn, readyThreshold = 0.12, onProgress, onReady } = this.opts;
    const readyAt = Math.max(1, Math.ceil((totalFrames + 1) * readyThreshold));

    for (let i = 0; i <= totalFrames; i++) {
      const img    = new Image();
      img.decoding = 'async'; // decodificación no bloqueante

      // Prioridad alta para los primeros fotogramas (visible inmediatamente)
      if (i < 12) (img as any).fetchpriority = 'high';

      img.src = framePathFn(i);

      img.onload = () => {
        this.frames[i] = img;
        this.loadedCount++;
        onProgress?.(this.loadedCount / (totalFrames + 1));

        // Mostrar el primer fotograma en cuanto esté disponible
        if (i === 0) {
          this.currentFrame = 0;
          this.draw(0);
        }

        // Disparar onReady cuando se alcanza el umbral
        if (!this.ready && this.loadedCount >= readyAt) {
          this.ready = true;
          onReady?.();
        }
      };
    }
  }

  private draw(frame: number) {
    const img = this.frames[frame];
    if (!img?.complete || img.naturalWidth === 0) return;
    this.ctx.drawImage(img, 0, 0, this.canvas.width, this.canvas.height);
  }
}
