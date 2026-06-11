# AiToVoice 实施计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 构建一个仿 Spotify 风格的桌面音乐播放器，集成 AI 声乐教练功能。

**Architecture:** 单体 SpringBoot 后端 + 单体 Electron 前端，REST API + WebSocket 通信。后端使用 Java 17 现代语法（switch 表达式、Stream API、Records、sealed classes）。

**Tech Stack:** Java 17, Spring Boot 3.2, MySQL 8.0, Electron 28, React 18, TypeScript, Ant Design 5, Zustand, Howler.js

---

## Phase 1: 项目基础搭建

### Task 1.1: 初始化 Git 仓库

- [ ] **Step 1: 初始化 Git**

```bash
cd E:/cc/aiToVoice
git init
```

- [ ] **Step 2: 创建 .gitignore**

```gitignore
# Java
backend/target/
backend/.mvn/
*.class
*.jar
*.war
*.log

# Node
frontend/node_modules/
frontend/dist/
frontend/release/

# IDE
.idea/
*.iml
.vscode/
.settings/
.classpath
.project

# OS
.DS_Store
Thumbs.db

# Env
.env
.env.local

# Uploads
backend/uploads/*
!backend/uploads/.gitkeep

# Coverage
backend/coverage/
frontend/coverage/
```

- [ ] **Step 3: 创建 uploads 目录并保留 gitkeep**

```bash
mkdir -p backend/uploads/{audio,covers,avatars,voice-records}
touch backend/uploads/audio/.gitkeep
touch backend/uploads/covers/.gitkeep
touch backend/uploads/avatars/.gitkeep
touch backend/uploads/voice-records/.gitkeep
```

- [ ] **Step 4: 首次提交**

```bash
git add .
git commit -m "chore: init project with gitignore and upload directories"
```

---

### Task 1.2: 初始化 Spring Boot 后端

- [ ] **Step 1: 创建 pom.xml**

**File:** `backend/pom.xml`

```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 https://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>

    <parent>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-parent</artifactId>
        <version>3.2.5</version>
        <relativePath/>
    </parent>

    <groupId>com.aitovoice</groupId>
    <artifactId>aitovoice-backend</artifactId>
    <version>0.0.1-SNAPSHOT</version>
    <name>AiToVoice</name>
    <description>Desktop Music Player with AI Voice Coach</description>

    <properties>
        <java.version>17</java.version>
        <jjwt.version>0.12.5</jjwt.version>
        <tarsos.version>2.5</tarsos.version>
    </properties>

    <dependencies>
        <!-- Spring Boot -->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-web</artifactId>
        </dependency>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-data-jpa</artifactId>
        </dependency>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-security</artifactId>
        </dependency>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-validation</artifactId>
        </dependency>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-websocket</artifactId>
        </dependency>

        <!-- MySQL -->
        <dependency>
            <groupId>com.mysql</groupId>
            <artifactId>mysql-connector-j</artifactId>
            <scope>runtime</scope>
        </dependency>

        <!-- JWT -->
        <dependency>
            <groupId>io.jsonwebtoken</groupId>
            <artifactId>jjwt-api</artifactId>
            <version>${jjwt.version}</version>
        </dependency>
        <dependency>
            <groupId>io.jsonwebtoken</groupId>
            <artifactId>jjwt-impl</artifactId>
            <version>${jjwt.version}</version>
            <scope>runtime</scope>
        </dependency>
        <dependency>
            <groupId>io.jsonwebtoken</groupId>
            <artifactId>jjwt-jackson</artifactId>
            <version>${jjwt.version}</version>
            <scope>runtime</scope>
        </dependency>

        <!-- Audio Analysis -->
        <dependency>
            <groupId>be.tarsos.dsp</groupId>
            <artifactId>core</artifactId>
            <version>${tarsos.version}</version>
        </dependency>

        <!-- Lombok -->
        <dependency>
            <groupId>org.projectlombok</groupId>
            <artifactId>lombok</artifactId>
            <optional>true</optional>
        </dependency>

        <!-- MapStruct -->
        <dependency>
            <groupId>org.mapstruct</groupId>
            <artifactId>mapstruct</artifactId>
            <version>1.5.5.Final</version>
        </dependency>
        <dependency>
            <groupId>org.mapstruct</groupId>
            <artifactId>mapstruct-processor</artifactId>
            <version>1.5.5.Final</version>
            <scope>provided</scope>
        </dependency>

        <!-- Test -->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-test</artifactId>
            <scope>test</scope>
        </dependency>
        <dependency>
            <groupId>org.springframework.security</groupId>
            <artifactId>spring-security-test</artifactId>
            <scope>test</scope>
        </dependency>
    </dependencies>

    <build>
        <plugins>
            <plugin>
                <groupId>org.springframework.boot</groupId>
                <artifactId>spring-boot-maven-plugin</artifactId>
                <configuration>
                    <excludes>
                        <exclude>
                            <groupId>org.projectlombok</groupId>
                            <artifactId>lombok</artifactId>
                        </exclude>
                    </excludes>
                </configuration>
            </plugin>
            <plugin>
                <groupId>org.apache.maven.plugins</groupId>
                <artifactId>maven-compiler-plugin</artifactId>
                <configuration>
                    <source>17</source>
                    <target>17</target>
                    <annotationProcessorPaths>
                        <path>
                            <groupId>org.projectlombok</groupId>
                            <artifactId>lombok</artifactId>
                            <version>${lombok.version}</version>
                        </path>
                        <path>
                            <groupId>org.mapstruct</groupId>
                            <artifactId>mapstruct-processor</artifactId>
                            <version>1.5.5.Final</version>
                        </path>
                    </annotationProcessorPaths>
                </configuration>
            </plugin>
        </plugins>
    </build>
</project>
```

- [ ] **Step 2: 创建 Spring Boot 主类**

**File:** `backend/src/main/java/com/aitovoice/AitoVoiceApplication.java`

```java
package com.aitovoice;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

@SpringBootApplication
@EnableJpaAuditing
public class AitoVoiceApplication {

    public static void main(String[] args) {
        SpringApplication.run(AitoVoiceApplication.class, args);
    }
}
```

- [ ] **Step 3: 创建 application.yml**

**File:** `backend/src/main/resources/application.yml`

```yaml
server:
  port: 8080
  servlet:
    context-path: /

spring:
  datasource:
    url: jdbc:mysql://localhost:3306/aitovoice?useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=Asia/Shanghai&characterEncoding=utf8mb4
    username: root
    password: ${DB_PASSWORD:root}
    driver-class-name: com.mysql.cj.jdbc.Driver

  jpa:
    hibernate:
      ddl-auto: update
    show-sql: false
    open-in-view: false
    properties:
      hibernate:
        dialect: org.hibernate.dialect.MySQLDialect
        format_sql: true

  servlet:
    multipart:
      max-file-size: 50MB
      max-request-size: 50MB

  jackson:
    date-format: yyyy-MM-dd HH:mm:ss
    time-zone: Asia/Shanghai
    default-property-inclusion: non_null

# JWT
jwt:
  secret: ${JWT_SECRET:myDefaultSecretKeyThatShouldBeChangedInProduction2026}
  expiration: 86400000   # 24 hours
  refresh-expiration: 604800000  # 7 days

# File Storage
file:
  upload-dir: ./uploads
  max-size: 52428800  # 50MB

# AI
ai:
  provider: ${AI_PROVIDER:openai}
  openai:
    api-key: ${OPENAI_API_KEY:}
    model: gpt-4
  claude:
    api-key: ${CLAUDE_API_KEY:}
    model: claude-sonnet-4-6

logging:
  level:
    com.aitovoice: DEBUG
    org.springframework.security: DEBUG
```

- [ ] **Step 4: 创建 application-dev.yml**

**File:** `backend/src/main/resources/application-dev.yml`

```yaml
spring:
  datasource:
    url: jdbc:mysql://localhost:3306/aitovoice_dev?useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=Asia/Shanghai&characterEncoding=utf8mb4
  jpa:
    show-sql: true

logging:
  level:
    com.aitovoice: DEBUG
```

- [ ] **Step 5: 提交**

```bash
git add backend/
git commit -m "feat: init Spring Boot backend with pom.xml and application config"
```

---

### Task 1.3: 后端通用模块（BaseEntity + ApiResponse + 异常处理）

- [ ] **Step 1: 创建 BaseEntity**

**File:** `backend/src/main/java/com/aitovoice/common/BaseEntity.java`

```java
package com.aitovoice.common;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;

@Getter
@Setter
@MappedSuperclass
@EntityListeners(AuditingEntityListener.class)
public abstract class BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @CreatedDate
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @LastModifiedDate
    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    @Column(name = "deleted_at")
    private LocalDateTime deletedAt;

    public void softDelete() {
        this.deletedAt = LocalDateTime.now();
    }

    public boolean isDeleted() {
        return this.deletedAt != null;
    }
}
```

- [ ] **Step 2: 创建 ApiResponse**

**File:** `backend/src/main/java/com/aitovoice/common/ApiResponse.java`

```java
package com.aitovoice.common;

import com.fasterxml.jackson.annotation.JsonInclude;

import java.time.LocalDateTime;

@JsonInclude(JsonInclude.Include.NON_NULL)
public record ApiResponse<T>(
        int code,
        String message,
        T data,
        LocalDateTime timestamp
) {
    public static <T> ApiResponse<T> success(T data) {
        return new ApiResponse<>(200, "success", data, LocalDateTime.now());
    }

    public static <T> ApiResponse<T> success(String message, T data) {
        return new ApiResponse<>(200, message, data, LocalDateTime.now());
    }

    public static <T> ApiResponse<T> error(int code, String message) {
        return new ApiResponse<>(code, message, null, LocalDateTime.now());
    }

    public static <T> ApiResponse<T> error(int code, String message, T errors) {
        return new ApiResponse<>(code, message, errors, LocalDateTime.now());
    }
}
```

- [ ] **Step 3: 创建 PageResponse**

**File:** `backend/src/main/java/com/aitovoice/common/PageResponse.java`

```java
package com.aitovoice.common;

import java.util.List;

public record PageResponse<T>(
        List<T> content,
        long totalElements,
        int totalPages,
        int currentPage,
        int pageSize
) {}
```

- [ ] **Step 4: 创建 ErrorCode 枚举**

**File:** `backend/src/main/java/com/aitovoice/common/ErrorCode.java`

