# 数据库设计文档

> 记录数据库表结构、关系和设计决策。

---

## 全局规范

- 所有表包含 `created_at`、`updated_at`、`deleted_at`（逻辑删除）
- 主键使用 `BIGINT AUTO_INCREMENT`
- 字符集 `utf8mb4`，排序规则 `utf8mb4_unicode_ci`
- 外键使用 `BIGINT`，不使用数据库级外键约束（由 JPA 管理）

---

## ER 关系图

```
users ──┬── user_settings (1:1)
        ├── user_songs (1:N) ──── songs
        ├── playlists (1:N)
        ├── comments (1:N) ──── songs
        ├── messages (1:N, sender/receiver)
        ├── user_follows (1:N, follower/following)
        ├── voice_records (1:N)
        ├── user_practice_progress (1:N)
        ├── ai_sessions (1:N)
        └── recommendations (1:N)

songs ──┬── artists (N:1)
        ├── albums (N:1)
        ├── genres (N:1)
        ├── lyrics (1:1)
        ├── song_tags (N:M) ──── tags
        ├── playlist_songs (N:M) ──── playlists
        ├── comments (1:N)
        ├── voice_records (1:N)
        └── rankings (1:N)
```

---

## 表清单（22 张）

| # | 表名 | 用途 | 关键关系 |
|---|------|------|---------|
| 1 | users | 用户信息 | 主表 |
| 2 | user_settings | 用户设置 | 1:1 with users |
| 3 | artists | 歌手 | 被 songs 引用 |
| 4 | albums | 专辑 | belongs to artists |
| 5 | genres | 音乐流派 | 被 songs 引用 |
| 6 | songs | 歌曲 | 核心表 |
| 7 | tags | 自定义标签 | belongs to users |
| 8 | song_tags | 歌曲-标签关联 | N:M 关联表 |
| 9 | lyrics | 歌词 | 1:1 with songs |
| 10 | user_songs | 收藏/播放历史 | N:M with type 区分 |
| 11 | playlists | 歌单 | belongs to users |
| 12 | playlist_songs | 歌单-歌曲关联 | N:M 关联表 |
| 13 | comments | 歌曲评论 | 支持嵌套回复 |
| 14 | messages | 私信 | sender/receiver 双向 |
| 15 | user_follows | 关注关系 | 自关联 N:M |
| 16 | voice_records | 录音记录 | 含 JSON 分析数据 |
| 17 | voice_exercises | 练习任务库 | 预设数据 |
| 18 | user_practice_progress | 练习进度追踪 | N:M with 状态 |
| 19 | ai_sessions | AI 会话 | belongs to users |
| 20 | ai_messages | AI 消息 | belongs to sessions |
| 21 | recommendations | 推荐记录 | user-song 关联 |
| 22 | rankings | 排行榜 | 含快照日期 |

---

## 核心表结构

### users

| 字段 | 类型 | 约束 | 说明 |
|------|------|------|------|
| id | BIGINT | PK, AUTO_INCREMENT | 主键 |
| username | VARCHAR(50) | UNIQUE, NOT NULL | 用户名 |
| email | VARCHAR(100) | UNIQUE, NOT NULL | 邮箱 |
| password_hash | VARCHAR(255) | NOT NULL | BCrypt 加密密码 |
| avatar_url | VARCHAR(500) | | 头像地址 |
| nickname | VARCHAR(50) | | 昵称 |
| bio | VARCHAR(500) | | 个人简介 |
| role | VARCHAR(20) | NOT NULL, DEFAULT 'USER' | USER/ADMIN |
| status | VARCHAR(20) | NOT NULL, DEFAULT 'ACTIVE' | ACTIVE/BANNED |
| created_at | DATETIME | NOT NULL | |
| updated_at | DATETIME | NOT NULL | |
| deleted_at | DATETIME | | 逻辑删除 |

### songs

