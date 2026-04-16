/**
 * HIRONO 小野风格像素精灵 - 批次1
 *
 * POP MART HIRONO 风格：大头小身、圆润无棱角、豆豆眼/十字星瞳、红腮红+红鼻头、马卡龙色系
 *
 * 角色：
 * 1. amnesia    — 小野·失忆（空白/灰白+淡蓝/手持空白画笔/空洞豆豆眼）
 * 2. raving     — 小野·狂啸（愤怒/深红+亮橙/怒张嘴+怒眉/声波纹理）
 * 3. floating   — 小野·漂浮（自由/天蓝+白+淡紫/气泡环绕/微笑闭眼）
 * 4. destroyer  — 小野·毁灭（力量/暗灰+荧光绿/碎裂拳套/凶狠表情）
 * 5. ghost_hirono — 小野·幽灵（游离/半透明白+淡蓝/灵魂灯笼/空洞眼）
 */
import type { PixelData } from '@engine/PixelRenderer';

// ============================================================
// 1. AMNESIA — 小野·失忆
// 空白情绪：灰白+淡蓝，手持空白画笔，空洞豆豆眼
// 配饰：画笔（右手）、头上淡淡的问号轮廓
// ============================================================
const AMNESIA_PALETTE = {
  hair:    '#b0b8c0',
  hairHi:  '#d0d8e0',
  hairDk:  '#8090a0',
  skin:    '#f0ece8',
  skinSh:  '#e0dcd8',
  blush:   '#d8a8a8',
  nose:    '#c88080',
  eyeW:    '#f0f0f0',
  eyeI:    '#a0a8b0',
  eyeB:    '#808890',
  lid:     '#e0dce0',
  lidSh:   '#c8c4c8',
  mouth:   '#c0b8b8',
  coat:    '#c8d0d8',
  coatHi:  '#e0e8f0',
  coatDk:  '#909aa4',
  coatLn:  '#707880',
  inner:   '#e8ecf0',
  shoe:    '#808890',
  outline: '#505860',
  white:   '#ffffff',
  brush:   '#e8e4e0',
  brushTip:'#f8f4f0',
};

