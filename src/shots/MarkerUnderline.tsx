/**
 * 镜头卡 marker-underline — 来源 Vincentwei1021/video-shotcraft references/shots/typography/marker-underline-title.md
 * （Apache-2.0，按卡规范实现）
 *
 * 大标题落定后，`*关键词*` 下方马克笔下划线从左到右快速描画——
 * 变宽笔形、毛糙边缘、微上斜，贴着字底。一笔点睛，不抢标题的戏。
 * 下划线是确定性生成的毛糙多边形（mulberry32，同一种子同一形状）。
 */
import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion';
import { FONT_SANS, type SceneProps } from './common';
import { tokenize } from '../lib/text';
import { mulberry32 } from '../lib/rand';

/** 生成一条毛糙的马克笔笔形（viewBox 100×1 坐标，y 上下抖动、端头参差） */
function markerPath(seed: number, segments = 14): string {
  const rnd = mulberry32(seed);
  const pts: string[] = [];
  for (let i = 0; i <= segments; i++) {
    const x = (i / segments) * 100;
    const yTop = 0.22 + rnd() * 0.2;
    const yBot = 0.78 + rnd() * 0.2;
    if (i === 0) pts.push(`M 0 ${((yTop + yBot) / 2).toFixed(3)}`);
    pts.push(`L ${x.toFixed(1)} ${yTop.toFixed(3)}`);
    pts.push(`L ${x.toFixed(1)} ${yBot.toFixed(3)}`);
  }
  pts.push('Z');
  return pts.join(' ');
}

export const MarkerUnderline: React.FC<SceneProps> = ({ text, subtext, duration, palette }) => {
  const frame = useCurrentFrame();
  const tokens = tokenize(text);
  const fadeOut = interpolate(frame, [duration - 10, duration], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const revealEnd = 4 + tokens.length * 2 + 14; // 主文案收完的时刻

  return (
    <AbsoluteFill style={{ backgroundColor: palette.bg, opacity: fadeOut, justifyContent: 'center' }}>
      <div style={{ padding: '0 12%', textAlign: 'left' }}>
        <div
          style={{
            fontFamily: FONT_SANS,
            fontSize: 108,
            fontWeight: 700,
            lineHeight: 1.42,
            color: palette.text,
            display: 'flex',
            flexWrap: 'wrap',
            columnGap: '0.18em',
          }}
        >
          {tokens.map((tk, i) => {
            const start = 4 + i * 2;
            const p = interpolate(frame, [start, start + 14], [0, 1], {
              extrapolateLeft: 'clamp',
              extrapolateRight: 'clamp',
            });
            return (
              <span
                key={i}
                style={{
                  position: 'relative',
                  display: 'inline-block',
                  opacity: p,
                  transform: `translateY(${(1 - p) * 24}px)`,
                }}
              >
                <span style={{ color: tk.accent ? palette.text : undefined }}>{tk.text}</span>
                {tk.accent ? (
                  // 马克笔下划线：主文案收完 +4f 起笔，10f 划完，微上斜
                  <svg
                    viewBox="0 0 100 1"
                    preserveAspectRatio="none"
                    style={{
                      position: 'absolute',
                      left: '-2%',
                      bottom: '-0.12em',
                      width: '104%',
                      height: '0.16em',
                      transform: 'rotate(-0.6deg)',
                      overflow: 'visible',
                    }}
                  >
                    <path
                      d={markerPath(42)}
                      fill={palette.accent}
                      fillOpacity={0.85}
                      style={{
                        clipPath: `inset(0 ${(1 - interpolate(frame, [revealEnd + 4, revealEnd + 14], [0, 1], {
                          extrapolateLeft: 'clamp',
                          extrapolateRight: 'clamp',
                        })) * 100}% 0 0)`,
                      }}
                    />
                  </svg>
                ) : null}
              </span>
            );
          })}
        </div>
        {subtext ? (
          <div
            style={{
              marginTop: 36,
              fontFamily: FONT_SANS,
              fontSize: 44,
              fontWeight: 500,
              color: palette.subtext,
              opacity: interpolate(frame, [revealEnd + 10, revealEnd + 26], [0, 1], {
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
