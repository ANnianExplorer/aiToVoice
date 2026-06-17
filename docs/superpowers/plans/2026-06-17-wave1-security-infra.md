# Wave 1: Security & Infrastructure Fix Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Fix all critical security vulnerabilities and infrastructure issues without changing business logic.

**Architecture:** Targeted fixes to existing code — new utility class for path sanitization, DTO layer for auth, CORS integration, AiClient hardening, config externalization, frontend API response fix.

**Tech Stack:** Java 17, Spring Boot 3.2.5, Spring Security, MapStruct, React 18, TypeScript, Axios, Zustand

## Global Constraints

- No behavior changes — only broken paths are fixed
- No new features — zero user-facing functionality added
- All existing API endpoints keep their paths and contracts
- After this wave, project compiles and runs correctly
- Java 17 syntax only (records, sealed classes where appropriate)
- All new code has unit tests

---

### Task 1: Path Traversal Fix — FilePathSanitizer + FileController

**Files:**
- Create: `backend/src/main/java/com/aitovoice/common/util/FilePathSanitizer.java`
- Create: `backend/src/test/java/com/aitovoice/common/util/FilePathSanitizerTest.java`
- Modify: `backend/src/main/java/com/aitovoice/music/controller/FileController.java`

**Interfaces:**
- Produces: `FilePathSanitizer.sanitize(String basePath, String userInput) -> String` (returns canonical safe path or throws)
- Consumes: `FileStorageService.getFilePath(String)` (existing, unchanged)

- [ ] **Step 1: Write failing tests for FilePathSanitizer**

```java
package com.aitovoice.common.util;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.io.TempDir;
import java.nio.file.Path;
import static org.junit.jupiter.api.Assertions.*;

class FilePathSanitizerTest {

    @TempDir
    Path tempDir;

    @Test
    void normalPath_returnsCanonicalPath() {
        String result = FilePathSanitizer.sanitize(tempDir.toString(), "subdir/file.mp3");
        assertTrue(result.startsWith(tempDir.toString()));
        assertTrue(result.endsWith("subdir" + System.getProperty("file.separator") + "file.mp3"));
    }

    @Test
    void dotDotTraversal_throwsException() {
        assertThrows(IllegalArgumentException.class,
            () -> FilePathSanitizer.sanitize(tempDir.toString(), "../../etc/passwd"));
    }

    @Test
    void encodedDotDotTraversal_throwsException() {
        assertThrows(IllegalArgumentException.class,
            () -> FilePathSanitizer.sanitize(tempDir.toString(), "subdir/../../../etc/passwd"));
    }

    @Test
    void nullInput_throwsException() {
        assertThrows(IllegalArgumentException.class,
            () -> FilePathSanitizer.sanitize(tempDir.toString(), null));
    }

    @Test
    void emptyInput_throwsException() {
        assertThrows(IllegalArgumentException.class,
            () -> FilePathSanitizer.sanitize(tempDir.toString(), ""));
    }
}
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `cd backend && mvn test -pl . -Dtest=FilePathSanitizerTest -q`
Expected: FAIL — `FilePathSanitizer` class does not exist

- [ ] **Step 3: Implement FilePathSanitizer**

```java
package com.aitovoice.common.util;

import java.io.IOException;
import java.nio.file.Path;

public final class FilePathSanitizer {

    private FilePathSanitizer() {}

