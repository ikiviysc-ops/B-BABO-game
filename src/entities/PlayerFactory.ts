/**
 * 角色工厂 - 创建 B-BABO 系列角色实体
 */

import { EntityManager, type Entity } from '@engine/EntityManager';
import { renderPixelSprite, PALETTES, type PaletteKey } from '@engine/PixelRenderer';
import { BABO_BASE_SPRITE } from '@entities/BaboSprite';

/** 角色定义 */
interface CharacterDef {
  id: string;
  name: string;
  palette: PaletteKey;
  speed: number;
  hp: number;
  description: string;
}

/** B-BABO 角色库 */
const CHARACTERS: Record<string, CharacterDef> = {
  babo_fire: {
    id: 'babo_fire',
    name: '烈焰 B-BABO',
    palette: 'fire',
    speed: 200,
    hp: 100,
    description: '火属性 B-BABO，热情如焰',
  },
  babo_ice: {
    id: 'babo_ice',
    name: '寒冰 B-BABO',
    palette: 'ice',
    speed: 180,
    hp: 120,
    description: '冰属性 B-BABO，冷静如霜',
  },
  babo_thunder: {
    id: 'babo_thunder',
    name: '雷电 B-BABO',
    palette: 'thunder',
    speed: 220,
    hp: 90,
    description: '雷属性 B-BABO，迅如闪电',
  },
  babo_nature: {
    id: 'babo_nature',
    name: '自然 B-BABO',
    palette: 'nature',
    speed: 190,
    hp: 110,
    description: '自然属性 B-BABO，生生不息',
  },
};

export class PlayerFactory {
  /** 创建 B-BABO 角色实体 */
  static createBabo(charId: string): Entity {
    const def = CHARACTERS[charId];
    if (!def) {
      console.warn(`[PlayerFactory] Unknown character: ${charId}, using default`);
      return PlayerFactory.createBabo('babo_fire');
    }

    const palette = PALETTES[def.palette];
    // 渲染 3x 放大精灵 (32×32 → 96×96)
    const sprite = renderPixelSprite(BABO_BASE_SPRITE, palette, 3);

    return {
      id: EntityManager.nextId(),
      x: 500,
      y: 500,
      width: 96,
      height: 96,
      sprite,
      active: true,
      speed: def.speed,
    };
  }

  /** 获取所有可用角色 */
  static getCharacterList(): CharacterDef[] {
    return Object.values(CHARACTERS);
  }
}
