/**
 * UI 主题常量 — 统一颜色、布局、动画参数
 * 参考 Vampire Survivors 暗色调风格
 */

// ═══════════════════════════════════════════════════════
// 颜色系统
// ═══════════════════════════════════════════════════════

export const UI = {
  /** 背景色 */
  bg: {
    overlay: 'rgba(0,0,0,0.65)',
    primary: '#0a0a1a',
    secondary: '#12122a',
    tertiary: '#1a1a3a',
  },

  /** 文字色 */
  text: {
    primary: '#e8e8f0',
    secondary: '#a0a0b8',
    tertiary: '#6868888',
    gold: '#ffd700',
    xp: '#88ccff',
  },

  /** 强调色 */
  accent: {
    red: '#ff4444',
    green: '#44ff88',
    blue: '#4488ff',
    gold: '#ffcc00',
  },

  /** 面板 */
  panel: {
    border: 'rgba(255,255,255,0.08)',
    borderStrong: 'rgba(255,255,255,0.15)',
    bg: 'rgba(20,20,50,0.9)',
  },

  /** 进度条 */
  bar: {
    xp: {
      bg: '#1a1a3a',
      fill: '#2266cc',
      hi: '#44aaff',
      border: '#334466',
    },
    hp: {
      bg: '#2a0a0a',
      fill: '#cc2222',
      hi: '#ff4444',
      border: '#442222',
    },
  },
} as const;

// ═══════════════════════════════════════════════════════
// HUD 布局常量
// ═══════════════════════════════════════════════════════

export const HUD = {
  xpBarHeight: 8,
  timerSize: 16,
  statsSize: 14,
} as const;

// ═══════════════════════════════════════════════════════
// 武器槽位
// ═══════════════════════════════════════════════════════

export const WEAPON_SLOT = {
  size: 40,
  gap: 4,
  cols: 6,
} as const;

// ═══════════════════════════════════════════════════════
// 卡片布局
// ═══════════════════════════════════════════════════════

export const CARD = {
  width: 160,
  height: 220,
  gap: 16,
  padding: 12,
  radius: 8,
  iconSize: 48,
} as const;

// ═══════════════════════════════════════════════════════
// 动画
// ═══════════════════════════════════════════════════════

export const duration = {
  fast: 150,
  normal: 300,
  slow: 600,
} as const;

export const easing = {
  easeOutBack: (t: number): number => {
    const c1 = 1.70158;
    const c3 = c1 + 1;
    return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
  },
  easeOutCubic: (t: number): number => 1 - Math.pow(1 - t, 3),
  easeInOutQuad: (t: number): number =>
    t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2,
};
