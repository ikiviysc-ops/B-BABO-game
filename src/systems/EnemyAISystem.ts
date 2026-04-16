/**
 * 敌人 AI 系统 — FSM 有限状态机
 *
 * 支持 12 种敌人独特行为 + 分离力避免重叠
 */

import { EntityManager, type Entity } from '@engine/EntityManager';

// ─── 类型定义 ─────────────────────────────────────────────

export type EnemyState = 'idle' | 'patrol' | 'chase' | 'attack' | 'retreat' | 'special' | 'stunned';

export interface EnemyAI {
  state: EnemyState;
  stateTimer: number;
  patrolTarget: { x: number; y: number } | null;
  specialCooldown: number;
  specialTimer: number;
  stunTimer: number;
  detectionRange: number;
  attackRange: number;
  /** 蝙蝠盘旋角度 */
  orbitAngle: number;
  /** 死亡骑士冲锋剩余时间 */
  chargeTimer: number;
  /** 邪眼激光剩余时间 */
  laserTimer: number;
  /** 巨型僵尸前摇时间 */
  windUpTimer: number;
  /** 前摇阶段标记 */
  isWindingUp: boolean;
}

/** 敌人实体扩展 */
export interface EnemyEntity extends Entity {
  enemyId: string;
  currentHp: number;
  maxHp: number;
  attackTimer: number;
  ai: EnemyAI;
}

// ─── 敌人 AI 配置 ─────────────────────────────────────────

interface EnemyAIConfig {
  detectionRange: number;
  attackRange: number;
  specialCooldown: number;
}

const AI_CONFIGS: Record<string, EnemyAIConfig> = {
  rotting_rat:     { detectionRange: 600, attackRange: 20,  specialCooldown: 999 },
  skeleton:        { detectionRange: 600, attackRange: 30,  specialCooldown: 999 },
  night_bat:       { detectionRange: 600, attackRange: 20,  specialCooldown: 999 },
  thorn_vine:      { detectionRange: 600, attackRange: 200, specialCooldown: 2.0 },
  fire_slime:      { detectionRange: 600, attackRange: 20,  specialCooldown: 999 },
  ice_slime:       { detectionRange: 600, attackRange: 20,  specialCooldown: 999 },
  lightning_wisp:  { detectionRange: 600, attackRange: 150, specialCooldown: 3.0 },
  skeleton_archer: { detectionRange: 600, attackRange: 300, specialCooldown: 1.5 },
  evil_eye:        { detectionRange: 600, attackRange: 250, specialCooldown: 5.0 },
  death_knight:    { detectionRange: 600, attackRange: 45,  specialCooldown: 8.0 },
  vampire:         { detectionRange: 600, attackRange: 35,  specialCooldown: 999 },
  giant_zombie:    { detectionRange: 600, attackRange: 60,  specialCooldown: 2.0 },
};

function getConfig(enemyId: string): EnemyAIConfig {
  return AI_CONFIGS[enemyId] ?? { detectionRange: 300, attackRange: 30, specialCooldown: 999 };
}

// ─── 伪随机（确定性） ─────────────────────────────────────

