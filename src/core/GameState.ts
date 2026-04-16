// GameState.ts - 游戏状态管理

export type GamePhase = 'menu' | 'charSelect' | 'playing' | 'levelUp' | 'gameOver';

export interface FloatText {
  x: number;
  y: number;
  text: string;
  color: string;
  life: number;
  maxLife: number;
}

export interface Pickup {
  x: number;
  y: number;
  type: 'xp' | 'heal';
  value: number;
  life: number;
  active: boolean;
}

export class GameState {
  // 游戏状态
  private _phase: GamePhase = 'menu';
  public selectedCharIndex = 0;
  public playerCharId = 'babo';

  // 运行时数据
  public floatTexts: FloatText[] = [];
  public pickups: Pickup[] = [];
  public weaponCooldowns: number[] = [];
  public weaponDefs: any[] = [];
  public elapsed = 0;
  public kills = 0;
  public score = 0;
  public playerHp = 100;
  public playerMaxHp = 100;
  public playerSpeed = 200;
  public playerArmor = 0;
  public playerCritChance = 5;
  public invincibleTimer = 0;
  public damageFlashTimer = 0;

  get phase(): GamePhase {
    return this._phase;
  }

  set phase(value: GamePhase) {
    this._phase = value;
  }

  reset(): void {
    this.floatTexts = [];
    this.pickups = [];
    this.weaponCooldowns = [];
    this.weaponDefs = [];
    this.elapsed = 0;
    this.kills = 0;
    this.score = 0;
    this.invincibleTimer = 0;
    this.damageFlashTimer = 0;
  }
}
