// ParticleSystem.ts - 粒子系统

export interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  size: number;
  color: string;
  alpha: number;
  gravity: number;
  active: boolean;
}

export interface ParticleConfig {
  speed?: number;
  speedVar?: number;
  life?: number;
  lifeVar?: number;
  size?: number;
  sizeVar?: number;
  colors?: string[];
  gravity?: number;
  angle?: number;
  angleVar?: number;
  count?: number;
}

const POOL_SIZE = 500;

export const PRESETS: Record<string, ParticleConfig> = {
  EXPLOSION: {
    speed: 200, speedVar: 100,
    life: 0.5, lifeVar: 0.3,
    size: 4, sizeVar: 3,
    colors: ['#ff6b35', '#ffd700', '#ff4444', '#ff8c00'],
    gravity: 300,
    angle: 0, angleVar: Math.PI * 2,
    count: 20,
  },
  HIT_SPARK: {
    speed: 150, speedVar: 80,
    life: 0.2, lifeVar: 0.15,
    size: 3, sizeVar: 2,
    colors: ['#ffffff', '#ffff00', '#ffaa00'],
    gravity: 100,
    angle: 0, angleVar: Math.PI * 2,
    count: 8,
  },
  LEVEL_UP: {
    speed: 100, speedVar: 60,
    life: 1.0, lifeVar: 0.5,
    size: 5, sizeVar: 3,
    colors: ['#00ff88', '#00ffcc', '#88ff00', '#ffff00'],
    gravity: -50,
    angle: -Math.PI / 2, angleVar: Math.PI * 0.6,
    count: 30,
  },
  DEATH: {
    speed: 80, speedVar: 40,
    life: 0.8, lifeVar: 0.4,
    size: 3, sizeVar: 2,
    colors: ['#ff0000', '#880000', '#440000', '#ff4444'],
    gravity: 200,
    angle: 0, angleVar: Math.PI * 2,
    count: 15,
  },
};

export class ParticleSystem {
  private pool: Particle[] = [];

  constructor() {
    for (let i = 0; i < POOL_SIZE; i++) {
      this.pool.push({ x: 0, y: 0, vx: 0, vy: 0, life: 0, maxLife: 1, size: 2, color: '#fff', alpha: 1, gravity: 0, active: false });
    }
  }

  private _rand(base: number, variance: number): number {
    return base + (Math.random() - 0.5) * 2 * variance;
  }

  private _pickColor(colors: string[]): string {
    return colors[Math.floor(Math.random() * colors.length)];
  }

  emit(x: number, y: number, count: number, config: ParticleConfig): void {
    const c = config;
    for (let i = 0; i < count; i++) {
      const p = this.pool.find(p => !p.active);
      if (!p) break;

      const angle = this._rand(c.angle ?? 0, c.angleVar ?? Math.PI);
      const speed = this._rand(c.speed ?? 100, c.speedVar ?? 50);
      const life = this._rand(c.life ?? 0.5, c.lifeVar ?? 0.2);
      const size = this._rand(c.size ?? 3, c.sizeVar ?? 1);

      p.x = x;
      p.y = y;
      p.vx = Math.cos(angle) * speed;
      p.vy = Math.sin(angle) * speed;
      p.life = Math.max(0.05, life);
      p.maxLife = p.life;
      p.size = Math.max(0.5, size);
      p.color = this._pickColor(c.colors ?? ['#fff']);
      p.alpha = 1;
      p.gravity = c.gravity ?? 0;
      p.active = true;
    }
  }

  emitPreset(x: number, y: number, preset: string): void {
    const config = PRESETS[preset];
    if (!config) return;
    this.emit(x, y, config.count ?? 10, config);
  }

  update(dt: number): void {
    for (const p of this.pool) {
      if (!p.active) continue;
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      p.vy += p.gravity * dt;
      p.life -= dt;
      p.alpha = Math.max(0, p.life / p.maxLife);
      if (p.life <= 0) p.active = false;
    }
  }

  render(ctx: CanvasRenderingContext2D): void {
    for (const p of this.pool) {
      if (!p.active) continue;
      ctx.globalAlpha = p.alpha;
      ctx.fillStyle = p.color;
      ctx.fillRect(p.x - p.size / 2, p.y - p.size / 2, p.size, p.size);
    }
    ctx.globalAlpha = 1;
  }

  clear(): void {
    for (const p of this.pool) p.active = false;
  }
}
