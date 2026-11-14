/**
 * 镜头配方注册表。video.config.ts 的 scene.shot 只接受这里的键。
 * 每个实现对应的镜头卡出处见 docs/SHOT-CATALOG.md。
 */
import type { FC } from 'react';
import type { SceneProps } from './common';
import { BlurSlide } from './BlurSlide';
import { BraceExpand } from './BraceExpand';
import { MarkerUnderline } from './MarkerUnderline';
import { OutlineWordFill } from './OutlineWordFill';
import { PaperTitleCard } from './PaperTitleCard';
import { GradientWordSweep } from './GradientWordSweep';
import { SpotlightSweep } from './SpotlightSweep';
import { DarkFlip } from './DarkFlip';

export const SHOT_REGISTRY: Record<string, FC<SceneProps>> = {
  'blur-slide': BlurSlide,
  'brace-expand': BraceExpand,
  'marker-underline': MarkerUnderline,
  'outline-word-fill': OutlineWordFill,
  'paper-title-card': PaperTitleCard,
  'gradient-word-sweep': GradientWordSweep,
  'spotlight-sweep': SpotlightSweep,
  'dark-flip': DarkFlip,
};

export const SHOT_IDS = Object.keys(SHOT_REGISTRY);

/** 暗场镜头（字幕条/文字颜色需要亮色变体） */
export const DARK_SHOTS = new Set(['spotlight-sweep', 'outline-word-fill', 'dark-flip', 'gradient-word-sweep']);
