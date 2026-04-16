/**
 * 瓦片地面渲染系统
 *
 * - 64x64 像素瓦片，深色石砖/泥土风格
 * - 无限滚动，根据摄像机位置动态绘制可见区域
 * - 2-3 种瓦片变体随机排列
 * - 伪随机种子确保一致性
 */

import type { Camera } from '@engine/Camera';

const TILE_SIZE = 128;

// ─── 瓦片颜色方案 ─────────────────────────────────────────

/** 瓦片变体颜色 */
interface TileVariant {
  base: string;
  dark: string;
  light: string;
  crack: string;
}

const TILE_VARIANTS: TileVariant[] = [
  // 变体 0：深灰石砖
  { base: '#2a2a35', dark: '#222230', light: '#333340', crack: '#1a1a25' },
  // 变体 1：暗褐泥土
  { base: '#2e2820', dark: '#252018', light: '#383028', crack: '#1c1810' },
  // 变体 2：暗绿苔石
  { base: '#252e28', dark: '#1e2520', light: '#2e3830', crack: '#181e1a' },
];

// ─── 伪随机 ───────────────────────────────────────────────

function tileHash(tx: number, ty: number): number {
  let h = tx * 374761393 + ty * 668265263;
  h = (h ^ (h >> 13)) * 1274126177;
  h = h ^ (h >> 16);
  return h;
}

function tileRandom(tx: number, ty: number): number {
  return ((tileHash(tx, ty) & 0x7fffffff) / 0x7fffffff);
}

// ─── 瓦片缓存（限制大小防止内存暴涨） ─────────────────────

const tileCanvasCache = new Map<string, HTMLCanvasElement>();
const MAX_CACHE_SIZE = 200;

function getTileCanvas(variant: number, detail: number): HTMLCanvasElement {
  const key = `${variant}_${detail}`;
  let canvas = tileCanvasCache.get(key);
  if (canvas) return canvas;

  canvas = document.createElement('canvas');
  canvas.width = TILE_SIZE;
  canvas.height = TILE_SIZE;
  const ctx = canvas.getContext('2d')!;

  const v = TILE_VARIANTS[variant % TILE_VARIANTS.length];

  // 基础填充
  ctx.fillStyle = v.base;
  ctx.fillRect(0, 0, TILE_SIZE, TILE_SIZE);

  // 砖缝网格
  ctx.strokeStyle = v.dark;
  ctx.lineWidth = 2;

  // 水平线
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.lineTo(TILE_SIZE, 0);
  ctx.moveTo(0, TILE_SIZE);
  ctx.lineTo(TILE_SIZE, TILE_SIZE);
  ctx.moveTo(0, TILE_SIZE / 2);
  ctx.lineTo(TILE_SIZE, TILE_SIZE / 2);
  ctx.stroke();

  // 垂直线（交错排列模拟砖块）
  const offset = (detail % 2) * (TILE_SIZE / 4);
  ctx.beginPath();
  ctx.moveTo(offset, 0);
  ctx.lineTo(offset, TILE_SIZE / 2);
  ctx.moveTo(offset + TILE_SIZE / 2, 0);
  ctx.lineTo(offset + TILE_SIZE / 2, TILE_SIZE / 2);
  ctx.moveTo(offset + TILE_SIZE / 4, TILE_SIZE / 2);
  ctx.lineTo(offset + TILE_SIZE / 4, TILE_SIZE);
  ctx.moveTo(offset + TILE_SIZE * 3 / 4, TILE_SIZE / 2);
  ctx.lineTo(offset + TILE_SIZE * 3 / 4, TILE_SIZE);
  ctx.stroke();

  // 随机细节：小石头/裂缝
  if (detail % 3 === 0) {
    ctx.fillStyle = v.light;
    const sx = 8 + (detail * 7) % 40;
    const sy = 8 + (detail * 11) % 40;
    ctx.fillRect(sx, sy, 4, 3);
    ctx.fillRect(sx + 2, sy + 1, 2, 2);
  }

  if (detail % 5 === 0) {
    ctx.strokeStyle = v.crack;
    ctx.lineWidth = 1;
    ctx.beginPath();
    const cx = 10 + (detail * 3) % 44;
    const cy = 10 + (detail * 5) % 44;
    ctx.moveTo(cx, cy);
    ctx.lineTo(cx + 8, cy + 5);
    ctx.lineTo(cx + 12, cy + 3);
    ctx.stroke();
  }

  // 边缘高光
  ctx.fillStyle = v.light;
  ctx.globalAlpha = 0.15;
  ctx.fillRect(0, 0, TILE_SIZE, 1);
  ctx.fillRect(0, 0, 1, TILE_SIZE);
  ctx.globalAlpha = 1;

  tileCanvasCache.set(key, canvas);

  // 限制缓存大小
  if (tileCanvasCache.size > MAX_CACHE_SIZE) {
    const firstKey = tileCanvasCache.keys().next().value;
    if (firstKey !== undefined) tileCanvasCache.delete(firstKey);
  }

  return canvas;
}

// ─── 主类 ─────────────────────────────────────────────────

export class TileMap {

  /** 绘制可见区域的瓦片地面 */
  draw(ctx: CanvasRenderingContext2D, camera: Camera): void {
    const startX = Math.floor(camera.x / TILE_SIZE) - 1;
    const startY = Math.floor(camera.y / TILE_SIZE) - 1;
    const endX = Math.ceil((camera.x + camera.width) / TILE_SIZE) + 1;
    const endY = Math.ceil((camera.y + camera.height) / TILE_SIZE) + 1;

    for (let ty = startY; ty <= endY; ty++) {
      for (let tx = startX; tx <= endX; tx++) {
        const variant = tileRandom(tx, ty) * TILE_VARIANTS.length | 0;
        const detail = tileRandom(tx + 1000, ty + 1000) * 10 | 0;
        const tileCanvas = getTileCanvas(variant, detail);

        const drawX = Math.round(tx * TILE_SIZE);
        const drawY = Math.round(ty * TILE_SIZE);

        ctx.drawImage(tileCanvas, drawX, drawY);
      }
    }
  }
}
