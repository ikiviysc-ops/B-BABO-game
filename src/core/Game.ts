/**
 * 游戏核心类 - 管理游戏生命周期
 * Phase 1B+: 虚拟摇杆 + 近战优化 + 投射物渲染优化
 */

import { GameLoop } from '@engine/GameLoop';
import { Renderer } from '@engine/Renderer';
import { Camera } from '@engine/Camera';
import { InputManager } from '@engine/InputManager';
import { VirtualJoystick } from '@engine/VirtualJoystick';
import { EntityManager, type Entity } from '@engine/EntityManager';
import { CharacterRegistry } from '@data/CharacterRegistry';
import { SpriteAnimator } from '@engine/SpriteAnimator';
import { renderPixelSprite } from '@engine/PixelRenderer';
import { HIRONO_BASE_SPRITE } from '@entities/BaboSprite';
import { PISTOL } from '@data/WeaponDefs';
import { MovementSystem } from '@systems/MovementSystem';
import { RenderSystem } from '@systems/RenderSystem';
import { EnemyAISystem } from '@systems/EnemyAISystem';
import { WaveSystem } from '@systems/WaveSystem';
import { warmupEnemySprites } from '@entities/EnemyFactory';
import { ProjectilePool } from '@engine/ProjectilePool';
import { ProjectileSystem } from '@systems/ProjectileSystem';
import { WeaponSystem, type MeleeHitEvent } from '@systems/WeaponSystem';
import { CombatSystem } from '@systems/CombatSystem';
import { LevelUpSystem, type LevelUpOption } from '@systems/LevelUpSystem';
import { ScreenShake } from '@engine/ScreenShake';
import { HitStop } from '@engine/HitStop';
import { ParticleSystem } from '@engine/ParticleSystem';
import { HUDRenderer } from '@ui/HUDRenderer';
import { LevelUpPanel } from '@ui/LevelUpPanel';
import { MainMenu } from '@ui/MainMenu';
import { GameOverScreen, type GameOverData } from '@ui/GameOverScreen';
import { CharacterSelectScreen } from '@ui/CharacterSelectScreen';
import { PostProcessingPipeline, VignetteOnly, BloomEffect } from '@engine/PostProcessing';
import { drawGlow, drawDamageNumber, spawnDeathEffect } from '@engine/VisualEnhancer';
import { applyExpression } from '@engine/ExpressionSystem';
import { audioManager } from '@engine/AudioManager';

export class Game {
  readonly canvas: HTMLCanvasElement;
  readonly renderer: Renderer;
  readonly camera: Camera;
  readonly input: InputManager;
  readonly entities: EntityManager;
  waves: WaveSystem;

  private loop: GameLoop;
  private movementSystem: MovementSystem;
  private renderSystem: RenderSystem;
  private enemyAI: EnemyAISystem;
  private weaponSystem: WeaponSystem;
  private projectileSystem: ProjectileSystem;
  private combatSystem: CombatSystem;
  private levelUpSystem: LevelUpSystem;
  private joystick: VirtualJoystick;
  private screenShake: ScreenShake;
  private hitStop: HitStop;
  private particles: ParticleSystem;
  private hudRenderer: HUDRenderer;
  private levelUpPanel: LevelUpPanel;
  private mainMenu: MainMenu;
  private gameOverScreen: GameOverScreen;
  private charSelectScreen: CharacterSelectScreen;

  private _running = false;

  /** 游戏阶段: menu / charSelect / playing / levelUp / gameOver */
    private _phase: 'menu' | 'charSelect' | 'playing' | 'gameOver' = 'menu';

    /** 角色切换 */
    private _charIds: string[];
    private _charIndex = 0;
    private _tabPressed = false;

    /** 玩家引用 */
    private _player: (Entity & { currentHp: number; maxHp: number }) | null = null;

    /** 角色动画器 */
  private _playerAnimator: SpriteAnimator | null = null;
  private _isMoving = false;

  /** 表情系统 */
  private _expressionTimer = 0;
  private _currentExpression: 'neutral' | 'happy' | 'angry' | 'scared' | 'hurt' = 'neutral';
  private _originalSprite: HTMLCanvasElement | null = null;

    /** 游戏状态 */
    private _gameOver = false;
    private _score = 0;

  /** 游戏经过时间（秒） */
  private _elapsedTime = 0;

  /** 投射物池 */
  private readonly _projPool: ProjectilePool;

  /** 近战挥砍特效 */
  private _meleeEffects: { x: number; y: number; angle: number; range: number; age: number; lifetime: number; weaponId: string }[] = [];
  private _reuseEnemies: { x: number; y: number; active: boolean }[] = [];
  private _postProcess: PostProcessingPipeline;
  private _bloom: BloomEffect;
  private _bloomTimer = 0;

  private _floatingTexts: { x: number; y: number; text: string; color: string; age: number; lifetime: number; isCrit: boolean }[] = [];

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.renderer = new Renderer(canvas);
    this.camera = new Camera(canvas.width, canvas.height);
    this.input = new InputManager(canvas);
    this.entities = new EntityManager();
    this.waves = new WaveSystem();
    this.joystick = new VirtualJoystick(canvas);

    // 投射物池
    this._projPool = new ProjectilePool(300);

    // 系统
    this.movementSystem = new MovementSystem(this.input, this.joystick);
    this.renderSystem = new RenderSystem(this.renderer, this.camera);
    this.enemyAI = new EnemyAISystem();
    this.weaponSystem = new WeaponSystem({ pool: this._projPool });
    this.projectileSystem = new ProjectileSystem(this._projPool, {
      bounds: { left: -2000, top: -2000, right: 2000, bottom: 2000 },
    });
    this.combatSystem = new CombatSystem(this._projPool);
    this.levelUpSystem = new LevelUpSystem();

    // VFX系统
    this.screenShake = new ScreenShake();
    this.hitStop = new HitStop();
    this.particles = new ParticleSystem(500);

