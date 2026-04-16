/**
 * B-BABO 角色注册表 — 20 个 POP MART HIRONO 风格角色
 *
 * 每个角色对应一个 HIRONO 小野系列情绪主题，具有独特的视觉差异和技能。
 * HIRONO 风格核心：大头小身、圆润无棱角、豆豆眼/十字星瞳、红腮红+红鼻头、马卡龙色系
 */

import type { PixelData } from '@engine/PixelRenderer';
import { renderPixelSprite } from '@engine/PixelRenderer';
import { EntityManager, type Entity } from '@engine/EntityManager';

/** 角色精灵定义 */
export interface CharacterSprite {
  readonly id: string;
  readonly name: string;
  readonly hironoSeries: string;
  readonly palette: Record<string, string>;
  readonly sprite: PixelData;
}

/** 角色属性定义 */
export interface CharacterStats {
  readonly hp: number;
  readonly speed: number;
  readonly pickupRange: number;
  readonly armor: number;
  readonly critRate: number;
}

/** 完整角色定义 */
export interface CharacterDef {
  readonly id: string;
  readonly name: string;
  readonly stats: CharacterStats;
  readonly passive: string;
  readonly active: string;
  readonly activeCd: number;
  readonly initialWeapon: string;
  readonly unlockCondition: string;
  readonly unlocked: boolean;
}

// ============================================================
// 导入 4 批次精灵数据
// ============================================================
import { SPRITES_BATCH_1 } from '@data/sprites_batch1';
import { SPRITES_BATCH_2 } from '@data/sprites_batch2';
import { SPRITES_BATCH_3 } from '@data/sprites_batch3';
import { SPRITES_BATCH_4 } from '@data/sprites_batch4';

/** 全部 20 个角色精灵 */
const ALL_SPRITES: CharacterSprite[] = [
  ...SPRITES_BATCH_1,
  ...SPRITES_BATCH_2,
  ...SPRITES_BATCH_3,
  ...SPRITES_BATCH_4,
].map(s => ({
  ...s,
  palette: Object.fromEntries(
    Object.entries(s.palette).filter(([, v]) => v !== undefined),
  ),
}));

/** 精灵索引 (id -> CharacterSprite) */
const spriteIndex = new Map<string, CharacterSprite>();
for (const s of ALL_SPRITES) spriteIndex.set(s.id, s);

