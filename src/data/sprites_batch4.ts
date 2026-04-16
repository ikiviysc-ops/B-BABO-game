/**
 * HIRONO 小野风格像素精灵 - 批次4
 *
 * 角色：
 * 16. manacle    — 小野·枷锁（挣扎/铁灰+锈红/锁链/愤怒疲惫眼）
 * 17. birdman    — 小野·鸟人（超越/羽毛白+天蓝+金喙/翅膀/锐利眼）
 * 18. numb       — 小野·麻木（逃避/淡紫+灰蓝+毛绒/毛绒帽/空洞眼）
 * 19. dreaming   — 小野·做梦（希望/全息彩虹+星光/星星装饰/梦幻眼）
 * 20. the_other  — 小野·他者（镜像/反转色/镜像分身/对称眼）
 */
import type { PixelData } from '@engine/PixelRenderer';

interface CharacterSprite {
  readonly id: string;
  readonly name: string;
  readonly hironoSeries: string;
  readonly palette: Record<string, string>;
  readonly sprite: PixelData;
}

// HIRONO 基础体型模板
const HIRONO_BASE: string[][] = [
  ['','','','','','hairDk','hair','hair','hair','hairDk','hairDk','hair','hair','','','hair','hair','hairDk','hairDk','hair','hair','','','','','','','','','','',''],
  ['','','','hairDk','hair','hair','hair','hair','hair','hair','hair','hairHi','hairHi','hair','hair','hair','hair','hairHi','hairHi','hair','hair','hair','hair','hair','hairDk','hair','','','','','',''],
  ['','hairDk','hair','hair','hair','hair','hair','hair','hair','hair','hair','hairHi','hairHi','hair','hair','hair','hair','hair','hairHi','hairHi','hair','hair','hair','hair','hair','hairDk','hairDk','','','','',''],
  ['','hairDk','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hairDk','outline','','','','',''],
  ['','hairDk','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hairDk','outline','','','','',''],
  ['','outline','hairDk','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hairDk','hairDk','outline','','','','','',''],
  ['','outline','hairDk','hairDk','hair','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','hair','hair','hairDk','hairDk','outline','','','','',''],
  ['','outline','hairDk','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','outline','','','','',''],
  ['','outline','skinSh','skin','skin','skin','lid','lid','lid','lid','lid','lid','lid','lid','lid','lid','lid','lid','lid','lid','lid','lid','skin','skin','skinSh','skinSh','outline','','','','',''],
  ['outline','outline','skinSh','skin','skin','lidSh','lidSh','lidSh','lid','lid','lid','lid','lid','lid','lid','lid','lid','lid','lid','lid','lid','lid','lid','skin','skinSh','outline','outline','','','','',''],
  ['outline','skinSh','skin','skin','eyeB','eyeB','eyeB','eyeW','eyeW','eyeW','eyeW','eyeI','eyeI','eyeI','eyeI','eyeW','eyeW','eyeW','eyeW','eyeW','eyeB','eyeB','eyeB','skin','skin','skinSh','outline','','','','',''],
  ['outline','skinSh','skin','eyeB','eyeB','eyeB','eyeW','eyeW','eyeW','eyeI','eyeI','eyeI','eyeI','eyeI','eyeI','eyeI','eyeI','eyeW','eyeW','eyeW','eyeB','eyeB','eyeB','skin','skinSh','outline','','','','','',''],
  ['outline','skinSh','skin','skin','eyeB','eyeB','eyeW','eyeW','eyeW','eyeI','eyeI','eyeI','eyeI','eyeI','eyeI','eyeI','eyeW','eyeW','eyeW','eyeB','eyeB','eyeB','skin','skin','skinSh','outline','','','','',''],
  ['','outline','skinSh','skin','eyeB','eyeB','eyeB','eyeB','eyeB','eyeB','eyeB','eyeB','eyeB','eyeB','eyeB','eyeB','eyeB','eyeB','eyeB','eyeB','eyeB','skin','skin','skin','skinSh','outline','','','','','',''],
  ['','outline','skinSh','blush','blush','blush','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','blush','blush','blush','skin','skinSh','outline','','','','','','','',''],
  ['','outline','skinSh','blush','blush','skin','skin','skin','skin','nose','nose','nose','skin','skin','skin','skin','skin','skin','skin','blush','blush','skin','skinSh','outline','','','','','','','',''],
  ['','outline','outline','skinSh','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','mouth','mouth','skin','skin','skin','skin','skin','skin','skin','skinSh','outline','outline','','','','','',''],
  ['','','outline','outline','skinSh','skinSh','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skinSh','skinSh','skinSh','outline','outline','','','','','','','',''],
  ['','','','outline','outline','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','outline','outline','','','','','',''],
  ['','','outline','coatLn','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coatLn','outline','outline','','','','',''],
  ['','outline','coatLn','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coatLn','outline','','','',''],
  ['','outline','coatLn','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coatLn','outline','','','',''],
  ['outline','coatLn','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coatLn','outline','','','',''],
  ['outline','coatLn','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coatLn','outline','','','',''],
  ['outline','coatLn','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coatLn','outline','','','',''],
  ['outline','coatLn','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coatLn','outline','','','',''],
  ['','outline','coatLn','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coatLn','outline','','','',''],
  ['','outline','coatLn','coatLn','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coatLn','coatLn','outline','','','','',''],
  ['','','outline','outline','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','outline','outline','','','','','','','',''],
  ['','','','outline','outline','coatDk','coatDk','coatDk','coatDk','coatDk','coatDk','coatDk','coatDk','coatDk','coatDk','coatDk','coatDk','coatDk','coatDk','coatDk','coatDk','coatDk','coatDk','outline','outline','','','','','','',''],
  ['','','','','outline','outline','coatDk','coatDk','coatDk','coatDk','coatDk','coatDk','coatDk','coatDk','coatDk','coatDk','coatDk','coatDk','coatDk','coatDk','coatDk','outline','outline','','','','','','','','','',''],
  ['','','','','','','outline','outline','shoe','shoe','shoe','shoe','shoe','shoe','shoe','shoe','shoe','shoe','shoe','shoe','outline','outline','','','','','','','','','',''],
  ['','','','','','','','','outline','outline','outline','shoe','shoe','shoe','shoe','shoe','shoe','outline','outline','outline','','','','','','','','','','','',''],
];

