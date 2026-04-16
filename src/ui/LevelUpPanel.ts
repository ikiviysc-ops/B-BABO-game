/**
 * 升级选择面板 — 专业卡片式选择界面
 * 特性：稀有度颜色、弹入动画、属性变化预览
 */

import { UI, CARD, duration, easing } from '@engine/UITheme';
import { UITextRenderer } from '@engine/UITextRenderer';
import { getPixelIcon, getIconIdForOption } from '@engine/PixelIcons';
import type { LevelUpOption } from '@systems/LevelUpSystem';

export class LevelUpPanel {
  private text: UITextRenderer;
  private dpr: number;
  private animTimer = 0;
  private animDuration = duration.slow;
  private _visible = false;

  get visible(): boolean { return this._visible; }
  show(): void { this._visible = true; this.animTimer = 0; }
  hide(): void { this._visible = false; }

  constructor(ctx: CanvasRenderingContext2D, dpr: number) {
    this.text = new UITextRenderer(ctx);
    this.dpr = dpr;
  }

  update(dt: number): void {
    if (this._visible && this.animTimer < this.animDuration) {
      this.animTimer = Math.min(this.animTimer + dt, this.animDuration);
    }
  }

  render(ctx: CanvasRenderingContext2D, options: LevelUpOption[], level: number, screenW: number, screenH: number): void {
    if (!this._visible) return;

    const dpr = this.dpr;
    ctx.save();
    ctx.resetTransform();

    // 遮罩
    ctx.fillStyle = UI.bg.overlay;
    ctx.fillRect(0, 0, screenW, screenH);

    // 标题
    const titleProgress = Math.min(this.animTimer / 200, 1);
    const titleScale = 0.5 + 0.5 * easing.easeOutBack(titleProgress);
    ctx.save();
    ctx.translate(screenW / 2, 50 * dpr);
    ctx.scale(titleScale, titleScale);
    ctx.translate(-screenW / 2, -50 * dpr);
    this.text.draw(`LEVEL UP!  Lv.${level}`, screenW / 2, 30 * dpr, {
      size: 20 * dpr, color: UI.text.gold, align: 'center',
      stroke: true, strokeColor: '#8b6914', strokeWidth: 3 * dpr,
    });
    ctx.restore();

    // 卡片
    const cardW = Math.min(CARD.width * dpr, (screenW - 40 * dpr) / options.length);
    const cardH = CARD.height * dpr;
    const gap = CARD.gap * dpr;
    const totalW = options.length * cardW + (options.length - 1) * gap;
    const startX = (screenW - totalW) / 2;
    const startY = screenH / 2 - cardH / 2 + 10 * dpr;

    for (let i = 0; i < options.length; i++) {
      const opt = options[i];
      const x = startX + i * (cardW + gap);

      // 弹入动画（依次延迟）
      const cardDelay = i * 80;
      const cardProgress = Math.max(0, Math.min((this.animTimer - cardDelay) / 300, 1));
      if (cardProgress <= 0) continue;

      const cardEased = easing.easeOutBack(cardProgress);
      const cardOffsetY = (1 - cardEased) * 100 * dpr;

      ctx.save();
      ctx.translate(0, cardOffsetY);
      ctx.globalAlpha = cardProgress;

      this.renderCard(ctx, opt, x, startY, cardW, cardH, i);

      ctx.restore();
    }

    // 底部提示
    if (this.animTimer > 400) {
      this.text.draw('按 1/2/3 或 点击选择', screenW / 2, startY + cardH + 20 * dpr, {
        size: 10 * dpr, color: UI.text.tertiary, align: 'center', shadow: false,
      });
    }

    ctx.restore();
  }

