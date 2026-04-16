// WaveSystem.ts - 波次系统

import { ENEMY_DEFS, type EnemyDef } from '../data/EnemyDefs';

export interface WaveConfig {
  enemies: { id: string; count: number }[];
  spawnInterval: number; // 生成间隔(秒)
}

export interface SpawnRequest {
  def: EnemyDef;
  x: number;
  y: number;
}

/** 20波预定义配置 */
const WAVE_CONFIGS: WaveConfig[] = [
  // Wave 1 - 入门
  { enemies: [{ id: 'slime', count: 8 }], spawnInterval: 1.5 },
  // Wave 2
  { enemies: [{ id: 'slime', count: 10 }, { id: 'bat', count: 3 }], spawnInterval: 1.4 },
  // Wave 3
  { enemies: [{ id: 'slime', count: 8 }, { id: 'bat', count: 5 }], spawnInterval: 1.3 },
  // Wave 4
  { enemies: [{ id: 'skeleton', count: 6 }, { id: 'bat', count: 5 }], spawnInterval: 1.2 },
  // Wave 5 - 小Boss
  { enemies: [{ id: 'skeleton', count: 8 }, { id: 'goblin', count: 5 }], spawnInterval: 1.1 },
  // Wave 6
  { enemies: [{ id: 'goblin', count: 10 }, { id: 'bat', count: 8 }], spawnInterval: 1.0 },
  // Wave 7
  { enemies: [{ id: 'wizard', count: 3 }, { id: 'skeleton', count: 8 }], spawnInterval: 1.0 },
  // Wave 8
  { enemies: [{ id: 'demon', count: 3 }, { id: 'goblin', count: 10 }], spawnInterval: 0.9 },
  // Wave 9
  { enemies: [{ id: 'ghost', count: 6 }, { id: 'wizard', count: 4 }], spawnInterval: 0.9 },
  // Wave 10 - 中Boss
  { enemies: [{ id: 'demon', count: 5 }, { id: 'ghost', count: 5 }, { id: 'wizard', count: 3 }], spawnInterval: 0.8 },
  // Wave 11
  { enemies: [{ id: 'gargoyle', count: 4 }, { id: 'demon', count: 5 }], spawnInterval: 0.8 },
  // Wave 12
  { enemies: [{ id: 'elite_skeleton', count: 5 }, { id: 'ghost', count: 8 }], spawnInterval: 0.7 },
  // Wave 13
  { enemies: [{ id: 'shadow_assassin', count: 5 }, { id: 'gargoyle', count: 4 }], spawnInterval: 0.7 },
  // Wave 14
  { enemies: [{ id: 'demon', count: 8 }, { id: 'wizard', count: 5 }, { id: 'ghost', count: 5 }], spawnInterval: 0.6 },
  // Wave 15 - 大Boss前
  { enemies: [{ id: 'elite_skeleton', count: 8 }, { id: 'shadow_assassin', count: 6 }], spawnInterval: 0.6 },
  // Wave 16
  { enemies: [{ id: 'mega_slime', count: 2 }, { id: 'demon', count: 8 }], spawnInterval: 0.6 },
  // Wave 17
  { enemies: [{ id: 'mega_slime', count: 3 }, { id: 'gargoyle', count: 6 }], spawnInterval: 0.5 },
  // Wave 18
  { enemies: [{ id: 'dragon', count: 1 }, { id: 'elite_skeleton', count: 10 }], spawnInterval: 0.5 },
  // Wave 19
  { enemies: [{ id: 'dragon', count: 1 }, { id: 'demon', count: 10 }, { id: 'shadow_assassin', count: 8 }], spawnInterval: 0.4 },
  // Wave 20 - 最终Boss
  { enemies: [{ id: 'dragon', count: 2 }, { id: 'mega_slime', count: 3 }, { id: 'demon', count: 8 }], spawnInterval: 0.4 },
];

