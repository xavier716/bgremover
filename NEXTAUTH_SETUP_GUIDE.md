# NextAuth.js 免费身份验证 - 配置指南

## ✅ 迁移完成

**Clerk ❌ → NextAuth.js ✅**

从 Clerk（有用户限制）迁移到 **NextAuth.js（完全免费，无限制）**

---

## 🎉 成功迁移的内容

### ✅ 已完成
- ✅ 移除 Clerk 依赖
- ✅ 安装 NextAuth.js
- ✅ 配置 Google OAuth
- ✅ 配置 GitHub OAuth
- ✅ 创建自定义登录页面
- ✅ 更新所有 UI 组件
- ✅ 更新中间件
- ✅ 更新 API 路由
- ✅ 构建测试通过

### 📊 功能对比

| 功能 | Clerk | NextAuth.js |
|------|-------|-------------|
| **费用** | 免费 10k MAU，之后付费 | ✅ 完全免费，无限用户 |
| **用户限制** | 有限制 | ✅ 无限制 |
| **Google 登录** | ✅ 支持 | ✅ 支持 |
| **GitHub 登录** | ✅ 支持 | ✅ 支持 |
| **自托管** | ❌ Clerk 托管 | ✅ 完全自托管 |
| **数据掌控** | 第三方 | ✅ 完全掌控 |
| **开源** | ❌ 闭源 | ✅ 开源 |

---

## 🔧 需要配置的 OAuth

### 1. Google OAuth（免费，无限制）

**步骤：**
```
1. 访问：https://console.cloud.google.com
2. 创建新项目（或选择现有项目）
3. 启用 Google+ API
4. 配置 OAuth 同意屏幕
5. 获取 Client ID 和 Secret
```

**详细步骤：**
```
a) 创建项目
   - 点击 "Select a project" → "NEW PROJECT"
   - 项目名称：bgremover

b) 启用 API
   - 搜索 "Google+ API"
   - 点击 "ENABLE"

c) 配置 OAuth
   - 左侧菜单 → "Credentials" → "Create Credentials"
   - 选择 "OAuth client ID"
   - 应用类型：Web application
   - 授权重定向 URI：
     * http://localhost:3000/api/auth/callback/google
     * http://localhost:3001/api/auth/callback/google
     * https://your-domain.vercel.app/api/auth/callback/google

d) 获取凭证
   - 复制 Client ID
   - 复制 Client Secret
```

### 2. GitHub OAuth（免费，无限制）

**步骤：**
```
1. 访问：https://github.com/settings/developers
2. 点击 "New OAuth App"
3. 填写信息：
   - Application name: bgremover
   - Homepage URL: http://localhost:3000
   - Authorization callback URL: http://localhost:3000/api/auth/callback/github
4. 获取 Client ID 和 Client Secret
```

---

## 📝 配置 .env.local

打开 `.env.local` 文件，添加获取的凭证：

```bash
# NextAuth.js Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=generate-a-random-secret-use-openssl-rand-base64-32

# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id_here
GOOGLE_CLIENT_SECRET=your_google_client_secret_here

# GitHub OAuth
GITHUB_CLIENT_ID=your_github_client_id_here
GITHUB_CLIENT_SECRET=your_github_client_secret_here
```

**生成 NEXTAUTH_SECRET：**
```bash
# Windows (PowerShell)
openssl rand -base64 32

# 或使用在线工具生成
# https://generate-secret.vercel.app/32
```

---

## 🚀 测试登录流程

### 本地测试

```bash
# 1. 重启开发服务器
npm run dev

# 2. 访问登录页面
http://localhost:3000/sign-in

# 3. 点击 "Continue with Google" 或 "Continue with GitHub"
# 4. 授权应用
# 5. 自动跳转到 /dashboard
```

### 测试清单

- [ ] Google 登录成功
- [ ] GitHub 登录成功
- [ ] 用户信息正确显示
- [ ] Session 正常工作
- [ ] 登出功能正常
- [ ] 受保护路由（/dashboard）需要认证

---

## 🌐 Vercel 部署配置

在 Vercel 项目中添加环境变量：

```bash
# NextAuth.js
NEXTAUTH_URL=https://your-domain.vercel.app
NEXTAUTH_SECRET=your-production-secret

# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# GitHub OAuth
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret
```

**重要：** 重定向 URI 需要更新为生产域名：
- `https://your-domain.vercel.app/api/auth/callback/google`
- `https://your-domain.vercel.app/api/auth/callback/github`

---

## 🎨 新的登录页面

### 访问地址
```
登录：http://localhost:3000/sign-in
```

### 功能
- ✅ Google 一键登录
- ✅ GitHub 一键登录
- ✅ 优雅的 UI 设计
- ✅ 移动端友好
- ✅ 错误处理

---

## 🔄 数据持久化（可选）

当前版本使用 **JWT Session**（无数据库），功能包括：
- ✅ 用户登录/登出
- ✅ 社交账号关联
- ✅ 会话管理
- ✅ 受保护路由

**如需数据库存储（可选）：**
- ✅ 使用记录
- ✅ 付费历史
- ✅ 用户偏好设置

可以后续添加：
- Vercel Postgres
- PlanetScale
- Supabase

---

## 📊 成本对比

### Clerk（已移除）
```
免费：10,000 MAU
付费：$25/月起（100k MAU）
企业：$99/月起
```

### NextAuth.js（当前）
```
免费：✅ 无限用户
付费：$0（完全免费）
维护：自托管（无额外成本）
```

**节省：** 每月 $0 - $99+

---

## 🎯 完成状态

✅ **代码迁移完成**
✅ **构建测试通过**
✅ **所有功能保留**
✅ **Google/GitHub 登录就绪**

---

## 📋 下一步

1. **配置 Google OAuth**（10 分钟）
2. **配置 GitHub OAuth**（5 分钟）
3. **更新 .env.local**
4. **测试登录流程**
5. **部署到 Vercel**

**预计时间：** 20 分钟

---

## 🆘 技术支持

- NextAuth.js 文档：https://next-auth.js.org
- Google OAuth：https://console.cloud.google.com
- GitHub OAuth：https://github.com/settings/developers

---

**创建时间：** 2026-03-30
**状态：** ✅ 完全免费，无限制
**节省成本：** $0 - $99/月
