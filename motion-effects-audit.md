# 动效素材扩展采集 · 审计报告

日期：2026-11-15 · 交付分支：`motion-effects-expansion`（基于 main，未动 main）

---

## 1. 执行摘要

| 指标 | 数值 |
|---|---|
| 粗收集 | **130 条**（初始候选 115 + 过程追加 15：remotion-dev 官方仓库 8、ScrambleText 1、license 页 1、@remotion/skia/gif/motion-blur 原理页 3、官方示例 2） |
| 有效入库（A 层） | **114 条** |
| 待复查 | **8 条** |
| 剔除 | **8 条** |
| 库内 name/url 重复 | 0 |
| **勾稽** | **130 = 114 + 8 + 8 + 0 ✓** |
| 6 类收录 | Remotion 配方 28 · 文字动效 22 · 转场 14 · 镜头运动 15 · 缓动与节奏 13 · 动画库与预设 22 —— **全部 ≥10 达标，无未达标类别** |
| B 层配方 | **22 个**（motion-recipes.md），全部有 A 层来源条目 |
| 渲染小样 | **5 个**（sample1–5.mp4，1920×1080、30fps、6.06–8.04s，本地不进仓） |

## 2. 验证方法

**每条入库前实际打开核验**，按来源三类：

1. **GitHub 仓库**：`api.github.com/repos/{slug}`（认证读公开元数据）——description / stars / pushed_at / license.spdx_id / language 全部为 API 原文；CSV 的 url 指向 `github.com/{full_name}`。
2. **npm 包**：`registry.npmjs.org/{pkg}`——description / license / repository 为注册表原文。npmjs.com 网页对本机 IP 返回 403 反爬（两次、带浏览器 UA 亦然），故 npm 条目的 url 填实际核验源 `registry.npmjs.org/...`，notes 已注明。
3. **文档/官网**：HTTP GET 实抓页面 `<title>` 与 `og:description` 原文；抓取失败或页面为人机验证拦截页的一律不入有效库。

**分批机器审**（audit.mjs，三批）：链接可达复核（GitHub 条目逐条重拉 API、站点条目重 GET）、13 列结构、关键字段非空、remotion_fit 合法值、name/url 库内去重、stars 与 API 实时值核对（高星库在核验窗口自然涨星 ±1–2，就地刷新 CSV 并记录——刷新本身即数据鲜活的证据）。

## 3. 计数勾稽表

```
粗收集 130
  = 初始候选 115
  + 过程追加 15
剔除 8
  = 仓库不存在 2（remotion-dev/templates、ai/easings）
  + 文档页不存在 5（useAnimationFrame、@remotion/transitions presets、Animation techniques guide、Remotion+、@remotion/curves）
  + 文档改版 404 1（GSAP CustomEase，多种 URL 变体探测均 404）
  ※ 另有 3 条候选仓库 404 但**替代收录**（不计剔除）：Odometer→HubSpot/odometer、GL Transitions→gl-transitions/gl-transitions、hover-effect→akella/webGLImageTransitions；typewriter-effect→kevoese/react-typewriter-effect、Blotter→bradley/Blotter、baffle→camwiegert/baffle、Splitting.js→shshaw/Splitting、vanilla-tilt→vanilla-tilt.js、curtains.js→curtainsjs、tailwindcss-animate→jamiebuilds/tailwindcss-animate、Open Props→argyleink/open-props、AnimXYZ→ingram-projects/animxyz、@swup/slide-plugin→swup/slide-theme 同理（原 slug 错误，修正后核验通过）
待复查 8
  = 站点连接失败 3（bennettfeely.com/clippy TLS+503、developer.chrome.com 超时、tunebat.com 超时）
  + 信息不全 2（remotion-dev/3d-text、remotion-dev/gl-transitions：README 为模板样板文、API 无简介、画廊无条目）
  + Cloudflare 人机验证 3（codepen soulwire、LottieFiles、LottieFiles Free Animations：两次访问只见"Just a moment..."，从未核验到真实内容）
有效 114 = 130 − 8 − 8 − 0（库内去重）  ✓
```

> 铁律执行记录：早期版本曾把 HTTP 200 但内容为 "Page Not Found" 的 remotion.dev 页
> （8 条）与 motion.dev 404（2 条）误当有效——**404 内容扫描**抓出后逐条探测真实
> URL（4 条修正：TransitionSeries→/docs/transitions、measureSpring→/docs/measure-spring、
> 确定性随机指南→/docs/using-randomness、AnimatePresence→/docs/animate-presence），
> 无法修正的剔除或待复查。终版 CSV 经 `/Page Not Found|page not found/i` 扫描 = 0 残留。

## 4. 分批机器审结果（audit.mjs，终版）

| 批次 | 行数 | 链接复核 | issues |
|---|---|---|---|
| 1–50 | 50 | 逐条可达 | **0** |
| 51–100 | 50 | 逐条可达（2 条 stars 就地刷新） | **0** |
| 101–114 | 14 | 逐条可达 | **0** |
| 合计 | 114 | — | **0 issues，2 stars 刷新** |

## 5. 与已有库的去重说明

