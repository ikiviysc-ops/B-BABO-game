// LevelUpPanel.ts - 升级选择面板

import { COLORS, CARD, FONT, RARITY } from '../engine/UITheme';
import { UITextRenderer } from '../engine/UITextRenderer';
import type { LevelUpOption } from '../systems/LevelUpSystem';

export class LevelUpPanel {
  private text: UITextRenderer;

  constructor(dpr: number = 1) {
    this.text = new UITextRenderer(dpr);
  }

  render(
    ctx: CanvasRenderingContext2D,
    options: LevelUpOption[],
    level: number,
    screenW: number,
    screenH: number,
    _dpr: number,
  ): void {
    // 半透明遮罩
    ctx.fillStyle = 'rgba(0,0,0,0.7)';
    ctx.fillRect(0, 0, screenW, screenH);

    // 标题
    this.text.draw(ctx, `LEVEL UP! Lv.${level}`, screenW / 2, screenH * 0.25, {
      size: 20,
      color: COLORS.gold,
      align: 'center',
      baseline: 'middle',
      font: FONT.ui,
      shadow: true,
      shadowColor: '#ffd700',
      shadowBlur: 8,
    });

    // 卡片布局
    const cardW = CARD.width;
    const cardH = CARD.height;
    const gap = CARD.gap;
    const totalW = options.length * cardW + (options.length - 1) * gap;
    const startX = (screenW - totalW) / 2;
    const startY = screenH * 0.35;

    for (let i = 0; i < options.length; i++) {
      const opt = options[i];
      const cx = startX + i * (cardW + gap);
      this._renderCard(ctx, opt, cx, startY, cardW, cardH, i);
    }

    // 底部提示
    this.text.draw(ctx, '点击卡片选择', screenW / 2, startY + cardH + 30, {
      size: 12,
      color: COLORS.textDim,
      align: 'center',
      baseline: 'middle',
      font: FONT.ui,
    });
  }

  private _renderCard(
    ctx: CanvasRenderingContext2D,
    opt: LevelUpOption,
    x: number,
    y: number,
    w: number,
    h: number,
    _index: number,
  ): void {
    const pad = CARD.padding;
    const radius = CARD.radius;

    // 卡片背景
    ctx.fillStyle = '#1a1a3e';
    ctx.beginPath();
    this._roundRect(ctx, x, y, w, h, radius);
    ctx.fill();

    // 边框 - 根据类型着色
    let borderColor: string = COLORS.panelBorder;
    if (opt.type === 'weapon') borderColor = RARITY.SR.color;
    else if (opt.type === 'weapon_upgrade') borderColor = RARITY.R.color;
    else if (opt.type === 'stat') borderColor = RARITY.N.color;

    ctx.strokeStyle = borderColor;
    ctx.lineWidth = 2;
    ctx.beginPath();
    this._roundRect(ctx, x, y, w, h, radius);
    ctx.stroke();

    // 图标区域背景
    const iconY = y + pad;
    const iconH = CARD.iconSize;
    ctx.fillStyle = 'rgba(255,255,255,0.05)';
    ctx.fillRect(x + pad, iconY, w - pad * 2, iconH);

    // 图标文字(用文字代替真实图标)
    const iconChar = this._getIconChar(opt.icon);
    this.text.draw(ctx, iconChar, x + w / 2, iconY + iconH / 2, {
      size: 28,
      color: borderColor,
      align: 'center',
      baseline: 'middle',
      font: FONT.ui,
    });

    // 标签 [NEW] 或 [UP]
    let label = '';
    let labelColor: string = COLORS.text;
    if (opt.type === 'weapon') {
      label = 'NEW';
      labelColor = RARITY.SR.color;
    } else if (opt.type === 'weapon_upgrade') {
      label = 'UP';
      labelColor = RARITY.R.color;
    }

    if (label) {
      const labelX = x + w - pad - 4;
      const labelY = y + pad + CARD.iconSize + 6;
      this.text.draw(ctx, label, labelX, labelY, {
        size: 8,
        color: labelColor,
        align: 'right',
        font: FONT.mono,
      });
    }

    // 名称
    const nameY = y + pad + CARD.iconSize + 22;
    this.text.draw(ctx, opt.name, x + w / 2, nameY, {
      size: CARD.titleSize,
      color: COLORS.white,
      align: 'center',
      baseline: 'middle',
      font: FONT.ui,
      shadow: true,
    });

    // 描述(自动换行)
    const descY = nameY + 20;
    this._drawWrappedText(ctx, opt.desc, x + pad + 4, descY, w - pad * 2 - 8, 14, {
      size: CARD.descSize,
      color: COLORS.textDim,
      align: 'center',
      font: FONT.ui,
    });
  }

  hitTest(
    clickX: number,
    clickY: number,
    options: LevelUpOption[],
    screenW: number,
    screenH: number,
  ): number {
    const cardW = CARD.width;
    const cardH = CARD.height;
    const gap = CARD.gap;
    const totalW = options.length * cardW + (options.length - 1) * gap;
    const startX = (screenW - totalW) / 2;
    const startY = screenH * 0.35;

    for (let i = 0; i < options.length; i++) {
      const cx = startX + i * (cardW + gap);
      if (clickX >= cx && clickX <= cx + cardW && clickY >= startY && clickY <= startY + cardH) {
        return i;
      }
    }
    return -1;
  }

  private _getIconChar(icon: string): string {
    const map: Record<string, string> = {
      heart: '\u2665',
      boot: '\u26A0',
      sword: '\u2694',
      shield: '\u26E8',
      star: '\u2605',
      weapon: '\u2692',
      upgrade: '\u2B06',
    };
    return map[icon] || '\u2726';
  }

  private _drawWrappedText(
    ctx: CanvasRenderingContext2D,
    text: string,
    x: number,
    y: number,
    maxW: number,
    lineH: number,
    opts: { size: number; color: string; align: CanvasTextAlign; font: string },
  ): void {
    ctx.save();
    ctx.font = `${opts.size}px ${opts.font}`;
    ctx.textAlign = opts.align;
    ctx.fillStyle = opts.color;

    const chars = text.split('');
    let line = '';
    let ly = y;

    for (const ch of chars) {
      const test = line + ch;
      const w = ctx.measureText(test).width;
      if (w > maxW && line.length > 0) {
        ctx.fillText(line, x, ly);
        line = ch;
        ly += lineH;
      } else {
        line = test;
      }
    }
    if (line) ctx.fillText(line, x, ly);
    ctx.restore();
  }

  private _roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number): void {
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + w - r, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + r);
    ctx.lineTo(x + w, y + h - r);
    ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    ctx.lineTo(x + r, y + h);
    ctx.quadraticCurveTo(x, y + h, x, y + h - r);
    ctx.lineTo(x, y + r);
    ctx.quadraticCurveTo(x, y, x + r, y);
    ctx.closePath();
  }
}
