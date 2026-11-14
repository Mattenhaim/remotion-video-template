import { Config } from '@remotion/cli/config';

Config.setVideoImageFormat('jpeg');
Config.setOverwriteOutput(true);
Config.setChromiumOpenGlRenderer('angle');
/**
 * 低内存默认：并发 1（用户的笔记本 E 盘跑渲染，内存未确认）。
 * 大内存机器可用 `npm run render:fast`（--concurrency=4）覆盖。
 */
Config.setConcurrency(1);
