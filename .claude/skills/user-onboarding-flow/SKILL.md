---
name: user-onboarding-flow
description: 用户注册和引导的完整流程 - 从匿名使用到付费转换的漏斗优化
origin: Project-specific skill for bgremover app
trigger: when implementing user onboarding, optimizing conversion rates, designing signup flows
tools: Read, Write, Edit, Bash, Grep, Glob
---

# User Onboarding Flow

用户从匿名使用到注册付费的完整引导流程，优化转化率和用户体验。

## 🎯 转化漏斗

```
匿名用户 (3 次免费)
    ↓
使用 1-2 次
    ↓
达到限制 (引导注册)
    ↓
注册账号 (保留剩余次数)
    ↓
用完免费次数
    ↓
升级提示 (付费转换)
    ↓
完成购买
```

## 📊 阶段详解

### 阶段 1：匿名使用期

**目标：** 让用户快速体验核心价值

**策略：**
- ✅ 无需注册即可使用
- ✅ 清晰的使用限制显示
- ✅ 友好的首次使用引导

**实现：**
```tsx
// app/page.tsx
export default function Home() {
  const [remainingCredits, setRemainingCredits] = useState<number>(3);

  useEffect(() => {
    const checkUsage = async () => {
      const response = await fetch('/api/usage/check');
      const data = await response.json();
      setRemainingCredits(data.remaining);
    };

    checkUsage();
  }, []);

  return (
    <div className="flex items-center gap-4">
      <div className="text-sm text-gray-600">
        {t('remainingCredits')}: {remainingCredits}
      </div>
      <AuthButtons />
    </div>
  );
}
```

**UI 显示：**
```tsx
{/* 使用次数显示 */}
<div className="bg-blue-50 border border-blue-200 rounded-lg px-4 py-2">
  <span className="text-sm text-blue-800">
    💎 {t('remainingCredits')}: {remainingCredits}
  </span>
</div>

{/* 首次使用提示 */}
{remainingCredits === 3 && (
  <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
    <p className="text-sm text-green-800">
      🎉 {t('firstTimeWelcome')} Start by uploading an image!
    </p>
  </div>
)}
```

### 阶段 2：使用限制引导

**目标：** 在达到限制前引导注册

**策略：**
- ✅ 提前 1 次开始提示
- ✅ 突出注册价值
- ✅ 简化注册流程

**实现：**
```tsx
// 即将用完提示
{remainingCredits === 1 && (
  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
    <div className="flex items-start gap-3">
      <svg className="w-5 h-5 text-yellow-600 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
      </svg>
      <div>
        <h3 className="font-semibold text-yellow-800 mb-1">
          {t('lastFreeCredit')} // "Last free credit!"
        </h3>
        <p className="text-sm text-yellow-700 mb-2">
          {t('registerToKeepProgress')} // "Sign up to keep your progress and get more"
        </p>
        <button
          onClick={() => signIn(undefined, { callbackUrl: '/dashboard' })}
          className="bg-yellow-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-yellow-700 transition-colors"
        >
          {t('signUpFree')} // "Sign Up Free"
        </button>
      </div>
    </div>
  </div>
)}
```

**已用完提示：**
```tsx
{remainingCredits === 0 && (
  <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
    <div className="flex items-start gap-3">
      <svg className="w-5 h-5 text-red-600 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
      </svg>
      <div>
        <h3 className="font-semibold text-red-800 mb-1">
          {t('creditsUsedUp')} // "Free credits used up!"
        </h3>
        <p className="text-sm text-red-700 mb-2">
          {t('upgradeToContinue')} // "Upgrade to continue removing backgrounds"
        </p>
        <div className="flex gap-2">
          <button
            onClick={() => window.location.href = '/pricing'}
            className="bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-red-700 transition-colors"
          >
            {t('viewPlans')} // "View Plans"
          </button>
          <button
            onClick={() => signIn(undefined, { callbackUrl: '/dashboard' })}
            className="bg-white text-red-600 border border-red-600 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-red-50 transition-colors"
          >
            {t('signIn')} // "Sign In"
          </button>
        </div>
      </div>
    </div>
  </div>
)}
```