function seededRandom(seed: number): number {
  const x = Math.sin(seed * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
}

// ─── 主系统 ───────────────────────────────────────────────

export class EnemyAISystem {

  update(entities: EntityManager, playerX: number, playerY: number, dt: number): void {
    const enemies: EnemyEntity[] = entities.getAll().filter(
      (e): e is EnemyEntity => 'enemyId' in e && 'ai' in e && e.active,
    );

    // 1. 更新每个敌人的 FSM
    for (const enemy of enemies) {
      this.updateFSM(enemy, playerX, playerY, dt, enemies);
    }

    // 2. 分离力（避免重叠）
    this.applySeparation(enemies, dt);
  }

  // ─── FSM 核心 ───────────────────────────────────────────

  private updateFSM(
    enemy: EnemyEntity,
    px: number, py: number,
    dt: number,
    _allEnemies: EnemyEntity[],
  ): void {
    const ai = enemy.ai;
    const dx = px - enemy.x;
    const dy = py - enemy.y;
    const dist = Math.sqrt(dx * dx + dy * dy) || 1;
    const nx = dx / dist;
    const ny = dy / dist;

    // 全局计时器
    ai.stateTimer -= dt;
    ai.specialCooldown -= dt;
    ai.stunTimer -= dt;

    // 眩晕状态优先
    if (ai.stunTimer > 0) {
      ai.state = 'stunned';
      return;
    }

    // 根据敌人类型分发行为
    switch (enemy.enemyId) {
      case 'rotting_rat':
        this.behaviorRottingRat(enemy, ai, nx, ny, dist, dt);
        break;
      case 'skeleton':
        this.behaviorSkeleton(enemy, ai, nx, ny, dist, dt);
        break;
      case 'night_bat':
        this.behaviorNightBat(enemy, ai, px, py, dist, dt);
        break;
      case 'thorn_vine':
        this.behaviorThornVine(enemy, ai, nx, ny, dist, dt);
        break;
      case 'fire_slime':
        this.behaviorFireSlime(enemy, ai, nx, ny, dist, dt);
        break;
      case 'ice_slime':
        this.behaviorIceSlime(enemy, ai, nx, ny, dist, dt);
        break;
      case 'lightning_wisp':
        this.behaviorLightningWisp(enemy, ai, nx, ny, dist, dt);
        break;
      case 'skeleton_archer':
        this.behaviorSkeletonArcher(enemy, ai, nx, ny, dist, dt);
        break;
      case 'evil_eye':
        this.behaviorEvilEye(enemy, ai, nx, ny, dist, dt);
        break;
      case 'death_knight':
        this.behaviorDeathKnight(enemy, ai, nx, ny, dist, dt);
        break;
      case 'vampire':
        this.behaviorVampire(enemy, ai, nx, ny, dist, dt);
        break;
      case 'giant_zombie':
        this.behaviorGiantZombie(enemy, ai, nx, ny, dist, dt);
        break;
      default:
        // 默认：简单追踪
        if (dist > ai.attackRange) {
          enemy.x += nx * enemy.speed * dt;
          enemy.y += ny * enemy.speed * dt;
        }
    }
  }

  // ─── 12 种敌人行为 ──────────────────────────────────────

  /** 1. 腐烂鼠 — 快速直线冲向玩家 */
  private behaviorRottingRat(
    enemy: EnemyEntity, ai: EnemyAI,
    nx: number, ny: number, dist: number, dt: number,
  ): void {
    if (dist > ai.detectionRange) {
      this.doPatrol(enemy, ai, dt);
    } else {
      ai.state = 'chase';
      enemy.x += nx * enemy.speed * dt;
      enemy.y += ny * enemy.speed * dt;
    }
  }

  /** 2. 骷髅兵 — 接近后挥剑攻击，有攻击前摇 */
  private behaviorSkeleton(
    enemy: EnemyEntity, ai: EnemyAI,
    nx: number, ny: number, dist: number, dt: number,
  ): void {
    if (dist > ai.detectionRange) {
      this.doPatrol(enemy, ai, dt);
      return;
    }

    if (dist <= ai.attackRange) {
      if (ai.state !== 'attack') {
        ai.state = 'attack';
        ai.stateTimer = 0.4; // 前摇 0.4 秒
        ai.isWindingUp = true;
      }
      if (ai.isWindingUp) {
        // 前摇阶段不移动
        if (ai.stateTimer <= 0) {
          ai.isWindingUp = false;
          // 攻击判定由 CombatSystem 处理
          ai.stateTimer = 0.6; // 攻击冷却
        }
      } else {
        // 攻击后冷却
        if (ai.stateTimer <= 0) {
          ai.state = 'chase';
        }
      }
    } else {
      ai.state = 'chase';
      ai.isWindingUp = false;
      enemy.x += nx * enemy.speed * dt;
      enemy.y += ny * enemy.speed * dt;
    }
  }

  /** 3. 暗夜蝙蝠 — 高速移动，在玩家周围盘旋 */
  private behaviorNightBat(
    enemy: EnemyEntity, ai: EnemyAI,
    px: number, py: number, dist: number, dt: number,
  ): void {
    if (dist > ai.detectionRange) {
      this.doPatrol(enemy, ai, dt);
      return;
    }

    ai.state = 'chase';
    const orbitRadius = 80;
    const orbitSpeed = 3.0;

    // 盘旋角度递增
    ai.orbitAngle += orbitSpeed * dt;

    // 目标点：玩家周围圆周
    const targetX = px + Math.cos(ai.orbitAngle) * orbitRadius;
    const targetY = py + Math.sin(ai.orbitAngle) * orbitRadius;

    const tdx = targetX - enemy.x;
    const tdy = targetY - enemy.y;
    const tdist = Math.sqrt(tdx * tdx + tdy * tdy) || 1;

    // 高速移向盘旋点
    enemy.x += (tdx / tdist) * enemy.speed * dt;
    enemy.y += (tdy / tdist) * enemy.speed * dt;
  }

  /** 4. 荆棘藤蔓 — 固定不动，周期性发射弹幕 */
  private behaviorThornVine(
    enemy: EnemyEntity, ai: EnemyAI,
    _nx: number, _ny: number, dist: number, dt: number,
  ): void {
    // 速度为 0，不移动
    enemy.speed = 0;

    if (dist > ai.detectionRange) {
      ai.state = 'idle';
      return;
    }

    ai.state = 'special';
    // 弹幕发射由外部系统（CombatSystem）通过 specialTimer 触发
    ai.specialTimer -= dt;
    if (ai.specialTimer <= 0) {
      ai.specialTimer = ai.attackRange > 0 ? 2.0 : 2.0; // 每 2 秒一次
      // 标记需要发射弹幕 — 由 Game.ts 读取
      ai.stateTimer = 0.3; // 短暂"攻击"动画
    }
  }

  /** 5. 火焰史莱姆 — 缓慢追踪，死亡时爆炸 */
  private behaviorFireSlime(
    enemy: EnemyEntity, ai: EnemyAI,
    nx: number, ny: number, dist: number, dt: number,
  ): void {
    if (dist > ai.detectionRange) {
      this.doPatrol(enemy, ai, dt);
    } else {
      ai.state = 'chase';
      enemy.x += nx * enemy.speed * dt;
      enemy.y += ny * enemy.speed * dt;
    }
    // 死亡爆炸在 CombatSystem 的 onKill 回调中处理
  }

  /** 6. 冰霜史莱姆 — 缓慢追踪，攻击附带冰冻 */
  private behaviorIceSlime(
    enemy: EnemyEntity, ai: EnemyAI,
    nx: number, ny: number, dist: number, dt: number,
  ): void {
    if (dist > ai.detectionRange) {
      this.doPatrol(enemy, ai, dt);
    } else {
      ai.state = 'chase';
      enemy.x += nx * enemy.speed * dt;
      enemy.y += ny * enemy.speed * dt;
    }
    // 冰冻效果在碰撞时由 Game.ts 处理
  }

  /** 7. 雷电精灵 — 保持距离，发射闪电 */
  private behaviorLightningWisp(
    enemy: EnemyEntity, ai: EnemyAI,
    nx: number, ny: number, dist: number, dt: number,
  ): void {
    const preferredDist = 120;

    if (dist > ai.detectionRange) {
      this.doPatrol(enemy, ai, dt);
      return;
    }

    // 保持距离
    if (dist < preferredDist - 20) {
      ai.state = 'retreat';
      enemy.x -= nx * enemy.speed * dt;
      enemy.y -= ny * enemy.speed * dt;
    } else if (dist > preferredDist + 20) {
      ai.state = 'chase';
      enemy.x += nx * enemy.speed * dt;
      enemy.y += ny * enemy.speed * dt;
    } else {
      ai.state = 'special';
      // 闪电发射冷却
      ai.specialTimer -= dt;
      if (ai.specialTimer <= 0) {
        ai.specialTimer = 3.0;
        ai.stateTimer = 0.5;
      }
    }
  }

  /** 8. 骷髅弓手 — 保持 150-250px 距离，射箭 */
  private behaviorSkeletonArcher(
    enemy: EnemyEntity, ai: EnemyAI,
    nx: number, ny: number, dist: number, dt: number,
  ): void {
    const minDist = 150;
    const maxDist = 250;

    if (dist > ai.detectionRange) {
      this.doPatrol(enemy, ai, dt);
      return;
    }

    if (dist < minDist) {
      // 太近了，后退
      ai.state = 'retreat';
      enemy.x -= nx * enemy.speed * dt;
      enemy.y -= ny * enemy.speed * dt;
    } else if (dist > maxDist) {
      // 太远了，靠近
      ai.state = 'chase';
      enemy.x += nx * enemy.speed * dt;
      enemy.y += ny * enemy.speed * dt;
    } else {
      // 在理想距离内，射箭
      ai.state = 'attack';
      ai.specialTimer -= dt;
      if (ai.specialTimer <= 0) {
        ai.specialTimer = 1.5;
        ai.stateTimer = 0.3; // 射箭前摇
      }
    }
  }

  /** 9. 邪眼 — 缓慢追踪，追踪激光持续 2 秒 */
  private behaviorEvilEye(
    enemy: EnemyEntity, ai: EnemyAI,
    nx: number, ny: number, dist: number, dt: number,
  ): void {
    if (dist > ai.detectionRange) {
      this.doPatrol(enemy, ai, dt);
      return;
    }

    // 激光冷却
    if (ai.laserTimer > 0) {
      ai.laserTimer -= dt;
      ai.state = 'special';
      // 激光期间缓慢追踪
      enemy.x += nx * enemy.speed * 0.3 * dt;
      enemy.y += ny * enemy.speed * 0.3 * dt;
      return;
    }

    // 正常追踪
    ai.state = 'chase';
    enemy.x += nx * enemy.speed * dt;
    enemy.y += ny * enemy.speed * dt;

    // 进入激光范围时触发
    if (dist < ai.attackRange && ai.specialCooldown <= 0) {
      ai.laserTimer = 2.0;
      ai.specialCooldown = 5.0;
    }
  }

  /** 10. 死亡骑士 — 正常追踪，每 8 秒冲锋 */
  private behaviorDeathKnight(
    enemy: EnemyEntity, ai: EnemyAI,
    nx: number, ny: number, dist: number, dt: number,
  ): void {
    if (dist > ai.detectionRange) {
      this.doPatrol(enemy, ai, dt);
      return;
    }

    // 冲锋中
    if (ai.chargeTimer > 0) {
      ai.state = 'special';
      ai.chargeTimer -= dt;
      const chargeSpeed = enemy.speed * 3;
      enemy.x += nx * chargeSpeed * dt;
      enemy.y += ny * chargeSpeed * dt;
      return;
    }

    // 正常追踪
    ai.state = 'chase';
    enemy.x += nx * enemy.speed * dt;
    enemy.y += ny * enemy.speed * dt;

    // 触发冲锋
    if (dist < 200 && ai.specialCooldown <= 0) {
      ai.chargeTimer = 0.6; // 冲锋持续 0.6 秒
      ai.specialCooldown = 8.0;
    }
  }

  /** 11. 吸血鬼 — 快速追踪，血量 < 30% 时狂暴 */
  private behaviorVampire(
    enemy: EnemyEntity, ai: EnemyAI,
    nx: number, ny: number, dist: number, dt: number,
  ): void {
    if (dist > ai.detectionRange) {
      this.doPatrol(enemy, ai, dt);
      return;
    }

    // 狂暴模式
    const hpRatio = enemy.currentHp / enemy.maxHp;
    const speedMult = hpRatio < 0.3 ? 1.5 : 1.0;

    ai.state = hpRatio < 0.3 ? 'special' : 'chase';
    enemy.x += nx * enemy.speed * speedMult * dt;
    enemy.y += ny * enemy.speed * speedMult * dt;
  }

  /** 12. 巨型僵尸 — 缓慢追踪，攻击有 1 秒前摇 */
  private behaviorGiantZombie(
    enemy: EnemyEntity, ai: EnemyAI,
    nx: number, ny: number, dist: number, dt: number,
  ): void {
    if (dist > ai.detectionRange) {
      this.doPatrol(enemy, ai, dt);
      return;
    }

    if (dist <= ai.attackRange) {
      if (ai.state !== 'attack') {
        ai.state = 'attack';
        ai.windUpTimer = 1.0; // 1 秒前摇
        ai.isWindingUp = true;
      }

      if (ai.isWindingUp) {
        ai.windUpTimer -= dt;
        // 前摇阶段不移动
        if (ai.windUpTimer <= 0) {
          ai.isWindingUp = false;
          // 攻击判定 + 击退由外部处理
          ai.stateTimer = 2.0; // 攻击冷却
        }
      } else {
        if (ai.stateTimer <= 0) {
          ai.state = 'chase';
        }
      }
    } else {
      ai.state = 'chase';
      ai.isWindingUp = false;
      enemy.x += nx * enemy.speed * dt;
      enemy.y += ny * enemy.speed * dt;
    }
  }

  // ─── 巡逻行为 ───────────────────────────────────────────

  private doPatrol(enemy: EnemyEntity, ai: EnemyAI, dt: number): void {
    ai.state = 'patrol';

    if (!ai.patrolTarget || ai.stateTimer <= 0) {
      // 生成新巡逻点（基于敌人位置的伪随机）
      const seed = enemy.id * 13 + Date.now() % 10000;
      const angle = seededRandom(seed) * Math.PI * 2;
      const radius = 60 + seededRandom(seed + 1) * 100;
      ai.patrolTarget = {
        x: enemy.x + Math.cos(angle) * radius,
        y: enemy.y + Math.sin(angle) * radius,
      };
      ai.stateTimer = 2 + seededRandom(seed + 2) * 3; // 2-5 秒换方向
    }

    const pdx = ai.patrolTarget.x - enemy.x;
    const pdy = ai.patrolTarget.y - enemy.y;
    const pdist = Math.sqrt(pdx * pdx + pdy * pdy) || 1;

    if (pdist > 5) {
      enemy.x += (pdx / pdist) * enemy.speed * 0.4 * dt;
      enemy.y += (pdy / pdist) * enemy.speed * 0.4 * dt;
    }
  }

  // ─── 分离力 ─────────────────────────────────────────────

  private applySeparation(enemies: EnemyEntity[], _dt: number): void {
    const separationDist = 1.5;
    const forceStrength = 80;
    const maxProcess = 60; // 最多处理60个敌人的分离力
    const len = Math.min(enemies.length, maxProcess);

    for (let i = 0; i < len; i++) {
      const a = enemies[i];
      if (a.speed <= 0) continue;

      let sepX = 0;
      let sepY = 0;

      for (let j = 0; j < len; j++) {
        if (i === j) continue;
        const b = enemies[j];

        const dx = a.x - b.x;
        const dy = a.y - b.y;

        // 快速距离跳过（曼哈顿距离）
        if (Math.abs(dx) > 40 || Math.abs(dy) > 40) continue;

        const distSq = dx * dx + dy * dy;
        const minDist = (a.width / 2 + b.width / 2) * separationDist;
        const minDistSq = minDist * minDist;

        if (distSq < minDistSq) {
          const dist = Math.sqrt(distSq) || 1;
          const force = (minDist - dist) / minDist * forceStrength;
          sepX += (dx / dist) * force;
          sepY += (dy / dist) * force;
        }
      }

      a.x += sepX * 0.016;
      a.y += sepY * 0.016;
    }
  }

  // ─── 工具方法 ───────────────────────────────────────────

  /** 创建默认 AI 数据 */
  static createAI(enemyId: string): EnemyAI {
    const cfg = getConfig(enemyId);
    return {
      state: 'idle',
      stateTimer: 1.0,
      patrolTarget: null,
      specialCooldown: cfg.specialCooldown * 0.5, // 首次特殊攻击更快
      specialTimer: cfg.specialCooldown,
      stunTimer: 0,
      detectionRange: cfg.detectionRange,
      attackRange: cfg.attackRange,
      orbitAngle: Math.random() * Math.PI * 2,
      chargeTimer: 0,
      laserTimer: 0,
      windUpTimer: 0,
      isWindingUp: false,
    };
  }
}
