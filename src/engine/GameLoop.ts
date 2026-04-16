/**
 * 固定时间步长游戏循环
 *
 * - 错误捕获：update/render异常不会崩溃循环
 * - FPS监控
 */

export class GameLoop {
  private readonly _fixedDt: number;
  private readonly _updateFn: (dt: number) => void;
  private readonly _renderFn: () => void;
  private _running = false;
  private _lastTime = 0;
  private _accumulator = 0;
  private _rafId = 0;

  // FPS
  private _fpsFrames = 0;
  private _fpsAccTime = 0;
  private _currentFps = 60;

  get fps(): number { return this._currentFps; }

  constructor(
    fixedFps: number,
    updateFn: (dt: number) => void,
    renderFn: () => void,
  ) {
    this._fixedDt = 1 / fixedFps;
    this._updateFn = updateFn;
    this._renderFn = renderFn;
  }

  start(): void {
    if (this._running) return;
    this._running = true;
    this._lastTime = performance.now();
    this._accumulator = 0;
    this.tick(this._lastTime);
  }

  stop(): void {
    this._running = false;
    if (this._rafId) cancelAnimationFrame(this._rafId);
  }

  private tick(now: number): void {
    if (!this._running) return;

    try {
      let frameTime = (now - this._lastTime) / 1000;
      this._lastTime = now;
      if (frameTime > 0.25) frameTime = 0.25;
      this._accumulator += frameTime;

      // 逻辑更新（防死亡螺旋）
      let steps = 0;
      while (this._accumulator >= this._fixedDt && steps < 4) {
        try {
          this._updateFn(this._fixedDt);
        } catch (e) {
          console.error('[GameLoop] update error:', e);
        }
        this._accumulator -= this._fixedDt;
        steps++;
      }
      if (this._accumulator > this._fixedDt * 2) {
        this._accumulator = 0;
      }

      // 渲染
      try {
        this._renderFn();
      } catch (e) {
        console.error('[GameLoop] render error:', e);
      }

      // FPS
      this._fpsFrames++;
      this._fpsAccTime += frameTime;
      if (this._fpsAccTime >= 1.0) {
        this._currentFps = this._fpsFrames;
        this._fpsFrames = 0;
        this._fpsAccTime -= 1.0;
      }
    } catch (e) {
      console.error('[GameLoop] tick error:', e);
    }

    this._rafId = requestAnimationFrame((t) => this.tick(t));
  }
}
