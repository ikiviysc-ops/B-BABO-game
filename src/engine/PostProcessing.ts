function makeCanvas(w: number, h: number): [HTMLCanvasElement, CanvasRenderingContext2D] {
  const c = document.createElement('canvas');
  c.width = w;
  c.height = h;
  return [c, c.getContext('2d')!];
}

export interface PostEffect {
  apply(ctx: CanvasRenderingContext2D, w: number, h: number): void;
}

export class PostProcessingPipeline {
  private effects: PostEffect[] = [];
  private bufA: HTMLCanvasElement;
  private bufB: HTMLCanvasElement;
  private ctxA: CanvasRenderingContext2D;
  private ctxB: CanvasRenderingContext2D;

  constructor(w: number, h: number) {
    [this.bufA, this.ctxA] = makeCanvas(w, h);
    [this.bufB, this.ctxB] = makeCanvas(w, h);
  }

  add(effect: PostEffect): this {
    this.effects.push(effect);
    return this;
  }

  remove(effect: PostEffect): this {
    const i = this.effects.indexOf(effect);
    if (i !== -1) this.effects.splice(i, 1);
    return this;
  }

  process(mainCtx: CanvasRenderingContext2D, w: number, h: number): void {
    if (this.effects.length === 0) return;
    if (this.bufA.width !== w || this.bufA.height !== h) {
      [this.bufA, this.ctxA] = makeCanvas(w, h);
      [this.bufB, this.ctxB] = makeCanvas(w, h);
    }

    let rCtx = this.ctxA;
    let wCtx = this.ctxB;
    let rBuf = this.bufA;
    let wBuf = this.bufB;

    rCtx.clearRect(0, 0, w, h);
    rCtx.drawImage(mainCtx.canvas, 0, 0);

    for (let i = 0; i < this.effects.length; i++) {
      wCtx.clearRect(0, 0, w, h);
      this.effects[i].apply(rCtx, w, h);
      if (i < this.effects.length - 1) {
        wCtx.drawImage(rBuf, 0, 0);
        const tc = rCtx; const tb = rBuf;
        rCtx = wCtx; rBuf = wBuf;
        wCtx = tc; wBuf = tb;
      }
    }

    mainCtx.clearRect(0, 0, w, h);
    mainCtx.drawImage(rBuf, 0, 0);
  }
}

export class BloomEffect implements PostEffect {
  threshold = 0.6;
  blur = 8;
  intensity = 0.5;
  private halfBuf: HTMLCanvasElement;
  private halfCtx: CanvasRenderingContext2D;
  private blurBuf: HTMLCanvasElement;
  private blurCtx: CanvasRenderingContext2D;

  constructor(w: number, h: number) {
    const hw = Math.max(1, (w / 2) | 0);
    const hh = Math.max(1, (h / 2) | 0);
    [this.halfBuf, this.halfCtx] = makeCanvas(hw, hh);
    [this.blurBuf, this.blurCtx] = makeCanvas(hw, hh);
  }

  apply(ctx: CanvasRenderingContext2D, w: number, h: number): void {
    const hw = Math.max(1, (w / 2) | 0);
    const hh = Math.max(1, (h / 2) | 0);
    if (this.halfBuf.width !== hw) {
      [this.halfBuf, this.halfCtx] = makeCanvas(hw, hh);
      [this.blurBuf, this.blurCtx] = makeCanvas(hw, hh);
    }

    this.halfCtx.clearRect(0, 0, hw, hh);
    this.halfCtx.filter = `brightness(${1 + this.threshold * 2}) contrast(${1 + this.threshold})`;
    this.halfCtx.drawImage(ctx.canvas, 0, 0, hw, hh);
    this.halfCtx.filter = 'none';

    this.blurCtx.clearRect(0, 0, hw, hh);
    this.blurCtx.filter = `blur(${this.blur}px)`;
    this.blurCtx.drawImage(this.halfBuf, 0, 0);
    this.blurCtx.filter = 'none';

    ctx.save();
    ctx.globalCompositeOperation = 'lighter';
    ctx.globalAlpha = this.intensity;
    ctx.drawImage(this.blurBuf, 0, 0, w, h);
    ctx.restore();
  }
}

export class ChromaticAberration implements PostEffect {
  amount = 3;

  apply(ctx: CanvasRenderingContext2D, w: number, h: number): void {
    if (this.amount <= 0) return;
    const imageData = ctx.getImageData(0, 0, w, h);
    const d = imageData.data;
    const copy = new Uint8ClampedArray(d);
    const a = Math.round(this.amount);
    for (let y = 0; y < h; y++) {
      for (let x = 0; x < w; x++) {
        const i = (y * w + x) * 4;
        d[i] = copy[(y * w + Math.min(w - 1, x + a)) * 4];
        d[i + 2] = copy[(y * w + Math.max(0, x - a)) * 4 + 2];
      }
    }
    ctx.putImageData(imageData, 0, 0);
  }
}