    // UI系统
    const dpr = window.devicePixelRatio || 1;
    this.hudRenderer = new HUDRenderer(this.renderer.ctx, dpr);
    this.levelUpPanel = new LevelUpPanel(this.renderer.ctx, dpr);
    this.mainMenu = new MainMenu(this.renderer.ctx, dpr);
    this.gameOverScreen = new GameOverScreen(this.renderer.ctx, dpr);
    this.charSelectScreen = new CharacterSelectScreen(this.renderer.ctx, dpr);

    // 近战回调 — 直接造成伤害 + 击退
    this.weaponSystem.onMeleeHit((evt: MeleeHitEvent) => {
      const enemy = this.entities.get(evt.enemyId);
      if (!enemy || !('currentHp' in enemy)) return;
      const ed = enemy as Entity & { currentHp: number; maxHp: number; enemyId: string };

      ed.currentHp -= evt.damage;

      // 击退
      if (evt.knockback > 0 && this._player) {
        const dx = enemy.x - this._player.x;
        const dy = enemy.y - this._player.y;
        const dist = Math.sqrt(dx * dx + dy * dy) || 1;
        enemy.x += (dx / dist) * evt.knockback;
        enemy.y += (dy / dist) * evt.knockback;
      }

      // 浮动伤害
      const isCrit = Math.random() < 0.15;
      this._floatingTexts.push({
        x: enemy.x,
        y: enemy.y - enemy.height / 2 - 5,
        text: Math.round(evt.damage).toString(),
        color: isCrit ? '#ffd700' : '#ffffff',
        age: 0,
        lifetime: 1.0,
        isCrit,
      });

      // 命中停顿（轻攻击）
      this.hitStop.trigger(0.04);
      // 受击表情
      this._currentExpression = 'hurt';
      this._expressionTimer = 0.3;
      audioManager.playSfx('hit');
      this._bloomTimer = 0.3;
      // 命中粒子
      this.particles.emitPreset('HIT_SPARK', enemy.x, enemy.y - enemy.height / 2, evt.angle);

      // 挥砍特效
      if (this._player) {
        this._meleeEffects.push({
          x: this._player.x + Math.cos(evt.angle) * evt.range * 0.5,
          y: this._player.y + Math.sin(evt.angle) * evt.range * 0.5,
          angle: evt.angle,
          range: evt.range,
          age: 0,
          lifetime: 0.15,
          weaponId: evt.weaponId,
        });
      }

      // 检查死亡
      if (ed.currentHp <= 0) {
        enemy.active = false;
        // 死亡粒子
        spawnDeathEffect(this.particles, enemy.x, enemy.y, '#ff4444');
        // 屏幕震动
        this.screenShake.trigger(3, 0.15, 40);
        audioManager.playSfx('kill');
        this._bloomTimer = 0.5;
        const xp = this.combatSystem.getEnemyXpDrop(ed.enemyId);
        this._score += xp;
        this.waves.onKill();
        const leveled = this.levelUpSystem.addXp(xp);
        if (leveled && this._player) {
          audioManager.playSfx('levelup');
          this._currentExpression = 'happy';
          this._expressionTimer = 1.0;
          this._player.currentHp = Math.min(
            this._player.currentHp + 20,
            this._player.maxHp + this.levelUpSystem.bonusMaxHp,
          );
        }
      }
    });

    // 投射物击杀回调
    this.combatSystem.setCallbacks({
      onDamage: () => {},
      onKill: (_id, _x, _y, xp) => {
        audioManager.playSfx('kill');
        this._score += xp;
        this.waves.onKill();
        const leveled = this.levelUpSystem.addXp(xp);
        if (leveled && this._player) {
          audioManager.playSfx('levelup');
          this._player.currentHp = Math.min(
            this._player.currentHp + 20,
            this._player.maxHp + this.levelUpSystem.bonusMaxHp,
          );
        }
      },
    });

    // 后处理效果链
    this._postProcess = new PostProcessingPipeline(canvas.width, canvas.height);
    this._postProcess.add(new VignetteOnly(canvas.width, canvas.height));
    this._bloom = new BloomEffect(canvas.width, canvas.height);
    this._bloom.threshold = 0.7;
    this._bloom.blur = 6;
    this._bloom.intensity = 0.4;

    this.loop = new GameLoop(60, this.update.bind(this), this.render.bind(this));

    this._charIds = CharacterRegistry.getAllDefs().map(d => d.id);

