/**
 * 实体管理器 - 简化版 ECS
 * Phase 0 仅包含基础实体，后续扩展 Component 系统
 */

export interface Entity {
  readonly id: number;
  x: number;
  y: number;
  width: number;
  height: number;
  sprite: HTMLCanvasElement | OffscreenCanvas;
  active: boolean;
  speed: number;
}

let _nextId = 1;

export class EntityManager {
  private _entities = new Map<number, Entity>();

  add(entity: Entity): void {
    this._entities.set(entity.id, entity);
  }

  remove(id: number): void {
    this._entities.delete(id);
  }

  get(id: number): Entity | undefined {
    return this._entities.get(id);
  }

  /** 获取所有活跃实体 */
  getAll(): Entity[] {
    return Array.from(this._entities.values()).filter(e => e.active);
  }

  /** 按条件查询 */
  query(predicate: (e: Entity) => boolean): Entity[] {
    return this.getAll().filter(predicate);
  }

  /** 清理所有非活跃实体 */
  cleanup(): void {
    for (const [id, entity] of this._entities) {
      if (!entity.active) this._entities.delete(id);
    }
  }

  /** 生成唯一 ID */
  static nextId(): number {
    return _nextId++;
  }
}
