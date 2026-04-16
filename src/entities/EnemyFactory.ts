/**
 * 敌人实体工厂
 */

import { EntityManager, type Entity } from '@engine/EntityManager';
import { renderPixelSprite } from '@engine/PixelRenderer';
import { ENEMY_SPRITES, type EnemySprite } from '@data/enemies_sprites';
import { EnemyAISystem, type EnemyAI } from '@systems/EnemyAISystem';

/** 敌人属性 */
export interface EnemyStats {
  readonly hp: number;
  readonly speed: number;
  readonly damage: number;
  readonly xpDrop: number;
}

/** 敌人定义 */
export interface EnemyDef {
  readonly id: string;
  readonly name: string;
  readonly stats: EnemyStats;
  readonly spriteData: EnemySprite;
  readonly attackType: 'contact' | 'melee' | 'ranged';
  readonly attackRange?: number;
  readonly attackCooldown: number;
  readonly element?: 'fire' | 'ice' | 'thunder' | 'nature';
  readonly special?: string;
}

/** 敌人完整定义库 */
const ENEMY_DEFS: EnemyDef[] = [
  {
    id: 'rotting_rat', name: '腐烂鼠',
    stats: { hp: 15, speed: 150, damage: 5, xpDrop: 5 },
    spriteData: ENEMY_SPRITES.find(s => s.id === 'rotting_rat')!,
    attackType: 'contact', attackCooldown: 0.5,
  },
  {
    id: 'skeleton', name: '骷髅兵',
    stats: { hp: 30, speed: 108, damage: 10, xpDrop: 10 },
    spriteData: ENEMY_SPRITES.find(s => s.id === 'skeleton')!,
    attackType: 'melee', attackRange: 30, attackCooldown: 1.0,
  },
  {
    id: 'night_bat', name: '暗夜蝙蝠',
    stats: { hp: 12, speed: 240, damage: 8, xpDrop: 8 },
    spriteData: ENEMY_SPRITES.find(s => s.id === 'night_bat')!,
    attackType: 'contact', attackCooldown: 0.8,
  },
  {
    id: 'thorn_vine', name: '荆棘藤蔓',
    stats: { hp: 40, speed: 0, damage: 12, xpDrop: 12 },
    spriteData: ENEMY_SPRITES.find(s => s.id === 'thorn_vine')!,
    attackType: 'ranged', attackRange: 200, attackCooldown: 2.0,
    element: 'nature',
  },
  {
    id: 'fire_slime', name: '火焰史莱姆',
    stats: { hp: 25, speed: 90, damage: 15, xpDrop: 15 },
    spriteData: ENEMY_SPRITES.find(s => s.id === 'fire_slime')!,
    attackType: 'contact', attackCooldown: 0.5,
    element: 'fire', special: '死亡爆炸50px',
  },
  {
    id: 'ice_slime', name: '冰霜史莱姆',
    stats: { hp: 25, speed: 90, damage: 8, xpDrop: 15 },
    spriteData: ENEMY_SPRITES.find(s => s.id === 'ice_slime')!,
    attackType: 'contact', attackCooldown: 0.5,
    element: 'ice', special: '冰冻1s',
  },
  {
    id: 'lightning_wisp', name: '雷电精灵',
    stats: { hp: 20, speed: 180, damage: 18, xpDrop: 18 },
    spriteData: ENEMY_SPRITES.find(s => s.id === 'lightning_wisp')!,
    attackType: 'ranged', attackRange: 150, attackCooldown: 3.0,
    element: 'thunder', special: '闪电链跳3',
  },
  {
    id: 'skeleton_archer', name: '骷髅弓手',
    stats: { hp: 22, speed: 120, damage: 14, xpDrop: 14 },
    spriteData: ENEMY_SPRITES.find(s => s.id === 'skeleton_archer')!,
    attackType: 'ranged', attackRange: 300, attackCooldown: 1.5,
    special: '保持距离150-250px',
  },
  {
    id: 'evil_eye', name: '邪眼',
    stats: { hp: 35, speed: 90, damage: 22, xpDrop: 22 },
    spriteData: ENEMY_SPRITES.find(s => s.id === 'evil_eye')!,
    attackType: 'ranged', attackRange: 250, attackCooldown: 5.0,
    special: '追踪激光持续2s',
  },
  {
    id: 'death_knight', name: '死亡骑士',
    stats: { hp: 80, speed: 132, damage: 20, xpDrop: 30 },
    spriteData: ENEMY_SPRITES.find(s => s.id === 'death_knight')!,
    attackType: 'melee', attackRange: 45, attackCooldown: 1.2,
    special: '每8秒冲锋速度x3',
  },
  {
    id: 'vampire', name: '吸血鬼',
    stats: { hp: 60, speed: 192, damage: 18, xpDrop: 25 },
    spriteData: ENEMY_SPRITES.find(s => s.id === 'vampire')!,
    attackType: 'melee', attackRange: 35, attackCooldown: 1.0,
    special: '生命偷取, 血量<30%速度+50%',
  },
  {
    id: 'giant_zombie', name: '巨型僵尸',
    stats: { hp: 150, speed: 60, damage: 30, xpDrop: 40 },
    spriteData: ENEMY_SPRITES.find(s => s.id === 'giant_zombie')!,
    attackType: 'melee', attackRange: 60, attackCooldown: 2.0,
    special: '击退, 1秒前摇',
  },
];

const defIndex = new Map(ENEMY_DEFS.map(d => [d.id, d]));

/** 预缓存所有敌人sprite（启动时一次性创建） */
const spriteCache = new Map<string, HTMLCanvasElement>();

function getSprite(enemyId: string, scale: number): HTMLCanvasElement {
  const key = `${enemyId}_${scale}`;
  let sprite = spriteCache.get(key);
  if (!sprite) {
    const def = defIndex.get(enemyId);
    if (def) {
      sprite = renderPixelSprite(def.spriteData.sprite, def.spriteData.palette, scale);
      spriteCache.set(key, sprite);
    }
  }
  return sprite!;
}

/** 预热所有敌人sprite缓存 */
export function warmupEnemySprites(scale = 3.5): void {
  for (const def of ENEMY_DEFS) {
    getSprite(def.id, scale);
  }
  console.log(`[EnemyFactory] Pre-cached ${spriteCache.size} enemy sprites`);
}

export class EnemyFactory {
  static getDef(id: string): EnemyDef | undefined {
    return defIndex.get(id);
  }

  static getAllDefs(): EnemyDef[] {
    return [...ENEMY_DEFS];
  }

  /** 创建敌人实体（含 FSM AI 字段） */
  static createEnemy(
    enemyId: string, x: number, y: number, scale = 3.5,
  ): Entity & { enemyId: string; currentHp: number; maxHp: number; attackTimer: number; ai: EnemyAI } {
    const def = defIndex.get(enemyId);
    if (!def) {
      console.warn(`[EnemyFactory] Unknown enemy: ${enemyId}`);
      return EnemyFactory.createEnemy('rotting_rat', x, y, scale);
    }

    const sprite = getSprite(enemyId, scale);
    const size = 16 * scale;

    return {
      id: EntityManager.nextId(),
      x, y,
      width: size,
      height: size,
      sprite,
      active: true,
      speed: def.stats.speed,
      enemyId: def.id,
      currentHp: def.stats.hp,
      maxHp: def.stats.hp,
      attackTimer: 0,
      ai: EnemyAISystem.createAI(def.id),
    };
  }
}
