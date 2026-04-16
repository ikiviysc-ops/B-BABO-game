# B-BABO幸存者：无尽深渊 — 项目全景 & UI/UX 开发规范

> 整合自：GAME_DEV_KNOWLEDGE_BASE.md、PHASE2_DEVELOPMENT_PLAN.md、开发文档_v2.0.md、B-BABO_UI_Layouts.md、BBABO_UI_UX_Design.md
> 更新日期：2026-04-16

---

## 第一部分：项目全景

### 1.1 项目基本信息

| 项目 | 内容 |
|------|------|
| 游戏名称 | B-BABO幸存者：无尽深渊 (B-BABO Survivors: Endless Abyss) |
| 类型 | Roguelike 生存射击 |
| 平台 | Web Browser (HTML5/Canvas) |
| 画风 | 纯像素风 (Pixel Art)，HIRONO小野（泡泡玛特）风格 |
| 视角 | 俯视角 (Top-Down) |
| 对标作品 | Vampire Survivors / Brotato / Nova Drift / Dead Cells |
| 语言 | TypeScript |
| 构建工具 | Vite |
| 架构模式 | 简化ECS (Entity-Component-System) |
| 渲染引擎 | Canvas 2D |
| 代码仓库 | `/workspace/B-BABO-game/` |

### 1.2 技术栈

- **渲染**: Canvas 2D + HTMLCanvasElement + DPR适配
- **架构**: 简化ECS（EntityManager + System + Entity）
- **碰撞**: AABB碰撞检测 + SpatialHash空间哈希 + ObjectPool对象池
- **输入**: 键盘(WASD/方向键) + 鼠标 + 触摸 + 虚拟摇杆
- **精灵**: 32x32像素代码绘制 + 20语义化调色板键运行时换色
- **性能**: 固定60fps游戏循环 + 对象池 + 视锥剔除 + 离屏Canvas缓存

### 1.3 目录结构

```
/workspace/B-BABO-game/
├── index.html                          ← 入口 HTML
├── package.json                        ← 项目配置
├── tsconfig.json                       ← TS 配置
├── vite.config.ts                      ← Vite 配置（路径别名 @engine/@systems/@data/@entities/@ui）
├── docs/
│   ├── GAME_DEV_KNOWLEDGE_BASE.md      ← 游戏开发专业知识库（26章）
│   ├── PHASE2_DEVELOPMENT_PLAN.md      ← Phase 2 升级计划
│   ├── 开发上下文记录.md                ← AI开发者持久记忆
│   └── 开发文档_v2.0.md                ← 完整开发文档副本（28章）
└── src/
    ├── main.ts                         ← 入口（DOMContentLoaded启动Game）
    ├── core/
    │   └── Game.ts                     ← 游戏核心类（生命周期/阶段管理/系统整合）
    ├── engine/                         ← 引擎模块（18个文件）
    ├── systems/                        ← 游戏系统（8个文件）
    ├── ui/                             ← UI组件（5个文件）
    ├── entities/                       ← 实体定义（4个文件）
    └── data/                           ← 数据定义（7个文件）
```

### 1.4 游戏阶段流转

```
主菜单 (MainMenu) → 角色选择 (CharacterSelect) → 战斗 (Playing) → 升级选择 (LevelUp) → 游戏结束 (GameOver)
```

Game.ts 通过 `_phase` 状态机管理: `menu | charSelect | playing | gameOver`

---

### 1.5 引擎模块清单 (`src/engine/`)

