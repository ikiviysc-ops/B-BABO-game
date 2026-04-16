// GameOverScreen.ts - 游戏结束界面

import { COLORS, FONT } from '../engine/UITheme';
import { UITextRenderer } from '../engine/UITextRenderer';

export interface GameOverState {
  kills: number;
  score: number;
  level: number;
  elapsed: number;
  weapons: { name: string; level: number }[];
}

export class GameOverScreen {
  private text: UITextRenderer;

  constructor(dpr: number = 1) {
    this.text = new UITextRenderer(dpr);
  }

  render(
    ctx: CanvasRenderingContext2D,
    state: GameOverState,
    screenW: number,
    screenH: number,
    _dpr: number,
  ): void {
    // 半透明遮罩
    ctx.fillStyle = 'rgba(0,0,0,0.75)';
    ctx.fillRect(0, 0, screenW, screenH);

    const centerX = screenW / 2;
    const startY = screenH * 0.2;

    // GAME OVER 标题
    this.text.draw(ctx, 'GAME OVER', centerX, startY, {
      size: 32,
      color: COLORS.accent,
      align: 'center',
      baseline: 'middle',
      font: FONT.ui,
      shadow: true,
      shadowColor: '#e94560',
      shadowBlur: 12,
    });

    // 分割线
    const lineY = startY + 40;
    ctx.strokeStyle = 'rgba(233,69,96,0.3)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(centerX - 100, lineY);
    ctx.lineTo(centerX + 100, lineY);
    ctx.stroke();

    // 统计数据
    const statsY = lineY + 30;
    const lineH = 32;

    const mins = Math.floor(state.elapsed / 60);
    const secs = Math.floor(state.elapsed % 60);

    this._renderStatRow(ctx, '存活时间', `${mins}分${secs.toString().padStart(2, '0')}秒`, centerX, statsY, COLORS.text);
    this._renderStatRow(ctx, '击杀数', `${state.kills}`, centerX, statsY + lineH, COLORS.accentLight);
    this._renderStatRow(ctx, '分数', `${state.score}`, centerX, statsY + lineH * 2, COLORS.gold);
    this._renderStatRow(ctx, '等级', `Lv.${state.level}`, centerX, statsY + lineH * 3, '#00ff88');

    // 武器列表
    if (state.weapons.length > 0) {
      const weaponY = statsY + lineH * 4 + 16;
      this.text.draw(ctx, '使用武器', centerX, weaponY, {
        size: 12,
        color: COLORS.textDim,
        align: 'center',
        baseline: 'middle',
        font: FONT.ui,
      });

      const weaponStr = state.weapons.map(w => `${w.name} Lv.${w.level}`).join(' / ');
      this.text.draw(ctx, weaponStr, centerX, weaponY + 22, {
        size: 11,
        color: COLORS.text,
        align: 'center',
        baseline: 'middle',
        font: FONT.ui,
      });
    }

    // 按钮
    const btnW = 160;
    const btnH = 42;
    const btnGap = 12;
    const btnStartY = screenH * 0.72;

    // 重新开始按钮
    const restartX = (screenW - btnW) / 2;
    this._renderButton(ctx, '重新开始', restartX, btnStartY, btnW, btnH, true);

    // 返回菜单按钮
    this._renderButton(ctx, '返回菜单', restartX, btnStartY + btnH + btnGap, btnW, btnH, false);
  }

  hitTest(clickX: number, clickY: number, screenW: number, screenH: number): string {
    const btnW = 160;
    const btnH = 42;
    const btnGap = 12;
    const btnStartY = screenH * 0.72;
    const btnX = (screenW - btnW) / 2;

    // 重新开始
    if (clickX >= btnX && clickX <= btnX + btnW && clickY >= btnStartY && clickY <= btnStartY + btnH) {
      return 'restart';
    }
    // 返回菜单
    if (clickX >= btnX && clickX <= btnX + btnW && clickY >= btnStartY + btnH + btnGap && clickY <= btnStartY + btnH * 2 + btnGap) {
      return 'menu';
    }

    return '';
  }

  private _renderStatRow(
    ctx: CanvasRenderingContext2D,
    label: string,
    value: string,
    cx: number,
    y: number,
    valueColor: string,
  ): void {
    // 标签
    this.text.draw(ctx, label, cx - 60, y, {
      size: 13,
      color: COLORS.textDim,
      align: 'right',
      baseline: 'middle',
      font: FONT.ui,
    });
    // 值
    this.text.draw(ctx, value, cx + 60, y, {
      size: 14,
      color: valueColor,
      align: 'left',
      baseline: 'middle',
      font: FONT.mono,
    });
  }

  private _renderButton(
    ctx: CanvasRenderingContext2D,
    label: string,
    x: number,
    y: number,
    w: number,
    h: number,
    highlight: boolean,
  ): void {
    if (highlight) {
      const grad = ctx.createLinearGradient(x, y, x + w, y + h);
      grad.addColorStop(0, '#e94560');
      grad.addColorStop(1, '#ff6b81');
      ctx.fillStyle = grad;
    } else {
      ctx.fillStyle = 'rgba(30,30,54,0.8)';
    }
    ctx.beginPath();
    this._roundRect(ctx, x, y, w, h, 8);
    ctx.fill();

    ctx.strokeStyle = highlight ? '#ff6b81' : COLORS.panelBorder;
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    this._roundRect(ctx, x, y, w, h, 8);
    ctx.stroke();

    this.text.draw(ctx, label, x + w / 2, y + h / 2, {
      size: 15,
      color: COLORS.white,
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
