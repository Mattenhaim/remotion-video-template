#!/usr/bin/env node
/**
 * 配置校验：npm run check
 * 检查 video.config.ts：镜头配方名合法、时长与节拍吸附结果、成片总时长上限、
 * BGM / 配图 / beat_data.json 存在性。只读，不改任何文件。
 *
 * Node 22.6+ 原生支持 TS 类型剥离（video.config.ts 只用可擦除语法）。
 */
import { access, stat } from 'node:fs/promises';
import { resolve, dirname } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const importPath = (p) => pathToFileURL(p).href;

let video;
try {
  video = (await import(importPath(resolve(ROOT, 'video.config.ts')))).video;
} catch (e) {
  console.error('✗ video.config.ts 无法加载：', e.message);
  process.exit(1);
}

const errors = [];
const warns = [];

const SHOT_IDS = new Set([
  'blur-slide', 'brace-expand', 'marker-underline', 'outline-word-fill',
  'paper-title-card', 'gradient-word-sweep', 'spotlight-sweep', 'dark-flip',
]);
const TRANSITIONS = new Set(['cut', 'push-up', 'blinds']);

const HEX = /^#[0-9a-fA-F]{6}$/;

// ── 基本字段 ──
if (!video.title || video.title.trim() === '') errors.push('title 不能为空');
for (const [k, v] of Object.entries(video.palette ?? {})) {
  if (!HEX.test(v)) errors.push(`palette.${k}="${v}" 不是 #RRGGBB`);
}
if (!Array.isArray(video.scenes) || video.scenes.length === 0) errors.push('scenes 不能为空');

// ── beat_data ──
let beats = null;
try {
  await access(resolve(ROOT, 'analysis', 'beat_data.json'));
  beats = (await import(importPath(resolve(ROOT, 'analysis', 'beat_data.json')), { with: { type: 'json' } })).default;
  if (!beats?.T || !beats?.t0) errors.push('analysis/beat_data.json 缺少 t0/T 字段（重跑 npm run beats）');
} catch {
  errors.push('analysis/beat_data.json 不存在——先跑 npm run beats');
}

// ── 场景 ──
const ids = new Set();
const FPS = 30;
let rawTotal = 0;
let unsnapped = 0;
const snappedBounds = [];

for (const [i, s] of (video.scenes ?? []).entries()) {
  const tag = `scenes[${i}] (id=${s.id ?? '?'})`;
  if (!s.id) errors.push(`${tag}: 缺 id`);
  else if (ids.has(s.id)) errors.push(`${tag}: id 重复`);
  ids.add(s.id);
  if (!SHOT_IDS.has(s.shot)) errors.push(`${tag}: 未知镜头配方 "${s.shot}"（可用：${[...SHOT_IDS].join(', ')}）`);
  if (!Number.isFinite(s.durationFrames) || s.durationFrames < 10) errors.push(`${tag}: durationFrames 必须 ≥10`);
  if (s.transitionIn && !TRANSITIONS.has(s.transitionIn)) errors.push(`${tag}: transitionIn="${s.transitionIn}" 不合法（cut/push-up/blinds）`);
  if (s.image) {
    try { await access(resolve(ROOT, 'public', s.image)); } catch { errors.push(`${tag}: 配图不存在 public/${s.image}`); }
  }
  rawTotal += s.durationFrames ?? 0;
  // 吸附复算（与 src/timeline.ts 同逻辑）
  if (beats?.T) {
    const n = Math.round((rawTotal / FPS - beats.t0) / beats.T);
    const bf = Math.round((beats.t0 + n * beats.T) * FPS);
    const radius = Math.round((beats.T * FPS) / 2) + 2;
    const ok = Math.abs(bf - rawTotal) <= radius && bf > 0;
    if (!ok) unsnapped++;
    snappedBounds.push(ok ? bf : rawTotal);
  } else {
    snappedBounds.push(rawTotal);
  }
}
const snappedTotal = snappedBounds.length > 0 ? snappedBounds[snappedBounds.length - 1] : 0;
if (unsnapped > 0) warns.push(`${unsnapped} 个场景边界 ±半拍内没有节拍帧，保留原始帧号`);

// ── BGM ──
if (!video.bgm) errors.push('bgm 字段缺失');
else {
  const p = resolve(ROOT, 'public', video.bgm);
  try {
    await access(p);
    if (beats && beats.source !== video.bgm) {
      warns.push(`beat_data.json 是对 "${beats.source}" 分析的，与当前 bgm="${video.bgm}" 不一致——换曲后请重跑 npm run beats`);
    } else if (beats) {
      const bgmMtime = (await stat(p)).mtimeMs;
      try {
        const aMtime = (await stat(resolve(ROOT, 'analysis', 'beat_data.json'))).mtimeMs;
        if (bgmMtime > aMtime) warns.push('BGM 文件比 beat_data.json 新——曲子换过的话请重跑 npm run beats');
      } catch { /* ignore */ }
    }
  } catch {
    errors.push(`BGM 文件不存在 public/${video.bgm}。模板不捆绑音乐：放自己的曲子，或按 README 下载 Demo 曲（Mixkit 免费商用）`);
  }
}

// ── 总时长 ──
const maxSec = video.maxDurationSeconds ?? 90;
const totalFrames = beats?.T ? snappedTotal : rawTotal;
const totalSec = totalFrames / FPS;
if (totalSec > maxSec) errors.push(`成片时长 ${totalSec.toFixed(1)}s 超过上限 ${maxSec}s`);

// ── 报告 ──
console.log(`标题: ${video.title}`);
console.log(`BGM: ${video.bgm ?? '✗'}${beats ? `  →  ${beats.bpm} BPM, 1拍≈${(beats.T * FPS).toFixed(1)}f` : ''}`);
console.log(`场景数: ${video.scenes.length}（原始 ${rawTotal}f → 吸附后 ${totalFrames}f ≈ ${totalSec.toFixed(1)}s，上限 ${maxSec}s）`);
for (const [i, s] of (video.scenes ?? []).entries()) console.log(`  ${i + 1}. ${s.id.padEnd(14)} ${String(s.shot).padEnd(18)} ${String(s.durationFrames).padStart(4)}f  ${s.transitionIn ?? 'cut'}`);
console.log(`字幕条: ${video.subtitles ? '开' : '关'}`);
if (warns.length) for (const w of warns) console.log(`⚠  ${w}`);
if (errors.length) {
  for (const e of errors) console.error(`✗ ${e}`);
  process.exit(1);
}
console.log('✓ 配置校验通过');
