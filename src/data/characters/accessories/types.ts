// src/data/characters/accessories/types.ts

/**
 * 配饰类型
 */
export enum AccessoryType {
  HEAD = 'head',
  BODY = 'body',
  HAND = 'hand',
  FOOT = 'foot',
  BACK = 'back',
  SPECIAL = 'special'
}

/**
 * 配饰接口
 */
export interface Accessory {
  id: string;
  name: string;
  type: AccessoryType;
  sprite: string[][]; // 32x32像素的配饰精灵
  offsetX: number; // 相对于角色中心点的X偏移
  offsetY: number; // 相对于角色中心点的Y偏移
  colorizable?: boolean; // 是否可染色
  glowEffect?: boolean; // 是否有发光效果
}

/**
 * 角色配饰接口
 */
export interface CharacterAccessories {
  characterId: string;
  accessories: Accessory[];
}
