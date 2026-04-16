/**
 * 移动系统 - 处理玩家移动（键盘 + 虚拟摇杆）
 * 平滑加减速：加速、摩擦力减速、限速
 */

import { InputManager } from '@engine/InputManager';
import { VirtualJoystick } from '@engine/VirtualJoystick';
import { EntityManager } from '@engine/EntityManager';

export class MovementSystem {
  private _velX = 0;
  private _velY = 0;
  private readonly _accel = 12;   // 加速度
  private readonly _friction = 10; // 摩擦力（减速）
  private readonly _maxSpeed = 300; // 最大速度

  constructor(
    private readonly input: InputManager,
    private readonly joystick: VirtualJoystick,
  ) {}

  update(entities: EntityManager, dt: number): void {
    const joy = this.joystick.getAxis();
    const key = this.input.getMovementAxis();

    const inputX = joy.x !== 0 ? joy.x : key.x;
    const inputY = joy.y !== 0 ? joy.y : key.y;

    // 加速
    if (inputX !== 0 || inputY !== 0) {
      this._velX += inputX * this._accel * 60 * dt;
      this._velY += inputY * this._accel * 60 * dt;
    }

    // 摩擦力减速
    if (inputX === 0) {
      this._velX *= Math.max(0, 1 - this._friction * dt);
      if (Math.abs(this._velX) < 1) this._velX = 0;
    }
    if (inputY === 0) {
      this._velY *= Math.max(0, 1 - this._friction * dt);
      if (Math.abs(this._velY) < 1) this._velY = 0;
    }

    // 限速
    const speed = Math.sqrt(this._velX * this._velX + this._velY * this._velY);
    if (speed > this._maxSpeed) {
      this._velX = (this._velX / speed) * this._maxSpeed;
      this._velY = (this._velY / speed) * this._maxSpeed;
    }

    if (this._velX === 0 && this._velY === 0) return;

    for (const entity of entities.getAll()) {
      if ('enemyId' in entity) continue;
      entity.x += this._velX * dt;
      entity.y += this._velY * dt;
    }
  }
}
