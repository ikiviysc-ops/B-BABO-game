// LevelUpSystem.ts - 升级系统

import { WEAPON_DEFS } from '../data/WeaponDefs';

export interface LevelUpOption {
  id: string;
  name: string;
  desc: string;
  icon: string;
  type: 'stat' | 'weapon' | 'weapon_upgrade';
  apply: (context: LevelUpContext) => void;
}

export interface LevelUpContext {
  /** 玩家属性(可修改) */
  stats: {
    maxHp: number;
    speed: number;
    damageMultiplier: number;
    armor: number;
    critChance: number;
  };
  /** 已拥有的武器ID列表 */
  ownedWeapons: string[];
  /** 武器等级 Map<weaponId, level> */
  weaponLevels: Map<string, number>;
}

/** 属性强化选项定义 */
const STAT_OPTIONS: Omit<LevelUpOption, 'apply'>[] = [
  {
    id: 'hp_up',
    name: '生命强化',
    desc: '最大HP +20',
    icon: 'heart',
    type: 'stat',
  },
  {
    id: 'speed_up',
    name: '速度强化',
    desc: '移速 +10%',
    icon: 'boot',
    type: 'stat',
  },
  {
    id: 'damage_up',
    name: '伤害强化',
    desc: '伤害 +15%',
    icon: 'sword',
    type: 'stat',
  },
  {
    id: 'armor_up',
    name: '护甲强化',
    desc: '护甲 +3',
    icon: 'shield',
    type: 'stat',
  },
  {
    id: 'crit_up',
    name: '暴击强化',
    desc: '暴击率 +5%',
    icon: 'star',
    type: 'stat',
  },
];

/** 所有可选武器(排除初始武器) */
const UNLOCKABLE_WEAPONS = [
  'sword', 'claw', 'bat', 'hammer',
  'shuriken', 'ice_bow', 'fire_staff', 'pixel_gun', 'star_blaster',
  'wand', 'thunder_spear', 'shadow_dagger', 'cotton_cannon', 'cosmic_ray',
];

export class LevelUpSystem {
  /** 当前等级 */
  level: number = 1;
  /** 当前经验值 */
  xp: number = 0;
  /** 升级所需经验 */
  xpToNext: number = 20;
  /** 是否有待处理的升级 */
  pendingLevelUp: boolean = false;
  /** 当前可选选项 */
  options: LevelUpOption[] = [];
  /** 玩家上下文 */
  private context: LevelUpContext;

  constructor() {
    this.context = {
      stats: {
        maxHp: 100,
        speed: 200,
        damageMultiplier: 1.0,
        armor: 0,
        critChance: 5,
      },
      ownedWeapons: [],
      weaponLevels: new Map(),
    };
  }

  /**
   * 添加经验值
   * @param amount 经验值
   * @returns 是否升级
   */
  addXp(amount: number): boolean {
    this.xp += amount;

    if (this.xp >= this.xpToNext) {
      this.xp -= this.xpToNext;
      this.level++;
      this.xpToNext = Math.floor(20 * Math.pow(1.3, this.level - 1));
      this.pendingLevelUp = true;
      this.options = this.generateOptions();
      return true;
    }

    return false;
  }

