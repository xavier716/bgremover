"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function PaymentSuccessPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          router.push('/dashboard');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
          {/* Success Icon */}
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg
              className="w-12 h-12 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>

          {/* Success Message */}
          <h1 className="text-3xl font-bold mb-4 bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
            Payment Successful!
          </h1>

          <p className="text-gray-600 mb-6">
            Thank you for your purchase! Your credits have been added to your account.
          </p>

          {/* User Info */}
          {session?.user && (
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <p className="text-sm text-gray-600 mb-1">Account</p>
              <p className="font-semibold">{session.user.email}</p>
            </div>
          )}

          {/* Countdown */}
          <div className="mb-6">
            <p className="text-sm text-gray-500">
              Redirecting to dashboard in {countdown} seconds...
            </p>
          </div>

          {/* Manual Redirect Button */}
          <button
            onClick={() => router.push('/dashboard')}
            className="w-full py-3 px-6 bg-gradient-to-r from-green-600 to-blue-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all"
          >
            Go to Dashboard Now
          </button>

          {/* Additional Actions */}
          <div className="mt-6 flex gap-4">
            <button
              onClick={() => router.push('/')}
              className="flex-1 py-2 px-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Start Removing
            </button>
            <button
              onClick={() => router.push('/pricing')}
              className="flex-1 py-2 px-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              View Plans
            </button>
          </div>
        </div>

        {/* Support Info */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Questions? Contact us at{' '}
            <a href="mailto:support@bgremover.ahua.life" className="text-purple-600 hover:underline">
              support@bgremover.ahua.life
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
