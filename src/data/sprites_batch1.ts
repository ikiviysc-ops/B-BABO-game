/**
 * HIRONO 小野风格像素精灵 - 批次1
 *
 * 5个角色，每个保留HIRONO核心特征：
 * - 凌乱不规则碎短发
 * - 超大浮肿下垂眼皮（最标志性）
 * - 小红点鼻尖 + 粉红腮红
 * - 忧郁安静的表情
 * - 宽松外套/服装
 * - 低饱和度柔和色调
 *
 * 角色：
 * 1. warrior  — Shelter系列Warrior（武士头盔/护额，护甲外套，棕色暖调）
 * 2. mage     — Reshape系列Insight（第三只眼/额头宝石，长袍，深蓝紫调）
 * 3. ranger   — Little Mischief系列The Aviator（飞行员护目镜，围巾，橄榄绿调）
 * 4. guardian — Shelter系列Fort（厚重外套，大盾牌，灰蓝调）
 * 5. flame    — Reshape系列Burst（火焰发尖，爆裂外套，橙红调）
 */
import type { PixelData } from '@engine/PixelRenderer';

// ============================================================
// 1. WARRIOR — Shelter系列Warrior
// 武士头盔/护额，坚定表情，护甲外套，棕色暖色调
// ============================================================
const WARRIOR_PALETTE = {
  // 基础HIRONO色
  hair:    '#6b5240',
  hairHi:  '#8a6e5a',
  hairDk:  '#4a3828',
  skin:    '#f0dcc8',
  skinSh:  '#e0c8b0',
  blush:   '#e08888',
  nose:    '#cc6868',
  eyeW:    '#f6f2ee',
  eyeI:    '#3a2818',
  eyeB:    '#2a1e10',
  lid:     '#dcc0a8',
  lidSh:   '#c4a488',
  mouth:   '#b89080',
  coat:    '#8b6a50',
  coatHi:  '#a88068',
  coatDk:  '#5c4030',
  coatLn:  '#3e2a1c',
  inner:   '#e8d8c4',
  shoe:    '#4a3020',
  outline: '#2a1a0e',
  white:   '#ffffff',
  // 战士特有
  helmet:  '#7a8a90',
  helmetHi:'#98a8ae',
  helmetDk:'#4a5a60',
  armor:   '#8a7a68',
  armorHi: '#a89880',
  armorDk: '#5c5040',
};

