/**
 * 投射物更新系统
 *
 * 每帧更新所有活跃投射物的位置、生命周期、追踪逻辑和爆炸效果。
 * 依赖 ProjectilePool 管理投射物实例。
 *
 * 职责：
 * - 位置更新 (x += vx * dt, y += vy * dt)
 * - 生命周期检查，超时自动回收
 * - 出屏检测，超出屏幕范围自动回收
 * - 追踪类型（magic / rocket）朝最近敌人转向
 * - 爆炸类型（rocket / explosion）在命中或超时时创建爆炸子投射物
 */

import type { ProjectileDef } from '@entities/Projectile';
import { ProjectilePool } from '@engine/ProjectilePool';

/** 屏幕边界（默认值，运行时可通过 camera 覆盖） */
interface ScreenBounds {
  left: number;
  top: number;
  right: number;
  bottom: number;
}

/** 敌人位置（追踪目标） */
interface EnemyTarget {
  x: number;
  y: number;
  active: boolean;
}

/** 爆炸回调 — 通知外部系统处理爆炸伤害/特效 */
export type ExplosionCallback = (x: number, y: number, aoe: number, damage: number, element?: string) => void;

/** 投射物系统配置 */
export interface ProjectileSystemConfig {
  /** 屏幕边界 */
  bounds: ScreenBounds;
  /** 追踪转向速度（弧度/秒） */
  trackingTurnSpeed?: number;
  /** 出屏额外容差（像素） */
  outOfBoundsMargin?: number;
}

/** 投射物更新系统 */
export class ProjectileSystem {
  private readonly _pool: ProjectilePool;
  private readonly _bounds: ScreenBounds;
  private readonly _trackingTurnSpeed: number;
  private readonly _margin: number;

  /** 爆炸回调列表 */
  private readonly _explosionCallbacks: ExplosionCallback[] = [];

  /** 敌人目标列表（外部每帧更新） */
  private _enemies: EnemyTarget[] = [];

  constructor(pool: ProjectilePool, config: ProjectileSystemConfig) {
    this._pool = pool;
    this._bounds = config.bounds;
    this._trackingTurnSpeed = config.trackingTurnSpeed ?? Math.PI * 2; // 默认 360°/s
    this._margin = config.outOfBoundsMargin ?? 64;
  }

  /**
   * 注册爆炸回调
   * @param cb 爆炸发生时触发
   */
  onExplosion(cb: ExplosionCallback): void {
    this._explosionCallbacks.push(cb);
  }

  /**
   * 更新敌人目标列表（由外部系统每帧调用）
   * @param enemies 当前活跃的敌人列表
   */
  setEnemies(enemies: EnemyTarget[]): void {
    this._enemies = enemies;
  }

  /**
   * 更新屏幕边界
   * @param bounds 新的屏幕边界
   */
  updateBounds(bounds: ScreenBounds): void {
    this._bounds.left = bounds.left;
    this._bounds.top = bounds.top;
    this._bounds.right = bounds.right;
    this._bounds.bottom = bounds.bottom;
  }

  /**
   * 每帧更新所有活跃投射物
   * @param dt 帧间隔时间（秒）
   */
  update(dt: number): void {
    const projectiles = this._pool.getActive();

    for (const proj of projectiles) {
      if (!proj.active) continue;

      // 1. 追踪逻辑
      if (proj.type === 'magic' || proj.type === 'rocket') {
        this._applyTracking(proj, dt);
      }

      // 2. 位置更新
      proj.x += proj.vx * dt;
      proj.y += proj.vy * dt;

      // 3. 生命周期更新
      proj.age += dt;

      // 4. 超时检查
      if (proj.age >= proj.lifetime) {
        // 只有非爆炸类型的投射物才触发爆炸（避免连锁爆炸）
        if (proj.aoe > 0 && proj.type !== 'explosion') {
          this._triggerExplosion(proj);
        }
        proj.active = false;
        continue;
      }

      // 5. 出屏检查
      if (this._isOutOfBounds(proj)) {
        proj.active = false;
        continue;
      }
    }

    // 6. 清理非活跃投射物
    this._pool.cleanup();
  }

  /**
   * 追踪逻辑 — 朝最近敌人转向
   */
  private _applyTracking(proj: ProjectileDef, dt: number): void {
    if (this._enemies.length === 0) return;

    // 找最近敌人
    let nearestDist = Infinity;
    let nearest: EnemyTarget | null = null;

    for (const enemy of this._enemies) {
      if (!enemy.active) continue;
      const dx = enemy.x - proj.x;
      const dy = enemy.y - proj.y;
      const dist = dx * dx + dy * dy; // 不开方，性能优化
      if (dist < nearestDist) {
        nearestDist = dist;
        nearest = enemy;
      }
    }

    if (!nearest) return;

    // 计算当前速度方向
    const currentAngle = Math.atan2(proj.vy, proj.vx);
    // 计算目标方向
    const targetAngle = Math.atan2(nearest.y - proj.y, nearest.x - proj.x);

    // 计算角度差（-PI ~ PI）
    let angleDiff = targetAngle - currentAngle;
    // 归一化到 -PI ~ PI
    while (angleDiff > Math.PI) angleDiff -= Math.PI * 2;
    while (angleDiff < -Math.PI) angleDiff += Math.PI * 2;

    // 限制转向速度
    const maxTurn = this._trackingTurnSpeed * dt;
    const turn = Math.abs(angleDiff) < maxTurn ? angleDiff : Math.sign(angleDiff) * maxTurn;

    // 应用新方向
    const newAngle = currentAngle + turn;
    const speed = Math.sqrt(proj.vx * proj.vx + proj.vy * proj.vy);
    proj.vx = Math.cos(newAngle) * speed;
    proj.vy = Math.sin(newAngle) * speed;
  }

  /**
   * 检查投射物是否出屏
   */
  private _isOutOfBounds(proj: ProjectileDef): boolean {
    return (
      proj.x + proj.width < this._bounds.left - this._margin ||
      proj.x > this._bounds.right + this._margin ||
      proj.y + proj.height < this._bounds.top - this._margin ||
      proj.y > this._bounds.bottom + this._margin
    );
  }

  /**
   * 触发爆炸效果
   */
  private _triggerExplosion(proj: ProjectileDef): void {
    // 创建爆炸投射物
    const explosion = this._pool.get();
    explosion.x = proj.x;
    explosion.y = proj.y;
    explosion.vx = 0;
    explosion.vy = 0;
    explosion.width = proj.aoe * 2;
    explosion.height = proj.aoe * 2;
    explosion.damage = proj.damage;
    explosion.pierce = 0;
    explosion.lifetime = 0.2; // 爆炸持续 0.2 秒
    explosion.age = 0;
    explosion.active = true;
    explosion.type = 'explosion';
    explosion.element = proj.element;
    explosion.aoe = proj.aoe;
    explosion.knockback = proj.knockback * 1.5; // 爆炸击退加成
    explosion.owner = proj.owner;

    // 通知外部系统
    for (const cb of this._explosionCallbacks) {
      cb(proj.x, proj.y, proj.aoe, proj.damage, proj.element);
    }
  }
}
