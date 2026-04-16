// Renderer.ts - Canvas 2D渲染器，DPR适配

export class Renderer {
  readonly canvas: HTMLCanvasElement;
  readonly ctx: CanvasRenderingContext2D;
  readonly dpr: number;
  private _width = 0;
  private _height = 0;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    const ctx = canvas.getContext('2d', { alpha: false })!;
    this.ctx = ctx;
    this.dpr = Math.min(window.devicePixelRatio || 1, 2);
    this.resize();
  }

  get width(): number { return this._width; }
  get height(): number { return this._height; }

  resize(w?: number, h?: number): void {
    this._width = w ?? window.innerWidth;
    this._height = h ?? window.innerHeight;
    this.canvas.width = Math.round(this._width * this.dpr);
    this.canvas.height = Math.round(this._height * this.dpr);
    // CSS由index.html控制(width:100%;height:100%)，不在这里覆盖
    this.ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
    this.ctx.imageSmoothingEnabled = false;
  }

  clear(): void {
    this.ctx.clearRect(0, 0, this._width, this._height);
  }

  fill(color: string): void {
    this.ctx.fillStyle = color;
    this.ctx.fillRect(0, 0, this._width, this._height);
  }
}