const WARRIOR_SPRITE: PixelData = {
  width: 32,
  height: 32,
  pixels: [
    // Row 0-1: 武士头盔顶部
    ['','','','','','helmet','helmet','helmet','helmet','helmet','helmet','helmetHi','helmetHi','helmet','helmet','helmet','helmet','helmetHi','helmetHi','helmet','helmet','helmet','helmet','helmet','helmetDk','helmet','','','','','',''],
    ['','','','helmetDk','helmet','helmet','helmet','helmet','helmet','helmet','helmet','helmetHi','helmetHi','helmet','helmet','helmet','helmet','helmet','helmetHi','helmetHi','helmet','helmet','helmet','helmet','helmet','helmetDk','','','','','',''],

    // Row 2-3: 头盔 + 额头护额
    ['','helmetDk','helmet','helmet','helmet','helmet','helmet','helmet','helmet','helmet','helmet','helmet','helmet','helmet','helmet','helmet','helmet','helmet','helmet','helmet','helmet','helmet','helmet','helmet','helmet','helmetDk','helmetDk','','','','',''],
    ['','helmetDk','helmet','helmet','helmet','helmet','helmet','helmet','helmet','helmet','helmet','helmet','helmet','helmet','helmet','helmet','helmet','helmet','helmet','helmet','helmet','helmet','helmet','helmet','helmet','helmetDk','outline','','','','',''],

    // Row 4-5: 护额金属条 + 头发两侧
    ['','helmetDk','helmet','helmet','helmet','helmet','helmet','helmet','helmet','helmet','helmet','helmet','helmet','helmet','helmet','helmet','helmet','helmet','helmet','helmet','helmet','helmet','helmet','helmet','helmet','helmetDk','outline','','','','',''],
    ['','outline','helmetDk','helmet','helmet','helmet','helmet','helmet','helmet','helmet','helmet','helmet','helmet','helmet','helmet','helmet','helmet','helmet','helmet','helmet','helmet','helmet','helmet','helmet','helmetDk','helmetDk','outline','','','','',''],

    // Row 6-7: 护额下沿 + 额头皮肤
    ['','outline','helmetDk','helmetDk','helmet','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','hair','hair','helmetDk','helmetDk','outline','','','','',''],
    ['','outline','helmetDk','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','outline','','','','',''],

    // Row 8-9: 浮肿眼皮（HIRONO标志）
    ['','outline','skinSh','skin','skin','skin','lid','lid','lid','lid','lid','lid','lid','lid','lid','lid','lid','lid','lid','lid','lid','lid','skin','skin','skinSh','skinSh','outline','','','','',''],
    ['outline','outline','skinSh','skin','skin','lidSh','lidSh','lidSh','lid','lid','lid','lid','lid','lid','lid','lid','lid','lid','lid','lid','lid','lid','lid','skin','skinSh','outline','outline','','','','',''],

    // Row 10-11: 大眼睛（坚定凝视）
    ['outline','skinSh','skin','skin','eyeB','eyeB','eyeB','eyeW','eyeW','eyeW','eyeW','eyeI','eyeI','eyeI','eyeI','eyeW','eyeW','eyeW','eyeW','eyeW','eyeB','eyeB','eyeB','skin','skin','skinSh','outline','','','','',''],
    ['outline','skinSh','skin','eyeB','eyeB','eyeB','eyeW','eyeW','eyeW','eyeI','eyeI','eyeI','eyeI','eyeI','eyeI','eyeI','eyeI','eyeW','eyeW','eyeW','eyeB','eyeB','eyeB','skin','skinSh','outline','','','','','',''],

    // Row 12-13: 眼睛下部
    ['outline','skinSh','skin','skin','eyeB','eyeB','eyeW','eyeW','eyeW','eyeI','eyeI','eyeI','eyeI','eyeI','eyeI','eyeI','eyeW','eyeW','eyeW','eyeB','eyeB','eyeB','skin','skin','skin','skinSh','outline','','','','',''],
    ['','outline','skinSh','skin','eyeB','eyeB','eyeB','eyeB','eyeB','eyeB','eyeB','eyeB','eyeB','eyeB','eyeB','eyeB','eyeB','eyeB','eyeB','eyeB','eyeB','skin','skin','skin','skinSh','outline','','','','','',''],

    // Row 14-15: 鼻子 + 嘴巴 + 腮红
    ['','outline','skinSh','blush','blush','blush','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','blush','blush','blush','skin','skinSh','outline','','','','','','','',''],
    ['','outline','skinSh','blush','blush','skin','skin','skin','skin','nose','nose','nose','skin','skin','skin','skin','skin','skin','skin','blush','blush','skin','skinSh','outline','','','','','','','',''],

    // Row 16-17: 下巴 + 脖子 + 护甲领口
    ['','outline','outline','skinSh','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','mouth','mouth','skin','skin','skin','skin','skin','skin','skin','skinSh','outline','outline','','','','','',''],
    ['','','outline','outline','skinSh','skinSh','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skinSh','skinSh','skinSh','outline','outline','','','','','','','',''],

    // Row 18-19: 护甲外套上部
    ['','','','outline','outline','armor','armor','armor','armor','armor','armor','armor','armor','armor','armor','armor','armor','armor','armor','armor','armor','armor','armor','armor','outline','outline','','','','','',''],
    ['','','outline','armorDk','armor','armor','armor','armor','armor','armor','armor','armor','armor','armor','armor','armor','armor','armor','armor','armor','armor','armor','armor','armor','armorDk','outline','outline','','','','',''],

    // Row 20-23: 护甲主体
    ['','outline','armorDk','armor','armor','armor','armor','armorHi','armorHi','armor','armor','armor','armor','armor','armor','armor','armor','armor','armorHi','armorHi','armor','armor','armor','armor','armor','armorDk','outline','','','','',''],
    ['','outline','armorDk','armor','armor','armor','armor','armor','armor','armor','armor','armor','armor','armor','armor','armor','armor','armor','armor','armor','armor','armor','armor','armor','armor','armorDk','outline','','','','',''],
    ['outline','armorDk','armor','armor','armor','armor','armor','armor','armor','armor','armor','armor','armor','armor','armor','armor','armor','armor','armor','armor','armor','armor','armor','armor','armor','armor','armorDk','outline','','','',''],
    ['outline','armorDk','armor','armor','armor','armor','armor','armor','armor','armor','armor','armor','armor','armor','armor','armor','armor','armor','armor','armor','armor','armor','armor','armor','armor','armor','armorDk','outline','','','',''],

    // Row 24-25: 护甲下部 + 手臂
    ['outline','armorDk','armor','armor','armor','armor','armor','armor','armor','armor','armor','armor','armor','armor','armor','armor','armor','armor','armor','armor','armor','armor','armor','armor','armor','armor','armorDk','outline','','','',''],
    ['','outline','armorDk','armor','armor','armor','armor','armor','armor','armor','armor','armor','armor','armor','armor','armor','armor','armor','armor','armor','armor','armor','armor','armor','armor','armor','armorDk','outline','','','',''],

    // Row 26-27: 护甲下摆
    ['','outline','armorDk','armorDk','armor','armor','armor','armor','armor','armor','armor','armor','armor','armor','armor','armor','armor','armor','armor','armor','armor','armor','armor','armor','armorDk','armorDk','outline','','','','',''],
    ['','','outline','outline','armorDk','armorDk','armorDk','armorDk','armorDk','armorDk','armorDk','armorDk','armorDk','armorDk','armorDk','armorDk','armorDk','armorDk','armorDk','armorDk','armorDk','armorDk','outline','outline','','','','','','','',''],

    // Row 28-29: 裤子/护腿
    ['','','','outline','outline','armorDk','armorDk','armorDk','armorDk','armorDk','armorDk','armorDk','armorDk','armorDk','armorDk','armorDk','armorDk','armorDk','armorDk','armorDk','armorDk','armorDk','armorDk','outline','outline','','','','','','',''],
    ['','','','','outline','outline','armorDk','armorDk','armorDk','armorDk','armorDk','armorDk','armorDk','armorDk','armorDk','armorDk','armorDk','armorDk','armorDk','armorDk','armorDk','outline','outline','','','','','','','','',''],

    // Row 30-31: 靴子
    ['','','','','','','outline','outline','shoe','shoe','shoe','shoe','shoe','shoe','shoe','shoe','shoe','shoe','shoe','shoe','outline','outline','','','','','','','','','',''],
    ['','','','','','','','','outline','outline','outline','shoe','shoe','shoe','shoe','shoe','shoe','outline','outline','outline','','','','','','','','','','','',''],
  ],
};

