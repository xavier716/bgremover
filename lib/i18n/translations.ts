export type Language = 'en' | 'zh';

export const translations = {
  en: {
    // Header
    title: 'Background Remover',
    subtitle: 'Remove image backgrounds automatically and for free',

    // Upload Section
    uploadTitle: 'Drop your image here',
    uploadSubtitle: 'or click anywhere to browse',
    selectImage: 'Select Image',
    supportedFormats: 'Supports JPG, PNG, WebP and other image formats',

    // Speed Tips
    speedTips: '⚡ Speed Tips:',
    speedTip1: '• Use images under 2MB for fastest results',
    speedTip2: '• First time takes 30-60s (downloads AI model)',
    speedTip3: '• Subsequent images: 5-15 seconds',

    // Processing Status
    statusPreparing: '🚀 Preparing...',
    statusLoading: '📦 Loading AI Model...',
    statusAnalyzing: '🎨 Analyzing Image...',
    statusRemoving: '✨ Removing Background...',
    statusAlmostDone: '🎉 Almost Done...',
    processing: 'Processing',

    // Time Estimates
    estimatedTime: '⏱️ Estimated time:',
    timeLong: '30-60 seconds',
    timeMedium: '15-30 seconds',
    timeShort: '5-15 seconds',
    firstTimeNote: '💡 First-time use requires downloading AI model (~20MB)',

    // Buttons
    removeBackground: '🎨 Remove Background',
    downloadImage: '⬇️ Download Image',
    newImage: '📷 New Image',
    reset: '🔄 Reset',

    // Image Labels
    originalImage: 'Original Image',
    processedImage: '✨ Processed Image',
    backgroundRemoved: '✨ Background Removed',

    // Messages
    largeFileWarning: '⚠️ Large file detected ({size}MB). For best results, use images under 2MB. Processing will take longer.',
    invalidFileType: 'Please select a valid image file',
    processingError: 'Failed to remove background. Please try again with a different image.',
    processingComplete: '✨ Background removed successfully!',

    // Footer
    footerText: 'Powered by AI • All processing happens in your browser • Your images are never uploaded to any server',

    // Language Switcher
    language: 'Language',
    switchToChinese: '中文',
    switchToEnglish: 'English',
  },
  zh: {
    // Header
    title: '图片背景移除',
    subtitle: '免费自动去除图片背景',

    // Upload Section
    uploadTitle: '拖拽图片到此处',
    uploadSubtitle: '或点击任意位置选择图片',
    selectImage: '选择图片',
    supportedFormats: '支持 JPG、PNG、WebP 等图片格式',

    // Speed Tips
    speedTips: '⚡ 速度提示：',
    speedTip1: '• 使用小于 2MB 的图片可获得最快速度',
    speedTip2: '• 首次使用需要 30-60 秒（下载 AI 模型）',
    speedTip3: '• 后续图片：5-15 秒',

    // Processing Status
    statusPreparing: '🚀 准备中...',
    statusLoading: '📦 加载 AI 模型...',
    statusAnalyzing: '🎨 分析图片中...',
    statusRemoving: '✨ 移除背景中...',
    statusAlmostDone: '🎉 即将完成...',
    processing: '处理中',

    // Time Estimates
    estimatedTime: '⏱️ 预计时间：',
    timeLong: '30-60 秒',
    timeMedium: '15-30 秒',
    timeShort: '5-15 秒',
    firstTimeNote: '💡 首次使用需要下载 AI 模型（约 20MB）',

    // Buttons
    removeBackground: '🎨 移除背景',
    downloadImage: '⬇️ 下载图片',
    newImage: '📷 新图片',
    reset: '🔄 重置',

    // Image Labels
    originalImage: '原始图片',
    processedImage: '✨ 处理后图片',
    backgroundRemoved: '✨ 背景已移除',

    // Messages
    largeFileWarning: '⚠️ 检测到大文件（{size}MB）。为获得最佳效果，建议使用小于 2MB 的图片。处理时间会较长。',
    invalidFileType: '请选择有效的图片文件',
    processingError: '背景移除失败。请换张图片重试。',
    processingComplete: '✨ 背景移除成功！',

    // Footer
    footerText: 'AI 驱动 • 所有处理在您的浏览器中进行 • 您的图片永远不会上传到任何服务器',

    // Language Switcher
    language: '语言',
    switchToChinese: '中文',
    switchToEnglish: 'English',
  },
};

export function getTranslation(lang: Language, key: keyof typeof translations.en): string {
  return translations[lang][key];
}

export function formatString(template: string, values: Record<string, string | number>): string {
  return Object.entries(values).reduce(
    (str, [key, value]) => str.replace(`{${key}}`, String(value)),
    template
  );
}
