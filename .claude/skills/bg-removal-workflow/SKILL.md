---
name: bg-removal-workflow
description: 背景移除功能的完整工作流程 - 从图片上传到结果下载的全流程指南
origin: Project-specific skill for bgremover app
trigger: when implementing background removal features, debugging bg-removal flow, optimizing user experience
tools: Read, Write, Edit, Bash, Grep, Glob
---

# Background Removal Workflow

背景移除功能的完整工作流程，涵盖从用户上传图片到下载处理结果的全流程。

## 🎯 工作流程概览

```
用户上传图片 → 验证文件 → 检查使用限制 → 调用 API → 显示进度 → 展示结果 → 更新使用次数
     ↓            ↓          ↓           ↓         ↓         ↓           ↓
  UI 组件    文件验证    使用量检查   Remove.bg  进度条    并排对比    状态更新
```

## 📋 完整流程

### 阶段 1：图片上传

**用户操作：**
- 点击上传区域
- 拖放图片到上传区
- 选择文件

**系统响应：**
```tsx
// app/page.tsx
const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
  const file = event.target.files?.[0];

  // 1. 验证文件类型
  if (!file.type.startsWith("image/")) {
    setError(t('invalidFileType'));
    return;
  }

  // 2. 验证文件大小
  const fileSizeMB = file.size / (1024 * 1024);
  if (fileSizeMB > 10) {
    setError(`File too large (${fileSizeMB.toFixed(1)}MB). Maximum size is 10MB.`);
    return;
  }

  // 3. 显示预览
  const reader = new FileReader();
  reader.onload = (e) => {
    setSelectedImage(e.target?.result as string);
  };
  reader.readAsDataURL(file);
};
```

**UI 组件：**
```tsx
// 上传区域
<div
  onDrop={handleDrop}
  onDragOver={handleDragOver}
  onClick={handleClick}
  className="w-full max-w-2xl border-3 border-dashed border-gray-300 rounded-xl p-12 text-center hover:border-purple-400 transition-colors cursor-pointer"
>
  {/* 上传图标和提示 */}
</div>
```

### 阶段 2：使用限制检查

**客户端检查：**
```tsx
const handleRemoveBackground = async () => {
  // 检查剩余次数
  if (remainingCredits <= 0) {
    setShowUpgradeModal(true);
    return;
  }

  // 开始处理
  setIsProcessing(true);
};
```

**服务端验证：**
```tsx
// app/api/remove-background/route.ts
const usageCheck = checkCanUseService(userId || undefined, anonymousId);

if (!usageCheck.allowed) {
  return NextResponse.json(
    {
      error: 'Usage limit exceeded',
      remaining: usageCheck.remaining,
      plan: usageCheck.plan,
      requiresAuth: !userId && anonymousId && usageCheck.remaining === 0
    },
    { status: 403 }
  );
}
```

### 阶段 3：API 调用

**调用 Remove.bg API：**
```tsx
// app/api/remove-background/route.ts
const formData = new FormData();
formData.append('image_file', new Blob([buffer]), file.name);
formData.append('size', 'auto');

const response = await fetch('https://api.remove.bg/v1.0/removebg', {
  method: 'POST',
  headers: {
    'X-Api-Key': apiKey,
  },
  body: formData,
});

if (!response.ok) {
  // 处理错误
  if (response.status === 402) {
    return NextResponse.json(
      { error: 'Insufficient API credits' },
      { status: 402 }
    );
  }
}

// 获取处理结果
const processedBuffer = await response.arrayBuffer();
const base64Image = Buffer.from(processedBuffer).toString('base64');
const dataUrl = `data:image/png;base64,${base64Image}`;
```

### 阶段 4：进度显示

**加权进度条：**
```tsx
// 确保单调递增的进度
const progressSteps = [10, 25, 40, 60, 80, 95];

for (const step of progressSteps) {
  await new Promise(resolve => setTimeout(resolve, 200));
  setProgress(step);
}

// 最终完成
setProgress(100);
```