  /**
   * 生成3个升级选项
   */
  generateOptions(): LevelUpOption[] {
    const pool: LevelUpOption[] = [];

    // 1. 属性强化选项(始终可用)
    for (const statOpt of STAT_OPTIONS) {
      pool.push({
        ...statOpt,
        apply: (ctx) => {
          switch (statOpt.id) {
            case 'hp_up':
              ctx.stats.maxHp += 20;
              break;
            case 'speed_up':
              ctx.stats.speed = Math.floor(ctx.stats.speed * 1.1);
              break;
            case 'damage_up':
              ctx.stats.damageMultiplier += 0.15;
              break;
            case 'armor_up':
              ctx.stats.armor += 3;
              break;
            case 'crit_up':
              ctx.stats.critChance += 5;
              break;
          }
        },
      });
    }

    // 2. 新武器选项(未拥有的武器)
    const availableWeapons = UNLOCKABLE_WEAPONS.filter(
      id => !this.context.ownedWeapons.includes(id)
    );
    for (const weaponId of availableWeapons) {
      const def = WEAPON_DEFS.get(weaponId);
      if (!def) continue;
      pool.push({
        id: `weapon_${weaponId}`,
        name: `新武器: ${def.name}`,
        desc: `获得${def.name} (${def.type === 'melee' ? '近战' : def.type === 'ranged' ? '远程' : '特殊'})`,
        icon: 'weapon',
        type: 'weapon',
        apply: (ctx) => {
          ctx.ownedWeapons.push(weaponId);
          ctx.weaponLevels.set(weaponId, 1);
        },
      });
    }

    // 3. 武器升级选项(已拥有的武器)
    for (const weaponId of this.context.ownedWeapons) {
      const def = WEAPON_DEFS.get(weaponId);
      if (!def) continue;
      const currentLevel = this.context.weaponLevels.get(weaponId) ?? 1;
      if (currentLevel >= 5) continue; // 最高5级

      pool.push({
        id: `upgrade_${weaponId}`,
        name: `${def.name} Lv.${currentLevel + 1}`,
        desc: `伤害+20%, 攻速+10%`,
        icon: 'upgrade',
        type: 'weapon_upgrade',
        apply: (ctx) => {
          ctx.weaponLevels.set(weaponId, currentLevel + 1);
          // 伤害和攻速加成通过weaponLevels查询应用
        },
      });
    }

    // 从池中随机选3个(不重复类型优先)
    const selected: LevelUpOption[] = [];
    const usedTypes = new Set<string>();

    // 优先每种类型选一个
    const typeOrder: string[] = ['stat', 'weapon', 'weapon_upgrade'];
    for (const type of typeOrder) {
      const candidates = pool.filter(o => o.type === type && !usedTypes.has(o.id));
      if (candidates.length > 0) {
        const pick = candidates[Math.floor(Math.random() * candidates.length)];
        selected.push(pick);
        usedTypes.add(pick.id);
      }
    }

    // 补足到3个
    while (selected.length < 3 && pool.length > 0) {
      const remaining = pool.filter(o => !usedTypes.has(o.id));
      if (remaining.length === 0) break;
      const pick = remaining[Math.floor(Math.random() * remaining.length)];
      selected.push(pick);
      usedTypes.add(pick.id);
    }

    return selected.slice(0, 3);
  }

  /**
   * 选择升级选项
   * @param index 选项索引(0-2)
   * @returns 选中的选项
   */
  selectOption(index: number): LevelUpOption {
    if (index < 0 || index >= this.options.length) {
      throw new Error(`Invalid option index: ${index}`);
    }

    const option = this.options[index];
    option.apply(this.context);
    this.pendingLevelUp = false;
    this.options = [];

    // 检查是否还有待处理的经验(连续升级)
    if (this.xp >= this.xpToNext) {
      this.xp -= this.xpToNext;
      this.level++;
      this.xpToNext = Math.floor(20 * Math.pow(1.3, this.level - 1));
      this.pendingLevelUp = true;
      this.options = this.generateOptions();
    }

    return option;
  }

  /**
   * 获取玩家上下文(只读副本)
   */
  getContext(): Readonly<LevelUpContext> {
    return this.context;
  }

  /**
   * 获取武器伤害倍率
   */
  getWeaponDamageMultiplier(weaponId: string): number {
    const level = this.context.weaponLevels.get(weaponId) ?? 1;
    return this.context.stats.damageMultiplier * (1 + (level - 1) * 0.2);
  }

  /**
   * 获取武器攻速倍率
   */
  getWeaponFireRateMultiplier(weaponId: string): number {
    const level = this.context.weaponLevels.get(weaponId) ?? 1;
    return 1 / (1 + (level - 1) * 0.1);
  }

  /**
   * 获取经验进度(0-1)
   */
  getXpProgress(): number {
    return this.xp / this.xpToNext;
  }

  /**
   * 重置
   */
  reset(): void {
    this.level = 1;
    this.xp = 0;
    this.xpToNext = 20;
    this.pendingLevelUp = false;
    this.options = [];
    this.context = {
      stats: {
        maxHp: 100,
        speed: 200,
        damageMultiplier: 1.0,
        armor: 0,
        critChance: 5,
      },
      ownedWeapons: [],
      weaponLevels: new Map(),
    };
  }
}
