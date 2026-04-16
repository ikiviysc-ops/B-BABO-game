// CharacterRegistry.ts - 20角色注册表

import { CharacterPalette, CHARACTER_PALETTES, generateSprite } from './BaboSprite';
import { getCharacterAccessories } from './characters/accessories/registry';

export interface CharacterStats {
  hp: number;
  speed: number;
  armor: number;
  crit: number;
}

export interface PassiveSkill {
  name: string;
  desc: string;
  effect: string; // 标识符，供系统使用
}

export interface CharacterDef {
  id: string;
  name: string;
  nameEn: string;
  emotion: string;
  stats: CharacterStats;
  passive: PassiveSkill;
  initialWeapon: string;
  unlockCondition?: string;
}

export interface CharacterSprite {
  palette: CharacterPalette;
  pixels: string[][];
}

// ==================== 20角色完整定义 ====================

const CHARACTER_DEFS: CharacterDef[] = [
  {
    id: 'babo', name: 'BABO', nameEn: 'Babo', emotion: 'curious',
    stats: { hp: 100, speed: 200, armor: 0, crit: 5 },
    passive: { name: '好奇心', desc: '经验获取+15%', effect: 'xp_boost_15' },
    initialWeapon: 'fist',
  },
  {
    id: 'nabi', name: 'NABI', nameEn: 'Nabi', emotion: 'playful',
    stats: { hp: 90, speed: 230, armor: 0, crit: 10 },
    passive: { name: '猫之敏捷', desc: '闪避率+10%', effect: 'dodge_10' },
    initialWeapon: 'claw',
    unlockCondition: '击败100个敌人',
  },
  {
    id: 'doki', name: 'DOKI', nameEn: 'Doki', emotion: 'brave',
    stats: { hp: 120, speed: 180, armor: 5, crit: 8 },
    passive: { name: '勇气', desc: '生命低于30%时伤害+25%', effect: 'low_hp_dmg_25' },
    initialWeapon: 'sword',
  },
  {
    id: 'chaka', name: 'CHAKA', nameEn: 'Chaka', emotion: 'calm',
    stats: { hp: 95, speed: 210, armor: 3, crit: 12 },
    passive: { name: '隐匿', desc: '暴击伤害+30%', effect: 'crit_dmg_30' },
    initialWeapon: 'shuriken',
    unlockCondition: '存活超过10分钟',
  },
  {
    id: 'pudding', name: 'PUDDING', nameEn: 'Pudding', emotion: 'happy',
    stats: { hp: 130, speed: 170, armor: 8, crit: 3 },
    passive: { name: '弹性', desc: '受到伤害减少10%', effect: 'dmg_reduce_10' },
    initialWeapon: 'bat',
    unlockCondition: '达到5级',
  },
  {
    id: 'mochi', name: 'MOCHI', nameEn: 'Mochi', emotion: 'sleepy',
    stats: { hp: 110, speed: 190, armor: 2, crit: 7 },
    passive: { name: '治愈光环', desc: '每秒恢复0.5%最大生命', effect: 'regen_05' },
    initialWeapon: 'wand',
    unlockCondition: '使用治疗道具20次',
  },
  {
    id: 'thunder', name: 'THUNDER', nameEn: 'Thunder', emotion: 'excited',
    stats: { hp: 85, speed: 240, armor: 0, crit: 15 },
    passive: { name: '雷电', desc: '攻击有20%几率连锁1个额外目标', effect: 'chain_20' },
    initialWeapon: 'thunder_spear',
    unlockCondition: '击败Boss',
  },
  {
    id: 'luna', name: 'LUNA', nameEn: 'Luna', emotion: 'mysterious',
    stats: { hp: 90, speed: 200, armor: 3, crit: 10 },
    passive: { name: '月光', desc: '夜间伤害+20%', effect: 'night_dmg_20' },
    initialWeapon: 'moon_blade',
    unlockCondition: '收集50个月光碎片',
  },
  {
    id: 'blaze', name: 'BLAZE', nameEn: 'Blaze', emotion: 'angry',
    stats: { hp: 95, speed: 220, armor: 2, crit: 12 },
    passive: { name: '燃烧', desc: '攻击附带3秒灼烧(每秒5伤害)', effect: 'burn_3s' },
    initialWeapon: 'fire_staff',
    unlockCondition: '累计造成1000点火焰伤害',
  },
  {
    id: 'frost', name: 'FROST', nameEn: 'Frost', emotion: 'cold',
    stats: { hp: 100, speed: 195, armor: 5, crit: 8 },
    passive: { name: '冰冻', desc: '攻击有15%几率冻结敌人1秒', effect: 'freeze_15' },
    initialWeapon: 'ice_bow',
    unlockCondition: '冻结50个敌人',
  },
  {
    id: 'shadow', name: 'SHADOW', nameEn: 'Shadow', emotion: 'dark',
    stats: { hp: 80, speed: 250, armor: 1, crit: 20 },
    passive: { name: '暗影步', desc: '击杀后2秒内移速+50%', effect: 'kill_speed_50' },
    initialWeapon: 'shadow_dagger',
    unlockCondition: '累计击杀500个敌人',
  },
  {
    id: 'cotton', name: 'COTTON', nameEn: 'Cotton', emotion: 'soft',
    stats: { hp: 140, speed: 160, armor: 10, crit: 2 },
    passive: { name: '棉花护盾', desc: '每30秒获得一层护盾(吸收10伤害)', effect: 'shield_10_30s' },
    initialWeapon: 'cotton_cannon',
    unlockCondition: '承受1000点伤害',
  },
  {
    id: 'rock', name: 'ROCK', nameEn: 'Rock', emotion: 'stubborn',
    stats: { hp: 160, speed: 150, armor: 15, crit: 3 },
    passive: { name: '岩石体质', desc: '护甲值额外+5', effect: 'armor_5' },
    initialWeapon: 'hammer',
    unlockCondition: '达到10级',
  },
  {
    id: 'spirit', name: 'SPIRIT', nameEn: 'Spirit', emotion: 'ethereal',
    stats: { hp: 75, speed: 260, armor: 0, crit: 15 },
    passive: { name: '灵魂穿透', desc: '投射物穿透+1', effect: 'pierce_1' },
    initialWeapon: 'spirit_orb',
    unlockCondition: '使用魔法武器击杀200个敌人',
  },
  {
    id: 'berry', name: 'BERRY', nameEn: 'Berry', emotion: 'sweet',
    stats: { hp: 95, speed: 200, armor: 3, crit: 10 },
    passive: { name: '莓果能量', desc: '拾取道具时恢复5HP', effect: 'pickup_heal_5' },
    initialWeapon: 'berry_bomb',
    unlockCondition: '拾取100个道具',
  },
  {
    id: 'pixel', name: 'PIXEL', nameEn: 'Pixel', emotion: 'retro',
    stats: { hp: 100, speed: 200, armor: 2, crit: 8 },
    passive: { name: '像素化', desc: '攻击速度+15%', effect: 'atk_speed_15' },
    initialWeapon: 'pixel_gun',
    unlockCondition: '游玩时间超过1小时',
  },
  {
    id: 'nova', name: 'NOVA', nameEn: 'Nova', emotion: 'radiant',
    stats: { hp: 90, speed: 210, armor: 4, crit: 12 },
    passive: { name: '超新星', desc: '每第10次攻击造成AOE爆炸', effect: 'aoe_every_10' },
    initialWeapon: 'star_blaster',
    unlockCondition: '达到15级',
  },
  {
    id: 'storm', name: 'STORM', nameEn: 'Storm', emotion: 'fierce',
    stats: { hp: 105, speed: 215, armor: 6, crit: 10 },
    passive: { name: '风暴', desc: '周围敌人持续受到每秒3点伤害', effect: 'aura_dmg_3' },
    initialWeapon: 'storm_ring',
    unlockCondition: '存活超过20分钟',
  },
  {
    id: 'honey', name: 'HONEY', nameEn: 'Honey', emotion: 'warm',
    stats: { hp: 120, speed: 185, armor: 7, crit: 5 },
    passive: { name: '甜蜜', desc: '队友(召唤物)伤害+20%', effect: 'summon_dmg_20' },
    initialWeapon: 'honey_pot',
    unlockCondition: '召唤10个友方单位',
  },
  {
    id: 'cosmic', name: 'COSMIC', nameEn: 'Cosmic', emotion: 'infinite',
    stats: { hp: 88, speed: 235, armor: 3, crit: 18 },
    passive: { name: '宇宙之力', desc: '所有属性随时间缓慢增长(每分钟+1%)', effect: 'scaling_1_min' },
    initialWeapon: 'cosmic_ray',
    unlockCondition: '通关一次游戏',
  },
];

