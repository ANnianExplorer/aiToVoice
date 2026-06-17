# Wave 3: Frontend Code Quality Fix Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Fix frontend performance issues, layout bugs, type safety, auth guards, and configuration.

**Architecture:** Targeted fixes to existing React components, hooks, stores, and config. No new pages or features.

**Tech Stack:** React 18, TypeScript 5.4, Zustand 4.5, Ant Design 5, Howler.js 2.2, Vite 5.2

## Global Constraints

- Wave 1 and Wave 2 must be complete before starting Wave 3
- No behavior changes — only quality improvements
- No new pages or features
- TypeScript strict mode compliance
- All changes verified by build

---

### Task 1: Performance Fix — 60fps State Updates in useAudio

**Files:**
- Modify: `frontend/src/hooks/useAudio.ts`
- Modify: `frontend/src/components/Player/PlayerBar.tsx`
- Modify: `frontend/src/stores/playerStore.ts`

**Interfaces:**
- `playerStore.progress` updated at most 2x/sec (for cross-component sync)
- `PlayerBar` Slider uses local ref for smooth animation, syncs on seek complete

- [ ] **Step 1: Refactor useAudio progress tracking**

```typescript
// useAudio.ts — progress tracked via ref, synced to store periodically
const progressRef = useRef(0);
const syncIntervalRef = useRef<number>();

// In the rAF loop:
const updateProgress = () => {
  if (howlRef.current && isPlaying) {
    progressRef.current = howlRef.current.seek() as number;
    // Update local ref only — no store update
    rafRef.current = requestAnimationFrame(updateProgress);
  }
};

// Sync to store every 500ms:
useEffect(() => {
  if (isPlaying) {
    syncIntervalRef.current = window.setInterval(() => {
      setProgress(progressRef.current);
    }, 500);
  }
  return () => clearInterval(syncIntervalRef.current);
}, [isPlaying, setProgress]);
```

- [ ] **Step 2: Update PlayerBar to use local progress for Slider**

```typescript
// PlayerBar.tsx
const localProgressRef = useRef(0);
const [sliderValue, setSliderValue] = useState(0);
const [isDragging, setIsDragging] = useState(false);

// Update local value from rAF (not from store)
useEffect(() => {
  const interval = setInterval(() => {
    if (!isDragging && audioProgressRef.current !== undefined) {
      setSliderValue(audioProgressRef.current);
    }
  }, 50); // 20fps for UI — smooth enough for a slider
  return () => clearInterval(interval);
}, [isDragging]);

// Slider:
<Slider
  value={sliderValue}
  onChange={(v) => { setIsDragging(true); setSliderValue(v as number); }}
  onChangeCommitted={(v) => {
    setIsDragging(false);
    seek(v as number);
    setProgress(v as number);
  }}
/>
```

- [ ] **Step 3: Verify no 60fps store updates**

Add a `console.log` in `setProgress`, verify it fires ~2x/sec not 60x/sec. Remove log after verification.

- [ ] **Step 4: Build verification**

```bash
cd frontend && npm run build
```

Expected: No errors

- [ ] **Step 5: Commit**

```bash
git add frontend/src/hooks/useAudio.ts frontend/src/components/Player/PlayerBar.tsx
git commit -m "fix: eliminate 60fps Zustand updates — track progress locally, sync periodically"
```

---

### Task 2: PlayerBar Layout Fix

**Files:**
- Modify: `frontend/src/components/Layout/AppLayout.tsx`

- [ ] **Step 1: Add bottom padding to Content**

```tsx
<Content style={{
  padding: 24,
  paddingBottom: 114, // 90px PlayerBar + 24px spacing
  minHeight: '100vh',
  background: '#121212',
}}>
```

- [ ] **Step 2: Verify visually**

Scroll to bottom of any page — content should not be hidden behind PlayerBar.

- [ ] **Step 3: Commit**

```bash
git add frontend/src/components/Layout/AppLayout.tsx
git commit -m "fix: add bottom padding to Content to prevent PlayerBar overlap"
```

---

### Task 3: Dual Token Storage Fix

**Files:**
- Modify: `frontend/src/stores/authStore.ts`
- Modify: `frontend/src/api/client.ts`

- [ ] **Step 1: Remove standalone localStorage token management from authStore**

```typescript
// Remove these lines from authStore:
// localStorage.setItem('token', response.token);
// localStorage.removeItem('token');

// The persist middleware already stores the token under 'auth-storage'
```

- [ ] **Step 2: Update client.ts to read token from Zustand persist storage**

```typescript
// client.ts request interceptor:
client.interceptors.request.use((config) => {
  // Read from Zustand persist storage
  const stored = localStorage.getItem('auth-storage');
  if (stored) {
    try {
      const { state } = JSON.parse(stored);
      if (state?.token) {
        config.headers.Authorization = `Bearer ${state.token}`;
      }
    } catch {
      // invalid JSON, ignore
    }
  }
  return config;
});
```

- [ ] **Step 3: Verify login/logout still works**

- [ ] **Step 4: Commit**