| 文件 | 职责 | 关键特性 |
|------|------|---------|
| `GameLoop.ts` | 固定时间步长游戏循环 | 固定60fps、错误捕获不崩溃、FPS监控、累加器模式 |
| `Renderer.ts` | Canvas 2D渲染器 | DPR适配、像素风渲染(imageSmoothingEnabled=false)、alpha:false GPU加速 |
| `Camera.ts` | 2D摄像机系统 | 平滑跟随(lerp 0.1)、立即跳转、resize适配 |
| `InputManager.ts` | 输入管理 | 键盘+鼠标+触摸统一管理、tap消费机制、getMovementAxis() |
| `EntityManager.ts` | 实体管理器(简化ECS) | Map存储、脏标记缓存getAll()、beginFrame/endFrame |
| `PixelRenderer.ts` | 像素精灵渲染器 | HTMLCanvasElement渲染、20语义化调色板键、5套预设调色板(fire/ice/thunder/nature/neutral) |
| `Collision.ts` | AABB碰撞检测 | aabbOverlap检测、SpatialHash空间哈希、ObjectPool通用对象池 |
| `ProjectilePool.ts` | 投射物对象池 | 预分配300个实例、get/release生命周期管理、避免GC |
| `ParticleSystem.ts` | 粒子系统 | 对象池管理、4种预设(EXPLOSION/LEVEL_UP/HIT_SPARK/DEATH)、可配置发射器 |
| `ScreenShake.ts` | 屏幕震动 | 正弦波震动+衰减、参数化(强度/时长/频率)、getOffset() |
| `HitStop.ts` | 命中停顿(卡肉) | 触发时跳过逻辑更新只渲染、默认50ms、制造打击感 |
| `UITheme.ts` | UI设计系统常量 | 颜色系统(bg/text/accent/bar/panel)、HUD布局、武器槽位、卡片布局、动画easing |
| `UITextRenderer.ts` | UI文字渲染器 | 统一字体/描边/对齐、DPR物理像素坐标、shadow效果 |
| `PixelIcons.ts` | 像素图标系统 | 32x32基础分辨率、离屏Canvas缓存、专业游戏UI图标(剑/枪/弓/法杖/盾/属性) |
| `ParallaxBackground.ts` | 视差背景系统 | 星空层预渲染、远山/树木层、伪随机种子、性能优化(只绘制可见区域) |
| `TileMap.ts` | 瓦片地面渲染 | 128px瓦片、3种变体(石砖/泥土/苔石)、无限滚动、伪随机一致性、缓存限制200 |
| `VirtualJoystick.ts` | 虚拟摇杆 | 触摸移动控制、归一化方向输出、死区检测、半透明渲染 |

### 1.6 游戏系统清单 (`src/systems/`)

| 文件 | 职责 | 关键特性 |
|------|------|---------|
| `MovementSystem.ts` | 玩家移动系统 | 虚拟摇杆优先+键盘备选、归一化方向、跳过敌人实体 |
| `RenderSystem.ts` | 渲染管线 | 视差背景→瓦片地面→地面装饰→实体(玩家+敌人)、视锥剔除 |
| `ProjectileSystem.ts` | 投射物更新系统 | 位置更新、生命周期管理、出屏回收、追踪弹转向、爆炸子投射物 |
| `WaveSystem.ts` | 波次/敌人生成系统 | 20波预定义配置表+随机波次、按间隔在玩家周围生成、波次自动推进 |
| `EnemyAISystem.ts` | 敌人AI系统 | FSM有限状态机(idle/patrol/chase/attack/retreat/special/stunned)、12种敌人独特行为、分离力避免重叠 |
| `WeaponSystem.ts` | 武器自动发射系统 | 近战(范围检测+扇形伤害)+远程(投射物发射)、冷却时间管理、EquippedWeapon实例 |
| `CombatSystem.ts` | 战斗系统 | 投射物AABB碰撞检测、伤害计算、穿透/击退处理、敌人死亡XP掉落、浮动伤害数字 |
| `LevelUpSystem.ts` | XP升级系统 | 经验值积累、指数增长XP曲线、3选1升级卡片、属性加成(HP/速度/伤害)、新武器/升级武器/属性提升 |

### 1.7 UI组件清单 (`src/ui/`)

| 文件 | 职责 | 关键特性 |
|------|------|---------|
| `HUDRenderer.ts` | 专业HUD渲染器 | XP条(顶部全宽)、武器栏(6槽位+图标+等级)、计时器/击杀/金币、角色跟随血条(渐变红) |
| `LevelUpPanel.ts` | 升级选择面板 | 3张卡片式选择、稀有度颜色边框、easeOutBack弹入动画、属性变化预览、[NEW]/[UP]标签 |
| `MainMenu.ts` | 主菜单 | 深色渐变背景+星星粒子、标题浮动动画、3按钮(开始游戏/角色选择/操作说明)、hover/press状态 |
| `GameOverScreen.ts` | 游戏结束界面 | 半透明遮罩、标题弹入动画、数据行staggered淡入(存活时间/击杀/分数/等级)、武器列表、重新开始/主菜单按钮 |
| `CharacterSelectScreen.ts` | 角色选择界面 | 96x96大图展示、属性条(HP红/速度蓝/护甲灰/暴击金)、未解锁剪影+条件、滑动过渡动画、翻页/返回/确认按钮 |

