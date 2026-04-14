/**
 * 武器定义数据
 *
 * B-BABO 幸存者游戏全武器数据表。
 * 包含近战武器（5把）、远程武器（7把）、特殊武器（3把），共 15 把。
 *
 * 设计原则：
 * - 每把武器有明确的定位和特色
 * - 数值平衡围绕 DPS（每秒伤害）展开
 * - 特殊效果通过 special 字段描述，具体逻辑由战斗系统实现
 */

/** 武器类型 */
export type WeaponType = 'melee' | 'ranged' | 'special';

/** 元素属性 */
export type WeaponElement = 'fire' | 'ice' | 'thunder' | 'nature';

/** 武器定义 */
export interface WeaponDef {
  /** 唯一标识 */
  readonly id: string;
  /** 显示名称 */
  readonly name: string;
  /** 武器大类 */
  readonly type: WeaponType;
  /** 武器子类（如 "sword", "gun", "staff" 等） */
  readonly subtype?: string;
  /** 元素属性 */
  readonly element?: WeaponElement;
  /** 基础伤害 */
  readonly damage: number;
  /** 攻击频率（次/秒） */
  readonly fireRate: number;
  /** 攻击范围（像素） */
  readonly range: number;
  /** 投射物速度（像素/秒，仅远程） */
  readonly projectileSpeed?: number;
  /** 每次攻击发射的投射物数量（默认 1） */
  readonly projectileCount?: number;
  /** 散射角度（度，仅多投射物时有效） */
  readonly spreadAngle?: number;
  /** 穿透次数（0 = 命中即销毁） */
  readonly pierce?: number;
  /** 爆炸范围（像素，0 = 无爆炸） */
  readonly aoe?: number;
  /** 击退距离（像素） */
  readonly knockback?: number;
  /** 是否追踪 */
  readonly tracking?: boolean;
  /** 特殊效果描述 */
  readonly special?: string;
}

// ============================================================
// 近战武器（5把）
// ============================================================

/** 生锈铁剑 — 新手入门武器 */
export const RUSTY_SWORD: WeaponDef = {
  id: 'rusty_sword',
  name: '生锈铁剑',
  type: 'melee',
  subtype: 'sword',
  damage: 12,
  fireRate: 1.2,
  range: 45,
};

/** 战斧 — 高伤害重型武器，附带眩晕 */
export const BATTLE_AXE: WeaponDef = {
  id: 'battle_axe',
  name: '战斧',
  type: 'melee',
  subtype: 'axe',
  damage: 25,
  fireRate: 0.6,
  range: 50,
  knockback: 20,
  special: '15%概率眩晕敌人1秒',
};

/** 闪电匕首 — 极速攻击，闪电链跳 */
export const LIGHTNING_DAGGER: WeaponDef = {
  id: 'lightning_dagger',
  name: '闪电匕首',
  type: 'melee',
  subtype: 'dagger',
  element: 'thunder',
  damage: 8,
  fireRate: 3.0,
  range: 30,
  special: '闪电链跳2个额外目标',
};

/** 暗影之刃 — 高伤害，无视护甲 */
export const SHADOW_BLADE: WeaponDef = {
  id: 'shadow_blade',
  name: '暗影之刃',
  type: 'melee',
  subtype: 'sword',
  damage: 35,
  fireRate: 1.5,
  range: 55,
  special: '无视50%护甲',
};

/** 圣盾 — 防御型武器，附带格挡 */
export const HOLY_SHIELD: WeaponDef = {
  id: 'holy_shield',
  name: '圣盾',
  type: 'melee',
  subtype: 'shield',
  damage: 15,
  fireRate: 0.8,
  range: 40,
  special: '格挡50%正面伤害',
};

// ============================================================
// 远程武器（7把）
// ============================================================

/** 手枪 — 基础远程武器 */
export const PISTOL: WeaponDef = {
  id: 'pistol',
  name: '手枪',
  type: 'ranged',
  subtype: 'gun',
  damage: 10,
  fireRate: 2.5,
  range: 400,
  projectileSpeed: 480,
};

/** 霰弹枪 — 近距离散射 */
export const SHOTGUN: WeaponDef = {
  id: 'shotgun',
  name: '霰弹枪',
  type: 'ranged',
  subtype: 'gun',
  damage: 8,
  fireRate: 0.8,
  range: 200,
  projectileSpeed: 400,
  projectileCount: 5,
  spreadAngle: 30,
  knockback: 15,
};

/** 狙击步枪 — 超高伤害，穿透 */
export const SNIPER_RIFLE: WeaponDef = {
  id: 'sniper_rifle',
  name: '狙击步枪',
  type: 'ranged',
  subtype: 'gun',
  damage: 80,
  fireRate: 0.3,
  range: 800,
  projectileSpeed: 900,
  pierce: 3,
  knockback: 30,
};

