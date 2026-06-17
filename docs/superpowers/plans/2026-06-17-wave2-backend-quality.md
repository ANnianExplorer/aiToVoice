# Wave 2: Backend Code Quality Fix Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Fix all backend code quality issues — race conditions, soft delete, DTO normalization, transactions, input validation.

**Architecture:** Targeted fixes to existing service/repository/controller layers. No new modules or features.

**Tech Stack:** Java 17, Spring Boot 3.2.5, Spring Data JPA, MapStruct, JUnit 5

## Global Constraints

- Wave 1 must be complete before starting Wave 2
- No behavior changes — only code quality improvements
- All existing API endpoints keep their paths and contracts
- Java 17 syntax (records, text blocks where appropriate)
- All changes have unit tests

---

### Task 1: Race Condition Fix — Atomic Counters

**Files:**
- Modify: `backend/src/main/java/com/aitovoice/music/repository/SongRepository.java`
- Modify: `backend/src/main/java/com/aitovoice/music/service/SongService.java`
- Modify: `backend/src/main/java/com/aitovoice/social/repository/CommentRepository.java`
- Modify: `backend/src/main/java/com/aitovoice/social/service/CommentService.java`

- [ ] **Step 1: Write failing test for concurrent play count**

```java
@Test
void recordPlay_concurrentUpdates_allCounted() throws Exception {
    Long songId = createTestSong();
    int threads = 10;
    CountDownLatch latch = new CountDownLatch(threads);
    ExecutorService executor = Executors.newFixedThreadPool(threads);

    for (int i = 0; i < threads; i++) {
        executor.submit(() -> {
            try { songService.recordPlay(songId, 1L); }
            finally { latch.countDown(); }
        });
    }
    latch.await(10, TimeUnit.SECONDS);
    executor.shutdown();

    Song song = songRepository.findById(songId).orElseThrow();
    assertEquals(threads, song.getPlayCount());
}
```

- [ ] **Step 2: Run test to verify it fails**

Expected: `playCount` < 10 due to lost updates

- [ ] **Step 3: Add atomic increment query to SongRepository**

```java
@Modifying
@Query("UPDATE Song s SET s.playCount = s.playCount + 1 WHERE s.id = :id")
int incrementPlayCount(@Param("id") Long id);
```

- [ ] **Step 4: Update SongService.recordPlay() to use atomic increment**

Replace `song.setPlayCount(song.getPlayCount() + 1)` with `songRepository.incrementPlayCount(songId)`

- [ ] **Step 5: Run test to verify it passes**

Expected: PASS — playCount == 10

- [ ] **Step 6: Apply same pattern to Comment.likesCount and UserSong.playCount**

- [ ] **Step 7: Commit**

```bash
git commit -m "fix: use atomic SQL increments for playCount and likesCount"
```

---

### Task 2: Soft Delete Normalization

**Files:**
- Modify: `backend/src/main/java/com/aitovoice/common/BaseEntity.java`
- Modify: All `@Entity` classes (User, Song, Comment, etc.)

- [ ] **Step 1: Write test for soft delete filtering**

```java
@Test
void findById_excludesDeletedRecords() {
    Song song = createTestSong();
    song.softDelete();
    songRepository.save(song);

    Optional<Song> found = songRepository.findById(song.getId());
    assertTrue(found.isEmpty());
}
```

- [ ] **Step 2: Run test to verify it fails**

Expected: found is present (not filtered)

- [ ] **Step 3: Add @Where and @SQLDelete to each entity**

On `Song.java`:
```java
@Where(clause = "deleted_at IS NULL")
@SQLDelete(sql = "UPDATE songs SET deleted_at = NOW() WHERE id = ?")
```

Repeat for: `User`, `Comment`, `Message`, `Playlist`, `VoiceRecord`, `VoiceExercise`, `UserSong`, `Artist`, `Album`, `Genre`, `Lyrics`, `Tag`, `UserFollow`, `UserPracticeProgress`, `AiSession`, `AiMessage`, `Recommendation`, `Ranking`

- [ ] **Step 4: Run test to verify it passes**

Expected: PASS — deleted records not returned

- [ ] **Step 5: Verify existing tests still pass**

```bash
cd backend && mvn test -q
```

- [ ] **Step 6: Commit**

```bash
git commit -m "fix: add @Where and @SQLDelete for automatic soft delete filtering"
```

---

### Task 3: DTO Normalization

**Files:**
- Create: DTOs as Java records in each module's `dto` package
- Update: MapStruct mappers
- Modify: Controllers to return DTOs

- [ ] **Step 1: Create DTOs**