```java
package com.aitovoice.common;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum ErrorCode {
    // Auth
    AUTH_INVALID_CREDENTIALS(401, "用户名或密码错误"),
    AUTH_TOKEN_EXPIRED(401, "Token 已过期"),
    AUTH_TOKEN_INVALID(401, "Token 无效"),
    AUTH_UNAUTHORIZED(401, "未授权"),

    // User
    USER_NOT_FOUND(404, "用户不存在"),
    USER_ALREADY_EXISTS(409, "用户已存在"),
    USER_EMAIL_EXISTS(409, "邮箱已被注册"),

    // Music
    SONG_NOT_FOUND(404, "歌曲不存在"),
    ALBUM_NOT_FOUND(404, "专辑不存在"),
    ARTIST_NOT_FOUND(404, "歌手不存在"),
    GENRE_NOT_FOUND(404, "流派不存在"),
    FILE_UPLOAD_FAILED(500, "文件上传失败"),
    FILE_NOT_FOUND(404, "文件不存在"),
    UNSUPPORTED_AUDIO_FORMAT(400, "不支持的音频格式"),

    // Playlist
    PLAYLIST_NOT_FOUND(404, "歌单不存在"),
    PLAYLIST_ACCESS_DENIED(403, "无权访问该歌单"),
    SONG_ALREADY_IN_PLAYLIST(409, "歌曲已在歌单中"),

    // Social
    COMMENT_NOT_FOUND(404, "评论不存在"),
    CANNOT_FOLLOW_SELF(400, "不能关注自己"),
    ALREADY_FOLLOWING(409, "已经关注该用户"),

    // Voice
    VOICE_RECORD_NOT_FOUND(404, "录音记录不存在"),
    EXERCISE_NOT_FOUND(404, "练习任务不存在"),
    AUDIO_ANALYSIS_FAILED(500, "音频分析失败"),

    // AI
    AI_SESSION_NOT_FOUND(404, "AI 会话不存在"),
    AI_SERVICE_ERROR(502, "AI 服务异常"),

    // General
    VALIDATION_ERROR(400, "参数校验失败"),
    INTERNAL_ERROR(500, "服务器内部错误"),
    RATE_LIMITED(429, "请求过于频繁");

    private final int code;
    private final String message;
}
```

- [ ] **Step 5: 创建 BusinessException**

**File:** `backend/src/main/java/com/aitovoice/common/BusinessException.java`

```java
package com.aitovoice.common;

import lombok.Getter;

@Getter
public class BusinessException extends RuntimeException {

    private final ErrorCode errorCode;

    public BusinessException(ErrorCode errorCode) {
        super(errorCode.getMessage());
        this.errorCode = errorCode;
    }

    public BusinessException(ErrorCode errorCode, String message) {
        super(message);
        this.errorCode = errorCode;
    }
}
```

- [ ] **Step 6: 创建 GlobalExceptionHandler**

**File:** `backend/src/main/java/com/aitovoice/common/GlobalExceptionHandler.java`

```java
package com.aitovoice.common;

import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.List;

@Slf4j
@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(BusinessException.class)
    public ResponseEntity<ApiResponse<Void>> handleBusiness(BusinessException ex) {
        log.warn("Business exception: {}", ex.getMessage());
        return ResponseEntity
                .status(ex.getErrorCode().getCode())
                .body(ApiResponse.error(ex.getErrorCode().getCode(), ex.getMessage()));
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ApiResponse<List<ValidationError>>> handleValidation(
            MethodArgumentNotValidException ex) {
        var errors = ex.getBindingResult().getFieldErrors().stream()
                .map(e -> new ValidationError(e.getField(), e.getDefaultMessage()))
                .toList();
        return ResponseEntity
                .status(HttpStatus.BAD_REQUEST)
                .body(ApiResponse.error(400, "参数校验失败", errors));
    }

    @ExceptionHandler(BadCredentialsException.class)
    public ResponseEntity<ApiResponse<Void>> handleBadCredentials(BadCredentialsException ex) {
        return ResponseEntity
                .status(HttpStatus.UNAUTHORIZED)
                .body(ApiResponse.error(401, "用户名或密码错误"));
    }

    @ExceptionHandler(AccessDeniedException.class)
    public ResponseEntity<ApiResponse<Void>> handleAccessDenied(AccessDeniedException ex) {
        return ResponseEntity
                .status(HttpStatus.FORBIDDEN)
                .body(ApiResponse.error(403, "无权访问"));
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiResponse<Void>> handleGeneric(Exception ex) {
        log.error("Unexpected error", ex);
        return ResponseEntity
                .status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(ApiResponse.error(500, "服务器内部错误"));
    }

    public record ValidationError(String field, String message) {}
}
```

- [ ] **Step 7: 创建 Constants**

**File:** `backend/src/main/java/com/aitovoice/common/Constants.java`

```java
package com.aitovoice.common;

public final class Constants {

    private Constants() {}

    public static final String AUTH_HEADER = "Authorization";
    public static final String AUTH_PREFIX = "Bearer ";
    public static final long MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB

    public static final String[] ALLOWED_AUDIO_EXTENSIONS = {
            ".mp3", ".flac", ".wav", ".aac", ".ogg", ".m4a", ".wma"
    };

    public static final String[] ALLOWED_IMAGE_EXTENSIONS = {
            ".jpg", ".jpeg", ".png", ".webp", ".gif"
    };
}
```

- [ ] **Step 8: 提交**

```bash
git add backend/src/main/java/com/aitovoice/common/
git commit -m "feat: add common module - BaseEntity, ApiResponse, exceptions, constants"
```

---

### Task 1.4: 初始化 Electron + React 前端

- [ ] **Step 1: 创建 package.json**

**File:** `frontend/package.json`

```json
{
  "name": "aitovoice-frontend",
  "version": "0.1.0",
  "private": true,
  "main": "dist-electron/main.js",
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build && electron-builder",
    "preview": "vite preview",
    "typecheck": "tsc --noEmit",
    "lint": "eslint src/ --ext .ts,.tsx",
    "electron:dev": "vite --config vite.config.ts"
  },
  "dependencies": {
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "react-router-dom": "^6.23.0",
    "antd": "^5.17.0",
    "@ant-design/icons": "^5.3.0",
    "zustand": "^4.5.2",
    "axios": "^1.7.0",
    "howler": "^2.2.4",
    "wavesurfer.js": "^7.7.0",
    "lrc-parser": "^1.0.1",
    "dayjs": "^1.11.10"
  },
  "devDependencies": {
    "@types/react": "^18.3.0",
    "@types/react-dom": "^18.3.0",
    "@types/howler": "^2.2.11",
    "@vitejs/plugin-react": "^4.3.0",
    "typescript": "^5.4.0",
    "vite": "^5.2.0",
    "electron": "^28.3.0",
    "electron-builder": "^24.13.0",
    "vite-plugin-electron": "^0.28.0",
    "vite-plugin-electron-renderer": "^0.14.0",
    "eslint": "^8.57.0",
    "@typescript-eslint/eslint-plugin": "^7.0.0",
    "@typescript-eslint/parser": "^7.0.0",
    "prettier": "^3.2.0"
  }
}
```

- [ ] **Step 2: 创建 tsconfig.json**

**File:** `frontend/tsconfig.json`

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"]
    }
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
```

**File:** `frontend/tsconfig.node.json`

```json
{
  "compilerOptions": {
    "composite": true,
    "skipLibCheck": true,
    "module": "ESNext",
    "moduleResolution": "bundler",
    "allowSyntheticDefaultImports": true
  },
  "include": ["vite.config.ts", "electron/**/*.ts"]
}
```

- [ ] **Step 3: 创建 vite.config.ts**

**File:** `frontend/vite.config.ts`

```typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import electron from 'vite-plugin-electron';
import electronRenderer from 'vite-plugin-electron-renderer';
import path from 'path';

export default defineConfig({
  plugins: [
    react(),
    electron([
      {
        entry: 'electron/main.ts',
        vite: {
          build: {
            outDir: 'dist-electron',
          },
        },
      },
      {
        entry: 'electron/preload.ts',
        onstart(args) {
          args.reload();
        },
        vite: {
          build: {
            outDir: 'dist-electron',
          },
        },
      },
    ]),
    electronRenderer(),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 5173,
  },
});
```

- [ ] **Step 4: 创建 Electron 主进程**

**File:** `frontend/electron/main.ts`

```typescript
import { app, BrowserWindow, ipcMain } from 'electron';
import path from 'path';

let mainWindow: BrowserWindow | null = null;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 800,
    minWidth: 960,
    minHeight: 640,
    frame: true,
    backgroundColor: '#121212',
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  if (process.env.VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(process.env.VITE_DEV_SERVER_URL);
    mainWindow.webContents.openDevTools();
  } else {
    mainWindow.loadFile(path.join(__dirname, '../dist/index.html'));
  }

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
```

- [ ] **Step 5: 创建 preload.ts**

**File:** `frontend/electron/preload.ts`

```typescript
import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('electronAPI', {
  platform: process.platform,
  minimize: () => ipcRenderer.send('window:minimize'),
  maximize: () => ipcRenderer.send('window:maximize'),
  close: () => ipcRenderer.send('window:close'),
});
```

- [ ] **Step 6: 创建 React 入口**

**File:** `frontend/index.html`

```html
<!DOCTYPE html>
<html lang="zh-CN">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>AiToVoice</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

**File:** `frontend/src/main.tsx`

```tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { ConfigProvider, theme } from 'antd';
import zhCN from 'antd/locale/zh_CN';
import App from './App';
import './assets/styles/global.css';

const darkTheme = {
  algorithm: theme.darkAlgorithm,
  token: {
    colorPrimary: '#1DB954',
    colorBgContainer: '#181818',
    colorBgElevated: '#282828',
    borderRadius: 8,
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  },
};

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ConfigProvider theme={darkTheme} locale={zhCN}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ConfigProvider>
  </React.StrictMode>
);
```

**File:** `frontend/src/App.tsx`

```tsx
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './stores/authStore';
import AppLayout from './components/Layout/AppLayout';
import LoginPage from './pages/Auth/LoginPage';
import RegisterPage from './pages/Auth/RegisterPage';
import HomePage from './pages/Home/HomePage';

function App() {
  const { isAuthenticated } = useAuthStore();

  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route
        path="/*"
        element={isAuthenticated ? <AppLayout /> : <Navigate to="/login" replace />}
      />
    </Routes>
  );
}

export default App;
```

- [ ] **Step 7: 创建全局样式**

**File:** `frontend/src/assets/styles/global.css`

```css
:root {
  --bg-primary: #121212;
  --bg-secondary: #181818;
  --bg-elevated: #282828;
  --bg-highlight: #333333;
  --text-primary: #FFFFFF;
  --text-secondary: #B3B3B3;
  --text-subdued: #6A6A6A;
  --accent-green: #1DB954;
  --accent-green-hover: #1ED760;
  --error-red: #E74C3C;
  --border-radius: 8px;
  --sidebar-width: 240px;
  --player-height: 90px;
  --topbar-height: 64px;
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  background-color: var(--bg-primary);
  color: var(--text-primary);
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  overflow: hidden;
}

#root {
  width: 100vw;
  height: 100vh;
}

::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  background: transparent;
}

::-webkit-scrollbar-thumb {
  background: var(--bg-highlight);
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: var(--text-subdued);
}
```

