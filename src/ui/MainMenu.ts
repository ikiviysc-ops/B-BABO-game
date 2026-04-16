/**
 * 主菜单 — B-BABO 幸存者
 *
 * 特性：
 * - 深色渐变背景 + 微弱粒子/星星效果
 * - 标题上下浮动动画
 * - 按钮有 hover/press 状态
 * - 像素风格边框和文字
 */

import { UI, duration, easing } from '@engine/UITheme';
import { UITextRenderer } from '@engine/UITextRenderer';

// ═══════════════════════════════════════════════════════
// 粒子（星星）
// ═══════════════════════════════════════════════════════

interface Star {
  x: number;
  y: number;
  size: number;
  alpha: number;
  speed: number;
  twinkleSpeed: number;
  twinkleOffset: number;
}

// ═══════════════════════════════════════════════════════
// 按钮定义
// ═══════════════════════════════════════════════════════

interface MenuButton {
  id: 'start' | 'character' | 'help';
  label: string;
  primary: boolean; // 主按钮有金色边框
}

const BUTTONS: MenuButton[] = [
  { id: 'start', label: '开始游戏', primary: true },
  { id: 'character', label: '角色选择', primary: false },
  { id: 'help', label: '操作说明', primary: false },
];

// ═══════════════════════════════════════════════════════
// MainMenu
// ═══════════════════════════════════════════════════════

export class MainMenu {
  private text: UITextRenderer;
  private dpr: number;
  private animTimer = 0;
  private hoverBtn: string | null = null;
  private pressBtn: string | null = null;
  private stars: Star[] = [];
  private readonly starCount = 60;
  private initialized = false;

  constructor(ctx: CanvasRenderingContext2D, dpr: number) {
    this.text = new UITextRenderer(ctx);
    this.dpr = dpr;
  }

  /** 重置动画 */
  reset(): void {
    this.animTimer = 0;
    this.hoverBtn = null;
    this.pressBtn = null;
    this.initialized = false;
  }

  update(dt: number): void {
    this.animTimer += dt;

    // 初始化星星
    if (!this.initialized) {
      this.initStars();
      this.initialized = true;
    }

    // 更新星星位置
    for (const star of this.stars) {
      star.y -= star.speed * dt * 0.001;
      if (star.y < -5) {
        star.y = 105;
        star.x = Math.random() * 100;
      }
    }
  }

  // ─── 主渲染 ───────────────────────────────────────

  render(ctx: CanvasRenderingContext2D, screenW: number, screenH: number): void {
    const dpr = this.dpr;
    ctx.save();
    ctx.resetTransform();

    // 深色渐变背景
    this.renderBackground(ctx, screenW, screenH);

    // 星星粒子
    this.renderStars(ctx, screenW, screenH);

    // 标题浮动
    const floatY = Math.sin(this.animTimer * 0.0015) * 6 * dpr;
    const titleBaseY = screenH * 0.22 + floatY;

    // 副标题
    this.text.draw('无尽深渊', screenW / 2, titleBaseY + 34 * dpr, {
      size: 14 * dpr, color: UI.accent.blue, align: 'center',
      stroke: true, strokeColor: '#1a3366', strokeWidth: 2 * dpr,
    });

    // 主标题
    this.text.draw('B-BABO 幸存者', screenW / 2, titleBaseY, {
      size: 28 * dpr, color: UI.text.gold, align: 'center',
      stroke: true, strokeColor: '#8b6914', strokeWidth: 3 * dpr,
    });

    // 按钮
    const btnStartY = screenH * 0.48;
    const btnGap = 52 * dpr;
    const btnW = Math.min(200 * dpr, screenW - 40 * dpr);
    const btnH = 44 * dpr;
    const btnX = (screenW - btnW) / 2;

    for (let i = 0; i < BUTTONS.length; i++) {
      const btn = BUTTONS[i];
      const delay = 200 + i * 100;
      const progress = Math.max(0, Math.min((this.animTimer - delay) / duration.normal, 1));
      if (progress <= 0) continue;

      const by = btnStartY + i * btnGap;
      ctx.save();
      ctx.globalAlpha = easing.easeOutCubic(progress);
      this.renderButton(ctx, btnX, by, btnW, btnH, btn);
      ctx.restore();
    }

    // 版本号
    this.text.draw('v0.2.0', screenW / 2, screenH - 30 * dpr, {
      size: 9 * dpr, color: UI.text.tertiary, align: 'center', shadow: false,
    });

    ctx.restore();
  }

  // ─── 背景 ─────────────────────────────────────────

  private renderBackground(ctx: CanvasRenderingContext2D, w: number, h: number): void {
    // 深色渐变
    const grad = ctx.createRadialGradient(w / 2, h * 0.3, 0, w / 2, h * 0.3, Math.max(w, h));
    grad.addColorStop(0, '#141430');
    grad.addColorStop(0.5, '#0c0c20');
    grad.addColorStop(1, '#060610');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h);

