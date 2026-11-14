/**
 * 视频装配：配置 → 场景序列 → 成片。
 *
 * 时间线规则（来自底盘 references/music-beat-sync.md）：
 * - 场景边界已由 timeline.layoutScenes 吸附到 BGM 节拍帧；
 * - 带入场转场的场景在边界前 K 帧开始渲染（重叠窗），旧场景在底层多渲染
 *   K 帧被覆盖；转场落点 = 节拍帧；
 * - BGM 整轨铺底，无旁白音轨；字幕条属各场景，随场景淡入淡出。
 */
import { AbsoluteFill, Audio, Sequence, staticFile } from 'remotion';
import { video } from '../video.config';
import { layoutScenes, TRANSITION_FRAMES, FPS } from './timeline';
import { SHOT_REGISTRY, DARK_SHOTS } from './shots';
import { plainText } from './lib/text';
import { lightInk, stageBg } from './lib/palette';
import { SubtitleBar } from './components/SubtitleBar';
import { PushUpEntrance, BlindsEntrance } from './transitions';

export const Video: React.FC = () => {
  const layout = layoutScenes(video);
  if (video.scenes.length === 0) throw new Error('video.config.ts: scenes 不能为空');
  if (layout.total > layout.maxDurationFrames) {
    throw new Error(
      `video.config.ts: 成片时长 ${layout.totalSeconds.toFixed(1)}s 超过上限 ${video.maxDurationSeconds ?? 90}s（${layout.total}f > ${layout.maxDurationFrames}f）。缩短部分场景的 durationFrames。`,
    );
  }

  const { palette } = video;
  const darkBg = stageBg(palette);
  const lightText = lightInk(palette);

  return (
    <AbsoluteFill style={{ backgroundColor: palette.bg }}>
      {/* BGM：整轨铺底，Remotion 在成片末尾自动截断 */}
      <Audio src={staticFile(video.bgm)} />

      {layout.scenes.map((s, i) => {
        const Shot = SHOT_REGISTRY[s.cfg.shot];
        if (!Shot) throw new Error(`video.config.ts: 未知镜头配方 "${s.cfg.shot}"（scene.id=${s.cfg.id}）`);
        const K = s.transitionIn === 'cut' ? 0 : TRANSITION_FRAMES[s.transitionIn];
        const nextK =
          i + 1 < layout.scenes.length && layout.scenes[i + 1].transitionIn !== 'cut'
            ? TRANSITION_FRAMES[layout.scenes[i + 1].transitionIn as 'push-up' | 'blinds']
            : 0;
        const sceneText = s.cfg.text.trim() !== '' ? s.cfg.text : video.title;
        const dark = DARK_SHOTS.has(s.cfg.shot);
        // blinds 叶片正面取前一场的底色（前场是暗场镜头时用暗底，避免翻面瞬间闪白）
        const prevDark = i > 0 ? DARK_SHOTS.has(layout.scenes[i - 1].cfg.shot) : false;
        const prevBg = prevDark ? darkBg : palette.bg;

        const content = (
          <>
            <Shot
              text={sceneText}
              subtext={s.cfg.subtext}
              image={s.cfg.image}
              flipText={s.cfg.flipText}
              duration={s.duration}
              palette={palette}
            />
            {video.subtitles && (s.cfg.subtitle ?? plainText(sceneText)).trim() !== '' ? (
              <SubtitleBar
                text={s.cfg.subtitle ?? plainText(sceneText)}
                duration={s.duration}
                dark={dark}
                subtextColor={palette.subtext}
                textColor={lightText}
                accent={palette.accent}
              />
            ) : null}
          </>
        );

        return (
          <Sequence
            key={s.cfg.id}
            from={s.start - K}
            durationInFrames={s.duration + nextK}
          >
            {/* isolation:isolate 建立场景级 stacking context：场景内部的 z-index
                不会逃逸到后续场景的转场覆盖层之上 */}
            <AbsoluteFill style={{ isolation: 'isolate' }}>
              {s.transitionIn === 'push-up' ? (
                // 面板带着内容一起从底边推入——内容钉在色底坐标系里随底色走
                //（bottom-push-stack-wipe 卡语义）；转场完成点 = 节拍边界
                <PushUpEntrance frames={K} bg={palette.bg}>
                  <Sequence from={0} durationInFrames={s.duration + K}>
                    {content}
                  </Sequence>
                </PushUpEntrance>
              ) : (
                <>
                  {/* 内容时钟从转场窗起点起算：blinds 波扫开的缝隙里露出的是
                      新场景的实际状态（wipe-transitions 卡语义） */}
                  <Sequence from={0} durationInFrames={s.duration + K}>
                    {content}
                  </Sequence>
                  {s.transitionIn === 'blinds' ? (
                    <BlindsEntrance frames={K} bg={prevBg} />
                  ) : null}
                </>
              )}
            </AbsoluteFill>
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
};

// 供 Root 静态注册使用（composition duration 需在注册期确定）
export const LAYOUT = layoutScenes(video);
export const FPS_OUT = FPS;
