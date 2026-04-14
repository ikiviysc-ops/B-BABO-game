/**
 * 渲染系统 - 将实体绘制到画布
 */

import { Renderer } from '@engine/Renderer';
import { Camera } from '@engine/Camera';
import { EntityManager } from '@engine/EntityManager';

export class RenderSystem {
  constructor(
    private readonly renderer: Renderer,
    private readonly camera: Camera,
  ) {}

  update(entities: EntityManager): void {
    const ctx = this.renderer.ctx;

    // 应用摄像机变换
    ctx.save();
    ctx.translate(-Math.round(this.camera.x), -Math.round(this.camera.y));

    // 绘制网格背景 (调试用)
    this.drawGrid(ctx);

    // 绘制所有实体
    for (const entity of entities.getAll()) {
      // 视锥剔除
      if (this.isInView(entity)) {
        this.renderer.drawSprite(
          entity.sprite,
          Math.round(entity.x - entity.width / 2),
          Math.round(entity.y - entity.height / 2),
        );
      }
    }

    ctx.restore();
  }

  /** 绘制背景网格 */
  private drawGrid(ctx: CanvasRenderingContext2D): void {
    const gridSize = 64;
    const startX = Math.floor(this.camera.x / gridSize) * gridSize;
    const startY = Math.floor(this.camera.y / gridSize) * gridSize;
    const endX = startX + this.camera.width + gridSize;
    const endY = startY + this.camera.height + gridSize;

    ctx.strokeStyle = 'rgba(255, 255, 255, 0.03)';
    ctx.lineWidth = 1;

    ctx.beginPath();
    for (let x = startX; x <= endX; x += gridSize) {
      ctx.moveTo(x, startY);
      ctx.lineTo(x, endY);
    }
    for (let y = startY; y <= endY; y += gridSize) {
      ctx.moveTo(startX, y);
      ctx.lineTo(endX, y);
    }
    ctx.stroke();
  }

  /** 简单视锥剔除 */
  private isInView(entity: { x: number; y: number; width: number; height: number }): boolean {
    const hw = entity.width / 2;
    const hh = entity.height / 2;
    return (
      entity.x + hw > this.camera.x &&
      entity.x - hw < this.camera.x + this.camera.width &&
      entity.y + hh > this.camera.y &&
      entity.y - hh < this.camera.y + this.camera.height
    );
  }
}
