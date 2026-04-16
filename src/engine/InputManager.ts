// InputManager.ts - 键盘+鼠标+触摸统一管理

export class InputManager {
  readonly keys = new Set<string>();
  private _tap = false;
  private _tapConsumed = false;

  mouseX = 0;
  mouseY = 0;
  mouseDown = false;
  touchX = 0;
  touchY = 0;
  touching = false;

  private canvas: HTMLCanvasElement;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this._bindKeyboard();
    this._bindMouse();
    this._bindTouch();
  }

  consumeTap(): boolean {
    if (this._tap && !this._tapConsumed) {
      this._tapConsumed = true;
      return true;
    }
    return false;
  }

  getMovementAxis(): { x: number; y: number } {
    let x = 0, y = 0;
    if (this.keys.has('ArrowLeft') || this.keys.has('KeyA')) x -= 1;
    if (this.keys.has('ArrowRight') || this.keys.has('KeyD')) x += 1;
    if (this.keys.has('ArrowUp') || this.keys.has('KeyW')) y -= 1;
    if (this.keys.has('ArrowDown') || this.keys.has('KeyS')) y += 1;
    const len = Math.sqrt(x * x + y * y);
    if (len > 0) { x /= len; y /= len; }
    return { x, y };
  }

  isDown(key: string): boolean {
    return this.keys.has(key);
  }

  private _bindKeyboard(): void {
    window.addEventListener('keydown', (e) => {
      this.keys.add(e.code);
    });
    window.addEventListener('keyup', (e) => {
      this.keys.delete(e.code);
    });
  }

  private _bindMouse(): void {
    this.canvas.addEventListener('mousemove', (e) => {
      const r = this.canvas.getBoundingClientRect();
      this.mouseX = e.clientX - r.left;
      this.mouseY = e.clientY - r.top;
    });
    this.canvas.addEventListener('mousedown', () => {
      this.mouseDown = true;
      this._tap = true;
      this._tapConsumed = false;
    });
    window.addEventListener('mouseup', () => { this.mouseDown = false; });
  }

  private _bindTouch(): void {
    this.canvas.addEventListener('touchstart', (e) => {
      const t = e.touches[0];
      const r = this.canvas.getBoundingClientRect();
      this.touchX = t.clientX - r.left;
      this.touchY = t.clientY - r.top;
      this.touching = true;
      this._tap = true;
      this._tapConsumed = false;
    }, { passive: true });

    this.canvas.addEventListener('touchmove', (e) => {
      const t = e.touches[0];
      const r = this.canvas.getBoundingClientRect();
      this.touchX = t.clientX - r.left;
      this.touchY = t.clientY - r.top;
    }, { passive: true });

    this.canvas.addEventListener('touchend', () => {
      this.touching = false;
    }, { passive: true });
  }
}
