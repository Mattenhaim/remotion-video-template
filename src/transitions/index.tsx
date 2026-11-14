/**
 * 两张转场卡（场景入场方式，作用于场景间重叠窗口）— 来源 Vincentwei1021/video-shotcraft references/shots/transition/（Apache-2.0，按卡规范实现）
 *
 * push-up   ← bottom-push-stack-wipe.md：新场景连底色整屏从底边向上推入，把旧场景物理顶出画外。
 * blinds    ← wipe-transitions.md（blinds-slice 式）：12 根 3D 叶片错峰翻面成波，波扫过后整页由 A 换成 B。
 *
 * 两者都是"新场景盖住旧场景"的不透明入场：旧场景在重叠窗内继续渲染在底层。
 * 全部帧号驱动（interpolate / spring），无 CSS transition。
 */
import { AbsoluteFill, interpolate, useCurrentFrame, Easing } from 'remotion';
import { rgba } from '../lib/palette';

export const PUSH_UP_FRAMES = 18;
export const BLINDS_FRAMES = 24;
const BLIND_COUNT = 12;

/** push-up：新场景整屏从底边向上推入（带投影上缘），K 帧内完成，落点在拍上 */
export const PushUpEntrance: React.FC<{ frames: number; bg: string; children: React.ReactNode }> = ({
  frames,
  bg,
  children,
}) => {
  const frame = useCurrentFrame();
  const p = interpolate(frame, [0, frames], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.out(Easing.cubic),
  });
  return (
    <AbsoluteFill style={{ overflow: 'hidden' }}>
      <AbsoluteFill
        style={{
          backgroundColor: bg,
          transform: `translateY(${(1 - p) * 100}%)`,
          boxShadow: `0 -18px 44px rgba(0,0,0,0.28)`,
        }}
      >
        {children}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

/** blinds：12 根叶片错峰翻面成波，扫过后露出新场景（叶片正面为旧场底色） */
export const BlindsEntrance: React.FC<{ frames: number; bg: string }> = ({ frames, bg }) => {
  const frame = useCurrentFrame();
  const stagger = frames / (BLIND_COUNT + 2); // 叶片间错峰
  const flipDur = frames - stagger * (BLIND_COUNT - 1) - 2;
  return (
    <AbsoluteFill style={{ perspective: 1400, pointerEvents: 'none' }}>
      {Array.from({ length: BLIND_COUNT }, (_, i) => {
        const start = i * stagger;
        const t = interpolate(frame, [start, start + flipDur], [0, 1], {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
          easing: Easing.bezier(0.5, 0, 0.3, 1),
        });
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: `${(100 / BLIND_COUNT) * i}%`,
              top: 0,
              width: `${100 / BLIND_COUNT + 0.15}%`, // +0.15% 防叶片接缝漏光
              height: '100%',
              backgroundColor: bg,
              transformOrigin: 'top center',
              transform: `rotateX(${-t * 90}deg)`,
              backfaceVisibility: 'hidden',
              boxShadow: `0 6px 14px ${rgba('#000000', 0.12)}`,
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};
