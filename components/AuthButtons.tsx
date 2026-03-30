"use client";

import { signIn, signOut, useSession } from "next-auth/react";
import { useI18n } from "@/lib/i18n/context";

export function AuthButtons() {
  const { t } = useI18n();
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <div className="animate-pulse h-8 w-32 bg-gray-200 rounded"></div>;
  }

  if (session) {
    return (
      <div className="flex items-center gap-3">
        <span className="text-sm text-gray-600">
          {session.user?.name || session.user?.email}
        </span>
        <button
          onClick={() => signOut({ callbackUrl: '/' })}
          className="px-4 py-2 text-sm font-semibold text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
        >
          Sign Out
        </button>
      </div>
    );
  }

  return (
    <div className="flex gap-2">
      <button
        onClick={() => signIn(undefined, { callbackUrl: '/dashboard' })}
        className="px-4 py-2 text-sm font-semibold text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
      >
        Sign In
      </button>
      <button
        onClick={() => signIn(undefined, { callbackUrl: '/dashboard' })}
        className="px-4 py-2 text-sm font-semibold bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:shadow-lg transition-all"
      >
        Sign Up
      </button>
    </div>
  );
}