const AMNESIA_SPRITE: PixelData = {
  width: 32, height: 32,
  pixels: [
    // Row 0-1: 头顶碎发
    ['','','','','','hairDk','hair','hair','hair','hairDk','hairDk','hair','hair','','','hair','hair','hairDk','hairDk','hair','hair','','','','','','','','','','',''],
    ['','','','hairDk','hair','hair','hair','hair','hair','hair','hair','hairHi','hairHi','hair','hair','hair','hair','hairHi','hairHi','hair','hair','hair','hair','hair','hairDk','hair','','','','','',''],

    // Row 2-3: 头发上部
    ['','hairDk','hair','hair','hair','hair','hair','hair','hair','hair','hair','hairHi','hairHi','hair','hair','hair','hair','hair','hairHi','hairHi','hair','hair','hair','hair','hair','hairDk','hairDk','','','','',''],
    ['','hairDk','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hairDk','outline','','','','',''],

    // Row 4-5: 额头
    ['','hairDk','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hairDk','outline','','','','',''],
    ['','outline','hairDk','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hairDk','hairDk','outline','','','','','',''],

    // Row 6-7: 额头皮肤
    ['','outline','hairDk','hairDk','hair','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','hair','hair','hairDk','hairDk','outline','','','','',''],
    ['','outline','hairDk','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','outline','','','','',''],

    // Row 8-9: 浮肿眼皮（空洞感）
    ['','outline','skinSh','skin','skin','skin','lid','lid','lid','lid','lid','lid','lid','lid','lid','lid','lid','lid','lid','lid','lid','lid','skin','skin','skinSh','skinSh','outline','','','','',''],
    ['outline','outline','skinSh','skin','skin','lidSh','lidSh','lidSh','lid','lid','lid','lid','lid','lid','lid','lid','lid','lid','lid','lid','lid','lid','lid','skin','skinSh','outline','outline','','','','',''],

    // Row 10-11: 豆豆眼（空洞无神，瞳孔为浅灰色）
    ['outline','skinSh','skin','skin','eyeB','eyeB','eyeW','eyeW','eyeW','eyeI','eyeI','eyeI','eyeI','eyeW','eyeW','eyeW','eyeW','eyeW','eyeI','eyeI','eyeI','eyeW','eyeW','eyeB','eyeB','skinSh','outline','','','','',''],
    ['outline','skinSh','skin','eyeB','eyeB','eyeW','eyeW','eyeW','eyeI','eyeI','eyeI','eyeI','eyeI','eyeI','eyeI','eyeI','eyeW','eyeW','eyeW','eyeI','eyeI','eyeI','eyeW','eyeW','eyeB','eyeB','skinSh','outline','','','',''],

    // Row 12-13: 眼睛下部
    ['outline','skinSh','skin','skin','eyeB','eyeB','eyeW','eyeW','eyeI','eyeI','eyeI','eyeI','eyeI','eyeI','eyeI','eyeW','eyeW','eyeW','eyeI','eyeI','eyeI','eyeW','eyeW','eyeB','eyeB','skin','skinSh','outline','','','','',''],
    ['','outline','skinSh','skin','eyeB','eyeB','eyeB','eyeB','eyeB','eyeB','eyeB','eyeB','eyeB','eyeB','eyeB','eyeB','eyeB','eyeB','eyeB','eyeB','eyeB','eyeB','eyeB','skin','skin','skinSh','outline','','','','','',''],

    // Row 14-15: 鼻子+嘴巴（小O嘴，空白感）
    ['','outline','skinSh','blush','blush','blush','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','blush','blush','blush','skin','skinSh','outline','','','','','','','',''],
    ['','outline','skinSh','blush','blush','skin','skin','skin','nose','nose','nose','skin','skin','mouth','mouth','mouth','skin','skin','skin','blush','blush','skin','skinSh','outline','','','','','','','',''],

    // Row 16-17: 下巴+脖子
    ['','outline','outline','skinSh','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','mouth','mouth','skin','skin','skin','skin','skin','skin','skin','skinSh','outline','outline','','','','','',''],
    ['','','outline','outline','skinSh','skinSh','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skinSh','skinSh','skinSh','outline','outline','','','','','','','',''],

    // Row 18-19: 外套上部
    ['','','','outline','outline','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','outline','outline','','','','','',''],
    ['','','outline','coatLn','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coatLn','outline','outline','','','','',''],

    // Row 20-23: 外套主体（右手持画笔）
    ['','outline','coatLn','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coatLn','outline','','','',''],
    ['','outline','coatLn','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','brush','brush','coatLn','outline','','','',''],
    ['outline','coatLn','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','brush','brushTip','coatLn','outline','','','',''],
    ['outline','coatLn','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','brush','brushTip','coatLn','outline','','','',''],

    // Row 24-25: 外套下部
    ['outline','coatLn','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coatLn','outline','','','',''],
    ['','outline','coatLn','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coatLn','outline','','','',''],

    // Row 26-27: 外套下摆
    ['','outline','coatLn','coatLn','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coatLn','coatLn','outline','','','','',''],
    ['','','outline','outline','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','outline','outline','','','','','','','',''],

    // Row 28-29: 裤子
    ['','','','outline','outline','coatDk','coatDk','coatDk','coatDk','coatDk','coatDk','coatDk','coatDk','coatDk','coatDk','coatDk','coatDk','coatDk','coatDk','coatDk','coatDk','coatDk','coatDk','outline','outline','','','','','','',''],
    ['','','','','outline','outline','coatDk','coatDk','coatDk','coatDk','coatDk','coatDk','coatDk','coatDk','coatDk','coatDk','coatDk','coatDk','coatDk','coatDk','coatDk','outline','outline','','','','','','','','','',''],

    // Row 30-31: 鞋子
    ['','','','','','','outline','outline','shoe','shoe','shoe','shoe','shoe','shoe','shoe','shoe','shoe','shoe','shoe','shoe','outline','outline','','','','','','','','','',''],
    ['','','','','','','','','outline','outline','outline','shoe','shoe','shoe','shoe','shoe','shoe','outline','outline','outline','','','','','','','','','','','',''],
  ],
};

// ============================================================
// 2. RAVING — 小野·狂啸
// 愤怒情绪：深红+亮橙，怒张嘴+怒眉，声波纹理外套
// 配饰：怒眉（加粗V形）、张大的嘴、外套声波纹
// ============================================================
const RAVING_PALETTE = {
  hair:    '#8a2a1a',
  hairHi:  '#b04830',
  hairDk:  '#5a1810',
  skin:    '#f5e0cc',
  skinSh:  '#e8c8b0',
  blush:   '#e87878',
  nose:    '#d06060',
  eyeW:    '#f8f0e8',
  eyeI:    '#c02010',
  eyeB:    '#3a0808',
  lid:     '#e4b8a0',
  lidSh:   '#cc9880',
  mouth:   '#a03020',
  coat:    '#c84020',
  coatHi:  '#e86840',
  coatDk:  '#802818',
  coatLn:  '#501810',
  inner:   '#f0d0b8',
  shoe:    '#501810',
  outline: '#2a0808',
  white:   '#ffffff',
  rage:    '#f0a030',
  rageHi:  '#f8c848',
};

