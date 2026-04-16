// CharacterSelectScreen.ts - 角色选择界面

import { COLORS, FONT } from '../engine/UITheme';
import { UITextRenderer } from '../engine/UITextRenderer';
import { type CharacterDef, renderCharacter } from '../data/CharacterRegistry';

export interface CharacterSelectState {
  characters: CharacterDef[];
  currentIndex: number;
  dpr: number;
}

export class CharacterSelectScreen {
  private text: UITextRenderer;

  constructor(dpr: number = 1) {
    this.text = new UITextRenderer(dpr);
  }

  render(
    ctx: CanvasRenderingContext2D,
    state: CharacterSelectState,
    screenW: number,
    screenH: number,
    _dpr: number,
  ): void {
    // 背景
    const grad = ctx.createLinearGradient(0, 0, 0, screenH);
    grad.addColorStop(0, '#0a0a1a');
    grad.addColorStop(1, '#1a1a2e');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, screenW, screenH);

    const char = state.characters[state.currentIndex];
    if (!char) return;

    const cx = screenW / 2;

    // 返回按钮
    this.text.draw(ctx, '< 返回', 24, 28, {
      size: 14,
      color: COLORS.text,
      align: 'left',
      baseline: 'middle',
      font: FONT.ui,
    });

    // 角色名 + 英文名
    const nameY = screenH * 0.08;
    this.text.draw(ctx, char.name, cx, nameY, {
      size: 24,
      color: COLORS.gold,
      align: 'center',
      baseline: 'middle',
      font: FONT.ui,
      shadow: true,
      shadowColor: '#ffd700',
      shadowBlur: 8,
    });

    this.text.draw(ctx, char.nameEn, cx, nameY + 32, {
      size: 14,
      color: COLORS.textDim,
      align: 'center',
      baseline: 'middle',
      font: FONT.ui,
    });

    // 情绪标签
    const emotionLabels: Record<string, string> = {
      curious: '好奇', playful: '贪玩', brave: '勇敢', calm: '冷静',
      happy: '开心', sleepy: '困倦', excited: '兴奋', mysterious: '神秘',
      angry: '愤怒', cold: '冷酷', dark: '暗黑', soft: '柔软',
      stubborn: '固执', ethereal: '飘渺', sweet: '甜美', retro: '复古',
      radiant: '耀眼', fierce: '凶猛', warm: '温暖', infinite: '无限',
    };
    const emotionText = emotionLabels[char.emotion] || char.emotion;
    this.text.draw(ctx, `[${emotionText}]`, cx, nameY + 54, {
      size: 11,
      color: '#c850c0',
      align: 'center',
      baseline: 'middle',
      font: FONT.ui,
    });

    // 角色大图(96x96渲染)
    const spriteY = nameY + 80;
    const spriteSize = 96;
    renderCharacter(ctx, char.id, cx - spriteSize / 2, spriteY, 3);

    // 属性条
    const statsY = spriteY + spriteSize + 20;
    const barW = 160;
    const barH = 10;
    const barGap = 20;
    const barStartX = cx - barW / 2 - 40;

    this._renderStatBar(ctx, 'HP', char.stats.hp, 200, barStartX, statsY, barW, barH, '#e94560', '#4a1525');
    this._renderStatBar(ctx, '速度', char.stats.speed, 300, barStartX, statsY + barGap, barW, barH, '#4361ee', '#1a2555');
    this._renderStatBar(ctx, '护甲', char.stats.armor, 20, barStartX, statsY + barGap * 2, barW, barH, '#888899', '#333344');
    this._renderStatBar(ctx, '暴击', char.stats.crit, 30, barStartX, statsY + barGap * 3, barW, barH, COLORS.gold, '#3a3010');

    // 技能描述
    const skillY = statsY + barGap * 4 + 16;

    // 被动技能
    this.text.draw(ctx, `[被动] ${char.passive.name}`, cx, skillY, {
      size: 12,
      color: '#00ff88',
      align: 'center',
      baseline: 'middle',
      font: FONT.ui,
    });
    this.text.draw(ctx, char.passive.desc, cx, skillY + 20, {
      size: 11,
      color: COLORS.textDim,
      align: 'center',
      baseline: 'middle',
      font: FONT.ui,
    });

    // 初始武器
    this.text.draw(ctx, `初始武器: ${char.initialWeapon}`, cx, skillY + 44, {
      size: 11,
      color: COLORS.text,
      align: 'center',
      baseline: 'middle',
      font: FONT.ui,
    });

