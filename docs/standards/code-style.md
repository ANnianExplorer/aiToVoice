# AiToVoice 代码规范

> Java 17 + TypeScript strict | 企业级代码标准

---

## Java 后端规范

### 1. 必须使用的 Java 17 特性

**Switch 表达式**（替代 if-else 链）:
```java
// ✅ 正确
public String getRoleDescription(UserRole role) {
    return switch (role) {
        case ADMIN -> "管理员";
        case USER -> "普通用户";
        case GUEST -> "访客";
    };
}

// ❌ 错误
if (role == ADMIN) return "管理员";
else if (role == USER) return "普通用户";
```

**Stream API**（替代 for 循环做转换/过滤/聚合）:
```java
// ✅ 正确（@Where 自动过滤已删除记录，无需手动检查 deletedAt）
List<SongDto> hotSongs = songRepository.findHotSongs().stream()
    .sorted(Comparator.comparing(Song::getPlayCount).reversed())
    .map(songMapper::toDto)
    .limit(50)
    .toList();

// ❌ 错误
List<SongDto> hotSongs = new ArrayList<>();
for (Song song : songRepository.findHotSongs()) {
    hotSongs.add(songMapper.toDto(song));
}
```

**Text Blocks**（替代字符串拼接）:
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

**Records**（替代简单 DTO/值对象）:
```java
// ✅ 正确
public record SongDto(
    Long id,
    String title,
    String artistName,
    Integer duration
) {}

// ❌ 错误 - 手写 getter/equals/hashCode
public class SongDto {
    private Long id;
    private String title;
    // ... 一堆 boilerplate
}
```

**Pattern Matching instanceof**:
```java
// ✅ 正确
if (exception instanceof BusinessException ex) {
    return ApiResponse.error(ex.getErrorCode().getCode(), ex.getMessage());
}

// ❌ 错误
if (exception instanceof BusinessException) {
    BusinessException ex = (BusinessException) exception;
    return ApiResponse.error(ex.getErrorCode().getCode(), ex.getMessage());
}
```

**var 局部变量类型推断**:
```java
// ✅ 正确
var user = userRepository.findById(userId)
    .orElseThrow(() -> new BusinessException(ErrorCode.USER_NOT_FOUND));
var songs = songRepository.findByArtistId(artistId);

// ❌ 冗余
User user = userRepository.findById(userId)...;
List<Song> songs = songRepository.findByArtistId(artistId);
```

### 2. 分层架构规范

```
Controller  → 只做参数校验 + 调用 Service + 返回 ApiResponse
Service     → 业务逻辑，事务管理，调用 Repository
Repository  → 数据访问，继承 JpaRepository
Entity      → JPA 实体，继承 BaseEntity
DTO         → 数据传输对象，使用 Record
Mapper      → Entity ↔ DTO 转换，使用 MapStruct
```

**严格禁止**:
- Controller 直接调用 Repository
- Entity 直接作为 API 响应
- Service 之间循环依赖
- 在 Entity 中写业务逻辑
- 使用 `@Autowired` 字段注入（必须用构造器注入）

### 3. 通用基类

所有实体继承 BaseEntity，自动获得:
- `id` (Long, AUTO_INCREMENT)
- `createdAt` (LocalDateTime, 自动填充)
- `updatedAt` (LocalDateTime, 自动更新)
- `deletedAt` (LocalDateTime, 逻辑删除)
- `softDelete()` 方法
- `isDeleted()` 方法

### 4. 命名规范

| 类型 | 规范 | 示例 |
|------|------|------|
| 包名 | 全小写 | `com.aitovoice.music.service` |
| 类名 | PascalCase | `SongService`, `VoiceRecordDto` |
| 方法名 | camelCase | `findHotSongs()`, `analyzePitch()` |
| 常量 | UPPER_SNAKE | `MAX_UPLOAD_SIZE` |
| 数据库表 | snake_case | `voice_records`, `user_settings` |
| 数据库字段 | snake_case | `created_at`, `play_count` |
| API 路径 | kebab-case | `/api/voice-records` |

### 5. 异常处理

- 统一使用 `BusinessException` + `ErrorCode` 枚举
- 全局异常处理器 `GlobalExceptionHandler` 捕获所有异常
- 业务异常返回对应 HTTP 状态码
- 未知异常返回 500 并记录日志

### 6. 统一响应格式

```java
public record ApiResponse<T>(
    int code,
    String message,
    T data,
    LocalDateTime timestamp
) {
    public static <T> ApiResponse<T> success(T data);
    public static <T> ApiResponse<T> success(String message, T data);
    public static <T> ApiResponse<T> error(int code, String message);
}
```

---

## TypeScript 前端规范

### 1. 基础规范

- TypeScript strict 模式
- 组件使用函数式 + Hooks
- 状态管理 Zustand（非 Redux）
- API 请求统一封装在 `api/` 目录
- 组件 props 使用 interface 定义
- 使用 ESLint + Prettier 格式化

### 2. 文件组织

```
src/
├── api/          # API 请求层（按模块拆分）
├── stores/       # Zustand 状态管理
├── hooks/        # 自定义 Hooks
├── types/        # TypeScript 类型定义
├── components/   # 通用组件（按功能分目录）
└── pages/        # 页面组件（按功能分目录）
```

### 3. 组件规范

```tsx
// ✅ 正确 - 函数式组件 + TypeScript
interface SongCardProps {
  song: Song;
  onPlay: (song: Song) => void;
}

export default function SongCard({ song, onPlay }: SongCardProps) {
  return (
    <Card onClick={() => onPlay(song)}>
      <Text>{song.title}</Text>
    </Card>
  );
}
```

### 4. API 调用规范

Axios 拦截器解包 Axios 层，API 函数解包 ApiResponse 层，消费者直接使用数据：

```tsx
// ✅ 正确 - API 函数返回 T，消费者直接使用
const handleSearch = async (keyword: string) => {
  setLoading(true);
  try {
    const res = await searchSongs(keyword);  // res 是 PageResponse<Song>
    setResults(res?.content || []);
  } catch (err) {
    message.error('搜索失败');
  } finally {
    setLoading(false);
  }
};

// ❌ 错误 - 旧的双重解包模式
const res = await searchSongs(keyword);
setResults(res.data.data?.content || []);  // res.data.data 是 undefined
```

---

## Git 提交规范

使用 Conventional Commits 格式:

```
feat: 新功能
fix: 修复 bug
docs: 文档更新
style: 代码格式（不影响逻辑）
refactor: 重构
test: 测试
chore: 构建/工具
```
