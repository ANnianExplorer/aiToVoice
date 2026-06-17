# 前端代码规范

> 基于 React + TypeScript + Electron 的前端开发规范。

---

## 1. TypeScript 要求

- **strict 模式**开启
- 所有组件 props 使用 `interface` 定义
- API 响应使用 `type` 定义
- 禁止 `any` 类型（必要时用 `unknown`）

```typescript
// ✅ 正确
interface SongCardProps {
  song: Song;
  onPlay: (song: Song) => void;
}

// ❌ 错误
function SongCard(props: any) {}
```

---

## 2. 组件规范

### 函数式组件 + Hooks

```typescript
// ✅ 正确
export default function SongList({ songs }: SongListProps) {
  const [loading, setLoading] = useState(false);
  return <div>...</div>;
}

// ❌ 错误 - class 组件
export default class SongList extends React.Component {}
```

### 文件组织

```
components/
├── Layout/          # 布局组件
│   ├── AppLayout.tsx
│   ├── Sidebar.tsx
│   ├── TopBar.tsx
│   └── TitleBar.tsx
├── Player/          # 播放器组件
│   └── PlayerBar.tsx
└── Common/          # 通用组件
```

---

## 3. 状态管理

使用 Zustand，按功能域分 store：

```typescript
// stores/authStore.ts - 认证状态
// stores/playerStore.ts - 播放器状态
```

### Store 规范

- 使用 `persist` 中间件持久化关键状态
- Action 和 State 分开定义
- 避免在 store 中写业务逻辑

---

## 4. API 请求层

所有 API 请求封装在 `api/` 目录：

```
api/
├── client.ts       # Axios 实例 + 拦截器
├── auth.ts         # 认证 API
├── songs.ts        # 歌曲 API
├── playlists.ts    # 歌单 API
├── rankings.ts     # 排行榜 API
├── voice.ts        # 语音 API
├── ai.ts           # AI API
├── social.ts       # 社交 API
├── settings.ts     # 设置 API
└── recommend.ts    # 推荐 API
```

### 错误处理

```typescript
// API 拦截器统一处理 401
if (error.response?.status === 401) {
  localStorage.removeItem('token');
  window.location.href = '/login';
}

// 页面级 try/catch
try {
  const res = await getHotSongs();
  setSongs(res.data.data);
} catch (err) {
  message.error('加载失败');
}
```

---

## 5. 样式规范

使用 Ant Design 组件 + CSS 变量：

```css
/* 全局变量 */
--bg-primary: #121212;
--bg-secondary: #181818;
--accent-green: #1DB954;
--text-primary: #FFFFFF;
--text-secondary: #B3B3B3;
```

- 暗色主题为主
- 使用 Ant Design 的 `theme.darkAlgorithm`
- 内联样式用于布局，复杂样式用 CSS 模块

---

## 6. Electron 规范

### IPC 通信

```typescript
// preload.ts - 安全暴露 API
contextBridge.exposeInMainWorld('electronAPI', { ... });

// 组件中使用
window.electronAPI?.minimize();
```

### 全局快捷键

通过 `onMediaCommand` 回调处理媒体键事件。

---

## 7. 目录结构

```
src/
├── api/            # API 请求层
├── stores/         # Zustand 状态
├── hooks/          # 自定义 Hooks
├── types/          # TypeScript 类型
├── components/     # 通用组件
│   ├── Layout/
│   ├── Player/
│   └── Common/
├── pages/          # 页面组件
│   ├── Auth/
│   ├── Home/
│   ├── Search/
│   └── ...
└── assets/         # 静态资源
    └── styles/
```
