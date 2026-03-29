"use client";

import { useState, useRef, useEffect } from "react";
import { useI18n } from "@/lib/i18n/context";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";

export default function Home() {
  const { t } = useI18n();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [viewportHeight, setViewportHeight] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 检测视口高度
  useEffect(() => {
    const updateHeight = () => {
      setViewportHeight(window.innerHeight);
    };
    updateHeight();
    window.addEventListener('resize', updateHeight);
    return () => window.removeEventListener('resize', updateHeight);
  }, []);

  const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        setError(t('invalidFileType'));
        return;
      }

      const fileSizeMB = file.size / (1024 * 1024);
      if (fileSizeMB > 5) {
        setError(`Large file detected (${fileSizeMB.toFixed(1)}MB). For best results, use images under 2MB.`);
      } else {
        setError(null);
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        setSelectedImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) {
      setError(null);
      const reader = new FileReader();
      reader.onload = (e) => {
        setSelectedImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setError(t('invalidFileType'));
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleRemoveBackground = async () => {
    if (!selectedImage) return;

    setIsProcessing(true);
    setError(null);
    setProgress(0);

    try {
      // 模拟背景移除过程（演示版本）
      const steps = [
        { progress: 10, delay: 500 },
        { progress: 30, delay: 1000 },
        { progress: 50, delay: 1500 },
        { progress: 70, delay: 2000 },
        { progress: 90, delay: 2500 },
        { progress: 100, delay: 3000 },
      ];

      for (const step of steps) {
        await new Promise(resolve => setTimeout(resolve, step.delay));
        setProgress(step.progress);
      }

      // 这里只是简单显示原图作为演示
      // 实际应用中需要集成背景移除 API
      setIsProcessing(false);
    } catch (err) {
      console.error("Error removing background:", err);
      setError(t('processingError'));
      setIsProcessing(false);
      setProgress(0);
    }
  };

  const handleDownload = () => {
    if (selectedImage) {
      const link = document.createElement("a");
      link.href = selectedImage;
      link.download = "processed-image.png";
      link.click();
    }
  };

  const handleReset = () => {
    setSelectedImage(null);
    setError(null);
    setProgress(0);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const getStatusMessage = () => {
    if (progress < 30) return t('statusPreparing');
    if (progress < 60) return t('statusLoading');
    if (progress < 90) return t('statusAnalyzing');
    return t('statusAlmostDone');
  };

  const getTimeEstimate = () => {
    if (progress < 30) return t('timeLong');
    if (progress < 60) return t('timeMedium');
    return t('timeShort');
  };

  return (
    <main className="h-screen w-screen overflow-hidden flex flex-col p-4 md:p-6">
      <LanguageSwitcher />

      <div className="flex-1 flex flex-col min-h-0">
        {/* 标题区域 */}
        <div className="text-center mb-3 md:mb-4">
          <h1 className="text-2xl md:text-4xl font-bold mb-1 md:mb-2 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            {t('title')}
          </h1>
          <p className="text-gray-600 text-sm md:text-base hidden sm:block">
            {t('subtitle')}
          </p>
        </div>

        {/* 主内容区域 */}
        <div className="flex-1 min-h-0">
          <div className="bg-white rounded-2xl md:rounded-3xl shadow-2xl h-full flex flex-col overflow-hidden">
            {!selectedImage ? (
              // 上传界面
              <div className="flex-1 flex items-center justify-center p-4">
                <div
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                  onClick={handleClick}
                  className="w-full max-w-2xl border-3 border-dashed border-gray-300 rounded-xl md:rounded-2xl p-6 md:p-12 text-center hover:border-purple-400 transition-colors cursor-pointer"
                >
                  <div className="flex flex-col items-center gap-3 md:gap-6">
                    <div className="w-16 h-16 md:w-24 md:h-24 bg-gradient-to-br from-purple-100 to-blue-100 rounded-full flex items-center justify-center">
                      <svg
                        className="w-8 h-8 md:w-12 md:h-12 text-purple-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                    </div>

                    <div className="w-full">
                      <p className="text-base md:text-xl font-semibold text-gray-700 mb-1 md:mb-2">
                        {t('uploadTitle')}
                      </p>
                      <p className="text-xs md:text-base text-gray-500 mb-3 md:mb-4">
                        {t('uploadSubtitle')}
                      </p>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleImageSelect}
                        className="hidden"
                        id="file-input"
                      />
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          fileInputRef.current?.click();
                        }}
                        className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 md:px-8 py-2 md:py-3 rounded-full font-semibold cursor-pointer hover:shadow-lg transition-shadow text-sm md:text-base"
                      >
                        {t('selectImage')}
                      </button>
                    </div>

                    <p className="text-xs md:text-sm text-gray-400">
                      {t('supportedFormats')}
                    </p>

                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-2 md:p-4 w-full">
                      <p className="text-xs md:text-sm text-blue-800 font-medium mb-1 md:mb-2">
                        {t('speedTips')}
                      </p>
                      <ul className="text-xs text-blue-700 space-y-0.5">
                        <li>{t('speedTip1')}</li>
                        <li>{t('speedTip2')}</li>
                        <li>{t('speedTip3')}</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              // 处理界面
              <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
                <div className="flex-1 min-h-0 grid md:grid-cols-2 gap-3 md:gap-6 p-3 md:p-6">
                  <div className="flex flex-col min-h-0">
                    <h3 className="text-sm md:text-base font-semibold text-gray-700 text-center mb-2">
                      {t('originalImage')}
                    </h3>
                    <div className="flex-1 min-h-0 relative bg-gray-50 rounded-xl overflow-hidden flex items-center justify-center border-2 border-gray-200">
                      <img
                        src={selectedImage}
                        alt={t('originalImage')}
                        className="max-w-full max-h-full object-contain"
                      />
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-2">
                        <p className="text-white text-xs font-medium">{t('originalImage')}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="border-t border-gray-200 p-3 md:p-4 space-y-2 md:space-y-3 bg-gray-50">
                  {isProcessing && (
                    <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl p-3 md:p-4 border-2 border-purple-200">
                      <div className="flex items-center justify-between mb-2 md:mb-3">
                        <div className="flex items-center gap-2">
                          <div className="relative">
                            <div className="w-6 h-6 md:w-8 md:h-8 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin"></div>
                          </div>
                          <span className="text-purple-800 font-bold text-sm md:text-lg">
                            {getStatusMessage()}
                          </span>
                        </div>
                        <span className="text-purple-600 font-bold text-lg md:text-xl">{progress}%</span>
                      </div>
                      <div className="w-full bg-purple-200 rounded-full h-2 md:h-4 overflow-hidden shadow-inner">
                        <div
                          className="bg-gradient-to-r from-purple-600 via-blue-600 to-purple-600 h-full rounded-full transition-all duration-300 ease-out relative"
                          style={{ width: `${progress}%` }}
                        >
                          <div className="absolute inset-0 bg-white/30 animate-pulse"></div>
                        </div>
                      </div>
                      <div className="mt-2 space-y-1">
                        <p className="text-xs md:text-sm text-purple-700 font-medium">
                          {t('estimatedTime')} {getTimeEstimate()}
                        </p>
                      </div>
                    </div>
                  )}

                  {error && (
                    <div className="bg-red-50 border border-red-200 rounded-xl p-2 md:p-3">
                      <div className="flex items-start gap-2">
                        <svg
                          className="w-5 h-5 text-red-600 flex-shrink-0"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                        <p className="text-red-700 text-xs md:text-sm">{error}</p>
                      </div>
                    </div>
                  )}

                  <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-3">
                    <div className="flex items-start gap-2">
                      <svg
                        className="w-5 h-5 text-yellow-600 flex-shrink-0"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      <p className="text-yellow-800 text-xs md:text-sm">
                        <strong>Demo Mode:</strong> Background removal is currently in demo mode.
                        For full functionality, please run locally.
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 md:gap-3 justify-center">
                    {!isProcessing && (
                      <button
                        onClick={handleRemoveBackground}
                        className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 md:px-8 py-2 md:py-3 rounded-full font-bold text-sm md:text-base hover:shadow-lg transition-all hover:scale-105 active:scale-95"
                      >
                        {t('removeBackground')}
                      </button>
                    )}

                    <button
                      onClick={handleDownload}
                      className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-6 md:px-8 py-2 md:py-3 rounded-full font-bold text-sm md:text-base hover:shadow-lg transition-all hover:scale-105 active:scale-95"
                    >
                      {t('downloadImage')}
                    </button>

                    <button
                      onClick={handleReset}
                      className="bg-gray-200 text-gray-700 px-6 md:px-8 py-2 md:py-3 rounded-full font-bold text-sm md:text-base hover:bg-gray-300 transition-colors active:scale-95"
                    >
                      {t('reset')}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="text-center text-gray-500 text-xs mt-2">
          <p className="hidden md:block">
            {t('footerText')}
          </p>
          <p className="md:hidden">
            AI Powered • Privacy First • Free
          </p>
        </div>
      </div>
    </main>
  );
}
