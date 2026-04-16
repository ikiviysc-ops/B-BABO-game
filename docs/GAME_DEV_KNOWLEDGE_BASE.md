# B-BABO幸存者 — 游戏开发专业知识库

> 本文档汇总项目开发过程中研究到的所有专业知识，供后续开发查阅。
> 最后更新：2026-04-14

---

## 目录

1. [像素图标设计](#一像素图标设计)
2. [弹幕与攻击特效](#二弹幕与攻击特效)
3. [角色渲染](#三角色渲染)
4. [技能系统设计](#四技能系统设计)
5. [地图与关卡系统](#五地图与关卡系统)
6. [背包与物品系统](#六背包与物品系统)
7. [UI/UX设计规范](#七uiux设计规范)
8. [游戏进度与元设计](#八游戏进度与元设计)
9. [2D Canvas性能优化](#九2d-canvas性能优化)

---

## 一、像素图标设计

### 1.1 核心设计原则

| 原则 | 说明 |
|------|------|
| 剪影优先 | 先用单色确认形状0.5秒可识别，再着色 |
| 统一光源 | 所有图标左上角照射，受光面亮/背光面暗 |
| 色相偏移 | 阴影偏冷(蓝/紫)，高光偏暖(黄/橙) |
| 严格调色板 | 每图标3-5色，每材质最多3色阶 |
| 选择性描边 | 受光面亮描边，背光面暗描边 |
| 材质区分 | 金属(灰蓝)、木头(棕)、魔法(高饱和发光) |
| 暗示优于细节 | 1像素暗示高光/锈迹/裂缝 |

### 1.2 调色板体系

```
描边: outDark=#0d0d1a, outLight=#2a2a40
金属: metalBase=#8898a8, metalHi=#c0d0e0, metalSh=#506070
木头: woodBase=#8a6830, woodHi=#b89050, woodSh=#5a4018
金色: goldBase=#c8a030, goldHi=#f0d060, goldSh=#886018
红色: redBase=#c03030, redHi=#f06050, redSh=#781820
蓝色: blueBase=#3868b0, blueHi=#68a0e0, blueSh=#1a3868
绿色: greenBase=#38a048, greenHi=#68d878, greenSh=#186828
紫色: purpleBase=#7838b0, purpleHi=#a868e0, purpleSh=#401868
橙色: orangeBase=#d06820, orangeHi=#f09848, orangeSh=#884010
青色: cyanBase=#28a0a8, cyanHi=#58d8e0, cyanSh=#106868
高光: white=#f0f0f8
魔法: magicGlow=#e0c0ff
```

### 1.3 渲染管线

- **基础分辨率**: 32x32（离屏Canvas绘制）
- **缩放**: `imageSmoothingEnabled = false` 保持像素锐利
- **缓存**: Map<string, HTMLCanvasElement> 避免重复绘制
- **缩放公式**: 先在32x32上绘制，再drawImage到目标尺寸

### 1.4 图标分类设计模式

| 类别 | 视角 | 关键特征 |
|------|------|---------|
| 剑类 | 垂直/斜放 | 刃(金属) + 护手(金属) + 握把(木头) |
| 枪械 | 侧面L形 | 枪管(金属) + 枪身(金属) + 握把(木头) |
| 弓箭 | C形弧 | 弓臂(木头) + 弦(浅色线) + 箭(金属头+羽毛) |
| 法杖 | 垂直+顶部宝珠 | 杖身(木头) + 宝珠(发光+粒子) |
| 盾牌 | 正面 | 盾形(金色) + 中心纹章(白色) |
| 属性图标 | 正面 | 心形(HP红) / 闪电(速度金) / 拳头(力量橙) |

---

## 二、弹幕与攻击特效

### 2.1 弹幕类型分类

| 类型 | 发射模式 | 视觉特征 | 代表 |
|------|---------|---------|------|
| 直线穿透 | 朝移动方向 | 细长条+拖尾 | 飞刀、魔杖 |
| 扇形散射 | 朝最近敌人扇形 | 圆形+火焰粒子 | 火球、圣水 |
| 环形扩散 | 以角色为中心 | 环形等间距 | 大蒜、十字架 |
| 轨道环绕 | 围绕角色旋转 | 弧形拖尾 | 轨道、旋转飞斧 |
| 激光/光束 | 直线覆盖 | 粗光柱+辉光 | 圣光 |
| 落点轰炸 | 从天而降 | AOE标记+爆炸 | 闪电环 |
| 追踪弹 | 追踪最近敌人 | 曲线轨迹 | 魔法弓进化 |

### 2.2 拖尾实现方案

**推荐：历史位置记录（精确控制）**
```javascript
class Projectile {
  trail = []; // 最近N帧位置
  maxTrailLength = 8;
  update() {
    this.trail.push({x: this.x, y: this.y});
    if (this.trail.length > this.maxTrailLength) this.trail.shift();
  }
  draw(ctx) {
    for (let i = 0; i < this.trail.length; i++) {
      const alpha = (i / this.trail.length) * 0.5;
      ctx.globalAlpha = alpha;
      // 绘制残影...
    }
  }
}
```

### 2.3 辉光效果（纯Canvas 2D）

**推荐：离屏Canvas + globalCompositeOperation = 'lighter'**
```javascript
// 预渲染辉光纹理
const glowCanvas = document.createElement('canvas');
const glowCtx = glowCanvas.getContext('2d');
glowCtx.clearRect(0, 0, w, h);
glowCtx.globalCompositeOperation = 'lighter';
projectiles.forEach(p => {
  const gradient = glowCtx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size * 3);
  gradient.addColorStop(0, p.glowColor);
  gradient.addColorStop(1, 'rgba(0,0,0,0)');
  glowCtx.fillStyle = gradient;
  glowCtx.beginPath();
  glowCtx.arc(p.x, p.y, p.size * 3, 0, Math.PI * 2);
  glowCtx.fill();
});
ctx.drawImage(glowCanvas, 0, 0);
```

> ⚠️ **避免使用shadowBlur**：每帧大量弹幕时性能极差。离屏Canvas方案性能提升3-5倍。

### 2.4 屏幕震动

```javascript
class ScreenShake {
  trigger(intensity, duration, frequency = 30) { ... }
  update(dt) {
    // 正弦波震动 + 衰减
    this.offsetX = Math.sin(this.timer * this.frequency * 0.01) * currentIntensity;
    this.offsetY = Math.cos(this.timer * this.frequency * 0.013) * currentIntensity;
  }
}
```

**参数建议：**
| 攻击类型 | Hitstop | 震动强度 | 震动时长 |
|---------|---------|---------|---------|
| 轻攻击 | 30-50ms | 1-3px | 80-120ms |
| 重攻击 | 80-150ms | 5-10px | 200-400ms |
| 暴击 | 100-200ms | 8-15px | 300-500ms |
| 爆炸/AOE | 60-100ms | 10-20px | 400-600ms |

### 2.5 命中停顿（Hitstop/卡肉）

```javascript
class HitStop {
  trigger(duration = 50) { this.active = true; this.duration = duration; }
  update(dt) {
    if (!this.active) return false;
    this.timer += dt;
    if (this.timer >= this.duration) { this.active = false; return false; }
    return true; // true = 跳过本帧逻辑更新，只渲染
  }
}
```

### 2.6 伤害数字

**规范：**
- 普通伤害：白色18px
- 暴击伤害：金色32px，初始放大1.5x
- 元素伤害：对应属性色
- 动画：上浮+重力下落+水平漂移+缩放弹性+淡出
- 上限：50-80个同时存在

### 2.7 敌人死亡特效

| 方案 | 效果 | 性能 | 适用 |
|------|------|------|------|
| 粒子爆发 | 碎片四散 | 中 | 通用 |
| 溶解效果 | 噪声溶解 | 高 | Boss |
| 淡出缩小 | alpha+scale递减 | 低 | 小怪 |
| 闪白消散 | 先闪白再粒子 | 中 | 精英怪 |

### 2.8 AOE冲击波

```javascript
class ShockwaveRing {
  // 多层环：主环(即时) + 内环(延迟50ms) + 外环(延迟100ms)
  // 中心闪光(前20%时间)
  // easeOutCubic缓动
}
```

---

## 三、角色渲染

### 3.1 精灵表结构

- 4方向（上/下/左/右）
- 每方向3-6帧行走动画
- 精灵尺寸：32x32 或 48x48
- 格式：PNG，帧间距2px

### 3.2 动画管理

```javascript
// 方向优先级：取绝对值较大的轴
// 行走动画：150-200ms/帧，与移动速度成正比
// 静止时回到第0帧（站立帧）
// 4方向直接切换，无需过渡
```

### 3.3 角色阴影

```javascript
// 椭圆形阴影，位置偏下
ctx.globalAlpha = 0.3;
ctx.fillStyle = '#000000';
ctx.beginPath();
ctx.ellipse(x, y + height * 0.35, width * 0.4, height * 0.15, 0, 0, Math.PI * 2);
ctx.fill();
```

### 3.4 无敌帧闪烁

```javascript
// 每80ms切换一次可见性
shouldRender() {
  if (!this.active) return true;
  return Math.floor(this.timer / 80) % 2 === 0;
}
```

### 3.5 升级视觉效果

- 多层扩散环（金/白/蓝，延迟递增）
- 中心光柱（前40%时间）
- 上升粒子（20个，金色+白色）
- 持续1.5秒

---

## 四、技能系统设计

### 4.1 武器进化系统

**条件：**
1. 基础武器满级（通常8级）
2. 背包持有对应被动道具（任意等级）
3. 击杀精英怪后开启宝箱触发

**经典进化组合示例：**
| 基础武器 | 被动道具 | 进化武器 |
|---------|---------|---------|
| 鞭子 | 空心之心 | 血泪 |
| 魔杖 | 空白之书 | 圣杖 |
| 小刀 | 护腕 | 千刃 |
| 斧头 | 烛台 | 死亡螺旋 |

### 4.2 属性叠加机制

**加法叠加，硬上限：**
- 冷却缩减：基础100%，上限-90%（即最低10%）
- 范围增加：基础100%，上限+1000%
- 伤害倍率：`最终伤害 = 基础 * (100% + 所有加成)`
- 数量增加：直接+1投射物

### 4.3 升级节奏

```
0:00  初始1把武器
1:00  第1次升级
3:00  2-3把武器
5:00  build成型
10:00 精英怪掉宝箱（进化触发）
15:00 Arcana卡牌选择
20:00 死神出现
25:00 通关/死亡
```

**XP公式：** `升下一级 = baseXP * (1.05 ^ currentLevel)`

### 4.4 推荐方案

采用 **VS扁平升级 + 进化组合** 混合模式：
- 每次升级提供3-4个随机选项
- 武器满级+对应被动 → 宝箱触发进化
- 可加入Arcana卡牌系统增加策略层

---

## 五、地图与关卡系统

### 5.1 无限地图（Chunk系统）

```javascript
class ChunkManager {
  chunkSize = 20; // 每chunk的tile数
  loadRadius = 2; // 加载周围2圈
  update(playerPos) {
    // 加载周围chunk，卸载远处chunk
    // 使用种子随机数确保同一chunk每次一致
  }
}
```

### 5.2 程序化 vs 手工地图

| 维度 | 程序化 | 手工 |
|------|--------|------|
| 开发成本 | 低 | 高 |
| 内容量 | 理论无限 | 有限 |
| 推荐 | 大地图 | Boss竞技场/特殊区域 |

### 5.3 相机系统

```javascript
class GameCamera {
  smoothing = 0.08; // lerp因子
  follow(target) {
    this.targetX = target.x - this.width / (2 * this.zoom);
    this.targetY = target.y - this.height / (2 * this.zoom);
  }
  update() {
    this.x += (this.targetX - this.x) * this.smoothing;
    this.y += (this.targetY - this.y) * this.smoothing;
  }
  applyTransform(ctx) {
    ctx.setTransform(this.zoom, 0, 0, this.zoom, -this.x * this.zoom, -this.y * this.zoom);
  }
}
```

### 5.4 视差背景

```javascript
// 多层背景，不同速度因子
// 远景 0.05, 山脉 0.2, 树木 0.4, 游戏层 1.0, 前景 1.1
// 平铺绘制实现无限背景
```

### 5.5 小地图

```javascript
// 120x120px，半透明黑色背景
// 敌人=红色小点，玩家=绿色居中
// 世界坐标 * scale(0.02) 映射到小地图
```

---

## 六、背包与物品系统

### 6.1 VS风格背包

- 武器栏：最多6个主动武器
- 被动道具栏：最多6个被动
- 满槽后只能升级现有或跳过

### 6.2 物品稀有度

| 稀有度 | 颜色 | 掉落权重 |
|--------|------|---------|
| 普通 | #ffffff | 60% |
| 优秀 | #1eff00 | 25% |
| 稀有 | #0070ff | 10% |
| 史诗 | #a335ee | 4% |
| 传说 | #ff8000 | 1% |

**视觉指示：** 稀有度颜色边框 + 高稀有度发光效果(shadowBlur)

### 6.3 移动端操作

- **推荐：点击选择模式**（点击物品→高亮槽位→点击放入）
- PC端支持拖拽
- 最小触控目标：48x48px

### 6.4 网格布局

```javascript
// 6列 x 2行，cellSize=64px，间距4px
// 点击检测：col = floor((mouseX - gridX) / (cellSize + gap))
```

---

## 七、UI/UX设计规范

### 7.1 HUD布局

```
+------------------------------------------+
| [小地图]              [计时器] [击杀数]    |  ← 顶部
|                                          |
|              (游戏区域)                   |
|                                          |
| [武器1] [武器2] ... [武器6]              |  ← 底部左侧
| [HP条████████░░]  [XP条██████████████]   |  ← 底部中央
| [金币: 1234]        [等级: 25]           |  ← 底部右侧
+------------------------------------------+
```

### 7.2 设计原则

1. 最小化屏幕占用
2. 角落放置，减少视线干扰
3. 渐进式展示
4. 色彩编码一致
5. 可缩放适配不同分辨率

### 7.3 武器冷却指示器

- 背景圆 + 冷却遮罩（从顶部顺时针减少）
- 就绪时绿色边框发光
- 武器图标居中

### 7.4 移动端适配

- 最小触控：48x48px
- 基准分辨率：375x667（iPhone SE）
- 拇指热区：屏幕底部1/3
- HUD缩放：移动端0.75x

---

## 八、游戏进度与元设计

### 8.1 Roguelite元进度

**核心循环：** 单局游戏 → 金币/Token → 永久升级 → 解锁新内容 → 下一局更强

**永久升级类别：**
| 类别 | 示例 |
|------|------|
| 基础属性 | 最大生命、移动速度 |
| 经济加成 | 金币获取率、初始金币 |
| 技能树 | 解锁高阶技能选项 |
| 特殊能力 | 圣物、符文 |

### 8.2 角色解锁

- 击杀特定Boss
- 存活时间达标
- 收集特定道具
- 金币购买

### 8.3 成就系统

- 生存类（存活5/10/30分钟）
- 战斗类（击杀1000/10000/100000）
- 收集类（首次进化/全进化）

### 8.4 难度缩放

```javascript
// 分段线性缩放
enemySpawnRate: base * (1 + minutes * 0.15)
enemyHealthMult: 1 + minutes * 0.08
enemyDamageMult: 1 + minutes * 0.05
enemySpeedMult: 1 + min(minutes * 0.02, 0.5)  // 上限+50%
eliteChance: min(0.05 + minutes * 0.01, 0.3)   // 上限30%

// 0-5min热身 → 5-10min压力上升 → 10-20min高压 → 20-25min极限
```

---

## 九、2D Canvas性能优化

### 9.1 对象池（最核心）

```javascript
class ObjectPool {
  acquire(...args) { /* 从池中取或新建 */ }
  release(obj) { /* 归还到池 */ }
  update(dt) { /* 更新所有活跃对象，死亡自动释放 */ }
}
```

### 9.2 性能基准

| 设备 | 粒子上限 | 弹幕上限 | draw call上限 |
|------|---------|---------|-------------|
| 高端手机 | 500-1000 | 300-500 | 1000-2000 |
| 中端手机 | 200-500 | 150-300 | 500-1000 |
| 低端手机 | 50-200 | 50-150 | 200-500 |
| PC浏览器 | 2000-5000 | 1000-3000 | 3000-10000 |

### 9.3 优化清单

1. ✅ 对象池：所有粒子和弹幕
2. ✅ 离屏Canvas：辉光效果预渲染
3. ✅ 批量绘制：相同类型粒子合并draw call
4. ✅ 视锥剔除：屏幕外跳过
5. ✅ LOD粒子：远处简化渲染
6. ✅ 合成模式最小化：集中使用globalCompositeOperation
7. ✅ 纹理图集：减少纹理切换
8. ✅ 避免save/restore嵌套
9. ✅ requestAnimationFrame驱动
10. ✅ 分层Canvas：背景/实体/UI分离

### 9.4 渲染顺序

```
1. 背景层（静态/缓慢滚动）
2. 地面阴影层
3. 地面效果层（AOE标记）
4. 敌人层
5. 弹幕层
6. 角色层
7. 空中特效层（冲击波、闪光）
8. 伤害数字层
9. 辉光叠加层（离屏Canvas + lighter）
10. UI层（血条、经验条、小地图）
```

### 9.5 Overdraw控制

- 半透明粒子叠加是性能杀手
- `lighter`混合模式注意颜色饱和阈值
- 控制同屏区域粒子密度
- 考虑depth sorting减少无效绘制

---

## 参考资源

- **调色板**: [Lospec](https://lospec.com/palette-list)
- **像素工具**: Aseprite($20), LibreSprite(免费), PixiEditor(免费)
- **教程频道**: AdamCYounis, TutsByKai, Wintermute Digital (YouTube)
- **风格参考**: Vampire Survivors, Dead Cells, Hyper Light Drifter, Enter the Gungeon, Nuclear Throne
- **地图系统**: [dev.to 相机系统教程](https://dev.to/rexthony)
- **VS机制**: [VS Fandom Wiki](https://vampire-survivors.fandom.com)

---

## 十、敌人AI行为模式

### 核心要点
- 有限状态机（FSM）是2D游戏AI最佳基础：巡逻/追击/攻击/撤退/空闲
- 状态转换基于距离检测 + 视线检测（raycast）
- Vampire Survivors类游戏需要多种AI变体：直线追击、侧翼包抄、环形包围、远程射击、自杀冲锋
- 群体AI通过分离力（避免重叠）、对齐力（同向移动）、聚合力（朝群体中心）实现

### 实现方案
```javascript
// FSM核心
const AI_STATE = { IDLE: 0, CHASE: 1, ATTACK: 2, RETREAT: 3, PATROL: 4 };
class EnemyAI {
  state = AI_STATE.IDLE;
  update(enemy, player, dt) {
    const dist = distance(enemy, player);
    if (dist < enemy.attackRange) this.state = AI_STATE.ATTACK;
    else if (dist < enemy.detectRange) this.state = AI_STATE.CHASE;
    else this.state = AI_STATE.PATROL;
  }
}
```

---

## 十一、游戏手感与输入优化（Game Feel）

### 核心要点
- Input Buffering：保存输入100-200ms，等状态允许时执行
- Coyote Time：离开平台后仍有100ms跳跃窗口
- 每种动作独立缓冲：跳跃150ms、攻击100ms、翻滚80ms

### 实现方案
```javascript
class InputBuffer {
  private buffer: { action: string; time: number } | null = null;
  private window = 150; // ms
  push(action: string) { this.buffer = { action, time: performance.now() }; }
  consume(action: string): boolean {
    if (this.buffer?.action === action && performance.now() - this.buffer.time < this.window) {
      this.buffer = null;
      return true;
    }
    return false;
  }
}
```

---

## 十二、复古像素音效合成

### 核心要点
- Web Audio API 4种波形：triangle/sine/square/sawtooth
- ADSR包络控制音色：Attack-Decay-Sustain-Release
- WhiteNoise + lowpass filter = swoosh/打击/爆炸效果

### 实现方案
```javascript
class RetroAudio {
  private ctx: AudioContext;
  playHit() {
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'square';
    osc.frequency.setValueAtTime(200, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(80, this.ctx.currentTime + 0.1);
    gain.gain.setValueAtTime(0.3, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.1);
    osc.connect(gain).connect(this.ctx.destination);
    osc.start(); osc.stop(this.ctx.currentTime + 0.1);
  }
}
```

---

## 十三、像素背景瓦片设计

### 核心要点
- 瓦片尺寸：16x16或32x32，2px间距防接缝
- Wang Tiles算法解决边缘匹配
- 多层分离：地面层 + 装饰层 + 碰撞层
- 视差速度：远景0.05, 中景0.2, 近景0.4, 游戏层1.0

---

## 十四、游戏存档系统

### 核心要点
- 所有状态集中到一个plain object，JSON.stringify一次序列化
- 脏标记 + 节流写入（1秒间隔）
- 版本号支持存档迁移
- localStorage 5MB限制

### 实现方案
```javascript
const SAVE_KEY = 'bbabo_save';
function saveGame(data: any) {
  data.version = 2;
  localStorage.setItem(SAVE_KEY, JSON.stringify(data));
}
function loadGame(): any {
  const raw = localStorage.getItem(SAVE_KEY);
  return raw ? JSON.parse(raw) : null;
}
```

---

## 十五、成就系统设计

### 核心要点
- 分类：生存/战斗/收集/特殊
- 事件驱动：游戏事件→成就管理器检查
- 奖励：金币/解锁角色/称号
- 通知：弹窗+音效，不打断游戏

---

## 十六、像素角色动画帧规范

### 核心要点
- Idle 2-4帧、Walk 4-6帧、Run 6-8帧、Attack 3-6帧、Death 4-6帧
- 帧时机比帧数更重要：慢启动→快动作→慢恢复
- Hold Frame：关键姿势停留更长时间
- 4方向：左右可镜像翻转，上下独立绘制
- Squash & Stretch：1像素变化产生弹性感

---

## 十七、游戏本地化（i18n）

### 核心要点
- 所有文本外部化到JSON文件，代码用key引用
- 像素字体需包含目标语言字符集
- 中文比英文短30-50%，UI需预留弹性空间
- Canvas: measureText()动态计算宽度

---

## 十八、VS武器进化完整机制

### 核心要点
- 三要素：基础武器满级(8级) + 对应被动(任意等级) + Boss宝箱
- 进化武器继承基础属性+附加新效果
- 特殊类型：双被动进化、自我进化、链式进化
- 每个被动对应1-2个武器进化

---

## 十九、死亡界面与结算统计

### 核心要点
- 核心数据：存活时间、击杀、金币、等级、武器列表
- 动画：死亡慢动作→渐黑→面板弹入→统计逐行显示
- 新纪录用金色标记
- 按钮：重新开始+返回主菜单

---

## 二十、像素角色动画系统

### 核心原理
- **FSM驱动帧动画**：每个状态(idle/walk/attack/hurt/death)对应精灵表帧序列
- **精灵表管理**：统一尺寸网格(32x32)，图集2的幂次(256x256/512x512)
- **动画12法则像素应用**：Squash&Stretch(1-2像素形变)、Anticipation(攻击前微后仰)、Follow Through(挥剑后多滑1帧)、Hold Frame(关键姿势停留更久)
- **方向镜像**：左右用`ctx.scale(-1,1)`翻转，减少50%帧数
- **`imageSmoothingEnabled=false`**必须关闭

### 性能注意
- 单张精灵表不超过2048x2048，移动端不超过1024x1024
- 像素动画4-8帧足够，超过12帧收益递减
- 使用OffscreenCanvas缓存每帧

### 参考游戏
- Dead Cells(500+帧/角色)、Hyper Light Drifter(6方向+三段式攻击)、Celeste(复杂状态机教科书)

---

## 二十一、2D游戏地图生成

### Wang Tiles算法
- 每瓦片4条边标记颜色编码，相邻瓦片共享同色边
- 16种基础瓦片(每边2色)可生成无重复大面积地图
- 约束传播：从左上到右下逐格生成，筛选匹配上下左右约束的候选瓦片

### BSP房间生成
- 递归二分空间，叶节点成为房间，连接相邻房间形成走廊
- 适合地牢类地图，分割深度4-6层

### Chunk管理
- 固定区块(20x20瓦片)，以玩家为中心加载周围N圈
- 种子随机确保同一坐标每次生成一致
- 超出范围区块序列化后卸载

### 参考游戏
- Vampire Survivors(无限地图+Chunk)、Dead Cells(BSP+房间模板)、Enter the Gungeon(BSP+模板池)

---

## 二十二、Survivor类游戏数值平衡

### 伤害公式(乘区模型)
```
最终伤害 = 基础攻击 × 武器等级缩放 × (1+加成%) × 暴击 × (1-防御减伤%) × 元素克制
防御减伤 = Def / (Def + K)，K为常数(如200)
武器等级缩放 = 1 + (level-1) × 0.15~0.20
```

### 敌人HP缩放(分段线性)
```
HP倍率 = 1 + 分钟 × 0.08
伤害倍率 = 1 + 分钟 × 0.05
速度倍率 = 1 + min(分钟 × 0.02, 0.5)
刷怪率 = 1 + 分钟 × 0.15
精英概率 = min(0.05 + 分钟 × 0.01, 0.3)
```

### 武器升级表
- 每级+20%伤害，冷却每级-100ms(下限200ms)
- 每3级+1投射物，每级+10%范围
- 升级XP指数增长：`5 × 1.3^(level-1)`

### 参考游戏
- Vampire Survivors(每级+10%伤害/+10%范围)、Holocure(多乘区独立叠加)、Brotato(经济决策)

---

## 二十三、Canvas 2D渲染优化

### 分层离屏Canvas
- 静态层(背景/地面)预渲染，每帧一次drawImage
- 动态层(实体/特效)每帧重绘
- `willReadFrequently:false` + `alpha:false`启用GPU加速

### 纹理图集
- 多精灵合并一张大图，减少drawImage调用
- 自动换行排列，2px间距防接缝

### 性能禁忌
- 避免shadowBlur(用离屏Canvas预渲染辉光)
- 避免频繁save()/restore()
- 避免drawImage缩放(预缓存多尺寸版本)
- globalCompositeOperation集中使用

### 参考游戏
- Diep.io(纹理图集+批量绘制支持数百实体60FPS)

---

## 二十四、游戏手感(Game Feel)

### Input Buffering
- 提前按下的输入保存100-200ms，状态允许时自动执行
- 解决"我明明按了但没反应"的挫败感

### Coyote Time
- 离开平台边缘后仍有100-200ms跳跃窗口

### 屏幕震动参数
- lightHit: 2px/80ms/40Hz
- heavyHit: 6px/250ms/25Hz
- critical: 10px/350ms/30Hz
- explosion: 15px/500ms/20Hz
- 指数衰减比线性衰减手感更好：`intensity × (1-progress)²`

### 击退物理
- 施加远离攻击方向的冲量，每帧乘摩擦系数(0.92)衰减
- 速度极小时(<0.5)归零

### 参考游戏
- Celeste(Input Buffer 6帧+Coyote 5帧)、Dead Cells(Hitstop+震动+击退)、Hollow Knight(0.15s Hitstop)

---

## 二十五、像素艺术UI设计

### 像素字体
- 位图字体(Bitmap Font)，每字符预渲染像素网格
- 字间距1px、行间距2px、基线对齐
- 阴影：先画偏移(1,1)的暗色再画主色

### 九宫格面板(9-Slice)
- 4角固定+4边拉伸+中心填充
- 支持任意尺寸保持像素锐利

### 按钮状态
- 4种：normal/hover/pressed/disabled
- hover: 亮度提升+边框高亮
- pressed: 向下位移1-2px+颜色变暗

### 参考游戏
- Vampire Survivors(暗色调面板+金色强调)、Stardew Valley(九宫格面板经典实现)

---

## 二十六、敌人行为树(Behavior Tree)

### BT节点类型
- **Sequence**：依次执行，全部成功才成功(必须全部满足)
- **Selector**：依次尝试，任一成功即成功(优先级选择)
- **Decorator**：Inverter(反转)/Repeater(重复)/Timer(定时)
- **Condition**：检查条件，返回成功/失败
- **Action**：执行行为，返回成功/失败/运行中

### Blackboard模式
- 所有节点共享数据存储，节点间通过黑板通信
- 每帧更新黑板数据(玩家位置/自身HP)，读取决策结果

### FSM vs BT
- FSM适合简单AI(2-5状态)，O(1)查询
- BT适合复杂AI(多种行为组合)，可复用/可扩展
- 建议：普通小怪用FSM，Boss用BT

### 参考游戏
- Halo(BT先驱)、Dead Cells(小怪FSM+Boss BT)
