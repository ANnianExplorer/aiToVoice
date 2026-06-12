# AiToVoice - 桌面音乐播放器 + AI 声乐教练

> 设计总览 | 2026-06-10

## 项目概述

仿 Spotify 风格的桌面音乐播放器，集成 AI 声乐教练功能。用户可以播放本地/在线音乐，录制自己的演唱并获得 AI 发声指导。

**技术栈**: Java 17 SpringBoot 3.2 + Electron 28 + React 18 + TypeScript + MySQL 8.0

---

## 文档索引

| 文档 | 路径 | 内容 |
|------|------|------|
| 架构决策记录 | [docs/architecture/decisions.md](../architecture/decisions.md) | 6 项 ADR：架构方案、AI集成、音乐来源、UI风格、数据库选择、模块结构演进 |
| 数据库设计 | [docs/database/schema.md](../database/schema.md) | 22 张表结构、字段说明、ER 关系 |
| API 接口文档 | [docs/api/endpoints.md](../api/endpoints.md) | ~70 个 RESTful 接口、请求/响应格式 |
| 功能规格 | [docs/features/spec.md](../features/spec.md) | 10 大功能模块详情、15 个前端页面、UI 布局 |
| 代码规范 | [docs/standards/code-style.md](../standards/code-style.md) | Java 17 语法、分层架构、命名规范、TypeScript 规范 |
| 实施计划 | [docs/superpowers/plans/2026-06-10-aitovoice-implementation.md](../plans/2026-06-10-aitovoice-implementation.md) | 分阶段实施步骤、代码模板 |

---

## 架构概览

```
Electron (React + TypeScript + Ant Design)
    │ HTTP/REST + WebSocket
SpringBoot (Java 17 + Spring Data JPA)
    │
MySQL 8.0
```

### 后端模块（6 个）

```
com.aitovoice/
├── common/     # BaseEntity, ApiResponse, ErrorCode, GlobalExceptionHandler
├── config/     # SecurityConfig, CorsConfig, OpenApiConfig
├── auth/       # JWT, 登录注册
├── user/       # 用户 + 设置
├── music/      # 歌曲 + 歌手 + 专辑 + 流派 + 歌单 + 排行榜 + 推荐 + 文件服务 + 歌词
├── social/     # 评论 + 私信 + 关注
└── voice/      # 录音 + 分析 + 练习 + AI 老师
```

每个模块内按 `controller/` `service/` `repository/` `entity/` `dto/` 子目录组织。

### 功能模块（10 个）

| # | 模块 | 核心功能 |
|---|------|---------|
| 1 | 用户认证 | 注册、登录、JWT 鉴权、个人资料 |
| 2 | 音乐播放 | 播放/暂停/上下曲、进度条、播放模式、音量控制 |
| 3 | 音乐库 | 本地文件导入、在线搜索、歌单管理、收藏、历史 |
| 4 | 设置 | 主题、快捷键、音频质量、缓存 |
| 5 | 语音录制 | 录音、同步录制、回放 |
| 6 | 发声分析 | 音高/节拍检测、原唱对比、评分 |
| 7 | AI 老师 | 声乐教练对话、音乐助手 |
| 8 | 推荐 | 每日推荐、私人 FM、相似歌曲 |
| 9 | 歌词 | LRC 解析、逐行同步、桌面歌词 |
| 10 | 社交 | 评论、私信、关注/粉丝 |

---

## 项目结构

```
aiToVoice/
├── README.md
├── CONTRIBUTING.md
├── .env.example
├── docs/
│   ├── architecture/decisions.md
│   ├── database/schema.md
│   ├── api/endpoints.md
│   ├── features/spec.md
│   ├── standards/code-style.md
│   └── superpowers/
│       ├── specs/    # 本文件
│       └── plans/    # 实施计划
├── backend/
│   ├── pom.xml
│   └── src/
│       ├── main/java/com/aitovoice/  # 6 个模块
│       ├── main/resources/
│       │   ├── application.yml
│       │   └── db/init.sql
│       └── test/
├── frontend/
│   ├── package.json
│   ├── electron/     # Electron 主进程
│   └── src/
│       ├── api/      # 10 个 API 模块
│       ├── stores/   # Zustand 状态
│       ├── hooks/    # 自定义 Hooks
│       ├── components/
│       └── pages/    # 15 个页面
└── .gitignore
```
