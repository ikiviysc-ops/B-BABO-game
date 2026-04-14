/**
 * 敌人 AI 系统 — 敌人朝玩家移动
 */

import { EntityManager } from '@engine/EntityManager';

export class EnemyAISystem {
  update(entities: EntityManager, playerX: number, playerY: number, dt: number): void {
    for (const entity of entities.getAll()) {
      if (!('enemyId' in entity)) continue;
      if (entity.speed <= 0) continue; // 固定敌人不移动

      const dx = playerX - entity.x;
      const dy = playerY - entity.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist > 1) {
        const nx = dx / dist;
        const ny = dy / dist;
        entity.x += nx * entity.speed * dt;
        entity.y += ny * entity.speed * dt;
      }
    }
  }
}