// ============================================================
// 16. MANACLE — 小野·枷锁
// 挣扎情绪：铁灰+锈红，锁链装饰
// 配饰：锁链纹理外套、锈红色瞳孔
// ============================================================
const MANACLE_PALETTE = {
  hair:    '#606068',
  hairHi:  '#808088',
  hairDk:  '#383840',
  skin:    '#e8e0d8',
  skinSh:  '#d0c8c0',
  blush:   '#d0a0a0',
  nose:    '#c08080',
  eyeW:    '#f0f0f0',
  eyeI:    '#a03020',
  eyeB:    '#202028',
  lid:     '#dcd0c8',
  lidSh:   '#c0b0a8',
  mouth:   '#a09090',
  coat:    '#686870',
  coatHi:  '#808088',
  coatDk:  '#484850',
  coatLn:  '#282830',
  inner:   '#e0dcd8',
  shoe:    '#282830',
  outline: '#181820',
  white:   '#ffffff',
  chain:   '#a08060',
  chainHi: '#c0a080',
  rust:    '#a03828',
};

const MANACLE_PIXELS = HIRONO_BASE.map((row, y) => {
  if (y === 20) return ['','outline','coatLn','coat','coat','coat','coat','coat','coat','coat','coat','chain','chainHi','chain','chainHi','chain','coat','coat','coat','coat','coat','coat','coat','coat','coatLn','outline','','','',''];
  if (y === 21) return ['','outline','coatLn','coat','coat','coat','coat','coat','coat','coat','coat','chain','chain','chain','chain','coat','coat','coat','coat','coat','coat','coat','coat','coat','coatLn','outline','','','',''];
  if (y === 22) return ['outline','coatLn','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coatLn','outline','','','',''];
  return [...row];
});

// ============================================================
// 17. BIRDMAN — 小野·鸟人
// 超越情绪：羽毛白+天蓝+金喙，翅膀装饰
// 配饰：翅膀（两侧）、金喙
// ============================================================
const BIRDMAN_PALETTE = {
  hair:    '#e0e8f0',
  hairHi:  '#f0f4f8',
  hairDk:  '#a0b0c0',
  skin:    '#f8f4f0',
  skinSh:  '#f0e8e0',
  blush:   '#e8a0a0',
  nose:    '#d08888',
  eyeW:    '#f8f8f8',
  eyeI:    '#3060a0',
  eyeB:    '#203040',
  lid:     '#e8e0d8',
  lidSh:   '#d0c8c0',
  mouth:   '#c09080',
  coat:    '#d0e0f0',
  coatHi:  '#e0f0ff',
  coatDk:  '#90b0d0',
  coatLn:  '#6080a0',
  inner:   '#f0f8ff',
  shoe:    '#6080a0',
  outline: '#304050',
  white:   '#ffffff',
  wing:    '#c0d8f0',
  wingDk:  '#80a0c0',
  beak:    '#e8b830',
  beakDk:  '#c09820',
};

