# AiToVoice 开发路线图

> Phase 0（架构重整）完成后，按以下阶段递进开发。每个 Phase 独立可交付，后续 Phase 在前一 Phase 基础上扩展。

---

## Phase 1: 功能补全（让现有功能真正可用）

**目标**：所有已实现的功能模块真正可用，不再是 stub 或 mock。

| 任务 | 说明 | 优先级 |
|------|------|--------|
| 1.1 录音室功能 | MediaRecorder API 录音、上传到后端、TarsosDSP 音高分析、评分展示、练习进度追踪 | P0 |
| 1.2 歌词显示 | 后端 LyricsService 已有，前端 lrc-parser 解析 + 同步滚动歌词组件 | P0 |
| 1.3 歌曲上传修复 | 提取音频时长（不再硬编码 0）、关联 artist/genre、封面图处理 | P1 |
| 1.4 播放器 bug 修复 | shuffle 排除当前歌曲、playPrev 支持 repeat-one、进度持久化到 localStorage | P1 |
| 1.5 文件服务修复 | 前端音频 URL 与后端 FileController 路径对齐，确保播放可用 | P1 |
| 1.6 音乐源接入 | 接入免费音乐 API（NeteaseCloudMusicApi / free-music-api），丰富曲库 | P0 |

---

## Phase 2: 前端 UI 重构（去 AI 味，苹果风）

**目标**：视觉体验从"能用"提升到"好用好看"，统一设计语言，去除通用 AI 生成感。

| 任务 | 说明 | 工具 |
|------|------|------|
| 2.1 全局设计语言 | 色彩体系、字体选择、间距规范、圆角/阴影、CSS 变量 | `frontend-design` skill |
| 2.2 首页重设计 | 歌曲卡片网格、推荐区域、入场动效、骨架屏加载 | `frontend-design` skill |
| 2.3 播放器重设计 | 迷你播放器 + 全屏播放器、歌词同步显示、封面旋转动画、进度条美化 | `frontend-design` skill |
| 2.4 侧边栏 & 导航 | 选中态高亮、折叠态、路由过渡动画、活跃指示器 | `frontend-design` skill |
| 2.5 AI 老师页面 | 聊天气泡样式、打字机效果、会话列表、Markdown 渲染 | `frontend-design` skill |
| 2.6 录音室页面 | 录音波形实时显示、评分仪表盘、练习进度可视化 | `frontend-design` skill |

---

## Phase 3: 后端增强（参考 yuemu 项目模式）

**目标**：后端从"能跑"提升到"生产级"，具备缓存、限流、搜索、实时通信能力。

| 任务 | 说明 | 参考 |
|------|------|------|
| 3.1 Redis 缓存 | 热门歌曲、排行榜、推荐结果缓存，Caffeine 本地缓存 + Redis 二级缓存 | yuemu 的 CounterManager + Redisson |
| 3.2 限流 | `@RateLimiter` 注解 + AOP，保护登录/上传/搜索等敏感端点 | yuemu 的 RedisRateLimiterAspect |
| 3.3 ES 搜索 | Elasticsearch 全文搜索替代 JPA LIKE 查询，支持拼音、模糊、高亮 | yuemu 的 esdao 层 |
| 3.4 WebSocket 实时通知 | 新消息推送、系统公告、在线状态 | yuemu 的 WebSocket + Disruptor |
| 3.5 定时任务 | 排行榜定时更新、推荐算法计算、过期数据清理、ES 同步 | yuemu 的 job 层 |
| 3.6 内容审核 | AI 辅助审核评论/歌词内容，敏感词过滤 | yuemu 的内容审核机制 |

---

## Phase 4: 高级功能

**目标**：差异化功能，提升用户粘性。

| 任务 | 说明 |
|------|------|
| 4.1 桌面歌词窗口 | Electron 子窗口 + 歌词同步 + 透明背景 |
| 4.2 迷你播放器 | 系统托盘迷你控制面板 |
| 4.3 音频可视化 | Wavesurfer.js 波形/频谱/柱状图显示 |
| 4.4 用户主页 | 个人空间、收藏列表、播放历史、粉丝/关注 |
| 4.5 歌单广场 | 公开歌单浏览、收藏、编辑、推荐 |
| 4.6 社交增强 | 歌曲评论区、动态分享、@提及 |
| 4.7 离线缓存 | 喜欢的歌曲本地缓存，离线可播放 |

---

## 免费音乐源调研

### 全量播放（完整歌曲）

| API | 全量播放 | 需要认证 | 需要自部署 | 内容 | 适合场景 |
|-----|---------|---------|-----------|------|---------|
| **NeteaseCloudMusicApi** | ✅ 完整 | ❌ | ✅ Node.js/Docker | 网易云全量（中文主流） | 中文曲库、歌词、歌单 |
| **Audius** | ✅ 完整 | ❌ (app_name) | ❌ | 独立音乐人作品 | 免费发现、无门槛 |
| **Jamendo** | ✅ 完整 | 免费 key | ❌ | CC 协议独立音乐 | 版权安全、背景音乐 |

### 仅预览（30 秒片段）

| API | 预览时长 | 需要认证 | 内容 | 适合场景 |
|-----|---------|---------|------|---------|
| **iTunes Search** | 30s | ❌ | Apple Music 曲库 | 快速搜索、封面图 |
| **Deezer** | 30s | ❌ | Deezer 曲库 | 快速搜索 |
| **Spotify** | 30s | OAuth | Spotify 曲库 | 元数据、推荐 |

### 仅元数据（无播放）

| API | 需要认证 | 内容 | 适合场景 |
|-----|---------|------|---------|
| **MusicBrainz** | ❌ | 音乐百科 | 歌手/专辑信息补充 |
| **Last.fm** | 免费 key | 听众数据 | 相似歌曲、标签、热度 |

### 推荐集成方案

**三层架构**：

```
前端 → Java 后端 → MusicSourceProvider 接口
                         ├── AudiusProvider (免费、无门槛、全量播放)
                         ├── NeteaseProvider (中文主流、歌词、需自部署)
                         ├── JamendoProvider (CC 协议、版权安全)
                         └── iTunesProvider (搜索补充、封面图)
```

**Phase 1.6 实现优先级**：
1. **Audius** — 零配置，即刻可用，全量播放
2. **NeteaseCloudMusicApi** — Docker 部署，中文曲库补充
3. **iTunes Search** — 搜索补充 + 高清封面图

**Java 集成方式**：
- 创建 `MusicSourceProvider` 接口（search, getStreamUrl, getLyrics）
- 各实现类用 `HttpClient` 调用 REST API
- `MusicSourceService` 聚合多个 Provider，去重返回统一结果
- Song 实体的 `sourceType` 枚举扩展：`LOCAL, NETEASE, AUDIUS, JAMENDO`

---

## 版本规划

| 版本 | 包含 Phase | 核心里程碑 |
|------|-----------|-----------|
| v2.1 | Phase 1 | 功能完整可用 + 音乐源接入 |
| v3.0 | Phase 2 | UI 全面重构（苹果风） |
| v3.1 | Phase 3 | 后端生产级（缓存/限流/搜索/实时） |
| v4.0 | Phase 4 | 高级功能完整（桌面歌词/离线缓存/社交） |
