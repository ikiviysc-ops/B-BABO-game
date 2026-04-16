// EnemyAISystem.ts - 敌人AI系统

import type { Entity } from '../engine/EntityManager';

export interface EnemyCallbacks {
  onDamagePlayer: (enemyId: string, damage: number) => void;
}

export class EnemyAISystem {
  private callbacks: EnemyCallbacks;

  constructor(callbacks: EnemyCallbacks) {
    this.callbacks = callbacks;
  }

  /**
   * 更新所有敌人AI
   * @param enemies 敌人实体列表
   * @param playerX 玩家X坐标
   * @param playerY 玩家Y坐标
   * @param dt 帧间隔(秒)
   */
  update(
    enemies: Entity[],
    playerX: number,
    playerY: number,
    dt: number
  ): void {
    const activeEnemies = enemies.filter(e => e.active && (e.hp as number) > 0);

    for (const enemy of activeEnemies) {
      const ex = enemy.x as number;
      const ey = enemy.y as number;
      const speed = (enemy.speed as number) ?? 60;
      const damage = (enemy.damage as number) ?? 5;
      const attackType = (enemy.attackType as string) ?? 'contact';
      const range = (enemy.range as number) ?? 0;
      const size = (enemy.size as number) ?? 16;

      // 计算到玩家的方向
      const dx = playerX - ex;
      const dy = playerY - ey;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < 1) continue;

      const dirX = dx / dist;
      const dirY = dy / dist;

      // 分离力：避免敌人重叠
      let sepX = 0;
      let sepY = 0;
      const separationDist = size * 2.5;

      for (const other of activeEnemies) {
        if (other === enemy) continue;
        const ox = (other.x as number) - ex;
        const oy = (other.y as number) - ey;
        const oDist = Math.sqrt(ox * ox + oy * oy);
        if (oDist < separationDist && oDist > 0.1) {
          sepX -= (ox / oDist) * (separationDist - oDist) * 0.5;
          sepY -= (oy / oDist) * (separationDist - oDist) * 0.5;
        }
      }

      // 根据攻击类型决定行为
      if (attackType === 'contact') {
        // 接触型：直接冲向玩家
        let moveX = dirX * speed + sepX;
        let moveY = dirY * speed + sepY;
        const moveLen = Math.sqrt(moveX * moveX + moveY * moveY);
        if (moveLen > speed * 1.5) {
          moveX = (moveX / moveLen) * speed * 1.5;
          moveY = (moveY / moveLen) * speed * 1.5;
        }
        enemy.x = ex + moveX * dt;
        enemy.y = ey + moveY * dt;

        // 接触伤害
        const contactDist = size + 16; // 16 = 玩家半径
        if (dist < contactDist) {
          this.callbacks.onDamagePlayer(enemy.id as string, damage);
        }
      } else if (attackType === 'melee') {
        // 近战型：接近到攻击范围
        const attackDist = range + size;
        if (dist > attackDist) {
          let moveX = dirX * speed + sepX;
          let moveY = dirY * speed + sepY;
          const moveLen = Math.sqrt(moveX * moveX + moveY * moveY);
          if (moveLen > speed * 1.5) {
            moveX = (moveX / moveLen) * speed * 1.5;
            moveY = (moveY / moveLen) * speed * 1.5;
          }
          enemy.x = ex + moveX * dt;
          enemy.y = ey + moveY * dt;
        }

        // 近战攻击
        if (dist < attackDist) {
          const cooldown = (enemy.attackCooldown as number) ?? 0;
          if (cooldown <= 0) {
            this.callbacks.onDamagePlayer(enemy.id as string, damage);
            enemy.attackCooldown = 1.0; // 1秒冷却
          }
        }
      } else if (attackType === 'ranged') {
        // 远程型：保持距离
        const preferredDist = range * 0.7;
        if (dist < preferredDist - 30) {
          // 太近，后退
          enemy.x = ex - dirX * speed * dt + sepX * dt;
          enemy.y = ey - dirY * speed * dt + sepY * dt;
        } else if (dist > preferredDist + 30) {
          // 太远，接近
          enemy.x = ex + dirX * speed * dt + sepX * dt;
          enemy.y = ey + dirY * speed * dt + sepY * dt;
        } else {
          // 在合适距离，轻微移动+分离
          enemy.x = ex + sepX * dt;
          enemy.y = ey + sepY * dt;
        }

        // 远程攻击
        const cooldown = (enemy.attackCooldown as number) ?? 0;
        if (cooldown <= 0 && dist < range) {
          enemy.attackCooldown = 1.5; // 1.5秒冷却
          // 标记需要发射投射物
          enemy.wantsToShoot = true;
          enemy.shootTargetX = playerX;
          enemy.shootTargetY = playerY;
        }
      }

      // 更新攻击冷却
      if (enemy.attackCooldown !== undefined) {
        enemy.attackCooldown = (enemy.attackCooldown as number) - dt;
      }

      // 记录朝向
      enemy.facingX = dirX;
      enemy.facingY = dirY;
    }
  }
}
