import type { PixelData } from '@engine/PixelRenderer';

export const SPRITES_BATCH_4 = [
  // ============================================================
  // 16. star (星辰) — Echo系列 Daydreaming 造型
  //    站立入睡姿态暗示，星星装饰，梦幻感，深蓝金色调
  // ============================================================
  {
    id: 'star',
    name: 'B-BABO星辰',
    hironoSeries: 'Echo - Daydreaming',
    palette: {
      hair:     '#2a2d4e',
      hairHi:   '#3d4170',
      hairDk:   '#1a1c35',
      skin:     '#f0ddd0',
      skinSh:   '#d4bfb0',
      blush:    '#e8a0a0',
      nose:     '#d47070',
      eyeW:     '#e8e0f0',
      eyeI:     '#4a3a6a',
      eyeB:     '#2a2040',
      lid:      '#e0c8d8',
      lidSh:    '#c8a8b8',
      mouth:    '#c89090',
      coat:     '#1e2850',
      coatHi:   '#2a3668',
      coatDk:   '#141a38',
      coatLn:   '#0e1228',
      inner:    '#c8b888',
      shoe:     '#141a38',
      outline:  '#0a0c1a',
      white:    '#ffffff',
      star:     '#f0d860',
      starGlow: '#f8e8a0',
      dream:    '#3a4a8a',
      dreamHi:  '#6070b0',
    },
    sprite: {
      width: 32,
      height: 32,
      pixels: [
        // === Row 0-2: 头顶 - 凌乱碎短发 + 星星装饰 ===
        ['','','','','','','','hair','hair','hairDk','hairDk','hair','hair','','','hair','hair','hairDk','hairDk','hair','hair','','','','','','starGlow','star','starGlow','','',''],
        ['','','','','','hairDk','hair','hair','hair','hair','hair','hairHi','hairHi','hair','hair','hair','hair','hairHi','hairHi','hair','hair','hair','hair','hair','hairDk','hair','hair','','','','',''],
        ['','','','hairDk','hair','hair','hair','hair','hair','hair','hair','hairHi','hairHi','hair','hair','hair','hair','hair','hairHi','hairHi','hair','hair','hair','hair','hair','hair','hairDk','hairDk','','','',''],

        // === Row 3-5: 头发上部 + 额头 ===
        ['','hairDk','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hairDk','hairDk','','',''],
        ['','hairDk','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hairDk','outline','','',''],
        ['','outline','hairDk','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hairDk','hairDk','outline','','','',''],

        // === Row 6-7: 额头 + 眉毛区域 ===
        ['','outline','hairDk','hairDk','hair','hair','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','hair','hair','hairDk','hairDk','outline','','','',''],
        ['','outline','hairDk','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','outline','','','','',''],

        // === Row 8-9: 浮肿眼皮（半闭暗示入睡）===
        ['','outline','skinSh','skin','skin','skin','lid','lid','lid','lid','lid','lid','lid','lid','lid','lid','lid','lid','lid','lid','lid','lid','skin','skin','skinSh','skinSh','outline','','','','',''],
        ['outline','outline','skinSh','skin','skin','lidSh','lidSh','lidSh','lid','lid','lid','lid','lid','lid','lid','lid','lid','lid','lid','lid','lid','lid','lid','skin','skinSh','outline','outline','','','','',''],

        // === Row 10-11: 半闭大眼睛（入睡暗示）===
        ['outline','skinSh','skin','skin','eyeB','eyeB','eyeB','eyeW','eyeW','eyeI','eyeI','eyeI','eyeI','eyeW','eyeW','eyeW','eyeI','eyeI','eyeI','eyeI','eyeB','eyeB','skin','skin','skinSh','outline','','','','','',''],
        ['outline','skinSh','skin','eyeB','eyeB','eyeB','eyeW','eyeW','eyeI','eyeI','eyeI','eyeI','eyeW','eyeW','eyeW','eyeW','eyeI','eyeI','eyeI','eyeI','eyeB','eyeB','eyeB','skin','skinSh','outline','','','','','',''],

        // === Row 12-13: 眼睛下部 ===
        ['outline','skinSh','skin','skin','eyeB','eyeB','eyeW','eyeW','eyeI','eyeI','eyeI','eyeI','eyeI','eyeI','eyeI','eyeI','eyeI','eyeI','eyeI','eyeB','eyeB','eyeB','skin','skin','skinSh','outline','','','','','',''],
        ['','outline','skinSh','skin','eyeB','eyeB','eyeB','eyeB','eyeB','eyeB','eyeB','eyeB','eyeB','eyeB','eyeB','eyeB','eyeB','eyeB','eyeB','eyeB','eyeB','skin','skin','skin','skinSh','outline','','','','','',''],

        // === Row 14-15: 鼻子 + 嘴巴 + 腮红 ===
        ['','outline','skinSh','blush','blush','blush','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','blush','blush','blush','skin','skinSh','outline','','','','','','','',''],
        ['','outline','skinSh','blush','blush','skin','skin','skin','skin','nose','nose','nose','skin','skin','skin','skin','skin','skin','skin','blush','blush','skin','skinSh','outline','','','','','','','',''],

        // === Row 16-17: 下巴 + 脖子 + 领口（星星内衬）===
        ['','outline','outline','skinSh','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','mouth','mouth','skin','skin','skin','skin','skin','skin','skin','skinSh','outline','outline','','','','','',''],
        ['','','outline','outline','skinSh','skinSh','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skinSh','skinSh','skinSh','outline','outline','','','','','','','',''],

        // === Row 18-19: 宽松外套上部 + 星星装饰 ===
        ['','','','outline','outline','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','outline','outline','outline','','','','','',''],
        ['','star','','outline','coatLn','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coatLn','outline','outline','','','','',''],

        // === Row 20-23: 外套主体（宽松感）+ 梦幻星星点缀 ===
        ['','outline','coatLn','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coatLn','outline','','','',''],
        ['','outline','coatLn','coat','coat','coat','coat','coat','coat','coat','coat','coat','star','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coatLn','outline','','','','',''],
        ['outline','coatLn','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coatLn','outline','','',''],
        ['outline','coatLn','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coatLn','outline','','',''],

        // === Row 24-25: 外套下部 + 手臂 + 梦幻粒子 ===
        ['outline','coatLn','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coatLn','outline','','',''],
        ['','outline','coatLn','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coatLn','outline','','','',''],

        // === Row 26-27: 外套下摆 ===
        ['','outline','coatLn','coatLn','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coatLn','coatLn','outline','','','','',''],
        ['','','outline','outline','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','outline','outline','','','','','','','','',''],

        // === Row 28-29: 腿/裤子 ===
        ['','','','outline','outline','coatDk','coatDk','coatDk','coatDk','coatDk','coatDk','coatDk','coatDk','coatDk','coatDk','coatDk','coatDk','coatDk','coatDk','coatDk','coatDk','coatDk','coatDk','outline','outline','','','','','','',''],
        ['','','','','outline','outline','coatDk','coatDk','coatDk','coatDk','coatDk','coatDk','coatDk','coatDk','coatDk','coatDk','coatDk','coatDk','coatDk','coatDk','coatDk','outline','outline','','','','','','','','',''],

        // === Row 30-31: 鞋子 ===
        ['','','','','','','outline','outline','shoe','shoe','shoe','shoe','shoe','shoe','shoe','shoe','shoe','shoe','shoe','shoe','outline','outline','','','','','','','','','',''],
        ['','','','','','','','','outline','outline','outline','shoe','shoe','shoe','shoe','shoe','shoe','outline','outline','outline','','','','','','','','','','','',''],
      ],
    } as PixelData,
  },

  // ============================================================
  // 17. gambler (赌徒) — Little Mischief系列 Pretender 造型
  //    伪装服装+半边面具，多变感，扑克牌元素，紫绿色调
  // ============================================================
  {
    id: 'gambler',
    name: 'B-BABO赌徒',
    hironoSeries: 'Little Mischief - Pretender',
    palette: {
      hair:     '#3a2848',
      hairHi:   '#503868',
      hairDk:   '#281838',
      skin:     '#f0ddd0',
      skinSh:   '#d4bfb0',
      blush:    '#e8a0a0',
      nose:     '#d47070',
      eyeW:     '#e8e0f0',
      eyeI:     '#5a4a3a',
      eyeB:     '#2a2030',
      lid:      '#e0c8d8',
      lidSh:    '#c8a8b8',
      mouth:    '#c89090',
      coat:     '#2a3828',
      coatHi:   '#3a5038',
      coatDk:   '#1a2818',
      coatLn:   '#101a10',
      inner:    '#8838a0',
      shoe:     '#1a1818',
      outline:  '#0a080a',
      white:    '#ffffff',
      mask:     '#d8c898',
      card:     '#f0e8d8',
      cardBack: '#8030a0',
      chip:     '#e04040',
    },
    sprite: {
      width: 32,
      height: 32,
      pixels: [
        // === Row 0-2: 头顶 - 凌乱碎短发 ===
        ['','','','','','','','hair','hair','hairDk','hairDk','hair','hair','','','hair','hair','hairDk','hairDk','hair','hair','','','','','','','','','','',''],
        ['','','','','','hairDk','hair','hair','hair','hair','hair','hairHi','hairHi','hair','hair','hair','hair','hairHi','hairHi','hair','hair','hair','hair','hair','hairDk','hair','hair','','','','',''],
        ['','','','hairDk','hair','hair','hair','hair','hair','hair','hair','hairHi','hairHi','hair','hair','hair','hair','hair','hairHi','hairHi','hair','hair','hair','hair','hair','hair','hairDk','hairDk','','','',''],

        // === Row 3-5: 头发上部 + 额头 ===
        ['','hairDk','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hairDk','hairDk','','',''],
        ['','hairDk','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hairDk','outline','','',''],
        ['','outline','hairDk','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hairDk','hairDk','outline','','','',''],

        // === Row 6-7: 额头 + 眉毛区域（右半面具边缘）===
        ['','outline','hairDk','hairDk','hair','hair','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','mask','mask','mask','hairDk','hairDk','outline','','','','',''],
        ['','outline','hairDk','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','mask','mask','mask','mask','mask','mask','outline','','','','',''],

        // === Row 8-9: 浮肿眼皮（左眼正常，右眼面具覆盖）===
        ['','outline','skinSh','skin','skin','skin','lid','lid','lid','lid','lid','lid','lid','lid','lid','lid','lid','lid','lid','lid','lid','mask','mask','mask','mask','mask','outline','','','','',''],
        ['outline','outline','skinSh','skin','skin','lidSh','lidSh','lidSh','lid','lid','lid','lid','lid','lid','lid','lid','lid','lid','lid','lid','lid','lid','mask','mask','mask','mask','outline','outline','','','',''],

        // === Row 10-11: 大眼睛（左眼可见，右眼面具）===
        ['outline','skinSh','skin','skin','eyeB','eyeB','eyeB','eyeW','eyeW','eyeW','eyeW','eyeI','eyeI','eyeI','eyeI','eyeW','eyeW','eyeW','eyeW','eyeW','eyeB','eyeB','eyeB','mask','mask','mask','mask','outline','','','',''],
        ['outline','skinSh','skin','eyeB','eyeB','eyeB','eyeW','eyeW','eyeW','eyeI','eyeI','eyeI','eyeI','eyeI','eyeI','eyeI','eyeI','eyeW','eyeW','eyeW','eyeB','eyeB','eyeB','mask','mask','mask','mask','outline','','','',''],

        // === Row 12-13: 眼睛下部 ===
        ['outline','skinSh','skin','skin','eyeB','eyeB','eyeW','eyeW','eyeW','eyeI','eyeI','eyeI','eyeI','eyeI','eyeI','eyeI','eyeW','eyeW','eyeW','eyeB','eyeB','eyeB','mask','mask','mask','mask','mask','outline','','','',''],
        ['','outline','skinSh','skin','eyeB','eyeB','eyeB','eyeB','eyeB','eyeB','eyeB','eyeB','eyeB','eyeB','eyeB','eyeB','eyeB','eyeB','eyeB','eyeB','eyeB','mask','mask','mask','mask','mask','mask','outline','','','',''],

        // === Row 14-15: 鼻子 + 嘴巴 + 腮红 ===
        ['','outline','skinSh','blush','blush','blush','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','blush','blush','blush','skin','skinSh','mask','mask','mask','outline','','','','',''],
        ['','outline','skinSh','blush','blush','skin','skin','skin','skin','nose','nose','nose','skin','skin','skin','skin','skin','skin','skin','blush','blush','skin','skinSh','mask','mask','mask','outline','','','','',''],

        // === Row 16-17: 下巴 + 脖子 + 领口 ===
        ['','outline','outline','skinSh','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','mouth','mouth','skin','skin','skin','skin','skin','skin','skin','skinSh','mask','mask','outline','outline','','','',''],
        ['','','outline','outline','skinSh','skinSh','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skinSh','skinSh','skinSh','outline','outline','outline','','','','','','',''],

        // === Row 18-19: 宽松外套上部 + 扑克牌装饰 ===
        ['','','','outline','outline','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','outline','outline','outline','','','','','',''],
        ['','card','','outline','coatLn','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coatLn','outline','outline','','','','',''],

        // === Row 20-23: 外套主体 + 筹码装饰 ===
        ['','outline','coatLn','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coatLn','outline','','','',''],
        ['','outline','coatLn','coat','coat','coat','coat','coat','coat','coat','coat','coat','chip','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coatLn','outline','','','','',''],
        ['outline','coatLn','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coatLn','outline','','',''],
        ['outline','coatLn','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coatLn','outline','','',''],

        // === Row 24-25: 外套下部 + 手臂 ===
        ['outline','coatLn','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coatLn','outline','','',''],
        ['','outline','coatLn','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coatLn','outline','','','',''],

        // === Row 26-27: 外套下摆 ===
        ['','outline','coatLn','coatLn','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coatLn','coatLn','outline','','','','',''],
        ['','','outline','outline','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','outline','outline','','','','','','','','',''],

        // === Row 28-29: 腿/裤子 ===
        ['','','','outline','outline','coatDk','coatDk','coatDk','coatDk','coatDk','coatDk','coatDk','coatDk','coatDk','coatDk','coatDk','coatDk','coatDk','coatDk','coatDk','coatDk','coatDk','coatDk','outline','outline','','','','','','',''],
        ['','','','','outline','outline','coatDk','coatDk','coatDk','coatDk','coatDk','coatDk','coatDk','coatDk','coatDk','coatDk','coatDk','coatDk','coatDk','coatDk','coatDk','outline','outline','','','','','','','','',''],

        // === Row 30-31: 鞋子 ===
        ['','','','','','','outline','outline','shoe','shoe','shoe','shoe','shoe','shoe','shoe','shoe','shoe','shoe','shoe','shoe','outline','outline','','','','','','','','','',''],
        ['','','','','','','','','outline','outline','outline','shoe','shoe','shoe','shoe','shoe','shoe','outline','outline','outline','','','','','','','','','','','',''],
      ],
    } as PixelData,
  },

  // ============================================================
  // 18. shroom (毒菇) — Shelter系列 Stuffed Bear隐藏款造型（毒菇主题）
  //    蘑菇帽代替头发，孢子粒子，诡异可爱，紫粉色调
  // ============================================================
  {
    id: 'shroom',
    name: 'B-BABO毒菇',
    hironoSeries: 'Shelter - Stuffed Bear (Shroom Variant)',
    palette: {
      hair:     '#5a3868',
      hairHi:   '#784888',
      hairDk:   '#3a2048',
      skin:     '#f0ddd0',
      skinSh:   '#d4bfb0',
      blush:    '#e8a0a0',
      nose:     '#d47070',
      eyeW:     '#e8e0f0',
      eyeI:     '#4a3060',
      eyeB:     '#2a1838',
      lid:      '#e0c8d8',
      lidSh:    '#c8a8b8',
      mouth:    '#c89090',
      coat:     '#684878',
      coatHi:   '#806090',
      coatDk:   '#483058',
      coatLn:   '#301840',
      inner:    '#e8a0b8',
      shoe:     '#382040',
      outline:  '#1a0c20',
      white:    '#ffffff',
      mushroom: '#c850a0',
      mushroomHi:'#e070b8',
      mushroomDk:'#983880',
      spore:    '#f0d0f0',
    },
    sprite: {
      width: 32,
      height: 32,
      pixels: [
        // === Row 0-2: 蘑菇帽顶部 ===
        ['','','','','','','mushroomDk','mushroomDk','mushroom','mushroom','mushroom','mushroom','mushroom','mushroom','mushroom','mushroom','mushroom','mushroom','mushroom','mushroom','mushroom','mushroom','mushroomDk','mushroomDk','','','','','','','',''],
        ['','','','mushroomDk','mushroom','mushroom','mushroom','mushroom','mushroom','mushroom','mushroomHi','mushroomHi','mushroom','mushroom','mushroom','mushroom','mushroom','mushroomHi','mushroomHi','mushroom','mushroom','mushroom','mushroom','mushroom','mushroomDk','mushroomDk','','','','','',''],
        ['','','mushroomDk','mushroom','mushroom','mushroom','mushroom','mushroom','mushroom','mushroom','mushroom','mushroomHi','mushroomHi','mushroom','mushroom','mushroom','mushroom','mushroom','mushroomHi','mushroomHi','mushroom','mushroom','mushroom','mushroom','mushroom','mushroom','mushroomDk','mushroomDk','','','',''],

        // === Row 3-5: 蘑菇帽下部 + 孢子点 ===
        ['','mushroomDk','mushroom','mushroom','mushroom','mushroom','mushroom','mushroom','mushroom','mushroom','mushroom','mushroom','mushroom','mushroom','mushroom','mushroom','mushroom','mushroom','mushroom','mushroom','mushroom','mushroom','mushroom','mushroom','mushroom','mushroom','mushroomDk','mushroomDk','','','',''],
        ['','mushroomDk','mushroom','mushroom','mushroom','mushroom','mushroom','mushroom','mushroom','mushroom','mushroom','mushroom','mushroom','mushroom','mushroom','mushroom','mushroom','mushroom','mushroom','mushroom','mushroom','mushroom','mushroom','mushroom','mushroom','mushroom','mushroomDk','outline','','','',''],
        ['','outline','mushroomDk','mushroom','mushroom','mushroom','mushroom','mushroom','mushroom','mushroom','mushroom','mushroom','mushroom','mushroom','mushroom','mushroom','mushroom','mushroom','mushroom','mushroom','mushroom','mushroom','mushroom','mushroom','mushroomDk','mushroomDk','outline','','','','',''],

        // === Row 6-7: 蘑菇帽边缘 + 额头（孢子点出现）===
        ['','outline','mushroomDk','mushroomDk','mushroom','mushroom','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','mushroom','mushroom','mushroomDk','mushroomDk','outline','','','',''],
        ['','outline','mushroomDk','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','outline','','','','',''],

        // === Row 8-9: 浮肿眼皮 ===
        ['','outline','skinSh','skin','skin','skin','lid','lid','lid','lid','lid','lid','lid','lid','lid','lid','lid','lid','lid','lid','lid','lid','skin','skin','skinSh','skinSh','outline','','','','',''],
        ['outline','outline','skinSh','skin','skin','lidSh','lidSh','lidSh','lid','lid','lid','lid','lid','lid','lid','lid','lid','lid','lid','lid','lid','lid','lid','skin','skinSh','outline','outline','','','','',''],

        // === Row 10-11: 大眼睛 ===
        ['outline','skinSh','skin','skin','eyeB','eyeB','eyeB','eyeW','eyeW','eyeW','eyeW','eyeI','eyeI','eyeI','eyeI','eyeW','eyeW','eyeW','eyeW','eyeW','eyeB','eyeB','eyeB','skin','skin','skinSh','outline','','','','',''],
        ['outline','skinSh','skin','eyeB','eyeB','eyeB','eyeW','eyeW','eyeW','eyeI','eyeI','eyeI','eyeI','eyeI','eyeI','eyeI','eyeI','eyeW','eyeW','eyeW','eyeB','eyeB','eyeB','skin','skinSh','outline','','','','','',''],

        // === Row 12-13: 眼睛下部 ===
        ['outline','skinSh','skin','skin','eyeB','eyeB','eyeW','eyeW','eyeW','eyeI','eyeI','eyeI','eyeI','eyeI','eyeI','eyeI','eyeW','eyeW','eyeW','eyeB','eyeB','eyeB','skin','skin','skinSh','outline','','','','','',''],
        ['','outline','skinSh','skin','eyeB','eyeB','eyeB','eyeB','eyeB','eyeB','eyeB','eyeB','eyeB','eyeB','eyeB','eyeB','eyeB','eyeB','eyeB','eyeB','eyeB','skin','skin','skin','skinSh','outline','','','','','',''],

        // === Row 14-15: 鼻子 + 嘴巴 + 腮红 ===
        ['','outline','skinSh','blush','blush','blush','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','blush','blush','blush','skin','skinSh','outline','','','','','','','',''],
        ['','outline','skinSh','blush','blush','skin','skin','skin','skin','nose','nose','nose','skin','skin','skin','skin','skin','skin','skin','blush','blush','skin','skinSh','outline','','','','','','','',''],

        // === Row 16-17: 下巴 + 脖子 + 领口 ===
        ['','outline','outline','skinSh','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','mouth','mouth','skin','skin','skin','skin','skin','skin','skin','skinSh','outline','outline','','','','','',''],
        ['','','outline','outline','skinSh','skinSh','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skinSh','skinSh','skinSh','outline','outline','','','','','','','',''],

        // === Row 18-19: 宽松外套上部 + 孢子飘散 ===
        ['','','','outline','outline','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','outline','outline','outline','','spore','','','',''],
        ['','','outline','coatLn','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coatLn','outline','outline','','','','',''],

        // === Row 20-23: 外套主体 + 孢子粒子 ===
        ['','outline','coatLn','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coatLn','outline','','','',''],
        ['','outline','coatLn','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coatLn','outline','spore','','',''],
        ['outline','coatLn','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coatLn','outline','','',''],
        ['outline','coatLn','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coatLn','outline','','',''],

        // === Row 24-25: 外套下部 + 手臂 ===
        ['outline','coatLn','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coatLn','outline','','',''],
        ['','outline','coatLn','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coatLn','outline','','','',''],

        // === Row 26-27: 外套下摆 ===
        ['','outline','coatLn','coatLn','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coatLn','coatLn','outline','','','','',''],
        ['','','outline','outline','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','outline','outline','','','','','','','','',''],

        // === Row 28-29: 腿/裤子 ===
        ['','','','outline','outline','coatDk','coatDk','coatDk','coatDk','coatDk','coatDk','coatDk','coatDk','coatDk','coatDk','coatDk','coatDk','coatDk','coatDk','coatDk','coatDk','coatDk','coatDk','outline','outline','','','','','','',''],
        ['','','','','outline','outline','coatDk','coatDk','coatDk','coatDk','coatDk','coatDk','coatDk','coatDk','coatDk','coatDk','coatDk','coatDk','coatDk','coatDk','coatDk','outline','outline','','','','','','','','',''],

        // === Row 30-31: 鞋子 ===
        ['','','','','','','outline','outline','shoe','shoe','shoe','shoe','shoe','shoe','shoe','shoe','shoe','shoe','shoe','shoe','outline','outline','','','','','','','','','',''],
        ['','','','','','','','','outline','outline','outline','shoe','shoe','shoe','shoe','shoe','shoe','outline','outline','outline','','','','','','','','','','','',''],
      ],
    } as PixelData,
  },

  // ============================================================
  // 19. chrono (时空) — Shelter系列 Mantel Clock 造型
  //    钟表/齿轮元素，时间感，维多利亚风外套，金棕色调
  // ============================================================
  {
    id: 'chrono',
    name: 'B-BABO时空',
    hironoSeries: 'Shelter - Mantel Clock',
    palette: {
      hair:     '#4a3828',
      hairHi:   '#685040',
      hairDk:   '#302018',
      skin:     '#f0ddd0',
      skinSh:   '#d4bfb0',
      blush:    '#e8a0a0',
      nose:     '#d47070',
      eyeW:     '#e8e0d8',
      eyeI:     '#5a4030',
      eyeB:     '#2a1a10',
      lid:      '#e0c8d0',
      lidSh:    '#c8a8b0',
      mouth:    '#c89090',
      coat:     '#5a4030',
      coatHi:   '#786050',
      coatDk:   '#3a2818',
      coatLn:   '#201008',
      inner:    '#c8a848',
      shoe:     '#2a1810',
      outline:  '#100800',
      white:    '#ffffff',
      gear:     '#c8a040',
      gearHi:   '#e0c060',
      clock:    '#f0e8d0',
      clockFace:'#f8f0e0',
    },
    sprite: {
      width: 32,
      height: 32,
      pixels: [
        // === Row 0-2: 头顶 - 凌乱碎短发 ===
        ['','','','','','','','hair','hair','hairDk','hairDk','hair','hair','','','hair','hair','hairDk','hairDk','hair','hair','','','','','','','','','','',''],
        ['','','','','','hairDk','hair','hair','hair','hair','hair','hairHi','hairHi','hair','hair','hair','hair','hairHi','hairHi','hair','hair','hair','hair','hair','hairDk','hair','hair','','','','',''],
        ['','','','hairDk','hair','hair','hair','hair','hair','hair','hair','hairHi','hairHi','hair','hair','hair','hair','hair','hairHi','hairHi','hair','hair','hair','hair','hair','hair','hairDk','hairDk','','','',''],

        // === Row 3-5: 头发上部 + 额头 ===
        ['','hairDk','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hairDk','hairDk','','',''],
        ['','hairDk','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hairDk','outline','','',''],
        ['','outline','hairDk','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hairDk','hairDk','outline','','','',''],

        // === Row 6-7: 额头 + 眉毛区域 ===
        ['','outline','hairDk','hairDk','hair','hair','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','hair','hair','hairDk','hairDk','outline','','','',''],
        ['','outline','hairDk','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','outline','','','','',''],

        // === Row 8-9: 浮肿眼皮 ===
        ['','outline','skinSh','skin','skin','skin','lid','lid','lid','lid','lid','lid','lid','lid','lid','lid','lid','lid','lid','lid','lid','lid','skin','skin','skinSh','skinSh','outline','','','','',''],
        ['outline','outline','skinSh','skin','skin','lidSh','lidSh','lidSh','lid','lid','lid','lid','lid','lid','lid','lid','lid','lid','lid','lid','lid','lid','lid','skin','skinSh','outline','outline','','','','',''],

        // === Row 10-11: 大眼睛 ===
        ['outline','skinSh','skin','skin','eyeB','eyeB','eyeB','eyeW','eyeW','eyeW','eyeW','eyeI','eyeI','eyeI','eyeI','eyeW','eyeW','eyeW','eyeW','eyeW','eyeB','eyeB','eyeB','skin','skin','skinSh','outline','','','','',''],
        ['outline','skinSh','skin','eyeB','eyeB','eyeB','eyeW','eyeW','eyeW','eyeI','eyeI','eyeI','eyeI','eyeI','eyeI','eyeI','eyeI','eyeW','eyeW','eyeW','eyeB','eyeB','eyeB','skin','skinSh','outline','','','','','',''],

        // === Row 12-13: 眼睛下部 ===
        ['outline','skinSh','skin','skin','eyeB','eyeB','eyeW','eyeW','eyeW','eyeI','eyeI','eyeI','eyeI','eyeI','eyeI','eyeI','eyeW','eyeW','eyeW','eyeB','eyeB','eyeB','skin','skin','skinSh','outline','','','','','',''],
        ['','outline','skinSh','skin','eyeB','eyeB','eyeB','eyeB','eyeB','eyeB','eyeB','eyeB','eyeB','eyeB','eyeB','eyeB','eyeB','eyeB','eyeB','eyeB','eyeB','skin','skin','skin','skinSh','outline','','','','','',''],

        // === Row 14-15: 鼻子 + 嘴巴 + 腮红 ===
        ['','outline','skinSh','blush','blush','blush','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','blush','blush','blush','skin','skinSh','outline','','','','','','','',''],
        ['','outline','skinSh','blush','blush','skin','skin','skin','skin','nose','nose','nose','skin','skin','skin','skin','skin','skin','skin','blush','blush','skin','skinSh','outline','','','','','','','',''],

        // === Row 16-17: 下巴 + 脖子 + 领口（金色内衬）===
        ['','outline','outline','skinSh','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','mouth','mouth','skin','skin','skin','skin','skin','skin','skin','skinSh','outline','outline','','','','','',''],
        ['','','outline','outline','skinSh','skinSh','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skinSh','skinSh','skinSh','outline','outline','','','','','','','',''],

        // === Row 18-19: 维多利亚风外套上部 + 齿轮装饰 ===
        ['','','','outline','outline','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','outline','outline','outline','','','','','',''],
        ['','gear','','outline','coatLn','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coatLn','outline','outline','','','','',''],

        // === Row 20-23: 外套主体 + 钟表元素 ===
        ['','outline','coatLn','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coatLn','outline','','','',''],
        ['','outline','coatLn','coat','coat','coat','coat','coat','clock','clock','clockFace','clockFace','clockFace','clock','clock','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coatLn','outline','','','','',''],
        ['outline','coatLn','coat','coat','coat','coat','coat','coat','clock','clockFace','clockFace','gear','gear','clockFace','clock','clock','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coatLn','outline','','',''],
        ['outline','coatLn','coat','coat','coat','coat','coat','coat','clock','clock','clockFace','clockFace','clockFace','clock','clock','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coatLn','outline','','',''],

        // === Row 24-25: 外套下部 + 手臂 + 齿轮 ===
        ['outline','coatLn','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coatLn','outline','','',''],
        ['','outline','coatLn','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coatLn','outline','','','',''],

        // === Row 26-27: 外套下摆 ===
        ['','outline','coatLn','coatLn','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coatLn','coatLn','outline','','','','',''],
        ['','','outline','outline','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','outline','outline','','','','','','','','',''],

        // === Row 28-29: 腿/裤子 ===
        ['','','','outline','outline','coatDk','coatDk','coatDk','coatDk','coatDk','coatDk','coatDk','coatDk','coatDk','coatDk','coatDk','coatDk','coatDk','coatDk','coatDk','coatDk','coatDk','coatDk','outline','outline','','','','','','',''],
        ['','','','','outline','outline','coatDk','coatDk','coatDk','coatDk','coatDk','coatDk','coatDk','coatDk','coatDk','coatDk','coatDk','coatDk','coatDk','coatDk','coatDk','outline','outline','','','','','','','','',''],

        // === Row 30-31: 鞋子 ===
        ['','','','','','','outline','outline','shoe','shoe','shoe','shoe','shoe','shoe','shoe','shoe','shoe','shoe','shoe','shoe','outline','outline','','','','','','','','','',''],
        ['','','','','','','','','outline','outline','outline','shoe','shoe','shoe','shoe','shoe','shoe','outline','outline','outline','','','','','','','','','','','',''],
      ],
    } as PixelData,
  },

  // ============================================================
  // 20. dragon (龙裔) — Monsters Carnival系列 Vampire造型（龙裔主题）
  //    龙角代替吸血鬼獠牙，龙鳞纹理外套，翅膀暗示，暗红金色调
  // ============================================================
  {
    id: 'dragon',
    name: 'B-BABO龙裔',
    hironoSeries: 'Monsters Carnival - Vampire (Dragon Variant)',
    palette: {
      hair:     '#2a1820',
      hairHi:   '#402838',
      hairDk:   '#180c10',
      skin:     '#f0ddd0',
      skinSh:   '#d4bfb0',
      blush:    '#e8a0a0',
      nose:     '#d47070',
      eyeW:     '#e8d8d0',
      eyeI:     '#a03020',
      eyeB:     '#1a0808',
      lid:      '#e0c0c0',
      lidSh:    '#c8a0a0',
      mouth:    '#c89090',
      coat:     '#4a1828',
      coatHi:   '#682838',
      coatDk:   '#2a0c18',
      coatLn:   '#180410',
      inner:    '#c8a040',
      shoe:     '#1a0c10',
      outline:  '#0c0408',
      white:    '#ffffff',
      horn:     '#c8a040',
      hornHi:   '#e0c060',
      hornDk:   '#8a7030',
      scale:    '#6a2030',
      scaleHi:  '#883040',
      wing:     '#3a1020',
    },
    sprite: {
      width: 32,
      height: 32,
      pixels: [
        // === Row 0-2: 头顶 - 龙角 + 碎短发 ===
        ['','','','','','hornHi','hornHi','','','','','','','','','','','','','','','','','','','hornHi','hornHi','','','','',''],
        ['','','','hornHi','horn','horn','horn','','','hair','hair','hairDk','hairDk','hair','hair','','','hair','hair','hairDk','hairDk','hair','hair','','','horn','horn','hornHi','','','',''],
        ['','','horn','horn','hornDk','horn','','','','','hairDk','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hairDk','hairDk','','','','horn','horn',''],

        // === Row 3-5: 头发上部 + 额头 ===
        ['','hairDk','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hairDk','hairDk','','',''],
        ['','hairDk','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hairDk','outline','','',''],
        ['','outline','hairDk','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hairDk','hairDk','outline','','','',''],

        // === Row 6-7: 额头 + 眉毛区域 ===
        ['','outline','hairDk','hairDk','hair','hair','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','hair','hair','hairDk','hairDk','outline','','','',''],
        ['','outline','hairDk','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','outline','','','','',''],

        // === Row 8-9: 浮肿眼皮 ===
        ['','outline','skinSh','skin','skin','skin','lid','lid','lid','lid','lid','lid','lid','lid','lid','lid','lid','lid','lid','lid','lid','lid','skin','skin','skinSh','skinSh','outline','','','','',''],
        ['outline','outline','skinSh','skin','skin','lidSh','lidSh','lidSh','lid','lid','lid','lid','lid','lid','lid','lid','lid','lid','lid','lid','lid','lid','lid','skin','skinSh','outline','outline','','','','',''],

        // === Row 10-11: 大眼睛（红色龙瞳）===
        ['outline','skinSh','skin','skin','eyeB','eyeB','eyeB','eyeW','eyeW','eyeW','eyeW','eyeI','eyeI','eyeI','eyeI','eyeW','eyeW','eyeW','eyeW','eyeW','eyeB','eyeB','eyeB','skin','skin','skinSh','outline','','','','',''],
        ['outline','skinSh','skin','eyeB','eyeB','eyeB','eyeW','eyeW','eyeW','eyeI','eyeI','eyeI','eyeI','eyeI','eyeI','eyeI','eyeI','eyeW','eyeW','eyeW','eyeB','eyeB','eyeB','skin','skinSh','outline','','','','','',''],

        // === Row 12-13: 眼睛下部 ===
        ['outline','skinSh','skin','skin','eyeB','eyeB','eyeW','eyeW','eyeW','eyeI','eyeI','eyeI','eyeI','eyeI','eyeI','eyeI','eyeW','eyeW','eyeW','eyeB','eyeB','eyeB','skin','skin','skinSh','outline','','','','','',''],
        ['','outline','skinSh','skin','eyeB','eyeB','eyeB','eyeB','eyeB','eyeB','eyeB','eyeB','eyeB','eyeB','eyeB','eyeB','eyeB','eyeB','eyeB','eyeB','eyeB','skin','skin','skin','skinSh','outline','','','','','',''],

        // === Row 14-15: 鼻子 + 嘴巴 + 腮红 ===
        ['','outline','skinSh','blush','blush','blush','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','blush','blush','blush','skin','skinSh','outline','','','','','','','',''],
        ['','outline','skinSh','blush','blush','skin','skin','skin','skin','nose','nose','nose','skin','skin','skin','skin','skin','skin','skin','blush','blush','skin','skinSh','outline','','','','','','','',''],

        // === Row 16-17: 下巴 + 脖子 + 领口 ===
        ['','outline','outline','skinSh','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','mouth','mouth','skin','skin','skin','skin','skin','skin','skin','skinSh','outline','outline','','','','','',''],
        ['','','outline','outline','skinSh','skinSh','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skinSh','skinSh','skinSh','outline','outline','','','','','','','',''],

        // === Row 18-19: 龙鳞外套上部 + 翅膀暗示 ===
        ['','','','outline','outline','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','outline','outline','outline','','','','','',''],
        ['wing','wing','','outline','coatLn','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coatLn','outline','outline','','','','',''],

        // === Row 20-23: 外套主体（龙鳞纹理）===
        ['','outline','coatLn','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coatLn','outline','','','',''],
        ['','outline','coatLn','coat','coat','scale','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','scale','coat','coat','coat','coatLn','outline','','','',''],
        ['outline','coatLn','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coatLn','outline','','',''],
        ['outline','coatLn','coat','coat','coat','coat','coat','scale','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coatLn','outline','','',''],

        // === Row 24-25: 外套下部 + 手臂 + 翅膀 ===
        ['outline','coatLn','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coatLn','outline','','',''],
        ['wing','outline','coatLn','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coatLn','outline','','','',''],

        // === Row 26-27: 外套下摆 ===
        ['','outline','coatLn','coatLn','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coatLn','coatLn','outline','','','','',''],
        ['','','outline','outline','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','outline','outline','','','','','','','','',''],

        // === Row 28-29: 腿/裤子 ===
        ['','','','outline','outline','coatDk','coatDk','coatDk','coatDk','coatDk','coatDk','coatDk','coatDk','coatDk','coatDk','coatDk','coatDk','coatDk','coatDk','coatDk','coatDk','coatDk','coatDk','outline','outline','','','','','','',''],
        ['','','','','outline','outline','coatDk','coatDk','coatDk','coatDk','coatDk','coatDk','coatDk','coatDk','coatDk','coatDk','coatDk','coatDk','coatDk','coatDk','coatDk','outline','outline','','','','','','','','',''],

        // === Row 30-31: 鞋子 ===
        ['','','','','','','outline','outline','shoe','shoe','shoe','shoe','shoe','shoe','shoe','shoe','shoe','shoe','shoe','shoe','outline','outline','','','','','','','','','',''],
        ['','','','','','','','','outline','outline','outline','shoe','shoe','shoe','shoe','shoe','shoe','outline','outline','outline','','','','','','','','','','','',''],
      ],
    } as PixelData,
  },
];
