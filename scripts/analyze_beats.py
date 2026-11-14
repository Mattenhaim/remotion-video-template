# -*- coding: utf-8 -*-
"""
BGM 节拍网格分析（离线，一次性跑）。

方法来自底盘 Vincentwei1021/video-shotcraft references/music-beat-sync.md §1/§3：
  1) librosa.beat.beat_track 取 beat 时刻序列；
  2) 对 beat 序列做最小二乘等距网格拟合，求真实 BPM 与相位
     （不信任 beat_track 的 tempo 标量，偏差可达 2%+）；
  3) 0.5x / 1x / 2x 半倍双倍歧义，用 onset 包络在网格点上的均值覆盖率仲裁；
  4) 残差 > ±15ms 打 warning（说明非机器鼓点或变速曲，卡点需谨慎）。

输出 analysis/beat_data.json：bpm / t0 / T / beats[]（浮点秒，不预取整），
downstream 只依赖 bpm / t0 / T（hits / rms / sections 本模板未用，不产出）。

用法：把 BGM 放到 video.config.ts 的 bgm 指向的路径，然后 `npm run beats`。
依赖：python -m pip install librosa scipy
"""
import json
import sys
import datetime
from pathlib import Path

import numpy as np
import librosa

FPS = 30
SNAP_RADIUS_FRAMES = 7  # 吸附半径（帧），与 src/timeline.ts 保持一致

ROOT = Path(__file__).resolve().parent.parent


def read_bgm_path() -> str:
    """从 video.config.ts 里读 bgm 字段（宽松正则，避免引 Node 依赖）。"""
    import re
    text = (ROOT / "video.config.ts").read_text(encoding="utf-8")
    m = re.search(r"bgm\s*:\s*[\"']([^\"']+)[\"']", text)
    if not m:
        sys.exit("ERROR: video.config.ts 里找不到 bgm 字段")
    return m.group(1)


def fit_grid(beats: np.ndarray):
    """最小二乘等距网格拟合：t_i = t0 + i*T。返回 (T, t0, 残差最大毫秒)。"""
    i = np.arange(len(beats))
    A = np.vstack([i, np.ones_like(i)]).T
    (T, t0), *_ = np.linalg.lstsq(A, beats, rcond=None)
    residual = beats - (t0 + i * T)
    return float(T), float(t0), float(np.abs(residual).max() * 1000)


def grid_score(kick_times: np.ndarray, T: float, t0: float, dur: float):
    """
    候选网格打分：kick 瞬态被网格覆盖的比例（music-beat-sync §2a/§3 判据——
    正确的网格下 kick 应主要落在整数拍上；稀疏网格会漏掉一半 kick）。
    """
    n = int((dur - t0) / T)
    if n < 8:
        return -1.0
    grid = t0 + np.arange(n) * T
    # 每个 kick 到最近网格点的距离
    idx = np.searchsorted(grid, kick_times)
    best = np.full(len(kick_times), np.inf)
    for cand in (idx - 1, idx):
        ok = (cand >= 0) & (cand < len(grid))
        d = np.abs(kick_times[ok] - grid[cand[ok]])
        best[ok] = np.minimum(best[ok], d)
    return float(np.mean(best <= 0.040))