### 1.8 数据定义清单 (`src/data/`)

| 文件 | 职责 | 内容 |
|------|------|------|
| `CharacterRegistry.ts` | 20角色注册表 | CharacterDef(属性/技能/解锁条件) + CharacterSprite(调色板/精灵) + 工厂方法 |
| `WeaponDefs.ts` | 15把武器定义 | 5近战 + 7远程 + 3特殊 |
| `enemies_sprites.ts` | 12个敌人精灵 | 16x16像素精灵数据 |
| `sprites_batch1-4.ts` | 角色1-20精灵 | HIRONO风格32x32像素精灵，每批5个角色 |

### 1.9 实体定义清单 (`src/entities/`)

| 文件 | 职责 |
|------|------|
| `BaboSprite.ts` | HIRONO基础精灵模板（32x32像素，20语义化调色板键） |
| `EnemyFactory.ts` | 敌人工厂（12个EnemyDef定义，sprite预缓存） |
| `PlayerFactory.ts` | 角色工厂（旧版，已被CharacterRegistry替代，待清理） |
| `Projectile.ts` | 投射物实体定义（6种类型：bullet/arrow/magic/rocket/melee_arc/explosion） |

---

### 1.10 开发路线图

**已完成：**
- Phase 0: 项目搭建 + 引擎核心 + 20角色
- Phase 1: 核心原型（敌人/武器/碰撞/波次/伤害/升级）
- Phase 1B+: 虚拟摇杆 + 近战优化 + 投射物渲染优化 + UI重做
- Phase 2.1: UITheme/HUDRenderer/LevelUpPanel/MainMenu/GameOverScreen/CharacterSelect
- Phase 2.3: ParticleSystem/ScreenShake/HitStop

**待实现：**
- Phase 2.2: 角色差异化重做（配饰系统）
- Phase 2.4: 辉光渲染/弹幕拖尾/敌人死亡特效
- Phase 2.5: AudioManager音效系统
- Phase 3: 背包/商店/永久升级/被动技能/地图场景
- Phase 4: 移动端旗舰适配（iPhone 17 Pro Max竖屏 @3x HDR Bloom 120Hz）
- Phase 5-7: 社交留存/商业化/打磨发布

---

## 第二部分：UI/UX 开发规范

### 2.1 设计基础参数

| 平台 | 分辨率 | 方向 | 字体基准 |
|------|--------|------|----------|
| PC | 1920x1080 | 横屏 | 16px (UI) / 24px bold (标题) |
| Mobile | 432x932pt (iPhone 17 Pro Max) | 竖屏 | 12px (UI) / 18px bold (标题) |

- **风格**: 像素风 (Pixel Art), 8-bit 调色板, 暗色系主题
- **基准网格**: 8px
- **像素字体**: PC 用 "Press Start 2P" / "Zpix"; Mobile 用 "Zpix" / "Fusion Pixel"
- **圆角**: 0 (纯像素风格, 无圆角)
- **描边**: 2px

### 2.2 颜色系统 (Design Tokens)

**核心色板：**

| 用途 | 色值 | 说明 |
|------|------|------|
| 主背景 | `#1a1a2e` | 深蓝黑 |
| 面板背景 | `#16213e` | 深蓝 |
| 卡片背景 | `#0f3460` | 中蓝 |
| 主强调色 | `#e94560` | 红色 (按钮、高亮) |
| 次强调色 | `#f5a623` | 金色 (奖励、高级) |
| 成功色 | `#4ecca3` | 绿色 (已领取、完成) |
| 文字主色 | `#f0f0f0` | 白色 |
| 文字次色 | `#8892b0` | 灰蓝 |
| 锁定色 | `#3d3d5c` | 暗灰紫 |

**稀有度色板：**

| 稀有度 | 色值 | 颜色 |
|--------|------|------|
| SSR | `#ffd700` | 金色 |
| SR | `#c77dff` | 紫色 |
| R | `#4cc9f0` | 蓝色 |
| N | `#6b7280` | 灰色 |

### 2.3 动画与过渡效果规范

