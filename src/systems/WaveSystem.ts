/**
 * 波次系统 — 管理敌人生成和波次推进
 */

import { EntityManager } from '@engine/EntityManager';
import { EnemyFactory } from '@entities/EnemyFactory';

/** 波次配置 */
interface WaveConfig {
  wave: number;
  enemies: { id: string; count: number }[];
  spawnInterval: number; // 生成间隔（秒）
  spawnRadius: number;   // 生成半径（距玩家）
}

/** 波次推进表（前25波） */
const WAVE_TABLE: WaveConfig[] = [
  { wave: 1,  enemies: [{ id: 'rotting_rat', count: 8 }], spawnInterval: 1.5, spawnRadius: 400 },
  { wave: 2,  enemies: [{ id: 'rotting_rat', count: 6 }, { id: 'night_bat', count: 3 }], spawnInterval: 1.3, spawnRadius: 420 },
  { wave: 3,  enemies: [{ id: 'rotting_rat', count: 5 }, { id: 'skeleton', count: 4 }, { id: 'thorn_vine', count: 2 }], spawnInterval: 1.2, spawnRadius: 440 },
  { wave: 4,  enemies: [{ id: 'skeleton', count: 5 }, { id: 'fire_slime', count: 3 }, { id: 'ice_slime', count: 3 }], spawnInterval: 1.1, spawnRadius: 460 },
  { wave: 5,  enemies: [{ id: 'skeleton', count: 4 }, { id: 'night_bat', count: 4 }, { id: 'lightning_wisp', count: 2 }], spawnInterval: 1.0, spawnRadius: 480 },
  { wave: 6,  enemies: [{ id: 'fire_slime', count: 4 }, { id: 'ice_slime', count: 4 }, { id: 'evil_eye', count: 1 }], spawnInterval: 1.0, spawnRadius: 500 },
  { wave: 7,  enemies: [{ id: 'skeleton', count: 5 }, { id: 'skeleton_archer', count: 3 }, { id: 'lightning_wisp', count: 3 }], spawnInterval: 0.9, spawnRadius: 520 },
  { wave: 8,  enemies: [{ id: 'death_knight', count: 1 }, { id: 'skeleton', count: 6 }, { id: 'night_bat', count: 5 }], spawnInterval: 0.9, spawnRadius: 540 },
  { wave: 9,  enemies: [{ id: 'skeleton_archer', count: 4 }, { id: 'fire_slime', count: 5 }, { id: 'ice_slime', count: 5 }], spawnInterval: 0.8, spawnRadius: 560 },
  { wave: 10, enemies: [{ id: 'death_knight', count: 2 }, { id: 'evil_eye', count: 2 }, { id: 'skeleton', count: 8 }], spawnInterval: 0.8, spawnRadius: 580 },
  { wave: 11, enemies: [{ id: 'vampire', count: 1 }, { id: 'skeleton_archer', count: 5 }, { id: 'night_bat', count: 6 }], spawnInterval: 0.7, spawnRadius: 600 },
  { wave: 12, enemies: [{ id: 'thorn_vine', count: 4 }, { id: 'lightning_wisp', count: 4 }, { id: 'evil_eye', count: 2 }], spawnInterval: 0.7, spawnRadius: 620 },
  { wave: 13, enemies: [{ id: 'death_knight', count: 2 }, { id: 'vampire', count: 2 }, { id: 'fire_slime', count: 6 }], spawnInterval: 0.7, spawnRadius: 640 },
  { wave: 14, enemies: [{ id: 'skeleton_archer', count: 6 }, { id: 'ice_slime', count: 6 }, { id: 'giant_zombie', count: 1 }], spawnInterval: 0.6, spawnRadius: 660 },
  { wave: 15, enemies: [{ id: 'vampire', count: 2 }, { id: 'evil_eye', count: 3 }, { id: 'lightning_wisp', count: 5 }], spawnInterval: 0.6, spawnRadius: 680 },
  { wave: 16, enemies: [{ id: 'death_knight', count: 3 }, { id: 'giant_zombie', count: 2 }, { id: 'skeleton', count: 10 }], spawnInterval: 0.6, spawnRadius: 700 },
  { wave: 17, enemies: [{ id: 'vampire', count: 3 }, { id: 'evil_eye', count: 3 }, { id: 'thorn_vine', count: 5 }], spawnInterval: 0.5, spawnRadius: 720 },
  { wave: 18, enemies: [{ id: 'lightning_wisp', count: 6 }, { id: 'skeleton_archer', count: 6 }, { id: 'death_knight', count: 3 }], spawnInterval: 0.5, spawnRadius: 740 },
  { wave: 19, enemies: [{ id: 'giant_zombie', count: 3 }, { id: 'vampire', count: 3 }, { id: 'evil_eye', count: 4 }], spawnInterval: 0.5, spawnRadius: 760 },
  { wave: 20, enemies: [{ id: 'death_knight', count: 4 }, { id: 'giant_zombie', count: 3 }, { id: 'vampire', count: 4 }], spawnInterval: 0.5, spawnRadius: 780 },
];

