/**
 * 输入管理器 - 键盘 + 鼠标 + 触摸
 */

export class InputManager {
  private _keys = new Set<string>();
  private _mouseX = 0;
  private _mouseY = 0;
  private _mouseDown = false;
  private _touchActive = false;
  private _touchX = 0;
  private _touchY = 0;
  private _tapFlag = false; // 单次点击标志（触摸切换角色用）
  private _canvas: HTMLCanvasElement;

  constructor(canvas: HTMLCanvasElement) {
    this._canvas = canvas;
    this.bindEvents();
  }

  /** 每帧调用，处理持续输入 */
  update(): void {
    // 预留：可在此处理输入缓冲、连发等
  }

  /** 消费一次 tap 事件（返回 true 后自动重置） */
  consumeTap(): boolean {
    if (this._tapFlag) {
      this._tapFlag = false;
      return true;
    }
    return false;
  }

  get keys(): ReadonlySet<string> { return this._keys; }
  get mouseX(): number { return this._mouseX; }
  get mouseY(): number { return this._mouseY; }
  get mouseDown(): boolean { return this._mouseDown; }
  get touchActive(): boolean { return this._touchActive; }
  get touchX(): number { return this._touchX; }
  get touchY(): number { return this._touchY; }

  isKeyDown(key: string): boolean {
    return this._keys.has(key.toLowerCase());
  }

  /** 获取移动方向向量 (WASD / 方向键) */
  getMovementAxis(): { x: number; y: number } {
    let x = 0, y = 0;
    if (this.isKeyDown('w') || this.isKeyDown('arrowup')) y -= 1;
    if (this.isKeyDown('s') || this.isKeyDown('arrowdown')) y += 1;
    if (this.isKeyDown('a') || this.isKeyDown('arrowleft')) x -= 1;
    if (this.isKeyDown('d') || this.isKeyDown('arrowright')) x += 1;

    // 归一化对角线移动
    if (x !== 0 && y !== 0) {
      const inv = 1 / Math.SQRT2;
      x *= inv;
      y *= inv;
    }
    return { x, y };
  }

  private bindEvents(): void {
    // 键盘
    window.addEventListener('keydown', (e) => {
      this._keys.add(e.key.toLowerCase());
      // 阻止方向键滚动
      if (['arrowup', 'arrowdown', 'arrowleft', 'arrowright', ' '].includes(e.key.toLowerCase())) {
        e.preventDefault();
      }
    });
    window.addEventListener('keyup', (e) => {
      this._keys.delete(e.key.toLowerCase());
    });

    // 鼠标
    this._canvas.addEventListener('mousemove', (e) => {
      const rect = this._canvas.getBoundingClientRect();
      this._mouseX = e.clientX - rect.left;
      this._mouseY = e.clientY - rect.top;
    });
    this._canvas.addEventListener('mousedown', (e) => {
      this._mouseDown = true;
      this._tapFlag = true; // 鼠标点击也视为 tap
      const rect = this._canvas.getBoundingClientRect();
      this._touchX = e.clientX - rect.left;
      this._touchY = e.clientY - rect.top;
    });
    this._canvas.addEventListener('mouseup', () => { this._mouseDown = false; });

    // 触摸
    this._canvas.addEventListener('touchstart', (e) => {
      e.preventDefault();
      this._touchActive = true;
      this._tapFlag = true; // 标记一次 tap
      this.updateTouch(e);
    }, { passive: false });
    this._canvas.addEventListener('touchmove', (e) => {
      e.preventDefault();
      this.updateTouch(e);
    }, { passive: false });
    this._canvas.addEventListener('touchend', () => {
      this._touchActive = false;
    });
  }

  private updateTouch(e: TouchEvent): void {
    if (e.touches.length > 0) {
      const rect = this._canvas.getBoundingClientRect();
      this._touchX = e.touches[0].clientX - rect.left;
      this._touchY = e.touches[0].clientY - rect.top;
    }
  }
}
