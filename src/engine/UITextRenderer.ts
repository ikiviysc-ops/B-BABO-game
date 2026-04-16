/**
 * UI 文字渲染器 — 统一字体、描边、对齐
 *
 * 坐标约定：所有调用方传入的坐标必须是 **物理像素**（已乘DPR）。
 * 本渲染器不再额外缩放，直接使用传入坐标。
 */

export interface TextOptions {
  size?: number;       // 字号（物理像素，已含DPR）
  color?: string;
  align?: 'left' | 'center' | 'right';
  stroke?: boolean;
  strokeColor?: string;
  strokeWidth?: number; // 描边宽度（物理像素）
  shadow?: boolean;
}

const DEFAULTS: Required<TextOptions> = {
  size: 12,
  color: '#e8e8f0',
  align: 'left',
  stroke: true,
  strokeColor: '#000000',
  strokeWidth: 2,
  shadow: true,
};

export class UITextRenderer {
  private ctx: CanvasRenderingContext2D;

  constructor(ctx: CanvasRenderingContext2D) {
    this.ctx = ctx;
  }

  draw(text: string, x: number, y: number, opts: TextOptions = {}): void {
    const o = { ...DEFAULTS, ...opts };

    this.ctx.font = `${o.size}px 'Press Start 2P', monospace`;
    this.ctx.textBaseline = 'top';

    if (o.align === 'center') {
      this.ctx.textAlign = 'center';
    } else if (o.align === 'right') {
      this.ctx.textAlign = 'right';
    } else {
      this.ctx.textAlign = 'left';
    }

    if (o.shadow) {
      this.ctx.fillStyle = 'rgba(0,0,0,0.5)';
      this.ctx.fillText(text, x + 1, y + 1);
    }

    if (o.stroke) {
      this.ctx.strokeStyle = o.strokeColor;
      this.ctx.lineWidth = o.strokeWidth;
      this.ctx.lineJoin = 'round';
      this.ctx.strokeText(text, x, y);
    }

    this.ctx.fillStyle = o.color;
    this.ctx.fillText(text, x, y);

    // 重置
    this.ctx.textAlign = 'left';
  }

  drawTimer(elapsedSeconds: number, x: number, y: number, opts: TextOptions = {}): void {
    const minutes = Math.floor(elapsedSeconds / 60);
    const seconds = Math.floor(elapsedSeconds % 60);
    const mm = String(minutes).padStart(2, '0');
    const ss = String(seconds).padStart(2, '0');
    this.draw(`${mm}:${ss}`, x, y, { ...opts, color: opts.color ?? '#88ccff' });
  }

  drawNumber(value: number, x: number, y: number, opts: TextOptions = {}): void {
    const formatted = value >= 1000000
      ? (value / 1000000).toFixed(1) + 'M'
      : value >= 1000
        ? (value / 1000).toFixed(1) + 'K'
        : String(value);
    this.draw(formatted, x, y, opts);
  }

  drawWrapped(text: string, x: number, y: number, maxWidth: number, opts: TextOptions = {}): void {
    const o = { ...DEFAULTS, ...opts };

    this.ctx.font = `${o.size}px 'Press Start 2P', monospace`;
    this.ctx.textBaseline = 'top';

    if (o.align === 'center') {
      this.ctx.textAlign = 'center';
    } else if (o.align === 'right') {
      this.ctx.textAlign = 'right';
    } else {
      this.ctx.textAlign = 'left';
    }

    // 简单按字符换行
    const lines: string[] = [];
    let currentLine = '';
    for (const ch of text) {
      const testLine = currentLine + ch;
      const metrics = this.ctx.measureText(testLine);
      if (metrics.width > maxWidth && currentLine.length > 0) {
        lines.push(currentLine);
        currentLine = ch;
      } else {
        currentLine = testLine;
      }
    }
    if (currentLine) lines.push(currentLine);

    const lineH = o.size + 2;
    for (let i = 0; i < lines.length; i++) {
      const ly = y + i * lineH;
      if (o.shadow) {
        this.ctx.fillStyle = 'rgba(0,0,0,0.5)';
        this.ctx.fillText(lines[i], x + 1, ly + 1);
      }
      if (o.stroke) {
        this.ctx.strokeStyle = o.strokeColor;
        this.ctx.lineWidth = o.strokeWidth;
        this.ctx.lineJoin = 'round';
        this.ctx.strokeText(lines[i], x, ly);
      }
      this.ctx.fillStyle = o.color;
      this.ctx.fillText(lines[i], x, ly);
    }

    this.ctx.textAlign = 'left';
  }
}
