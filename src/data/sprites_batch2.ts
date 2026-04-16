/**
 * HIRONO 小野风格像素精灵 - 批次2
 *
 * 角色：
 * 6. healer     — 小野·治愈（温暖/暖粉+奶油白+薄荷绿/花朵装饰/温柔微笑）
 * 7. marionette — 小野·木偶（无力/木纹棕+金色线/操控丝线/无神眼+木纹身体）
 * 8. fox        — 小野·狐狸（狡黠/橙色+白+黑/狐耳+狐尾/狡猾笑眼）
 * 9. crow       — 小野·乌鸦（深沉/纯黑+紫光泽/黑羽/锐利眼）
 * 10. pianist   — 小野·钢琴家（艺术/黑白燕尾服+金/音符装饰/优雅表情）
 */
import type { PixelData } from '@engine/PixelRenderer';

// CharacterSprite 类型内联定义（避免循环引用）
interface CharacterSprite {
  readonly id: string;
  readonly name: string;
  readonly hironoSeries: string;
  readonly palette: Record<string, string>;
  readonly sprite: PixelData;
}

// ============================================================
// 6. HEALER — 小野·治愈
// 温暖情绪：暖粉+奶油白+薄荷绿，花朵装饰，温柔微笑
// 配饰：头上的小花、薄荷绿外套、温柔闭眼微笑
// ============================================================
const HEALER_PALETTE = {
  hair:    '#d8a8b0',
  hairHi:  '#e8c0c8',
  hairDk:  '#b08088',
  skin:    '#f8f0e8',
  skinSh:  '#f0e0d0',
  blush:   '#e8a0a0',
  nose:    '#d08888',
  eyeW:    '#f8f4f0',
  eyeI:    '#80a080',
  eyeB:    '#607060',
  lid:     '#e8d8d0',
  lidSh:   '#d0c0b0',
  mouth:   '#d0a090',
  coat:    '#a8d8b8',
  coatHi:  '#c0e8d0',
  coatDk:  '#78b088',
  coatLn:  '#589068',
  inner:   '#f0f8f0',
  shoe:    '#689878',
  outline: '#405848',
  white:   '#ffffff',
  flower:  '#f0a0b0',
  flowerC: '#f8d060',
  leaf:    '#80c090',
};

