// EnemyDefs.ts - 12种敌人定义

export type EnemyAttackType = 'contact' | 'melee' | 'ranged';

export interface EnemyDef {
  id: string;
  name: string;
  hp: number;
  speed: number;
  damage: number;
  attackType: EnemyAttackType;
  range?: number;
  special?: string;
  xpDrop: number;
  color: string;
  size?: number;
}

// ==================== 12种敌人完整数据 ====================

export const ENEMY_DEFS: EnemyDef[] = [
  // 1. 史莱姆 - 基础接触型
  {
    id: 'slime',
    name: '史莱姆',
    hp: 20,
    speed: 60,
    damage: 5,
    attackType: 'contact',
    xpDrop: 5,
    color: '#44FF44',
    size: 16,
  },
  // 2. 蝙蝠 - 快速接触型
  {
    id: 'bat',
    name: '蝙蝠',
    hp: 12,
    speed: 140,
    damage: 8,
    attackType: 'contact',
    special: 'erratic',
    xpDrop: 8,
    color: '#8844AA',
    size: 12,
  },
  // 3. 骷髅 - 近战型
  {
    id: 'skeleton',
    name: '骷髅',
    hp: 35,
    speed: 70,
    damage: 12,
    attackType: 'melee',
    range: 40,
    xpDrop: 12,
    color: '#EEEECC',
    size: 18,
  },
  // 4. 哥布林 - 快速近战
  {
    id: 'goblin',
    name: '哥布林',
    hp: 25,
    speed: 100,
    damage: 10,
    attackType: 'melee',
    range: 30,
    xpDrop: 10,
    color: '#88AA44',
    size: 14,
  },
  // 5. 巫师 - 远程型
  {
    id: 'wizard',
    name: '巫师',
    hp: 30,
    speed: 50,
    damage: 15,
    attackType: 'ranged',
    range: 200,
    special: 'fireball',
    xpDrop: 18,
    color: '#6644CC',
    size: 16,
  },
  // 6. 恶魔 - 高伤害近战
  {
    id: 'demon',
    name: '恶魔',
    hp: 60,
    speed: 80,
    damage: 20,
    attackType: 'melee',
    range: 45,
    special: 'fire_aura',
    xpDrop: 25,
    color: '#CC2200',
    size: 20,
  },
  // 7. 幽灵 - 穿墙型
  {
    id: 'ghost',
    name: '幽灵',
    hp: 18,
    speed: 90,
    damage: 10,
    attackType: 'contact',
    special: 'phase',
    xpDrop: 15,
    color: '#CCCCFF',
    size: 16,
  },
  // 8. 石像鬼 - 高护甲
  {
    id: 'gargoyle',
    name: '石像鬼',
    hp: 80,
    speed: 45,
    damage: 18,
    attackType: 'melee',
    range: 40,
    special: 'armor_5',
    xpDrop: 22,
    color: '#777788',
    size: 22,
  },
  // 9. 精英骷髅 - 强化版
  {
    id: 'elite_skeleton',
    name: '精英骷髅',
    hp: 70,
    speed: 85,
    damage: 18,
    attackType: 'melee',
    range: 45,
    special: 'shield',
    xpDrop: 30,
    color: '#FFFF88',
    size: 20,
  },
  // 10. 暗影刺客 - 高速高暴击
  {
    id: 'shadow_assassin',
    name: '暗影刺客',
    hp: 40,
    speed: 160,
    damage: 25,
    attackType: 'melee',
    range: 35,
    special: 'stealth',
    xpDrop: 28,
    color: '#333355',
    size: 14,
  },
  // 11. 巨型史莱姆 - BOSS级
  {
    id: 'mega_slime',
    name: '巨型史莱姆',
    hp: 200,
    speed: 40,
    damage: 15,
    attackType: 'contact',
    special: 'split',
    xpDrop: 50,
    color: '#22CC22',
    size: 32,
  },
  // 12. 龙族 - 最终BOSS
  {
    id: 'dragon',
    name: '龙族',
    hp: 500,
    speed: 55,
    damage: 30,
    attackType: 'ranged',
    range: 250,
    special: 'breath_fire',
    xpDrop: 100,
    color: '#FF4400',
    size: 36,
  },
];

// ==================== 查询方法 ====================

const enemyDefMap = new Map<string, EnemyDef>();
for (const def of ENEMY_DEFS) {
  enemyDefMap.set(def.id, def);
}

export function getEnemyDef(id: string): EnemyDef | undefined {
  return enemyDefMap.get(id);
}

export function getEnemyDefByName(name: string): EnemyDef | undefined {
  return ENEMY_DEFS.find(d => d.name === name);
}
