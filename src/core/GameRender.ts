// GameRender.ts - 游戏渲染管理

import { type GameState } from './GameState';
import { renderCharacter } from '../data/CharacterRegistry';

// 导入实际的类型定义
import { Camera } from '../engine/Camera';
import { EntityManager } from '../engine/EntityManager';
import { TileMap } from '../engine/TileMap';

interface Renderer {  ctx: CanvasRenderingContext2D;  width: number;  height: number;  dpr: number;  resize: () => void;}

interface ParallaxBackground {  render: (ctx: CanvasRenderingContext2D, x: number, y: number) => void;  resize: (width: number, height: number) => void;}

interface ParticleSystem {
  render: (ctx: CanvasRenderingContext2D) => void;
}

interface ProjectilePool {
  getActive: () => any[];
}

interface ScreenShake {
  getOffset: () => { x: number; y: number; };
}

interface VirtualJoystick {
  render: (ctx: CanvasRenderingContext2D) => void;
}

interface HUDRenderer {
  render: (ctx: CanvasRenderingContext2D, state: any) => void;
  reset: () => void;
}

interface LevelUpPanel {
  render: (ctx: CanvasRenderingContext2D, options: any[], level: number, width: number, height: number, dpr: number) => void;
  hitTest: (x: number, y: number, options: any[], width: number, height: number) => number;
}

interface MainMenu {
  render: (ctx: CanvasRenderingContext2D, width: number, height: number, dpr: number) => void;
  hitTest: (x: number, y: number, width: number, height: number) => string | null;
}

interface GameOverScreen {
  render: (ctx: CanvasRenderingContext2D, state: any, width: number, height: number, dpr: number) => void;
  hitTest: (x: number, y: number, width: number, height: number) => string | null;
}

interface CharacterSelectScreen {
  render: (ctx: CanvasRenderingContext2D, data: any, width: number, height: number, dpr: number) => void;
  hitTest: (x: number, y: number, width: number, height: number) => string | null;
}

export class GameRender {
  private renderer: Renderer;
  private camera: Camera;
  private entities: EntityManager;
  private bg: ParallaxBackground;
  private tileMap: TileMap;
  private particles: ParticleSystem;
  private projectilePool: ProjectilePool;
  private joystick: VirtualJoystick;
  private screenShake: ScreenShake;
  private hudRenderer: HUDRenderer;
  private levelUpPanel: LevelUpPanel;
  private mainMenu: MainMenu;
  private gameOverScreen: GameOverScreen;
  private charSelectScreen: CharacterSelectScreen;

  constructor(
    renderer: Renderer,
    camera: Camera,
    entities: EntityManager,
    bg: ParallaxBackground,
    tileMap: TileMap,
    particles: ParticleSystem,
    projectilePool: ProjectilePool,
    joystick: VirtualJoystick,
    screenShake: ScreenShake,
    hudRenderer: HUDRenderer,
    levelUpPanel: LevelUpPanel,
    mainMenu: MainMenu,
    gameOverScreen: GameOverScreen,
    charSelectScreen: CharacterSelectScreen
  ) {
    this.renderer = renderer;
    this.camera = camera;
    this.entities = entities;
    this.bg = bg;
    this.tileMap = tileMap;
    this.particles = particles;
    this.projectilePool = projectilePool;
    this.joystick = joystick;
    this.screenShake = screenShake;
    this.hudRenderer = hudRenderer;
    this.levelUpPanel = levelUpPanel;
    this.mainMenu = mainMenu;
    this.gameOverScreen = gameOverScreen;
    this.charSelectScreen = charSelectScreen;
  }

