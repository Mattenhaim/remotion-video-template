# 镜头卡清单（SHOT-CATALOG）

10 张镜头卡全部按底盘 [Vincentwei1021/video-shotcraft](https://github.com/Vincentwei1021/video-shotcraft)
`references/shots/` 的卡规范**从零实现**（Apache-2.0；不含底盘原始场景代码）。

- **8 张内容卡** → `scene.shot` 字段取值（下方第 1 表）
- **2 张转场卡** → `scene.transitionIn` 字段取值（下方第 2 表）

勾稽关系：`shot` 可选值 8 个 + `transitionIn` 卡 2 张 = **10 张卡**；Demo 配置
（`examples/attention-demo.config.ts`）用到 5 张内容卡 + 2 张转场卡。

## 内容卡（scene.shot）

| shot | 分类 | 出处卡 | 适用场景（一句话） | 配图 |
|---|---|---|---|---|
| `blur-slide` | 字体排版 | typography/blur-slide | 默认标题/陈述句 reveal：词从虚焦里浮出来，专业不抢戏，几乎万能 | ✓（文左图右） |
| `brace-expand` | 字体排版 | typography/brace-expand | 代码语感开场：一对花括号弹开把标题"括出来"，技术产品/代码视频标题字卡 | |
| `marker-underline` | 字体排版 | typography/marker-underline-title | 标题里强调单个关键词：马克笔下划线一笔点睛，手写感、人味 | |
| `outline-word-fill` | 字体排版 | typography/outline-word-fill | 单词重锤钉子镜：空心词收缩落位后一帧硬切点亮，卡点上的强调帧 | |
| `paper-title-card` | 字体排版 | typography/paper-title-card | 呼吸位/收尾：逐词压印上纸 + 短划线收束，隔开两段高能镜头 | |
| `gradient-word-sweep` | 字体排版+光影 | typography/gradient-word-sweep | 给标语里的关键词"充能"：渐变彩光扫过波前最亮，能量高潮段文字戏（稳态闪电为简化版） | |
| `spotlight-sweep` | 光影强调 | effects/spotlight-sweep-moves（A 式） | 暗场聚光扫字，光到即亮扫过保持——"光即叙事"，把一句话立成结论 | |
| `dark-flip` | 光影强调 | effects/aurora-bloom-bg-flip | 叙事转折点：底色压暗换句 blur-in，深浅色系段落切换（`flipText` 换句，缺省同句加重） | |

## 转场卡（scene.transitionIn）

| transitionIn | 分类 | 出处卡 | 适用场景（一句话） |
|---|---|---|---|
| `push-up` | 转场 | transition/bottom-push-stack-wipe | 新场景整屏从底边向上推入把旧场景顶出——换章骨架，翻页节奏感 |
| `blinds` | 转场 | transition/wipe-transitions（blinds-slice 式） | 12 根叶片错峰翻面成波扫过换页——哪儿都能用的通用擦除 |

`cut`（默认）= 硬切，切点落在节拍帧上。

## 文案语法

- `*词*` = 强调词（颜色/描线/扫光，视镜头而定）
- 中日韩文案按字拆分做逐字入场；拉丁文按词拆分
- 纯标点自动并入前一字，不单独动画

## 实现程度说明（诚实清单）

- 全部动画帧号驱动（`useCurrentFrame` / `interpolate` / `spring`），无 CSS transition
- `gradient-word-sweep`：波前扫充、稳态泛光呼吸、字符间闪电**已实现**；
  闪电为单条折线简化版（原卡为多层泛光+多弧勾连）
- `spotlight-sweep`：点亮时序按 token 序号排布（对自动换行稳健），聚光位置
  与点亮时序共用一条时间线——不是逐字符测量的精确光位
- `brace-expand`：弹开弹簧、clip 绑括号内缘、字距松弛**已实现**；
  运动模糊未做（Chrome 渲染 filter: blur 成本高，低配机不划算）
- 其余卡片按卡内"动效核心"主参数实现，装饰性支线（纸纹、噪点层等）未做
