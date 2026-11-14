/**
 * 确定性随机与微工具。来源：Vincentwei1021/video-shotcraft assets/lib/helpers/rand.ts、
 * assets/lib/helpers/motion.ts（Apache-2.0）。动画全部帧号驱动，无状态累积。
 */

/** mulberry32 — 同一种子永远得到同一序列 */
export const mulberry32 = (seed: number) => {
  let a = seed | 0;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
};

/**
 * 闭环阻尼振荡（命中后的回弹/余晖尾），t 为命中后帧数。
 * 返回带符号衰减系数，乘上目标幅度使用。帧号纯函数。
 */
export const dampedSettle = (t: number, freq: number, damping: number): number =>
  t <= 0 ? 0 : Math.exp(-damping * t) * Math.sin(2 * Math.PI * freq * t);
