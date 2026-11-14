/**
 * 底部字幕条 — 改编自 Vincentwei1021/video-shotcraft template/src/aifl/Caption.tsx（Apache-2.0）。
 * 底盘注释明确：22px 属"信息条"风格，作为叙事主字幕应提到 56–60px 档——本组件按 56px 实现。
 * 随所在场景淡入淡出（各 8f），暗场镜头自动用亮色文字。
 */
import { interpolate, useCurrentFrame } from 'remotion';
import { FONT_SANS, emWidth } from '../shots/common';

export const SubtitleBar: React.FC<{ text: string; duration: number; dark?: boolean; subtextColor: string; textColor: string; accent: string }> = ({
  text,
  duration,
  dark = false,
  subtextColor,
  textColor,
  accent,
}) => {
  const frame = useCurrentFrame();
  const inT = interpolate(frame, [0, 8], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const outT = interpolate(frame, [duration - 8, duration], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  // 长句自动缩字号（可用宽约 1700px），防截断
  const fontSize = Math.max(34, Math.min(56, Math.floor(1700 / Math.max(1, emWidth(text) + 0.5))));

  return (
    <div
      style={{
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 58,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'baseline',
        gap: 16,
        fontFamily: FONT_SANS,
        fontSize,
        fontWeight: 600,
        color: dark ? textColor : subtextColor,
        opacity: inT * outT,
        transform: `translateY(${(1 - inT) * 10}px)`,
        textShadow: dark ? '0 2px 18px rgba(0,0,0,0.45)' : undefined,
        pointerEvents: 'none',
        padding: '0 6%',
        whiteSpace: 'nowrap',
        overflow: 'hidden',
      }}
    >
      <span style={{ width: 10, height: 10, background: accent, display: 'inline-block', flexShrink: 0 }} />
      <span>{text}</span>
    </div>
  );
};
