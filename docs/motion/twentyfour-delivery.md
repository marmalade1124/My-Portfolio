# 交付说明：twentyfour.mp4

<!-- deliver.py 事实段：开始。这一段由脚本生成，不要改；改了 deliver.py --verify 会报出来 -->
## 事实（deliver.py 写入）

- 生成时间：2026-10-23 23:10:17
- 成片：`twentyfour.mp4`（sha256 297f092c778ef1bb；源文件 `C:\Users\razie\Downloads\Code Projects\2026Portfolio\tmp\huashu\twentyfour.mp4`）
- 时长 8.00s ｜ 960×600 ｜ 24fps ｜ 视频 h264 ｜ 音轨：无

### 门禁（film_gate）

- 结论：绿灯。快速运动帧占比 0.1789（< 0.035 红灯，< 0.06 黄灯）
- 一句话：镜头内有足够的快速动作（17.9%）。
- 最差 4 秒窗口：0–4s，快动帧占比 0.1667

| 灯 | 类型 | 指标 | 值 |
|---|---|---|---|
| 绿灯 | 门禁 | 快速运动帧占比 | 0.179 |
| 绿灯 | 门禁 | 中段近乎纯色的空画面（最长连续） | 0.000秒 |
| 绿灯 | 门禁 | 蓝紫底画面时长占比 | 0.000 |
| 绿灯 | 报告 | 最差30秒窗口的快动帧占比 | 0.167 |
| 只给数 | 报告 | 运动集中度（前10%帧占运动量） | 0.703 |
| 绿灯 | 报告 | 慢漂帧占比 | 0.011 |
| 只给数 | 报告 | 静止帧占比（静止本身不是坏事） | 0.800 |
| 绿灯 | 报告 | 最长连续静止 | 2.500秒 |
| 绿灯 | 报告 | 视觉事件密度 | 2.500次/10秒 |
| 绿灯 | 报告 | 最长无事件间隔 | 2.670秒 |
| 绿灯 | 报告 | 死背景（扣相机后镜内不变） | 0.000 |
| 绿灯 | 报告 | 死且平的空底 | 0.000 |
| 只给数 | 报告 | 平底色/空底面积 | 0.662 |
| 黄灯 | 报告 | 浅色空底面积（米底/白底） | 0.537 |
| 黄灯 | 报告 | 固定页框时长占比 | 0.375 |
| 绿灯 | 报告 | 匀速慢缩放镜头时长占比 | 0.000 |
| 绿灯 | 报告 | 推近次数（下限） | 0.000次/分钟 |
| 只给数 | 报告 | 其中 0.5 秒内的快推 | 0.000次/分钟 |
| 只给数 | 报告 | 推近占推拉事件比例 | 0.000 |
| 只给数 | 报告 | 慢漂相机镜头时长占比 | 0.000 |
| 绿灯 | 报告 | 交叉淡化占转场比例 | 0.000 |
| 只给数 | 报告 | 原地淡变占变化帧比例 | 0.000 |
| 只给数 | 报告 | 最大主体块占画面 | 0.300 |
| 只给数 | 报告 | 与示范构图相似的时长占比 | — |

### qa

- 跑过：`C:\Users\razie\Downloads\Code Projects\2026Portfolio\tmp\huashu\qa\twentyfour\qa.json`（写于 2026-10-23 23:06:42）
- 页面报错 0 条
- 确定性：1/1 段逐像素一致
- 跳变 0 处；另有镜头事件 0 个（2 秒以内单调、平滑的推拉/横移，不算跳变）
- 框景线索 0 条（半截字、叠字、进字幕带、近空白；是「去看这一帧」，不是错误）
  - motion：运动 3.09%，静止帧对 81.5%，跳变 0，1.2/3.8 ms/帧

### 独立审片

- 有 1 份审片记录（`C:\Users\razie\Downloads\Code Projects\2026Portfolio\docs\motion\审片`）：independent.md
- 脚本只确认文件存在，没有读内容；审片结论以文件本身为准
<!-- deliver.py 事实段：结束 sha256=591b996e273279819cb81948b2e95da8896953e8cd36def2f4654126fcc54586 -->

## 制作说明（制作者填写；只写在这一段，事实段不要动）

- 用了哪个语法 / 风格：
- 「六种做坏方式」逐条自查：
- 黄灯项逐条说明（时间码＋为什么可以这样）：
  - 米底/白底空着的面积平均占 54%（白板等浅底风格可以如此，确认是风格不是空着）：
  - 38% 的时长被固定的页眉、页码、标题栏、logo 框着：

Production notes: Huashu t2 screenshot-led treatment; clean white palette, no characters, no generated product UI, lateral transitions with reading holds, original gallery retained. No narration or invented performance metrics. Screens preserve their own UI and attribution.
White-area warning accepted across 0-8s: portrait screens are intentionally preserved rather than cropped; this is an overview with fullscreen controls and original images available for detail.
Fixed-chrome warning accepted at 0-5.3s: bars belong to the actual photographed UI, not an added decorative video frame.
