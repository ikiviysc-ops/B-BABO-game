/**
 * HIRONO 小野风格像素精灵 - 批次3
 *
 * 角色：
 * 11. fallen_angel — 小野·堕落天使（堕落/白翅渐灰+金光环+深红/断翼/悲伤眼）
 * 12. monster      — 小野·怪物（黑暗/深紫+荧光粉/暗影触手/异形瞳）
 * 13. insight      — 小野·洞察（理解/靛蓝+金瞳+深蓝/全视之眼/智慧眼）
 * 14. echo         — 小野·回声（共鸣/银灰+青色波纹/波纹纹理/平静眼）
 * 15. vagrancy     — 小野·流浪（漂泊/大地色+破旧感/旅人之杖/疲惫眼）
 */
import type { PixelData } from '@engine/PixelRenderer';

interface CharacterSprite {
  readonly id: string;
  readonly name: string;
  readonly hironoSeries: string;
  readonly palette: Record<string, string>;
  readonly sprite: PixelData;
}

// HIRONO 基础体型模板（32x32），所有角色共用此基础结构
// 只需修改调色板和特定配饰像素即可创建独特角色
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
// 11. FALLEN_ANGEL — 小野·堕落天使
// 堕落情绪：白翅渐灰+金光环+深红，断翼装饰
// 配饰：头顶金光环、身侧断翼、深红瞳孔
// ============================================================
const FALLEN_ANGEL_PALETTE = {
  hair:    '#c0c0c0',
  hairHi:  '#e0e0e0',
  hairDk:  '#808080',
  skin:    '#f0e8e0',
  skinSh:  '#e0d0c0',
  blush:   '#d8a0a0',
  nose:    '#c88888',
  eyeW:    '#f4f0e8',
  eyeI:    '#a02020',
  eyeB:    '#404040',
  lid:     '#e0d4c8',
  lidSh:   '#c8b8a0',
  mouth:   '#b09080',
  coat:    '#e8e0e0',
  coatHi:  '#f8f4f0',
  coatDk:  '#a0a0a0',
  coatLn:  '#707070',
  inner:   '#f0ece8',
  shoe:    '#606060',
  outline: '#303030',
  white:   '#ffffff',
  halo:    '#f0d060',
  haloHi:  '#f8e8a0',
  wing:    '#d0d0d0',
  wingDk:  '#909090',
  blood:   '#c02020',
};

// 堕落天使精灵：基础体型 + 金光环(row0) + 断翼(row2-4左侧)
const FALLEN_ANGEL_PIXELS = HIRONO_BASE.map((row, y) => {
  if (y === 0) return ['','','','','','haloHi','halo','halo','halo','haloHi','halo','halo','halo','halo','halo','halo','halo','halo','halo','halo','halo','halo','halo','haloHi','','','','','','',''];
  if (y === 2) return ['wingDk','wing','hairDk','hair','hair','hair','hair','hair','hair','hair','hair','hairHi','hairHi','hair','hair','hair','hair','hair','hairHi','hairHi','hair','hair','hair','hair','hair','hairDk','hairDk','','','','',''];
  if (y === 3) return ['wing','wingDk','hairDk','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hairDk','outline','','','','',''];
  if (y === 4) return ['wingDk','wing','hairDk','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hairDk','outline','','','','',''];
  return [...row];
});

// ============================================================
// 12. MONSTER — 小野·怪物
// 黑暗情绪：深紫+荧光粉，暗影触手
// 配饰：荧光粉色瞳孔、触手纹理外套
// ============================================================
const MONSTER_PALETTE = {
  hair:    '#3a2040',
  hairHi:  '#5a3860',
  hairDk:  '#201028',
  skin:    '#e0d0e0',
  skinSh:  '#c8b0c8',
  blush:   '#d090c0',
  nose:    '#c080b0',
  eyeW:    '#f0e8f0',
  eyeI:    '#ff40a0',
  eyeB:    '#1a0820',
  lid:     '#d0c0d0',
  lidSh:   '#b0a0b8',
  mouth:   '#a08898',
  coat:    '#402050',
  coatHi:  '#583068',
  coatDk:  '#281038',
  coatLn:  '#180820',
  inner:   '#d0c0d8',
  shoe:    '#180820',
  outline: '#0a0410',
  white:   '#ffffff',
  tentacle:'#ff60b0',
  tentDk:  '#c03080',
};

