# AiToVoice 数据库设计

> MySQL 8.0 | 22 张表 | 所有表包含逻辑删除字段

---

## 全局规范

- 所有表均包含 `created_at`、`updated_at`、`deleted_at`（逻辑删除）字段
- 主键使用 `BIGINT AUTO_INCREMENT`
- 字符集 `utf8mb4`，排序规则 `utf8mb4_unicode_ci`
- 外键使用逻辑外键（JPA 管理），不在数据库层创建物理外键约束
- JSON 字段用于存储灵活结构数据（如 pitch_data、hotkey_config）

---

## 表清单

| # | 表名 | 所属模块 | 用途 |
|---|------|---------|------|
| 1 | users | user | 用户信息 |
| 2 | user_settings | user | 用户个性化设置 |
| 3 | artists | music | 艺术家/歌手 |
| 4 | albums | music | 专辑 |
| 5 | genres | music | 音乐流派 |
| 6 | songs | music | 歌曲元数据 |
| 7 | tags | music | 自定义标签 |
| 8 | song_tags | music | 歌曲-标签关联 |
| 9 | lyrics | music | 歌词 |
| 10 | user_songs | music | 收藏/播放历史 |
| 11 | playlists | music | 歌单 |
| 12 | playlist_songs | music | 歌单-歌曲关联 |
| 13 | comments | social | 歌曲评论 |
| 14 | messages | social | 私信 |
| 15 | user_follows | social | 关注关系 |
| 16 | voice_records | voice | 录音记录 |
| 17 | voice_exercises | voice | 练习任务库 |
| 18 | user_practice_progress | voice | 练习进度追踪 |
| 19 | ai_sessions | voice | AI 会话 |
| 20 | ai_messages | voice | AI 对话消息 |
| 21 | recommendations | music | 推荐记录 |
| 22 | rankings | music | 排行榜 |

---

## 表结构详情

### 1. users（用户信息）

| 字段 | 类型 | 约束 | 说明 |
|------|------|------|------|
| id | BIGINT | PK, AUTO_INCREMENT | 主键 |
| username | VARCHAR(50) | UNIQUE, NOT NULL | 用户名 |
| email | VARCHAR(100) | UNIQUE, NOT NULL | 邮箱 |
| password_hash | VARCHAR(255) | NOT NULL | BCrypt 加密密码 |
| avatar_url | VARCHAR(500) | | 头像地址 |
| nickname | VARCHAR(50) | | 昵称 |
| bio | VARCHAR(500) | | 个人简介 |
| role | VARCHAR(20) | NOT NULL, DEFAULT 'USER' | 角色：USER/ADMIN |
| status | VARCHAR(20) | NOT NULL, DEFAULT 'ACTIVE' | 状态：ACTIVE/BANNED |
| created_at | DATETIME | NOT NULL | 创建时间 |
| updated_at | DATETIME | NOT NULL | 更新时间 |
| deleted_at | DATETIME | | 逻辑删除时间 |

**索引**: idx_username(username), idx_email(email)

---

### 2. user_settings（用户设置）

| 字段 | 类型 | 约束 | 说明 |
|------|------|------|------|
| id | BIGINT | PK | 主键 |
| user_id | BIGINT | UNIQUE, NOT NULL | 关联用户 |
| theme | VARCHAR(20) | DEFAULT 'DARK' | 主题：DARK/LIGHT/AUTO |
| language | VARCHAR(10) | DEFAULT 'zh-CN' | 语言 |
| audio_output_device | VARCHAR(100) | | 音频输出设备 |
| audio_quality | VARCHAR(20) | DEFAULT 'HIGH' | 音频质量：LOW/HIGH/LOSSLESS |
| crossfade_enabled | BOOLEAN | DEFAULT FALSE | 交叉淡入淡出 |
| crossfade_duration | INT | DEFAULT 3 | 淡入淡出时长（秒） |
| hotkey_config | JSON | | 快捷键配置 |
| lyric_font_size | INT | DEFAULT 16 | 歌词字体大小 |
| lyric_desktop_enabled | BOOLEAN | DEFAULT FALSE | 桌面歌词 |
| notification_enabled | BOOLEAN | DEFAULT TRUE | 通知 |
| cache_max_mb | INT | DEFAULT 1024 | 最大缓存（MB） |
| auto_play_on_launch | BOOLEAN | DEFAULT FALSE | 启动自动播放 |
| created_at | DATETIME | NOT NULL | |
| updated_at | DATETIME | NOT NULL | |
| deleted_at | DATETIME | | |

---

### 3. artists（艺术家）