// ============================================================
// 2. MAGE — Reshape系列Insight
// 第三只眼/额头宝石，长袍，神秘感，深蓝紫色调
// ============================================================
const MAGE_PALETTE = {
  // 基础HIRONO色
  hair:    '#4a3a5e',
  hairHi:  '#6a5a7e',
  hairDk:  '#2e2240',
  skin:    '#e8e0ec',
  skinSh:  '#d0c4d8',
  blush:   '#c898c8',
  nose:    '#b078b0',
  eyeW:    '#f4f0f8',
  eyeI:    '#2a1a4e',
  eyeB:    '#1a1030',
  lid:     '#d0c0dc',
  lidSh:   '#b098c0',
  mouth:   '#9878a0',
  coat:    '#4a3a6e',
  coatHi:  '#6a5a8e',
  coatDk:  '#2e2048',
  coatLn:  '#1e1430',
  inner:   '#d8d0e4',
  shoe:    '#2a1e3e',
  outline: '#141020',
  white:   '#ffffff',
  // 法师特有
  robe:    '#3a2a5e',
  robeHi:  '#5a4a7e',
  gem:     '#a040e0',
  gemGlow: '#c880ff',
};

const MAGE_SPRITE: PixelData = {
  width: 32,
  height: 32,
  pixels: [
    // Row 0-1: 长发顶部（法师头发更长更凌乱）
    ['','','','hairDk','hair','hair','hair','hair','hairDk','hairDk','hair','hair','hairHi','hairHi','hair','hair','hairDk','hairDk','hair','hair','hairHi','hairHi','hair','hair','hairDk','hairDk','','','','','',''],
    ['','hairDk','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hairHi','hairHi','hair','hair','hair','hair','hairHi','hairHi','hair','hair','hair','hair','hair','hairDk','hairDk','','','','',''],

    // Row 2-3: 头发 + 额头（留宝石位置）
    ['','hairDk','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hairDk','hairDk','','','',''],
    ['','hairDk','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hairDk','outline','','','','',''],

    // Row 4-5: 额头宝石行
    ['','outline','hairDk','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hairDk','hairDk','outline','','','','',''],
    ['','outline','hairDk','hairDk','hair','skin','skin','skin','skin','skin','skin','skin','gemGlow','gem','gem','gemGlow','skin','skin','skin','skin','skin','skin','skin','hair','hair','hairDk','hairDk','outline','','','',''],

    // Row 6-7: 宝石下方 + 眉毛区域
    ['','outline','hairDk','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','outline','','','','','',''],
    ['','outline','hairDk','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','outline','','','','',''],

    // Row 8-9: 浮肿眼皮
    ['','outline','skinSh','skin','skin','skin','lid','lid','lid','lid','lid','lid','lid','lid','lid','lid','lid','lid','lid','lid','lid','lid','skin','skin','skinSh','skinSh','outline','','','','',''],
    ['outline','outline','skinSh','skin','skin','lidSh','lidSh','lidSh','lid','lid','lid','lid','lid','lid','lid','lid','lid','lid','lid','lid','lid','lid','lid','skin','skinSh','outline','outline','','','','',''],

    // Row 10-11: 大眼睛（神秘深邃）
    ['outline','skinSh','skin','skin','eyeB','eyeB','eyeB','eyeW','eyeW','eyeW','eyeW','eyeI','eyeI','eyeI','eyeI','eyeW','eyeW','eyeW','eyeW','eyeW','eyeB','eyeB','eyeB','skin','skin','skinSh','outline','','','','',''],
    ['outline','skinSh','skin','eyeB','eyeB','eyeB','eyeW','eyeW','eyeW','eyeI','eyeI','eyeI','eyeI','eyeI','eyeI','eyeI','eyeI','eyeW','eyeW','eyeW','eyeB','eyeB','eyeB','skin','skinSh','outline','','','','','',''],

    // Row 12-13: 眼睛下部
    ['outline','skinSh','skin','skin','eyeB','eyeB','eyeW','eyeW','eyeW','eyeI','eyeI','eyeI','eyeI','eyeI','eyeI','eyeI','eyeW','eyeW','eyeW','eyeB','eyeB','eyeB','skin','skin','skin','skinSh','outline','','','','',''],
    ['','outline','skinSh','skin','eyeB','eyeB','eyeB','eyeB','eyeB','eyeB','eyeB','eyeB','eyeB','eyeB','eyeB','eyeB','eyeB','eyeB','eyeB','eyeB','eyeB','skin','skin','skin','skinSh','outline','','','','','',''],

    // Row 14-15: 鼻子 + 嘴巴 + 腮红
    ['','outline','skinSh','blush','blush','blush','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','blush','blush','blush','skin','skinSh','outline','','','','','','','',''],
    ['','outline','skinSh','blush','blush','skin','skin','skin','skin','nose','nose','nose','skin','skin','skin','skin','skin','skin','skin','blush','blush','skin','skinSh','outline','','','','','','','',''],

    // Row 16-17: 下巴 + 脖子 + 长袍领口
    ['','outline','outline','skinSh','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','mouth','mouth','skin','skin','skin','skin','skin','skin','skin','skinSh','outline','outline','','','','','',''],
    ['','','outline','outline','skinSh','skinSh','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skinSh','skinSh','skinSh','outline','outline','','','','','','','',''],

    // Row 18-19: 长袍上部（V领）
    ['','','','outline','outline','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','outline','outline','','','','','',''],
    ['','','outline','coatLn','robe','robe','robe','robe','robe','robe','robe','inner','inner','inner','inner','inner','inner','robe','robe','robe','robe','robe','robe','robe','robe','coatLn','outline','outline','','','',''],

    // Row 20-23: 长袍主体
    ['','outline','coatLn','robe','robe','robe','robe','robe','robe','robe','inner','inner','robe','robe','robe','robe','robe','robe','robe','robe','robe','robe','robe','robe','robe','robe','coatLn','outline','','','',''],
    ['','outline','coatLn','robe','robe','robe','robe','robe','robe','robe','robe','robe','robe','robe','robe','robe','robe','robe','robe','robe','robe','robe','robe','robe','robe','robe','coatLn','outline','','','',''],
    ['outline','coatLn','robe','robe','robe','robe','robe','robe','robe','robe','robe','robe','robe','robe','robe','robe','robe','robe','robe','robe','robe','robe','robe','robe','robe','robe','robe','coatLn','outline','','',''],
    ['outline','coatLn','robe','robe','robe','robe','robe','robe','robe','robe','robe','robe','robe','robe','robe','robe','robe','robe','robe','robe','robe','robe','robe','robe','robe','robe','robe','coatLn','outline','','',''],

    // Row 24-25: 长袍下部（更宽）
    ['outline','coatLn','robe','robe','robe','robe','robe','robe','robe','robe','robe','robe','robe','robe','robe','robe','robe','robe','robe','robe','robe','robe','robe','robe','robe','robe','robe','coatLn','outline','','',''],
    ['','outline','coatLn','robe','robe','robe','robe','robe','robe','robe','robe','robe','robe','robe','robe','robe','robe','robe','robe','robe','robe','robe','robe','robe','robe','robe','coatLn','outline','','','',''],

    // Row 26-27: 长袍下摆
    ['','outline','coatLn','coatLn','robe','robe','robe','robe','robe','robe','robe','robe','robe','robe','robe','robe','robe','robe','robe','robe','robe','robe','robe','robe','coatLn','coatLn','outline','','','','',''],
    ['','','outline','outline','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','outline','outline','','','','','','','','',''],

    // Row 28-29: 长袍底部
    ['','','','outline','outline','coatDk','coatDk','coatDk','coatDk','coatDk','coatDk','coatDk','coatDk','coatDk','coatDk','coatDk','coatDk','coatDk','coatDk','coatDk','coatDk','coatDk','coatDk','outline','outline','','','','','','',''],
    ['','','','','outline','outline','coatDk','coatDk','coatDk','coatDk','coatDk','coatDk','coatDk','coatDk','coatDk','coatDk','coatDk','coatDk','coatDk','coatDk','coatDk','outline','outline','','','','','','','','',''],

    // Row 30-31: 鞋子
    ['','','','','','','outline','outline','shoe','shoe','shoe','shoe','shoe','shoe','shoe','shoe','shoe','shoe','shoe','shoe','outline','outline','','','','','','','','','',''],
    ['','','','','','','','','outline','outline','outline','shoe','shoe','shoe','shoe','shoe','shoe','outline','outline','outline','','','','','','','','','','','',''],
  ],
};