| 基准 | 状态 | 处理 |
|---|---|---|
| 模板现有 10 张卡（blur-slide 等） | 已读 README/DELIVERY/SHOT-CATALOG/video.config.ts 确认 | 本次候选全部为**外部资源**（库/文档/工具），无一条是模板卡本体，无重叠 |
| shotcraft 124 张卡 | 本地清单逐名核对（124 张，见采集时导出清单） | 候选资源与卡处于不同层（124 卡是动效手法规范，本库是资源与工具）；无一条为卡本体或其复刻 |
| `Mattenhaim/code-video-projects`（138 行 CSV） | **仓库 404 不可达**：认证视角（含私有与 collaborator）的仓库列表无此仓库，GitHub 全局搜索无同名公共仓 | **未能去重**。审计种子（GSAP/Lottie 等 6 库）已单独按"别处出处"原则处理：6 库均不在 shotcraft 124 卡与模板卡中，故收进有效库；若 138 行库日后可访问，需对全库 114 条补跑一次 URL/名称去重 |
| Luna 分支 `luna-code-video-resources-expansion` | 依赖上述仓库，同样不可达 | **未与 Luna 扩展去重，待其回件后补查**（任务单预案内情形） |
| Antigravity 中文动态字体系统 | **已交付**：`Mattenhaim/chinese-kinetic-type-system`（MIT，README 核验）——含排版规则 + 6 大配方（CharReveal / LineSlidePause / KeywordPunch / HighlightSweep / NumberCounter / TypewriterText） | 中文排版专属规则（字号/断行/描边/留白）**一律未收**；功能等价的中文配方未重复实现；通用/英文对照库（countUp.js、Odometer、Typed.js、TypeIt、typewriter-effect）照收，notes 逐条标注"Antigravity 已有对应中文配方"；模板现有 highlight 类实现沿用底盘卡，未新增 |

## 6. 审计种子自校验（任务单 §二）

| 种子 | 状态 | 位置 |
|---|---|---|
| Framer Motion | ✓ 有效库 | `Motion (Framer Motion)`（github.com/motiondivision/motion，⭐35199） |
| GSAP | ✓ 有效库 | `GSAP`（greensock/GSAP，⭐30672，license 为 npm registry 原文 "Standard 'no charge' license"） |
| Lottie | ✓ 有效库 | `lottie-web`（airbnb/lottie-web）+ `LottieFiles`（域名条目在待复查，但 lottie-web 与 @remotion/lottie 双条目在有效库） |
| Rive | ✓ 有效库 | `Rive`（rive.app）+ `Rive Community` |
| Motion One | ✓ 有效库 | `Motion for JS (原 Motion One)`（motion.dev/docs/quick-start；Motion One 品牌已并入 Motion，原独立站不可达，notes 已说明谱系） |
| Anime.js | ✓ 有效库 | `Anime.js`（juliangarnier/anime，⭐74711） |

6/6 全部落在有效库，自校验通过。

## 7. 许可边界执行

- **AGPL-3.0**（Essentia）、**GPL-3.0**（aubio）：remotion_fit 一律"仅借鉴思路"，notes 明确"不搬代码"
- **Robert Penner Easing**：非 OSI 自定义许可 → 仅借鉴思路
- **MIT / ISC / BSD / Apache-2.0** 库共 46 条：remotion_fit 可为"需改写"（时间驱动→帧驱动的适配）
- 本次交付**未复制任何第三方代码进模板**；B 层配方全部为按语义重写的帧号驱动实现
- Remotion 自身许可（个人/小公司免费商用、规模公司授权）已单列条目并引 LICENSE.md 原文

## 8. 已知问题清单（如实）

1. **code-video-projects 138 行库与 Luna 分支未去重**（仓库 404）——最大未决项，回件后需补查 114 条
2. 8 条待复查未入有效库（3 连接故障 + 2 信息不全 + 3 Cloudflare 拦截），URL 均真实、复核通过后可入
3. `license=未知` 53 条：文档页/工具站无许可证声明的如实标注（GitHub 条目的许可证均有 API 原文；NOASSERTION 8 条为仓库 LICENSE 文件 GitHub 未识别，照实标注）
4. `free_or_paid=未知` 41 条：官网无明示价格口径的如实标注
5. 高星库 stars 在核验与审计窗口间自然漂移 ±1–2（已建立"就地刷新"机制并在审计批次中记录）
6. B 层 22 个配方中 17 个为代码草图（未渲染）；5 个已渲染小样在本地 `out/samples/` 与 `samples/` 源码目录，按任务要求**未推送进仓库**
7. 部分条目 description 为页面 og:description/元数据原文，个别页面（如 GSAP SplitText）其官方 meta 本身较短，照抄未润色

## 9. 交付物

| 文件 | 说明 |
|---|---|
| `motion-effects-library.csv` | 有效库 114 条，13 列 |
| `motion-effects-pending.csv` | 待复查 8 条，13 列，notes 注明未通过原因 |
| `motion-recipes.md` | 22 个配方（5 个已渲染小样验证） |
| `motion-effects-audit.md` | 本报告 |