const BIRDMAN_PIXELS = HIRONO_BASE.map((row, y) => {
  if (y === 0) return ['wingDk','wing','','','','','','','','','','','','','','','','','','','','','','','wing','','wingDk','',''];
  if (y === 1) return ['wing','wingDk','','','hairDk','hair','hair','hair','hairDk','hairDk','hair','hair','','','hair','hair','hairDk','hairDk','hair','hair','','','','','','wingDk','wing','',''];
  if (y === 2) return ['wingDk','wing','','hairDk','hair','hair','hair','hair','hair','hair','hair','hairHi','hairHi','hair','hair','hair','hair','hair','hairHi','hairHi','hair','hair','hair','hair','hair','hairDk','hairDk','','wing','wingDk','','',''];
  if (y === 3) return ['wing','','','hairDk','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hairDk','outline','','wing','','','','',''];
  if (y === 4) return ['wingDk','wing','','hairDk','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hairDk','outline','','wing','wingDk','','','',''];
  return [...row];
});

// ============================================================
// 18. NUMB — 小野·麻木
// 逃避情绪：淡紫+灰蓝+毛绒，毛绒帽
// 配饰：毛绒帽（覆盖头顶）、毛绒围巾
// ============================================================
const NUMB_PALETTE = {
  hair:    '#9088a8',
  hairHi:  '#b0a8c8',
  hairDk:  '#605878',
  skin:    '#f0e8f0',
  skinSh:  '#e0d0e0',
  blush:   '#d0a0c0',
  nose:    '#c088b0',
  eyeW:    '#f4f0f8',
  eyeI:    '#8078a0',
  eyeB:    '#403858',
  lid:     '#e0d4e0',
  lidSh:   '#c8b0c8',
  mouth:   '#b098a8',
  coat:    '#a098b8',
  coatHi:  '#b8b0d0',
  coatDk:  '#706888',
  coatLn:  '#504868',
  inner:   '#e8e0f0',
  shoe:    '#504868',
  outline: '#302840',
  white:   '#ffffff',
  plush:   '#c0b0d8',
  plushHi: '#d8c8f0',
  plushDk: '#9080a8',
};

const NUMB_PIXELS = HIRONO_BASE.map((row, y) => {
  // 毛绒帽覆盖头顶 (row 0-5)
  if (y === 0) return ['','','','','','plushDk','plush','plush','plush','plushDk','plushDk','plush','plush','','','plush','plush','plushDk','plushDk','plush','plush','','','','','','','','','','',''];
  if (y === 1) return ['','','','plushDk','plush','plush','plush','plush','plush','plush','plush','plushHi','plushHi','plush','plush','plush','plush','plushHi','plushHi','plush','plush','plush','plush','plushDk','plush','','','','','',''];
  if (y === 2) return ['','plushDk','plush','plush','plush','plush','plush','plush','plush','plush','plush','plushHi','plushHi','plush','plush','plush','plush','plush','plushHi','plushHi','plush','plush','plush','plush','plush','plushDk','plushDk','','','','',''];
  if (y === 3) return ['','plushDk','plush','plush','plush','plush','plush','plush','plush','plush','plush','plush','plush','plush','plush','plush','plush','plush','plush','plush','plush','plush','plush','plush','plushDk','outline','','','','',''];
  if (y === 4) return ['','plushDk','plush','plush','plush','plush','plush','plush','plush','plush','plush','plush','plush','plush','plush','plush','plush','plush','plush','plush','plush','plush','plush','plush','plushDk','outline','','','','',''];
  if (y === 5) return ['','outline','plushDk','plush','plush','plush','plush','plush','plush','plush','plush','plush','plush','plush','plush','plush','plush','plush','plush','plush','plush','plush','plushDk','plushDk','outline','','','','','',''];
  // 毛绒围巾 (row 16-17)
  if (y === 16) return ['','outline','outline','skinSh','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','mouth','mouth','skin','skin','skin','skin','skin','skin','skin','skinSh','outline','outline','','','','','',''];
  if (y === 17) return ['','','outline','plush','plush','plush','plush','plush','plush','plush','plush','plush','plush','plush','plush','plush','plush','plush','plush','plush','plush','plush','plush','outline','outline','','','','','',''];
  return [...row];
});