// 怪物精灵：基础体型 + 触手纹理
const MONSTER_PIXELS = HIRONO_BASE.map((row, y) => {
  if (y === 19) return ['','','outline','coatLn','coat','coat','coat','coat','coat','coat','coat','coat','tentacle','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coatLn','outline','outline','','','','',''];
  if (y === 20) return ['','outline','coatLn','coat','coat','coat','coat','coat','coat','coat','coat','tentDk','tentacle','tentDk','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coatLn','outline','','','',''];
  if (y === 21) return ['','outline','coatLn','coat','coat','coat','coat','coat','coat','coat','coat','coat','tentacle','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coatLn','outline','','','',''];
  if (y === 22) return ['outline','coatLn','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coatLn','outline','','','',''];
  return [...row];
});

// ============================================================
// 13. INSIGHT — 小野·洞察
// 理解情绪：靛蓝+金瞳+深蓝，全视之眼
// 配饰：额头第三只眼（金色）、金瞳
// ============================================================
const INSIGHT_PALETTE = {
  hair:    '#2a3060',
  hairHi:  '#3a4880',
  hairDk:  '#181e40',
  skin:    '#e8e0f0',
  skinSh:  '#d0c8e0',
  blush:   '#c0a0d0',
  nose:    '#b088c0',
  eyeW:    '#f0ecf8',
  eyeI:    '#d8a020',
  eyeB:    '#101830',
  lid:     '#d8d0e0',
  lidSh:   '#b8a8c8',
  mouth:   '#a090b0',
  coat:    '#303868',
  coatHi:  '#404880',
  coatDk:  '#202050',
  coatLn:  '#141838',
  inner:   '#e0d8f0',
  shoe:    '#141838',
  outline: '#0a0e20',
  white:   '#ffffff',
  thirdEye:'#f0c030',
  thirdGlow:'#f8e060',
};

// 洞察精灵：基础体型 + 额头第三只眼(row6)
const INSIGHT_PIXELS = HIRONO_BASE.map((row, y) => {
  if (y === 6) return ['','outline','hairDk','hairDk','hair','skin','skin','skin','skin','skin','thirdGlow','thirdEye','thirdGlow','skin','skin','skin','skin','skin','skin','skin','skin','hair','hair','hairDk','hairDk','outline','','','','',''];
  return [...row];
});

// ============================================================
// 14. ECHO — 小野·回声
// 共鸣情绪：银灰+青色波纹，波纹纹理
// 配饰：波纹纹理外套、青色瞳孔
// ============================================================
const ECHO_PALETTE = {
  hair:    '#8090a0',
  hairHi:  '#a0b0c0',
  hairDk:  '#506070',
  skin:    '#f0ece8',
  skinSh:  '#e0dcd8',
  blush:   '#c8a8b8',
  nose:    '#b898a8',
  eyeW:    '#f4f4f4',
  eyeI:    '#40a0b0',
  eyeB:    '#303840',
  lid:     '#dcd8e0',
  lidSh:   '#c0b8c8',
  mouth:   '#a09898',
  coat:    '#90a0b0',
  coatHi:  '#b0c0d0',
  coatDk:  '#607080',
  coatLn:  '#405060',
  inner:   '#e0e8f0',
  shoe:    '#405060',
  outline: '#202830',
  white:   '#ffffff',
  wave:    '#60c0d0',
  waveHi:  '#80e0f0',
};

