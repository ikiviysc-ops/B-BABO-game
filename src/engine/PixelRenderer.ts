/**
 * 像素精灵渲染器
 * 将像素数据数组绘制到 OffscreenCanvas，支持调色板替换
 *
 * HIRONO 小野风格调色板系统
 * - 低饱和度、柔和怀旧色调
 * - 每个元素角色通过调色板区分属性
 */

export interface PixelData {
  width: number;
  height: number;
  /** 每行像素颜色，空字符串为透明 */
  pixels: string[][];
}

/**
 * HIRONO 风格调色板
 * 色调参考：柔和、低饱和度、温暖怀旧
 * 每个调色板包含 20 个语义化颜色键
 */
export const PALETTES = {
  /** 🔥 烈焰 — 暖橙红调 */
  fire: {
    hair:    '#8b6f5e',  // 深棕发色
    hairHi:  '#a68b7b',  // 头发高光
    hairDk:  '#5c4a3e',  // 头发暗部
    skin:    '#f5e0cc',  // 暖白皮肤
    skinSh:  '#e8cdb5',  // 皮肤阴影
    blush:   '#e88888',  // 腮红（增强对比）
    nose:    '#d07070',  // 鼻尖红点（更明显）
    eyeW:    '#f8f4f0',  // 眼白（微暖）
    eyeI:    '#4a3728',  // 深棕瞳孔
    eyeB:    '#3a2a1e',  // 眼线
    lid:     '#e0c4b0',  // 浮肿眼皮
    lidSh:   '#c9a890',  // 眼皮阴影
    mouth:   '#c4908a',  // 嘴巴
    coat:    '#c4785a',  // 外套主色（暖橙）
    coatHi:  '#d89070',  // 外套高光
    coatDk:  '#8b5a42',  // 外套暗部
    coatLn:  '#6b4030',  // 外套线条
    inner:   '#f0ddd0',  // 内衬
    shoe:    '#5c3a2e',  // 鞋子
    outline: '#2e1e14',  // 轮廓线
    white:   '#ffffff',
  },

  /** 🧊 寒冰 — 冷蓝灰调 */
  ice: {
    hair:    '#6b7d8e',  // 灰蓝发色
    hairHi:  '#8a9baa',  // 头发高光
    hairDk:  '#4a5a68',  // 头发暗部
    skin:    '#e8e4ec',  // 冷白皮肤
    skinSh:  '#d0c8d8',  // 皮肤阴影
    blush:   '#c088c8',  // 腮红（增强）
    nose:    '#a878b8',  // 鼻尖（更明显）
    eyeW:    '#f4f2f8',  // 眼白（微冷）
    eyeI:    '#3a4a6e',  // 深蓝瞳孔
    eyeB:    '#2a3450',  // 眼线
    lid:     '#d0c8dc',  // 浮肿眼皮
    lidSh:   '#b0a4c0',  // 眼皮阴影
    mouth:   '#9888a8',  // 嘴巴
    coat:    '#7a9ab0',  // 外套主色（冷蓝）
    coatHi:  '#94b0c4',  // 外套高光
    coatDk:  '#4a6a80',  // 外套暗部
    coatLn:  '#3a4e60',  // 外套线条
    inner:   '#d8d8e4',  // 内衬
    shoe:    '#3a4a58',  // 鞋子
    outline: '#1e2a38',  // 轮廓线
    white:   '#ffffff',
  },

  /** ⚡ 雷电 — 暖黄金调 */
  thunder: {
    hair:    '#9e8e5e',  // 金棕发色
    hairHi:  '#b8a878',  // 头发高光
    hairDk:  '#6e6240',  // 头发暗部
    skin:    '#f5ecd8',  // 暖黄皮肤
    skinSh:  '#e0d4b8',  // 皮肤阴影
    blush:   '#e8a880',  // 腮红（增强）
    nose:    '#d09070',  // 鼻尖（更明显）
    eyeW:    '#f8f6f0',  // 眼白
    eyeI:    '#5a4a20',  // 深金瞳孔
    eyeB:    '#3a3018',  // 眼线
    lid:     '#e4d8b8',  // 浮肿眼皮
    lidSh:   '#c8b890',  // 眼皮阴影
    mouth:   '#c4a080',  // 嘴巴
    coat:    '#c4a840',  // 外套主色（金黄）
    coatHi:  '#d8c060',  // 外套高光
    coatDk:  '#8a7828',  // 外套暗部
    coatLn:  '#5a5020',  // 外套线条
    inner:   '#f0e8c8',  // 内衬
    shoe:    '#5a4828',  // 鞋子
    outline: '#2e2810',  // 轮廓线
    white:   '#ffffff',
  },

  /** 🌿 自然 — 柔绿调 */
  nature: {
    hair:    '#5e7e5a',  // 深绿发色
    hairHi:  '#7a9a76',  // 头发高光
    hairDk:  '#3e5a3a',  // 头发暗部
    skin:    '#e8ecd8',  // 自然白皮肤
    skinSh:  '#d0d8b8',  // 皮肤阴影
    blush:   '#a8c090',  // 腮红（增强）
    nose:    '#90b078',  // 鼻尖（更明显）
    eyeW:    '#f4f6f0',  // 眼白
    eyeI:    '#2e4a28',  // 深绿瞳孔
    eyeB:    '#1e3218',  // 眼线
    lid:     '#d0dab8',  // 浮肿眼皮
    lidSh:   '#a8b890',  // 眼皮阴影
    mouth:   '#88a878',  // 嘴巴
    coat:    '#6a9a68',  // 外套主色（柔绿）
    coatHi:  '#84b482',  // 外套高光
    coatDk:  '#4a6a48',  // 外套暗部
    coatLn:  '#2e4a2c',  // 外套线条
    inner:   '#d8e4c8',  // 内衬
    shoe:    '#3a4a30',  // 鞋子
    outline: '#1a2a14',  // 轮廓线
    white:   '#ffffff',
  },

  /** ⚪ 中性 — 灰调 */
  neutral: {
    hair:    '#7a7a7a',  // 灰发色
    hairHi:  '#9a9a9a',  // 头发高光
    hairDk:  '#4a4a4a',  // 头发暗部
    skin:    '#ece8e4',  // 中性皮肤
    skinSh:  '#d0ccc8',  // 皮肤阴影
    blush:   '#c0a8a0',  // 腮红（增强）
    nose:    '#b09888',  // 鼻尖（更明显）
    eyeW:    '#f4f4f4',  // 眼白
    eyeI:    '#3a3a3a',  // 深灰瞳孔
    eyeB:    '#2a2a2a',  // 眼线
    lid:     '#dcd4d0',  // 浮肿眼皮
    lidSh:   '#c0b4b0',  // 眼皮阴影
    mouth:   '#a09890',  // 嘴巴
    coat:    '#8a8a8a',  // 外套主色（灰）
    coatHi:  '#a4a4a4',  // 外套高光
    coatDk:  '#5a5a5a',  // 外套暗部
    coatLn:  '#3a3a3a',  // 外套线条
    inner:   '#e0dcd8',  // 内衬
    shoe:    '#3a3a3a',  // 鞋子
    outline: '#1a1a1a',  // 轮廓线
    white:   '#ffffff',
  },
} as const;

export type PaletteKey = keyof typeof PALETTES;

/**
 * 将像素数据渲染为 OffscreenCanvas
 * @param data 像素数据
 * @param palette 调色板
 * @param scale 放大倍数 (默认 1，即原始像素大小)
 */
export function renderPixelSprite(
  data: PixelData,
  palette: Record<string, string>,
  scale = 1,
): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  canvas.width = data.width * scale;
  canvas.height = data.height * scale;
  const ctx = canvas.getContext('2d')!;
  ctx.imageSmoothingEnabled = false;

  for (let y = 0; y < data.height; y++) {
    for (let x = 0; x < data.width; x++) {
      const colorKey = data.pixels[y]?.[x];
      if (!colorKey) continue;

      const color = palette[colorKey] ?? colorKey;
      if (color === 'transparent') continue;

      ctx.fillStyle = color;
      ctx.fillRect(x * scale, y * scale, scale, scale);
    }
  }

  return canvas;
}

/**
 * 对已有精灵应用新调色板
 */
export function applyPalette(
  baseData: PixelData,
  newPalette: Record<string, string>,
  scale = 1,
): HTMLCanvasElement {
  return renderPixelSprite(baseData, newPalette, scale);
}
