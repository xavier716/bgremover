# 测试指南 / Testing Guide

## 修复内容 / Fixes Applied

### 1. 弹窗选择图片问题 / Image Selection Issue
- ✅ 修复：现在可以点击整个上传区域打开文件选择器
- ✅ Fix: Clicking anywhere on the upload area now opens the file selector

### 2. 按钮可见性问题 / Button Visibility Issue
- ✅ 修复：增大了按钮尺寸和样式，添加了图标和动画效果
- ✅ Fix: Increased button size, added icons and hover animations

## 如何测试 / How to Test

### 步骤 1: 打开应用 / Step 1: Open Application
```
访问: http://localhost:3000
```

### 步骤 2: 上传图片 / Step 2: Upload Image
**方式 A - 点击上传 / Click to Upload:**
1. 点击上传区域的任意位置
2. 在弹出的文件选择器中选择图片

**方式 B - 拖拽上传 / Drag & Drop:**
1. 将图片文件拖拽到上传区域
2. 松开鼠标

### 步骤 3: 去除背景 / Step 3: Remove Background
1. 图片加载后，会看到 **"🎨 Remove Background"** 按钮
2. 点击按钮开始处理
3. 等待进度条完成（可能需要几秒钟）
4. 处理完成后会显示结果

### 步骤 4: 下载图片 / Step 4: Download
- 点击 **"⬇️ Download Image"** 按钮下载处理后的图片
- 点击 **"📷 New Image"** 按钮处理新图片

## 支持的图片格式 / Supported Formats
- JPEG / JPG
- PNG
- WebP
- 其他常见图片格式

## 注意事项 / Notes
- 首次处理可能需要下载 AI 模型（约 20-30MB），会比较慢
- 后续处理会快很多
- 所有处理都在浏览器本地完成，不会上传到服务器
- 推荐使用清晰、主体明显的图片效果最佳

## 常见问题 / Troubleshooting
**Q: 点击后没有反应？**
A: 刷新页面重试，确保选择的是图片文件

**Q: 处理时间过长？**
A: 首次使用需要下载模型，请耐心等待

**Q: 效果不理想？**
A: 尝试使用背景简单、主体清晰的图片
