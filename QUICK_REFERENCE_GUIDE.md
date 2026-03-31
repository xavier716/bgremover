# 🚀 技能快速参考指南

## 📋 5 个核心技能速查

### 🔴 verification-before-completion
**何时使用：** 提交代码、创建 PR、修复 bug 后
**关键检查：**
- ✅ 所有功能需求已实现
- ✅ 所有测试通过（覆盖率 ≥ 80%）
- ✅ 无安全漏洞
- ✅ 代码符合规范

**快速命令：**
```
/skill verification-before-completion
```

---

### 🟢 nextjs-best-practices
**何时使用：** 编写 Next.js 代码、优化性能
**关键原则：**
- ✅ Server Components 默认
- ✅ Client Components 最小化
- ✅ 优化图片、字体、代码分割
- ✅ 类型安全

**常见陷阱：**
```
❌ 在 Server Component 中使用 useState/useEffect
✅ 拆分为 Client Component
```

---

### 🔵 tailwind-patterns
**何时使用：** 设计 UI、创建组件
**常用组件：**
```tsx
// 按钮
<button className="btn-primary">点击</button>

// 卡片
<div className="card">内容</div>

// 输入框
<input className="input" />
```

**设计系统：**
- 颜色：blue-600, purple-600, green-600
- 间距：4 (1rem), 6 (1.5rem), 8 (2rem)
- 圆角：rounded-lg, rounded-xl, rounded-2xl

---

### 🟣 bg-removal-workflow
**何时使用：** 实现背景移除功能
**完整流程：**
```
1. 图片上传 → 文件验证
2. 使用检查 → 限制验证
3. API 调用 → 进度显示
4. 结果展示 → 次数更新
5. 错误处理 → 友好提示
```

**关键文件：**
- `app/page.tsx` - 主界面
- `app/api/remove-background/route.ts` - API 路由
- `lib/utils/usage.ts` - 使用量追踪

---

### 🟡 user-onboarding-flow
**何时使用：** 优化转化率、设计用户旅程
**转化漏斗：**
```
匿名使用 (3 次免费)
    ↓
使用 1-2 次
    ↓
引导注册 (保留进度)
    ↓
用完免费次数
    ↓
升级提示 (付费转换)
```

**关键时机：**
- 剩余 1 次：提示注册
- 剩余 0 次：显示升级
- 注册后：平滑过渡

---

## ⚡ 快速工作流

### 开发新功能
```
1. 规划 → bg-removal-workflow
2. 编写 → nextjs-best-practices
3. 样式 → tailwind-patterns
4. 验证 → verification-before-completion
5. 提交 → git commit
```

### 优化用户体验
```
1. 分析 → user-onboarding-flow
2. 设计 → tailwind-patterns
3. 实现 → nextjs-best-practices
4. 测试 → bg-removal-workflow
5. 发布 → git push
```

### 代码审查
```
1. 阅读 → nextjs-best-practices
2. 检查 → verification-before-completion
3. 测试 → bg-removal-workflow
4. 反馈 → 代码审查建议
5. 修复 → 重新提交
```

---

## 🎯 常见任务速查

### 任务 1：创建新 API 路由
```
1. 查看 nextjs-best-practices → API Routes 部分
2. 创建 app/api/your-route/route.ts
3. 实施类型安全、错误处理
4. 运行 verification-before-completion
5. 提交代码
```

### 任务 2：设计新组件
```
1. 查看 tailwind-patterns → 组件模式
2. 选择合适的组件模板
3. 调整样式和交互
4. 测试响应式
5. 集成到页面
```

### 任务 3：优化转化率
```
1. 查看 user-onboarding-flow → 转化策略
2. 识别优化点
3. 实施 A/B 测试
4. 测量效果
5. 迭代改进
```

### 任务 4：修复 Bug
```
1. 理解问题 → bg-removal-workflow
2. 定位代码 → Grep 工具
3. 修复问题 → nextjs-best-practices
4. 验证修复 → 测试策略
5. 提交代码 → verification-before-completion
```

---

## 📚 文档导航

