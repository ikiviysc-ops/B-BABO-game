/**
 * 视差背景系统 — 性能优化版
 *
 * 优化策略：
 * - 星空层预渲染到离屏Canvas（静态，只渲染一次）
 * - 远山/树木层每帧只绘制可见部分
 * - 地面装饰减少到100个
 */

import type { Camera } from '@engine/Camera';

// ─── 伪随机 ───────────────────────────────────────────────

function seededRandom(seed: number): number {
  const x = Math.sin(seed * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
}

// ─── 星空层（预渲染） ─────────────────────────────────────

let starCanvas: HTMLCanvasElement | null = null;
let starCanvasW = 0;
let starCanvasH = 0;

function ensureStarCanvas(w: number, h: number): HTMLCanvasElement {
  if (starCanvas && starCanvasW === w && starCanvasH === h) return starCanvas;

  starCanvas = document.createElement('canvas');
  starCanvas.width = w;
  starCanvas.height = h;
  starCanvasW = w;
  starCanvasH = h;
  const ctx = starCanvas.getContext('2d')!;

  // 深空背景
  ctx.fillStyle = '#080812';
  ctx.fillRect(0, 0, w, h);

  // 星星
  for (let i = 0; i < 80; i++) {
    const sx = seededRandom(i * 3) * w;
    const sy = seededRandom(i * 3 + 1) * h;
    const size = seededRandom(i * 3 + 2) > 0.85 ? 2 : 1;
    const brightness = 0.3 + seededRandom(i * 7) * 0.7;
    ctx.globalAlpha = brightness;
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(Math.round(sx), Math.round(sy), size, size);
  }
  ctx.globalAlpha = 1;

  // 月亮
  const moonX = w * 0.8;
  const moonY = 60;
  const moonR = 25;

  ctx.fillStyle = 'rgba(200, 200, 255, 0.05)';
  ctx.beginPath();
  ctx.arc(moonX, moonY, moonR * 3, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = 'rgba(200, 200, 255, 0.1)';
  ctx.beginPath();
  ctx.arc(moonX, moonY, moonR * 1.8, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#ccccdd';
  ctx.beginPath();
  ctx.arc(moonX, moonY, moonR, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#080812';
  ctx.beginPath();
  ctx.arc(moonX + 8, moonY - 3, moonR * 0.85, 0, Math.PI * 2);
  ctx.fill();

  return starCanvas;
}

// ─── 远山层 ───────────────────────────────────────────────

interface Mountain {
  x: number;
  width: number;
  height: number;
  color: string;
}

const MOUNTAINS: Mountain[] = [];

function initMountains(): void {
  if (MOUNTAINS.length > 0) return;
  const colors = ['#0e0e1a', '#121220', '#0c0c18', '#141425'];
  let x = -200;
  while (x < 4000) {
    const w = 150 + seededRandom(x * 0.01) * 300;
    const h = 80 + seededRandom(x * 0.02) * 120;
    MOUNTAINS.push({ x, width: w, height: h, color: colors[Math.floor(seededRandom(x * 0.03) * colors.length)] });
    x += w * 0.6;
  }
}

function drawMountainLayer(ctx: CanvasRenderingContext2D, camera: Camera): void {
  initMountains();
  const offsetX = camera.x * 0.2;
  const baseY = camera.height * 0.65;

  for (const m of MOUNTAINS) {
    const mx = m.x - offsetX;
    if (mx + m.width < -100 || mx > camera.width + 100) continue;

    ctx.fillStyle = m.color;
    ctx.beginPath();
    ctx.moveTo(mx, baseY);
    ctx.lineTo(mx + m.width * 0.5, baseY - m.height);
    ctx.lineTo(mx + m.width, baseY);
    ctx.closePath();
    ctx.fill();
  }
}

// ─── 树木层 ───────────────────────────────────────────────

interface Tree {
  x: number;
  height: number;
  type: 'tree' | 'dead_tree' | 'pillar';
}

const TREES: Tree[] = [];

function initTrees(): void {
  if (TREES.length > 0) return;
  let x = -100;
  while (x < 5000) {
    const r = seededRandom(x * 0.05);
    const type = r < 0.5 ? 'tree' : r < 0.75 ? 'dead_tree' : 'pillar';
    TREES.push({ x, height: 40 + seededRandom(x * 0.06) * 80, type });
    x += 30 + seededRandom(x * 0.07) * 80;
  }
}

function drawTreeLayer(ctx: CanvasRenderingContext2D, camera: Camera): void {
  initTrees();
  const offsetX = camera.x * 0.5;
  const baseY = camera.height * 0.78;

  for (const tree of TREES) {
    const tx = tree.x - offsetX;
    if (tx + 30 < -50 || tx - 30 > camera.width + 50) continue;

    const h = tree.height;
    const rtx = Math.round(tx);
    const rby = Math.round(baseY);

    switch (tree.type) {
      case 'tree':
        ctx.fillStyle = '#1a1510';
        ctx.fillRect(rtx - 3, rby - Math.round(h * 0.6), 6, Math.round(h * 0.6));
        ctx.fillStyle = '#0e1a0e';
        ctx.beginPath();
        ctx.moveTo(tx, baseY - h);
        ctx.lineTo(tx - 18, baseY - h * 0.4);
        ctx.lineTo(tx + 18, baseY - h * 0.4);
        ctx.closePath();
        ctx.fill();
        break;
      case 'dead_tree':
        ctx.fillStyle = '#1a1510';
        ctx.fillRect(rtx - 2, rby - Math.round(h * 0.7), 4, Math.round(h * 0.7));
        ctx.strokeStyle = '#1a1510';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(tx, baseY - h * 0.5);
        ctx.lineTo(tx - 12, baseY - h * 0.7);
        ctx.moveTo(tx, baseY - h * 0.6);
        ctx.lineTo(tx + 10, baseY - h * 0.8);
        ctx.stroke();
        break;
      case 'pillar':
        ctx.fillStyle = '#1a1a22';
        ctx.fillRect(rtx - 5, rby - Math.round(h), 10, Math.round(h));
        ctx.fillStyle = '#222230';
        ctx.fillRect(rtx - 8, rby - Math.round(h), 16, 6);
        break;
    }
  }
}

// ─── 地面装饰 ─────────────────────────────────────────────

interface GroundDecor {
  wx: number;
  wy: number;
  type: number; // 0=stone, 1=crack, 2=grass
  size: number;
}

const GROUND_DECORS: GroundDecor[] = [];

function initGroundDecors(): void {
  if (GROUND_DECORS.length > 0) return;
  for (let i = 0; i < 100; i++) {
    GROUND_DECORS.push({
      wx: (seededRandom(i * 3 + 1) - 0.5) * 6000,
      wy: (seededRandom(i * 3 + 2) - 0.5) * 6000,
      type: Math.floor(seededRandom(i * 7 + 42) * 3),
      size: 2 + seededRandom(i * 5) * 4,
    });
  }
}

function drawGroundDecors(ctx: CanvasRenderingContext2D, camera: Camera): void {
  initGroundDecors();
  const left = camera.x - 50;
  const right = camera.x + camera.width + 50;
  const top = camera.y - 50;
  const bottom = camera.y + camera.height + 50;

  for (const d of GROUND_DECORS) {
    if (d.wx < left || d.wx > right || d.wy < top || d.wy > bottom) continue;
    const dx = Math.round(d.wx);
    const dy = Math.round(d.wy);
    const s = d.size;

    if (d.type === 0) {
      ctx.fillStyle = '#3a3a45';
      ctx.fillRect(dx - s, dy - s, s * 2, s * 2);
    } else if (d.type === 1) {
      ctx.strokeStyle = '#1a1a25';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(dx, dy);
      ctx.lineTo(dx + s * 3, dy + s);
      ctx.stroke();
    } else {
      ctx.fillStyle = '#1a2a1a';
      ctx.fillRect(dx, dy - s * 2, 1, s * 2);
      ctx.fillRect(dx + 2, dy - s, 1, s);
    }
  }
}

// ─── 主类 ─────────────────────────────────────────────────

export class ParallaxBackground {

  draw(ctx: CanvasRenderingContext2D, camera: Camera, _time: number): void {
    ctx.save();
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.imageSmoothingEnabled = false;

    // 星空（预渲染，一次drawImage）
    const sc = ensureStarCanvas(Math.ceil(camera.width), Math.ceil(camera.height));
    ctx.drawImage(sc, 0, 0);

    // 远山
    drawMountainLayer(ctx, camera);

    // 树木
    drawTreeLayer(ctx, camera);

    ctx.restore();
  }

  drawGroundDecorations(ctx: CanvasRenderingContext2D, camera: Camera): void {
    drawGroundDecors(ctx, camera);
  }
}
