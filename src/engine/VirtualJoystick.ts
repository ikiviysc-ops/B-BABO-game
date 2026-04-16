// VirtualJoystick.ts - 虚拟摇杆，只处理左半屏触摸

export class VirtualJoystick {
  private canvas: HTMLCanvasElement;
  private active = false;
  private baseX = 0;
  private baseY = 0;
  private stickX = 0;
  private stickY = 0;
  private touchId: number | null = null;

  private readonly baseRadius = 50;
  private readonly stickRadius = 22;
  private readonly deadzone = 8;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this._bindEvents();
  }

  private _bindEvents(): void {
    this.canvas.addEventListener('touchstart', (e) => {
      for (let i = 0; i < e.changedTouches.length; i++) {
        const t = e.changedTouches[i];
        const r = this.canvas.getBoundingClientRect();
        const x = t.clientX - r.left;
        // 只处理左半屏
        if (x > r.width / 2) continue;
        if (this.touchId !== null) continue;

        this.touchId = t.identifier;
        this.active = true;
        this.baseX = x;
        this.baseY = t.clientY - r.top;
        this.stickX = this.baseX;
        this.stickY = this.baseY;
      }
    }, { passive: true });

    this.canvas.addEventListener('touchmove', (e) => {
      if (this.touchId === null) return;
      for (let i = 0; i < e.changedTouches.length; i++) {
        const t = e.changedTouches[i];
        if (t.identifier !== this.touchId) continue;
        const r = this.canvas.getBoundingClientRect();
        let dx = (t.clientX - r.left) - this.baseX;
        let dy = (t.clientY - r.top) - this.baseY;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const maxDist = this.baseRadius - this.stickRadius;

        if (dist > maxDist) {
          dx = (dx / dist) * maxDist;
          dy = (dy / dist) * maxDist;
        }

        this.stickX = this.baseX + dx;
        this.stickY = this.baseY + dy;
      }
    }, { passive: true });

    const endHandler = (e: TouchEvent) => {
      if (this.touchId === null) return;
      for (let i = 0; i < e.changedTouches.length; i++) {
        if (e.changedTouches[i].identifier === this.touchId) {
          this.touchId = null;
          this.active = false;
          this.stickX = this.baseX;
          this.stickY = this.baseY;
        }
      }
    };

    this.canvas.addEventListener('touchend', endHandler, { passive: true });
    this.canvas.addEventListener('touchcancel', endHandler, { passive: true });
  }

  getDirection(): { x: number; y: number } {
    if (!this.active) return { x: 0, y: 0 };

    let dx = this.stickX - this.baseX;
    let dy = this.stickY - this.baseY;
    const dist = Math.sqrt(dx * dx + dy * dy);

    if (dist < this.deadzone) return { x: 0, y: 0 };

    const maxDist = this.baseRadius - this.stickRadius;
    const len = Math.min(dist, maxDist);
    return { x: dx / len, y: dy / len };
  }

  render(ctx: CanvasRenderingContext2D): void {
    if (!this.active) return;

    // 底座
    ctx.globalAlpha = 0.25;
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(this.baseX, this.baseY, this.baseRadius, 0, Math.PI * 2);
    ctx.fill();

    // 摇杆
    ctx.globalAlpha = 0.5;
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(this.stickX, this.stickY, this.stickRadius, 0, Math.PI * 2);
    ctx.fill();

    ctx.globalAlpha = 1;
  }
}