// ============================================================
// 角色属性 & 技能定义 — 20 个 HIRONO 情绪主题角色
// ============================================================
const CHARACTER_DEFS: CharacterDef[] = [
  // --- 初始角色 (4个) ---
  {
    id: 'amnesia',
    name: '小野·失忆',
    stats: { hp: 100, speed: 200, pickupRange: 55, armor: 2, critRate: 0.05 },
    passive: '空白画布：获得的经验值+10%',
    active: '记忆碎片：释放空白画笔之力，对周围敌人造成200%伤害并清除所有负面效果',
    activeCd: 10,
    initialWeapon: '空白画笔',
    unlockCondition: '默认解锁',
    unlocked: true,
  },
  {
    id: 'raving',
    name: '小野·狂啸',
    stats: { hp: 110, speed: 220, pickupRange: 50, armor: 3, critRate: 0.08 },
    passive: '怒火中烧：所有伤害+10%',
    active: '声波呐喊：发出震耳欲聋的怒吼，对前方扇形区域造成300%伤害并击退敌人',
    activeCd: 8,
    initialWeapon: '声波呐喊',
    unlockCondition: '默认解锁',
    unlocked: true,
  },
  {
    id: 'floating',
    name: '小野·漂浮',
    stats: { hp: 85, speed: 260, pickupRange: 60, armor: 1, critRate: 0.06 },
    passive: '轻盈如风：移动速度+20%',
    active: '气泡屏障：释放一圈气泡弹，对周围敌人造成150%伤害并短暂减速',
    activeCd: 7,
    initialWeapon: '气泡弹',
    unlockCondition: '默认解锁',
    unlocked: true,
  },
  {
    id: 'destroyer',
    name: '小野·毁灭',
    stats: { hp: 130, speed: 180, pickupRange: 45, armor: 6, critRate: 0.07 },
    passive: '毁灭之力：近战伤害+15%',
    active: '碎裂冲击：蓄力后释放碎裂拳套，对前方大范围造成350%伤害',
    activeCd: 12,
    initialWeapon: '碎裂拳套',
    unlockCondition: '默认解锁',
    unlocked: true,
  },

  // --- 解锁角色 (16个) ---
  {
    id: 'ghost_hirono',
    name: '小野·幽灵',
    stats: { hp: 75, speed: 240, pickupRange: 55, armor: 0, critRate: 0.08 },
    passive: '灵魂不灭：死亡时自动复活1次，恢复50%生命值',
    active: '灵魂灯笼：召唤灵魂灯笼，持续5秒对周围敌人造成每秒80%伤害',
    activeCd: 15,
    initialWeapon: '灵魂灯笼',
    unlockCondition: '累计死亡10次',
    unlocked: false,
  },
  {
    id: 'healer',
    name: '小野·治愈',
    stats: { hp: 100, speed: 190, pickupRange: 60, armor: 2, critRate: 0.05 },
    passive: '温暖之心：每秒自动恢复0.5HP',
    active: '治愈之花：在脚下绽放治愈之花，3秒内恢复30%最大生命值',
    activeCd: 12,
    initialWeapon: '治愈之花',
    unlockCondition: '累计使用治疗道具20次',
    unlocked: false,
  },
  {
    id: 'marionette',
    name: '小野·木偶',
    stats: { hp: 90, speed: 200, pickupRange: 55, armor: 2, critRate: 0.06 },
    passive: '丝线操控：所有投射物数量+1',
    active: '操控丝线：释放丝线连接周围最多5个敌人，3秒内造成持续伤害',
    activeCd: 14,
    initialWeapon: '操控丝线',
    unlockCondition: '累计发射投射物1000次',
    unlocked: false,
  },
  {
    id: 'fox',
    name: '小野·狐狸',
    stats: { hp: 95, speed: 230, pickupRange: 65, armor: 2, critRate: 0.10 },
    passive: '狡黠之幸：幸运+20%，稀有掉落率提升',
    active: '狐火：释放3团狐火追踪最近敌人，每团造成200%伤害',
    activeCd: 9,
    initialWeapon: '狐火',
    unlockCondition: '累计拾取50个稀有道具',
    unlocked: false,
  },
  {
    id: 'crow',
    name: '小野·乌鸦',
    stats: { hp: 90, speed: 210, pickupRange: 50, armor: 3, critRate: 0.09 },
    passive: '深沉之力：所有技能冷却时间-10%',
    active: '黑羽刃：向四周释放黑羽刃，每个造成180%伤害',
    activeCd: 8,
    initialWeapon: '黑羽刃',
    unlockCondition: '累计使用主动技能50次',
    unlocked: false,
  },
  {
    id: 'pianist',
    name: '小野·钢琴家',
    stats: { hp: 95, speed: 195, pickupRange: 55, armor: 2, critRate: 0.06 },
    passive: '艺术永恒：所有持续效果时间+20%',
    active: '音符飞刃：释放一排音符飞刃，对直线敌人造成250%伤害',
    activeCd: 10,
    initialWeapon: '音符飞刃',
    unlockCondition: '累计装备5种不同武器',
    unlocked: false,
  },
  {
    id: 'fallen_angel',
    name: '小野·堕落天使',
    stats: { hp: 120, speed: 220, pickupRange: 55, armor: 4, critRate: 0.10 },
    passive: '堕落之力：所有伤害+20%',
    active: '断翼之刃：释放断翼之力，对前方大范围造成400%伤害',
    activeCd: 16,
    initialWeapon: '断翼之刃',
    unlockCondition: '累计击杀1000个敌人',
    unlocked: false,
  },
  {
    id: 'monster',
    name: '小野·怪物',
    stats: { hp: 110, speed: 185, pickupRange: 50, armor: 3, critRate: 0.07 },
    passive: '黑暗领域：所有攻击范围+30%',
    active: '暗影触手：召唤暗影触手攻击周围敌人，持续4秒',
    activeCd: 14,
    initialWeapon: '暗影触手',
    unlockCondition: '单局存活超过20分钟',
    unlocked: false,
  },
  {
    id: 'insight',
    name: '小野·洞察',
    stats: { hp: 100, speed: 200, pickupRange: 70, armor: 2, critRate: 0.06 },
    passive: '全视之眼：拾取范围+25%',
    active: '全视之眼：开启全视之眼，5秒内显示所有掉落物位置并自动拾取',
    activeCd: 12,
    initialWeapon: '全视之眼',
    unlockCondition: '累计拾取经验宝石5000个',
    unlocked: false,
  },
  {
    id: 'echo',
    name: '小野·回声',
    stats: { hp: 95, speed: 205, pickupRange: 55, armor: 2, critRate: 0.07 },
    passive: '共鸣之力：投射物有5%概率反弹',
    active: '回声定位：释放回声波，标记所有敌人位置，3秒内对标记敌人造成额外伤害',
    activeCd: 10,
    initialWeapon: '回声定位',
    unlockCondition: '累计反弹投射物50次',
    unlocked: false,
  },
  {
    id: 'vagrancy',
    name: '小野·流浪',
    stats: { hp: 90, speed: 270, pickupRange: 60, armor: 1, critRate: 0.06 },
    passive: '漂泊之心：移动速度+30%',
    active: '旅人之杖：挥动旅人之杖，释放冲击波对周围敌人造成200%伤害',
    activeCd: 8,
    initialWeapon: '旅人之杖',
    unlockCondition: '累计移动距离达到100000',
    unlocked: false,
  },
  {
    id: 'manacle',
    name: '小野·枷锁',
    stats: { hp: 115, speed: 185, pickupRange: 50, armor: 5, critRate: 0.06 },
    passive: '挣扎反击：受到攻击时10%概率减速攻击者',
    active: '锁链鞭：释放锁链鞭，对前方直线敌人造成250%伤害并束缚2秒',
    activeCd: 12,
    initialWeapon: '锁链鞭',
    unlockCondition: '累计承受伤害达到50000',
    unlocked: false,
  },
  {
    id: 'birdman',
    name: '小野·鸟人',
    stats: { hp: 95, speed: 230, pickupRange: 55, armor: 2, critRate: 0.08 },
    passive: '超越之翼：投射物飞行速度+40%',
    active: '羽箭：向最近敌人连射5支羽箭，每支造成180%伤害',
    activeCd: 9,
    initialWeapon: '羽箭',
    unlockCondition: '累计击杀500个飞行敌人',
    unlocked: false,
  },
  {
    id: 'numb',
    name: '小野·麻木',
    stats: { hp: 130, speed: 170, pickupRange: 60, armor: 4, critRate: 0.04 },
    passive: '逃避现实：造成的伤害-20%，但受到的伤害-30%',
    active: '梦境棉花：释放梦境棉花，使周围敌人陷入沉睡3秒',
    activeCd: 15,
    initialWeapon: '梦境棉花',
    unlockCondition: '单局中受到伤害0次存活5分钟',
    unlocked: false,
  },
  {
    id: 'dreaming',
    name: '小野·做梦',
    stats: { hp: 100, speed: 210, pickupRange: 58, armor: 3, critRate: 0.07 },
    passive: '希望之光：全属性+5%（HP/速度/伤害/护甲）',
    active: '星光瀑布：召唤星光瀑布覆盖大范围区域，持续4秒造成每秒150%伤害',
    activeCd: 16,
    initialWeapon: '星光瀑布',
    unlockCondition: '解锁其他15个角色',
    unlocked: false,
  },
  {
    id: 'the_other',
    name: '小野·他者',
    stats: { hp: 100, speed: 200, pickupRange: 55, armor: 3, critRate: 0.07 },
    passive: '镜像分身：自动生成一个分身，分身造成50%伤害',
    active: '镜像分身：强化分身，5秒内分身造成100%伤害并可独立行动',
    activeCd: 18,
    initialWeapon: '镜像分身',
    unlockCondition: '在地狱难度下击败Boss',
    unlocked: false,
  },
];