**状态消息：**
```tsx
const getStatusMessage = () => {
  if (progress < 30) return t('statusPreparing');  // "Preparing image..."
  if (progress < 60) return t('statusLoading');    // "Removing background..."
  if (progress < 90) return t('statusAnalyzing');  // "Finishing touches..."
  return t('statusAlmostDone');                   // "Almost done..."
};
```

### 阶段 5：结果展示

**并排比较视图：**
```tsx
<div className="grid md:grid-cols-2 gap-6 p-6">
  {/* 原始图片 */}
  <div>
    <h3>{t('originalImage')}</h3>
    <div className="bg-gray-50 rounded-xl overflow-hidden border-2 border-gray-200">
      <img src={selectedImage} alt="Original" />
    </div>
  </div>

  {/* 处理后图片 */}
  <div>
    <h3>{t('processedImage')}</h3>
    <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-xl overflow-hidden border-2 border-purple-300">
      <img src={processedImage} alt="Processed" />
    </div>
  </div>
</div>
```

### 阶段 6：使用次数更新

**更新剩余次数：**
```tsx
// API 响应
return NextResponse.json({
  success: true,
  image: dataUrl,
  remaining: usageCheck.remaining - 1
});

// 客户端更新
if (data.remaining !== undefined) {
  setRemainingCredits(data.remaining);
}
```

**本地存储同步：**
```tsx
// lib/utils/usage.ts
export function incrementUsage(userId?: string, anonymousId?: string): void {
  const data = getUsageData(userId, anonymousId);
  data.usageCount += 1;

  localStorage.setItem(USAGE_KEY, JSON.stringify(data));
}
```

## 🎨 UI 组件模式

### 1. 上传区域

**完整实现：**
```tsx
<div
  onDrop={handleDrop}
  onDragOver={handleDragOver}
  onClick={handleClick}
  className="w-full max-w-2xl border-3 border-dashed border-gray-300 rounded-xl p-6 md:p-12 text-center hover:border-purple-400 transition-colors cursor-pointer"
>
  <div className="flex flex-col items-center gap-3 md:gap-6">
    {/* 图标 */}
    <div className="w-16 h-16 md:w-24 md:h-24 bg-gradient-to-br from-purple-100 to-blue-100 rounded-full flex items-center justify-center">
      <svg className="w-8 h-8 md:w-12 md:h-12 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    </div>

    {/* 文本 */}
    <p className="text-base md:text-xl font-semibold text-gray-700">
      {t('uploadTitle')}
    </p>
    <p className="text-xs md:text-base text-gray-500">
      {t('uploadSubtitle')}
    </p>

    {/* 按钮 */}
    <button className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 md:px-8 py-2 md:py-3 rounded-full font-semibold hover:shadow-lg transition-shadow">
      {t('selectImage')}
    </button>
  </div>
</div>
```

### 2. 进度条

**动画进度条：**
```tsx
{isProcessing && (
  <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl p-4 border-2 border-purple-200">
    {/* 进度信息 */}
    <div className="flex items-center justify-between mb-3">
      <div className="flex items-center gap-2">
        <div className="w-6 h-6 md:w-8 md:h-8 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin"></div>
        <span className="text-purple-800 font-bold">{getStatusMessage()}</span>
      </div>
      <span className="text-purple-600 font-bold text-lg">{progress}%</span>
    </div>

    {/* 进度条 */}
    <div className="w-full bg-purple-200 rounded-full h-4 overflow-hidden">
      <div
        className="bg-gradient-to-r from-purple-600 via-blue-600 to-purple-600 h-full rounded-full transition-all duration-300 relative"
        style={{ width: `${progress}%` }}
      >
        <div className="absolute inset-0 bg-white/30 animate-pulse"></div>
      </div>
    </div>

    {/* 时间估计 */}
    <p className="text-sm text-purple-700 mt-2">
      {t('estimatedTime')} {getTimeEstimate()}
    </p>
  </div>
)}
```

