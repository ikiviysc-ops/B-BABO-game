/**
 * B-BABO 角色像素数据定义
 * 32×32 像素精灵，使用调色板键引用颜色
 */

import type { PixelData } from '@engine/PixelRenderer';

/**
 * B-BABO 基础外形模板
 * 圆头、小身体、大眼睛的可爱像素角色
 * 调色板键: primary, secondary, accent, dark, outline, skin, eye, white
 */
export const BABO_BASE_SPRITE: PixelData = {
  width: 32,
  height: 32,
  pixels: [
    // Row 0-3: 头顶装饰/头发
    ['','','','','','','','','','','outline','outline','outline','outline','outline','outline','outline','outline','outline','outline','','','','','','','','','','','','',''],
    ['','','','','','','','outline','outline','outline','outline','accent','accent','accent','accent','accent','accent','accent','accent','outline','outline','outline','outline','outline','','','','','','','','',''],
    ['','','','','','outline','outline','outline','accent','accent','accent','accent','accent','accent','accent','accent','accent','accent','accent','accent','accent','accent','accent','outline','outline','outline','outline','','','','',''],
    ['','','','','outline','outline','dark','dark','accent','accent','accent','accent','accent','accent','accent','accent','accent','accent','accent','accent','accent','accent','accent','accent','dark','dark','outline','outline','','','',''],

    // Row 4-7: 头部上半 (额头 + 眼睛)
    ['','','','outline','outline','dark','dark','accent','accent','accent','accent','accent','accent','accent','accent','accent','accent','accent','accent','accent','accent','accent','accent','accent','accent','dark','dark','outline','outline','','',''],
    ['','','outline','outline','dark','dark','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','dark','dark','outline','outline','','',''],
    ['','outline','outline','dark','dark','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','dark','dark','outline','outline','',''],
    ['','outline','dark','dark','skin','skin','white','white','white','white','white','eye','eye','eye','eye','eye','eye','white','white','white','white','white','white','skin','skin','skin','dark','dark','outline','',''],

    // Row 8-11: 眼睛 + 脸部
    ['','outline','dark','skin','skin','skin','white','white','white','white','eye','eye','eye','eye','eye','eye','eye','eye','eye','eye','white','white','white','white','skin','skin','skin','dark','outline','',''],
    ['','outline','dark','skin','skin','skin','white','white','white','white','eye','eye','white','white','white','white','white','eye','eye','white','white','white','white','skin','skin','skin','dark','outline','',''],
    ['','outline','dark','skin','skin','skin','skin','skin','skin','skin','white','white','white','white','white','white','white','white','white','skin','skin','skin','skin','skin','skin','skin','dark','outline','',''],
    ['','outline','outline','dark','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','dark','dark','outline','outline','',''],

    // Row 12-15: 脸部下半 + 嘴
    ['','outline','outline','dark','dark','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','dark','dark','outline','outline','',''],
    ['','','outline','outline','dark','dark','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','dark','dark','outline','outline','','',''],
    ['','','','outline','outline','dark','dark','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','dark','dark','outline','outline','','','',''],
    ['','','','','outline','outline','dark','dark','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','dark','dark','outline','outline','','','',''],

    // Row 16-19: 身体上部
    ['','','','','','','outline','outline','dark','dark','dark','dark','dark','dark','dark','dark','dark','dark','dark','dark','dark','dark','dark','dark','outline','outline','','','','',''],
    ['','','','','','outline','outline','dark','primary','primary','primary','primary','primary','primary','primary','primary','primary','primary','primary','primary','primary','primary','primary','dark','outline','outline','','','','',''],
    ['','','','','','outline','outline','dark','primary','primary','primary','primary','primary','primary','primary','primary','primary','primary','primary','primary','primary','primary','primary','dark','outline','outline','','','','',''],
    ['','','','','','outline','outline','dark','primary','primary','secondary','secondary','secondary','primary','primary','primary','primary','secondary','secondary','secondary','primary','primary','primary','dark','outline','outline','','','','',''],

    // Row 20-23: 身体下部 + 手臂
    ['','','','outline','outline','outline','dark','dark','primary','primary','secondary','secondary','secondary','primary','primary','primary','primary','secondary','secondary','secondary','primary','primary','primary','dark','dark','outline','outline','outline','','',''],
    ['','','outline','dark','dark','dark','dark','primary','primary','primary','primary','primary','primary','primary','primary','primary','primary','primary','primary','primary','primary','primary','primary','dark','dark','dark','dark','outline','','',''],
    ['','outline','dark','dark','skin','skin','dark','dark','primary','primary','primary','primary','primary','primary','primary','primary','primary','primary','primary','primary','primary','primary','primary','dark','dark','skin','skin','dark','dark','outline','',''],
    ['','outline','dark','skin','skin','skin','dark','dark','dark','primary','primary','primary','primary','primary','primary','primary','primary','primary','primary','primary','primary','primary','dark','dark','dark','skin','skin','skin','dark','outline','',''],

    // Row 24-27: 腿部
    ['','outline','outline','dark','dark','dark','dark','dark','dark','primary','primary','primary','primary','primary','primary','primary','primary','primary','primary','primary','primary','dark','dark','dark','dark','dark','dark','dark','outline','outline','',''],
    ['','','outline','outline','dark','dark','dark','dark','dark','dark','dark','primary','primary','primary','primary','primary','primary','primary','primary','dark','dark','dark','dark','dark','dark','dark','outline','outline','','','',''],
    ['','','','','outline','outline','dark','dark','dark','dark','dark','dark','dark','dark','dark','dark','dark','dark','dark','dark','dark','dark','dark','dark','dark','outline','outline','','','','',''],
    ['','','','','','','outline','outline','outline','outline','dark','dark','dark','dark','dark','dark','dark','dark','dark','dark','dark','dark','outline','outline','outline','outline','outline','','','','',''],

    // Row 28-31: 脚部
    ['','','','','','','','','outline','outline','outline','dark','dark','dark','dark','dark','dark','dark','dark','dark','outline','outline','outline','','','','','','',''],
    ['','','','','','','','','','outline','outline','outline','outline','dark','dark','dark','dark','dark','dark','outline','outline','outline','outline','','','','','','',''],
    ['','','','','','','','','','','outline','outline','outline','outline','outline','outline','outline','outline','outline','outline','outline','','','','','','',''],
    ['','','','','','','','','','','','','','','','','','','','','','','','','','','','',''],
  ],
};
