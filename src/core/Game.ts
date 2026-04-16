// Game.ts - 游戏核心类

import { Renderer } from '../engine/Renderer';
import { GameLoop } from '../engine/GameLoop';
import { InputManager } from '../engine/InputManager';
import { Camera } from '../engine/Camera';
import { EntityManager, type Entity } from '../engine/EntityManager';
import { ParallaxBackground } from '../engine/ParallaxBackground';
import { TileMap } from '../engine/TileMap';
import { ParticleSystem } from '../engine/ParticleSystem';
import { ProjectilePool } from '../engine/ProjectilePool';
import { VirtualJoystick } from '../engine/VirtualJoystick';
import { ScreenShake } from '../engine/ScreenShake';
import { HitStop } from '../engine/HitStop';
import { renderCharacter } from '../data/CharacterRegistry';
import { CHARACTER_DEFS, type CharacterDef } from '../data/CharacterRegistry';
import { getWeaponDef, type WeaponDef } from '../data/WeaponDefs';
import { type EnemyDef } from '../data/EnemyDefs';
import { MovementSystem } from '../systems/MovementSystem';
import { EnemyAISystem } from '../systems/EnemyAISystem';
import { WaveSystem } from '../systems/WaveSystem';
import { LevelUpSystem, type LevelUpOption } from '../systems/LevelUpSystem';

import { HUDRenderer, type HUDState } from '../ui/HUDRenderer';
import { LevelUpPanel } from '../ui/LevelUpPanel';
import { MainMenu } from '../ui/MainMenu';
import { GameOverScreen } from '../ui/GameOverScreen';
import { CharacterSelectScreen } from '../ui/CharacterSelectScreen';

// ==================== 类型 ====================

type GamePhase = 'menu' | 'charSelect' | 'playing' | 'levelUp' | 'gameOver';

interface FloatText {
  x: number;
  y: number;
  text: string;
  color: string;
  life: number;
  maxLife: number;
}

interface Pickup {
  x: number;
  y: number;
  type: 'xp' | 'heal';
  value: number;
  life: number;
  active: boolean;
}