### 3. 并排比较

**并排视图：**
```tsx
<div className="flex-1 grid md:grid-cols-2 gap-6 p-6">
  {/* 原始图片 */}
  <div className="flex flex-col">
    <h3 className="font-semibold text-gray-700 text-center mb-2">
      {t('originalImage')}
    </h3>
    <div className="flex-1 relative bg-gray-50 rounded-xl overflow-hidden border-2 border-gray-200">
      <img src={selectedImage} alt="Original" className="max-w-full max-h-full object-contain" />
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-2">
        <p className="text-white text-sm font-medium">{t('originalImage')}</p>
      </div>
    </div>
  </div>

  {/* 处理后图片 */}
  {processedImage && (
    <div className="flex flex-col">
      <h3 className="font-semibold text-gray-700 text-center mb-2">
        {t('processedImage')}
      </h3>
      <div className="flex-1 relative bg-gradient-to-br from-purple-50 to-blue-50 rounded-xl overflow-hidden border-2 border-purple-300">
        <img src={processedImage} alt="Processed" className="max-w-full max-h-full object-contain" />
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-purple-600/80 to-transparent p-2">
          <p className="text-white text-sm font-medium">✨ {t('processedImage')}</p>
        </div>
      </div>
    </div>
  )}
</div>
```

### 4. 操作按钮

**按钮组：**
```tsx
<div className="flex gap-4 justify-center">
  {/* 去除背景按钮 */}
  {!isProcessing && (
    <button
      onClick={handleRemoveBackground}
      className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-8 py-3 rounded-full font-bold hover:shadow-lg transition-all hover:scale-105 active:scale-95"
    >
      {t('removeBackground')}
    </button>
  )}

  {/* 下载按钮 */}
  <button
    onClick={handleDownload}
    className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-8 py-3 rounded-full font-bold hover:shadow-lg transition-all hover:scale-105 active:scale-95"
  >
    {t('downloadImage')}
  </button>

  {/* 重置按钮 */}
  <button
    onClick={handleReset}
    className="bg-gray-200 text-gray-700 px-8 py-3 rounded-full font-bold hover:bg-gray-300 transition-colors active:scale-95"
  >
    {t('reset')}
  </button>
</div>
```

## 🔧 错误处理

### 1. 文件验证错误

```tsx
// 文件类型错误
if (!file.type.startsWith("image/")) {
  setError(t('invalidFileType')); // "Please select an image file"
  return;
}

// 文件大小错误
if (fileSizeMB > 10) {
  setError(`File too large (${fileSizeMB.toFixed(1)}MB). Maximum size is 10MB.`);
  return;
}
```

### 2. API 错误

```tsx
// API 密钥未配置
if (!apiKey) {
  return NextResponse.json(
    { error: 'Server configuration error. Please contact administrator.' },
    { status: 500 }
  );
}

// API 密钥无效
if (response.status === 401) {
  return NextResponse.json(
    { error: 'API configuration error. Please check API key.' },
    { status: 401 }
  );
}

// API 额度不足
if (response.status === 402) {
  return NextResponse.json(
    { error: 'API credit limit reached. Please try again later.' },
    { status: 402 }
  );
}

// 速率限制
if (response.status === 429) {
  return NextResponse.json(
    { error: 'Too many requests. Please wait a moment and try again.' },
    { status: 429 }
  );
}
```

### 3. 使用限制错误

