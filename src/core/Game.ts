/**
 * 游戏核心类 - 管理游戏生命周期
 * Phase 1B: 武器发射 + 碰撞伤害 + 敌人死亡 + XP升级
 */

import { GameLoop } from '@engine/GameLoop';
import { Renderer } from '@engine/Renderer';
import { Camera } from '@engine/Camera';
import { InputManager } from '@engine/InputManager';
import { EntityManager, type Entity } from '@engine/EntityManager';
import { CharacterRegistry } from '@data/CharacterRegistry';
import { PISTOL } from '@data/WeaponDefs';
import { MovementSystem } from '@systems/MovementSystem';
import { RenderSystem } from '@systems/RenderSystem';
import { EnemyAISystem } from '@systems/EnemyAISystem';
import { WaveSystem } from '@systems/WaveSystem';
import { ProjectilePool } from '@engine/ProjectilePool';
import { ProjectileSystem } from '@systems/ProjectileSystem';
import { WeaponSystem } from '@systems/WeaponSystem';
import { CombatSystem } from '@systems/CombatSystem';
import { LevelUpSystem, type LevelUpOption } from '@systems/LevelUpSystem';

export class Game {
  readonly canvas: HTMLCanvasElement;
  readonly renderer: Renderer;
  readonly camera: Camera;
  readonly input: InputManager;
  readonly entities: EntityManager;
  readonly loop: GameLoop;
  readonly waves: WaveSystem;

  private movementSystem: MovementSystem;
  private renderSystem: RenderSystem;
  private enemyAI: EnemyAISystem;
  private weaponSystem: WeaponSystem;
  private projectileSystem: ProjectileSystem;
  private combatSystem: CombatSystem;
  private levelUpSystem: LevelUpSystem;

  private _running = false;

  /** 角色切换 */
  private _charIds: string[];
  private _charIndex = 0;
  private _tabPressed = false;

  /** 玩家引用 */
  private _player: (Entity & { currentHp: number; maxHp: number }) | null = null;

  /** 游戏状态 */
  private _gameStarted = false;
  private _gameOver = false;
  private _score = 0;

  /** 投射物池 */
  private readonly _projPool: ProjectilePool;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.renderer = new Renderer(canvas);
    this.camera = new Camera(canvas.width, canvas.height);
    this.input = new InputManager(canvas);
    this.entities = new EntityManager();
    this.waves = new WaveSystem();

    // 投射物池
    this._projPool = new ProjectilePool(300);

    // 系统
    this.movementSystem = new MovementSystem(this.input);
    this.renderSystem = new RenderSystem(this.renderer, this.camera);
    this.enemyAI = new EnemyAISystem();
    this.weaponSystem = new WeaponSystem({ pool: this._projPool });
    this.projectileSystem = new ProjectileSystem(this._projPool, {
      bounds: { left: -2000, top: -2000, right: 2000, bottom: 2000 },
    });
    this.combatSystem = new CombatSystem(this._projPool);
    this.levelUpSystem = new LevelUpSystem();

    // 战斗回调
    this.combatSystem.setCallbacks({
      onDamage: () => {},
      onKill: (_id, _x, _y, xp) => {
        this._score += xp;
        this.waves.onKill();
        const leveled = this.levelUpSystem.addXp(xp);
        if (leveled) {
          // 升级回血
          if (this._player) {
            this._player.currentHp = Math.min(
              this._player.currentHp + 20,
              this._player.maxHp + this.levelUpSystem.bonusMaxHp,
            );
          }
        }
      },
    });

    this.loop = new GameLoop(60, this.update.bind(this), this.render.bind(this));

    this._charIds = CharacterRegistry.getAllDefs().map(d => d.id);

