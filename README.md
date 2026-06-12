# AiToVoice

桌面音乐播放器 + AI 声乐教练

> 仿 Spotify 风格的桌面音乐播放器，集成 AI 声乐教练功能。用户可以播放本地/在线音乐，录制自己的演唱并获得 AI 发声指导。

## 技术栈

| 层 | 技术 |
|---|------|
| 前端 | Electron 28 + React 18 + TypeScript + Ant Design 5 |
| 后端 | Java 17 + Spring Boot 3.2 + Spring Data JPA |
| 数据库 | MySQL 8.0 |
| 音频 | Howler.js（播放）+ TarsosDSP（分析） |
| AI | OpenAI / Claude API（混合模式） |
| 文档 | Swagger/OpenAPI (springdoc) |

## 功能模块

| 模块 | 功能 |
|------|------|
| 用户认证 | 注册、登录、JWT 鉴权、个人资料 |
| 音乐播放 | 播放/暂停/上下曲、进度条、播放模式、音量控制 |
| 音乐库 | 歌曲搜索、收藏、播放历史、歌单管理 |
| 排行榜 | 热歌榜、新歌榜、飙升榜 |
| 社交 | 评论、私信、关注/粉丝 |
| 语音录制 | 录音、音高分析、评分、练习任务 |
| AI 老师 | 声乐教练对话、音乐助手 |
| 歌词 | LRC 解析、逐行同步 |
| 设置 | 主题、音频、快捷键 |
| 桌面特性 | 系统托盘、全局快捷键、自定义标题栏 |

## 快速开始

### 前置条件

- JDK 17+
- Node.js 18+
- MySQL 8.0+
- Maven 3.8+

### 1. 克隆项目

```bash
git clone https://github.com/ANnianExplorer/aiToVoice.git
cd aiToVoice
```

### 2. 初始化数据库

```bash
mysql -u root -p < backend/src/main/resources/db/init.sql
```

### 3. 配置环境变量

复制并修改配置文件：

```bash
# 后端配置
# 编辑 backend/src/main/resources/application.yml
# 修改数据库连接信息和 API Key

export DB_PASSWORD=your_mysql_password
export JWT_SECRET=your_jwt_secret_key
export OPENAI_API_KEY=your_openai_key  # 可选
export CLAUDE_API_KEY=your_claude_key  # 可选
```

### 4. 启动后端

```bash
cd backend
mvn spring-boot:run
```

后端启动后访问：
- API: http://localhost:8080/api
- Swagger UI: http://localhost:8080/swagger-ui.html

### 5. 启动前端

```bash
cd frontend
npm install
npm run dev
```

前端启动后自动打开 Electron 窗口。

## 项目结构

```
aiToVoice/
├── backend/                          # Spring Boot 后端
│   ├── src/main/java/com/aitovoice/
│   │   ├── auth/                     # 认证模块（JWT、登录注册）
│   │   ├── user/                     # 用户模块（用户、设置）
│   │   ├── music/                    # 音乐模块（歌曲、歌单、排行榜、推荐、文件）
│   │   ├── social/                   # 社交模块（评论、私信、关注）
│   │   ├── voice/                    # 语音模块（录音、分析、AI 老师）
│   │   ├── common/                   # 通用（BaseEntity、ApiResponse、异常）
│   │   └── config/                   # 配置（Security、CORS、Swagger）
│   └── src/main/resources/
│       ├── application.yml
│       └── db/init.sql               # 数据库初始化脚本
├── frontend/                         # Electron + React 前端
│   ├── electron/                     # Electron 主进程
│   └── src/
│       ├── api/                      # API 请求层（10 个模块）
│       ├── stores/                   # Zustand 状态管理
│       ├── hooks/                    # 自定义 Hooks
│       ├── components/               # 通用组件
│       └── pages/                    # 页面组件（15 个页面）
├── docs/                             # 项目文档
│   ├── superpowers/specs/            # 设计文档
│   └── superpowers/plans/            # 实施计划
└── README.md
```

## API 文档

启动后端后访问 Swagger UI: http://localhost:8080/swagger-ui.html

主要 API 分组：
- `/api/auth` - 认证（注册、登录）
- `/api/songs` - 歌曲（搜索、播放、收藏）
- `/api/playlists` - 歌单（CRUD）
- `/api/rankings` - 排行榜
- `/api/recommend` - 推荐
- `/api/voice` - 语音录制与分析
- `/api/ai` - AI 老师
- `/api/settings` - 用户设置

## 开发规范

- Java 17 语法（switch 表达式、Stream、Records、sealed classes）
- 构造器注入，禁止 @Autowired 字段注入
- Entity 不作为 API 响应，统一使用 DTO/Record
- 所有表包含 created_at、updated_at、deleted_at（逻辑删除）
- 统一 ApiResponse 响应格式
- TypeScript strict 模式

## License

MIT
