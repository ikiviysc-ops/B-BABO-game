// GameLoop.ts - 固定60fps游戏循环，累加器模式

export type UpdateFn = (dt: number) => void;
export type RenderFn = () => void;

export class GameLoop {
  private updateFn: UpdateFn;
  private renderFn: RenderFn;
  private readonly fixedDt = 1 / 60;
  private accumulator = 0;
  private lastTime = 0;
  private rafId = 0;
  private running = false;

  // FPS监控
  private fpsFrames = 0;
  private fpsAccum = 0;
  public fps = 60;

  constructor(update: UpdateFn, render: RenderFn) {
    this.updateFn = update;
    this.renderFn = render;
  }

  start(): void {
    if (this.running) return;
    this.running = true;
    this.lastTime = performance.now();
    this.loop(this.lastTime);
  }

  stop(): void {
    this.running = false;
    if (this.rafId) cancelAnimationFrame(this.rafId);
  }

  private loop = (now: number): void => {
    if (!this.running) return;
    this.rafId = requestAnimationFrame(this.loop);

    const elapsed = (now - this.lastTime) / 1000;
    this.lastTime = now;

    // 防止大跳帧（如切标签页回来）
    const clamped = Math.min(elapsed, 0.1);
    this.accumulator += clamped;

    // FPS统计
    this.fpsAccum += clamped;
    this.fpsFrames++;
    if (this.fpsAccum >= 0.5) {
      this.fps = Math.round(this.fpsFrames / this.fpsAccum);
      this.fpsFrames = 0;
      this.fpsAccum = 0;
    }

    try {
      while (this.accumulator >= this.fixedDt) {
        this.updateFn(this.fixedDt);
        this.accumulator -= this.fixedDt;
      }
      this.renderFn();
    } catch (e) {
      console.error('[GameLoop] Error:', e);
    }
  };
}
