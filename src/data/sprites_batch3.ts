import type { PixelData } from '@engine/PixelRenderer';

export const SPRITES_BATCH_3 = [
  // ============================================================
  // 11. DRUID 德鲁伊 — Shelter系列Cabin造型
  // 木屋/自然元素，藤蔓装饰，叶子头饰，温暖棕绿色调
  // ============================================================
  {
    id: 'druid',
    name: 'B-BABO德鲁伊',
    hironoSeries: 'Shelter - Cabin',
    palette: {
      // 基础HIRONO色
      hair:    '#6b7a4e',
      hairHi:  '#8a9a6a',
      hairDk:  '#4a5838',
      skin:    '#f0e4cc',
      skinSh:  '#dcc8a8',
      blush:   '#d4a088',
      nose:    '#c88878',
      eyeW:    '#f6f2ec',
      eyeI:    '#3a4a28',
      eyeB:    '#2a3418',
      lid:     '#e0d4b8',
      lidSh:   '#c4b498',
      mouth:   '#b89880',
      coat:    '#7a6a4a',
      coatHi:  '#96886a',
      coatDk:  '#5a4a34',
      coatLn:  '#3e3224',
      inner:   '#d8ccb0',
      shoe:    '#4a3a28',
      outline: '#2a2018',
      white:   '#ffffff',
      // 德鲁伊特有色
      vine:    '#5a8a48',
      leaf:    '#6aaa54',
      leafHi:  '#88c478',
      bark:    '#8a6a44',
    },
    sprite: {
      width: 32,
      height: 32,
      pixels: [
        // Row 0-2: 头顶 - 碎短发 + 叶子头饰
        ['','','','','','','leafHi','leaf','leaf','hairDk','hairDk','hair','hair','','','hair','hair','hairDk','hairDk','hair','hair','leaf','leaf','leafHi','','','','','','','',''],
        ['','','','','','hairDk','hair','hair','hair','hair','hair','hairHi','hairHi','hair','hair','hair','hair','hairHi','hairHi','hair','hair','hair','hair','hair','hairDk','hair','hair','','','','',''],
        ['','','','hairDk','hair','hair','hair','hair','hair','hair','hair','hairHi','hairHi','hair','hair','hair','hair','hair','hairHi','hairHi','hair','hair','hair','hair','hair','hair','hairDk','hairDk','','','',''],

        // Row 3-5: 头发上部 + 额头
        ['','hairDk','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hairDk','hairDk','','',''],
        ['','hairDk','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hairDk','outline','','',''],
        ['','outline','hairDk','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hairDk','hairDk','outline','','','',''],

        // Row 6-7: 额头 + 眉毛区域
        ['','outline','hairDk','hairDk','hair','hair','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','hair','hair','hairDk','hairDk','outline','','','',''],
        ['','outline','hairDk','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','outline','','','','',''],

        // Row 8-9: 浮肿眼皮（HIRONO标志）
        ['','outline','skinSh','skin','skin','skin','lid','lid','lid','lid','lid','lid','lid','lid','lid','lid','lid','lid','lid','lid','lid','lid','skin','skin','skinSh','skinSh','outline','','','','',''],
        ['outline','outline','skinSh','skin','skin','lidSh','lidSh','lidSh','lid','lid','lid','lid','lid','lid','lid','lid','lid','lid','lid','lid','lid','lid','lid','skin','skinSh','outline','outline','','','','',''],

        // Row 10-11: 大眼睛
        ['outline','skinSh','skin','skin','eyeB','eyeB','eyeB','eyeW','eyeW','eyeW','eyeW','eyeI','eyeI','eyeI','eyeI','eyeW','eyeW','eyeW','eyeW','eyeW','eyeB','eyeB','eyeB','skin','skin','skinSh','outline','','','','',''],
        ['outline','skinSh','skin','eyeB','eyeB','eyeB','eyeW','eyeW','eyeW','eyeI','eyeI','eyeI','eyeI','eyeI','eyeI','eyeI','eyeI','eyeW','eyeW','eyeW','eyeB','eyeB','eyeB','skin','skinSh','outline','','','','','',''],

        // Row 12-13: 眼睛下部
        ['outline','skinSh','skin','skin','eyeB','eyeB','eyeW','eyeW','eyeW','eyeI','eyeI','eyeI','eyeI','eyeI','eyeI','eyeI','eyeW','eyeW','eyeW','eyeB','eyeB','eyeB','skin','skin','skin','skinSh','outline','','','','',''],
        ['','outline','skinSh','skin','eyeB','eyeB','eyeB','eyeB','eyeB','eyeB','eyeB','eyeB','eyeB','eyeB','eyeB','eyeB','eyeB','eyeB','eyeB','eyeB','eyeB','skin','skin','skin','skinSh','outline','','','','','',''],

        // Row 14-15: 鼻子 + 嘴巴 + 腮红
        ['','outline','skinSh','blush','blush','blush','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','blush','blush','blush','skin','skinSh','outline','','','','','','','',''],
        ['','outline','skinSh','blush','blush','skin','skin','skin','skin','nose','nose','nose','skin','skin','skin','skin','skin','skin','skin','blush','blush','skin','skinSh','outline','','','','','','','',''],

        // Row 16-17: 下巴 + 脖子 + 藤蔓领口
        ['','outline','outline','skinSh','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','mouth','mouth','skin','skin','skin','skin','skin','skin','skin','skinSh','outline','outline','','','','','',''],
        ['','','outline','outline','skinSh','skinSh','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skinSh','skinSh','skinSh','outline','outline','','','','','','','',''],

        // Row 18-19: 宽松外套上部 + 藤蔓装饰
        ['','','','outline','outline','outline','vine','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','vine','outline','outline','outline','','','','','',''],
        ['','','outline','coatLn','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coatLn','outline','outline','','','','',''],

        // Row 20-23: 外套主体（宽松感）+ 树皮纹理
        ['','outline','coatLn','coat','coat','bark','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','bark','coat','coat','coat','coatLn','outline','','','','',''],
        ['','outline','coatLn','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coatLn','outline','','','','',''],
        ['outline','coatLn','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coatLn','outline','','',''],
        ['outline','coatLn','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coatLn','outline','','',''],

        // Row 24-25: 外套下部 + 叶子装饰
        ['outline','coatLn','coat','coat','coat','coat','coat','coat','leaf','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','leaf','coat','coat','coat','coat','coat','coatLn','outline','','','','',''],
        ['','outline','coatLn','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coatLn','outline','','','','',''],

        // Row 26-27: 外套下摆 + 藤蔓
        ['','outline','coatLn','coatLn','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coatLn','coatLn','outline','','','','',''],
        ['','','outline','outline','coatLn','vine','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','vine','coatLn','outline','outline','','','','','','','',''],

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
  // 12. MECH 机甲 — Little Mischief系列Robot造型
  // 机器人头盔，机械关节，天线，金属灰蓝色调
  // ============================================================
  {
    id: 'mech',
    name: 'B-BABO机甲',
    hironoSeries: 'Little Mischief - Robot',
    palette: {
      // 基础HIRONO色
      hair:    '#7a8a9a',
      hairHi:  '#9aaab8',
      hairDk:  '#4a5a68',
      skin:    '#e8e4ec',
      skinSh:  '#d0c8d8',
      blush:   '#c088c8',
      nose:    '#a878b8',
      eyeW:    '#f4f2f8',
      eyeI:    '#3a4a6e',
      eyeB:    '#2a3450',
      lid:     '#d0c8dc',
      lidSh:   '#b0a4c0',
      mouth:   '#9888a8',
      coat:    '#6a7a8a',
      coatHi:  '#8a9aa8',
      coatDk:  '#4a5a68',
      coatLn:  '#3a4858',
      inner:   '#c8d0dc',
      shoe:    '#3a4a58',
      outline: '#1e2a38',
      white:   '#ffffff',
      // 机甲特有色
      metal:   '#8a9aaa',
      metalHi: '#a8baca',
      metalDk: '#5a6a7a',
      antenna: '#c8a040',
      bolt:    '#d0c050',
    },
    sprite: {
      width: 32,
      height: 32,
      pixels: [
        // Row 0-2: 头顶 - 头盔 + 天线
        ['','','','','','antenna','antenna','','','','metalDk','metalDk','metal','metal','','','metal','metal','metalDk','metalDk','metal','metal','','','','','','','','','',''],
        ['','','','','','','','metalDk','metal','metal','metal','metal','metalHi','metalHi','metal','metal','metal','metal','metalHi','metalHi','metal','metal','metal','metal','metalDk','metal','metal','','','','',''],
        ['','','','metalDk','metal','metal','metal','metal','metal','metal','metal','metalHi','metalHi','metal','metal','metal','metal','metal','metalHi','metalHi','metal','metal','metal','metal','metal','metal','metalDk','metalDk','','','',''],

        // Row 3-5: 头盔上部 + 额头面板
        ['','metalDk','metal','metal','metal','metal','metal','metal','metal','metal','metal','metal','metal','metal','metal','metal','metal','metal','metal','metal','metal','metal','metal','metal','metal','metal','metal','metalDk','metalDk','','',''],
        ['','metalDk','metal','metal','metal','metal','metal','metal','metal','metal','metal','metal','metal','metal','metal','metal','metal','metal','metal','metal','metal','metal','metal','metal','metal','metal','metal','metalDk','outline','','',''],
        ['','outline','metalDk','metal','metal','metal','metal','metal','metal','metal','metal','metal','metal','metal','metal','metal','metal','metal','metal','metal','metal','metal','metal','metal','metal','metalDk','metalDk','outline','','','',''],

        // Row 6-7: 额头 + 螺栓装饰
        ['','outline','metalDk','metalDk','metal','metal','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','metal','metal','metalDk','metalDk','outline','','','',''],
        ['','outline','metalDk','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','outline','','','','',''],

        // Row 8-9: 浮肿眼皮
        ['','outline','skinSh','skin','skin','skin','lid','lid','lid','lid','lid','lid','lid','lid','lid','lid','lid','lid','lid','lid','lid','lid','skin','skin','skinSh','skinSh','outline','','','','',''],
        ['outline','outline','skinSh','skin','skin','lidSh','lidSh','lidSh','lid','lid','lid','lid','lid','lid','lid','lid','lid','lid','lid','lid','lid','lid','lid','skin','skinSh','outline','outline','','','','',''],

        // Row 10-11: 大眼睛
        ['outline','skinSh','skin','skin','eyeB','eyeB','eyeB','eyeW','eyeW','eyeW','eyeW','eyeI','eyeI','eyeI','eyeI','eyeW','eyeW','eyeW','eyeW','eyeW','eyeB','eyeB','eyeB','skin','skin','skinSh','outline','','','','',''],
        ['outline','skinSh','skin','eyeB','eyeB','eyeB','eyeW','eyeW','eyeW','eyeI','eyeI','eyeI','eyeI','eyeI','eyeI','eyeI','eyeI','eyeW','eyeW','eyeW','eyeB','eyeB','eyeB','skin','skinSh','outline','','','','','',''],

        // Row 12-13: 眼睛下部
        ['outline','skinSh','skin','skin','eyeB','eyeB','eyeW','eyeW','eyeW','eyeI','eyeI','eyeI','eyeI','eyeI','eyeI','eyeI','eyeW','eyeW','eyeW','eyeB','eyeB','eyeB','skin','skin','skin','skinSh','outline','','','','',''],
        ['','outline','skinSh','skin','eyeB','eyeB','eyeB','eyeB','eyeB','eyeB','eyeB','eyeB','eyeB','eyeB','eyeB','eyeB','eyeB','eyeB','eyeB','eyeB','eyeB','skin','skin','skin','skinSh','outline','','','','','',''],

        // Row 14-15: 鼻子 + 嘴巴 + 腮红
        ['','outline','skinSh','blush','blush','blush','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','blush','blush','blush','skin','skinSh','outline','','','','','','','',''],
        ['','outline','skinSh','blush','blush','skin','skin','skin','skin','nose','nose','nose','skin','skin','skin','skin','skin','skin','skin','blush','blush','skin','skinSh','outline','','','','','','','',''],

        // Row 16-17: 下巴 + 脖子 + 机械领口
        ['','outline','outline','skinSh','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','mouth','mouth','skin','skin','skin','skin','skin','skin','skin','skinSh','outline','outline','','','','','',''],
        ['','','outline','outline','skinSh','skinSh','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skinSh','skinSh','skinSh','outline','outline','','','','','','','',''],

        // Row 18-19: 机械装甲上部
        ['','','','outline','outline','outline','metalDk','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','metalDk','outline','outline','outline','','','','',''],
        ['','','outline','coatLn','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coatLn','outline','outline','','','','',''],

        // Row 20-23: 机械装甲主体 + 螺栓
        ['','outline','coatLn','coat','coat','bolt','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','bolt','coat','coat','coat','coatLn','outline','','','','',''],
        ['','outline','coatLn','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coatLn','outline','','','','',''],
        ['outline','coatLn','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coatLn','outline','','',''],
        ['outline','coatLn','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coatLn','outline','','',''],

        // Row 24-25: 装甲下部 + 机械关节
        ['outline','coatLn','coat','coat','coat','coat','coat','coat','metalDk','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','metalDk','coat','coat','coat','coat','coat','coatLn','outline','','','','',''],
        ['','outline','coatLn','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coatLn','outline','','','','',''],

        // Row 26-27: 装甲下摆
        ['','outline','coatLn','coatLn','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coatLn','coatLn','outline','','','','',''],
        ['','','outline','outline','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','outline','outline','','','','','','','','',''],

        // Row 28-29: 腿/机械腿
        ['','','','outline','outline','coatDk','coatDk','coatDk','coatDk','coatDk','coatDk','coatDk','coatDk','coatDk','coatDk','coatDk','coatDk','coatDk','coatDk','coatDk','coatDk','coatDk','coatDk','outline','outline','','','','','','',''],
        ['','','','','outline','outline','coatDk','coatDk','coatDk','coatDk','coatDk','coatDk','coatDk','coatDk','coatDk','coatDk','coatDk','coatDk','coatDk','coatDk','coatDk','outline','outline','','','','','','','','',''],

        // Row 30-31: 机械靴
        ['','','','','','','outline','outline','shoe','shoe','shoe','shoe','shoe','shoe','shoe','shoe','shoe','shoe','shoe','shoe','outline','outline','','','','','','','','','',''],
        ['','','','','','','','','outline','outline','outline','shoe','shoe','shoe','shoe','shoe','shoe','outline','outline','outline','','','','','','','','','','','',''],
      ],
    } as PixelData,
  },

  // ============================================================
  // 13. BARD 吟游 — Echo系列Poem造型
  // 诗人气质，围巾/披风，手持乐器暗示，暖米色调
  // ============================================================
  {
    id: 'bard',
    name: 'B-BABO吟游',
    hironoSeries: 'Echo - Poem',
    palette: {
      // 基础HIRONO色
      hair:    '#8a7a5e',
      hairHi:  '#a89478',
      hairDk:  '#5e5240',
      skin:    '#f2e8d4',
      skinSh:  '#dcc8a8',
      blush:   '#d8a890',
      nose:    '#c89080',
      eyeW:    '#f8f4ee',
      eyeI:    '#4a3a28',
      eyeB:    '#3a2e1e',
      lid:     '#e4d8c0',
      lidSh:   '#c8b898',
      mouth:   '#c4a088',
      coat:    '#b8a080',
      coatHi:  '#d0b898',
      coatDk:  '#8a7460',
      coatLn:  '#6a5844',
      inner:   '#e8dcc8',
      shoe:    '#5a4a38',
      outline: '#2e2418',
      white:   '#ffffff',
      // 吟游特有色
      cloak:   '#8a7a6a',
      cloakHi: '#a89888',
      note:    '#c8a870',
      lute:    '#a08050',
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

        // Row 10-11: 大眼睛
        ['outline','skinSh','skin','skin','eyeB','eyeB','eyeB','eyeW','eyeW','eyeW','eyeW','eyeI','eyeI','eyeI','eyeI','eyeW','eyeW','eyeW','eyeW','eyeW','eyeB','eyeB','eyeB','skin','skin','skinSh','outline','','','','',''],
        ['outline','skinSh','skin','eyeB','eyeB','eyeB','eyeW','eyeW','eyeW','eyeI','eyeI','eyeI','eyeI','eyeI','eyeI','eyeI','eyeI','eyeW','eyeW','eyeW','eyeB','eyeB','eyeB','skin','skinSh','outline','','','','','',''],

        // Row 12-13: 眼睛下部
        ['outline','skinSh','skin','skin','eyeB','eyeB','eyeW','eyeW','eyeW','eyeI','eyeI','eyeI','eyeI','eyeI','eyeI','eyeI','eyeW','eyeW','eyeW','eyeB','eyeB','eyeB','skin','skin','skin','skinSh','outline','','','','',''],
        ['','outline','skinSh','skin','eyeB','eyeB','eyeB','eyeB','eyeB','eyeB','eyeB','eyeB','eyeB','eyeB','eyeB','eyeB','eyeB','eyeB','eyeB','eyeB','eyeB','skin','skin','skin','skinSh','outline','','','','','',''],

        // Row 14-15: 鼻子 + 嘴巴 + 腮红
        ['','outline','skinSh','blush','blush','blush','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','blush','blush','blush','skin','skinSh','outline','','','','','','','',''],
        ['','outline','skinSh','blush','blush','skin','skin','skin','skin','nose','nose','nose','skin','skin','skin','skin','skin','skin','skin','blush','blush','skin','skinSh','outline','','','','','','','',''],

        // Row 16-17: 下巴 + 脖子 + 围巾
        ['','outline','outline','skinSh','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','mouth','mouth','skin','skin','skin','skin','skin','skin','skin','skinSh','outline','outline','','','','','',''],
        ['','','outline','outline','skinSh','skinSh','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skinSh','skinSh','skinSh','outline','outline','','','','','','','',''],

        // Row 18-19: 披风上部 + 围巾
        ['','','','outline','outline','outline','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','outline','outline','outline','','','','','',''],
        ['cloak','','outline','coatLn','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coatLn','outline','outline','','','','',''],

        // Row 20-23: 披风主体 + 乐器暗示
        ['cloak','cloak','coatLn','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coatLn','outline','','','','',''],
        ['cloak','cloak','coatLn','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coatLn','outline','','','','',''],
        ['cloak','cloakHi','coatLn','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coatLn','outline','','','',''],
        ['cloak','cloak','coatLn','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coatLn','outline','','',''],

        // Row 24-25: 披风下部 + 音符装饰
        ['cloak','cloak','coatLn','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coatLn','outline','','','','',''],
        ['','cloak','coatLn','coat','coat','coat','coat','coat','coat','note','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coatLn','outline','','','','',''],

        // Row 26-27: 披风下摆
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
  // 14. WEREWOLF 狼人 — Monsters Carnival系列Killer Bunny造型
  // 恶兔长耳朵（竖起），野性表情，獠牙暗示，暗红棕色调
  // ============================================================
  {
    id: 'werewolf',
    name: 'B-BABO狼人',
    hironoSeries: 'Monsters Carnival - Killer Bunny',
    palette: {
      // 基础HIRONO色
      hair:    '#6a4a3a',
      hairHi:  '#8a6a5a',
      hairDk:  '#4a3028',
      skin:    '#f0dcc8',
      skinSh:  '#d8c0a8',
      blush:   '#d89888',
      nose:    '#c88070',
      eyeW:    '#f6f0ec',
      eyeI:    '#8a2020',
      eyeB:    '#3a1a18',
      lid:     '#dcc8b0',
      lidSh:   '#c0a890',
      mouth:   '#b87868',
      coat:    '#7a4a3a',
      coatHi:  '#9a6858',
      coatDk:  '#5a3428',
      coatLn:  '#3e2218',
      inner:   '#d8c0a8',
      shoe:    '#4a2a1e',
      outline: '#2a1410',
      white:   '#ffffff',
      // 狼人特有色
      ear:     '#8a5a48',
      earIn:   '#d8a098',
      fang:    '#f0ece8',
      claw:    '#c0b0a0',
    },
    sprite: {
      width: 32,
      height: 32,
      pixels: [
        // Row 0-2: 头顶 - 竖起的兔子耳朵
        ['','','','ear','ear','ear','','','','','','hairDk','hairDk','hair','hair','','','hair','hair','hairDk','hairDk','hair','hair','','','','ear','ear','ear','','',''],
        ['','','','ear','earIn','ear','','','','','','hair','hair','hair','hairHi','hairHi','hair','hair','hair','hairHi','hairHi','hair','hair','hair','hair','hairDk','hair','hair','','','',''],
        ['','','','ear','ear','ear','','','hairDk','hair','hair','hair','hair','hair','hairHi','hairHi','hair','hair','hair','hairHi','hairHi','hair','hair','hair','hair','hair','hairDk','hairDk','','','',''],

        // Row 3-5: 头发上部 + 额头
        ['','hairDk','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hairDk','hairDk','','',''],
        ['','hairDk','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hairDk','outline','','',''],
        ['','outline','hairDk','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hairDk','hairDk','outline','','','',''],

        // Row 6-7: 额头 + 眉毛区域（野性眉毛）
        ['','outline','hairDk','hairDk','hair','hair','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','hair','hair','hairDk','hairDk','outline','','','',''],
        ['','outline','hairDk','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','outline','','','','',''],

        // Row 8-9: 浮肿眼皮（略带野性）
        ['','outline','skinSh','skin','skin','skin','lid','lid','lid','lid','lid','lid','lid','lid','lid','lid','lid','lid','lid','lid','lid','lid','skin','skin','skinSh','skinSh','outline','','','','',''],
        ['outline','outline','skinSh','skin','skin','lidSh','lidSh','lidSh','lid','lid','lid','lid','lid','lid','lid','lid','lid','lid','lid','lid','lid','lid','lid','skin','skinSh','outline','outline','','','','',''],

        // Row 10-11: 大眼睛（红色瞳孔 - 野性）
        ['outline','skinSh','skin','skin','eyeB','eyeB','eyeB','eyeW','eyeW','eyeW','eyeW','eyeI','eyeI','eyeI','eyeI','eyeW','eyeW','eyeW','eyeW','eyeW','eyeB','eyeB','eyeB','skin','skin','skinSh','outline','','','','',''],
        ['outline','skinSh','skin','eyeB','eyeB','eyeB','eyeW','eyeW','eyeW','eyeI','eyeI','eyeI','eyeI','eyeI','eyeI','eyeI','eyeI','eyeW','eyeW','eyeW','eyeB','eyeB','eyeB','skin','skinSh','outline','','','','','',''],

        // Row 12-13: 眼睛下部
        ['outline','skinSh','skin','skin','eyeB','eyeB','eyeW','eyeW','eyeW','eyeI','eyeI','eyeI','eyeI','eyeI','eyeI','eyeI','eyeW','eyeW','eyeW','eyeB','eyeB','eyeB','skin','skin','skin','skinSh','outline','','','','',''],
        ['','outline','skinSh','skin','eyeB','eyeB','eyeB','eyeB','eyeB','eyeB','eyeB','eyeB','eyeB','eyeB','eyeB','eyeB','eyeB','eyeB','eyeB','eyeB','eyeB','skin','skin','skin','skinSh','outline','','','','','',''],

        // Row 14-15: 鼻子 + 嘴巴 + 獠牙 + 腮红
        ['','outline','skinSh','blush','blush','blush','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','blush','blush','blush','skin','skinSh','outline','','','','','','','',''],
        ['','outline','skinSh','blush','blush','skin','skin','skin','skin','nose','nose','nose','skin','skin','fang','fang','skin','skin','skin','blush','blush','skin','skinSh','outline','','','','','','','',''],

        // Row 16-17: 下巴 + 脖子 + 爪痕暗示
        ['','outline','outline','skinSh','skin','skin','skin','skin','skin','skin','skin','skin','fang','fang','mouth','mouth','fang','fang','skin','skin','skin','skin','skin','skinSh','outline','outline','','','','','',''],
        ['','','outline','outline','skinSh','skinSh','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skinSh','skinSh','skinSh','outline','outline','','','','','','','',''],

        // Row 18-19: 外套上部 + 毛皮边
        ['','','','outline','outline','outline','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','outline','outline','outline','','','','','',''],
        ['','','outline','coatLn','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coatLn','outline','outline','','','','',''],

        // Row 20-23: 外套主体 + 毛皮纹理
        ['','outline','coatLn','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coatLn','outline','','','','',''],
        ['','outline','coatLn','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coatLn','outline','','','','',''],
        ['outline','coatLn','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coatLn','outline','','',''],
        ['outline','coatLn','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coatLn','outline','','',''],

        // Row 24-25: 外套下部 + 爪子
        ['outline','coatLn','coat','coat','coat','coat','coat','coat','claw','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','claw','coat','coat','coat','coat','coat','coatLn','outline','','','','',''],
        ['','outline','coatLn','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coatLn','outline','','','','',''],

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
  // 15. GHOST 幽灵 — The Other One系列The Monster造型
  // 怪物装扮，暗黑哥特，破碎感，深紫黑色调
  // ============================================================
  {
    id: 'ghost',
    name: 'B-BABO幽灵',
    hironoSeries: 'The Other One - The Monster',
    palette: {
      // 基础HIRONO色
      hair:    '#3a2a4a',
      hairHi:  '#5a4a6a',
      hairDk:  '#2a1a38',
      skin:    '#e0d8e8',
      skinSh:  '#c8bcd8',
      blush:   '#a878b8',
      nose:    '#9868a8',
      eyeW:    '#f0ecf4',
      eyeI:    '#4a2a5a',
      eyeB:    '#2a1a38',
      lid:     '#d0c0dc',
      lidSh:   '#b0a0c0',
      mouth:   '#8868a0',
      coat:    '#4a3a5a',
      coatHi:  '#6a5a7a',
      coatDk:  '#2e2038',
      coatLn:  '#1e1428',
      inner:   '#c0b0d0',
      shoe:    '#2a1a38',
      outline: '#140e1e',
      white:   '#ffffff',
      // 幽灵特有色
      horn:    '#5a3a6a',
      hornDk:  '#3a2048',
      chain:   '#7a6a8a',
      darkMist:'#2a1a3a',
    },
    sprite: {
      width: 32,
      height: 32,
      pixels: [
        // Row 0-2: 头顶 - 碎发 + 暗角
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

        // Row 8-9: 浮肿眼皮（哥特暗沉）
        ['','outline','skinSh','skin','skin','skin','lid','lid','lid','lid','lid','lid','lid','lid','lid','lid','lid','lid','lid','lid','lid','lid','skin','skin','skinSh','skinSh','outline','','','','',''],
        ['outline','outline','skinSh','skin','skin','lidSh','lidSh','lidSh','lid','lid','lid','lid','lid','lid','lid','lid','lid','lid','lid','lid','lid','lid','lid','skin','skinSh','outline','outline','','','','',''],

        // Row 10-11: 大眼睛（深紫瞳孔）
        ['outline','skinSh','skin','skin','eyeB','eyeB','eyeB','eyeW','eyeW','eyeW','eyeW','eyeI','eyeI','eyeI','eyeI','eyeW','eyeW','eyeW','eyeW','eyeW','eyeB','eyeB','eyeB','skin','skin','skinSh','outline','','','','',''],
        ['outline','skinSh','skin','eyeB','eyeB','eyeB','eyeW','eyeW','eyeW','eyeI','eyeI','eyeI','eyeI','eyeI','eyeI','eyeI','eyeI','eyeW','eyeW','eyeW','eyeB','eyeB','eyeB','skin','skinSh','outline','','','','','',''],

        // Row 12-13: 眼睛下部
        ['outline','skinSh','skin','skin','eyeB','eyeB','eyeW','eyeW','eyeW','eyeI','eyeI','eyeI','eyeI','eyeI','eyeI','eyeI','eyeW','eyeW','eyeW','eyeB','eyeB','eyeB','skin','skin','skin','skinSh','outline','','','','',''],
        ['','outline','skinSh','skin','eyeB','eyeB','eyeB','eyeB','eyeB','eyeB','eyeB','eyeB','eyeB','eyeB','eyeB','eyeB','eyeB','eyeB','eyeB','eyeB','eyeB','skin','skin','skin','skinSh','outline','','','','','',''],

        // Row 14-15: 鼻子 + 嘴巴 + 腮红
        ['','outline','skinSh','blush','blush','blush','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','blush','blush','blush','skin','skinSh','outline','','','','','','','',''],
        ['','outline','skinSh','blush','blush','skin','skin','skin','skin','nose','nose','nose','skin','skin','skin','skin','skin','skin','skin','blush','blush','skin','skinSh','outline','','','','','','','',''],

        // Row 16-17: 下巴 + 脖子 + 链条暗示
        ['','outline','outline','skinSh','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','mouth','mouth','skin','skin','skin','skin','skin','skin','skin','skinSh','outline','outline','','','','','',''],
        ['','','outline','outline','skinSh','skinSh','skin','skin','skin','skin','chain','chain','chain','skin','skin','skin','skin','skin','skin','skinSh','skinSh','skinSh','outline','outline','','','','','','','',''],

        // Row 18-19: 哥特外套上部 + 暗角
        ['','','','outline','outline','outline','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','outline','outline','outline','','','','','',''],
        ['','','outline','coatLn','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coatLn','outline','outline','','','','',''],

        // Row 20-23: 哥特外套主体 + 暗雾纹理
        ['','outline','coatLn','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coatLn','outline','','','','',''],
        ['','outline','coatLn','coat','coat','coat','coat','coat','darkMist','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coatLn','outline','','','','',''],
        ['outline','coatLn','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coatLn','outline','','',''],
        ['outline','coatLn','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coatLn','outline','','',''],

        // Row 24-25: 外套下部 + 破碎边缘
        ['outline','coatLn','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coatLn','outline','','','','',''],
        ['','outline','coatLn','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coatLn','outline','','','','',''],

        // Row 26-27: 外套下摆 + 暗雾
        ['','outline','coatLn','coatLn','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coatLn','coatLn','outline','','','','',''],
        ['','','outline','outline','coatLn','darkMist','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','darkMist','coatLn','outline','outline','','','','','','','',''],

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
