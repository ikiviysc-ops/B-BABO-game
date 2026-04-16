// Camera.ts - 2D摄像机，lerp平滑跟随

export class Camera {
  x = 0;
  y = 0;
  targetX = 0;
  targetY = 0;
  private smoothing = 0.1;
  private _screenW = 0;
  private _screenH = 0;

  get screenW(): number { return this._screenW; }
  get screenH(): number { return this._screenH; }

  resize(w: number, h: number): void {
    this._screenW = w;
    this._screenH = h;
  }

  setTarget(x: number, y: number): void {
    this.targetX = x;
    this.targetY = y;
  }

  snap(x: number, y: number): void {
    this.x = x;
    this.y = y;
    this.targetX = x;
    this.targetY = y;
  }

  update(): void {
    this.x += (this.targetX - this.x) * this.smoothing;
    this.y += (this.targetY - this.y) * this.smoothing;
  }

  getOffset(): { x: number; y: number } {
    return {
      x: this._screenW / 2 - this.x,
      y: this._screenH / 2 - this.y,
    };
  }

  screenToWorld(sx: number, sy: number): { x: number; y: number } {
    const off = this.getOffset();
    return { x: sx - off.x, y: sy - off.y };
  }

  worldToScreen(wx: number, wy: number): { x: number; y: number } {
    const off = this.getOffset();
    return { x: wx + off.x, y: wy + off.y };
  }
}
