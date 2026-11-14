import { Composition } from 'remotion';
import { Video, LAYOUT, FPS_OUT } from './Video';

/**
 * 组合注册：1920×1080、30fps，与用户现有视频规格一致。
 * 时长由 video.config.ts 的场景序列经节拍吸附后静态算出（LAYOUT.total）。
 */
export const Root: React.FC = () => {
  return (
    <Composition
      id="MainVideo"
      component={Video}
      durationInFrames={LAYOUT.total}
      fps={FPS_OUT}
      width={1920}
      height={1080}
    />
  );
};
