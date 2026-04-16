/**
 * 角色选择界面 — 浏览和选择角色
 *
 * 特性：
 * - 角色大图展示（96x96 像素精灵）
 * - 属性条彩色填充（HP红/速度蓝/护甲灰/暴击金）
 * - 未解锁角色显示剪影 + 锁定图标 + 解锁条件
 * - 切换角色时有滑动过渡动画
 * - 翻页按钮 + 返回按钮 + 确认按钮
 */

import { UI, duration, easing } from '@engine/UITheme';
import { UITextRenderer } from '@engine/UITextRenderer';
import { renderPixelSprite } from '@engine/PixelRenderer';
import type { CharacterDef, CharacterSprite } from '@data/CharacterRegistry';

// ═══════════════════════════════════════════════════════
// 属性条定义
// ═══════════════════════════════════════════════════════

interface StatBar {
  label: string;
  value: number;
  max: number;
  displayValue: string;
  color: string;
  hiColor: string;
  bgColor: string;
}

// ═══════════════════════════════════════════════════════
// CharacterSelectScreen
// ═══════════════════════════════════════════════════════

export class CharacterSelectScreen {
  private text: UITextRenderer;
  private dpr: number;
  private animTimer = 0;
  private slideDirection: 0 | 1 | -1 = 0; // 0=无, 1=下一, -1=上一
  private slideProgress = 0;
  private hoverBtn: string | null = null;

  constructor(ctx: CanvasRenderingContext2D, dpr: number) {
    this.text = new UITextRenderer(ctx);
    this.dpr = dpr;
  }

  reset(): void {
    this.animTimer = 0;
    this.slideDirection = 0;
    this.slideProgress = 0;
    this.hoverBtn = null;
  }

  /** 触发切换动画 */
  triggerSlide(direction: 1 | -1): void {
    if (this.slideDirection !== 0) return; // 动画中不允许再次触发
    this.slideDirection = direction;
    this.slideProgress = 0;
  }

  /** 切换动画是否完成 */
  get slideComplete(): boolean {
    return this.slideDirection === 0 || this.slideProgress >= 1;
  }

  update(dt: number): void {
    this.animTimer += dt;

    // 更新滑动动画
    if (this.slideDirection !== 0) {
      this.slideProgress += dt / duration.normal;
      if (this.slideProgress >= 1) {
        this.slideProgress = 1;
        this.slideDirection = 0;
      }
    }
  }

  // ─── 主渲染 ───────────────────────────────────────

  render(
    ctx: CanvasRenderingContext2D,
    charDef: CharacterDef,
    charSprite: CharacterSprite | undefined,
    screenW: number,
    screenH: number,
  ): void {
    const dpr = this.dpr;
    ctx.save();
    ctx.resetTransform();

    // 背景
    ctx.fillStyle = UI.bg.primary;
    ctx.fillRect(0, 0, screenW, screenH);

    // 渐变装饰
    const grad = ctx.createRadialGradient(screenW / 2, screenH * 0.4, 0, screenW / 2, screenH * 0.4, screenW * 0.6);
    grad.addColorStop(0, 'rgba(40, 30, 80, 0.3)');
    grad.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, screenW, screenH);

    // 内容区域
    const contentW = Math.min(360 * dpr, screenW - 16 * dpr);
    const cx = (screenW - contentW) / 2;
    const pad = 12 * dpr;

    // 滑动偏移计算
    const slideX = this.getSlideOffset(contentW);

    ctx.save();
    ctx.translate(slideX, 0);
    ctx.beginPath();
    ctx.rect(cx, 0, contentW, screenH);
    ctx.clip();

    // 顶部栏 — 返回 + 标题
    this.renderHeader(ctx, cx, pad, contentW);

    // 角色信息区
    const infoY = pad + 36 * dpr;
    this.renderCharInfo(ctx, cx + pad, infoY, contentW - pad * 2, charDef, charSprite);

