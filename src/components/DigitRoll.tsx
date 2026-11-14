/**
 * 数字滚动组件 — 复用 Vincentwei1021/video-shotcraft template/src/aifl/DigitRoll.tsx
 * （Apache-2.0）。里程表式数字位滚动，等宽数字；副标里的数字可用。
 */
import { interpolate, useCurrentFrame, Easing } from 'remotion';

const DIGITS = '0123456789';

export const DigitRoll: React.FC<{
  value: string;
  delay?: number;
  fontSize?: number;
  color?: string;
}> = ({ value, delay = 0, fontSize = 30, color = '#955905' }) => {
  const frame = useCurrentFrame();
  const lineH = fontSize * 1.15;
  return (
    <span style={{ display: 'inline-flex', overflow: 'hidden', height: lineH, verticalAlign: 'bottom' }}>
      {value.split('').map((ch, i) => {
        const target = DIGITS.indexOf(ch);
        if (target < 0) {
          return (
            <span key={i} style={{ fontSize, lineHeight: `${lineH}px`, color }}>{ch}</span>
          );
        }
        const t = interpolate(frame, [delay + i * 4, delay + i * 4 + 22], [0, 1], {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
          easing: Easing.bezier(0.25, 0.8, 0.25, 1),
        });
        // 先滚过一整条数字带再落位到目标数字
        const offset = (10 + target) * t * lineH;
        return (
          <span key={i} style={{ display: 'inline-block', height: lineH }}>
            <span style={{ display: 'block', transform: `translateY(${-offset}px)` }}>
              {(DIGITS + DIGITS).split('').map((d, j) => (
                <span
                  key={j}
                  style={{
                    display: 'block',
                    fontSize,
                    lineHeight: `${lineH}px`,
                    color,
                    fontVariantNumeric: 'tabular-nums',
                  }}
                >
                  {d}
                </span>
              ))}
            </span>
          </span>
        );
      })}
    </span>
  );
};