| 动画类型 | 时长 | 缓动 | 说明 |
|----------|------|------|------|
| 页面进入 | 200ms | ease-out | 像素风不支持复杂过渡 |
| 按钮按下 | 50ms | linear | 内缩 1px |
| 卡片选中 | 150ms | ease-out | 边框颜色变化 |
| 脉冲发光 | 1.5s (循环) | ease-in-out | 循环呼吸灯 |
| 奖励弹出 | 300ms | bounce | 从小到大弹出 |
| 进度条填充 | 500ms | ease-out | 像素块逐个填充 |

### 2.4 交互状态规范

**按钮：**

| 状态 | 视觉表现 | 动画参数 |
|------|----------|----------|
| Normal | 标准描边 + 填充色 | - |
| Hover (PC) | 边框亮度提升 | 150ms ease-out |
| Press/Active | 内缩 1px | 50ms linear |
| Disabled | 50% 透明度 | - |
| Highlighted | 脉冲发光 | 1.5s ease-in-out 循环 |

**卡片：**

| 状态 | 视觉表现 |
|------|----------|
| Normal | 标准边框 |
| Selected | 高亮边框颜色 |
| Locked | 灰度 + 锁图标 |
| Unlocked/New | 金色边框 + 脉冲 |

### 2.5 安全区域

| 平台 | 顶部 | 底部 | 左右 |
|------|------|------|------|
| PC | 0px | 0px | 0px |
| Mobile | 59pt (状态栏 + 导航) | 34pt (Home Indicator) | 0pt |

### 2.6 各界面像素级布局参数

**角色选择界面 Mobile (432x932pt)：**

| 区域 | 尺寸 | 说明 |
|------|------|------|
| 导航栏 | 高 44pt | |
| 横向滚动区 | 高 120pt | 角色列表 |
| 角色卡片 | 72x96pt | 横向滚动 |
| 角色展示区 | 高 180pt | 固定居中 |
| 属性栏 | 高 60pt | 图标+数字紧凑排列 |
| 技能区 | 高 80pt | |
| 武器选择 | 高 70pt | 横向按钮组 |
| 开始按钮 | 高 50pt | sticky bottom 吸底 |
| 安全区域底部 | 34pt | Home Indicator |

**结算界面 Mobile：**

| 区域 | 尺寸 | 说明 |
|------|------|------|
| 胜利横幅 | 高 80pt | 像素粒子动画 |
| 评分区域 | 高 120pt | S级带金色光晕脉冲 |
| 统计区域 | 高 160pt | 可滚动 |
| 奖励区 | 高 60pt | 图标+数字紧凑排列 |
| 按钮区 | 高 50pt | 双按钮并排吸底 |

**主菜单 Mobile：**

| 区域 | 说明 |
|------|------|
| 主按钮 | 3个纵向排列: 开始游戏 / 无限生存 / 每日挑战 |
| 功能按钮 | 3+3+2 网格排列 |
| 底部信息 | 货币 + 等级 + 赛季 |

**天赋树 Mobile：**

| 区域 | 尺寸 | 说明 |
|------|------|------|
| 节点 | 64x64px | 间距 8px |
| 路线切换 | 高 44pt | 标签切换 (非并排) |
| 选中节点详情 | 高 100pt | 底部详情卡片 |
| 变更摘要 | 高 60pt | 固定底部 |

**赛季通行证 Mobile：**

| 区域 | 尺寸 | 说明 |
|------|------|------|
| 当前等级卡片 | 高 80pt | 高亮 + 脉冲 |
| 里程碑卡片 | 高 70pt | 金色边框 |
| 购买按钮 | 高 50pt | 吸底 |

### 2.7 移动端适配通用规则

1. **导航栏**: 统一高 44pt, 含返回按钮 + 标题 + 操作按钮
2. **底部安全区域**: 34pt (Home Indicator)
3. **吸底按钮**: 固定在安全区域之上, 高 50pt
4. **可滚动内容**: 各区域纵向堆叠, 整体可滚动
5. **横向滚动**: 角色列表/成就标签/奖励卡片等用横向滚动
6. **标签切换**: PC 并排显示的内容在 Mobile 用标签切换
7. **详情页**: 点击卡片 -> 全屏 push 导航 或底部抽屉
8. **紧凑排列**: 属性用图标+数字紧凑排列, 减少纵向空间
9. **网格适配**: PC 6列 -> Mobile 4列; PC 3列 -> Mobile 单列或2列

### 2.8 数据流设计要点

**升级费用公式：**
```
upgrade_cost = base_cost + (current_level * cost_increment)
```

