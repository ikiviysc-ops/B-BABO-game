/**
 * AABB 碰撞检测系统
 * 支持 AABB 碰撞检测 + 简单空间哈希优化
 */

/** AABB 碰撞盒 */
export interface AABB {
  x: number;
  y: number;
  w: number;
  h: number;
}

/** 碰撞结果 */
export interface CollisionResult {
  collided: boolean;
  /** 碰撞深度（用于分离） */
  depthX: number;
  depthY: number;
  /** 碰撞法线方向 */
  normalX: number;
  normalY: number;
}

/** 碰撞回调 */
export type CollisionCallback = (a: number, b: number) => void;

/**
 * 检测两个 AABB 是否重叠
 */
export function aabbOverlap(a: AABB, b: AABB): boolean {
  return (
    a.x < b.x + b.w &&
    a.x + a.w > b.x &&
    a.y < b.y + b.h &&
    a.y + a.h > b.y
  );
}

/**
 * 获取两个 AABB 的碰撞信息（深度 + 法线）
 */
export function getCollisionInfo(a: AABB, b: AABB): CollisionResult {
  const overlapX = Math.min(a.x + a.w, b.x + b.w) - Math.max(a.x, b.x);
  const overlapY = Math.min(a.y + a.h, b.y + b.h) - Math.max(a.y, b.y);

  if (overlapX <= 0 || overlapY <= 0) {
    return { collided: false, depthX: 0, depthY: 0, normalX: 0, normalY: 0 };
  }

  const aCenterX = a.x + a.w / 2;
  const aCenterY = a.y + a.h / 2;
  const bCenterX = b.x + b.w / 2;
  const bCenterY = b.y + b.h / 2;

  let normalX: number, normalY: number, depthX: number, depthY: number;

  if (overlapX < overlapY) {
    depthX = overlapX;
    depthY = 0;
    normalX = aCenterX < bCenterX ? -1 : 1;
    normalY = 0;
  } else {
    depthX = 0;
    depthY = overlapY;
    normalX = 0;
    normalY = aCenterY < bCenterY ? -1 : 1;
  }

  return { collided: true, depthX, depthY, normalX, normalY };
}

/**
 * 空间哈希网格 — 优化大量实体碰撞检测
 * 将世界划分为固定大小的格子，只检测同一格及相邻格内的实体对
 */
export class SpatialHash {
  private readonly _cellSize: number;
  private readonly _cells = new Map<string, number[]>();

  constructor(cellSize = 128) {
    this._cellSize = cellSize;
  }

  /** 清空所有格子 */
  clear(): void {
    this._cells.clear();
  }

  /** 将实体 ID 插入空间哈希 */
  insert(id: number, x: number, y: number, w: number, h: number): void {
    const minCX = Math.floor(x / this._cellSize);
    const minCY = Math.floor(y / this._cellSize);
    const maxCX = Math.floor((x + w) / this._cellSize);
    const maxCY = Math.floor((y + h) / this._cellSize);

    for (let cx = minCX; cx <= maxCX; cx++) {
      for (let cy = minCY; cy <= maxCY; cy++) {
        const key = `${cx},${cy}`;
        let cell = this._cells.get(key);
        if (!cell) {
          cell = [];
          this._cells.set(key, cell);
        }
        cell.push(id);
      }
    }
  }

  /** 查询与指定区域可能碰撞的所有实体 ID */
  query(x: number, y: number, w: number, h: number): number[] {
    const result = new Set<number>();
    const minCX = Math.floor(x / this._cellSize);
    const minCY = Math.floor(y / this._cellSize);
    const maxCX = Math.floor((x + w) / this._cellSize);
    const maxCY = Math.floor((y + h) / this._cellSize);

    for (let cx = minCX; cx <= maxCX; cx++) {
      for (let cy = minCY; cy <= maxCY; cy++) {
        const cell = this._cells.get(`${cx},${cy}`);
        if (cell) {
          for (const id of cell) result.add(id);
        }
      }
    }

    return Array.from(result);
  }

  /** 获取所有需要检测的碰撞对（去重） */
  getCollisionPairs(): [number, number][] {
    const pairs = new Set<string>();
    const result: [number, number][] = [];

    for (const [, cell] of this._cells) {
      for (let i = 0; i < cell.length; i++) {
        for (let j = i + 1; j < cell.length; j++) {
          const a = cell[i];
          const b = cell[j];
          const key = a < b ? `${a}:${b}` : `${b}:${a}`;
          if (!pairs.has(key)) {
            pairs.add(key);
            result.push([a, b]);
          }
        }
      }
    }

    return result;
  }
}

/**
 * 对象池 — 复用频繁创建/销毁的对象
 */
export class ObjectPool<T> {
  private readonly _pool: T[] = [];
  private readonly _factory: () => T;
  private readonly _reset: (obj: T) => void;
  private _activeCount = 0;

  constructor(factory: () => T, reset: (obj: T) => void, initialSize = 50) {
    this._factory = factory;
    this._reset = reset;
    for (let i = 0; i < initialSize; i++) {
      this._pool.push(factory());
    }
  }

  /** 从池中获取一个对象 */
  get(): T {
    let obj: T;
    if (this._pool.length > 0) {
      obj = this._pool.pop()!;
    } else {
      obj = this._factory();
    }
    this._activeCount++;
    return obj;
  }

  /** 归还对象到池中 */
  release(obj: T): void {
    this._reset(obj);
    this._pool.push(obj);
    this._activeCount--;
  }

  /** 获取当前活跃对象数量 */
  get activeCount(): number { return this._activeCount; }

  /** 获取池中可用对象数量 */
  get availableCount(): number { return this._pool.length; }
}
