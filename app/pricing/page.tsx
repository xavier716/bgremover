"use client";

import { useI18n } from "@/lib/i18n/context";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";

const plans = [
  {
    name: "Free",
    price: 0,
    credits: 3,
    period: "forever",
    description: "Perfect for trying out",
    features: [
      "3 background removals",
      "Standard processing speed",
      "No credit card required",
    ],
    cta: "Current Plan",
    popular: false,
  },
  {
    name: "Starter",
    price: 4.99,
    credits: 100,
    period: "month",
    description: "Best for individuals",
    features: [
      "100 background removals/month",
      "Fast processing",
      "Priority support",
      "No watermarks",
    ],
    cta: "Get Started",
    popular: true,
  },
  {
    name: "Pro",
    price: 19.99,
    credits: 500,
    period: "month",
    description: "Best for professionals",
    features: [
      "500 background removals/month",
      "Fastest processing",
      "Priority support",
      "No watermarks",
      "API access (coming soon)",
    ],
    cta: "Get Started",
    popular: false,
  },
];

export default function PricingPage() {
  const { t } = useI18n();
  const { data: session } = useSession();
  const router = useRouter();
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handlePurchase = async (planName: string) => {
    if (!session) {
      // Redirect to sign up
      router.push('/sign-up?redirect=' + encodeURIComponent(`/pricing?plan=${planName}`));
      return;
    }

    setIsLoading(true);
    setSelectedPlan(planName);

    try {
      // Create PayPal order
      const response = await fetch('/api/paypal/create-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          plan: planName.toLowerCase(),
        }),
      });

      const data = await response.json();

      if (data.approvalUrl) {
        // Redirect to PayPal for approval
        window.location.href = data.approvalUrl;
      } else {
        console.error('Failed to create order:', data);
        setIsLoading(false);
        setSelectedPlan(null);
      }
    } catch (error) {
      console.error('Error creating order:', error);
      setIsLoading(false);
      setSelectedPlan(null);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            Simple, Transparent Pricing
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Choose the perfect plan for your needs. No hidden fees, cancel anytime.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`bg-white rounded-2xl shadow-xl p-8 relative ${
                plan.popular ? 'ring-4 ring-purple-500 scale-105' : ''
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-4 py-1 rounded-full text-sm font-semibold">
                    Most Popular
                  </span>
                </div>
              )}

              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                <p className="text-gray-600 mb-4">{plan.description}</p>
                <div className="flex items-baseline justify-center gap-2">
                  <span className="text-5xl font-bold text-gray-900">
                    ${plan.price}
                  </span>
                  {plan.price > 0 && (
                    <span className="text-gray-600">/{plan.period}</span>
                  )}
                </div>
                <p className="text-sm text-gray-600 mt-2">
                  {plan.credits} credits/{plan.period}
                </p>
              </div>

              <ul className="space-y-3 mb-8">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <svg
                      className="w-6 h-6 text-green-500 flex-shrink-0"
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
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>

              <button
                onClick={() => handlePurchase(plan.name)}
                disabled={
                  plan.price === 0 ||
                  isLoading ||
                  (selectedPlan !== null && selectedPlan !== plan.name)
                }
                className={`w-full py-3 px-6 rounded-lg font-semibold transition-all ${
                  plan.popular
                    ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:shadow-lg'
                    : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                {isLoading && selectedPlan === plan.name ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                        fill="none"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    Processing...
                  </span>
                ) : plan.price === 0 ? (
                  'Current Plan'
                ) : (
                  plan.cta
                )}
              </button>
            </div>
          ))}
        </div>

        {/* FAQ Section */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <h2 className="text-3xl font-bold text-center mb-8">
            Frequently Asked Questions
          </h2>

          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="font-semibold text-lg mb-2">What payment methods do you accept?</h3>
              <p className="text-gray-600">
                We accept PayPal, credit cards, and debit cards through our secure payment
                system powered by PayPal. All payments are processed securely.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-lg mb-2">Can I change my plan later?</h3>
              <p className="text-gray-600">
                Yes! You can upgrade or downgrade your plan at any time. Changes take effect
                immediately.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-lg mb-2">Do unused credits roll over?</h3>
              <p className="text-gray-600">
                No, credits reset each month. However, you can purchase additional credits
                that never expire.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-lg mb-2">Is there a free trial?</h3>
              <p className="text-gray-600">
                Yes! All users get 3 free background removals to try out the service.
                No credit card required.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-lg mb-2">Is my payment information secure?</h3>
              <p className="text-gray-600">
                Absolutely! We use PayPal's secure payment system. Your payment information
                is never stored on our servers.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-lg mb-2">Can I get a refund?</h3>
              <p className="text-gray-600">
                Yes, if you're not satisfied with your purchase, contact our support within
                7 days for a full refund.
              </p>
            </div>
          </div>
        </div>

        {/* Trust Badges */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <h3 className="text-2xl font-bold text-center mb-8">Trusted by Users Worldwide</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-purple-600 mb-2">10K+</div>
              <p className="text-gray-600">Images Processed</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-600 mb-2">99.9%</div>
              <p className="text-gray-600">Uptime Guarantee</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-green-600 mb-2">24/7</div>
              <p className="text-gray-600">Customer Support</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-orange-600 mb-2">Secure</div>
              <p className="text-gray-600">Payment Processing</p>
            </div>
          </div>
        </div>

        {/* Payment Methods */}
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl shadow-xl p-8 mb-8 text-white">
          <div className="text-center">
            <h3 className="text-2xl font-bold mb-4">Secure Payment Methods</h3>
            <p className="mb-6">We accept all major payment methods through PayPal</p>
            <div className="flex justify-center items-center gap-6 flex-wrap">
              <div className="bg-white/10 backdrop-blur rounded-lg px-6 py-3">
                <span className="font-semibold">PayPal</span>
              </div>
              <div className="bg-white/10 backdrop-blur rounded-lg px-6 py-3">
                <span className="font-semibold">Credit Cards</span>
              </div>
              <div className="bg-white/10 backdrop-blur rounded-lg px-6 py-3">
                <span className="font-semibold">Debit Cards</span>
              </div>
            </div>
            <div className="mt-6 flex justify-center items-center gap-2 text-sm">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
              </svg>
              <span>Secured by PayPal SSL Encryption</span>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center mt-12">
          {!session && (
            <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl p-8 text-white">
              <h3 className="text-2xl font-bold mb-4">
                Get 10 Free Credits Every Month!
              </h3>
              <p className="mb-6">
                Sign up now and start removing backgrounds for free. No credit card required.
              </p>
              <button
                onClick={() => {
                  const searchParams = new URLSearchParams();
                  searchParams.set('callbackUrl', '/dashboard');
                  window.location.href = `/sign-in?${searchParams.toString()}`;
                }}
                className="bg-white text-purple-600 px-8 py-3 rounded-lg font-semibold hover:shadow-lg transition-all"
              >
                Sign Up Free
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