// ==================== 注册表方法 ====================

const defMap = new Map<string, CharacterDef>();
const spriteCache = new Map<string, CharacterSprite>();

for (const def of CHARACTER_DEFS) {
  defMap.set(def.id, def);
}

/**
 * 获取角色定义
 */
export function getDef(id: string): CharacterDef | undefined {
  return defMap.get(id);
}

/**
 * 获取角色精灵数据(带缓存)
 */
export function getSprite(id: string): CharacterSprite | undefined {
  if (spriteCache.has(id)) return spriteCache.get(id);
  const palette = CHARACTER_PALETTES[id];
  if (!palette) return undefined;
  const sprite: CharacterSprite = {
    palette,
    pixels: generateSprite(palette),
  };
  spriteCache.set(id, sprite);
  return sprite;
}

/**
 * 获取所有角色ID
 */
export function getAllIds(): string[] {
  return CHARACTER_DEFS.map(d => d.id);
}

/**
 * 渲染角色到Canvas (简化版)
 * @param ctx Canvas上下文
 * @param id 角色ID
 * @param x 渲染位置X
 * @param y 渲染位置Y
 * @param scale 缩放倍数
 */
export function renderCharacter(
  ctx: CanvasRenderingContext2D,
  id: string,
  x: number,
  y: number,
  scale: number = 2
): void {
  const sprite = getSprite(id);
  if (!sprite) return;

  const pixelSize = scale;

  // 渲染角色本身
  for (let row = 0; row < 32; row++) {
    for (let col = 0; col < 32; col++) {
      const color = sprite.pixels[row][col];
      if (color === 'transparent') continue;
      ctx.fillStyle = color;
      ctx.fillRect(
        x + col * pixelSize,
        y + row * pixelSize,
        pixelSize,
        pixelSize
      );
    }
  }

  // 渲染角色配饰
  const accessories = getCharacterAccessories(id);
  if (accessories) {
    for (const accessory of accessories.accessories) {
      const accessoryX = x + accessory.offsetX * scale;
      const accessoryY = y + accessory.offsetY * scale;
      
      for (let row = 0; row < 32; row++) {
        for (let col = 0; col < 32; col++) {
          const color = accessory.sprite[row][col];
          if (color === 'transparent') continue;
          ctx.fillStyle = color;
          ctx.fillRect(
            accessoryX + col * pixelSize,
            accessoryY + row * pixelSize,
            pixelSize,
            pixelSize
          );
        }
      }
    }
  }
}

export { CHARACTER_DEFS };
