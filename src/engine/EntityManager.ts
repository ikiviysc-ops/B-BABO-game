// EntityManager.ts - 简化ECS

export interface Entity {
  id: string;
  active: boolean;
  [key: string]: unknown;
}

export class EntityManager {
  private entities = new Map<string, Entity>();
  private pendingAdd: Entity[] = [];
  private pendingRemove: string[] = [];

  add(entity: Entity): void {
    this.pendingAdd.push(entity);
  }

  remove(id: string): void {
    this.pendingRemove.push(id);
  }

  get(id: string): Entity | undefined {
    return this.entities.get(id);
  }

  getAll(): Entity[] {
    const result: Entity[] = [];
    for (const e of this.entities.values()) {
      if (e.active) result.push(e);
    }
    return result;
  }

  getAllIncludingInactive(): Entity[] {
    return Array.from(this.entities.values());
  }

  beginFrame(): void {
    for (const e of this.pendingAdd) {
      this.entities.set(e.id, e);
    }
    this.pendingAdd = [];
  }

  endFrame(): void {
    for (const id of this.pendingRemove) {
      this.entities.delete(id);
    }
    this.pendingRemove = [];
  }

  clear(): void {
    this.entities.clear();
    this.pendingAdd = [];
    this.pendingRemove = [];
  }

  get count(): number {
    return this.entities.size;
  }
}
