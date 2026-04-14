/**
 * 投射物对象池
 *
 * 基于引擎 ObjectPool 实现，预分配 200 个投射物实例。
 * 通过 get/release 管理投射物生命周期，避免频繁 GC。
 *
 * @example
 * ```ts
 * const pool = new ProjectilePool();
 *
 * // 发射一颗子弹
 * const bullet = pool.get();
 * bullet.x = player.x;
 * bullet.y = player.y;
 * bullet.vx = 400;
 * bullet.vy = 0;
 * bullet.damage = 10;
 * bullet.active = true;
 *
 * // 回收
 * pool.release(bullet);
 * ```
 */

import { ObjectPool } from '@engine/Collision';
import {
  type ProjectileDef,
  createDefaultProjectile,
  resetProjectile,
} from '@entities/Projectile';

/** 投射物对象池 */
export class ProjectilePool {
  private readonly _pool: ObjectPool<ProjectileDef>;
  private readonly _active = new Set<ProjectileDef>();
  private _nextId = 1;

  constructor(initialSize = 200) {
    this._pool = new ObjectPool<ProjectileDef>(
      createDefaultProjectile,
      resetProjectile,
      initialSize,
    );
  }

  /**
   * 从池中获取一个投射物实例
   * @returns 已分配 ID 的投射物（active 默认为 false，需手动激活）
   */
  get(): ProjectileDef {
    const proj = this._pool.get();
    proj.id = this._nextId++;
    this._active.add(proj);
    return proj;
  }

  /**
   * 回收一个投射物到池中
   * @param proj 要回收的投射物
   */
  release(proj: ProjectileDef): void {
    this._active.delete(proj);
    this._pool.release(proj);
  }

  /**
   * 获取所有活跃投射物
   * @returns 活跃投射物数组
   */
  getActive(): ProjectileDef[] {
    return Array.from(this._active);
  }

  /**
   * 获取当前活跃投射物数量
   */
  get activeCount(): number {
    return this._active.size;
  }

  /**
   * 获取池中可用投射物数量
   */
  get availableCount(): number {
    return this._pool.availableCount;
  }

  /**
   * 批量回收所有不活跃的投射物
   */
  cleanup(): void {
    for (const proj of this._active) {
      if (!proj.active) {
        this.release(proj);
      }
    }
  }

  /**
   * 回收所有投射物（包括活跃的）
   */
  releaseAll(): void {
    for (const proj of this._active) {
      this._pool.release(proj);
    }
    this._active.clear();
  }
}