| 字段 | 类型 | 约束 | 说明 |
|------|------|------|------|
| id | BIGINT | PK | 主键 |
| name | VARCHAR(100) | NOT NULL | 名称 |
| avatar_url | VARCHAR(500) | | 头像 |
| bio | VARCHAR(1000) | | 简介 |
| source_type | VARCHAR(20) | | 来源：LOCAL/NETEASE |
| source_id | VARCHAR(100) | | 外部来源 ID |
| created_at | DATETIME | NOT NULL | |
| updated_at | DATETIME | NOT NULL | |
| deleted_at | DATETIME | | |

---

### 4. albums（专辑）

| 字段 | 类型 | 约束 | 说明 |
|------|------|------|------|
| id | BIGINT | PK | 主键 |
| title | VARCHAR(200) | NOT NULL | 专辑名 |
| artist_id | BIGINT | | 关联歌手 |
| cover_url | VARCHAR(500) | | 封面 |
| release_date | DATE | | 发行日期 |
| description | VARCHAR(1000) | | 描述 |
| created_at | DATETIME | NOT NULL | |
| updated_at | DATETIME | NOT NULL | |
| deleted_at | DATETIME | | |

---

### 5. genres（音乐流派）

| 字段 | 类型 | 约束 | 说明 |
|------|------|------|------|
| id | BIGINT | PK | 主键 |
| name | VARCHAR(50) | UNIQUE, NOT NULL | 流派名 |
| description | VARCHAR(500) | | 描述 |
| cover_url | VARCHAR(500) | | 封面 |
| sort_order | INT | DEFAULT 0 | 排序权重 |
| created_at | DATETIME | NOT NULL | |
| updated_at | DATETIME | NOT NULL | |
| deleted_at | DATETIME | | |

---

### 6. songs（歌曲）

| 字段 | 类型 | 约束 | 说明 |
|------|------|------|------|
| id | BIGINT | PK | 主键 |
| title | VARCHAR(200) | NOT NULL | 歌曲名 |
| artist_id | BIGINT | | 关联歌手 |
| album_id | BIGINT | | 关联专辑 |
| genre_id | BIGINT | | 关联流派 |
| duration | INT | NOT NULL | 时长（秒） |
| file_path | VARCHAR(500) | | 文件路径 |
| cover_url | VARCHAR(500) | | 封面 |
| source_type | VARCHAR(20) | NOT NULL | 来源：LOCAL/NETEASE |
| source_id | VARCHAR(100) | | 外部来源 ID |
| play_count | BIGINT | DEFAULT 0 | 播放次数 |
| like_count | BIGINT | DEFAULT 0 | 收藏次数 |
| created_at | DATETIME | NOT NULL | |
| updated_at | DATETIME | NOT NULL | |
| deleted_at | DATETIME | | |

**索引**: idx_song_title(title), idx_song_artist(artist_id), idx_song_genre(genre_id)

---

### 7. tags（标签）

| 字段 | 类型 | 约束 | 说明 |
|------|------|------|------|
| id | BIGINT | PK | 主键 |
| name | VARCHAR(50) | NOT NULL | 标签名 |
| color | VARCHAR(20) | | 颜色 |
| user_id | BIGINT | | 所属用户 |
| created_at | DATETIME | NOT NULL | |
| updated_at | DATETIME | NOT NULL | |
| deleted_at | DATETIME | | |

---

### 8. song_tags（歌曲-标签关联）

| 字段 | 类型 | 约束 | 说明 |
|------|------|------|------|
| song_id | BIGINT | PK | 歌曲 ID |
| tag_id | BIGINT | PK | 标签 ID |

---

### 9. lyrics（歌词）

| 字段 | 类型 | 约束 | 说明 |
|------|------|------|------|
| id | BIGINT | PK | 主键 |
| song_id | BIGINT | UNIQUE | 关联歌曲 |
| content | TEXT | | LRC 格式歌词内容 |
| source | VARCHAR(50) | | 来源 |
| synced_at | DATETIME | | 同步时间 |
| created_at | DATETIME | NOT NULL | |
| updated_at | DATETIME | NOT NULL | |
| deleted_at | DATETIME | | |

---

### 10. user_songs（用户-歌曲关系）

| 字段 | 类型 | 约束 | 说明 |
|------|------|------|------|
| id | BIGINT | PK | 主键 |
| user_id | BIGINT | NOT NULL | 用户 ID |
| song_id | BIGINT | NOT NULL | 歌曲 ID |
| type | VARCHAR(20) | NOT NULL | 类型：FAVORITE/HISTORY |
| play_count | INT | DEFAULT 0 | 播放次数 |
| last_played_at | DATETIME | | 最后播放时间 |
| progress_sec | INT | DEFAULT 0 | 播放进度（秒） |
| created_at | DATETIME | NOT NULL | |
| updated_at | DATETIME | NOT NULL | |
| deleted_at | DATETIME | | |

**唯一约束**: (user_id, song_id, type)

