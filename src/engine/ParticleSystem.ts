/**
 * 粒子系统 — 对象池管理，支持多种预设效果
 * 预设：EXPLOSION(爆炸), LEVEL_UP(升级), HIT_SPARK(命中火花), DEATH(死亡)
 */

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  size: number;
  color: string;
  gravity: number;
  friction: number;
  active: boolean;
}

interface EmitterConfig {
  count: number;
  speedMin: number;
  speedMax: number;
  lifeMin: number;
  lifeMax: number;
  sizeMin: number;
  sizeMax: number;
  colors: string[];
  gravity: number;
  friction: number;
  spreadAngle: number; // radians, Math.PI*2 = full circle
}

const PRESETS: Record<string, EmitterConfig> = {
  EXPLOSION: {
    count: 20, speedMin: 80, speedMax: 250,
    lifeMin: 0.2, lifeMax: 0.6, sizeMin: 2, sizeMax: 6,
    colors: ['#FF6600', '#FFAA00', '#FF4400', '#FFDD00'],
    gravity: 100, friction: 0.97, spreadAngle: Math.PI * 2,
  },
  LEVEL_UP: {
    count: 25, speedMin: 30, speedMax: 100,
    lifeMin: 0.8, lifeMax: 1.5, sizeMin: 2, sizeMax: 4,
    colors: ['#FFD700', '#FFFFFF', '#FFAA00', '#FFEE88'],
    gravity: -60, friction: 0.98, spreadAngle: Math.PI * 2,
  },
  HIT_SPARK: {
    count: 6, speedMin: 100, speedMax: 300,
    lifeMin: 0.1, lifeMax: 0.25, sizeMin: 1, sizeMax: 3,
    colors: ['#FFFFFF', '#FFDD88', '#FFAA44'],
    gravity: 0, friction: 0.95, spreadAngle: Math.PI * 0.6,
  },
  DEATH: {
    count: 15, speedMin: 60, speedMax: 200,
    lifeMin: 0.3, lifeMax: 0.7, sizeMin: 2, sizeMax: 5,
    colors: ['#FF4444', '#FF8844', '#FFAA66'],
    gravity: 80, friction: 0.96, spreadAngle: Math.PI * 2,
  },
};

export class ParticleSystem {
  private pool: Particle[] = [];
  private activeCount = 0;
  private maxSize: number;

  constructor(maxSize = 500) {
    this.maxSize = maxSize;
    for (let i = 0; i < maxSize; i++) {
      this.pool.push({
        x: 0, y: 0, vx: 0, vy: 0,
        life: 0, maxLife: 0, size: 0,
        color: '#fff', gravity: 0, friction: 1,
        active: false,
      });
    }
  }

  /** 从对象池获取一个粒子 */
  private acquire(): Particle | null {
    for (let i = 0; i < this.maxSize; i++) {
      if (!this.pool[i].active) {
        this.pool[i].active = true;
        this.activeCount++;
        return this.pool[i];
      }
    }
    return null; // 池满
  }

  /** 发射粒子（指定方向） */
  emit(x: number, y: number, config: EmitterConfig, baseAngle?: number): void {
    const count = config.count;
    for (let i = 0; i < count; i++) {
      const p = this.acquire();
      if (!p) return;

      const angle = baseAngle !== undefined
        ? baseAngle + (Math.random() - 0.5) * config.spreadAngle
        : Math.random() * config.spreadAngle;
      const speed = config.speedMin + Math.random() * (config.speedMax - config.speedMin);

      p.x = x;
      p.y = y;
      p.vx = Math.cos(angle) * speed;
      p.vy = Math.sin(angle) * speed;
      p.life = config.lifeMin + Math.random() * (config.lifeMax - config.lifeMin);
      p.maxLife = p.life;
      p.size = config.sizeMin + Math.random() * (config.sizeMax - config.sizeMin);
      p.color = config.colors[Math.floor(Math.random() * config.colors.length)];
      p.gravity = config.gravity;
      p.friction = config.friction;
    }
  }

  /** 使用预设发射 */
  emitPreset(preset: string, x: number, y: number, baseAngle?: number): void {
    const config = PRESETS[preset];
    if (config) this.emit(x, y, config, baseAngle);
  }

  /** 更新所有活跃粒子 */
  update(dt: number): void {
    const dtSec = dt / 1000;
    this.activeCount = 0;
    for (let i = 0; i < this.maxSize; i++) {
      const p = this.pool[i];
      if (!p.active) continue;

      p.vy += p.gravity * dtSec;
      p.vx *= p.friction;
      p.vy *= p.friction;
      p.x += p.vx * dtSec;
      p.y += p.vy * dtSec;
      p.life -= dtSec;

      if (p.life <= 0) {
        p.active = false;
      } else {
        this.activeCount++;
      }
    }
  }

  /** 渲染所有活跃粒子（世界坐标） */
  draw(ctx: CanvasRenderingContext2D, camX: number, camY: number): void {
    for (let i = 0; i < this.maxSize; i++) {
      const p = this.pool[i];
      if (!p.active) continue;

      // 视锥裁剪
      const sx = p.x - camX;
      const sy = p.y - camY;
      if (sx < -50 || sx > ctx.canvas.width + 50 || sy < -50 || sy > ctx.canvas.height + 50) continue;

      const alpha = Math.max(0, p.life / p.maxLife);
      ctx.globalAlpha = alpha;
      ctx.fillStyle = p.color;
      const s = Math.max(1, Math.round(p.size * alpha));
      ctx.fillRect(Math.round(sx - s / 2), Math.round(sy - s / 2), s, s);
    }
    ctx.globalAlpha = 1;
  }

  /** 渲染所有活跃粒子（屏幕坐标，用于UI粒子） */
  drawScreen(ctx: CanvasRenderingContext2D): void {
    for (let i = 0; i < this.maxSize; i++) {
      const p = this.pool[i];
      if (!p.active) continue;

      const alpha = Math.max(0, p.life / p.maxLife);
      ctx.globalAlpha = alpha;
      ctx.fillStyle = p.color;
      const s = Math.max(1, Math.round(p.size * alpha));
      ctx.fillRect(Math.round(p.x - s / 2), Math.round(p.y - s / 2), s, s);
    }
    ctx.globalAlpha = 1;
  }

  get activeParticleCount(): number { return this.activeCount; }
}
