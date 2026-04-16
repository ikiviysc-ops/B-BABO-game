/**
 * 渲染系统 - 将实体绘制到画布
 *
 * 渲染顺序：
 * 1. 视差背景（最远 -> 中近，屏幕空间）
 * 2. 瓦片地面（世界空间）
 * 3. 地面装饰（世界空间）
 * 4. 实体（玩家 + 敌人，世界空间）
 */

import { Renderer } from '@engine/Renderer';
import { Camera } from '@engine/Camera';
import { EntityManager } from '@engine/EntityManager';
import { TileMap } from '@engine/TileMap';
import { ParallaxBackground } from '@engine/ParallaxBackground';
import { drawCharacterShadow } from '@engine/VisualEnhancer';

export class RenderSystem {
  private readonly tileMap = new TileMap();
  private readonly parallax = new ParallaxBackground();
  private _time = 0;

  constructor(
    private readonly renderer: Renderer,
    private readonly camera: Camera,
  ) {}

  update(entities: EntityManager, dt = 0): void {
    const ctx = this.renderer.ctx;
    this._time += dt;

    // ─── 1. 视差背景（屏幕空间） ───────────────────────
    this.parallax.draw(ctx, this.camera, this._time);

    // ─── 2-4. 世界空间内容 ─────────────────────────────
    ctx.save();
    ctx.imageSmoothingEnabled = false;
    ctx.translate(-Math.round(this.camera.x), -Math.round(this.camera.y));

    // 2. 瓦片地面
    this.tileMap.draw(ctx, this.camera);

    // 3. 地面装饰
    this.parallax.drawGroundDecorations(ctx, this.camera);

    // 4. 实体
    this.drawEntities(entities);

    ctx.restore();
  }

  /** 绘制所有实体（带视锥剔除） */
  private drawEntities(entities: EntityManager): void {
    const ctx = this.renderer.ctx;
    for (const entity of entities.getAll()) {
      if (this.isInView(entity)) {
        const sx = Math.round(entity.x - entity.width / 2);
        const sy = Math.round(entity.y - entity.height / 2);
        const w = entity.width;
        const h = entity.height;
        // 角色阴影
        drawCharacterShadow(ctx, sx, sy + h, w, false);
        this.renderer.drawSprite(
          entity.sprite,
          sx,
          sy,
        );
      }
    }
  }

  /** 视锥剔除 */
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