    // 解锁条件
    if (char.unlockCondition) {
      this.text.draw(ctx, `解锁: ${char.unlockCondition}`, cx, skillY + 64, {
        size: 10,
        color: '#c850c0',
        align: 'center',
        baseline: 'middle',
        font: FONT.ui,
      });
    }

    // 导航按钮
    const navY = screenH * 0.88;
    const navBtnW = 100;
    const navBtnH = 36;

    // 上一角色
    this._renderNavButton(ctx, '< 上一角色', cx - navBtnW - 10, navY, navBtnW, navBtnH);
    // 下一角色
    this._renderNavButton(ctx, '下一角色 >', cx + 10, navY, navBtnW, navBtnH);

    // 确认选择按钮(金色边框)
    const confirmY = navY + navBtnH + 12;
    const confirmW = 160;
    const confirmH = 42;
    const confirmX = (screenW - confirmW) / 2;

    ctx.fillStyle = 'rgba(30,30,54,0.9)';
    ctx.beginPath();
    this._roundRect(ctx, confirmX, confirmY, confirmW, confirmH, 8);
    ctx.fill();

    ctx.strokeStyle = COLORS.gold;
    ctx.lineWidth = 2;
    ctx.beginPath();
    this._roundRect(ctx, confirmX, confirmY, confirmW, confirmH, 8);
    ctx.stroke();

    this.text.draw(ctx, '确认选择', cx, confirmY + confirmH / 2, {
      size: 16,
      color: COLORS.gold,
      align: 'center',
      baseline: 'middle',
      font: FONT.ui,
      shadow: true,
      shadowColor: '#ffd700',
      shadowBlur: 6,
    });
  }

  hitTest(clickX: number, clickY: number, screenW: number, screenH: number): string {
    const cx = screenW / 2;
    const navY = screenH * 0.88;
    const navBtnW = 100;
    const navBtnH = 36;

    // 返回按钮
    if (clickX < 80 && clickY < 50) return 'back';

    // 上一角色
    if (clickX >= cx - navBtnW - 10 && clickX <= cx - 10 && clickY >= navY && clickY <= navY + navBtnH) {
      return 'prev';
    }

    // 下一角色
    if (clickX >= cx + 10 && clickX <= cx + navBtnW + 10 && clickY >= navY && clickY <= navY + navBtnH) {
      return 'next';
    }

    // 确认选择
    const confirmY = navY + navBtnH + 12;
    const confirmW = 160;
    const confirmH = 42;
    const confirmX = (screenW - confirmW) / 2;
    if (clickX >= confirmX && clickX <= confirmX + confirmW && clickY >= confirmY && clickY <= confirmY + confirmH) {
      return 'confirm';
    }

    return '';
  }

  private _renderStatBar(
    ctx: CanvasRenderingContext2D,
    label: string,
    value: number,
    max: number,
    x: number,
    y: number,
    w: number,
    h: number,
    fillColor: string,
    bgColor: string,
  ): void {
    // 标签
    this.text.draw(ctx, label, x, y + h / 2, {
      size: 11,
      color: COLORS.text,
      align: 'right',
      baseline: 'middle',
      font: FONT.ui,
    });

    const barX = x + 40;

    // 背景
    ctx.fillStyle = bgColor;
    ctx.fillRect(barX, y, w, h);

    // 填充
    const ratio = Math.min(value / max, 1);
    if (ratio > 0) {
      ctx.fillStyle = fillColor;
      ctx.fillRect(barX, y, w * ratio, h);

      // 高光
      ctx.fillStyle = 'rgba(255,255,255,0.2)';
      ctx.fillRect(barX, y, w * ratio, h / 2);
    }

    // 数值
    this.text.draw(ctx, `${value}`, barX + w + 8, y + h / 2, {
      size: 10,
      color: fillColor,
      align: 'left',
      baseline: 'middle',
      font: FONT.mono,
    });
  }

  private _renderNavButton(
    ctx: CanvasRenderingContext2D,
    label: string,
    x: number,
    y: number,
    w: number,
    h: number,
  ): void {
    ctx.fillStyle = 'rgba(30,30,54,0.8)';
    ctx.beginPath();
    this._roundRect(ctx, x, y, w, h, 6);
    ctx.fill();

    ctx.strokeStyle = COLORS.panelBorder;
    ctx.lineWidth = 1;
    ctx.beginPath();
    this._roundRect(ctx, x, y, w, h, 6);
    ctx.stroke();

    this.text.draw(ctx, label, x + w / 2, y + h / 2, {
      size: 12,
      color: COLORS.text,
      align: 'center',
      baseline: 'middle',
      font: FONT.ui,
    });
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