export class WaveSystem {
  /** 当前波次(1-based) */
  waveNum: number = 0;
  /** 本波剩余未生成的敌人数量 */
  enemiesRemaining: number = 0;
  /** 当前生成间隔 */
  private spawnInterval: number = 1.5;
  /** 生成计时器 */
  private spawnTimer: number = 0;
  /** 待生成的敌人队列 */
  private spawnQueue: { def: EnemyDef; count: number }[] = [];
  /** 是否所有波次已完成 */
  allWavesComplete: boolean = false;
  /** 波次间休息时间 */
  private waveRestTimer: number = 0;
  /** 波次间休息时长 */
  readonly waveRestDuration: number = 3.0;
  /** 是否正在休息 */
  isResting: boolean = false;
  /** 总共击杀数 */
  totalKills: number = 0;

  /**
   * 更新波次系统
   * @param dt 帧间隔(秒)
   * @param playerX 玩家X坐标
   * @param playerY 玩家Y坐标
   * @param spawnCallback 生成回调(def, x, y)
   */
  update(
    dt: number,
    playerX: number,
    playerY: number,
    spawnCallback: (def: EnemyDef, x: number, y: number) => void
  ): void {
    // 所有波次完成
    if (this.allWavesComplete) return;

    // 波次间休息
    if (this.isResting) {
      this.waveRestTimer -= dt;
      if (this.waveRestTimer <= 0) {
        this.isResting = false;
        this._startNextWave();
      }
      return;
    }

    // 首次启动
    if (this.waveNum === 0) {
      this._startNextWave();
      return;
    }

    // 生成敌人
    if (this.enemiesRemaining > 0) {
      this.spawnTimer -= dt;
      if (this.spawnTimer <= 0) {
        this.spawnTimer = this.spawnInterval;
        this._spawnEnemy(playerX, playerY, spawnCallback);
      }
    }

    // 当前波次所有敌人已生成且全部击杀
    if (this.enemiesRemaining <= 0 && this.spawnQueue.length === 0) {
      // 检查是否还有下一波
      if (this.waveNum > WAVE_CONFIGS.length) {
        this.allWavesComplete = true;
      } else {
        this.isResting = true;
        this.waveRestTimer = this.waveRestDuration;
      }
    }
  }

  /**
   * 敌人被击杀时调用
   */
  onKill(): void {
    this.totalKills++;
  }

  /**
   * 启动下一波
   */
  private _startNextWave(): void {
    this.waveNum++;
    if (this.waveNum > WAVE_CONFIGS.length) {
      this.allWavesComplete = true;
      return;
    }

    const config = WAVE_CONFIGS[this.waveNum - 1];
    this.spawnInterval = config.spawnInterval;
    this.spawnTimer = 0.5; // 首次快速生成
    this.spawnQueue = [];

    let total = 0;
    for (const entry of config.enemies) {
      const def = ENEMY_DEFS.find(d => d.id === entry.id);
      if (def) {
        this.spawnQueue.push({ def, count: entry.count });
        total += entry.count;
      }
    }

    this.enemiesRemaining = total;
  }

  /**
   * 生成一个敌人
   */
  private _spawnEnemy(
    playerX: number,
    playerY: number,
    callback: (def: EnemyDef, x: number, y: number) => void
  ): void {
    // 从队列中取出下一个敌人
    while (this.spawnQueue.length > 0) {
      const entry = this.spawnQueue[0];
      if (entry.count > 0) {
        entry.count--;
        this.enemiesRemaining--;

        // 在玩家周围随机位置生成(屏幕外)
        const angle = Math.random() * Math.PI * 2;
        const dist = 300 + Math.random() * 200;
        const x = playerX + Math.cos(angle) * dist;
        const y = playerY + Math.sin(angle) * dist;

        callback(entry.def, x, y);
        return;
      } else {
        this.spawnQueue.shift();
      }
    }
  }

  /**
   * 获取波次进度信息
   */
  getProgress(): { wave: number; totalWaves: number; kills: number; isResting: boolean; restTime: number } {
    return {
      wave: this.waveNum,
      totalWaves: WAVE_CONFIGS.length,
      kills: this.totalKills,
      isResting: this.isResting,
      restTime: this.isResting ? this.waveRestTimer : 0,
    };
  }

  /**
   * 重置波次系统
   */
  reset(): void {
    this.waveNum = 0;
    this.enemiesRemaining = 0;
    this.spawnInterval = 1.5;
    this.spawnTimer = 0;
    this.spawnQueue = [];
    this.allWavesComplete = false;
    this.waveRestTimer = 0;
    this.isResting = false;
    this.totalKills = 0;
  }
}
