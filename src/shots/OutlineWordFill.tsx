/**
 * 镜头卡 outline-word-fill — 来源 Vincentwei1021/video-shotcraft references/shots/typography/outline-word-fill.md
 * （Apache-2.0，按卡规范实现）
 *
 * 空心词从 3.2 倍急缓收缩落位；虚线大圆随后收到字周围并缓慢自转，
 * 左右水平虚线从画框边缘内伸；描边先微微增亮，实心字在一帧内硬切点亮、
 * 一闪辉光即定格。深底品牌片的强调帧/钉子镜——适合单词式文案。
 */
import { AbsoluteFill, interpolate, useCurrentFrame, Easing } from 'remotion';
import { FONT_SANS, fitTitleSize, type SceneProps } from './common';
import { plainText } from '../lib/text';
import { dampedSettle } from '../lib/rand';
import { lightInk, stageBg } from '../lib/palette';

export const OutlineWordFill: React.FC<SceneProps> = ({ text, duration, palette }) => {
  const frame = useCurrentFrame();
  const bg = stageBg(palette);
  const ink = lightInk(palette);
  const dimInk = 'rgba(160,150,140,0.9)';

  const HIT = Math.max(36, Math.min(60, Math.round(duration * 0.45))); // 点亮帧

  // 3.2 倍急缓收缩落位
  const shrink = interpolate(frame, [0, 24], [3.2, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.bezier(0.16, 0.9, 0.24, 1),
  });
  const appear = interpolate(frame, [0, 8], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  // 描边增亮：点亮前 1.0 → 1.35，硬切后回落
  const strokeBright = interpolate(frame, [HIT - 10, HIT], [0, 0.35], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // 实心点亮：一帧硬切 + 辉光一闪即定格（dampedSettle 衰减）
  const lit = frame >= HIT;
  const flash = lit ? dampedSettle(frame - HIT, 0.09, 0.22) : 0;
  const glow = lit ? Math.max(0, flash) : 0;

  const fontSize = fitTitleSize(plainText(text), 380, 140);
  const isLitColor = palette.accent;

  // 虚线圆：2.8 倍收到字周围，随后缓慢自转
  const circleScale = interpolate(frame, [10, 34], [2.8, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.bezier(0.2, 0.8, 0.3, 1),
  });
  const circleOpacity = interpolate(frame, [10, 26], [0, 0.5], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const spin = frame * 0.12;

  // 左右水平虚线：从画框边缘内伸
  const lineT = interpolate(frame, [18, 40], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  return (
    <AbsoluteFill style={{ backgroundColor: bg, justifyContent: 'center', alignItems: 'center' }}>
      {/* 左右虚线（画框 → 文字） */}
      {[0, 1].map((side) => (
        <div
          key={side}
          style={{
            position: 'absolute',
            top: '50%',
            left: side === 0 ? '4%' : undefined,
            right: side === 1 ? '4%' : undefined,
            width: `${18 * lineT}%`,
            borderTop: `2px dashed ${palette.accent}`,
            opacity: 0.55,
          }}
        />
      ))}

      {/* 虚线大圆（缓慢自转） */}
      <svg
        width={fontSize * 2.6}
        height={fontSize * 2.2}
        viewBox="0 0 100 84"
        style={{
          position: 'absolute',
          transform: `scale(${circleScale}) rotate(${spin}deg)`,
          opacity: circleOpacity,
        }}
      >
        <ellipse
          cx="50"
          cy="42"
          rx="46"
          ry="36"
          fill="none"
          stroke={palette.accent}
          strokeWidth="0.6"
          strokeDasharray="4 5"
        />
      </svg>

      {/* 主词 */}
      <div style={{ position: 'relative', transform: `scale(${shrink})`, opacity: appear }}>
        <span
          style={{
            fontFamily: FONT_SANS,
            fontWeight: 800,
            fontSize,
            lineHeight: 1.08,
            whiteSpace: 'nowrap',
            display: 'inline-block',
            color: lit ? isLitColor : 'transparent',
            WebkitTextStroke: `2px ${lit ? isLitColor : dimInk}`,
            filter: `brightness(${1 + strokeBright}) drop-shadow(0 0 ${(glow * 90).toFixed(1)}px ${palette.accent})`,
          }}
        >
          {text}
        </span>
      </div>
    </AbsoluteFill>
  );
};
