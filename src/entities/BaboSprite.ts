/**
 * HIRONO 小野风格像素精灵
 *
 * 核心视觉特征（泡泡玛特 HIRONO by Lang）：
 * - 凌乱不规则碎短发
 * - 超大浮肿下垂眼皮（最标志性）
 * - 小红点鼻尖 + 粉红腮红
 * - 忧郁安静的表情
 * - 宽松超大外套
 * - 低饱和度柔和色调
 *
 * 调色板键说明：
 *   hair     - 头发主色
 *   hairHi   - 头发高光
 *   hairDk   - 头发暗部
 *   skin     - 皮肤主色
 *   skinSh   - 皮肤阴影
 *   blush    - 腮红
 *   nose     - 鼻尖红点
 *   eyeW     - 眼白
 *   eyeI     - 瞳孔/虹膜
 *   eyeB     - 眼线/轮廓
 *   lid      - 浮肿眼皮
 *   lidSh    - 眼皮阴影
 *   mouth    - 嘴巴
 *   coat     - 外套主色
 *   coatHi   - 外套高光
 *   coatDk   - 外套暗部
 *   coatLn   - 外套线条
 *   inner    - 内衬/领口
 *   shoe     - 鞋子
 *   outline  - 轮廓线
 *   white    - 纯白
 */
import type { PixelData } from '@engine/PixelRenderer';

export const HIRONO_BASE_SPRITE: PixelData = {
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
    ['','outline','hairDk','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hair','hairDk','hairDk','outline','','',''],

    // === Row 6-7: 额头 + 眉毛区域 ===
    ['','outline','hairDk','hairDk','hair','hair','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','hair','hair','hairDk','hairDk','outline','','',''],
    ['','outline','hairDk','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','outline','','',''],

    // === Row 8-9: 浮肿眼皮（HIRONO 标志性特征 - 加厚）===
    ['','outline','skinSh','skin','skin','skin','lid','lid','lid','lid','lid','lid','lid','lid','lid','lid','lid','lid','lid','lid','lid','lid','skin','skin','skinSh','skinSh','outline','','',''],
    ['outline','outline','skinSh','skin','skin','lidSh','lidSh','lidSh','lid','lid','lid','lid','lid','lid','lid','lid','lid','lid','lid','lid','lid','lid','lid','skin','skinSh','outline','outline','',''],

    // === Row 10-11: 大眼睛（加宽）===
    ['outline','skinSh','skin','skin','eyeB','eyeB','eyeB','eyeW','eyeW','eyeW','eyeW','eyeI','eyeI','eyeI','eyeI','eyeW','eyeW','eyeW','eyeW','eyeW','eyeB','eyeB','eyeB','skin','skin','skinSh','outline','','',''],
    ['outline','skinSh','skin','eyeB','eyeB','eyeB','eyeW','eyeW','eyeW','eyeI','eyeI','eyeI','eyeI','eyeI','eyeI','eyeI','eyeI','eyeW','eyeW','eyeW','eyeB','eyeB','eyeB','skin','skinSh','outline','','',''],

    // === Row 12-13: 眼睛下部 ===
    ['outline','skinSh','skin','skin','eyeB','eyeB','eyeW','eyeW','eyeW','eyeI','eyeI','eyeI','eyeI','eyeI','eyeI','eyeI','eyeW','eyeW','eyeW','eyeB','eyeB','eyeB','skin','skin','skin','skinSh','outline','','',''],
    ['','outline','skinSh','skin','eyeB','eyeB','eyeB','eyeB','eyeB','eyeB','eyeB','eyeB','eyeB','eyeB','eyeB','eyeB','eyeB','eyeB','eyeB','eyeB','eyeB','skin','skin','skin','skinSh','outline','','',''],

    // === Row 14-15: 鼻子 + 嘴巴 + 腮红（加大腮红区域）===
    ['','outline','skinSh','blush','blush','blush','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','blush','blush','blush','skin','skinSh','outline','','',''],
    ['','outline','skinSh','blush','blush','skin','skin','skin','skin','nose','nose','nose','skin','skin','skin','skin','skin','skin','skin','blush','blush','skin','skinSh','outline','','',''],

    // === Row 16-17: 下巴 + 脖子 + 领口 ===
    ['','outline','outline','skinSh','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','mouth','mouth','skin','skin','skin','skin','skin','skin','skin','skinSh','outline','outline','','',''],
    ['','','outline','outline','skinSh','skinSh','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skin','skinSh','skinSh','skinSh','outline','outline','','','','',''],

    // === Row 18-19: 宽松外套上部 ===
    ['','','','outline','outline','outline','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','outline','outline','outline','','','',''],
    ['','','outline','coatLn','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coatLn','outline','outline','','',''],

    // === Row 20-23: 外套主体（宽松感）===
    ['','outline','coatLn','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coatLn','outline','','',''],
    ['','outline','coatLn','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coatLn','outline','','',''],
    ['outline','coatLn','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coatLn','outline','',''],
    ['outline','coatLn','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coatLn','outline','',''],

    // === Row 24-25: 外套下部 + 手臂 ===
    ['outline','coatLn','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coatLn','outline','',''],
    ['','outline','coatLn','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coatLn','outline','','',''],

    // === Row 26-27: 外套下摆 ===
    ['','outline','coatLn','coatLn','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coat','coatLn','coatLn','outline','','',''],
    ['','','outline','outline','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','coatLn','outline','outline','','','','',''],

    // === Row 28-29: 腿/裤子 ===
    ['','','','outline','outline','coatDk','coatDk','coatDk','coatDk','coatDk','coatDk','coatDk','coatDk','coatDk','coatDk','coatDk','coatDk','coatDk','coatDk','coatDk','coatDk','coatDk','coatDk','outline','outline','','','','',''],
    ['','','','','outline','outline','coatDk','coatDk','coatDk','coatDk','coatDk','coatDk','coatDk','coatDk','coatDk','coatDk','coatDk','coatDk','coatDk','coatDk','coatDk','outline','outline','','','','',''],

    // === Row 30-31: 鞋子 ===
    ['','','','','','','outline','outline','shoe','shoe','shoe','shoe','shoe','shoe','shoe','shoe','shoe','shoe','shoe','shoe','outline','outline','','','','','','',''],
    ['','','','','','','','','outline','outline','outline','shoe','shoe','shoe','shoe','shoe','shoe','outline','outline','outline','','','','','','',''],
  ],
};