export class ColorGrading implements PostEffect {
  tint = '#ffaa44';
  intensity = 0.2;
  private overlayBuf: HTMLCanvasElement;
  private overlayCtx: CanvasRenderingContext2D;

  constructor(w: number, h: number) {
    [this.overlayBuf, this.overlayCtx] = makeCanvas(w, h);
  }

  apply(ctx: CanvasRenderingContext2D, w: number, h: number): void {
    if (this.intensity <= 0) return;
    if (this.overlayBuf.width !== w) {
      [this.overlayBuf, this.overlayCtx] = makeCanvas(w, h);
    }
    this.overlayCtx.clearRect(0, 0, w, h);
    this.overlayCtx.fillStyle = this.tint;
    this.overlayCtx.fillRect(0, 0, w, h);
    ctx.save();
    ctx.globalCompositeOperation = 'overlay';
    ctx.globalAlpha = this.intensity;
    ctx.drawImage(this.overlayBuf, 0, 0);
    ctx.restore();
  }
}

export class CRTEffect implements PostEffect {
  scanlineIntensity = 0.15;
  vignetteIntensity = 0.6;
  private scanlineBuf: HTMLCanvasElement;
  private vignetteBuf: HTMLCanvasElement;

  constructor(w: number, h: number) {
    [this.scanlineBuf] = makeCanvas(w, h);
    [this.vignetteBuf] = makeCanvas(w, h);
    this._build(w, h);
  }

  private _build(w: number, h: number): void {
    const sc = this.scanlineBuf.getContext('2d')!;
    sc.clearRect(0, 0, w, h);
    sc.fillStyle = '#000000';
    for (let y = 0; y < h; y += 3) sc.fillRect(0, y, w, 1);

    const vc = this.vignetteBuf.getContext('2d')!;
    vc.clearRect(0, 0, w, h);
    const cx = w / 2, cy = h / 2;
    const r = Math.max(cx, cy) * 1.2;
    const g = vc.createRadialGradient(cx, cy, r * 0.3, cx, cy, r);
    g.addColorStop(0, 'rgba(0,0,0,0)');
    g.addColorStop(1, 'rgba(0,0,0,1)');
    vc.fillStyle = g;
    vc.fillRect(0, 0, w, h);
  }

  apply(ctx: CanvasRenderingContext2D, w: number, h: number): void {
    if (this.scanlineBuf.width !== w) {
      [this.scanlineBuf] = makeCanvas(w, h);
      [this.vignetteBuf] = makeCanvas(w, h);
      this._build(w, h);
    }
    ctx.save();
    if (this.scanlineIntensity > 0) {
      ctx.globalCompositeOperation = 'multiply';
      ctx.globalAlpha = this.scanlineIntensity;
      ctx.drawImage(this.scanlineBuf, 0, 0);
    }
    if (this.vignetteIntensity > 0) {
      ctx.globalCompositeOperation = 'multiply';
      ctx.globalAlpha = this.vignetteIntensity;
      ctx.drawImage(this.vignetteBuf, 0, 0);
    }
    ctx.restore();
  }
}

export class VignetteOnly implements PostEffect {
  intensity = 0.5;
  private buf: HTMLCanvasElement;

  constructor(w: number, h: number) {
    [this.buf] = makeCanvas(w, h);
    this._build(w, h);
  }

  private _build(w: number, h: number): void {
    const c = this.buf.getContext('2d')!;
    c.clearRect(0, 0, w, h);
    const cx = w / 2, cy = h / 2;
    const r = Math.max(cx, cy) * 1.2;
    const g = c.createRadialGradient(cx, cy, r * 0.3, cx, cy, r);
    g.addColorStop(0, 'rgba(0,0,0,0)');
    g.addColorStop(1, 'rgba(0,0,0,1)');
    c.fillStyle = g;
    c.fillRect(0, 0, w, h);
  }

  apply(ctx: CanvasRenderingContext2D, w: number, h: number): void {
    if (this.intensity <= 0) return;
    if (this.buf.width !== w) {
      [this.buf] = makeCanvas(w, h);
      this._build(w, h);
    }
    ctx.save();
    ctx.globalCompositeOperation = 'multiply';
    ctx.globalAlpha = this.intensity;
    ctx.drawImage(this.buf, 0, 0);
    ctx.restore();
  }
}