export class WaveSystem {
  private _currentWave = 0;
  private _spawnQueue: { id: string }[] = [];
  private _spawnTimer = 0;
  private _spawnInterval = 1;
  private _waveActive = false;
  private _waveComplete = false;
  private _totalKills = 0;
  private _waveKills = 0;
  private _totalEnemiesThisWave = 0;

  get currentWave(): number { return this._currentWave; }
  get waveActive(): boolean { return this._waveActive; }
  get waveComplete(): boolean { return this._waveComplete; }
  get totalKills(): number { return this._totalKills; }
  get totalEnemiesThisWave(): number { return this._totalEnemiesThisWave; }
  get waveKills(): number { return this._waveKills; }

  /** 开始下一波 */
  startNextWave(): void {
    this._currentWave++;
    this._waveKills = 0;
    this._waveActive = true;
    this._waveComplete = false;

    const config = this.getWaveConfig(this._currentWave);
    if (!config) {
      // 超过预定义波次，生成随机混合波次
      this._generateRandomWave(this._currentWave);
      return;
    }

    this._spawnInterval = config.spawnInterval;
    this._spawnQueue = [];
    for (const entry of config.enemies) {
      for (let i = 0; i < entry.count; i++) {
        this._spawnQueue.push({ id: entry.id });
      }
    }
    this._totalEnemiesThisWave = this._spawnQueue.length;
    this._spawnTimer = 0;

    console.log(`[WaveSystem] Wave ${this._currentWave}: ${this._totalEnemiesThisWave} enemies`);
  }

  /** 获取波次配置 */
  private getWaveConfig(wave: number): WaveConfig | undefined {
    if (wave <= WAVE_TABLE.length) return WAVE_TABLE[wave - 1];
    return undefined;
  }

  /** 生成随机波次（超过预定义表后） */
  private _generateRandomWave(wave: number): void {
    const allEnemyIds = ['rotting_rat', 'skeleton', 'night_bat', 'fire_slime', 'ice_slime',
      'lightning_wisp', 'skeleton_archer', 'evil_eye', 'death_knight', 'vampire', 'giant_zombie', 'thorn_vine'];
    const count = Math.min(10 + wave * 2, 50);
    this._spawnQueue = [];
    for (let i = 0; i < count; i++) {
      const id = allEnemyIds[Math.floor(Math.random() * allEnemyIds.length)];
      this._spawnQueue.push({ id });
    }
    this._totalEnemiesThisWave = count;
    this._spawnInterval = Math.max(0.3, 1.0 - wave * 0.02);
    this._spawnTimer = 0;
  }

  /** 每帧更新 */
  update(dt: number, entities: EntityManager, playerX: number, playerY: number): void {
    if (!this._waveActive) return;

    // 生成敌人
    this._spawnTimer += dt;
    if (this._spawnTimer >= this._spawnInterval && this._spawnQueue.length > 0) {
      this._spawnTimer = 0;
      const entry = this._spawnQueue.shift()!;
      const angle = Math.random() * Math.PI * 2;
      const radius = 500 + Math.random() * 200;
      const x = playerX + Math.cos(angle) * radius;
      const y = playerY + Math.sin(angle) * radius;
      const enemy = EnemyFactory.createEnemy(entry.id, x, y, 2);
      entities.add(enemy);
    }

    // 检查波次完成
    if (this._spawnQueue.length === 0) {
      const enemyCount = entities.getAll().filter(e => 'enemyId' in e).length;
      if (enemyCount === 0) {
        this._waveActive = false;
        this._waveComplete = true;
        console.log(`[WaveSystem] Wave ${this._currentWave} complete!`);
      }
    }
  }

  /** 通知击杀 */
  onKill(): void {
    this._totalKills++;
    this._waveKills++;
  }
}
