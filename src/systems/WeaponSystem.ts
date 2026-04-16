// WeaponSystem.ts - 武器系统

import type { WeaponDef } from '../data/WeaponDefs';
import type { Projectile } from '../engine/ProjectilePool';
import type { Entity } from '../engine/EntityManager';

export interface WeaponCallbacks {
  onMeleeHit: (enemyId: string, damage: number, crit: boolean) => void;
}

export class WeaponSystem {
  private weapon: WeaponDef | null = null;
  private cooldown: number = 0;
  private attackCount: number = 0;
  private callbacks: WeaponCallbacks;

  constructor(callbacks: WeaponCallbacks) {
    this.callbacks = callbacks;
  }

  /**
   * 装备武器
   */
  equip(weaponDef: WeaponDef): void {
    this.weapon = weaponDef;
    this.cooldown = 0;
  }

  /**
   * 获取当前武器
   */
  getWeapon(): WeaponDef | null {
    return this.weapon;
  }

  /**
   * 更新武器系统
   * @param dt 帧间隔(秒)
   * @param playerX 玩家X坐标
   * @param playerY 玩家Y坐标
   * @param enemies 敌人列表
   * @param projectilePool 投射物池
   * @param critChance 暴击率(0-100)
   */
  update(
    dt: number,
    playerX: number,
    playerY: number,
    enemies: Entity[],
    projectilePool: { spawn: (config: Partial<Projectile> & { x: number; y: number; vx: number; vy: number }) => Projectile | null },
    critChance: number = 5
  ): void {
    if (!this.weapon) return;

    // 冷却
    this.cooldown -= dt;
    if (this.cooldown > 0) return;

    // 找最近的敌人
    let nearestEnemy: Entity | null = null;
    let nearestDist = Infinity;

    for (const enemy of enemies) {
      if (!enemy.active || (enemy.hp as number) <= 0) continue;
      const ex = enemy.x as number;
      const ey = enemy.y as number;
      const dx = ex - playerX;
      const dy = ey - playerY;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < nearestDist) {
        nearestDist = dist;
        nearestEnemy = enemy;
      }
    }

    // 没有敌人在范围内则不攻击
    if (!nearestEnemy || nearestDist > this.weapon.range * 1.2) return;

    // 开始攻击
    this.cooldown = this.weapon.fireRate;
    this.attackCount++;

    if (this.weapon.type === 'melee') {
      this._meleeAttack(playerX, playerY, enemies, critChance);
    } else {
      this._rangedAttack(playerX, playerY, nearestEnemy, projectilePool, critChance);
    }
  }

  /**
   * 近战攻击
   */
  private _meleeAttack(
    playerX: number,
    playerY: number,
    enemies: Entity[],
    critChance: number
  ): void {
    if (!this.weapon) return;

    const range = this.weapon.range;
    const count = this.weapon.projectileCount ?? 1;

    // 找范围内所有敌人
    const targets: { enemy: Entity; dist: number }[] = [];
    for (const enemy of enemies) {
      if (!enemy.active || (enemy.hp as number) <= 0) continue;
      const ex = enemy.x as number;
      const ey = enemy.y as number;
      const dx = ex - playerX;
      const dy = ey - playerY;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist <= range) {
        targets.push({ enemy, dist });
      }
    }

    // 按距离排序，取最近的N个
    targets.sort((a, b) => a.dist - b.dist);
    const hitTargets = targets.slice(0, count);

    for (const target of hitTargets) {
      const isCrit = Math.random() * 100 < critChance;
      const dmg = isCrit ? this.weapon.damage * 2 : this.weapon.damage;
      this.callbacks.onMeleeHit(target.enemy.id as string, dmg, isCrit);
    }
  }

  /**
   * 远程攻击
   */
  private _rangedAttack(
    playerX: number,
    playerY: number,
    target: Entity,
    projectilePool: { spawn: (config: Partial<Projectile> & { x: number; y: number; vx: number; vy: number }) => Projectile | null },
    critChance: number
  ): void {
    if (!this.weapon) return;

    const tx = target.x as number;
    const ty = target.y as number;
    const count = this.weapon.projectileCount ?? 1;
    const speed = this.weapon.projectileSpeed ?? 300;

    for (let i = 0; i < count; i++) {
      // 计算方向(多投射物时扇形散射)
      let angle: number;
      if (count === 1) {
        angle = Math.atan2(ty - playerY, tx - playerX);
      } else {
        const baseAngle = Math.atan2(ty - playerY, tx - playerX);
        const spread = Math.PI / 6; // 30度扇形
        const offset = count === 1 ? 0 : (i / (count - 1) - 0.5) * spread;
        angle = baseAngle + offset;
      }

      const isCrit = Math.random() * 100 < critChance;
      const dmg = isCrit ? this.weapon.damage * 2 : this.weapon.damage;

      projectilePool.spawn({
        x: playerX,
        y: playerY,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        dmg,
        maxLife: this.weapon.range / speed + 0.5,
        pierce: this.weapon.pierce ?? 0,
        size: this.weapon.size ?? 4,
        color: this.weapon.color ?? '#ffffff',
        type: this.weapon.type === 'special' ? 'special' : 'bullet',
        owner: 'player',
      });
    }
  }

  /**
   * 获取攻击次数(用于被动技能判断)
   */
  getAttackCount(): number {
    return this.attackCount;
  }

  /**
   * 设置冷却时间(用于武器升级效果)
   */
  setCooldownOverride(cd: number): void {
    this.cooldown = cd;
  }

  /**
   * 重置
   */
  reset(): void {
    this.weapon = null;
    this.cooldown = 0;
    this.attackCount = 0;
  }
}
