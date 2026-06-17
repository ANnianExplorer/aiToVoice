# Phase 0: Architecture Repair Design

> **Goal:** Fix all critical bugs, security vulnerabilities, and code quality issues without changing any business functionality. Every fix preserves existing behavior for correct paths.

**Tech Stack:** Java 17, Spring Boot 3.2.5, Spring Data JPA, Spring Security, MySQL 8.0, React 18, TypeScript 5.4, Vite 5.2, Electron 28, Ant Design 5, Zustand 4.5, Howler.js 2.2

**Approach:** Three-wave progressive fix — Security → Backend Quality → Frontend Quality. Each wave produces a working, verifiable project.

---

## Wave 1: Security & Infrastructure

### 1.1 Path Traversal Fix (FileController)

**Problem:** `subDir` and `filename` path variables concatenated directly. Attacker can use `../` to read arbitrary server files via `GET /api/files/audio/../../etc/passwd`.

**Fix:**
- Create `FilePathSanitizer` utility: resolve path canonically, verify resolved path is under `upload-dir`
- `FileController.getAudio()` and `getCover()` call sanitizer before file access
- Return 400 if path escapes upload directory
- Unit tests: normal path passes, `../` rejected, symlink escape rejected

### 1.2 Password Hash Leak Fix

**Problem:** `AuthController.me()` returns full `User` entity including `passwordHash` in JSON response.

**Fix:**
- Add `@JsonProperty(access = JsonProperty.Access.WRITE_ONLY)` on `User.passwordHash`
- Create `UserDto` record (id, username, email, nickname, avatarUrl, role, status, createdAt)
- `AuthController.me()` returns `ApiResponse<UserDto>`
- `AuthController.register()` and `login()` also return DTOs
- MapStruct mapper handles Entity → DTO conversion

### 1.3 CORS Configuration

**Problem:** No CORS config. Browser blocks cross-origin requests from frontend (port 5173) to backend (port 8080).

**Fix:**
- Add `CorsConfigurationSource` bean in `SecurityConfig`
- Allow origins: `http://localhost:5173`, `http://localhost:8080`
- Allow headers: `Authorization`, `Content-Type`
- Allow methods: `GET, POST, PUT, DELETE, OPTIONS`
- Integrate into SecurityFilterChain: `.cors(cors -> cors.configurationSource(...))`

### 1.4 AiClient Timeout & Error Handling

**Problem:** `HttpClient.newHttpClient()` has no timeout. 4xx/5xx responses from AI providers silently parsed as success.

**Fix:**
- `HttpClient.newBuilder().connectTimeout(Duration.ofSeconds(10)).build()`
- `HttpRequest.timeout(Duration.ofSeconds(60))`
- Check `response.statusCode()`, throw `BusinessException` with status code for non-2xx
- Make `HttpClient` a Spring `@Bean` for testability
- Inject API URLs from `application.yml`, remove hardcoded strings

### 1.5 Configuration Externalization

**Problem:** Database password `yzh521` hardcoded in `application.yml`.

**Fix:**
- Change to `${DB_PASSWORD}` in `application.yml`
- Create `.env.example` listing all required env vars
- Confirm `.env` is in `.gitignore`
- `application-dev.yml` keeps local defaults for development

### 1.6 Frontend API Response Parsing Bug

**Problem:** Axios interceptor returns `response.data` (unwrapping Axios envelope). Consumers access `res.data.data` which is always `undefined` on success — all lists appear empty.

**Fix:**
- Convention: interceptor returns `ApiResponse<T>`, consumers access `res.data` for `T`
- Fix `HomePage`: `hot.data` instead of `hot.data.data`
- Fix `AITeacherPage`: same pattern
- Global search for `.data.data` pattern, fix all occurrences
- Fix `.catch` fallbacks to match correct shape

---

## Wave 2: Backend Code Quality

### 2.1 Race Condition Fix (Counters)

**Problem:** `song.setPlayCount(song.getPlayCount() + 1)` is a lost-update race condition under concurrent requests.

**Fix:**
- `SongRepository`: add `@Modifying @Query("UPDATE Song s SET s.playCount = s.playCount + 1 WHERE s.id = :id")`
- `CommentRepository`: same for `likesCount`
- `UserSongRepository`: same for `playCount`
- Remove get-then-set pattern from all services
- Add concurrent test verifying count correctness

### 2.2 Soft Delete Normalization

**Problem:** `BaseEntity` has `deletedAt` but no `@Where` annotation. Every query must manually filter deleted records — error-prone and some queries don't.

**Fix:**
- Add `@Where(clause = "deleted_at IS NULL")` on each `@Entity` class
- Add `@SQLDelete(sql = "UPDATE <table> SET deleted_at = NOW() WHERE id = ?")` per entity
- Verify all existing repository queries automatically exclude deleted records
- Queries needing deleted data use `@Query(nativeQuery = true)` with explicit WHERE

