# Remotion 可复用视频模板

纯音乐 + 屏上文字（无旁白）的**配置驱动**视频模板：改一份 `video.config.ts`
就能出一支新视频，不改任何组件代码。

- 成片规格：**1920×1080 · 30fps · h264 MP4**，配 BGM 节拍卡点，无旁白音轨
- 底盘：[Vincentwei1021/video-shotcraft](https://github.com/Vincentwei1021/video-shotcraft)（Apache-2.0）
- 镜头配方：从底盘 124 张镜头卡中选 10 张（8 张内容卡 + 2 张转场卡），见
  [docs/SHOT-CATALOG.md](docs/SHOT-CATALOG.md)
- 当前 `video.config.ts` 里是「注意力」主题 **Demo（文案为可替换示例）**

---

## 环境要求

| 依赖 | 版本 | 用途 |
|---|---|---|
| Node.js | ≥ 18（实测 24.x） | 渲染与开发 |
| npm | ≥ 9 | 安装依赖 |
| Python | ≥ 3.10（实测 3.12） | **仅** `npm run beats` 节拍分析需要（librosa + scipy） |
| Chrome Headless Shell | 由 Remotion 自动下载 | 渲染引擎；下载失败时可用本地 Chrome/Edge 代替（见下） |

## 安装

```bash
npm ci            # 安装依赖（锁定版本，装完即可渲染）
```

首次渲染时 Remotion 会自动下载 **chrome-headless-shell**。若 `remotion.media`
不可达（网络受限），改用本地浏览器渲染：

```bash
npx remotion render src/index.ts MainVideo out/video.mp4 --concurrency=1 \
  --browser-executable="C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe"
```

## 快速开始（出你自己的视频）

```bash
# 1. 放 BGM：把你的曲子放进 public/bgm/（模板不捆绑音乐）
#    Demo 曲（Mixkit 免费商用，可下载复现）：
curl -L -o public/bgm/cat-walk.mp3 https://assets.mixkit.co/music/371/371.mp3

# 2. 改 video.config.ts：标题 / 配色 / 场景文案 / 镜头配方 / 时长
# 3. BGM 换了就重新分析节拍网格：
npm run beats       # 需要 python + librosa + scipy（pip install librosa scipy）

# 4. 校验 + 渲染：
npm run check
npm run render      # 低内存模式：--concurrency=1，输出 out/video.mp4
```

预览：`npm run dev` 打开 Remotion Studio（浏览器实时预览，逐场景调文案）。

## 配置字段（video.config.ts）

```ts
{
  title: string,          // 标题；场景 text 留空时用它（开场字卡）
  palette: {
    bg: string,           // 底色 #RRGGBB（暗场镜头自动派生深色底/亮字）
    accent: string,       // 强调色：关键词、下划线、括号、扫光
    text: string,         // 正文文字色
    subtext: string,      // 副标 / 字幕条文字色
  },
  bgm: string,            // BGM 路径，相对 public/（文件自己放）
  scenes: [{
    id: string,           // 场景 id（本配置内唯一）
    text: string,         // 屏上文案；*词* 包起来 = 强调词
    subtext?: string,     // 副标（可选）
    image?: string,       // 配图路径，相对 public/（可选；blur-slide 支持）
    shot: ShotId,         // 镜头配方，8 选 1，见 docs/SHOT-CATALOG.md
    durationFrames: number, // 期望时长（帧，30fps）；边界自动吸附 BGM 节拍
    transitionIn?: 'cut' | 'push-up' | 'blinds', // 入场转场（可选，默认 cut）
    flipText?: string,    // dark-flip 专用：翻暗后换上的句子
    subtitle?: string,    // 字幕条文字覆盖（可选，默认取 text）
  }],
  subtitles: boolean,     // 是否烧录底部字幕条（56px 档）
  maxDurationSeconds?: number, // 成片时长上限，默认 90，渲染前校验
}
```

## 渲染命令

```bash
npm run render        # = remotion render src/index.ts MainVideo out/video.mp4 --concurrency=1
npm run render:fast   # 大内存机器：--concurrency=4
npm run still         # 抽一帧 out/still.png（快速检查版式）
npm run check         # 配置校验：镜头名 / 文件存在性 / 时长上限 / 节拍吸附结果
npm run typecheck     # TypeScript 检查
```

**`--concurrency=1` 是低内存模式**：逐帧串行渲染，峰值内存最低。同时
`remotion.config.ts` 里也默认 `Config.setConcurrency(1)`，就算忘记加参数也安全；
大内存机器想快就用 `npm run render:fast`。

## Windows 注意事项

- **渲染并发**：低配笔记本务必 `--concurrency=1`（本模板已设为默认）。
- **杀毒软件**：首次渲染前把项目目录加入白名单，否则 Node/Chrome 每帧起进程会被拖慢数倍。
- **路径**：项目放本地盘（如 E:\）时避免放进 OneDrive/网盘同步目录——渲染中产生
  大量临时文件，同步锁会造成写失败。
- **OpenGL**：`remotion.config.ts` 已设 `angle` 渲染器（Windows 下比 swiftshader 稳）。
- **中文文字**：使用系统字体栈（Microsoft YaHei / Segoe UI），Windows 自带，无需装字体。
- **换曲必跑 `npm run beats`**：场景边界吸附的是节拍网格，换了曲子网格就变了。

## 已知限制

见 [docs/DELIVERY.md](docs/DELIVERY.md)（镜头实现程度、节拍方法简化点、验证明细）。

## 许可

- 本工程代码：**Apache-2.0**（见 [LICENSE](LICENSE)）
- 底盘 [Vincentwei1021/video-shotcraft](https://github.com/Vincentwei1021/video-shotcraft)：Apache-2.0；
  复用/改编的文件在源码头部以 `origin:` 注释标明
- 镜头卡为**按卡规范从零实现**，不含底盘原始场景代码；卡内动效手法的研究溯源
  见底盘 `references/shots/ATTRIBUTION.md`
- BGM 不随模板分发。Demo 曲 Cat Walk (Arulo) 来自 Mixkit Stock Music Free
  License（可商用、免署名），出处见 `public/bgm/README.md`
- [Remotion](https://www.remotion.dev/) 自身有其[许可协议](https://github.com/remotion-dev/remotion/blob/main/LICENSE.md)（公司规模达到阈值需付费授权）
