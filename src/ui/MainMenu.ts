// MainMenu.ts - 主菜单

import { COLORS, FONT } from '../engine/UITheme';
import { UITextRenderer } from '../engine/UITextRenderer';

interface ButtonDef {
  label: string;
  action: string;
  highlight: boolean;
}

export class MainMenu {
  private text: UITextRenderer;
  private buttons: ButtonDef[] = [
    { label: '开始游戏', action: 'action', highlight: true },
    { label: '角色选择', action: 'chars', highlight: false },
    { label: '操作说明', action: 'help', highlight: false },
  ];

  constructor(dpr: number = 1) {
    this.text = new UITextRenderer(dpr);
  }

  render(ctx: CanvasRenderingContext2D, screenW: number, screenH: number, _dpr: number): void {
    // 深色渐变背景
    const grad = ctx.createLinearGradient(0, 0, 0, screenH);
    grad.addColorStop(0, '#0a0a1a');
    grad.addColorStop(0.5, '#1a1a2e');
    grad.addColorStop(1, '#0f0f1a');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, screenW, screenH);

    // 装饰粒子(静态星星)
    ctx.fillStyle = 'rgba(255,255,255,0.15)';
    const seed = 42;
    for (let i = 0; i < 60; i++) {
      const sx = ((seed * (i + 1) * 7919) % screenW);
      const sy = ((seed * (i + 1) * 6271) % (screenH * 0.6));
      const ss = ((i * 3) % 3) + 1;
      ctx.fillRect(sx, sy, ss, ss);
    }

    // 标题 "B-BABO 幸存者"
    const titleY = screenH * 0.28;

    this.text.draw(ctx, 'B-BABO', screenW / 2, titleY, {
      size: 42,
      color: COLORS.gold,
      align: 'center',
      baseline: 'middle',
      font: FONT.ui,
      shadow: true,
      shadowColor: '#ffd700',
      shadowBlur: 12,
    });

    this.text.draw(ctx, '幸存者', screenW / 2, titleY + 48, {
      size: 22,
      color: '#4361ee',
      align: 'center',
      baseline: 'middle',
      font: FONT.ui,
      shadow: true,
      shadowColor: '#4361ee',
      shadowBlur: 6,
    });

    // 副标题 "无尽深渊"
    this.text.draw(ctx, '无尽深渊', screenW / 2, titleY + 78, {
      size: 14,
      color: COLORS.textDim,
      align: 'center',
      baseline: 'middle',
      font: FONT.ui,
    });

    // 按钮
    const btnW = 180;
    const btnH = 44;
    const btnGap = 14;
    const btnStartY = screenH * 0.52;

    for (let i = 0; i < this.buttons.length; i++) {
      const btn = this.buttons[i];
      const bx = (screenW - btnW) / 2;
      const by = btnStartY + i * (btnH + btnGap);

      if (btn.highlight) {
        // 高亮按钮
        const btnGrad = ctx.createLinearGradient(bx, by, bx + btnW, by + btnH);
        btnGrad.addColorStop(0, '#e94560');
        btnGrad.addColorStop(1, '#ff6b81');
        ctx.fillStyle = btnGrad;
        ctx.beginPath();
        this._roundRect(ctx, bx, by, btnW, btnH, 8);
        ctx.fill();

        // 发光
        ctx.shadowColor = '#e94560';
        ctx.shadowBlur = 15;
        ctx.strokeStyle = '#ff6b81';
        ctx.lineWidth = 1;
        ctx.beginPath();
        this._roundRect(ctx, bx, by, btnW, btnH, 8);
        ctx.stroke();
        ctx.shadowBlur = 0;

        this.text.draw(ctx, btn.label, screenW / 2, by + btnH / 2, {
          size: 16,
          color: COLORS.white,
          align: 'center',
          baseline: 'middle',
          font: FONT.ui,
        });
      } else {
        // 普通按钮
        ctx.fillStyle = 'rgba(30,30,54,0.8)';
        ctx.beginPath();
        this._roundRect(ctx, bx, by, btnW, btnH, 8);
        ctx.fill();

        ctx.strokeStyle = COLORS.panelBorder;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        this._roundRect(ctx, bx, by, btnW, btnH, 8);
        ctx.stroke();

        this.text.draw(ctx, btn.label, screenW / 2, by + btnH / 2, {
          size: 15,
          color: COLORS.text,
          align: 'center',
          baseline: 'middle',
          font: FONT.ui,
        });
      }
    }

    // 版本号
    this.text.draw(ctx, 'v0.3.0', screenW / 2, screenH - 30, {
      size: 10,
      color: COLORS.textDim,
      align: 'center',
      baseline: 'middle',
      font: FONT.mono,
    });
  }

  hitTest(clickX: number, clickY: number, screenW: number, screenH: number): string {
    const btnW = 180;
    const btnH = 44;
    const btnGap = 14;
    const btnStartY = screenH * 0.52;

    for (let i = 0; i < this.buttons.length; i++) {
      const bx = (screenW - btnW) / 2;
      const by = btnStartY + i * (btnH + btnGap);
      if (clickX >= bx && clickX <= bx + btnW && clickY >= by && clickY <= by + btnH) {
        return this.buttons[i].action;
      }
    }
    return '';
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