### 阶段 3：注册流程

**目标：** 最大化注册转化率

**策略：**
- ✅ 一键社交登录（Google）
- ✅ 保留使用进度
- ✅ 注册后平滑过渡

**登录页面：**
```tsx
// app/sign-in/page.tsx
export default function SignInPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8">
        {/* 标题 */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            Welcome Back
          </h1>
          <p className="text-gray-600">Sign in to your account</p>
        </div>

        {/* Google 登录按钮 */}
        <button
          onClick={() => signIn('google', { callbackUrl: '/dashboard' })}
          className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors mb-4"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            {/* Google Logo */}
          </svg>
          Continue with Google
        </button>

        {/* 价值提示 */}
        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <h3 className="font-semibold text-blue-900 mb-2">
            Why sign up?
          </h3>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>✨ Keep your progress</li>
            <li>💎 Get more free credits</li>
            <li>🚀 Access advanced features</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
```

**注册后处理：**
```tsx
// app/dashboard/page.tsx
import { auth } from '@/auth';
import { redirect } from 'next/navigation';

export default async function DashboardPage() {
  const session = await auth();

  if (!session) {
    redirect('/sign-in');
  }

  // 检查使用次数
  const response = await fetch('http://localhost:3000/api/usage/check', {
    headers: {
      'Cookie': `next-auth.session-token=${session.cookies.get('next-auth.session-token')?.value}`
    }
  });
  const data = await response.json();

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        {/* 欢迎消息 */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h1 className="text-2xl font-bold mb-2">
            Welcome, {session.user?.name || 'User'}!
          </h1>
          <p className="text-gray-600">
            You have {data.remaining} credits remaining.
          </p>
        </div>

        {/* 使用统计 */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Your Usage</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">{data.remaining}</div>
              <div className="text-sm text-gray-600">Credits Left</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">{data.plan}</div>
              <div className="text-sm text-gray-600">Current Plan</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600">Active</div>
              <div className="text-sm text-gray-600">Status</div>
            </div>
          </div>
        </div>

        {/* 快速操作 */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
          <div className="flex flex-col gap-3">
            <button
              onClick={() => window.location.href = '/'}
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition-all"
            >
              Remove Background Now
            </button>
            <button
              onClick={() => window.location.href = '/pricing'}
              className="w-full bg-gray-100 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
            >
              View Pricing Plans
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
```

### 阶段 4：付费转换

**目标：** 最大化付费转化率

**策略：**
- ✅ 清晰的价值主张
- ✅ 紧迫感营造
- ✅ 社会证明
- ✅ 简化购买流程

