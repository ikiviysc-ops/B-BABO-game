/**
 * 武器系统 — 自动发射武器投射物
 *
 * 幸存者类游戏核心：武器自动攻击，玩家只需移动。
 * 管理多个武器的冷却、发射逻辑、投射物创建。
 */

import type { WeaponDef } from '@data/WeaponDefs';
import { ProjectilePool } from '@engine/ProjectilePool';

/** 装备的武器实例 */
export interface EquippedWeapon {
  def: WeaponDef;
  cooldownTimer: number;
  level: number;
}

/** 武器系统配置 */
export interface WeaponSystemConfig {
  pool: ProjectilePool;
}

export class WeaponSystem {
  private readonly _pool: ProjectilePool;
  private _weapons: EquippedWeapon[] = [];
  private _nearestEnemyX = 0;
  private _nearestEnemyY = 0;
  private _hasTarget = false;

  constructor(config: WeaponSystemConfig) {
    this._pool = config.pool;
  }

  /** 装备武器 */
  equip(weapon: WeaponDef): void {
    this._weapons.push({ def: weapon, cooldownTimer: 0, level: 1 });
  }

  /** 获取已装备武器列表 */
  get weapons(): readonly EquippedWeapon[] {
    return this._weapons;
  }

  /** 更新最近敌人位置（由外部每帧设置） */
  setNearestEnemy(x: number, y: number, hasTarget: boolean): void {
    this._nearestEnemyX = x;
    this._nearestEnemyY = y;
    this._hasTarget = hasTarget;
  }

  /** 每帧更新 — 处理武器冷却和发射 */
  update(dt: number, playerX: number, playerY: number): void {
    for (const weapon of this._weapons) {
      weapon.cooldownTimer -= dt;
      if (weapon.cooldownTimer > 0) continue;

      const interval = 1 / weapon.def.fireRate;
      weapon.cooldownTimer = interval;

      this.fire(weapon, playerX, playerY);
    }
  }

  /** 发射投射物 */
  private fire(weapon: EquippedWeapon, px: number, py: number): void {
    const def = weapon.def;

    if (def.type === 'melee') {
      this.fireMelee(weapon, px, py);
    } else {
      this.fireRanged(weapon, px, py);
    }
  }

  /** 近战攻击 — 创建一个短寿命的弧形投射物 */
  private fireMelee(weapon: EquippedWeapon, px: number, py: number): void {
    const def = weapon.def;
    const proj = this._pool.get();

    // 朝最近敌人方向
    let angle = 0;
    if (this._hasTarget) {
      angle = Math.atan2(this._nearestEnemyY - py, this._nearestEnemyX - px);
    }

    const range = def.range;
    proj.x = px + Math.cos(angle) * range * 0.4;
    proj.y = py + Math.sin(angle) * range * 0.4;
    proj.vx = Math.cos(angle) * range * 3;
    proj.vy = Math.sin(angle) * range * 3;
    proj.width = range;
    proj.height = range * 0.6;
    proj.damage = def.damage * (1 + (weapon.level - 1) * 0.2);
    proj.pierce = 0;
    proj.lifetime = 0.15;
    proj.age = 0;
    proj.active = true;
    proj.type = 'melee_arc';
    proj.element = def.element;
    proj.aoe = def.aoe ?? 0;
    proj.knockback = def.knockback ?? 10;
    proj.owner = 'player';
  }

  /** 远程攻击 */
  private fireRanged(weapon: EquippedWeapon, px: number, py: number): void {
    const def = weapon.def;
    const count = def.projectileCount ?? 1;
    const spread = (def.spreadAngle ?? 0) * Math.PI / 180;
    const speed = def.projectileSpeed ?? 400;

    // 基础方向：朝最近敌人
    let baseAngle = 0;
    if (this._hasTarget) {
      baseAngle = Math.atan2(this._nearestEnemyY - py, this._nearestEnemyX - px);
    }

    for (let i = 0; i < count; i++) {
      const proj = this._pool.get();

      let angle = baseAngle;
      if (count > 1) {
        // 均匀散射
        angle = baseAngle - spread / 2 + (spread / (count - 1)) * i;
      }

      proj.x = px;
      proj.y = py;
      proj.vx = Math.cos(angle) * speed;
      proj.vy = Math.sin(angle) * speed;
      proj.width = 8;
      proj.height = 8;
      proj.damage = def.damage * (1 + (weapon.level - 1) * 0.2);
      proj.pierce = def.pierce ?? 0;
      proj.lifetime = def.range / speed + 0.5;
      proj.age = 0;
      proj.active = true;

      // 根据武器子类设置投射物类型
      if (def.tracking) {
        proj.type = 'magic';
      } else if (def.aoe && def.aoe > 0) {
        proj.type = 'rocket';
      } else if (def.subtype === 'bow') {
        proj.type = 'arrow';
      } else {
        proj.type = 'bullet';
      }

      proj.element = def.element;
      proj.aoe = def.aoe ?? 0;
      proj.knockback = def.knockback ?? 5;
      proj.owner = 'player';
    }
  }

  /** 清除所有武器 */
  clear(): void {
    this._weapons = [];
  }
}