  private renderCard(ctx: CanvasRenderingContext2D, opt: LevelUpOption, x: number, y: number, w: number, h: number, index: number): void {
    const dpr = this.dpr;
    const pad = CARD.padding * dpr;

    // 确定稀有度颜色（默认普通）
    const borderColor = UI.panel.borderStrong;

    // 卡片背景
    ctx.fillStyle = UI.bg.tertiary;
    ctx.beginPath();
    ctx.roundRect(x, y, w, h, CARD.radius * dpr);
    ctx.fill();

    // 内部渐变叠加
    const grad = ctx.createLinearGradient(x, y, x, y + h);
    grad.addColorStop(0, 'rgba(255,255,255,0.03)');
    grad.addColorStop(1, 'rgba(0,0,0,0.1)');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.roundRect(x, y, w, h, CARD.radius * dpr);
    ctx.fill();

    // 边框
    ctx.strokeStyle = borderColor;
    ctx.lineWidth = 1.5 * dpr;
    ctx.beginPath();
    ctx.roundRect(x + 0.5, y + 0.5, w - 1, h - 1, CARD.radius * dpr);
    ctx.stroke();

    // 内边框
    ctx.strokeStyle = 'rgba(255,255,255,0.05)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.roundRect(x + 2.5, y + 2.5, w - 5, h - 5, (CARD.radius - 1) * dpr);
    ctx.stroke();

    // 序号
    this.text.draw(`[${index + 1}]`, x + w / 2, y + 12 * dpr, {
      size: 9 * dpr, color: UI.text.tertiary, align: 'center', shadow: false,
    });

    // 图标
    const iconId = getIconIdForOption(opt.id);
    const iconSize = Math.min(CARD.iconSize * dpr, w - pad * 2);
    const icon = getPixelIcon(iconId, iconSize);
    ctx.imageSmoothingEnabled = false;
    ctx.drawImage(icon, x + (w - iconSize) / 2, y + 22 * dpr, iconSize, iconSize);

    // 名称
    this.text.draw(opt.name, x + w / 2, y + 22 * dpr + iconSize + 8 * dpr, {
      size: 12 * dpr, color: UI.text.primary, align: 'center',
      stroke: true, strokeWidth: 2 * dpr,
    });

    // 类型标签
    const isNew = opt.type === 'new_weapon';
    const typeLabel = isNew ? '[NEW]' : '[UP]';
    const typeColor = isNew ? UI.accent.green : UI.accent.blue;
    this.text.draw(typeLabel, x + w / 2, y + 22 * dpr + iconSize + 24 * dpr, {
      size: 9 * dpr, color: typeColor, align: 'center', shadow: false,
    });

    // 分隔线
    const sepY = y + 22 * dpr + iconSize + 34 * dpr;
    ctx.fillStyle = 'rgba(255,255,255,0.08)';
    ctx.fillRect(x + pad, sepY, w - pad * 2, 1);

    // 描述
    const descY = sepY + 8 * dpr;
    this.text.drawWrapped(opt.description, x + w / 2, descY, w - pad * 2, {
      size: 9 * dpr, color: UI.text.secondary, align: 'center', shadow: false,
    });
  }

  /** 检测点击了哪张卡片，返回索引或-1 */
  hitTest(clickX: number, clickY: number, options: LevelUpOption[], screenW: number, screenH: number): number {
    if (!this._visible || this.animTimer < 300) return -1;

    const dpr = this.dpr;
    const cardW = Math.min(CARD.width * dpr, (screenW - 40 * dpr) / options.length);
    const cardH = CARD.height * dpr;
    const gap = CARD.gap * dpr;
    const totalW = options.length * cardW + (options.length - 1) * gap;
    const startX = (screenW - totalW) / 2;
    const startY = screenH / 2 - cardH / 2 + 10 * dpr;

    const cx = clickX * dpr;
    const cy = clickY * dpr;

    if (cy < startY || cy > startY + cardH) return -1;

    for (let i = 0; i < options.length; i++) {
      const cardX = startX + i * (cardW + gap);
      if (cx >= cardX && cx <= cardX + cardW) return i;
    }
    return -1;
  }
}
