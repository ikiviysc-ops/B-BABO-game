/**
 * 固定时间步长游戏循环
 * 逻辑以固定频率更新，渲染以屏幕刷新率执行
 */

export class GameLoop {
  private readonly _fixedDt: number;   // 固定逻辑步长 (秒)
  private readonly _updateFn: (dt: number) => void;
  private readonly _renderFn: () => void;
  private _running = false;
  private _lastTime = 0;
  private _accumulator = 0;
  private _rafId = 0;

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

    let frameTime = (now - this._lastTime) / 1000;
    this._lastTime = now;

    // 防止螺旋死亡 (标签页切回时)
    if (frameTime > 0.25) frameTime = 0.25;

    this._accumulator += frameTime;

    while (this._accumulator >= this._fixedDt) {
      this._updateFn(this._fixedDt);
      this._accumulator -= this._fixedDt;
    }

    // 渲染插值因子 (可用于平滑渲染)
    // const alpha = this._accumulator / this._fixedDt;

    this._renderFn();
    this._rafId = requestAnimationFrame((t) => this.tick(t));
  }
}
