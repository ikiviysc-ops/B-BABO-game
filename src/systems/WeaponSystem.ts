/**
 * 武器系统 — 自动攻击（近战范围检测 + 远程投射物）
 *
 * 近战武器：直接对范围内敌人造成伤害，不产生投射物
 * 远程武器：发射投射物，由 ProjectileSystem 更新
 */

import type { WeaponDef } from '@data/WeaponDefs';
import { ProjectilePool } from '@engine/ProjectilePool';
import type { EntityManager } from '@engine/EntityManager';

/** 近战攻击事件 */
export interface MeleeHitEvent {
  enemyId: number;
  damage: number;
  knockback: number;
  x: number;
  y: number;
  angle: number;
  range: number;
  weaponId: string;
}

/** 近战回调 */
export type MeleeCallback = (event: MeleeHitEvent) => void;

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

  /** 近战回调 */
  private _meleeCallback: MeleeCallback = () => {};

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

  /** 设置近战回调 */
  onMeleeHit(cb: MeleeCallback): void {
    this._meleeCallback = cb;
  }

  /** 更新最近敌人位置 */
  setNearestEnemy(x: number, y: number, hasTarget: boolean): void {
    this._nearestEnemyX = x;
    this._nearestEnemyY = y;
    this._hasTarget = hasTarget;
  }

  /** 每帧更新 */
  update(dt: number, playerX: number, playerY: number, entities?: EntityManager): void {
    for (const weapon of this._weapons) {
      weapon.cooldownTimer -= dt;
      if (weapon.cooldownTimer > 0) continue;

      const interval = 1 / weapon.def.fireRate;
      weapon.cooldownTimer = interval;

      if (weapon.def.type === 'melee') {
        this.fireMelee(weapon, playerX, playerY, entities);
      } else {
        this.fireRanged(weapon, playerX, playerY);
      }
    }
  }

  /** 近战攻击 — 直接范围伤害检测 */
  private fireMelee(weapon: EquippedWeapon, px: number, py: number, entities?: EntityManager): void {
    if (!entities) return;

    const def = weapon.def;
    const range = def.range;
    const damage = def.damage * (1 + (weapon.level - 1) * 0.2);
    const knockback = def.knockback ?? 10;

    // 朝最近敌人方向
    let angle = 0;
    if (this._hasTarget) {
      angle = Math.atan2(this._nearestEnemyY - py, this._nearestEnemyX - px);
    }

    // 扇形范围检测（前方120度）
    const halfArc = Math.PI / 3; // 60度半角
    const enemies = entities.getAll().filter(e => 'enemyId' in e && 'currentHp' in e);

    for (const enemy of enemies) {
      const dx = enemy.x - px;
      const dy = enemy.y - py;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist > range) continue;

      // 检查是否在扇形内
      const enemyAngle = Math.atan2(dy, dx);
      let angleDiff = enemyAngle - angle;
      while (angleDiff > Math.PI) angleDiff -= Math.PI * 2;
      while (angleDiff < -Math.PI) angleDiff += Math.PI * 2;

      if (Math.abs(angleDiff) > halfArc) continue;

      // 命中！
      this._meleeCallback({
        enemyId: enemy.id,
        damage,
        knockback,
        x: enemy.x,
        y: enemy.y,
        angle,
        range,
        weaponId: weapon.def.id,
      });
    }
  }

  /** 远程攻击 */
  private fireRanged(weapon: EquippedWeapon, px: number, py: number): void {
    const def = weapon.def;
    const count = def.projectileCount ?? 1;
    const spread = (def.spreadAngle ?? 0) * Math.PI / 180;
    const speed = def.projectileSpeed ?? 400;

    let baseAngle = 0;
    if (this._hasTarget) {
      baseAngle = Math.atan2(this._nearestEnemyY - py, this._nearestEnemyX - px);
    }

    for (let i = 0; i < count; i++) {
      const proj = this._pool.get();

      let angle = baseAngle;
      if (count > 1) {
        angle = baseAngle - spread / 2 + (spread / (count - 1)) * i;
      }

      proj.x = px;
      proj.y = py;
      proj.vx = Math.cos(angle) * speed;
      proj.vy = Math.sin(angle) * speed;
      proj.width = 6;
      proj.height = 6;
      proj.damage = def.damage * (1 + (weapon.level - 1) * 0.2);
      proj.pierce = def.pierce ?? 0;
      proj.lifetime = def.range / speed + 0.3;
      proj.age = 0;
      proj.active = true;

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
      proj.weaponSubtype = def.subtype;
      proj.weaponId = def.id;
    }
  }

  /** 清除所有武器 */
  clear(): void {
    this._weapons = [];
  }
}