const RAVING_SPRITE: PixelData = {
  width: 32, height: 32,
  pixels: [
    // Row 0-1: 凌乱怒发（竖起的发尖）
    ['','','hairDk','hairDk','hair','hair','hairDk','hairDk','hair','hair','hair','hairHi','hairHi','hair','hair','hairDk','hairDk','hair','hair','hairHi','hairHi','hair','hair','hairDk','hairDk','','','','','','',''],
    ['','hairDk','hair','hair','hair','hair','hair','hair','hair','hair','hair','hairHi','hairHi','hair','hair','hair','hair','hairHi','hairHi','hair','hair','hair','hair','hair','hairDk','hairDk','','','','','',''],

    // Row 2-3: 头发上部
    ['','hairDk','hair','hair','hair','hair','hair','hair','hair','hair','hair','hairHi','hairHi','hair','hair','hair','hair','hair','hairHi','hairHi','hair','hair','hair','hair','hair','hairDk','hairDk','','','','',''],
    ['','hairDk','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hairDk','outline','','','','',''],

    // Row 4-5: 额头（怒眉位置）
    ['','hairDk','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hairDk','outline','','','','',''],
    ['','outline','hairDk','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hairDk','hairDk','outline','','','','','',''],

    // Row 6-7: 怒眉（V形加粗）
    ['','outline','hairDk','hairDk','hair','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','hair','hair','hairDk','hairDk','outline','','','','',''],
    ['','outline','hairDk','skin','skin','skin','eyeB','eyeB','eyeB','eyeB','eyeB','eyeB','eyeB','eyeB','eyeB','eyeB','eyeB','eyeB','eyeB','eyeB','skin','skin','skin','skin','skin','outline','','','','',''],

    // Row 8-9: 浮肿眼皮（愤怒感）
    ['','outline','skinSh','skin','skin','eyeB','lid','lid','lid','lid','lid','lid','lid','lid','lid','lid','lid','lid','lid','lid','lid','eyeB','skin','skinSh','skinSh','outline','','','','',''],
    ['outline','outline','skinSh','skin','eyeB','eyeB','lidSh','lidSh','lid','lid','lid','lid','lid','lid','lid','lid','lid','lid','lid','lid','lidSh','eyeB','eyeB','skinSh','outline','outline','','','','',''],

    // Row 10-11: 怒目（红色瞳孔）
    ['outline','skinSh','skin','eyeB','eyeB','eyeB','eyeW','eyeW','eyeW','eyeW','eyeI','eyeI','eyeI','eyeI','eyeW','eyeW','eyeW','eyeW','eyeW','eyeB','eyeB','eyeB','eyeB','skin','skinSh','outline','','','','',''],
    ['outline','skinSh','skin','eyeB','eyeB','eyeB','eyeW','eyeW','eyeW','eyeI','eyeI','eyeI','eyeI','eyeI','eyeI','eyeI','eyeI','eyeW','eyeW','eyeW','eyeB','eyeB','eyeB','skin','skinSh','outline','','','','','',''],

    // Row 12-13: 眼睛下部
    ['outline','skinSh','skin','eyeB','eyeB','eyeW','eyeW','eyeW','eyeI','eyeI','eyeI','eyeI','eyeI','eyeI','eyeI','eyeW','eyeW','eyeW','eyeW','eyeW','eyeB','eyeB','eyeB','skin','skinSh','outline','','','','',''],
    ['','outline','skinSh','skin','eyeB','eyeB','eyeB','eyeB','eyeB','eyeB','eyeB','eyeB','eyeB','eyeB','eyeB','eyeB','eyeB','eyeB','eyeB','eyeB','eyeB','eyeB','eyeB','skin','skinSh','outline','','','','','',''],

    // Row 14-15: 鼻子+怒张嘴（大嘴）
    ['','outline','skinSh','blush','blush','blush','skin','skin','skin','skin','nose','nose','nose','skin','skin','skin','skin','skin','blush','blush','blush','skin','skinSh','outline','','','','','','','',''],
    ['','outline','skinSh','blush','blush','skin','skin','skin','mouth','mouth','mouth','mouth','mouth','mouth','mouth','mouth','mouth','mouth','mouth','blush','blush','skin','skinSh','outline','','','','','','','',''],

    // Row 16-17: 怒张嘴下部
    ['','outline','outline','skinSh','skin','skin','skin','mouth','mouth','mouth','mouth','mouth','mouth','mouth','mouth','mouth','mouth','mouth','skin','skin','skin','skin','skinSh','outline','outline','','','','','',''],
    ['','','outline','outline','skinSh','skinSh','skin','skin','mouth','mouth','mouth','mouth','mouth','mouth','mouth','mouth','mouth','skin','skinSh','skinSh','skinSh','outline','outline','','','','','','','',''],

    // Row 18-19: 外套上部（声波纹）
    ['','','','outline','outline','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','outline','outline','','','','','',''],
    ['','','outline','coatLn','coat','coat','coat','coat','coat','coat','rage','rage','rage','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coatLn','outline','outline','','','','',''],

    // Row 20-23: 外套主体（声波纹理）
    ['','outline','coatLn','coat','coat','coat','coat','coat','coat','rage','rageHi','rage','rage','rage','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coatLn','outline','','','',''],
    ['','outline','coatLn','coat','coat','coat','coat','coat','coat','coat','rage','rage','rage','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coatLn','outline','','','',''],
    ['outline','coatLn','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coatLn','outline','','','',''],
    ['outline','coatLn','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coatLn','outline','','','',''],

    // Row 24-25: 外套下部
    ['outline','coatLn','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coatLn','outline','','','',''],
    ['','outline','coatLn','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coatLn','outline','','','',''],

    // Row 26-27: 外套下摆
    ['','outline','coatLn','coatLn','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coatLn','coatLn','outline','','','','',''],
    ['','','outline','outline','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','outline','outline','','','','','','','',''],

    // Row 28-29: 裤子
    ['','','','outline','outline','coatDk','coatDk','coatDk','coatDk','coatDk','coatDk','coatDk','coatDk','coatDk','coatDk','coatDk','coatDk','coatDk','coatDk','coatDk','coatDk','coatDk','coatDk','outline','outline','','','','','','',''],
    ['','','','','outline','outline','coatDk','coatDk','coatDk','coatDk','coatDk','coatDk','coatDk','coatDk','coatDk','coatDk','coatDk','coatDk','coatDk','coatDk','coatDk','outline','outline','','','','','','','','','',''],

    // Row 30-31: 鞋子
    ['','','','','','','outline','outline','shoe','shoe','shoe','shoe','shoe','shoe','shoe','shoe','shoe','shoe','shoe','shoe','outline','outline','','','','','','','','','',''],
    ['','','','','','','','','outline','outline','outline','shoe','shoe','shoe','shoe','shoe','shoe','outline','outline','outline','','','','','','','','','','','',''],
  ],
};

