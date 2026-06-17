# AiToVoice 项目文档

> 文档按主题拆分，避免单文件过大。

---

## 文档目录

### 架构设计

| 文档 | 说明 | 路径 |
|------|------|------|
| 架构决策记录 (ADR) | 所有重要架构决策的备选方案、理由和影响 | [architecture/decisions.md](architecture/decisions.md) |
| 技术选型 | 后端/前端/桌面/AI 各层技术选型及理由 | [architecture/tech-stack.md](architecture/tech-stack.md) |
| 功能方案 | 10 大功能模块的详细设计方案 | [architecture/features.md](architecture/features.md) |

### 数据库

| 文档 | 说明 | 路径 |
|------|------|------|
| 数据库设计 | 22 张表的结构、关系、ER 图 | [database/schema.md](database/schema.md) |
| SQL 初始化脚本 | 建表 + 种子数据 | `backend/src/main/resources/db/init.sql` |

### API

| 文档 | 说明 | 路径 |
|------|------|------|
| API 接口文档 | ~70 个 REST 接口清单 | [api/endpoints.md](api/endpoints.md) |
| Swagger UI | 交互式 API 文档 | http://localhost:8080/swagger-ui.html |

### 代码规范

| 文档 | 说明 | 路径 |
|------|------|------|
| Java 后端规范 | Java 17 语法、分层架构、命名规范 | [conventions/java.md](conventions/java.md) |
| 前端规范 | TypeScript、组件、状态管理、样式 | [conventions/frontend.md](conventions/frontend.md) |

### 项目管理

| 文档 | 说明 | 路径 |
|------|------|------|
| 设计文档总览 | 项目整体设计（索引性质） | [superpowers/specs/2026-06-10-aitovoice-design.md](superpowers/specs/2026-06-10-aitovoice-design.md) |
| 实施计划 | 分阶段实施步骤 | [superpowers/plans/2026-06-10-aitovoice-implementation.md](superpowers/plans/2026-06-10-aitovoice-implementation.md) |

---

## 快速导航

- **想了解为什么这样设计？** → [架构决策记录](architecture/decisions.md)
- **想了解用了什么技术？** → [技术选型](architecture/tech-stack.md)
- **想了解功能怎么实现的？** → [功能方案](architecture/features.md)
- **想了解数据库表结构？** → [数据库设计](database/schema.md)
- **想调用 API？** → [API 接口文档](api/endpoints.md) 或 Swagger UI
- **想贡献代码？** → [Java 规范](conventions/java.md) / [前端规范](conventions/frontend.md)
