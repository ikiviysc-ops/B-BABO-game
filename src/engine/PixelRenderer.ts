/**
 * 像素精灵渲染器
 * 将像素数据数组绘制到 OffscreenCanvas，支持调色板替换
 */

export interface PixelData {
  width: number;
  height: number;
  /** 每行像素颜色，空字符串为透明 */
  pixels: string[][];
}

/** 预定义调色板 */
export const PALETTES = {
  fire: {
    primary: '#ff6b35',
    secondary: '#ff9f1c',
    accent: '#ffbf69',
    dark: '#8b2500',
    outline: '#2d0a00',
    skin: '#ffd5a5',
    eye: '#1a1a2e',
    white: '#ffffff',
  },
  ice: {
    primary: '#4cc9f0',
    secondary: '#4895ef',
    accent: '#a2d2ff',
    dark: '#1d3557',
    outline: '#0a1128',
    skin: '#c8e6f5',
    eye: '#1a1a2e',
    white: '#ffffff',
  },
  thunder: {
    primary: '#ffd60a',
    secondary: '#ffc300',
    accent: '#fff3b0',
    dark: '#e09f3e',
    outline: '#3a0ca3',
    skin: '#fff8dc',
    eye: '#1a1a2e',
    white: '#ffffff',
  },
  nature: {
    primary: '#52b788',
    secondary: '#95d5b2',
    accent: '#b7e4c7',
    dark: '#2d6a4f',
    outline: '#1b4332',
    skin: '#d8f3dc',
    eye: '#1a1a2e',
    white: '#ffffff',
  },
  neutral: {
    primary: '#adb5bd',
    secondary: '#dee2e6',
    accent: '#f8f9fa',
    dark: '#495057',
    outline: '#212529',
    skin: '#ffd5a5',
    eye: '#1a1a2e',
    white: '#ffffff',
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
): OffscreenCanvas {
  const canvas = new OffscreenCanvas(
    data.width * scale,
    data.height * scale,
  );
  const ctx = canvas.getContext('2d')!;
  ctx.imageSmoothingEnabled = false;

  for (let y = 0; y < data.height; y++) {
    for (let x = 0; x < data.width; x++) {
      const colorKey = data.pixels[y]?.[x];
      if (!colorKey) continue; // 透明

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
): OffscreenCanvas {
  return renderPixelSprite(baseData, newPalette, scale);
}