**天赋点获取公式：**
```
new_points = floor(player.total_xp / 500) - player.talent.points_earned
```

**赛季经验计算：**
```
对局经验 = base_xp * difficulty_mult * mode_mult * time_mult
```

---

## 第三部分：20角色 + 15武器 + 12敌人 速查表

### 3.1 20角色（HIRONO小野系列）

| # | ID | 名称 | 情绪 | 配色 | 初始武器 | 被动技能 |
|---|-----|------|------|------|---------|---------|
| 1 | amnesia | 失忆 | 空白 | 灰白+淡蓝 | 空白画笔 | 经验+10% |
| 2 | raving | 狂啸 | 愤怒 | 深红+亮橙 | 声波呐喊 | 伤害+10% |
| 3 | floating | 漂浮 | 自由 | 天蓝+白+淡紫 | 气泡弹 | 速度+20% |
| 4 | destruction | 毁灭 | 力量 | 暗灰+荧光绿 | 碎裂拳套 | 近战+15% |
| 5 | ghost | 幽灵 | 游离 | 半透明白+淡蓝 | 灵魂灯笼 | 复活1次 |
| 6 | healing | 治愈 | 温暖 | 暖粉+奶油白+薄荷绿 | 治愈之花 | 每秒回0.5HP |
| 7 | puppet | 木偶 | 无力 | 木纹棕+金色线 | 操控丝线 | 投射物+1 |
| 8 | fox | 狐狸 | 狡黠 | 橙色+白+黑 | 狐火 | 幸运+20% |
| 9 | crow | 乌鸦 | 深沉 | 纯黑+紫光泽 | 黑羽刃 | 冷却-10% |
| 10 | pianist | 钢琴家 | 艺术 | 黑白燕尾服+金 | 音符飞刃 | 持续+20% |
| 11 | fallen_angel | 堕落天使 | 堕落 | 白翅+金光环+深红 | 断翼之刃 | 伤害+20% |
| 12 | monster | 怪物 | 黑暗 | 深紫+荧光粉 | 暗影触手 | 范围+30% |
| 13 | insight | 洞察 | 理解 | 靛蓝+金瞳+深蓝 | 全视之眼 | 拾取+25% |
| 14 | echo | 回声 | 共鸣 | 银灰+青色波纹 | 回声定位 | 反弹+5% |
| 15 | wanderer | 流浪 | 漂泊 | 大地色+破旧感 | 旅人之杖 | 速度+30% |
| 16 | chains | 枷锁 | 挣扎 | 铁灰+锈红 | 锁链鞭 | 减速反击10% |
| 17 | birdman | 鸟人 | 超越 | 羽毛白+天蓝+金喙 | 羽箭 | 弹速+40% |
| 18 | numb | 麻木 | 逃避 | 淡紫+灰蓝+毛绒 | 梦境棉花 | 伤害-20% |
| 19 | dreamer | 做梦 | 希望 | 全息彩虹+星光 | 星光瀑布 | 全属性+5% |
| 20 | other | 他者 | 镜像 | 反转色 | 镜像分身 | 分身50%伤害 |

### 3.2 15把武器

| 类型 | 武器 | 伤害 | 攻速 | 特殊效果 |
|------|------|------|------|---------|
| 近战 | 生锈铁剑 | 12 | 1.2/s | 新手入门 |
| 近战 | 战斧 | 25 | 0.6/s | 15%眩晕1s、击退20px |
| 近战 | 狂战士之刃 | 18 | 1.5/s | HP越低伤害越高 |
| 近战 | 守护盾 | 8 | 0.8/s | 反弹投射物 |
| 近战 | 雷霆锤 | 30 | 0.4/s | AOE 60px、雷电元素 |
| 远程 | 手枪 | 10 | 2.0/s | 基础远程 |
| 远程 | 霰弹枪 | 8x5 | 0.8/s | 5发散射 |
| 远程 | 狙击枪 | 45 | 0.5/s | 穿透3、超远射程 |
| 远程 | 魔法杖 | 15 | 1.5/s | 追踪弹 |
| 远程 | 火焰喷射 | 6 | 4.0/s | 火元素、短程连射 |
| 远程 | 冰霜弓 | 12 | 1.2/s | 冰元素、减速 |
| 远程 | 闪电环 | 20 | 1.0/s | 雷元素、链跳3 |
| 特殊 | 圣光 | 35 | 0.3/s | 全方向光束 |
| 特殊 | 死亡之书 | 25 | 0.8/s | 召唤环绕骷髅 |
| 特殊 | 命运轮盘 | 0-50 | 1.0/s | 随机伤害 |

