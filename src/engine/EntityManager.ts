/**
 * 实体管理器 - 性能优化版
 *
 * - getAll() 使用脏标记缓存，避免每帧 Array.from + filter
 * - 每帧开始时调用 beginFrame()，结束时调用 endFrame()
 */

export interface Entity {
  readonly id: number;
  x: number;
  y: number;
  width: number;
  height: number;
  sprite: HTMLCanvasElement;
  active: boolean;
  speed: number;
}

let _nextId = 1;

export class EntityManager {
  private _entities = new Map<number, Entity>();
  private _cache: Entity[] = [];
  private _dirty = true;

  add(entity: Entity): void {
    this._entities.set(entity.id, entity);
    this._dirty = true;
  }

  remove(id: number): void {
    this._entities.delete(id);
    this._dirty = true;
  }

  get(id: number): Entity | undefined {
    return this._entities.get(id);
  }

  /** 获取所有活跃实体（带缓存） */
  getAll(): Entity[] {
    if (this._dirty) {
      this._cache = Array.from(this._entities.values()).filter(e => e.active);
      this._dirty = false;
    }
    return this._cache;
  }

  /** 按条件查询 */
  query(predicate: (e: Entity) => boolean): Entity[] {
    return this.getAll().filter(predicate);
  }

  /** 标记脏（实体状态变化时外部调用） */
  markDirty(): void {
    this._dirty = true;
  }

  /** 清理所有非活跃实体 */
  cleanup(): void {
    for (const [id, entity] of this._entities) {
      if (!entity.active) {
        this._entities.delete(id);
        this._dirty = true;
      }
    }
  }

  /** 生成唯一 ID */
  static nextId(): number {
    return _nextId++;
  }
}
