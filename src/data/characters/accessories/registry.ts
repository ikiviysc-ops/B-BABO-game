// src/data/characters/accessories/registry.ts

import { CharacterAccessories } from './types';
import { amnesiaBrush } from './amnesia_brush';

/**
 * 角色配饰注册表
 */
const accessoryRegistry: CharacterAccessories[] = [
  {
    characterId: 'amnesia',
    accessories: [amnesiaBrush]
  }
];

const accessoryMap = new Map<string, CharacterAccessories>();

for (const item of accessoryRegistry) {
  accessoryMap.set(item.characterId, item);
}

/**
 * 根据角色ID获取配饰
 */
export function getCharacterAccessories(characterId: string): CharacterAccessories | undefined {
  return accessoryMap.get(characterId);
}

/**
 * 检查角色是否有配饰
 */
export function hasCharacterAccessories(characterId: string): boolean {
  return accessoryMap.has(characterId);
}

export { accessoryRegistry };
