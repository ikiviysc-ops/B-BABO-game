// HitStop.ts - 命中停顿

export class HitStop {
  private timer = 0;
  private _active = false;

  get active(): boolean { return this._active; }

  trigger(duration: number = 0.05): void {
    this.timer = duration;
    this._active = true;
  }

  update(dt: number): boolean {
    if (this.timer > 0) {
      this.timer -= dt;
      if (this.timer <= 0) {
        this.timer = 0;
        this._active = false;
      }
      return true; // 应该跳过逻辑更新
    }
    return false;
  }
}
