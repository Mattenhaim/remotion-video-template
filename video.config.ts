/**
 * ═══════════════════════════════════════════════════════════════════
 *  video.config.ts — 一支视频只改这一个文件。
 *  改标题、文案、配色、BGM、场景（镜头配方 + 时长），不改任何组件代码。
 * ═══════════════════════════════════════════════════════════════════
 *
 * ⚠️ 本文件当前内容是【注意力主题 Demo，可替换示例】——三句话均为演示用
 * 朴素表述，不含任何数字/引用/来源；换成你自己的文案即可出你自己的视频。
 *
 * 改完之后：
 *   1) 若换了 BGM：npm run beats        （重新分析节拍网格）
 *   2) npm run check                    （校验配置）
 *   3) npm run render                   （低内存模式渲染，--concurrency=1）
 *
 * 字段说明见 README.md；镜头配方清单见 docs/SHOT-CATALOG.md。
 */
import type { VideoConfig } from './src/types';

export const video: VideoConfig = {
  // 标题：场景 text 留空时的缺省文案（开场字卡用）
  title: '注意力',

  // 配色（#RRGGBB）。暗场镜头（spotlight-sweep / dark-flip / outline-word-fill）
  // 会自动从 bg 派生深色底、浅色字，不需要单独配
  palette: {
    bg: '#f7f3ec',      // 暖纸底
    accent: '#955905',  // 琥珀强调
    text: '#13110f',    // 墨色正文
    subtext: '#65635f', // 次要文字
  },

  // BGM 文件，相对 public/。文件自己放入（模板不捆绑任何音乐）：
  //   Demo 曲目 Cat Walk (Arulo) 是 Mixkit 免费商用曲，下载后放到 public/bgm/：
  //   curl -L -o public/bgm/cat-walk.mp3 https://assets.mixkit.co/music/371/371.mp3
  // 换成自己的曲子后记得跑 npm run beats
  bgm: 'bgm/cat-walk.mp3',

  // 场景序列：一屏一个论点。durationFrames 是期望时长，
  // 场景边界会自动吸附到最近的 BGM 节拍（吸附后的实际时长见 npm run check 输出）。
  // 8 拍 ≈ 112 帧、12 拍 ≈ 167 帧（Demo 曲 ~129 BPM）。
  scenes: [
    {
      id: 'open-title',
      text: '', // 留空 → 取 title「注意力」
      subtitle: '', // 开场标题与主画面重复，字幕条留空
      shot: 'brace-expand', // 括号幕布揭示标题，代码语感开场
      durationFrames: 112, // 8 拍
    },
    {
      id: 'thesis',
      text: '21 世纪真正的个人资产是*注意力*',
      shot: 'blur-slide', // 默认陈述句 reveal，虚焦浮出
      durationFrames: 167, // 12 拍
      transitionIn: 'push-up', // 底边上推换景（转场卡）
    },
    {
      id: 'surplus',
      text: '信息已经免费且过剩',
      shot: 'dark-flip', // 论点转折：压暗换底，句子加重复现
      durationFrames: 167, // 12 拍
      transitionIn: 'blinds', // 百叶窗擦除换景（转场卡）
    },
    {
      id: 'flow',
      text: '注意力花在哪里，人生就流向哪里',
      shot: 'spotlight-sweep', // 暗场聚光扫字，光到即亮
      durationFrames: 167, // 12 拍
    },
    {
      id: 'outro',
      text: '*注意力*',
      shot: 'paper-title-card', // 纸面逐词压印 + 短划线收束，呼吸位收尾
      durationFrames: 112, // 8 拍
    },
  ],

  // 是否烧录底部字幕条（重复当前场景文案，56px 档）
  subtitles: true,

  // 成片时长上限（秒）。npm run check 与渲染前都会校验
  maxDurationSeconds: 90,
};
