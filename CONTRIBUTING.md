# 贡献指南

## 开发流程

1. Fork 本仓库
2. 创建功能分支: `git checkout -b feature/your-feature`
3. 提交代码: `git commit -m "feat: add your feature"`
4. 推送分支: `git push origin feature/your-feature`
5. 创建 Pull Request

## 提交规范

使用 Conventional Commits 格式：

- `feat:` 新功能
- `fix:` 修复 bug
- `docs:` 文档更新
- `style:` 代码格式（不影响逻辑）
- `refactor:` 重构
- `test:` 测试
- `chore:` 构建/工具

示例：
```
feat: add voice recording analysis
fix: resolve login token expiration issue
docs: update API documentation
```

## 代码规范

### Java (后端)

- Java 17 语法（switch 表达式、Stream、Records）
- 构造器注入，禁止 @Autowired 字段注入
- Entity 不作为 API 响应
- 所有表包含逻辑删除字段

### TypeScript (前端)

- TypeScript strict 模式
- 函数式组件 + Hooks
- Zustand 状态管理
- Ant Design 组件库

## 测试

```bash
# 后端测试
cd backend && mvn test

# 前端类型检查
cd frontend && npm run typecheck
```
