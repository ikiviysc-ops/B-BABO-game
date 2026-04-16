// GameUpdate.ts - 游戏更新逻辑管理

import { type GameState } from './GameState';
import { getWeaponDef } from '../data/WeaponDefs';

// 导入实际的类型定义
import { Camera } from '../engine/Camera';
import { EntityManager } from '../engine/EntityManager';
import { InputManager } from '../engine/InputManager';
import { MovementSystem } from '../systems/MovementSystem';
import { VirtualJoystick } from '../engine/VirtualJoystick';

interface ProjectilePool {
  spawn: (data: any) => void;
  clear: () => void;
  getActive: () => any[];
}

interface ParticleSystem {
  emitPreset: (x: number, y: number, preset: string) => void;
  clear: () => void;
  update: (dt: number) => void;
}

interface ScreenShake {
  trigger: (intensity: number, duration: number) => void;
  update: (dt: number) => void;
}

interface HitStop {
  trigger: (duration: number) => void;
  update: (dt: number) => boolean;
}

interface EnemyAISystem {
  update: (enemies: any[], playerX: number, playerY: number, dt: number) => void;
}

interface WaveSystem {
  update: (dt: number, playerX: number, playerY: number, spawnEnemy: (def: any, x: number, y: number) => void) => void;
  reset: () => void;
  onKill: () => void;
}

interface LevelUpSystem {
  reset: () => void;
  addXp: (xp: number) => boolean;
  selectOption: (index: number) => any;
  getContext: () => any;
  getWeaponDamageMultiplier: (weaponId: string) => number;
  getWeaponFireRateMultiplier: (weaponId: string) => number;
  options: any[];
  level: number;
  xp: number;
  xpToNext: number;
  pendingLevelUp: boolean;
}

interface MainMenu {
  hitTest: (x: number, y: number, width: number, height: number) => string | null;
}

interface LevelUpPanel {
  hitTest: (x: number, y: number, options: any[], width: number, height: number) => number;
}

interface GameOverScreen {
  hitTest: (x: number, y: number, width: number, height: number) => string | null;
}

interface CharacterSelectScreen {
  hitTest: (x: number, y: number, width: number, height: number) => string | null;
}

export class GameUpdate {
  private input: InputManager;
  private camera: Camera;
  private entities: EntityManager;
  private projectilePool: ProjectilePool;
  private joystick: VirtualJoystick;
  private particles: ParticleSystem;
  private screenShake: ScreenShake;
  private hitStop: HitStop;
  private movementSystem: MovementSystem;
  private enemyAI: EnemyAISystem;
  private waveSystem: WaveSystem;
  private levelUpSystem: LevelUpSystem;
  private mainMenu: MainMenu;
  private levelUpPanel: LevelUpPanel;
  private gameOverScreen: GameOverScreen;
  private charSelectScreen: CharacterSelectScreen;
  private allCharDefs: any[];

  constructor(
    input: InputManager,
    camera: Camera,
    entities: EntityManager,
    projectilePool: ProjectilePool,
    joystick: VirtualJoystick,
    particles: ParticleSystem,
    screenShake: ScreenShake,
    hitStop: HitStop,
    movementSystem: MovementSystem,
    enemyAI: EnemyAISystem,
    waveSystem: WaveSystem,
    levelUpSystem: LevelUpSystem,
    mainMenu: MainMenu,
    levelUpPanel: LevelUpPanel,
    gameOverScreen: GameOverScreen,
    charSelectScreen: CharacterSelectScreen,
    allCharDefs: any[]
  ) {
    this.input = input;
    this.camera = camera;
    this.entities = entities;
    this.projectilePool = projectilePool;
    this.joystick = joystick;
    this.particles = particles;
    this.screenShake = screenShake;
    this.hitStop = hitStop;
    this.movementSystem = movementSystem;
    this.enemyAI = enemyAI;
    this.waveSystem = waveSystem;
    this.levelUpSystem = levelUpSystem;
    this.mainMenu = mainMenu;
    this.levelUpPanel = levelUpPanel;
    this.gameOverScreen = gameOverScreen;
    this.charSelectScreen = charSelectScreen;
    this.allCharDefs = allCharDefs;
  }