// ============================================================
// 3. FLOATING — 小野·漂浮
// 自由情绪：天蓝+白+淡紫，气泡环绕，微笑闭眼
// 配饰：头顶气泡、闭眼微笑表情、淡紫色外套
// ============================================================
const FLOATING_PALETTE = {
  hair:    '#88b8d8',
  hairHi:  '#a8d0f0',
  hairDk:  '#5888a8',
  skin:    '#f8f0e8',
  skinSh:  '#f0e0d0',
  blush:   '#e8a0a0',
  nose:    '#d08888',
  eyeW:    '#f0f4f8',
  eyeI:    '#6090b0',
  eyeB:    '#406880',
  lid:     '#e0d8d0',
  lidSh:   '#c8b8a8',
  mouth:   '#d0a090',
  coat:    '#90b8d8',
  coatHi:  '#b0d0f0',
  coatDk:  '#6088a8',
  coatLn:  '#406080',
  inner:   '#e8f0f8',
  shoe:    '#507090',
  outline: '#304858',
  white:   '#ffffff',
  bubble:  '#d8e8f8',
  bubbleHi:'#f0f8ff',
  accent:  '#c0a8d8',
};

const FLOATING_SPRITE: PixelData = {
  width: 32, height: 32,
  pixels: [
    // Row 0: 头顶+气泡装饰
    ['','','','','','','bubbleHi','bubble','','','','','','','','','','','','','','','','','','bubble','','','','','',''],
    // Row 1: 碎发
    ['','','','hairDk','hair','hair','hair','hair','hair','hair','hair','hairHi','hairHi','hair','hair','hair','hair','hairHi','hairHi','hair','hair','hair','hair','hair','hairDk','hair','','','','','',''],

    // Row 2-3: 头发上部
    ['','hairDk','hair','hair','hair','hair','hair','hair','hair','hair','hair','hairHi','hairHi','hair','hair','hair','hair','hair','hairHi','hairHi','hair','hair','hair','hair','hair','hairDk','hairDk','','','','',''],
    ['','hairDk','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hairDk','outline','','','','',''],

    // Row 4-5: 额头
    ['','hairDk','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hairDk','outline','','','','',''],
    ['','outline','hairDk','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hairDk','hairDk','outline','','','','','',''],

    // Row 6-7: 额头皮肤
    ['','outline','hairDk','hairDk','hair','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','hair','hair','hairDk','hairDk','outline','','','','',''],
    ['','outline','hairDk','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','outline','','','','',''],

    // Row 8-9: 闭眼眼皮（微笑弧线）
    ['','outline','skinSh','skin','skin','skin','lid','lid','lid','lid','lid','lid','lid','lid','lid','lid','lid','lid','lid','lid','lid','lid','skin','skin','skinSh','skinSh','outline','','','','',''],
    ['outline','outline','skinSh','skin','skin','lidSh','lidSh','lidSh','lid','lid','lid','lid','lid','lid','lid','lid','lid','lid','lid','lid','lid','lid','lid','skin','skinSh','outline','outline','','','','',''],

    // Row 10-11: 闭眼微笑线（弧形）
    ['outline','skinSh','skin','skin','eyeB','eyeB','eyeB','eyeB','eyeB','eyeB','eyeB','eyeB','eyeB','eyeB','eyeB','eyeB','eyeB','eyeB','eyeB','eyeB','eyeB','eyeB','eyeB','skin','skinSh','outline','','','','',''],
    ['outline','skinSh','skin','eyeB','eyeB','eyeB','eyeB','eyeB','eyeB','eyeB','eyeB','eyeB','eyeB','eyeB','eyeB','eyeB','eyeB','eyeB','eyeB','eyeB','eyeB','eyeB','eyeB','skin','skinSh','outline','','','','','',''],

    // Row 12-13: 眼睛下部
    ['outline','skinSh','skin','skin','eyeB','eyeB','eyeB','eyeB','eyeB','eyeB','eyeB','eyeB','eyeB','eyeB','eyeB','eyeB','eyeB','eyeB','eyeB','eyeB','eyeB','eyeB','eyeB','skin','skinSh','outline','','','','',''],
    ['','outline','skinSh','skin','eyeB','eyeB','eyeB','eyeB','eyeB','eyeB','eyeB','eyeB','eyeB','eyeB','eyeB','eyeB','eyeB','eyeB','eyeB','eyeB','eyeB','eyeB','eyeB','skin','skinSh','outline','','','','','',''],

    // Row 14-15: 鼻子+微笑嘴巴
    ['','outline','skinSh','blush','blush','blush','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','blush','blush','blush','skin','skinSh','outline','','','','','','','',''],
    ['','outline','skinSh','blush','blush','skin','skin','skin','skin','nose','nose','nose','skin','skin','skin','skin','skin','skin','skin','blush','blush','skin','skinSh','outline','','','','','','','',''],

    // Row 16-17: 下巴+脖子
    ['','outline','outline','skinSh','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','mouth','mouth','skin','skin','skin','skin','skin','skin','skin','skinSh','outline','outline','','','','','',''],
    ['','','outline','outline','skinSh','skinSh','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skinSh','skinSh','skinSh','outline','outline','','','','','','','',''],

    // Row 18-19: 外套上部
    ['','','','outline','outline','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','outline','outline','','','','','',''],
    ['','','outline','coatLn','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coatLn','outline','outline','','','','',''],

    // Row 20-23: 外套主体
    ['','outline','coatLn','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coatLn','outline','','','',''],
    ['','outline','coatLn','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coatLn','outline','','','',''],
    ['outline','coatLn','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coatLn','outline','','','',''],
    ['outline','coatLn','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coatLn','outline','','','',''],

    // Row 24-25: 外套下部
    ['outline','coatLn','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coatLn','outline','','','',''],
    ['','outline','coatLn','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coatLn','outline','','','',''],

    // Row 26-27: 外套下摆
    ['','outline','coatLn','coatLn','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coatLn','coatLn','outline','','','','',''],
    ['','','outline','outline','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','outline','outline','','','','','','','',''],

    // Row 28-29: 裤子
    ['','','','outline','outline','coatDk','coatDk','coatDk','coatDk','coatDk','coatDk','coatDk','coatDk','coatDk','coatDk','coatDk','coatDk','coatDk','coatDk','coatDk','coatDk','coatDk','coatDk','outline','outline','','','','','','',''],
    ['','','','','outline','outline','coatDk','coatDk','coatDk','coatDk','coatDk','coatDk','coatDk','coatDk','coatDk','coatDk','coatDk','coatDk','coatDk','coatDk','coatDk','outline','outline','','','','','','','','','',''],

    // Row 30-31: 鞋子
    ['','','','','','','outline','outline','shoe','shoe','shoe','shoe','shoe','shoe','shoe','shoe','shoe','shoe','shoe','shoe','outline','outline','','','','','','','','','',''],
    ['','','','','','','','','outline','outline','outline','shoe','shoe','shoe','shoe','shoe','shoe','outline','outline','outline','','','','','','','','','','','',''],
  ],
};

