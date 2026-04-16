// UITextRenderer.ts - Canvas文字渲染

export interface TextOptions {
  size?: number;
  color?: string;
  align?: CanvasTextAlign;
  stroke?: boolean;
  strokeColor?: string;
  strokeWidth?: number;
  shadow?: boolean;
  shadowColor?: string;
  shadowBlur?: number;
  font?: string;
  baseline?: CanvasTextBaseline;
}

const DEFAULTS: Required<TextOptions> = {
  size: 16,
  color: '#e0e0e0',
  align: 'left',
  stroke: false,
  strokeColor: '#000000',
  strokeWidth: 3,
  shadow: false,
  shadowColor: '#000000',
  shadowBlur: 4,
  font: '"Noto Sans SC", sans-serif',
  baseline: 'top',
};

export class UITextRenderer {
  private dpr: number;

  constructor(dpr: number = 1) {
    this.dpr = dpr;
  }

  draw(
    ctx: CanvasRenderingContext2D,
    text: string,
    x: number,
    y: number,
    opts: TextOptions = {},
  ): void {
    const o = { ...DEFAULTS, ...opts };

    ctx.save();
    ctx.font = `${o.size}px ${o.font}`;
    ctx.textAlign = o.align;
    ctx.textBaseline = o.baseline;

    if (o.shadow) {
      ctx.shadowColor = o.shadowColor;
      ctx.shadowBlur = o.shadowBlur;
      ctx.shadowOffsetX = 1;
      ctx.shadowOffsetY = 1;
    }

    if (o.stroke) {
      ctx.strokeStyle = o.strokeColor;
      ctx.lineWidth = o.strokeWidth * this.dpr;
      ctx.lineJoin = 'round';
      ctx.strokeText(text, x, y);
    }

    ctx.fillStyle = o.color;
    ctx.fillText(text, x, y);
    ctx.restore();
  }

  measure(ctx: CanvasRenderingContext2D, text: string, opts: TextOptions = {}): number {
    const o = { ...DEFAULTS, ...opts };
    ctx.font = `${o.size}px ${o.font}`;
    return ctx.measureText(text).width;
  }
}
