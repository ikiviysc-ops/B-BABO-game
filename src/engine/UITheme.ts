// UITheme.ts - Design Tokens常量

// 颜色系统
export const COLORS = {
  bg: '#1a1a2e',
  bgDark: '#0f0f1a',
  bgLight: '#252540',
  text: '#e0e0e0',
  textDim: '#888899',
  accent: '#e94560',
  accentLight: '#ff6b81',
  bar: '#16213e',
  barFill: '#0f3460',
  panel: '#1e1e36',
  panelBorder: '#2a2a4a',
  hp: '#e94560',
  hpBg: '#4a1525',
  mp: '#4361ee',
  mpBg: '#1a2555',
  xp: '#00ff88',
  xpBg: '#0a3322',
  gold: '#ffd700',
  white: '#ffffff',
  black: '#000000',
} as const;

// 稀有度颜色
export const RARITY = {
  SSR: { color: '#ffd700', glow: '#ffd70066', name: 'SSR' },
  SR:  { color: '#c850c0', glow: '#c850c066', name: 'SR' },
  R:   { color: '#4361ee', glow: '#4361ee66', name: 'R' },
  N:   { color: '#888899', glow: '#88889944', name: 'N' },
} as const;

export type RarityKey = keyof typeof RARITY;

// HUD布局
export const HUD = {
  top: 16,
  left: 16,
  right: 16,
  bottom: 16,
  barWidth: 200,
  barHeight: 16,
  barGap: 6,
  iconSize: 24,
  fontSize: 14,
  levelBadge: { size: 32, radius: 16 },
} as const;

// 卡片布局
export const CARD = {
  width: 160,
  height: 220,
  gap: 16,
  padding: 12,
  radius: 8,
  iconSize: 48,
  titleSize: 13,
  descSize: 11,
  rarityBorder: 3,
} as const;

// 动画easing
export const Easing = {
  easeOutBack(t: number): number {
    const c1 = 1.70158;
    const c3 = c1 + 1;
    return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
  },
  easeOutQuad(t: number): number {
    return 1 - (1 - t) * (1 - t);
  },
  easeInOutSine(t: number): number {
    return -(Math.cos(Math.PI * t) - 1) / 2;
  },
  linear(t: number): number {
    return t;
  },
} as const;

// 动画duration常量（秒）
export const DURATION = {
  fast: 0.15,
  normal: 0.3,
  slow: 0.5,
  cardFlip: 0.4,
  cardDeal: 0.3,
  levelUp: 1.0,
  fadeIn: 0.2,
  fadeOut: 0.3,
  shake: 0.2,
  pulse: 0.6,
} as const;

// 字体
export const FONT = {
  pixel: '"Press Start 2P", monospace',
  ui: '"Noto Sans SC", sans-serif',
  mono: '"Fira Code", monospace',
} as const;