// ============================================================
// 4. DESTROYER — 小野·毁灭
// 力量情绪：暗灰+荧光绿，碎裂拳套，凶狠表情
// 配饰：荧光绿拳套（双手）、裂痕纹理、凶狠眼神
// ============================================================
const DESTROYER_PALETTE = {
  hair:    '#3a3a3a',
  hairHi:  '#585858',
  hairDk:  '#1a1a1a',
  skin:    '#e8e0d8',
  skinSh:  '#d0c8c0',
  blush:   '#d0a0a0',
  nose:    '#c08080',
  eyeW:    '#f0f0f0',
  eyeI:    '#40e040',
  eyeB:    '#1a1a1a',
  lid:     '#d8d0c8',
  lidSh:   '#b8b0a8',
  mouth:   '#a09090',
  coat:    '#484848',
  coatHi:  '#606060',
  coatDk:  '#282828',
  coatLn:  '#181818',
  inner:   '#e0dcd8',
  shoe:    '#202020',
  outline: '#0a0a0a',
  white:   '#ffffff',
  glow:    '#40e840',
  glowDk:  '#20a020',
  crack:   '#80ff80',
};

const DESTROYER_SPRITE: PixelData = {
  width: 32, height: 32,
  pixels: [
    // Row 0-1: 短硬发
    ['','','','','','hairDk','hair','hair','hair','hairDk','hairDk','hair','hair','','','hair','hair','hairDk','hairDk','hair','hair','','','','','','','','','','',''],
    ['','','','hairDk','hair','hair','hair','hair','hair','hair','hair','hairHi','hairHi','hair','hair','hair','hair','hairHi','hairHi','hair','hair','hair','hair','hair','hairDk','hair','','','','','',''],

    // Row 2-3: 头发上部
    ['','hairDk','hair','hair','hair','hair','hair','hair','hair','hair','hair','hairHi','hairHi','hair','hair','hair','hair','hair','hairHi','hairHi','hair','hair','hair','hair','hair','hairDk','hairDk','','','','',''],
    ['','hairDk','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hairDk','outline','','','','',''],

    // Row 4-5: 额头
    ['','hairDk','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hairDk','outline','','','','',''],
    ['','outline','hairDk','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hairDk','hairDk','outline','','','','','',''],

    // Row 6-7: 额头皮肤
    ['','outline','hairDk','hairDk','hair','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','hair','hair','hairDk','hairDk','outline','','','','',''],
    ['','outline','hairDk','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','outline','','','','',''],

    // Row 8-9: 浮肿眼皮（凶狠感）
    ['','outline','skinSh','skin','skin','skin','lid','lid','lid','lid','lid','lid','lid','lid','lid','lid','lid','lid','lid','lid','lid','lid','skin','skin','skinSh','skinSh','outline','','','','',''],
    ['outline','outline','skinSh','skin','skin','lidSh','lidSh','lidSh','lid','lid','lid','lid','lid','lid','lid','lid','lid','lid','lid','lid','lid','lid','lid','skin','skinSh','outline','outline','','','','',''],

    // Row 10-11: 凶狠眼睛（绿色瞳孔）
    ['outline','skinSh','skin','skin','eyeB','eyeB','eyeB','eyeW','eyeW','eyeW','eyeW','eyeI','eyeI','eyeI','eyeI','eyeW','eyeW','eyeW','eyeW','eyeW','eyeB','eyeB','eyeB','skin','skin','skinSh','outline','','','','',''],
    ['outline','skinSh','skin','eyeB','eyeB','eyeB','eyeW','eyeW','eyeW','eyeI','eyeI','eyeI','eyeI','eyeI','eyeI','eyeI','eyeI','eyeW','eyeW','eyeW','eyeB','eyeB','eyeB','skin','skinSh','outline','','','','','',''],

    // Row 12-13: 眼睛下部
    ['outline','skinSh','skin','skin','eyeB','eyeB','eyeW','eyeW','eyeW','eyeI','eyeI','eyeI','eyeI','eyeI','eyeI','eyeI','eyeW','eyeW','eyeW','eyeB','eyeB','eyeB','skin','skin','skinSh','outline','','','','',''],
    ['','outline','skinSh','skin','eyeB','eyeB','eyeB','eyeB','eyeB','eyeB','eyeB','eyeB','eyeB','eyeB','eyeB','eyeB','eyeB','eyeB','eyeB','eyeB','eyeB','skin','skin','skin','skinSh','outline','','','','','',''],

    // Row 14-15: 鼻子+咬牙嘴
    ['','outline','skinSh','blush','blush','blush','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','blush','blush','blush','skin','skinSh','outline','','','','','','','',''],
    ['','outline','skinSh','blush','blush','skin','skin','skin','nose','nose','nose','skin','skin','mouth','mouth','mouth','skin','skin','skin','blush','blush','skin','skinSh','outline','','','','','','','',''],

    // Row 16-17: 下巴+脖子
    ['','outline','outline','skinSh','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','mouth','mouth','skin','skin','skin','skin','skin','skin','skin','skinSh','outline','outline','','','','','',''],
    ['','','outline','outline','skinSh','skinSh','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skinSh','skinSh','skinSh','outline','outline','','','','','','','',''],

    // Row 18-19: 外套上部（裂痕纹理）
    ['','','','outline','outline','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','outline','outline','','','','','',''],
    ['','','outline','coatLn','coat','coat','coat','coat','coat','coat','coat','coat','crack','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coatLn','outline','outline','','','','',''],

    // Row 20-23: 外套主体（荧光绿拳套在两侧）
    ['','outline','glow','glow','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','glow','glow','coatLn','outline','','','',''],
    ['','outline','glow','glowDk','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','glowDk','glow','coatLn','outline','','','',''],
    ['outline','glow','glowDk','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','glowDk','glow','coatLn','outline','','','',''],
    ['outline','glow','glowDk','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','glowDk','glow','coatLn','outline','','','',''],

    // Row 24-25: 外套下部
    ['outline','coatLn','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coatLn','outline','','','',''],
    ['','outline','coatLn','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coatLn','outline','','','',''],

    // Row 26-27: 外套下摆
    ['','outline','coatLn','coatLn','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coatLn','coatLn','outline','','','','',''],
    ['','','outline','outline','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','outline','outline','','','','','','','',''],

    // Row 28-29: 裤子
    ['','','','outline','outline','coatDk','coatDk','coatDk','coatDk','coatDk','coatDk','coatDk','coatDk','coatDk','coatDk','coatDk','coatDk','coatDk','coatDk','coatDk','coatDk','coatDk','coatDk','outline','outline','','','','','','',''],
    ['','','','','outline','outline','coatDk','coatDk','coatDk','coatDk','coatDk','coatDk','coatDk','coatDk','coatDk','coatDk','coatDk','coatDk','coatDk','coatDk','coatDk','outline','outline','','','','','','','','','',''],

    // Row 30-31: 鞋子
    ['','','','','','','outline','outline','shoe','shoe','shoe','shoe','shoe','shoe','shoe','shoe','shoe','shoe','shoe','shoe','outline','outline','','','','','','','','','',''],
    ['','','','','','','','','outline','outline','outline','shoe','shoe','shoe','shoe','shoe','shoe','outline','outline','outline','','','','','','','','','','','',''],
  ],
};

