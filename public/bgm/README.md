# BGM 放这里

模板**不捆绑任何音乐**。把你的 BGM（MP3）放进本目录，然后把 `video.config.ts`
的 `bgm` 改成对应文件名（相对 `public/`，如 `bgm/my-song.mp3`），再跑一次
`npm run beats` 重新分析节拍网格。

## Demo 曲（可选，Mixkit 免费商用，免署名）

Demo 配置用的曲目是 **Cat Walk — Arulo**（House，约 130 BPM），来自 Mixkit
Stock Music Free License（可商用、免署名）。下载后放进来即可复现 Demo：

```
curl -L -o public/bgm/cat-walk.mp3 https://assets.mixkit.co/music/371/371.mp3
npm run beats
npm run render
```

出处与授权见底盘仓库 Vincentwei1021/video-shotcraft 的
`assets/audio/ATTRIBUTION.md`；商用前请在 Mixkit 复核一次授权条款。
