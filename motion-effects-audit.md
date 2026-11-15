# 动效素材扩展采集 · 审计报告

日期：2026-11-15（首次交付）· **2026-11-16 独立复核修正（见 §10）** · 交付分支：`motion-effects-expansion`（基于 main，未动 main）

---

## 1. 执行摘要

| 指标 | 数值 |
|---|---|
| 粗收集 | **130 条**（初始候选 115 + 过程追加 15：remotion-dev 官方仓库 8、ScrambleText 1、license 页 1、@remotion/skia/gif/motion-blur 原理页 3、官方示例 2） |
| 有效入库（A 层） | **109 条**（2026-11-16 复核：与 138 行 code-video-projects 库去重移除 5 条后） |
| 待复查 | **8 条** |
| 剔除 | **8 条** |
| 去重 | 库内 name/url 重复 0；**与 138 行库去重 5**（GSAP、Theatre.js、Motion Canvas、Remotion Audiogram template、Remotion TikTok Captions template） |
| **勾稽** | **130 = 109 + 8 + 8 + 5 ✓** |
| 6 类收录 | Remotion 配方 27 · 文字动效 21 · 转场 14 · 镜头运动 15 · 缓动与节奏 13 · 动画库与预设 19 —— **全部 ≥10 达标，无未达标类别** |
| B 层配方 | **22 个**（motion-recipes.md），全部有 A 层来源条目（2026-11-16 复核：57 条来源链接逐一比对有效库 = 0 缺失） |
| 渲染小样 | **5 个**（sample1–5.mp4，1920×1080、30fps、6.06–8.04s，本地不进仓；2026-11-16 ffprobe 复核通过） |

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
去重 5（2026-11-16 补做，见 §10）
  = 与 code-video-projects 138 行库 URL 重复：GSAP（greensock/GSAP）、Theatre.js（theatre-js/theatre）、
    Motion Canvas（motion-canvas/motion-canvas）、Remotion Audiogram template（remotion-dev/template-audiogram）、
    Remotion TikTok Captions template（remotion-dev/template-tiktok）——URL 或项目名重复一律不收
剔除 8
  = 仓库不存在 2（remotion-dev/templates、ai/easings）
  + 文档页不存在 5（useAnimationFrame、@remotion/transitions presets、Animation techniques guide、Remotion+、@remotion/curves）
  + 文档改版 404 1（GSAP CustomEase，多种 URL 变体探测均 404）
  ※ 另有 3 条候选仓库 404 但**替代收录**（不计剔除）：Odometer→HubSpot/odometer、GL Transitions→gl-transitions/gl-transitions、hover-effect→akella/webGLImageTransitions；typewriter-effect→kevoese/react-typewriter-effect、Blotter→bradley/Blotter、baffle→camwiegert/baffle、Splitting.js→shshaw/Splitting、vanilla-tilt→vanilla-tilt.js、curtains.js→curtainsjs、tailwindcss-animate→jamiebuilds/tailwindcss-animate、Open Props→argyleink/open-props、AnimXYZ→ingram-projects/animxyz、@swup/slide-plugin→swup/slide-theme 同理（原 slug 错误，修正后核验通过）
待复查 8
  = 站点连接失败 3（bennettfeely.com/clippy TLS+503、developer.chrome.com 超时、tunebat.com 超时；2026-11-16 复核 4 轮重试仍不可达，维持待复查）
  + 信息不全 2（remotion-dev/3d-text、remotion-dev/gl-transitions：README 为模板样板文、API 无简介；2026-11-16 复核 API description 仍为 null，维持待复查）
  + Cloudflare 人机验证 3（codepen soulwire、LottieFiles、LottieFiles Free Animations：两次访问只见"Just a moment..."，从未核验到真实内容）
