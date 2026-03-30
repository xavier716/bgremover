# 🚀 快速配置指南

## 📋 配置清单

- [ ] 第 1 步：配置 Clerk（5 分钟）
- [ ] 第 2 步：配置 PayPal（5 分钟）
- [ ] 第 3 步：更新 .env.local（2 分钟）
- [ ] 第 4 步：重启开发服务器（1 分钟）
- [ ] 第 5 步：测试功能（5 分钟）

**总时间：约 15-20 分钟**

---

## 👨‍💻 图文配置教程

### 第 1 步：配置 Clerk

#### 1.1 注册 Clerk
```
🌐 访问：https://dashboard.clerk.com
👤 点击右上角 "Sign up"
📧 可以使用邮箱、Google 或 GitHub 注册
✅ 免费账号支持 10,000 月活用户
```

#### 1.2 创建新应用
```
1. 登录后点击 "Add application" 或 "Create app"
2. 填写信息：
   - Application name: bgremover
   - Choose your tech stack: Next.js
3. 点击 "Create application"
```

#### 1.3 复制 API Keys
```
在应用页面找到：
┌─────────────────────────────────────┐
│ API Keys                            │
├─────────────────────────────────────┤
│ Publishable key                     │
│ pk_test_xxxxxxxxxxxxxxxxx           │  ← 复制这个
│                                     │
│ Secret key                          │
│ sk_test_xxxxxxxxxxxxxxxxx           │  ← 复制这个
└─────────────────────────────────────┘

重要：Secret key 只显示一次，请立即复制！
```

#### 1.4 启用社交登录（推荐）
```
左侧菜单 → "SSO Connections" 或 "Social Connections"

找到以下选项并启用：
✅ Google - 点击 "Add" 或 "Enable"
✅ GitHub - 点击 "Add" 或 "Enable"
✅ Facebook - 可选
✅ Apple - 可选

保存设置
```

#### 1.5 配置重定向 URL（自动配置）
```
Clerk 会自动配置：
✅ http://localhost:3001/sign-in
✅ http://localhost:3001/sign-up
✅ http://localhost:3001/dashboard

如果部署到 Vercel，需要添加生产域名
```

---

### 第 2 步：配置 PayPal

#### 2.1 登录 PayPal Developer
```
🌐 访问：https://developer.paypal.com/dashboard/
👤 使用您的 PayPal 账号登录

如果没有账号：
1. 访问 https://www.paypal.com
2. 注册个人账号（免费）
3. 返回 Developer Dashboard
```

#### 2.2 创建应用
```
1. 点击 "Apps & Credentials" 或 "Create App"
2. 填写信息：
   - App name: bgremover
   - Feature: ✅ Accept payments
3. 点击 "Create App"
```

#### 2.3 复制沙盒凭证
```
在应用页面找到：
┌─────────────────────────────────────┐
│ Sandbox API Credentials            │
├─────────────────────────────────────┤
│ Client ID                          │
│ AZxxxxxxxxxxxxxxxxxxxxxxxxx        │  ← 复制这个
│                                     │
│ Secret                             │
│ EJxxxxxxxxxxxxxxxxxxxxxxxxx        │  ← 点击 Show 查看并复制
└─────────────────────────────────────┘

注意：这是沙盒环境，用于测试
```

#### 2.4 测试 PayPal 沙盒账号
```
在同一个页面，找到 "Sandbox accounts"

默认有两个测试账号：
👤 Buyer (买家)
   - Email: buyer@example.com
   - Password: (点击显示)

👤 Seller (卖家)
   - Email: seller@example.com
   - Password: (点击显示)

测试时使用 Buyer 账号登录 PayPal
```

---

### 第 3 步：更新 .env.local

打开项目中的 `.env.local` 文件，填入复制的值：

```bash
# ================================
# Clerk Authentication
# ================================
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_你复制的Key
CLERK_SECRET_KEY=sk_test_你复制的Secret

# ================================
# PayPal Configuration (Sandbox)
# ================================
NEXT_PUBLIC_PAYPAL_CLIENT_ID_SANDBOX=AZ你复制的ClientID
PAYPAL_CLIENT_SECRET_SANDBOX=EJ你复制的Secret
PAYPAL_MODE_SANDBOX=sandbox

# ================================
# Remove.bg (已配置)
# ================================
REMOVEBG_API_KEY=BCcx32apbAZkjeqcrATRtzab
```

