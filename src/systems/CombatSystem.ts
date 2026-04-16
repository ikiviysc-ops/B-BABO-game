/**
 * 战斗系统 — 投射物碰撞检测 + 伤害计算 + 敌人死亡
 *
 * 职责：
 * - 检测投射物与敌人的 AABB 碰撞
 * - 计算伤害并应用到敌人
 * - 处理穿透、击退
 * - 敌人死亡时触发 XP 掉落
 * - 伤害数字浮动显示
 */

import { EntityManager, type Entity } from '@engine/EntityManager';
import { aabbOverlap } from '@engine/Collision';
import { ProjectilePool } from '@engine/ProjectilePool';

/** 伤害事件 */
export interface DamageEvent {
  enemyId: number;
  damage: number;
  killed: boolean;
  x: number;
  y: number;
  xpDrop: number;
}

/** 浮动伤害数字 */
export interface FloatingText {
  x: number;
  y: number;
  text: string;
  color: string;
  age: number;
  lifetime: number;
  vy: number;
}

/** 战斗系统回调 */
export interface CombatCallbacks {
  onDamage: (event: DamageEvent) => void;
  onKill: (enemyId: number, x: number, y: number, xp: number) => void;
}

export class CombatSystem {
  private readonly _pool: ProjectilePool;
  private readonly _floatingTexts: FloatingText[] = [];
  private _callbacks: CombatCallbacks = {
    onDamage: () => {},
    onKill: () => {},
  };

  constructor(pool: ProjectilePool) {
    this._pool = pool;
  }

  /** 设置回调 */
  setCallbacks(cbs: Partial<CombatCallbacks>): void {
    Object.assign(this._callbacks, cbs);
  }

  /** 获取浮动文字列表（用于渲染） */
  get floatingTexts(): readonly FloatingText[] {
    return this._floatingTexts;
  }

  /** 每帧更新 — 碰撞检测 + 浮动文字更新 */
  update(dt: number, entities: EntityManager): void {
    this.checkProjectileEnemyCollisions(entities);
    this.updateFloatingTexts(dt);
  }

  /** 投射物 vs 敌人碰撞检测 */
  private checkProjectileEnemyCollisions(entities: EntityManager): void {
    const projectiles = this._pool.getActive();
    const enemies = entities.getAll().filter(e => 'enemyId' in e && 'currentHp' in e);

    for (const proj of projectiles) {
      if (!proj.active || proj.owner !== 'player') continue;

      const projAABB = {
        x: proj.x - proj.width / 2,
        y: proj.y - proj.height / 2,
        w: proj.width,
        h: proj.height,
      };

      for (const enemy of enemies) {
        if (!(enemy as Entity & { currentHp: number }).active) continue;

        const enemyAABB = {
          x: enemy.x - enemy.width / 2,
          y: enemy.y - enemy.height / 2,
          w: enemy.width,
          h: enemy.height,
        };

        if (aabbOverlap(projAABB, enemyAABB)) {
          const enemyData = enemy as Entity & { currentHp: number; maxHp: number; enemyId: string };
          const enemyDef = this.getEnemyXpDrop(enemyData.enemyId);

          // 应用伤害
          enemyData.currentHp -= proj.damage;

          // 击退
          if (proj.knockback > 0) {
            const dx = enemy.x - proj.x;
            const dy = enemy.y - proj.y;
            const dist = Math.sqrt(dx * dx + dy * dy) || 1;
            enemy.x += (dx / dist) * proj.knockback;
            enemy.y += (dy / dist) * proj.knockback;
          }

          // 浮动伤害数字
          this.addFloatingText(
            enemy.x, enemy.y - enemy.height / 2 - 5,
            Math.round(proj.damage).toString(),
            proj.element === 'fire' ? '#ff6622' :
              proj.element === 'ice' ? '#66ccff' :
                proj.element === 'thunder' ? '#ffee44' :
                  proj.element === 'nature' ? '#44ff66' : '#ffffff',
          );

          // 伤害回调
          this._callbacks.onDamage({
            enemyId: enemy.id,
            damage: proj.damage,
            killed: false,
            x: enemy.x,
            y: enemy.y,
            xpDrop: 0,
          });

          // 穿透处理
          if (proj.pierce > 0) {
            proj.pierce--;
          } else {
            proj.active = false;
          }

          // 敌人死亡
          if (enemyData.currentHp <= 0) {
            enemy.active = false;
            this.addFloatingText(
              enemy.x, enemy.y - enemy.height / 2 - 20,
              `+${enemyDef} XP`,
              '#ffcc00',
            );
            this._callbacks.onKill(enemy.id, enemy.x, enemy.y, enemyDef);
          }

          // 非穿透投射物命中后停止检测
          if (!proj.active) break;
        }
      }
    }
  }

  /** 获取敌人 XP 掉落量（公开） */
  getEnemyXpDrop(enemyId: string): number {
    const xpMap: Record<string, number> = {
      rotting_rat: 5, skeleton: 10, night_bat: 8, thorn_vine: 12,
      fire_slime: 15, ice_slime: 15, lightning_wisp: 18, skeleton_archer: 14,
      evil_eye: 22, death_knight: 30, vampire: 25, giant_zombie: 40,
    };
    return xpMap[enemyId] ?? 10;
  }

  /** 公开方法：直接添加浮动文字（近战用） */
  addFloatingTextDirect(x: number, y: number, text: string, color: string): void {
    this.addFloatingText(x, y, text, color);
  }

  /** 添加浮动文字 */
  private addFloatingText(x: number, y: number, text: string, color: string): void {
    this._floatingTexts.push({
      x, y, text, color,
      age: 0,
      lifetime: 0.8,
      vy: -60,
    });
  }

  /** 更新浮动文字 */
  private updateFloatingTexts(dt: number): void {
    for (let i = this._floatingTexts.length - 1; i >= 0; i--) {
      const ft = this._floatingTexts[i];
      ft.age += dt;
      ft.y += ft.vy * dt;
      if (ft.age >= ft.lifetime) {
        this._floatingTexts.splice(i, 1);
      }
    }
  }
}
