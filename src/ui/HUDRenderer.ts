/**
 * 专业HUD渲染器 — 替代Renderer.ts中的基础HUD
 * 布局参考Vampire Survivors
 */

import { UI, HUD as HUD_CONST, WEAPON_SLOT } from '@engine/UITheme';
import { UITextRenderer } from '@engine/UITextRenderer';
import { getPixelIcon } from '@engine/PixelIcons';

export interface HUDState {
  wave: number;
  score: number;
  kills: number;
  hp: number;
  maxHp: number;
  xp: number;
  xpToNext: number;
  level: number;
  elapsedTime: number;
  weapons: { id: string; level: number; maxLevel: number }[];
}

export class HUDRenderer {
  private text: UITextRenderer;
  private dpr: number;

  constructor(ctx: CanvasRenderingContext2D, dpr: number) {
    this.text = new UITextRenderer(ctx);
    this.dpr = dpr;
  }

  render(ctx: CanvasRenderingContext2D, state: HUDState, screenW: number, _screenH: number): void {
    ctx.save();
    ctx.resetTransform();

    this.renderXPBar(ctx, state, screenW);
    this.renderWeaponSlots(ctx, state);
    this.renderStats(ctx, state, screenW);
    this.renderWaveInfo(ctx, state);

    ctx.restore();
  }

  /** 渲染角色上方跟随血条（世界坐标） */
  renderPlayerHP(ctx: CanvasRenderingContext2D, x: number, y: number, hp: number, maxHp: number, camX: number, camY: number): void {
    const dpr = this.dpr;
    const barW = 60 * dpr;
    const barH = 8 * dpr;
    const sx = Math.round(x - camX - barW / 2);
    const sy = Math.round(y - camY - 20 * dpr);
    const ratio = Math.max(0, Math.min(1, hp / maxHp));

    // 背景
    ctx.fillStyle = UI.bar.hp.bg;
    ctx.fillRect(sx, sy, barW, barH);

    // 填充（渐变红）
    if (ratio > 0) {
      const grad = ctx.createLinearGradient(sx, sy, sx, sy + barH);
      grad.addColorStop(0, UI.bar.hp.hi);
      grad.addColorStop(1, UI.bar.hp.fill);
      ctx.fillStyle = grad;
      ctx.fillRect(sx + 1, sy + 1, (barW - 2) * ratio, barH - 2);
    }

    // 高光线
    ctx.fillStyle = 'rgba(255,255,255,0.3)';
    ctx.fillRect(sx + 1, sy + 1, (barW - 2) * ratio, 1);

    // 边框
    ctx.strokeStyle = UI.bar.hp.border;
    ctx.lineWidth = 1;
    ctx.strokeRect(sx + 0.5, sy + 0.5, barW - 1, barH - 1);
  }

  private renderXPBar(ctx: CanvasRenderingContext2D, state: HUDState, screenW: number): void {
    const dpr = this.dpr;
    const barH = HUD_CONST.xpBarHeight * dpr;
    const ratio = Math.min(state.xp / state.xpToNext, 1);

    // 背景
    ctx.fillStyle = UI.bar.xp.bg;
    ctx.fillRect(0, 0, screenW, barH);

    // 填充
    if (ratio > 0) {
      const grad = ctx.createLinearGradient(0, 0, 0, barH);
      grad.addColorStop(0, UI.bar.xp.hi);
      grad.addColorStop(1, UI.bar.xp.fill);
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, screenW * ratio, barH);
    }

    // 高光线
    ctx.fillStyle = 'rgba(255,255,255,0.4)';
    ctx.fillRect(0, 0, screenW * ratio, 1);

    // 满时闪烁
    if (ratio >= 0.95) {
      const flash = 0.2 + 0.15 * Math.sin(Date.now() / 100);
      ctx.fillStyle = `rgba(255,255,255,${flash})`;
      ctx.fillRect(0, 0, screenW, barH);
    }

