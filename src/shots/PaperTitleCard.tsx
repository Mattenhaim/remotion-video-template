/**
 * 镜头卡 paper-title-card — 复用 Vincentwei1021/video-shotcraft
 * template/src/aifl/PaperTitleCard.tsx（Apache-2.0）。
 * 改动：去掉 visual-theme 上下文，改为直接接收 video.config.ts 的 palette；
 * 字体栈加入中文字体；DigitRoll 随附（底盘 assets/lib/DigitRoll.tsx 同源）。
 *
 * 一句话逐词压印上纸（scale 1.28→1 + blur 7→0）、一个词标强调色斜体、
 * 短划线收束。章节转场/价值主张字卡/全片呼吸位。
 */
import { AbsoluteFill, interpolate, useCurrentFrame, Easing } from 'remotion';
import { FONT_SERIF, FONT_MONO, type SceneProps } from './common';
import { DigitRoll } from '../components/DigitRoll';
import { tokenize } from '../lib/text';

export const PaperTitleCard: React.FC<SceneProps> = ({ text, subtext, duration, palette }) => {
  const frame = useCurrentFrame();
  const words = tokenize(text);
  const fadeOut = interpolate(frame, [duration - 8, duration], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const underline = interpolate(frame, [16, 34], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.bezier(0.3, 0, 0.2, 1),
  });
  const subT = interpolate(frame, [10, 22], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const fontSize = Math.max(88, Math.min(150, Math.round(1700 / Math.max(1, words.length))));

  return (
    <AbsoluteFill
      style={{
        backgroundColor: palette.bg,
        justifyContent: 'center',
        alignItems: 'center',
        opacity: fadeOut,
        backgroundImage: `radial-gradient(1100px 750px at 50% 42%, rgba(255,255,255,0.5), transparent 65%)`,
      }}
    >
      <div style={{ textAlign: 'center', maxWidth: 1500 }}>
        <div
          style={{
            fontFamily: FONT_SERIF,
            fontSize,
            fontWeight: 600,
            lineHeight: 1.2,
            color: palette.text,
            letterSpacing: '-0.012em',
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            columnGap: '0.26em',
          }}
        >
          {words.map((w, i) => {
            const delay = 4 + i * 4;
            const t = interpolate(frame, [delay, delay + 9], [0, 1], {
              extrapolateLeft: 'clamp',
              extrapolateRight: 'clamp',
              easing: Easing.bezier(0.2, 0.75, 0.3, 1),
            });
            return (
              <span
                key={i}
                style={{
                  opacity: t,
                  transform: `scale(${1.28 - 0.28 * t})`,
                  filter: `blur(${(1 - t) * 7}px)`,
                  display: 'inline-block',
                  color: w.accent ? palette.accent : undefined,
                  // 强调词的斜体只对拉丁字形自然；CJK 用强调色区分
                  fontStyle: w.accent ? 'italic' : 'normal',
                }}
              >
                {w.text}
              </span>
            );
          })}
        </div>
        {/* 短划线收束 */}
        <div
          style={{
            height: 6,
            width: 220,
            margin: '38px auto 0',
            borderRadius: 3,
            background: palette.accent,
            transform: `scaleX(${underline})`,
          }}
        />
        {subtext ? (
          <div
            style={{
              fontFamily: FONT_MONO,
              fontSize: 30,
              letterSpacing: '0.12em',
              color: palette.subtext,
              marginTop: 34,
              opacity: subT,
            }}
          >
            {subtext}
          </div>
        ) : null}
      </div>
    </AbsoluteFill>
  );
};
