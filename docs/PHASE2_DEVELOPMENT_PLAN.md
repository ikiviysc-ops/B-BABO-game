# B-BABO幸存者：无尽深渊 — Phase 2 开发计划

> 基于专业研究的全面升级方案，目标从3分提升到8分+
> 创建日期：2026-04-14

---

## 一、现状评估（当前3分 → 目标8分+）

### 1.1 当前问题诊断

| 维度 | 当前评分 | 核心问题 |
|------|---------|---------|
| **UI/HUD** | 2/10 | 纯功能性占位，无设计感。血条/经验条简陋，无武器栏，无小地图 |
| **角色系统** | 4/10 | 20角色数据齐全但视觉差异仅靠调色板，共用同一模板 |
| **升级界面** | 3/10 | 深蓝卡片+灰色边框，无稀有度区分，无动画 |
| **特效系统** | 3/10 | 无粒子系统、无屏幕震动、无命中停顿 |
| **弹幕效果** | 5/10 | 15种武器有独立渲染，但缺辉光/拖尾 |
| **图标系统** | 7/10 | 32x32像素图标专业，已达标 |
| **架构** | 6/10 | ECS-lite良好，但Game.ts 957行过于臃肿 |

### 1.2 提升路线图

```
Phase 2.1: UI/HUD 全面重做        (3分 → 5分)
Phase 2.2: 角色差异化重做          (5分 → 6分)
Phase 2.3: 特效系统(粒子/震动/停顿) (6分 → 7分)
Phase 2.4: 弹幕升级(辉光/拖尾)     (7分 → 8分)
Phase 2.5: 音效 + Game Over + 主菜单 (8分 → 9分)
```

---

## 二、Phase 2.1：UI/HUD 全面重做

### 2.1.1 设计系统（Design Tokens）

```typescript
// 文件: src/engine/UITheme.ts
export const UI = {
  // 背景
  bg: {
    primary:    '#0a0a1a',
    secondary:  '#12122a',
    tertiary:   '#1a1a3e',
    elevated:   '#222250',
    overlay:    'rgba(0,0,0,0.75)',
    hud:        'rgba(10,10,26,0.85)',
  },
  // 文字
  text: {
    primary:    '#f0f0f0',
    secondary:  '#a0a0c0',
    tertiary:   '#606080',
    accent:     '#e94560',
    gold:       '#ffd700',
    xp:         '#4488ff',
  },
  // 强调色
  accent: {
    red: '#e94560', blue: '#4488ff', green: '#44cc66',
    gold: '#ffd700', purple: '#9966ff', orange: '#ff8844', cyan: '#44dddd',
  },
  // 血条
  bar: {
    hp: { bg: '#331111', fill: '#cc3333', hi: '#ff4444', border: '#661111' },
    xp: { bg: '#111133', fill: '#4488ff', hi: '#66aaff', border: '#112266' },
  },
  // 面板
  panel: { bg: '#12122a', border: 'rgba(255,255,255,0.12)', radius: 2 },
  // 间距基准
  spacing: { xs: 4, sm: 8, md: 16, lg: 24, xl: 32 },
  // 动画时长
  duration: { instant: 50, fast: 150, normal: 250, slow: 400, dramatic: 600 },
};
```

### 2.1.2 HUD 布局重做

**目标布局（参考 Vampire Survivors）：**

```
┌──────────────────────────────────────────┐
│ ████████████████████░░░░░░░░ XP BAR     │  ← 顶部全宽经验条(8px高)
├──────────────────────────────────────────┤
│ [武器1][武器2]...[武器6]               │  ← 左上：武器栏(40x40槽位)
│ [被动1][被动2]...[被动6]               │  ← 左上：被动栏
│                                          │
│              (游戏区域)                   │
│                                          │
│                          ⏱ 25:30        │  ← 右上：计时器
│                          💀 1,234        │  ← 右上：击杀数
│                          💰 8,320        │  ← 右上：金币
│         [角色]                           │
│         ████████░░ HP                    │  ← 角色上方：血条(跟随)
└──────────────────────────────────────────┘
```

