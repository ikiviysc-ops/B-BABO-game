/**
 * Game Over 界面 — 游戏结束统计面板
 *
 * 特性：
 * - 半透明黑色遮罩背景
 * - 标题 easeOutBack 弹入动画
 * - 数据行 staggered 淡入（每行延迟 100ms）
 * - 按钮 hover 效果（亮度提升 + 边框高亮）
 * - 武器列表展示
 */

import { UI, duration, easing } from '@engine/UITheme';
import { UITextRenderer } from '@engine/UITextRenderer';
import { getPixelIcon } from '@engine/PixelIcons';

// ═══════════════════════════════════════════════════════
// 数据接口
// ═══════════════════════════════════════════════════════

export interface GameOverData {
  survivalTime: number;  // 秒
  totalKills: number;
  score: number;
  level: number;
  wave: number;
  weapons: { id: string; name: string; level: number }[];
}

// ═══════════════════════════════════════════════════════
// 统计行定义
// ═══════════════════════════════════════════════════════

interface StatRow {
  icon: string;       // PixelIcons id
  iconColor: string;  // 图标着色
  label: string;
  value: string;
}

// ═══════════════════════════════════════════════════════
// GameOverScreen
// ═══════════════════════════════════════════════════════

export class GameOverScreen {
  private text: UITextRenderer;
  private dpr: number;
  private animTimer = 0;
  private readonly titleDuration = duration.slow;
  private readonly rowStagger = 100; // ms
  private readonly rowFadeDuration = 300;
  private hoverBtn: 'restart' | 'menu' | null = null;

  constructor(ctx: CanvasRenderingContext2D, dpr: number) {
    this.text = new UITextRenderer(ctx);
    this.dpr = dpr;
  }

  /** 重置动画计时器（每次显示时调用） */
  reset(): void {
    this.animTimer = 0;
    this.hoverBtn = null;
  }

  update(dt: number): void {
    this.animTimer += dt;
  }

  // ─── 主渲染 ───────────────────────────────────────

  render(ctx: CanvasRenderingContext2D, data: GameOverData, screenW: number, screenH: number): void {
    const dpr = this.dpr;
    ctx.save();
    ctx.resetTransform();

    // 半透明黑色遮罩
    ctx.fillStyle = UI.bg.overlay;
    ctx.fillRect(0, 0, screenW, screenH);

    // 内容区域居中
    const contentW = Math.min(320 * dpr, screenW - 24 * dpr);
    const contentH = screenH * 0.85;
    const cx = (screenW - contentW) / 2;
    const cy = (screenH - contentH) / 2;

    // 面板背景
    this.renderPanel(ctx, cx, cy, contentW, contentH);

    // 标题 — easeOutBack 弹入
    const titleProgress = Math.min(this.animTimer / this.titleDuration, 1);
    const titleScale = easing.easeOutBack(titleProgress);
    ctx.save();
    ctx.globalAlpha = titleProgress;
    ctx.translate(screenW / 2, cy + 36 * dpr);
    ctx.scale(titleScale, titleScale);
    ctx.translate(-screenW / 2, -(cy + 36 * dpr));
    this.text.draw('GAME OVER', screenW / 2, cy + 20 * dpr, {
      size: 24 * dpr, color: UI.accent.red, align: 'center',
      stroke: true, strokeColor: '#8b0000', strokeWidth: 3 * dpr,
    });
    ctx.restore();

    // 统计行
    const rows = this.buildStatRows(data);
    const rowStartY = cy + 70 * dpr;
    const rowGap = 28 * dpr;

    for (let i = 0; i < rows.length; i++) {
      const rowDelay = this.titleDuration + i * this.rowStagger;
      const rowProgress = Math.max(0, Math.min((this.animTimer - rowDelay) / this.rowFadeDuration, 1));
      if (rowProgress <= 0) continue;

      const eased = easing.easeOutCubic(rowProgress);
      ctx.save();
      ctx.globalAlpha = eased;
      this.renderStatRow(ctx, rows[i], cx + 16 * dpr, rowStartY + i * rowGap, contentW - 32 * dpr);
      ctx.restore();
    }

    // 武器列表
    const weaponDelay = this.titleDuration + rows.length * this.rowStagger + 100;
    const weaponProgress = Math.max(0, Math.min((this.animTimer - weaponDelay) / this.rowFadeDuration, 1));
    if (weaponProgress > 0 && data.weapons.length > 0) {
      ctx.save();
      ctx.globalAlpha = easing.easeOutCubic(weaponProgress);
      const weaponY = rowStartY + rows.length * rowGap + 8 * dpr;
      this.renderWeaponList(ctx, data.weapons, cx + 16 * dpr, weaponY, contentW - 32 * dpr);
      ctx.restore();
    }

    // 按钮
    const btnDelay = weaponDelay + 200;
    const btnProgress = Math.max(0, Math.min((this.animTimer - btnDelay) / this.rowFadeDuration, 1));
    if (btnProgress > 0) {
      ctx.save();
      ctx.globalAlpha = easing.easeOutCubic(btnProgress);
      const btnY = cy + contentH - 70 * dpr;
      this.renderButtons(ctx, cx, btnY, contentW);
      ctx.restore();
    }

    ctx.restore();
  }

