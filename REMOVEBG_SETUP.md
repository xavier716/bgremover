# Remove.bg API Integration Guide

## 🚀 快速开始

### 1. 获取 Remove.bg API Key

1. 访问 [https://www.remove.bg/api](https://www.remove.bg/api)
2. 点击 "Get API Key"
3. 注册账号（免费）
4. 复制您的 API Key

**免费额度：**
- ✅ 每月 50 张图片
- ✅ 无需信用卡
- ✅ 即时激活

**付费计划：**
- 💰 $0.20/张（按需付费）
- 💼 专业版：$39/月（500 张）
- 🏢 企业版：$89/月（1000 张）

---

## 📋 配置步骤

### 本地开发

1. **创建环境变量文件：**
   ```bash
   cp .env.local.example .env.local
   ```

2. **编辑 `.env.local`：**
   ```env
   REMOVEBG_API_KEY=your_actual_api_key_here
   ```

3. **启动开发服务器：**
   ```bash
   npm run dev
   ```

### Vercel 部署

1. **登录 Vercel Dashboard：**
   - 访问您的项目设置

2. **添加环境变量：**
   - 进入 Settings → Environment Variables
   - 添加以下变量：
     - Name: `REMOVEBG_API_KEY`
     - Value: `your_actual_api_key_here`
     - Environments: 选择 Production, Preview, Development

3. **重新部署：**
   - 推送代码后自动重新部署
   - 或在 Vercel 手动触发重新部署

---

## 🔧 API 限制说明

### 文件大小限制
- 最大文件大小：**10 MB**
- 推荐大小：**< 5 MB**（获得最佳性能）

### 频率限制
- 免费版：无明确限制
- 付费版：根据套餐而定

### 支持的图片格式
- JPG / JPEG
- PNG
- WebP
- BMP

---

## ❌ 常见错误处理

### 错误 1: "API key not configured"
**原因：** 环境变量未设置

**解决方案：**
- 本地：检查 `.env.local` 文件
- Vercel：检查 Environment Variables 设置

### 错误 2: "Invalid API key"
**原因：** API Key 错误或已过期

**解决方案：**
- 重新获取 API Key
- 检查复制时是否有多余空格
- 验证 Key 是否有效

### 错误 3: "Insufficient API credits"
**原因：** 已达到免费额度限制

**解决方案：**
- 等待下月重置（免费版每月1日重置）
- 升级到付费计划

### 错误 4: "Rate limit exceeded"
**原因：** 请求过于频繁

**解决方案：**
- 添加请求延迟
- 考虑升级套餐

---

## 🎯 使用示例

### 上传图片
1. 选择图片文件
2. 点击 "Remove Background" 按钮
3. 等待处理完成（通常 2-5 秒）
4. 查看并下载处理后的图片

### 批量处理
当前版本一次处理一张图片。批量处理功能可以后续添加。

---

## 🔒 安全建议

1. **永远不要提交 API Key 到 Git**
   - `.env.local` 已在 `.gitignore` 中
   - `.env.example` 仅作为模板

2. **定期轮换 API Key**
   - 每月更换一次
   - 如有泄露立即更换

3. **监控使用量**
   - 定期检查 Remove.bg Dashboard
   - 设置使用量警报

---

## 📊 成本估算

### 免费版
- 50 张/月
- 适合：个人使用、测试

### 按需付费
- $0.20/张
- 适合：偶尔使用

### 专业版（推荐）
- $39/月 = 500 张
- 每张成本：$0.078
- 适合：小型应用

### 企业版
- $89/月 = 1000 张
- 每张成本：$0.089
- 适合：商业应用

---

## 🆘 技术支持

### Remove.bg 官方文档
- API 文档：https://www.remove.bg/api
- 常见问题：https://www.remove.bg/api#faq
- 联系支持：support@remove.bg

### 项目相关问题
- 查看代码：`app/api/remove-background/route.ts`
- 检查配置：`.env.local`

---

## ✅ 验证安装

运行以下命令验证配置是否正确：

```bash
# 检查环境变量
grep REMOVEBG_API_KEY .env.local

# 测试 API 连接
npm run dev
# 访问 http://localhost:3000
# 上传一张图片测试
```

---

**最后更新：** 2026-03-30
**状态：** ✅ 生产就绪