- [ ] **Step 8: 提交**

```bash
git add frontend/
git commit -m "feat: init Electron + React frontend with Vite, Ant Design dark theme"
```

---

### Task 1.5: 创建 API 请求层基础

- [ ] **Step 1: 创建 Axios 实例**

**File:** `frontend/src/api/client.ts`

```typescript
import axios, { type AxiosError, type InternalAxiosRequestConfig } from 'axios';

const client = axios.create({
  baseURL: 'http://localhost:8080/api',
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
});

client.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError) => Promise.reject(error)
);

client.interceptors.response.use(
  (response) => response.data,
  (error: AxiosError<{ message?: string }>) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    const message = error.response?.data?.message || '网络错误';
    return Promise.reject(new Error(message));
  }
);

export default client;
```

- [ ] **Step 2: 创建类型定义**

**File:** `frontend/src/types/index.ts`

```typescript
// User
export interface User {
  id: number;
  username: string;
  email: string;
  avatarUrl: string;
  nickname: string;
  bio: string;
  role: 'USER' | 'ADMIN';
  createdAt: string;
}

// Song
export interface Song {
  id: number;
  title: string;
  artistName: string;
  albumName: string;
  genreName: string;
  duration: number;
  coverUrl: string;
  sourceType: 'LOCAL' | 'NETEASE';
  playCount: number;
  likeCount: number;
  isFavorited?: boolean;
}

// Playlist
export interface Playlist {
  id: number;
  userId: number;
  name: string;
  description: string;
  coverUrl: string;
  isPublic: boolean;
  playCount: number;
  songCount: number;
  createdAt: string;
}

// API Response
export interface ApiResponse<T> {
  code: number;
  message: string;
  data: T;
  timestamp: string;
}

export interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
}
```

- [ ] **Step 3: 提交**

```bash
git add frontend/src/api/ frontend/src/types/
git commit -m "feat: add API client and TypeScript type definitions"
```

---

## Phase 2: 用户认证模块

### Task 2.1: 用户实体 + Repository

- [ ] **Step 1: 创建 User 实体**

**File:** `backend/src/main/java/com/aitovoice/user/entity/User.java`

```java
package com.aitovoice.user.entity;

import com.aitovoice.common.BaseEntity;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "users")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User extends BaseEntity {

    @Column(nullable = false, unique = true, length = 50)
    private String username;

    @Column(nullable = false, unique = true, length = 100)
    private String email;

    @Column(name = "password_hash", nullable = false)
    private String passwordHash;

    @Column(name = "avatar_url")
    private String avatarUrl;

    @Column(length = 50)
    private String nickname;

    @Column(length = 500)
    private String bio;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    @Builder.Default
    private UserRole role = UserRole.USER;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    @Builder.Default
    private UserStatus status = UserStatus.ACTIVE;

    public enum UserRole { USER, ADMIN }
    public enum UserStatus { ACTIVE, BANNED }
}
```

- [ ] **Step 2: 创建 UserRepository**

**File:** `backend/src/main/java/com/aitovoice/user/UserRepository.java`

```java
package com.aitovoice.user;

import com.aitovoice.user.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByUsername(String username);

    Optional<User> findByEmail(String email);

    boolean existsByUsername(String username);

    boolean existsByEmail(String email);
}
```

- [ ] **Step 3: 提交**

```bash
git add backend/src/main/java/com/aitovoice/user/
git commit -m "feat: add User entity and UserRepository"
```

---

### Task 2.2: JWT 工具类

- [ ] **Step 1: 创建 JwtTokenProvider**

**File:** `backend/src/main/java/com/aitovoice/auth/JwtTokenProvider.java`

```java
package com.aitovoice.auth;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;

@Component
public class JwtTokenProvider {

    private final SecretKey key;
    private final long expiration;
    private final long refreshExpiration;

    public JwtTokenProvider(
            @Value("${jwt.secret}") String secret,
            @Value("${jwt.expiration}") long expiration,
            @Value("${jwt.refresh-expiration}") long refreshExpiration) {
        this.key = Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));
        this.expiration = expiration;
        this.refreshExpiration = refreshExpiration;
    }

    public String generateToken(Long userId, String username) {
        return buildToken(userId, username, expiration);
    }

    public String generateRefreshToken(Long userId, String username) {
        return buildToken(userId, username, refreshExpiration);
    }

    private String buildToken(Long userId, String username, long expMs) {
        var now = new Date();
        return Jwts.builder()
                .subject(userId.toString())
                .claim("username", username)
                .issuedAt(now)
                .expiration(new Date(now.getTime() + expMs))
                .signWith(key)
                .compact();
    }

    public Long getUserIdFromToken(String token) {
        return Long.parseLong(parseClaims(token).getSubject());
    }

    public String getUsernameFromToken(String token) {
        return parseClaims(token).get("username", String.class);
    }

    public boolean validateToken(String token) {
        try {
            parseClaims(token);
            return true;
        } catch (JwtException | IllegalArgumentException e) {
            return false;
        }
    }

    private Claims parseClaims(String token) {
        return Jwts.parser()
                .verifyWith(key)
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }
}
```

- [ ] **Step 2: 提交**

```bash
git add backend/src/main/java/com/aitovoice/auth/JwtTokenProvider.java
git commit -m "feat: add JWT token provider"
```

---

### Task 2.3: Spring Security 配置

- [ ] **Step 1: 创建 JwtAuthenticationFilter**

**File:** `backend/src/main/java/com/aitovoice/auth/JwtAuthenticationFilter.java`

```java
package com.aitovoice.auth;

import com.aitovoice.user.UserRepository;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;

@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtTokenProvider tokenProvider;
    private final UserRepository userRepository;

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain)
            throws ServletException, IOException {

        var authHeader = request.getHeader("Authorization");

        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            var token = authHeader.substring(7);

            if (tokenProvider.validateToken(token)) {
                var userId = tokenProvider.getUserIdFromToken(token);
                var user = userRepository.findById(userId).orElse(null);

                if (user != null && !user.isDeleted()) {
                    var authentication = new UsernamePasswordAuthenticationToken(
                            user, null, List.of());
                    authentication.setDetails(
                            new WebAuthenticationDetailsSource().buildDetails(request));
                    SecurityContextHolder.getContext().setAuthentication(authentication);
                }
            }
        }

        filterChain.doFilter(request, response);
    }
}
```

- [ ] **Step 2: 创建 SecurityConfig**

**File:** `backend/src/main/java/com/aitovoice/config/SecurityConfig.java`

```java
package com.aitovoice.config;

import com.aitovoice.auth.JwtAuthenticationFilter;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtFilter;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        return http
                .csrf(AbstractHttpConfigurer::disable)
                .sessionManagement(sm -> sm.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/api/auth/**").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/songs/**", "/api/rankings/**").permitAll()
                        .requestMatchers("/api/files/audio/**", "/api/files/cover/**").permitAll()
                        .anyRequest().authenticated()
                )
                .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class)
                .build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationManager authenticationManager(
            AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }
}
```

- [ ] **Step 3: 创建 CorsConfig**

**File:** `backend/src/main/java/com/aitovoice/config/CorsConfig.java`

```java
package com.aitovoice.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;

import java.util.List;

@Configuration
public class CorsConfig {

    @Bean
    public CorsFilter corsFilter() {
        var config = new CorsConfiguration();
        config.setAllowedOriginPatterns(List.of("http://localhost:*"));
        config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        config.setAllowedHeaders(List.of("*"));
        config.setAllowCredentials(true);

        var source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return new CorsFilter(source);
    }
}
```

- [ ] **Step 4: 提交**

```bash
git add backend/src/main/java/com/aitovoice/auth/ backend/src/main/java/com/aitovoice/config/
git commit -m "feat: add Spring Security config with JWT filter and CORS"
```

---

### Task 2.4: 认证 API（注册/登录）

- [ ] **Step 1: 创建 DTO**

**File:** `backend/src/main/java/com/aitovoice/auth/dto/RegisterRequest.java`

```java
package com.aitovoice.auth.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record RegisterRequest(
        @NotBlank(message = "用户名不能为空")
        @Size(min = 3, max = 50, message = "用户名长度 3-50 个字符")
        String username,

        @NotBlank(message = "邮箱不能为空")
        @Email(message = "邮箱格式不正确")
        String email,

        @NotBlank(message = "密码不能为空")
        @Size(min = 6, max = 100, message = "密码长度 6-100 个字符")
        String password
) {}
```

**File:** `backend/src/main/java/com/aitovoice/auth/dto/LoginRequest.java`

```java
package com.aitovoice.auth.dto;

import jakarta.validation.constraints.NotBlank;

public record LoginRequest(
        @NotBlank(message = "用户名不能为空")
        String username,

        @NotBlank(message = "密码不能为空")
        String password
) {}
```

**File:** `backend/src/main/java/com/aitovoice/auth/dto/AuthResponse.java`

```java
package com.aitovoice.auth.dto;

import com.aitovoice.user.dto.UserProfileDto;

public record AuthResponse(
        String token,
        String refreshToken,
        UserProfileDto user
) {}
```

- [ ] **Step 2: 创建 UserProfileDto**

**File:** `backend/src/main/java/com/aitovoice/user/dto/UserProfileDto.java`

```java
package com.aitovoice.user.dto;

import java.time.LocalDateTime;

public record UserProfileDto(
        Long id,
        String username,
        String email,
        String avatarUrl,
        String nickname,
        String bio,
        String role,
        LocalDateTime createdAt
) {}
```

- [ ] **Step 3: 创建 UserMapper**

**File:** `backend/src/main/java/com/aitovoice/user/UserMapper.java`

```java
package com.aitovoice.user;

import com.aitovoice.user.dto.UserProfileDto;
import com.aitovoice.user.entity.User;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface UserMapper {

    UserProfileDto toProfileDto(User user);
}
```

- [ ] **Step 4: 创建 AuthService**

**File:** `backend/src/main/java/com/aitovoice/auth/AuthService.java`

