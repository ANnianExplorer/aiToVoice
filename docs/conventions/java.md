# Java 后端代码规范

> 基于 Java 17 的 Spring Boot 后端开发规范。

---

## 1. Java 17 语法要求

### 必须使用

| 特性 | 替代 | 示例 |
|------|------|------|
| Switch 表达式 | if-else 链 | `return switch (role) { case ADMIN -> "..."; };` |
| Stream API | for 循环转换/过滤 | `list.stream().filter(...).map(...).toList()` |
| Text Blocks | 字符串拼接 | `"""多行文本"""` |
| Records | 手写 DTO | `public record UserDto(String name) {}` |
| Pattern Matching instanceof | 强制转换 | `if (obj instanceof User u) {}` |
| var | 显式类型声明 | `var user = repo.findById(id);` |
| .toList() | .collect(Collectors.toList()) | `stream().toList()` |

### 禁止使用

- 传统 for 循环做转换/过滤（用 Stream）
- 字符串拼接多行文本（用 Text Blocks）
- 手写 getter/setter/equals/hashCode（用 Record 或 Lombok）

---

## 2. 分层架构

```
Controller → Service → Repository
    ↓           ↓          ↓
  DTO       Entity     JPA Query
```

### 职责划分

| 层 | 职责 | 禁止 |
|---|------|------|
| Controller | 参数校验 + 调用 Service + 返回 ApiResponse | 直接调用 Repository |
| Service | 业务逻辑 + 事务管理 | 操作 HTTP 请求/响应 |
| Repository | 数据访问 | 包含业务逻辑 |
| Entity | 数据模型 | 作为 API 响应 |
| DTO | 数据传输 | 包含业务逻辑 |
| Mapper | Entity ↔ DTO 转换 | 包含业务逻辑 |

### 注入方式

```java
// ✅ 正确 - 构造器注入
@Service
@RequiredArgsConstructor
public class SongService {
    private final SongRepository songRepository;
}

// ❌ 错误 - 字段注入
@Service
public class SongService {
    @Autowired
    private SongRepository songRepository;
}
```

---

## 3. 命名规范

| 类型 | 规范 | 示例 |
|------|------|------|
| 包名 | 全小写 | `com.aitovoice.music.service` |
| 类名 | PascalCase | `SongService`, `VoiceRecordDto` |
| 方法名 | camelCase | `findHotSongs()`, `analyzePitch()` |
| 常量 | UPPER_SNAKE | `MAX_UPLOAD_SIZE` |
| 数据库表 | snake_case | `voice_records`, `user_settings` |
| 数据库字段 | snake_case | `created_at`, `play_count` |
| API 路径 | kebab-case | `/api/voice-records` |

---

## 4. 通用基类

### BaseEntity

所有实体继承，提供：
- `id` (BIGINT, AUTO_INCREMENT)
- `createdAt` (自动填充)
- `updatedAt` (自动填充)
- `deletedAt` (逻辑删除)
- `softDelete()` 方法

### ApiResponse

统一 API 响应格式：
```java
ApiResponse.success(data)           // 成功
ApiResponse.success("消息", data)    // 成功 + 自定义消息
ApiResponse.error(404, "未找到")     // 错误
```

### BusinessException

业务异常，携带 ErrorCode：
```java
throw new BusinessException(ErrorCode.SONG_NOT_FOUND);
throw new BusinessException(ErrorCode.VALIDATION_ERROR, "自定义消息");
```

---

## 5. 异常处理

`GlobalExceptionHandler` 统一处理：

| 异常类型 | HTTP 状态码 | 说明 |
|---------|-----------|------|
| BusinessException | ErrorCode.code | 业务异常 |
| MethodArgumentNotValidException | 400 | 参数校验失败 |
| BadCredentialsException | 401 | 认证失败 |
| AccessDeniedException | 403 | 权限不足 |
| Exception | 500 | 未知异常 |

---

## 6. 模块结构

每个业务模块统一目录结构：

```
module/
├── controller/    # REST 控制器
├── service/       # 业务逻辑
├── repository/    # 数据访问
├── entity/        # JPA 实体
├── dto/           # 数据传输对象
└── mapper/        # 对象映射（可选）
```

---

## 7. LSP 集成

使用 JDTLS (jdtls-lsp) 进行：
- 代码自动补全
- 类型检查
- 重构建议
- 代码导航