  // ─── 面板背景 ─────────────────────────────────────

  private renderPanel(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number): void {
    const dpr = this.dpr;

    // 主背景
    ctx.fillStyle = UI.panel.bg;
    ctx.beginPath();
    ctx.roundRect(x, y, w, h, 8 * dpr);
    ctx.fill();

    // 渐变叠加
    const grad = ctx.createLinearGradient(x, y, x, y + h);
    grad.addColorStop(0, 'rgba(255,255,255,0.04)');
    grad.addColorStop(0.5, 'rgba(0,0,0,0)');
    grad.addColorStop(1, 'rgba(0,0,0,0.15)');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.roundRect(x, y, w, h, 8 * dpr);
    ctx.fill();

    // 外边框
    ctx.strokeStyle = UI.panel.borderStrong;
    ctx.lineWidth = 1.5 * dpr;
    ctx.beginPath();
    ctx.roundRect(x + 0.5, y + 0.5, w - 1, h - 1, 8 * dpr);
    ctx.stroke();

    // 内边框
    ctx.strokeStyle = 'rgba(255,255,255,0.04)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.roundRect(x + 3 * dpr, y + 3 * dpr, w - 6 * dpr, h - 6 * dpr, 6 * dpr);
    ctx.stroke();
  }

  // ─── 统计行 ───────────────────────────────────────

  private renderStatRow(ctx: CanvasRenderingContext2D, row: StatRow, x: number, y: number, _maxW: number): void {
    const dpr = this.dpr;
    const iconSize = 16 * dpr;

    // 图标
    const icon = getPixelIcon(row.icon, iconSize);
    ctx.imageSmoothingEnabled = false;
    ctx.drawImage(icon, x, y + 2 * dpr, iconSize, iconSize);

    // 标签
    this.text.draw(row.label, x + iconSize + 8 * dpr, y + 2 * dpr, {
      size: 12 * dpr, color: UI.text.secondary, shadow: false,
    });

    // 数值
    this.text.draw(row.value, x + iconSize + 8 * dpr, y + 14 * dpr, {
      size: 14 * dpr, color: UI.text.primary, stroke: true, strokeWidth: 2 * dpr,
    });
  }

  // ─── 武器列表 ─────────────────────────────────────

  private renderWeaponList(
    ctx: CanvasRenderingContext2D,
    weapons: { id: string; name: string; level: number }[],
    x: number, y: number, _maxW: number,
  ): void {
    const dpr = this.dpr;

    // 小标题
    this.text.draw('使用的武器', x, y, {
      size: 11 * dpr, color: UI.text.secondary, shadow: false,
    });

    // 分隔线
    const sepY = y + 16 * dpr;
    ctx.fillStyle = 'rgba(255,255,255,0.08)';
    ctx.fillRect(x, sepY, _maxW, 1);

    const iconSize = 14 * dpr;
    const itemY = sepY + 6 * dpr;

    for (let i = 0; i < weapons.length; i++) {
      const w = weapons[i];
      const wy = itemY + i * 22 * dpr;

      // 武器图标
      const icon = getPixelIcon(w.id, iconSize);
      ctx.imageSmoothingEnabled = false;
      ctx.drawImage(icon, x, wy, iconSize, iconSize);

      // 武器名 + 等级
      this.text.draw(`${w.name}  Lv.${w.level}`, x + iconSize + 6 * dpr, wy + 1 * dpr, {
        size: 11 * dpr, color: UI.text.primary, shadow: false,
      });
    }
  }

  // ─── 按钮 ─────────────────────────────────────────

  private renderButtons(ctx: CanvasRenderingContext2D, panelX: number, y: number, panelW: number): void {
    const dpr = this.dpr;
    const btnW = 120 * dpr;
    const btnH = 40 * dpr;
    const gap = 16 * dpr;
    const totalW = btnW * 2 + gap;
    const startX = panelX + (panelW - totalW) / 2;

    // 重新开始按钮
    this.renderButton(ctx, startX, y, btnW, btnH, '重新开始', 'restart', UI.accent.green);
    // 主菜单按钮
    this.renderButton(ctx, startX + btnW + gap, y, btnW, btnH, '主菜单', 'menu', UI.accent.blue);
  }