### 3.3 12种敌人

| 敌人 | HP | 速度 | 伤害 | 攻击类型 | 特殊效果 |
|------|-----|------|------|---------|---------|
| 腐烂鼠 | 15 | 150 | 5 | 接触 | -- |
| 骷髅兵 | 30 | 108 | 10 | 近战 | -- |
| 暗夜蝙蝠 | 12 | 240 | 8 | 接触 | 盘旋飞行 |
| 荆棘藤蔓 | 40 | 0 | 12 | 远程(200px) | 自然元素 |
| 火焰史莱姆 | 25 | 90 | 15 | 接触 | 死亡爆炸50px |
| 冰霜史莱姆 | 25 | 90 | 8 | 接触 | 冰冻1s |
| 雷电精灵 | 20 | 180 | 18 | 远程(150px) | 闪电链跳3 |
| 骷髅弓手 | 20 | 120 | 12 | 远程(250px) | -- |
| 邪眼 | 80 | 60 | 25 | 远程(300px) | 激光 |
| 死亡骑士 | 120 | 130 | 20 | 近战 | 冲锋 |
| 吸血鬼 | 100 | 180 | 15 | 接触 | 吸血回复 |
| 巨型僵尸 | 200 | 50 | 30 | 近战 | 前摇重击 |

---

## 第四部分：已知问题 & 待办

### 4.1 已知Bug

| 问题 | 优先级 | 状态 |
|------|--------|------|
| Trae预览沙箱RAF冻结（非代码问题） | 低 | 沙箱限制，本地浏览器正常 |
| 升级卡片图标显示为方块（emoji渲染兼容性） | 中 | 待修复 |
| batch精灵数据部分角色行长度不一致 | 低 | 需全局修复 |
| PlayerFactory.ts旧版未清理 | 低 | 待清理 |

### 4.2 Phase 2 待实现

| 任务 | 文件 | 工作量 |
|------|------|--------|
| 辉光渲染器 | `engine/GlowRenderer.ts` | 中 |
| 弹幕拖尾效果 | 修改 `systems/ProjectileSystem.ts` | 中 |
| 敌人死亡特效 | `engine/DeathEffect.ts` | 中 |
| 音效系统 | `engine/AudioManager.ts` | 中 |
| 角色配饰系统 | `data/characters/accessories/*.ts` | 大 |
| Game.ts拆分 | 多文件重构 | 大 |

### 4.3 质量验收标准

**UI质量：**
- [x] 所有文字有描边+阴影
- [x] 血条有渐变+高光+平滑动画
- [x] 武器栏显示图标+等级
- [ ] 计时器/击杀/金币数字千分位格式化
- [x] 升级卡片有弹入动画
- [ ] 移动端触控目标>=48px

**特效质量：**
- [x] 命中时有冲击火花粒子
- [ ] 暴击时屏幕微震+放大数字
- [ ] 敌人死亡有粒子爆发
- [x] 升级时有金色粒子
- [ ] 弹幕有辉光效果
- [ ] 近战有斩击弧线

---

## 第四部分（补充）：外部资源库与工具推荐

