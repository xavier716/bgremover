# 🚀 NextAuth.js 快速配置 - 3 步完成

## ⏰ 总时间：15-20 分钟

---

## 📋 配置清单

- [ ] 步骤 1：配置 Google OAuth（10 分钟）
- [ ] 步骤 2：配置 GitHub OAuth（5 分钟）
- [ ] 步骤 3：更新 .env.local（2 分钟）

---

## 步骤 1：配置 Google OAuth

### 1.1 访问 Google Console
```
🌐 https://console.cloud.google.com
👤 使用您的 Google 账号登录
```

### 1.2 创建项目
```
1. 点击顶部项目选择器
2. 点击 "NEW PROJECT"
3. 项目名称：bgremover
4. 点击 "CREATE"
```

### 1.3 启用 Google+ API
```
1. 顶部搜索框搜索 "Google+ API"
2. 点击进入，点击 "ENABLE"
```

### 1.4 创建 OAuth 凭证
```
1. 左侧菜单 → "Credentials"
2. 点击 "+ CREATE CREDENTIALS"
3. 选择 "OAuth client ID"
4. 应用类型选择 "Web application"
```

### 1.5 配置 OAuth
```
Name: bgremover
Authorized JavaScript origins:
- http://localhost:3000
- http://localhost:3001

Authorized redirect URIs:
- http://localhost:3000/api/auth/callback/google
- http://localhost:3001/api/auth/callback/google
- https://your-app.vercel.app/api/auth/callback/google
```

### 1.6 获取凭证
```
创建完成后会显示：
Client ID: 123456789-abcdefg.apps.googleusercontent.com
Client Secret: GOCSPX-xxxxxxxxx

复制这两个值
```

---

## 步骤 2：配置 GitHub OAuth

### 2.1 访问 GitHub 开发者设置
```
🌐 https://github.com/settings/developers
👤 登录您的 GitHub 账号
```

### 2.2 新建 OAuth App
```
1. 点击 "New OAuth App"
2. 填写信息：
   Application name: bgremover
   Homepage URL: http://localhost:3000
   Authorization callback URL:
   http://localhost:3000/api/auth/callback/github
   Application description: Background remover app
3. 勾选 "Device Authorization flow"
4. 点击 "Register application"
```

### 2.3 获取凭证
```
在应用页面找到：
Client ID: xxxxxxxxxxxxxxxx
Client Secret: ghp_xxxxxxxxxxxxxxxxxxxx

点击 "Generate a new client secret" 创建 Secret
复制这两个值
```

---

## 步骤 3：更新 .env.local

打开项目中的 `.env.local` 文件，更新以下内容：

```bash
# NextAuth.js Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-here

# Google OAuth（从步骤 1 获取）
GOOGLE_CLIENT_ID=123456789-abcdefg.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-xxxxxxxxx

# GitHub OAuth（从步骤 2 获取）
GITHUB_CLIENT_ID=xxxxxxxxxxxxxxxxxxxxx
GITHUB_CLIENT_SECRET=ghp_xxxxxxxxxxxxxxxxxxxx
```

**生成 NEXTAUTH_SECRET：**
```bash
# 方式 1：使用 OpenSSL
openssl rand -base64 32

# 方式 2：使用在线工具
访问：https://generate-secret.vercel.app/32
复制生成的 Secret
```

---

## 🧪 测试配置

### 重启开发服务器
```bash
# 停止当前服务器（Ctrl+C）
# 重新启动
npm run dev
```

### 测试 Google 登录
```
1. 访问：http://localhost:3000/sign-in
2. 点击 "Continue with Google"
3. 选择 Google 账号
4. 授权应用
5. 自动跳转到 /dashboard
```

### 测试 GitHub 登录
```
1. 访问：http://localhost:3000/sign-in
2. 点击 "Continue with GitHub"
3. 输入 GitHub 凭据
4. 授权应用
5. 自动跳转到 /dashboard
```

---

## 🚨 常见问题

### Q1: Google 登录失败
```
错误：redirect_uri_mismatch
解决：检查 .env.local 中的 NEXTAUTH_URL 是否正确
     确保 OAuth 配置中的重定向 URI 包含本地 URL
```

### Q2: GitHub 登录失败
```
错误：Application does not allow authorization
解决：检查 GitHub OAuth App 设置
     确保 Authorization callback URL 正确
```

### Q3: 环境变量未生效
```
解决：
1. 确认 .env.local 文件在项目根目录
2. 重启开发服务器
3. 检查控制台是否显示 "Environments: .env.local"
```

---

## 📱 登录页面预览

### Google 登录按钮
```
┌─────────────────────────────────┐
│  [🇬] Continue with Google       │
├─────────────────────────────────┤
│  [🐙] Continue with GitHub       │
│  [✉️] Continue with Email        │
└─────────────────────────────────┘
```

### 登录成功后
```
┌─────────────────────────────────┐
│  Welcome back!                   │
│  user@example.com                 │
│  [Sign Out]                      │
└─────────────────────────────────┘
```

---

## ✅ 验证清单

测试以下功能确保配置成功：

- [ ] Google 登录成功
- [ ] GitHub 登录成功
- [ ] 用户名正确显示
- [ ] 邮箱正确显示
- [ ] 头像显示（如果有）
- [ ] Session 持久化
- [ ] 登出功能正常
- [ ] 受保护页面（/dashboard）需要认证

---

## 🌐 生产环境部署

在 Vercel 部署时，需要更新环境变量：

```bash
# 生产环境
NEXTAUTH_URL=https://your-app.vercel.app
NEXTAUTH_SECRET=your-production-secret

# Google
GOOGLE_CLIENT_ID=your_production_client_id
GOOGLE_CLIENT_SECRET=your_production_secret

# GitHub
GITHUB_CLIENT_ID=your_production_client_id
GITHUB_CLIENT_SECRET=your_production_secret
```

**重要：** 在 Google Console 和 GitHub OAuth App 中添加生产环境的重定向 URI：
- `https://your-app.vercel.app/api/auth/callback/google`
- `https://your-app.vercel.app/api/auth/callback/github`

---

## 📊 功能对比

### 之前（Clerk）
- ❌ 免费限额：10,000 MAU
- ❌ 超限后付费：$25/月起
- ❌ 数据存储在 Clerk 服务器

### 现在（NextAuth.js）
- ✅ 完全免费
- ✅ 无用户数量限制
- ✅ 数据完全掌控
- ✅ 开源自托管

**节省：** 每月 $0 - $99

---

## 🎉 完成！

**配置完成后，您的应用拥有：**
- ✅ 无限免费用户
- ✅ Google 一键登录
- ✅ GitHub 一键登录
- ✅ 完全的数据掌控
- ✅ 零额外成本

---

**总配置时间：** 15-20 分钟
**难度：** ⭐⭐☆☆☆（简单）

有任何问题随时告诉我！