  update(dt: number, state: GameState): void {
    switch (state.phase) {
      case 'menu':
        this._updateMenu(state);
        break;
      case 'charSelect':
        this._updateCharSelect(state);
        break;
      case 'playing':
        this._updatePlaying(dt, state);
        break;
      case 'levelUp':
        this._updateLevelUp(state);
        break;
      case 'gameOver':
        this._updateGameOver(state);
        break;
    }
  }

  private _updateMenu(state: GameState): void {
    if (this.input.consumeTap()) {
      const action = this.mainMenu.hitTest(
        (this.input.mouseX || this.input.touchX) || 0,
        (this.input.mouseY || this.input.touchY) || 0,
        window.innerWidth,
        window.innerHeight,
      );
      if (action === 'action') {
        this._startGame(state);
      } else if (action === 'chars') {
        state.phase = 'charSelect';
      }
      // 'help' - 暂不处理
    }
  }

  private _updateCharSelect(state: GameState): void {
    if (this.input.consumeTap()) {
      const tx = (this.input.mouseX || this.input.touchX) || 0;
      const ty = (this.input.mouseY || this.input.touchY) || 0;
      const action = this.charSelectScreen.hitTest(tx, ty, window.innerWidth, window.innerHeight);

      switch (action) {
        case 'back':
          state.phase = 'menu';
          break;
        case 'prev':
          state.selectedCharIndex = (state.selectedCharIndex - 1 + this.allCharDefs.length) % this.allCharDefs.length;
          break;
        case 'next':
          state.selectedCharIndex = (state.selectedCharIndex + 1) % this.allCharDefs.length;
          break;
        case 'confirm':
          state.playerCharId = this.allCharDefs[state.selectedCharIndex].id;
          this._startGame(state);
          break;
      }
    }

    // Tab键切换
    if (this.input.isDown('Tab')) {
      state.selectedCharIndex = (state.selectedCharIndex + 1) % this.allCharDefs.length;
      this.input.keys.delete('Tab');
    }
  }

  private _updatePlaying(dt: number, state: GameState): void {
    // 命中停顿
    if (this.hitStop.update(dt)) return;

    state.elapsed += dt;
    state.invincibleTimer = Math.max(0, state.invincibleTimer - dt);
    state.damageFlashTimer = Math.max(0, state.damageFlashTimer - dt);

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
      player.speed = state.playerSpeed;
    }

