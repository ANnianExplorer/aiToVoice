# AiToVoice - 桌面音乐播放器 + AI 声乐教练

> 设计文档 | 2026-06-10

## 1. 项目概述

仿 Spotify 风格的桌面音乐播放器，集成 AI 声乐教练功能。用户可以播放本地/在线音乐，录制自己的演唱并获得 AI 发声指导。

**技术栈**：Java 17 SpringBoot 3.2 + Electron 28 + React 18 + TypeScript + MySQL 8.0

## 2. 架构决策记录（ADR）

### ADR-1: 整体架构方案

**决策时间**: 2026-06-10

**备选方案**:

| 方案 | 描述 | 优点 | 缺点 |
|------|------|------|------|
| A: 单体架构 | 单体 SpringBoot + 单体 Electron | 开发部署简单，模块间调用零延迟 | 后期某模块压力大需拆分 |
| B: 微服务架构 | SpringBoot 多服务 + API Gateway | 松耦合，可独立扩展 | 开发复杂度高，需服务发现/网关/配置中心 |
| C: 模块化单体 | 单体代码但模块化包结构 | 兼顾简单性和可扩展性 | 需前期做好模块隔离设计 |

**决策**: 选择 **方案 A（单体架构）**

**理由**:
- 全功能一次性开发，单体最高效
- Spring Boot 本身的包结构天然支持模块划分
- 桌面应用场景下，微服务过重
- 后期需要时可平滑演进到方案 C 或 B

### ADR-2: AI 集成方式

**决策时间**: 2026-06-10

**备选方案**:

| 方案 | 描述 | 优点 | 缺点 |
|------|------|------|------|
| 外部 AI API | 调用 OpenAI/Claude/Gemini 等云端 API | 效果好，模型持续更新 | 需要 API Key，依赖网络 |
| 本地 AI 模型 | 使用本地模型（如 Whisper + 自训练） | 离线可用，数据隐私 | 开发复杂度高，效果有限 |
| 混合模式 | 本地做基础分析，云端做高级指导 | 兼顾离线能力和效果 | 架构稍复杂 |

**决策**: 选择 **混合模式**

**理由**:
- 本地使用 TarsosDSP 做音高/节拍检测（基础分析，离线可用）
- 云端使用 OpenAI/Claude API 做发声建议和练习计划（高级指导）
- 用户无需 API Key 也能使用基础功能

### ADR-3: 音乐来源

**决策时间**: 2026-06-10

**备选方案**:

| 方案 | 描述 | 优点 | 缺点 |
|------|------|------|------|
| 纯本地文件 | 用户自己上传 MP3/FLAC | 无版权问题，完全离线 | 内容有限 |
| 本地 + 在线 API | 本地文件 + 接入 NeteaseCloudMusicApi | 内容丰富，开发简单 | 依赖第三方 API |
| 自建流媒体 | 自有音乐服务器 | 完全可控 | 开发量大，需运维 |

**决策**: 选择 **本地 + 在线 API**

**理由**:
- 支持用户上传本地音乐文件
- 接入 NeteaseCloudMusicApi 获取在线音乐
- source_type 字段区分 LOCAL/NETEASE 来源

### ADR-4: UI 设计风格

**决策时间**: 2026-06-10

**备选方案**:

| 方案 | 描述 | 特点 |
|------|------|------|
| 仿网易云 | 深色 + 红色强调色，左侧导航 + 底部播放条 | 国内用户熟悉 |
| 现代简约 | 自定义设计，深色/浅色可切换 | 独特但需大量设计工作 |
| 仿 Spotify | 深色 + 绿色，网格布局为主 | 国际化风格，现代感强 |

**决策**: 选择 **仿 Spotify 风格**

