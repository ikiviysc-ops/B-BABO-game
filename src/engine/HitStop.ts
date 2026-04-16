/**
 * 命中停顿系统（卡肉效果）
 * 触发时跳过逻辑更新，只渲染，制造打击感
 */

export class HitStop {
  private _active = false;
  private _duration = 0;
  private _timer = 0;

  get active(): boolean { return this._active; }

  trigger(duration = 50): void {
    this._active = true;
    this._duration = duration;
    this._timer = 0;
  }

  update(dt: number): boolean {
    if (!this._active) return false;
    this._timer += dt;
    if (this._timer >= this._duration) {
      this._active = false;
      return false;
    }
    return true; // true = 跳过本帧逻辑更新
  }
}
