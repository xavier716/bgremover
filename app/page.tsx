"use client";

import { useState, useRef, useEffect } from "react";
import { useI18n } from "@/lib/i18n/context";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { AuthButtons } from "@/components/AuthButtons";
import { useSession, signIn } from "next-auth/react";
import { getAnonymousUser } from "@/lib/utils/anonymous";

export default function Home() {
  const { t } = useI18n();
  const { data: session, status } = useSession();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [processedImage, setProcessedImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [viewportHeight, setViewportHeight] = useState(0);
  const [remainingCredits, setRemainingCredits] = useState<number>(3);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const originalFileRef = useRef<File | null>(null);

  // 检测视口高度
  useEffect(() => {
    const updateHeight = () => {
      setViewportHeight(window.innerHeight);
    };
    updateHeight();
    window.addEventListener('resize', updateHeight);
    return () => window.removeEventListener('resize', updateHeight);
  }, []);

  // Check usage credits on mount
  useEffect(() => {
    const checkUsage = async () => {
      try {
        const response = await fetch('/api/usage/check');
        const data = await response.json();
        setRemainingCredits(data.remaining);
      } catch (error) {
        console.error('Failed to check usage:', error);
      }
    };

    checkUsage();
  }, [session]);

  const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        setError(t('invalidFileType'));
        return;
      }

      const fileSizeMB = file.size / (1024 * 1024);
      if (fileSizeMB > 10) {
        setError(`File too large (${fileSizeMB.toFixed(1)}MB). Maximum size is 10MB.`);
        return;
      } else if (fileSizeMB > 5) {
        setError(`Large file detected (${fileSizeMB.toFixed(1)}MB). For best results, use images under 5MB.`);
      } else {
        setError(null);
      }

      originalFileRef.current = file;
      setProcessedImage(null);

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
      const fileSizeMB = file.size / (1024 * 1024);
      if (fileSizeMB > 10) {
        setError(`File too large (${fileSizeMB.toFixed(1)}MB). Maximum size is 10MB.`);
        return;
      }

      setError(null);
      originalFileRef.current = file;
      setProcessedImage(null);

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
    if (!selectedImage || !originalFileRef.current) return;

    // Check if user has credits
    if (remainingCredits <= 0) {
      setShowUpgradeModal(true);
      return;
    }

    setIsProcessing(true);
    setError(null);
    setProgress(0);
    setProcessedImage(null);

    try {
      // Create form data with the image file
      const formData = new FormData();
      formData.append('image', originalFileRef.current);

      // Add user ID header if authenticated
      const headers: HeadersInit = {};
      if (session?.user?.id) {
        headers['x-user-id'] = session.user.id;
      }

      // Progress updates
      const progressSteps = [10, 25, 40, 60, 80, 95];
      for (const step of progressSteps) {
        await new Promise(resolve => setTimeout(resolve, 200));
        setProgress(step);
      }

      // Call our API route
      const response = await fetch('/api/remove-background', {
        method: 'POST',
        headers,
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        // Handle usage limit exceeded
        if (response.status === 403 && data.requiresAuth) {
          setShowUpgradeModal(true);
          throw new Error('Usage limit exceeded. Please sign up for more credits!');
        }
        throw new Error(data.error || 'Failed to remove background');
      }

      if (data.success && data.image) {
        setProcessedImage(data.image);
        setProgress(100);
        // Update remaining credits
        if (data.remaining !== undefined) {
          setRemainingCredits(data.remaining);
        }
      } else {
        throw new Error('Invalid response from server');
      }

      setIsProcessing(false);
    } catch (err) {
      console.error("Error removing background:", err);
      const errorMessage = err instanceof Error ? err.message : t('processingError');

      if (errorMessage.includes('Usage limit exceeded')) {
        setError(errorMessage);
        setShowUpgradeModal(true);
      } else if (errorMessage.includes('API key not configured')) {
        setError('Server configuration error. Please contact administrator.');
      } else if (errorMessage.includes('Invalid API key')) {
        setError('API configuration error. Please check API key.');
      } else if (errorMessage.includes('Insufficient API credits')) {
        setError('API credit limit reached. Please try again later.');
      } else if (errorMessage.includes('Rate limit')) {
        setError('Too many requests. Please wait a moment and try again.');
      } else {
        setError(errorMessage);
      }

      setIsProcessing(false);
      setProgress(0);
    }
  };

  const handleDownload = () => {
    const imageToDownload = processedImage || selectedImage;
    if (imageToDownload) {
      const link = document.createElement("a");
      link.href = imageToDownload;
      link.download = processedImage ? "background-removed.png" : "original-image.png";
      link.click();
    }
  };

  const handleReset = () => {
    setSelectedImage(null);
    setProcessedImage(null);
    setError(null);
    setProgress(0);
    originalFileRef.current = null;
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
      <div className="flex justify-between items-center">
        <LanguageSwitcher />
        <div className="flex items-center gap-4">
          <div className="text-sm text-gray-600">
            {t('remainingCredits')}: {remainingCredits}
          </div>
          <AuthButtons />
        </div>
      </div>

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

                  {processedImage && (
                    <div className="flex flex-col min-h-0">
                      <h3 className="text-sm md:text-base font-semibold text-gray-700 text-center mb-2">
                        {t('processedImage')}
                      </h3>
                      <div className="flex-1 min-h-0 relative bg-gradient-to-br from-purple-50 to-blue-50 rounded-xl overflow-hidden flex items-center justify-center border-2 border-purple-300">
                        <img
                          src={processedImage}
                          alt={t('processedImage')}
                          className="max-w-full max-h-full object-contain"
                        />
                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-purple-600/80 to-transparent p-2">
                          <p className="text-white text-xs font-medium">✨ {t('processedImage')}</p>
                        </div>
                      </div>
                    </div>
                  )}
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

      {/* Upgrade Modal */}
      {showUpgradeModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 md:p-8 max-w-md w-full shadow-2xl">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-100 to-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-purple-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
              </div>

              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                {t('upgradePrompt')}
              </h2>

              <p className="text-gray-600 mb-6">
                {t('upgradeMessage')}
              </p>

              <div className="space-y-3">
                <button
                  onClick={() => {
                    setShowUpgradeModal(false);
                    window.location.href = '/pricing';
                  }}
                  className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition-all"
                >
                  {t('upgradeButton')}
                </button>

                <button
                  onClick={() => setShowUpgradeModal(false)}
                  className="w-full bg-gray-100 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
                >
                  {t('close')}
                </button>
              </div>

              <div className="mt-6 pt-6 border-t border-gray-200">
                <p className="text-sm text-gray-500 mb-2">Or sign up for free:</p>
                <div className="flex justify-center gap-2">
                  <button
                    onClick={() => signIn(undefined, { callbackUrl: '/dashboard' })}
                    className="px-4 py-2 text-sm font-semibold bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-colors"
                  >
                    Sign Up Free
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
