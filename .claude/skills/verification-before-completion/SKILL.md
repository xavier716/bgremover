---
name: verification-before-completion
description: 在声称工作完成、修复或通过之前必须执行的质量检查点
origin: Based on ECC verification patterns
trigger: before claiming work complete, before committing code, before creating PR, after bug fixes
tools: Read, Write, Edit, Bash, Grep, Glob
---

# Verification Before Completion

**在使用此工具之前，不要声称工作已完成、已修复或已通过。**

## 🎯 目的

这是一个强制性的质量门控，在代码变更被声明为"完成"之前执行。它防止未完成或有问题的代码进入代码库。

## 🚦 何时使用

- ✅ 即将声称功能实现完成
- ✅ 准备提交代码到 git
- ✅ 创建 Pull Request 之前
- ✅ 修复 bug 后验证修复
- ✅ 重构代码后验证功能

## 📋 检查清单

### 1. 功能验证（必须）

- [ ] **需求完整性**
  - 所有需求已实现
  - 没有遗漏的功能点
  - 边界情况已处理

- [ ] **手动测试**
  - 主要用户流程可以正常执行
  - 错误场景被正确处理
  - UI 响应符合预期

- [ ] **回归检查**
  - 现有功能没有被破坏
  - 相关功能仍然正常工作

### 2. 代码质量（必须）

- [ ] **代码规范**
  - 函数保持在 50 行以内
  - 文件保持在 800 行以内
  - 没有深层嵌套（>4 层）
  - 变量和函数命名清晰

- [ ] **类型安全**
  - 没有 `any` 类型（除非绝对必要）
  - TypeScript 编译无错误
  - 正确使用类型注解

- [ ] **错误处理**
  - 所有异步操作有错误处理
  - 用户友好的错误消息
  - 适当的日志记录

### 3. 测试覆盖（推荐）

- [ ] **单元测试**
  - 新功能有测试覆盖
  - 边界情况有测试
  - 错误路径有测试

- [ ] **集成测试**
  - API 端点有测试
  - 数据库操作有测试
  - 外部服务调用有 mock

- [ ] **测试通过**
  - 所有测试通过
  - 测试覆盖率 ≥ 80%
  - 没有跳过的测试

### 4. 安全检查（必须）

- [ ] **密钥管理**
  - 无硬编码的 API 密钥
  - 无敏感信息在代码中
  - 环境变量正确使用

- [ ] **输入验证**
  - 用户输入已验证
  - 文件上传有大小限制
  - SQL 注入防护

- [ ] **认证授权**
  - 受保护的端点有认证
  - 使用限制正确实施
  - 用户数据隔离

### 5. 性能检查（推荐）

- [ ] **加载性能**
  - 图片优化（使用 next/image）
  - 代码分割适当
  - 不必要的渲染已避免

- [ ] **API 优化**
  - 避免重复请求
  - 实施缓存（如适用）
  - 响应时间合理

### 6. 文档（推荐）

- [ ] **代码注释**
  - 复杂逻辑有注释
  - 关键决策有说明
  - API 变更已记录

- [ ] **用户文档**
  - 新功能有说明（如适用）
  - 配置变更已更新
  - 迁移指南已提供（如需要）

## 🔍 验证步骤

### 步骤 1：本地测试

```bash
# 运行测试套件
npm test

# 检查测试覆盖率
npm run test:coverage

# 类型检查
npm run type-check

# 代码风格检查
npm run lint

# 构建验证
npm run build
```

### 步骤 2：手动测试

1. **启动开发服务器**
   ```bash
   npm run dev
   ```

2. **测试主要用户流程**
   - 图片上传
   - 背景移除
   - 使用次数检查
   - 登录/登出
   - 购买流程（如适用）

3. **测试错误场景**
   - 上传无效文件
   - 超过使用限制
   - 网络错误
   - API 错误响应

### 步骤 3：代码审查

使用以下工具进行自动审查：

```bash
# 检查安全问题
npm audit

# 检查依赖漏洞
npm outdated

# 检查代码复杂度（如已安装）
npx complexity-report src/
```

### 步骤 4：Git 提交前检查

```bash
# 查看变更的文件
git status

# 查看具体变更
git diff

# 确认只提交相关文件
git add <files>

# 创建有意义的提交信息
git commit -m "type: description"
```

## ⚠️ 常见问题

### Q: 如果测试失败怎么办？

**A:** 不要声称工作完成。按以下顺序修复：

1. 分析失败的测试
2. 确定是代码问题还是测试问题
3. 修复代码（不要修改测试以匹配错误行为）
4. 重新运行测试
5. 重复直到所有测试通过

### Q: 如果发现安全问题怎么办？

**A:** 立即停止：

1. 识别安全问题
2. 评估严重程度
3. 修复安全问题
4. 验证修复
5. 检查代码库中是否有类似问题
6. 更新安全最佳实践文档

### Q: 如果代码不符合规范怎么办？

**A:** 在声称完成之前重构：

1. 识别不符合规范的代码
2. 重构以提高可读性
3. 确保功能没有改变
4. 重新运行测试
5. 提交重构

## 🎯 完成标准

只有满足以下所有条件时，才能声称工作完成：

- ✅ 所有功能需求已实现
- ✅ 所有测试通过
- ✅ 代码符合规范
- ✅ 安全检查通过
- ✅ 手动测试成功
- ✅ 文档已更新（如需要）

## 📝 示例工作流程

### 场景：添加新功能

1. **实现功能**
   ```bash
   # 编写代码
   # 编写测试
   ```

2. **运行验证**
   ```bash
   # 运行测试
   npm test

   # 类型检查
   npm run type-check

   # 代码风格检查
   npm run lint
   ```

3. **手动测试**
   - 启动开发服务器
   - 测试新功能
   - 测试相关功能

4. **安全检查**
   ```bash
   # 审查代码中的安全问题
   # 检查是否有硬编码密钥
   # 验证输入验证
   ```

5. **提交代码**
   ```bash
   # 只在所有检查通过后提交
   git add .
   git commit -m "feat: add new feature"
   ```

### 场景：修复 Bug

1. **识别问题**
   - 理解 bug 的根本原因
   - 确定修复范围

2. **实施修复**
   - 编写修复代码
   - 编写测试以防止回归
   - 验证修复

3. **验证修复**
   ```bash
   # 运行受影响的测试
   npm test -- <test-file>

   # 运行完整测试套件
   npm test

   # 手动测试修复的场景
   ```

4. **检查回归**
   - 测试相关功能
   - 确保没有引入新问题

5. **提交修复**
   ```bash
   git add .
   git commit -m "fix: describe the bug fix"
   ```

## 🔗 相关技能

- `test-driven-development` - TDD 工作流程
- `security-reviewer` - 深度安全审查
- `code-reviewer` - 代码质量审查
- `writing-plans` - 复杂功能的规划

## 📚 参考资源

- [ECC AGENTS.md](https://github.com/affaan-m/everything-claude-code/blob/main/AGENTS.md) - Agent 最佳实践
- [Testing Best Practices](https://github.com/goldbergyoni/javascript-testing-best-practices) - JavaScript 测试最佳实践
- [Next.js Testing](https://nextjs.org/docs/testing) - Next.js 测试指南

---

**记住：** 跳过验证步骤会导致：
- 更多 bug
- 技术债务累积
- 代码审查时间增加
- 生产环境问题

**投入时间验证可以节省更多时间修复。**