  private renderButton(
    ctx: CanvasRenderingContext2D,
    x: number, y: number, w: number, h: number,
    label: string, id: 'restart' | 'menu', color: string,
  ): void {
    const dpr = this.dpr;
    const isHover = this.hoverBtn === id;

    // 按钮背景
    ctx.fillStyle = isHover ? 'rgba(255,255,255,0.12)' : 'rgba(255,255,255,0.05)';
    ctx.beginPath();
    ctx.roundRect(x, y, w, h, 4 * dpr);
    ctx.fill();

    // hover 高亮边框
    if (isHover) {
      ctx.strokeStyle = color;
      ctx.lineWidth = 2 * dpr;
    } else {
      ctx.strokeStyle = 'rgba(255,255,255,0.15)';
      ctx.lineWidth = 1;
    }
    ctx.beginPath();
    ctx.roundRect(x + 0.5, y + 0.5, w - 1, h - 1, 4 * dpr);
    ctx.stroke();

    // 按钮文字
    this.text.draw(label, x + w / 2, y + h / 2 - 6 * dpr, {
      size: 13 * dpr,
      color: isHover ? color : UI.text.primary,
      align: 'center',
      stroke: true,
      strokeWidth: 2 * dpr,
    });
  }

  // ─── 点击检测 ─────────────────────────────────────

  hitTest(clickX: number, clickY: number, screenW: number, screenH: number): 'restart' | 'menu' | null {
    const dpr = this.dpr;
    const contentW = Math.min(320 * dpr, screenW - 24 * dpr);
    const contentH = screenH * 0.85;
    const panelX = (screenW - contentW) / 2;
    const btnY = (screenH - contentH) / 2 + contentH - 70 * dpr;

    const btnW = 120 * dpr;
    const btnH = 40 * dpr;
    const gap = 16 * dpr;
    const totalW = btnW * 2 + gap;
    const startX = panelX + (contentW - totalW) / 2;

    const cx = clickX * dpr;
    const cy = clickY * dpr;

    // 重新开始
    if (cx >= startX && cx <= startX + btnW && cy >= btnY && cy <= btnY + btnH) {
      return 'restart';
    }
    // 主菜单
    const menuX = startX + btnW + gap;
    if (cx >= menuX && cx <= menuX + btnW && cy >= btnY && cy <= btnY + btnH) {
      return 'menu';
    }

    return null;
  }

  // ─── hover 更新 ───────────────────────────────────

  updateHover(mouseX: number, mouseY: number, screenW: number, screenH: number): void {
    const dpr = this.dpr;
    const contentW = Math.min(320 * dpr, screenW - 24 * dpr);
    const contentH = screenH * 0.85;
    const panelX = (screenW - contentW) / 2;
    const btnY = (screenH - contentH) / 2 + contentH - 70 * dpr;

    const btnW = 120 * dpr;
    const btnH = 40 * dpr;
    const gap = 16 * dpr;
    const totalW = btnW * 2 + gap;
    const startX = panelX + (contentW - totalW) / 2;

    const cx = mouseX * dpr;
    const cy = mouseY * dpr;

    this.hoverBtn = null;
    if (cx >= startX && cx <= startX + btnW && cy >= btnY && cy <= btnY + btnH) {
      this.hoverBtn = 'restart';
    } else {
      const menuX = startX + btnW + gap;
      if (cx >= menuX && cx <= menuX + btnW && cy >= btnY && cy <= btnY + btnH) {
        this.hoverBtn = 'menu';
      }
    }
  }

  // ─── 构建统计行 ───────────────────────────────────

  private buildStatRows(data: GameOverData): StatRow[] {
    const minutes = Math.floor(data.survivalTime / 60);
    const seconds = Math.floor(data.survivalTime % 60);
    const timeStr = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

    return [
      {
        icon: 'speed_boost',
        iconColor: UI.accent.blue,
        label: '存活时间',
        value: timeStr,
      },
      {
        icon: 'damage_boost',
        iconColor: UI.accent.red,
        label: '击杀总数',
        value: data.totalKills.toLocaleString(),
      },
      {
        icon: 'speed_boost',
        iconColor: UI.accent.gold,
        label: '收集分数',
        value: data.score.toLocaleString(),
      },
      {
        icon: 'hp_boost',
        iconColor: '#aa66ff',
        label: '达成等级',
        value: String(data.level),
      },
      {
        icon: 'damage_boost',
        iconColor: '#44dddd',
        label: '到达波次',
        value: String(data.wave),
      },
    ];
  }
}