// ==================== Game ====================

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

  // 游戏状态
  private _phase: GamePhase = 'menu';
  private selectedCharIndex = 0;
  private playerCharId = 'babo';

  // 运行时数据
  private floatTexts: FloatText[] = [];
  private pickups: Pickup[] = [];
  private weaponCooldowns: number[] = [];
  private weaponDefs: WeaponDef[] = [];
  private elapsed = 0;
  private kills = 0;
  private score = 0;
  private playerHp = 100;
  private playerMaxHp = 100;
  private playerSpeed = 200;
  private playerArmor = 0;
  private playerCritChance = 5;
  private invincibleTimer = 0;
  private damageFlashTimer = 0;

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
        this._applyEnemyDamageToPlayer(damage);
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
    switch (this._phase) {
      case 'menu':
        this._updateMenu();
        break;
      case 'charSelect':
        this._updateCharSelect();
        break;
      case 'playing':
        this._updatePlaying(dt);
        break;
      case 'levelUp':
        this._updateLevelUp();
        break;
      case 'gameOver':
        this._updateGameOver();
        break;
    }
  }

  private _updateMenu(): void {
    if (this.input.consumeTap()) {
      const action = this.mainMenu.hitTest(
        this.input.mouseX || this.input.touchX,
        this.input.mouseY || this.input.touchY,
        this.renderer.width,
        this.renderer.height,
      );
      if (action === 'action') {
        this._startGame();
      } else if (action === 'chars') {
        this._phase = 'charSelect';
      }
      // 'help' - 暂不处理
    }
  }

  private _updateCharSelect(): void {
    if (this.input.consumeTap()) {
      const tx = this.input.mouseX || this.input.touchX;
      const ty = this.input.mouseY || this.input.touchY;
      const action = this.charSelectScreen.hitTest(tx, ty, this.renderer.width, this.renderer.height);

      switch (action) {
        case 'back':
          this._phase = 'menu';
          break;
        case 'prev':
          this.selectedCharIndex = (this.selectedCharIndex - 1 + this.allCharDefs.length) % this.allCharDefs.length;
          break;
        case 'next':
          this.selectedCharIndex = (this.selectedCharIndex + 1) % this.allCharDefs.length;
          break;
        case 'confirm':
          this.playerCharId = this.allCharDefs[this.selectedCharIndex].id;
          this._startGame();
          break;
      }
    }

    // Tab键切换
    if (this.input.isDown('Tab')) {
      this.selectedCharIndex = (this.selectedCharIndex + 1) % this.allCharDefs.length;
      this.input.keys.delete('Tab');
    }
  }

  private _updatePlaying(dt: number): void {
    // 命中停顿
    if (this.hitStop.update(dt)) return;

    this.elapsed += dt;
    this.invincibleTimer = Math.max(0, this.invincibleTimer - dt);
    this.damageFlashTimer = Math.max(0, this.damageFlashTimer - dt);

    // EntityManager帧管理
    this.entities.beginFrame();

    // 更新摄像机
    const player = this.entities.get('player');
    if (player) {
      this.camera.setTarget(player.x as number, player.y as number);
    }
    this.camera.update();

    // 移动
    this.movementSystem.update(
      this.entities.getAllIncludingInactive(),
      this.input,
      this.joystick,
      dt,
    );

    // 更新玩家速度(可能被升级修改)
    if (player) {
      player.speed = this.playerSpeed;
    }

    // 武器系统 - 多武器支持
    const enemies = this.entities.getAll().filter(e => e.id !== 'player');
    for (let i = 0; i < this.weaponDefs.length; i++) {
      const wDef = this.weaponDefs[i];
      if (!wDef) continue;

      // 冷却
      this.weaponCooldowns[i] = (this.weaponCooldowns[i] ?? 0) - dt;
      if (this.weaponCooldowns[i] > 0) continue;

      // 找最近敌人
      let nearest: Entity | null = null;
      let nearestDist = Infinity;
      const px = (player?.x as number) ?? 0;
      const py = (player?.y as number) ?? 0;
      for (const e of enemies) {
        if (!e.active || (e.hp as number) <= 0) continue;
        const dx = (e.x as number) - px;
        const dy = (e.y as number) - py;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < nearestDist) {
          nearestDist = dist;
          nearest = e;
        }
      }

      if (!nearest || nearestDist > wDef.range * 1.5) continue;

      // 攻击
      const dmgMul = this.levelUpSystem.getWeaponDamageMultiplier(wDef.id);
      const rateMul = this.levelUpSystem.getWeaponFireRateMultiplier(wDef.id);
      this.weaponCooldowns[i] = wDef.fireRate * rateMul;

      if (wDef.type === 'melee') {
        this._meleeAttack(player!, wDef, enemies, nearestDist, dmgMul);
      } else {
        this._rangedAttack(player!, wDef, nearest!, dmgMul);
      }
    }

    // 敌人AI
    this.enemyAI.update(
      enemies,
      player?.x as number ?? 0,
      player?.y as number ?? 0,
      dt,
    );

    // 投射物更新 + 碰撞
    this._updateProjectileCollisions(enemies);

    // 同步HP引用
    this.playerHp = Math.max(0, this.playerHp);
    if (player) player.hp = this.playerHp;

    // 检查死亡
    if (this.playerHp <= 0) {
      this._phase = 'gameOver';
      this.particles.emitPreset((player?.x as number) ?? 0, (player?.y as number) ?? 0, 'DEATH');
      return;
    }

    // 波次系统
    this.waveSystem.update(
      dt,
      player?.x as number ?? 0,
      player?.y as number ?? 0,
      (def, x, y) => this._spawnEnemy(def, x, y),
    );

    // 拾取物
    this._updatePickups(dt, player);

    // 浮动文字
    this._updateFloatTexts(dt);

    // 粒子
    this.particles.update(dt);

    // 屏幕震动
    this.screenShake.update(dt);

    // 清理非活跃实体
    this.entities.endFrame();
  }

  private _updateLevelUp(): void {
    if (this.input.consumeTap()) {
      const tx = this.input.mouseX || this.input.touchX;
      const ty = this.input.mouseY || this.input.touchY;
      const idx = this.levelUpPanel.hitTest(
        tx, ty,
        this.levelUpSystem.options,
        this.renderer.width,
        this.renderer.height,
      );
      if (idx >= 0) {
        const selected = this.levelUpSystem.selectOption(idx);
        this._applyLevelUpOption(selected);
        this.particles.emitPreset(
          (this.entities.get('player')?.x as number) ?? 0,
          (this.entities.get('player')?.y as number) ?? 0,
          'LEVEL_UP',
        );

        // 连续升级检查
        if (this.levelUpSystem.pendingLevelUp) {
          // 保持levelUp阶段
        } else {
          this._phase = 'playing';
        }
      }
    }
  }

  private _updateGameOver(): void {
    if (this.input.consumeTap()) {
      const tx = this.input.mouseX || this.input.touchX;
      const ty = this.input.mouseY || this.input.touchY;
      const action = this.gameOverScreen.hitTest(tx, ty, this.renderer.width, this.renderer.height);
      if (action === 'restart') {
        this._startGame();
      } else if (action === 'menu') {
        this._phase = 'menu';
      }
    }
  }

  // ==================== RENDER ====================

  private render(): void {
    const ctx = this.renderer.ctx;
    const dpr = this.renderer.dpr;
    const sw = this.renderer.width;
    const sh = this.renderer.height;

    // 强制重置到DPR变换（所有UI用CSS像素坐标）
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.globalAlpha = 1;
    ctx.globalCompositeOperation = 'source-over';
    ctx.imageSmoothingEnabled = false;

    // 1. 清屏（用CSS像素坐标，DPR变换会自动缩放）
    ctx.fillStyle = '#0a0a1a';
    ctx.fillRect(0, 0, sw, sh);

    if (this._phase === 'menu') {
      this.mainMenu.render(ctx, sw, sh, dpr);
      return;
    }

    if (this._phase === 'charSelect') {
      this.charSelectScreen.render(ctx, {
        characters: this.allCharDefs,
        currentIndex: this.selectedCharIndex,
        dpr,
      }, sw, sh, dpr);
      return;
    }

    // 设置DPR变换
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    // 屏幕震动偏移
    const shake = this.screenShake.getOffset();

    // 2. 视差背景
    this.bg.render(ctx, this.camera.x + shake.x, this.camera.y + shake.y);

    // 3. 瓦片地面
    ctx.save();
    ctx.translate(shake.x, shake.y);
    this.tileMap.render(ctx, this.camera, sw, sh);
    ctx.restore();

    // 世界坐标变换
    const camOff = this.camera.getOffset();
    ctx.save();
    ctx.translate(camOff.x + shake.x, camOff.y + shake.y);

    // 4. 地面装饰/拾取物
    this._renderPickups(ctx);

    // 5. 敌人(阴影+精灵+血条)
    this._renderEnemies(ctx);

    // 6. 投射物
    this._renderProjectiles(ctx);

    // 7. 玩家(阴影+精灵+血条)
    this._renderPlayer(ctx);

    // 8. 粒子特效
    this.particles.render(ctx);

    // 9. 浮动伤害数字
    this._renderFloatTexts(ctx);

    ctx.restore();

    // 10. HUD
    if (this._phase === 'playing' || this._phase === 'levelUp') {
      this._renderHUD(ctx, sw, sh, dpr);
    }

    // 11. 虚拟摇杆
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    this.joystick.render(ctx);

    // 12. UI覆盖层
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    if (this._phase === 'levelUp') {
      this.levelUpPanel.render(
        ctx,
        this.levelUpSystem.options,
        this.levelUpSystem.level,
        sw, sh, dpr,
      );
    } else if (this._phase === 'gameOver') {
      this.gameOverScreen.render(ctx, {
        kills: this.kills,
        score: this.score,
        level: this.levelUpSystem.level,
        elapsed: this.elapsed,
        weapons: this.weaponDefs.map((w) => ({
          name: w.name,
          level: this.levelUpSystem.getContext().weaponLevels.get(w.id) ?? 1,
        })),
      }, sw, sh, dpr);
    }
  }

  // ==================== 渲染辅助 ====================

  private _renderPlayer(ctx: CanvasRenderingContext2D): void {
    const player = this.entities.get('player');
    if (!player || !player.active) return;

    const px = player.x as number;
    const py = player.y as number;

    // 阴影
    ctx.fillStyle = 'rgba(0,0,0,0.3)';
    ctx.beginPath();
    ctx.ellipse(px, py + 16, 14, 6, 0, 0, Math.PI * 2);
    ctx.fill();

    // 受伤闪烁
    if (this.damageFlashTimer > 0 && Math.floor(this.damageFlashTimer * 10) % 2 === 0) {
      ctx.globalAlpha = 0.5;
    }

    // 精灵
    renderCharacter(ctx, this.playerCharId, px - 32, py - 48, 2);

    ctx.globalAlpha = 1;
  }

  private _renderEnemies(ctx: CanvasRenderingContext2D): void {
    const enemies = this.entities.getAll().filter(e => e.id !== 'player');
    for (const enemy of enemies) {
      if (!enemy.active || (enemy.hp as number) <= 0) continue;

      const ex = enemy.x as number;
      const ey = enemy.y as number;
      const size = (enemy.size as number) ?? 16;
      const color = (enemy.color as string) ?? '#ff0000';
      const maxHp = (enemy.maxHp as number) ?? (enemy.hp as number);
      const hp = enemy.hp as number;

      // 阴影
      ctx.fillStyle = 'rgba(0,0,0,0.25)';
      ctx.beginPath();
      ctx.ellipse(ex, ey + size * 0.6, size * 0.7, size * 0.25, 0, 0, Math.PI * 2);
      ctx.fill();

      // 受击闪烁
      const flash = enemy.hitFlash as number ?? 0;
      if (flash > 0) {
        ctx.fillStyle = '#ffffff';
      } else {
        ctx.fillStyle = color;
      }

      // 精灵(简化为方块)
      ctx.fillRect(ex - size / 2, ey - size / 2, size, size);

      // 眼睛
      ctx.fillStyle = '#ffffff';
      const eyeSize = Math.max(2, size * 0.15);
      ctx.fillRect(ex - size * 0.2 - eyeSize / 2, ey - size * 0.1, eyeSize, eyeSize);
      ctx.fillRect(ex + size * 0.2 - eyeSize / 2, ey - size * 0.1, eyeSize, eyeSize);

      // 血条(受伤时显示)
      if (hp < maxHp) {
        const barW = size * 1.2;
        const barH = 3;
        const barX = ex - barW / 2;
        const barY = ey - size / 2 - 6;

        ctx.fillStyle = '#333333';
        ctx.fillRect(barX, barY, barW, barH);
        ctx.fillStyle = '#e94560';
        ctx.fillRect(barX, barY, barW * (hp / maxHp), barH);
      }

      // 更新闪烁
      if (flash > 0) {
        enemy.hitFlash = Math.max(0, flash - 1 / 60);
      }
    }
  }

  private _renderProjectiles(ctx: CanvasRenderingContext2D): void {
    const projectiles = this.projectilePool.getActive();
    for (const p of projectiles) {
      if (!p.active) continue;

      ctx.fillStyle = p.color;
      if (p.type === 'special') {
        // 特殊投射物用菱形
        ctx.beginPath();
        ctx.moveTo(p.x, p.y - p.size);
        ctx.lineTo(p.x + p.size, p.y);
        ctx.lineTo(p.x, p.y + p.size);
        ctx.lineTo(p.x - p.size, p.y);
        ctx.closePath();
        ctx.fill();
      } else {
        // 普通投射物用圆形
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      }

      // 拖尾
      ctx.globalAlpha = 0.3;
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(p.x - p.vx * 0.02, p.y - p.vy * 0.02, p.size * 0.7, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalAlpha = 1;
    }
  }

  private _renderPickups(ctx: CanvasRenderingContext2D): void {
    for (const p of this.pickups) {
      if (!p.active) continue;

      const alpha = p.life < 2 ? p.life / 2 : 1;
      ctx.globalAlpha = alpha;

      if (p.type === 'xp') {
        // 经验宝石 - 绿色菱形
        ctx.fillStyle = '#00ff88';
        ctx.beginPath();
        ctx.moveTo(p.x, p.y - 5);
        ctx.lineTo(p.x + 4, p.y);
        ctx.lineTo(p.x, p.y + 5);
        ctx.lineTo(p.x - 4, p.y);
        ctx.closePath();
        ctx.fill();
      } else {
        // 治疗 - 红色十字
        ctx.fillStyle = '#ff4466';
        ctx.fillRect(p.x - 2, p.y - 5, 4, 10);
        ctx.fillRect(p.x - 5, p.y - 2, 10, 4);
      }
    }
    ctx.globalAlpha = 1;
  }

  private _renderFloatTexts(ctx: CanvasRenderingContext2D): void {
    for (const ft of this.floatTexts) {
      ctx.globalAlpha = Math.max(0, ft.life / ft.maxLife);
      ctx.fillStyle = ft.color;
      ctx.font = `bold ${ft.text === 'CRIT!' ? 14 : 11}px "Noto Sans SC", sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(ft.text, ft.x, ft.y);
    }
    ctx.globalAlpha = 1;
  }

  private _renderHUD(ctx: CanvasRenderingContext2D, sw: number, sh: number, dpr: number): void {
    const player = this.entities.get('player');
    const playerScreen = player
      ? this.camera.worldToScreen(player.x as number, player.y as number)
      : { x: sw / 2, y: sh / 2 };

    const hudState: HUDState = {
      hp: this.playerHp,
      maxHp: this.playerMaxHp,
      xp: this.levelUpSystem.xp,
      xpToNext: this.levelUpSystem.xpToNext,
      level: this.levelUpSystem.level,
      weapons: this.weaponDefs.map((w, i) => ({
        name: w.name,
        level: this.levelUpSystem.getContext().weaponLevels.get(w.id) ?? 1,
        cooldown: this.weaponCooldowns[i] ?? 0,
        maxCooldown: w.fireRate * this.levelUpSystem.getWeaponFireRateMultiplier(w.id),
        color: w.color ?? '#ffffff',
      })),
      kills: this.kills,
      score: this.score,
      elapsed: this.elapsed,
      dpr,
      playerScreenX: playerScreen.x,
      playerScreenY: playerScreen.y,
    };

    this.hudRenderer.render(ctx, hudState);
  }

  // ==================== 游戏逻辑 ====================

  private _startGame(): void {
    // 重置所有状态
    this.entities.clear();
    this.projectilePool.clear();
    this.particles.clear();
    this.floatTexts = [];
    this.pickups = [];
    this.weaponCooldowns = [];
    this.weaponDefs = [];
    this.elapsed = 0;
    this.kills = 0;
    this.score = 0;
    this.invincibleTimer = 0;
    this.damageFlashTimer = 0;

    // 获取角色定义
    const charDef = this.allCharDefs.find(c => c.id === this.playerCharId) ?? this.allCharDefs[0];

    // 初始化玩家属性
    this.playerMaxHp = charDef.stats.hp;
    this.playerHp = this.playerMaxHp;
    this.playerSpeed = charDef.stats.speed;
    this.playerArmor = charDef.stats.armor;
    this.playerCritChance = charDef.stats.crit;

    // 初始化LevelUpSystem
    this.levelUpSystem.reset();
    this.levelUpSystem.getContext().stats.maxHp = charDef.stats.hp;
    this.levelUpSystem.getContext().stats.speed = charDef.stats.speed;
    this.levelUpSystem.getContext().stats.armor = charDef.stats.armor;
    this.levelUpSystem.getContext().stats.critChance = charDef.stats.crit;

    // 初始武器
    const initWeaponId = charDef.initialWeapon;
    const initWeaponDef = getWeaponDef(initWeaponId);
    if (initWeaponDef) {
      this.weaponDefs.push(initWeaponDef);
      this.weaponCooldowns.push(0);
      this.levelUpSystem.getContext().ownedWeapons.push(initWeaponId);
      this.levelUpSystem.getContext().weaponLevels.set(initWeaponId, 1);
    }

    // 创建玩家实体
    this.entities.add({
      id: 'player',
      active: true,
      x: 0,
      y: 0,
      hp: this.playerHp,
      maxHp: this.playerMaxHp,
      speed: this.playerSpeed,
      size: 16,
      facingX: 0,
      facingY: 1,
    });

    // 摄像机
    this.camera.snap(0, 0);

    // 波次系统
    this.waveSystem.reset();

    // HUD
    this.hudRenderer.reset();

    this._phase = 'playing';
  }

  private _spawnEnemy(def: EnemyDef, x: number, y: number): void {
    const id = `enemy_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;
    this.entities.add({
      id,
      active: true,
      x,
      y,
      hp: def.hp,
      maxHp: def.hp,
      speed: def.speed,
      damage: def.damage,
      size: def.size ?? 16,
      color: def.color,
      attackType: def.attackType,
      range: def.range ?? 0,
      xpDrop: def.xpDrop,
      special: def.special,
      armor: def.special?.startsWith('armor_') ? parseInt(def.special.split('_')[1]) : 0,
      attackCooldown: 0,
      hitFlash: 0,
      facingX: 0,
      facingY: 0,
    });
  }

  private _meleeAttack(
    player: Entity,
    wDef: WeaponDef,
    enemies: Entity[],
    _nearestDist: number,
    dmgMul: number,
  ): void {
    const px = player.x as number;
    const py = player.y as number;
    const count = wDef.projectileCount ?? 1;

    const targets: { enemy: Entity; dist: number }[] = [];
    for (const e of enemies) {
      if (!e.active || (e.hp as number) <= 0) continue;
      const dx = (e.x as number) - px;
      const dy = (e.y as number) - py;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist <= wDef.range) {
        targets.push({ enemy: e, dist });
      }
    }

    targets.sort((a, b) => a.dist - b.dist);
    const hitTargets = targets.slice(0, count);

    for (const target of hitTargets) {
      const isCrit = Math.random() * 100 < this.playerCritChance;
      const dmg = Math.round((isCrit ? wDef.damage * 2 : wDef.damage) * dmgMul);
      const currentHp = target.enemy.hp as number;
      target.enemy.hp = currentHp - dmg;
      target.enemy.hitFlash = 0.1;

      this.floatTexts.push({
        x: target.enemy.x as number,
        y: (target.enemy.y as number) - 20,
        text: isCrit ? `CRIT! ${dmg}` : `${dmg}`,
        color: isCrit ? '#ffd700' : '#ffffff',
        life: 0.8,
        maxLife: 0.8,
      });

      this.particles.emitPreset(target.enemy.x as number, target.enemy.y as number, 'HIT_SPARK');
      this.screenShake.trigger(2, 0.1);
      this.hitStop.trigger(0.03);

      // 击退
      const dx = (target.enemy.x as number) - px;
      const dy = (target.enemy.y as number) - py;
      const d = Math.sqrt(dx * dx + dy * dy) || 1;
      target.enemy.x = (target.enemy.x as number) + (dx / d) * 10;
      target.enemy.y = (target.enemy.y as number) + (dy / d) * 10;

      // 检查死亡
      if ((target.enemy.hp as number) <= 0) {
        target.enemy.active = false;
        this._onEnemyKilled(target.enemy.id, target.enemy.x as number, target.enemy.y as number, target.enemy.xpDrop as number ?? 5);
      }
    }
  }

  private _rangedAttack(
    player: Entity,
    wDef: WeaponDef,
    target: Entity,
    dmgMul: number,
  ): void {
    const px = player.x as number;
    const py = player.y as number;
    const tx = target.x as number;
    const ty = target.y as number;
    const count = wDef.projectileCount ?? 1;
    const speed = wDef.projectileSpeed ?? 300;

    for (let i = 0; i < count; i++) {
      let angle: number;
      if (count === 1) {
        angle = Math.atan2(ty - py, tx - px);
      } else {
        const baseAngle = Math.atan2(ty - py, tx - px);
        const spread = Math.PI / 6;
        const offset = count === 1 ? 0 : (i / (count - 1) - 0.5) * spread;
        angle = baseAngle + offset;
      }

      const isCrit = Math.random() * 100 < this.playerCritChance;
      const dmg = Math.round((isCrit ? wDef.damage * 2 : wDef.damage) * dmgMul);

      this.projectilePool.spawn({
        x: px,
        y: py,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        dmg,
        maxLife: wDef.range / speed + 0.5,
        pierce: wDef.pierce ?? 0,
        size: wDef.size ?? 4,
        color: wDef.color ?? '#ffffff',
        type: wDef.type === 'special' ? 'special' : 'bullet',
        owner: 'player',
      });
    }
  }

  private _updateProjectileCollisions(enemies: Entity[]): void {
    const projectiles = this.projectilePool.getActive();
    for (const proj of projectiles) {
      if (!proj.active || proj.owner !== 'player') continue;

      // 更新位置
      proj.x += proj.vx * (1 / 60);
      proj.y += proj.vy * (1 / 60);
      proj.life -= (1 / 60);

      if (proj.life <= 0) {
        proj.active = false;
        continue;
      }

      // 碰撞检测
      for (const enemy of enemies) {
        if (!enemy.active || (enemy.hp as number) <= 0) continue;
        const ex = enemy.x as number;
        const ey = enemy.y as number;
        const eSize = (enemy.size as number) ?? 16;

        const dx = proj.x - ex;
        const dy = proj.y - ey;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < eSize + proj.size) {
          let dmg = proj.dmg;
          const enemyArmor = (enemy.armor as number) ?? 0;
          dmg = Math.max(1, dmg - enemyArmor);

          enemy.hp = (enemy.hp as number) - dmg;
          enemy.hitFlash = 0.1;

          this.floatTexts.push({
            x: ex, y: ey - 20,
            text: `${dmg}`,
            color: '#ffffff',
            life: 0.8, maxLife: 0.8,
          });

          this.particles.emitPreset(proj.x, proj.y, 'HIT_SPARK');

          if (proj.pierce > 0) {
            proj.pierce--;
          } else {
            proj.active = false;
          }

          if ((enemy.hp as number) <= 0) {
            enemy.active = false;
            this._onEnemyKilled(enemy.id, ex, ey, (enemy.xpDrop as number) ?? 5);
          }

          if (!proj.active) break;
        }
      }
    }
  }

  private _onEnemyKilled(_enemyId: string, x: number, y: number, xpDrop: number): void {
    this.kills++;
    this.score += 10;
    this.waveSystem.onKill();

    // XP被动加成
    const charDef = this.allCharDefs.find(c => c.id === this.playerCharId);
    let xpAmount = xpDrop;
    if (charDef?.passive.effect === 'xp_boost_15') {
      xpAmount = Math.floor(xpAmount * 1.15);
    }

    // 掉落经验
    this.pickups.push({
      x: x + (Math.random() - 0.5) * 10,
      y: y + (Math.random() - 0.5) * 10,
      type: 'xp',
      value: xpAmount,
      life: 10,
      active: true,
    });

    // 概率掉血
    if (Math.random() < 0.1) {
      this.pickups.push({
        x: x + (Math.random() - 0.5) * 20,
        y: y + (Math.random() - 0.5) * 20,
        type: 'heal',
        value: 15,
        life: 10,
        active: true,
      });
    }

    this.particles.emitPreset(x, y, 'EXPLOSION');
    this.screenShake.trigger(3, 0.15);
  }

  private _onPlayerDamaged(damage: number): void {
    if (this.invincibleTimer > 0) return;

    const charDef = this.allCharDefs.find(c => c.id === this.playerCharId);
    let actualDmg = Math.max(1, damage - this.playerArmor);

    // 被动减伤
    if (charDef?.passive.effect === 'dmg_reduce_10') {
      actualDmg = Math.floor(actualDmg * 0.9);
    }

    this.playerHp -= actualDmg;
    this.damageFlashTimer = 0.3;
    this.invincibleTimer = 0.5;
    this.screenShake.trigger(5, 0.2);
    this.hitStop.trigger(0.05);
  }

  private _applyEnemyDamageToPlayer(damage: number): void {
    this._onPlayerDamaged(damage);
  }

  private _applyLevelUpOption(option: LevelUpOption): void {
    const ctx = this.levelUpSystem.getContext();

    // 同步属性到游戏
    this.playerMaxHp = ctx.stats.maxHp;
    this.playerSpeed = ctx.stats.speed;
    this.playerArmor = ctx.stats.armor;
    this.playerCritChance = ctx.stats.critChance;

    // 检查新武器
    if (option.type === 'weapon') {
      const weaponId = option.id.replace('weapon_', '');
      const wDef = getWeaponDef(weaponId);
      if (wDef && this.weaponDefs.length < 6) {
        this.weaponDefs.push(wDef);
        this.weaponCooldowns.push(0);
      }
    }

    // 升级时恢复少量HP
    this.playerHp = Math.min(this.playerHp + 20, this.playerMaxHp);
  }

  private _updatePickups(dt: number, player: Entity | undefined): void {
    if (!player) return;
    const px = player.x as number;
    const py = player.y as number;

    for (let i = this.pickups.length - 1; i >= 0; i--) {
      const p = this.pickups[i];
      if (!p.active) continue;

      p.life -= dt;
      if (p.life <= 0) {
        p.active = false;
        continue;
      }

      // 磁吸效果
      const dx = px - p.x;
      const dy = py - p.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < 80) {
        const pullSpeed = 250;
        p.x += (dx / dist) * pullSpeed * dt;
        p.y += (dy / dist) * pullSpeed * dt;
      }

      if (dist < 16) {
        p.active = false;
        if (p.type === 'xp') {
          const leveledUp = this.levelUpSystem.addXp(p.value);
          if (leveledUp) {
            this._phase = 'levelUp';
          }
        } else if (p.type === 'heal') {
          this.playerHp = Math.min(this.playerHp + p.value, this.playerMaxHp);
          this.floatTexts.push({
            x: px, y: py - 30,
            text: `+${p.value} HP`,
            color: '#00ff88',
            life: 0.8, maxLife: 0.8,
          });
        }
      }
    }

    // 清理
    this.pickups = this.pickups.filter(p => p.active);
  }

  private _updateFloatTexts(dt: number): void {
    for (let i = this.floatTexts.length - 1; i >= 0; i--) {
      const ft = this.floatTexts[i];
      ft.life -= dt;
      ft.y -= 40 * dt;
      if (ft.life <= 0) {
        this.floatTexts.splice(i, 1);
      }
    }
  }

  // ==================== 辅助 ====================

  onResize(): void {
    this._onResize();
  }

  private _onResize(): void {
    this.renderer.resize();
    this.camera.resize(this.renderer.width, this.renderer.height);
    this.bg.resize(this.renderer.width, this.renderer.height);
  }

  get phase(): GamePhase {
    return this._phase;
  }
}
