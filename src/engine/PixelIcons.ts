/**
 * 像素图标系统 — 专业游戏UI图标
 *
 * 设计原则（参考 Vampire Survivors / Dead Cells / Hyper Light Drifter）：
 * 1. 剪影优先 — 先确保单色剪影0.5秒内可识别
 * 2. 统一光源 — 左上角照射，所有图标一致
 * 3. 色相偏移 — 阴影偏冷(蓝/紫)，高光偏暖(黄/橙)
 * 4. 严格调色板 — 每图标3-5色，每材质最多3色阶
 * 5. 选择性描边 — 受光面亮描边，背光面暗描边
 * 6. 材质区分 — 金属(灰蓝)、木头(棕)、魔法(高饱和发光)
 * 7. 暗色背景优化 — 高对比度，图标从背景跳出
 * 8. 暗示优于细节 — 1像素暗示眼睛/高光/裂缝
 *
 * 渲染管线：
 * - 基础分辨率 32x32（在离屏Canvas上绘制）
 * - 缩放到目标尺寸时使用 imageSmoothingEnabled = false 保持像素锐利
 * - 缓存机制避免重复绘制
 */

const _cache = new Map<string, HTMLCanvasElement>();

/** 基础绘制分辨率 */
const BASE_SIZE = 32;

export function getPixelIcon(id: string, size: number): HTMLCanvasElement {
  const key = `${id}_${size}`;
  const cached = _cache.get(key);
  if (cached) return cached;

  // 先在基础分辨率(32x32)上绘制，再缩放到目标尺寸
  const baseCanvas = _cache.get(`${id}_${BASE_SIZE}`);
  let source: HTMLCanvasElement;

  if (!baseCanvas) {
    const bc = document.createElement('canvas');
    bc.width = BASE_SIZE;
    bc.height = BASE_SIZE;
    const bctx = bc.getContext('2d')!;
    bctx.imageSmoothingEnabled = false;

    const draw = DRAWERS[id];
    if (draw) {
      draw(bctx);
    } else {
      bctx.fillStyle = '#888';
      bctx.font = `bold ${BASE_SIZE * 0.4}px monospace`;
      bctx.textAlign = 'center';
      bctx.textBaseline = 'middle';
      bctx.fillText('?', BASE_SIZE / 2, BASE_SIZE / 2);
    }
    _cache.set(`${id}_${BASE_SIZE}`, bc);
    source = bc;
  } else {
    source = baseCanvas;
  }

  // 缩放到目标尺寸
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d')!;
  ctx.imageSmoothingEnabled = false; // 关键：像素锐利缩放
  ctx.drawImage(source, 0, 0, size, size);

  _cache.set(key, canvas);
  return canvas;
}

/**
 * 在32x32画布上绘制单个像素
 */
function px(ctx: CanvasRenderingContext2D, x: number, y: number, color: string) {
  ctx.fillStyle = color;
  ctx.fillRect(x, y, 1, 1);
}



/**
 * 批量绘制像素图 — 使用字符映射
 * '.' = 透明, 其他字符映射到colors表
 * 在32x32画布上以(left, top)为起点绘制
 */
function drawMap(ctx: CanvasRenderingContext2D, map: string[], left: number, top: number, colors: Record<string, string>) {
  for (let y = 0; y < map.length; y++) {
    for (let x = 0; x < map[y].length; x++) {
      const ch = map[y][x];
      if (ch === '.') continue;
      const c = colors[ch];
      if (c) {
        ctx.fillStyle = c;
        ctx.fillRect(left + x, top + y, 1, 1);
      }
    }
  }
}



type Drawer = (ctx: CanvasRenderingContext2D) => void;

// ═══════════════════════════════════════════════════════════
// 统一调色板 — 所有图标共用材质色
// ═══════════════════════════════════════════════════════════
const PAL = {
  // 描边
  outDark: '#0d0d1a',   // 背光面深描边
  outLight: '#2a2a40',  // 受光面浅描边

  // 金属（偏蓝灰，模拟钢铁）
  metalBase: '#8898a8',
  metalHi: '#c0d0e0',   // 高光偏暖白
  metalSh: '#506070',   // 阴影偏冷蓝

  // 木头
  woodBase: '#8a6830',
  woodHi: '#b89050',    // 高光偏暖黄
  woodSh: '#5a4018',    // 阴影偏深棕

  // 金色（神圣/稀有）
  goldBase: '#c8a030',
  goldHi: '#f0d060',    // 高光偏亮黄
  goldSh: '#886018',    // 阴影偏棕

  // 红色系
  redBase: '#c03030',
  redHi: '#f06050',     // 高光偏橙
  redSh: '#781820',     // 阴影偏紫红

  // 蓝色系
  blueBase: '#3868b0',
  blueHi: '#68a0e0',    // 高光偏青白
  blueSh: '#1a3868',    // 阴影偏深蓝紫

  // 绿色系
  greenBase: '#38a048',
  greenHi: '#68d878',   // 高光偏黄绿
  greenSh: '#186828',   // 阴影偏蓝绿

  // 紫色系
  purpleBase: '#7838b0',
  purpleHi: '#a868e0',  // 高光偏粉紫
  purpleSh: '#401868',  // 阴影偏深紫

  // 橙色系
  orangeBase: '#d06820',
  orangeHi: '#f09848',  // 高光偏黄
  orangeSh: '#884010',  // 阴影偏红棕

  // 青色系
  cyanBase: '#28a0a8',
  cyanHi: '#58d8e0',    // 高光偏白青
  cyanSh: '#106868',    // 阴影偏深青

  // 白色高光点
  white: '#f0f0f8',

  // 魔法发光
  magicGlow: '#e0c0ff',
};

