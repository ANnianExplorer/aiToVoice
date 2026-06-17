# API 接口文档

> 后端 REST API 完整接口清单。启动后端后访问 http://localhost:8080/swagger-ui.html 查看交互式文档。

---

## 认证 `/api/auth`

| 方法 | 路径 | 说明 | 认证 |
|------|------|------|------|
| POST | `/api/auth/register` | 用户注册 | ❌ |
| POST | `/api/auth/login` | 用户登录 | ❌ |
| GET | `/api/auth/me` | 获取当前用户 | ✅ |

---

## 歌曲 `/api/songs`

| 方法 | 路径 | 说明 | 认证 |
|------|------|------|------|
| GET | `/api/songs/search?keyword=&page=&size=` | 搜索歌曲 | ❌ |
| GET | `/api/songs/hot?limit=` | 热门歌曲 | ❌ |
| GET | `/api/songs/new?limit=` | 新歌 | ❌ |
| GET | `/api/songs/{id}` | 歌曲详情 | ❌ |
| POST | `/api/songs/upload` | 上传歌曲 | ✅ |
| POST | `/api/songs/{id}/play` | 记录播放 | ✅ |
| POST | `/api/songs/{id}/favorite` | 收藏 | ✅ |
| DELETE | `/api/songs/{id}/favorite` | 取消收藏 | ✅ |
| GET | `/api/songs/favorites` | 我的收藏 | ✅ |
| GET | `/api/songs/history` | 播放历史 | ✅ |

---

## 歌词 `/api/songs/{songId}/lyrics`

| 方法 | 路径 | 说明 | 认证 |
|------|------|------|------|
| GET | `/api/songs/{songId}/lyrics` | 获取歌词 | ❌ |
| GET | `/api/songs/{songId}/lyrics/parsed` | 获取解析后歌词 | ❌ |
| POST | `/api/songs/{songId}/lyrics` | 保存歌词 | ✅ |

---

## 歌单 `/api/playlists`

| 方法 | 路径 | 说明 | 认证 |
|------|------|------|------|
| GET | `/api/playlists/my` | 我的歌单 | ✅ |
| GET | `/api/playlists/{id}` | 歌单详情 | ❌ |
| POST | `/api/playlists` | 创建歌单 | ✅ |
| DELETE | `/api/playlists/{id}` | 删除歌单 | ✅ |
| GET | `/api/playlists/{id}/songs` | 歌单歌曲 | ❌ |
| POST | `/api/playlists/{id}/songs/{songId}` | 添加歌曲 | ✅ |
| DELETE | `/api/playlists/{id}/songs/{songId}` | 移除歌曲 | ✅ |

---

## 排行榜 `/api/rankings`

| 方法 | 路径 | 说明 | 认证 |
|------|------|------|------|
| GET | `/api/rankings/hot` | 热歌榜 | ❌ |
| GET | `/api/rankings/new` | 新歌榜 | ❌ |
| GET | `/api/rankings/rising` | 飙升榜 | ❌ |
| GET | `/api/rankings/genre/{genreId}` | 流派榜 | ❌ |

---

## 推荐 `/api/recommend`

| 方法 | 路径 | 说明 | 认证 |
|------|------|------|------|
| GET | `/api/recommend/daily` | 每日推荐 | ✅ |
| GET | `/api/recommend/fm` | 私人 FM | ✅ |
| GET | `/api/recommend/similar/{songId}` | 相似歌曲 | ❌ |
| POST | `/api/recommend/feedback?songId=&liked=` | 推荐反馈 | ✅ |

---

## 评论 `/api/songs/{songId}/comments`

| 方法 | 路径 | 说明 | 认证 |
|------|------|------|------|
| GET | `/api/songs/{songId}/comments?page=&size=` | 评论列表 | ❌ |
| POST | `/api/songs/{songId}/comments` | 发表评论 | ✅ |
| DELETE | `/api/comments/{id}` | 删除评论 | ✅ |

---

## 私信 `/api/messages`

| 方法 | 路径 | 说明 | 认证 |
|------|------|------|------|
| GET | `/api/messages/{userId}` | 聊天记录 | ✅ |
| POST | `/api/messages/{userId}` | 发送私信 | ✅ |

---

## 关注 `/api/users`

| 方法 | 路径 | 说明 | 认证 |
|------|------|------|------|
| POST | `/api/users/{id}/follow` | 关注 | ✅ |
| DELETE | `/api/users/{id}/follow` | 取消关注 | ✅ |
| GET | `/api/users/{id}/follow-stats` | 关注统计 | ❌ |

---

## 语音 `/api/voice`

| 方法 | 路径 | 说明 | 认证 |
|------|------|------|------|
| POST | `/api/voice/record` | 上传录音 | ✅ |
| GET | `/api/voice/records` | 我的录音 | ✅ |
| POST | `/api/voice/records/{id}/analyze` | 分析录音 | ✅ |
| GET | `/api/voice/progress` | 练习进度 | ✅ |
| POST | `/api/voice/progress/{exerciseId}/submit?recordId=` | 提交练习 | ✅ |

---

## AI 老师 `/api/ai`

| 方法 | 路径 | 说明 | 认证 |
|------|------|------|------|
| POST | `/api/ai/sessions` | 创建会话 | ✅ |
| GET | `/api/ai/sessions` | 会话列表 | ✅ |
| GET | `/api/ai/sessions/{id}/messages` | 消息历史 | ✅ |
| POST | `/api/ai/sessions/{id}/messages` | 发送消息 | ✅ |

---

## 用户设置 `/api/settings`

| 方法 | 路径 | 说明 | 认证 |
|------|------|------|------|
| GET | `/api/settings` | 获取设置 | ✅ |
| PUT | `/api/settings` | 更新设置 | ✅ |

---

## 文件服务 `/api/files`

| 方法 | 路径 | 说明 | 认证 |
|------|------|------|------|
| GET | `/api/files/audio/{subDir}/{filename}` | 音频文件 | ❌ |
| GET | `/api/files/cover/{subDir}/{filename}` | 封面图片 | ❌ |
| POST | `/api/files/upload?type=` | 上传文件 | ✅ |

---

## 统一响应格式

```json
{
  "code": 200,
  "message": "success",
  "data": { ... },
  "timestamp": "2026-06-12T10:00:00"
}
```

## 错误码

| 码 | 说明 |
|---|------|
| 200 | 成功 |
| 400 | 参数校验失败 |
| 401 | 未授权 / Token 无效 |
| 403 | 无权访问 |
| 404 | 资源不存在 |
| 409 | 资源冲突（重复操作） |
| 429 | 请求过于频繁 |
| 500 | 服务器内部错误 |
| 502 | AI 服务异常 |
