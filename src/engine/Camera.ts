/**
 * 2D 摄像机 - 跟随目标，平滑插值
 */

import type { Entity } from '@engine/EntityManager';

export class Camera {
  private _x = 0;
  private _y = 0;
  private _targetX = 0;
  private _targetY = 0;
  private _width: number;
  private _height: number;
  private _target: Entity | null = null;
  private _lerpFactor = 0.1; // 平滑跟随系数

  constructor(width: number, height: number) {
    this._width = width;
    this._height = height;
  }

  get x(): number { return this._x; }
  get y(): number { return this._y; }
  get width(): number { return this._width; }
  get height(): number { return this._height; }

  resize(w: number, h: number): void {
    this._width = w;
    this._height = h;
  }

  /** 设置跟随目标 */
  setTarget(entity: Entity): void {
    this._target = entity;
    // 立即跳转到目标位置
    if (entity) {
      this._x = entity.x - this._width / 2;
      this._y = entity.y - this._height / 2;
      this._targetX = this._x;
      this._targetY = this._y;
    }
  }

  /** 每帧更新 - 平滑插值跟随 */
  update(): void {
    if (!this._target) return;

    this._targetX = this._target.x - this._width / 2;
    this._targetY = this._target.y - this._height / 2;

    this._x += (this._targetX - this._x) * this._lerpFactor;
    this._y += (this._targetY - this._y) * this._lerpFactor;
  }

  /** 世界坐标 → 屏幕坐标 */
  worldToScreen(wx: number, wy: number): { x: number; y: number } {
    return {
      x: wx - this._x,
      y: wy - this._y,
    };
  }

  /** 屏幕坐标 → 世界坐标 */
  screenToWorld(sx: number, sy: number): { x: number; y: number } {
    return {
      x: sx + this._x,
      y: sy + this._y,
    };
  }
}