const HEALER_SPRITE: PixelData = {
  width: 32, height: 32,
  pixels: [
    // Row 0: 头顶+小花装饰
    ['','','','','','','flowerC','flower','flowerC','','','','','','','','','','','','','','flower','','','','','','',''],
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

    // Row 8-9: 温柔闭眼
    ['','outline','skinSh','skin','skin','skin','lid','lid','lid','lid','lid','lid','lid','lid','lid','lid','lid','lid','lid','lid','lid','lid','skin','skin','skinSh','skinSh','outline','','','','',''],
    ['outline','outline','skinSh','skin','skin','lidSh','lidSh','lidSh','lid','lid','lid','lid','lid','lid','lid','lid','lid','lid','lid','lid','lid','lid','lid','skin','skinSh','outline','outline','','','','',''],

    // Row 10-11: 闭眼微笑弧线
    ['outline','skinSh','skin','skin','eyeB','eyeB','eyeB','eyeB','eyeB','eyeB','eyeB','eyeB','eyeB','eyeB','eyeB','eyeB','eyeB','eyeB','eyeB','eyeB','eyeB','eyeB','eyeB','skin','skinSh','outline','','','','',''],
    ['outline','skinSh','skin','eyeB','eyeB','eyeB','eyeB','eyeB','eyeB','eyeB','eyeB','eyeB','eyeB','eyeB','eyeB','eyeB','eyeB','eyeB','eyeB','eyeB','eyeB','eyeB','eyeB','skin','skinSh','outline','','','','','',''],

    // Row 12-13: 眼睛下部
    ['outline','skinSh','skin','skin','eyeB','eyeB','eyeB','eyeB','eyeB','eyeB','eyeB','eyeB','eyeB','eyeB','eyeB','eyeB','eyeB','eyeB','eyeB','eyeB','eyeB','eyeB','eyeB','skin','skinSh','outline','','','','',''],
    ['','outline','skinSh','skin','eyeB','eyeB','eyeB','eyeB','eyeB','eyeB','eyeB','eyeB','eyeB','eyeB','eyeB','eyeB','eyeB','eyeB','eyeB','eyeB','eyeB','eyeB','eyeB','skin','skinSh','outline','','','','','',''],

    // Row 14-15: 鼻子+温柔微笑
    ['','outline','skinSh','blush','blush','blush','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','blush','blush','blush','skin','skinSh','outline','','','','','','','',''],
    ['','outline','skinSh','blush','blush','skin','skin','skin','skin','nose','nose','nose','skin','skin','skin','skin','skin','skin','skin','blush','blush','skin','skinSh','outline','','','','','','','',''],

    // Row 16-17: 下巴+脖子
    ['','outline','outline','skinSh','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','mouth','mouth','skin','skin','skin','skin','skin','skin','skin','skinSh','outline','outline','','','','','',''],
    ['','','outline','outline','skinSh','skinSh','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skinSh','skinSh','skinSh','outline','outline','','','','','','','',''],

    // Row 18-19: 薄荷绿外套上部
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
// 7. MARIONETTE — 小野·木偶
// 无力情绪：木纹棕+金色线，操控丝线，无神眼+木纹身体
// 配饰：头顶金色十字木栓、金色丝线从手腕延伸、木纹外套
// ============================================================
const MARIONETTE_PALETTE = {
  hair:    '#8a6840',
  hairHi:  '#a88058',
  hairDk:  '#604828',
  skin:    '#e8d8c0',
  skinSh:  '#d0c0a0',
  blush:   '#d8a090',
  nose:    '#c88878',
  eyeW:    '#f0e8e0',
  eyeI:    '#a08868',
  eyeB:    '#504030',
  lid:     '#d8c8a8',
  lidSh:   '#c0a888',
  mouth:   '#b09080',
  coat:    '#a08058',
  coatHi:  '#b89870',
  coatDk:  '#705838',
  coatLn:  '#503820',
  inner:   '#e0d0b8',
  shoe:    '#503820',
  outline: '#302010',
  white:   '#ffffff',
  wood:    '#907050',
  woodDk:  '#685030',
  gold:    '#d8b040',
  goldHi:  '#f0d060',
  string:  '#c8a030',
};

const MARIONETTE_SPRITE: PixelData = {
  width: 32, height: 32,
  pixels: [
    // Row 0: 头顶+金色十字木栓
    ['','','','','','','','goldHi','gold','goldHi','','','','','','','','','','goldHi','gold','goldHi','','','','','','','','',''],
    // Row 1: 碎发+丝线
    ['','','string','','','hairDk','hair','hair','hair','hair','hair','hairHi','hairHi','hair','hair','hair','hair','hairHi','hairHi','hair','hair','hair','hair','hair','hairDk','hair','','string','','','',''],

    // Row 2-3: 头发上部+丝线
    ['','string','','hairDk','hair','hair','hair','hair','hair','hair','hair','hairHi','hairHi','hair','hair','hair','hair','hair','hairHi','hairHi','hair','hair','hair','hair','hair','hairDk','hairDk','','string','','',''],
    ['','string','','hairDk','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hairDk','outline','','string','','',''],

    // Row 4-5: 额头+丝线
    ['','string','','hairDk','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hairDk','outline','','string','','','',''],
    ['','string','','outline','hairDk','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hairDk','hairDk','outline','','string','','','','',''],

    // Row 6-7: 额头皮肤
    ['','string','','outline','hairDk','hairDk','hair','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','hair','hair','hairDk','hairDk','outline','','string','','','','',''],
    ['','string','','outline','hairDk','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','outline','','string','','','','',''],

    // Row 8-9: 浮肿眼皮（无神感）
    ['','string','','outline','skinSh','skin','skin','skin','lid','lid','lid','lid','lid','lid','lid','lid','lid','lid','lid','lid','lid','lid','lid','skin','skinSh','skinSh','outline','','string','','','','',''],
    ['','string','string','outline','skinSh','skin','skin','lidSh','lidSh','lidSh','lid','lid','lid','lid','lid','lid','lid','lid','lid','lid','lid','lid','lid','skin','skinSh','outline','string','string','','','','',''],

    // Row 10-11: 无神眼（木色瞳孔）
    ['','string','','outline','skinSh','skin','skin','eyeB','eyeB','eyeB','eyeW','eyeW','eyeW','eyeW','eyeI','eyeI','eyeI','eyeI','eyeW','eyeW','eyeW','eyeW','eyeB','eyeB','eyeB','skin','skinSh','outline','','string','','','','',''],
    ['','string','','outline','skinSh','skin','eyeB','eyeB','eyeB','eyeW','eyeW','eyeW','eyeI','eyeI','eyeI','eyeI','eyeI','eyeI','eyeI','eyeW','eyeW','eyeW','eyeB','eyeB','eyeB','skin','skinSh','outline','','string','','','','','',''],

    // Row 12-13: 眼睛下部
    ['','string','','outline','skinSh','skin','skin','eyeB','eyeB','eyeW','eyeW','eyeW','eyeI','eyeI','eyeI','eyeI','eyeI','eyeW','eyeW','eyeW','eyeW','eyeB','eyeB','eyeB','skin','skinSh','outline','','string','','','','',''],
    ['','string','','','outline','skinSh','skin','eyeB','eyeB','eyeB','eyeB','eyeB','eyeB','eyeB','eyeB','eyeB','eyeB','eyeB','eyeB','eyeB','eyeB','eyeB','eyeB','eyeB','skin','skinSh','outline','','string','','','','','',''],

    // Row 14-15: 鼻子+小嘴
    ['','string','','','outline','skinSh','blush','blush','blush','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','blush','blush','blush','skin','skinSh','outline','','','string','','','','','','',''],
    ['','string','','','outline','skinSh','blush','blush','skin','skin','skin','nose','nose','nose','skin','skin','skin','skin','skin','skin','blush','blush','skin','skinSh','outline','','','string','','','','','','',''],

    // Row 16-17: 下巴+脖子
    ['','string','','','outline','outline','skinSh','skin','skin','skin','skin','skin','skin','skin','skin','mouth','mouth','skin','skin','skin','skin','skin','skin','skinSh','outline','outline','','string','','','','','',''],
    ['','','','','','outline','outline','skinSh','skinSh','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skinSh','skinSh','skinSh','outline','outline','','','','','','','','','',''],

    // Row 18-19: 木纹外套上部
    ['','','','outline','outline','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','outline','outline','','','','','',''],
    ['','','outline','coatLn','wood','wood','wood','wood','wood','wood','wood','wood','wood','wood','wood','wood','wood','wood','wood','wood','wood','wood','wood','wood','coatLn','outline','outline','','','','',''],

    // Row 20-23: 外套主体（木纹+金色丝线延伸）
    ['','outline','coatLn','wood','wood','wood','wood','wood','wood','wood','wood','wood','wood','wood','wood','wood','wood','wood','wood','wood','wood','wood','wood','wood','wood','coatLn','outline','','','',''],
    ['','outline','coatLn','wood','wood','wood','wood','wood','wood','wood','wood','wood','wood','wood','wood','wood','wood','wood','wood','wood','wood','wood','wood','wood','wood','coatLn','outline','','','',''],
    ['outline','coatLn','wood','wood','wood','wood','wood','wood','wood','wood','wood','wood','wood','wood','wood','wood','wood','wood','wood','wood','wood','wood','wood','wood','wood','wood','coatLn','outline','','','',''],
    ['outline','coatLn','wood','wood','wood','wood','wood','wood','wood','wood','wood','wood','wood','wood','wood','wood','wood','wood','wood','wood','wood','wood','wood','wood','wood','wood','coatLn','outline','','','',''],

    // Row 24-25: 外套下部
    ['outline','coatLn','wood','wood','wood','wood','wood','wood','wood','wood','wood','wood','wood','wood','wood','wood','wood','wood','wood','wood','wood','wood','wood','wood','wood','wood','coatLn','outline','','','',''],
    ['','outline','coatLn','wood','wood','wood','wood','wood','wood','wood','wood','wood','wood','wood','wood','wood','wood','wood','wood','wood','wood','wood','wood','wood','wood','wood','coatLn','outline','','','',''],

    // Row 26-27: 外套下摆
    ['','outline','coatLn','coatLn','wood','wood','wood','wood','wood','wood','wood','wood','wood','wood','wood','wood','wood','wood','wood','wood','wood','wood','wood','wood','coatLn','coatLn','outline','','','','',''],
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
// 8. FOX — 小野·狐狸
// 狡黠情绪：橙色+白+黑，狐耳+狐尾，狡猾笑眼
// 配饰：头顶三角狐耳（两侧）、身后狐尾、眯眼狡笑
// ============================================================
const FOX_PALETTE = {
  hair:    '#e08830',
  hairHi:  '#f0a848',
  hairDk:  '#b06020',
  skin:    '#f8f0e8',
  skinSh:  '#f0e0d0',
  blush:   '#e8a0a0',
  nose:    '#d08888',
  eyeW:    '#f8f4f0',
  eyeI:    '#303030',
  eyeB:    '#1a1a1a',
  lid:     '#e8d8d0',
  lidSh:   '#d0c0b0',
  mouth:   '#c09080',
  coat:    '#e89040',
  coatHi:  '#f0a858',
  coatDk:  '#b06828',
  coatLn:  '#804818',
  inner:   '#f8f0e0',
  shoe:    '#804818',
  outline: '#302010',
  white:   '#ffffff',
  ear:     '#e89040',
  earIn:   '#f8d0b0',
  tail:    '#e89040',
  tailTip: '#f8f0e0',
};

const FOX_SPRITE: PixelData = {
  width: 32, height: 32,
  pixels: [
    // Row 0: 狐耳尖端
    ['earIn','ear','','','','','','','','','','','','','','','','','','','','','','','','','ear','','earIn','',''],
    // Row 1: 狐耳+碎发
    ['ear','ear','earIn','','','hairDk','hair','hair','hair','hairDk','hairDk','hair','hair','','','hair','hair','hairDk','hairDk','hair','hair','','','','','','earIn','ear','ear','',''],

    // Row 2-3: 狐耳根部+头发
    ['','ear','ear','','hairDk','hair','hair','hair','hair','hair','hair','hairHi','hairHi','hair','hair','hair','hair','hairHi','hairHi','hair','hair','hair','hair','hair','hairDk','hairDk','','ear','ear','','',''],
    ['','earIn','ear','','hairDk','hair','hair','hair','hair','hair','hair','hairHi','hairHi','hair','hair','hair','hair','hairHi','hairHi','hair','hair','hair','hair','hair','hairDk','hairDk','','ear','earIn','','',''],

    // Row 4-5: 额头
    ['','','','hairDk','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hairDk','outline','','','','',''],
    ['','outline','hairDk','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hairDk','hairDk','outline','','','','','',''],

    // Row 6-7: 额头皮肤
    ['','outline','hairDk','hairDk','hair','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','hair','hair','hairDk','hairDk','outline','','','','',''],
    ['','outline','hairDk','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','outline','','','','',''],

    // Row 8-9: 狡黠眯眼
    ['','outline','skinSh','skin','skin','skin','lid','lid','lid','lid','lid','lid','lid','lid','lid','lid','lid','lid','lid','lid','lid','lid','skin','skin','skinSh','skinSh','outline','','','','',''],
    ['outline','outline','skinSh','skin','skin','lidSh','lidSh','lidSh','lid','lid','lid','lid','lid','lid','lid','lid','lid','lid','lid','lid','lid','lid','lid','skin','skinSh','outline','outline','','','','',''],

    // Row 10-11: 狡猾笑眼（眯成弧线）
    ['outline','skinSh','skin','skin','eyeB','eyeB','eyeB','eyeB','eyeB','eyeB','eyeB','eyeB','eyeB','eyeB','eyeB','eyeB','eyeB','eyeB','eyeB','eyeB','eyeB','eyeB','eyeB','skin','skinSh','outline','','','','',''],
    ['outline','skinSh','skin','eyeB','eyeB','eyeB','eyeB','eyeB','eyeB','eyeB','eyeB','eyeB','eyeB','eyeB','eyeB','eyeB','eyeB','eyeB','eyeB','eyeB','eyeB','eyeB','eyeB','skin','skinSh','outline','','','','','',''],

    // Row 12-13: 眼睛下部
    ['outline','skinSh','skin','skin','eyeB','eyeB','eyeB','eyeB','eyeB','eyeB','eyeB','eyeB','eyeB','eyeB','eyeB','eyeB','eyeB','eyeB','eyeB','eyeB','eyeB','eyeB','eyeB','skin','skinSh','outline','','','','',''],
    ['','outline','skinSh','skin','eyeB','eyeB','eyeB','eyeB','eyeB','eyeB','eyeB','eyeB','eyeB','eyeB','eyeB','eyeB','eyeB','eyeB','eyeB','eyeB','eyeB','eyeB','eyeB','skin','skinSh','outline','','','','','',''],

    // Row 14-15: 鼻子+狡笑
    ['','outline','skinSh','blush','blush','blush','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','blush','blush','blush','skin','skinSh','outline','','','','','','','',''],
    ['','outline','skinSh','blush','blush','skin','skin','skin','skin','nose','nose','nose','skin','skin','skin','skin','skin','skin','skin','blush','blush','skin','skinSh','outline','','','','','','','',''],

    // Row 16-17: 下巴+脖子
    ['','outline','outline','skinSh','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','mouth','mouth','skin','skin','skin','skin','skin','skin','skin','skinSh','outline','outline','','','','','',''],
    ['','','outline','outline','skinSh','skinSh','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skinSh','skinSh','skinSh','outline','outline','','','','','','','',''],

    // Row 18-19: 外套上部
    ['','','','outline','outline','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','outline','outline','','','','','',''],
    ['','','outline','coatLn','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coatLn','outline','outline','','','','',''],

    // Row 20-23: 外套主体
    ['','outline','coatLn','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coatLn','outline','','','',''],
    ['','outline','coatLn','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coatLn','outline','','','',''],
    ['outline','coatLn','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coatLn','outline','','','',''],
    ['outline','coatLn','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coatLn','outline','','','',''],

    // Row 24-25: 外套下部+狐尾
    ['outline','coatLn','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','tail','tail','coatLn','outline','','','',''],
    ['','outline','coatLn','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','tail','tailTip','tail','coatLn','outline','','','',''],

    // Row 26-27: 外套下摆+狐尾
    ['','outline','coatLn','coatLn','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','tailTip','tail','tail','coatLn','coatLn','outline','','','','',''],
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
// 9. CROW — 小野·乌鸦
// 深沉情绪：纯黑+紫光泽，黑羽装饰，锐利眼
// 配饰：黑羽（头侧）、紫色光泽高光、锐利窄眼
// ============================================================
const CROW_PALETTE = {
  hair:    '#1a1a2e',
  hairHi:  '#2a2a40',
  hairDk:  '#0a0a18',
  skin:    '#e8e0e8',
  skinSh:  '#d0c8d8',
  blush:   '#c8a0b8',
  nose:    '#b888a0',
  eyeW:    '#f0e8f0',
  eyeI:    '#8040a0',
  eyeB:    '#0a0a10',
  lid:     '#d0c0d0',
  lidSh:   '#b0a0b8',
  mouth:   '#a090a0',
  coat:    '#1a1a28',
  coatHi:  '#2a2a3e',
  coatDk:  '#0a0a14',
  coatLn:  '#08080e',
  inner:   '#d8d0e0',
  shoe:    '#0a0a14',
  outline: '#050508',
  white:   '#ffffff',
  feather: '#1e1e30',
  purple:  '#6040a0',
  purpleHi:'#8860c0',
};

const CROW_SPRITE: PixelData = {
  width: 32, height: 32,
  pixels: [
    // Row 0-1: 头顶+黑羽装饰
    ['','','','','','feather','hair','hair','hair','hairDk','hairDk','hair','hair','','','hair','hair','hairDk','hairDk','hair','hair','','','','','','','','','','',''],
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

    // Row 8-9: 浮肿眼皮（深沉感）
    ['','outline','skinSh','skin','skin','skin','lid','lid','lid','lid','lid','lid','lid','lid','lid','lid','lid','lid','lid','lid','lid','lid','skin','skin','skinSh','skinSh','outline','','','','',''],
    ['outline','outline','skinSh','skin','skin','lidSh','lidSh','lidSh','lid','lid','lid','lid','lid','lid','lid','lid','lid','lid','lid','lid','lid','lid','lid','skin','skinSh','outline','outline','','','','',''],

    // Row 10-11: 锐利眼（紫色瞳孔，窄眼）
    ['outline','skinSh','skin','skin','eyeB','eyeB','eyeB','eyeW','eyeW','eyeW','eyeI','eyeI','eyeI','eyeI','eyeW','eyeW','eyeW','eyeW','eyeW','eyeB','eyeB','eyeB','skin','skin','skinSh','outline','','','','',''],
    ['outline','skinSh','skin','eyeB','eyeB','eyeB','eyeW','eyeW','eyeI','eyeI','eyeI','eyeI','eyeI','eyeI','eyeI','eyeI','eyeW','eyeW','eyeW','eyeB','eyeB','eyeB','skin','skinSh','outline','','','','','',''],

    // Row 12-13: 眼睛下部
    ['outline','skinSh','skin','skin','eyeB','eyeB','eyeW','eyeW','eyeI','eyeI','eyeI','eyeI','eyeI','eyeI','eyeI','eyeW','eyeW','eyeW','eyeW','eyeB','eyeB','eyeB','skin','skin','skinSh','outline','','','','',''],
    ['','outline','skinSh','skin','eyeB','eyeB','eyeB','eyeB','eyeB','eyeB','eyeB','eyeB','eyeB','eyeB','eyeB','eyeB','eyeB','eyeB','eyeB','eyeB','eyeB','skin','skin','skin','skinSh','outline','','','','','',''],

    // Row 14-15: 鼻子+嘴
    ['','outline','skinSh','blush','blush','blush','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','blush','blush','blush','skin','skinSh','outline','','','','','','','',''],
    ['','outline','skinSh','blush','blush','skin','skin','skin','skin','nose','nose','nose','skin','skin','skin','skin','skin','skin','skin','blush','blush','skin','skinSh','outline','','','','','','','',''],

    // Row 16-17: 下巴+脖子
    ['','outline','outline','skinSh','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','mouth','mouth','skin','skin','skin','skin','skin','skin','skin','skinSh','outline','outline','','','','','',''],
    ['','','outline','outline','skinSh','skinSh','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skinSh','skinSh','skinSh','outline','outline','','','','','','','',''],

    // Row 18-19: 黑色外套上部（紫色光泽）
    ['','','','outline','outline','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','outline','outline','','','','','',''],
    ['','','outline','coatLn','coat','coat','coat','coat','coat','coat','coat','purpleHi','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coatLn','outline','outline','','','','',''],

    // Row 20-23: 外套主体
    ['','outline','coatLn','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coatLn','outline','','','',''],
    ['','outline','coatLn','coat','coat','coat','coat','coat','coat','coat','coat','coat','purple','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coatLn','outline','','','',''],
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
// 10. PIANIST — 小野·钢琴家
// 艺术情绪：黑白燕尾服+金，音符装饰，优雅表情
// 配饰：燕尾服（黑白）、金色领结、优雅半闭眼
// ============================================================
const PIANIST_PALETTE = {
  hair:    '#2a2a2a',
  hairHi:  '#404040',
  hairDk:  '#101010',
  skin:    '#f0e8e0',
  skinSh:  '#e0d0c0',
  blush:   '#d8a0a0',
  nose:    '#c88888',
  eyeW:    '#f4f0e8',
  eyeI:    '#3a3020',
  eyeB:    '#1a1a18',
  lid:     '#e0d4c8',
  lidSh:   '#c8b8a0',
  mouth:   '#b09080',
  coat:    '#1a1a1a',
  coatHi:  '#2e2e2e',
  coatDk:  '#0a0a0a',
  coatLn:  '#080808',
  inner:   '#f0ece8',
  shoe:    '#0a0a0a',
  outline: '#050505',
  white:   '#ffffff',
  gold:    '#d8b040',
  goldHi:  '#f0d060',
  lapel:   '#e8e4e0',
};

const PIANIST_SPRITE: PixelData = {
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

    // Row 8-9: 浮肿眼皮（优雅感）
    ['','outline','skinSh','skin','skin','skin','lid','lid','lid','lid','lid','lid','lid','lid','lid','lid','lid','lid','lid','lid','lid','lid','skin','skin','skinSh','skinSh','outline','','','','',''],
    ['outline','outline','skinSh','skin','skin','lidSh','lidSh','lidSh','lid','lid','lid','lid','lid','lid','lid','lid','lid','lid','lid','lid','lid','lid','lid','skin','skinSh','outline','outline','','','','',''],

    // Row 10-11: 优雅半闭眼
    ['outline','skinSh','skin','skin','eyeB','eyeB','eyeB','eyeW','eyeW','eyeW','eyeW','eyeI','eyeI','eyeI','eyeI','eyeW','eyeW','eyeW','eyeW','eyeW','eyeB','eyeB','eyeB','skin','skin','skinSh','outline','','','','',''],
    ['outline','skinSh','skin','eyeB','eyeB','eyeB','eyeW','eyeW','eyeW','eyeI','eyeI','eyeI','eyeI','eyeI','eyeI','eyeI','eyeI','eyeW','eyeW','eyeW','eyeB','eyeB','eyeB','skin','skinSh','outline','','','','','',''],

    // Row 12-13: 眼睛下部
    ['outline','skinSh','skin','skin','eyeB','eyeB','eyeW','eyeW','eyeW','eyeI','eyeI','eyeI','eyeI','eyeI','eyeI','eyeI','eyeW','eyeW','eyeW','eyeB','eyeB','eyeB','skin','skin','skinSh','outline','','','','',''],
    ['','outline','skinSh','skin','eyeB','eyeB','eyeB','eyeB','eyeB','eyeB','eyeB','eyeB','eyeB','eyeB','eyeB','eyeB','eyeB','eyeB','eyeB','eyeB','eyeB','skin','skin','skin','skinSh','outline','','','','','',''],

    // Row 14-15: 鼻子+嘴
    ['','outline','skinSh','blush','blush','blush','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','blush','blush','blush','skin','skinSh','outline','','','','','','','',''],
    ['','outline','skinSh','blush','blush','skin','skin','skin','skin','nose','nose','nose','skin','skin','skin','skin','skin','skin','skin','blush','blush','skin','skinSh','outline','','','','','','','',''],

    // Row 16-17: 下巴+脖子+金色领结
    ['','outline','outline','skinSh','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','mouth','mouth','skin','skin','skin','skin','skin','skin','skin','skinSh','outline','outline','','','','','',''],
    ['','','outline','outline','skinSh','skinSh','skin','skin','skin','gold','goldHi','gold','goldHi','gold','skin','skin','skin','skinSh','skinSh','skinSh','outline','outline','','','','','','','','','',''],

    // Row 18-19: 燕尾服上部（白色翻领）
    ['','','','outline','outline','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','outline','outline','','','','','',''],
    ['','','outline','coatLn','lapel','lapel','lapel','lapel','lapel','lapel','lapel','lapel','lapel','lapel','lapel','lapel','lapel','lapel','lapel','lapel','lapel','lapel','lapel','lapel','coatLn','outline','outline','','','','',''],

    // Row 20-23: 燕尾服主体（黑白对比）
    ['','outline','coatLn','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coatLn','outline','','','',''],
    ['','outline','coatLn','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coatLn','outline','','','',''],
    ['outline','coatLn','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coatLn','outline','','','',''],
    ['outline','coatLn','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coatLn','outline','','','',''],

    // Row 24-25: 燕尾服下部
    ['outline','coatLn','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coatLn','outline','','','',''],
    ['','outline','coatLn','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coatLn','outline','','','',''],

    // Row 26-27: 燕尾下摆
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
export const SPRITES_BATCH_2: CharacterSprite[] = [
  {
    id: 'healer',
    name: '小野·治愈',
    hironoSeries: 'HIRONO - 温暖',
    palette: HEALER_PALETTE,
    sprite: HEALER_SPRITE,
  },
  {
    id: 'marionette',
    name: '小野·木偶',
    hironoSeries: 'HIRONO - 无力',
    palette: MARIONETTE_PALETTE,
    sprite: MARIONETTE_SPRITE,
  },
  {
    id: 'fox',
    name: '小野·狐狸',
    hironoSeries: 'HIRONO - 狡黠',
    palette: FOX_PALETTE,
    sprite: FOX_SPRITE,
  },
  {
    id: 'crow',
    name: '小野·乌鸦',
    hironoSeries: 'HIRONO - 深沉',
    palette: CROW_PALETTE,
    sprite: CROW_SPRITE,
  },
  {
    id: 'pianist',
    name: '小野·钢琴家',
    hironoSeries: 'HIRONO - 艺术',
    palette: PIANIST_PALETTE,
    sprite: PIANIST_SPRITE,
  },
];