**示例：**
```bash
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_aBcDeFgHiJkLmNoPqRsTuVwXyZ
CLERK_SECRET_KEY=sk_test_aBcDeFgHiJkLmNoPqRsTuVwXyZ123456789
NEXT_PUBLIC_PAYPAL_CLIENT_ID_SANDBOX=AZabcdef123456789
PAYPAL_CLIENT_SECRET_SANDBOX=EJabcdef123456789
```

---

### 第 4 步：重启开发服务器

#### 停止当前服务器
```bash
# 按 Ctrl+C 停止
# 或者运行：
pkill -f "next dev"
```

#### 重新启动
```bash
npm run dev
```

**确认加载了环境变量：**
```
✓ Ready in 2.3s
- Environments: .env.local  ← 确认这行存在
```

---

### 第 5 步：测试配置

#### 测试 Clerk（身份验证）
```
1. 访问：http://localhost:3001/sign-in
2. 应该看到 Clerk 登录表单
3. 尝试注册新账号
   - 输入邮箱
   - 设置密码
   - 或使用 "Continue with Google"
4. 注册成功后自动跳转到 /dashboard
5. 右上角显示用户头像
```

#### 测试 PayPal（支付）
```
1. 访问：http://localhost:3001/pricing
2. 点击 "Starter" 或 "Pro" 套餐的 "Get Started"
3. 跳转到 PayPal 沙盒页面
4. 使用测试账号登录：
   - Email: buyer@example.com
   - Password: (在 Developer Dashboard 查看)
5. 同意支付
6. 重定向回 /dashboard
7. 查看额度是否增加
```

---

## 🚨 常见问题排查

### ❌ Clerk 相关问题

**问题 1：登录页面空白**
```
原因：API Keys 未配置或错误
解决：检查 .env.local 中的 Keys 是否正确
```

**问题 2：重定向循环**
```
原因：域名未在 Clerk 中配置
解决：在 Clerk Dashboard → Domains 添加 localhost:3001
```

**问题 3：Google 登录不工作**
```
原因：未在 Clerk 中启用 Google
解决：Social Connections → Google → Enable
```

### ❌ PayPal 相关问题

**问题 1：PayPal 页面 404**
```
原因：Client ID 错误
解决：检查 .env.local 中的 CLIENT_ID
```

**问题 2：支付失败**
```
原因：沙盒账号问题
解决：使用正确的测试账号密码
```

**问题 3：Webhook 失败**
```
原因：本地环境无法接收 Webhook
解决：先测试跳转，Webhook 在生产环境配置
```

---

## 🌐 Vercel 部署配置

配置好本地测试后，在 Vercel 配置生产环境：

### Vercel 环境变量
```
1. 打开 Vercel 项目
2. Settings → Environment Variables
3. 添加以下变量：

Clerk:
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_live_xxxxx
CLERK_SECRET_KEY=sk_live_xxxxx

PayPal (生产环境):
NEXT_PUBLIC_PAYPAL_CLIENT_ID_LIVE=AXxxxxx
PAYPAL_CLIENT_SECRET_LIVE=EJxxxxx
PAYPAL_MODE_LIVE=live

Remove.bg:
REMOVEBG_API_KEY=BCcx32apbAZkjeqcrATRtzab
```

---

## 📝 配置检查清单

完成配置后，确认以下内容：

### Clerk ✅
- [ ] Publishable Key 已复制
- [ ] Secret Key 已复制
- [ ] Google 登录已启用
- [ ] GitHub 登录已启用
- [ ] 重定向 URL 已配置

### PayPal ✅
- [ ] Sandbox Client ID 已复制
- [ ] Sandbox Secret 已复制
- [ ] 测试账号信息已记录
- [ ] 应用已创建

### 本地环境 ✅
- [ ] .env.local 已更新
- [ ] 开发服务器已重启
- [ ] 控制台显示 "Environments: .env.local"
- [ ] 无报错信息

---

## 🎯 下一步

配置完成后：

1. **测试完整流程**
   - 注册账号
   - 使用 10 次免费额度
   - 测试升级提示
   - 购买套餐
   - 验证额度增加

2. **部署到 Vercel**
   - 推送代码到 GitHub
   - 在 Vercel 配置环境变量
   - 测试生产环境

3. **切换 PayPal 到生产模式**
   - 在 PayPal 获取 live 凭证
   - 更新 Vercel 环境变量
   - 测试真实支付

---

**配置时间：15-20 分钟**
**难度：⭐⭐☆☆☆（简单）**

需要帮助？随时告诉我！