    this.handleResize();
    window.addEventListener('resize', () => this.handleResize());
  }

  start(): void {
    if (this._running) return;
    this._running = true;
    this.spawnCharacter(this._charIds[0]);
    warmupEnemySprites();
    console.log(`[B-BABO] Game started! ${CharacterRegistry.totalCharacters} characters.`);
    console.log('[B-BABO] WASD/摇杆移动, TAB切换, SPACE/点击中央开始.');
    audioManager.init();
    audioManager.playMusic('battle', 1000);
    this.loop.start();
  }

  private spawnCharacter(charId: string): void {
    for (const e of this.entities.getAll()) this.entities.remove(e.id);
    const player = CharacterRegistry.createEntity(charId, 3) as Entity & { currentHp: number; maxHp: number };
    const def = CharacterRegistry.getDef(charId);
    player.currentHp = def?.stats.hp ?? 100;
    player.maxHp = player.currentHp;
    this._player = player;
    this._originalSprite = this._player.sprite;
    this.entities.add(player);
    this.camera.setTarget(player);

    // 初始化角色动画器
    this._playerAnimator = new SpriteAnimator();
    const baseSprite = player.sprite;
    // Idle动画：2帧，微弱呼吸（通过Y偏移模拟）
    const idleCanvas2 = document.createElement('canvas');
    idleCanvas2.width = baseSprite.width;
    idleCanvas2.height = baseSprite.height;
    const idleCtx2 = idleCanvas2.getContext('2d')!;
    idleCtx2.drawImage(baseSprite, 0, 1); // 下移1px
    this._playerAnimator.addState({
      name: 'idle',
      frames: [
        { sprite: baseSprite, duration: 600 },
        { sprite: idleCanvas2, duration: 600 },
      ],
      loop: true,
    });

    // Walk动画：4帧，身体微弹跳
    const walkFrames: HTMLCanvasElement[] = [];
    const offsets = [0, -1, 0, 1];
    for (const offsetY of offsets) {
      const wc = document.createElement('canvas');
      wc.width = baseSprite.width;
      wc.height = baseSprite.height;
      const wctx = wc.getContext('2d')!;
      wctx.drawImage(baseSprite, 0, offsetY);
      walkFrames.push(wc);
    }
    this._playerAnimator.addState({
      name: 'walk',
      frames: walkFrames.map(s => ({ sprite: s, duration: 120 })),
      loop: true,
    });

    this._playerAnimator.play('idle');
  }

  private update(dt: number): void {
    this.input.update();

    // === 主菜单阶段 ===
    if (this._phase === 'menu') {
      this.mainMenu.update(dt * 1000);
      if (this.input.consumeTap()) {
        const action = this.mainMenu.hitTest(this.input.touchX, this.input.touchY, this.canvas.width, this.canvas.height);
        if (action === 'start') {
          this._phase = 'charSelect';
          this.charSelectScreen.reset();
        }
      }
      return;
    }

    // === 角色选择阶段 ===
    if (this._phase === 'charSelect') {
      this.charSelectScreen.update(dt * 1000);

      // 空格键/回车/数字1确认选择（调试用）
      if (this.input.isKeyDown(' ') || this.input.isKeyDown('enter') || this.input.isKeyDown('1')) {
        this._phase = 'playing';
        this.waves.startNextWave();
        this.weaponSystem.equip(PISTOL);
        return;
      }

      if (this.input.consumeTap()) {
        const action = this.charSelectScreen.hitTest(this.input.touchX, this.input.touchY, this.canvas.width, this.canvas.height);
        if (action === 'prev') {
          this._charIndex = (this._charIndex - 1 + this._charIds.length) % this._charIds.length;
          this.spawnCharacter(this._charIds[this._charIndex]);
          this.charSelectScreen.triggerSlide(-1);
        } else if (action === 'next') {
          this._charIndex = (this._charIndex + 1) % this._charIds.length;
          this.spawnCharacter(this._charIds[this._charIndex]);
          this.charSelectScreen.triggerSlide(1);
        } else if (action === 'confirm') {
          this._phase = 'playing';
          this.waves.startNextWave();
          this.weaponSystem.equip(PISTOL);
        } else if (action === 'back') {
          this._phase = 'menu';
          this.mainMenu.reset();
        }
      }
      // 键盘支持
      if (this.input.isKeyDown('tab') && !this._tabPressed) {
        this._tabPressed = true;
        this._charIndex = (this._charIndex + 1) % this._charIds.length;
        this.spawnCharacter(this._charIds[this._charIndex]);
        this.charSelectScreen.triggerSlide(1);
      }
      if (!this.input.isKeyDown('tab')) this._tabPressed = false;
      return;
    }

    // === Game Over 阶段 ===
    if (this._phase === 'gameOver') {
      this.gameOverScreen.update(dt * 1000);
      if (this.input.consumeTap()) {
        const action = this.gameOverScreen.hitTest(this.input.touchX, this.input.touchY, this.canvas.width, this.canvas.height);
        if (action === 'restart') {
          this.restartGame();
        } else if (action === 'menu') {
          this._phase = 'menu';
          this.mainMenu.reset();
        }
      }
      return;
    }

    // 命中停顿 — 跳过逻辑更新
    if (this.hitStop.update(dt)) {
      return;
    }

    // === 升级选择状态 ===
    if (this.levelUpSystem.pendingLevelUp) {
      this.levelUpPanel.show();
      this.handleLevelUpInput();
      return;
    }

    if (this._gameOver) {
      this.enterGameOver();
      return;
    }

    // === 游戏进行中 ===

    // 移动玩家（键盘 + 虚拟摇杆）
    this.movementSystem.update(this.entities, dt);

    // 更新角色动画
    if (this._playerAnimator && this._player) {
      const joy = this.joystick.getAxis();
      const key = this.input.getMovementAxis();
      const moving = (joy.x !== 0 || joy.y !== 0) || (key.x !== 0 || key.y !== 0);
      if (moving && !this._isMoving) {
        this._playerAnimator.play('walk');
        this._isMoving = true;
      } else if (!moving && this._isMoving) {
        this._playerAnimator.play('idle');
        this._isMoving = false;
      }
      this._playerAnimator.update(dt);
      // 用动画帧替换玩家精灵
      const frame = this._playerAnimator.getCurrentFrame();
      if (frame) {
        this._player.sprite = frame.sprite;
      }
    }

    // 更新表情
    if (this._expressionTimer > 0) {
      this._expressionTimer -= dt;
      if (this._expressionTimer <= 0) {
        this._currentExpression = 'neutral';
        this._expressionTimer = 0;
      }
    }
    // 应用表情到玩家精灵
    if (this._player && this._currentExpression !== 'neutral') {
      const charId = this._charIds[this._charIndex];
      const charSprite = CharacterRegistry.getSprite(charId);
      if (charSprite) {
        const modifiedPixels = applyExpression(HIRONO_BASE_SPRITE.pixels, this._currentExpression);
        this._player.sprite = renderPixelSprite(
          { width: 32, height: 32, pixels: modifiedPixels },
          charSprite.palette,
          3.5,
        );
      }
    } else if (this._player && this._currentExpression === 'neutral') {
      // 恢复动画帧
      const frame = this._playerAnimator?.getCurrentFrame();
      if (frame) {
        this._player.sprite = frame.sprite;
      } else if (this._originalSprite) {
        this._player.sprite = this._originalSprite;
      }
    }

    // 敌人 AI
    if (this._player) {
      this.enemyAI.update(this.entities, this._player.x, this._player.y, dt);
    }

    // 找最近敌人
    this.updateNearestEnemy();

    // 武器自动攻击（近战范围检测 + 远程投射物）
    if (this._player) {
      this.weaponSystem.update(dt, this._player.x, this._player.y, this.entities);
    }

    // 投射物更新（复用数组，避免每帧GC）
    this._reuseEnemies.length = 0;
    for (const e of this.entities.getAll()) {
      if ('enemyId' in e) {
        this._reuseEnemies.push({ x: e.x, y: e.y, active: e.active });
      }
    }
    this.projectileSystem.setEnemies(this._reuseEnemies);
    this.projectileSystem.update(dt);

    // 碰撞检测（投射物 vs 敌人）
    this.combatSystem.update(dt, this.entities);

    // 波次系统
    this.waves.update(dt, this.entities, this._player?.x ?? 500, this._player?.y ?? 500);

    // 自动推进下一波
    if (this.waves.waveComplete) {
      this.waves.startNextWave();
    }

    // 玩家 vs 敌人碰撞
    if (this._player) {
      this.checkPlayerEnemyCollision();
    }

    // 更新近战特效
    for (let i = this._meleeEffects.length - 1; i >= 0; i--) {
      this._meleeEffects[i].age += dt;
      if (this._meleeEffects[i].age >= this._meleeEffects[i].lifetime) {
        this._meleeEffects.splice(i, 1);
      }
    }

    // 清理死亡实体
    this.entities.cleanup();

    // VFX更新
    this.screenShake.update(dt);
    this.particles.update(dt * 1000);
    this.levelUpPanel.update(dt * 1000);

    // 追踪游戏时间
    this._elapsedTime += dt;

    // 更新浮动伤害数字
    for (let i = this._floatingTexts.length - 1; i >= 0; i--) {
      this._floatingTexts[i].age += dt;
      this._floatingTexts[i].y -= 40 * dt;
      if (this._floatingTexts[i].age >= this._floatingTexts[i].lifetime) {
        this._floatingTexts.splice(i, 1);
      }
    }

    if (this._bloomTimer > 0) this._bloomTimer -= dt;
  }

  private updateNearestEnemy(): void {
    if (!this._player) return;
    let nearestDist = Infinity;
    let nearestX = 0, nearestY = 0;
    let hasTarget = false;

    for (const e of this.entities.getAll()) {
      if (!('enemyId' in e)) continue;
      const dx = e.x - this._player.x;
      const dy = e.y - this._player.y;
      const dist = dx * dx + dy * dy;
      if (dist < nearestDist) {
        nearestDist = dist;
        nearestX = e.x;
        nearestY = e.y;
        hasTarget = true;
      }
    }

    this.weaponSystem.setNearestEnemy(nearestX, nearestY, hasTarget);
  }

  private handleLevelUpInput(): void {
    const options = [...this.levelUpSystem.options];
    // 键盘选择
    for (let i = 0; i < options.length; i++) {
      if (this.input.isKeyDown(`${i + 1}`)) {
        this.applyLevelUpChoice(i);
        return;
      }
    }
    // 触摸/点击选择 — 使用新面板的hitTest
    if (this.input.consumeTap()) {
      const idx = this.levelUpPanel.hitTest(
        this.input.touchX, this.input.touchY,
        options, this.canvas.width, this.canvas.height,
      );
      if (idx >= 0) {
        this.applyLevelUpChoice(idx);
      }
    }
  }

  private applyLevelUpChoice(index: number): void {
    const option = this.levelUpSystem.selectOption(index);
    if (!option) return;

    if (option.type === 'new_weapon' && '_weaponDef' in option) {
      const weaponDef = (option as LevelUpOption & { _weaponDef: import('@data/WeaponDefs').WeaponDef })._weaponDef;
      this.weaponSystem.equip(weaponDef);
    }

    if (this._player && this.levelUpSystem.bonusMaxHp > 0) {
      this._player.maxHp = (CharacterRegistry.getDef(this._charIds[this._charIndex])?.stats.hp ?? 100) + this.levelUpSystem.bonusMaxHp;
    }
    if (this._player && this.levelUpSystem.bonusSpeed > 0) {
      const baseSpeed = CharacterRegistry.getDef(this._charIds[this._charIndex])?.stats.speed ?? 200;
      this._player.speed = baseSpeed * (1 + this.levelUpSystem.bonusSpeed / 100);
    }

    console.log(`[B-BABO] Lv.${this.levelUpSystem.level} — 选择: ${option.name}`);

    // 隐藏升级面板，恢复游戏
    this.levelUpPanel.hide();

    // 升级粒子特效
    if (this._player) {
      this.particles.emitPreset('LEVEL_UP', this._player.x, this._player.y);
    }
  }

  private checkPlayerEnemyCollision(): void {
    if (!this._player) return;
    const px = this._player.x - this._player.width / 2;
    const py = this._player.y - this._player.height / 2;
    const pw = this._player.width;
    const ph = this._player.height;

    for (const entity of this.entities.getAll()) {
      if (!('enemyId' in entity)) continue;
      if (!('currentHp' in entity)) continue;

      const ex = entity.x - entity.width / 2;
      const ey = entity.y - entity.height / 2;
      const ew = entity.width;
      const eh = entity.height;

      if (px < ex + ew && px + pw > ex && py < ey + eh && py + ph > ey) {
        if (this._player.currentHp !== undefined) {
          this._player.currentHp -= 1;
          if (this._player.currentHp <= 0) {
            this._gameOver = true;
          }
        }
        const dx = entity.x - this._player.x;
        const dy = entity.y - this._player.y;
        const dist = Math.sqrt(dx * dx + dy * dy) || 1;
        entity.x += (dx / dist) * 20;
        entity.y += (dy / dist) * 20;
      }
    }
  }

  /** 进入 Game Over 阶段 */
  private enterGameOver(): void {
    this._phase = 'gameOver';
    audioManager.playSfx('gameover');
    audioManager.stopMusic(1000);
    this.gameOverScreen.reset();
    console.log(`[B-BABO] Game Over! Score: ${this._score}, Wave: ${this.waves.currentWave}`);
  }

  /** 重新开始游戏 */
  private restartGame(): void {
    // 清理所有实体
    for (const e of this.entities.getAll()) this.entities.remove(e.id);
    // 重置系统
    this.levelUpSystem = new LevelUpSystem();
    this.waves = new WaveSystem();
    this._score = 0;
    this._elapsedTime = 0;
    this._gameOver = false;
    this._meleeEffects = [];
    this.particles = new ParticleSystem(500);
    // 重新生成角色
    this.spawnCharacter(this._charIds[this._charIndex]);
    this._player = null;
    const player = CharacterRegistry.createEntity(this._charIds[this._charIndex], 3) as Entity & { currentHp: number; maxHp: number };
    const def = CharacterRegistry.getDef(this._charIds[this._charIndex]);
    player.currentHp = def?.stats.hp ?? 100;
    player.maxHp = player.currentHp;
    this._player = player;
    this.entities.add(player);
    this.camera.setTarget(player);
    // 进入角色选择
    this._phase = 'charSelect';
    this.charSelectScreen.reset();
  }

  private render(): void {
    this.camera.update();

    // === 强制重置Canvas状态（防止context污染导致画面消失）===
    const ctx = this.renderer.ctx;
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = 1;
    ctx.imageSmoothingEnabled = false;
    // === 重置结束 ===

    this.renderer.clear();

    const dpr = window.devicePixelRatio || 1;
    const screenW = this.canvas.width;
    const screenH = this.canvas.height;

    // FPS 显示（左下角）
    ctx.save();
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.font = `bold ${12 * dpr}px monospace`;
    ctx.textAlign = 'left';
    ctx.fillStyle = this.loop.fps < 30 ? '#ff4444' : '#44ff44';
    ctx.fillText(`FPS: ${this.loop.fps}`, 8 * dpr, screenH - 8 * dpr);
    ctx.restore();

    // === 主菜单 ===
    if (this._phase === 'menu') {
      this.mainMenu.render(this.renderer.ctx, screenW, screenH);
      return;
    }

    // === 角色选择 ===
    if (this._phase === 'charSelect') {
      // 绘制背景
      this.renderSystem.update(this.entities);
      // 绘制角色选择界面
      const charId = this._charIds[this._charIndex];
      const def = CharacterRegistry.getDef(charId);
      const sprite = CharacterRegistry.getSprite(charId);
      if (def && sprite) {
        this.charSelectScreen.render(this.renderer.ctx, def, sprite, screenW, screenH);
      }
      return;
    }

    // === 游戏中 / Game Over ===
    this.renderSystem.update(this.entities);

    // 渲染投射物
    this.renderProjectiles();

    // 渲染近战挥砍特效
    this.renderMeleeEffects();

    // 渲染浮动伤害数字（增强版）
    for (const ft of this._floatingTexts) {
      drawDamageNumber(this.renderer.ctx, ft.x - this.camera.x, ft.y - this.camera.y, parseInt(ft.text) || 0, ft.isCrit, ft.age, ft.lifetime);
    }

    // 渲染粒子（世界坐标）
    this.particles.draw(this.renderer.ctx, this.camera.x, this.camera.y);

    // 投射物辉光
    const camX = this.camera.x;
    const camY = this.camera.y;
    const activeProj = this._projPool.getActive();
    for (const p of activeProj) {
      if (p.active && p.type !== 'melee_arc') {
        drawGlow(
          this.renderer.ctx,
          p.x - camX, p.y - camY,
          p.width * 1.5,
          p.element === 'fire' ? 'rgba(255,100,0,0.3)' :
          p.element === 'ice' ? 'rgba(100,200,255,0.3)' :
          p.element === 'thunder' ? 'rgba(255,255,100,0.3)' :
          'rgba(255,255,255,0.2)',
        );
      }
    }

    // 虚拟摇杆
    this.joystick.render(this.renderer.ctx, dpr);

    // HUD
    // 屏幕震动偏移
    const shake = this.screenShake.getOffset();
    if (shake.x !== 0 || shake.y !== 0) {
      this.renderer.ctx.save();
      this.renderer.ctx.translate(Math.round(shake.x * dpr), Math.round(shake.y * dpr));
    }

    const weapons = this.weaponSystem.weapons.map(w => ({
      id: w.def.id,
      level: w.level,
      maxLevel: 8,
    }));

    this.hudRenderer.render(this.renderer.ctx, {
      wave: this.waves.currentWave,
      score: this._score,
      kills: this.waves.totalKills,
      hp: this._player?.currentHp ?? 0,
      maxHp: this._player?.maxHp ?? 100,
      xp: this.levelUpSystem.xp,
      xpToNext: this.levelUpSystem.xpToNext,
      level: this.levelUpSystem.level,
      elapsedTime: this._elapsedTime,
      weapons,
    }, screenW, screenH);

    // 角色跟随血条
    if (this._player) {
      this.hudRenderer.renderPlayerHP(
        this.renderer.ctx, this._player.x, this._player.y,
        this._player.currentHp, this._player.maxHp,
        this.camera.x, this.camera.y,
      );
    }

    if (shake.x !== 0 || shake.y !== 0) {
      this.renderer.ctx.restore();
    }

    // === Game Over 界面 ===
    if (this._phase === 'gameOver') {
      const gameOverData: GameOverData = {
        survivalTime: this._elapsedTime,
        totalKills: this.waves.totalKills,
        score: this._score,
        level: this.levelUpSystem.level,
        wave: this.waves.currentWave,
        weapons: this.weaponSystem.weapons.map(w => ({
          id: w.def.id,
          name: w.def.name,
          level: w.level,
        })),
      };
      this.gameOverScreen.render(this.renderer.ctx, gameOverData, screenW, screenH);
    }

    // === 升级选择面板 ===
    if (this.levelUpSystem.pendingLevelUp) {
      this.levelUpPanel.render(
        this.renderer.ctx,
        [...this.levelUpSystem.options],
        this.levelUpSystem.level,
        screenW,
        screenH,
      );
    }

    // 后处理效果（暂时禁用，性能优化后重新启用）
    // TODO: 使用CSS filter替代Canvas后处理
    // if (this._phase === 'playing' || this._phase === 'gameOver') {
    //   if (this._bloomTimer > 0) {
    //     this._postProcess.add(this._bloom);
    //   }
    //   this._postProcess.process(this.renderer.ctx, screenW, screenH);
    //   if (this._bloomTimer > 0) {
    //     this._postProcess.remove(this._bloom);
    //     this._bloomTimer -= 1 / 60;
    //   }
    // }
  }

  /** 渲染投射物 — 15种武器全部独立特效 */
  private renderProjectiles(): void {
    const ctx = this.renderer.ctx;
    const projectiles = this._projPool.getActive();
    const now = performance.now() / 1000;

    ctx.save();
    ctx.imageSmoothingEnabled = false;
    ctx.translate(-Math.round(this.camera.x), -Math.round(this.camera.y));

    for (const proj of projectiles) {
      if (!proj.active) continue;

      if (proj.x + 50 < this.camera.x || proj.x - 50 > this.camera.x + this.camera.width ||
          proj.y + 50 < this.camera.y || proj.y - 50 > this.camera.y + this.camera.height) {
        continue;
      }

      const wid = proj.weaponId;
      const angle = Math.atan2(proj.vy, proj.vx);

      if (proj.type === 'explosion') {
        // === 像素风爆炸 ===
        const progress = proj.age / proj.lifetime;
        const alpha = Math.max(0, 1 - progress);
        const r = Math.max(2, proj.width / 3 * (0.5 + progress * 0.8));
        const isFire = wid === 'meteor_staff' || wid === 'rocket_launcher';
        // 方块扩散
        ctx.globalAlpha = alpha * 0.5;
        const color1 = isFire ? '#ff6622' : '#88aaff';
        const color2 = isFire ? '#ffcc44' : '#aaccff';
        const size = Math.max(2, Math.round(r / 3));
        for (let i = 0; i < 8; i++) {
          const pa = (i / 8) * Math.PI * 2 + progress * 2;
          const pr = r * (0.5 + progress * 0.5);
          const px = Math.round(proj.x + Math.cos(pa) * pr);
          const py = Math.round(proj.y + Math.sin(pa) * pr);
          ctx.fillStyle = i % 2 === 0 ? color1 : color2;
          ctx.fillRect(px - size / 2, py - size / 2, size, size);
        }
        // 中心
        ctx.globalAlpha = alpha * 0.3;
        ctx.fillStyle = color2;
        const cs = Math.max(2, Math.round(r * 0.4));
        ctx.fillRect(Math.round(proj.x) - cs / 2, Math.round(proj.y) - cs / 2, cs, cs);
        ctx.globalAlpha = 1;

      } else if (wid === 'pistol') {
        // 🔫 手枪 — 矩形子弹 + 短尾焰
        ctx.save();
        ctx.translate(proj.x, proj.y);
        ctx.rotate(angle);
        // 尾焰
        ctx.globalAlpha = 0.3;
        ctx.fillStyle = '#ff9933';
        ctx.fillRect(-10, -2, 6, 4);
        // 弹壳
        ctx.globalAlpha = 1;
        ctx.fillStyle = '#ddaa44';
        ctx.fillRect(-4, -2, 8, 4);
        // 弹头
        ctx.fillStyle = '#ffee88';
        ctx.fillRect(4, -1.5, 4, 3);
        ctx.restore();

      } else if (wid === 'shotgun') {
        // 💥 霰弹枪 — 多颗小方形弹丸
        ctx.save();
        ctx.translate(proj.x, proj.y);
        ctx.rotate(angle);
        // 散弹
        ctx.fillStyle = '#ffaa44';
        ctx.fillRect(-3, -2, 6, 4);
        ctx.fillStyle = '#ff8822';
        ctx.fillRect(-2, -1, 4, 2);
        ctx.restore();

      } else if (wid === 'sniper_rifle') {
        // 🎯 狙击步枪 — 细长蓝色穿透弹
        ctx.save();
        ctx.translate(proj.x, proj.y);
        ctx.rotate(angle);
        // 弹体
        ctx.fillStyle = '#88bbff';
        ctx.fillRect(-14, -1.5, 28, 3);
        // 弹头
        ctx.fillStyle = '#ccddff';
        ctx.fillRect(14, -2, 6, 4);
        ctx.restore();

      } else if (wid === 'long_bow') {
        // 🏹 长弓 — 矩形箭矢
        ctx.save();
        ctx.translate(proj.x, proj.y);
        ctx.rotate(angle);
        // 箭杆
        ctx.fillStyle = '#ccddaa';
        ctx.fillRect(-16, -1, 28, 2);
        // 箭头
        ctx.fillStyle = '#eeffcc';
        ctx.fillRect(12, -3, 6, 6);
        // 箭羽
        ctx.fillStyle = '#88aa66';
        ctx.fillRect(-16, -3, 4, 2);
        ctx.fillRect(-16, 1, 4, 2);
        ctx.restore();

      } else if (wid === 'magic_staff') {
        // 🔮 魔法杖 — 像素方块组成的旋转光球
        const t = proj.age * 8;
        // 核心
        ctx.fillStyle = '#dd99ff';
        ctx.fillRect(proj.x - 4, proj.y - 4, 8, 8);
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(proj.x - 2, proj.y - 2, 4, 4);
        // 旋转像素粒子
        for (let p = 0; p < 4; p++) {
          const pa = t + (p * Math.PI / 2);
          const pr = 10;
          const px = Math.round(proj.x + Math.cos(pa) * pr);
          const py = Math.round(proj.y + Math.sin(pa) * pr);
          ctx.fillStyle = '#bb77ee';
          ctx.fillRect(px - 2, py - 2, 4, 4);
        }

      } else if (wid === 'meteor_staff') {
        // 🌋 陨石法杖 — 像素陨石 + 方块火焰尾迹
        const t = proj.age * 6;
        // 火焰尾迹（方块）
        for (let i = 1; i <= 3; i++) {
          const tx = proj.x - Math.cos(angle) * i * 10;
          const ty = proj.y - Math.sin(angle) * i * 10;
          ctx.globalAlpha = 0.4 - i * 0.1;
          ctx.fillStyle = '#ff6622';
          ctx.fillRect(tx - 4, ty - 4, 8, 8);
          ctx.fillStyle = '#ffaa44';
          ctx.fillRect(tx - 2, ty - 2, 4, 4);
        }
        ctx.globalAlpha = 1;
        // 陨石核心
        ctx.fillStyle = '#ff6622';
        ctx.fillRect(proj.x - 6, proj.y - 6, 12, 12);
        ctx.fillStyle = '#ff8844';
        ctx.fillRect(proj.x - 4, proj.y - 4, 8, 8);
        ctx.fillStyle = '#ffdd88';
        ctx.fillRect(proj.x - 2, proj.y - 2, 4, 4);
        // 飞散火星
        for (let p = 0; p < 4; p++) {
          const pa = t * 1.5 + (p * Math.PI / 2);
          const pr = 10 + Math.sin(t * 3 + p) * 3;
          ctx.fillStyle = '#ffaa33';
          const fx = Math.round(proj.x + Math.cos(pa) * pr);
          const fy = Math.round(proj.y + Math.sin(pa) * pr);
          ctx.fillRect(fx - 1, fy - 1, 3, 3);
        }

      } else if (wid === 'rocket_launcher') {
        // 🚀 火箭筒 — 红色导弹 + 多层火焰尾迹
        ctx.save();
        ctx.translate(proj.x, proj.y);
        ctx.rotate(angle);
        for (let i = 0; i < 4; i++) {
          const flicker = Math.sin(now * 30 + i * 2) * 4;
          ctx.globalAlpha = 0.4 - i * 0.08;
          ctx.fillStyle = i < 2 ? '#ff8833' : '#ffcc44';
          ctx.beginPath();
          ctx.moveTo(-12, -4 + i);
          ctx.lineTo(-22 - i * 6 + flicker, 0);
          ctx.lineTo(-12, 4 - i);
          ctx.fill();
        }
        ctx.globalAlpha = 1;
        ctx.fillStyle = '#cc4422';
        ctx.fillRect(-12, -5, 24, 10);
        ctx.fillStyle = '#ff8855';
        ctx.beginPath(); ctx.moveTo(12, -7); ctx.lineTo(22, 0); ctx.lineTo(12, 7); ctx.fill();
        ctx.fillStyle = '#aa3322';
        ctx.fillRect(-4, -5, 3, 10);
        ctx.restore();
        ctx.globalAlpha = 0.12;
        ctx.fillStyle = '#ff6622';
        ctx.beginPath(); ctx.arc(proj.x, proj.y, 18, 0, Math.PI * 2); ctx.fill();
        ctx.globalAlpha = 1;

      } else if (wid === 'homing_missile') {
        // 🔵 追踪导弹 — 像素导弹 + 方块尾迹
        for (let i = 1; i <= 3; i++) {
          const tx = proj.x - Math.cos(angle) * i * 8;
          const ty = proj.y - Math.sin(angle) * i * 8;
          ctx.globalAlpha = 0.3 - i * 0.08;
          ctx.fillStyle = '#6688ff';
          ctx.fillRect(tx - 3, ty - 3, 6, 6);
        }
        ctx.globalAlpha = 1;
        ctx.save();
        ctx.translate(proj.x, proj.y);
        ctx.rotate(angle);
        ctx.fillStyle = '#5577cc';
        ctx.fillRect(-10, -4, 20, 8);
        ctx.fillStyle = '#88aaff';
        ctx.fillRect(10, -5, 6, 10);
        ctx.fillStyle = 'rgba(150,180,255,0.4)';
        ctx.fillRect(-8, -4, 16, 2);
        ctx.restore();

      } else if (wid === 'nature_seed') {
        // 🌿 自然之种 — 像素种子 + 方块叶片
        const t = proj.age * 4;
        ctx.fillStyle = '#66cc44';
        ctx.fillRect(proj.x - 4, proj.y - 4, 8, 8);
        ctx.fillStyle = '#aaff88';
        ctx.fillRect(proj.x - 2, proj.y - 2, 4, 4);
        for (let p = 0; p < 3; p++) {
          const pa = t + (p * Math.PI * 2 / 3);
          const pr = 8;
          const px = Math.round(proj.x + Math.cos(pa) * pr);
          const py = Math.round(proj.y + Math.sin(pa) * pr);
          ctx.fillStyle = '#44aa22';
          ctx.fillRect(px - 2, py - 2, 4, 4);
        }

      } else if (wid === 'soul_scythe') {
        // 💀 灵魂之镰 — 像素弧形镰刀
        ctx.save();
        ctx.translate(proj.x, proj.y);
        ctx.rotate(angle + Math.sin(proj.age * 6) * 0.3);
        // 镰刃
        ctx.fillStyle = '#44ff88';
        ctx.fillRect(-2, -8, 4, 16);
        ctx.fillRect(2, -10, 8, 4);
        ctx.fillRect(6, -8, 4, 4);
        ctx.fillRect(8, -4, 4, 4);
        // 柄
        ctx.fillStyle = '#22aa66';
        ctx.fillRect(-2, 0, 3, 12);
        ctx.restore();

      } else {
        // 默认像素弹丸
        ctx.fillStyle = '#ffdd66';
        ctx.fillRect(proj.x - 3, proj.y - 3, 6, 6);
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(proj.x - 1, proj.y - 1, 2, 2);
      }
    }

    ctx.restore();
  }

  /** 渲染近战特效 — 5种近战武器完全不同 */
  private renderMeleeEffects(): void {
    if (this._meleeEffects.length === 0 || !this._player) return;
    const ctx = this.renderer.ctx;

    ctx.save();
    ctx.translate(-Math.round(this.camera.x), -Math.round(this.camera.y));

    for (const fx of this._meleeEffects) {
      const alpha = Math.max(0, 1 - fx.age / fx.lifetime);
      ctx.save();
      ctx.translate(this._player.x, this._player.y);
      ctx.rotate(fx.angle);

      switch (fx.weaponId) {
        case 'rusty_sword':
          // === 生锈铁剑 — 铁色弧形斩击 ===
          ctx.globalAlpha = alpha * 0.7;
          ctx.strokeStyle = '#ccccdd';
          ctx.lineWidth = 4;
          ctx.beginPath();
          ctx.arc(0, 0, fx.range, -Math.PI / 3, Math.PI / 3);
          ctx.stroke();
          // 铁屑飞溅
          ctx.globalAlpha = alpha * 0.4;
          for (let i = 0; i < 4; i++) {
            const sa = -Math.PI / 3 + (i / 3) * (Math.PI * 2 / 3);
            ctx.fillStyle = '#aaaacc';
            ctx.beginPath();
            ctx.arc(Math.cos(sa) * fx.range * 0.9, Math.sin(sa) * fx.range * 0.9, 2, 0, Math.PI * 2);
            ctx.fill();
          }
          break;

        case 'battle_axe':
          // === 战斧 — 红色重劈弧 + 震荡波 ===
          ctx.globalAlpha = alpha * 0.8;
          ctx.strokeStyle = '#ff6644';
          ctx.lineWidth = 6;
          ctx.beginPath();
          ctx.arc(0, 0, fx.range, -Math.PI / 4, Math.PI / 4);
          ctx.stroke();
          // 震荡
          ctx.globalAlpha = alpha * 0.3;
          ctx.strokeStyle = '#ff4422';
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.arc(0, 0, fx.range * 1.2, -Math.PI / 6, Math.PI / 6);
          ctx.stroke();
          break;

        case 'lightning_dagger':
          // === 闪电匕首 — 电弧闪烁 ===
          ctx.globalAlpha = alpha * 0.9;
          ctx.strokeStyle = '#aaeeff';
          ctx.lineWidth = 2;
          // 锯齿闪电
          ctx.beginPath();
          ctx.moveTo(8, 0);
          for (let i = 1; i <= 5; i++) {
            const lx = 8 + i * (fx.range - 8) / 5;
            const ly = (Math.random() - 0.5) * 20;
            ctx.lineTo(lx, ly);
          }
          ctx.stroke();
          // 电火花
          ctx.globalAlpha = alpha * 0.5;
          ctx.fillStyle = '#ffffff';
          for (let i = 0; i < 3; i++) {
            ctx.beginPath();
            ctx.arc(fx.range * 0.5 + Math.random() * 20 - 10, Math.random() * 24 - 12, 2, 0, Math.PI * 2);
            ctx.fill();
          }
          break;

        case 'shadow_blade':
          // === 暗影之刃 — 紫黑弧 + 暗粒子 ===
          ctx.globalAlpha = alpha * 0.8;
          ctx.strokeStyle = '#8844aa';
          ctx.lineWidth = 5;
          ctx.beginPath();
          ctx.arc(0, 0, fx.range, -Math.PI / 3, Math.PI / 3);
          ctx.stroke();
          // 暗粒子
          ctx.globalAlpha = alpha * 0.4;
          for (let i = 0; i < 6; i++) {
            const sa = -Math.PI / 3 + Math.random() * (Math.PI * 2 / 3);
            const sr = fx.range * (0.5 + Math.random() * 0.5);
            ctx.fillStyle = i % 2 === 0 ? '#6622aa' : '#aa44cc';
            ctx.beginPath();
            ctx.arc(Math.cos(sa) * sr, Math.sin(sa) * sr, 3, 0, Math.PI * 2);
            ctx.fill();
          }
          break;

        case 'holy_shield':
          // === 圣盾 — 金色光环 + 十字 ===
          ctx.globalAlpha = alpha * 0.6;
          ctx.strokeStyle = '#ffdd66';
          ctx.lineWidth = 4;
          ctx.beginPath();
          ctx.arc(0, 0, fx.range, -Math.PI / 2, Math.PI / 2);
          ctx.stroke();
          // 十字光芒
          ctx.globalAlpha = alpha * 0.4;
          ctx.strokeStyle = '#ffffaa';
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.moveTo(fx.range * 0.5, 0);
          ctx.lineTo(fx.range, 0);
          ctx.stroke();
          ctx.beginPath();
          ctx.moveTo(fx.range * 0.75, -fx.range * 0.3);
          ctx.lineTo(fx.range * 0.75, fx.range * 0.3);
          ctx.stroke();
          break;

        default:
          // 默认弧线
          ctx.globalAlpha = alpha * 0.5;
          ctx.strokeStyle = '#ffffff';
          ctx.lineWidth = 3;
          ctx.beginPath();
          ctx.arc(0, 0, fx.range, -Math.PI / 3, Math.PI / 3);
          ctx.stroke();
      }

      ctx.restore();
    }

    ctx.globalAlpha = 1;
    ctx.restore();
  }

  // @ts-ignore unused (legacy, replaced by drawDamageNumber)
  private renderFloatingTexts(): void {
    const ctx = this.renderer.ctx;
    const texts = this.combatSystem.floatingTexts;

    ctx.save();
    ctx.translate(-Math.round(this.camera.x), -Math.round(this.camera.y));

    for (const ft of texts) {
      const alpha = 1 - ft.age / ft.lifetime;
      ctx.globalAlpha = alpha;
      ctx.fillStyle = ft.color;
      ctx.font = 'bold 18px monospace';
      ctx.textAlign = 'center';
      ctx.fillText(ft.text, Math.round(ft.x), Math.round(ft.y));
    }

    ctx.globalAlpha = 1;
    ctx.textAlign = 'left';
    ctx.restore();
  }

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
