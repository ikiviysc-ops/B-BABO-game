/**
 * Canvas 2D 渲染器
 * 管理画布状态、缩放、后处理管线
 */

export class Renderer {
  readonly ctx: CanvasRenderingContext2D;
  private _width = 0;
  private _height = 0;
  private _scale = 1;

  constructor(canvas: HTMLCanvasElement) {
    const ctx = canvas.getContext('2d', {
      alpha: false,
      desynchronized: true,
    });
    if (!ctx) throw new Error('[Renderer] Cannot get 2D context');
    this.ctx = ctx;
    this._width = canvas.width;
    this._height = canvas.height;
    this._scale = 1;

    // 默认像素风渲染
    this.ctx.imageSmoothingEnabled = false;
  }

  get width(): number { return this._width; }
  get height(): number { return this._height; }
  get scale(): number { return this._scale; }

  resize(w: number, h: number): void {
    this._width = w;
    this._height = h;
    this.ctx.imageSmoothingEnabled = false;
  }

  /** 设置全局缩放 (像素放大) */
  setScale(s: number): void {
    this._scale = s;
  }

  /** 清空画布 */
  clear(): void {
    this.ctx.fillStyle = '#0a0a1a';
    this.ctx.fillRect(0, 0, this._width, this._height);
  }

  /** 绘制像素精灵到指定世界坐标 */
  drawSprite(
    sprite: HTMLCanvasElement | OffscreenCanvas,
    x: number,
    y: number,
  ): void {
    this.ctx.drawImage(sprite, x, y);
  }

  /** 渲染 HUD 层 (屏幕空间) */
  renderHUD(): void {
    this.ctx.save();
    this.ctx.resetTransform();
    this.ctx.fillStyle = 'rgba(255,255,255,0.5)';
    this.ctx.font = '12px monospace';
    this.ctx.fillText('B-BABO Survivors v0.2', 8, 20);
    this.ctx.restore();
  }

  /** 渲染角色信息 HUD */
  renderCharacterHUD(
    name: string,
    series: string,
    current: number,
    total: number,
  ): void {
    this.ctx.save();
    this.ctx.resetTransform();

    const dpr = window.devicePixelRatio || 1;
    const x = 8 * dpr;
    const y = 20 * dpr;

    // 半透明背景条
    this.ctx.fillStyle = 'rgba(0,0,0,0.5)';
    this.ctx.fillRect(0, 0, this._width, 50 * dpr);

    // 角色名
    this.ctx.fillStyle = '#ffffff';
    this.ctx.font = `bold ${14 * dpr}px monospace`;
    this.ctx.fillText(name, x, y + 18 * dpr);

    // HIRONO 系列
    this.ctx.fillStyle = 'rgba(255,255,255,0.6)';
    this.ctx.font = `${10 * dpr}px monospace`;
    this.ctx.fillText(series, x, y + 34 * dpr);

    // 角色计数
    this.ctx.fillStyle = 'rgba(255,255,255,0.4)';
    this.ctx.font = `${10 * dpr}px monospace`;
    this.ctx.textAlign = 'right';
    this.ctx.fillText(`${current}/${total}  [TAB/点击切换]`, this._width - x, y + 18 * dpr);
    this.ctx.textAlign = 'left';

    this.ctx.restore();
  }

  /** 居中文字 */
  renderCenterText(text: string): void {
    this.ctx.save();
    this.ctx.resetTransform();
    const dpr = window.devicePixelRatio || 1;
    this.ctx.fillStyle = '#ffffff';
    this.ctx.font = `bold ${16 * dpr}px monospace`;
    this.ctx.textAlign = 'center';
    this.ctx.fillText(text, this._width / 2, this._height / 2);
    this.ctx.textAlign = 'left';
    this.ctx.restore();
  }

  /** 游戏 HUD */
  renderGameHUD(
    wave: number, score: number,
    hp: number, maxHp: number,
    xp: number, xpToNext: number, level: number,
    kills: number,
  ): void {
    this.ctx.save();
    this.ctx.resetTransform();
    const dpr = window.devicePixelRatio || 1;
    const x = 8 * dpr;

    // 顶部背景条
    this.ctx.fillStyle = 'rgba(0,0,0,0.6)';
    this.ctx.fillRect(0, 0, this._width, 60 * dpr);

    // 波次 + 分数
    this.ctx.fillStyle = '#ffffff';
    this.ctx.font = `bold ${14 * dpr}px monospace`;
    this.ctx.fillText(`Wave ${wave}`, x, 20 * dpr);

    this.ctx.fillStyle = '#ffcc00';
    this.ctx.font = `${12 * dpr}px monospace`;
    this.ctx.fillText(`Score: ${score}  Kills: ${kills}`, x, 38 * dpr);

    // 等级 + 经验条
    this.ctx.fillStyle = '#88ccff';
    this.ctx.fillText(`Lv.${level}`, x, 54 * dpr);

    // 经验条
    const barX = 60 * dpr;
    const barW = 80 * dpr;
    const barH = 8 * dpr;
    const barY = 47 * dpr;
    this.ctx.fillStyle = '#333';
    this.ctx.fillRect(barX, barY, barW, barH);
    this.ctx.fillStyle = '#44aaff';
    this.ctx.fillRect(barX, barY, barW * Math.min(xp / xpToNext, 1), barH);

    // 血条（右上角）
    const hpBarW = 120 * dpr;
    const hpBarH = 10 * dpr;
    const hpX = this._width - hpBarW - x;
    const hpY = 12 * dpr;
    this.ctx.fillStyle = '#333';
    this.ctx.fillRect(hpX, hpY, hpBarW, hpBarH);
    const hpRatio = Math.max(hp / maxHp, 0);
    this.ctx.fillStyle = hpRatio > 0.5 ? '#44cc44' : hpRatio > 0.25 ? '#ccaa22' : '#cc2222';
    this.ctx.fillRect(hpX, hpY, hpBarW * hpRatio, hpBarH);
    this.ctx.strokeStyle = '#666';
    this.ctx.strokeRect(hpX, hpY, hpBarW, hpBarH);

    this.ctx.fillStyle = '#ffffff';
    this.ctx.font = `${10 * dpr}px monospace`;
    this.ctx.fillText(`HP ${hp}/${maxHp}`, hpX, hpY + hpBarH + 14 * dpr);

    this.ctx.restore();
  }
}
