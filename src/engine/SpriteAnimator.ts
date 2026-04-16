export interface AnimFrame {
  sprite: HTMLCanvasElement;
  duration: number;
}

export interface AnimState {
  name: string;
  frames: AnimFrame[];
  loop: boolean;
}

export class SpriteAnimator {
  private states = new Map<string, AnimState>();
  private currentState: AnimState | null = null;
  private frameIndex = 0;
  private elapsed = 0;
  private finished = false;

  addState(state: AnimState): void {
    this.states.set(state.name, state);
  }

  play(stateName: string): void {
    if (this.currentState?.name === stateName && !this.finished) return;
    const state = this.states.get(stateName);
    if (!state) return;
    this.currentState = state;
    this.frameIndex = 0;
    this.elapsed = 0;
    this.finished = false;
  }

  update(dt: number): AnimFrame | null {
    if (!this.currentState || this.finished) return null;
    const frame = this.currentState.frames[this.frameIndex];
    if (!frame) return null;

    this.elapsed += dt * 1000;
    if (this.elapsed >= frame.duration) {
      this.elapsed -= frame.duration;
      this.frameIndex++;
      if (this.frameIndex >= this.currentState.frames.length) {
        if (this.currentState.loop) {
          this.frameIndex = 0;
        } else {
          this.frameIndex = this.currentState.frames.length - 1;
          this.finished = true;
        }
      }
    }
    return this.currentState.frames[this.frameIndex];
  }

  getCurrentFrame(): AnimFrame | null {
    if (!this.currentState) return null;
    return this.currentState.frames[this.frameIndex] ?? null;
  }

  getCurrentStateName(): string {
    return this.currentState?.name ?? '';
  }

  isFinished(): boolean {
    return this.finished;
  }
}
