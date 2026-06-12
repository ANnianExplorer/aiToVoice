# AiToVoice API 接口文档

> ~70 个 RESTful 接口 | 基础路径: `/api` | 认证: JWT Bearer Token

---

## 公共约定

### 请求头

```
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

### 统一响应格式

```json
{
  "code": 200,
  "message": "success",
  "data": { ... },
  "timestamp": "2026-06-10T12:00:00"
}
```

### 错误码

| 码 | 含义 |
|----|------|
| 200 | 成功 |
| 400 | 参数校验失败 |
| 401 | 未认证 |
| 403 | 无权限 |
| 404 | 资源不存在 |
| 409 | 冲突（已存在） |
| 429 | 请求过于频繁 |
| 500 | 服务器内部错误 |

---

## 认证 `/api/auth`

| 方法 | 路径 | 说明 | 认证 |
|------|------|------|------|
| POST | `/register` | 注册 | 否 |
| POST | `/login` | 登录 | 否 |
| GET | `/me` | 获取当前用户 | 是 |

### POST /api/auth/register

**请求**:
```json
{
  "username": "string (3-50字符)",
  "email": "string (邮箱格式)",
  "password": "string (6-100字符)"
}
```

**响应**: AuthResponse（token + refreshToken + user）

### POST /api/auth/login

**请求**:
```json
{
  "username": "string",
  "password": "string"
}
```

**响应**: AuthResponse

---

## 歌曲 `/api/songs`

| 方法 | 路径 | 说明 | 认证 |
|------|------|------|------|
| GET | `/search?keyword=&page=&size=` | 搜索歌曲 | 否 |
| GET | `/hot?limit=` | 热门歌曲 | 否 |
| GET | `/new?limit=` | 新歌 | 否 |
| GET | `/{id}` | 歌曲详情 | 否 |
| POST | `/upload` | 上传歌曲 | 是 |
| POST | `/{id}/play` | 记录播放 | 是 |
| POST | `/{id}/favorite` | 收藏 | 是 |
| DELETE | `/{id}/favorite` | 取消收藏 | 是 |
| GET | `/favorites` | 我的收藏 | 是 |
| GET | `/history` | 播放历史 | 是 |

---

## 歌单 `/api/playlists`

| 方法 | 路径 | 说明 | 认证 |
|------|------|------|------|
| POST | `/` | 创建歌单 | 是 |
| GET | `/{id}` | 歌单详情 | 否 |
| GET | `/my` | 我的歌单 | 是 |
| GET | `/{id}/songs` | 歌单歌曲列表 | 否 |
| POST | `/{id}/songs/{songId}` | 添加歌曲 | 是 |
| DELETE | `/{id}/songs/{songId}` | 移除歌曲 | 是 |
| DELETE | `/{id}` | 删除歌单 | 是 |

---

## 排行榜 `/api/rankings`

| 方法 | 路径 | 说明 | 认证 |
|------|------|------|------|
| GET | `/hot` | 热歌榜 | 否 |
| GET | `/new` | 新歌榜 | 否 |
| GET | `/rising` | 飙升榜 | 否 |
| GET | `/genre/{genreId}` | 流派榜 | 否 |

---

## 推荐 `/api/recommend`

| 方法 | 路径 | 说明 | 认证 |
|------|------|------|------|
| GET | `/daily` | 每日推荐 | 是 |
| GET | `/fm` | 私人 FM | 是 |
| GET | `/similar/{songId}` | 相似歌曲 | 否 |
| POST | `/feedback?songId=&liked=` | 推荐反馈 | 是 |

---

## 歌词 `/api/songs/{songId}/lyrics`

| 方法 | 路径 | 说明 | 认证 |
|------|------|------|------|
| GET | `/` | 获取歌词原始内容 | 否 |
| GET | `/parsed` | 获取解析后歌词（时间戳->文本） | 否 |
| POST | `/` | 保存歌词 | 是 |

---

## 评论 `/api`

| 方法 | 路径 | 说明 | 认证 |
|------|------|------|------|
| GET | `/songs/{songId}/comments?page=&size=` | 歌曲评论 | 否 |
| POST | `/songs/{songId}/comments` | 发表评论 | 是 |
| DELETE | `/comments/{id}` | 删除评论 | 是 |

---

## 私信 `/api/messages`

| 方法 | 路径 | 说明 | 认证 |
|------|------|------|------|
| GET | `/{userId}` | 与某用户的聊天记录 | 是 |
| POST | `/{userId}` | 发送私信 | 是 |

---

## 关注 `/api/users`

| 方法 | 路径 | 说明 | 认证 |
|------|------|------|------|
| POST | `/{id}/follow` | 关注用户 | 是 |
| DELETE | `/{id}/follow` | 取消关注 | 是 |
| GET | `/{id}/follow-stats` | 关注/粉丝数 | 否 |

---

## 语音 `/api/voice`

| 方法 | 路径 | 说明 | 认证 |
|------|------|------|------|
| POST | `/record` | 上传录音 | 是 |
| GET | `/records` | 我的录音列表 | 是 |
| POST | `/records/{id}/analyze` | 分析录音 | 是 |
| GET | `/progress` | 我的练习进度 | 是 |
| POST | `/progress/{exerciseId}/submit?recordId=` | 提交练习结果 | 是 |

---

## AI 老师 `/api/ai`

| 方法 | 路径 | 说明 | 认证 |
|------|------|------|------|
| POST | `/sessions` | 创建会话 | 是 |
| GET | `/sessions` | 会话列表 | 是 |
| GET | `/sessions/{id}/messages` | 会话消息历史 | 是 |
| POST | `/sessions/{id}/messages` | 发送消息 | 是 |

---

## 用户设置 `/api/settings`

| 方法 | 路径 | 说明 | 认证 |
|------|------|------|------|
| GET | `/` | 获取设置 | 是 |
| PUT | `/` | 更新设置 | 是 |

---

## 文件 `/api/files`

| 方法 | 路径 | 说明 | 认证 |
|------|------|------|------|
| GET | `/audio/{subDir}/{filename}` | 流式播放音频 | 否 |
| GET | `/cover/{subDir}/{filename}` | 获取封面图 | 否 |
| POST | `/upload?type=audio/cover/avatar` | 上传文件 | 是 |

---

## Swagger UI

启动后端后访问：`http://localhost:8080/swagger-ui.html`
