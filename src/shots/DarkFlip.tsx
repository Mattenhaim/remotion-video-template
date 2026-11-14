/**
 * 镜头卡 dark-flip — 来源 Vincentwei1021/video-shotcraft references/shots/effects/aurora-bloom-bg-flip.md
 * （Apache-2.0，按卡规范实现）
 *
 * 叙事转折点：浅底文案先立稳，随后底色在约 0.36s（11f）内压暗到近黑、
 * 柔焦 blob 压成余晖；文案同步 blur-out，换句（或同句加重）blur-in，
 * 换句间留空档不 cross-fade。深浅色系之间的段落切换。
 */
import { AbsoluteFill, interpolate, useCurrentFrame, Easing } from 'remotion';
import { FONT_SANS, type SceneProps } from './common';
import { lightInk, stageBg, rgba } from '../lib/palette';

export const DarkFlip: React.FC<SceneProps> = ({ text, flipText, subtext, duration, palette }) => {
  const frame = useCurrentFrame();
  const dark = stageBg(palette);
  const ink = lightInk(palette);
  const fadeOut = interpolate(frame, [duration - 10, duration], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const FLIP = Math.max(30, Math.round(duration * 0.42)); // 翻转起点帧
  const FLIP_DUR = 11; // 压暗窗（约 0.36s）

  // 底色：浅 → 暗（0.36s 内压暗）
  const bgT = interpolate(frame, [FLIP, FLIP + FLIP_DUR], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.bezier(0.4, 0, 0.6, 1),
  });

  // 柔焦 blob：翻转前从底部升起，翻转时压成余晖
  const blobUp = interpolate(frame, [0, FLIP * 0.6], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const blobFade = 1 - bgT * 0.85;

  // 文案 A（浅底）：立稳 → blur-out；文案 B（暗底）：blur-in
  const aOut = interpolate(frame, [FLIP + 2, FLIP + 10], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const aIn = interpolate(frame, [4, 16], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const bIn = interpolate(frame, [FLIP + FLIP_DUR + 2, FLIP + FLIP_DUR + 14], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const swapped = Boolean(flipText);

  return (
    <AbsoluteFill style={{ opacity: fadeOut, backgroundColor: dark }}>
      {/* 浅底（压暗前） */}
      <AbsoluteFill style={{ backgroundColor: palette.bg, opacity: 1 - bgT }} />

      {/* 柔焦 blob（强调色，底部升起 → 余晖） */}
      <div
        style={{
          position: 'absolute',
          left: '18%',
          bottom: '-14%',
          width: '64%',
          height: '58%',
          borderRadius: '50%',
          background: `radial-gradient(closest-side, ${rgba(palette.accent, 0.4)}, transparent 72%)`,
          filter: 'blur(60px)',
          opacity: blobUp * blobFade * (1 - bgT * 0.6),
          transform: `translateY(${(1 - blobUp) * 180}px) scale(${1 + bgT * 0.25})`,
        }}
      />
      <div
        style={{
          position: 'absolute',
          right: '8%',
          top: '-18%',
          width: '46%',
          height: '44%',
          borderRadius: '50%',
          background: `radial-gradient(closest-side, ${rgba(palette.accent, 0.16)}, transparent 70%)`,
          filter: 'blur(70px)',
          opacity: blobUp * blobFade,
        }}
      />

      {/* 文案 A：浅底句（翻转时 blur-out，留空档不 cross-fade） */}
      <AbsoluteFill style={{ justifyContent: 'center', padding: '0 11%', textAlign: 'center' }}>
        <div
          style={{
            fontFamily: FONT_SANS,
            fontSize: 106,
            fontWeight: 700,
            lineHeight: 1.34,
            color: palette.text,
            opacity: aIn * aOut,
            filter: `blur(${(1 - aIn) * 8 + (1 - aOut) * 14}px)`,
            transform: `translateY(${(1 - aIn) * 34 - (1 - aOut) * 22}px)`,
          }}
        >
          {text}
        </div>
        {subtext && !swapped ? (
          <div
            style={{
              marginTop: 30,
              fontFamily: FONT_SANS,
              fontSize: 42,
              fontWeight: 500,
              color: palette.subtext,
              opacity: aIn * aOut * 0.9,
              filter: `blur(${(1 - aOut) * 10}px)`,
            }}
          >
            {subtext}
          </div>
        ) : null}
      </AbsoluteFill>

      {/* 文案 B：暗底句（flipText 或同句加重复现） */}
      <AbsoluteFill style={{ justifyContent: 'center', padding: '0 11%', textAlign: 'center' }}>
        <div
          style={{
            fontFamily: FONT_SANS,
            fontSize: swapped ? 100 : 122,
            fontWeight: 800,
            lineHeight: 1.32,
            color: swapped ? ink : palette.accent,
            textShadow: `0 0 ${44}px ${rgba(palette.accent, 0.45)}`,
            opacity: bIn,
            filter: `blur(${(1 - bIn) * 12}px)`,
            transform: `translateY(${(1 - bIn) * 26}px)`,
          }}
        >
          {swapText(flipText, text)}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

function swapText(flipText: string | undefined, text: string): string {
  return flipText && flipText.trim() !== '' ? flipText : text;
}