    // 属性条
    const statsY = infoY + 110 * dpr;
    this.renderStatBars(ctx, cx + pad, statsY, contentW - pad * 2, charDef);

    // 技能描述
    const skillY = statsY + 120 * dpr;
    this.renderSkills(ctx, cx + pad, skillY, contentW - pad * 2, charDef);

    // 未解锁覆盖层
    if (!charDef.unlocked) {
      this.renderLockedOverlay(ctx, cx + pad, infoY, contentW - pad * 2, 200 * dpr, charDef);
    }

    ctx.restore(); // clip

    // 翻页按钮（不受滑动影响）
    const navY = screenH - 120 * dpr;
    this.renderNavButtons(ctx, cx, navY, contentW);

    // 确认按钮
    const confirmY = screenH - 60 * dpr;
    this.renderConfirmButton(ctx, cx, confirmY, contentW, charDef.unlocked);

    ctx.restore();
  }

  // ─── 顶部栏 ───────────────────────────────────────

  private renderHeader(ctx: CanvasRenderingContext2D, x: number, y: number, w: number): void {
    const dpr = this.dpr;

    // 返回按钮区域（左侧）
    this.text.draw('< 返回', x + 4 * dpr, y + 6 * dpr, {
      size: 12 * dpr, color: UI.text.secondary,
    });

    // 标题（居中）
    this.text.draw('角色选择', x + w / 2, y + 6 * dpr, {
      size: 16 * dpr, color: UI.text.primary, align: 'center',
      stroke: true, strokeWidth: 2 * dpr,
    });

    // 分隔线
    ctx.fillStyle = 'rgba(255,255,255,0.08)';
    ctx.fillRect(x, y + 28 * dpr, w, 1);
  }

  // ─── 角色信息 ─────────────────────────────────────

  private renderCharInfo(
    ctx: CanvasRenderingContext2D,
    x: number, y: number, w: number,
    charDef: CharacterDef,
    charSprite: CharacterSprite | undefined,
  ): void {
    const dpr = this.dpr;
    const spriteSize = 96 * dpr;

    // 角色大图
    if (charSprite) {
      const sprite = renderPixelSprite(charSprite.sprite, charSprite.palette, 3);
      const drawSize = spriteSize;
      ctx.imageSmoothingEnabled = false;
      ctx.drawImage(sprite, x, y + 4 * dpr, drawSize, drawSize);

      // 角色边框
      ctx.strokeStyle = charDef.unlocked ? UI.panel.borderStrong : 'rgba(255,255,255,0.05)';
      ctx.lineWidth = 1.5 * dpr;
      ctx.strokeRect(x - 0.5, y + 3.5 * dpr, drawSize + 1, drawSize + 1);
    } else {
      // 无精灵时显示占位
      ctx.fillStyle = 'rgba(255,255,255,0.05)';
      ctx.fillRect(x, y + 4 * dpr, spriteSize, spriteSize);
      ctx.strokeStyle = 'rgba(255,255,255,0.1)';
      ctx.lineWidth = 1;
      ctx.strokeRect(x + 0.5, y + 4.5 * dpr, spriteSize - 1, spriteSize - 1);
    }

    // 角色名 + 系列
    const textX = x + spriteSize + 12 * dpr;
    const textW = w - spriteSize - 12 * dpr;

    this.text.draw(charDef.name, textX, y + 8 * dpr, {
      size: 16 * dpr, color: UI.text.primary, stroke: true, strokeWidth: 2 * dpr,
    });

    if (charSprite) {
      this.text.draw(charSprite.hironoSeries, textX, y + 28 * dpr, {
        size: 10 * dpr, color: UI.text.secondary, shadow: false,
      });
    }

    // 分隔线
    ctx.fillStyle = 'rgba(255,255,255,0.08)';
    ctx.fillRect(textX, y + 42 * dpr, textW, 1);
  }

  // ─── 属性条 ───────────────────────────────────────

  private renderStatBars(
    ctx: CanvasRenderingContext2D,
    x: number, y: number, w: number,
    charDef: CharacterDef,
  ): void {
    const dpr = this.dpr;
    const bars = this.buildStatBars(charDef);
    const barH = 12 * dpr;
    const barGap = 22 * dpr;
    const labelW = 50 * dpr;
    const valueW = 40 * dpr;
    const barW = w - labelW - valueW - 8 * dpr;

    for (let i = 0; i < bars.length; i++) {
      const bar = bars[i];
      const by = y + i * barGap;

      // 属性标签
      this.text.draw(bar.label, x, by, {
        size: 10 * dpr, color: UI.text.secondary, shadow: false,
      });

      // 属性值
      this.text.draw(bar.displayValue, x + labelW + barW + 8 * dpr, by, {
        size: 10 * dpr, color: UI.text.primary, shadow: false,
      });

      // 条背景
      const barX = x + labelW;
      const barY = by + 2 * dpr;
      ctx.fillStyle = bar.bgColor;
      ctx.beginPath();
      ctx.roundRect(barX, barY, barW, barH, 2 * dpr);
      ctx.fill();

      // 条填充
      const ratio = Math.max(0, Math.min(bar.value / bar.max, 1));
      if (ratio > 0) {
        const fillW = barW * ratio;
        const grad = ctx.createLinearGradient(barX, barY, barX, barY + barH);
        grad.addColorStop(0, bar.hiColor);
        grad.addColorStop(1, bar.color);
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.roundRect(barX, barY, fillW, barH, 2 * dpr);
        ctx.fill();

        // 高光线
        ctx.fillStyle = 'rgba(255,255,255,0.2)';
        ctx.fillRect(barX + 1, barY + 1, fillW - 2, 1);
      }

      // 条边框
      ctx.strokeStyle = 'rgba(255,255,255,0.1)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.roundRect(barX + 0.5, barY + 0.5, barW - 1, barH - 1, 2 * dpr);
      ctx.stroke();
    }
  }

  // ─── 技能描述 ─────────────────────────────────────

  private renderSkills(
    ctx: CanvasRenderingContext2D,
    x: number, y: number, w: number,
    charDef: CharacterDef,
  ): void {
    const dpr = this.dpr;

    // 分隔线
    ctx.fillStyle = 'rgba(255,255,255,0.08)';
    ctx.fillRect(x, y, w, 1);

    const startY = y + 8 * dpr;

    // 被动技能
    this.text.draw('被动:', x, startY, {
      size: 10 * dpr, color: UI.accent.green, shadow: false,
    });
    this.text.drawWrapped(charDef.passive, x, startY + 14 * dpr, w, {
      size: 9 * dpr, color: UI.text.secondary, shadow: false,
    });

    // 主动技能
    const activeY = startY + 40 * dpr;
    this.text.draw('主动:', x, activeY, {
      size: 10 * dpr, color: UI.accent.blue, shadow: false,
    });
    this.text.drawWrapped(charDef.active, x, activeY + 14 * dpr, w, {
      size: 9 * dpr, color: UI.text.secondary, shadow: false,
    });

    // CD
    this.text.draw(`CD: ${charDef.activeCd}s`, x + w, activeY, {
      size: 9 * dpr, color: UI.text.tertiary, align: 'right', shadow: false,
    });
  }

  // ─── 未解锁覆盖层 ─────────────────────────────────

  private renderLockedOverlay(
    ctx: CanvasRenderingContext2D,
    x: number, y: number, w: number, h: number,
    charDef: CharacterDef,
  ): void {
    const dpr = this.dpr;

    // 半透明遮罩
    ctx.fillStyle = 'rgba(0,0,0,0.6)';
    ctx.fillRect(x, y, w, h);

    // 锁定图标
    const lockSize = 32 * dpr;
    const lockX = x + w / 2 - lockSize / 2;
    const lockY = y + h / 2 - lockSize / 2 - 10 * dpr;

    // 简单绘制锁图标
    ctx.strokeStyle = UI.text.tertiary;
    ctx.lineWidth = 2 * dpr;
    // 锁身
    ctx.fillStyle = 'rgba(255,255,255,0.1)';
    ctx.beginPath();
    ctx.roundRect(lockX + 4 * dpr, lockY + lockSize * 0.4, lockSize - 8 * dpr, lockSize * 0.55, 3 * dpr);
    ctx.fill();
    ctx.stroke();
    // 锁环
    ctx.beginPath();
    ctx.arc(lockX + lockSize / 2, lockY + lockSize * 0.4, lockSize * 0.25, Math.PI, 0);
    ctx.stroke();

    // 解锁条件
    this.text.draw(charDef.unlockCondition, x + w / 2, lockY + lockSize + 8 * dpr, {
      size: 10 * dpr, color: UI.text.tertiary, align: 'center', shadow: false,
    });
  }

  // ─── 翻页按钮 ─────────────────────────────────────

  private renderNavButtons(ctx: CanvasRenderingContext2D, panelX: number, y: number, panelW: number): void {
    const dpr = this.dpr;
    const btnW = 80 * dpr;
    const btnH = 36 * dpr;

    // 上一角色
    const prevX = panelX + 12 * dpr;
    this.renderSmallButton(ctx, prevX, y, btnW, btnH, '< 上一角色', 'prev');

    // 下一角色
    const nextX = panelX + panelW - btnW - 12 * dpr;
    this.renderSmallButton(ctx, nextX, y, btnW, btnH, '下一角色 >', 'next');
  }

  // ─── 确认按钮 ─────────────────────────────────────

  private renderConfirmButton(
    ctx: CanvasRenderingContext2D,
    panelX: number, y: number, panelW: number,
    unlocked: boolean,
  ): void {
    const dpr = this.dpr;
    const btnW = Math.min(180 * dpr, panelW - 24 * dpr);
    const btnH = 40 * dpr;
    const btnX = panelX + (panelW - btnW) / 2;
    const isHover = this.hoverBtn === 'confirm';

    // 按钮背景
    ctx.fillStyle = unlocked
      ? (isHover ? 'rgba(255,204,0,0.15)' : 'rgba(255,204,0,0.08)')
      : 'rgba(255,255,255,0.03)';
    ctx.beginPath();
    ctx.roundRect(btnX, y, btnW, btnH, 4 * dpr);
    ctx.fill();

    // 边框
    if (unlocked) {
      ctx.strokeStyle = isHover ? UI.text.gold : 'rgba(255,204,0,0.4)';
      ctx.lineWidth = (isHover ? 2 : 1.5) * dpr;
    } else {
      ctx.strokeStyle = 'rgba(255,255,255,0.08)';
      ctx.lineWidth = 1;
    }
    ctx.beginPath();
    ctx.roundRect(btnX + 0.5, y + 0.5, btnW - 1, btnH - 1, 4 * dpr);
    ctx.stroke();

    // 文字
    const label = unlocked ? '确认选择' : '未解锁';
    const color = unlocked
      ? (isHover ? UI.text.gold : '#e8d8a0')
      : UI.text.tertiary;

    this.text.draw(label, btnX + btnW / 2, y + btnH / 2 - 6 * dpr, {
      size: 14 * dpr, color, align: 'center',
      stroke: true, strokeWidth: 2 * dpr,
    });
  }

  // ─── 通用小按钮 ───────────────────────────────────

  private renderSmallButton(
    ctx: CanvasRenderingContext2D,
    x: number, y: number, w: number, h: number,
    label: string, id: string,
  ): void {
    const dpr = this.dpr;
    const isHover = this.hoverBtn === id;

    ctx.fillStyle = isHover ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.04)';
    ctx.beginPath();
    ctx.roundRect(x, y, w, h, 4 * dpr);
    ctx.fill();

    ctx.strokeStyle = isHover ? 'rgba(255,255,255,0.3)' : 'rgba(255,255,255,0.1)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.roundRect(x + 0.5, y + 0.5, w - 1, h - 1, 4 * dpr);
    ctx.stroke();

    this.text.draw(label, x + w / 2, y + h / 2 - 5 * dpr, {
      size: 11 * dpr, color: isHover ? UI.text.primary : UI.text.secondary, align: 'center',
      shadow: false,
    });
  }

  // ─── 点击检测 ─────────────────────────────────────

  hitTest(clickX: number, clickY: number, screenW: number, screenH: number): 'prev' | 'next' | 'confirm' | 'back' | null {
    const dpr = this.dpr;
    const contentW = Math.min(360 * dpr, screenW - 16 * dpr);
    const cx = (screenW - contentW) / 2;
    const pad = 12 * dpr;

    const cxp = clickX * dpr;
    const cyp = clickY * dpr;

    // 返回按钮（顶部左侧）
    if (cxp >= cx && cxp <= cx + 60 * dpr && cyp >= pad && cyp <= pad + 28 * dpr) {
      return 'back';
    }

    // 翻页按钮
    const navY = screenH - 120 * dpr;
    const btnW = 80 * dpr;
    const btnH = 36 * dpr;

    // 上一角色
    const prevX = cx + 12 * dpr;
    if (cxp >= prevX && cxp <= prevX + btnW && cyp >= navY && cyp <= navY + btnH) {
      return 'prev';
    }

    // 下一角色
    const nextX = cx + contentW - btnW - 12 * dpr;
    if (cxp >= nextX && cxp <= nextX + btnW && cyp >= navY && cyp <= navY + btnH) {
      return 'next';
    }

    // 确认按钮
    const confirmBtnW = Math.min(180 * dpr, contentW - 24 * dpr);
    const confirmBtnH = 40 * dpr;
    const confirmX = cx + (contentW - confirmBtnW) / 2;
    const confirmY = screenH - 60 * dpr;
    if (cxp >= confirmX && cxp <= confirmX + confirmBtnW && cyp >= confirmY && cyp <= confirmY + confirmBtnH) {
      return 'confirm';
    }

    return null;
  }

  // ─── hover 更新 ───────────────────────────────────

  updateHover(mouseX: number, mouseY: number, screenW: number, screenH: number): void {
    const hit = this.hitTest(mouseX, mouseY, screenW, screenH);
    this.hoverBtn = hit;
  }

  // ─── 滑动偏移计算 ─────────────────────────────────

  private getSlideOffset(contentW: number): number {
    if (this.slideDirection === 0) return 0;

    const eased = easing.easeInOutQuad(this.slideProgress);
    const maxOffset = contentW * 0.8;

    if (this.slideDirection === 1) {
      // 向左滑出旧角色
      return -maxOffset * eased;
    } else {
      // 向右滑出旧角色
      return maxOffset * eased;
    }
  }

  // ─── 构建属性条数据 ───────────────────────────────

  private buildStatBars(charDef: CharacterDef): StatBar[] {
    return [
      {
        label: 'HP',
        value: charDef.stats.hp,
        max: 200,
        displayValue: String(charDef.stats.hp),
        color: '#cc2222',
        hiColor: '#ff4444',
        bgColor: '#2a0a0a',
      },
      {
        label: '速度',
        value: charDef.stats.speed,
        max: 300,
        displayValue: String(charDef.stats.speed),
        color: '#2266cc',
        hiColor: '#44aaff',
        bgColor: '#0a0a2a',
      },
      {
        label: '护甲',
        value: charDef.stats.armor,
        max: 20,
        displayValue: String(charDef.stats.armor),
        color: '#888888',
        hiColor: '#bbbbbb',
        bgColor: '#1a1a1a',
      },
      {
        label: '暴击',
        value: charDef.stats.critRate * 100,
        max: 20,
        displayValue: `${Math.round(charDef.stats.critRate * 100)}%`,
        color: '#cc8800',
        hiColor: '#ffcc00',
        bgColor: '#2a1a00',
      },
    ];
  }
}
