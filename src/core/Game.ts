/**
 * 游戏核心类 - 管理游戏生命周期
 */

import { GameLoop } from '@engine/GameLoop';
import { Renderer } from '@engine/Renderer';
import { Camera } from '@engine/Camera';
import { InputManager } from '@engine/InputManager';
import { EntityManager } from '@engine/EntityManager';
import { PlayerFactory } from '@entities/PlayerFactory';
import { MovementSystem } from '@systems/MovementSystem';
import { RenderSystem } from '@systems/RenderSystem';

export class Game {
  readonly canvas: HTMLCanvasElement;
  readonly renderer: Renderer;
  readonly camera: Camera;
  readonly input: InputManager;
  readonly entities: EntityManager;
  readonly loop: GameLoop;

  private movementSystem: MovementSystem;
  private renderSystem: RenderSystem;
  private _running = false;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.renderer = new Renderer(canvas);
    this.camera = new Camera(canvas.width, canvas.height);
    this.input = new InputManager(canvas);
    this.entities = new EntityManager();

    this.movementSystem = new MovementSystem(this.input);
    this.renderSystem = new RenderSystem(this.renderer, this.camera);

    this.loop = new GameLoop(60, this.update.bind(this), this.render.bind(this));

    // 监听窗口大小变化
    this.handleResize();
    window.addEventListener('resize', () => this.handleResize());
  }

  /** 启动游戏 */
  start(): void {
    if (this._running) return;
    this._running = true;

    // 创建玩家实体
    const player = PlayerFactory.createBabo('babo_fire');
    this.entities.add(player);

    // 摄像机跟随玩家
    this.camera.setTarget(player);

    console.log('[B-BABO] Game started!');
    this.loop.start();
  }

  /** 停止游戏 */
  stop(): void {
    this._running = false;
    this.loop.stop();
    console.log('[B-BABO] Game stopped.');
  }

  /** 逻辑更新 (fixed timestep) */
  private update(dt: number): void {
    this.input.update();
    this.movementSystem.update(this.entities, dt);
  }

  /** 渲染帧 */
  private render(): void {
    this.camera.update();
    this.renderer.clear();
    this.renderSystem.update(this.entities);
    this.renderer.renderHUD();
  }

  /** 处理窗口大小变化 */
  private handleResize(): void {
    const dpr = window.devicePixelRatio || 1;
    const w = window.innerWidth;
    const h = window.innerHeight;

    this.canvas.width = w * dpr;
    this.canvas.height = h * dpr;
    this.canvas.style.width = `${w}px`;
    this.canvas.style.height = `${h}px`;

    this.renderer.resize(w * dpr, h * dpr);
    this.camera.resize(w * dpr, h * dpr);
  }
}