    this.handleResize();
    window.addEventListener('resize', () => this.handleResize());
  }

  start(): void {
    if (this._running) return;
    this._running = true;
    this.spawnCharacter(this._charIds[0]);
    console.log(`[B-BABO] Game started! ${CharacterRegistry.totalCharacters} characters.`);
    console.log('[B-BABO] Press TAB to switch, WASD to move, SPACE to start wave.');
    this.loop.start();
  }

  private spawnCharacter(charId: string): void {
    for (const e of this.entities.getAll()) this.entities.remove(e.id);
    const player = CharacterRegistry.createEntity(charId, 3) as Entity & { currentHp: number; maxHp: number };
    const def = CharacterRegistry.getDef(charId);
    player.currentHp = def?.stats.hp ?? 100;
    player.maxHp = player.currentHp;
    this._player = player;
    this.entities.add(player);
    this.camera.setTarget(player);
  }

  private update(dt: number): void {
    this.input.update();

    // === 升级选择状态 ===
    if (this.levelUpSystem.pendingLevelUp) {
      this.handleLevelUpInput();
      return; // 暂停游戏
    }

    // === 角色选择状态 ===
    if (!this._gameStarted) {
      // Space 或 点击屏幕中央区域 开始游戏
      if (!this._gameStarted) {
        const startGame = this.input.isKeyDown(' ') ||
          (this.input.consumeTap() && (() => {
            const ty = this.input.touchY;
            const th = this.canvas.clientHeight || window.innerHeight;
            return ty > th * 0.3 && ty < th * 0.7;
          })());
        if (startGame) {
          this._gameStarted = true;
          this.waves.startNextWave();
          // 初始武器
          this.weaponSystem.equip(PISTOL);
        }
      }

      // Tab 切换角色
      if (!this._gameStarted) {
        if (this.input.isKeyDown('tab') && !this._tabPressed) {
          this._tabPressed = true;
          this._charIndex = (this._charIndex + 1) % this._charIds.length;
          this.spawnCharacter(this._charIds[this._charIndex]);
        }
        if (!this.input.isKeyDown('tab')) this._tabPressed = false;

        if (this.input.consumeTap()) {
          const ty = this.input.touchY;
          const th = this.canvas.clientHeight || window.innerHeight;
          if (ty < th * 0.3) {
            this._charIndex = (this._charIndex + 1) % this._charIds.length;
          } else if (ty > th * 0.7) {
            this._charIndex = (this._charIndex - 1 + this._charIds.length) % this._charIds.length;
          }
          this.spawnCharacter(this._charIds[this._charIndex]);
        }
      }
      return;
    }

    if (this._gameOver) return;

    // === 游戏进行中 ===

    // 移动玩家
    this.movementSystem.update(this.entities, dt);

    // 敌人 AI
    if (this._player) {
      this.enemyAI.update(this.entities, this._player.x, this._player.y, dt);
    }

    // 找最近敌人（给武器系统用）
    this.updateNearestEnemy();

    // 武器自动发射
    if (this._player) {
      this.weaponSystem.update(dt, this._player.x, this._player.y);
    }

    // 投射物更新
    const enemies = this.entities.getAll()
      .filter(e => 'enemyId' in e)
      .map(e => ({ x: e.x, y: e.y, active: e.active }));
    this.projectileSystem.setEnemies(enemies);
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

    // 清理死亡实体
    this.entities.cleanup();
  }

  /** 更新最近敌人信息 */
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

  /** 升级选择输入 */
  private handleLevelUpInput(): void {
    const options = this.levelUpSystem.options;
    // 键盘 1/2/3 选择
    for (let i = 0; i < options.length; i++) {
      if (this.input.isKeyDown(`${i + 1}`)) {
        this.applyLevelUpChoice(i);
        return;
      }
    }
    // 点击/触摸选择
    if (this.input.consumeTap()) {
      const tx = this.input.touchX;
      const dpr = window.devicePixelRatio || 1;
      const w = this.canvas.width;
      const optionW = w / options.length;
      const idx = Math.floor(tx * dpr / optionW);
      if (idx >= 0 && idx < options.length) {
        this.applyLevelUpChoice(idx);
      }
    }
  }

  /** 应用升级选择 */
  private applyLevelUpChoice(index: number): void {
    const option = this.levelUpSystem.selectOption(index);
    if (!option) return;

    // 如果是新武器
    if (option.type === 'new_weapon' && '_weaponDef' in option) {
      const weaponDef = (option as LevelUpOption & { _weaponDef: import('@data/WeaponDefs').WeaponDef })._weaponDef;
      this.weaponSystem.equip(weaponDef);
    }

    // 应用属性加成到玩家
    if (this._player && this.levelUpSystem.bonusMaxHp > 0) {
      this._player.maxHp = (CharacterRegistry.getDef(this._charIds[this._charIndex])?.stats.hp ?? 100) + this.levelUpSystem.bonusMaxHp;
    }
    if (this._player && this.levelUpSystem.bonusSpeed > 0) {
      const baseSpeed = CharacterRegistry.getDef(this._charIds[this._charIndex])?.stats.speed ?? 200;
      this._player.speed = baseSpeed * (1 + this.levelUpSystem.bonusSpeed / 100);
    }

    console.log(`[B-BABO] Lv.${this.levelUpSystem.level} — 选择: ${option.name}`);
  }

  /** 简单碰撞检测 */
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
            console.log(`[B-BABO] Game Over! Score: ${this._score}, Wave: ${this.waves.currentWave}`);
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

  private render(): void {
    this.camera.update();
    this.renderer.clear();
    this.renderSystem.update(this.entities);

    // 渲染投射物
    this.renderProjectiles();

    // 渲染浮动伤害数字
    this.renderFloatingTexts();

    // HUD
    const charId = this._charIds[this._charIndex];
    const def = CharacterRegistry.getDef(charId);
    const sprite = CharacterRegistry.getSprite(charId);

    if (!this._gameStarted) {
      if (def && sprite) {
        this.renderer.renderCharacterHUD(def.name, sprite.hironoSeries, this._charIndex + 1, this._charIds.length);
      }
      this.renderer.renderCenterText('按 SPACE 或 点击屏幕中央开始游戏');
    } else {
      this.renderer.renderGameHUD(
        this.waves.currentWave,
        this._score,
        this._player?.currentHp ?? 0,
        this._player?.maxHp ?? 100,
        this.levelUpSystem.xp,
        this.levelUpSystem.xpToNext,
        this.levelUpSystem.level,
        this.waves.totalKills,
      );

      if (this._gameOver) {
        this.renderer.renderCenterText(`GAME OVER  波次 ${this.waves.currentWave}  分数 ${this._score}`);
      }
    }

    // 升级选择 UI
    if (this.levelUpSystem.pendingLevelUp) {
      this.renderLevelUpUI();
    }
  }

  /** 渲染投射物 */
  private renderProjectiles(): void {
    const ctx = this.renderer.ctx;
    const projectiles = this._projPool.getActive();

    ctx.save();
    ctx.translate(-Math.round(this.camera.x), -Math.round(this.camera.y));

    for (const proj of projectiles) {
      if (!proj.active) continue;

      // 视锥剔除
      if (proj.x + proj.width < this.camera.x || proj.x - proj.width > this.camera.x + this.camera.width ||
          proj.y + proj.height < this.camera.y || proj.y - proj.height > this.camera.y + this.camera.height) {
        continue;
      }

      if (proj.type === 'melee_arc') {
        // 近战弧形 — 半透明白色
        ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
        ctx.beginPath();
        ctx.arc(proj.x, proj.y, proj.width / 2, 0, Math.PI * 2);
        ctx.fill();
      } else if (proj.type === 'explosion') {
        // 爆炸 — 橙红色
        ctx.fillStyle = 'rgba(255, 100, 30, 0.5)';
        ctx.beginPath();
        ctx.arc(proj.x, proj.y, proj.width / 2, 0, Math.PI * 2);
        ctx.fill();
      } else {
        // 子弹/箭矢/魔法 — 根据类型着色
        const colors: Record<string, string> = {
          bullet: '#ffcc44',
          arrow: '#aaddaa',
          magic: '#aa66ff',
          rocket: '#ff6633',
        };
        ctx.fillStyle = colors[proj.type] || '#ffcc44';
        ctx.fillRect(
          Math.round(proj.x - proj.width / 2),
          Math.round(proj.y - proj.height / 2),
          proj.width,
          proj.height,
        );
      }
    }

    ctx.restore();
  }

  /** 渲染浮动伤害数字 */
  private renderFloatingTexts(): void {
    const ctx = this.renderer.ctx;
    const texts = this.combatSystem.floatingTexts;

    ctx.save();
    ctx.translate(-Math.round(this.camera.x), -Math.round(this.camera.y));

    for (const ft of texts) {
      const alpha = 1 - ft.age / ft.lifetime;
      ctx.globalAlpha = alpha;
      ctx.fillStyle = ft.color;
      ctx.font = 'bold 12px monospace';
      ctx.textAlign = 'center';
      ctx.fillText(ft.text, Math.round(ft.x), Math.round(ft.y));
    }

    ctx.globalAlpha = 1;
    ctx.textAlign = 'left';
    ctx.restore();
  }

  /** 渲染升级选择 UI */
  private renderLevelUpUI(): void {
    const ctx = this.renderer.ctx;
    const options = this.levelUpSystem.options;
    const dpr = window.devicePixelRatio || 1;

    ctx.save();
    ctx.resetTransform();

    // 半透明遮罩
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.fillRect(0, 0, this.renderer.width, this.renderer.height);

    // 标题
    ctx.fillStyle = '#ffcc00';
    ctx.font = `bold ${24 * dpr}px monospace`;
    ctx.textAlign = 'center';
    ctx.fillText(`⬆ 升级! Lv.${this.levelUpSystem.level}`, this.renderer.width / 2, 80 * dpr);

    // 选项卡片
    const cardW = Math.min(200 * dpr, (this.renderer.width - 60 * dpr) / options.length);
    const cardH = 160 * dpr;
    const gap = 20 * dpr;
    const totalW = options.length * cardW + (options.length - 1) * gap;
    const startX = (this.renderer.width - totalW) / 2;
    const startY = this.renderer.height / 2 - cardH / 2;

    for (let i = 0; i < options.length; i++) {
      const opt = options[i];
      const x = startX + i * (cardW + gap);

      // 卡片背景
      ctx.fillStyle = 'rgba(30, 30, 60, 0.9)';
      ctx.strokeStyle = '#555';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.roundRect(x, startY, cardW, cardH, 8 * dpr);
      ctx.fill();
      ctx.stroke();

      // 序号
      ctx.fillStyle = '#888';
      ctx.font = `${12 * dpr}px monospace`;
      ctx.textAlign = 'center';
      ctx.fillText(`[${i + 1}]`, x + cardW / 2, startY + 20 * dpr);

      // 图标
      ctx.font = `${32 * dpr}px sans-serif`;
      ctx.fillText(opt.icon, x + cardW / 2, startY + 60 * dpr);

      // 名称
      ctx.fillStyle = '#ffffff';
      ctx.font = `bold ${14 * dpr}px monospace`;
      ctx.fillText(opt.name, x + cardW / 2, startY + 90 * dpr);

      // 描述
      ctx.fillStyle = '#aaaaaa';
      ctx.font = `${11 * dpr}px monospace`;
      // 简单文字换行
      const words = opt.description;
      if (words.length > 10) {
        ctx.fillText(words.slice(0, 10), x + cardW / 2, startY + 110 * dpr);
        ctx.fillText(words.slice(10), x + cardW / 2, startY + 126 * dpr);
      } else {
        ctx.fillText(words, x + cardW / 2, startY + 110 * dpr);
      }
    }

    // 底部提示
    ctx.fillStyle = 'rgba(255,255,255,0.5)';
    ctx.font = `${12 * dpr}px monospace`;
    ctx.fillText('按 1/2/3 或 点击选择', this.renderer.width / 2, startY + cardH + 40 * dpr);

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