```java
package com.aitovoice.auth;

import com.aitovoice.auth.dto.AuthResponse;
import com.aitovoice.auth.dto.LoginRequest;
import com.aitovoice.auth.dto.RegisterRequest;
import com.aitovoice.common.BusinessException;
import com.aitovoice.common.ErrorCode;
import com.aitovoice.user.UserMapper;
import com.aitovoice.user.UserRepository;
import com.aitovoice.user.entity.User;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final UserMapper userMapper;
    private final JwtTokenProvider tokenProvider;
    private final PasswordEncoder passwordEncoder;

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByUsername(request.username())) {
            throw new BusinessException(ErrorCode.USER_ALREADY_EXISTS);
        }
        if (userRepository.existsByEmail(request.email())) {
            throw new BusinessException(ErrorCode.USER_EMAIL_EXISTS);
        }

        var user = User.builder()
                .username(request.username())
                .email(request.email())
                .passwordHash(passwordEncoder.encode(request.password()))
                .nickname(request.username())
                .build();

        userRepository.save(user);
        return buildAuthResponse(user);
    }

    public AuthResponse login(LoginRequest request) {
        var user = userRepository.findByUsername(request.username())
                .orElseThrow(() -> new BusinessException(ErrorCode.AUTH_INVALID_CREDENTIALS));

        if (!passwordEncoder.matches(request.password(), user.getPasswordHash())) {
            throw new BusinessException(ErrorCode.AUTH_INVALID_CREDENTIALS);
        }

        return buildAuthResponse(user);
    }

    private AuthResponse buildAuthResponse(User user) {
        var token = tokenProvider.generateToken(user.getId(), user.getUsername());
        var refreshToken = tokenProvider.generateRefreshToken(user.getId(), user.getUsername());
        var profile = userMapper.toProfileDto(user);
        return new AuthResponse(token, refreshToken, profile);
    }
}
```

- [ ] **Step 5: 创建 AuthController**

**File:** `backend/src/main/java/com/aitovoice/auth/AuthController.java`

```java
package com.aitovoice.auth;

import com.aitovoice.auth.dto.AuthResponse;
import com.aitovoice.auth.dto.LoginRequest;
import com.aitovoice.auth.dto.RegisterRequest;
import com.aitovoice.common.ApiResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/register")
    public ApiResponse<AuthResponse> register(@Valid @RequestBody RegisterRequest request) {
        return ApiResponse.success("注册成功", authService.register(request));
    }

    @PostMapping("/login")
    public ApiResponse<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
        return ApiResponse.success("登录成功", authService.login(request));
    }

    @GetMapping("/me")
    public ApiResponse<Object> me(Authentication authentication) {
        return ApiResponse.success(authentication.getPrincipal());
    }
}
```

- [ ] **Step 6: 提交**

```bash
git add backend/src/main/java/com/aitovoice/auth/ backend/src/main/java/com/aitovoice/user/
git commit -m "feat: add auth API - register, login, me endpoint"
```

---

### Task 2.5: 前端登录/注册页面

- [ ] **Step 1: 创建 authStore**

**File:** `frontend/src/stores/authStore.ts`

```typescript
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User } from '../types';
import * as authApi from '../api/auth';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<void>;
  register: (username: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,

      login: async (username, password) => {
        const res = await authApi.login({ username, password });
        set({
          user: res.data.user,
          token: res.data.token,
          isAuthenticated: true,
        });
        localStorage.setItem('token', res.data.token);
      },

      register: async (username, email, password) => {
        const res = await authApi.register({ username, email, password });
        set({
          user: res.data.user,
          token: res.data.token,
          isAuthenticated: true,
        });
        localStorage.setItem('token', res.data.token);
      },

      logout: () => {
        set({ user: null, token: null, isAuthenticated: false });
        localStorage.removeItem('token');
      },
    }),
    { name: 'auth-storage' }
  )
);
```

- [ ] **Step 2: 创建 auth API**

**File:** `frontend/src/api/auth.ts`

```typescript
import client from './client';
import type { ApiResponse } from '../types';

interface AuthResponse {
  token: string;
  refreshToken: string;
  user: {
    id: number;
    username: string;
    email: string;
    avatarUrl: string;
    nickname: string;
    bio: string;
    role: string;
    createdAt: string;
  };
}

interface LoginRequest {
  username: string;
  password: string;
}

interface RegisterRequest {
  username: string;
  email: string;
  password: string;
}

export const login = (data: LoginRequest) =>
  client.post<ApiResponse<AuthResponse>>('/auth/login', data);

export const register = (data: RegisterRequest) =>
  client.post<ApiResponse<AuthResponse>>('/auth/register', data);

export const getMe = () =>
  client.get<ApiResponse<AuthResponse['user']>>('/auth/me');
```

- [ ] **Step 3: 创建 LoginPage**

**File:** `frontend/src/pages/Auth/LoginPage.tsx`

```tsx
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Form, Input, Button, Typography, message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { useAuthStore } from '../../stores/authStore';

const { Title, Text } = Typography;

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuthStore();

  const onFinish = async (values: { username: string; password: string }) => {
    setLoading(true);
    try {
      await login(values.username, values.password);
      message.success('登录成功');
      navigate('/');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : '登录失败';
      message.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      display: 'flex', justifyContent: 'center', alignItems: 'center',
      minHeight: '100vh', background: '#121212'
    }}>
      <div style={{ width: 400, padding: 40, background: '#181818', borderRadius: 12 }}>
        <Title level={2} style={{ textAlign: 'center', color: '#1DB954' }}>
          AiToVoice
        </Title>
        <Text style={{ display: 'block', textAlign: 'center', color: '#B3B3B3', marginBottom: 32 }}>
          AI 音乐播放器 & 声乐教练
        </Text>
        <Form layout="vertical" onFinish={onFinish}>
          <Form.Item name="username" rules={[{ required: true, message: '请输入用户名' }]}>
            <Input prefix={<UserOutlined />} placeholder="用户名" size="large" />
          </Form.Item>
          <Form.Item name="password" rules={[{ required: true, message: '请输入密码' }]}>
            <Input.Password prefix={<LockOutlined />} placeholder="密码" size="large" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" block size="large" loading={loading}>
              登录
            </Button>
          </Form.Item>
        </Form>
        <Text style={{ color: '#B3B3B3' }}>
          还没有账号？ <Link to="/register">立即注册</Link>
        </Text>
      </div>
    </div>
  );
}
```

**File:** `frontend/src/pages/Auth/RegisterPage.tsx`

```tsx
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Form, Input, Button, Typography, message } from 'antd';
import { UserOutlined, LockOutlined, MailOutlined } from '@ant-design/icons';
import { useAuthStore } from '../../stores/authStore';

const { Title, Text } = Typography;

export default function RegisterPage() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { register } = useAuthStore();

  const onFinish = async (values: { username: string; email: string; password: string }) => {
    setLoading(true);
    try {
      await register(values.username, values.email, values.password);
      message.success('注册成功');
      navigate('/');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : '注册失败';
      message.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      display: 'flex', justifyContent: 'center', alignItems: 'center',
      minHeight: '100vh', background: '#121212'
    }}>
      <div style={{ width: 400, padding: 40, background: '#181818', borderRadius: 12 }}>
        <Title level={2} style={{ textAlign: 'center', color: '#1DB954' }}>
          AiToVoice
        </Title>
        <Text style={{ display: 'block', textAlign: 'center', color: '#B3B3B3', marginBottom: 32 }}>
          创建账号开始使用
        </Text>
        <Form layout="vertical" onFinish={onFinish}>
          <Form.Item name="username" rules={[
            { required: true, message: '请输入用户名' },
            { min: 3, max: 50, message: '用户名长度 3-50 个字符' }
          ]}>
            <Input prefix={<UserOutlined />} placeholder="用户名" size="large" />
          </Form.Item>
          <Form.Item name="email" rules={[
            { required: true, message: '请输入邮箱' },
            { type: 'email', message: '邮箱格式不正确' }
          ]}>
            <Input prefix={<MailOutlined />} placeholder="邮箱" size="large" />
          </Form.Item>
          <Form.Item name="password" rules={[
            { required: true, message: '请输入密码' },
            { min: 6, message: '密码至少 6 个字符' }
          ]}>
            <Input.Password prefix={<LockOutlined />} placeholder="密码" size="large" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" block size="large" loading={loading}>
              注册
            </Button>
          </Form.Item>
        </Form>
        <Text style={{ color: '#B3B3B3' }}>
          已有账号？ <Link to="/login">立即登录</Link>
        </Text>
      </div>
    </div>
  );
}
```

- [ ] **Step 4: 创建 Layout 基础结构**

**File:** `frontend/src/components/Layout/AppLayout.tsx`

```tsx
import { Layout } from 'antd';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import TopBar from './TopBar';
import PlayerBar from '../Player/PlayerBar';

const { Content } = Layout;

export default function AppLayout() {
  return (
    <Layout style={{ height: '100vh' }}>
      <Layout.Sider width={240} style={{ background: '#000000' }}>
        <Sidebar />
      </Layout.Sider>
      <Layout>
        <Layout.Header style={{ height: 64, padding: '0 24px', background: '#181818' }}>
          <TopBar />
        </Layout.Header>
        <Content style={{ overflow: 'auto', padding: 24, background: '#121212' }}>
          <Outlet />
        </Content>
      </Layout>
      <div style={{
        position: 'fixed', bottom: 0, left: 0, right: 0, height: 90,
        background: '#181818', borderTop: '1px solid #282828', zIndex: 100
      }}>
        <PlayerBar />
      </div>
    </Layout>
  );
}
```

**File:** `frontend/src/components/Layout/Sidebar.tsx`

```tsx
import { Menu } from 'antd';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  HomeOutlined, SearchOutlined, CustomerServiceOutlined,
  TrophyOutlined, TeamOutlined, RobotOutlined, AudioOutlined,
  SettingOutlined
} from '@ant-design/icons';

const menuItems = [
  { key: '/', icon: <HomeOutlined />, label: '首页' },
  { key: '/search', icon: <SearchOutlined />, label: '发现' },
  { key: '/library', icon: <CustomerServiceOutlined />, label: '音乐库' },
  { key: '/rankings', icon: <TrophyOutlined />, label: '排行榜' },
  { key: '/social', icon: <TeamOutlined />, label: '社交' },
  { key: '/ai-teacher', icon: <RobotOutlined />, label: 'AI 老师' },
  { key: '/studio', icon: <AudioOutlined />, label: '录音室' },
  { key: '/settings', icon: <SettingOutlined />, label: '设置' },
];

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div style={{ height: 64, display: 'flex', alignItems: 'center', padding: '0 24px' }}>
        <span style={{ fontSize: 20, fontWeight: 700, color: '#1DB954' }}>AiToVoice</span>
      </div>
      <Menu
        mode="inline"
        selectedKeys={[location.pathname]}
        items={menuItems}
        onClick={({ key }) => navigate(key)}
        style={{ background: 'transparent', borderRight: 'none' }}
      />
    </div>
  );
}
```

**File:** `frontend/src/components/Layout/TopBar.tsx`

```tsx
import { Input, Avatar, Dropdown, Space } from 'antd';
import { SearchOutlined, UserOutlined, LogoutOutlined } from '@ant-design/icons';
import { useAuthStore } from '../../stores/authStore';
import { useNavigate } from 'react-router-dom';

export default function TopBar() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const dropdownItems = {
    items: [
      { key: 'profile', icon: <UserOutlined />, label: '个人资料', onClick: () => navigate('/profile') },
      { key: 'logout', icon: <LogoutOutlined />, label: '退出登录', onClick: handleLogout },
    ],
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '100%' }}>
      <Input
        prefix={<SearchOutlined />}
        placeholder="搜索歌曲、歌手、歌单..."
        style={{ width: 400, background: '#282828', border: 'none', borderRadius: 20 }}
        onPressEnter={(e) => navigate(`/search?q=${(e.target as HTMLInputElement).value}`)}
      />
      <Dropdown menu={dropdownItems} placement="bottomRight">
        <Space style={{ cursor: 'pointer' }}>
          <Avatar size={32} icon={<UserOutlined />} src={user?.avatarUrl} />
          <span style={{ color: '#B3B3B3' }}>{user?.nickname || user?.username}</span>
        </Space>
      </Dropdown>
    </div>
  );
}
```