```tsx
// 免费次数用完
if (remainingCredits <= 0) {
  setShowUpgradeModal(true);
  return;
}

// 显示升级提示
{showUpgradeModal && (
  <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
    <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl">
      <h2 className="text-2xl font-bold mb-2">{t('upgradePrompt')}</h2>
      <p className="text-gray-600 mb-6">{t('upgradeMessage')}</p>

      <div className="space-y-3">
        <button
          onClick={() => {
            setShowUpgradeModal(false);
            window.location.href = '/pricing';
          }}
          className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-3 rounded-lg font-semibold"
        >
          {t('upgradeButton')}
        </button>

        <button
          onClick={() => setShowUpgradeModal(false)}
          className="w-full bg-gray-100 text-gray-700 px-6 py-3 rounded-lg font-semibold"
        >
          {t('close')}
        </button>
      </div>

      <div className="mt-6 pt-6 border-t border-gray-200">
        <p className="text-sm text-gray-500 mb-2">Or sign up for free:</p>
        <button
          onClick={() => signIn(undefined, { callbackUrl: '/dashboard' })}
          className="w-full px-4 py-2 text-sm font-semibold bg-purple-100 text-purple-700 rounded-lg"
        >
          Sign Up Free
        </button>
      </div>
    </div>
  </div>
)}
```

## ⚡ 性能优化

### 1. 图片优化

**客户端压缩（可选）：**
```tsx
// 压缩大图片
const compressImage = async (file: File): Promise<Blob> => {
  const img = new Image();
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  return new Promise((resolve) => {
    img.onload = () => {
      // 计算新尺寸（最大 2000px）
      const maxSize = 2000;
      let width = img.width;
      let height = img.height;

      if (width > height && width > maxSize) {
        height *= maxSize / width;
        width = maxSize;
      } else if (height > maxSize) {
        width *= maxSize / height;
        height = maxSize;
      }

      canvas.width = width;
      canvas.height = height;
      ctx.drawImage(img, 0, 0, width, height);

      canvas.toBlob((blob) => {
        resolve(blob!);
      }, file.type, 0.9);
    };

    img.src = URL.createObjectURL(file);
  });
};
```

### 2. 进度优化

**真实进度跟踪：**
```tsx
// 使用 axios 或 fetch 的进度事件
const response = await fetch('https://api.remove.bg/v1.0/removebg', {
  method: 'POST',
  headers: { 'X-Api-Key': apiKey },
  body: formData,
});

// 如果可能，使用流式响应
if (response.body) {
  const reader = response.body.getReader();
  const chunks = [];

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    chunks.push(value);
    // 更新进度
    setProgress(prev => Math.min(prev + 10, 90));
  }

  const buffer = Buffer.concat(chunks);
  // 处理结果...
}
```

### 3. 缓存策略

**避免重复处理：**
```tsx
// 使用文件 hash 作为缓存 key
const getCacheKey = (file: File): string => {
  return `bg-removal-${file.name}-${file.size}-${file.lastModified}`;
};

// 检查缓存
const cachedResult = localStorage.getItem(getCacheKey(file));
if (cachedResult) {
  setProcessedImage(cachedResult);
  return;
}

// 存储结果
localStorage.setItem(getCacheKey(file), dataUrl);
```

## 🌐 国际化支持

**翻译键：**
```tsx
// lib/i18n/translations.ts
export const translations = {
  en: {
    uploadTitle: 'Upload Image',
    uploadSubtitle: 'Drag & drop or click to select',
    selectImage: 'Select Image',
    removeBackground: 'Remove Background',
    downloadImage: 'Download',
    reset: 'Reset',
    originalImage: 'Original',
    processedImage: 'Processed',
    statusPreparing: 'Preparing image...',
    statusLoading: 'Removing background...',
    statusAnalyzing: 'Finishing touches...',
    statusAlmostDone: 'Almost done...',
    estimatedTime: 'Estimated time:',
    timeLong: '~30 seconds',
    timeMedium: '~15 seconds',
    timeShort: '~5 seconds',
    upgradePrompt: 'Free credits used up!',
    upgradeMessage: 'Upgrade to continue removing backgrounds.',
    upgradeButton: 'View Plans',
    close: 'Close',
  },
  zh: {
    uploadTitle: '上传图片',
    uploadSubtitle: '拖放或点击选择图片',
    selectImage: '选择图片',
    removeBackground: '去除背景',
    downloadImage: '下载图片',
    reset: '重置',
    originalImage: '原始图片',
    processedImage: '处理后',
    statusPreparing: '准备图片...',
    statusLoading: '正在去除背景...',
    statusAnalyzing: '最后处理...',
    statusAlmostDone: '即将完成...',
    estimatedTime: '预计时间：',
    timeLong: '约 30 秒',
    timeMedium: '约 15 秒',
    timeShort: '约 5 秒',
    upgradePrompt: '免费次数已用完！',
    upgradeMessage: '升级以继续使用背景移除功能。',
    upgradeButton: '查看方案',
    close: '关闭',
  }
};
```