  render(state: GameState, levelUpSystem: any, allCharDefs: any[]): void {
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

    if (state.phase === 'menu') {
      this.mainMenu.render(ctx, sw, sh, dpr);
      return;
    }

    if (state.phase === 'charSelect') {
      this.charSelectScreen.render(ctx, {
        characters: allCharDefs,
        currentIndex: state.selectedCharIndex,
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
    this._renderPickups(ctx, state.pickups);

    // 5. 敌人(阴影+精灵+血条)
    this._renderEnemies(ctx, this.entities.getAll().filter(e => e.id !== 'player'));

    // 6. 投射物
    this._renderProjectiles(ctx, this.projectilePool.getActive());

    // 7. 玩家(阴影+精灵+血条)
    this._renderPlayer(ctx, this.entities.get('player'), state.playerCharId, state.damageFlashTimer);

    // 8. 粒子特效
    this.particles.render(ctx);

    // 9. 浮动伤害数字
    this._renderFloatTexts(ctx, state.floatTexts);

    ctx.restore();

    // 10. HUD
    if (state.phase === 'playing' || state.phase === 'levelUp') {
      this._renderHUD(ctx, state, levelUpSystem, sw, sh, dpr);
    }

    // 11. 虚拟摇杆
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    this.joystick.render(ctx);

    // 12. UI覆盖层
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    if (state.phase === 'levelUp') {
      this.levelUpPanel.render(
        ctx,
        levelUpSystem.options,
        levelUpSystem.level,
        sw, sh, dpr,
      );
    } else if (state.phase === 'gameOver') {
      this.gameOverScreen.render(ctx, {
        kills: state.kills,
        score: state.score,
        level: levelUpSystem.level,
        elapsed: state.elapsed,
        weapons: state.weaponDefs.map((w: any) => ({
          name: w.name,
          level: levelUpSystem.getContext().weaponLevels.get(w.id) ?? 1,
        })),
      }, sw, sh, dpr);
    }
  }

  private _renderPlayer(ctx: CanvasRenderingContext2D, player: any, playerCharId: string, damageFlashTimer: number): void {
    if (!player || !player.active) return;

    const px = player.x as number;
    const py = player.y as number;

    // 阴影
    ctx.fillStyle = 'rgba(0,0,0,0.3)';
    ctx.beginPath();
    ctx.ellipse(px, py + 16, 14, 6, 0, 0, Math.PI * 2);
    ctx.fill();

    // 受伤闪烁
    if (damageFlashTimer > 0 && Math.floor(damageFlashTimer * 10) % 2 === 0) {
      ctx.globalAlpha = 0.5;
    }

    // 精灵
    renderCharacter(ctx, playerCharId, px - 32, py - 48, 2);

    ctx.globalAlpha = 1;
  }

  private _renderEnemies(ctx: CanvasRenderingContext2D, enemies: any[]): void {
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

  private _renderProjectiles(ctx: CanvasRenderingContext2D, projectiles: any[]): void {
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

  private _renderPickups(ctx: CanvasRenderingContext2D, pickups: any[]): void {
    for (const p of pickups) {
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

  private _renderFloatTexts(ctx: CanvasRenderingContext2D, floatTexts: any[]): void {
    for (const ft of floatTexts) {
      ctx.globalAlpha = Math.max(0, ft.life / ft.maxLife);
      ctx.fillStyle = ft.color;
      ctx.font = `bold ${ft.text === 'CRIT!' ? 14 : 11}px "Noto Sans SC", sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(ft.text, ft.x, ft.y);
    }
    ctx.globalAlpha = 1;
  }

  private _renderHUD(ctx: CanvasRenderingContext2D, state: GameState, levelUpSystem: any, sw: number, sh: number, dpr: number): void {
    const player = this.entities.get('player');
    const playerScreen = player
      ? this.camera.worldToScreen(player.x as number, player.y as number)
      : { x: sw / 2, y: sh / 2 };

    const hudState = {
      hp: state.playerHp,
      maxHp: state.playerMaxHp,
      xp: levelUpSystem.xp,
      xpToNext: levelUpSystem.xpToNext,
      level: levelUpSystem.level,
      weapons: state.weaponDefs.map((w: any, i: number) => ({
        name: w.name,
        level: levelUpSystem.getContext().weaponLevels.get(w.id) ?? 1,
        cooldown: state.weaponCooldowns[i] ?? 0,
        maxCooldown: w.fireRate * levelUpSystem.getWeaponFireRateMultiplier(w.id),
        color: w.color ?? '#ffffff',
      })),
      kills: state.kills,
      score: state.score,
      elapsed: state.elapsed,
      dpr,
      playerScreenX: playerScreen.x,
      playerScreenY: playerScreen.y,
    };

    this.hudRenderer.render(ctx, hudState);
  }

  resize(): void {
    this.renderer.resize();
    this.camera.resize(this.renderer.width, this.renderer.height);
    this.bg.resize(this.renderer.width, this.renderer.height);
  }
}
