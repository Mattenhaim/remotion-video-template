import type { Palette } from '../types';

/** 所有镜头组件的统一 props。duration 为吸附后场景时长（帧），组件时钟从 0 起算。 */
export type SceneProps = {
  text: string;
  subtext?: string;
  /** 相对 public/ 的图片路径（已含目录），如 images/foo.jpg */
  image?: string;
  /** dark-flip 专用：翻暗后换上的句子；缺省复述 text（换色加重） */
  flipText?: string;
  duration: number;
  palette: Palette;
};

export const FONT_SANS =
  '-apple-system, "Segoe UI", "Microsoft YaHei", "PingFang SC", "Noto Sans SC", sans-serif';
export const FONT_SERIF =
  'Georgia, "Times New Roman", "Noto Serif SC", "Source Han Serif SC", "SimSun", serif';
export const FONT_MONO = 'ui-monospace, SFMono-Regular, Menlo, Consolas, monospace';

/** 标题字号：CJK 按字数自适应，拉丁文按词数 */
export function fitTitleSize(text: string, max = 260, min = 96): number {
  const n = Array.from(text.replace(/\s/g, '')).length;
  if (n === 0) return min;
  const size = Math.round(1600 / n);
  return Math.max(min, Math.min(max, size));
}

const CJK_RE = /[\u2E80-\u9FFF\uF900-\uFAFF\uFF00-\uFFEF\u3000-\u303F]/;

/** 估算一行文字的 em 宽度（CJK≈1em，拉丁≈0.55em） */
export function emWidth(text: string): number {
  return Array.from(text.replace(/\*/g, '')).reduce(
    (acc, ch) => acc + (CJK_RE.test(ch) ? 1 : 0.55),
    0,
  );
}

/**
 * 单行自适应字号：给容器像素宽与 token 间隙（em），防止孤字换行。
 * fontSize = min(max, 容器宽 / (em宽 + 间隙×(token数-1)))
 */
export function fitLineSize(
  tokens: { text: string }[],
  containerPx: number,
  max: number,
  gapEm = 0.22,
  min = 40,
): number {
  const em = tokens.reduce((acc, t) => acc + emWidth(t.text), 0);
  const gaps = gapEm * Math.max(0, tokens.length - 1);
  const fit = containerPx / Math.max(1, em + gaps);
  return Math.max(min, Math.min(max, Math.floor(fit)));
}