// ============================================================
// 3. RANGER — Little Mischief系列The Aviator
// 飞行员护目镜（在眼睛位置），围巾飘动，敏捷感，橄榄绿色调
// ============================================================
const RANGER_PALETTE = {
  // 基础HIRONO色
  hair:    '#5a5a3e',
  hairHi:  '#7a7a5a',
  hairDk:  '#3a3a28',
  skin:    '#f0e8d4',
  skinSh:  '#dcc8a8',
  blush:   '#e0a080',
  nose:    '#cc8868',
  eyeW:    '#f6f4ee',
  eyeI:    '#3a3018',
  eyeB:    '#2a2010',
  lid:     '#e0d4b8',
  lidSh:   '#c8b890',
  mouth:   '#b89878',
  coat:    '#6a7a50',
  coatHi:  '#849468',
  coatDk:  '#4a5a38',
  coatLn:  '#2e3a20',
  inner:   '#d8d4b8',
  shoe:    '#3a3a28',
  outline: '#1e1e10',
  white:   '#ffffff',
  // 游侠特有
  goggle:  '#8a7a58',
  goggleLn:'#5a4a30',
  scarf:   '#c86040',
  scarfHi: '#e07858',
};

const RANGER_SPRITE: PixelData = {
  width: 32,
  height: 32,
  pixels: [
    // Row 0-1: 头发（偏短，略带风动感）
    ['','','','','','hairDk','hair','hair','hair','hairDk','hairDk','hair','hair','','','hair','hair','hairDk','hairDk','hair','hair','','','','','','','','','','',''],
    ['','','','hairDk','hair','hair','hair','hair','hair','hair','hair','hairHi','hairHi','hair','hair','hair','hair','hairHi','hairHi','hair','hair','hair','hair','hair','hairDk','hair','','','','','',''],

    // Row 2-3: 头发上部
    ['','hairDk','hair','hair','hair','hair','hair','hair','hair','hair','hair','hairHi','hairHi','hair','hair','hair','hair','hair','hairHi','hairHi','hair','hair','hair','hair','hair','hairDk','hairDk','','','','',''],
    ['','hairDk','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hairDk','outline','','','','',''],

    // Row 4-5: 额头
    ['','hairDk','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hairDk','outline','','','','',''],
    ['','outline','hairDk','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hairDk','hairDk','outline','','','','','',''],

    // Row 6-7: 额头 + 围巾上部
    ['','outline','hairDk','hairDk','hair','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','hair','hair','hairDk','hairDk','outline','','','','',''],
    ['','outline','scarf','scarf','scarf','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','scarf','scarf','scarf','outline','','','','',''],

    // Row 8-9: 护目镜框（替代浮肿眼皮位置）
    ['','outline','skinSh','skin','goggleLn','goggleLn','goggle','goggle','goggle','goggle','goggle','goggle','goggle','goggle','goggle','goggle','goggle','goggle','goggle','goggle','goggleLn','goggleLn','skin','skinSh','skinSh','outline','','','','','',''],
    ['outline','outline','skinSh','skin','goggleLn','goggle','goggle','goggle','goggle','goggle','goggle','goggle','goggle','goggle','goggle','goggle','goggle','goggle','goggle','goggle','goggle','goggle','skin','skinSh','outline','outline','','','','','',''],

    // Row 10-11: 护目镜镜片 + 眼睛
    ['outline','skinSh','skin','goggleLn','goggle','goggle','eyeW','eyeW','eyeW','eyeW','eyeI','eyeI','eyeI','eyeI','eyeW','eyeW','eyeW','eyeW','eyeW','goggle','goggle','goggle','goggleLn','skin','skinSh','outline','','','','','',''],
    ['outline','skinSh','skin','goggleLn','goggle','goggle','eyeW','eyeW','eyeW','eyeI','eyeI','eyeI','eyeI','eyeI','eyeI','eyeI','eyeI','eyeW','eyeW','eyeW','goggle','goggle','goggleLn','skin','skinSh','outline','','','','','',''],

    // Row 12-13: 护目镜下部
    ['outline','skinSh','skin','goggleLn','goggle','goggle','eyeW','eyeW','eyeW','eyeI','eyeI','eyeI','eyeI','eyeI','eyeI','eyeI','eyeW','eyeW','eyeW','goggle','goggle','goggle','goggleLn','skin','skinSh','outline','','','','','',''],
    ['','outline','skinSh','skin','goggleLn','goggleLn','goggleLn','goggleLn','goggleLn','goggleLn','goggleLn','goggleLn','goggleLn','goggleLn','goggleLn','goggleLn','goggleLn','goggleLn','goggleLn','goggleLn','goggleLn','skin','skin','skinSh','outline','','','','','','',''],

    // Row 14-15: 鼻子 + 嘴巴 + 围巾中部
    ['','outline','skinSh','blush','blush','blush','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','blush','blush','blush','skin','skinSh','outline','','','','','','','',''],
    ['','outline','scarfHi','scarf','scarf','skin','skin','skin','nose','nose','nose','skin','skin','skin','skin','skin','skin','skin','scarf','scarf','scarfHi','scarf','scarf','outline','','','','','','','',''],

    // Row 16-17: 围巾飘动 + 领口
    ['','outline','scarfHi','scarf','scarf','scarf','scarf','skin','skin','skin','skin','skin','skin','mouth','mouth','skin','skin','scarf','scarf','scarf','scarfHi','scarfHi','scarf','scarf','outline','outline','','','','','',''],
    ['','','outline','scarfHi','scarf','scarf','scarf','scarf','scarf','scarf','scarf','scarf','scarf','scarf','scarf','scarf','scarf','scarf','scarf','scarf','scarfHi','scarfHi','scarf','outline','outline','','','','','','',''],

    // Row 18-19: 外套上部
    ['','','','outline','outline','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','outline','outline','','','','','',''],
    ['','','outline','coatLn','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coatLn','outline','outline','','','','',''],

    // Row 20-23: 外套主体（收腰，敏捷感）
    ['','outline','coatLn','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coatLn','outline','','','',''],
    ['','outline','coatLn','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coatLn','outline','','','',''],
    ['outline','coatLn','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coatLn','outline','','',''],
    ['outline','coatLn','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coatLn','outline','','',''],

    // Row 24-25: 外套下部
    ['outline','coatLn','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coatLn','outline','','',''],
    ['','outline','coatLn','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coatLn','outline','','','',''],

    // Row 26-27: 外套下摆
    ['','outline','coatLn','coatLn','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coatLn','coatLn','outline','','','','',''],
    ['','','outline','outline','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','outline','outline','','','','','','','','',''],

    // Row 28-29: 裤子
    ['','','','outline','outline','coatDk','coatDk','coatDk','coatDk','coatDk','coatDk','coatDk','coatDk','coatDk','coatDk','coatDk','coatDk','coatDk','coatDk','coatDk','coatDk','coatDk','coatDk','outline','outline','','','','','','',''],
    ['','','','','outline','outline','coatDk','coatDk','coatDk','coatDk','coatDk','coatDk','coatDk','coatDk','coatDk','coatDk','coatDk','coatDk','coatDk','coatDk','coatDk','outline','outline','','','','','','','','',''],

    // Row 30-31: 靴子
    ['','','','','','','outline','outline','shoe','shoe','shoe','shoe','shoe','shoe','shoe','shoe','shoe','shoe','shoe','shoe','outline','outline','','','','','','','','','',''],
    ['','','','','','','','','outline','outline','outline','shoe','shoe','shoe','shoe','shoe','shoe','outline','outline','outline','','','','','','','','','','','',''],
  ],
};