有效 109 = 130 − 5 − 8 − 8  ✓
```

> 铁律执行记录：早期版本曾把 HTTP 200 但内容为 "Page Not Found" 的 remotion.dev 页
> （8 条）与 motion.dev 404（2 条）误当有效——**404 内容扫描**抓出后逐条探测真实
> URL（4 条修正：TransitionSeries→/docs/transitions、measureSpring→/docs/measure-spring、
> 确定性随机指南→/docs/using-randomness、AnimatePresence→/docs/animate-presence），
> 无法修正的剔除或待复查。终版 CSV 经 `/Page Not Found|page not found/i` 扫描 = 0 残留。

## 4. 分批机器审结果（audit.mjs）

**首次交付审（2026-11-15，114 行）**：三批 50/50/14，issues 0，2 stars 就地刷新。

**2026-11-16 复核审（去重后 109 行，重跑 audit.mjs）**：

| 批次 | 行数 | 链接复核 | issues |
|---|---|---|---|
| 1–50 | 50 | 5 条夜间网络连接超时（UND_ERR_CONNECT_TIMEOUT / ENOTFOUND）→ 硬重试后全部 200 | **0 持久问题** |
| 51–100 | 50 | 逐条可达 | **0** |
| 101–109 | 9 | 逐条可达 | **0** |
| 合计 | 109 | — | **0 持久问题，14 stars 就地刷新**（高星库自然涨星：react-three-fiber Δ8、librosa Δ9、Motion Δ25 等，已写回 CSV） |

## 5. 与已有库的去重说明

| 基准 | 状态 | 处理 |
|---|---|---|
| 模板现有 10 张卡（blur-slide 等） | 已读 README/DELIVERY/SHOT-CATALOG/video.config.ts 确认 | 本次候选全部为**外部资源**（库/文档/工具），无一条是模板卡本体，无重叠 |
| shotcraft 124 张卡 | 本地清单逐名核对（124 张，见采集时导出清单） | 候选资源与卡处于不同层（124 卡是动效手法规范，本库是资源与工具）；无一条为卡本体或其复刻 |
| `Mattenhaim/code-video-projects`（138 行 CSV） | 首次交付时 GitHub API 404 不可达，当时误判"未能去重"。**2026-11-16 复核发现本地快照即该 CSV**（`E:/GLM/github-audit-20261115/repos/code-video-projects/code-video-projects-full.csv`，138 行，md5 `92f8824c…`，与 `attention-video/download/`、`github-audit-20261111/` 两份副本逐字节一致），**已补做全库去重**：URL/仓库 slug/项目名三维比对，移除 5 条重复（§3 去重清单），114→109 |
| Luna 分支 `luna-code-video-resources-expansion` | 依赖上述仓库，同样不可达 | **未与 Luna 扩展去重，待其回件后补查**（任务单预案内情形） |
| Antigravity 中文动态字体系统 | **已交付**：`Mattenhaim/chinese-kinetic-type-system`（MIT，README 核验）——含排版规则 + 6 大配方（CharReveal / LineSlidePause / KeywordPunch / HighlightSweep / NumberCounter / TypewriterText） | 中文排版专属规则（字号/断行/描边/留白）**一律未收**；功能等价的中文配方未重复实现；通用/英文对照库（countUp.js、Odometer、Typed.js、TypeIt、typewriter-effect）照收，notes 逐条标注"Antigravity 已有对应中文配方"；模板现有 highlight 类实现沿用底盘卡，未新增 |

## 6. 审计种子自校验（任务单 §二）

| 种子 | 状态 | 位置 |
|---|---|---|
| Framer Motion | ✓ 有效库 | `Motion (Framer Motion)`（github.com/motiondivision/motion，⭐35199） |
| GSAP | ✓ 去重清单 + 有效库 | 仓库条目 `greensock/GSAP` 已按 138 行库去重移入去重清单（出处注明）；有效库仍有 5 条 GSAP 官方文档条目：TextPlugin / SplitText / Flip / MotionPathPlugin / Eases（gsap.com） |
| Lottie | ✓ 有效库 | `lottie-web`（airbnb/lottie-web）+ `LottieFiles`（域名条目在待复查，但 lottie-web 与 @remotion/lottie 双条目在有效库） |
| Rive | ✓ 有效库 | `Rive`（rive.app）+ `Rive Community` |
| Motion One | ✓ 有效库 | `Motion for JS (原 Motion One)`（motion.dev/docs/quick-start；Motion One 品牌已并入 Motion，原独立站不可达，notes 已说明谱系） |
| Anime.js | ✓ 有效库 | `Anime.js`（juliangarnier/anime，⭐74711） |

6/6 全部落在有效库或去重清单（GSAP 双落点），自校验通过。

## 7. 许可边界执行

- **AGPL-3.0**（Essentia）、**GPL-3.0**（aubio）：remotion_fit 一律"仅借鉴思路"，notes 明确"不搬代码"
- **Robert Penner Easing**：非 OSI 自定义许可 → 仅借鉴思路
- **MIT / ISC / BSD 确认宽松许可库共 47 条**（MIT 39 + MIT(motiondivision/motion) 5 + ISC 2 + BSD-3-Clause 1）：remotion_fit 可为"需改写"（时间驱动→帧驱动的适配）。Apache-2.0 条目现存 0（原唯一 Apache-2.0 条目 Theatre.js 已按 138 行库去重移除）
- 本次交付**未复制任何第三方代码进模板**；B 层配方全部为按语义重写的帧号驱动实现
- Remotion 自身许可（个人/小公司免费商用、规模公司授权）已单列条目并引 LICENSE.md 原文

## 8. 已知问题清单（如实）

1. **Luna 分支 `luna-code-video-resources-expansion` 未去重**（其所属仓库 code-video-projects 在 GitHub 不可达；138 行主表已用本地快照补齐去重，Luna 扩展无本地数据）——唯一未决去重项，回件后需补查 109 条
2. 8 条待复查未入有效库（3 连接故障 + 2 信息不全 + 3 Cloudflare 拦截），URL 均真实；2026-11-16 复核：2 个 remotion-dev 仓库 API description 仍为 null、3 个站点本机 4 轮重试仍不可达，维持待复查，复核通过后可入
3. `license=未知` 51 条：文档页/工具站无许可证声明的如实标注（GitHub 条目的许可证均有 API 原文；NOASSERTION 8 条为仓库 LICENSE 文件 GitHub 未识别，照实标注）
4. `free_or_paid=未知` 40 条：官网无明示价格口径的如实标注
5. 高星库 stars 在核验与审计窗口间自然漂移（复核日 Δ 最高 25 / 3.5 万星级，已建立"就地刷新"机制并在审计批次中记录）
6. B 层 22 个配方中 17 个为代码草图（未渲染）；5 个已渲染小样在本地 `out/samples/` 与 `samples/` 源码目录，按任务要求**未推送进仓库**
7. 部分条目 description 为页面 og:description/元数据原文，个别页面（如 GSAP SplitText）其官方 meta 本身较短，照抄未润色

## 9. 交付物

| 文件 | 说明 |
|---|---|
| `motion-effects-library.csv` | 有效库 109 条，13 列 |
| `motion-effects-pending.csv` | 待复查 8 条，13 列，notes 注明未通过原因 |
| `motion-recipes.md` | 22 个配方（5 个已渲染小样验证） |
| `motion-effects-audit.md` | 本报告 |

## 10. 2026-11-16 独立复核与修正记录（诚实清单）

1. **去重缺口补做**：首次交付报告声称"138 行库 404 不可达、未能去重"。复核发现该 CSV 的本地快照一直存在（账号审计工作区），原判断不成立。已按 URL / 仓库 slug / 项目名三维对全库比对，发现 5 条重复并移除（GSAP、Theatre.js、Motion Canvas、Remotion Audiogram template、Remotion TikTok Captions template），计数由 114 修正为 109，§3/§5/§6/§7/§8/§9 同步修正。GSAP 转入去重清单（任务单预案允许："若已在 138 行库，记入去重并注明出处"），其在有效库的出处由 5 条 gsap.com 官方文档条目保持。
2. **B 层来源勾稽重跑**：配方文件 57 条来源链接逐一比对去重后有效库 = 0 缺失（被移除的 5 条仓库无一被配方引用；配方引用的 GSAP 条目均为 gsap.com 文档页）。
3. **机器审重跑**：109 行三批重审（§4），5 条夜间连接超时经硬重试全部 200，0 持久问题。
4. **内容真实性抽检**：跨 6 类×3 类来源抽 18 条实抓比对，18/18 description 与页面/registry/API 原文一致，无编造。
5. **小样 ffprobe 复核**：sample1–5 全部 1920×1080、30/1 fps、nb_frames 240/240/180/240/240、duration 8.042667×4 + 6.058667×1，与首次报告口径一致。
6. **待复查复核**：remotion-dev/3d-text 与 remotion-dev/gl-transitions 的 API description 仍为 null（维持待复查）；bennettfeely.com/clippy、developer.chrome.com、tunebat.com 本机各 4 轮重试仍不可达（维持待复查）。
7. 基准复核：shotcraft 124 卡清单（124 行）✓、模板现有 10 卡（8 内容 + 2 转场）✓、138 行 CSV（138 数据行）✓、Luna 分支 404 ✓、Antigravity 交付仓 `Mattenhaim/chinese-kinetic-type-system` 存在 ✓。
