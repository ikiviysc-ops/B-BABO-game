/**
 * 投射物实体定义
 *
 * 所有飞行中的武器投射物（子弹、箭矢、魔法弹、火箭等）的统一数据结构。
 * 配合 ProjectilePool 使用，通过对象池管理生命周期。
 */

/** 投射物类型 */
export type ProjectileType = 'bullet' | 'arrow' | 'magic' | 'rocket' | 'melee_arc' | 'explosion';

/** 元素属性 */
export type Element = 'fire' | 'ice' | 'thunder' | 'nature';

/** 投射物定义 — 可变数据，由 ProjectilePool 管理 */
export interface ProjectileDef {
  /** 唯一 ID（池内递增） */
  id: number;
  /** 世界坐标 X */
  x: number;
  /** 世界坐标 Y */
  y: number;
  /** 速度 X（像素/秒） */
  vx: number;
  /** 速度 Y（像素/秒） */
  vy: number;
  /** 碰撞盒宽度 */
  width: number;
  /** 碰撞盒高度 */
  height: number;
  /** 基础伤害 */
  damage: number;
  /** 穿透次数（0 = 命中即销毁，>0 = 可穿透 N 个目标） */
  pierce: number;
  /** 最大存活时间（秒） */
  lifetime: number;
  /** 已存活时间（秒） */
  age: number;
  /** 是否活跃 */
  active: boolean;
  /** 投射物类型 */
  type: ProjectileType;
  /** 元素属性（可选） */
  element?: Element;
  /** 爆炸范围（像素，0 = 无爆炸） */
  aoe: number;
  /** 击退距离（像素） */
  knockback: number;
  /** 精灵图（可选，无则用默认渲染） */
  sprite?: HTMLCanvasElement;
  /** 所属阵营 */
  owner: 'player' | 'enemy';
  /** 武器子类（用于渲染不同特效） */
  weaponSubtype?: string;
  /** 武器ID（精确区分每把武器） */
  weaponId?: string;
}

/** 创建一个默认的投射物（用于对象池工厂） */
export function createDefaultProjectile(): ProjectileDef {
  return {
    id: 0,
    x: 0,
    y: 0,
    vx: 0,
    vy: 0,
    width: 8,
    height: 8,
    damage: 0,
    pierce: 0,
    lifetime: 2,
    age: 0,
    active: false,
    type: 'bullet',
    aoe: 0,
    knockback: 0,
    owner: 'player',
  };
}

/** 重置投射物到默认状态（用于对象池回收） */
export function resetProjectile(proj: ProjectileDef): void {
  proj.id = 0;
  proj.x = 0;
  proj.y = 0;
  proj.vx = 0;
  proj.vy = 0;
  proj.width = 8;
  proj.height = 8;
  proj.damage = 0;
  proj.pierce = 0;
  proj.lifetime = 2;
  proj.age = 0;
  proj.active = false;
  proj.type = 'bullet';
  proj.element = undefined;
  proj.aoe = 0;
  proj.knockback = 0;
  proj.sprite = undefined;
  proj.owner = 'player';
  proj.weaponSubtype = undefined;
  proj.weaponId = undefined;
}