// ============================================================
// 4. GUARDIAN — Shelter系列Fort
// 厚重外套/沙袋元素，大盾牌（右侧），沉稳表情，灰蓝色调
// ============================================================
const GUARDIAN_PALETTE = {
  // 基础HIRONO色
  hair:    '#5a6070',
  hairHi:  '#7a8090',
  hairDk:  '#3a4050',
  skin:    '#e4e0e8',
  skinSh:  '#ccc8d4',
  blush:   '#b8a0b0',
  nose:    '#a08898',
  eyeW:    '#f4f2f6',
  eyeI:    '#2a3040',
  eyeB:    '#1a2030',
  lid:     '#d0ccd8',
  lidSh:   '#b0a8c0',
  mouth:   '#908898',
  coat:    '#6a7888',
  coatHi:  '#8490a0',
  coatDk:  '#4a5868',
  coatLn:  '#2e3a48',
  inner:   '#d0d0dc',
  shoe:    '#3a4050',
  outline: '#1a1e28',
  white:   '#ffffff',
  // 守卫特有
  shield:  '#7a8a98',
  shieldHi:'#98a8b4',
  padding: '#8a8070',
};

const GUARDIAN_SPRITE: PixelData = {
  width: 32,
  height: 32,
  pixels: [
    // Row 0-1: 头发（厚重感，稍长）
    ['','','','hairDk','hair','hair','hair','hair','hairDk','hairDk','hair','hair','hairHi','hairHi','hair','hair','hairDk','hairDk','hair','hair','hairHi','hairHi','hair','hair','hairDk','hairDk','','','','','',''],
    ['','hairDk','hair','hair','hair','hair','hair','hair','hair','hair','hair','hairHi','hairHi','hair','hair','hair','hair','hairHi','hairHi','hair','hair','hair','hair','hair','hairDk','hairDk','','','','','',''],

    // Row 2-3: 头发上部
    ['','hairDk','hair','hair','hair','hair','hair','hair','hair','hair','hair','hairHi','hairHi','hair','hair','hair','hair','hair','hairHi','hairHi','hair','hair','hair','hair','hair','hairDk','hairDk','','','','',''],
    ['','hairDk','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hairDk','outline','','','','',''],

    // Row 4-5: 额头
    ['','hairDk','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hairDk','outline','','','','',''],
    ['','outline','hairDk','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hairDk','hairDk','outline','','','','','',''],

    // Row 6-7: 额头 + 眉毛区域
    ['','outline','hairDk','hairDk','hair','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','hair','hair','hairDk','hairDk','outline','','','','',''],
    ['','outline','hairDk','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','outline','','','','',''],

    // Row 8-9: 浮肿眼皮（沉稳）
    ['','outline','skinSh','skin','skin','skin','lid','lid','lid','lid','lid','lid','lid','lid','lid','lid','lid','lid','lid','lid','lid','lid','skin','skin','skinSh','skinSh','outline','','','','',''],
    ['outline','outline','skinSh','skin','skin','lidSh','lidSh','lidSh','lid','lid','lid','lid','lid','lid','lid','lid','lid','lid','lid','lid','lid','lid','lid','skin','skinSh','outline','outline','','','','',''],

    // Row 10-11: 大眼睛（沉稳凝视）
    ['outline','skinSh','skin','skin','eyeB','eyeB','eyeB','eyeW','eyeW','eyeW','eyeW','eyeI','eyeI','eyeI','eyeI','eyeW','eyeW','eyeW','eyeW','eyeW','eyeB','eyeB','eyeB','skin','skin','skinSh','outline','','','','',''],
    ['outline','skinSh','skin','eyeB','eyeB','eyeB','eyeW','eyeW','eyeW','eyeI','eyeI','eyeI','eyeI','eyeI','eyeI','eyeI','eyeI','eyeW','eyeW','eyeW','eyeB','eyeB','eyeB','skin','skinSh','outline','','','','','',''],

    // Row 12-13: 眼睛下部
    ['outline','skinSh','skin','skin','eyeB','eyeB','eyeW','eyeW','eyeW','eyeI','eyeI','eyeI','eyeI','eyeI','eyeI','eyeI','eyeW','eyeW','eyeW','eyeB','eyeB','eyeB','skin','skin','skin','skinSh','outline','','','','',''],
    ['','outline','skinSh','skin','eyeB','eyeB','eyeB','eyeB','eyeB','eyeB','eyeB','eyeB','eyeB','eyeB','eyeB','eyeB','eyeB','eyeB','eyeB','eyeB','eyeB','skin','skin','skin','skinSh','outline','','','','','',''],

    // Row 14-15: 鼻子 + 嘴巴 + 腮红
    ['','outline','skinSh','blush','blush','blush','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','blush','blush','blush','skin','skinSh','outline','','','','','','','',''],
    ['','outline','skinSh','blush','blush','skin','skin','skin','skin','nose','nose','nose','skin','skin','skin','skin','skin','skin','skin','blush','blush','skin','skinSh','outline','','','','','','','',''],

    // Row 16-17: 下巴 + 脖子 + 厚领口
    ['','outline','outline','skinSh','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','mouth','mouth','skin','skin','skin','skin','skin','skin','skin','skinSh','outline','outline','','','','','',''],
    ['','','outline','outline','padding','padding','padding','skinSh','skinSh','skin','skin','skin','skin','skin','skin','skin','skin','skinSh','skinSh','padding','padding','padding','outline','outline','','','','','','','',''],

    // Row 18-19: 厚重外套上部
    ['','','','outline','outline','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','outline','outline','','','','','',''],
    ['','','outline','coatLn','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coatLn','outline','outline','','','','',''],

    // Row 20-23: 外套主体（更宽厚）+ 盾牌在右侧
    ['','outline','coatLn','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','shield','shield','shield','shield','coatLn','outline','','','',''],
    ['','outline','coatLn','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','shield','shieldHi','shield','shield','coatLn','outline','','','',''],
    ['outline','coatLn','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','shield','shield','shieldHi','shield','coatLn','outline','','','',''],
    ['outline','coatLn','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','shield','shieldHi','shield','shield','coatLn','outline','','','',''],

    // Row 24-25: 外套下部 + 盾牌底部
    ['outline','coatLn','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','shield','shield','shield','shield','coatLn','outline','','','',''],
    ['','outline','coatLn','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','shield','shield','shield','coatLn','outline','','','',''],

    // Row 26-27: 外套下摆
    ['','outline','coatLn','coatLn','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coatLn','coatLn','outline','','','','',''],
    ['','','outline','outline','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','outline','outline','','','','','','','','',''],

    // Row 28-29: 裤子
    ['','','','outline','outline','coatDk','coatDk','coatDk','coatDk','coatDk','coatDk','coatDk','coatDk','coatDk','coatDk','coatDk','coatDk','coatDk','coatDk','coatDk','coatDk','coatDk','coatDk','outline','outline','','','','','','',''],
    ['','','','','outline','outline','coatDk','coatDk','coatDk','coatDk','coatDk','coatDk','coatDk','coatDk','coatDk','coatDk','coatDk','coatDk','coatDk','coatDk','coatDk','outline','outline','','','','','','','','',''],

    // Row 30-31: 靴子
    ['','','','','','','outline','outline','shoe','shoe','shoe','shoe','shoe','shoe','shoe','shoe','shoe','shoe','shoe','shoe','outline','outline','','','','','','','','','',''],
    ['','','','','','','','','outline','outline','outline','shoe','shoe','shoe','shoe','shoe','shoe','outline','outline','outline','','','','','','','','','','','',''],
  ],
};

