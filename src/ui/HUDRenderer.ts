// HUDRenderer.ts - 专业HUD渲染器

import { COLORS, HUD as HUDLayout, FONT } from '../engine/UITheme';
import { UITextRenderer } from '../engine/UITextRenderer';

export interface HUDState {
  hp: number;
  maxHp: number;
  xp: number;
  xpToNext: number;
  level: number;
  weapons: { name: string; level: number; cooldown: number; maxCooldown: number; color: string }[];
  kills: number;
  score: number;
  elapsed: number;
  dpr: number;
  playerScreenX: number;
  playerScreenY: number;
}

export class HUDRenderer {
  private text: UITextRenderer;
  private displayHp = 0; // 平滑动画用

  constructor(dpr: number = 1) {
    this.text = new UITextRenderer(dpr);
  }

  render(ctx: CanvasRenderingContext2D, state: HUDState): void {
    const dpr = state.dpr;
    const sw = ctx.canvas.width / dpr;
    const sh = ctx.canvas.height / dpr;

    // 平滑血条
    this.displayHp += (state.hp - this.displayHp) * 0.15;
    if (Math.abs(this.displayHp - state.hp) < 0.5) this.displayHp = state.hp;

    this._renderXpBar(ctx, state, sw);
    this._renderLevelBadge(ctx, state);
    this._renderTopRight(ctx, state, sw);
    this._renderWeaponBar(ctx, state, sw, sh);
    this._renderPlayerHpBar(ctx, state);
  }

  /** 顶部全宽XP条 */
  private _renderXpBar(ctx: CanvasRenderingContext2D, state: HUDState, sw: number): void {
    const barH = 6;
    const y = 0;
    const pad = 0;
    const progress = Math.min(state.xp / state.xpToNext, 1);

    // 背景
    ctx.fillStyle = COLORS.xpBg;
    ctx.fillRect(pad, y, sw - pad * 2, barH);

    // 渐变填充
    if (progress > 0) {
      const grad = ctx.createLinearGradient(pad, 0, pad + (sw - pad * 2) * progress, 0);
      grad.addColorStop(0, '#00cc66');
      grad.addColorStop(1, '#00ff88');
      ctx.fillStyle = grad;
      ctx.fillRect(pad, y, (sw - pad * 2) * progress, barH);

      // 高光
      ctx.fillStyle = 'rgba(255,255,255,0.3)';
      ctx.fillRect(pad, y, (sw - pad * 2) * progress, barH / 2);
    }
  }

  /** 左上角色等级 */
  private _renderLevelBadge(ctx: CanvasRenderingContext2D, state: HUDState): void {
    const x = HUDLayout.left + 8;
    const y = HUDLayout.top + 14;

    // 等级背景圆
    const r = HUDLayout.levelBadge.radius;
    ctx.fillStyle = 'rgba(0,0,0,0.5)';
    ctx.beginPath();
    ctx.arc(x + r, y + r, r, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = COLORS.gold;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(x + r, y + r, r, 0, Math.PI * 2);
    ctx.stroke();

    this.text.draw(ctx, `${state.level}`, x + r, y + r, {
      size: 14,
      color: COLORS.gold,
      align: 'center',
      baseline: 'middle',
      font: FONT.ui,
      shadow: true,
    });
  }

  /** 右上角计时器/击杀数/分数 */
  private _renderTopRight(ctx: CanvasRenderingContext2D, state: HUDState, sw: number): void {
    const rx = sw - HUDLayout.right;
    const ty = HUDLayout.top + 14;

    // 计时器
    const mins = Math.floor(state.elapsed / 60);
    const secs = Math.floor(state.elapsed % 60);
    const timeStr = `${mins}:${secs.toString().padStart(2, '0')}`;

    this.text.draw(ctx, timeStr, rx, ty, {
      size: 16,
      color: COLORS.text,
      align: 'right',
      font: FONT.mono,
      shadow: true,
    });

    // 击杀数
    this.text.draw(ctx, `${state.kills} KILLS`, rx, ty + 22, {
      size: 12,
      color: COLORS.accentLight,
      align: 'right',
      font: FONT.mono,
    });

    // 分数
    this.text.draw(ctx, `${state.score}`, rx, ty + 40, {
      size: 12,
      color: COLORS.gold,
      align: 'right',
      font: FONT.mono,
    });
  }

  /** 底部武器栏(6槽位) */
  private _renderWeaponBar(ctx: CanvasRenderingContext2D, state: HUDState, sw: number, sh: number): void {
    const slotSize = 44;
    const gap = 6;
    const totalSlots = 6;
    const totalW = totalSlots * slotSize + (totalSlots - 1) * gap;
    const startX = (sw - totalW) / 2;
    const y = sh - HUDLayout.bottom - slotSize - 4;

    for (let i = 0; i < totalSlots; i++) {
      const x = startX + i * (slotSize + gap);
      const weapon = state.weapons[i];

      // 槽位背景
      ctx.fillStyle = weapon ? 'rgba(30,30,54,0.85)' : 'rgba(15,15,26,0.6)';
      ctx.fillRect(x, y, slotSize, slotSize);

      // 边框
      ctx.strokeStyle = weapon ? COLORS.panelBorder : 'rgba(42,42,74,0.5)';
      ctx.lineWidth = 1.5;
      ctx.strokeRect(x, y, slotSize, slotSize);

      if (weapon) {
        // 武器颜色指示
        ctx.fillStyle = weapon.color;
        ctx.fillRect(x + 3, y + 3, slotSize - 6, 3);

        // 武器名(截断)
        this.text.draw(ctx, weapon.name, x + slotSize / 2, y + 18, {
          size: 9,
          color: COLORS.text,
          align: 'center',
          font: FONT.ui,
        });

        // 等级
        this.text.draw(ctx, `Lv.${weapon.level}`, x + slotSize / 2, y + 30, {
          size: 8,
          color: COLORS.gold,
          align: 'center',
          font: FONT.mono,
        });

        // 冷却指示
        if (weapon.maxCooldown > 0 && weapon.cooldown > 0) {
          const cdProgress = weapon.cooldown / weapon.maxCooldown;
          ctx.fillStyle = 'rgba(0,0,0,0.6)';
          ctx.fillRect(x, y, slotSize, slotSize * cdProgress);
        }
      }
    }
  }

  /** 角色跟随血条 */
  private _renderPlayerHpBar(ctx: CanvasRenderingContext2D, state: HUDState): void {
    const px = state.playerScreenX;
    const py = state.playerScreenY;
    const barW = 48;
    const barH = 6;
    const offsetY = -28;
    const x = px - barW / 2;
    const y = py + offsetY;

    const hpRatio = Math.max(0, this.displayHp / state.maxHp);

    // 背景
    ctx.fillStyle = COLORS.hpBg;
    ctx.fillRect(x, y, barW, barH);

    // 渐变填充
    if (hpRatio > 0) {
      const grad = ctx.createLinearGradient(x, 0, x + barW * hpRatio, 0);
      grad.addColorStop(0, '#cc2244');
      grad.addColorStop(1, COLORS.hp);
      ctx.fillStyle = grad;
      ctx.fillRect(x, y, barW * hpRatio, barH);

      // 高光
      ctx.fillStyle = 'rgba(255,255,255,0.25)';
      ctx.fillRect(x, y, barW * hpRatio, barH / 2);
    }

    // 边框
    ctx.strokeStyle = 'rgba(0,0,0,0.4)';
    ctx.lineWidth = 1;
    ctx.strokeRect(x, y, barW, barH);
  }

  reset(): void {
    this.displayHp = 0;
  }
}