---

### 11. playlists（歌单）

| 字段 | 类型 | 约束 | 说明 |
|------|------|------|------|
| id | BIGINT | PK | 主键 |
| user_id | BIGINT | NOT NULL | 创建者 |
| name | VARCHAR(200) | NOT NULL | 歌单名 |
| description | VARCHAR(1000) | | 描述 |
| cover_url | VARCHAR(500) | | 封面 |
| is_public | BOOLEAN | DEFAULT TRUE | 是否公开 |
| play_count | BIGINT | DEFAULT 0 | 播放次数 |
| song_count | INT | DEFAULT 0 | 歌曲数量 |
| created_at | DATETIME | NOT NULL | |
| updated_at | DATETIME | NOT NULL | |
| deleted_at | DATETIME | | |

---

### 12. playlist_songs（歌单-歌曲关联）

| 字段 | 类型 | 约束 | 说明 |
|------|------|------|------|
| id | BIGINT | PK | 主键 |
| playlist_id | BIGINT | NOT NULL | 歌单 ID |
| song_id | BIGINT | NOT NULL | 歌曲 ID |
| sort_order | INT | DEFAULT 0 | 排序 |
| added_at | DATETIME | DEFAULT NOW() | 添加时间 |

**唯一约束**: (playlist_id, song_id)

---

### 13. comments（评论）

| 字段 | 类型 | 约束 | 说明 |
|------|------|------|------|
| id | BIGINT | PK | 主键 |
| user_id | BIGINT | NOT NULL | 评论者 |
| song_id | BIGINT | NOT NULL | 歌曲 ID |
| parent_id | BIGINT | | 父评论 ID（回复） |
| content | TEXT | NOT NULL | 评论内容 |
| likes_count | BIGINT | DEFAULT 0 | 点赞数 |
| created_at | DATETIME | NOT NULL | |
| updated_at | DATETIME | NOT NULL | |
| deleted_at | DATETIME | | |

---

### 14. messages（私信）

| 字段 | 类型 | 约束 | 说明 |
|------|------|------|------|
| id | BIGINT | PK | 主键 |
| sender_id | BIGINT | NOT NULL | 发送者 |
| receiver_id | BIGINT | NOT NULL | 接收者 |
| content | TEXT | NOT NULL | 消息内容 |
| msg_type | VARCHAR(20) | DEFAULT 'TEXT' | 类型：TEXT/SONG/PLAYLIST |
| ref_id | BIGINT | | 关联对象 ID |
| is_read | BOOLEAN | DEFAULT FALSE | 是否已读 |
| created_at | DATETIME | NOT NULL | |
| updated_at | DATETIME | NOT NULL | |
| deleted_at | DATETIME | | |

---

### 15. user_follows（关注关系）

| 字段 | 类型 | 约束 | 说明 |
|------|------|------|------|
| id | BIGINT | PK | 主键 |
| follower_id | BIGINT | NOT NULL | 关注者 |
| following_id | BIGINT | NOT NULL | 被关注者 |
| created_at | DATETIME | NOT NULL | |
| deleted_at | DATETIME | | |

**唯一约束**: (follower_id, following_id)

---

### 16. voice_records（录音记录）

| 字段 | 类型 | 约束 | 说明 |
|------|------|------|------|
| id | BIGINT | PK | 主键 |
| user_id | BIGINT | NOT NULL | 用户 ID |
| song_id | BIGINT | | 关联歌曲（可选） |
| file_path | VARCHAR(500) | NOT NULL | 录音文件路径 |
| duration_sec | INT | | 时长（秒） |
| pitch_data | JSON | | 音高分析数据 |
| rhythm_data | JSON | | 节奏分析数据 |
| score | INT | | 综合评分（0-100） |
| comparison_data | JSON | | 与原唱对比数据 |
| feedback_text | TEXT | | AI 反馈文本 |
| created_at | DATETIME | NOT NULL | |
| updated_at | DATETIME | NOT NULL | |
| deleted_at | DATETIME | | |

---

### 17. voice_exercises（练习任务库）

| 字段 | 类型 | 约束 | 说明 |
|------|------|------|------|
| id | BIGINT | PK | 主键 |
| title | VARCHAR(200) | NOT NULL | 练习名称 |
| description | VARCHAR(1000) | | 描述 |
| type | VARCHAR(20) | NOT NULL | 类型：BREATH/PITCH/RHYTHM/VIBRATO |
| difficulty | INT | NOT NULL | 难度（1-5） |
| audio_example_path | VARCHAR(500) | | 示例音频路径 |
| instructions | TEXT | | 练习说明 |
| target_metrics | JSON | | 目标指标 |
| duration_sec | INT | | 预计时长 |
| sort_order | INT | DEFAULT 0 | 排序 |
| created_at | DATETIME | NOT NULL | |
| updated_at | DATETIME | NOT NULL | |
| deleted_at | DATETIME | | |