/** 角色属性索引 (id -> CharacterDef) */
const defIndex = new Map<string, CharacterDef>();
for (const d of CHARACTER_DEFS) defIndex.set(d.id, d);

// ============================================================
// 公开 API
// ============================================================

export class CharacterRegistry {
  /** 获取角色精灵定义 */
  static getSprite(id: string): CharacterSprite | undefined {
    return spriteIndex.get(id);
  }

  /** 获取角色属性定义 */
  static getDef(id: string): CharacterDef | undefined {
    return defIndex.get(id);
  }

  /** 获取所有角色定义 */
  static getAllDefs(): CharacterDef[] {
    return [...CHARACTER_DEFS];
  }

  /** 获取已解锁角色 */
  static getUnlockedDefs(): CharacterDef[] {
    return CHARACTER_DEFS.filter(d => d.unlocked);
  }

  /** 创建角色实体 */
  static createEntity(charId: string, scale = 3): Entity {
    const spriteData = spriteIndex.get(charId);
    const def = defIndex.get(charId);

    if (!spriteData || !def) {
      console.warn(`[CharacterRegistry] Unknown character: ${charId}, using amnesia`);
      return CharacterRegistry.createEntity('amnesia', scale);
    }

    const sprite = renderPixelSprite(spriteData.sprite, spriteData.palette, scale);

    return {
      id: EntityManager.nextId(),
      x: 500,
      y: 500,
      width: 32 * scale,
      height: 32 * scale,
      sprite,
      active: true,
      speed: def.stats.speed,
    };
  }

  /** 获取角色总数 */
  static get totalCharacters(): number {
    return CHARACTER_DEFS.length;
  }

  /** 获取已解锁数量 */
  static get unlockedCount(): number {
    return CHARACTER_DEFS.filter(d => d.unlocked).length;
  }
}
