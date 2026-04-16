// MovementSystem.ts - 玩家移动系统

import type { Entity } from '../engine/EntityManager';
import type { InputManager } from '../engine/InputManager';
import type { VirtualJoystick } from '../engine/VirtualJoystick';

export interface MovementConfig {
  /** 地图边界(像素) */
  bounds: { minX: number; minY: number; maxX: number; maxY: number };
}

const DEFAULT_BOUNDS: MovementConfig['bounds'] = {
  minX: 0,
  minY: 0,
  maxX: 2000,
  maxY: 2000,
};

export class MovementSystem {
  private bounds: MovementConfig['bounds'];

  constructor(config?: Partial<MovementConfig>) {
    this.bounds = { ...DEFAULT_BOUNDS, ...config?.bounds };
  }

  /**
   * 更新玩家移动
   * @param entities 所有实体列表
   * @param input 输入管理器
   * @param joystick 虚拟摇杆
   * @param dt 帧间隔(秒)
   */
  update(
    entities: Entity[],
    input: InputManager,
    joystick: VirtualJoystick,
    dt: number
  ): void {
    // 虚拟摇杆优先，键盘备选
    const joyDir = joystick.getDirection();
    let dx = joyDir.x;
    let dy = joyDir.y;

    if (dx === 0 && dy === 0) {
      const keyDir = input.getMovementAxis();
      dx = keyDir.x;
      dy = keyDir.y;
    }

    // 归一化(摇杆已归一化，但保险起见)
    const len = Math.sqrt(dx * dx + dy * dy);
    if (len > 1) {
      dx /= len;
      dy /= len;
    }

    for (const entity of entities) {
      // 跳过非玩家实体
      if (entity.id !== 'player') continue;
      if (!entity.active) continue;

      const speed = (entity.speed as number) ?? 200;
      const x = entity.x as number;
      const y = entity.y as number;
      const size = (entity.size as number) ?? 16;

      let newX = x + dx * speed * dt;
      let newY = y + dy * speed * dt;

      // 边界限制
      newX = Math.max(this.bounds.minX + size, Math.min(this.bounds.maxX - size, newX));
      newY = Math.max(this.bounds.minY + size, Math.min(this.bounds.maxY - size, newY));

      entity.x = newX;
      entity.y = newY;

      // 记录朝向
      if (dx !== 0 || dy !== 0) {
        entity.facingX = dx;
        entity.facingY = dy;
      }
    }
  }

  /**
   * 更新边界
   */
  setBounds(bounds: Partial<MovementConfig['bounds']>): void {
    this.bounds = { ...this.bounds, ...bounds };
  }
}
