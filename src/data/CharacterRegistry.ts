/**
 * B-BABO 角色注册表 — 20 个 HIRONO 风格角色
 *
 * 整合 4 批次精灵数据，提供统一的角色查询和创建接口。
 * 每个角色对应一个 HIRONO 系列造型，保留核心特征同时具有独特视觉差异。
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
  readonly unlocked: boolean; // 初始解锁 or 需要解锁
}

// ============================================================
// 导入 4 批次精灵数据
// ============================================================
import { SPRITES_BATCH_1 } from '@data/sprites_batch1';
import { SPRITES_BATCH_2 } from '@data/sprites_batch2';
import { SPRITES_BATCH_3 } from '@data/sprites_batch3';
import { SPRITES_BATCH_4 } from '@data/sprites_batch4';
import { HIRONO_BASE_SPRITE } from '@entities/BaboSprite';

/** 幻影角色专用调色板（深色+黑白Mime风格）*/
const PHANTOM_PALETTE: Record<string, string> = {
  hair:     '#1a1a20',
  hairHi:   '#383840',
  hairDk:   '#0a0a10',
  skin:     '#e8e0d8',
  skinSh:   '#c8c0b8',
  blush:    '#d8a8a8',
  nose:     '#c88080',
  eyeW:     '#f0f0f0',
  eyeI:     '#1a1a20',
  eyeB:     '#0a0a10',
  lid:      '#d8d0c8',
  lidSh:    '#b8b0a8',
  mouth:    '#a09090',
  coat:     '#f0ece8',
  coatHi:   '#ffffff',
  coatDk:   '#d0ccc8',
  coatLn:   '#b0aca8',
  inner:    '#e0dcd8',
  shoe:     '#1a1a20',
  outline:  '#0a0a10',
  white:    '#ffffff',
  ghost:    '#c8c4c0',
  wisp:     '#e8e4e0',
};

/** 全部 20 个角色精灵 */
const ALL_SPRITES: CharacterSprite[] = [
  ...SPRITES_BATCH_1,
  ...SPRITES_BATCH_2,
  ...SPRITES_BATCH_3,
  ...SPRITES_BATCH_4,
].map(s => {
  // 幻影角色：用基础HIRONO模板替换sprite（修复面部变形）
  if (s.id === 'phantom') {
    return { ...s, sprite: { ...HIRONO_BASE_SPRITE }, palette: PHANTOM_PALETTE };
  }
  return {
    ...s,
    // 确保 palette 中无 undefined 值
    palette: Object.fromEntries(
      Object.entries(s.palette).filter(([, v]) => v !== undefined),
    ),
  };
});

/** 精灵索引 (id → CharacterSprite) */
const spriteIndex = new Map<string, CharacterSprite>();
for (const s of ALL_SPRITES) spriteIndex.set(s.id, s);

