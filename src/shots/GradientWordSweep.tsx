/**
 * 镜头卡 gradient-word-sweep — 来源 Vincentwei1021/video-shotcraft references/shots/typography/gradient-word-sweep.md
 * （Apache-2.0，按卡规范实现；稳态闪电为简化版）
 *
 * 黑底标语里 `*关键词*` 被渐变彩光从左到右快速扫过"充能"——波前最亮向后
 * 衰减，填满后字符间勾连细闪电、整词泛光呼吸。三个命门：快（15–20f）、
 * 波前最亮、辉光克制。其余文案保持白纸黑字（此处为暗场浅字）。
 */
import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion';
import { FONT_SANS, type SceneProps } from './common';
import { tokenize } from '../lib/text';
import { mulberry32 } from '../lib/rand';
import { lightInk, stageBg } from '../lib/palette';

const SWEEP_FRAMES = 18; // 扫充时长（快，慢了读作进度条）

/** 字符间勾连闪电：一条折线（确定性随机点） */
function boltPath(seed: number, width: number, height: number): string {
  const rnd = mulberry32(seed);
  const segs = 5;
  const pts: string[] = [`M 0 ${(height / 2).toFixed(1)}`];
  for (let i = 1; i <= segs; i++) {
    pts.push(`L ${((i / segs) * width).toFixed(1)} ${(height * (0.15 + rnd() * 0.7)).toFixed(1)}`);
  }
  return pts.join(' ');
}

export const GradientWordSweep: React.FC<SceneProps> = ({ text, subtext, duration, palette }) => {
  const frame = useCurrentFrame();
  const bg = stageBg(palette);
  const ink = lightInk(palette);
  const tokens = tokenize(text);
  const fadeOut = interpolate(frame, [duration - 10, duration], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // 每个 token 依次入场；带 accent 的 token 排完即开始扫充
  let sweepStart = -1;
  let accentIndex = -1;
  tokens.forEach((tk, i) => {
    if (tk.accent && sweepStart < 0) {
      sweepStart = 6 + i * 2 + 14; // 该词落定后扫
      accentIndex = i;
    }
  });
  const sweepEnd = sweepStart + SWEEP_FRAMES;
  const wf = interpolate(frame, [sweepStart, sweepEnd], [0, 112], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  }); // 波前位置（% 词宽，冲过 12% 保证填满）
  const filled = frame >= sweepEnd;

  // 稳态泛光呼吸（填充后）；扫充期间波前辉光最强
  const breathe = filled ? 0.55 + 0.25 * Math.sin(frame * 0.18) : 0;
  const wavefrontGlow = !filled ? Math.max(0, 1 - Math.abs(wf - 50) / 55) : 0;
  const glowOpacity = Math.min(0.9, wavefrontGlow * 0.9 + breathe * 0.6);

  // 稳态闪电：填充后出现，随帧随机闪烁（确定性）
  const boltSeed = 7 + accentIndex * 13;
  const boltOn = filled && mulberry32(boltSeed + Math.floor(frame / 2))() < 0.42;
  const boltOpacity = boltOn ? 0.4 + mulberry32(boltSeed * 3 + frame)() * 0.45 : 0;

  return (
    <AbsoluteFill style={{ backgroundColor: bg, justifyContent: 'center', opacity: fadeOut }}>
      <div style={{ padding: '0 11%', textAlign: 'center' }}>
        <div
          style={{
            fontFamily: FONT_SANS,
            fontSize: 104,
            fontWeight: 700,
            lineHeight: 1.4,
            color: ink,
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            columnGap: '0.2em',
          }}
        >
          {tokens.map((tk, i) => {
            const start = 6 + i * 2;
            const p = interpolate(frame, [start, start + 14], [0, 1], {
              extrapolateLeft: 'clamp',
              extrapolateRight: 'clamp',
            });
            if (!tk.accent) {
              return (
                <span key={i} style={{ display: 'inline-block', opacity: p, transform: `translateY(${(1 - p) * 30}px)` }}>
                  {tk.text}
                </span>
              );
            }
            // 强调词：三层——白底字 / 渐变彩字（波前 mask 揭开）/ 泛光层
            const gradient = `linear-gradient(92deg, ${palette.accent}, ${lightInk(palette)} 55%, ${palette.accent})`;
            return (
              <span
                key={i}
                style={{ position: 'relative', display: 'inline-block', opacity: p, transform: `translateY(${(1 - p) * 30}px)` }}
              >
                <span style={{ opacity: 0.92 }}>{tk.text}</span>
                <span
                  aria-hidden
                  style={{
                    position: 'absolute',
                    inset: 0,
                    background: gradient,
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    // 波前：左到右推进的斜边 mask，边缘 8% 词宽糊化
                    WebkitMaskImage: `linear-gradient(93deg, black ${(wf - 10).toFixed(1)}%, rgba(0,0,0,0.35) ${wf.toFixed(1)}%, transparent ${(wf + 8).toFixed(1)}%)`,
                    maskImage: `linear-gradient(93deg, black ${(wf - 10).toFixed(1)}%, rgba(0,0,0,0.35) ${wf.toFixed(1)}%, transparent ${(wf + 8).toFixed(1)}%)`,
                  }}
                >
                  {tk.text}
                </span>
                <span
                  aria-hidden
                  style={{
                    position: 'absolute',
                    inset: 0,
                    color: palette.accent,
                    filter: `blur(14px)`,
                    opacity: glowOpacity,
                  }}
                >
                  {tk.text}
                </span>
                {/* 字符间勾连细闪电（稳态，克制） */}
                {filled ? (
                  <svg
                    viewBox="0 0 100 24"
                    preserveAspectRatio="none"
                    style={{
                      position: 'absolute',
                      left: 0,
                      top: '42%',
                      width: '100%',
                      height: '24%',
                      overflow: 'visible',
                      opacity: boltOpacity,
                    }}
                  >
                    <path d={boltPath(boltSeed, 100, 24)} fill="none" stroke={lightInk(palette)} strokeWidth="1.4" />
                  </svg>
                ) : null}
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
              opacity: interpolate(frame, [sweepEnd + 4, sweepEnd + 18], [0, 1], {
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
