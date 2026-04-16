// Projectile.ts - 投射物定义

/**
 * 投射物数据接口
 * 与 ProjectilePool.ts 中的 Projectile 接口兼容
 */
export interface ProjectileData {
  x: number;
  y: number;
  vx: number;
  vy: number;
  dmg: number;
  life: number;
  maxLife: number;
  pierce: number;
  active: boolean;
  size: number;
  color: string;
  type: string;
  owner: string;
}

/**
 * 创建默认投射物数据
 */
export function createProjectileData(
  overrides: Partial<ProjectileData> & { x: number; y: number }
): ProjectileData {
  return {
    vx: 0,
    vy: 0,
    dmg: 10,
    life: 2,
    maxLife: 2,
    pierce: 0,
    active: true,
    size: 4,
    color: '#ffffff',
    type: 'bullet',
    owner: 'player',
    ...overrides,
  };
}

/**
 * 投射物类型枚举
 */
export type ProjectileType =
  | 'bullet'
  | 'shuriken'
  | 'arrow'
  | 'fireball'
  | 'ice_shard'
  | 'lightning'
  | 'heal_orb'
  | 'star'
  | 'cotton_ball'
  | 'cosmic_beam'
  | 'enemy_fireball'
  | 'melee_swing';

/**
 * 投射物元素类型
 */
export type ProjectileElement =
  | 'none'
  | 'fire'
  | 'ice'
  | 'thunder'
  | 'shadow'
  | 'holy';

/**
 * 投射物配置(用于生成时的模板)
 */
export interface ProjectileConfig {
  type: ProjectileType;
  element?: ProjectileElement;
  damage: number;
  speed: number;
  life: number;
  pierce: number;
  size: number;
  color: string;
  aoe?: number;
  tracking?: boolean;
  special?: string;
}