```bash
git add frontend/src/stores/authStore.ts frontend/src/api/client.ts
git commit -m "fix: unify token storage — single source of truth via Zustand persist"
```

---

### Task 4: Type Safety Fix

**Files:**
- Modify: `frontend/src/types/index.ts`
- Modify: `frontend/src/api/auth.ts`
- Modify: `frontend/src/api/ai.ts`
- Modify: `frontend/src/pages/AITeacher/AITeacherPage.tsx`

- [ ] **Step 1: Add missing types to types/index.ts**

```typescript
export interface AiSession {
  id: number;
  userId: number;
  sessionType: 'VOICE_COACH' | 'GENERAL';
  title: string;
  createdAt: string;
}

export interface AiMessage {
  id: number;
  sessionId: number;
  role: 'USER' | 'ASSISTANT';
  content: string;
  createdAt: string;
}

export interface VoiceRecord {
  id: number;
  userId: number;
  exerciseId: number;
  filePath: string;
  score: number;
  status: string;
  createdAt: string;
}

export interface VoiceExercise {
  id: number;
  name: string;
  type: string;
  difficulty: number;
  description: string;
}

export const API_SUCCESS = 0;
```

- [ ] **Step 2: Remove duplicate type definitions**

- Remove `AuthResponse.user` inline type in `api/auth.ts`, import `User` from `types/index.ts`
- Remove local `AiMsg` type in `AITeacherPage.tsx`, import `AiMessage` from `types/index.ts`
- Remove local types in `api/ai.ts`, import from `types/index.ts`

- [ ] **Step 3: Update all references**

- [ ] **Step 4: Build verification**

```bash
cd frontend && npm run build
```

Expected: No TypeScript errors

- [ ] **Step 5: Commit**

```bash
git add frontend/src/types/ frontend/src/api/ frontend/src/pages/
git commit -m "refactor: centralize type definitions, remove duplicates"
```

---

### Task 5: Authentication Guards

**Files:**
- Create: `frontend/src/components/Auth/ProtectedRoute.tsx`
- Modify: `frontend/src/App.tsx` (or router config)

- [ ] **Step 1: Create ProtectedRoute component**

```tsx
import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore';

export const ProtectedRoute = () => {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return <Outlet />;
};
```

- [ ] **Step 2: Wrap protected routes**

```tsx
// In App.tsx or router config:
<Route element={<ProtectedRoute />}>
  <Route path="/studio" element={<StudioPage />} />
  <Route path="/ai-teacher" element={<AITeacherPage />} />
  <Route path="/settings" element={<SettingsPage />} />
  <Route path="/profile" element={<ProfilePage />} />
</Route>
```

- [ ] **Step 3: Add redirect for authenticated users on login/register**

```tsx
// LoginPage.tsx:
const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
if (isAuthenticated) return <Navigate to="/" replace />;
```

- [ ] **Step 4: Build verification**

```bash
cd frontend && npm run build
```

- [ ] **Step 5: Commit**

```bash
git add frontend/src/components/Auth/ProtectedRoute.tsx frontend/src/App.tsx frontend/src/pages/Auth/
git commit -m "feat: add route guards for authenticated pages"
```

---

### Task 6: URL Externalization

**Files:**
- Create: `frontend/.env.development`
- Create: `frontend/.env.production`
- Modify: `frontend/src/api/client.ts`
- Modify: `frontend/src/hooks/useAudio.ts`

- [ ] **Step 1: Create .env files**

```env
# .env.development
VITE_API_BASE_URL=http://localhost:8080/api
VITE_FILE_BASE_URL=http://localhost:8080

# .env.production
VITE_API_BASE_URL=/api
VITE_FILE_BASE_URL=
```

- [ ] **Step 2: Update client.ts**

```typescript
const client = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 15000,
});
```

- [ ] **Step 3: Update useAudio.ts**

```typescript
const baseUrl = import.meta.env.VITE_FILE_BASE_URL || '';
const audioUrl = `${baseUrl}/api/files/audio/${currentSong.id}`;
```

- [ ] **Step 4: Add .env files to .gitignore if not already**

- [ ] **Step 5: Build verification**

```bash
cd frontend && npm run build
```

- [ ] **Step 6: Commit**

```bash
git add frontend/.env.development frontend/.env.production frontend/src/api/client.ts frontend/src/hooks/useAudio.ts
git commit -m "fix: externalize API URLs to environment variables"
```

---

### Task 7: Final Verification

- [ ] **Step 1: Full frontend build**

```bash
cd frontend && npm run build
```

Expected: No errors

- [ ] **Step 2: Full backend test suite**

```bash
cd backend && mvn test -q
```

Expected: All tests pass

- [ ] **Step 3: Verify no hardcoded URLs remain in frontend source**

```bash
grep -rn "localhost:8080" frontend/src/
```

Expected: No matches (only in .env files)

- [ ] **Step 4: End-to-end smoke test**

Start backend and frontend, verify:
- Login works
- Home page shows songs (not empty)
- Player bar doesn't overlap content
- AI teacher page shows messages
- Protected routes redirect to login when not authenticated
