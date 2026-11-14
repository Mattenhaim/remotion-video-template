/**
 * 注意力主题 Demo 配置存档 — 与仓库根目录 video.config.ts 内容相同。
 *
 * 这份文件的两个用途：
 *   1) 恢复示例：改坏了 video.config.ts 时，把本文件内容拷回去；
 *   2) 作为「换一支视频只改 video.config.ts」的完整参照。
 *
 * ⚠️ 三句话均为演示用可替换文案（不含任何数字/引用/来源）。
 */
import type { VideoConfig } from '../src/types';

export const video: VideoConfig = {
  title: '注意力',

  palette: {
    bg: '#f7f3ec',
    accent: '#955905',
    text: '#13110f',
    subtext: '#65635f',
  },

  bgm: 'bgm/cat-walk.mp3',

  scenes: [
    {
      id: 'open-title',
      text: '',
      subtitle: '',
      shot: 'brace-expand',
      durationFrames: 112, // 8 拍
    },
    {
      id: 'thesis',
      text: '21 世纪真正的个人资产是*注意力*',
      shot: 'blur-slide',
      durationFrames: 167, // 12 拍
      transitionIn: 'push-up',
    },
    {
      id: 'surplus',
      text: '信息已经免费且过剩',
      shot: 'dark-flip',
      durationFrames: 167, // 12 拍
      transitionIn: 'blinds',
    },
    {
      id: 'flow',
      text: '注意力花在哪里，人生就流向哪里',
      shot: 'spotlight-sweep',
      durationFrames: 167, // 12 拍
    },
    {
      id: 'outro',
      text: '*注意力*',
      shot: 'paper-title-card',
      durationFrames: 112, // 8 拍
    },
  ],

  subtitles: true,

  maxDurationSeconds: 90,
};