// ============================================================
// 19. DREAMING — 小野·做梦
// 希望情绪：全息彩虹+星光，星星装饰
// 配饰：星星装饰（头顶和身侧）、彩虹色瞳孔
// ============================================================
const DREAMING_PALETTE = {
  hair:    '#6060c0',
  hairHi:  '#8080e0',
  hairDk:  '#404080',
  skin:    '#f0e8f8',
  skinSh:  '#e0d0e8',
  blush:   '#d0a0d0',
  nose:    '#c088c0',
  eyeW:    '#f8f4ff',
  eyeI:    '#e060a0',
  eyeB:    '#302050',
  lid:     '#e0d8f0',
  lidSh:   '#c8b0d8',
  mouth:   '#b098b0',
  coat:    '#7070c0',
  coatHi:  '#9090e0',
  coatDk:  '#505090',
  coatLn:  '#303070',
  inner:   '#e8e0f8',
  shoe:    '#303070',
  outline: '#201840',
  white:   '#ffffff',
  star:    '#f0d060',
  starGlow:'#f8e8a0',
  rainbow1:'#f080a0',
  rainbow2:'#a080f0',
  rainbow3:'#80c0f0',
};

const DREAMING_PIXELS = HIRONO_BASE.map((row, y) => {
  if (y === 0) return ['','','','','','starGlow','star','star','','','','','','','','','','','','','','','starGlow','star','starGlow','','','','','','',''];
  if (y === 19) return ['','','outline','coatLn','coat','coat','coat','coat','coat','coat','coat','coat','rainbow1','rainbow2','rainbow3','coat','coat','coat','coat','coat','coat','coat','coat','coatLn','outline','outline','','','','',''];
  if (y === 20) return ['','outline','coatLn','coat','coat','coat','coat','coat','coat','coat','coat','coat','rainbow2','rainbow3','rainbow1','coat','coat','coat','coat','coat','coat','coat','coat','coat','coatLn','outline','','','',''];
  if (y === 21) return ['','outline','coatLn','coat','coat','coat','coat','coat','coat','coat','coat','coat','rainbow3','rainbow1','rainbow2','coat','coat','coat','coat','coat','coat','coat','coat','coat','coatLn','outline','','','',''];
  return [...row];
});

// ============================================================
// 20. THE_OTHER — 小野·他者
// 镜像情绪：反转色，镜像分身
// 配饰：反转色调（深色皮肤+浅色外套）、镜像分身暗示
// ============================================================
const THE_OTHER_PALETTE = {
  hair:    '#e0d8d0',
  hairHi:  '#f0ece8',
  hairDk:  '#b0a8a0',
  skin:    '#403838',
  skinSh:  '#302828',
  blush:   '#604848',
  nose:    '#705050',
  eyeW:    '#605858',
  eyeI:    '#f0e0d0',
  eyeB:    '#d0c8c0',
  lid:     '#504848',
  lidSh:   '#403838',
  mouth:   '#705858',
  coat:    '#d0ccc8',
  coatHi:  '#e8e4e0',
  coatDk:  '#a0a098',
  coatLn:  '#808078',
  inner:   '#f0ece8',
  shoe:    '#808078',
  outline: '#e0dcd8',
  white:   '#f0ece8',
  mirror:  '#c0b8b0',
  mirrorHi:'#e0d8d0',
};

// 他者精灵：基础体型 + 镜像分身暗示（外套上镜像纹理）
const THE_OTHER_PIXELS = HIRONO_BASE.map((row, y) => {
  if (y === 20) return ['','outline','coatLn','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','mirror','mirror','coatLn','outline','','','',''];
  if (y === 21) return ['','outline','coatLn','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','mirrorHi','mirror','coatLn','outline','','','',''];
  if (y === 22) return ['outline','coatLn','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','mirror','mirrorHi','coatLn','outline','','','',''];
  return [...row];
});

// ============================================================
// 导出所有精灵
// ============================================================
export const SPRITES_BATCH_4: CharacterSprite[] = [
  {
    id: 'manacle',
    name: '小野·枷锁',
    hironoSeries: 'HIRONO - 挣扎',
    palette: MANACLE_PALETTE,
    sprite: { width: 32, height: 32, pixels: MANACLE_PIXELS },
  },
  {
    id: 'birdman',
    name: '小野·鸟人',
    hironoSeries: 'HIRONO - 超越',
    palette: BIRDMAN_PALETTE,
    sprite: { width: 32, height: 32, pixels: BIRDMAN_PIXELS },
  },
  {
    id: 'numb',
    name: '小野·麻木',
    hironoSeries: 'HIRONO - 逃避',
    palette: NUMB_PALETTE,
    sprite: { width: 32, height: 32, pixels: NUMB_PIXELS },
  },
  {
    id: 'dreaming',
    name: '小野·做梦',
    hironoSeries: 'HIRONO - 希望',
    palette: DREAMING_PALETTE,
    sprite: { width: 32, height: 32, pixels: DREAMING_PIXELS },
  },
  {
    id: 'the_other',
    name: '小野·他者',
    hironoSeries: 'HIRONO - 镜像',
    palette: THE_OTHER_PALETTE,
    sprite: { width: 32, height: 32, pixels: THE_OTHER_PIXELS },
  },
];