// ============================================================
// 5. GHOST_HIRONO — 小野·幽灵
// 游离情绪：半透明白+淡蓝，灵魂灯笼，空洞眼
// 配饰：灵魂灯笼（右手）、半透明身体、幽灵光晕
// ============================================================
const GHOST_PALETTE = {
  hair:    '#c8d8e8',
  hairHi:  '#e0e8f0',
  hairDk:  '#90a8c0',
  skin:    '#f0f0f0',
  skinSh:  '#e0e0e0',
  blush:   '#d8b8b8',
  nose:    '#c8a0a0',
  eyeW:    '#f8f8f8',
  eyeI:    '#8098b0',
  eyeB:    '#607888',
  lid:     '#e8e8e8',
  lidSh:   '#d0d0d0',
  mouth:   '#b8b0b0',
  coat:    '#d0dce8',
  coatHi:  '#e8f0f8',
  coatDk:  '#a0b0c0',
  coatLn:  '#8098a8',
  inner:   '#f0f4f8',
  shoe:    '#8898a8',
  outline: '#607080',
  white:   '#ffffff',
  lantern: '#f0d860',
  lanternG:'#f8e8a0',
  ghost:   '#e0e8f0',
  wisp:    '#c0d0e0',
};

const GHOST_SPRITE: PixelData = {
  width: 32, height: 32,
  pixels: [
    // Row 0-1: 头顶碎发+幽灵光晕
    ['','','','','','','wisp','hair','hair','hairDk','hairDk','hair','hair','','','hair','hair','hairDk','hairDk','hair','hair','','','','wisp','','','','','','',''],
    ['','','','hairDk','hair','hair','hair','hair','hair','hair','hair','hairHi','hairHi','hair','hair','hair','hair','hairHi','hairHi','hair','hair','hair','hair','hair','hairDk','hair','','','','','',''],

    // Row 2-3: 头发上部
    ['','hairDk','hair','hair','hair','hair','hair','hair','hair','hair','hair','hairHi','hairHi','hair','hair','hair','hair','hair','hairHi','hairHi','hair','hair','hair','hair','hair','hairDk','hairDk','','','','',''],
    ['','hairDk','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hairDk','outline','','','','',''],

    // Row 4-5: 额头
    ['','hairDk','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hairDk','outline','','','','',''],
    ['','outline','hairDk','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hairDk','hairDk','outline','','','','','',''],

    // Row 6-7: 额头皮肤
    ['','outline','hairDk','hairDk','hair','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','hair','hair','hairDk','hairDk','outline','','','','',''],
    ['','outline','hairDk','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','outline','','','','',''],

    // Row 8-9: 浮肿眼皮（游离感）
    ['','outline','skinSh','skin','skin','skin','lid','lid','lid','lid','lid','lid','lid','lid','lid','lid','lid','lid','lid','lid','lid','lid','skin','skin','skinSh','skinSh','outline','','','','',''],
    ['outline','outline','skinSh','skin','skin','lidSh','lidSh','lidSh','lid','lid','lid','lid','lid','lid','lid','lid','lid','lid','lid','lid','lid','lid','lid','skin','skinSh','outline','outline','','','','',''],

    // Row 10-11: 空洞眼（淡蓝瞳孔）
    ['outline','skinSh','skin','skin','eyeB','eyeB','eyeW','eyeW','eyeW','eyeW','eyeI','eyeI','eyeI','eyeI','eyeW','eyeW','eyeW','eyeW','eyeW','eyeB','eyeB','eyeB','skin','skin','skinSh','outline','','','','',''],
    ['outline','skinSh','skin','eyeB','eyeB','eyeB','eyeW','eyeW','eyeW','eyeI','eyeI','eyeI','eyeI','eyeI','eyeI','eyeI','eyeI','eyeW','eyeW','eyeW','eyeB','eyeB','eyeB','skin','skinSh','outline','','','','','',''],

    // Row 12-13: 眼睛下部
    ['outline','skinSh','skin','skin','eyeB','eyeB','eyeW','eyeW','eyeW','eyeI','eyeI','eyeI','eyeI','eyeI','eyeI','eyeI','eyeW','eyeW','eyeW','eyeB','eyeB','eyeB','skin','skin','skinSh','outline','','','','',''],
    ['','outline','skinSh','skin','eyeB','eyeB','eyeB','eyeB','eyeB','eyeB','eyeB','eyeB','eyeB','eyeB','eyeB','eyeB','eyeB','eyeB','eyeB','eyeB','eyeB','skin','skin','skin','skinSh','outline','','','','','',''],

    // Row 14-15: 鼻子+小嘴
    ['','outline','skinSh','blush','blush','blush','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','blush','blush','blush','skin','skinSh','outline','','','','','','','',''],
    ['','outline','skinSh','blush','blush','skin','skin','skin','skin','nose','nose','nose','skin','skin','skin','skin','skin','skin','skin','blush','blush','skin','skinSh','outline','','','','','','','',''],

    // Row 16-17: 下巴+脖子
    ['','outline','outline','skinSh','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','mouth','mouth','skin','skin','skin','skin','skin','skin','skin','skinSh','outline','outline','','','','','',''],
    ['','','outline','outline','skinSh','skinSh','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skinSh','skinSh','skinSh','outline','outline','','','','','','','',''],

    // Row 18-19: 外套上部
    ['','','','outline','outline','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','outline','outline','','','','','',''],
    ['','','outline','coatLn','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coatLn','outline','outline','','','','',''],

    // Row 20-23: 外套主体（右手持灯笼）
    ['','outline','coatLn','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','lantern','lantern','coatLn','outline','','','',''],
    ['','outline','coatLn','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','lanternG','lantern','coatLn','outline','','','',''],
    ['outline','coatLn','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','lanternG','lantern','coatLn','outline','','','',''],
    ['outline','coatLn','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coatLn','outline','','','',''],

    // Row 24-25: 外套下部
    ['outline','coatLn','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coatLn','outline','','','',''],
    ['','outline','coatLn','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coatLn','outline','','','',''],

    // Row 26-27: 外套下摆
    ['','outline','coatLn','coatLn','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coatLn','coatLn','outline','','','','',''],
    ['','','outline','outline','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','outline','outline','','','','','','','',''],

    // Row 28-29: 裤子
    ['','','','outline','outline','coatDk','coatDk','coatDk','coatDk','coatDk','coatDk','coatDk','coatDk','coatDk','coatDk','coatDk','coatDk','coatDk','coatDk','coatDk','coatDk','coatDk','coatDk','outline','outline','','','','','','',''],
    ['','','','','outline','outline','coatDk','coatDk','coatDk','coatDk','coatDk','coatDk','coatDk','coatDk','coatDk','coatDk','coatDk','coatDk','coatDk','coatDk','coatDk','outline','outline','','','','','','','','','',''],

    // Row 30-31: 鞋子
    ['','','','','','','outline','outline','shoe','shoe','shoe','shoe','shoe','shoe','shoe','shoe','shoe','shoe','shoe','shoe','outline','outline','','','','','','','','','',''],
    ['','','','','','','','','outline','outline','outline','shoe','shoe','shoe','shoe','shoe','shoe','outline','outline','outline','','','','','','','','','','','',''],
  ],
};

