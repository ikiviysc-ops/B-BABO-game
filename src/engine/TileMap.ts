// TileMap.ts - 瓦片地面，128px瓦片，3种变体

import type { Camera } from './Camera';

const TILE_SIZE = 128;
const CACHE_LIMIT = 200;

// 3种瓦片变体颜色
const TILE_VARIANTS = [
  // 石砖 - 灰色系
  { base: '#3a3a4a', line: '#2a2a3a', dot: '#4a4a5a' },
  // 泥土 - 棕色系
  { base: '#4a3520', line: '#3a2510', dot: '#5a4530' },
  // 苔石 - 绿灰色系
  { base: '#2a3a2a', line: '#1a2a1a', dot: '#3a4a3a' },
];

export class TileMap {
  private tileCache = new Map<string, HTMLCanvasElement>();
  private _hashSeed = 12345;

  private _hash(x: number, y: number): number {
    let h = this._hashSeed + x * 374761393 + y * 668265263;
    h = (h ^ (h >> 13)) * 1274126177;
    h = h ^ (h >> 16);
    return h >>> 0;
  }

  private _getTileCanvas(variant: number): HTMLCanvasElement {
    const cached = this.tileCache.get(String(variant));
    if (cached) return cached;

    const canvas = document.createElement('canvas');
    canvas.width = TILE_SIZE;
    canvas.height = TILE_SIZE;
    const ctx = canvas.getContext('2d')!;
    const v = TILE_VARIANTS[variant];

    // 基底
    ctx.fillStyle = v.base;
    ctx.fillRect(0, 0, TILE_SIZE, TILE_SIZE);

    // 砖缝
    ctx.strokeStyle = v.line;
    ctx.lineWidth = 2;
    // 横线
    for (let y = 0; y < TILE_SIZE; y += 32) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(TILE_SIZE, y);
      ctx.stroke();
    }
    // 竖线（交错）
    for (let row = 0; row < TILE_SIZE / 32; row++) {
      const offset = (row % 2) * 32;
      for (let x = offset; x < TILE_SIZE; x += 64) {
        ctx.beginPath();
        ctx.moveTo(x, row * 32);
        ctx.lineTo(x, (row + 1) * 32);
        ctx.stroke();
      }
    }

    // 随机纹理点
    const rng = this._seededRandom(variant * 1000 + 77);
    ctx.fillStyle = v.dot;
    for (let i = 0; i < 15; i++) {
      const dx = rng() * TILE_SIZE;
      const dy = rng() * TILE_SIZE;
      const ds = rng() * 3 + 1;
      ctx.fillRect(dx, dy, ds, ds);
    }

    // 缓存管理
    if (this.tileCache.size >= CACHE_LIMIT) {
      const firstKey = this.tileCache.keys().next().value;
      if (firstKey !== undefined) this.tileCache.delete(firstKey);
    }
    this.tileCache.set(String(variant), canvas);
    return canvas;
  }

  private _seededRandom(seed: number): () => number {
    let s = seed;
    return () => {
      s = (s * 16807) % 2147483647;
      return s / 2147483647;
    };
  }

  render(
    ctx: CanvasRenderingContext2D,
    camera: Camera,
    screenW: number,
    screenH: number,
  ): void {
    const off = camera.getOffset();
    const startCol = Math.floor(-off.x / TILE_SIZE) - 1;
    const endCol = Math.ceil((-off.x + screenW) / TILE_SIZE) + 1;
    const startRow = Math.floor(-off.y / TILE_SIZE) - 1;
    const endRow = Math.ceil((-off.y + screenH) / TILE_SIZE) + 1;

    for (let row = startRow; row <= endRow; row++) {
      for (let col = startCol; col <= endCol; col++) {
        const variant = this._hash(col, row) % 3;
        const tileCanvas = this._getTileCanvas(variant);
        const sx = col * TILE_SIZE + off.x;
        const sy = row * TILE_SIZE + off.y;
        ctx.drawImage(tileCanvas, sx, sy);
      }
    }
  }

  clearCache(): void {
    this.tileCache.clear();
  }
}
