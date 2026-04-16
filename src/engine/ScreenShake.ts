// ScreenShake.ts - 屏幕震动

export class ScreenShake {
  private intensity = 0;
  private duration = 0;
  private frequency = 30;
  private timer = 0;
  private time = 0;
  private _offsetX = 0;
  private _offsetY = 0;

  get offsetX(): number { return this._offsetX; }
  get offsetY(): number { return this._offsetY; }

  trigger(intensity: number, duration: number, frequency: number = 30): void {
    this.intensity = intensity;
    this.duration = duration;
    this.frequency = frequency;
    this.timer = duration;
    this.time = 0;
  }

  update(dt: number): void {
    if (this.timer <= 0) {
      this._offsetX = 0;
      this._offsetY = 0;
      return;
    }

    this.timer -= dt;
    this.time += dt;

    const progress = this.timer / this.duration;
    const decay = progress * this.intensity;
    const t = this.time * this.frequency * Math.PI * 2;

    this._offsetX = Math.sin(t * 1.1) * decay;
    this._offsetY = Math.cos(t * 0.9) * decay;
  }

  getOffset(): { x: number; y: number } {
    return { x: this._offsetX, y: this._offsetY };
  }
}