    // 等级文字
    this.text.draw(`Lv.${state.level}`, 8, barH + 4, {
      size: 10 * dpr, color: UI.text.xp, stroke: true, strokeWidth: 2 * dpr,
    });
  }

  private renderWeaponSlots(ctx: CanvasRenderingContext2D, state: HUDState): void {
    const dpr = this.dpr;
    const slotSize = WEAPON_SLOT.size * dpr;
    const gap = WEAPON_SLOT.gap * dpr;
    const startX = 8 * dpr;
    const startY = (HUD_CONST.xpBarHeight + 20) * dpr;

    for (let i = 0; i < WEAPON_SLOT.cols; i++) {
      const col = i % WEAPON_SLOT.cols;
      const sx = startX + col * (slotSize + gap);
      const sy = startY;

      // 槽位背景
      ctx.fillStyle = 'rgba(0,0,0,0.5)';
      ctx.fillRect(sx, sy, slotSize, slotSize);

      // 武器图标
      if (state.weapons[i]) {
        const w = state.weapons[i];
        const iconSize = slotSize - 8 * dpr;
        const icon = getPixelIcon(w.id, iconSize);
        ctx.imageSmoothingEnabled = false;
        ctx.drawImage(icon, sx + 4 * dpr, sy + 4 * dpr, iconSize, iconSize);

        // 等级点
        const dotSize = 3 * dpr;
        const dotGap = 2 * dpr;
        const dotsW = w.maxLevel * (dotSize + dotGap) - dotGap;
        const dotStartX = sx + (slotSize - dotsW) / 2;
        for (let d = 0; d < w.maxLevel; d++) {
          ctx.fillStyle = d < w.level ? '#ffd700' : '#333355';
          ctx.fillRect(dotStartX + d * (dotSize + dotGap), sy + slotSize - dotSize - 2 * dpr, dotSize, dotSize);
        }

        // 满级边框
        if (w.level >= w.maxLevel) {
          ctx.strokeStyle = '#ffd700';
          ctx.lineWidth = 1.5 * dpr;
          ctx.strokeRect(sx + 0.5, sy + 0.5, slotSize - 1, slotSize - 1);
        }
      }

      // 空槽位边框
      ctx.strokeStyle = 'rgba(255,255,255,0.1)';
      ctx.lineWidth = 1;
      ctx.strokeRect(sx + 0.5, sy + 0.5, slotSize - 1, slotSize - 1);
    }
  }

  private renderStats(_ctx: CanvasRenderingContext2D, state: HUDState, screenW: number): void {
    const dpr = this.dpr;
    const rightX = screenW - 8 * dpr;
    let y = (HUD_CONST.xpBarHeight + 20) * dpr;

    // 计时器
    this.text.drawTimer(state.elapsedTime, rightX, y, {
      size: HUD_CONST.timerSize * dpr, align: 'right',
      stroke: true, strokeWidth: 2 * dpr,
    });
    y += 24 * dpr;

    // 击杀数
    this.text.drawNumber(state.kills, rightX, y, {
      size: HUD_CONST.statsSize * dpr, color: UI.accent.red, align: 'right',
      stroke: true, strokeWidth: 2 * dpr,
    });
    this.text.draw('KILLS', rightX, y + 14 * dpr, {
      size: 8 * dpr, color: UI.text.tertiary, align: 'right', shadow: false,
    });
    y += 32 * dpr;

    // 分数
    this.text.drawNumber(state.score, rightX, y, {
      size: HUD_CONST.statsSize * dpr, color: UI.text.gold, align: 'right',
      stroke: true, strokeWidth: 2 * dpr,
    });
    this.text.draw('SCORE', rightX, y + 14 * dpr, {
      size: 8 * dpr, color: UI.text.tertiary, align: 'right', shadow: false,
    });
  }

  private renderWaveInfo(_ctx: CanvasRenderingContext2D, state: HUDState): void {
    const dpr = this.dpr;
    const x = 8 * dpr;
    const y = (HUD_CONST.xpBarHeight + 20 + WEAPON_SLOT.size + 8) * dpr;

    this.text.draw(`Wave ${state.wave}`, x, y, {
      size: 11 * dpr, color: UI.text.secondary, shadow: false,
    });
  }
}
