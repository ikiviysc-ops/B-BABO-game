/**
 * 移动系统 - 处理玩家/实体移动
 */

import { InputManager } from '@engine/InputManager';
import { EntityManager } from '@engine/EntityManager';

export class MovementSystem {
  constructor(private readonly input: InputManager) {}

  update(entities: EntityManager, dt: number): void {
    const axis = this.input.getMovementAxis();
    if (axis.x === 0 && axis.y === 0) return;

    for (const entity of entities.getAll()) {
      entity.x += axis.x * entity.speed * dt;
      entity.y += axis.y * entity.speed * dt;
    }
  }
}
