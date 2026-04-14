/**
 * Canvas 2D 渲染器
 * 管理画布状态、缩放、后处理管线
 */

export class Renderer {
  readonly ctx: CanvasRenderingContext2D;
  private _width = 0;
  private _height = 0;
  private _scale = 1;

  constructor(canvas: HTMLCanvasElement) {
    const ctx = canvas.getContext('2d', {
      alpha: false,
      desynchronized: true,
    });
    if (!ctx) throw new Error('[Renderer] Cannot get 2D context');
    this.ctx = ctx;
    this._width = canvas.width;
    this._height = canvas.height;
    this._scale = 1;

    // 默认像素风渲染
    this.ctx.imageSmoothingEnabled = false;
  }

  get width(): number { return this._width; }
  get height(): number { return this._height; }
  get scale(): number { return this._scale; }

  resize(w: number, h: number): void {
    this._width = w;
    this._height = h;
    this.ctx.imageSmoothingEnabled = false;
  }

  /** 设置全局缩放 (像素放大) */
  setScale(s: number): void {
    this._scale = s;
  }

  /** 清空画布 */
  clear(): void {
    this.ctx.fillStyle = '#0a0a1a';
    this.ctx.fillRect(0, 0, this._width, this._height);
  }

  /** 绘制像素精灵到指定世界坐标 */
  drawSprite(
    sprite: HTMLCanvasElement | OffscreenCanvas,
    x: number,
    y: number,
  ): void {
    this.ctx.drawImage(sprite, x, y);
  }

  /** 渲染 HUD 层 (屏幕空间) */
  renderHUD(): void {
    // 左上角 FPS / 调试信息
    this.ctx.save();
    this.ctx.resetTransform();
    this.ctx.fillStyle = 'rgba(255,255,255,0.5)';
    this.ctx.font = '12px monospace';
    this.ctx.fillText('B-BABO Survivors v0.1', 8, 20);
    this.ctx.restore();
  }
}