// ============================================================
// 5. FLAME — Reshape系列Burst
// 头发有火焰效果（发尖用亮色），爆裂感外套，激烈表情，橙红色调
// ============================================================
const FLAME_PALETTE = {
  // 基础HIRONO色
  hair:    '#8a4a30',
  hairHi:  '#b06848',
  hairDk:  '#5a2e1c',
  skin:    '#f5e0cc',
  skinSh:  '#e8c8b0',
  blush:   '#e88878',
  nose:    '#d06858',
  eyeW:    '#f8f4f0',
  eyeI:    '#4a2010',
  eyeB:    '#2e1408',
  lid:     '#e4c0a8',
  lidSh:   '#cc9880',
  mouth:   '#c48070',
  coat:    '#c85838',
  coatHi:  '#e07050',
  coatDk:  '#8a3820',
  coatLn:  '#5a2414',
  inner:   '#f0d8c0',
  shoe:    '#5a2818',
  outline: '#2e1008',
  white:   '#ffffff',
  // 烈焰特有
  flame:   '#f0a030',
  flameHi: '#f8c848',
  ember:   '#e86820',
};

const FLAME_SPRITE: PixelData = {
  width: 32,
  height: 32,
  pixels: [
    // Row 0-1: 火焰发尖（发尾用亮色flame/flameHi）
    ['','','','flameHi','flame','flame','hairDk','hair','hairDk','hairDk','hair','hair','','','hair','hair','hairDk','hairDk','hair','hair','flame','flame','flameHi','flameHi','flame','hairDk','','','','','',''],
    ['','flame','flame','flame','hair','hair','hair','hair','hair','hair','hair','hairHi','hairHi','hair','hair','hair','hair','hairHi','hairHi','hair','hair','hair','hair','hair','hairDk','hairDk','','','','','',''],

    // Row 2-3: 头发上部（火焰渐变）
    ['','hairDk','hair','hair','hair','hair','hair','hair','hair','hair','hair','hairHi','hairHi','hair','hair','hair','hair','hair','hairHi','hairHi','hair','hair','hair','hair','hair','hairDk','hairDk','','','','',''],
    ['','hairDk','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hairDk','outline','','','','',''],

    // Row 4-5: 额头
    ['','hairDk','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hairDk','outline','','','','',''],
    ['','outline','hairDk','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hairDk','hairDk','outline','','','','','',''],

    // Row 6-7: 额头 + 眉毛区域
    ['','outline','hairDk','hairDk','hair','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','hair','hair','hairDk','hairDk','outline','','','','',''],
    ['','outline','hairDk','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','outline','','','','',''],

    // Row 8-9: 浮肿眼皮（激烈感）
    ['','outline','skinSh','skin','skin','skin','lid','lid','lid','lid','lid','lid','lid','lid','lid','lid','lid','lid','lid','lid','lid','lid','skin','skin','skinSh','skinSh','outline','','','','',''],
    ['outline','outline','skinSh','skin','skin','lidSh','lidSh','lidSh','lid','lid','lid','lid','lid','lid','lid','lid','lid','lid','lid','lid','lid','lid','lid','skin','skinSh','outline','outline','','','','',''],

    // Row 10-11: 大眼睛（激烈凝视）
    ['outline','skinSh','skin','skin','eyeB','eyeB','eyeB','eyeW','eyeW','eyeW','eyeW','eyeI','eyeI','eyeI','eyeI','eyeW','eyeW','eyeW','eyeW','eyeW','eyeB','eyeB','eyeB','skin','skin','skinSh','outline','','','','',''],
    ['outline','skinSh','skin','eyeB','eyeB','eyeB','eyeW','eyeW','eyeW','eyeI','eyeI','eyeI','eyeI','eyeI','eyeI','eyeI','eyeI','eyeW','eyeW','eyeW','eyeB','eyeB','eyeB','skin','skinSh','outline','','','','','',''],

    // Row 12-13: 眼睛下部
    ['outline','skinSh','skin','skin','eyeB','eyeB','eyeW','eyeW','eyeW','eyeI','eyeI','eyeI','eyeI','eyeI','eyeI','eyeI','eyeW','eyeW','eyeW','eyeB','eyeB','eyeB','skin','skin','skin','skinSh','outline','','','','',''],
    ['','outline','skinSh','skin','eyeB','eyeB','eyeB','eyeB','eyeB','eyeB','eyeB','eyeB','eyeB','eyeB','eyeB','eyeB','eyeB','eyeB','eyeB','eyeB','eyeB','skin','skin','skin','skinSh','outline','','','','','',''],

    // Row 14-15: 鼻子 + 嘴巴 + 腮红
    ['','outline','skinSh','blush','blush','blush','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','blush','blush','blush','skin','skinSh','outline','','','','','','','',''],
    ['','outline','skinSh','blush','blush','skin','skin','skin','skin','nose','nose','nose','skin','skin','skin','skin','skin','skin','skin','blush','blush','skin','skinSh','outline','','','','','','','',''],

    // Row 16-17: 下巴 + 脖子 + 爆裂领口
    ['','outline','outline','skinSh','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','mouth','mouth','skin','skin','skin','skin','skin','skin','skin','skinSh','outline','outline','','','','','',''],
    ['','','outline','outline','skinSh','skinSh','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skinSh','skinSh','skinSh','outline','outline','','','','','','','',''],

    // Row 18-19: 爆裂外套上部
    ['','','','outline','outline','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','outline','outline','','','','','',''],
    ['','','outline','coatLn','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coatLn','outline','outline','','','','',''],

    // Row 20-23: 外套主体（爆裂纹理用ember）
    ['','outline','coatLn','coat','coat','coat','coat','coat','coat','coat','coat','coat','ember','ember','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coatLn','outline','','','',''],
    ['','outline','coatLn','coat','coat','coat','coat','coat','coat','coat','coat','coat','ember','ember','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coatLn','outline','','','',''],
    ['outline','coatLn','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coatLn','outline','','',''],
    ['outline','coatLn','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coatLn','outline','','',''],

    // Row 24-25: 外套下部
    ['outline','coatLn','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coatLn','outline','','',''],
    ['','outline','coatLn','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coatLn','outline','','','',''],

    // Row 26-27: 外套下摆（火焰边缘）
    ['','outline','coatLn','coatLn','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','flame','flame','flame','coatLn','coatLn','outline','','','','',''],
    ['','','outline','outline','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','outline','outline','','','','','','','','',''],

    // Row 28-29: 裤子
    ['','','','outline','outline','coatDk','coatDk','coatDk','coatDk','coatDk','coatDk','coatDk','coatDk','coatDk','coatDk','coatDk','coatDk','coatDk','coatDk','coatDk','coatDk','coatDk','coatDk','outline','outline','','','','','','',''],
    ['','','','','outline','outline','coatDk','coatDk','coatDk','coatDk','coatDk','coatDk','coatDk','coatDk','coatDk','coatDk','coatDk','coatDk','coatDk','coatDk','coatDk','outline','outline','','','','','','','','',''],

    // Row 30-31: 靴子
    ['','','','','','','outline','outline','shoe','shoe','shoe','shoe','shoe','shoe','shoe','shoe','shoe','shoe','shoe','shoe','outline','outline','','','','','','','','','',''],
    ['','','','','','','','','outline','outline','outline','shoe','shoe','shoe','shoe','shoe','shoe','outline','outline','outline','','','','','','','','','','','',''],
  ],
};

// ============================================================
// 导出所有精灵
// ============================================================
export const SPRITES_BATCH_1 = [
  {
    id: 'warrior',
    name: 'B-BABO战士',
    hironoSeries: 'Shelter - Warrior',
    palette: WARRIOR_PALETTE,
    sprite: WARRIOR_SPRITE,
  },
  {
    id: 'mage',
    name: 'B-BABO法师',
    hironoSeries: 'Reshape - Insight',
    palette: MAGE_PALETTE,
    sprite: MAGE_SPRITE,
  },
  {
    id: 'ranger',
    name: 'B-BABO游侠',
    hironoSeries: 'Little Mischief - The Aviator',
    palette: RANGER_PALETTE,
    sprite: RANGER_SPRITE,
  },
  {
    id: 'guardian',
    name: 'B-BABO守卫',
    hironoSeries: 'Shelter - Fort',
    palette: GUARDIAN_PALETTE,
    sprite: GUARDIAN_SPRITE,
  },
  {
    id: 'flame',
    name: 'B-BABO烈焰',
    hironoSeries: 'Reshape - Burst',
    palette: FLAME_PALETTE,
    sprite: FLAME_SPRITE,
  },
];
