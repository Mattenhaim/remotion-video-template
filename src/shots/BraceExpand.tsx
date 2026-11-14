/**
 * 镜头卡 brace-expand — 来源 Vincentwei1021/video-shotcraft references/shots/typography/brace-expand.md
 * （Apache-2.0，按卡规范实现；数值按 1920×1080 原生作画调整）
 *
 * 一对紧贴的花括号先在正中出现，随即带一次过冲向左右弹开并放大到标题级；
 * 文字 clip 宽度严格绑括号内缘，像被拉开幕布般从中间揭示；落定后字距松弛。
 * 命门：文字自己不淡入不擦入，只被括号"括出来"。
 */
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig, Easing } from 'remotion';
import { FONT_MONO, FONT_SANS, fitTitleSize, type SceneProps } from './common';
import { plainText } from '../lib/text';

export const BraceExpand: React.FC<SceneProps> = ({ text, subtext, duration, palette }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const fadeOut = interpolate(frame, [duration - 10, duration], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const HALF = 780; // 弹开半程（px）
  const INNER = 56; // 落定时括号内缘到文字边缘的距离（px）

  // 0–6f 输入光标闪烁 → 6f 硬切替换成 0.4 倍紧贴括号 → 14f 弹开
  const cursorOn = frame < 6;
  const blink = Math.floor(frame / 2) % 2 === 0;

  // 弹开：一次可见回弹的物理弹簧（起跳 ~8f 到位、~11f 过冲 ≈9%、~24f 收敛）
  const ex = spring({ frame: frame - 14, fps, config: { damping: 14, stiffness: 130 } });
  const sc = 0.4 + 0.6 * ex; // 括号放大 0.4 → 1.0，与位移乘在一起
  const halfW = (HALF - INNER) * ex * sc; // 幕布半宽：位移与缩放叠乘
  const braceOffset = halfW + INNER * sc;

  // 落定后字距松弛（40–64f smooth）：呼一口气
  const letterSpacing = interpolate(frame, [40, 64], [-0.05, -0.03], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.bezier(0.3, 0, 0.3, 1),
  });

  const fontSize = fitTitleSize(plainText(text), 300, 110);
  const glow = interpolate(frame, [14, 25, 64], [0.4, 1, 0.25], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill style={{ backgroundColor: palette.bg, opacity: fadeOut, justifyContent: 'center', alignItems: 'center' }}>
      {/* 顶光 */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: `radial-gradient(1400px 520px at 50% -8%, ${palette.accent}14, transparent 70%)`,
        }}
      />

      {/* 文字层：clip 宽度严格绑括号内缘 */}
      <div style={{ position: 'relative', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        {/* 文字（居中固定，宽度被 clip 收窄） */}
        <div
          style={{
            position: 'absolute',
            width: 1560,
            textAlign: 'center',
            transform: `scale(${sc})`,
          }}
        >
          <div
            style={{
              overflow: 'hidden',
              margin: '0 auto',
              width: halfW * 2,
              transition: 'none',
            }}
          >
            <span
              style={{
                fontFamily: FONT_SANS,
                fontWeight: 800,
                fontSize,
                lineHeight: 1.1,
                color: palette.text,
                letterSpacing: `${letterSpacing}em`,
                whiteSpace: 'nowrap',
                display: 'inline-block',
                verticalAlign: 'bottom',
              }}
            >
              {text}
            </span>
          </div>
          {subtext ? (
            <div
              style={{
                fontFamily: FONT_SANS,
                fontSize: 40,
                fontWeight: 500,
                color: palette.subtext,
                marginTop: 30,
                opacity: interpolate(frame, [70, 84], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }),
              }}
            >
              {subtext}
            </div>
          ) : null}
        </div>

        {/* 一对花括号 */}
        {[-1, 1].map((dir) => (
          <span
            key={dir}
            style={{
              fontFamily: FONT_MONO,
              fontWeight: 300,
              fontSize: Math.min(360, fontSize * 1.35),
              lineHeight: 1,
              color: palette.accent,
              textShadow: `0 0 ${34 * glow}px ${palette.accent}66`,
              transform: `translateX(${dir * braceOffset}px) scale(${sc})`,
              display: 'inline-block',
              position: 'relative',
              zIndex: 1,
            }}
          >
            {dir < 0 ? '{' : '}'}
          </span>
        ))}

        {/* 开场输入光标（编辑器语感） */}
        {cursorOn ? (
          <span
            style={{
              position: 'absolute',
              fontFamily: FONT_MONO,
              fontSize: 120,
              color: palette.text,
              opacity: blink ? 1 : 0.15,
            }}
          >
            |
          </span>
        ) : null}
      </div>
    </AbsoluteFill>
  );
};
