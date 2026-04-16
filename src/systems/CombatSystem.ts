// CombatSystem.ts - 战斗系统

import type { Projectile } from '../engine/ProjectilePool';
import type { Entity } from '../engine/EntityManager';

export interface CombatCallbacks {
  onEnemyDamaged: (enemyId: string, damage: number, crit: boolean) => void;
  onEnemyKilled: (enemyId: string, x: number, y: number, xpDrop: number) => void;
  onPlayerDamaged: (damage: number) => void;
  onProjectileHit: (x: number, y: number) => void;
}

export class CombatSystem {
  private callbacks: CombatCallbacks;

  constructor(callbacks: CombatCallbacks) {
    this.callbacks = callbacks;
  }

  /**
   * 更新战斗系统
   * @param projectiles 所有投射物
   * @param enemies 所有敌人实体
   * @param playerHp 玩家当前HP(引用)
   * @param playerArmor 玩家护甲值
   */
  update(
    projectiles: Projectile[],
    enemies: Entity[],
    _playerHp: { value: number },
    _playerArmor: number = 0
  ): void {
    const activeEnemies = enemies.filter(e => e.active && (e.hp as number) > 0);

    for (const proj of projectiles) {
      if (!proj.active) continue;

      // 更新投射物位置和生命周期
      proj.x += proj.vx * (1 / 60); // 近似dt
      proj.y += proj.vy * (1 / 60);
      proj.life -= (1 / 60);

      if (proj.life <= 0) {
        proj.active = false;
        continue;
      }

      // 玩家投射物 vs 敌人
      if (proj.owner === 'player') {
        for (const enemy of activeEnemies) {
          if ((enemy.hp as number) <= 0) continue;

          const ex = enemy.x as number;
          const ey = enemy.y as number;
          const eSize = (enemy.size as number) ?? 16;

          const dx = proj.x - ex;
          const dy = proj.y - ey;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < eSize + proj.size) {
            // 命中
            const isCrit = proj.dmg > 0; // 暴击已在武器系统计算
            let dmg = proj.dmg;

            // 敌人护甲减伤
            const enemyArmor = (enemy.armor as number) ?? 0;
            dmg = Math.max(1, dmg - enemyArmor);

            // 造成伤害
            enemy.hp = (enemy.hp as number) - dmg;
            enemy.hitFlash = 0.1; // 受击闪烁

            this.callbacks.onEnemyDamaged(enemy.id as string, dmg, isCrit);
            this.callbacks.onProjectileHit(proj.x, proj.y);

            // 穿透处理
            if (proj.pierce > 0) {
              proj.pierce--;
            } else {
              proj.active = false;
            }

            // 敌人死亡
            if ((enemy.hp as number) <= 0) {
              enemy.active = false;
              const xpDrop = (enemy.xpDrop as number) ?? 5;
              this.callbacks.onEnemyKilled(enemy.id as string, ex, ey, xpDrop);
            }

            if (!proj.active) break;
          }
        }
      }

      // 敌人投射物 vs 玩家
      if (proj.owner === 'enemy') {
        // 简化：检测投射物是否到达玩家附近
        // 实际玩家位置由外部传入
      }
    }
  }

  /**
   * 处理敌人接触伤害(由EnemyAISystem调用)
   */
  applyContactDamage(
    damage: number,
    playerHp: { value: number },
    playerArmor: number = 0
  ): boolean {
    const actualDmg = Math.max(1, damage - playerArmor);
    playerHp.value -= actualDmg;
    this.callbacks.onPlayerDamaged(actualDmg);
    return playerHp.value <= 0;
  }

  /**
   * 处理敌人近战伤害
   */
  applyMeleeDamage(
    damage: number,
    playerHp: { value: number },
    playerArmor: number = 0
  ): boolean {
    return this.applyContactDamage(damage, playerHp, playerArmor);
  }
}