> 来源：[sindresorhus/awesome](https://github.com/sindresorhus/awesome) 深度挖掘
> 筛选标准：与 B-BABO（Canvas 2D 像素风 Roguelike）直接相关、可落地使用

### 4.1 推荐引入的库（按优先级）

#### 🔊 音频系统（Phase 2.5 待实现）

| 库 | 链接 | 推荐理由 |
|----|------|---------|
| **Howler.js** | https://github.com/goldfire/howler.js | 最稳定的 Web 音频库，自动回退 HTML5 Audio，支持多格式、音量/淡入淡出/空间音效 |
| **Sound.js** | https://github.com/kittykatattack/sound.js | 微型库（<2KB），专为游戏设计，API 极简：`sound.play('jump')` |
| **Tone.js** | https://github.com/Tonejs/Tone.js | 程序化音乐生成，适合动态 BGM |

#### ✨ 粒子/特效增强

| 库 | 链接 | 推荐理由 |
|----|------|---------|
| **Proton** | https://github.com/a-jie/Proton | 轻量粒子引擎，效果丰富（爆炸、火焰、拖尾），可替代/增强现有 ParticleSystem |
| **tsParticles** | https://particles.matteobruni.it/ | 现代化粒子库，配置驱动，支持 JSON 预设导入 |

#### 🎬 动画系统

| 库 | 链接 | 推荐理由 |
|----|------|---------|
| **GSAP** | https://gsap.com/ | 业界标准，适合游戏 UI 动画（菜单弹出、血条变化、伤害数字飘动、过场动画） |
| **Anime.js** | https://animejs.com/ | 轻量替代方案，API 更简洁 |

#### 🎮 像素风 UI 组件（参考）

| 库 | 链接 | 推荐理由 |
|----|------|---------|
| **NES.css** | https://github.com/nostalgic-css/NES.css | 红白机风格 CSS 框架，纯 CSS 无 JS，适合 DOM 层 UI 参考 |
| **PEEXEL** | https://catpea.github.io/peexel/ | RPG 游戏风格 CSS 框架，菜单/标签页/装备面板等组件 |
| **Pixelact UI** | https://github.com/pixelact-ui/pixelact-ui | 基于 shadcn/ui 的像素风组件库，Tailwind 驱动 |

#### 🕹️ 虚拟摇杆（已有自研，备选参考）

| 库 | 链接 | 推荐理由 |
|----|------|---------|
| **joystick-controller** | https://github.com/cyrus2281/joystick-controller | 完全可定制，支持多实例，桌面+移动端 |

#### 🔤 像素字体

| 字体 | 链接 | 推荐理由 |
|------|------|---------|
| **Zpix** | https://github.com/SolidZORO/zpix-pixel-font | 最小中文像素字体，12px/16px 规格 |
| **Ark Pixel Font** | https://github.com/TakWolf/ark-pixel-font | 开源泛中日韩像素字体，覆盖最全面 |
| **Press Start 2P** | https://fonts.google.com/specimen/Press+Start+2P | 经典 8-bit 英文像素字体，Google Fonts 免费 |

#### 🎨 图标资源

| 资源 | 链接 | 推荐理由 |
|------|------|---------|
| **Game Icons** | http://game-icons.net/ | 4000+ 免费游戏风格 SVG 图标，CC BY 可商用 |
| **Font Awesome** | https://fontawesome.com/ | 最流行的矢量图标集 |

#### 🛠️ 调试工具

| 工具 | 链接 | 推荐理由 |
|------|------|---------|
| **Spector.js** | https://spector.babylonjs.com/ | WebGL/Canvas 调试，查看每帧绘制调用 |

### 4.2 推荐学习资源

| 资源 | 链接 | 用途 |
|------|------|------|
| Game Programming Patterns | https://gameprogrammingpatterns.com/ | 游戏编程设计模式（组件模式、状态机、观察者等） |
| Web Game Dev | https://www.webgamedev.com/ | JS 游戏开发技术文章 |
| Lospec | https://lospec.com/ | 像素画调色板集合 + 在线工具 |
| Aseprite | https://aseprite.org/ | 行业标准像素画编辑器 |

### 4.3 Awesome 列表持续关注

| 列表 | 链接 | 关注点 |
|------|------|--------|
| awesome-gamedev | https://github.com/Calinou/awesome-gamedev | 游戏开发综合资源 |
| awesome-game-engine-dev | https://github.com/stevinz/awesome-game-engine-dev | 引擎开发技术 |
| awesome-canvas | https://github.com/raphamorim/awesome-canvas | Canvas 渲染技术 |
| awesome-webaudio | https://github.com/notthetup/awesome-webaudio | Web 音频技术 |
| awesome-pixel-art | https://github.com/Siilwyn/awesome-pixel-art | 像素艺术资源 |

---

## 第五部分：关键约定

| 约定 | 内容 |
|------|------|
| 开发文档路径 | `/workspace/像素幸存者_无尽深渊_开发文档.md` |
| 上下文记录路径 | `/workspace/开发上下文记录.md` |
| 项目代码路径 | `/workspace/B-BABO-game/` |
| Dev Server端口 | 8000 |
| 移动端测试视口 | 432x932 (iPhone 17 Pro Max) |
| 协作模式 | AI写代码 -> 用户运行测试 -> 反馈 -> 修复 |
| Git分支 | main |
| 美术资源 | 角色代码绘制32x32 / 敌人代码绘制16x16 |