// 回声精灵：基础体型 + 波纹纹理
const ECHO_PIXELS = HIRONO_BASE.map((row, y) => {
  if (y === 19) return ['','','outline','coatLn','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coatLn','outline','outline','','','','',''];
  if (y === 20) return ['','outline','coatLn','coat','coat','coat','coat','coat','coat','wave','waveHi','wave','waveHi','wave','coat','coat','coat','coat','coat','coat','coat','coat','coat','coatLn','outline','','','',''];
  if (y === 21) return ['','outline','coatLn','coat','coat','coat','coat','coat','coat','coat','wave','wave','wave','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coatLn','outline','','','',''];
  if (y === 22) return ['outline','coatLn','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coatLn','outline','','','',''];
  return [...row];
});

// ============================================================
// 15. VAGRANCY — 小野·流浪
// 漂泊情绪：大地色+破旧感，旅人之杖
// 配饰：旅人之杖（右手）、破旧补丁外套
// ============================================================
const VAGRANCY_PALETTE = {
  hair:    '#8a7860',
  hairHi:  '#a89878',
  hairDk:  '#605040',
  skin:    '#f0e0cc',
  skinSh:  '#e0cca8',
  blush:   '#d8a088',
  nose:    '#c88878',
  eyeW:    '#f6f0e8',
  eyeI:    '#504030',
  eyeB:    '#2a2018',
  lid:     '#e0d0b8',
  lidSh:   '#c8b098',
  mouth:   '#b09880',
  coat:    '#9a8868',
  coatHi:  '#b0a080',
  coatDk:  '#6a5838',
  coatLn:  '#4a3820',
  inner:   '#e0d4b8',
  shoe:    '#4a3820',
  outline: '#2a1e10',
  white:   '#ffffff',
  staff:   '#7a6040',
  staffHi: '#9a8060',
  patch:   '#807050',
};

// 流浪精灵：基础体型 + 旅人之杖(row21-23右侧) + 补丁(row19)
const VAGRANCY_PIXELS = HIRONO_BASE.map((row, y) => {
  if (y === 19) return ['','','outline','coatLn','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coatLn','outline','outline','','','','',''];
  if (y === 21) return ['','outline','coatLn','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','staff','staff','coatLn','outline','','','',''];
  if (y === 22) return ['outline','coatLn','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','staffHi','staff','coatLn','outline','','','',''];
  if (y === 23) return ['outline','coatLn','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','staffHi','staff','coatLn','outline','','','',''];
  return [...row];
});

// ============================================================
// 导出所有精灵
// ============================================================
export const SPRITES_BATCH_3: CharacterSprite[] = [
  {
    id: 'fallen_angel',
    name: '小野·堕落天使',
    hironoSeries: 'HIRONO - 堕落',
    palette: FALLEN_ANGEL_PALETTE,
    sprite: { width: 32, height: 32, pixels: FALLEN_ANGEL_PIXELS },
  },
  {
    id: 'monster',
    name: '小野·怪物',
    hironoSeries: 'HIRONO - 黑暗',
    palette: MONSTER_PALETTE,
    sprite: { width: 32, height: 32, pixels: MONSTER_PIXELS },
  },
  {
    id: 'insight',
    name: '小野·洞察',
    hironoSeries: 'HIRONO - 理解',
    palette: INSIGHT_PALETTE,
    sprite: { width: 32, height: 32, pixels: INSIGHT_PIXELS },
  },
  {
    id: 'echo',
    name: '小野·回声',
    hironoSeries: 'HIRONO - 共鸣',
    palette: ECHO_PALETTE,
    sprite: { width: 32, height: 32, pixels: ECHO_PIXELS },
  },
  {
    id: 'vagrancy',
    name: '小野·流浪',
    hironoSeries: 'HIRONO - 漂泊',
    palette: VAGRANCY_PALETTE,
    sprite: { width: 32, height: 32, pixels: VAGRANCY_PIXELS },
  },
];
