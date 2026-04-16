// ProjectilePool.ts - 投射物对象池

export interface Projectile {
  x: number;
  y: number;
  vx: number;
  vy: number;
  dmg: number;
  life: number;
  maxLife: number;
  pierce: number;
  active: boolean;
  size: number;
  color: string;
  type: string;
  owner: string;
}

const POOL_SIZE = 300;

export class ProjectilePool {
  private pool: Projectile[];

  constructor() {
    this.pool = [];
    for (let i = 0; i < POOL_SIZE; i++) {
      this.pool.push(this._create());
    }
  }

  private _create(): Projectile {
    return {
      x: 0, y: 0, vx: 0, vy: 0,
      dmg: 0, life: 0, maxLife: 1,
      pierce: 0, active: false,
      size: 4, color: '#fff', type: 'bullet', owner: '',
    };
  }

  spawn(config: Partial<Projectile> & { x: number; y: number; vx: number; vy: number }): Projectile | null {
    for (const p of this.pool) {
      if (!p.active) {
        p.x = config.x;
        p.y = config.y;
        p.vx = config.vx;
        p.vy = config.vy;
        p.dmg = config.dmg ?? 10;
        p.life = config.maxLife ?? 2;
        p.maxLife = config.maxLife ?? 2;
        p.pierce = config.pierce ?? 0;
        p.active = true;
        p.size = config.size ?? 4;
        p.color = config.color ?? '#fff';
        p.type = config.type ?? 'bullet';
        p.owner = config.owner ?? '';
        return p;
      }
    }
    return null;
  }

  get(): Projectile[] {
    return this.pool;
  }

  getActive(): Projectile[] {
    return this.pool.filter(p => p.active);
  }

  release(p: Projectile): void {
    p.active = false;
  }

  update(dt: number): void {
    for (const p of this.pool) {
      if (!p.active) continue;
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      p.life -= dt;
      if (p.life <= 0) p.active = false;
    }
  }

  clear(): void {
    for (const p of this.pool) p.active = false;
  }
}