```java
// user/dto/UserSettingsDto.java
public record UserSettingsDto(Long id, String theme, String language, ...) {}

// voice/dto/VoiceRecordDto.java
public record VoiceRecordDto(Long id, Long userId, Double score, String status, ...) {}

// voice/dto/VoiceExerciseDto.java
public record VoiceExerciseDto(Long id, String name, String type, Integer difficulty, ...) {}

// social/dto/CommentDto.java
public record CommentDto(Long id, Long userId, String content, Long parentId, ...) {}

// social/dto/MessageDto.java
public record MessageDto(Long id, Long senderId, Long receiverId, String content, ...) {}

// music/dto/PlaylistDto.java
public record PlaylistDto(Long id, String name, String description, Integer songCount, ...) {}
```

- [ ] **Step 2: Create/update MapStruct mappers for each DTO**

- [ ] **Step 3: Update controllers to return DTOs**

- [ ] **Step 4: Verify all tests pass**

- [ ] **Step 5: Commit**

```bash
git commit -m "refactor: add DTOs for all controller return types"
```

---

### Task 4: Transaction Annotation Normalization

**Files:**
- Modify: All service classes

- [ ] **Step 1: Audit services for read-only methods**

Search for methods named `get*`, `list*`, `search*`, `find*`, `count*`

- [ ] **Step 2: Add @Transactional(readOnly = true) to all read methods**

- [ ] **Step 3: Add @Transactional(readOnly = true) to AuthService.login()**

- [ ] **Step 4: Verify tests pass**

- [ ] **Step 5: Commit**

```bash
git commit -m "refactor: add @Transactional(readOnly=true) to read-only service methods"
```

---

### Task 5: Input Validation

**Files:**
- Modify: Controllers and entity classes

- [ ] **Step 1: Add validation to SongController**

```java
@GetMapping("/hot")
public ApiResponse<List<SongDto>> getHotSongs(
    @RequestParam(defaultValue = "20") @Min(1) @Max(100) int limit) { ... }

@PostMapping("/search")
public ApiResponse<Page<SongDto>> search(@Valid @RequestBody SongSearchRequest request) { ... }
```

- [ ] **Step 2: Add validation to Comment entity**

```java
@Column(name = "content", length = 2000, nullable = false)
@NotBlank
private String content;
```

- [ ] **Step 3: Add password validation to AuthService.register()**

```java
if (request.password().length() < 8) {
    throw new BusinessException(ErrorCode.INVALID_PASSWORD, "Password must be at least 8 characters");
}
```

- [ ] **Step 4: Add @EnableMethodSecurity to SecurityConfig**

```java
@Configuration
@EnableMethodSecurity
public class SecurityConfig { ... }
```

- [ ] **Step 5: Verify tests pass**

- [ ] **Step 6: Commit**

```bash
git commit -m "feat: add input validation to controllers and entities"
```

---

### Task 6: Registration Race Condition Fix

**Files:**
- Modify: `backend/src/main/java/com/aitovoice/auth/service/AuthService.java`

- [ ] **Step 1: Write concurrent registration test**

```java
@Test
void concurrentDuplicateRegistration_onlyOneSucceeds() throws Exception {
    CountDownLatch latch = new CountDownLatch(2);
    AtomicReference<Exception> ex1 = new AtomicReference<>();
    AtomicReference<Exception> ex2 = new AtomicReference<>();

    Thread t1 = new Thread(() -> {
        try { authService.register(new RegisterRequest("sameuser", "a@b.com", "pass1234")); }
        catch (Exception e) { ex1.set(e); }
        finally { latch.countDown(); }
    });
    Thread t2 = new Thread(() -> {
        try { authService.register(new RegisterRequest("sameuser", "a@b.com", "pass1234")); }
        catch (Exception e) { ex2.set(e); }
        finally { latch.countDown(); }
    });

    t1.start(); t2.start();
    latch.await(5, TimeUnit.SECONDS);

    // One should succeed, one should throw BusinessException
    assertTrue((ex1.get() == null) != (ex2.get() == null));
}
```

- [ ] **Step 2: Run test to verify it fails**

Expected: One thread gets 500 (DataIntegrityViolationException unhandled)

- [ ] **Step 3: Add try-catch in AuthService.register()**

```java
try {
    userRepository.save(user);
} catch (DataIntegrityViolationException e) {
    throw new BusinessException(ErrorCode.USER_ALREADY_EXISTS, "Username or email already taken");
}
```

- [ ] **Step 4: Run test to verify it passes**

Expected: PASS — one succeeds, one gets proper BusinessException

- [ ] **Step 5: Commit**

```bash
git commit -m "fix: handle registration race condition with DB unique constraint"
```