def main():
    rel = read_bgm_path()
    bgm = ROOT / "public" / rel
    if not bgm.exists():
        sys.exit(f"ERROR: BGM 文件不存在：{bgm}\n把 BGM 放进去（或改 video.config.ts 的 bgm 路径）后再跑 npm run beats")

    print(f"analyzing {bgm} ...")
    y, sr = librosa.load(str(bgm), sr=None, mono=True)
    dur = len(y) / sr

    tempo, beats = librosa.beat.beat_track(y=y, sr=sr, tightness=400, units="time")
    T, t0, resid_ms = fit_grid(np.asarray(beats))
    print(f"raw fit: BPM={60.0 / T:.2f}  t0={t0:.4f}s  T={T:.5f}s  residual=±{resid_ms:.1f}ms")

    # 半倍/双倍歧义仲裁（music-beat-sync §3），双证据规则：
    #   a) kick 频段（40–110Hz，hpss 打击成分）瞬态覆盖率：正确网格下 kick 落整数拍
    #   b) 低频包络：整拍点能量 vs 半拍点能量——真加倍脉冲的半拍点应比整拍点更"重"
    # 两证齐全才切倍率；否则保持原始拟合（残差 ≤15ms 本身就是网格可信的证据）。
    # 已知坑（cat-walk 实测踩过）：house 曲的反拍贝斯 stab 也是低频打击型短音，
    # 只看覆盖率会把 130 BPM 误判成 260。
    from scipy.signal import butter, sosfilt
    y_perc, _ = librosa.effects.hpss(y)
    sos = butter(4, [40, 110], btype="band", fs=sr, output="sos")
    kick_env = librosa.onset.onset_strength(y=sosfilt(sos, y_perc), sr=sr)
    kick_times = librosa.onset.onset_detect(onset_envelope=kick_env, sr=sr, units="time", backtrack=False)
    candidates = {"0.5x(=2x BPM)": (T / 2, t0), "1x": (T, t0), "2x(=0.5x BPM)": (T * 2, t0)}
    scores = {k: grid_score(kick_times, tt, tt0, dur) for k, (tt, tt0) in candidates.items()}

    n1 = int((dur - t0) / T)
    b_frames = ((t0 + np.arange(n1) * T) * sr / 512).astype(int)
    m_frames = ((t0 + (np.arange(n1) + 0.5) * T) * sr / 512).astype(int)
    b_frames = b_frames[b_frames < len(kick_env)]
    m_frames = m_frames[m_frames < len(kick_env)]
    env_beats = float(np.mean(kick_env[b_frames])) if len(b_frames) else 0.0
    env_mids = float(np.mean(kick_env[m_frames])) if len(m_frames) else 0.0
    print(f"kick coverage: " + ", ".join(f"{k}={v:.3f}" for k, v in scores.items()))
    print(f"low-band env at beats={env_beats:.3f}  at midpoints={env_mids:.3f}")

    best = max(scores, key=scores.get)
    switched = False
    if best.startswith("2x(") and scores[best] > scores["1x"] + 0.15:
        T, t0 = candidates[best]
        switched = True  # beat_track 少检了一倍：kick 只落在一半网格点上
    elif best.startswith("0.5x(") and scores[best] > scores["1x"] + 0.15 and env_mids > env_beats:
        T, t0 = candidates[best]
        switched = True  # 脉冲真的加倍：半拍点比整拍点更重
    print(f"→ {'采用 ' + best if switched else '保持 1x 网格'}")

    n_beats = int((dur - t0) / T)
    grid = (t0 + np.arange(n_beats) * T)
    bpm = 60.0 / T

    out = {
        "bpm": round(bpm, 2),
        "t0": round(t0, 5),
        "T": round(T, 6),
        "beats": [round(float(b), 5) for b in grid],
        "source": rel,
        "analyzedAt": datetime.datetime.now(datetime.timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ"),
        "note": "librosa beat_track + 最小二乘网格拟合（music-beat-sync §1），0.5x/1x/2x 覆盖率仲裁（§3 简化版）",
    }
    if resid_ms > 15 and best == "1x":
        print(f"WARNING: 残差 ±{resid_ms:.1f}ms > 15ms——曲子可能非机器鼓点或含变速段，卡点误差可能偏大")

    dst = ROOT / "analysis" / "beat_data.json"
    dst.write_text(json.dumps(out, ensure_ascii=False, indent=2), encoding="utf-8")
    print(f"OK  bpm={out['bpm']}  t0={out['t0']}s  T={out['T']}s  beats={len(out['beats'])}")
    print(f"    → {dst}")
    print(f"    全片 {dur:.1f}s ≈ {n_beats} 拍；1 拍 ≈ {T * FPS:.1f} 帧 @ {FPS}fps")
    print(f"    场景边界吸附半径 ±{SNAP_RADIUS_FRAMES}f（src/timeline.ts）")


if __name__ == "__main__":
    main()