## 🧪 测试场景

### 功能测试

```tsx
// 测试场景 1：正常流程
describe('Background Removal Flow', () => {
  it('should handle successful image upload', () => {
    const file = new File(['image'], 'test.jpg', { type: 'image/jpeg' });
    // 上传图片
    // 验证预览显示
    // 验证剩余次数未变
  });

  it('should process image successfully', async () => {
    // 选择图片
    // 点击去除背景
    // 验证进度显示
    // 验证结果展示
    // 验证次数减少
  });

  it('should handle large files', () => {
    const largeFile = new File(['x'.repeat(11 * 1024 * 1024)], 'large.jpg');
    // 验证错误提示
    // 验证不会上传
  });

  it('should handle invalid file types', () => {
    const pdfFile = new File(['pdf'], 'document.pdf', { type: 'application/pdf' });
    // 验证错误提示
    // 验证不会上传
  });
});
```

### 边界测试

```tsx
describe('Edge Cases', () => {
  it('should handle zero credits', () => {
    // 设置剩余次数为 0
    // 尝试处理图片
    // 验证升级提示显示
  });

  it('should handle API errors', async () => {
    // Mock API 失败
    // 验证错误消息显示
    // 验证用户友好的提示
  });

  it('should handle network timeout', async () => {
    // Mock 超时
    // 验证超时提示
    // 验证可以重试
  });
});
```

## 🎯 最佳实践

### 1. 用户体验

**即时反馈：**
- ✅ 上传后立即显示预览
- ✅ 点击后立即显示进度
- ✅ 完成后立即显示结果
- ✅ 错误时立即显示提示

**友好提示：**
- ✅ 清晰的错误消息
- ✅ 可操作的建议
- ✅ 多语言支持
- ✅ 视觉反馈（动画、图标）

### 2. 性能

**快速响应：**
- ✅ 客户端文件验证
- ✅ 异步处理
- ✅ 进度更新
- ✅ 结果缓存

**资源优化：**
- ✅ 图片压缩
- ✅ 懒加载组件
- ✅ 代码分割
- ✅ CDN 加速

### 3. 可维护性

**代码组织：**
- ✅ 组件化设计
- ✅ 类型定义
- ✅ 错误处理
- ✅ 日志记录

**测试覆盖：**
- ✅ 单元测试
- ✅ 集成测试
- ✅ E2E 测试
- ✅ 性能测试

## 🔗 相关技能

- `nextjs-best-practices` - Next.js 开发指南
- `tailwind-patterns` - UI 组件设计
- `error-handling-patterns` - 错误处理模式
- `testing-strategies` - 测试策略

## 📚 相关文件

- `app/page.tsx` - 主页面组件
- `app/api/remove-background/route.ts` - API 路由
- `lib/utils/usage.ts` - 使用量追踪
- `lib/i18n/translations.ts` - 国际化翻译

---

**记住：** 良好的用户体验来自于细节的关注。每个阶段都应该提供清晰的反馈和友好的错误处理。

**关键成功因素：**
1. 快速响应（即时反馈）
2. 清晰进度（进度条 + 状态消息）
3. 友好错误（可操作的提示）
4. 平滑过渡（动画和过渡效果）
5. 多语言支持（国际化）

**遵循这个工作流程，你的背景移除功能将提供出色的用户体验。**