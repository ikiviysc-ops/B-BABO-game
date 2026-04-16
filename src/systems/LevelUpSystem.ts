/**
 * 升级系统 — 经验值积累 + 升级选择
 *
 * 幸存者类游戏核心循环：杀敌 → 获得XP → 升级 → 选择强化
 */

import type { WeaponDef } from '@data/WeaponDefs';
import { WEAPON_DEFS } from '@data/WeaponDefs';

/** 升级选项 */
export interface LevelUpOption {
  id: string;
  name: string;
  description: string;
  icon: string; // emoji for now
  type: 'new_weapon' | 'upgrade_weapon' | 'stat_boost';
  apply: (ctx: LevelUpContext) => void;
}

/** 升级上下文 */
export interface LevelUpContext {
  weapons: { def: WeaponDef; level: number }[];
  maxHp: number;
  speed: number;
  damageMultiplier: number;
}

/** 升级系统状态 */
export class LevelUpSystem {
  private _xp = 0;
  private _level = 1;
  private _xpToNext = 20;
  private _totalXp = 0;

  /** 升级选择状态 */
  private _pendingLevelUp = false;
  private _options: LevelUpOption[] = [];
  private _selectedIndex = -1;

  /** 属性加成 */
  private _bonusMaxHp = 0;
  private _bonusSpeed = 0;
  private _damageMultiplier = 1;

  get xp(): number { return this._xp; }
  get level(): number { return this._level; }
  get xpToNext(): number { return this._xpToNext; }
  get pendingLevelUp(): boolean { return this._pendingLevelUp; }
  get options(): readonly LevelUpOption[] { return this._options; }
  get selectedIndex(): number { return this._selectedIndex; }
  get bonusMaxHp(): number { return this._bonusMaxHp; }
  get bonusSpeed(): number { return this._bonusSpeed; }
  get damageMultiplier(): number { return this._damageMultiplier; }

  /** 增加经验值 */
  addXp(amount: number): boolean {
    this._xp += amount;
    this._totalXp += amount;

    if (this._xp >= this._xpToNext) {
      this._xp -= this._xpToNext;
      this._level++;
      this._xpToNext = Math.floor(20 * Math.pow(1.15, this._level - 1));
      this.generateOptions();
      this._pendingLevelUp = true;
      return true;
    }
    return false;
  }

  /** 生成3个升级选项 */
  private generateOptions(): void {
    this._options = [];
    this._selectedIndex = -1;

    const allOptions = this.buildOptionPool();

    // 随机选3个不重复的
    const shuffled = allOptions.sort(() => Math.random() - 0.5);
    for (let i = 0; i < Math.min(3, shuffled.length); i++) {
      this._options.push(shuffled[i]);
    }
  }

  /** 构建可选升级池 */
  private buildOptionPool(): LevelUpOption[] {
    const pool: LevelUpOption[] = [];

    // 属性强化（始终可用）
    pool.push({
      id: 'hp_boost', name: '生命强化', description: '最大HP +20',
      icon: 'hp_boost', type: 'stat_boost',
      apply: () => { this._bonusMaxHp += 20; },
    });
    pool.push({
      id: 'speed_boost', name: '疾步', description: '移动速度 +15%',
      icon: 'speed_boost', type: 'stat_boost',
      apply: () => { this._bonusSpeed += 15; },
    });
    pool.push({
      id: 'damage_boost', name: '力量', description: '全伤害 +10%',
      icon: 'damage_boost', type: 'stat_boost',
      apply: () => { this._damageMultiplier += 0.1; },
    });

    // 新武器（随机3把）
    const weaponEntries = Array.from(WEAPON_DEFS.values());
    const shuffledWeapons = weaponEntries.sort(() => Math.random() - 0.5);
    for (let i = 0; i < Math.min(3, shuffledWeapons.length); i++) {
      const w = shuffledWeapons[i];
      const typeLabel = w.type === 'melee' ? '近战' : w.type === 'ranged' ? '远程' : '特殊';
      const desc = this.buildWeaponDesc(w);
      pool.push({
        id: `new_${w.id}`, name: w.name,
        description: `${typeLabel} | ${desc}`,
        icon: w.id,
        type: 'new_weapon',
        apply: () => {},
        _weaponDef: w,
      } as LevelUpOption & { _weaponDef: WeaponDef });
    }

    return pool;
  }

  /** 生成武器描述 */
  private buildWeaponDesc(w: WeaponDef): string {
    const parts: string[] = [];
    parts.push(`伤害${w.damage}`);
    parts.push(`攻速${w.fireRate}/s`);
    if (w.type !== 'melee') {
      parts.push(`射程${w.range}`);
    }
    if (w.pierce && w.pierce > 0) parts.push(`穿透${w.pierce}`);
    if (w.aoe && w.aoe > 0) parts.push(`爆炸${w.aoe}px`);
    if (w.tracking) parts.push('追踪');
    if (w.projectileCount && w.projectileCount > 1) parts.push(`${w.projectileCount}发散`);
    if (w.element) {
      const elMap: Record<string, string> = { fire: '🔥火', ice: '❄️冰', thunder: '⚡雷', nature: '🌿自然' };
      parts.push(elMap[w.element] || w.element);
    }
    if (w.special) parts.push(w.special);
    return parts.join(' ');
  }

  /** 选择升级选项 */
  selectOption(index: number): LevelUpOption | null {
    if (index < 0 || index >= this._options.length) return null;
    this._selectedIndex = index;
    const option = this._options[index];
    option.apply({} as LevelUpContext);
    this._pendingLevelUp = false;
    return option;
  }

  /** 重置 */
  reset(): void {
    this._xp = 0;
    this._level = 1;
    this._xpToNext = 20;
    this._totalXp = 0;
    this._pendingLevelUp = false;
    this._options = [];
    this._selectedIndex = -1;
    this._bonusMaxHp = 0;
    this._bonusSpeed = 0;
    this._damageMultiplier = 1;
  }
}
