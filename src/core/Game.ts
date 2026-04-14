/**
 * 游戏核心类 - 管理游戏生命周期
 */

import { GameLoop } from '@engine/GameLoop';
import { Renderer } from '@engine/Renderer';
import { Camera } from '@engine/Camera';
import { InputManager } from '@engine/InputManager';
import { EntityManager } from '@engine/EntityManager';
import { CharacterRegistry } from '@data/CharacterRegistry';
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

  /** 角色切换 */
  private _charIds: string[];
  private _charIndex = 0;
  private _tabPressed = false;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.renderer = new Renderer(canvas);
    this.camera = new Camera(canvas.width, canvas.height);
    this.input = new InputManager(canvas);
    this.entities = new EntityManager();

    this.movementSystem = new MovementSystem(this.input);
    this.renderSystem = new RenderSystem(this.renderer, this.camera);

    this.loop = new GameLoop(60, this.update.bind(this), this.render.bind(this));

    // 初始化角色列表
    this._charIds = CharacterRegistry.getAllDefs().map(d => d.id);

    // 监听窗口大小变化
    this.handleResize();
    window.addEventListener('resize', () => this.handleResize());
  }

  /** 启动游戏 */
  start(): void {
    if (this._running) return;
    this._running = true;

    // 创建默认角色 (战士)
    this.spawnCharacter(this._charIds[0]);

    console.log(`[B-BABO] Game started! ${CharacterRegistry.totalCharacters} characters loaded.`);
    console.log('[B-BABO] Press TAB to switch character, WASD/Arrows to move.');
    this.loop.start();
  }

  /** 生成角色实体 */
  private spawnCharacter(charId: string): void {
    // 清除旧实体
    for (const e of this.entities.getAll()) {
      this.entities.remove(e.id);
    }

    const player = CharacterRegistry.createEntity(charId, 3);
    this.entities.add(player);
    this.camera.setTarget(player);

    const def = CharacterRegistry.getDef(charId);
    const sprite = CharacterRegistry.getSprite(charId);
    console.log(`[B-BABO] Switched to: ${def?.name} (${sprite?.hironoSeries})`);
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

    // PC: Tab 键切换角色
    if (this.input.isKeyDown('tab') && !this._tabPressed) {
      this._tabPressed = true;
      this._charIndex = (this._charIndex + 1) % this._charIds.length;
      this.spawnCharacter(this._charIds[this._charIndex]);
    }
    if (!this.input.isKeyDown('tab')) {
      this._tabPressed = false;
    }

    // 手机: 触摸屏幕切换角色（点击画面上半区 = 下一个，下半区 = 上一个）
    if (this.input.consumeTap()) {
      const ty = this.input.touchY;
      const th = this.canvas.clientHeight || window.innerHeight;
      if (ty < th * 0.5) {
        // 点击上半屏 → 下一个角色
        this._charIndex = (this._charIndex + 1) % this._charIds.length;
      } else {
        // 点击下半屏 → 上一个角色
        this._charIndex = (this._charIndex - 1 + this._charIds.length) % this._charIds.length;
      }
      this.spawnCharacter(this._charIds[this._charIndex]);
    }

    this.movementSystem.update(this.entities, dt);
  }

  /** 渲染帧 */
  private render(): void {
    this.camera.update();
    this.renderer.clear();
    this.renderSystem.update(this.entities);

    // HUD: 当前角色信息
    const charId = this._charIds[this._charIndex];
    const def = CharacterRegistry.getDef(charId);
    const sprite = CharacterRegistry.getSprite(charId);
    if (def && sprite) {
      this.renderer.renderCharacterHUD(
        def.name,
        sprite.hironoSeries,
        this._charIndex + 1,
        this._charIds.length,
      );
    }
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