**定价页面：**
```tsx
// app/pricing/page.tsx
export default function PricingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50 p-8">
      <div className="max-w-6xl mx-auto">
        {/* 标题 */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            Simple, Transparent Pricing
          </h1>
          <p className="text-xl text-gray-600">
            Choose the plan that works for you
          </p>
        </div>

        {/* 定价卡片 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {/* 免费方案 */}
          <div className="bg-white rounded-2xl shadow-lg p-8 border-2 border-gray-200">
            <h3 className="text-2xl font-bold mb-2">Free</h3>
            <div className="text-4xl font-bold mb-4">$0</div>
            <ul className="space-y-3 mb-8">
              <li className="flex items-center gap-2">
                <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span>3 free credits</span>
              </li>
              <li className="flex items-center gap-2">
                <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span>Standard quality</span>
              </li>
            </ul>
            <button className="w-full bg-gray-100 text-gray-700 px-6 py-3 rounded-lg font-semibold">
              Current Plan
            </button>
          </div>

          {/* Starter 方案 */}
          <div className="bg-white rounded-2xl shadow-xl p-8 border-2 border-purple-400 relative transform hover:scale-105 transition-transform">
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-purple-600 text-white px-4 py-1 rounded-full text-sm font-semibold">
              Popular
            </div>
            <h3 className="text-2xl font-bold mb-2">Starter</h3>
            <div className="text-4xl font-bold mb-1">$4.99</div>
            <div className="text-gray-500 mb-4">100 credits</div>
            <ul className="space-y-3 mb-8">
              <li className="flex items-center gap-2">
                <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span>100 credits</span>
              </li>
              <li className="flex items-center gap-2">
                <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span>HD quality</span>
              </li>
              <li className="flex items-center gap-2">
                <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span>Priority support</span>
              </li>
            </ul>
            <button className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition-all">
              Get Started
            </button>
          </div>

          {/* Pro 方案 */}
          <div className="bg-white rounded-2xl shadow-lg p-8 border-2 border-gray-200">
            <h3 className="text-2xl font-bold mb-2">Pro</h3>
            <div className="text-4xl font-bold mb-1">$19.99</div>
            <div className="text-gray-500 mb-4">500 credits</div>
            <ul className="space-y-3 mb-8">
              <li className="flex items-center gap-2">
                <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span>500 credits</span>
              </li>
              <li className="flex items-center gap-2">
                <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span>4K quality</span>
              </li>
              <li className="flex items-center gap-2">
                <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span>Priority processing</span>
              </li>
            </ul>
            <button className="w-full bg-gray-100 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-200 transition-colors">
              Get Started
            </button>
          </div>
        </div>

        {/* 社会证明 */}
        <div className="text-center">
          <p className="text-gray-600 mb-4">
            Trusted by 10,000+ users worldwide
          </p>
          <div className="flex justify-center gap-1">
            {[...Array(5)].map((_, i) => (
              <svg key={i} className="w-6 h-6 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.569.569-.197 1.364 1.118 1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
```

## 📈 转化优化策略

### 1. 减少摩擦

**一键注册：**
```tsx
// 只提供 Google 登录
<button onClick={() => signIn('google', { callbackUrl: '/dashboard' })}>
  Continue with Google
</button>

// 避免复杂表单
// ❌ 避免：用户名、密码、邮箱、验证码...
// ✅ 推荐：一键社交登录
```

**保留进度：**
```tsx
// 注册后保留匿名使用的数据
const anonymousData = getUsageData(undefined, anonymousId);
const registeredData = getUsageData(userId, anonymousId);
// usageCount 和剩余次数自动保留
```

### 2. 价值感知

**清晰的好处：**
```tsx
<div className="bg-blue-50 p-4 rounded-lg">
  <h3>Why sign up?</h3>
  <ul>
    <li>✨ Keep your progress</li>
    <li>💎 Get more free credits</li>
    <li>🚀 Access advanced features</li>
  </ul>
</div>
```

**紧迫感营造：**
```tsx
// 限时优惠
<div className="bg-red-50 p-4 rounded-lg">
  <p className="text-red-800 font-semibold">
    🔥 Limited time: 20% off Pro plan!
  </p>
</div>
```

### 3. 社会证明

**用户评价：**
```tsx
<div className="bg-white p-6 rounded-lg shadow-md">
  <p className="text-gray-600 mb-4">
    "This tool saved me hours of editing work!"
  </p>
  <div className="flex items-center gap-3">
    <div className="w-10 h-10 bg-purple-100 rounded-full"></div>
    <div>
      <div className="font-semibold">Sarah Chen</div>
      <div className="text-sm text-gray-500">Designer</div>
    </div>
  </div>
</div>
```

**使用统计：**
```tsx
<div className="text-center py-8">
  <div className="text-4xl font-bold text-purple-600 mb-2">
    10,000+
  </div>
  <div className="text-gray-600">
    Happy users worldwide
  </div>
</div>
```

### 4. A/B 测试

