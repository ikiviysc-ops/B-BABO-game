/**
 * 虚拟摇杆 — 手机触摸移动控制
 */

export class VirtualJoystick {
  private _canvas: HTMLCanvasElement;
  private _active = false;
  private _baseX = 0;
  private _baseY = 0;
  private _stickX = 0;
  private _stickY = 0;
  private _dx = 0;
  private _dy = 0;
  private _touchId: number | null = null;
  private _radius = 50;
  private _deadzone = 8;

  constructor(canvas: HTMLCanvasElement) {
    this._canvas = canvas;
    this.bindEvents();
  }

  get active(): boolean { return this._active; }
  get dx(): number { return this._dx; }
  get dy(): number { return this._dy; }

  /** 获取归一化方向 (-1 ~ 1) */
  getAxis(): { x: number; y: number } {
    if (!this._active) return { x: 0, y: 0 };
    const len = Math.sqrt(this._dx * this._dx + this._dy * this._dy);
    if (len < this._deadzone) return { x: 0, y: 0 };
    const clamped = Math.min(len, this._radius);
    return {
      x: (this._dx / len) * (clamped / this._radius),
      y: (this._dy / len) * (clamped / this._radius),
    };
  }

  /** 渲染摇杆（屏幕空间） */
  render(ctx: CanvasRenderingContext2D, dpr: number): void {
    if (!this._active) return;

    // 底座
    ctx.save();
    ctx.resetTransform();
    ctx.globalAlpha = 0.25;
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2 * dpr;
    ctx.beginPath();
    ctx.arc(this._baseX * dpr, this._baseY * dpr, this._radius * dpr, 0, Math.PI * 2);
    ctx.stroke();

    // 摇杆头
    ctx.globalAlpha = 0.4;
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(this._stickX * dpr, this._stickY * dpr, 18 * dpr, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }

  private bindEvents(): void {
    this._canvas.addEventListener('touchstart', (e) => {
      // 只处理左半屏的触摸（右半屏留给升级选择等）
      for (let i = 0; i < e.changedTouches.length; i++) {
        const t = e.changedTouches[i];
        if (t.clientX < window.innerWidth / 2 && this._touchId === null) {
          e.preventDefault();
          this._touchId = t.identifier;
          this._active = true;
          this._baseX = t.clientX;
          this._baseY = t.clientY;
          this._stickX = t.clientX;
          this._stickY = t.clientY;
          this._dx = 0;
          this._dy = 0;
          break;
        }
      }
    }, { passive: false });

    this._canvas.addEventListener('touchmove', (e) => {
      for (let i = 0; i < e.changedTouches.length; i++) {
        const t = e.changedTouches[i];
        if (t.identifier === this._touchId) {
          e.preventDefault();
          this._stickX = t.clientX;
          this._stickY = t.clientY;
          this._dx = t.clientX - this._baseX;
          this._dy = t.clientY - this._baseY;
          break;
        }
      }
    }, { passive: false });

    const endHandler = (e: TouchEvent) => {
      for (let i = 0; i < e.changedTouches.length; i++) {
        if (e.changedTouches[i].identifier === this._touchId) {
          this._active = false;
          this._touchId = null;
          this._dx = 0;
          this._dy = 0;
          break;
        }
      }
    };

    this._canvas.addEventListener('touchend', endHandler);
    this._canvas.addEventListener('touchcancel', endHandler);
  }
}