**理由**:
- 深色主题 (#121212) + 绿色强调色 (#1DB954)
- 左侧导航栏 + 顶部搜索栏 + 底部播放条布局
- 网格卡片式内容展示

### ADR-5: 数据库选择

**决策时间**: 2026-06-10

**备选方案**:

| 方案 | 描述 | 适用场景 |
|------|------|---------|
| H2 + JPA | 嵌入式数据库，开发简单 | 原型开发 |
| MySQL | 最流行的关系型数据库 | 生产环境，生态成熟 |
| PostgreSQL | 功能更强大，支持 JSON/全文搜索 | 复杂查询场景 |

**决策**: 选择 **MySQL 8.0**

**理由**:
- 用户明确要求使用 MySQL
- 生态成熟，社区支持丰富
- 满足当前项目需求

### ADR-6: 后端模块结构演进

**决策时间**: 2026-06-12（重构阶段）

**初始结构**: 10 个模块（auth, user, music, playlist, social, voice, ai, recommend, ranking, file）

**问题**:
- 模块数过多，对桌面应用来说过重
- DTO 泛滥，样板代码多
- 薄模块（file 只有 2 个文件，ranking 只有 4 个）
- voice 和 ai 围绕同一业务域却分开

**重构后**: 6 个模块

```
com.aitovoice/
├── common/     # 通用（BaseEntity, ApiResponse, 异常）
├── config/     # 配置（Security, CORS, Swagger）
├── auth/       # 认证（JWT, 登录注册）
├── user/       # 用户 + 设置
├── music/      # 歌曲 + 歌手 + 专辑 + 流派 + 歌单 + 排行榜 + 推荐 + 文件服务 + 歌词
├── social/     # 评论 + 私信 + 关注
└── voice/      # 录音 + 分析 + 练习 + AI 老师
```

**理由**:
- 模块数从 10 降到 6，更紧凑
- 每个模块内按 controller/service/repository/entity/dto 子目录组织
- 文件数从 109 降到 ~70，维护成本更低
- voice 和 ai 合并为"声乐训练"统一业务域

---

## 2.1 最终架构

单体 SpringBoot 后端 + 单体 Electron 前端，通过 REST API + WebSocket 通信。

```
Electron (React + TypeScript)
    │ HTTP/REST + WebSocket
SpringBoot (Java 17)
    │
MySQL 8.0
```

## 3. 技术栈明细

| 层 | 技术 |
|---|---|
| 前端框架 | Electron 28+ + React 18 + TypeScript 5.x |
| UI 组件库 | Ant Design 5.x（暗色主题） |
| 状态管理 | Zustand |
| 音频播放 | Howler.js |
| 音频可视化 | Wavesurfer.js |
| 歌词解析 | lrc-parser |
| 后端框架 | Spring Boot 3.2 + Java 17 |
| ORM | Spring Data JPA + Hibernate |
| 数据库 | MySQL 8.0 |
| 认证 | Spring Security + JWT |
| 音频分析 | TarsosDSP |
| AI 集成 | OpenAI API / Claude API（混合模式） |
| 实时通信 | WebSocket |
| 在线音乐 | NeteaseCloudMusicApi |
| 构建 | Maven（后端）+ Vite（前端） |
| 打包 | Electron Builder |
| 代码规范 | 后端 JDTLS LSP / 前端 TypeScript LSP |

## 4. 功能模块（10 大模块）

| # | 模块 | 核心功能 |
|---|------|---------|
| 1 | 用户认证 | 注册、登录、JWT 鉴权、个人资料管理 |
| 2 | 音乐播放 | 播放/暂停/上下曲、进度条、播放模式、音量控制、迷你播放器 |
| 3 | 音乐库管理 | 本地文件导入、在线搜索、歌单创建/编辑/删除、收藏、历史记录 |
| 4 | 设置 | 主题切换、快捷键、音频输出设备、缓存管理、账号设置 |
| 5 | 语音录制 | 录制用户演唱、示例歌曲播放+同步录制、录音回放 |
| 6 | 发声分析 | 本地音高/节拍检测、与原唱对比、发声建议生成、练习清单 |
| 7 | AI 音乐老师 | 实时对话指导、发声技巧讲解、个性化练习计划、进度跟踪 |
| 8 | 个性化推荐 | 每日推荐、私人 FM、相似歌曲推荐、基于听歌习惯的智能推荐 |
| 9 | 歌词功能 | LRC 歌词解析、逐行滚动同步、歌词搜索、桌面歌词悬浮窗 |
| 10 | 社交功能 | 用户主页、关注/粉丝、歌单分享、歌曲评论、私信 |

## 5. 数据库设计（18 张表）

**全局规范**：所有表均包含 `created_at`、`updated_at`、`deleted_at`（逻辑删除）字段。

### 核心实体

- **users** - 用户信息（id, username, email, password_hash, avatar_url, nickname, bio, role, status）
- **songs** - 歌曲元数据（id, title, artist_id, album_id, genre_id, duration, file_path, cover_url, source_type, source_id, play_count, like_count）
- **artists** - 艺术家（id, name, avatar_url, bio, source_type, source_id）
- **albums** - 专辑（id, title, artist_id, cover_url, release_date, description）
- **genres** - 音乐流派（id, name, description, cover_url, sort_order）
- **tags** - 自定义标签（id, name, color, user_id）
- **song_tags** - 歌曲-标签关联（song_id, tag_id）
- **lyrics** - 歌词（id, song_id, content, source, synced_at）

### 用户关联

- **user_settings** - 用户设置（user_id, theme, language, audio_output_device, audio_quality, crossfade_enabled, crossfade_duration, hotkey_config JSON, lyric_font_size, lyric_desktop_enabled, notification_enabled, cache_max_mb, auto_play_on_launch）
- **user_song** - 收藏/播放历史（user_id, song_id, type FAVORITE/HISTORY, play_count, last_played_at, progress_sec）
- **user_follows** - 关注关系（follower_id, following_id）

### 歌单与社交

- **playlists** - 歌单（id, user_id, name, description, cover_url, is_public, play_count, song_count）
- **playlist_song** - 歌单-歌曲关联（playlist_id, song_id, sort_order, added_at）
- **comments** - 歌曲评论（id, user_id, song_id, parent_id 回复, content, likes_count）
- **messages** - 私信（id, sender_id, receiver_id, content, msg_type TEXT/SONG/PLAYLIST, ref_id, is_read）

### 语音与 AI

- **voice_records** - 录音记录（id, user_id, song_id, file_path, duration_sec, pitch_data JSON, rhythm_data JSON, score, comparison_data JSON, feedback_text）
- **voice_exercises** - 练习任务库（id, title, description, type BREATH/PITCH/RHYTHM/VIBRATO, difficulty 1-5, audio_example_path, instructions, target_metrics JSON, duration_sec, sort_order）
- **user_practice_progress** - 练习进度追踪（id, user_id, exercise_id, voice_record_id, status NOT_STARTED/IN_PROGRESS/COMPLETED, attempts_count, best_score, latest_score, practice_minutes, notes, started_at, completed_at）
- **ai_sessions** - AI 会话（id, user_id, title, session_type VOICE_COACH/GENERAL, context_data JSON, summary）
- **ai_messages** - AI 消息（id, session_id, role USER/ASSISTANT, content, msg_type TEXT/AUDIO_ANALYSIS/EXERCISE_SUGGEST, metadata JSON）

### 推荐与排行

- **recommendations** - 推荐记录（id, user_id, song_id, score, reason, algorithm COLLAB_FILTER/CONTENT_BASED/TRENDING, is_clicked）
- **rankings** - 排行榜（id, type HOT/NEW/RISING/GENRE, period DAILY/WEEKLY/MONTHLY, song_id, rank_position, score, genre_id, snapshot_date）

## 6. API 设计（~70 个接口）

### 认证 `/api/auth`
- POST `/register`, `/login`, `/refresh`, `/logout`
- GET `/me`

### 用户 `/api/users`
- GET `/{id}`, PUT `/profile`, PUT `/avatar`
- GET `/{id}/playlists`, `/{id}/followers`, `/{id}/following`
- POST `/{id}/follow`, DELETE `/{id}/follow`

### 设置 `/api/settings`
- GET/PUT `/`

### 歌曲 `/api/songs`
- GET `/`, `/{id}`, `/{id}/lyrics`, `/{id}/similar`, `/search`, `/hot`
- POST `/{id}/play`, `/{id}/favorite`, `/upload`
- DELETE `/{id}/favorite`

### 在线音乐 `/api/online`
- GET `/search`, `/song/{id}`, `/song/{id}/url`, `/song/{id}/lyric`, `/playlist/{id}`

### 歌单 `/api/playlists`
- CRUD `/`, `/{id}`
- POST `/{id}/songs`, `/{id}/copy`
- DELETE `/{id}/songs/{songId}`
- PUT `/{id}/songs/reorder`

### 评论 `/api/comments`
- GET/POST `/songs/{id}/comments`, `/{id}/replies`
- DELETE `/{id}`, POST `/{id}/like`

### 私信 `/api/messages` + WebSocket `/ws/messages`
- GET `/`, `/{userId}`
- POST `/{userId}`, PUT `/{userId}/read`

### 语音 `/api/voice`
- POST `/record`, `/analyze`, `/compare`, `/progress/{exerciseId}/submit`
- GET `/records`, `/records/{id}`, `/exercises`, `/exercises/{id}`, `/progress`
- DELETE `/records/{id}`

### AI `/api/ai` + WebSocket `/ws/ai`
- POST `/sessions`, `/sessions/{id}/messages`, `/voice-coach`
- GET `/sessions`, `/sessions/{id}`, `/practice-plan`

### 推荐 `/api/recommend`
- GET `/daily`, `/fm`, `/similar/{songId}`, `/for-you`
- POST `/feedback`

### 排行榜 `/api/rankings`
- GET `/hot`, `/new`, `/rising`, `/genre/{genreId}`

### 文件 `/api/files`
- GET `/audio/{id}`, `/cover/{id}`
- POST `/upload`

## 7. 前端页面（15 个）

| # | 页面 | 路由 |
|---|------|------|
| 1 | 登录/注册 | `/login`, `/register` |
| 2 | 首页（发现） | `/` |
| 3 | 搜索结果 | `/search` |
| 4 | 歌曲详情 | `/song/:id` |
| 5 | 歌单详情 | `/playlist/:id` |
| 6 | 我的音乐库 | `/library` |
| 7 | 排行榜 | `/rankings` |
| 8 | 社交中心 | `/social` |
| 9 | 用户主页 | `/user/:id` |
| 10 | AI 音乐老师 | `/ai-teacher` |
| 11 | 录音室 | `/studio` |
| 12 | 设置 | `/settings` |
| 13 | 个人资料 | `/profile` |
| 14 | 歌词页面 | `/lyrics/:id` |
| 15 | 私信详情 | `/messages/:userId` |

### 布局（仿 Spotify）

- 左侧导航栏（240px）：导航菜单 + 歌单树 + 新建按钮
- 顶部栏（64px）：搜索框 + 前进/后退 + 用户菜单
- 主内容区：路由切换
- 底部播放条（90px，全局固定）：封面 + 歌曲信息 + 控制区 + 音量 + 歌词按钮
- 桌面歌词悬浮窗（Electron 独立窗口）

### 主题变量

```css
--bg-primary: #121212;
--bg-secondary: #181818;
--bg-elevated: #282828;
--bg-highlight: #333333;
--text-primary: #FFFFFF;
--text-secondary: #B3B3B3;
--text-subdued: #6A6A6A;
--accent-green: #1DB954;
--accent-green-hover: #1ED760;
--error-red: #E74C3C;
```

## 8. 代码规范（Java 17 现代语法）

### 8.1 Java 17 必须使用的特性

**Switch 表达式**（替代 if-else 链）：
```java
// ✅ 正确 - Switch 表达式
public String getRoleDescription(UserRole role) {
    return switch (role) {
        case ADMIN -> "管理员";
        case USER -> "普通用户";
        case GUEST -> "访客";
    };
}

// ❌ 错误 - 传统 if-else
if (role == ADMIN) return "管理员";
else if (role == USER) return "普通用户";
```

**Stream API**（替代 for 循环做转换/过滤/聚合）：
```java
// ✅ 正确 - Stream
List<SongDto> hotSongs = songRepository.findHotSongs().stream()
    .filter(song -> song.getDeletedAt() == null)
    .sorted(Comparator.comparing(Song::getPlayCount).reversed())
    .map(songMapper::toDto)
    .limit(50)
    .collect(Collectors.toList());

// ❌ 错误 - 命令式循环
List<SongDto> hotSongs = new ArrayList<>();
for (Song song : songRepository.findHotSongs()) {
    if (song.getDeletedAt() == null) {
        hotSongs.add(songMapper.toDto(song));
    }
}
```

**Text Blocks**（替代字符串拼接）：
```java
// ✅ 正确
String prompt = """
        你是一位专业的声乐教练。
        用户录制了一段演唱，请从以下方面给出建议：
        1. 音准
        2. 节奏
        3. 发声方式
        """;

// ❌ 错误
String prompt = "你是一位专业的声乐教练。\n" +
        "用户录制了一段演唱，请从以下方面给出建议：\n" + ...;
```

**Records**（替代简单 DTO/值对象）：
```java
// ✅ 正确 - Record
public record PitchAnalysisResult(
    double averagePitch,
    double maxPitch,
    double minPitch,
    List<Double> pitchCurve,
    int stabilityScore
) {}

// ❌ 错误 - 手写 getter/equals/hashCode
public class PitchAnalysisResult {
    private double averagePitch;
    // ... 一堆 boilerplate
}
```

**Pattern Matching instanceof**：
```java
// ✅ 正确
if (exception instanceof BusinessException ex) {
    return ApiResponse.error(ex.getCode(), ex.getMessage());
}

// ❌ 错误
if (exception instanceof BusinessException) {
    BusinessException ex = (BusinessException) exception;
    return ApiResponse.error(ex.getCode(), ex.getMessage());
}
```

**Sealed Classes**（限制继承）：
```java
// ✅ 正确
public sealed interface AiResponse
    permits TextResponse, AudioAnalysisResponse, ExerciseSuggestResponse {
}

public record TextResponse(String content) implements AiResponse {}
public record AudioAnalysisResponse(AnalysisResultDto analysis) implements AiResponse {}
public record ExerciseSuggestResponse(List<VoiceExerciseDto> exercises) implements AiResponse {}
```

**var 局部变量类型推断**：
```java
// ✅ 正确
var user = userRepository.findById(userId)
    .orElseThrow(() -> new ResourceNotFoundException("用户不存在"));
var songs = songRepository.findByArtistId(artistId);

// ❌ 冗余
User user = userRepository.findById(userId)...;
List<Song> songs = songRepository.findByArtistId(artistId);
```

### 8.2 分层架构规范

```
Controller  → 只做参数校验 + 调用 Service + 返回 ApiResponse
Service     → 业务逻辑，事务管理，调用 Repository
Repository  → 数据访问，继承 JpaRepository
Entity      → JPA 实体，继承 BaseEntity
DTO         → 数据传输对象，使用 Record
Mapper      → Entity ↔ DTO 转换，使用 MapStruct
```

**严格禁止**：
- Controller 直接调用 Repository
- Entity 直接作为 API 响应
- Service 之间循环依赖
- 在 Entity 中写业务逻辑
- 使用 `@Autowired` 字段注入（必须用构造器注入）

### 8.3 通用基类

```java
// BaseEntity - 所有实体继承
@MappedSuperclass
@EntityListeners(AuditingEntityListener.class)
public abstract class BaseEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @CreatedDate
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @LastModifiedDate
    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    @Column(name = "deleted_at")
    private LocalDateTime deletedAt;

    // 软删除方法
    public void softDelete() {
        this.deletedAt = LocalDateTime.now();
    }

    public boolean isDeleted() {
        return this.deletedAt != null;
    }
}
```

### 8.4 命名规范

| 类型 | 规范 | 示例 |
|------|------|------|
| 包名 | 全小写 | `com.aitovoice.music.service` |
| 类名 | PascalCase | `SongService`, `VoiceRecordDto` |
| 方法名 | camelCase | `findHotSongs()`, `analyzePitch()` |
| 常量 | UPPER_SNAKE | `MAX_UPLOAD_SIZE` |
| 数据库表 | snake_case | `voice_records`, `user_settings` |
| 数据库字段 | snake_case | `created_at`, `play_count` |
| API 路径 | kebab-case | `/api/voice-records`, `/practice-progress` |

### 8.5 异常处理

```java
// 统一业务异常
public class BusinessException extends RuntimeException {
    private final ErrorCode code;
    // ...
}

// 全局异常处理器
@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(BusinessException.class)
    public ApiResponse<Void> handleBusiness(BusinessException ex) {
        return ApiResponse.error(ex.getCode(), ex.getMessage());
    }

    @ExceptionHandler(ResourceNotFoundException.class)
    public ApiResponse<Void> handleNotFound(ResourceNotFoundException ex) {
        return ApiResponse.error(404, ex.getMessage());
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ApiResponse<Void> handleValidation(MethodArgumentNotValidException ex) {
        var errors = ex.getBindingResult().getFieldErrors().stream()
            .map(e -> new ValidationError(e.getField(), e.getDefaultMessage()))
            .toList();
        return ApiResponse.error(400, "参数校验失败", errors);
    }
}
```

### 8.6 统一响应格式

```java
public record ApiResponse<T>(
    int code,
    String message,
    T data,
    LocalDateTime timestamp
) {
    public static <T> ApiResponse<T> success(T data) {
        return new ApiResponse<>(200, "success", data, LocalDateTime.now());
    }

    public static <T> ApiResponse<T> error(int code, String message) {
        return new ApiResponse<>(code, message, null, LocalDateTime.now());
    }
}
```

### 8.7 前端代码规范

- TypeScript strict 模式
- 组件使用函数式 + Hooks
- 状态管理 Zustand（非 Redux）
- API 请求统一封装在 `api/` 目录
- 组件 props 使用 interface 定义
- 使用 ESLint + Prettier 格式化
- LSP：TypeScript LSP 提供类型检查和自动补全

## 9. 项目目录结构

```
aiToVoice/
├── README.md
├── CONTRIBUTING.md
├── .env.example
├── docs/
│   └── superpowers/
│       ├── specs/                    # 设计文档（本文件）
│       └── plans/                    # 实施计划
├── backend/                          # Spring Boot 后端
│   ├── pom.xml
│   └── src/
│       ├── main/
│       │   ├── java/com/aitovoice/
│       │   │   ├── AitoVoiceApplication.java
│       │   │   ├── common/           # BaseEntity, ApiResponse, ErrorCode, 异常处理
│       │   │   ├── config/           # SecurityConfig, CorsConfig, OpenApiConfig
│       │   │   ├── auth/             # JWT, 登录注册, AuthController
│       │   │   │   ├── dto/          # LoginRequest, RegisterRequest, AuthResponse
│       │   │   │   ├── JwtTokenProvider.java
│       │   │   │   ├── JwtAuthenticationFilter.java
│       │   │   │   ├── AuthService.java
│       │   │   │   └── AuthController.java
│       │   │   ├── user/             # 用户 + 设置
│       │   │   │   ├── entity/       # User, UserSettings
│       │   │   │   ├── repository/   # UserRepository, UserSettingsRepository
│       │   │   │   ├── mapper/       # UserMapper
│       │   │   │   ├── dto/          # UserProfileDto, UserSettingsDto
│       │   │   │   ├── service/      # UserService, UserSettingsService
│       │   │   │   └── controller/   # UserController, UserSettingsController
│       │   │   ├── music/            # 歌曲 + 歌手 + 专辑 + 流派 + 歌单 + 排行榜 + 推荐 + 文件
│       │   │   │   ├── entity/       # Song, Artist, Album, Genre, Tag, Lyrics, Playlist, Ranking, Recommendation
│       │   │   │   ├── repository/   # 所有 Repository
│       │   │   │   ├── mapper/       # SongMapper
│       │   │   │   ├── dto/          # SongDto, PlaylistDto, RankingDto, RecommendDto
│       │   │   │   ├── service/      # SongService, PlaylistService, RankingService, RecommendService, FileStorageService, LyricsService
│       │   │   │   └── controller/   # SongController, PlaylistController, RankingController, FileController, LyricsController
│       │   │   ├── social/           # 评论 + 私信 + 关注
│       │   │   │   ├── entity/       # Comment, Message, UserFollow
│       │   │   │   ├── repository/   # CommentRepository, MessageRepository, UserFollowRepository
│       │   │   │   ├── dto/          # CommentDto, MessageDto
│       │   │   │   ├── service/      # CommentService, MessageService, FollowService
│       │   │   │   └── controller/   # CommentController, MessageController, FollowController
│       │   │   └── voice/            # 录音 + 分析 + 练习 + AI 老师
│       │   │       ├── entity/       # VoiceRecord, VoiceExercise, AiSession, AiMessage
│       │   │       ├── repository/   # VoiceRecordRepository, AiSessionRepository
│       │   │       ├── dto/          # VoiceRecordDto, AnalysisResultDto, AiMessageDto
│       │   │       ├── service/      # VoiceService, AiService, AiClient, PitchAnalyzer, ScoreCalculator
│       │   │       └── controller/   # VoiceController, AiController
│       │   └── resources/
│       │       ├── application.yml
│       │       ├── application-dev.yml
│       │       └── db/init.sql       # 数据库初始化脚本（22张表 + 种子数据）
│       └── test/                     # 单元测试
├── frontend/                         # Electron + React 前端
│   ├── package.json
│   ├── tsconfig.json
│   ├── vite.config.ts
│   ├── electron/
│   │   ├── main.ts                   # Electron 主进程（系统托盘、全局快捷键）
│   │   └── preload.ts                # 预加载脚本
│   └── src/
│       ├── main.tsx                  # React 入口
│       ├── App.tsx                   # 路由配置
│       ├── api/                      # API 请求层（10 个模块）
│       │   ├── client.ts             # Axios 实例
│       │   ├── auth.ts, songs.ts, playlists.ts, rankings.ts
│       │   ├── voice.ts, ai.ts, social.ts, settings.ts, recommend.ts
│       ├── stores/                   # Zustand 状态管理
│       │   ├── authStore.ts, playerStore.ts
│       ├── hooks/                    # 自定义 Hooks
│       │   └── useAudio.ts           # Howler.js 音频 Hook
│       ├── types/                    # TypeScript 类型定义
│       │   ├── index.ts, electron.d.ts
│       ├── components/
│       │   ├── Layout/               # AppLayout, Sidebar, TopBar, TitleBar
│       │   ├── Player/               # PlayerBar（播放/暂停/进度/音量）
│       │   └── Common/               # 通用组件
│       ├── pages/                    # 15 个页面
│       │   ├── Auth/                 # LoginPage, RegisterPage
│       │   ├── Home/                 # HomePage（热门歌曲 + 新歌）
│       │   ├── Search/               # SearchPage（搜索结果）
│       │   ├── Library/              # LibraryPage（收藏 + 历史）
│       │   ├── Rankings/             # RankingsPage（热歌/新歌/飙升榜）
│       │   ├── Social/               # SocialPage, UserHomePage, MessagePage
│       │   ├── AITeacher/            # AITeacherPage（AI 对话）
│       │   ├── Studio/               # StudioPage（录音 + 练习）
│       │   ├── Settings/             # SettingsPage（主题/音频/账号）
│       │   ├── Profile/              # ProfilePage（个人资料）
│       │   ├── Song/                 # SongDetailPage
│       │   └── Playlist/             # PlaylistDetailPage
│       └── assets/styles/
│           └── global.css            # Spotify 风格主题变量
└── .gitignore
```

## 10. 开发阶段

| Phase | 内容 | 预估文件数 |
|-------|------|-----------|
| 1 | 基础框架搭建 | ~15 |
| 2 | 用户认证 | ~20 |
| 3 | 音乐核心（播放/歌单/搜索/歌词） | ~35 |
| 4 | 在线音乐 + 推荐 + 排行榜 | ~20 |
| 5 | 社交功能 | ~15 |
| 6 | 语音录制与分析 | ~20 |
| 7 | AI 音乐老师 | ~15 |
| 8 | 桌面歌词 + 迷你播放器 | ~10 |
| 9 | 打磨与发布 | ~5 |

**总计**：后端 ~60 个 Java 文件，前端 ~80 个文件

## 11. LSP 集成

| LSP | 用途 |
|-----|------|
| JDTLS (jdtls-lsp) | Java 后端代码分析、重构、自动补全 |
| TypeScript LSP (typescript-lsp) | 前端 TypeScript 类型检查、自动补全 |

开发过程中自动调用 LSP 进行代码质量检查和重构建议。