    /**
     * Resolves user-provided path against a base directory.
     * Throws IllegalArgumentException if the resolved path escapes the base.
     */
    public static String sanitize(String basePath, String userInput) {
        if (userInput == null || userInput.isBlank()) {
            throw new IllegalArgumentException("Path must not be empty");
        }
        Path base = Path.of(basePath).toAbsolutePath().normalize();
        Path resolved = base.resolve(userInput).toAbsolutePath().normalize();
        if (!resolved.startsWith(base)) {
            throw new IllegalArgumentException("Path traversal detected");
        }
        return resolved.toString();
    }
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `cd backend && mvn test -pl . -Dtest=FilePathSanitizerTest -q`
Expected: PASS

- [ ] **Step 5: Write failing test for FileController path validation**

```java
// Add to existing FileControllerTest or create new:
@Test
void getAudio_withTraversal_returns400() throws Exception {
    mockMvc.perform(get("/api/files/audio/../../../etc/passwd"))
        .andExpect(status().isBadRequest());
}
```

- [ ] **Step 6: Run test to verify it fails**

Expected: 200 or 404 (not 400) — no validation exists yet

- [ ] **Step 7: Integrate sanitizer into FileController**

Modify `FileController.getAudio()` and `getCover()`:
- Before constructing the file path, call `FilePathSanitizer.sanitize(uploadDir, subDir + "/" + filename)`
- Catch `IllegalArgumentException`, return `ApiResponse.error(400, "Invalid file path")`

- [ ] **Step 8: Run all FileController tests**

Run: `cd backend && mvn test -pl . -Dtest=FileControllerTest -q`
Expected: PASS

- [ ] **Step 9: Commit**

```bash
git add backend/src/main/java/com/aitovoice/common/util/FilePathSanitizer.java \
        backend/src/test/java/com/aitovoice/common/util/FilePathSanitizerTest.java \
        backend/src/main/java/com/aitovoice/music/controller/FileController.java
git commit -m "fix: prevent path traversal in FileController via FilePathSanitizer"
```

---

### Task 2: Password Hash Leak Fix — UserDto + AuthController

**Files:**
- Create: `backend/src/main/java/com/aitovoice/user/dto/UserDto.java`
- Create: `backend/src/main/java/com/aitovoice/user/mapper/UserMapper.java` (if not exists, update existing)
- Modify: `backend/src/main/java/com/aitovoice/user/entity/User.java`
- Modify: `backend/src/main/java/com/aitovoice/auth/controller/AuthController.java`

**Interfaces:**
- Produces: `UserDto` record with safe fields only
- Produces: `UserMapper.toDto(User) -> UserDto`
- Consumes: `ApiResponse<UserDto>` as return type for auth endpoints

- [ ] **Step 1: Write failing test for password hash exclusion**

```java
@Test
void meEndpoint_doesNotContainPasswordHash() throws Exception {
    // Register and login first to get token
    String token = registerAndLogin("testuser", "password123");

    mockMvc.perform(get("/api/auth/me")
            .header("Authorization", "Bearer " + token))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.data.passwordHash").doesNotExist())
        .andExpect(jsonPath("$.data.id").exists())
        .andExpect(jsonPath("$.data.username").value("testuser"));
}
```

- [ ] **Step 2: Run test to verify it fails**

Expected: `jsonPath("$.data.passwordHash").doesNotExist()` fails — passwordHash is present

- [ ] **Step 3: Create UserDto**

```java
package com.aitovoice.user.dto;

import java.time.LocalDateTime;

public record UserDto(
    Long id,
    String username,
    String email,
    String nickname,
    String avatarUrl,
    String role,
    String status,
    LocalDateTime createdAt
) {}
```

- [ ] **Step 4: Add @JsonProperty on User.passwordHash**

```java
// In User.java, add to passwordHash field:
@JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
@Column(name = "password_hash", nullable = false)
private String passwordHash;
```

- [ ] **Step 5: Create/update UserMapper**

```java
package com.aitovoice.user.mapper;

import com.aitovoice.user.dto.UserDto;
import com.aitovoice.user.entity.User;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface UserMapper {
    UserDto toDto(User user);
}
```

- [ ] **Step 6: Update AuthController to return UserDto**

```java
// Change me() return type from ApiResponse<User> to ApiResponse<UserDto>
// Change register() and login() to map through UserMapper
```

- [ ] **Step 7: Run test to verify it passes**

Run: `cd backend && mvn test -pl . -Dtest=AuthControllerTest -q`
Expected: PASS — passwordHash not in response, id/username present

- [ ] **Step 8: Commit**

```bash
git add backend/src/main/java/com/aitovoice/user/dto/UserDto.java \
        backend/src/main/java/com/aitovoice/user/mapper/UserMapper.java \
        backend/src/main/java/com/aitovoice/user/entity/User.java \
        backend/src/main/java/com/aitovoice/auth/controller/AuthController.java
git commit -m "fix: prevent password hash leak via UserDto in auth endpoints"
```

---

### Task 3: CORS Configuration

**Files:**
- Modify: `backend/src/main/java/com/aitovoice/config/SecurityConfig.java`

**Interfaces:**
- Produces: `CorsConfigurationSource` bean
- Consumes: `SecurityFilterChain` integrates CORS

- [ ] **Step 1: Write failing test for CORS headers**

```java
@Test
void preflightRequest_returnsCorsHeaders() throws Exception {
    mockMvc.perform(options("/api/songs/hot")
            .header("Origin", "http://localhost:5173")
            .header("Access-Control-Request-Method", "GET"))
        .andExpect(status().isOk())
        .andExpect(header().string("Access-Control-Allow-Origin", "http://localhost:5173"));
}
```

- [ ] **Step 2: Run test to verify it fails**

Expected: No CORS headers in response

- [ ] **Step 3: Add CORS configuration to SecurityConfig**

```java
@Bean
public CorsConfigurationSource corsConfigurationSource() {
    CorsConfiguration config = new CorsConfiguration();
    config.setAllowedOrigins(List.of("http://localhost:5173", "http://localhost:8080"));
    config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
    config.setAllowedHeaders(List.of("Authorization", "Content-Type"));
    config.setAllowCredentials(true);
    UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
    source.registerCorsConfiguration("/**", config);
    return source;
}
```

Add to SecurityFilterChain: `.cors(cors -> cors.configurationSource(corsConfigurationSource()))`

- [ ] **Step 4: Run test to verify it passes**

Expected: PASS — CORS headers present

- [ ] **Step 5: Commit**

```bash
git add backend/src/main/java/com/aitovoice/config/SecurityConfig.java
git commit -m "feat: add CORS configuration for frontend cross-origin requests"
```

---

### Task 4: AiClient Timeout & Error Handling

**Files:**
- Create: `backend/src/main/java/com/aitovoice/config/AiConfig.java`
- Modify: `backend/src/main/java/com/aitovoice/voice/service/AiClient.java`
- Modify: `backend/src/main/resources/application.yml`

**Interfaces:**
- Produces: `AiConfig` bean with configured `HttpClient`
- Consumes: `AiClient` uses injected `HttpClient` instead of creating its own

- [ ] **Step 1: Write failing test for timeout configuration**

```java
@Test
void aiClient_throwsOnTimeout() {
    // Mock AI endpoint that never responds
    // Verify BusinessException thrown within 70 seconds
}
```

- [ ] **Step 2: Run test to verify it fails**

Expected: No timeout — test hangs or passes incorrectly

- [ ] **Step 3: Create AiConfig**

```java
@Configuration
public class AiConfig {

    @Value("${ai.openai.api-key:}")
    private String openaiApiKey;

    @Value("${ai.claude.api-key:}")
    private String claudeApiKey;

    @Value("${ai.openai.api-url:https://api.openai.com/v1/chat/completions}")
    private String openaiApiUrl;

    @Value("${ai.claude.api-url:https://api.anthropic.com/v1/messages}")
    private String claudeApiUrl;

    @Bean
    public HttpClient aiHttpClient() {
        return HttpClient.newBuilder()
            .connectTimeout(Duration.ofSeconds(10))
            .build();
    }

    // getters for config values
}
```

- [ ] **Step 4: Update AiClient to use injected HttpClient and check status codes**

```java
@Component
public class AiClient {
    private final HttpClient httpClient;
    private final AiConfig aiConfig;

    public AiClient(HttpClient aiHttpClient, AiConfig aiConfig) {
        this.httpClient = aiHttpClient;
        this.aiConfig = aiConfig;
    }

    // In sendRequest:
    // - Use httpClient instead of HttpClient.newHttpClient()
    // - Add .timeout(Duration.ofSeconds(60)) on HttpRequest
    // - Check response.statusCode() != 2xx -> throw BusinessException
    // - Use aiConfig for URLs and keys instead of hardcoded strings
}
```

- [ ] **Step 5: Update application.yml**

```yaml
ai:
  provider: ${AI_PROVIDER:openai}
  openai:
    api-key: ${OPENAI_API_KEY:}
    api-url: ${OPENAI_API_URL:https://api.openai.com/v1/chat/completions}
    model: ${OPENAI_MODEL:gpt-4}
  claude:
    api-key: ${CLAUDE_API_KEY:}
    api-url: ${CLAUDE_API_URL:https://api.anthropic.com/v1/messages}
    model: ${CLAUDE_MODEL:claude-sonnet-4-6}
```

- [ ] **Step 6: Run tests**

Expected: PASS

- [ ] **Step 7: Commit**

```bash
git add backend/src/main/java/com/aitovoice/config/AiConfig.java \
        backend/src/main/java/com/aitovoice/voice/service/AiClient.java \
        backend/src/main/resources/application.yml
git commit -m "fix: add timeout and status code checking to AiClient"
```

---

### Task 5: Configuration Externalization

**Files:**
- Modify: `backend/src/main/resources/application.yml`
- Create: `backend/.env.example`
- Verify: `backend/.gitignore` includes `.env`

- [ ] **Step 1: Update application.yml**

Change hardcoded password to env var:
```yaml
spring:
  datasource:
    password: ${DB_PASSWORD:changeme}
```

- [ ] **Step 2: Create .env.example**

```env
# Database
DB_PASSWORD=your_mysql_password

# JWT
JWT_SECRET=your_jwt_secret_at_least_32_chars

# AI Provider
AI_PROVIDER=openai
OPENAI_API_KEY=sk-...
CLAUDE_API_KEY=sk-ant-...
```

- [ ] **Step 3: Verify .gitignore**

Confirm `.env` is listed. If not, add it.

- [ ] **Step 4: Commit**

```bash
git add backend/src/main/resources/application.yml \
        backend/.env.example \
        backend/.gitignore
git commit -m "fix: externalize database password and sensitive config to env vars"
```

---

### Task 6: Frontend API Response Parsing Fix

**Files:**
- Modify: `frontend/src/pages/Home/HomePage.tsx`
- Modify: `frontend/src/pages/AITeacher/AITeacherPage.tsx`
- Scan: all files with `.data.data` pattern

**Interfaces:**
- Convention: Axios interceptor returns `ApiResponse<T>`, consumers access `res.data` for `T`

- [ ] **Step 1: Search for all `.data.data` occurrences**

```bash
grep -rn "\.data\.data" frontend/src/ --include="*.ts" --include="*.tsx"
```

- [ ] **Step 2: Fix HomePage.tsx**

```typescript
// Before:
setHotSongs(hot.data.data || []);
// After:
setHotSongs(hot.data || []);
```

Fix both `hotSongs` and `newSongs`. Fix `.catch` fallback to match:
```typescript
.catch(() => ({ data: [] } as ApiResponse<Song[]>))
```

- [ ] **Step 3: Fix AITeacherPage.tsx**

Same pattern — `res.data` instead of `res.data.data` for message data.

- [ ] **Step 4: Fix any other occurrences found in Step 1**

- [ ] **Step 5: Verify frontend compiles**

```bash
cd frontend && npm run build
```

Expected: No TypeScript errors

- [ ] **Step 6: Commit**

```bash
git add frontend/src/
git commit -m "fix: correct API response parsing — use res.data not res.data.data"
```

---

### Task 7: Final Verification

- [ ] **Step 1: Run full backend test suite**

```bash
cd backend && mvn test -q
```

Expected: All tests pass

- [ ] **Step 2: Run frontend build**

```bash
cd frontend && npm run build
```

Expected: No errors

- [ ] **Step 3: Verify no hardcoded secrets remain**

```bash
grep -rn "yzh521" backend/src/
grep -rn "localhost:8080" frontend/src/
```

Expected: No matches

- [ ] **Step 4: Final commit if needed**