    // 武器系统 - 多武器支持
    const enemies = this.entities.getAll().filter(e => e.id !== 'player');
    for (let i = 0; i < state.weaponDefs.length; i++) {
      const wDef = state.weaponDefs[i];
      if (!wDef) continue;

      // 冷却
      state.weaponCooldowns[i] = (state.weaponCooldowns[i] ?? 0) - dt;
      if (state.weaponCooldowns[i] > 0) continue;

      // 找最近敌人
      let nearest: any | null = null;
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
      state.weaponCooldowns[i] = wDef.fireRate * rateMul;

      if (wDef.type === 'melee') {
        this._meleeAttack(player!, wDef, enemies, nearestDist, dmgMul, state);
      } else {
        this._rangedAttack(player!, wDef, nearest!, dmgMul, state);
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
    this._updateProjectileCollisions(enemies, state);

    // 同步HP引用
    state.playerHp = Math.max(0, state.playerHp);
    if (player) player.hp = state.playerHp;

    // 检查死亡
    if (state.playerHp <= 0) {
      state.phase = 'gameOver';
      this.particles.emitPreset((player?.x as number) ?? 0, (player?.y as number) ?? 0, 'DEATH');
      return;
    }

    // 波次系统
    this.waveSystem.update(
      dt,
      player?.x as number ?? 0,
      player?.y as number ?? 0,
      (def: any, x: number, y: number) => this._spawnEnemy(def, x, y),
    );

    // 拾取物
    this._updatePickups(dt, player, state);

    // 浮动文字
    this._updateFloatTexts(dt, state);

    // 粒子
    this.particles.update(dt);

    // 屏幕震动
    this.screenShake.update(dt);

    // 清理非活跃实体
    this.entities.endFrame();
  }

  private _updateLevelUp(state: GameState): void {
    if (this.input.consumeTap()) {
      const tx = (this.input.mouseX || this.input.touchX) || 0;
      const ty = (this.input.mouseY || this.input.touchY) || 0;
      const idx = this.levelUpPanel.hitTest(
        tx, ty,
        this.levelUpSystem.options,
        window.innerWidth,
        window.innerHeight,
      );
      if (idx >= 0) {
        const selected = this.levelUpSystem.selectOption(idx);
        this._applyLevelUpOption(selected, state);
        this.particles.emitPreset(
          (this.entities.get('player')?.x as number) ?? 0,
          (this.entities.get('player')?.y as number) ?? 0,
          'LEVEL_UP',
        );

        // 连续升级检查
        if (this.levelUpSystem.pendingLevelUp) {
          // 保持levelUp阶段
        } else {
          state.phase = 'playing';
        }
      }
    }
  }

  private _updateGameOver(state: GameState): void {
    if (this.input.consumeTap()) {
      const tx = (this.input.mouseX || this.input.touchX) || 0;
      const ty = (this.input.mouseY || this.input.touchY) || 0;
      const action = this.gameOverScreen.hitTest(tx, ty, window.innerWidth, window.innerHeight);
      if (action === 'restart') {
        this._startGame(state);
      } else if (action === 'menu') {
        state.phase = 'menu';
      }
    }
  }

  private _startGame(state: GameState): void {
    // 重置所有状态
    this.entities.clear();
    this.projectilePool.clear();
    this.particles.clear();
    state.reset();

    // 获取角色定义
    const charDef = this.allCharDefs.find(c => c.id === state.playerCharId) ?? this.allCharDefs[0];

    // 初始化玩家属性
    state.playerMaxHp = charDef.stats.hp;
    state.playerHp = state.playerMaxHp;
    state.playerSpeed = charDef.stats.speed;
    state.playerArmor = charDef.stats.armor;
    state.playerCritChance = charDef.stats.crit;

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
      state.weaponDefs.push(initWeaponDef);
      state.weaponCooldowns.push(0);
      this.levelUpSystem.getContext().ownedWeapons.push(initWeaponId);
      this.levelUpSystem.getContext().weaponLevels.set(initWeaponId, 1);
    }

    // 创建玩家实体
    this.entities.add({
      id: 'player',
      active: true,
      x: 0,
      y: 0,
      hp: state.playerHp,
      maxHp: state.playerMaxHp,
      speed: state.playerSpeed,
      size: 16,
      facingX: 0,
      facingY: 1,
    });

    // 摄像机
    this.camera.snap(0, 0);

    // 波次系统
    this.waveSystem.reset();

    state.phase = 'playing';
  }

  private _spawnEnemy(def: any, x: number, y: number): void {
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
    player: any,
    wDef: any,
    enemies: any[],
    _nearestDist: number,
    dmgMul: number,
    state: GameState
  ): void {
    const px = player.x as number;
    const py = player.y as number;
    const count = wDef.projectileCount ?? 1;

    const targets: { enemy: any; dist: number }[] = [];
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
      const isCrit = Math.random() * 100 < state.playerCritChance;
      const dmg = Math.round((isCrit ? wDef.damage * 2 : wDef.damage) * dmgMul);
      const currentHp = target.enemy.hp as number;
      target.enemy.hp = currentHp - dmg;
      target.enemy.hitFlash = 0.1;

      state.floatTexts.push({
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
        this._onEnemyKilled(target.enemy.id, target.enemy.x as number, target.enemy.y as number, target.enemy.xpDrop as number ?? 5, state);
      }
    }
  }

