/**
 * video.config 的类型定义。字段说明见 README.md「配置字段」一节。
 */

export type Palette = {
  /** 全片底色（浅色为主；暗场镜头会自动派生深色变体） */
  bg: string;
  /** 强调色：关键词、下划线、括号、扫光等 */
  accent: string;
  /** 正文文字色（浅底上使用） */
  text: string;
  /** 次要文字色：副标、字幕条 */
  subtext: string;
};

export type ShotId =
  | 'blur-slide'
  | 'brace-expand'
  | 'marker-underline'
  | 'outline-word-fill'
  | 'paper-title-card'
  | 'gradient-word-sweep'
  | 'spotlight-sweep'
  | 'dark-flip';

export type TransitionId = 'cut' | 'push-up' | 'blinds';

export type SceneConfig = {
  /** 场景 id，仅用于日志与排错，需在本配置内唯一 */
  id: string;
  /** 屏上文案。`*词*` 包起来表示强调词；留空时取 title */
  text: string;
  /** 副标（可选）：小字一行，随主文案跟进 */
  subtext?: string;
  /** 配图路径（可选）：相对 public/，如 images/foo.jpg；仅部分镜头支持 */
  image?: string;
  /** 镜头配方名，见 docs/SHOT-CATALOG.md */
  shot: ShotId;
  /** 期望时长（帧，30fps）。场景边界会自动吸附到最近的 BGM 节拍 */
  durationFrames: number;
  /** 进场方式（可选，默认 cut）。push-up / blinds 来自两张转场卡 */
  transitionIn?: TransitionId;
  /** dark-flip 专用（可选）：翻暗后换上的句子。缺省则复述 text（换色加重） */
  flipText?: string;
  /** 字幕条文字覆盖（可选）。缺省取 text 去掉 * 号 */
  subtitle?: string;
};

export type VideoConfig = {
  /** 标题：场景 text 留空时的缺省文案 */
  title: string;
  palette: Palette;
  /** BGM 路径，相对 public/，如 bgm/cat-walk.mp3。文件需自己放入 */
  bgm: string;
  scenes: SceneConfig[];
  /** 是否烧录底部字幕条 */
  subtitles: boolean;
  /** 成片时长上限（秒），渲染前校验用。默认 90 */
  maxDurationSeconds?: number;
};
