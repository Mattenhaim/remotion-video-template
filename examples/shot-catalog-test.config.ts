/**
 * 全卡验证配置 — 用于一次性验证 10 张镜头卡全部真实可用（渲染 8 个内容镜头 +
 * 2 种转场）。文案全部取自 Demo 三句话与标题，不新增任何内容。
 * 平时不参与渲染；验证方法见 docs/DELIVERY.md「验证记录」。
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
    { id: 'c1-title', text: '', shot: 'brace-expand', durationFrames: 111 },
    { id: 'c2-blur', text: '21 世纪真正的个人资产是*注意力*', shot: 'blur-slide', durationFrames: 166, transitionIn: 'push-up' },
    { id: 'c3-marker', text: '注意力花在哪里，*人生*就流向哪里', shot: 'marker-underline', durationFrames: 166, transitionIn: 'blinds' },
    { id: 'c4-sweep', text: '信息已经免费且*过剩*', shot: 'gradient-word-sweep', durationFrames: 166 },
    { id: 'c5-flip', text: '21 世纪真正的个人资产是注意力', shot: 'dark-flip', flipText: '注意力花在哪里，人生就流向哪里', durationFrames: 166, transitionIn: 'push-up' },
    { id: 'c6-spot', text: '信息已经免费且过剩', shot: 'spotlight-sweep', durationFrames: 166 },
    { id: 'c7-outline', text: '注意力', shot: 'outline-word-fill', durationFrames: 111, transitionIn: 'blinds' },
    { id: 'c8-paper', text: '*注意力*', shot: 'paper-title-card', durationFrames: 111 },
  ],

  subtitles: true,

  maxDurationSeconds: 90,
};