### 2.3 DTO Normalization

**Problem:** Multiple controllers return JPA entities directly, leaking internal model details.

**Fix:**
- Audit all controllers, ensure none return raw entities
- Create DTOs as Java records: `UserDto`, `UserSettingsDto`, `VoiceRecordDto`, `VoiceExerciseDto`, `CommentDto`, `MessageDto`, `PlaylistDto`
- Extend MapStruct mappers for each entity-DTO pair
- All `ApiResponse<T>` use DTO types for `T`

### 2.4 Transaction Annotation Normalization

**Problem:** Read operations lack `@Transactional(readOnly = true)`, missing JPA flush-skip optimization.

**Fix:**
- All getter/list/search methods: `@Transactional(readOnly = true)`
- Write methods: default `@Transactional`
- `AuthService.login()`: add `@Transactional(readOnly = true)`

### 2.5 Input Validation

**Problem:** Multiple endpoints accept unbounded parameters.

**Fix:**
- `SongController.hot/new`: `@RequestParam @Min(1) @Max(100) int limit`
- `SongController.search`: add `@Valid` on request body
- `Comment.content`: `@Column(length = 2000)` + `@NotBlank`
- `AuthController.register`: password min 8 chars, username 3-20 chars
- Add `@EnableMethodSecurity` on SecurityConfig

### 2.6 Registration Race Condition Fix

**Problem:** `existsByUsername()` then `save()` is not atomic. Duplicate usernames possible under concurrency.

**Fix:**
- Ensure `User.username` and `User.email` have `@Column(unique = true)`
- Wrap `save()` in try-catch for `DataIntegrityViolationException`, translate to `BusinessException(ErrorCode.USER_ALREADY_EXISTS)`

---

## Wave 3: Frontend Code Quality

### 3.1 Performance Fix (60fps State Updates)

**Problem:** `useAudio` updates Zustand store on every `requestAnimationFrame` (~60fps), causing entire component tree to re-render every frame.

**Fix:**
- Progress tracking via `useRef` + `requestAnimationFrame`, local only
- Sync to Zustand store every 500ms (for persistence and cross-component reads)
- `PlayerBar` Slider driven by local ref, sync on `onChangeCommitted`
- Pause auto-sync during drag, resume on release

### 3.2 PlayerBar Layout Fix

**Problem:** Fixed-position PlayerBar (90px) overlaps bottom of Content area.

**Fix:**
- Content area: `paddingBottom: 114px` (90px PlayerBar + 24px spacing)

### 3.3 Dual Token Storage Fix

**Problem:** Token stored in both Zustand persist (`auth-storage`) and standalone `localStorage.setItem('token')`.

**Fix:**
- Remove standalone `localStorage.setItem('token', ...)` / `removeItem('token')`
- `client.ts` interceptor reads from Zustand persist storage key
- Single source of truth for token

### 3.4 Type Safety Fix

**Problem:** `AuthResponse.user` duplicates `User` type with weaker typing. AI types scattered across 3 files.

**Fix:**
- `types/index.ts`: centralize all types — `User`, `Song`, `Playlist`, `AiSession`, `AiMessage`, `VoiceRecord`, `VoiceExercise`
- Remove duplicate definitions from `api/auth.ts`, `api/ai.ts`, `AITeacherPage`
- Add `API_SUCCESS = 0` constant for `ApiResponse.code`

### 3.5 Authentication Guards

**Problem:** No route protection. Unauthenticated users can access all pages.

**Fix:**
- Create `components/Auth/ProtectedRoute.tsx`: checks `authStore.isAuthenticated`, redirects to `/login`
- Wrap `/studio`, `/ai-teacher`, `/settings`, `/profile` routes
- `LoginPage`/`RegisterPage`: redirect authenticated users to home

### 3.6 URL Externalization

**Problem:** `client.ts` and `useAudio.ts` hardcode `http://localhost:8080`.

**Fix:**
- `.env.development`: `VITE_API_BASE_URL=http://localhost:8080/api`
- `.env.production`: `VITE_API_BASE_URL=/api`
- `client.ts`: `baseURL: import.meta.env.VITE_API_BASE_URL`
- `useAudio.ts`: build audio URL from env var

---

## Constraints

- **No behavior changes:** Every fix preserves existing correct behavior. Only broken paths are fixed.
- **No new features:** This wave adds zero user-facing functionality.
- **Backward compatible:** All existing API endpoints keep their paths and contracts (except removing leaked fields).
- **Each wave independently verifiable:** After each wave, the project compiles and runs correctly.
