// BaboSprite.ts - HIRONO风格基础精灵模板 + 20角色调色板

/**
 * 32x32 像素精灵，使用语义化调色板键
 * 键值说明:
 *   _ = 透明
 *   h = 头发
 *   s = 皮肤
 *   e = 眼睛
 *   o = 服装主体
 *   O = 服装阴影
 *   a = 强调色/装饰
 *   S = 鞋子
 *   w = 白色(眼白/高光)
 *   b = 黑色(瞳孔/轮廓)
 *   p = 嘴巴/腮红
 */

export interface CharacterPalette {
  hair: string;
  skin: string;
  eye: string;
  outfit: string;
  outfitShadow: string;
  accent: string;
  shoe: string;
  white: string;
  black: string;
  mouth: string;
}

export const PALETTE_KEY_MAP: Record<string, keyof CharacterPalette> = {
  '_': 'hair' as any, // transparent - won't be used
  'h': 'hair',
  's': 'skin',
  'e': 'eye',
  'o': 'outfit',
  'O': 'outfitShadow',
  'a': 'accent',
  'S': 'shoe',
  'w': 'white',
  'b': 'black',
  'p': 'mouth',
};

// 32x32 基础精灵模板 (HIRONO风格: 圆头+小身体+大眼睛)
// 每行32个字符，每个字符对应一个调色板键
export const BASE_SPRITE: string[][] = [
  // Row 0-2: 头顶头发
  ['_','_','_','_','_','_','_','_','_','_','_','h','h','h','h','h','h','h','h','h','h','_','_','_','_','_','_','_','_','_','_','_'],
  ['_','_','_','_','_','_','_','_','_','h','h','h','h','h','h','h','h','h','h','h','h','h','h','_','_','_','_','_','_','_','_','_'],
  ['_','_','_','_','_','_','_','_','h','h','h','h','h','h','h','h','h','h','h','h','h','h','h','h','_','_','_','_','_','_','_','_'],
  // Row 3-5: 头部(头发+脸)
  ['_','_','_','_','_','_','_','h','h','h','h','h','h','h','h','h','h','h','h','h','h','h','h','h','h','_','_','_','_','_','_','_'],
  ['_','_','_','_','_','_','h','h','h','s','s','s','s','s','s','s','s','s','s','s','s','s','h','h','h','_','_','_','_','_','_','_'],
  ['_','_','_','_','_','h','h','h','s','s','s','s','s','s','s','s','s','s','s','s','s','s','s','h','h','h','_','_','_','_','_','_'],
  // Row 6-8: 眼睛区域
  ['_','_','_','_','_','h','h','s','s','s','s','s','s','s','s','s','s','s','s','s','s','s','s','s','h','h','_','_','_','_','_','_'],
  ['_','_','_','_','_','h','s','s','s','w','w','e','e','e','e','s','s','w','w','e','e','e','e','s','s','h','_','_','_','_','_','_'],
  ['_','_','_','_','_','h','s','s','s','w','b','b','e','e','e','s','s','w','b','b','e','e','e','s','s','h','_','_','_','_','_','_'],
  // Row 9-10: 脸下部(嘴巴+腮红)
  ['_','_','_','_','_','h','s','s','s','s','s','s','s','s','s','s','s','s','s','s','s','s','s','s','s','h','_','_','_','_','_','_'],
  ['_','_','_','_','_','_','h','s','s','s','s','p','p','s','s','s','s','s','p','p','s','s','s','s','h','_','_','_','_','_','_','_'],
  // Row 11-12: 下巴+脖子
  ['_','_','_','_','_','_','_','h','h','s','s','s','s','s','s','s','s','s','s','s','s','s','h','h','_','_','_','_','_','_','_','_'],
  ['_','_','_','_','_','_','_','_','_','s','s','s','s','s','s','s','s','s','s','s','s','s','_','_','_','_','_','_','_','_','_','_'],
  // Row 13-14: 身体上部(衣服)
  ['_','_','_','_','_','_','_','_','_','_','o','o','o','o','o','o','o','o','o','o','o','_','_','_','_','_','_','_','_','_','_','_'],
  ['_','_','_','_','_','_','_','_','_','o','o','o','o','a','o','o','o','a','o','o','o','o','_','_','_','_','_','_','_','_','_','_'],
  // Row 15-16: 身体中部
  ['_','_','_','_','_','_','_','_','o','o','o','o','o','o','o','o','o','o','o','o','o','o','o','_','_','_','_','_','_','_','_','_'],
  ['_','_','_','_','_','_','_','_','o','o','o','o','o','o','o','o','o','o','o','o','o','o','o','_','_','_','_','_','_','_','_','_'],
  // Row 17-18: 身体下部(衣服阴影)
  ['_','_','_','_','_','_','_','_','o','O','o','o','o','o','o','o','o','o','o','o','o','O','o','_','_','_','_','_','_','_','_','_'],
  ['_','_','_','_','_','_','_','_','_','O','O','o','o','o','o','o','o','o','o','O','O','_','_','_','_','_','_','_','_','_','_','_'],
  // Row 19-20: 手臂+腰部
  ['_','_','_','_','_','_','_','s','s','O','_','o','o','o','o','o','o','o','o','_','O','s','s','_','_','_','_','_','_','_','_','_'],
  ['_','_','_','_','_','_','_','_','s','_','_','O','O','o','o','o','o','O','O','_','_','s','_','_','_','_','_','_','_','_','_','_'],
  // Row 21-22: 腿部
  ['_','_','_','_','_','_','_','_','_','_','_','_','O','o','o','o','o','O','_','_','_','_','_','_','_','_','_','_','_','_','_','_'],
  ['_','_','_','_','_','_','_','_','_','_','_','_','_','o','o','o','o','_','_','_','_','_','_','_','_','_','_','_','_','_','_','_'],
  // Row 23-24: 腿下部
  ['_','_','_','_','_','_','_','_','_','_','_','_','_','o','o','o','o','_','_','_','_','_','_','_','_','_','_','_','_','_','_','_'],
  ['_','_','_','_','_','_','_','_','_','_','_','_','_','o','o','o','o','_','_','_','_','_','_','_','_','_','_','_','_','_','_','_'],
  // Row 25-26: 脚部
  ['_','_','_','_','_','_','_','_','_','_','_','_','S','S','S','S','S','S','_','_','_','_','_','_','_','_','_','_','_','_','_','_'],
  ['_','_','_','_','_','_','_','_','_','_','_','_','S','S','S','S','S','S','_','_','_','_','_','_','_','_','_','_','_','_','_','_'],
  // Row 27-31: 空白
  ['_','_','_','_','_','_','_','_','_','_','_','_','_','_','_','_','_','_','_','_','_','_','_','_','_','_','_','_','_','_','_','_'],
  ['_','_','_','_','_','_','_','_','_','_','_','_','_','_','_','_','_','_','_','_','_','_','_','_','_','_','_','_','_','_','_','_'],
  ['_','_','_','_','_','_','_','_','_','_','_','_','_','_','_','_','_','_','_','_','_','_','_','_','_','_','_','_','_','_','_','_'],
  ['_','_','_','_','_','_','_','_','_','_','_','_','_','_','_','_','_','_','_','_','_','_','_','_','_','_','_','_','_','_','_','_'],
  ['_','_','_','_','_','_','_','_','_','_','_','_','_','_','_','_','_','_','_','_','_','_','_','_','_','_','_','_','_','_','_','_'],
];