**File:** `frontend/src/components/Player/PlayerBar.tsx`

```tsx
import { Typography } from 'antd';

export default function PlayerBar() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', height: '100%', padding: '0 16px' }}>
      <Typography.Text style={{ color: '#B3B3B3' }}>
        播放器将在 Phase 3 实现
      </Typography.Text>
    </div>
  );
}
```

- [ ] **Step 5: 提交**

```bash
git add frontend/src/
git commit -m "feat: add login/register pages, app layout, sidebar, topbar"
```

---

## Phase 3: 音乐核心模块

### Task 3.1: 音乐实体与 Repository

- [ ] **Step 1: 创建 Artist / Album / Genre 实体**

**File:** `backend/src/main/java/com/aitovoice/music/entity/Artist.java`

```java
package com.aitovoice.music.entity;

import com.aitovoice.common.BaseEntity;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "artists")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Artist extends BaseEntity {
    @Column(nullable = false, length = 100)
    private String name;
    @Column(name = "avatar_url")
    private String avatarUrl;
    @Column(length = 1000)
    private String bio;
    @Enumerated(EnumType.STRING)
    @Column(name = "source_type", length = 20)
    private SourceType sourceType;
    @Column(name = "source_id", length = 100)
    private String sourceId;

    public enum SourceType { LOCAL, NETEASE }
}
```

**File:** `backend/src/main/java/com/aitovoice/music/entity/Album.java`

```java
package com.aitovoice.music.entity;

import com.aitovoice.common.BaseEntity;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

@Entity
@Table(name = "albums")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Album extends BaseEntity {
    @Column(nullable = false, length = 200)
    private String title;
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "artist_id")
    private Artist artist;
    @Column(name = "cover_url")
    private String coverUrl;
    @Column(name = "release_date")
    private LocalDate releaseDate;
    @Column(length = 1000)
    private String description;
}
```

**File:** `backend/src/main/java/com/aitovoice/music/entity/Genre.java`

```java
package com.aitovoice.music.entity;

import com.aitovoice.common.BaseEntity;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "genres")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Genre extends BaseEntity {
    @Column(nullable = false, unique = true, length = 50)
    private String name;
    @Column(length = 500)
    private String description;
    @Column(name = "cover_url")
    private String coverUrl;
    @Column(name = "sort_order")
    @Builder.Default
    private Integer sortOrder = 0;
}
```

- [ ] **Step 2: 创建 Song 实体**

**File:** `backend/src/main/java/com/aitovoice/music/entity/Song.java`

```java
package com.aitovoice.music.entity;

import com.aitovoice.common.BaseEntity;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "songs", indexes = {
        @Index(name = "idx_song_title", columnList = "title"),
        @Index(name = "idx_song_artist", columnList = "artist_id"),
        @Index(name = "idx_song_genre", columnList = "genre_id")
})
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Song extends BaseEntity {
    @Column(nullable = false, length = 200)
    private String title;
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "artist_id")
    private Artist artist;
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "album_id")
    private Album album;
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "genre_id")
    private Genre genre;
    @Column(nullable = false)
    private Integer duration;
    @Column(name = "file_path", length = 500)
    private String filePath;
    @Column(name = "cover_url", length = 500)
    private String coverUrl;
    @Enumerated(EnumType.STRING)
    @Column(name = "source_type", nullable = false, length = 20)
    private SourceType sourceType;
    @Column(name = "source_id", length = 100)
    private String sourceId;
    @Column(name = "play_count")
    @Builder.Default
    private Long playCount = 0L;
    @Column(name = "like_count")
    @Builder.Default
    private Long likeCount = 0L;

    public enum SourceType { LOCAL, NETEASE }
}
```

- [ ] **Step 3: 创建 Tag 和 SongTag**

**File:** `backend/src/main/java/com/aitovoice/music/entity/Tag.java`

```java
package com.aitovoice.music.entity;

import com.aitovoice.common.BaseEntity;
import com.aitovoice.user.entity.User;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "tags")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Tag extends BaseEntity {
    @Column(nullable = false, length = 50)
    private String name;
    @Column(length = 20)
    private String color;
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;
}
```

**File:** `backend/src/main/java/com/aitovoice/music/entity/SongTag.java`

```java
package com.aitovoice.music.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "song_tags")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor
@IdClass(SongTagId.class)
public class SongTag {
    @Id
    @Column(name = "song_id")
    private Long songId;
    @Id
    @Column(name = "tag_id")
    private Long tagId;
}
```

**File:** `backend/src/main/java/com/aitovoice/music/entity/SongTagId.java`

```java
package com.aitovoice.music.entity;

import java.io.Serializable;
import java.util.Objects;

public class SongTagId implements Serializable {
    private Long songId;
    private Long tagId;

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof SongTagId that)) return false;
        return Objects.equals(songId, that.songId) && Objects.equals(tagId, that.tagId);
    }

    @Override
    public int hashCode() {
        return Objects.hash(songId, tagId);
    }
}
```

- [ ] **Step 4: 创建 Lyrics 实体**

**File:** `backend/src/main/java/com/aitovoice/music/entity/Lyrics.java`

```java
package com.aitovoice.music.entity;

import com.aitovoice.common.BaseEntity;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "lyrics")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Lyrics extends BaseEntity {
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "song_id")
    private Song song;
    @Column(columnDefinition = "TEXT")
    private String content;
    @Column(length = 50)
    private String source;
    @Column(name = "synced_at")
    private java.time.LocalDateTime syncedAt;
}
```

- [ ] **Step 5: 创建 UserSong 收藏/历史**

**File:** `backend/src/main/java/com/aitovoice/music/entity/UserSong.java`

```java
package com.aitovoice.music.entity;

import com.aitovoice.common.BaseEntity;
import com.aitovoice.user.entity.User;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "user_songs", uniqueConstraints = {
        @UniqueConstraint(columnNames = {"user_id", "song_id", "type"})
})
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class UserSong extends BaseEntity {
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "song_id", nullable = false)
    private Song song;
    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private UserSongType type;
    @Column(name = "play_count")
    @Builder.Default
    private Integer playCount = 0;
    @Column(name = "last_played_at")
    private LocalDateTime lastPlayedAt;
    @Column(name = "progress_sec")
    @Builder.Default
    private Integer progressSec = 0;

    public enum UserSongType { FAVORITE, HISTORY }
}
```

- [ ] **Step 6: 创建所有 Repository**

**File:** `backend/src/main/java/com/aitovoice/music/SongRepository.java`

```java
package com.aitovoice.music;

import com.aitovoice.music.entity.Song;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface SongRepository extends JpaRepository<Song, Long> {

    @Query("SELECT s FROM Song s WHERE s.deletedAt IS NULL AND s.title LIKE %:keyword%")
    Page<Song> searchByTitle(@Param("keyword") String keyword, Pageable pageable);

    @Query("SELECT s FROM Song s WHERE s.deletedAt IS NULL ORDER BY s.playCount DESC")
    List<Song> findHotSongs(Pageable pageable);

    @Query("SELECT s FROM Song s WHERE s.deletedAt IS NULL ORDER BY s.createdAt DESC")
    List<Song> findNewSongs(Pageable pageable);

    @Query("SELECT s FROM Song s WHERE s.deletedAt IS NULL AND s.genre.id = :genreId ORDER BY s.playCount DESC")
    List<Song> findByGenreId(@Param("genreId") Long genreId, Pageable pageable);
}
```

**File:** `backend/src/main/java/com/aitovoice/music/ArtistRepository.java`

```java
package com.aitovoice.music;

import com.aitovoice.music.entity.Artist;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface ArtistRepository extends JpaRepository<Artist, Long> {
    Optional<Artist> findByName(String name);
}
```

**File:** `backend/src/main/java/com/aitovoice/music/AlbumRepository.java`

```java
package com.aitovoice.music;

import com.aitovoice.music.entity.Album;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AlbumRepository extends JpaRepository<Album, Long> {}
```

**File:** `backend/src/main/java/com/aitovoice/music/GenreRepository.java`

```java
package com.aitovoice.music;

import com.aitovoice.music.entity.Genre;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface GenreRepository extends JpaRepository<Genre, Long> {
    List<Genre> findAllByOrderBySortOrderAsc();
}
```

**File:** `backend/src/main/java/com/aitovoice/music/TagRepository.java`

```java
package com.aitovoice.music;

import com.aitovoice.music.entity.Tag;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface TagRepository extends JpaRepository<Tag, Long> {
    List<Tag> findByUserId(Long userId);
}
```

**File:** `backend/src/main/java/com/aitovoice/music/LyricsRepository.java`

```java
package com.aitovoice.music;

import com.aitovoice.music.entity.Lyrics;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface LyricsRepository extends JpaRepository<Lyrics, Long> {
    Optional<Lyrics> findBySongId(Long songId);
}
```

**File:** `backend/src/main/java/com/aitovoice/music/UserSongRepository.java`

```java
package com.aitovoice.music;

import com.aitovoice.music.entity.UserSong;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface UserSongRepository extends JpaRepository<UserSong, Long> {

    @Query("SELECT us FROM UserSong us WHERE us.user.id = :userId AND us.type = :type AND us.deletedAt IS NULL ORDER BY us.lastPlayedAt DESC")
    Page<UserSong> findByUserIdAndType(@Param("userId") Long userId, @Param("type") UserSong.UserSongType type, Pageable pageable);

    Optional<UserSong> findByUserIdAndSongIdAndType(Long userId, Long songId, UserSong.UserSongType type);

    boolean existsByUserIdAndSongIdAndType(Long userId, Long songId, UserSong.UserSongType type);
}
```

- [ ] **Step 7: 提交**

```bash
git add backend/src/main/java/com/aitovoice/music/
git commit -m "feat: add music entities (Song, Artist, Album, Genre, Tag, Lyrics, UserSong) and repositories"
```

---

### Task 3.2: 歌曲上传与文件服务

- [ ] **Step 1: 创建 FileStorageService**

**File:** `backend/src/main/java/com/aitovoice/file/FileStorageService.java`

