/**
 * 节拍网格与场景排布（纯函数，无 React）。
 *
 * 方法来自底盘 Vincentwei1021/video-shotcraft references/music-beat-sync.md：
 * librosa 节拍网格（t0 / T 浮点秒）由 scripts/analyze_beats.py 离线产出
 * analysis/beat_data.json；换算成帧只发生在最后一步（取整一次到位）。
 * 场景边界吸附最近节拍帧，吸附失败（范围内无拍）则保留原始帧并打 warn 标记。
 */
import beatsJson from '../analysis/beat_data.json';
import type { SceneConfig, TransitionId, VideoConfig } from './types';

export const FPS = 30;

export type BeatData = {
  bpm: number;
  t0: number;
  T: number;
  beats: number[];
  source: string;
  analyzedAt: string;
};

export const beatData = beatsJson as BeatData;

/** 源音乐分析真值：拍 n 的时刻（秒）。与 beat_data.json 一致，不掺渲染偏移。 */
export const beatT = (n: number) => beatData.t0 + n * beatData.T;

/** 输出音轨偏移（秒）。渲后回测发现系统性同向偏移时才改这里（见 music-beat-sync §5b）。 */
export const OUTPUT_AUDIO_OFFSET_SEC = 0;

/** 拍 → 帧（四舍五入一次到位） */
export const beatFrame = (n: number) => Math.round((beatT(n) + OUTPUT_AUDIO_OFFSET_SEC) * FPS);

/** 最近的节拍帧：返回 [帧号, 拍号]。负范围安全。 */
export function nearestBeatFrame(frame: number): { frame: number; n: number } {
  const nExact = (frame / FPS - beatData.t0) / beatData.T;
  const n = Math.round(nExact);
  return { frame: beatFrame(n), n };
}

export type SceneSpan = {
  cfg: SceneConfig;
  index: number;
  /** 吸附后场景起点帧（场景 0 恒为 0） */
  start: number;
  /** 吸附后场景终点帧（不含） */
  end: number;
  /** 吸附后时长 = end - start */
  duration: number;
  /** 用户配置的原始时长（帧） */
  rawDuration: number;
  /** 边界是否吸附到了节拍帧（场景 0 的 start 不算） */
  snapped: boolean;
  /** 入场转场 */
  transitionIn: TransitionId;
};

export type Layout = {
  scenes: SceneSpan[];
  /** 全片总帧数 */
  total: number;
  /** 总时长（秒） */
  totalSeconds: number;
  /** 吸附失败的场景边界数 */
  unsnappedBoundaries: number;
  maxDurationFrames: number;
};

/** 入场转场占用帧数：新场景面板压在旧场景上的重叠窗口 */
export const TRANSITION_FRAMES: Record<Exclude<TransitionId, 'cut'>, number> = {
  'push-up': 26,
  'blinds': 24,
};

/**
 * 排布：累加各场景 durationFrames 得到原始边界，再逐个吸附到最近节拍帧
 * （吸附半径 = 半拍 + 2f）。首场景恒从 0 开始；末边界同样吸附（收在拍上）。
 */
export function layoutScenes(video: VideoConfig): Layout {
  const beats = beatData.beats && beatData.beats.length > 1;
  const halfBeatFrames = beats ? Math.round((beatData.T * FPS) / 2) : 0;
  const snapRadius = beats ? halfBeatFrames + 2 : 0;

  const scenes: SceneSpan[] = [];
  let raw = 0;
  let unsnapped = 0;
  for (let i = 0; i < video.scenes.length; i++) {
    const cfg = video.scenes[i];
    const rawDuration = Math.max(10, Math.round(cfg.durationFrames));
    raw += rawDuration;
    let end = raw;
    let snapped = false;
    if (beats) {
      const { frame } = nearestBeatFrame(raw);
      if (Math.abs(frame - raw) <= snapRadius && frame > 0) {
        end = frame;
        snapped = true;
      } else {
        unsnapped++;
      }
    }
    const prevEnd = i === 0 ? 0 : scenes[i - 1].end;
    const duration = Math.max(10, end - prevEnd);
    scenes.push({
      cfg,
      index: i,
      start: prevEnd,
      end: prevEnd + duration,
      duration,
      rawDuration,
      snapped,
      transitionIn: cfg.transitionIn ?? 'cut',
    });
  }

  const total = scenes.length > 0 ? scenes[scenes.length - 1].end : 0;
  const maxDurationFrames = Math.round((video.maxDurationSeconds ?? 90) * FPS);
  return { scenes, total, totalSeconds: total / FPS, unsnappedBoundaries: unsnapped, maxDurationFrames };
}
