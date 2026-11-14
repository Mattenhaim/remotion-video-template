/**
 * 镜头卡 blur-slide — 来源 Vincentwei1021/video-shotcraft references/shots/typography/blur-slide.md
 * （Apache-2.0，按卡规范实现）
 *
 * 标题逐词入场：y、blur、opacity 三通道绑同一个进度 p、同一条 ease-out，
 * 词从虚焦里浮出来。副标题在主文案收完前错峰跟进（重叠才是一句话）。
 * 中日韩文案按字拆分（见 lib/text.ts），逐字收敛，词间隔 2f。
 * 支持配图：双栏布局（文左图右），图做帧号驱动的 ken-burns。
 */
import { AbsoluteFill, Img, interpolate, Easing, useCurrentFrame } from 'remotion';
import { FONT_SANS, fitLineSize, type SceneProps } from './common';
import { tokenize } from '../lib/text';
import { rgba } from '../lib/palette';

const EASE_OUT = Easing.bezier(0.22, 0.8, 0.26, 0.99);

export const BlurSlide: React.FC<SceneProps> = ({ text, subtext, image, duration, palette }) => {
  const frame = useCurrentFrame();
  const tokens = tokenize(text);
  const fadeOut = interpolate(frame, [duration - 10, duration], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const hasImage = Boolean(image);
  const textWidth = hasImage ? '52%' : '84%';
  // 字号随文案长度自适应，防孤字换行。
  // 容器实际宽 = flex content-box（1920 − 2×7% padding）× textWidth ≈ 1387 / 859px
  const fontSize = fitLineSize(tokens, hasImage ? 858 : 1385, 96);

  return (
    <AbsoluteFill style={{ backgroundColor: palette.bg, opacity: fadeOut, justifyContent: 'center' }}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '4.5%',
          padding: '0 7%',
          width: '100%',
        }}
      >
        <div style={{ width: textWidth }}>
          <div
            style={{
              fontFamily: FONT_SANS,
              fontSize,
              fontWeight: 700,
              lineHeight: 1.28,
              color: palette.text,
              display: 'flex',
              flexWrap: 'wrap',
              columnGap: '0.22em',
            }}
          >
            {tokens.map((tk, i) => {
              const start = 6 + i * 2;
              const p = interpolate(frame, [start, start + 20], [0, 1], {
                extrapolateLeft: 'clamp',
                extrapolateRight: 'clamp',
                easing: EASE_OUT,
              });
              return (
                <span
                  key={i}
                  style={{
                    display: 'inline-block',
                    opacity: p,
                    transform: `translateY(${(1 - p) * 56}px)`,
                    filter: `blur(${(1 - p) * 16}px)`,
                    color: tk.accent ? palette.accent : undefined,
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
                fontSize: 44,
                fontWeight: 500,
                color: palette.subtext,
                opacity: interpolate(frame, [6 + tokens.length * 2 + 6, 6 + tokens.length * 2 + 22], [0, 1], {
                  extrapolateLeft: 'clamp',
                  extrapolateRight: 'clamp',
                  easing: EASE_OUT,
                }),
                transform: `translateY(${(1 - interpolate(frame, [6 + tokens.length * 2 + 6, 6 + tokens.length * 2 + 22], [0, 1], {
                  extrapolateLeft: 'clamp',
                  extrapolateRight: 'clamp',
                  easing: EASE_OUT,
                })) * 26}px)`,
                filter: `blur(${(1 - interpolate(frame, [6 + tokens.length * 2 + 6, 6 + tokens.length * 2 + 22], [0, 1], {
                  extrapolateLeft: 'clamp',
                  extrapolateRight: 'clamp',
                  easing: EASE_OUT,
                })) * 9}px)`,
              }}
            >
              {subtext}
            </div>
          ) : null}
        </div>

        {hasImage ? (
          <div
            style={{
              width: '36%',
              aspectRatio: '4 / 3',
              borderRadius: 18,
              overflow: 'hidden',
              border: `1px solid ${rgba(palette.text, 0.14)}`,
              boxShadow: `0 24px 60px ${rgba(palette.text, 0.18)}`,
            }}
          >
            <Img
              src={image!}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                transform: `scale(${interpolate(frame, [0, duration], [1.0, 1.06], {
                  extrapolateLeft: 'clamp',
                  extrapolateRight: 'clamp',
                })})`,
              }}
            />
          </div>
        ) : null}
      </div>
    </AbsoluteFill>
  );
};
