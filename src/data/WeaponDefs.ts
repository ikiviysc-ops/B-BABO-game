// WeaponDefs.ts - 15把武器定义

export type WeaponType = 'melee' | 'ranged' | 'special';

export interface WeaponDef {
  id: string;
  name: string;
  type: WeaponType;
  damage: number;
  fireRate: number;       // 攻击间隔(秒)
  range: number;          // 攻击范围(像素)
  pierce?: number;        // 穿透次数
  projectileCount?: number; // 同时发射数
  aoe?: number;           // AOE范围
  element?: string;       // 元素属性
  tracking?: boolean;     // 追踪
  special?: string;       // 特殊效果标识
  projectileSpeed?: number; // 投射物速度
  color?: string;         // 显示颜色
  size?: number;          // 投射物大小
}

// ==================== 15把武器完整数据 ====================

const WEAPON_DEFS_DATA: WeaponDef[] = [
  // === 近战武器 ===
  {
    id: 'fist',
    name: '拳头',
    type: 'melee',
    damage: 8,
    fireRate: 0.4,
    range: 40,
    color: '#FFD5A5',
    size: 12,
  },
  {
    id: 'sword',
    name: '铁剑',
    type: 'melee',
    damage: 15,
    fireRate: 0.5,
    range: 55,
    color: '#C0C0C0',
    size: 16,
  },
  {
    id: 'claw',
    name: '猫爪',
    type: 'melee',
    damage: 10,
    fireRate: 0.25,
    range: 35,
    projectileCount: 3,
    color: '#FF69B4',
    size: 10,
  },
  {
    id: 'bat',
    name: '棒球棒',
    type: 'melee',
    damage: 22,
    fireRate: 0.7,
    range: 50,
    aoe: 30,
    special: 'knockback',
    color: '#8B4513',
    size: 18,
  },
  {
    id: 'hammer',
    name: '大锤',
    type: 'melee',
    damage: 35,
    fireRate: 1.0,
    range: 45,
    aoe: 50,
    special: 'stun_1s',
    color: '#808080',
    size: 22,
  },
  // === 远程武器 ===
  {
    id: 'shuriken',
    name: '手里剑',
    type: 'ranged',
    damage: 8,
    fireRate: 0.2,
    range: 200,
    projectileCount: 3,
    projectileSpeed: 350,
    pierce: 1,
    color: '#C0C0C0',
    size: 6,
  },
  {
    id: 'ice_bow',
    name: '冰弓',
    type: 'ranged',
    damage: 12,
    fireRate: 0.5,
    range: 280,
    projectileSpeed: 400,
    pierce: 0,
    element: 'ice',
    special: 'slow_30',
    color: '#87CEEB',
    size: 5,
  },
  {
    id: 'fire_staff',
    name: '火焰杖',
    type: 'ranged',
    damage: 18,
    fireRate: 0.6,
    range: 250,
    projectileSpeed: 300,
    aoe: 40,
    element: 'fire',
    special: 'burn_3s',
    color: '#FF4500',
    size: 8,
  },
  {
    id: 'pixel_gun',
    name: '像素枪',
    type: 'ranged',
    damage: 6,
    fireRate: 0.1,
    range: 220,
    projectileSpeed: 500,
    pierce: 0,
    color: '#00FF00',
    size: 4,
  },
  {
    id: 'star_blaster',
    name: '星光炮',
    type: 'ranged',
    damage: 25,
    fireRate: 0.8,
    range: 300,
    projectileSpeed: 350,
    aoe: 60,
    pierce: 2,
    color: '#FFD700',
    size: 10,
  },
  // === 特殊武器 ===
  {
    id: 'wand',
    name: '治愈魔杖',
    type: 'special',
    damage: 5,
    fireRate: 0.8,
    range: 150,
    projectileSpeed: 200,
    special: 'heal_3',
    tracking: true,
    color: '#FF69B4',
    size: 7,
  },
  {
    id: 'thunder_spear',
    name: '雷电矛',
    type: 'special',
    damage: 30,
    fireRate: 1.2,
    range: 180,
    projectileSpeed: 600,
    pierce: 3,
    element: 'thunder',
    special: 'chain_2',
    color: '#00BFFF',
    size: 8,
  },
  {
    id: 'shadow_dagger',
    name: '暗影匕首',
    type: 'special',
    damage: 20,
    fireRate: 0.3,
    range: 120,
    projectileSpeed: 450,
    pierce: 1,
    special: 'lifesteal_10',
    color: '#4A0080',
    size: 5,
  },
  {
    id: 'cotton_cannon',
    name: '棉花炮',
    type: 'special',
    damage: 15,
    fireRate: 0.9,
    range: 250,
    projectileSpeed: 200,
    aoe: 70,
    special: 'slow_50',
    color: '#FFC0CB',
    size: 14,
  },
  {
    id: 'cosmic_ray',
    name: '宇宙射线',
    type: 'special',
    damage: 40,
    fireRate: 1.5,
    range: 350,
    projectileSpeed: 500,
    pierce: 5,
    tracking: true,
    aoe: 45,
    color: '#7B68EE',
    size: 9,
  },
];

// ==================== 导出 ====================

export const WEAPON_DEFS: Map<string, WeaponDef> = new Map();
for (const def of WEAPON_DEFS_DATA) {
  WEAPON_DEFS.set(def.id, def);
}

export function getWeaponDef(id: string): WeaponDef | undefined {
  return WEAPON_DEFS.get(id);
}

export function getAllWeaponIds(): string[] {
  return WEAPON_DEFS_DATA.map(d => d.id);
}

export { WEAPON_DEFS_DATA };
