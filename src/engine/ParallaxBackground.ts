// ParallaxBackground.ts - 视差背景，3层

interface ParallaxLayer {
  canvas: HTMLCanvasElement;
  speed: number; // 0~1, 越小越远
}

export class ParallaxBackground {
  private layers: ParallaxLayer[] = [];
  private _screenW = 0;
  private _screenH = 0;

  constructor(screenW: number, screenH: number) {
    this._screenW = screenW;
    this._screenH = screenH;
    this._buildLayers();
  }

  resize(w: number, h: number): void {
    this._screenW = w;
    this._screenH = h;
    this._buildLayers();
  }

  private _buildLayers(): void {
    this.layers = [];
    // 远景：星空
    this.layers.push({
      canvas: this._renderStarfield(),
      speed: 0.05,
    });
    // 中景：山丘
    this.layers.push({
      canvas: this._renderHills(),
      speed: 0.2,
    });
    // 近景：树木
    this.layers.push({
      canvas: this._renderTrees(),
      speed: 0.4,
    });
  }

  private _renderStarfield(): HTMLCanvasElement {
    const w = this._screenW + 200;
    const h = this._screenH;
    const canvas = document.createElement('canvas');
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext('2d')!;

    // 深蓝背景
    ctx.fillStyle = '#0a0a1a';
    ctx.fillRect(0, 0, w, h);

    // 星星
    const rng = this._seededRandom(42);
    for (let i = 0; i < 120; i++) {
      const x = rng() * w;
      const y = rng() * h * 0.7;
      const s = rng() * 2 + 0.5;
      const alpha = rng() * 0.5 + 0.3;
      ctx.fillStyle = `rgba(255,255,255,${alpha})`;
      ctx.fillRect(x, y, s, s);
    }

    return canvas;
  }

  private _renderHills(): HTMLCanvasElement {
    const w = this._screenW + 400;
    const h = this._screenH;
    const canvas = document.createElement('canvas');
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext('2d')!;

    ctx.fillStyle = '#1a1a3e';
    ctx.fillRect(0, 0, w, h);

    // 山丘轮廓
    ctx.fillStyle = '#151530';
    ctx.beginPath();
    ctx.moveTo(0, h);
    for (let x = 0; x <= w; x += 4) {
      const y = h * 0.6 + Math.sin(x * 0.008) * 40 + Math.sin(x * 0.003) * 60;
      ctx.lineTo(x, y);
    }
    ctx.lineTo(w, h);
    ctx.fill();

    ctx.fillStyle = '#121228';
    ctx.beginPath();
    ctx.moveTo(0, h);
    for (let x = 0; x <= w; x += 4) {
      const y = h * 0.7 + Math.sin(x * 0.006 + 1) * 30 + Math.sin(x * 0.002) * 50;
      ctx.lineTo(x, y);
    }
    ctx.lineTo(w, h);
    ctx.fill();

    return canvas;
  }

  private _renderTrees(): HTMLCanvasElement {
    const w = this._screenW + 600;
    const h = this._screenH;
    const canvas = document.createElement('canvas');
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext('2d')!;

    ctx.fillStyle = '#0f0f22';
    ctx.fillRect(0, 0, w, h);

    const rng = this._seededRandom(99);
    for (let i = 0; i < 30; i++) {
      const x = rng() * w;
      const treeH = rng() * 80 + 60;
      const baseY = h * 0.75 + rng() * 30;

      // 树干
      ctx.fillStyle = '#2a1a0a';
      ctx.fillRect(x - 3, baseY - treeH * 0.4, 6, treeH * 0.4);

      // 树冠
      ctx.fillStyle = `rgb(${10 + Math.floor(rng() * 20)},${20 + Math.floor(rng() * 30)},${10 + Math.floor(rng() * 15)})`;
      ctx.beginPath();
      ctx.moveTo(x, baseY - treeH);
      ctx.lineTo(x - 20 - rng() * 15, baseY - treeH * 0.3);
      ctx.lineTo(x + 20 + rng() * 15, baseY - treeH * 0.3);
      ctx.fill();
    }

    return canvas;
  }

  private _seededRandom(seed: number): () => number {
    let s = seed;
    return () => {
      s = (s * 16807 + 0) % 2147483647;
      return s / 2147483647;
    };
  }

  render(ctx: CanvasRenderingContext2D, cameraX: number, cameraY: number): void {
    for (const layer of this.layers) {
      const offsetX = -cameraX * layer.speed;
      const offsetY = -cameraY * layer.speed * 0.3;
      const lw = layer.canvas.width;

      // 循环平铺
      const startX = ((offsetX % lw) + lw) % lw - lw;
      for (let x = startX; x < this._screenW; x += lw) {
        ctx.drawImage(layer.canvas, x, offsetY);
      }
    }
  }
}