  private _rangedAttack(
    player: any,
    wDef: any,
    target: any,
    dmgMul: number,
    state: GameState
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

      const isCrit = Math.random() * 100 < state.playerCritChance;
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

  private _updateProjectileCollisions(enemies: any[], state: GameState): void {
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

          state.floatTexts.push({
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
            this._onEnemyKilled(enemy.id, ex, ey, (enemy.xpDrop as number) ?? 5, state);
          }

          if (!proj.active) break;
        }
      }
    }
  }

  private _onEnemyKilled(_enemyId: string, x: number, y: number, xpDrop: number, state: GameState): void {
    state.kills++;
    state.score += 10;
    this.waveSystem.onKill();

    // XP被动加成
    const charDef = this.allCharDefs.find(c => c.id === state.playerCharId);
    let xpAmount = xpDrop;
    if (charDef?.passive.effect === 'xp_boost_15') {
      xpAmount = Math.floor(xpAmount * 1.15);
    }

    // 掉落经验
    state.pickups.push({
      x: x + (Math.random() - 0.5) * 10,
      y: y + (Math.random() - 0.5) * 10,
      type: 'xp',
      value: xpAmount,
      life: 10,
      active: true,
    });

    // 概率掉血
    if (Math.random() < 0.1) {
      state.pickups.push({
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

  public _onPlayerDamaged(damage: number, state: GameState): void {
    if (state.invincibleTimer > 0) return;

    const charDef = this.allCharDefs.find(c => c.id === state.playerCharId);
    let actualDmg = Math.max(1, damage - state.playerArmor);

    // 被动减伤
    if (charDef?.passive.effect === 'dmg_reduce_10') {
      actualDmg = Math.floor(actualDmg * 0.9);
    }

    state.playerHp -= actualDmg;
    state.damageFlashTimer = 0.3;
    state.invincibleTimer = 0.5;
    this.screenShake.trigger(5, 0.2);
    this.hitStop.trigger(0.05);
  }

  public _applyEnemyDamageToPlayer(damage: number, state: GameState): void {
    this._onPlayerDamaged(damage, state);
  }

  private _applyLevelUpOption(option: any, state: GameState): void {
    const ctx = this.levelUpSystem.getContext();

    // 同步属性到游戏
    state.playerMaxHp = ctx.stats.maxHp;
    state.playerSpeed = ctx.stats.speed;
    state.playerArmor = ctx.stats.armor;
    state.playerCritChance = ctx.stats.critChance;

    // 检查新武器
    if (option.type === 'weapon') {
      const weaponId = option.id.replace('weapon_', '');
      const wDef = getWeaponDef(weaponId);
      if (wDef && state.weaponDefs.length < 6) {
        state.weaponDefs.push(wDef);
        state.weaponCooldowns.push(0);
      }
    }

    // 升级时恢复少量HP
    state.playerHp = Math.min(state.playerHp + 20, state.playerMaxHp);
  }

  private _updatePickups(dt: number, player: any, state: GameState): void {
    if (!player) return;
    const px = player.x as number;
    const py = player.y as number;

    for (let i = state.pickups.length - 1; i >= 0; i--) {
      const p = state.pickups[i];
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
            state.phase = 'levelUp';
          }
        } else if (p.type === 'heal') {
          state.playerHp = Math.min(state.playerHp + p.value, state.playerMaxHp);
          state.floatTexts.push({
            x: px, y: py - 30,
            text: `+${p.value} HP`,
            color: '#00ff88',
            life: 0.8, maxLife: 0.8,
          });
        }
      }
    }

    // 清理
    state.pickups = state.pickups.filter(p => p.active);
  }

  private _updateFloatTexts(dt: number, state: GameState): void {
    for (let i = state.floatTexts.length - 1; i >= 0; i--) {
      const ft = state.floatTexts[i];
      ft.life -= dt;
      ft.y -= 40 * dt;
      if (ft.life <= 0) {
        state.floatTexts.splice(i, 1);
      }
    }
  }
}
