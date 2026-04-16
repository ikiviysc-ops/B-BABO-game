/**
 * 屏幕震动系统
 * 参考知识库：轻攻击(2px,100ms) / 重攻击(8px,300ms) / 爆炸(15px,500ms)
 */

export class ScreenShake {
  private offsetX = 0;
  private offsetY = 0;
  private intensity = 0;
  private duration = 0;
  private timer = 0;
  private frequency = 30;
  private _active = false;

  get active(): boolean { return this._active; }

  trigger(intensity: number, duration: number, frequency = 30): void {
    this.intensity = intensity;
    this.duration = duration;
    this.frequency = frequency;
    this.timer = 0;
    this._active = true;
  }

  update(dt: number): void {
    if (!this._active) return;
    this.timer += dt;
    if (this.timer >= this.duration) {
      this.offsetX = 0;
      this.offsetY = 0;
      this._active = false;
      return;
    }
    const progress = this.timer / this.duration;
    const current = this.intensity * (1 - progress);
    this.offsetX = Math.sin(this.timer * this.frequency * 0.01) * current;
    this.offsetY = Math.cos(this.timer * this.frequency * 0.013) * current;
  }

  getOffset(): { x: number; y: number } {
    return { x: this.offsetX, y: this.offsetY };
  }
}
