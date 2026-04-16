import { Howl, Howler } from 'howler';

class AudioManager {
  private static _instance: AudioManager;
  static get instance(): AudioManager {
    if (!AudioManager._instance) AudioManager._instance = new AudioManager();
    return AudioManager._instance;
  }

  private sounds: Map<string, Howl> = new Map();
  private music: Howl | null = null;
  private _musicVolume = 0.5;
  private _sfxVolume = 0.7;
  private _muted = false;

  init(): void {
    Howler.volume(this._muted ? 0 : 1);
  }

  registerSfx(name: string, src: string | string[], volume?: number): void {
    if (this.sounds.has(name)) return;
    const howl = new Howl({ src: Array.isArray(src) ? src : [src], volume: volume ?? this._sfxVolume, preload: false });
    this.sounds.set(name, howl);
  }

  registerMusic(name: string, src: string | string[], volume?: number): void {
    if (this.sounds.has(name)) return;
    const howl = new Howl({ src: Array.isArray(src) ? src : [src], volume: volume ?? this._musicVolume, loop: true, preload: false });
    this.sounds.set(name, howl);
  }

  playSfx(name: string): void {
    const sfx = this.sounds.get(name);
    if (!sfx) return;
    sfx.volume(this._muted ? 0 : this._sfxVolume);
    sfx.play();
  }

  playMusic(name: string, fadeIn = 500): void {
    const next = this.sounds.get(name);
    if (!next) return;

    if (this.music && this.music !== next) {
      const prev = this.music;
      const curVol = this._muted ? 0 : this._musicVolume;
      prev.fade(curVol, 0, 300);
      setTimeout(() => { prev.stop(); }, 350);
    }

    this.music = next;
    next.volume(this._muted ? 0 : 0);
    next.play();
    if (!this._muted) {
      next.fade(0, this._musicVolume, fadeIn);
    }
  }

  stopMusic(fadeOut = 500): void {
    if (!this.music) return;
    const curVol = this._muted ? 0 : this._musicVolume;
    this.music.fade(curVol, 0, fadeOut);
    const ref = this.music;
    setTimeout(() => { ref.stop(); }, fadeOut + 50);
    this.music = null;
  }

  pauseAll(): void {
    Howler.volume(0);
  }

  resumeAll(): void {
    Howler.volume(this._muted ? 0 : 1);
  }

  setMusicVolume(v: number): void {
    this._musicVolume = Math.max(0, Math.min(1, v));
    if (this.music && !this._muted) this.music.volume(this._musicVolume);
  }

  setSfxVolume(v: number): void {
    this._sfxVolume = Math.max(0, Math.min(1, v));
  }

  setMuted(m: boolean): void {
    this._muted = m;
    Howler.mute(m);
  }

  preloadAll(): void {
    this.sounds.forEach((howl) => howl.load());
  }
}

export const audioManager = AudioManager.instance;
export { AudioManager };