```java
package com.aitovoice.file;

import com.aitovoice.common.BusinessException;
import com.aitovoice.common.Constants;
import com.aitovoice.common.ErrorCode;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.UUID;

@Service
public class FileStorageService {

    private final Path uploadDir;

    public FileStorageService(@Value("${file.upload-dir}") String uploadDir) {
        this.uploadDir = Paths.get(uploadDir).toAbsolutePath().normalize();
    }

    public String store(MultipartFile file, String subDir, String[] allowedExtensions) {
        validateFile(file, allowedExtensions);
        var ext = getExtension(file.getOriginalFilename());
        var filename = UUID.randomUUID() + ext;
        var targetDir = uploadDir.resolve(subDir);

        try {
            Files.createDirectories(targetDir);
            Files.copy(file.getInputStream(), targetDir.resolve(filename), StandardCopyOption.REPLACE_EXISTING);
            return subDir + "/" + filename;
        } catch (IOException e) {
            throw new BusinessException(ErrorCode.FILE_UPLOAD_FAILED, "文件存储失败");
        }
    }

    public Path getFilePath(String relativePath) {
        var path = uploadDir.resolve(relativePath).normalize();
        if (!Files.exists(path)) {
            throw new BusinessException(ErrorCode.FILE_NOT_FOUND);
        }
        return path;
    }

    private void validateFile(MultipartFile file, String[] allowedExtensions) {
        if (file.isEmpty()) {
            throw new BusinessException(ErrorCode.FILE_UPLOAD_FAILED, "文件为空");
        }
        if (file.getSize() > Constants.MAX_FILE_SIZE) {
            throw new BusinessException(ErrorCode.FILE_UPLOAD_FAILED, "文件超过 50MB 限制");
        }
        var ext = getExtension(file.getOriginalFilename()).toLowerCase();
        var allowed = java.util.Arrays.stream(allowedExtensions)
                .anyMatch(e -> e.equalsIgnoreCase(ext));
        if (!allowed) {
            throw new BusinessException(ErrorCode.UNSUPPORTED_AUDIO_FORMAT);
        }
    }

    private String getExtension(String filename) {
        if (filename == null || !filename.contains(".")) return "";
        return filename.substring(filename.lastIndexOf("."));
    }
}
```

- [ ] **Step 2: 创建 FileController**

**File:** `backend/src/main/java/com/aitovoice/file/FileController.java`

```java
package com.aitovoice.file;

import com.aitovoice.common.BusinessException;
import com.aitovoice.common.ErrorCode;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.nio.file.Files;

@RestController
@RequestMapping("/api/files")
@RequiredArgsConstructor
public class FileController {

    private final FileStorageService fileStorage;

    @GetMapping("/audio/{subDir}/{filename}")
    public ResponseEntity<Resource> getAudio(
            @PathVariable String subDir,
            @PathVariable String filename) {
        var path = fileStorage.getFilePath(subDir + "/" + filename);
        try {
            var resource = new UrlResource(path.toUri());
            var contentType = Files.probeContentType(path);
            return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_TYPE, contentType != null ? contentType : "audio/mpeg")
                    .header(HttpHeaders.CACHE_CONTROL, "max-age=3600")
                    .body(resource);
        } catch (Exception e) {
            throw new BusinessException(ErrorCode.FILE_NOT_FOUND);
        }
    }

    @GetMapping("/cover/{subDir}/{filename}")
    public ResponseEntity<Resource> getCover(
            @PathVariable String subDir,
            @PathVariable String filename) {
        var path = fileStorage.getFilePath(subDir + "/" + filename);
        try {
            var resource = new UrlResource(path.toUri());
            var contentType = Files.probeContentType(path);
            return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_TYPE, contentType != null ? contentType : "image/jpeg")
                    .body(resource);
        } catch (Exception e) {
            throw new BusinessException(ErrorCode.FILE_NOT_FOUND);
        }
    }

    @PostMapping("/upload")
    public ResponseEntity<com.aitovoice.common.ApiResponse<String>> upload(
            @RequestParam("file") MultipartFile file,
            @RequestParam("type") String type) {
        var subDir = switch (type) {
            case "audio" -> "audio";
            case "cover" -> "covers";
            case "avatar" -> "avatars";
            default -> throw new BusinessException(ErrorCode.VALIDATION_ERROR, "不支持的上传类型");
        };
        var extensions = type.equals("audio")
                ? com.aitovoice.common.Constants.ALLOWED_AUDIO_EXTENSIONS
                : com.aitovoice.common.Constants.ALLOWED_IMAGE_EXTENSIONS;
        var path = fileStorage.store(file, subDir, extensions);
        return ResponseEntity.ok(com.aitovoice.common.ApiResponse.success(path));
    }
}
```

- [ ] **Step 3: 创建 SongService 和 SongController**

**File:** `backend/src/main/java/com/aitovoice/music/SongService.java`

```java
package com.aitovoice.music;

import com.aitovoice.common.BusinessException;
import com.aitovoice.common.Constants;
import com.aitovoice.common.ErrorCode;
import com.aitovoice.file.FileStorageService;
import com.aitovoice.music.dto.SongDto;
import com.aitovoice.music.dto.SongSearchRequest;
import com.aitovoice.music.entity.Song;
import com.aitovoice.music.entity.UserSong;
import com.aitovoice.user.entity.User;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@Service
@RequiredArgsConstructor
public class SongService {

    private final SongRepository songRepository;
    private final UserSongRepository userSongRepository;
    private final LyricsRepository lyricsRepository;
    private final FileStorageService fileStorage;
    private final SongMapper songMapper;

    @Transactional
    public SongDto upload(MultipartFile file, String title, Long artistId, Long genreId) {
        var filePath = fileStorage.store(file, "audio", Constants.ALLOWED_AUDIO_EXTENSIONS);
        var song = Song.builder()
                .title(title)
                .filePath(filePath)
                .sourceType(Song.SourceType.LOCAL)
                .duration(0)
                .build();
        songRepository.save(song);
        return songMapper.toDto(song);
    }

    public Page<SongDto> search(SongSearchRequest request) {
        var pageable = PageRequest.of(request.page(), request.size());
        var songs = songRepository.searchByTitle(request.keyword(), pageable);
        return songs.map(songMapper::toDto);
    }

    public List<SongDto> getHotSongs(int limit) {
        return songRepository.findHotSongs(PageRequest.of(0, limit)).stream()
                .map(songMapper::toDto)
                .toList();
    }

    public List<SongDto> getNewSongs(int limit) {
        return songRepository.findNewSongs(PageRequest.of(0, limit)).stream()
                .map(songMapper::toDto)
                .toList();
    }

    public SongDto getSong(Long id) {
        var song = songRepository.findById(id)
                .orElseThrow(() -> new BusinessException(ErrorCode.SONG_NOT_FOUND));
        return songMapper.toDto(song);
    }

    @Transactional
    public void recordPlay(Long userId, Long songId) {
        var song = songRepository.findById(songId)
                .orElseThrow(() -> new BusinessException(ErrorCode.SONG_NOT_FOUND));
        song.setPlayCount(song.getPlayCount() + 1);
        songRepository.save(song);

        var history = userSongRepository.findByUserIdAndSongIdAndType(
                userId, songId, UserSong.UserSongType.HISTORY)
                .orElseGet(() -> UserSong.builder()
                        .user(User.builder().id(userId).build())
                        .song(song)
                        .type(UserSong.UserSongType.HISTORY)
                        .build());
        history.setPlayCount(history.getPlayCount() + 1);
        history.setLastPlayedAt(java.time.LocalDateTime.now());
        userSongRepository.save(history);
    }

    @Transactional
    public void toggleFavorite(Long userId, Long songId) {
        var existing = userSongRepository.findByUserIdAndSongIdAndType(
                userId, songId, UserSong.UserSongType.FAVORITE);
        if (existing.isPresent()) {
            existing.get().softDelete();
            userSongRepository.save(existing.get());
        } else {
            var fav = UserSong.builder()
                    .user(User.builder().id(userId).build())
                    .song(Song.builder().id(songId).build())
                    .type(UserSong.UserSongType.FAVORITE)
                    .build();
            userSongRepository.save(fav);
        }
    }

    public List<SongDto> getFavorites(Long userId) {
        return userSongRepository.findByUserIdAndType(
                        userId, UserSong.UserSongType.FAVORITE, PageRequest.of(0, 500))
                .getContent().stream()
                .map(us -> songMapper.toDto(us.getSong()))
                .toList();
    }

    public List<SongDto> getHistory(Long userId) {
        return userSongRepository.findByUserIdAndType(
                        userId, UserSong.UserSongType.HISTORY, PageRequest.of(0, 100))
                .getContent().stream()
                .map(us -> songMapper.toDto(us.getSong()))
                .toList();
    }
}
```

**File:** `backend/src/main/java/com/aitovoice/music/SongMapper.java`

```java
package com.aitovoice.music;

import com.aitovoice.music.dto.SongDto;
import com.aitovoice.music.entity.Song;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface SongMapper {

    @Mapping(source = "artist.name", target = "artistName")
    @Mapping(source = "album.title", target = "albumName")
    @Mapping(source = "genre.name", target = "genreName")
    SongDto toDto(Song song);
}
```

**File:** `backend/src/main/java/com/aitovoice/music/dto/SongDto.java`

```java
package com.aitovoice.music.dto;

public record SongDto(
        Long id,
        String title,
        String artistName,
        String albumName,
        String genreName,
        Integer duration,
        String coverUrl,
        String sourceType,
        Long playCount,
        Long likeCount
) {}
```

**File:** `backend/src/main/java/com/aitovoice/music/dto/SongSearchRequest.java`

```java
package com.aitovoice.music.dto;

public record SongSearchRequest(
        String keyword,
        Long genreId,
        int page,
        int size
) {
    public SongSearchRequest {
        if (page < 0) page = 0;
        if (size <= 0 || size > 100) size = 20;
    }
}
```

**File:** `backend/src/main/java/com/aitovoice/music/SongController.java`

