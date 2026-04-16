// Collision.ts - AABB碰撞 + SpatialHash空间哈希

export interface AABB {
  x: number;
  y: number;
  w: number;
  h: number;
}

export function aabbOverlap(a: AABB, b: AABB): boolean {
  return a.x < b.x + b.w &&
    a.x + a.w > b.x &&
    a.y < b.y + b.h &&
    a.y + a.h > b.y;
}

export function aabbCenterSize(cx: number, cy: number, w: number, h: number): AABB {
  return { x: cx - w / 2, y: cy - h / 2, w, h };
}

export interface SpatialEntity {
  id: string;
  x: number;
  y: number;
  w: number;
  h: number;
}

export class SpatialHash {
  private cellSize: number;
  private cells = new Map<string, SpatialEntity[]>();

  constructor(cellSize: number = 128) {
    this.cellSize = cellSize;
  }

  private _key(cx: number, cy: number): string {
    return `${cx},${cy}`;
  }

  clear(): void {
    this.cells.clear();
  }

  insert(entity: SpatialEntity): void {
    const minCX = Math.floor(entity.x / this.cellSize);
    const minCY = Math.floor(entity.y / this.cellSize);
    const maxCX = Math.floor((entity.x + entity.w) / this.cellSize);
    const maxCY = Math.floor((entity.y + entity.h) / this.cellSize);

    for (let cy = minCY; cy <= maxCY; cy++) {
      for (let cx = minCX; cx <= maxCX; cx++) {
        const key = this._key(cx, cy);
        let bucket = this.cells.get(key);
        if (!bucket) {
          bucket = [];
          this.cells.set(key, bucket);
        }
        bucket.push(entity);
      }
    }
  }

  query(x: number, y: number, w: number, h: number): SpatialEntity[] {
    const result: SpatialEntity[] = [];
    const seen = new Set<string>();

    const minCX = Math.floor(x / this.cellSize);
    const minCY = Math.floor(y / this.cellSize);
    const maxCX = Math.floor((x + w) / this.cellSize);
    const maxCY = Math.floor((y + h) / this.cellSize);

    for (let cy = minCY; cy <= maxCY; cy++) {
      for (let cx = minCX; cx <= maxCX; cx++) {
        const bucket = this.cells.get(this._key(cx, cy));
        if (!bucket) continue;
        for (const e of bucket) {
          if (!seen.has(e.id)) {
            seen.add(e.id);
            result.push(e);
          }
        }
      }
    }

    return result;
  }
}
