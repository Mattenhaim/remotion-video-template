/**
 * 镜头卡 spotlight-sweep — 来源 Vincentwei1021/video-shotcraft references/shots/effects/spotlight-sweep-moves.md（A 式）
 * （Apache-2.0，按卡规范实现）
 *
 * 暗场聚光显影：一束柔边聚光从左到右扫过文案，光到即亮，扫过处保持点亮
 * ——"光即叙事"。实现按 token 序号排布点亮时序（对换行稳健），聚光位置
 * 与点亮时序共用同一条时间线，视觉上光随字走。
 */
import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion';
import { FONT_SANS, type SceneProps } from './common';
import { tokenize } from '../lib/text';
import { lightInk, stageBg, rgba } from '../lib/palette';

export const SpotlightSweep: React.FC<SceneProps> = ({ text, subtext, duration, palette }) => {
  const frame = useCurrentFrame();
  const bg = stageBg(palette);
  const ink = lightInk(palette);
  const tokens = tokenize(text);
  const fadeOut = interpolate(frame, [duration - 10, duration], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // 点亮时序：第 i 个 token 在 10 + i*1.4f 起亮（6f 收敛），扫完全文后全场保持
  const sweepEnd = 10 + tokens.length * 1.4 + 8;
  // 聚光位置：与点亮时序同一时间线，横穿画面
  const spotX = interpolate(frame, [6, sweepEnd - 2], [-12, 112], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill style={{ backgroundColor: bg, justifyContent: 'center', opacity: fadeOut, overflow: 'hidden' }}>
      {/* 聚光：大柔边径向光斑 + 顶部体积光柱 */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: `radial-gradient(780px 560px at ${spotX}% 42%, ${rgba(palette.accent, 0.34)}, ${rgba(palette.accent, 0.1)} 45%, transparent 72%)`,
        }}
      />
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: `linear-gradient(180deg, ${rgba(palette.accent, 0.12)} 0%, transparent 46%)`,
          opacity: interpolate(frame, [0, 12], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }),
        }}
      />

      <div style={{ padding: '0 12%', textAlign: 'center', position: 'relative' }}>
        <div
          style={{
            fontFamily: FONT_SANS,
            fontSize: 112,
            fontWeight: 700,
            lineHeight: 1.4,
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            columnGap: '0.18em',
          }}
        >
          {tokens.map((tk, i) => {
            const lit = interpolate(frame, [10 + i * 1.4, 10 + i * 1.4 + 6], [0, 1], {
              extrapolateLeft: 'clamp',
              extrapolateRight: 'clamp',
            });
            const underSpot = Math.max(0, 1 - Math.abs(spotX - ((i / Math.max(1, tokens.length - 1)) * 100 + 6)) / 18);
            return (
              <span
                key={i}
                style={{
                  display: 'inline-block',
                  color: tk.accent ? palette.accent : ink,
                  opacity: 0.1 + 0.9 * lit,
                  filter: `drop-shadow(0 0 ${(lit * (26 + underSpot * 22)).toFixed(1)}px ${rgba(palette.accent, 0.85)})`,
                  transform: `translateY(${(1 - lit) * 10}px)`,
                }}
              >
                {tk.text}
              </span>
            );
          })}
        </div>
        {subtext ? (
          <div
            style={{
              marginTop: 34,
              fontFamily: FONT_SANS,
              fontSize: 42,
              fontWeight: 500,
              color: palette.subtext,
              opacity: interpolate(frame, [sweepEnd, sweepEnd + 14], [0.08, 0.9], {
                extrapolateLeft: 'clamp',
                extrapolateRight: 'clamp',
              }),
            }}
          >
            {subtext}
          </div>
        ) : null}
      </div>
    </AbsoluteFill>
  );
};