```java
package com.aitovoice.music;

import com.aitovoice.common.ApiResponse;
import com.aitovoice.music.dto.SongDto;
import com.aitovoice.music.dto.SongSearchRequest;
import com.aitovoice.user.entity.User;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/songs")
@RequiredArgsConstructor
public class SongController {

    private final SongService songService;

    @PostMapping("/upload")
    public ApiResponse<SongDto> upload(
            @RequestParam("file") MultipartFile file,
            @RequestParam("title") String title,
            @RequestParam(value = "artistId", required = false) Long artistId,
            @RequestParam(value = "genreId", required = false) Long genreId) {
        return ApiResponse.success(songService.upload(file, title, artistId, genreId));
    }

    @GetMapping("/search")
    public ApiResponse<?> search(SongSearchRequest request) {
        return ApiResponse.success(songService.search(request));
    }

    @GetMapping("/hot")
    public ApiResponse<List<SongDto>> hot(@RequestParam(defaultValue = "50") int limit) {
        return ApiResponse.success(songService.getHotSongs(limit));
    }

    @GetMapping("/new")
    public ApiResponse<List<SongDto>> newSongs(@RequestParam(defaultValue = "50") int limit) {
        return ApiResponse.success(songService.getNewSongs(limit));
    }

    @GetMapping("/{id}")
    public ApiResponse<SongDto> getSong(@PathVariable Long id) {
        return ApiResponse.success(songService.getSong(id));
    }

    @PostMapping("/{id}/play")
    public ApiResponse<Void> recordPlay(@AuthenticationPrincipal User user, @PathVariable Long id) {
        songService.recordPlay(user.getId(), id);
        return ApiResponse.success(null);
    }

    @PostMapping("/{id}/favorite")
    public ApiResponse<Void> favorite(@AuthenticationPrincipal User user, @PathVariable Long id) {
        songService.toggleFavorite(user.getId(), id);
        return ApiResponse.success(null);
    }

    @DeleteMapping("/{id}/favorite")
    public ApiResponse<Void> unfavorite(@AuthenticationPrincipal User user, @PathVariable Long id) {
        songService.toggleFavorite(user.getId(), id);
        return ApiResponse.success(null);
    }

    @GetMapping("/favorites")
    public ApiResponse<List<SongDto>> favorites(@AuthenticationPrincipal User user) {
        return ApiResponse.success(songService.getFavorites(user.getId()));
    }

    @GetMapping("/history")
    public ApiResponse<List<SongDto>> history(@AuthenticationPrincipal User user) {
        return ApiResponse.success(songService.getHistory(user.getId()));
    }
}
```

- [ ] **Step 4: 提交**

```bash
git add backend/src/main/java/com/aitovoice/music/ backend/src/main/java/com/aitovoice/file/
git commit -m "feat: add song upload, search, favorites, history, file service"
```

---

### Task 3.3: 前端音乐播放器

- [ ] **Step 1: 创建 playerStore**

**File:** `frontend/src/stores/playerStore.ts`

```typescript
import { create } from 'zustand';
import type { Song } from '../types';

interface PlayerState {
  currentSong: Song | null;
  playlist: Song[];
  isPlaying: boolean;
  volume: number;
  progress: number;
  duration: number;
  playMode: 'sequential' | 'shuffle' | 'repeat-one';
  setCurrentSong: (song: Song) => void;
  setPlaylist: (songs: Song[]) => void;
  togglePlay: () => void;
  setVolume: (vol: number) => void;
  setProgress: (prog: number) => void;
  setDuration: (dur: number) => void;
  setPlayMode: (mode: PlayerState['playMode']) => void;
  playNext: () => void;
  playPrev: () => void;
}

export const usePlayerStore = create<PlayerState>((set, get) => ({
  currentSong: null,
  playlist: [],
  isPlaying: false,
  volume: 0.7,
  progress: 0,
  duration: 0,
  playMode: 'sequential',

  setCurrentSong: (song) => set({ currentSong: song, isPlaying: true, progress: 0 }),
  setPlaylist: (songs) => set({ playlist: songs }),
  togglePlay: () => set((s) => ({ isPlaying: !s.isPlaying })),
  setVolume: (volume) => set({ volume }),
  setProgress: (progress) => set({ progress }),
  setDuration: (duration) => set({ duration }),
  setPlayMode: (playMode) => set({ playMode }),

  playNext: () => {
    const { playlist, currentSong, playMode } = get();
    if (!currentSong || playlist.length === 0) return;
    const idx = playlist.findIndex((s) => s.id === currentSong.id);

    if (playMode === 'repeat-one') {
      set({ progress: 0, isPlaying: true });
      return;
    }

    if (playMode === 'shuffle') {
      const next = playlist[Math.floor(Math.random() * playlist.length)];
      set({ currentSong: next, progress: 0, isPlaying: true });
      return;
    }

    const nextIdx = (idx + 1) % playlist.length;
    set({ currentSong: playlist[nextIdx], progress: 0, isPlaying: true });
  },

  playPrev: () => {
    const { playlist, currentSong } = get();
    if (!currentSong || playlist.length === 0) return;
    const idx = playlist.findIndex((s) => s.id === currentSong.id);
    const prevIdx = (idx - 1 + playlist.length) % playlist.length;
    set({ currentSong: playlist[prevIdx], progress: 0, isPlaying: true });
  },
}));
```

- [ ] **Step 2: 创建 useAudio Hook**

**File:** `frontend/src/hooks/useAudio.ts`

```typescript
import { useEffect, useRef } from 'react';
import { Howl } from 'howler';
import { usePlayerStore } from '../stores/playerStore';

export function useAudio() {
  const howlRef = useRef<Howl | null>(null);
  const animRef = useRef<number>(0);
  const {
    currentSong, isPlaying, volume,
    setProgress, setDuration, togglePlay, playNext,
  } = usePlayerStore();

  useEffect(() => {
    if (!currentSong) return;

    if (howlRef.current) {
      howlRef.current.unload();
    }

    const howl = new Howl({
      src: [`http://localhost:8080/api/files/audio/${currentSong.id}`],
      html5: true,
      volume,
      onload: () => setDuration(howl.duration()),
      onend: () => playNext(),
    });

    howlRef.current = howl;
    setProgress(0);

    return () => {
      howl.unload();
      cancelAnimationFrame(animRef.current);
    };
  }, [currentSong?.id]);

  useEffect(() => {
    howlRef.current?.volume(volume);
  }, [volume]);

  useEffect(() => {
    if (!howlRef.current) return;
    if (isPlaying) {
      howlRef.current.play();
      const updateProgress = () => {
        if (howlRef.current?.playing()) {
          setProgress(howlRef.current.seek() as number);
          animRef.current = requestAnimationFrame(updateProgress);
        }
      };
      animRef.current = requestAnimationFrame(updateProgress);
    } else {
      howlRef.current.pause();
      cancelAnimationFrame(animRef.current);
    }
  }, [isPlaying]);

  const seek = (time: number) => {
    howlRef.current?.seek(time);
    setProgress(time);
  };

  return { seek };
}
```

- [ ] **Step 3: 更新 PlayerBar 组件**

**File:** `frontend/src/components/Player/PlayerBar.tsx`

```tsx
import { Button, Slider, Typography, Space, Image } from 'antd';
import {
  PlayCircleOutlined, PauseCircleOutlined,
  StepBackwardOutlined, StepForwardOutlined,
  SoundOutlined, SwapOutlined, ReloadOutlined,
  ShuffleOutlined, OrderedListOutlined,
} from '@ant-design/icons';
import { usePlayerStore } from '../../stores/playerStore';
import { useAudio } from '../../hooks/useAudio';

export default function PlayerBar() {
  const {
    currentSong, isPlaying, volume, progress, duration, playMode,
    togglePlay, setVolume, playNext, playPrev, setPlayMode,
  } = usePlayerStore();
  const { seek } = useAudio();

  const formatTime = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const cycleMode = () => {
    const modes: Array<'sequential' | 'shuffle' | 'repeat-one'> =
      ['sequential', 'shuffle', 'repeat-one'];
    const idx = modes.indexOf(playMode);
    setPlayMode(modes[(idx + 1) % modes.length]);
  };

  const modeIcon = {
    sequential: <OrderedListOutlined />,
    shuffle: <ShuffleOutlined />,
    'repeat-one': <ReloadOutlined />,
  }[playMode];

  if (!currentSong) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', height: '100%', padding: '0 16px' }}>
        <Typography.Text style={{ color: '#6A6A6A' }}>选择一首歌曲开始播放</Typography.Text>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', alignItems: 'center', height: '100%', padding: '0 16px', gap: 16 }}>
      <Image src={currentSong.coverUrl} width={56} height={56} style={{ borderRadius: 4 }}
        fallback="data:image/png;base64,iVBORw0KGgo=" />
      <div style={{ width: 160 }}>
        <Typography.Text strong style={{ color: '#fff', display: 'block' }} ellipsis>
          {currentSong.title}
        </Typography.Text>
        <Typography.Text style={{ color: '#B3B3B3', fontSize: 12 }} ellipsis>
          {currentSong.artistName}
        </Typography.Text>
      </div>
      <Space>
        <Button type="text" icon={modeIcon} onClick={cycleMode} style={{ color: '#B3B3B3' }} />
        <Button type="text" icon={<StepBackwardOutlined />} onClick={playPrev} style={{ color: '#B3B3B3' }} />
        <Button type="text" icon={isPlaying ? <PauseCircleOutlined /> : <PlayCircleOutlined />}
          onClick={togglePlay} style={{ color: '#fff', fontSize: 28 }} />
        <Button type="text" icon={<StepForwardOutlined />} onClick={playNext} style={{ color: '#B3B3B3' }} />
      </Space>
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 8 }}>
        <Typography.Text style={{ color: '#B3B3B3', fontSize: 12, width: 40 }}>
          {formatTime(progress)}
        </Typography.Text>
        <Slider value={progress} max={duration} onChange={seek}
          styles={{ track: { background: '#1DB954' }, rail: { background: '#404040' } }}
          tooltip={{ formatter: (v) => formatTime(v ?? 0) }} />
        <Typography.Text style={{ color: '#B3B3B3', fontSize: 12, width: 40 }}>
          {formatTime(duration)}
        </Typography.Text>
      </div>
      <Space>
        <SoundOutlined style={{ color: '#B3B3B3' }} />
        <Slider value={volume} max={1} step={0.01} onChange={setVolume}
          style={{ width: 100 }}
          styles={{ track: { background: '#1DB954' }, rail: { background: '#404040' } }} />
      </Space>
    </div>
  );
}
```

- [ ] **Step 4: 提交**

```bash
git add frontend/src/stores/playerStore.ts frontend/src/hooks/useAudio.ts frontend/src/components/Player/
git commit -m "feat: add music player with Howler.js, play controls, volume, progress bar"
```

---

### Task 3.4: 歌单管理模块

- [ ] **Step 1: 后端 Playlist 实体和 CRUD**

**File:** `backend/src/main/java/com/aitovoice/playlist/entity/Playlist.java`

```java
package com.aitovoice.playlist.entity;

import com.aitovoice.common.BaseEntity;
import com.aitovoice.user.entity.User;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "playlists")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Playlist extends BaseEntity {
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
    @Column(nullable = false, length = 200)
    private String name;
    @Column(length = 1000)
    private String description;
    @Column(name = "cover_url", length = 500)
    private String coverUrl;
    @Column(name = "is_public")
    @Builder.Default
    private Boolean isPublic = true;
    @Column(name = "play_count")
    @Builder.Default
    private Long playCount = 0L;
    @Column(name = "song_count")
    @Builder.Default
    private Integer songCount = 0;
}
```

**File:** `backend/src/main/java/com/aitovoice/playlist/entity/PlaylistSong.java`

```java
package com.aitovoice.playlist.entity;