/** 长弓 — 远程弓箭 */
export const LONG_BOW: WeaponDef = {
  id: 'long_bow',
  name: '长弓',
  type: 'ranged',
  subtype: 'bow',
  damage: 15,
  fireRate: 1.5,
  range: 500,
  projectileSpeed: 360,
};

/** 魔法杖 — 追踪魔法弹 */
export const MAGIC_STAFF: WeaponDef = {
  id: 'magic_staff',
  name: '魔法杖',
  type: 'ranged',
  subtype: 'staff',
  damage: 18,
  fireRate: 1.2,
  range: 350,
  projectileSpeed: 300,
  tracking: true,
};

/** 陨石法杖 — AOE 火焰伤害 */
export const METEOR_STAFF: WeaponDef = {
  id: 'meteor_staff',
  name: '陨石法杖',
  type: 'ranged',
  subtype: 'staff',
  element: 'fire',
  damage: 60,
  fireRate: 0.4,
  range: 300,
  projectileSpeed: 200,
  aoe: 80,
  knockback: 25,
  special: '落地时产生火焰区域，持续3秒',
};

/** 火箭筒 — 大范围爆炸 */
export const ROCKET_LAUNCHER: WeaponDef = {
  id: 'rocket_launcher',
  name: '火箭筒',
  type: 'ranged',
  subtype: 'launcher',
  element: 'fire',
  damage: 45,
  fireRate: 0.5,
  range: 500,
  projectileSpeed: 250,
  aoe: 100,
  knockback: 40,
  special: '爆炸产生火焰区域',
};

// ============================================================
// 特殊武器（3把）
// ============================================================

/** 追踪导弹炮 — 自动追踪 */
export const HOMING_MISSILE: WeaponDef = {
  id: 'homing_missile',
  name: '追踪导弹炮',
  type: 'special',
  subtype: 'launcher',
  damage: 30,
  fireRate: 0.8,
  range: 500,
  projectileSpeed: 350,
  tracking: true,
  aoe: 60,
  knockback: 20,
  special: '自动追踪最近敌人',
};

/** 自然之种 — 放置型持续伤害 */
export const NATURE_SEED: WeaponDef = {
  id: 'nature_seed',
  name: '自然之种',
  type: 'special',
  subtype: 'deployable',
  element: 'nature',
  damage: 10,
  fireRate: 0.2, // 放置频率
  range: 80,
  special: '放置后持续15秒，每秒对范围内敌人造成10点伤害',
};

/** 灵魂之镰 — 弧形范围攻击 */
export const SOUL_SCYTHE: WeaponDef = {
  id: 'soul_scythe',
  name: '灵魂之镰',
  type: 'special',
  subtype: 'scythe',
  damage: 40,
  fireRate: 1.0,
  range: 70,
  special: '弧形70px范围攻击，对低血量敌人伤害翻倍',
};

// ============================================================
// 武器注册表
// ============================================================

/** 所有武器定义（按 ID 索引） */
export const WEAPON_DEFS: ReadonlyMap<string, WeaponDef> = new Map<string, WeaponDef>([
  [RUSTY_SWORD.id, RUSTY_SWORD],
  [BATTLE_AXE.id, BATTLE_AXE],
  [LIGHTNING_DAGGER.id, LIGHTNING_DAGGER],
  [SHADOW_BLADE.id, SHADOW_BLADE],
  [HOLY_SHIELD.id, HOLY_SHIELD],
  [PISTOL.id, PISTOL],
  [SHOTGUN.id, SHOTGUN],
  [SNIPER_RIFLE.id, SNIPER_RIFLE],
  [LONG_BOW.id, LONG_BOW],
  [MAGIC_STAFF.id, MAGIC_STAFF],
  [METEOR_STAFF.id, METEOR_STAFF],
  [ROCKET_LAUNCHER.id, ROCKET_LAUNCHER],
  [HOMING_MISSILE.id, HOMING_MISSILE],
  [NATURE_SEED.id, NATURE_SEED],
  [SOUL_SCYTHE.id, SOUL_SCYTHE],
]);

/** 按类型分组获取武器列表 */
export function getWeaponsByType(type: WeaponType): WeaponDef[] {
  return Array.from(WEAPON_DEFS.values()).filter(w => w.type === type);
}

/** 根据 ID 获取武器定义 */
export function getWeaponDef(id: string): WeaponDef | undefined {
  return WEAPON_DEFS.get(id);
}

/** 获取所有武器定义 */
export function getAllWeaponDefs(): WeaponDef[] {
  return Array.from(WEAPON_DEFS.values());
}