---

### 18. user_practice_progress（练习进度）

| 字段 | 类型 | 约束 | 说明 |
|------|------|------|------|
| id | BIGINT | PK | 主键 |
| user_id | BIGINT | NOT NULL | 用户 ID |
| exercise_id | BIGINT | NOT NULL | 练习 ID |
| voice_record_id | BIGINT | | 最近录音 ID |
| status | VARCHAR(20) | DEFAULT 'NOT_STARTED' | 状态 |
| attempts_count | INT | DEFAULT 0 | 尝试次数 |
| best_score | INT | | 最高分 |
| latest_score | INT | | 最近分数 |
| practice_minutes | INT | DEFAULT 0 | 练习时长（分钟） |
| notes | TEXT | | 用户笔记 |
| started_at | DATETIME | | 开始时间 |
| completed_at | DATETIME | | 完成时间 |
| created_at | DATETIME | NOT NULL | |
| updated_at | DATETIME | NOT NULL | |
| deleted_at | DATETIME | | |

**唯一约束**: (user_id, exercise_id)

---

### 19. ai_sessions（AI 会话）

| 字段 | 类型 | 约束 | 说明 |
|------|------|------|------|
| id | BIGINT | PK | 主键 |
| user_id | BIGINT | NOT NULL | 用户 ID |
| title | VARCHAR(200) | | 会话标题 |
| session_type | VARCHAR(20) | NOT NULL | 类型：VOICE_COACH/GENERAL |
| context_data | JSON | | 上下文数据 |
| summary | VARCHAR(2000) | | 会话摘要 |
| created_at | DATETIME | NOT NULL | |
| updated_at | DATETIME | NOT NULL | |
| deleted_at | DATETIME | | |

---

### 20. ai_messages（AI 消息）

| 字段 | 类型 | 约束 | 说明 |
|------|------|------|------|
| id | BIGINT | PK | 主键 |
| session_id | BIGINT | NOT NULL | 会话 ID |
| role | VARCHAR(20) | NOT NULL | 角色：USER/ASSISTANT |
| content | TEXT | NOT NULL | 消息内容 |
| msg_type | VARCHAR(30) | DEFAULT 'TEXT' | 类型：TEXT/AUDIO_ANALYSIS/EXERCISE_SUGGEST |
| metadata | JSON | | 元数据 |
| created_at | DATETIME | NOT NULL | |
| deleted_at | DATETIME | | |

---

### 21. recommendations（推荐记录）

| 字段 | 类型 | 约束 | 说明 |
|------|------|------|------|
| id | BIGINT | PK | 主键 |
| user_id | BIGINT | NOT NULL | 用户 ID |
| song_id | BIGINT | NOT NULL | 歌曲 ID |
| score | DOUBLE | NOT NULL | 推荐分数 |
| reason | VARCHAR(500) | | 推荐理由 |
| algorithm | VARCHAR(20) | NOT NULL | 算法：COLLAB_FILTER/CONTENT_BASED/TRENDING |
| is_clicked | BOOLEAN | DEFAULT FALSE | 是否被点击 |
| created_at | DATETIME | NOT NULL | |
| deleted_at | DATETIME | | |

---

### 22. rankings（排行榜）

| 字段 | 类型 | 约束 | 说明 |
|------|------|------|------|
| id | BIGINT | PK | 主键 |
| type | VARCHAR(20) | NOT NULL | 类型：HOT/NEW/RISING/GENRE |
| period | VARCHAR(20) | NOT NULL | 周期：DAILY/WEEKLY/MONTHLY |
| song_id | BIGINT | NOT NULL | 歌曲 ID |
| rank_position | INT | NOT NULL | 排名 |
| score | DOUBLE | | 分数 |
| genre_id | BIGINT | | 流派 ID（GENRE 类型时使用） |
| snapshot_date | DATE | | 快照日期 |
| created_at | DATETIME | NOT NULL | |
| updated_at | DATETIME | NOT NULL | |
| deleted_at | DATETIME | | |

---

## ER 关系概览

```
users ──1:1──> user_settings
users ──1:N──> playlists
users ──1:N──> user_songs ──N:1──> songs
users ──1:N──> comments ──N:1──> songs
users ──1:N──> voice_records
users ──1:N──> ai_sessions ──1:N──> ai_messages
users ──M:N──> users (user_follows)

songs ──N:1──> artists
songs ──N:1──> albums ──N:1──> artists
songs ──N:1──> genres
songs ──1:1──> lyrics
songs ──M:N──> tags (song_tags)
songs ──M:N──> playlists (playlist_songs)

voice_exercises ──1:N──> user_practice_progress
```