**测试变量：**
```tsx
// 变量 A：立即注册
{remainingCredits === 3 && (
  <div>Sign up now to get more credits!</div>
)}

// 变量 B：使用后再注册
{remainingCredits === 1 && (
  <div>You've used 2 of 3 free credits. Sign up to keep going!</div>
)}

// 变量 C：用完后再注册
{remainingCredits === 0 && (
  <div>All free credits used. Upgrade to continue!</div>
)}
```

## 🎯 转化率指标

### 关键指标

**漏斗转化率：**
- 访问 → 首次使用：目标 60%
- 首次使用 → 注册：目标 20%
- 注册 → 付费：目标 10%

**用户行为：**
- 平均使用次数：2.5 次
- 注册时机：1-2 次使用后
- 付费时机：用完免费次数后

### 优化目标

**短期（1 周）：**
- ✅ 提高首次使用率到 60%
- ✅ 提高注册转化率到 15%

**中期（1 月）：**
- ✅ 提高注册转化率到 25%
- ✅ 提高付费转化率到 8%

**长期（3 月）：**
- ✅ 提高付费转化率到 15%
- ✅ 提高用户留存率到 40%

## 🔧 实施步骤

### 第 1 步：设置追踪

```tsx
// lib/analytics.ts
export function trackEvent(event: string, properties?: Record<string, any>) {
  // Google Analytics
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('event', event, properties);
  }

  // 其他分析工具...
}

// 使用
trackEvent('sign_up_clicked', {
  method: 'google',
  credits_remaining: remainingCredits
});
```

### 第 2 步：创建引导流程

```tsx
// components/onboarding/UserOnboarding.tsx
export function UserOnboarding({ remainingCredits }: { remainingCredits: number }) {
  if (remainingCredits === 3) {
    return <FirstTimeWelcome />;
  } else if (remainingCredits === 1) {
    return <LastFreeCreditPrompt />;
  } else if (remainingCredits === 0) {
    return <UpgradePrompt />;
  }

  return null;
}
```

### 第 3 步：优化注册流程

```tsx
// app/sign-in/page.tsx
export default function SignInPage() {
  return (
    <div>
      {/* 简洁的登录界面 */}
      <h1>Welcome Back</h1>
      <p>Sign in to continue</p>

      {/* 只提供一个登录选项 */}
      <button onClick={() => signIn('google', { callbackUrl: '/dashboard' })}>
        Continue with Google
      </button>

      {/* 价值主张 */}
      <div className="mt-6 p-4 bg-blue-50 rounded-lg">
        <h3>Why sign up?</h3>
        <ul>
          <li>✨ Keep your progress</li>
          <li>💎 Get more free credits</li>
          <li>🚀 Access advanced features</li>
        </ul>
      </div>
    </div>
  );
}
```

### 第 4 步：测试和迭代

```tsx
// A/B 测试
export function SignUpPrompt({ variant }: { variant: 'A' | 'B' | 'C' }) {
  if (variant === 'A') {
    return <PromptA />;
  } else if (variant === 'B') {
    return <PromptB />;
  } else {
    return <PromptC />;
  }
}

// 测量转化率
trackEvent('signup_prompt_shown', { variant });
trackEvent('signup_prompt_converted', { variant });
```

## 🔗 相关技能

- `bg-removal-workflow` - 背景移除功能流程
- `tailwind-patterns` - UI 组件设计
- `verification-before-completion` - 质量门控

## 📚 相关文件

- `app/page.tsx` - 主页面
- `app/sign-in/page.tsx` - 登录页面
- `app/dashboard/page.tsx` - 用户仪表板
- `app/pricing/page.tsx` - 定价页面
- `lib/utils/usage.ts` - 使用量追踪

---

**记住：** 良好的用户体验来自于平滑的过渡和清晰的价值感知。

**关键成功因素：**
1. **无摩擦注册** - 一键社交登录
2. **保留进度** - 不丢失已使用的次数
3. **清晰价值** - 明确注册的好处
4. **合适时机** - 在正确时刻提示注册
5. **友好提示** - 不要过度打扰用户

**遵循这个流程，你可以优化从匿名用户到付费用户的完整转化漏斗。**