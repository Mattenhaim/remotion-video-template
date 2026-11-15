# 动效配方库（motion-recipes）

> 22 个可直接用于 `Mattenhaim/remotion-video-template` 的动效配方，全部派生自
> [motion-effects-library.csv](motion-effects-library.csv) 已核验条目（无凭空编造）。
> 全部**帧号驱动**（`useCurrentFrame` / `interpolate` / `spring`），**无 CSS `transition`**。
>
> 标注 ✅ 的 5 个配方已做 5–10 秒 1920×1080@30fps 渲染小样（本地 `out/samples/`，
> 不入库，ffprobe 核验记录见 [motion-effects-audit.md](motion-effects-audit.md)）。
> 小样源码在仓库本地 `samples/` 目录（同样不入库）。

使用约定：配方代码草图中的常量（颜色/字号/时长）按模板 `video.config.ts` 的
palette 与 30fps 约定书写；引入模板时放进 `src/shots/` 并注册进
`SHOT_REGISTRY`，配 `SceneProps`（text/subtext/duration/palette）即可被配置驱动。

---

## R1 弹入落定（spring-pop-in）

- **类别**：Remotion 配方（spring 物理动画）
- **适用场景**：词卡/徽章/角标的入场落定；卡点上的元素登场
- **帧数范围与关键参数**：入场 12–24f（damping 12–14 / stiffness 120–130，一次可见过冲 ≈9%）；落定后静止
- **来源**：[spring()](https://www.remotion.dev/docs/spring) · [measureSpring()](https://www.remotion.dev/docs/measure-spring)（A 层 Remotion 配方类）
- **代码草图**：

```tsx
const pop = spring({ frame: frame - 14, fps, config: { damping: 14, stiffness: 130 } });
<div style={{ transform: `scale(${0.6 + 0.4 * pop}) translateY(${(1 - pop) * 40}px)`, opacity: Math.min(1, pop * 2) }} />
```

## R2 打字机 + 光标（typewriter-caret）✅

- **类别**：文字动效（打字机）
- **适用场景**：一句主张的"正在被写出来"感；机器口吻播报
- **帧数范围与关键参数**：每字 3–4f；光标 `frame % 8 < 5`；写完后光标变强调色并加辉光
- **来源**：[Typed.js](https://github.com/mattboldt/typed.js) · [GSAP TextPlugin](https://gsap.com/docs/v3/Plugins/TextPlugin/) · [TypeIt](https://typeitjs.com) · [typewriter-effect](https://github.com/kevoese/react-typewriter-effect)（A 层文字动效类；Antigravity 中文系统另有 TypewriterText 中文配方）
- **已渲染小样** ✅ `sample2.mp4`（8.04s，句子「信息已经免费且过剩」）
- **代码草图**：

```tsx
const chars = Array.from(text);
const shown = Math.round(interpolate(frame, [24, 24 + chars.length * 4], [0, chars.length], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }));
<span>{chars.slice(0, shown).join('')}</span>
<span style={{ opacity: frame % 8 < 5 ? 1 : 0, width: 8, height: fontSize * 0.95, backgroundColor: accent }} />
```

## R3 乱码解码（scramble-decode）✅

- **类别**：文字动效（乱码解码）
- **适用场景**：技术感开场、信息"破译"叙事；标题逐字凝固
- **帧数范围与关键参数**：每字符 settle 间隔 3–6f；未凝固字符按 `bucket = floor(frame/3)` 换字符池随机字符（`random(seed+bucket)` 确定性）；凝固前 opacity 0.45–1 渐升
- **来源**：[ScrambleText (yomotsu)](https://github.com/yomotsu/ScrambleText) · [Baffle.js](https://github.com/camwiegert/baffle) · [ScrambleText 条目说明](https://registry.npmjs.org/glitched-writer)（A 层文字动效类）
- **已渲染小样** ✅ `sample1.mp4`（8.04s，标题「注意力」+ 句子①解码）
- **代码草图**：

```tsx
const rnd = mulberry32(seed * 131 + Math.floor(frame / 3));
const shown = frame < settleAt ? POOL[Math.floor(rnd() * POOL.length)] : ch;
```

## R4 数字滚动（digit-roll）

- **类别**：文字动效（数字滚动）
- **适用场景**：数据揭晓；Antigravity 已有中文等宽数字滚动配方（NumberCounter），本配方为其通用对照实现
- **帧数范围与关键参数**：每位延迟 i×4f，滚动窗 22f，滚过一整条数字带再落位
- **来源**：[countUp.js](https://github.com/inorganik/countUp.js) · [Odometer (HubSpot)](https://github.com/HubSpot/odometer) · [react-animated-numbers](https://github.com/heyman333/react-animated-numbers)（A 层文字动效类）
- **代码草图**：模板 `src/components/DigitRoll.tsx` 已实现同款（底盘复用组件），直接引用。

## R5 跑马灯横滚（marquee-lower-third）

- **类别**：文字动效（跑马灯）
- **适用场景**：底部滚动标语、下三分条信息带；长度超过一屏的短语循环
- **帧数范围与关键参数**：translateX = interpolate(frame, [0, duration], [0, -loopWidth])，loopWidth = 文字实宽；无缝循环需文案重复两份
- **来源**：[react-fast-marquee](https://github.com/justin-chu/react-fast-marquee)（A 层文字动效类）
- **代码草图**：

```tsx
const x = interpolate(frame, [0, duration], [0, -textWidth]);
<AbsoluteFill style={{ display: 'flex', transform: `translateX(${x}px)` }}>
  <span>{text}</span><span>{text}</span>
</AbsoluteFill>
```

## R6 逐词强调链（stagger-word-emphasis）

- **类别**：文字动效（逐词入场+强调色）
- **适用场景**：一句话里按节奏点亮多个词；与节拍网格对齐时每词落在拍上
- **帧数范围与关键参数**：词 i 起始 = 6 + i×2f，收敛 14f（y 24px→0 + opacity）
- **来源**：[Splitting.js](https://github.com/shshaw/Splitting) · [SplitType](https://registry.npmjs.org/split-type) · [GSAP SplitText](https://gsap.com/docs/v3/Plugins/SplitText/) · [Moving Letters](https://tobiasahlin.com/moving-letters/)（A 层文字动效类）
- **代码草图**：

```tsx
tokens.map((tk, i) => {
  const p = interpolate(frame, [6 + i * 2, 6 + i * 2 + 14], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  return <span style={{ opacity: p, transform: `translateY(${(1 - p) * 24}px)`, color: tk.accent ? palette.accent : undefined }}>{tk.text}</span>;
})
```

## R7 路径描画揭示（path-draw-reveal）✅

- **类别**：转场/镜头运动（路径描画）
- **适用场景**：手写感下划线、箭头引导、关系连线；路径终点弹出词卡
- **帧数范围与关键参数**：描画 40–60f（ease-out cubic）；`strokeDasharray = L`、`strokeDashoffset = L × (1-t)`；终点元素 spring 落位（frame-62）
- **来源**：[@remotion/paths evolvePath](https://www.remotion.dev/docs/paths/evolve-path) · [GSAP MotionPathPlugin](https://gsap.com/docs/v3/Plugins/MotionPathPlugin/)（A 层 Remotion 配方/镜头运动类）
- **已渲染小样** ✅ `sample3.mp4`（6.06s，S 曲线描画 + 词卡弹出）
- **代码草图**：

```tsx
const drawT = interpolate(frame, [10, 58], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
<path d={d} strokeDasharray={L} strokeDashoffset={L * (1 - drawT)} />
```

## R8 噪声漂移（noise-drift）

- **类别**：镜头运动（有机漂移）
- **适用场景**：背景纹理呼吸、元素微漂（伪手持感）；模板已有 handheld() 正弦近似，本配方用真 Perlin 噪声
- **帧数范围与关键参数**：noise2D(x=frame×0.004, seed) × 幅度 12–24px；频率越低漂移越"呼吸"
- **来源**：[@remotion/noise](https://www.remotion.dev/docs/noise)（A 层 Remotion 配方类）
- **代码草图**：

```tsx
import { noise2D } from '@remotion/noise';
const x = noise2D('drift', frame * 0.004, 0) * 18;
const y = noise2D('drift', 0, frame * 0.004) * 12;
<div style={{ transform: `translate(${x}px, ${y}px)` }} />
```

## R9 确定性随机抖动（deterministic-shake）

- **类别**：镜头运动（震动）
- **适用场景**：冲击帧的震屏；注意模板 aesthetic 规则——整画面冲击全片 ≤3 处
- **帧数范围与关键参数**：命中后 8–12f 内衰减；幅度 `random(seed + bucket) × amp × decay`
- **来源**：[Deterministic randomness guide](https://www.remotion.dev/docs/using-randomness) · [random()](https://www.remotion.dev/docs/random)（A 层 Remotion 配方类）
- **代码草图**：

```tsx
const decay = Math.exp(-(frame - hitFrame) * 0.25);
const dx = frame > hitFrame ? (random(`sx${Math.floor(frame / 2)}`) * 2 - 1) * 18 * decay : 0;
```

## R10 颜色插值呼吸（color-pulse）

- **类别**：缓动与节奏（颜色动效）
- **适用场景**：强调色呼吸、暗场文字辉光脉动（模板 spotlight-sweep 的稳态段可用）
- **帧数范围与关键参数**：`interpolateColors(frame, [0, 45, 90], [ink, accent, ink])`；周期与 BPM 对齐时 1 周期 = 2 拍
- **来源**：[interpolateColors()](https://www.remotion.dev/docs/interpolate-colors)（A 层 Remotion 配方类）
- **代码草图**：

```tsx
const color = interpolateColors(frame, [0, 45, 90], [palette.text, palette.accent, palette.text]);
<span style={{ color, textShadow: `0 0 26px ${color}` }} />
```

## R11 时间冻结定格（freeze-frame）

- **类别**：缓动与节奏（时间控制）
- **适用场景**：长镜头中"停一拍给人看"（定格标注）；配合 FlashCut 类闪白
- **帧数范围与关键参数**：`<Freeze frame={frozenFrame}>` 包住需要定格的子树；定格段 ≥45f
- **来源**：[\<Freeze\>](https://www.remotion.dev/docs/freeze)（A 层 Remotion 配方类）
- **代码草图**：

```tsx
<Freeze frame={120}><ComplexScene /></Freeze>
```

## R12 拍网格切点（beat-grid-cut）

- **类别**：缓动与节奏（节拍同步）
- **适用场景**：场景边界吸附 BGM 节拍——模板 `src/timeline.ts` 已实现本配方（librosa 离线网格 → `nearestBeatFrame` 吸附）
- **帧数范围与关键参数**：`beatFrame(n) = round((t0 + n×T) × 30)`；吸附半径半拍+2f；`OUTPUT_AUDIO_OFFSET_SEC` 供渲后回测修正
- **来源**：[librosa](https://github.com/librosa/librosa) · [madmom](https://github.com/CPJKU/madmom) · [SongBPM](https://songbpm.com/)（A 层缓动与节奏类）
- **代码草图**：见模板 `src/timeline.ts`（已投产）。

## R13 高亮扫过（highlight-sweep）

- **类别**：文字动效（高亮划过）
- **适用场景**：关键词底色从左到右横扫铺满、扫过处反色；**Antigravity 已有 HighlightSweep 中文配方**，本条为通用对照实现
- **帧数范围与关键参数**：底色块 scaleX 0→1，8–12f，ease-out；文字颜色同步反白
- **来源**：[Animista](https://animista.net) · [Animate.css](https://github.com/animate-css/animate.css)（A 层动画库与预设类，CSS keyframes 语义帧号化）
- **代码草图**：

```tsx
const w = interpolate(frame, [8, 20], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
<span style={{ position: 'relative' }}>
  <span style={{ position: 'absolute', inset: '-2px -6px', background: accent, transform: `scaleX(${w})`, transformOrigin: 'left' }} />
  <span style={{ position: 'relative', color: w > 0.9 ? palette.bg : palette.text }}>{word}</span>
</span>
```

## R14 故障切片 + RGB 分离转场（glitch-slice-rgb）✅

- **类别**：转场（glitch）
- **适用场景**：高能换页、数字故障语义；句子 A → 句子 B 的 16–24f 破碎切换
- **帧数范围与关键参数**：转场窗 16–24f；8–12 条横带，`clipPath: inset(top% 0 bottom% 0)`，带内 `translateX = (random-0.5) × 90 × sin(phase·π)`；文字 `textShadow = ±rgbSplit px 红/蓝`
- **来源**：[GL Transitions](https://gl-transitions.com/) · [GL Transitions (GitHub)](https://github.com/gl-transitions/gl-transitions) · [FFmpeg xfade](https://ffmpeg.org/ffmpeg-filters.html#xfade) · [WebGL Image Transitions (akella)](https://github.com/akella/webGLImageTransitions)（A 层转场类）
- **已渲染小样** ✅ `sample4.mp4`（8.04s，句子②→③，窗口帧目检 RGB 分离+切片错位到位）
- **代码草图**：见小样 `samples/S4_GlitchSliceRGB.tsx`。

## R15 推入转场（push-panel-transition）

- **类别**：转场（滑动）
- **适用场景**：换章骨架（模板 push-up 转场卡已实现本配方的 26f 版）
- **帧数范围与关键参数**：新场景面板 `translateY((1-p)×100%)`，p = easeOutCubic，18–30f，落点在拍
- **来源**：[Swup Slide Theme](https://github.com/swup/slide-theme) · [Embla Carousel](https://github.com/davidjerleke/embla-carousel) · [@remotion/transitions](https://www.remotion.dev/docs/transitions)（A 层转场/Remotion 配方类）
- **代码草图**：见模板 `src/transitions/index.tsx` PushUpEntrance（已投产）。

## R16 遮罩揭开转场（mask-reveal-transition）

- **类别**：转场（遮罩）
- **适用场景**：异形遮罩（圆形/多边形）从焦点炸开或从边缘扫过；遮罩形状来自 Clippy 参数表
- **帧数范围与关键参数**：`clipPath: circle(r% at x y)`，r: 0→150%，12–20f；或 inset 四边依次收
- **来源**：[View Transitions API (MDN)](https://developer.mozilla.org/en-US/docs/Web/API/View_Transition_API) · [Motion AnimatePresence](https://motion.dev/docs/animate-presence) · [Swup Overlay Theme](https://github.com/swup/overlay-theme)（A 层转场类）
- **代码草图**：

```tsx
const r = interpolate(frame, [0, 18], [0, 150], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
<AbsoluteFill style={{ clipPath: `circle(${r}% at 50% 45%)` }}>{nextScene}</AbsoluteFill>
```

## R17 分层视差倾斜（parallax-tilt-layers）✅

- **类别**：镜头运动（2.5D 视差）
- **适用场景**：论点句 + 前景词牌的纵深构图；倾斜角确定性扫动（模板无指针交互）
- **帧数范围与关键参数**：三层 depth 6/16/34；`layerShift(d) = -sin(tiltRad)×d`；tilt -7°→+7° 扫动 184f；镜头缓推 scale 1→1.07
- **来源**：[react-parallax-tilt](https://github.com/mkosir/react-parallax-tilt) · [Atropos](https://github.com/nolimits4web/atropos) · [vanilla-tilt.js](https://github.com/micku7zu/vanilla-tilt.js)（A 层镜头运动类）
- **已渲染小样** ✅ `sample5.mp4`（8.04s，三层视差+缓推，抽帧目检分层位移正常）
- **代码草图**：见小样 `samples/S5_ParallaxTiltCamera.tsx`。

## R18 相机推轨 + 运动模糊（dolly-motion-blur）

- **类别**：镜头运动（推拉+模糊）
- **适用场景**：强调段落的快速推近；Trail 拖影让位移动效更"实"
- **帧数范围与关键参数**：scale interpolate 1→1.18 over 20f（ease-in）；位移元素包 `<Trail>`（官方包）或自算速度方向残影
- **来源**：[@remotion/motion-blur Trail](https://www.remotion.dev/docs/motion-blur/trail) · [@remotion/motion-blur 原理页](https://www.remotion.dev/docs/motion-blur)（A 层 Remotion 配方类）
- **代码草图**：

```tsx
import { Trail } from '@remotion/motion-blur';
<Trail layers={6} initialPosition={[0, 0]} finalPosition={[x, 0]}>{<Card />}</Trail>
```

## R19 3D 相机推轨（three-camera-dolly）

- **类别**：镜头运动（3D 场景）
- **适用场景**：2.5D 页面相机的真 3D 版；字卡阵列纵深穿行
- **帧数范围与关键参数**：`useThree` 相机 position.z = interpolate(frame, [0, 90], [9, 5.2])；fov 45；元素 z 间隔 ≥0.8
- **来源**：[@remotion/three](https://www.remotion.dev/docs/three) · [react-three-fiber](https://github.com/pmndrs/react-three-fiber) · [camera-controls](https://github.com/yomotsu/camera-controls)（A 层镜头运动类）
- **代码草图**：

```tsx
import { Three } from '@remotion/three'; // 官方桥接包（组合用法见其文档）
useFrame 场景内：camera.position.z = interpolate(frame, [0, 90], [9, 5.2]);
```

## R20 布局状态翻转（flip-match-cut）

- **类别**：转场（match-cut 类）
- **适用场景**：同一元素在两个构图间的连续变换（"这张卡从左侧格子飞到中央"）
- **帧数范围与关键参数**：手算首末帧的 x/y/scale/rotate，用一条 spring 串起四通道；18–30f
- **来源**：[GSAP Flip](https://gsap.com/docs/v3/Plugins/Flip/) · [AutoAnimate](https://github.com/formkit/auto-animate)（A 层转场/动画库类）
- **代码草图**：

```tsx
const from = { x: -560, y: 120, s: 0.6 }, to = { x: 0, y: 0, s: 1 };
const p = spring({ frame: frame - enter, fps, config: { damping: 14, stiffness: 110 } });
<div style={{ transform: `translate(${interpolate(p, [0, 1], [from.x, to.x])}px, …) scale(${interpolate(p, [0, 1], [from.s, to.s])})` }} />
```

## R21 缓动曲线对照实验（ease-ab）

- **类别**：缓动与节奏（缓动选型）
- **适用场景**：给一支新片定"手感"——同一动作分别用 easeOutCubic / back-out / spring 三版并排渲染对比
- **帧数范围与关键参数**：同一 20f 位移窗；back-out 过冲 ≈10%（Easing.bezier(0.34, 1.56, 0.64, 1)），spring damping 12
- **来源**：[easings.net](https://easings.net/) · [cubic-bezier.com](https://cubic-bezier.com/) · [GSAP Eases](https://gsap.com/docs/v3/Eases/) · [bezier-easing](https://github.com/gre/bezier-easing) · [d3-ease](https://github.com/d3/d3-ease) · [Robert Penner Easing](https://robertpenner.com/easing/)（A 层缓动与节奏类）
- **代码草图**：

```tsx
const pCubic = interpolate(frame, [0, 20], [0, 1], { easing: Easing.out(Easing.cubic) });
const pBack  = interpolate(frame, [0, 20], [0, 1], { easing: Easing.bezier(0.34, 1.56, 0.64, 1) });
const pSpring = spring({ frame, fps, config: { damping: 12, stiffness: 120 } });
```

## R22 形状生成本地化（shapes-morph）

- **类别**：转场（形状变形）
- **适用场景**：圆→方→三角的几何呼吸背景；KUTE.js 的 SVG 补间语义的帧号化
- **帧数范围与关键参数**：`interpolatePoints(A, B, t)` 逐点插值生成 `<polygon points>`；周期 60–90f
- **来源**：[@remotion/shapes](https://www.remotion.dev/docs/shapes) · [KUTE.js](https://github.com/thednp/kute.js)（A 层 Remotion 配方/动画库类）
- **代码草图**：

```tsx
const pts = shapeA.map((p, i) => ({ x: interpolate(t, [0, 1], [p.x, shapeB[i].x]), y: … }));
<polygon points={pts.map(p => `${p.x},${p.y}`).join(' ')} fill={rgba(accent, 0.12)} />
```

---

## 配方来源勾稽

| 配方 | A 层条目数 | 渲染小样 |
|---|---|---|
| R1–R22 | 每个配方 1–4 条，全部存在于 motion-effects-library.csv | S1=R3、S2=R2、S3=R7、S4=R14、S5=R17 |
| 合计 | 22 个配方 | 5 个已渲染验证 |

未渲染配方（17 个）均为代码草图状态，标注了来源条目；投产前按模板 shot-card 结构补全参数表并逐个出小样。
