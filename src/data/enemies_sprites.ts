import type { PixelData } from '@engine/PixelRenderer';

export interface EnemySprite {
  readonly id: string;
  readonly name: string;
  readonly palette: Record<string, string>;
  readonly sprite: PixelData;
  readonly hitboxScale: number;
}

// Helper: pad/truncate row to exactly 16 elements
function r(...cols: string[]): string[] {
  const row = cols.slice(0, 16);
  while (row.length < 16) row.push('');
  return row;
}

export const ENEMY_SPRITES: EnemySprite[] = [
  // ============================================================
  // 1. rotting_rat — 腐烂鼠
  //    小型，灰棕色，尖嘴长尾
  // ============================================================
  {
    id: 'rotting_rat',
    name: '腐烂鼠',
    palette: {
      body: '#7a6a5a',
      bodyHi: '#9a8a7a',
      eye: '#ff3333',
      tail: '#5a4a3a',
      outline: '#2a1a0a',
    },
    sprite: {
      width: 16,
      height: 16,
      pixels: [
        r('','','','','','','','','','','','','tail','tail','',''),
        r('','','','','','','','','','','','tail','tail','tail',''),
        r('','','','','','','','','','','','tail','tail','',''),
        r('','','','','outline','outline','outline','outline','outline','outline','outline','outline','outline','tail','',''),
        r('','','','outline','body','body','body','body','body','body','body','body','outline','outline',''),
        r('','','outline','body','body','bodyHi','bodyHi','body','body','body','body','body','outline',''),
        r('','','outline','body','body','body','body','body','body','body','body','body','outline',''),
        r('','outline','body','body','body','body','body','body','body','body','body','body','outline',''),
        r('','outline','body','body','eye','body','body','body','eye','body','body','body','outline',''),
        r('','outline','body','body','body','body','body','body','body','body','body','body','outline',''),
        r('','','outline','body','body','body','body','body','body','body','body','outline','',''),
        r('','','','outline','outline','body','body','body','body','body','outline','outline','',''),
        r('','','','','outline','outline','body','body','body','outline','outline','','',''),
        r('','','','','','outline','outline','outline','outline','outline','','','',''),
        r('','','','','','','','','','','','','',''),
        r('','','','','','','','','','','','','',''),
      ],
    },
    hitboxScale: 0.8,
  },

  // ============================================================
  // 2. skeleton — 骷髅兵
  //    人形，白色骨架，持剑
  // ============================================================
  {
    id: 'skeleton',
    name: '骷髅兵',
    palette: {
      bone: '#e8e0d0',
      boneDk: '#b0a890',
      eye: '#ff4444',
      sword: '#888888',
      outline: '#3a3a3a',
    },
    sprite: {
      width: 16,
      height: 16,
      pixels: [
        r('','','','','','outline','outline','outline','outline','outline','','','','','',''),
        r('','','','outline','bone','bone','bone','bone','bone','bone','outline','','','',''),
        r('','','outline','bone','bone','bone','bone','bone','bone','bone','bone','outline','','',''),
        r('','','outline','bone','bone','eye','bone','bone','eye','bone','bone','outline','','',''),
        r('','','outline','bone','bone','bone','bone','bone','bone','bone','bone','outline','','',''),
        r('','','outline','boneDk','boneDk','bone','bone','bone','bone','boneDk','boneDk','outline','','',''),
        r('','','','','outline','bone','bone','bone','bone','outline','','','','sword',''),
        r('','','','outline','bone','bone','bone','bone','bone','bone','outline','','','sword',''),
        r('','','','outline','bone','bone','bone','bone','bone','bone','outline','','','sword',''),
        r('','outline','outline','bone','bone','bone','bone','bone','bone','bone','outline','outline','sword',''),
        r('','outline','bone','bone','bone','bone','bone','bone','bone','bone','bone','outline','sword',''),
        r('','outline','bone','bone','bone','bone','bone','bone','bone','bone','bone','outline','','',''),
        r('','','outline','bone','bone','','bone','bone','','bone','bone','outline','','',''),
        r('','','outline','boneDk','boneDk','','boneDk','boneDk','','boneDk','boneDk','outline','','',''),
        r('','','outline','outline','outline','','outline','outline','','outline','outline','outline','','',''),
        r('','','','','','','','','','','','','',''),
      ],
    },
    hitboxScale: 0.85,
  },

  // ============================================================
  // 3. night_bat — 暗夜蝙蝠
  //    小型，深紫，翅膀展开
  // ============================================================
  {
    id: 'night_bat',
    name: '暗夜蝙蝠',
    palette: {
      wing: '#4a2a5a',
      wingHi: '#6a4a7a',
      body: '#3a1a4a',
      eye: '#ff6666',
      outline: '#1a0a2a',
    },
    sprite: {
      width: 16,
      height: 16,
      pixels: [
        r('wingHi','','','','','','','','','','','','','','wingHi'),
        r('','wingHi','','','','','','','','','','','','','wingHi'),
        r('wing','wing','','','','','','','','','','','','wing','wing'),
        r('wing','wingHi','','','','','','','','','','','','wingHi','wing'),
        r('wingHi','wing','','','outline','outline','outline','outline','outline','','','','wing','wingHi'),
        r('wing','wingHi','','outline','body','body','body','body','body','outline','','','wingHi','wing'),
        r('wingHi','wing','outline','body','body','eye','body','eye','body','outline','','wing','wingHi'),
        r('wing','wingHi','outline','body','body','body','body','body','body','outline','','wingHi','wing'),
        r('wingHi','wing','outline','body','body','body','body','body','body','outline','','wing','wingHi'),
        r('wing','wingHi','','outline','body','body','body','body','outline','','','wingHi','wing'),
        r('wingHi','wing','','','outline','outline','outline','outline','outline','','','','wing','wingHi'),
        r('wing','wingHi','','','','outline','body','outline','','','','wingHi','wing'),
        r('wingHi','wing','','','','','outline','outline','','','','wing','wingHi'),
        r('wing','wingHi','','','','','','','','','','wingHi','wing'),
        r('wingHi','wing','','','','','','','','','','wing','wingHi'),
        r('','','','','','','','','','','','','',''),
      ],
    },
    hitboxScale: 0.85,
  },

  // ============================================================
  // 4. thorn_vine — 荆棘藤蔓
  //    固定，绿色，带刺
  // ============================================================
  {
    id: 'thorn_vine',
    name: '荆棘藤蔓',
    palette: {
      vine: '#3a6a2a',
      vineHi: '#5a8a4a',
      thorn: '#8a5a2a',
      flower: '#aa4a4a',
      outline: '#1a3a0a',
    },
    sprite: {
      width: 16,
      height: 16,
      pixels: [
        r('','','','','','','vineHi','vineHi','','','','','','',''),
        r('','','','','','vineHi','vine','vine','vineHi','','','','','',''),
        r('','','','','vineHi','vine','vine','vine','vine','vineHi','','','','',''),
        r('thorn','','','vineHi','vine','vine','vine','vine','vine','vine','vineHi','','','thorn',''),
        r('','thorn','','vine','vine','vine','vine','vine','vine','vine','vine','','thorn','',''),
        r('','','outline','vine','vine','vine','vine','vine','vine','vine','vine','outline','','',''),
        r('','thorn','outline','vine','vine','vineHi','vine','vineHi','vine','vine','vine','outline','thorn',''),
        r('outline','outline','vine','vine','vine','vine','vine','vine','vine','vine','vine','vine','outline','outline'),
        r('outline','vine','vine','vine','vine','vine','vine','vine','vine','vine','vine','vine','vine','outline'),
        r('outline','vine','vine','vine','vine','vine','vine','vine','vine','vine','vine','vine','vine','outline'),
        r('','outline','vine','vine','vine','vine','vine','vine','vine','vine','vine','vine','outline','',''),
        r('','thorn','outline','vine','vine','vine','vine','vine','vine','vine','vine','outline','thorn','',''),
        r('','','outline','vine','vine','vine','vine','vine','vine','vine','vine','outline','','',''),
        r('','','','outline','vine','vine','vine','vine','vine','vine','outline','','','',''),
        r('','','','','outline','outline','outline','outline','outline','outline','outline','','','','',''),
        r('','','','','','','','','','','','','',''),
      ],
    },
    hitboxScale: 0.9,
  },

  // ============================================================
  // 5. fire_slime — 火焰史莱姆
  //    圆形，橙红色，火焰效果
  // ============================================================
  {
    id: 'fire_slime',
    name: '火焰史莱姆',
    palette: {
      body: '#e86030',
      bodyHi: '#ff8844',
      flame: '#ffaa22',
      eye: '#1a1a1a',
      outline: '#8a2a0a',
    },
    sprite: {
      width: 16,
      height: 16,
      pixels: [
        r('','','','','','flame','flame','flame','flame','flame','','','','','',''),
        r('','','','flame','flame','flame','flame','flame','flame','flame','flame','','','',''),
        r('','','flame','flame','flame','flame','flame','flame','flame','flame','flame','flame','','',''),
        r('','flame','flame','flame','bodyHi','bodyHi','bodyHi','bodyHi','bodyHi','bodyHi','flame','flame','flame','',''),
        r('','flame','flame','bodyHi','bodyHi','bodyHi','bodyHi','bodyHi','bodyHi','bodyHi','bodyHi','flame','flame','',''),
        r('flame','flame','bodyHi','bodyHi','body','body','body','body','body','body','body','bodyHi','flame','flame',''),
        r('flame','bodyHi','bodyHi','body','body','body','body','body','body','body','body','body','bodyHi','flame',''),
        r('flame','bodyHi','body','body','body','eye','body','body','eye','body','body','body','body','flame',''),
        r('flame','bodyHi','body','body','body','body','body','body','body','body','body','body','body','flame',''),
        r('flame','bodyHi','body','body','body','body','body','body','body','body','body','body','body','flame',''),
        r('','flame','bodyHi','body','body','body','body','body','body','body','body','body','flame','',''),
        r('','flame','flame','body','body','body','body','body','body','body','body','flame','flame','',''),
        r('','','flame','flame','body','body','body','body','body','body','flame','flame','','',''),
        r('','','','flame','flame','flame','flame','flame','flame','flame','flame','','','',''),
        r('','','','','','flame','flame','flame','flame','flame','','','','','',''),
        r('','','','','','','','','','','','','',''),
      ],
    },
    hitboxScale: 0.85,
  },

  // ============================================================
  // 6. ice_slime — 冰霜史莱姆
  //    圆形，冰蓝色，冰晶效果
  // ============================================================
  {
    id: 'ice_slime',
    name: '冰霜史莱姆',
    palette: {
      body: '#60a0d0',
      bodyHi: '#88c8f0',
      crystal: '#ffffff',
      eye: '#1a2a4a',
      outline: '#2a4a6a',
    },
    sprite: {
      width: 16,
      height: 16,
      pixels: [
        r('','','','','crystal','crystal','','','','crystal','crystal','','','',''),
        r('','','','crystal','crystal','crystal','crystal','crystal','crystal','crystal','crystal','crystal','','',''),
        r('','','crystal','bodyHi','bodyHi','bodyHi','bodyHi','bodyHi','bodyHi','bodyHi','bodyHi','bodyHi','crystal','',''),
        r('','crystal','bodyHi','bodyHi','bodyHi','bodyHi','bodyHi','bodyHi','bodyHi','bodyHi','bodyHi','bodyHi','bodyHi','crystal',''),
        r('crystal','bodyHi','bodyHi','bodyHi','body','body','body','body','body','body','body','body','bodyHi','bodyHi','crystal'),
        r('crystal','bodyHi','bodyHi','body','body','body','body','body','body','body','body','body','body','bodyHi','crystal'),
        r('crystal','bodyHi','body','body','body','body','body','body','body','body','body','body','body','bodyHi','crystal'),
        r('crystal','bodyHi','body','body','body','eye','body','body','eye','body','body','body','body','bodyHi','crystal'),
        r('crystal','bodyHi','body','body','body','body','body','body','body','body','body','body','body','bodyHi','crystal'),
        r('crystal','bodyHi','body','body','body','body','body','body','body','body','body','body','body','bodyHi','crystal'),
        r('','crystal','bodyHi','body','body','body','body','body','body','body','body','body','bodyHi','crystal',''),
        r('','crystal','bodyHi','bodyHi','body','body','body','body','body','body','body','bodyHi','bodyHi','crystal',''),
        r('','','crystal','bodyHi','bodyHi','bodyHi','bodyHi','bodyHi','bodyHi','bodyHi','bodyHi','bodyHi','crystal','',''),
        r('','','','crystal','crystal','crystal','crystal','crystal','crystal','crystal','crystal','crystal','','',''),
        r('','','','','crystal','crystal','crystal','crystal','crystal','crystal','','','','',''),
        r('','','','','','','','','','','','','',''),
      ],
    },
    hitboxScale: 0.85,
  },

  // ============================================================
  // 7. lightning_wisp — 雷电精灵
  //    小型，黄色，电光效果
  // ============================================================
  {
    id: 'lightning_wisp',
    name: '雷电精灵',
    palette: {
      core: '#ffe040',
      glow: '#ffff88',
      spark: '#ffffff',
      eye: '#4a3a00',
      outline: '#6a5a00',
    },
    sprite: {
      width: 16,
      height: 16,
      pixels: [
        r('','','','','','','spark','','','','','','','',''),
        r('','','','','','spark','glow','spark','','','','','','',''),
        r('','','','','glow','glow','glow','glow','spark','','','','','',''),
        r('','','','spark','glow','glow','glow','glow','glow','spark','','','','',''),
        r('','','glow','glow','glow','core','core','core','glow','glow','glow','','','',''),
        r('','spark','glow','glow','core','core','core','core','core','glow','glow','spark','','',''),
        r('','glow','glow','core','core','core','eye','core','core','core','glow','glow','','',''),
        r('spark','glow','core','core','core','core','core','core','core','core','core','glow','spark','',''),
        r('spark','glow','core','core','core','core','core','core','core','core','core','glow','spark','',''),
        r('','glow','glow','core','core','core','core','core','core','core','glow','glow','','',''),
        r('','spark','glow','glow','core','core','core','core','core','glow','glow','spark','','',''),
        r('','','glow','glow','glow','core','core','core','glow','glow','glow','','','',''),
        r('','','','spark','glow','glow','glow','glow','glow','spark','','','','',''),
        r('','','','','spark','glow','glow','glow','spark','','','','','',''),
        r('','','','','','spark','spark','spark','','','','','','',''),
        r('','','','','','','','','','','','','',''),
      ],
    },
    hitboxScale: 0.8,
  },

  // ============================================================
  // 8. skeleton_archer — 骷髅弓手
  //    人形，白色骨架，持弓
  // ============================================================
  {
    id: 'skeleton_archer',
    name: '骷髅弓手',
    palette: {
      bone: '#e8e0d0',
      boneDk: '#b0a890',
      eye: '#ff4444',
      bow: '#6a4a2a',
      arrow: '#888888',
      outline: '#3a3a3a',
    },
    sprite: {
      width: 16,
      height: 16,
      pixels: [
        r('','','','','','outline','outline','outline','outline','outline','','','','','',''),
        r('','','','outline','bone','bone','bone','bone','bone','bone','outline','','','',''),
        r('','','outline','bone','bone','bone','bone','bone','bone','bone','bone','outline','','',''),
        r('','','outline','bone','bone','eye','bone','bone','eye','bone','bone','outline','','',''),
        r('','','outline','bone','bone','bone','bone','bone','bone','bone','bone','outline','','',''),
        r('','','outline','boneDk','boneDk','bone','bone','bone','bone','boneDk','boneDk','outline','','',''),
        r('','','','','outline','bone','bone','bone','bone','outline','','','','arrow',''),
        r('bow','','','outline','bone','bone','bone','bone','bone','bone','outline','','','arrow',''),
        r('bow','','outline','bone','bone','bone','bone','bone','bone','bone','bone','outline','arrow',''),
        r('bow','','outline','bone','bone','bone','bone','bone','bone','bone','bone','outline','','',''),
        r('bow','','outline','bone','bone','bone','bone','bone','bone','bone','bone','outline','','',''),
        r('','','outline','bone','bone','bone','bone','bone','bone','bone','bone','outline','','',''),
        r('','','outline','bone','bone','','bone','bone','','bone','bone','outline','','',''),
        r('','','outline','boneDk','boneDk','','boneDk','boneDk','','boneDk','boneDk','outline','','',''),
        r('','','outline','outline','outline','','outline','outline','','outline','outline','outline','','',''),
        r('','','','','','','','','','','','','',''),
      ],
    },
    hitboxScale: 0.85,
  },

  // ============================================================
  // 9. evil_eye — 邪眼
  //    悬浮，红色大眼，触须
  // ============================================================
  {
    id: 'evil_eye',
    name: '邪眼',
    palette: {
      eyeWhite: '#e8e0d0',
      iris: '#cc2222',
      pupil: '#1a0a0a',
      tentacle: '#6a2a2a',
      glow: '#ff4444',
      outline: '#3a0a0a',
    },
    sprite: {
      width: 16,
      height: 16,
      pixels: [
        r('','','','','','','','','','','','','','',''),
        r('','','','','','outline','outline','outline','outline','outline','','','','','',''),
        r('','','','outline','glow','glow','glow','glow','glow','glow','outline','','','',''),
        r('','tentacle','outline','glow','eyeWhite','eyeWhite','eyeWhite','eyeWhite','eyeWhite','eyeWhite','glow','outline','tentacle','',''),
        r('tentacle','outline','glow','eyeWhite','eyeWhite','eyeWhite','eyeWhite','eyeWhite','eyeWhite','eyeWhite','eyeWhite','glow','outline','tentacle'),
        r('','outline','glow','eyeWhite','eyeWhite','iris','iris','iris','iris','eyeWhite','eyeWhite','glow','outline','',''),
        r('','outline','glow','eyeWhite','iris','iris','pupil','pupil','iris','iris','eyeWhite','glow','outline','',''),
        r('','outline','glow','eyeWhite','eyeWhite','iris','iris','iris','iris','eyeWhite','eyeWhite','glow','outline','',''),
        r('tentacle','outline','glow','eyeWhite','eyeWhite','eyeWhite','eyeWhite','eyeWhite','eyeWhite','eyeWhite','eyeWhite','glow','outline','tentacle'),
        r('','tentacle','outline','glow','eyeWhite','eyeWhite','eyeWhite','eyeWhite','eyeWhite','eyeWhite','glow','outline','tentacle','',''),
        r('','','','outline','glow','glow','glow','glow','glow','glow','outline','','','',''),
        r('','','','tentacle','outline','outline','outline','outline','outline','outline','tentacle','','','',''),
        r('','','tentacle','','tentacle','','','','','tentacle','','tentacle','','',''),
        r('','','','','','','','','','','','','',''),
        r('','','','','','','','','','','','','',''),
        r('','','','','','','','','','','','','',''),
      ],
    },
    hitboxScale: 0.8,
  },

  // ============================================================
  // 10. death_knight — 死亡骑士
  //     大型人形，黑色盔甲，红色眼
  // ============================================================
  {
    id: 'death_knight',
    name: '死亡骑士',
    palette: {
      armor: '#2a2a3a',
      armorHi: '#4a4a5a',
      cape: '#4a0a0a',
      eye: '#ff2222',
      sword: '#888888',
      outline: '#0a0a1a',
    },
    sprite: {
      width: 16,
      height: 16,
      pixels: [
        r('','','','outline','outline','outline','outline','outline','outline','outline','outline','outline','outline','','',''),
        r('','','outline','armorHi','armorHi','armorHi','armorHi','armorHi','armorHi','armorHi','armorHi','armorHi','outline','',''),
        r('','cape','outline','armor','armor','armor','armor','armor','armor','armor','armor','armor','outline','cape',''),
        r('cape','cape','outline','armor','armor','eye','armor','armor','eye','armor','armor','armor','outline','cape','cape'),
        r('cape','cape','outline','armor','armor','armor','armor','armor','armor','armor','armor','armor','outline','cape','cape'),
        r('','cape','outline','armorHi','armorHi','armor','armor','armor','armor','armorHi','armorHi','outline','cape',''),
        r('','cape','outline','armor','armor','armor','armor','armor','armor','armor','armor','outline','cape','','sword'),
        r('','cape','outline','armor','armor','armor','armor','armor','armor','armor','armor','outline','cape','sword','sword'),
        r('','cape','outline','armor','armor','armor','armor','armor','armor','armor','armor','outline','cape','sword',''),
        r('','cape','outline','armorHi','armorHi','armorHi','armorHi','armorHi','armorHi','armorHi','outline','cape','',''),
        r('','cape','outline','armor','armor','armor','armor','armor','armor','armor','armor','outline','cape','',''),
        r('','cape','outline','armor','armor','armor','armor','armor','armor','armor','armor','outline','cape','',''),
        r('','','outline','armor','armor','','armor','armor','','armor','armor','outline','','',''),
        r('','','outline','armorHi','armorHi','','armorHi','armorHi','','armorHi','armorHi','outline','','',''),
        r('','','outline','outline','outline','','outline','outline','','outline','outline','outline','','',''),
        r('','','','','','','','','','','','','',''),
      ],
    },
    hitboxScale: 0.9,
  },

  // ============================================================
  // 11. vampire — 吸血鬼
  //     人形，深红色斗篷，苍白皮肤
  // ============================================================
  {
    id: 'vampire',
    name: '吸血鬼',
    palette: {
      cape: '#6a1a1a',
      skin: '#d8c8c0',
      eye: '#ff3333',
      fang: '#ffffff',
      hair: '#1a1a2a',
      outline: '#2a0a0a',
    },
    sprite: {
      width: 16,
      height: 16,
      pixels: [
        r('','','','','','outline','outline','outline','outline','outline','','','','','',''),
        r('','','','outline','hair','hair','hair','hair','hair','hair','outline','','','',''),
        r('','','outline','hair','hair','hair','hair','hair','hair','hair','hair','outline','','',''),
        r('','cape','outline','hair','hair','hair','hair','hair','hair','hair','hair','outline','cape','',''),
        r('cape','cape','outline','skin','skin','skin','skin','skin','skin','skin','skin','outline','cape','cape',''),
        r('','cape','outline','skin','skin','eye','skin','skin','eye','skin','skin','outline','cape','',''),
        r('','cape','outline','skin','skin','skin','skin','skin','skin','skin','skin','outline','cape','',''),
        r('','cape','outline','skin','skin','fang','skin','skin','fang','skin','skin','outline','cape','',''),
        r('','cape','outline','skin','skin','skin','skin','skin','skin','skin','skin','outline','cape','',''),
        r('','cape','outline','skin','skin','skin','skin','skin','skin','skin','skin','outline','cape','',''),
        r('','cape','outline','cape','cape','cape','cape','cape','cape','cape','cape','cape','outline','cape','',''),
        r('','cape','outline','cape','cape','cape','cape','cape','cape','cape','cape','cape','outline','cape','',''),
        r('','','outline','cape','cape','','cape','cape','','cape','cape','outline','','',''),
        r('','','outline','cape','cape','','cape','cape','','cape','cape','outline','','',''),
        r('','','outline','outline','outline','','outline','outline','','outline','outline','outline','','',''),
        r('','','','','','','','','','','','','',''),
      ],
    },
    hitboxScale: 0.85,
  },

  // ============================================================
  // 12. giant_zombie — 巨型僵尸
  //     大型，灰绿色，笨重
  // ============================================================
  {
    id: 'giant_zombie',
    name: '巨型僵尸',
    palette: {
      body: '#5a6a4a',
      bodyHi: '#7a8a6a',
      wound: '#8a3a2a',
      eye: '#ffaa00',
      outline: '#2a3a1a',
    },
    sprite: {
      width: 16,
      height: 16,
      pixels: [
        r('','outline','outline','outline','outline','outline','outline','outline','outline','outline','outline','outline','outline','outline','',''),
        r('outline','bodyHi','bodyHi','bodyHi','bodyHi','bodyHi','bodyHi','bodyHi','bodyHi','bodyHi','bodyHi','bodyHi','bodyHi','outline',''),
        r('outline','bodyHi','bodyHi','bodyHi','bodyHi','bodyHi','bodyHi','bodyHi','bodyHi','bodyHi','bodyHi','bodyHi','bodyHi','outline',''),
        r('outline','body','body','body','body','body','body','body','body','body','body','body','body','outline',''),
        r('outline','body','body','body','eye','body','body','body','eye','body','body','body','body','outline',''),
        r('outline','body','body','body','body','body','body','body','body','body','body','body','body','outline',''),
        r('outline','body','body','body','body','wound','wound','wound','body','body','body','body','body','outline',''),
        r('outline','body','body','body','body','body','body','body','body','body','body','body','body','outline',''),
        r('outline','bodyHi','body','body','body','body','body','body','body','body','body','body','bodyHi','outline',''),
        r('outline','bodyHi','body','body','body','body','body','body','body','body','body','body','bodyHi','outline',''),
        r('outline','bodyHi','body','body','body','body','body','body','body','body','body','body','bodyHi','outline',''),
        r('outline','body','body','body','body','body','body','body','body','body','body','body','body','outline',''),
        r('outline','body','body','body','body','wound','body','body','wound','body','body','body','body','outline',''),
        r('outline','body','body','body','body','body','body','body','body','body','body','body','body','outline',''),
        r('outline','outline','outline','outline','outline','outline','outline','outline','outline','outline','outline','outline','outline','outline',''),
        r('','','','','','','','','','','','','',''),
      ],
    },
    hitboxScale: 0.9,
  },
];