| 字段 | 类型 | 约束 | 说明 |
|------|------|------|------|
| id | BIGINT | PK | 主键 |
| title | VARCHAR(200) | NOT NULL | 歌曲名 |
| artist_id | BIGINT | FK → artists | 歌手 |
| album_id | BIGINT | FK → albums | 专辑 |
| genre_id | BIGINT | FK → genres | 流派 |
| duration | INT | NOT NULL | 时长（秒） |
| file_path | VARCHAR(500) | | 文件路径 |
| cover_url | VARCHAR(500) | | 封面地址 |
| source_type | VARCHAR(20) | NOT NULL | LOCAL/NETEASE |
| source_id | VARCHAR(100) | | 外部来源 ID |
| play_count | BIGINT | DEFAULT 0 | 播放次数 |
| like_count | BIGINT | DEFAULT 0 | 收藏次数 |
| created_at | DATETIME | NOT NULL | |
| updated_at | DATETIME | NOT NULL | |
| deleted_at | DATETIME | | |

### voice_records

| 字段 | 类型 | 约束 | 说明 |
|------|------|------|------|
| id | BIGINT | PK | 主键 |
| user_id | BIGINT | NOT NULL, FK → users | 用户 |
| song_id | BIGINT | FK → songs | 关联歌曲 |
| file_path | VARCHAR(500) | NOT NULL | 录音文件路径 |
| duration_sec | INT | | 时长（秒） |
| pitch_data | JSON | | 音高分析数据 |
| rhythm_data | JSON | | 节奏分析数据 |
| score | INT | | 综合评分 (0-100) |
| comparison_data | JSON | | 与原唱对比数据 |
| feedback_text | TEXT | | 反馈文本 |

### ai_sessions / ai_messages

**ai_sessions**:

| 字段 | 类型 | 约束 | 说明 |
|------|------|------|------|
| id | BIGINT | PK | 主键 |
| user_id | BIGINT | NOT NULL, FK → users | 用户 |
| title | VARCHAR(200) | | 会话标题 |
| session_type | VARCHAR(20) | NOT NULL | VOICE_COACH/GENERAL |
| context_data | JSON | | 上下文数据 |
| summary | VARCHAR(2000) | | 会话摘要 |

**ai_messages**:

| 字段 | 类型 | 约束 | 说明 |
|------|------|------|------|
| id | BIGINT | PK | 主键 |
| session_id | BIGINT | NOT NULL, FK → ai_sessions | 会话 |
| role | VARCHAR(20) | NOT NULL | USER/ASSISTANT |
| content | TEXT | | 消息内容 |
| msg_type | VARCHAR(30) | DEFAULT 'TEXT' | TEXT/AUDIO_ANALYSIS/EXERCISE_SUGGEST |
| metadata | JSON | | 元数据 |

---

## 种子数据

### init.sql（手动执行）

- **10 个默认流派**: Pop, Rock, Jazz, Classical, R&B, Hip-Hop, Electronic, Folk, Country, Blues
- **1 个管理员账号**: admin / admin123
- **10 个练习任务**: 覆盖 BREATH, PITCH, RHYTHM, VIBRATO 四种类型

完整 SQL 脚本位于: `backend/src/main/resources/db/init.sql`

### DataInitializer（自动执行）

应用启动时，如果 songs 表为空，自动插入演示数据：

- **8 个流派**: Pop, Rock, Jazz, Classical, R&B, Hip-Hop, Electronic, Folk（如已存在则复用）
- **8 位歌手**: 周杰伦、林俊杰、陈奕迅、邓紫棋、薛之谦、Taylor Swift、Ed Sheeran、Adele
- **30 首歌曲**: 关联歌手和流派，播放量/点赞量随机生成

代码位于: `backend/src/main/java/com/aitovoice/config/DataInitializer.java`

### comments 表变更

`comments.content` 字段类型为 `VARCHAR(2000) NOT NULL`（非 TEXT），配合 `@NotBlank` 校验。

### JDBC 连接

`characterEncoding=UTF-8`（Java 字符集名称，驱动自动映射到 MySQL utf8mb4）。
