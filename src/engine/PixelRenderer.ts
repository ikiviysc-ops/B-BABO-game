// PixelRenderer.ts - 像素精灵渲染

export interface SpriteData {
  width: number;
  height: number;
  pixels: string[];
}

export function renderPixelSprite(
  spriteData: SpriteData,
  palette: Record<string, string>,
  scale: number = 1,
): HTMLCanvasElement {
  const { width, height, pixels } = spriteData;
  const canvas = document.createElement('canvas');
  canvas.width = width * scale;
  canvas.height = height * scale;
  const ctx = canvas.getContext('2d')!;
  ctx.imageSmoothingEnabled = false;

  for (let y = 0; y < height; y++) {
    const row = pixels[y];
    if (!row) continue;
    const keys = row.trim().split(/\s+/);
    for (let x = 0; x < width; x++) {
      const key = keys[x];
      if (!key || key === '.') continue;
      const color = palette[key];
      if (!color) continue;
      ctx.fillStyle = color;
      ctx.fillRect(x * scale, y * scale, scale, scale);
    }
  }

  return canvas;
}

export function createSpriteSheet(
  sprites: SpriteData[],
  palette: Record<string, string>,
  scale: number = 1,
): HTMLCanvasElement {
  if (sprites.length === 0) {
    const c = document.createElement('canvas');
    c.width = 1; c.height = 1;
    return c;
  }
  const w = sprites[0].width * scale;
  const h = sprites[0].height * scale;
  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h * sprites.length;
  const ctx = canvas.getContext('2d')!;
  ctx.imageSmoothingEnabled = false;

  sprites.forEach((sprite, i) => {
    const img = renderPixelSprite(sprite, palette, scale);
    ctx.drawImage(img, 0, i * h);
  });

  return canvas;
}