    // 微弱的装饰光晕
    const glowAlpha = 0.04 + 0.02 * Math.sin(this.animTimer * 0.001);
    const glow = ctx.createRadialGradient(w / 2, h * 0.35, 0, w / 2, h * 0.35, w * 0.5);
    glow.addColorStop(0, `rgba(100, 80, 200, ${glowAlpha})`);
    glow.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = glow;
    ctx.fillRect(0, 0, w, h);
  }

  // ─── 星星粒子 ─────────────────────────────────────

  private initStars(): void {
    this.stars = [];
    for (let i = 0; i < this.starCount; i++) {
      this.stars.push({
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: 0.5 + Math.random() * 1.5,
        alpha: 0.2 + Math.random() * 0.5,
        speed: 0.5 + Math.random() * 1.5,
        twinkleSpeed: 0.002 + Math.random() * 0.004,
        twinkleOffset: Math.random() * Math.PI * 2,
      });
    }
  }

  private renderStars(ctx: CanvasRenderingContext2D, screenW: number, screenH: number): void {
    const dpr = this.dpr;
    for (const star of this.stars) {
      const twinkle = 0.5 + 0.5 * Math.sin(this.animTimer * star.twinkleSpeed + star.twinkleOffset);
      const alpha = star.alpha * twinkle;
      const sx = (star.x / 100) * screenW;
      const sy = (star.y / 100) * screenH;
      const size = star.size * dpr;

      ctx.fillStyle = `rgba(200, 200, 255, ${alpha})`;
      ctx.fillRect(Math.round(sx), Math.round(sy), Math.ceil(size), Math.ceil(size));
    }
  }

  // ─── 按钮 ─────────────────────────────────────────

  private renderButton(
    ctx: CanvasRenderingContext2D,
    x: number, y: number, w: number, h: number,
    btn: MenuButton,
  ): void {
    const dpr = this.dpr;
    const isHover = this.hoverBtn === btn.id;
    const isPress = this.pressBtn === btn.id;

    // 按钮背景
    if (isPress) {
      ctx.fillStyle = 'rgba(255,255,255,0.15)';
    } else if (isHover) {
      ctx.fillStyle = 'rgba(255,255,255,0.08)';
    } else {
      ctx.fillStyle = 'rgba(255,255,255,0.03)';
    }
    ctx.beginPath();
    ctx.roundRect(x, y, w, h, 4 * dpr);
    ctx.fill();

    // 边框
    if (btn.primary) {
      // 金色边框
      ctx.strokeStyle = isHover ? UI.text.gold : 'rgba(255,204,0,0.5)';
      ctx.lineWidth = (isHover ? 2 : 1.5) * dpr;
    } else {
      ctx.strokeStyle = isHover ? 'rgba(255,255,255,0.3)' : 'rgba(255,255,255,0.12)';
      ctx.lineWidth = 1;
    }
    ctx.beginPath();
    ctx.roundRect(x + 0.5, y + 0.5, w - 1, h - 1, 4 * dpr);
    ctx.stroke();

    // 内边框（像素风格双线）
    ctx.strokeStyle = 'rgba(255,255,255,0.04)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.roundRect(x + 2.5, y + 2.5, w - 5, h - 5, 3 * dpr);
    ctx.stroke();

    // 按钮文字
    const textColor = btn.primary
      ? (isHover ? UI.text.gold : '#e8d8a0')
      : (isHover ? UI.text.primary : UI.text.secondary);

    this.text.draw(btn.label, x + w / 2, y + h / 2 - 7 * dpr, {
      size: 14 * dpr, color: textColor, align: 'center',
      stroke: true, strokeWidth: 2 * dpr,
    });

    // 主按钮装饰 — 左侧小三角
    if (btn.primary) {
      const triSize = 6 * dpr;
      const triX = x + 14 * dpr;
      const triY = y + h / 2;
      ctx.fillStyle = isHover ? UI.text.gold : 'rgba(255,204,0,0.6)';
      ctx.beginPath();
      ctx.moveTo(triX, triY - triSize / 2);
      ctx.lineTo(triX + triSize, triY);
      ctx.lineTo(triX, triY + triSize / 2);
      ctx.closePath();
      ctx.fill();
    }
  }

  // ─── 点击检测 ─────────────────────────────────────

  hitTest(clickX: number, clickY: number, screenW: number, screenH: number): 'start' | 'character' | 'help' | null {
    const dpr = this.dpr;
    const btnStartY = screenH * 0.48;
    const btnGap = 52 * dpr;
    const btnW = Math.min(200 * dpr, screenW - 40 * dpr);
    const btnH = 44 * dpr;
    const btnX = (screenW - btnW) / 2;

    const cx = clickX * dpr;
    const cy = clickY * dpr;

    for (let i = 0; i < BUTTONS.length; i++) {
      const by = btnStartY + i * btnGap;
      if (cx >= btnX && cx <= btnX + btnW && cy >= by && cy <= by + btnH) {
        return BUTTONS[i].id;
      }
    }
    return null;
  }

  // ─── hover / press 更新 ───────────────────────────

  updateHover(mouseX: number, mouseY: number, screenW: number, screenH: number): void {
    const hit = this.hitTest(mouseX, mouseY, screenW, screenH);
    this.hoverBtn = hit;
  }

  setPress(btnId: string | null): void {
    this.pressBtn = btnId;
  }
}