**需要新建的文件：**
- `src/engine/UITheme.ts` — 设计系统常量
- `src/engine/UITextRenderer.ts` — Canvas文本渲染（描边+阴影+DPR适配）
- `src/ui/HUDRenderer.ts` — HUD渲染器（血条/XP条/武器栏/计时器）
- `src/ui/LevelUpPanel.ts` — 升级选择面板（卡片动画+稀有度）
- `src/ui/GameOverScreen.ts` — 游戏结束界面
- `src/ui/MainMenu.ts` — 主菜单

### 2.1.3 升级卡片重做

**卡片设计规范：**
- 尺寸：180x260px
- 背景：`#1a1a3e` + 双线边框
- 稀有度边框颜色：普通(白) / 稀有(蓝#4488ff) / 史诗(紫#9966ff) / 传说(金#ffd700)
- 图标：64x64px（来自PixelIcons）
- 名称：白色bold 14px + 描边
- 类型标签：`[NEW]`绿色 / `[UP]`蓝色
- 描述：灰色 10px，自动换行
- 属性变化：绿色`+20 HP` / 红色`-10% 速度`
- 动画：从底部弹入(easeOutBack 400ms)

### 2.1.4 Canvas文本渲染优化

**核心改进：**
1. DPR适配：Canvas内部分辨率 = 显示分辨率 × devicePixelRatio
2. 描边+阴影：先strokeText再fillText，配合shadowBlur
3. 整数坐标：所有绘制坐标Math.floor取整
4. 像素字体：加载 "Press Start 2P" 或 "Silkscreen"

---

## 三、Phase 2.2：角色差异化重做

### 3.1 POP MART × HIRONO 角色设计

**核心设计语言：**
- 大头小身（头占1/2至1/3）
- 圆润无棱角（biomorphic）
- 豆豆眼/十字星瞳
- 红色腮红 + 红色鼻头
- 马卡龙色系 + 1-2高饱和点缀色
- 通过配饰/姿态/主题实现差异化

**20角色完整方案：**

| # | 名称 | 情绪原型 | 配色 | 初始武器 | 被动 | 剪影特征 |
|---|------|---------|------|---------|------|---------|
| 1 | 小野·失忆 | 空白 | 灰白+淡蓝 | 空白画笔 | 经验+10% | 画笔 |
| 2 | 小野·狂啸 | 愤怒 | 深红+亮橙 | 声波呐喊 | 伤害+10% | 飞散头发+张嘴 |
| 3 | 小野·漂浮 | 自由 | 天蓝+白+淡紫 | 气泡弹 | 速度+20% | 蜷缩+云朵 |
| 4 | 小野·毁灭 | 力量 | 暗灰+荧光绿 | 碎裂拳套 | 近战+15% | 宽肩+拳套 |
| 5 | 小野·幽灵 | 游离 | 半透明白+淡蓝 | 灵魂灯笼 | 复活1次 | 渐隐下半身+灯笼 |
| 6 | 小野·治愈 | 温暖 | 暖粉+奶油白+薄荷绿 | 治愈之花 | 每秒回0.5HP | 巨大花朵 |
| 7 | 小野·木偶 | 无力 | 木纹棕+金色线 | 操控丝线 | 投射物+1 | 十字控制器 |
| 8 | 小野·狐狸 | 狡黠 | 橙色+白+黑 | 狐火 | 幸运+20% | 狐狸面具+尾巴 |
| 9 | 小野·乌鸦 | 深沉 | 纯黑+紫光泽 | 黑羽刃 | 冷却-10% | 斗篷+肩上乌鸦 |
| 10 | 小野·钢琴家 | 艺术 | 黑白燕尾服+金 | 音符飞刃 | 持续+20% | 燕尾服+音符 |
| 11 | 小野·堕落天使 | 堕落 | 白翅(渐灰)+金光环+深红 | 断翼之刃 | 伤害+20% | 不对称翅膀 |
| 12 | 小野·怪物 | 黑暗 | 深紫+荧光粉 | 暗影触手 | 范围+30% | 暗影覆盖+异瞳 |
| 13 | 小野·洞察 | 理解 | 靛蓝+金瞳+深蓝 | 全视之眼 | 拾取+25% | 第三只眼+书 |
| 14 | 小野·回声 | 共鸣 | 银灰+青色波纹 | 回声定位 | 反弹+5% | 双重残影 |
| 15 | 小野·流浪 | 漂泊 | 大地色+破旧感 | 旅人之杖 | 速度+30% | 超大背包 |
| 16 | 小野·枷锁 | 挣扎 | 铁灰+锈红 | 锁链鞭 | 减速反击10% | 飘动锁链 |
| 17 | 小野·鸟人 | 超越 | 羽毛白+天蓝+金喙 | 羽箭 | 弹速+40% | 手臂翅膀+鸟冠 |
| 18 | 小野·麻木 | 逃避 | 淡紫+灰蓝+毛绒 | 梦境棉花 | 伤害-20% | 蚕茧+半脸 |
| 19 | 小野·做梦 | 希望 | 全息彩虹+星光 | 星光瀑布 | 全属性+5% | 星星+全息色 |
| 20 | 小野·他者 | 镜像 | 反转色 | 镜像分身 | 分身50%伤害 | 反转配色 |

### 3.2 角色精灵重做策略

**当前问题：** 20角色共用同一32x32模板，仅靠调色板区分。

**解决方案：**
1. **保留HIRONO基础模板**（头+身体+腿的Chibi比例）
2. **每个角色添加独特配饰层**（帽子/面具/翅膀/武器/尾巴等）
3. **配饰作为独立的32x32像素数据层**，叠加在基础模板上
4. **每个角色2-3个独特剪影元素**确保辨识度

**文件结构：**
```
src/data/
  characters/
    base_sprite.ts       — HIRONO基础32x32模板
    accessories/
      amnesia_brush.ts    — 失忆：画笔
      raving_hair.ts      — 狂啸：飞散头发
      float_cloud.ts      — 漂浮：云朵底座
      ...                 — 每个角色1-2个配饰文件
    palettes.ts           — 20个角色调色板
    registry.ts           — 角色注册表（整合）
```

### 3.3 角色选择界面重做

**目标设计：**
- 左侧：角色大图展示（3倍放大 = 96x96px）
- 右侧：属性面板（HP/速度/护甲/暴击 条形图）
- 底部：技能描述 + 初始武器预览
- 顶部：角色名 + HIRONO系列名
- 解锁状态：未解锁角色显示剪影+解锁条件

---

## 四、Phase 2.3：特效系统

### 4.1 粒子系统

**新建文件：** `src/engine/ParticleSystem.ts`

```typescript
class ParticleSystem {
  pool: ObjectPool<Particle>;  // 对象池，预创建500个
  emitters: ParticleEmitter[];  // 发射器列表

  // 预设发射器
  static EXPLOSION = { burst: 30, speed: [50,250], life: [0.2,0.6], colors: ['#FF6600','#FFAA00'] };
  static LEVEL_UP = { burst: 20, speed: [30,80], life: [0.8,1.5], colors: ['#FFD700','#FFFFFF'] };
  static DEATH = { burst: 15, speed: [80,200], life: [0.3,0.7], colors: [...] };
  static HIT_SPARK = { burst: 5, speed: [100,300], life: [0.15,0.25], colors: [...] };
}
```

### 4.2 屏幕震动

**新建文件：** `src/engine/ScreenShake.ts`

```typescript
class ScreenShake {
  trigger(intensity: number, duration: number, frequency?: number): void;
  update(dt: number): void;
  getOffset(): { x: number, y: number };
}
```

**参数：** 轻攻击(2px,100ms) / 重攻击(8px,300ms) / 爆炸(15px,500ms)

### 4.3 命中停顿（Hitstop）

**新建文件：** `src/engine/HitStop.ts`

```typescript
class HitStop {
  trigger(duration?: number): void;  // 默认50ms
  update(dt: number): boolean;        // true=跳过本帧逻辑
}
```

### 4.4 伤害数字升级

**改进点：**
- 暴击：金色32px + 初始放大1.5x + 屏幕微震
- 普通伤害：白色18px + 描边
- 元素伤害：属性色（火橙/冰蓝/雷紫/自然绿）
- 动画：上浮+重力+水平漂移+缩放弹性+淡出
- 上限：50个同时存在

---

## 五、Phase 2.4：弹幕升级

### 5.1 辉光效果

**方案：离屏Canvas + globalCompositeOperation = 'lighter'**

```typescript
// 新建: src/engine/GlowRenderer.ts
class GlowRenderer {
  glowCanvas: OffscreenCanvas;
  render(projectiles: Projectile[]): void;
  composite(mainCtx: CanvasRenderingContext2D): void;
}
```

> ⚠️ 禁止使用shadowBlur（性能极差），用预渲染辉光纹理替代

### 5.2 拖尾效果

**方案：历史位置记录**

每个投射物记录最近8帧位置，绘制时从旧到新递增alpha和size。

### 5.3 敌人死亡特效

- 普通怪：粒子爆发（12-20个碎片）
- 精英怪：闪白 + 粒子爆发
- Boss：慢动作 + 大量粒子 + 屏幕震动

---

## 六、Phase 2.5：完善体验

### 6.1 Game Over 界面

```
┌─────────────────────────────┐
│       GAME OVER             │
│                             │
│    存活时间:  25:30         │
│    击杀总数:  1,234         │
│    收集金币:  8,320         │
│    达成等级:  25            │
│                             │
│    使用的武器:               │
│    [图标]手枪 Lv.5          │
│    [图标]魔法杖 Lv.3        │
│    [图标]圣盾 Lv.8          │
│                             │
│    [ 重新开始 ]  [ 主菜单 ]  │
└─────────────────────────────┘
```

### 6.2 主菜单

```
┌─────────────────────────────┐
│                             │
│    B-BABO 幸存者             │
│      无尽深渊                │
│                             │
│    [ 角色选择 ]              │
│    [ 永久升级 ]              │
│    [ 成就系统 ]              │
│    [ 操作说明 ]              │
│                             │
│    v0.2.0                    │
└─────────────────────────────┘
```

### 6.3 音效系统（预留接口）

```typescript
// src/engine/AudioManager.ts
class AudioManager {
  play(name: string): void;
  playHit(): void;
  playExplosion(): void;
  playLevelUp(): void;
  playDeath(): void;
}
```

---

## 七、技术架构调整

### 7.1 Game.ts 拆分

当前Game.ts 957行过于臃肿，需要拆分：

```
Game.ts (核心循环，~200行)
  ├── systems/  (已有)
  ├── ui/
  │   ├── HUDRenderer.ts      — HUD渲染
  │   ├── LevelUpPanel.ts     — 升级面板
  │   ├── GameOverScreen.ts   — 结算界面
  │   └── MainMenu.ts         — 主菜单
  ├── engine/
  │   ├── ParticleSystem.ts   — 粒子系统
  │   ├── ScreenShake.ts      — 屏幕震动
  │   ├── HitStop.ts          — 命中停顿
  │   ├── GlowRenderer.ts     — 辉光渲染
  │   ├── UITheme.ts          — 设计系统
  │   └── UITextRenderer.ts   — 文本渲染
  └── render/
      ├── ProjectileRenderer.ts  — 弹幕渲染(从Game.ts抽出)
      └── MeleeEffectRenderer.ts — 近战特效(从Game.ts抽出)
```

### 7.2 渲染顺序

```
1. 背景层（网格/地面纹理）
2. 地面阴影层
3. 地面效果层（AOE标记）
4. 敌人层
5. 弹幕层
6. 角色层
7. 近战特效层
8. 粒子层
9. 伤害数字层
10. 辉光叠加层（离屏Canvas + lighter）
11. HUD层
12. UI面板层（升级/暂停/结算）
```

---

## 八、执行优先级

### 第一批（最高优先级，目标5分）

| 任务 | 新建文件 | 预计工作量 |
|------|---------|-----------|
| 设计系统 | UITheme.ts | 小 |
| 文本渲染 | UITextRenderer.ts | 小 |
| HUD重做 | HUDRenderer.ts | 中 |
| 升级卡片重做 | LevelUpPanel.ts | 中 |
| 血条/XP条优化 | HUDRenderer.ts内 | 小 |

### 第二批（高优先级，目标6-7分）

| 任务 | 新建文件 | 预计工作量 |
|------|---------|-----------|
| 粒子系统 | ParticleSystem.ts | 大 |
| 屏幕震动 | ScreenShake.ts | 小 |
| 命中停顿 | HitStop.ts | 小 |
| 伤害数字升级 | DamageNumber.ts | 中 |
| Game.ts拆分 | 多文件重构 | 大 |

### 第三批（中优先级，目标7-8分）

| 任务 | 新建文件 | 预计工作量 |
|------|---------|-----------|
| 角色配饰系统 | characters/accessories/*.ts | 大 |
| 角色选择界面 | CharacterSelectScreen.ts | 中 |
| 辉光渲染 | GlowRenderer.ts | 中 |
| 弹幕拖尾 | ProjectileSystem.ts修改 | 中 |

### 第四批（完善，目标8-9分）

| 任务 | 新建文件 | 预计工作量 |
|------|---------|-----------|
| Game Over界面 | GameOverScreen.ts | 中 |
| 主菜单 | MainMenu.ts | 中 |
| 敌人死亡特效 | DeathEffect.ts | 中 |
| 音效系统 | AudioManager.ts | 中 |

---

## 九、质量验收标准

### 9.1 UI质量检查清单

- [ ] 所有文字有描边+阴影，在任何背景上清晰可读
- [ ] 血条有渐变+高光+平滑动画
- [ ] XP条横贯屏幕顶部，有闪烁高光
- [ ] 武器栏显示图标+等级点
- [ ] 计时器/击杀/金币数字有千分位格式化
- [ ] 升级卡片有稀有度颜色边框
- [ ] 升级卡片有弹入动画
- [ ] 所有按钮有hover/press状态
- [ ] 移动端触控目标≥48px

### 9.2 角色质量检查清单

- [ ] 20角色剪影测试：纯黑色填充后仍可区分
- [ ] 每角色至少2个独特视觉元素
- [ ] 配色无重复主色调
- [ ] 角色选择界面显示大图+属性+技能

### 9.3 特效质量检查清单

- [ ] 命中时有冲击火花粒子
- [ ] 暴击时屏幕微震+放大数字
- [ ] 敌人死亡有粒子爆发
- [ ] 升级时有金色粒子+扩散环
- [ ] 弹幕有辉光效果（离屏Canvas方案）
- [ ] 近战有斩击弧线

---

## 附录：参考资源索引

- 知识库：`docs/GAME_DEV_KNOWLEDGE_BASE.md`
- POP MART角色研究：本文档第三章
- UI设计系统：本文档第二章
- 调色板：[Lospec](https://lospec.com/palette-list)
- 像素工具：Aseprite / LibreSprite / PixiEditor
- 风格参考：Vampire Survivors / Dead Cells / HoloCure / Brotato