/**
 * 根据调色板生成32x32像素数据
 * @param palette 角色调色板
 * @returns 32x32颜色字符串数组
 */
export function generateSprite(palette: CharacterPalette): string[][] {
  const result: string[][] = [];
  for (let y = 0; y < 32; y++) {
    const row: string[] = [];
    for (let x = 0; x < 32; x++) {
      const key = BASE_SPRITE[y]?.[x] ?? '_';
      if (key === '_') {
        row.push('transparent');
      } else {
        const colorKey = PALETTE_KEY_MAP[key];
        row.push(palette[colorKey] ?? '#ff00ff');
      }
    }
    result.push(row);
  }
  return result;
}

// ==================== 20个角色调色板 ====================

export const CHARACTER_PALETTES: Record<string, CharacterPalette> = {
  // 1. BABO - 经典棕色
  babo: {
    hair: '#8B6914', skin: '#FFD5A5', eye: '#4A2800',
    outfit: '#E8A020', outfitShadow: '#B87A10', accent: '#FFD700',
    shoe: '#6B4400', white: '#FFFFFF', black: '#1A1A1A', mouth: '#FF9999',
  },
  // 2. NABI - 粉色猫耳少女
  nabi: {
    hair: '#FF69B4', skin: '#FFE4D0', eye: '#FF1493',
    outfit: '#FFB6C1', outfitShadow: '#FF85A2', accent: '#FF1493',
    shoe: '#CC5577', white: '#FFFFFF', black: '#2D1B2D', mouth: '#FF6B8A',
  },
  // 3. DOKI - 红色战士
  doki: {
    hair: '#CC2200', skin: '#FFDAB0', eye: '#FF3300',
    outfit: '#DD3311', outfitShadow: '#AA2200', accent: '#FF6600',
    shoe: '#881100', white: '#FFFFFF', black: '#1A0000', mouth: '#FF6644',
  },
  // 4. CHAKA - 绿色忍者
  chaka: {
    hair: '#228B22', skin: '#FFE0B2', eye: '#00AA00',
    outfit: '#2E8B57', outfitShadow: '#1B5E3A', accent: '#00FF88',
    shoe: '#0D3D1A', white: '#FFFFFF', black: '#0A1A0A', mouth: '#66BB6A',
  },
  // 5. PUDDING - 黄色甜心
  pudding: {
    hair: '#FFD700', skin: '#FFF3D6', eye: '#FFAA00',
    outfit: '#FFEC8B', outfitShadow: '#DAA520', accent: '#FFF8DC',
    shoe: '#B8860B', white: '#FFFFFF', black: '#2D2200', mouth: '#FFB347',
  },
  // 6. MOCHI - 白色软萌
  mochi: {
    hair: '#F5F5F5', skin: '#FFF8F0', eye: '#B0C4DE',
    outfit: '#FFFFFF', outfitShadow: '#D3D3D3', accent: '#E0E0FF',
    shoe: '#A9A9A9', white: '#FFFFFF', black: '#333333', mouth: '#FFB6C1',
  },
  // 7. THUNDER - 蓝色雷电
  thunder: {
    hair: '#1E90FF', skin: '#FFE4C4', eye: '#0044CC',
    outfit: '#4169E1', outfitShadow: '#27408B', accent: '#00BFFF',
    shoe: '#191970', white: '#FFFFFF', black: '#000033', mouth: '#87CEEB',
  },
  // 8. LUNA - 紫色月光
  luna: {
    hair: '#9370DB', skin: '#F5E6F0', eye: '#7B2FBE',
    outfit: '#8A2BE2', outfitShadow: '#6A1B9A', accent: '#DDA0DD',
    shoe: '#4A148C', white: '#FFFFFF', black: '#1A002E', mouth: '#CE93D8',
  },
  // 9. BLAZE - 橙色火焰
  blaze: {
    hair: '#FF6600', skin: '#FFE0C0', eye: '#FF4500',
    outfit: '#FF8C00', outfitShadow: '#CC6600', accent: '#FFD700',
    shoe: '#8B4000', white: '#FFFFFF', black: '#1A0A00', mouth: '#FF7043',
  },
  // 10. FROST - 冰蓝
  frost: {
    hair: '#ADD8E6', skin: '#F0F8FF', eye: '#4682B4',
    outfit: '#87CEEB', outfitShadow: '#5F9EA0', accent: '#E0FFFF',
    shoe: '#2F4F4F', white: '#FFFFFF', black: '#1A2A2A', mouth: '#B0E0E6',
  },
  // 11. SHADOW - 暗黑刺客
  shadow: {
    hair: '#2C2C2C', skin: '#D2B48C', eye: '#FF0000',
    outfit: '#333333', outfitShadow: '#1A1A1A', accent: '#8B0000',
    shoe: '#0A0A0A', white: '#CCCCCC', black: '#000000', mouth: '#880000',
  },
  // 12. COTTON - 粉色棉花糖
  cotton: {
    hair: '#FFB6C1', skin: '#FFF0F5', eye: '#DB7093',
    outfit: '#FFC0CB', outfitShadow: '#FF69B4', accent: '#FFF0F5',
    shoe: '#C71585', white: '#FFFFFF', black: '#2D1B30', mouth: '#FF85A2',
  },
  // 13. ROCK - 灰色岩石
  rock: {
    hair: '#696969', skin: '#DEB887', eye: '#556B2F',
    outfit: '#808080', outfitShadow: '#555555', accent: '#A0A0A0',
    shoe: '#3D3D3D', white: '#F0F0F0', black: '#1A1A1A', mouth: '#BC8F8F',
  },
  // 14. SPIRIT - 幽灵白
  spirit: {
    hair: '#E8E8F0', skin: '#F0F0FF', eye: '#6A5ACD',
    outfit: '#E6E6FA', outfitShadow: '#C8C8E0', accent: '#B0C4DE',
    shoe: '#9370DB', white: '#FFFFFF', black: '#2E2E4E', mouth: '#DDA0DD',
  },
  // 15. BERRY - 莓果紫红
  berry: {
    hair: '#8B008B', skin: '#FFE4E1', eye: '#C71585',
    outfit: '#9932CC', outfitShadow: '#722F99', accent: '#FF1493',
    shoe: '#4B0082', white: '#FFFFFF', black: '#1A001A', mouth: '#DB7093',
  },
  // 16. PIXEL - 像素绿
  pixel: {
    hair: '#00FF00', skin: '#F0FFF0', eye: '#00CC00',
    outfit: '#32CD32', outfitShadow: '#228B22', accent: '#7FFF00',
    shoe: '#006400', white: '#FFFFFF', black: '#001A00', mouth: '#90EE90',
  },
  // 17. NOVA - 星光金
  nova: {
    hair: '#DAA520', skin: '#FFF8DC', eye: '#FF8C00',
    outfit: '#FFD700', outfitShadow: '#B8860B', accent: '#FFFACD',
    shoe: '#8B6914', white: '#FFFFFF', black: '#1A1200', mouth: '#FFD700',
  },
  // 18. STORM - 深蓝风暴
  storm: {
    hair: '#191970', skin: '#E8E0F0', eye: '#4169E1',
    outfit: '#000080', outfitShadow: '#00004D', accent: '#6495ED',
    shoe: '#000033', white: '#FFFFFF', black: '#000000', mouth: '#6495ED',
  },
  // 19. HONEY - 蜂蜜棕
  honey: {
    hair: '#CD853F', skin: '#FFE4C4', eye: '#A0522D',
    outfit: '#DEB887', outfitShadow: '#A0522D', accent: '#FFDEAD',
    shoe: '#8B4513', white: '#FFFFFF', black: '#2D1A00', mouth: '#F4A460',
  },
  // 20. COSMIC - 宇宙渐变
  cosmic: {
    hair: '#4B0082', skin: '#E8D8F8', eye: '#00CED1',
    outfit: '#483D8B', outfitShadow: '#2E1A5E', accent: '#00FFFF',
    shoe: '#1A0033', white: '#FFFFFF', black: '#0A001A', mouth: '#7B68EE',
  },
};