// ============================================================
// 角色属性 & 技能定义
// ============================================================
const CHARACTER_DEFS: CharacterDef[] = [
  // --- 初始角色 (4个) ---
  {
    id: 'warrior', name: 'B-BABO战士',
    stats: { hp: 120, speed: 200, pickupRange: 55, armor: 5, critRate: 0.05 },
    passive: '坚韧之心：受到致命伤害时免疫一次死亡并恢复30%最大生命值（每局一次）',
    active: 'BABO冲锋：向前冲刺，对路径上敌人造成200%武器伤害并击退',
    activeCd: 8, initialWeapon: '生锈铁剑', unlockCondition: '默认解锁', unlocked: true,
  },
  {
    id: 'mage', name: 'B-BABO法师',
    stats: { hp: 80, speed: 180, pickupRange: 60, armor: 0, critRate: 0.10 },
    passive: '魔力亲和：所有元素伤害+25%，拾取范围+15%',
    active: '奥术爆发：释放魔法能量波，对周围所有敌人造成300%魔法伤害',
    activeCd: 12, initialWeapon: '魔法杖', unlockCondition: '默认解锁', unlocked: true,
  },
  {
    id: 'ranger', name: 'B-BABO游侠',
    stats: { hp: 90, speed: 250, pickupRange: 65, armor: 2, critRate: 0.08 },
    passive: '疾风步：移动时获得15%闪避率，静止时攻速+20%',
    active: '箭雨：向目标区域发射箭雨，持续3秒',
    activeCd: 10, initialWeapon: '木弓', unlockCondition: '默认解锁', unlocked: true,
  },
  {
    id: 'guardian', name: 'B-BABO守卫',
    stats: { hp: 200, speed: 145, pickupRange: 45, armor: 15, critRate: 0.03 },
    passive: '铁壁：护甲值翻倍计算，每5秒自动获得10护盾',
    active: '坚守阵地：3秒内无法移动但获得50%减伤，吸引所有敌人攻击自己',
    activeCd: 15, initialWeapon: '铁盾', unlockCondition: '默认解锁', unlocked: true,
  },

  // --- 解锁角色 (16个) ---
  {
    id: 'flame', name: 'B-BABO烈焰',
    stats: { hp: 100, speed: 210, pickupRange: 50, armor: 3, critRate: 0.07 },
    passive: '燃烧之魂：所有攻击附带灼烧效果，击杀敌人时产生火焰爆炸',
    active: '烈焰风暴：召唤火焰旋风，持续4秒，对区域内敌人造成持续伤害',
    activeCd: 14, initialWeapon: '火焰法杖', unlockCondition: '累计击杀500个敌人', unlocked: false,
  },
  {
    id: 'necro', name: 'B-BABO死灵',
    stats: { hp: 90, speed: 170, pickupRange: 55, armor: 2, critRate: 0.06 },
    passive: '亡灵召唤：每击杀10个敌人，自动召唤一个骷髅BABO协助战斗（最多5个）',
    active: '亡者领域：释放暗影领域，领域内敌人持续受伤，友方获得生命恢复',
    activeCd: 16, initialWeapon: '暗影之书', unlockCondition: '单局存活超过15分钟', unlocked: false,
  },
  {
    id: 'thunder', name: 'B-BABO雷电',
    stats: { hp: 95, speed: 220, pickupRange: 50, armor: 2, critRate: 0.08 },
    passive: '静电场：每3秒对随机一个敌人释放闪电，可在敌人间弹跳3次',
    active: '雷神降临：召唤5道闪电随机打击区域内敌人，每道250%伤害',
    activeCd: 12, initialWeapon: '雷电之锤', unlockCondition: '使用闪电元素武器击杀200个敌人', unlocked: false,
  },
  {
    id: 'frost', name: 'B-BABO冰霜',
    stats: { hp: 110, speed: 175, pickupRange: 55, armor: 4, critRate: 0.06 },
    passive: '寒冰之心：周围3格内敌人自动减速15%，被冰冻的敌人受到伤害+30%',
    active: '绝对零度：冻结周围所有敌人3秒，并造成冰霜伤害',
    activeCd: 18, initialWeapon: '冰晶法杖', unlockCondition: '使用冰冻效果控制100个敌人', unlocked: false,
  },
  {
    id: 'phantom', name: 'B-BABO幻影',
    stats: { hp: 85, speed: 230, pickupRange: 60, armor: 1, critRate: 0.12 },
    passive: '幻影闪避：闪避率+15%，成功闪避后短暂无敌0.5秒并留下幻影分身',
    active: '影分身：创造2个分身复制当前武器攻击，持续6秒',
    activeCd: 20, initialWeapon: '双匕首', unlockCondition: '累计闪避50次攻击', unlocked: false,
  },
  {
    id: 'merchant', name: 'B-BABO商人',
    stats: { hp: 100, speed: 190, pickupRange: 70, armor: 3, critRate: 0.05 },
    passive: '讨价还价：商店物品价格降低20%，每波结束额外获得30%金币',
    active: '金币雨：向四周散射金币弹幕，每个金币造成伤害',
    activeCd: 10, initialWeapon: '金币袋', unlockCondition: '累计收集5000金币', unlocked: false,
  },
  {
    id: 'druid', name: 'B-BABO德鲁伊',
    stats: { hp: 105, speed: 185, pickupRange: 55, armor: 3, critRate: 0.06 },
    passive: '自然之力：每8秒在随机位置生成一个治疗花朵，站在上面恢复生命',
    active: '荆棘缠绕：释放藤蔓缠绕并伤害周围所有敌人，持续3秒',
    activeCd: 12, initialWeapon: '自然法杖', unlockCondition: '使用自然元素武器击杀300个敌人', unlocked: false,
  },
  {
    id: 'mech', name: 'B-BABO机甲',
    stats: { hp: 130, speed: 180, pickupRange: 50, armor: 8, critRate: 0.07 },
    passive: '超载：每20秒自动触发一次武器超载，攻击速度和伤害翻倍持续3秒',
    active: '导弹齐射：发射8枚追踪导弹',
    activeCd: 15, initialWeapon: '激光枪', unlockCondition: '收集50个机械零件道具', unlocked: false,
  },
  {
    id: 'bard', name: 'B-BABO吟游',
    stats: { hp: 95, speed: 195, pickupRange: 60, armor: 2, critRate: 0.06 },
    passive: '战歌：每10秒随机触发一个增益效果（攻速+/移速+/伤害+/护盾+）',
    active: '恐惧之歌：释放音波，恐惧周围敌人使其逃跑3秒',
    activeCd: 14, initialWeapon: '音波琴', unlockCondition: '同时装备4种不同元素武器', unlocked: false,
  },
  {
    id: 'werewolf', name: 'B-BABO狼人',
    stats: { hp: 110, speed: 240, pickupRange: 50, armor: 3, critRate: 0.10 },
    passive: '野性本能：血量越低，攻击速度和伤害越高（最高+50%）',
    active: '狂暴变身：变身狼人形态8秒，近战范围和伤害大幅提升',
    activeCd: 25, initialWeapon: '利爪', unlockCondition: '在单局中达到500%伤害加成', unlocked: false,
  },
  {
    id: 'ghost', name: 'B-BABO幽灵',
    stats: { hp: 75, speed: 260, pickupRange: 55, armor: 0, critRate: 0.08 },
    passive: '虚体化：可以穿过敌人而不受碰撞伤害，每穿过一个敌人恢复1HP',
    active: '灵魂吸取：吸取所有附近敌人的生命值',
    activeCd: 12, initialWeapon: '灵魂之镰', unlockCondition: '在噩梦难度下存活到第20波', unlocked: false,
  },
  {
    id: 'star', name: 'B-BABO星辰',
    stats: { hp: 100, speed: 200, pickupRange: 60, armor: 5, critRate: 0.08 },
    passive: '星辰之力：每30秒获得一个随机星座增益（持续15秒）',
    active: '星陨：召唤陨石雨覆盖大范围区域',
    activeCd: 20, initialWeapon: '星辰之弓', unlockCondition: '解锁其他15个角色', unlocked: false,
  },
  {
    id: 'gambler', name: 'B-BABO赌徒',
    stats: { hp: 90, speed: 200, pickupRange: 65, armor: 2, critRate: 0.15 },
    passive: '好运来：所有随机效果的范围扩大（更好的掉落、更强的随机增益）',
    active: '轮盘赌：旋转命运轮盘，随机获得一个强力效果',
    activeCd: 8, initialWeapon: '幸运骰子', unlockCondition: '在商店中购买100个物品', unlocked: false,
  },
  {
    id: 'shroom', name: 'B-BABO毒菇',
    stats: { hp: 95, speed: 185, pickupRange: 55, armor: 2, critRate: 0.06 },
    passive: '孢子云：移动时释放毒孢子，经过的敌人中毒',
    active: '毒雾爆发：释放大范围毒雾，持续5秒',
    activeCd: 14, initialWeapon: '毒蘑菇杖', unlockCondition: '使用中毒效果击杀500个敌人', unlocked: false,
  },
  {
    id: 'chrono', name: 'B-BABO时空',
    stats: { hp: 100, speed: 210, pickupRange: 55, armor: 4, critRate: 0.07 },
    passive: '时间扭曲：所有技能冷却速度+20%，子弹飞行时留下时间残影造成额外伤害',
    active: '时间停止：冻结所有敌人3秒，自己可以自由移动和攻击',
    activeCd: 25, initialWeapon: '时空之枪', unlockCondition: '累计游戏时间超过5小时', unlocked: false,
  },
  {
    id: 'dragon', name: 'B-BABO龙裔',
    stats: { hp: 150, speed: 195, pickupRange: 50, armor: 8, critRate: 0.09 },
    passive: '龙息：每5秒自动向前方喷吐火焰锥形攻击',
    active: '龙翼风暴：飞到空中并发射12颗火球',
    activeCd: 18, initialWeapon: '龙牙剑', unlockCondition: '在地狱难度下击败Boss', unlocked: false,
  },
];

/** 角色属性索引 (id → CharacterDef) */
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
      console.warn(`[CharacterRegistry] Unknown character: ${charId}, using warrior`);
      return CharacterRegistry.createEntity('warrior', scale);
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
