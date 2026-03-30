# Vercel Deployment Guide

## ✅ Current Status

This project has been successfully configured for Vercel deployment with real background removal functionality using Remove.bg API.

## 🚀 Deployment Steps

### 1. Get Remove.bg API Key

**必须步骤：** 获取 API Key 才能使用背景移除功能

1. 访问 [https://www.remove.bg/api](https://www.remove.bg/api)
2. 注册免费账号
3. 复制您的 API Key
4. 免费额度：每月 50 张图片

详细配置请查看 [REMOVEBG_SETUP.md](REMOVEBG_SETUP.md)

### 2. Connect Your GitHub Repository

1. Go to [vercel.com](https://vercel.com)
2. Click "Add New Project"
3. Import your GitHub repository: `xavier716/bgremover`
4. Vercel will automatically detect Next.js

### 3. Add Environment Variable

**重要：** 在部署前必须配置 API Key

1. 在 Vercel 项目中，进入 **Settings → Environment Variables**
2. 添加以下变量：
   - **Name:** `REMOVEBG_API_KEY`
   - **Value:** 您的 Remove.bg API Key
   - **Environments:** 勾选 All (Production, Preview, Development)

### 4. Configure Build Settings (Auto-detected)

Vercel will automatically use:
- **Framework Preset**: Next.js
- **Build Command**: `npm run build`
- **Output Directory**: `.next`
- **Install Command**: `npm install`

### 5. Deploy

Click "Deploy" and wait for the build to complete.

## ✨ Features

- ✅ Next.js 14 with App Router
- ✅ Tailwind CSS styling
- ✅ Bilingual support (English/Chinese)
- ✅ Zero-scroll viewport design
- ✅ Responsive layout
- ✅ Image upload and preview
- ✅ **Real background removal** powered by Remove.bg API

## 🔧 Technical Implementation

### API Route
- **Endpoint:** `/api/remove-background`
- **Method:** POST
- **Authentication:** API Key via environment variable
- **File Size Limit:** 10MB
- **Supported Formats:** JPG, PNG, WebP, BMP

### Frontend Features
- Drag & drop image upload
- Real-time progress tracking
- Side-by-side comparison (original vs processed)
- Download processed image
- Error handling with user-friendly messages
- Bilingual interface (English/Chinese)

## 📊 Build Statistics

Latest successful build:
- Main page size: ~95 kB (including API integration)
- Build time: ~30 seconds
- Status: ✅ Production ready

## 🐛 Troubleshooting

### Issue: "API key not configured"
**Solution:** Add `REMOVEBG_API_KEY` environment variable in Vercel settings.

### Issue: "Invalid API key"
**Solution:**
1. Verify your API key at [remove.bg](https://www.remove.bg/api)
2. Check for extra spaces when copying
3. Ensure the key is active

### Issue: "Insufficient credits"
**Solution:**
- Free tier: 50 images/month (resets on 1st of each month)
- Upgrade to paid plan for more credits

### Issue: Build errors
**Solution:**
1. Clear build cache in Vercel settings
2. Verify all dependencies are installed
3. Check Next.js version compatibility

## 🔒 Security Notes

- ✅ API keys stored as environment variables
- ✅ Never commit `.env.local` files
- ✅ `.gitignore` configured properly
- ✅ No sensitive data in client-side code

## 📈 Cost & Pricing

### Free Tier (Recommended for testing)
- 50 images/month
- $0 cost
- Perfect for personal use

### Pay-As-You-Go
- $0.20 per image
- No monthly commitment
- Suitable for occasional use

### Professional Plan
- $39/month for 500 images
- $0.078 per image
- Best for small applications

### Enterprise Plan
- $89/month for 1,000 images
- $0.089 per image
- For production applications

## 📚 Documentation

- [REMOVEBG_SETUP.md](REMOVEBG_SETUP.md) - Detailed API setup guide
- [README.md](README.md) - Project overview
- [I18N_FEATURES.md](I18N_FEATURES.md) - Internationalization guide
- [VIEWPORT_OPTIMIZATION.md](VIEWPORT_OPTIMIZATION.md) - UI/UX design

## 🚀 Next Steps

After successful deployment:

1. Test with sample images
2. Monitor API usage in Remove.bg dashboard
3. Set up usage alerts
4. Consider upgrading plan if needed
5. Add custom domain (optional)

---

**Last Updated:** 2026-03-30
**Status:** ✅ Ready for Vercel deployment
**Build:** Passing
**API Integration:** ✅ Complete
