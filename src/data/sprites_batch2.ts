/**
 * HIRONO 小野风格像素精灵 - Batch 2
 *
 * 包含5个角色：necro, thunder, frost, phantom, merchant
 * 每个精灵 32x32 像素，保留HIRONO核心特征
 */
import type { PixelData } from '@engine/PixelRenderer';

export const SPRITES_BATCH_2 = [
  // ============================================================
  // 6. necro (死灵) — The Other One系列 The Ghost 造型
  //    半透明幽灵感，暗影缠绕，空洞表情，深灰紫色调
  // ============================================================
  {
    id: 'necro',
    name: 'B-BABO死灵',
    hironoSeries: 'The Other One - The Ghost',
    palette: {
      hair:     '#4a4060',
      hairHi:   '#6a5a80',
      hairDk:   '#2e2440',
      skin:     '#c8b8d0',
      skinSh:   '#a898b8',
      blush:    '#c89098',
      nose:     '#c07080',
      eyeW:     '#e0d8e8',
      eyeI:     '#3a2848',
      eyeB:     '#2a1838',
      lid:      '#b8a8c8',
      lidSh:    '#9878a8',
      mouth:    '#8a6878',
      coat:     '#584868',
      coatHi:   '#706080',
      coatDk:   '#3a2848',
      coatLn:   '#2e1e3e',
      inner:    '#786888',
      shoe:     '#2e1e3e',
      outline:  '#1a1028',
      white:    '#f0eaf4',
      ghost:    '#d0c4dc',
      ghostHi:  '#e8e0f0',
      shadow:   '#1a1028',
      wisp:     '#9080a8',
    },
    sprite: {
      width: 32,
      height: 32,
      pixels: [
        // Row 0-2: 头顶 - 凌乱碎短发 + 幽灵光晕
        ['','','','','','','','hair','hair','hairDk','hairDk','hair','hair','','','hair','hair','hairDk','hairDk','hair','hair','','','','','','','','','','',''],
        ['','','','','','hairDk','hair','hair','hair','hair','hair','hairHi','hairHi','hair','hair','hair','hair','hairHi','hairHi','hair','hair','hair','hair','hair','hairDk','hair','hair','','','','',''],
        ['','','','hairDk','hair','hair','hair','hair','hair','hair','hair','hairHi','hairHi','hair','hair','hair','hair','hair','hairHi','hairHi','hair','hair','hair','hair','hair','hair','hairDk','hairDk','','','',''],

        // Row 3-5: 头发上部 + 额头
        ['','hairDk','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hairDk','hairDk','','',''],
        ['','hairDk','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hairDk','outline','','',''],
        ['','outline','hairDk','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hairDk','hairDk','outline','','','',''],

        // Row 6-7: 额头 + 眉毛区域 (暗影缠绕)
        ['','outline','hairDk','hairDk','hair','hair','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','hair','hair','hairDk','hairDk','outline','','','',''],
        ['','outline','hairDk','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','outline','','','','',''],

        // Row 8-9: 浮肿眼皮（幽灵苍白感）
        ['','outline','skinSh','skin','skin','skin','lid','lid','lid','lid','lid','lid','lid','lid','lid','lid','lid','lid','lid','lid','lid','lid','skin','skin','skinSh','skinSh','outline','','','','',''],
        ['outline','outline','skinSh','skin','skin','lidSh','lidSh','lidSh','lid','lid','lid','lid','lid','lid','lid','lid','lid','lid','lid','lid','lid','lid','lid','skin','skinSh','outline','outline','','','','',''],

        // Row 10-11: 大眼睛（空洞深色瞳孔）
        ['outline','skinSh','skin','skin','eyeB','eyeB','eyeB','eyeW','eyeW','eyeW','eyeW','eyeI','eyeI','eyeI','eyeI','eyeW','eyeW','eyeW','eyeW','eyeW','eyeB','eyeB','eyeB','skin','skin','skinSh','outline','','','','',''],
        ['outline','skinSh','skin','eyeB','eyeB','eyeB','eyeW','eyeW','eyeW','eyeI','eyeI','eyeI','eyeI','eyeI','eyeI','eyeI','eyeI','eyeW','eyeW','eyeW','eyeB','eyeB','eyeB','skin','skinSh','outline','','','','','',''],

        // Row 12-13: 眼睛下部
        ['outline','skinSh','skin','skin','eyeB','eyeB','eyeW','eyeW','eyeW','eyeI','eyeI','eyeI','eyeI','eyeI','eyeI','eyeI','eyeW','eyeW','eyeW','eyeB','eyeB','eyeB','skin','skin','skin','skinSh','outline','','','','',''],
        ['','outline','skinSh','skin','eyeB','eyeB','eyeB','eyeB','eyeB','eyeB','eyeB','eyeB','eyeB','eyeB','eyeB','eyeB','eyeB','eyeB','eyeB','eyeB','eyeB','skin','skin','skin','skinSh','outline','','','','','',''],

        // Row 14-15: 鼻子 + 嘴巴 + 腮红
        ['','outline','skinSh','blush','blush','blush','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','blush','blush','blush','skin','skinSh','outline','','','','','','','',''],
        ['','outline','skinSh','blush','blush','skin','skin','skin','skin','nose','nose','nose','skin','skin','skin','skin','skin','skin','skin','blush','blush','skin','skinSh','outline','','','','','','','',''],

        // Row 16-17: 下巴 + 脖子 + 领口（暗影缠绕）
        ['','outline','outline','skinSh','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','mouth','mouth','skin','skin','skin','skin','skin','skin','skin','skinSh','outline','outline','','','','','',''],
        ['','','outline','outline','skinSh','skinSh','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skinSh','skinSh','skinSh','outline','outline','','','','','','','',''],

        // Row 18-19: 幽灵外套上部 + 暗影缠绕
        ['','','','outline','outline','outline','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','outline','outline','outline','','','','','',''],
        ['','shadow','outline','coatLn','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coatLn','outline','shadow','','','','',''],

        // Row 20-23: 幽灵外套主体（半透明感）
        ['outline','shadow','coatLn','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coatLn','outline','','','',''],
        ['outline','coatLn','coat','coat','coat','ghost','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','ghost','coat','coat','coatLn','outline','','','',''],
        ['outline','coatLn','coat','coat','coat','coat','coat','coat','coat','coat','wisp','wisp','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coatLn','outline','','','','',''],
        ['outline','coatLn','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coatLn','outline','','','',''],

        // Row 24-25: 外套下部 + 手臂 + 暗影
        ['outline','coatLn','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coatLn','outline','','','',''],
        ['','outline','coatLn','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coatLn','outline','','','',''],

        // Row 26-27: 外套下摆（幽灵飘散）
        ['','outline','coatLn','coatLn','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coatLn','coatLn','outline','','','','',''],
        ['','','outline','outline','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','outline','outline','','','','','','','','',''],

        // Row 28-29: 腿/裤子
        ['','','','outline','outline','coatDk','coatDk','coatDk','coatDk','coatDk','coatDk','coatDk','coatDk','coatDk','coatDk','coatDk','coatDk','coatDk','coatDk','coatDk','coatDk','coatDk','coatDk','outline','outline','','','','','','',''],
        ['','','','','outline','outline','coatDk','coatDk','coatDk','coatDk','coatDk','coatDk','coatDk','coatDk','coatDk','coatDk','coatDk','coatDk','coatDk','coatDk','coatDk','outline','outline','','','','','','','','',''],

        // Row 30-31: 鞋子
        ['','','','','','','outline','outline','shoe','shoe','shoe','shoe','shoe','shoe','shoe','shoe','shoe','shoe','shoe','shoe','outline','outline','','','','','','','','','',''],
        ['','','','','','','','','outline','outline','outline','shoe','shoe','shoe','shoe','shoe','shoe','outline','outline','outline','','','','','','','','','','','',''],
      ],
    } as PixelData,
  },

  // ============================================================
  // 7. thunder (雷电) — CLOT联名 Alienegra 造型
  //    外星人图案元素，电光蓝紫色调，科技感外套
  // ============================================================
  {
    id: 'thunder',
    name: 'B-BABO雷电',
    hironoSeries: 'CLOT - Alienegra',
    palette: {
      hair:     '#2a2040',
      hairHi:   '#4a3868',
      hairDk:   '#181030',
      skin:     '#d8c8b8',
      skinSh:   '#b8a898',
      blush:    '#d0a0a0',
      nose:     '#c88080',
      eyeW:     '#e8e0f0',
      eyeI:     '#4030a0',
      eyeB:     '#201838',
      lid:      '#c8b8d0',
      lidSh:    '#a890b8',
      mouth:    '#a08888',
      coat:     '#382858',
      coatHi:   '#504070',
      coatDk:   '#281840',
      coatLn:   '#1a1030',
      inner:    '#605080',
      shoe:     '#1a1030',
      outline:  '#100820',
      white:    '#f0eaf8',
      alien:    '#6048b0',
      alienHi:  '#8868d0',
      spark:    '#a0c0ff',
      circuit:  '#4080c0',
    },
    sprite: {
      width: 32,
      height: 32,
      pixels: [
        // Row 0-2: 头顶 - 凌乱碎短发
        ['','','','','','','','hair','hair','hairDk','hairDk','hair','hair','','','hair','hair','hairDk','hairDk','hair','hair','','','','','','','','','','',''],
        ['','','','','','hairDk','hair','hair','hair','hair','hair','hairHi','hairHi','hair','hair','hair','hair','hairHi','hairHi','hair','hair','hair','hair','hair','hairDk','hair','hair','','','','',''],
        ['','','','hairDk','hair','hair','hair','hair','hair','hair','hair','hairHi','hairHi','hair','hair','hair','hair','hair','hairHi','hairHi','hair','hair','hair','hair','hair','hair','hairDk','hairDk','','','',''],

        // Row 3-5: 头发上部 + 额头
        ['','hairDk','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hairDk','hairDk','','',''],
        ['','hairDk','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hairDk','outline','','',''],
        ['','outline','hairDk','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hairDk','hairDk','outline','','','',''],

        // Row 6-7: 额头 + 眉毛区域
        ['','outline','hairDk','hairDk','hair','hair','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','hair','hair','hairDk','hairDk','outline','','','',''],
        ['','outline','hairDk','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','outline','','','','',''],

        // Row 8-9: 浮肿眼皮
        ['','outline','skinSh','skin','skin','skin','lid','lid','lid','lid','lid','lid','lid','lid','lid','lid','lid','lid','lid','lid','lid','lid','skin','skin','skinSh','skinSh','outline','','','','',''],
        ['outline','outline','skinSh','skin','skin','lidSh','lidSh','lidSh','lid','lid','lid','lid','lid','lid','lid','lid','lid','lid','lid','lid','lid','lid','lid','skin','skinSh','outline','outline','','','','',''],

        // Row 10-11: 大眼睛（蓝紫瞳孔）
        ['outline','skinSh','skin','skin','eyeB','eyeB','eyeB','eyeW','eyeW','eyeW','eyeW','eyeI','eyeI','eyeI','eyeI','eyeW','eyeW','eyeW','eyeW','eyeW','eyeB','eyeB','eyeB','skin','skin','skinSh','outline','','','','',''],
        ['outline','skinSh','skin','eyeB','eyeB','eyeB','eyeW','eyeW','eyeW','eyeI','eyeI','eyeI','eyeI','eyeI','eyeI','eyeI','eyeI','eyeW','eyeW','eyeW','eyeB','eyeB','eyeB','skin','skinSh','outline','','','','','',''],

        // Row 12-13: 眼睛下部
        ['outline','skinSh','skin','skin','eyeB','eyeB','eyeW','eyeW','eyeW','eyeI','eyeI','eyeI','eyeI','eyeI','eyeI','eyeI','eyeW','eyeW','eyeW','eyeB','eyeB','eyeB','skin','skin','skin','skinSh','outline','','','','',''],
        ['','outline','skinSh','skin','eyeB','eyeB','eyeB','eyeB','eyeB','eyeB','eyeB','eyeB','eyeB','eyeB','eyeB','eyeB','eyeB','eyeB','eyeB','eyeB','eyeB','skin','skin','skin','skinSh','outline','','','','','',''],

        // Row 14-15: 鼻子 + 嘴巴 + 腮红
        ['','outline','skinSh','blush','blush','blush','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','blush','blush','blush','skin','skinSh','outline','','','','','','','',''],
        ['','outline','skinSh','blush','blush','skin','skin','skin','skin','nose','nose','nose','skin','skin','skin','skin','skin','skin','skin','blush','blush','skin','skinSh','outline','','','','','','','',''],

        // Row 16-17: 下巴 + 脖子 + 领口
        ['','outline','outline','skinSh','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','mouth','mouth','skin','skin','skin','skin','skin','skin','skin','skinSh','outline','outline','','','','','',''],
        ['','','outline','outline','skinSh','skinSh','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skinSh','skinSh','skinSh','outline','outline','','','','','','','',''],

        // Row 18-19: 科技外套上部（外星人图案）
        ['','','','outline','outline','outline','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','outline','outline','outline','','','','','',''],
        ['','spark','outline','coatLn','coat','coat','coat','coat','alien','alien','coat','coat','coat','coat','coat','coat','coat','coat','alien','alien','coat','coat','coat','coat','coatLn','outline','spark','','','','',''],

        // Row 20-23: 科技外套主体（电路纹理）
        ['outline','spark','coatLn','coat','coat','coat','coat','coat','coat','coat','circuit','coat','coat','coat','coat','coat','coat','circuit','coat','coat','coat','coat','coat','coat','coat','coatLn','outline','','','','',''],
        ['outline','coatLn','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coatLn','outline','','','',''],
        ['outline','coatLn','coat','coat','alienHi','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','alienHi','coat','coat','coatLn','outline','','','','','',''],
        ['outline','coatLn','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coatLn','outline','','','',''],

        // Row 24-25: 外套下部 + 手臂（电光点缀）
        ['outline','coatLn','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coatLn','outline','','','',''],
        ['','outline','coatLn','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coatLn','outline','','','',''],

        // Row 26-27: 外套下摆
        ['','outline','coatLn','coatLn','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coatLn','coatLn','outline','','','','',''],
        ['','','outline','outline','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','outline','outline','','','','','','','','',''],

        // Row 28-29: 腿/裤子
        ['','','','outline','outline','coatDk','coatDk','coatDk','coatDk','coatDk','coatDk','coatDk','coatDk','coatDk','coatDk','coatDk','coatDk','coatDk','coatDk','coatDk','coatDk','coatDk','coatDk','outline','outline','','','','','','',''],
        ['','','','','outline','outline','coatDk','coatDk','coatDk','coatDk','coatDk','coatDk','coatDk','coatDk','coatDk','coatDk','coatDk','coatDk','coatDk','coatDk','coatDk','outline','outline','','','','','','','','',''],

        // Row 30-31: 鞋子
        ['','','','','','','outline','outline','shoe','shoe','shoe','shoe','shoe','shoe','shoe','shoe','shoe','shoe','shoe','shoe','outline','outline','','','','','','','','','',''],
        ['','','','','','','','','outline','outline','outline','shoe','shoe','shoe','shoe','shoe','shoe','outline','outline','outline','','','','','','','','','','','',''],
      ],
    } as PixelData,
  },

  // ============================================================
  // 8. frost (冰霜) — Echo系列 Journey in the Rain 造型
  //    黄色雨衣，反转雨伞道具，冷蓝点缀，雨滴元素
  // ============================================================
  {
    id: 'frost',
    name: 'B-BABO冰霜',
    hironoSeries: 'Echo - Journey in the Rain',
    palette: {
      hair:     '#586878',
      hairHi:   '#788898',
      hairDk:   '#384858',
      skin:     '#e0d0c0',
      skinSh:   '#c0b0a0',
      blush:    '#d8a8a8',
      nose:     '#d08080',
      eyeW:     '#e8f0f8',
      eyeI:     '#406888',
      eyeB:     '#283848',
      lid:      '#d0c0b0',
      lidSh:    '#b0a090',
      mouth:    '#a89888',
      coat:     '#c8b840',
      coatHi:   '#e0d060',
      coatDk:   '#a09030',
      coatLn:   '#807020',
      inner:    '#d8c850',
      shoe:     '#605838',
      outline:  '#383020',
      white:    '#f0f0f0',
      raincoat: '#c8b840',
      raincoatHi:'#e0d060',
      umbrella: '#d0c048',
      raindrop: '#88b8e0',
    },
    sprite: {
      width: 32,
      height: 32,
      pixels: [
        // Row 0-2: 头顶 - 凌乱碎短发 + 雨伞柄
        ['','','','umbrella','umbrella','umbrella','umbrella','umbrella','umbrella','umbrella','umbrella','umbrella','umbrella','umbrella','umbrella','umbrella','umbrella','umbrella','umbrella','umbrella','umbrella','umbrella','umbrella','umbrella','umbrella','umbrella','umbrella','','','','',''],
        ['','','','','','umbrella','umbrella','umbrella','umbrella','umbrella','umbrella','umbrella','umbrella','umbrella','umbrella','umbrella','umbrella','umbrella','umbrella','umbrella','umbrella','umbrella','umbrella','umbrella','umbrella','umbrella','umbrella','','','','',''],
        ['','','','','','umbrella','umbrella','umbrella','umbrella','umbrella','umbrella','umbrella','umbrella','umbrella','umbrella','umbrella','umbrella','umbrella','umbrella','umbrella','umbrella','umbrella','umbrella','umbrella','umbrella','umbrella','umbrella','','','','',''],

        // Row 3-5: 头发上部 + 额头（雨滴）
        ['','hairDk','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hairDk','hairDk','','',''],
        ['','hairDk','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hairDk','outline','','',''],
        ['','outline','hairDk','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hairDk','hairDk','outline','','','',''],

        // Row 6-7: 额头 + 眉毛区域
        ['','outline','hairDk','hairDk','hair','hair','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','hair','hair','hairDk','hairDk','outline','','','',''],
        ['','outline','hairDk','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','outline','','','','',''],

        // Row 8-9: 浮肿眼皮
        ['','outline','skinSh','skin','skin','skin','lid','lid','lid','lid','lid','lid','lid','lid','lid','lid','lid','lid','lid','lid','lid','lid','skin','skin','skinSh','skinSh','outline','','','','',''],
        ['outline','outline','skinSh','skin','skin','lidSh','lidSh','lidSh','lid','lid','lid','lid','lid','lid','lid','lid','lid','lid','lid','lid','lid','lid','lid','skin','skinSh','outline','outline','','','','',''],

        // Row 10-11: 大眼睛（冷蓝瞳孔）
        ['outline','skinSh','skin','skin','eyeB','eyeB','eyeB','eyeW','eyeW','eyeW','eyeW','eyeI','eyeI','eyeI','eyeI','eyeW','eyeW','eyeW','eyeW','eyeW','eyeB','eyeB','eyeB','skin','skin','skinSh','outline','','','','',''],
        ['outline','skinSh','skin','eyeB','eyeB','eyeB','eyeW','eyeW','eyeW','eyeI','eyeI','eyeI','eyeI','eyeI','eyeI','eyeI','eyeI','eyeW','eyeW','eyeW','eyeB','eyeB','eyeB','skin','skinSh','outline','','','','','',''],

        // Row 12-13: 眼睛下部
        ['outline','skinSh','skin','skin','eyeB','eyeB','eyeW','eyeW','eyeW','eyeI','eyeI','eyeI','eyeI','eyeI','eyeI','eyeI','eyeW','eyeW','eyeW','eyeB','eyeB','eyeB','skin','skin','skin','skinSh','outline','','','','',''],
        ['','outline','skinSh','skin','eyeB','eyeB','eyeB','eyeB','eyeB','eyeB','eyeB','eyeB','eyeB','eyeB','eyeB','eyeB','eyeB','eyeB','eyeB','eyeB','eyeB','skin','skin','skin','skinSh','outline','','','','','',''],

        // Row 14-15: 鼻子 + 嘴巴 + 腮红
        ['','outline','skinSh','blush','blush','blush','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','blush','blush','blush','skin','skinSh','outline','','','','','','','',''],
        ['','outline','skinSh','blush','blush','skin','skin','skin','skin','nose','nose','nose','skin','skin','skin','skin','skin','skin','skin','blush','blush','skin','skinSh','outline','','','','','','','',''],

        // Row 16-17: 下巴 + 脖子 + 领口
        ['','outline','outline','skinSh','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','mouth','mouth','skin','skin','skin','skin','skin','skin','skin','skinSh','outline','outline','','','','','',''],
        ['','','outline','outline','skinSh','skinSh','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skinSh','skinSh','skinSh','outline','outline','','','','','','','',''],

        // Row 18-19: 黄色雨衣上部
        ['','','','outline','outline','outline','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','outline','outline','outline','','','','','',''],
        ['','raindrop','outline','coatLn','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coatLn','outline','raindrop','','','','',''],

        // Row 20-23: 黄色雨衣主体（宽松感）
        ['outline','coatLn','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coatLn','outline','','','',''],
        ['outline','coatLn','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coatLn','outline','','','',''],
        ['outline','coatLn','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coatLn','outline','','','',''],
        ['outline','coatLn','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coatLn','outline','','','',''],

        // Row 24-25: 雨衣下部 + 手臂 + 雨滴
        ['outline','coatLn','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coatLn','outline','','','',''],
        ['','outline','coatLn','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coatLn','outline','','','',''],

        // Row 26-27: 雨衣下摆
        ['','outline','coatLn','coatLn','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coatLn','coatLn','outline','','','','',''],
        ['','','outline','outline','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','outline','outline','','','','','','','','',''],

        // Row 28-29: 腿/裤子
        ['','','','outline','outline','coatDk','coatDk','coatDk','coatDk','coatDk','coatDk','coatDk','coatDk','coatDk','coatDk','coatDk','coatDk','coatDk','coatDk','coatDk','coatDk','coatDk','coatDk','outline','outline','','','','','','',''],
        ['','','','','outline','outline','coatDk','coatDk','coatDk','coatDk','coatDk','coatDk','coatDk','coatDk','coatDk','coatDk','coatDk','coatDk','coatDk','coatDk','coatDk','outline','outline','','','','','','','','',''],

        // Row 30-31: 鞋子
        ['','','','','','','outline','outline','shoe','shoe','shoe','shoe','shoe','shoe','shoe','shoe','shoe','shoe','shoe','shoe','outline','outline','','','','','','','','','',''],
        ['','','','','','','','','outline','outline','outline','shoe','shoe','shoe','shoe','shoe','shoe','outline','outline','outline','','','','','','','','','','','',''],
      ],
    } as PixelData,
  },

  // ============================================================
  // 9. phantom (幻影) — Mime系列 Silent 隐藏款造型
  //    哑剧黑白条纹服装，神秘感，半边面具
  // ============================================================
  {
    id: 'phantom',
    name: 'B-BABO幻影',
    hironoSeries: 'Mime - Silent (Hidden)',
    palette: {
      hair:     '#1a1a20',
      hairHi:   '#383840',
      hairDk:   '#0a0a10',
      skin:     '#e8e0d8',
      skinSh:   '#c8c0b8',
      blush:    '#d8a8a8',
      nose:     '#c88080',
      eyeW:     '#f0f0f0',
      eyeI:     '#1a1a20',
      eyeB:     '#0a0a10',
      lid:      '#d8d0c8',
      lidSh:    '#b8b0a8',
      mouth:    '#a09090',
      coat:     '#f0ece8',
      coatHi:   '#ffffff',
      coatDk:   '#d0ccc8',
      coatLn:   '#b0aca8',
      inner:    '#e0dcd8',
      shoe:     '#1a1a20',
      outline:  '#0a0a10',
      white:    '#ffffff',
      stripe:   '#1a1a20',
      stripeDk: '#0a0a10',
      mask:     '#e8e4e0',
      maskHi:   '#f8f4f0',
    },
    sprite: {
      width: 32,
      height: 32,
      pixels: [
        // Row 0-2: 头顶 - 凌乱碎短发
        ['','','','','','','','hair','hair','hairDk','hairDk','hair','hair','','','hair','hair','hairDk','hairDk','hair','hair','','','','','','','','','','',''],
        ['','','','','','hairDk','hair','hair','hair','hair','hair','hairHi','hairHi','hair','hair','hair','hair','hairHi','hairHi','hair','hair','hair','hair','hair','hairDk','hair','hair','','','','',''],
        ['','','','hairDk','hair','hair','hair','hair','hair','hair','hair','hairHi','hairHi','hair','hair','hair','hair','hair','hairHi','hairHi','hair','hair','hair','hair','hair','hair','hairDk','hairDk','','','',''],

        // Row 3-5: 头发上部 + 额头
        ['','hairDk','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hairDk','hairDk','','',''],
        ['','hairDk','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hairDk','outline','','',''],
        ['','outline','hairDk','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hairDk','hairDk','outline','','','',''],

        // Row 6-7: 额头 + 眉毛区域（半边面具开始）
        ['','outline','hairDk','hairDk','hair','hair','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','hair','hair','hairDk','hairDk','outline','','','',''],
        ['','outline','hairDk','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','outline','','','','',''],

        // Row 8-9: 浮肿眼皮（HIRONO标志，左半脸有面具边缘）
        ['','outline','skinSh','mask','mask','lid','lid','lid','lid','lid','lid','lid','lid','lid','lid','lid','lid','lid','lid','lid','lid','lid','skin','skin','skin','skinSh','skinSh','outline','','','','',''],
        ['outline','outline','skinSh','mask','mask','lidSh','lidSh','lidSh','lid','lid','lid','lid','lid','lid','lid','lid','lid','lid','lid','lid','lid','lid','lid','skin','skinSh','outline','outline','',''],

        // Row 10-11: 大眼睛（左眼被面具半遮，右眼完整）
        ['outline','skinSh','mask','mask','eyeB','eyeB','eyeW','eyeW','eyeW','eyeW','eyeI','eyeI','eyeI','eyeI','eyeW','eyeW','eyeW','eyeW','eyeW','eyeB','eyeB','skin','skin','skin','skin','skinSh','outline','','',''],
        ['outline','skinSh','skin','eyeB','eyeB','eyeW','eyeW','eyeW','eyeI','eyeI','eyeI','eyeI','eyeI','eyeI','eyeI','eyeI','eyeW','eyeW','eyeW','eyeB','eyeB','skin','skin','skin','skinSh','outline','','',''],

        // Row 12-13: 眼睛下部
        ['outline','skinSh','skin','skin','eyeB','eyeB','eyeW','eyeW','eyeW','eyeI','eyeI','eyeI','eyeI','eyeI','eyeI','eyeI','eyeW','eyeW','eyeW','eyeB','eyeB','skin','skin','skin','skin','skinSh','outline','','',''],
        ['','outline','skinSh','skin','skin','eyeB','eyeB','eyeB','eyeB','eyeB','eyeB','eyeB','eyeB','eyeB','eyeB','eyeB','eyeB','eyeB','eyeB','eyeB','skin','skin','skin','skinSh','outline','','',''],

        // Row 14-15: 鼻子 + 嘴巴 + 腮红
        ['','outline','skinSh','mask','mask','blush','blush','blush','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','blush','blush','blush','skin','skinSh','outline','','',''],
        ['','outline','skinSh','mask','mask','blush','blush','skin','skin','skin','skin','nose','nose','nose','skin','skin','skin','skin','skin','skin','blush','blush','skin','skinSh','outline','','',''],

        // Row 16-17: 下巴 + 脖子 + 领口
        ['','outline','outline','skinSh','mask','mask','skin','skin','skin','skin','skin','skin','skin','skin','mouth','mouth','skin','skin','skin','skin','skin','skin','skin','skinSh','outline','outline','','',''],
        ['','','outline','outline','skinSh','skinSh','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skinSh','skinSh','skinSh','outline','outline','','','','',''],

        // Row 18-19: 幽灵外套上部 + 暗影缠绕
        ['','','','outline','outline','outline','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','outline','outline','outline','','','','','',''],
        ['','shadow','outline','coatLn','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coatLn','outline','shadow','','','','',''],

        // Row 20-23: 幽灵外套主体（半透明感）
        ['outline','shadow','coatLn','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coatLn','outline','','','',''],
        ['outline','coatLn','coat','coat','coat','ghost','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','ghost','coat','coat','coatLn','outline','','','',''],
        ['outline','coatLn','coat','coat','coat','coat','coat','coat','coat','coat','wisp','wisp','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coatLn','outline','','','','',''],
        ['outline','coatLn','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coatLn','outline','','','',''],

        // Row 24-25: 外套下部 + 手臂 + 暗影
        ['outline','coatLn','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coatLn','outline','','','',''],
        ['','outline','coatLn','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coatLn','outline','','','',''],

        // Row 26-27: 外套下摆（幽灵飘散）
        ['','outline','coatLn','coatLn','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coatLn','coatLn','outline','','','','',''],
        ['','','outline','outline','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','outline','outline','','','','','','','','',''],

        // Row 28-29: 腿/裤子
        ['','','','outline','outline','coatDk','coatDk','coatDk','coatDk','coatDk','coatDk','coatDk','coatDk','coatDk','coatDk','coatDk','coatDk','coatDk','coatDk','coatDk','coatDk','coatDk','coatDk','outline','outline','','','','','','',''],
        ['','','','','outline','outline','coatDk','coatDk','coatDk','coatDk','coatDk','coatDk','coatDk','coatDk','coatDk','coatDk','coatDk','coatDk','coatDk','coatDk','coatDk','outline','outline','','','','','','','','',''],

        // Row 30-31: 鞋子
        ['','','','','','','outline','outline','shoe','shoe','shoe','shoe','shoe','shoe','shoe','shoe','shoe','shoe','shoe','shoe','outline','outline','','','','','','','','','',''],
        ['','','','','','','','','outline','outline','outline','shoe','shoe','shoe','shoe','shoe','shoe','outline','outline','outline','','','','','','','','','','','',''],
      ],
    } as PixelData,
  },

  // ============================================================
  // 7. thunder (雷电) — CLOT联名 Alienegra 造型
  //    外星人图案元素，电光蓝紫色调，科技感外套
  // ============================================================
  {
    id: 'thunder',
    name: 'B-BABO雷电',
    hironoSeries: 'CLOT - Alienegra',
    palette: {
      hair:     '#2a2040',
      hairHi:   '#4a3868',
      hairDk:   '#181030',
      skin:     '#d8c8b8',
      skinSh:   '#b8a898',
      blush:    '#d0a0a0',
      nose:     '#c88080',
      eyeW:     '#e8e0f0',
      eyeI:     '#4030a0',
      eyeB:     '#201838',
      lid:      '#c8b8d0',
      lidSh:    '#a890b8',
      mouth:    '#a08888',
      coat:     '#382858',
      coatHi:   '#504070',
      coatDk:   '#281840',
      coatLn:   '#1a1030',
      inner:    '#605080',
      shoe:     '#1a1030',
      outline:  '#100820',
      white:    '#f0eaf8',
      alien:    '#6048b0',
      alienHi:  '#8868d0',
      spark:    '#a0c0ff',
      circuit:  '#4080c0',
    },
    sprite: {
      width: 32,
      height: 32,
      pixels: [
        // Row 0-2: 头顶 - 凌乱碎短发
        ['','','','','','','','hair','hair','hairDk','hairDk','hair','hair','','','hair','hair','hairDk','hairDk','hair','hair','','','','','','','','','','',''],
        ['','','','','','hairDk','hair','hair','hair','hair','hair','hairHi','hairHi','hair','hair','hair','hair','hairHi','hairHi','hair','hair','hair','hair','hair','hairDk','hair','hair','','','','',''],
        ['','','','hairDk','hair','hair','hair','hair','hair','hair','hair','hairHi','hairHi','hair','hair','hair','hair','hair','hairHi','hairHi','hair','hair','hair','hair','hair','hair','hairDk','hairDk','','','',''],

        // Row 3-5: 头发上部 + 额头
        ['','hairDk','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hairDk','hairDk','','',''],
        ['','hairDk','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hairDk','outline','','',''],
        ['','outline','hairDk','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hairDk','hairDk','outline','','','',''],

        // Row 6-7: 额头 + 眉毛区域
        ['','outline','hairDk','hairDk','hair','hair','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','hair','hair','hairDk','hairDk','outline','','','',''],
        ['','outline','hairDk','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','outline','','','','',''],

        // Row 8-9: 浮肿眼皮
        ['','outline','skinSh','skin','skin','skin','lid','lid','lid','lid','lid','lid','lid','lid','lid','lid','lid','lid','lid','lid','lid','lid','skin','skin','skinSh','skinSh','outline','','','','',''],
        ['outline','outline','skinSh','skin','skin','lidSh','lidSh','lidSh','lid','lid','lid','lid','lid','lid','lid','lid','lid','lid','lid','lid','lid','lid','lid','skin','skinSh','outline','outline','','','','',''],

        // Row 10-11: 大眼睛（蓝紫瞳孔）
        ['outline','skinSh','skin','skin','eyeB','eyeB','eyeB','eyeW','eyeW','eyeW','eyeW','eyeI','eyeI','eyeI','eyeI','eyeW','eyeW','eyeW','eyeW','eyeW','eyeB','eyeB','eyeB','skin','skin','skinSh','outline','','','','',''],
        ['outline','skinSh','skin','eyeB','eyeB','eyeB','eyeW','eyeW','eyeW','eyeI','eyeI','eyeI','eyeI','eyeI','eyeI','eyeI','eyeI','eyeW','eyeW','eyeW','eyeB','eyeB','eyeB','skin','skinSh','outline','','','','','',''],

        // Row 12-13: 眼睛下部
        ['outline','skinSh','skin','skin','eyeB','eyeB','eyeW','eyeW','eyeW','eyeI','eyeI','eyeI','eyeI','eyeI','eyeI','eyeI','eyeW','eyeW','eyeW','eyeB','eyeB','eyeB','skin','skin','skin','skinSh','outline','','','','',''],
        ['','outline','skinSh','skin','eyeB','eyeB','eyeB','eyeB','eyeB','eyeB','eyeB','eyeB','eyeB','eyeB','eyeB','eyeB','eyeB','eyeB','eyeB','eyeB','eyeB','skin','skin','skin','skinSh','outline','','','','','',''],

        // Row 14-15: 鼻子 + 嘴巴 + 腮红
        ['','outline','skinSh','blush','blush','blush','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','blush','blush','blush','skin','skinSh','outline','','','','','','','',''],
        ['','outline','skinSh','blush','blush','skin','skin','skin','skin','nose','nose','nose','skin','skin','skin','skin','skin','skin','skin','blush','blush','skin','skinSh','outline','','','','','','','',''],

        // Row 16-17: 下巴 + 脖子 + 领口
        ['','outline','outline','skinSh','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','mouth','mouth','skin','skin','skin','skin','skin','skin','skin','skinSh','outline','outline','','','','','',''],
        ['','','outline','outline','skinSh','skinSh','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skinSh','skinSh','skinSh','outline','outline','','','','','','','',''],

        // Row 18-19: 科技外套上部（外星人图案）
        ['','','','outline','outline','outline','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','outline','outline','outline','','','','','',''],
        ['','spark','outline','coatLn','coat','coat','coat','coat','alien','alien','coat','coat','coat','coat','coat','coat','coat','coat','alien','alien','coat','coat','coat','coat','coatLn','outline','spark','','','','',''],

        // Row 20-23: 科技外套主体（电路纹理）
        ['outline','spark','coatLn','coat','coat','coat','coat','coat','coat','coat','circuit','coat','coat','coat','coat','coat','coat','circuit','coat','coat','coat','coat','coat','coat','coat','coatLn','outline','','','','',''],
        ['outline','coatLn','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coatLn','outline','','','',''],
        ['outline','coatLn','coat','coat','alienHi','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','alienHi','coat','coat','coatLn','outline','','','','','',''],
        ['outline','coatLn','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coatLn','outline','','','',''],

        // Row 24-25: 外套下部 + 手臂（电光点缀）
        ['outline','coatLn','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coatLn','outline','','','',''],
        ['','outline','coatLn','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coatLn','outline','','','',''],

        // Row 26-27: 外套下摆
        ['','outline','coatLn','coatLn','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coatLn','coatLn','outline','','','','',''],
        ['','','outline','outline','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','outline','outline','','','','','','','','',''],

        // Row 28-29: 腿/裤子
        ['','','','outline','outline','coatDk','coatDk','coatDk','coatDk','coatDk','coatDk','coatDk','coatDk','coatDk','coatDk','coatDk','coatDk','coatDk','coatDk','coatDk','coatDk','coatDk','coatDk','outline','outline','','','','','','',''],
        ['','','','','outline','outline','coatDk','coatDk','coatDk','coatDk','coatDk','coatDk','coatDk','coatDk','coatDk','coatDk','coatDk','coatDk','coatDk','coatDk','coatDk','outline','outline','','','','','','','','',''],

        // Row 30-31: 鞋子
        ['','','','','','','outline','outline','shoe','shoe','shoe','shoe','shoe','shoe','shoe','shoe','shoe','shoe','shoe','shoe','outline','outline','','','','','','','','','',''],
        ['','','','','','','','','outline','outline','outline','shoe','shoe','shoe','shoe','shoe','shoe','outline','outline','outline','','','','','','','','','','','',''],
      ],
    } as PixelData,
  },

  // ============================================================
  // 8. frost (冰霜) — Echo系列 Journey in the Rain 造型
  //    黄色雨衣，反转雨伞道具，冷蓝点缀，雨滴元素
  // ============================================================
  {
    id: 'frost',
    name: 'B-BABO冰霜',
    hironoSeries: 'Echo - Journey in the Rain',
    palette: {
      hair:     '#586878',
      hairHi:   '#788898',
      hairDk:   '#384858',
      skin:     '#e0d0c0',
      skinSh:   '#c0b0a0',
      blush:    '#d8a8a8',
      nose:     '#d08080',
      eyeW:     '#e8f0f8',
      eyeI:     '#406888',
      eyeB:     '#283848',
      lid:      '#d0c0b0',
      lidSh:    '#b0a090',
      mouth:    '#a89888',
      coat:     '#c8b840',
      coatHi:   '#e0d060',
      coatDk:   '#a09030',
      coatLn:   '#807020',
      inner:    '#d8c850',
      shoe:     '#605838',
      outline:  '#383020',
      white:    '#f0f0f0',
      raincoat: '#c8b840',
      raincoatHi:'#e0d060',
      umbrella: '#d0c048',
      raindrop: '#88b8e0',
    },
    sprite: {
      width: 32,
      height: 32,
      pixels: [
        // Row 0-2: 头顶 - 凌乱碎短发 + 雨伞柄
        ['','','','umbrella','umbrella','umbrella','umbrella','umbrella','umbrella','umbrella','umbrella','umbrella','umbrella','umbrella','umbrella','umbrella','umbrella','umbrella','umbrella','umbrella','umbrella','umbrella','umbrella','umbrella','umbrella','umbrella','umbrella','','','','',''],
        ['','','','','','umbrella','umbrella','umbrella','umbrella','umbrella','umbrella','umbrella','umbrella','umbrella','umbrella','umbrella','umbrella','umbrella','umbrella','umbrella','umbrella','umbrella','umbrella','umbrella','umbrella','umbrella','umbrella','','','','',''],
        ['','','','','','umbrella','umbrella','umbrella','umbrella','umbrella','umbrella','umbrella','umbrella','umbrella','umbrella','umbrella','umbrella','umbrella','umbrella','umbrella','umbrella','umbrella','umbrella','umbrella','umbrella','umbrella','umbrella','','','','',''],

        // Row 3-5: 头发上部 + 额头（雨滴）
        ['','hairDk','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hairDk','hairDk','','',''],
        ['','hairDk','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hairDk','outline','','',''],
        ['','outline','hairDk','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hairDk','hairDk','outline','','','',''],

        // Row 6-7: 额头 + 眉毛区域
        ['','outline','hairDk','hairDk','hair','hair','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','hair','hair','hairDk','hairDk','outline','','','',''],
        ['','outline','hairDk','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','outline','','','','',''],

        // Row 8-9: 浮肿眼皮
        ['','outline','skinSh','skin','skin','skin','lid','lid','lid','lid','lid','lid','lid','lid','lid','lid','lid','lid','lid','lid','lid','lid','skin','skin','skinSh','skinSh','outline','','','','',''],
        ['outline','outline','skinSh','skin','skin','lidSh','lidSh','lidSh','lid','lid','lid','lid','lid','lid','lid','lid','lid','lid','lid','lid','lid','lid','lid','skin','skinSh','outline','outline','','','','',''],

        // Row 10-11: 大眼睛（冷蓝瞳孔）
        ['outline','skinSh','skin','skin','eyeB','eyeB','eyeB','eyeW','eyeW','eyeW','eyeW','eyeI','eyeI','eyeI','eyeI','eyeW','eyeW','eyeW','eyeW','eyeW','eyeB','eyeB','eyeB','skin','skin','skinSh','outline','','','','',''],
        ['outline','skinSh','skin','eyeB','eyeB','eyeB','eyeW','eyeW','eyeW','eyeI','eyeI','eyeI','eyeI','eyeI','eyeI','eyeI','eyeI','eyeW','eyeW','eyeW','eyeB','eyeB','eyeB','skin','skinSh','outline','','','','','',''],

        // Row 12-13: 眼睛下部
        ['outline','skinSh','skin','skin','eyeB','eyeB','eyeW','eyeW','eyeW','eyeI','eyeI','eyeI','eyeI','eyeI','eyeI','eyeI','eyeW','eyeW','eyeW','eyeB','eyeB','eyeB','skin','skin','skin','skinSh','outline','','','','',''],
        ['','outline','skinSh','skin','eyeB','eyeB','eyeB','eyeB','eyeB','eyeB','eyeB','eyeB','eyeB','eyeB','eyeB','eyeB','eyeB','eyeB','eyeB','eyeB','eyeB','skin','skin','skin','skinSh','outline','','','','','',''],

        // Row 14-15: 鼻子 + 嘴巴 + 腮红
        ['','outline','skinSh','blush','blush','blush','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','blush','blush','blush','skin','skinSh','outline','','','','','','','',''],
        ['','outline','skinSh','blush','blush','skin','skin','skin','skin','nose','nose','nose','skin','skin','skin','skin','skin','skin','skin','blush','blush','skin','skinSh','outline','','','','','','','',''],

        // Row 16-17: 下巴 + 脖子 + 领口
        ['','outline','outline','skinSh','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','mouth','mouth','skin','skin','skin','skin','skin','skin','skin','skinSh','outline','outline','','','','','',''],
        ['','','outline','outline','skinSh','skinSh','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skinSh','skinSh','skinSh','outline','outline','','','','','','','',''],

        // Row 18-19: 黄色雨衣上部
        ['','','','outline','outline','outline','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','outline','outline','outline','','','','','',''],
        ['','raindrop','outline','coatLn','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coatLn','outline','raindrop','','','','',''],

        // Row 20-23: 黄色雨衣主体（宽松感）
        ['outline','coatLn','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coatLn','outline','','','',''],
        ['outline','coatLn','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coatLn','outline','','','',''],
        ['outline','coatLn','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coatLn','outline','','','',''],
        ['outline','coatLn','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coatLn','outline','','','',''],

        // Row 24-25: 雨衣下部 + 手臂 + 雨滴
        ['outline','coatLn','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coatLn','outline','','','',''],
        ['','outline','coatLn','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coatLn','outline','','','',''],

        // Row 26-27: 雨衣下摆
        ['','outline','coatLn','coatLn','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coatLn','coatLn','outline','','','','',''],
        ['','','outline','outline','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','outline','outline','','','','','','','','',''],

        // Row 28-29: 腿/裤子
        ['','','','outline','outline','coatDk','coatDk','coatDk','coatDk','coatDk','coatDk','coatDk','coatDk','coatDk','coatDk','coatDk','coatDk','coatDk','coatDk','coatDk','coatDk','coatDk','coatDk','outline','outline','','','','','','',''],
        ['','','','','outline','outline','coatDk','coatDk','coatDk','coatDk','coatDk','coatDk','coatDk','coatDk','coatDk','coatDk','coatDk','coatDk','coatDk','coatDk','coatDk','outline','outline','','','','','','','','',''],

        // Row 30-31: 鞋子
        ['','','','','','','outline','outline','shoe','shoe','shoe','shoe','shoe','shoe','shoe','shoe','shoe','shoe','shoe','shoe','outline','outline','','','','','','','','','',''],
        ['','','','','','','','','outline','outline','outline','shoe','shoe','shoe','shoe','shoe','shoe','outline','outline','outline','','','','','','','','','','','',''],
      ],
    } as PixelData,
  },

  // ============================================================
  // 9. phantom (幻影) — Mime系列 Silent 隐藏款造型
  //    哑剧黑白条纹服装，神秘感，半边面具
  // ============================================================
  {
    id: 'phantom',
    name: 'B-BABO幻影',
    hironoSeries: 'Mime - Silent (Hidden)',
    palette: {
      hair:     '#1a1a20',
      hairHi:   '#383840',
      hairDk:   '#0a0a10',
      skin:     '#e8e0d8',
      skinSh:   '#c8c0b8',
      blush:    '#d8a8a8',
      nose:     '#c88080',
      eyeW:     '#f0f0f0',
      eyeI:     '#1a1a20',
      eyeB:     '#0a0a10',
      lid:      '#d8d0c8',
      lidSh:    '#b8b0a8',
      mouth:    '#a09090',
      coat:     '#f0ece8',
      coatHi:   '#ffffff',
      coatDk:   '#d0ccc8',
      coatLn:   '#b0aca8',
      inner:    '#e0dcd8',
      shoe:     '#1a1a20',
      outline:  '#0a0a10',
      white:    '#ffffff',
      stripe:   '#1a1a20',
      stripeDk: '#0a0a10',
      mask:     '#e8e4e0',
      maskHi:   '#f8f4f0',
    },
    sprite: {
      width: 32,
      height: 32,
      pixels: [
        // Row 0-2: 头顶 - 凌乱碎短发
        ['','','','','','','','hair','hair','hairDk','hairDk','hair','hair','','','hair','hair','hairDk','hairDk','hair','hair','','','','','','','','','','',''],
        ['','','','','','hairDk','hair','hair','hair','hair','hair','hairHi','hairHi','hair','hair','hair','hair','hairHi','hairHi','hair','hair','hair','hair','hair','hairDk','hair','hair','','','','',''],
        ['','','','hairDk','hair','hair','hair','hair','hair','hair','hair','hairHi','hairHi','hair','hair','hair','hair','hair','hairHi','hairHi','hair','hair','hair','hair','hair','hair','hairDk','hairDk','','','',''],

        // Row 3-5: 头发上部 + 额头
        ['','hairDk','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hairDk','hairDk','','',''],
        ['','hairDk','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hairDk','outline','','',''],
        ['','outline','hairDk','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hairDk','hairDk','outline','','','',''],

        // Row 6-7: 额头 + 眉毛区域（半边面具开始）
        ['','outline','hairDk','hairDk','hair','hair','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','hair','hair','hairDk','hairDk','outline','','','',''],
        ['','outline','hairDk','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','outline','','','','',''],

        // Row 8-9: 浮肿眼皮（左眼有面具覆盖）
        ['','outline','skinSh','mask','mask','mask','lid','lid','lid','lid','lid','lid','lid','lid','lid','lid','lid','lid','lid','lid','lid','lid','skin','skin','skinSh','skinSh','outline','','','','',''],
        ['outline','outline','skinSh','mask','mask','mask','lidSh','lidSh','lidSh','lid','lid','lid','lid','lid','lid','lid','lid','lid','lid','lid','lid','lid','lid','lid','skin','skinSh','outline','outline','','','',''],

        // Row 10-11: 大眼睛（左眼被面具遮挡）
        ['outline','skinSh','mask','mask','mask','mask','mask','mask','mask','mask','mask','mask','mask','mask','eyeB','eyeB','eyeB','eyeW','eyeW','eyeW','eyeW','eyeI','eyeI','eyeI','eyeI','eyeW','eyeW','eyeW','eyeW','eyeW','eyeB','eyeB'],
        ['outline','skinSh','mask','mask','mask','mask','mask','mask','mask','mask','mask','mask','mask','mask','eyeB','eyeB','eyeB','eyeW','eyeW','eyeW','eyeI','eyeI','eyeI','eyeI','eyeI','eyeI','eyeI','eyeI','eyeW','eyeW','eyeW','eyeB'],

        // Row 12-13: 眼睛下部（面具延续）
        ['outline','skinSh','mask','mask','mask','mask','mask','mask','mask','mask','mask','mask','mask','mask','eyeB','eyeB','eyeW','eyeW','eyeW','eyeI','eyeI','eyeI','eyeI','eyeI','eyeI','eyeI','eyeW','eyeW','eyeW','eyeB','eyeB','eyeB'],
        ['','outline','skinSh','mask','mask','mask','mask','mask','mask','mask','mask','mask','mask','mask','eyeB','eyeB','eyeB','eyeB','eyeB','eyeB','eyeB','eyeB','eyeB','eyeB','eyeB','eyeB','eyeB','eyeB','eyeB','eyeB','eyeB','skin'],

        // Row 14-15: 鼻子 + 嘴巴 + 腮红
        ['','outline','skinSh','mask','mask','mask','mask','mask','mask','mask','mask','mask','mask','mask','blush','blush','blush','skin','skin','skin','skin','skin','skin','skin','skin','blush','blush','blush','skin','skinSh','outline',''],
        ['','outline','skinSh','mask','mask','mask','mask','mask','mask','mask','mask','mask','mask','mask','blush','blush','skin','skin','skin','nose','nose','nose','skin','skin','skin','skin','skin','skin','blush','blush','skin','skinSh'],

        // Row 16-17: 下巴 + 脖子 + 领口
        ['','outline','outline','skinSh','mask','mask','mask','mask','mask','mask','mask','mask','mask','mask','skin','skin','skin','skin','skin','skin','skin','mouth','mouth','skin','skin','skin','skin','skin','skin','skinSh','outline','outline'],
        ['','','outline','outline','skinSh','skinSh','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skinSh','skinSh','skinSh','skinSh','skinSh','skinSh','skinSh','skinSh','outline','outline','',''],

        // Row 18-19: 黑白条纹外套上部
        ['','','','outline','outline','outline','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','outline','outline','outline','','','','','',''],
        ['','outline','coatLn','coat','coat','coat','stripe','stripe','stripe','coat','coat','coat','stripe','stripe','stripe','coat','coat','coat','stripe','stripe','stripe','coat','coat','coat','coat','coatLn','outline','','','','',''],

        // Row 20-23: 黑白条纹外套主体
        ['outline','coatLn','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coatLn','outline','','','',''],
        ['outline','coatLn','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coatLn','outline','','','',''],
        ['outline','coatLn','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coatLn','outline','','','',''],
        ['outline','coatLn','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coatLn','outline','','','',''],

        // Row 24-25: 外套下部 + 手臂（条纹）
        ['outline','coatLn','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coatLn','outline','','','',''],
        ['','outline','coatLn','coat','coat','coat','stripe','stripe','stripe','coat','coat','coat','stripe','stripe','stripe','coat','coat','coat','stripe','stripe','stripe','coat','coat','coat','coat','coatLn','outline','','','','',''],

        // Row 26-27: 外套下摆
        ['','outline','coatLn','coatLn','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coatLn','coatLn','outline','','','','',''],
        ['','','outline','outline','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','outline','outline','','','','','','','','',''],

        // Row 28-29: 腿/裤子
        ['','','','outline','outline','coatDk','coatDk','coatDk','coatDk','coatDk','coatDk','coatDk','coatDk','coatDk','coatDk','coatDk','coatDk','coatDk','coatDk','coatDk','coatDk','coatDk','coatDk','outline','outline','','','','','','',''],
        ['','','','','outline','outline','coatDk','coatDk','coatDk','coatDk','coatDk','coatDk','coatDk','coatDk','coatDk','coatDk','coatDk','coatDk','coatDk','coatDk','coatDk','outline','outline','','','','','','','','',''],

        // Row 30-31: 鞋子
        ['','','','','','','outline','outline','shoe','shoe','shoe','shoe','shoe','shoe','shoe','shoe','shoe','shoe','shoe','shoe','outline','outline','','','','','','','','','',''],
        ['','','','','','','','','outline','outline','outline','shoe','shoe','shoe','shoe','shoe','shoe','outline','outline','outline','','','','','','','','','','','',''],
      ],
    } as PixelData,
  },

  // ============================================================
  // 10. merchant (商人) — Le Petit Prince系列 The Businessman 造型
  //     商人装扮，领带/公文包，精明表情，深棕金色调
  // ============================================================
  {
    id: 'merchant',
    name: 'B-BABO商人',
    hironoSeries: 'Le Petit Prince - The Businessman',
    palette: {
      hair:     '#3a2820',
      hairHi:   '#584038',
      hairDk:   '#201810',
      skin:     '#e0c8b0',
      skinSh:   '#c0a890',
      blush:    '#d8a090',
      nose:     '#c87878',
      eyeW:     '#f0e8e0',
      eyeI:     '#382818',
      eyeB:     '#201008',
      lid:      '#d0b8a0',
      lidSh:    '#b09880',
      mouth:    '#a08878',
      coat:     '#4a3828',
      coatHi:   '#6a5838',
      coatDk:   '#302018',
      coatLn:   '#201008',
      inner:    '#e8d8c0',
      shoe:     '#1a1008',
      outline:  '#100800',
      white:    '#f8f0e8',
      tie:      '#882020',
      briefcase:'#6a5030',
      coin:     '#d8b040',
      vest:     '#5a4830',
    },
    sprite: {
      width: 32,
      height: 32,
      pixels: [
        // Row 0-2: 头顶 - 凌乱碎短发
        ['','','','','','','','hair','hair','hairDk','hairDk','hair','hair','','','hair','hair','hairDk','hairDk','hair','hair','','','','','','','','','','',''],
        ['','','','','','hairDk','hair','hair','hair','hair','hair','hairHi','hairHi','hair','hair','hair','hair','hairHi','hairHi','hair','hair','hair','hair','hair','hairDk','hair','hair','','','','',''],
        ['','','','hairDk','hair','hair','hair','hair','hair','hair','hair','hairHi','hairHi','hair','hair','hair','hair','hair','hairHi','hairHi','hair','hair','hair','hair','hair','hair','hairDk','hairDk','','','',''],

        // Row 3-5: 头发上部 + 额头
        ['','hairDk','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hairDk','hairDk','','',''],
        ['','hairDk','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hairDk','outline','','',''],
        ['','outline','hairDk','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hairDk','hairDk','outline','','','',''],

        // Row 6-7: 额头 + 眉毛区域
        ['','outline','hairDk','hairDk','hair','hair','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','hair','hair','hairDk','hairDk','outline','','','',''],
        ['','outline','hairDk','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','outline','','','','',''],

        // Row 8-9: 浮肿眼皮
        ['','outline','skinSh','skin','skin','skin','lid','lid','lid','lid','lid','lid','lid','lid','lid','lid','lid','lid','lid','lid','lid','lid','skin','skin','skinSh','skinSh','outline','','','','',''],
        ['outline','outline','skinSh','skin','skin','lidSh','lidSh','lidSh','lid','lid','lid','lid','lid','lid','lid','lid','lid','lid','lid','lid','lid','lid','lid','skin','skinSh','outline','outline','','','','',''],

        // Row 10-11: 大眼睛（深棕瞳孔 - 精明感）
        ['outline','skinSh','skin','skin','eyeB','eyeB','eyeB','eyeW','eyeW','eyeW','eyeW','eyeI','eyeI','eyeI','eyeI','eyeW','eyeW','eyeW','eyeW','eyeW','eyeB','eyeB','eyeB','skin','skin','skinSh','outline','','','','',''],
        ['outline','skinSh','skin','eyeB','eyeB','eyeB','eyeW','eyeW','eyeW','eyeI','eyeI','eyeI','eyeI','eyeI','eyeI','eyeI','eyeI','eyeW','eyeW','eyeW','eyeB','eyeB','eyeB','skin','skinSh','outline','','','','','',''],

        // Row 12-13: 眼睛下部
        ['outline','skinSh','skin','skin','eyeB','eyeB','eyeW','eyeW','eyeW','eyeI','eyeI','eyeI','eyeI','eyeI','eyeI','eyeI','eyeW','eyeW','eyeW','eyeB','eyeB','eyeB','skin','skin','skin','skinSh','outline','','','','',''],
        ['','outline','skinSh','skin','eyeB','eyeB','eyeB','eyeB','eyeB','eyeB','eyeB','eyeB','eyeB','eyeB','eyeB','eyeB','eyeB','eyeB','eyeB','eyeB','eyeB','skin','skin','skin','skinSh','outline','','','','','',''],

        // Row 14-15: 鼻子 + 嘴巴 + 腮红
        ['','outline','skinSh','blush','blush','blush','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','blush','blush','blush','skin','skinSh','outline','','','','','','','',''],
        ['','outline','skinSh','blush','blush','skin','skin','skin','skin','nose','nose','nose','skin','skin','skin','skin','skin','skin','skin','blush','blush','skin','skinSh','outline','','','','','','','',''],

        // Row 16-17: 下巴 + 脖子 + 领口（领带）
        ['','outline','outline','skinSh','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','mouth','mouth','skin','skin','skin','skin','skin','skin','skin','skinSh','outline','outline','','','','','',''],
        ['','','outline','outline','skinSh','skinSh','skin','skin','skin','tie','tie','tie','tie','tie','tie','tie','tie','tie','tie','tie','skinSh','skinSh','skinSh','outline','outline','','','','','','',''],

        // Row 18-19: 商人西装上部（马甲 + 领带）
        ['','','','outline','outline','outline','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','outline','outline','outline','','','','','',''],
        ['','briefcase','outline','coatLn','coat','coat','vest','vest','vest','coat','coat','tie','tie','tie','tie','tie','coat','coat','vest','vest','vest','coat','coat','coat','coatLn','outline','briefcase','','','','',''],

        // Row 20-23: 商人西装主体（公文包元素）
        ['outline','briefcase','coatLn','coat','coat','coat','coat','coat','coat','coat','coat','tie','tie','tie','tie','tie','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coatLn','outline','','','',''],
        ['outline','coatLn','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coatLn','outline','','','',''],
        ['outline','coatLn','coat','coat','coin','coin','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coin','coin','coat','coat','coatLn','outline','','','',''],
        ['outline','coatLn','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coatLn','outline','','','',''],

        // Row 24-25: 外套下部 + 手臂
        ['outline','coatLn','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coatLn','outline','','','',''],
        ['','outline','coatLn','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coatLn','outline','','','',''],

        // Row 26-27: 外套下摆
        ['','outline','coatLn','coatLn','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coatLn','coatLn','outline','','','','',''],
        ['','','outline','outline','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','outline','outline','','','','','','','','',''],

        // Row 28-29: 腿/裤子
        ['','','','outline','outline','coatDk','coatDk','coatDk','coatDk','coatDk','coatDk','coatDk','coatDk','coatDk','coatDk','coatDk','coatDk','coatDk','coatDk','coatDk','coatDk','coatDk','coatDk','outline','outline','','','','','','',''],
        ['','','','','outline','outline','coatDk','coatDk','coatDk','coatDk','coatDk','coatDk','coatDk','coatDk','coatDk','coatDk','coatDk','coatDk','coatDk','coatDk','coatDk','outline','outline','','','','','','','','',''],

        // Row 30-31: 鞋子
        ['','','','','','','outline','outline','shoe','shoe','shoe','shoe','shoe','shoe','shoe','shoe','shoe','shoe','shoe','shoe','outline','outline','','','','','','','','','',''],
        ['','','','','','','','','outline','outline','outline','shoe','shoe','shoe','shoe','shoe','shoe','outline','outline','outline','','','','','','','','','','','',''],
      ],
    } as PixelData,
  },
];