const DRAWERS: Record<string, Drawer> = {

  // ═══════════════════════════════════════════════════════
  // 近战武器
  // ═══════════════════════════════════════════════════════

  /**
   * 生锈铁剑 — 经典RPG剑形
   * 剪影：垂直长剑，上窄下宽刃 + 护手 + 握把
   * 材质：金属刃(灰蓝) + 木握把(棕) + 金属护手
   */
  rusty_sword(ctx) {
    const P = PAL;
    // 刃 — 上窄下宽，左上高光
    const blade = [
'........................AAAAAAAA........................',
'....................AAAABBBB............................',
'....................AAAABBBB............................',
'................AAAABBBBCCCC............................',
'................AAAABBBBCCCC............................',
'................AAAABBBBCCCC............................',
'................AAAABBBBCCCC............................',
'................AAAABBBB................................',
'............AAAABBBBCCCC................................',
'............AAAABBBB....................................',
    ];
    drawMap(ctx, blade, 0, 0, {
      A: P.metalSh, B: P.metalBase, C: P.metalHi,
    });
    // 刃尖
    px(ctx, 14, 0, P.metalHi);
    px(ctx, 12, 0, P.outDark);
    px(ctx, 16, 0, P.outDark);
    // 锈迹暗示 — 2个暗橙色像素
    px(ctx, 16, 10, P.orangeSh);
    px(ctx, 16, 14, P.orangeSh);
    // 护手 — 横向金属条
    const guard = [
'........DDDDDDDDEEEEEEEEEEEEDDDDDDDD................',
    ];
    drawMap(ctx, guard, 0, 10, {
      D: P.metalSh, E: P.metalBase,
    });
    px(ctx, 10, 20, P.metalHi);
    // 握把 — 木色，圆柱明暗
    const handle = [
'........FFFFGGGG........................................',
'........GGGGFFFF........................................',
'........FFFFGGGG........................................',
'........GGGGFFFF........................................',
    ];
    drawMap(ctx, handle, 0, 11, {
      F: P.woodBase, G: P.woodSh,
    });
    // 柄头 — 金属圆
    px(ctx, 14, 30, P.metalHi);
    px(ctx, 12, 30, P.metalBase);
    px(ctx, 16, 30, P.metalBase);
    // 选择性描边 — 左侧暗，右侧亮
    for (let y = 0; y <= 9; y++) px(ctx, 10, y, P.outDark);
    for (let y = 0; y <= 9; y++) px(ctx, 18, y, P.outLight);
    // 护手描边
    px(ctx, 8, 20, P.outDark);
    px(ctx, 24, 20, P.outLight);
    // 握把描边
    for (let y = 11; y <= 14; y++) { px(ctx, 10, y, P.outDark); px(ctx, 18, y, P.outLight); }
    px(ctx, 12, 30, P.outDark);
    px(ctx, 18, 30, P.outLight);
    // 金属高光点
    px(ctx, 12, 4, P.white);
  },

  /**
   * 战斧 — 斜放的大斧
   * 剪影：对角线柄 + 右上大斧头
   * 材质：木柄 + 金属斧刃
   */
  battle_axe(ctx) {
    const P = PAL;
    // 柄 — 从左下到右上的对角线
    for (let i = 0; i < 12; i++) {
      const x = 2 + i, y = 3 + i;
      px(ctx, x, y, i % 2 === 0 ? P.woodBase : P.woodHi);
      px(ctx, x + 2, y, i % 2 === 0 ? P.woodSh : P.woodBase);
    }
    // 斧头 — 右上方的大块金属
    const axeHead = [
'............................................CCCCCCCCCCCCCCCC',
'........................................CCCCCCCCDDDDDDDDCCCC',
'....................................CCCCCCCCDDDDDDDDDDDDCCCC',
'................................CCCCCCCCDDDDDDDDDDDDDDDDCCCC',
'............................CCCCCCCCDDDDDDDDDDDDDDDDDDDDCCCC',
'................................CCCCCCCCDDDDDDDDDDDDDDDDCCCC',
'....................................CCCCCCCCDDDDDDDDCCCC....',
    ];
    drawMap(ctx, axeHead, 0, 0, {
      C: P.redSh, D: P.redBase,
    });
    // 斧刃高光（受光面）
    px(ctx, 24, 0, P.redHi);
    px(ctx, 26, 0, P.redHi);
    px(ctx, 26, 2, P.redHi);
    px(ctx, 28, 4, P.redHi);
    px(ctx, 30, 6, P.redHi);
    px(ctx, 30, 8, P.redHi);
    // 金属反光
    px(ctx, 28, 2, P.white);
    // 描边
    px(ctx, 22, 0, P.outDark);
    px(ctx, 20, 2, P.outDark);
    px(ctx, 18, 4, P.outDark);
    px(ctx, 16, 6, P.outDark);
    px(ctx, 14, 8, P.outDark);
    px(ctx, 16, 10, P.outDark);
    px(ctx, 18, 12, P.outDark);
    px(ctx, 30, 0, P.outLight);
    px(ctx, 30, 2, P.outLight);
    px(ctx, 30, 4, P.outLight);
    px(ctx, 32, 6, P.outLight);
    px(ctx, 32, 8, P.outLight);
    px(ctx, 30, 10, P.outLight);
    px(ctx, 28, 12, P.outLight);
  },

  /**
   * 闪电匕首 — 短小精悍
   * 剪影：短刃 + 小护手 + 短柄
   * 材质：青色魔法刃 + 金属护手
   */
  lightning_dagger(ctx) {
    const P = PAL;
    // 刃 — 短而尖锐
    const blade = [
'........................AAAA............................',
'....................AAAABBBB............................',
'....................AAAABBBB............................',
'................AAAABBBBCCCC............................',
'................AAAABBBBCCCC............................',
'................AAAABBBBCCCC............................',
'............AAAABBBBCCCC................................',
'............AAAABBBB....................................',
    ];
    drawMap(ctx, blade, 0, 1, {
      A: P.cyanSh, B: P.cyanBase, C: P.cyanHi,
    });
    // 刃尖
    px(ctx, 14, 0, P.cyanHi);
    px(ctx, 12, 0, P.outDark);
    px(ctx, 16, 0, P.outDark);
    // 闪电纹理暗示
    px(ctx, 16, 6, P.white);
    px(ctx, 14, 10, P.white);
    // 护手
    px(ctx, 10, 18, P.metalSh);
    px(ctx, 12, 18, P.metalHi);
    px(ctx, 14, 18, P.metalBase);
    px(ctx, 16, 18, P.metalBase);
    px(ctx, 18, 18, P.metalHi);
    px(ctx, 20, 18, P.metalSh);
    // 握把
    px(ctx, 14, 20, P.woodBase);
    px(ctx, 16, 20, P.woodHi);
    px(ctx, 14, 22, P.woodHi);
    px(ctx, 16, 22, P.woodBase);
    px(ctx, 14, 24, P.woodBase);
    px(ctx, 16, 24, P.woodSh);
    // 描边
    for (let y = 0; y <= 8; y++) px(ctx, 10, y, P.outDark);
    for (let y = 0; y <= 8; y++) px(ctx, 18, y, P.outLight);
    px(ctx, 8, 18, P.outDark);
    px(ctx, 22, 18, P.outLight);
    for (let y = 10; y <= 12; y++) { px(ctx, 12, y, P.outDark); px(ctx, 18, y, P.outLight); }
  },

  /**
   * 暗影之刃 — 弯曲的魔法匕首
   * 剪影：弧形弯刃，神秘感
   * 材质：紫色魔法金属
   */
  shadow_blade(ctx) {
    const P = PAL;
    // 弯刃 — 从左上弯曲到右下
    const blade = [
'................AAAABBBB................................',
'............AAAABBBBCCCC................................',
'........AAAABBBBCCCCDDDD................................',
'........AAAABBBBCCCC....................................',
'....AAAABBBBCCCCDDDD....................................',
'....AAAABBBBCCCC........................................',
'AAAABBBBCCCCDDDD........................................',
'....AAAABBBBCCCC........................................',
'........BBBBCCCCDDDD....................................',
    ];
    drawMap(ctx, blade, 0, 1, {
      A: P.purpleSh, B: P.purpleBase, C: P.purpleHi, D: P.magicGlow,
    });
    // 魔法发光暗示
    px(ctx, 12, 6, P.white);
    px(ctx, 10, 10, P.white);
    // 柄
    px(ctx, 4, 20, P.purpleSh);
    px(ctx, 6, 20, P.purpleBase);
    px(ctx, 4, 22, P.purpleBase);
    px(ctx, 6, 22, P.purpleHi);
    px(ctx, 4, 24, P.purpleHi);
    px(ctx, 6, 24, P.purpleBase);
    px(ctx, 4, 26, P.purpleBase);
    px(ctx, 6, 26, P.purpleSh);
    // 描边
    px(ctx, 6, 0, P.outDark);
    px(ctx, 8, 0, P.outDark);
    px(ctx, 4, 2, P.outDark);
    px(ctx, 10, 2, P.outDark);
    px(ctx, 2, 4, P.outDark);
    px(ctx, 10, 4, P.outDark);
    px(ctx, 2, 6, P.outDark);
    px(ctx, 12, 6, P.outLight);
    px(ctx, 0, 8, P.outDark);
    px(ctx, 10, 8, P.outLight);
    px(ctx, 0, 10, P.outDark);
    px(ctx, 8, 10, P.outLight);
    px(ctx, 0, 12, P.outDark);
    px(ctx, 8, 12, P.outLight);
    px(ctx, 2, 14, P.outDark);
    px(ctx, 8, 14, P.outLight);
    px(ctx, 4, 16, P.outDark);
    px(ctx, 10, 16, P.outLight);
    px(ctx, 4, 18, P.outDark);
    for (let y = 10; y <= 13; y++) { px(ctx, 2, y, P.outDark); px(ctx, 8, y, P.outLight); }
  },

  /**
   * 圣盾 — 正面盾牌
   * 剪影：上宽下窄的盾形 + 中心十字
   * 材质：金色金属 + 白色十字纹章
   */
  holy_shield(ctx) {
    const P = PAL;
    // 盾形 — 上宽下窄
    const shield = [
'........................AAAAAAAAAAAAAAAA........................',
'....................AAAAAAAABBBBBBBBAAAAAAAA....................',
'................AAAAAAAABBBBBBBBCCCCCCCCAAAAAAAA................',
'............AAAAAAAABBBBBBBBCCCCCCCCBBBBBBBBAAAAAAAA............',
'............AAAAAAAABBBBBBBBCCCCCCCCBBBBBBBBAAAAAAAA............',
'............AAAAAAAABBBBBBBBCCCCCCCCBBBBBBBBAAAAAAAA............',
'................AAAAAAAABBBBBBBBCCCCCCCCAAAAAAAA................',
'....................AAAAAAAABBBBBBBBAAAAAAAA....................',
'........................AAAAAAAAAAAAAAAA........................',
'............................AAAAAAAA............................',
    ];
    drawMap(ctx, shield, 0, 2, {
      A: P.goldSh, B: P.goldBase, C: P.goldHi,
    });
    // 白色十字纹章
    for (let y = 4; y <= 10; y++) px(ctx, 16, y, P.white);
    for (let x = 6; x <= 10; x++) px(ctx, x, 14, P.white);
    // 十字中心高光
    px(ctx, 16, 14, P.white);
    // 金属反光
    px(ctx, 12, 6, P.white);
    // 描边 — 上方和两侧
    px(ctx, 10, 4, P.outDark);
    px(ctx, 22, 4, P.outLight);
    px(ctx, 8, 6, P.outDark);
    px(ctx, 24, 6, P.outLight);
    px(ctx, 6, 8, P.outDark);
    px(ctx, 26, 8, P.outLight);
    px(ctx, 6, 10, P.outDark);
    px(ctx, 26, 10, P.outLight);
    px(ctx, 6, 12, P.outDark);
    px(ctx, 26, 12, P.outLight);
    px(ctx, 8, 14, P.outDark);
    px(ctx, 24, 14, P.outLight);
    px(ctx, 10, 16, P.outDark);
    px(ctx, 22, 16, P.outLight);
    px(ctx, 12, 18, P.outDark);
    px(ctx, 20, 18, P.outLight);
    px(ctx, 14, 20, P.outDark);
    px(ctx, 18, 20, P.outLight);
    px(ctx, 14, 22, P.outDark);
    px(ctx, 16, 22, P.outDark);
    px(ctx, 18, 22, P.outLight);
  },

  // ═══════════════════════════════════════════════════════
  // 远程武器
  // ═══════════════════════════════════════════════════════

  /**
   * 手枪 — 侧面视图
   * 剪影：L形，枪管水平 + 握把向下
   * 材质：深灰金属枪身 + 棕色握把
   */
  pistol(ctx) {
    const P = PAL;
    // 枪管 — 水平金属管
    const barrel = [
'CCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCC',
'AAAABBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBAAAA',
'AAAABBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBAAAA',
'CCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCC',
    ];
    drawMap(ctx, barrel, 2, 4, {
      A: P.metalSh, B: P.metalBase, C: P.outDark,
    });
    // 枪管高光
    for (let x = 3; x <= 13; x++) px(ctx, x, 10, P.metalHi);
    // 枪身/滑套
    const body = [
'DDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDD....',
'AAAABBBBBBBBBBBBBBBBBBBBBBBBBBBBAAAA........',
'AAAABBBBBBBBBBBBBBBBBBBBBBBBBBBBAAAA........',
'DDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDD........',
    ];
    drawMap(ctx, body, 4, 8, {
      A: P.metalSh, B: P.metalBase, D: P.outDark,
    });
    // 枪身高光
    for (let x = 5; x <= 12; x++) px(ctx, x, 18, P.metalHi);
    // 握把 — 向右下
    px(ctx, 22, 24, P.woodBase);
    px(ctx, 24, 24, P.woodHi);
    px(ctx, 24, 26, P.woodBase);
    px(ctx, 26, 26, P.woodHi);
    px(ctx, 26, 28, P.woodBase);
    px(ctx, 26, 30, P.woodSh);
    // 扳机护圈
    px(ctx, 18, 24, P.metalSh);
    px(ctx, 20, 24, P.metalBase);
    px(ctx, 20, 26, P.metalSh);
    // 枪口暗示
    px(ctx, 4, 10, P.outDark);
    px(ctx, 4, 12, P.outDark);
    // 金属反光
    px(ctx, 10, 10, P.white);
  },

  /**
   * 霰弹枪 — 更长更粗的枪
   * 剪影：长管 + 木护木 + 枪托
   */
  shotgun(ctx) {
    const P = PAL;
    // 双管枪管
    const barrel = [
'CCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCC',
'AAAABBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBAAAA',
'DDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDD',
'AAAABBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBAAAA',
'CCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCC',
    ];
    drawMap(ctx, barrel, 0, 4, {
      A: P.metalSh, B: P.metalBase, C: P.outDark, D: P.outDark,
    });
    // 上管高光
    for (let x = 1; x <= 14; x++) px(ctx, x, 10, P.metalHi);
    // 护木 — 木色
    const forend = [
'EEEEEEEEEEEEEEEE',
'FFFFGGGGGGGGFFFF',
'FFFFGGGGGGGGFFFF',
'EEEEEEEEEEEEEEEE',
    ];
    drawMap(ctx, forend, 2, 9, {
      E: P.outDark, F: P.woodBase, G: P.woodHi,
    });
    // 枪身
    const body = [
'EEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEE',
'AAAABBBBBBBBBBBBBBBBBBBBBBBBBBBBAAAA',
'AAAABBBBBBBBBBBBBBBBBBBBBBBBBBBBAAAA',
'EEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEE',
    ];
    drawMap(ctx, body, 6, 9, {
      A: P.metalSh, B: P.metalBase, E: P.outDark,
    });
    for (let x = 7; x <= 14; x++) px(ctx, x, 20, P.metalHi);
    // 枪托
    px(ctx, 26, 26, P.woodBase);
    px(ctx, 28, 26, P.woodHi);
    px(ctx, 28, 28, P.woodBase);
    px(ctx, 30, 28, P.woodHi);
    px(ctx, 30, 30, P.woodSh);
    // 握把
    px(ctx, 20, 26, P.metalSh);
    px(ctx, 22, 26, P.metalBase);
    px(ctx, 22, 28, P.metalSh);
    // 枪口
    px(ctx, 0, 10, P.outDark);
    px(ctx, 0, 14, P.outDark);
    // 反光
    px(ctx, 6, 10, P.white);
  },

  /**
   * 狙击步枪 — 最长，带瞄准镜
   * 剪影：超长枪管 + 上方瞄准镜 + 枪托
   */
  sniper_rifle(ctx) {
    const P = PAL;
    // 长枪管
    for (let x = 0; x <= 15; x++) {
      px(ctx, x, 12, P.metalSh);
      px(ctx, x, 14, P.metalBase);
      px(ctx, x, 16, P.metalBase);
      px(ctx, x, 18, P.metalSh);
    }
    // 枪管高光
    for (let x = 1; x <= 14; x++) px(ctx, x, 14, P.metalHi);
    // 瞄准镜 — 上方圆柱
    for (let x = 4; x <= 11; x++) {
      px(ctx, x, 6, P.blueSh);
      px(ctx, x, 8, P.blueBase);
      px(ctx, x, 10, P.blueSh);
    }
    // 瞄准镜高光
    for (let x = 5; x <= 10; x++) px(ctx, x, 8, P.blueHi);
    // 镜片反光
    px(ctx, 8, 8, P.white);
    // 枪托
    px(ctx, 26, 20, P.woodBase);
    px(ctx, 28, 20, P.woodHi);
    px(ctx, 28, 22, P.woodBase);
    px(ctx, 30, 22, P.woodHi);
    px(ctx, 30, 24, P.woodBase);
    px(ctx, 30, 26, P.woodSh);
    // 握把
    px(ctx, 16, 20, P.metalSh);
    px(ctx, 18, 20, P.metalBase);
    px(ctx, 18, 22, P.metalSh);
    // 脚架暗示
    px(ctx, 6, 20, P.metalSh);
    px(ctx, 4, 22, P.metalSh);
    px(ctx, 2, 24, P.metalSh);
    // 枪口
    px(ctx, 0, 14, P.outDark);
  },

  /**
   * 长弓 — 弧形弓 + 弦 + 箭
   * 剪影：C形弓臂 + 直线弦 + 箭矢
   * 材质：木质弓臂 + 金属箭头
   */
  long_bow(ctx) {
    const P = PAL;
    // 弓臂 — C形弧
    const bowArm = [
'........................................AAAAAAAA',
'....................................AAAABBBB',
'................................AAAABBBB....',
'............................AAAABBBB........',
'........................AAAABBBB............',
'........................AAAABBBB............',
'........................AAAABBBB............',
'............................AAAABBBB........',
'................................AAAABBBB....',
'....................................AAAABBBB',
'........................................AAAAAAAA',
    ];
    drawMap(ctx, bowArm, 0, 2, {
      A: P.woodSh, B: P.woodBase,
    });
    // 弓臂内侧高光
    px(ctx, 18, 6, P.woodHi);
    px(ctx, 16, 8, P.woodHi);
    px(ctx, 14, 10, P.woodHi);
    px(ctx, 14, 12, P.woodHi);
    px(ctx, 14, 14, P.woodHi);
    px(ctx, 16, 16, P.woodHi);
    px(ctx, 18, 18, P.woodHi);
    px(ctx, 20, 20, P.woodHi);
    // 弓弦 — 细直线
    for (let y = 2; y <= 12; y++) px(ctx, 10, y, '#c0b890');
    // 箭矢 — 沿弦放置
    for (let y = 3; y <= 11; y++) px(ctx, 12, y, P.metalBase);
    // 箭头
    px(ctx, 8, 4, P.metalHi);
    px(ctx, 10, 4, P.metalHi);
    px(ctx, 12, 4, P.metalBase);
    // 箭羽
    px(ctx, 14, 22, P.redBase);
    px(ctx, 14, 20, P.redHi);
    // 描边
    px(ctx, 22, 2, P.outDark);
    px(ctx, 22, 4, P.outDark);
    px(ctx, 22, 24, P.outDark);
    px(ctx, 22, 26, P.outDark);
    px(ctx, 20, 26, P.outDark);
  },

  /**
   * 魔法杖 — 顶部发光宝珠 + 长杖身
   * 剪影：细长直线 + 顶部圆形宝珠
   * 材质：木质杖身 + 发光紫色宝珠
   */
  magic_staff(ctx) {
    const P = PAL;
    // 杖身 — 细长木棍
    for (let y = 5; y <= 15; y++) {
      px(ctx, 16, y, y % 2 === 0 ? P.woodBase : P.woodHi);
      px(ctx, 18, y, y % 2 === 0 ? P.woodSh : P.woodBase);
    }
    // 宝珠 — 5x5圆形，发光效果
    const orb = [
'........AAAABBBBCCCC........',
'....AAAABBBBCCCCBBBBAAAA....',
'AAAABBBBCCCCDDDDCCCCBBBBAAAA',
'....AAAABBBBCCCCBBBBAAAA....',
'........AAAABBBBCCCC........',
    ];
    drawMap(ctx, orb, 0, 0, {
      A: P.purpleSh, B: P.purpleBase, C: P.purpleHi, D: P.magicGlow,
    });
    // 宝珠核心高光
    px(ctx, 16, 4, P.white);
    // 魔法粒子 — 散落的发光点
    px(ctx, 10, 2, P.purpleHi);
    px(ctx, 22, 2, P.purpleHi);
    px(ctx, 8, 6, P.purpleBase);
    px(ctx, 24, 6, P.purpleBase);
    // 杖身描边
    for (let y = 5; y <= 15; y++) { px(ctx, 14, y, P.outDark); px(ctx, 20, y, P.outLight); }
    // 宝珠描边
    px(ctx, 12, 0, P.outDark);
    px(ctx, 14, 0, P.outDark);
    px(ctx, 16, 0, P.outDark);
    px(ctx, 18, 0, P.outDark);
    px(ctx, 20, 0, P.outDark);
    px(ctx, 10, 2, P.outDark);
    px(ctx, 22, 2, P.outLight);
    px(ctx, 10, 4, P.outDark);
    px(ctx, 24, 4, P.outLight);
    px(ctx, 10, 6, P.outDark);
    px(ctx, 22, 6, P.outLight);
    px(ctx, 12, 8, P.outDark);
    px(ctx, 20, 8, P.outLight);
    px(ctx, 14, 10, P.outDark);
    px(ctx, 18, 10, P.outLight);
  },

  /**
   * 陨石法杖 — 火焰宝珠 + 杖身
   * 剪影：与魔法杖类似但宝珠为火焰色
   */
  meteor_staff(ctx) {
    const P = PAL;
    // 杖身
    for (let y = 5; y <= 15; y++) {
      px(ctx, 16, y, y % 2 === 0 ? P.woodBase : P.woodHi);
      px(ctx, 18, y, y % 2 === 0 ? P.woodSh : P.woodBase);
    }
    // 火焰宝珠
    const orb = [
'........AAAABBBBCCCC........',
'....AAAABBBBCCCCBBBBAAAA....',
'AAAABBBBCCCCDDDDCCCCBBBBAAAA',
'....AAAABBBBCCCCBBBBAAAA....',
'........AAAABBBBCCCC........',
    ];
    drawMap(ctx, orb, 0, 0, {
      A: P.orangeSh, B: P.orangeBase, C: P.orangeHi, D: P.goldHi,
    });
    // 核心高光
    px(ctx, 16, 4, P.white);
    // 火焰粒子
    px(ctx, 10, 0, P.redHi);
    px(ctx, 22, 0, P.redHi);
    px(ctx, 8, 4, P.orangeBase);
    px(ctx, 24, 4, P.orangeBase);
    px(ctx, 12, 0, P.orangeHi);
    px(ctx, 20, 0, P.orangeHi);
    // 描边
    for (let y = 5; y <= 15; y++) { px(ctx, 14, y, P.outDark); px(ctx, 20, y, P.outLight); }
    px(ctx, 12, 0, P.outDark);
    px(ctx, 14, 0, P.outDark);
    px(ctx, 16, 0, P.outDark);
    px(ctx, 18, 0, P.outDark);
    px(ctx, 20, 0, P.outDark);
    px(ctx, 10, 2, P.outDark);
    px(ctx, 22, 2, P.outLight);
    px(ctx, 10, 4, P.outDark);
    px(ctx, 24, 4, P.outLight);
    px(ctx, 10, 6, P.outDark);
    px(ctx, 22, 6, P.outLight);
    px(ctx, 12, 8, P.outDark);
    px(ctx, 20, 8, P.outLight);
    px(ctx, 14, 10, P.outDark);
    px(ctx, 18, 10, P.outLight);
  },

  /**
   * 火箭筒 — 粗管 + 握把
   * 剪影：粗水平管 + 下方握把
   */
  rocket_launcher(ctx) {
    const P = PAL;
    // 粗管身
    const tube = [
'CCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCC',
'AAAABBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBAAAA',
'AAAABBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBAAAA',
'AAAABBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBAAAA',
'AAAABBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBAAAA',
'CCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCC',
    ];
    drawMap(ctx, tube, 1, 4, {
      A: P.metalSh, B: P.metalBase, C: P.outDark,
    });
    // 管身高光
    for (let x = 2; x <= 13; x++) px(ctx, x, 10, P.metalHi);
    // 弹头 — 红色
    px(ctx, 0, 10, P.redBase);
    px(ctx, 0, 12, P.redSh);
    px(ctx, 0, 14, P.redBase);
    px(ctx, 0, 16, P.redSh);
    px(ctx, 2, 10, P.redHi);
    px(ctx, 2, 16, P.redSh);
    // 瞄具
    px(ctx, 12, 6, P.metalSh);
    px(ctx, 14, 6, P.metalBase);
    px(ctx, 16, 6, P.metalHi);
    // 握把
    px(ctx, 16, 20, P.metalBase);
    px(ctx, 18, 20, P.metalSh);
    px(ctx, 18, 22, P.metalBase);
    px(ctx, 20, 22, P.metalSh);
    px(ctx, 20, 24, P.metalSh);
    // 尾翼暗示
    px(ctx, 28, 6, P.metalSh);
    px(ctx, 30, 6, P.metalBase);
    px(ctx, 28, 20, P.metalSh);
    px(ctx, 30, 20, P.metalBase);
    // 反光
    px(ctx, 8, 10, P.white);
  },

  // ═══════════════════════════════════════════════════════
  // 特殊武器
  // ═══════════════════════════════════════════════════════

  /**
   * 追踪导弹 — 小型导弹
   * 剪影：流线型弹体 + 尾翼
   */
  homing_missile(ctx) {
    const P = PAL;
    // 弹体 — 流线型
    const body = [
'........CCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCC....',
'....AAAABBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBAAAA....',
'AAAABBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBAAAA',
'AAAABBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBAAAA',
'AAAABBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBAAAA',
'....AAAABBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBAAAA....',
'........CCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCC....',
    ];
    drawMap(ctx, body, 0, 4, {
      A: P.blueSh, B: P.blueBase, C: P.outDark,
    });
    // 弹体高光
    for (let x = 3; x <= 12; x++) px(ctx, x, 10, P.blueHi);
    // 弹头
    px(ctx, 2, 12, P.blueHi);
    px(ctx, 2, 14, P.blueBase);
    px(ctx, 2, 16, P.blueSh);
    // 尾翼
    px(ctx, 24, 6, P.blueSh);
    px(ctx, 26, 6, P.blueBase);
    px(ctx, 24, 22, P.blueSh);
    px(ctx, 26, 22, P.blueBase);
    // 尾焰暗示
    px(ctx, 28, 12, P.orangeHi);
    px(ctx, 28, 14, P.orangeBase);
    px(ctx, 28, 16, P.orangeHi);
    px(ctx, 30, 14, P.redHi);
    // 反光
    px(ctx, 8, 10, P.white);
  },

  /**
   * 自然之种 — 发光种子 + 茎叶
   * 剪影：上方圆形种子 + 下方茎 + 小叶子
   */
  nature_seed(ctx) {
    const P = PAL;
    // 茎
    for (let y = 8; y <= 15; y++) {
      px(ctx, 16, y, y % 2 === 0 ? P.greenBase : P.greenHi);
    }
    // 叶子
    px(ctx, 12, 20, P.greenBase);
    px(ctx, 14, 20, P.greenHi);
    px(ctx, 18, 24, P.greenBase);
    px(ctx, 20, 24, P.greenHi);
    // 种子 — 发光圆形
    const seed = [
'........AAAABBBBCCCC........',
'....AAAABBBBCCCCBBBBAAAA....',
'AAAABBBBCCCCDDDDCCCCBBBBAAAA',
'....AAAABBBBCCCCBBBBAAAA....',
'........AAAABBBBCCCC........',
    ];
    drawMap(ctx, seed, 0, 2, {
      A: P.greenSh, B: P.greenBase, C: P.greenHi, D: P.white,
    });
    // 生命粒子
    px(ctx, 10, 6, P.greenHi);
    px(ctx, 22, 6, P.greenHi);
    px(ctx, 12, 12, P.greenBase);
    // 描边
    for (let y = 8; y <= 15; y++) { px(ctx, 14, y, P.outDark); px(ctx, 18, y, P.outLight); }
    px(ctx, 12, 4, P.outDark);
    px(ctx, 14, 4, P.outDark);
    px(ctx, 16, 4, P.outDark);
    px(ctx, 18, 4, P.outDark);
    px(ctx, 20, 4, P.outDark);
    px(ctx, 10, 6, P.outDark);
    px(ctx, 22, 6, P.outLight);
    px(ctx, 10, 8, P.outDark);
    px(ctx, 24, 8, P.outLight);
    px(ctx, 10, 10, P.outDark);
    px(ctx, 22, 10, P.outLight);
    px(ctx, 12, 12, P.outDark);
    px(ctx, 20, 12, P.outLight);
    px(ctx, 14, 14, P.outDark);
    px(ctx, 18, 14, P.outLight);
  },

  /**
   * 灵魂之镰 — 大弧刃 + 长柄
   * 剪影：垂直柄 + 右侧大弧形刃
   */
  soul_scythe(ctx) {
    const P = PAL;
    // 柄 — 垂直
    for (let y = 3; y <= 15; y++) {
      px(ctx, 8, y, y % 2 === 0 ? P.woodBase : P.woodHi);
      px(ctx, 10, y, y % 2 === 0 ? P.woodSh : P.woodBase);
    }
    // 镰刃 — 大弧形
    const blade = [
'........................................AAAAAAAA',
'....................................AAAABBBB....',
'................................AAAABBBBCCCC....',
'............................AAAABBBBCCCCDDDD....',
'........................AAAABBBBCCCCDDDD........',
'....................AAAABBBBCCCC................',
'................AAAABBBBCCCC....................',
'............AAAABBBBCCCC........................',
'........AAAABBBBCCCC............................',
    ];
    drawMap(ctx, blade, 0, 0, {
      A: P.greenSh, B: P.greenBase, C: P.greenHi, D: P.white,
    });
    // 魔法发光
    px(ctx, 20, 6, P.greenHi);
    px(ctx, 18, 10, P.white);
    // 描边
    for (let y = 3; y <= 15; y++) { px(ctx, 6, y, P.outDark); px(ctx, 12, y, P.outLight); }
    px(ctx, 22, 0, P.outLight);
    px(ctx, 20, 0, P.outLight);
    px(ctx, 20, 2, P.outLight);
    px(ctx, 18, 2, P.outDark);
    px(ctx, 18, 4, P.outDark);
    px(ctx, 16, 4, P.outDark);
    px(ctx, 16, 6, P.outDark);
    px(ctx, 14, 6, P.outDark);
    px(ctx, 14, 8, P.outDark);
    px(ctx, 12, 8, P.outDark);
    px(ctx, 12, 10, P.outDark);
    px(ctx, 10, 10, P.outDark);
    px(ctx, 10, 12, P.outDark);
    px(ctx, 8, 12, P.outDark);
    px(ctx, 8, 14, P.outDark);
    px(ctx, 6, 14, P.outDark);
    px(ctx, 6, 16, P.outDark);
  },

  // ═══════════════════════════════════════════════════════
  // 属性图标
  // ═══════════════════════════════════════════════════════

  /**
   * HP — 红色心形
   * 剪影：经典心形，饱满圆润
   * 颜色编码：红色 = 生命
   */
  hp_boost(ctx) {
    const P = PAL;
    // 心形 — 经典像素心
    const heart = [
'........AAAAAAAABBBBBBBB........',
'....AAAABBBBCCCCCCCCBBBBAAAA....',
'AAAABBBBCCCCCCCCCCCCDDDDBBBBAAAA',
'AAAABBBBCCCCCCCCCCCCDDDDBBBBAAAA',
'AAAABBBBCCCCCCCCCCCCDDDDBBBBAAAA',
'....AAAABBBBCCCCCCCCBBBBAAAA....',
'........AAAABBBBBBBBAAAA........',
'............AAAAAAAA............',
    ];
    drawMap(ctx, heart, 3, 3, {
      A: P.redSh, B: P.redBase, C: P.redHi, D: P.white,
    });
    // 高光 — 左上1像素暗示光泽
    px(ctx, 10, 8, P.white);
    // 描边
    px(ctx, 8, 6, P.outDark);
    px(ctx, 18, 6, P.outLight);
    px(ctx, 6, 8, P.outDark);
    px(ctx, 20, 8, P.outLight);
    px(ctx, 6, 10, P.outDark);
    px(ctx, 20, 10, P.outLight);
    px(ctx, 6, 12, P.outDark);
    px(ctx, 20, 12, P.outLight);
    px(ctx, 6, 14, P.outDark);
    px(ctx, 20, 14, P.outLight);
    px(ctx, 8, 16, P.outDark);
    px(ctx, 18, 16, P.outLight);
    px(ctx, 10, 18, P.outDark);
    px(ctx, 16, 18, P.outLight);
    px(ctx, 12, 20, P.outDark);
    px(ctx, 14, 20, P.outDark);
  },

  /**
   * 速度 — 闪电/翅膀
   * 剪影：锯齿形闪电
   * 颜色编码：黄色 = 速度
   */
  speed_boost(ctx) {
    const P = PAL;
    // 闪电 — 经典锯齿形
    const bolt = [
'........................CCCCCCCC....',
'....................CCCCBBBB........',
'................CCCCBBBB............',
'............CCCCBBBB................',
'........CCCCBBBBCCCC................',
'............CCCCBBBB................',
'........CCCCBBBBCCCC................',
'....CCCCBBBB........................',
'........CCCCBBBBCCCC................',
'............CCCCBBBB................',
'................CCCCBBBB............',
'....................CCCC............',
    ];
    drawMap(ctx, bolt, 3, 1, {
      B: P.goldBase, C: P.goldHi,
    });
    // 阴影侧
    px(ctx, 18, 2, P.goldSh);
    px(ctx, 16, 4, P.goldSh);
    px(ctx, 14, 6, P.goldSh);
    px(ctx, 12, 8, P.goldSh);
    px(ctx, 14, 10, P.goldSh);
    px(ctx, 12, 12, P.goldSh);
    px(ctx, 10, 14, P.goldSh);
    px(ctx, 12, 16, P.goldSh);
    px(ctx, 14, 18, P.goldSh);
    px(ctx, 16, 20, P.goldSh);
    px(ctx, 18, 22, P.goldSh);
    // 高光核心
    px(ctx, 14, 6, P.white);
    px(ctx, 12, 12, P.white);
    // 描边
    px(ctx, 18, 0, P.outDark);
    px(ctx, 20, 0, P.outDark);
    px(ctx, 20, 2, P.outLight);
    px(ctx, 18, 4, P.outDark);
    px(ctx, 16, 6, P.outDark);
    px(ctx, 14, 8, P.outDark);
    px(ctx, 10, 10, P.outDark);
    px(ctx, 14, 10, P.outLight);
    px(ctx, 10, 12, P.outDark);
    px(ctx, 8, 14, P.outDark);
    px(ctx, 10, 16, P.outDark);
    px(ctx, 14, 16, P.outLight);
    px(ctx, 12, 18, P.outDark);
    px(ctx, 16, 18, P.outLight);
    px(ctx, 14, 20, P.outDark);
    px(ctx, 18, 20, P.outLight);
    px(ctx, 16, 22, P.outDark);
    px(ctx, 20, 22, P.outLight);
    px(ctx, 18, 24, P.outDark);
  },

  /**
   * 力量 — 拳头/锤子
   * 剪影：拳头形状
   * 颜色编码：橙色 = 力量/攻击
   */
  damage_boost(ctx) {
    const P = PAL;
    // 拳头 — 握拳形状
    const fist = [
'........AAAAAAAABBBBBBBBAAAA........',
'....AAAABBBBCCCCCCCCBBBBBBBBAAAA....',
'AAAABBBBCCCCCCCCCCCCDDDDBBBBAAAA....',
'AAAABBBBCCCCCCCCCCCCDDDDBBBBAAAA....',
'....AAAABBBBCCCCCCCCBBBBBBBBAAAA....',
'........AAAAAAAABBBBBBBBAAAA........',
'............AAAAAAAA................',
    ];
    drawMap(ctx, fist, 3, 3, {
      A: P.orangeSh, B: P.orangeBase, C: P.orangeHi, D: P.white,
    });
    // 手指暗示
    px(ctx, 10, 6, P.orangeHi);
    px(ctx, 12, 6, P.orangeHi);
    px(ctx, 14, 6, P.orangeHi);
    // 高光
    px(ctx, 12, 8, P.white);
    // 描边
    px(ctx, 8, 6, P.outDark);
    px(ctx, 20, 6, P.outLight);
    px(ctx, 6, 8, P.outDark);
    px(ctx, 22, 8, P.outLight);
    px(ctx, 6, 10, P.outDark);
    px(ctx, 22, 10, P.outLight);
    px(ctx, 6, 12, P.outDark);
    px(ctx, 22, 12, P.outLight);
    px(ctx, 8, 14, P.outDark);
    px(ctx, 20, 14, P.outLight);
    px(ctx, 10, 16, P.outDark);
    px(ctx, 18, 16, P.outLight);
    px(ctx, 12, 18, P.outDark);
    px(ctx, 14, 18, P.outDark);
  },
};

export function getIconIdForOption(optionId: string): string {
  if (optionId.startsWith('new_')) {
    return optionId.replace('new_', '');
  }
  return optionId;
}
