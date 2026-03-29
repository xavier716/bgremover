"use client";

import { useI18n } from "@/lib/i18n/context";

export function LanguageSwitcher() {
  const { language, setLanguage, t } = useI18n();

  return (
    <div className="fixed top-4 right-4 z-50">
      <div className="bg-white rounded-full shadow-lg p-1 flex gap-1 border-2 border-purple-200">
        <button
          onClick={() => setLanguage('en')}
          className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${
            language === 'en'
              ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-md'
              : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          English
        </button>
        <button
          onClick={() => setLanguage('zh')}
          className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${
            language === 'zh'
              ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-md'
              : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          中文
        </button>
      </div>
    </div>
  );
}