### 快速查阅
- **[FINAL_SKILLS_SUMMARY.md](FINAL_SKILLS_SUMMARY.md)** - 完整总结
- **[SKILL_OPTIMIZATION_ANALYSIS.md](SKILL_OPTIMIZATION_ANALYSIS.md)** - 优化分析
- **[SKILLS_IMPLEMENTATION_SUMMARY.md](SKILLS_IMPLEMENTATION_SUMMARY.md)** - 实施指南

### 技能文档
- **[.claude/skills/verification-before-completion/SKILL.md](.claude/skills/verification-before-completion/SKILL.md)**
- **[.claude/skills/nextjs-best-practices/SKILL.md](.claude/skills/nextjs-best-practices/SKILL.md)**
- **[.claude/skills/tailwind-patterns/SKILL.md](.claude/skills/tailwind-patterns/SKILL.md)**
- **[.claude/skills/bg-removal-workflow/SKILL.md](.claude/skills/bg-removal-workflow/SKILL.md)**
- **[.claude/skills/user-onboarding-flow/SKILL.md](.claude/skills/user-onboarding-flow/SKILL.md)**

---

## 🎓 学习路径

### 第 1 天：熟悉技能
1. 阅读 FINAL_SKILLS_SUMMARY.md
2. 浏览 5 个技能文档
3. 在实际开发中尝试使用

### 第 2-3 天：深入实践
1. 选择最相关的技能
2. 在多个场景中使用
3. 记录使用体验

### 第 4-5 天：扩展应用
1. 基于项目需求创建新技能
2. 优化现有技能
3. 建立使用规范

### 第 6-7 天：团队推广
1. 分享技能文档
2. 培训团队成员
3. 收集反馈改进

---

## 💡 使用技巧

### 技巧 1：组合使用技能
```
同时使用多个技能解决复杂问题：
- verification + nextjs → 高质量代码
- tailwind + bg-removal → 美观且功能完善
- onboarding + tailwind → 高转化率界面
```

### 技巧 2：定制化技能
```
基于现有技能创建项目特定版本：
- 复制技能文件
- 调整内容
- 添加项目特定示例
- 保持结构一致
```

### 技巧 3：持续优化
```
定期回顾和更新技能：
- 收集使用反馈
- 记录最佳实践
- 更新文档内容
- 添加新的示例
```

---

## 🎯 成功检查清单

使用这些技能后，检查是否达成：

### 质量指标
- [ ] 代码审查时间减少
- [ ] Bug 数量减少
- [ ] 代码一致性提高

### 效率指标
- [ ] 开发速度提升
- [ ] 决策时间减少
- [ ] 新人上手更快

### 业务指标
- [ ] 用户满意度提高
- [ ] 转化率提升
- [ ] 支持成本降低

---

## 🚀 立即开始

### 今天就做
1. ✅ 打开项目
2. ✅ 选择一个技能
3. ✅ 在实际开发中使用
4. ✅ 体验价值

### 本周完成
1. ⏳ 使用所有 5 个技能
2. ⏳ 创建 1 个新技能
3. ⏳ 优化现有技能

### 本月达成
1. 📅 建立技能使用习惯
2. 📅 扩展技能库
3. 📅 团队标准化

---

## 📞 需要帮助？

### 常见问题

**Q: 如何选择合适的技能？**
A: 根据当前任务选择：
- 编写代码 → nextjs-best-practices
- 设计 UI → tailwind-patterns
- 提交代码 → verification-before-completion
- 核心功能 → bg-removal-workflow
- 用户体验 → user-onboarding-flow

**Q: 技能不适用怎么办？**
A: 技能提供的是最佳实践指导，不是强制规则。根据实际情况灵活应用。

**Q: 如何创建新技能？**
A: 复制现有技能文件，调整内容，保持结构一致。

**Q: 技能过时了怎么办？**
A: 定期回顾和更新，确保与项目发展同步。

---

## 🌟 记住

**这些技能是你的开发助手，不是限制。**
- 灵活应用，不要生搬硬套
- 根据实际情况调整
- 持续优化和改进
- 分享经验和反馈

**祝你开发愉快！** 🚀

---

**创建时间：** 2026-03-31
**技能总数：** 5 个核心技能
**文档总数：** 4 个参考文档
**状态：** ✅ 已推送至 GitHub
**下一步：** 开始使用，持续优化

**访问 GitHub 仓库查看所有技能：**
https://github.com/xavier716/bgremover
