// Game.ts - 游戏核心类

import { Renderer } from '../engine/Renderer';
import { GameLoop } from '../engine/GameLoop';
import { InputManager } from '../engine/InputManager';
import { Camera } from '../engine/Camera';
import { EntityManager } from '../engine/EntityManager';
import { ParallaxBackground } from '../engine/ParallaxBackground';
import { TileMap } from '../engine/TileMap';
import { ParticleSystem } from '../engine/ParticleSystem';
import { ProjectilePool } from '../engine/ProjectilePool';
import { VirtualJoystick } from '../engine/VirtualJoystick';
import { ScreenShake } from '../engine/ScreenShake';
import { HitStop } from '../engine/HitStop';
import { CHARACTER_DEFS, type CharacterDef } from '../data/CharacterRegistry';
import { MovementSystem } from '../systems/MovementSystem';
import { EnemyAISystem } from '../systems/EnemyAISystem';
import { WaveSystem } from '../systems/WaveSystem';
import { LevelUpSystem } from '../systems/LevelUpSystem';

import { HUDRenderer } from '../ui/HUDRenderer';
import { LevelUpPanel } from '../ui/LevelUpPanel';
import { MainMenu } from '../ui/MainMenu';
import { GameOverScreen } from '../ui/GameOverScreen';
import { CharacterSelectScreen } from '../ui/CharacterSelectScreen';

import { GameState, type GamePhase } from './GameState';
import { GameRender } from './GameRender';
import { GameUpdate } from './GameUpdate';

export class Game {
  // 引擎
  private renderer: Renderer;
  private gameLoop: GameLoop;
  private input: InputManager;
  private camera: Camera;
  private entities: EntityManager;
  private bg: ParallaxBackground;
  private tileMap: TileMap;
  private particles: ParticleSystem;
  private projectilePool: ProjectilePool;
  private joystick: VirtualJoystick;
  private screenShake: ScreenShake;
  private hitStop: HitStop;
  // 系统
  private movementSystem: MovementSystem;
  private enemyAI: EnemyAISystem;
  private waveSystem: WaveSystem;
  private levelUpSystem: LevelUpSystem;

  // UI
  private hudRenderer: HUDRenderer;
  private levelUpPanel: LevelUpPanel;
  private mainMenu: MainMenu;
  private gameOverScreen: GameOverScreen;
  private charSelectScreen: CharacterSelectScreen;

  // 游戏状态和管理
  private state: GameState;
  private gameRender: GameRender;
  private gameUpdate: GameUpdate;

  // 角色选择
  private allCharDefs: CharacterDef[] = [...CHARACTER_DEFS];

  constructor(canvas: HTMLCanvasElement) {
    // 引擎初始化
    this.renderer = new Renderer(canvas);
    this.input = new InputManager(canvas);
    this.camera = new Camera();
    this.camera.resize(this.renderer.width, this.renderer.height);
    this.entities = new EntityManager();
    this.bg = new ParallaxBackground(this.renderer.width, this.renderer.height);
    this.tileMap = new TileMap();
    this.particles = new ParticleSystem();
    this.projectilePool = new ProjectilePool();
    this.joystick = new VirtualJoystick(canvas);
    this.screenShake = new ScreenShake();
    this.hitStop = new HitStop();

    // 系统初始化
    this.movementSystem = new MovementSystem({
      bounds: { minX: -2000, minY: -2000, maxX: 2000, maxY: 2000 },
    });

    this.enemyAI = new EnemyAISystem({
      onDamagePlayer: (_enemyId, damage) => {
        this.gameUpdate._applyEnemyDamageToPlayer(damage, this.state);
      },
    });

    this.waveSystem = new WaveSystem();

    this.levelUpSystem = new LevelUpSystem();

    // UI初始化
    this.hudRenderer = new HUDRenderer(this.renderer.dpr);
    this.levelUpPanel = new LevelUpPanel(this.renderer.dpr);
    this.mainMenu = new MainMenu(this.renderer.dpr);
    this.gameOverScreen = new GameOverScreen(this.renderer.dpr);
    this.charSelectScreen = new CharacterSelectScreen(this.renderer.dpr);

    // 游戏状态和管理
    this.state = new GameState();
    this.gameRender = new GameRender(
      this.renderer,
      this.camera,
      this.entities,
      this.bg,
      this.tileMap,
      this.particles,
      this.projectilePool,
      this.joystick,
      this.screenShake,
      this.hudRenderer,
      this.levelUpPanel,
      this.mainMenu,
      this.gameOverScreen,
      this.charSelectScreen
    );
    this.gameUpdate = new GameUpdate(
      this.input,
      this.camera,
      this.entities,
      this.projectilePool,
      this.joystick,
      this.particles,
      this.screenShake,
      this.hitStop,
      this.movementSystem,
      this.enemyAI,
      this.waveSystem,
      this.levelUpSystem,
      this.mainMenu,
      this.levelUpPanel,
      this.gameOverScreen,
      this.charSelectScreen,
      this.allCharDefs
    );

    // 游戏循环
    this.gameLoop = new GameLoop(
      (dt) => this.update(dt),
      () => this.render(),
    );

    // 窗口resize
    window.addEventListener('resize', () => this._onResize());
  }

  start(): void {
    this.gameLoop.start();
  }

  // ==================== UPDATE ====================

  private update(dt: number): void {
    this.gameUpdate.update(dt, this.state);
  }

  // ==================== RENDER ====================

  private render(): void {
    this.gameRender.render(this.state, this.levelUpSystem, this.allCharDefs);
  }

  // ==================== 辅助 ====================

  onResize(): void {
    this._onResize();
  }

  private _onResize(): void {
    this.gameRender.resize();
  }

  get phase(): GamePhase {
    return this.state.phase;
  }
}