import com.aitovoice.music.entity.Song;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "playlist_songs", uniqueConstraints = {
        @UniqueConstraint(columnNames = {"playlist_id", "song_id"})
})
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class PlaylistSong {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "playlist_id", nullable = false)
    private Playlist playlist;
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "song_id", nullable = false)
    private Song song;
    @Column(name = "sort_order")
    @Builder.Default
    private Integer sortOrder = 0;
    @Column(name = "added_at")
    @Builder.Default
    private LocalDateTime addedAt = LocalDateTime.now();
}
```

**File:** `backend/src/main/java/com/aitovoice/playlist/PlaylistRepository.java`

```java
package com.aitovoice.playlist;

import com.aitovoice.playlist.entity.Playlist;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface PlaylistRepository extends JpaRepository<Playlist, Long> {
    List<Playlist> findByUserIdAndDeletedAtIsNull(Long userId);
    List<Playlist> findByIsPublicTrueAndDeletedAtIsNull();
}
```

**File:** `backend/src/main/java/com/aitovoice/playlist/PlaylistSongRepository.java`

```java
package com.aitovoice.playlist;

import com.aitovoice.playlist.entity.PlaylistSong;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface PlaylistSongRepository extends JpaRepository<PlaylistSong, Long> {
    List<PlaylistSong> findByPlaylistIdOrderBySortOrder(Long playlistId);
    Optional<PlaylistSong> findByPlaylistIdAndSongId(Long playlistId, Long songId);
    void deleteByPlaylistIdAndSongId(Long playlistId, Long songId);
}
```

- [ ] **Step 2: 创建 PlaylistService**

**File:** `backend/src/main/java/com/aitovoice/playlist/PlaylistService.java`

```java
package com.aitovoice.playlist;

import com.aitovoice.common.BusinessException;
import com.aitovoice.common.ErrorCode;
import com.aitovoice.music.SongRepository;
import com.aitovoice.music.dto.SongDto;
import com.aitovoice.music.SongMapper;
import com.aitovoice.playlist.dto.CreatePlaylistRequest;
import com.aitovoice.playlist.dto.PlaylistDto;
import com.aitovoice.playlist.entity.Playlist;
import com.aitovoice.playlist.entity.PlaylistSong;
import com.aitovoice.user.entity.User;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class PlaylistService {

    private final PlaylistRepository playlistRepository;
    private final PlaylistSongRepository playlistSongRepository;
    private final SongRepository songRepository;
    private final SongMapper songMapper;

    @Transactional
    public PlaylistDto create(Long userId, CreatePlaylistRequest request) {
        var playlist = Playlist.builder()
                .user(User.builder().id(userId).build())
                .name(request.name())
                .description(request.description())
                .isPublic(request.isPublic())
                .build();
        playlistRepository.save(playlist);
        return toDto(playlist);
    }

    public PlaylistDto getById(Long id) {
        var playlist = playlistRepository.findById(id)
                .orElseThrow(() -> new BusinessException(ErrorCode.PLAYLIST_NOT_FOUND));
        return toDto(playlist);
    }

    public List<PlaylistDto> getMyPlaylists(Long userId) {
        return playlistRepository.findByUserIdAndDeletedAtIsNull(userId).stream()
                .map(this::toDto)
                .toList();
    }

    @Transactional
    public void addSong(Long playlistId, Long songId, Long userId) {
        var playlist = playlistRepository.findById(playlistId)
                .orElseThrow(() -> new BusinessException(ErrorCode.PLAYLIST_NOT_FOUND));
        if (!playlist.getUser().getId().equals(userId)) {
            throw new BusinessException(ErrorCode.PLAYLIST_ACCESS_DENIED);
        }
        if (playlistSongRepository.findByPlaylistIdAndSongId(playlistId, songId).isPresent()) {
            throw new BusinessException(ErrorCode.SONG_ALREADY_IN_PLAYLIST);
        }
        var song = songRepository.findById(songId)
                .orElseThrow(() -> new BusinessException(ErrorCode.SONG_NOT_FOUND));
        var count = playlistSongRepository.findByPlaylistIdOrderBySortOrder(playlistId).size();
        var ps = PlaylistSong.builder()
                .playlist(playlist)
                .song(song)
                .sortOrder(count + 1)
                .build();
        playlistSongRepository.save(ps);
        playlist.setSongCount(count + 1);
        playlistRepository.save(playlist);
    }

    @Transactional
    public void removeSong(Long playlistId, Long songId, Long userId) {
        var playlist = playlistRepository.findById(playlistId)
                .orElseThrow(() -> new BusinessException(ErrorCode.PLAYLIST_NOT_FOUND));
        if (!playlist.getUser().getId().equals(userId)) {
            throw new BusinessException(ErrorCode.PLAYLIST_ACCESS_DENIED);
        }
        playlistSongRepository.deleteByPlaylistIdAndSongId(playlistId, songId);
        playlist.setSongCount(Math.max(0, playlist.getSongCount() - 1));
        playlistRepository.save(playlist);
    }

    public List<SongDto> getPlaylistSongs(Long playlistId) {
        return playlistSongRepository.findByPlaylistIdOrderBySortOrder(playlistId).stream()
                .map(ps -> songMapper.toDto(ps.getSong()))
                .toList();
    }

    @Transactional
    public void delete(Long id, Long userId) {
        var playlist = playlistRepository.findById(id)
                .orElseThrow(() -> new BusinessException(ErrorCode.PLAYLIST_NOT_FOUND));
        if (!playlist.getUser().getId().equals(userId)) {
            throw new BusinessException(ErrorCode.PLAYLIST_ACCESS_DENIED);
        }
        playlist.softDelete();
        playlistRepository.save(playlist);
    }

    private PlaylistDto toDto(Playlist p) {
        return new PlaylistDto(
                p.getId(), p.getUser().getId(), p.getName(), p.getDescription(),
                p.getCoverUrl(), p.getIsPublic(), p.getPlayCount(), p.getSongCount(),
                p.getCreatedAt());
    }
}
```

**File:** `backend/src/main/java/com/aitovoice/playlist/dto/CreatePlaylistRequest.java`

```java
package com.aitovoice.playlist.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record CreatePlaylistRequest(
        @NotBlank @Size(max = 200) String name,
        @Size(max = 1000) String description,
        Boolean isPublic
) {}
```

**File:** `backend/src/main/java/com/aitovoice/playlist/dto/PlaylistDto.java`

```java
package com.aitovoice.playlist.dto;

import java.time.LocalDateTime;

public record PlaylistDto(
        Long id, Long userId, String name, String description,
        String coverUrl, Boolean isPublic, Long playCount,
        Integer songCount, LocalDateTime createdAt
) {}
```

**File:** `backend/src/main/java/com/aitovoice/playlist/PlaylistController.java`

```java
package com.aitovoice.playlist;

import com.aitovoice.common.ApiResponse;
import com.aitovoice.music.dto.SongDto;
import com.aitovoice.playlist.dto.CreatePlaylistRequest;
import com.aitovoice.playlist.dto.PlaylistDto;
import com.aitovoice.user.entity.User;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/playlists")
@RequiredArgsConstructor
public class PlaylistController {

    private final PlaylistService playlistService;

    @PostMapping
    public ApiResponse<PlaylistDto> create(
            @AuthenticationPrincipal User user,
            @Valid @RequestBody CreatePlaylistRequest request) {
        return ApiResponse.success(playlistService.create(user.getId(), request));
    }

    @GetMapping("/{id}")
    public ApiResponse<PlaylistDto> getById(@PathVariable Long id) {
        return ApiResponse.success(playlistService.getById(id));
    }

    @GetMapping("/my")
    public ApiResponse<List<PlaylistDto>> my(@AuthenticationPrincipal User user) {
        return ApiResponse.success(playlistService.getMyPlaylists(user.getId()));
    }

    @GetMapping("/{id}/songs")
    public ApiResponse<List<SongDto>> songs(@PathVariable Long id) {
        return ApiResponse.success(playlistService.getPlaylistSongs(id));
    }

    @PostMapping("/{id}/songs/{songId}")
    public ApiResponse<Void> addSong(
            @AuthenticationPrincipal User user,
            @PathVariable Long id, @PathVariable Long songId) {
        playlistService.addSong(id, songId, user.getId());
        return ApiResponse.success(null);
    }

    @DeleteMapping("/{id}/songs/{songId}")
    public ApiResponse<Void> removeSong(
            @AuthenticationPrincipal User user,
            @PathVariable Long id, @PathVariable Long songId) {
        playlistService.removeSong(id, songId, user.getId());
        return ApiResponse.success(null);
    }

    @DeleteMapping("/{id}")
    public ApiResponse<Void> delete(
            @AuthenticationPrincipal User user,
            @PathVariable Long id) {
        playlistService.delete(id, user.getId());
        return ApiResponse.success(null);
    }
}
```

- [ ] **Step 3: 提交**

```bash
git add backend/src/main/java/com/aitovoice/playlist/
git commit -m "feat: add playlist CRUD with songs management"
```

---

## Phase 4-9: 高级模块（摘要）

> 以下模块结构与 Phase 1-3 相同模式：Entity → Repository → Service → Controller → DTO → Mapper → 前端 Store/API/Page。按相同规范逐个实现即可。

### Phase 4: 社交功能
- **后端**: CommentController, MessageController, FollowController + WebSocket
- **前端**: SocialPage, UserHomePage, MessagePage, CommentSection

### Phase 5: 语音录制与分析
- **后端**: VoiceController, PitchAnalyzer (TarsosDSP), RhythmAnalyzer, ScoreCalculator
- **前端**: StudioPage, RecordButton, WaveformDisplay, ScoreGauge

### Phase 6: AI 音乐老师
- **后端**: AiController, OpenAiClient/ClaudeClient, VoiceCoachService, PracticePlanService
- **前端**: AITeacherPage, ChatWindow, PracticePlanCard

### Phase 7: 个性化推荐 + 排行榜
- **后端**: RecommendController, CollaborativeFilter, ContentBasedFilter, RankingScheduler
- **前端**: HomePage (推荐卡片), RankingsPage

### Phase 8: 歌词功能
- **后端**: LyricsService (LRC 解析)
- **前端**: LyricsViewer, DesktopLyrics (Electron 独立窗口)

### Phase 9: 设置模块
- **后端**: UserSettingsController/Service
- **前端**: SettingsPage (主题/快捷键/音频/缓存/账号)

---

## 自检清单

- [ ] 所有 Java 17 特性已使用（switch 表达式、Stream、Records、sealed classes、pattern matching、var）
- [ ] 构造器注入，无 @Autowired 字段注入
- [ ] Entity 不作为 API 响应，统一使用 DTO/Record
- [ ] 所有表有 created_at, updated_at, deleted_at
- [ ] 统一 ApiResponse 响应格式
- [ ] 全局异常处理
- [ ] 前端 TypeScript strict 模式
- [ ] Zustand 状态管理
- [ ] Ant Design 暗色主题
- [ ] LSP 辅助开发（JDTLS + TypeScript LSP）
