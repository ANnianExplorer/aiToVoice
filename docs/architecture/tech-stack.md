# 技术选型文档

> 记录项目中所有技术选型及其理由。

---

## 1. 后端技术栈

| 技术 | 版本 | 用途 | 选型理由 |
|------|------|------|---------|
| Java | 17 | 编程语言 | LTS 版本，支持 Records、sealed classes、switch 表达式等现代语法 |
| Spring Boot | 3.2.5 | 应用框架 | Java 生态最成熟的 Web 框架，约定优于配置 |
| Spring Data JPA | - | ORM | 简化数据库操作，Repository 模式清晰 |
| Spring Security | - | 认证授权 | Spring 生态标准安全框架 |
| Hibernate | - | JPA 实现 | Spring Boot 默认集成，功能完善 |
| MySQL | 8.0 | 数据库 | 用户指定，生态成熟，社区支持丰富 |
| JWT (jjwt) | 0.12.5 | Token 认证 | 无状态认证，适合桌面应用 |
| TarsosDSP | 2.5 | 音频分析 | Java 音频处理库，支持音高检测、节拍分析 |
| MapStruct | 1.5.5 | 对象映射 | 编译期生成映射代码，性能优于反射 |
| Lombok | - | 代码简化 | 减少 getter/setter/constructor 样板代码 |
| springdoc-openapi | 2.5.0 | API 文档 | 自动生成 Swagger UI，零配置集成 |
| Maven | - | 构建工具 | Java 生态标准构建工具 |

### 为什么不用 Spring Boot 3.3+？

Spring Boot 3.2.5 是当前稳定版本，3.3 尚在 RC 阶段，生产环境选择稳定版。

### 为什么用 MapStruct 而不是 ModelMapper？

MapStruct 在编译期生成映射代码，零反射开销，性能更好。配合 Lombok 使用时需注意注解处理器顺序。

---

## 2. 前端技术栈

| 技术 | 版本 | 用途 | 选型理由 |
|------|------|------|---------|
| Electron | 28 | 桌面容器 | 跨平台桌面应用，Chromium 内核 |
| React | 18.3 | UI 框架 | 组件化开发，生态丰富 |
| TypeScript | 5.4 | 类型系统 | 静态类型检查，减少运行时错误 |
| Ant Design | 5.17 | UI 组件库 | 企业级组件库，暗色主题支持好 |
| Zustand | 4.5 | 状态管理 | 轻量级，API 简洁，支持 persist 中间件 |
| Axios | 1.7 | HTTP 客户端 | 拦截器机制，请求/响应处理灵活 |
| Howler.js | 2.2 | 音频播放 | 跨浏览器音频播放，API 简洁 |
| Wavesurfer.js | 7.7 | 音频可视化 | 波形显示，支持交互 |
| Vite | 5.2 | 构建工具 | 极速 HMR，原生 ESM 支持 |
| React Router | 6.23 | 路由 | React 官方路由方案 |

### 为什么用 Zustand 而不是 Redux？

- Zustand API 更简洁，样板代码少
- 不需要 action/reducer/thunk 等概念
- 支持 persist 中间件（自动持久化到 localStorage）
- 对中小型应用更合适

### 为什么用 Ant Design 而不是 Material-UI？

- Ant Design 的暗色主题开箱即用
- 中文文档完善，国内开发者熟悉
- 表格、表单、弹窗等组件功能更丰富

---

## 3. 桌面特性技术选型

| 功能 | 实现方式 | 说明 |
|------|---------|------|
| 系统托盘 | Electron Tray API | 最小化到托盘，右键菜单控制播放 |
| 全局快捷键 | Electron globalShortcut | 媒体键（播放/暂停/上下曲/音量） |
| 自定义标题栏 | frameless window + CSS | 无边框窗口，自定义最小化/最大化/关闭 |
| IPC 通信 | contextBridge + ipcRenderer | 主进程与渲染进程安全通信 |
| 桌面歌词 | Electron 独立窗口（待实现） | 悬浮歌词窗口 |

---

## 4. AI 集成技术选型

| 层 | 技术 | 说明 |
|---|------|------|
| 本地音高检测 | TarsosDSP YIN 算法 | 纯 Java 实现，离线可用 |
| 云端 AI 对话 | OpenAI API / Claude API | 通过 `ai.provider` 配置切换 |
| 混合策略 | 本地分析 → 云端指导 | 基础功能离线，高级功能在线 |

---

## 5. 构建与部署

| 工具 | 用途 |
|------|------|
| Maven | 后端依赖管理和构建 |
| Vite | 前端开发服务器和构建 |
| Electron Builder | Electron 应用打包 |
| Git | 版本控制 |

### 启动命令

```bash
# 后端
cd backend && mvn spring-boot:run

# 前端
cd frontend && npm install && npm run dev
```