// ============================================================
// 导出所有精灵
// ============================================================
export const SPRITES_BATCH_1: CharacterSprite[] = [
  {
    id: 'amnesia',
    name: '小野·失忆',
    hironoSeries: 'HIRONO - 空白',
    palette: AMNESIA_PALETTE,
    sprite: AMNESIA_SPRITE,
  },
  {
    id: 'raving',
    name: '小野·狂啸',
    hironoSeries: 'HIRONO - 愤怒',
    palette: RAVING_PALETTE,
    sprite: RAVING_SPRITE,
  },
  {
    id: 'floating',
    name: '小野·漂浮',
    hironoSeries: 'HIRONO - 自由',
    palette: FLOATING_PALETTE,
    sprite: FLOATING_SPRITE,
  },
  {
    id: 'destroyer',
    name: '小野·毁灭',
    hironoSeries: 'HIRONO - 力量',
    palette: DESTROYER_PALETTE,
    sprite: DESTROYER_SPRITE,
  },
  {
    id: 'ghost_hirono',
    name: '小野·幽灵',
    hironoSeries: 'HIRONO - 游离',
    palette: GHOST_PALETTE,
    sprite: GHOST_SPRITE,
  },
];

// CharacterSprite 类型内联定义（避免循环引用）
interface CharacterSprite {
  readonly id: string;
  readonly name: string;
  readonly hironoSeries: string;
  readonly palette: Record<string, string>;
  readonly sprite: PixelData;
}
