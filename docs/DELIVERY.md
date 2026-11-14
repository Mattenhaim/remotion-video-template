# 交付说明

日期：2026-11-15 · 交付物：`Mattenhaim/remotion-video-template`（GitHub 公开仓库）
最终用户：刘健祥（Windows 笔记本，视频形态：纯音乐 + 屏上文字，无旁白，1920×1080、30fps、≤90 秒）

---

## 1. 底盘来源

| 项 | 内容 |
|---|---|
| 底盘仓库 | [Vincentwei1021/video-shotcraft](https://github.com/Vincentwei1021/video-shotcraft)（Apache-2.0，已核实 LICENSE 全文） |
| 取用内容 | ① 镜头卡规范（`references/shots/` 124 张，实数核对）② 节拍同步方法（`references/music-beat-sync.md`）③ 组件源码复用（见下）④ 依赖版本组合与 package-lock |
| 许可落实 | 本仓库 Apache-2.0，LICENSE 保留原作者版权行并追加本仓库版权行；复用/改编文件源码头部有 `origin:` 注释 |
| 未复用 | anything2explainer（PolyForm 非商业）、calesthio/OpenMontage、0xsline/OpenChatCut（AGPL-3.0）——按要求未搬任何代码；storytold/filmcraft、Remocn/remocn、alchaincyf/huashu-motion 仅作思路参考，未搬代码 |

**源码级复用清单**（全部 Apache-2.0，头部标注 origin）：

- `src/components/DigitRoll.tsx` ← `template/src/aifl/DigitRoll.tsx`（数字滚动，paper-title-card 副标可用）
- `src/components/SubtitleBar.tsx` ← `template/src/aifl/Caption.tsx`（改编：56px 档、调色板直连、暗场亮字；底盘注释明确 22px 信息条不能当叙事字幕）
- `src/lib/rand.ts` ← `assets/lib/helpers/rand.ts` + `motion.ts` 的 dampedSettle（mulberry32 / 闭环阻尼振荡）
- `src/lib/text.ts` 的 `*词*` 强调标记约定 ← `template/src/aifl/Main.tsx` parseWords（扩展了 CJK 按字拆分）
- `src/shots/PaperTitleCard.tsx` ← `template/src/aifl/PaperTitleCard.tsx`（改编：去主题上下文、palette 直连、中文字体栈）
- 镜头实现技法（三通道同进度、clip 绑括号内缘、波前 mask 等）← 对应镜头卡的"动效核心"章节，全部按卡规范从零实现
- `remotion.config.ts` 的 jpeg/overwrite/angle 设置与 Remotion 4.0.484 + React 19.2.7 版本组合 ← `template/`（package-lock 同步复用，npm ci 可复现）

## 2. 镜头清单（10 张，勾稽：8 内容卡 + 2 转场卡 = 10）

出处均为底盘 `references/shots/` 下的卡文件；适用场景一句话与实现程度见
[SHOT-CATALOG.md](SHOT-CATALOG.md)。

| # | 配置取值 | 出处卡 | 分类 |
|---|---|---|---|
| 1 | `shot: 'blur-slide'` | typography/blur-slide | 字体排版 |
| 2 | `shot: 'brace-expand'` | typography/brace-expand | 字体排版 |
| 3 | `shot: 'marker-underline'` | typography/marker-underline-title | 字体排版 |
| 4 | `shot: 'outline-word-fill'` | typography/outline-word-fill | 字体排版 |
| 5 | `shot: 'paper-title-card'` | typography/paper-title-card | 字体排版 |
| 6 | `shot: 'gradient-word-sweep'` | typography/gradient-word-sweep | 字体排版+光影 |
| 7 | `shot: 'spotlight-sweep'` | effects/spotlight-sweep-moves | 光影强调 |
| 8 | `shot: 'dark-flip'` | effects/aurora-bloom-bg-flip | 光影强调 |
| 9 | `transitionIn: 'push-up'` | transition/bottom-push-stack-wipe | 转场 |
| 10 | `transitionIn: 'blinds'` | transition/wipe-transitions | 转场 |

选卡原则：任务单要求的字体排版/转场/光影强调三类优先，且必须适配"纯音乐+屏上文字"
形态（不依赖录屏素材、UI 截图、图标库的卡）。`pill-slot-cycle`、`beat-cut-moves`
等列表/连闪类卡留待下一批（需要多短语或多条目的文案形态）。

## 3. 配置用法

一个视频只改 **`video.config.ts`** 一个文件：标题、四色调色板、BGM 路径、
场景序列（文案 / 镜头配方 / 期望时长 / 入场转场）、字幕条开关、时长上限。
字段说明见 README；Demo 配置存档在 `examples/attention-demo.config.ts`。

**节拍卡点**（复用底盘 music-beat-sync.md 方法）：

- `npm run beats` 用 librosa 对配置的 BGM 做节拍网格分析（beat_track → 最小二乘
  等距网格拟合 → 0.5x/1x/2x 歧义仲裁），产出 `analysis/beat_data.json`（bpm/t0/T，
  浮点秒不预取整）
- 场景边界（`durationFrames` 累加值）在 `src/timeline.ts` 吸附到最近节拍帧
  （半径半拍+2f）；吸附结果由 `npm run check` 报告
- 换曲必跑 `npm run beats`；输出音轨偏移常量 `OUTPUT_AUDIO_OFFSET_SEC` 预留
  （渲后回测发现系统性偏移时用，见 music-beat-sync §5b）

Demo 曲 cat-walk.mp3 的实测：**BPM=129.99、t0=0.7085s、T=0.461558s、网格残差
±9.2ms**（267 拍），与底盘 `assets/audio/ATTRIBUTION.md` 对同一文件记录的
~129 BPM 一致。歧义仲裁踩过一个坑：house 曲的反拍贝斯 stab 也是低频打击型短音，
仅按 kick 覆盖率会把 130 BPM 误判成 260——脚本里用"覆盖率显著更高 **且** 半拍点
低频包络能量高于整拍点"双证据规则处理（脚本内有注释记录）。

## 4. 验证记录

| 验证项 | 结果 |
|---|---|
| `npx tsc --noEmit` | 通过（0 error） |
| `npm run check` | 通过：镜头名/文件存在性/时长上限/节拍吸附全部合法 |
| Demo 渲染 | `npx remotion render src/index.ts MainVideo out/attention-demo.mp4 --concurrency=1`，**727/727 帧**渲染+编码成功（本机 Windows，chrome-headless-shell 自动下载可用） |
| ffprobe（Remotion 自带 n7.1） | Video: **h264, 1920×1080, 30 fps**；Audio: aac 48kHz stereo（仅 1 条音轨= BGM，构造上无旁白轨）；Duration: **24.28s** ≤ 90s；727f/30fps=24.23s 勾稽 ✓ |
| 音轨回测 | 抽渲出音轨重测：RMS 0.084（非静音）、BPM 129.96 ≈ 源分析 129.99（渲染链路未变调） |
| 场景边界吸附 | 5 个边界全部吸附到拍（拍号 7→19→31→43→51，间隔整 12 拍），727f ≈ 24.2s |
| 全卡验证 | `examples/shot-catalog-test.config.ts`（8 内容卡逐一出画面 + push-up/blinds 各两次）**1157/1157 帧**渲染成功（38.61s，同规格 ffprobe 通过），8/8 卡画面目检通过 |
| 关键帧目检 | 抽帧目检 20+ 帧：括号揭示/上推转场/百叶窗/压暗翻转/聚光/压印收束均正确；发现并修复 6 个问题（见 §5），修复后逐项复检通过 |

## 5. 首版渲染发现并修复的问题（抽帧目检抓出的）

1. **z 序逃逸**：brace-expand 括号带 `zIndex:1`，而 Remotion 的 Sequence 不产生
   DOM 包装，括号穿透到下一场景的 push-up 面板之上 → 每个场景包
   `isolation:'isolate'` 容器
2. **blinds 缝隙露空底**：新场景内容原排在 `from=K` 的嵌套 Sequence 里，转场窗内
   未渲染，波扫开的缝隙露出空底色 → 内容时钟统一从转场窗起点起算（内容钉在色底
   坐标系里随底色走，正是 bottom-push 卡的语义）
3. **push-up 缓动失真**：bezier(0.3,0,0.16,1) 实际是"前段快后段缓"，与卡片"物理
   推入"不符 → 改标准 easeOutCubic、18f→26f 贴卡参数
4. **孤字换行**：blur-slide 固定 96px 时 15 字文案溢出，末字独行 →
   `fitLineSize()` 按 em 宽估算自适应字号（字幕条同款处理；第二版仍溢出的根因是
   容器宽度按 1560px 估算而实际 flex content-box 只有 ≈1385px，已按实测修正）
5. **字幕条与开场标题重复**：Demo 首场景 `subtitle: ''`，空字幕条不渲染
6. **马克笔下划线缩成细线**：marker-underline 的笔形路径 x 坐标按 0–1 生成而
   viewBox 宽 100，笔形被压成 viewBox 最左 1% 的细竖条 → 坐标改按 100 缩放

## 6. 已知限制（如实）

- **BGM 不随仓库分发**：音频授权是 Mixkit 免费商用（可商用、免署名），但为稳妥
  起见仓库不含音频文件；`public/bgm/README.md` 给出 Demo 曲官方直链，克隆后一条
  curl 即可复现 Demo。用户换成自己的曲子后跑 `npm run beats`
- **节拍歧义仲裁是简化版**：底盘 §3 的完整验收（match≥98%、mean<10ms、漂移
  回归、click 轨听感复核）未全部实现；对机器鼓点的电子曲够用，变速曲/复杂编曲
  需人工按 music-beat-sync §6 复核
- **渲后逐切点回测未做全**：§5b 的"设计切点帧 vs 最近测得拍帧"逐点误差表未实现，
  只做了 BPM 一致性回测（129.96 vs 129.99）
- **10 张卡是简化实现**（详见 SHOT-CATALOG.md 末节）：gradient-word-sweep 的
  闪电为单条折线简化版；brace-expand 无方向性运动模糊；spotlight-sweep 的点亮
  时序按 token 序号排布（不逐字符测光位）；装饰性支线（纸纹、噪点层）未做
- **字幕条超长句自动缩字号至 34px 下限**，再长会截断（用户文案应一句话 ≤30 字）
- **仅测 Windows**：渲染验证在本机 Windows 10 + Node 24 完成；macOS/Linux 未测
- Remotion 本身的许可：公司规模达到阈值需向 Remotion 购买授权（见其 LICENSE）
- `durationFrames` 是期望值，实际时长以节拍吸附后为准（±半拍内浮动），`npm run
  check` 会打印换算结果

## 7. 交付物位置

- GitHub 仓库：https://github.com/Mattenhaim/remotion-video-template （Apache-2.0）
- Demo 成片：本机 `E:\GLM\remo-tpl\remotion-video-template\out\attention-demo.mp4`
  （24.28s，2.5MB）+ 全卡验证片 `out/shot-catalog-test.mp4`
- 用户侧使用：拉仓库到笔记本 E 盘 → `npm ci` → 放 BGM → 改 `video.config.ts` →
  `npm run beats && npm run check && npm run render`（--concurrency=1 已内置）
