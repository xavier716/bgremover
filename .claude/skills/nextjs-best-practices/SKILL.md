---
name: nextjs-best-practices
description: Next.js App Router 开发最佳实践和性能优化指南
origin: Based on ECC patterns and Next.js official docs
trigger: when writing Next.js code, optimizing performance, debugging Next.js issues
tools: Read, Write, Edit, Bash, Grep, Glob
---

# Next.js Best Practices

适用于 Next.js 16.2.1+ App Router 的开发指南和优化策略。

## 🎯 核心原则

1. **Server Components 默认** - 除非必要，否则使用 Server Components
2. **Client Components 最小化** - 只在需要交互性时使用
3. **性能优先** - 图片、字体、代码分割优化
4. **类型安全** - 充分利用 TypeScript
5. **错误边界** - 优雅的错误处理

## 📁 文件结构最佳实践

### 推荐结构

```
app/
├── (main)/           # 路由组（不含 URL 路径）
│   ├── page.tsx      # 主页（Server Component）
│   ├── layout.tsx    # 布局
│   └── loading.tsx   # 加载状态
├── api/              # API Routes
│   ├── auth/
│   │   └── [...nextauth]/
│   │       └── route.ts
│   └── remove-background/
│       └── route.ts
├── dashboard/        # 受保护的路由
│   └── page.tsx
└── sign-in/          # 登录页面
    └── page.tsx

components/
├── ui/              # 可复用 UI 组件
├── forms/           # 表单组件
└── features/        # 功能特定组件

lib/
├── utils/           # 工具函数
├── i18n/            # 国际化
└── hooks/           # 自定义 hooks

public/              # 静态资源
├── images/
└── icons/
```

## 🖥️ Server vs Client Components

### 何时使用 Server Components

**默认选择**，适用于：
- 数据获取
- 访问后端资源（数据库、API）
- 保持敏感信息（密钥、tokens）
- 大型依赖库（减少客户端 JS）

**示例：**
```tsx
// app/page.tsx - Server Component
export default function Home() {
  // 可以直接访问数据库
  const data = await getData();

  return (
    <div>
      <h1>Server Component</h1>
      {/* 渲染数据 */}
    </div>
  );
}
```

### 何时使用 Client Components

**需要时添加**，适用于：
- 交互性（onClick, onChange）
- React Hooks（useState, useEffect）
- 浏览器 API（window, document）
- 上下文提供者

**示例：**
```tsx
'use client';  // 必须在第一行

import { useState } from 'react';

export function InteractiveComponent() {
  const [count, setCount] = useState(0);

  return (
    <button onClick={() => setCount(count + 1)}>
      Count: {count}
    </button>
  );
}
```

### ⚠️ 常见陷阱

**❌ 错误：在 Server Component 中使用 Hooks**
```tsx
// app/page.tsx
export default function Page() {
  const [count, setCount] = useState(0);  // ❌ Error!
  // ...
}
```

**✅ 正确：拆分组件**
```tsx
// app/page.tsx - Server Component
import { InteractivePart } from './components/interactive-part';

export default function Page() {
  return (
    <div>
      <h1>Server Component</h1>
      <InteractivePart />  {/* Client Component */}
    </div>
  );
}

// components/interactive-part.tsx - Client Component
'use client';

export function InteractivePart() {
  const [count, setCount] = useState(0);  // ✅ OK
  // ...
}
```

## 🎨 组件设计模式

### 1. 组合模式

**背景移除页面示例：**
```tsx
// app/page.tsx
import { UploadArea } from '@/components/upload-area';
import { ProcessingStatus } from '@/components/processing-status';
import { ImageComparison } from '@/components/image-comparison';

export default function Home() {
  return (
    <main>
      <UploadArea />
      <ProcessingStatus />
      <ImageComparison />
    </main>
  );
}
```

### 2. 容器/展示分离

```tsx
// components/auth/user-auth.tsx - Container
'use client';

import { useSession } from 'next-auth/react';
import { AuthButtons } from './auth-buttons';

export function UserAuth() {
  const { data: session } = useSession();

  return <AuthButtons session={session} />;
}

// components/auth/auth-buttons.tsx - Presentational
export function AuthButtons({ session }: { session: any }) {
  if (session) {
    return <LogoutButton user={session.user} />;
  }

  return <LoginButtons />;
}
```

### 3. 错误边界

```tsx
// app/error.tsx
'use client';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div>
      <h2>Something went wrong!</h2>
      <button onClick={() => reset()}>Try again</button>
    </div>
  );
}
```

## 🚀 性能优化

### 1. 图片优化

**✅ 使用 next/image**
```tsx
import Image from 'next/image';

export function ProductImage() {
  return (
    <Image
      src="/products/widget.jpg"
      alt="Widget"
      width={500}
      height={500}
      priority  // 首屏图片
    />
  );
}
```

**❌ 避免使用 HTML img 标签**
```tsx
// ❌ Bad - 没有优化
<img src="/products/widget.jpg" alt="Widget" />
```

### 2. 字体优化

```tsx
// app/layout.tsx
import { Inter } from 'next/font/google';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',  // 优化字体加载
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.className}>
      <body>{children}</body>
    </html>
  );
}
```

### 3. 代码分割

**动态导入：**
```tsx
// 使用动态导入减少初始包大小
import dynamic from 'next/dynamic';

const HeavyComponent = dynamic(
  () => import('@/components/heavy-component'),
  {
    loading: () => <p>Loading...</p>,
    ssr: false,  // 仅客户端渲染
  }
);

export function Page() {
  return (
    <div>
      <HeavyComponent />
    </div>
  );
}
```

### 4. 数据获取优化

**✅ 使用 fetch 的缓存选项**
```tsx
// 自动缓存（默认）
async function getData() {
  const res = await fetch('https://api.example.com/data');
  return res.json();
}

// 不缓存
async function getDynamicData() {
  const res = await fetch('https://api.example.com/data', {
    cache: 'no-store',
  });
  return res.json();
}

// 重新验证每 10 秒
async function getStaleData() {
  const res = await fetch('https://api.example.com/data', {
    next: { revalidate: 10 },
  });
  return res.json();
}
```

## 🔒 路由保护

### 中间件保护

```tsx
// middleware.ts
import { auth } from '@/auth';

export default auth((req) => {
  const isLoggedIn = !!req.auth;
  const isOnDashboard = req.nextUrl.pathname.startsWith('/dashboard');

  if (isOnDashboard && !isLoggedIn) {
    return Response.redirect(new URL('/sign-in', req.url));
  }
});

export const config = {
  matcher: ['/dashboard/:path*'],
};
```

### 服务端检查

```tsx
// app/dashboard/page.tsx
import { auth } from '@/auth';
import { redirect } from 'next/navigation';

export default async function DashboardPage() {
  const session = await auth();

  if (!session) {
    redirect('/sign-in');
  }

  return (
    <div>
      <h1>Welcome, {session.user.name}</h1>
    </div>
  );
}
```

## 🎯 API Routes 最佳实践

### 1. 错误处理

```tsx
// app/api/remove-background/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('image') as File;

    if (!file) {
      return NextResponse.json(
        { error: 'No image file provided' },
        { status: 400 }
      );
    }

    // 处理逻辑...

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
```

### 2. 类型安全

```tsx
// app/api/usage/check/route.ts
import { NextRequest, NextResponse } from 'next/server';

interface UsageResponse {
  allowed: boolean;
  remaining: number;
  plan: string;
}

export async function GET(request: NextRequest): Promise<NextResponse<UsageResponse>> {
  // 实现逻辑
  return NextResponse.json({
    allowed: true,
    remaining: 3,
    plan: 'free',
  });
}
```

### 3. 环境变量验证

```tsx
// lib/env.ts
import { z } from 'zod';

const envSchema = z.object({
  REMOVEBG_API_KEY: z.string().min(1),
  NEXTAUTH_URL: z.string().url(),
  NEXTAUTH_SECRET: z.string().min(32),
});

export const env = envSchema.parse(process.env);
```

## 🧪 测试策略

### 1. 单元测试

```tsx
// __tests__/components/auth-buttons.test.tsx
import { render, screen } from '@testing-library/react';
import { AuthButtons } from '@/components/auth/auth-buttons';

describe('AuthButtons', () => {
  it('shows login buttons when not authenticated', () => {
    render(<AuthButtons session={null} />);
    expect(screen.getByText('Sign In')).toBeInTheDocument();
  });

  it('shows user info when authenticated', () => {
    render(<AuthButtons session={{ user: { name: 'John' } }} />);
    expect(screen.getByText('John')).toBeInTheDocument();
  });
});
```

### 2. API 测试

```tsx
// __tests__/api/remove-background.test.ts
import { POST } from '@/app/api/remove-background/route';
import { NextRequest } from 'next/server';

describe('/api/remove-background', () => {
  it('returns error when no file provided', async () => {
    const request = new NextRequest('http://localhost:3000/api/remove-background', {
      method: 'POST',
      body: JSON.stringify({}),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBe('No image file provided');
  });
});
```

## 🐛 调试技巧

### 1. 使用 console.log

```tsx
// Server Component
export default function Page() {
  console.log('Server Component rendering');
  // ...
}

// Client Component
'use client';
export function Component() {
  console.log('Client Component rendering');
  // ...
}
```

### 2. 使用 React DevTools

- 安装 React DevTools 浏览器扩展
- 检查组件树
- 查看组件 props 和 state
- 性能分析

### 3. 使用 Next.js 内置调试

```tsx
// 启用源码映射
// next.config.js
module.exports = {
  webpack: (config) => {
    config.devtool = 'source-map';
    return config;
  },
};
```

## 📊 性能监控

### 1. 使用 Web Vitals

```tsx
// app/layout.tsx
import { Analytics } from '@vercel/analytics/react';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
```

### 2. 性能检查清单

- [ ] Lighthouse 性能分数 > 90
- [ ] First Contentful Paint < 1.5s
- [ ] Time to Interactive < 3.5s
- [ ] Cumulative Layout Shift < 0.1
- [ ] 图片已优化
- [ ] 字体已优化
- [ ] JavaScript 包大小合理

## 🔗 相关资源

- [Next.js Documentation](https://nextjs.org/docs)
- [Next.js Learn](https://nextjs.org/learn)
- [React Documentation](https://react.dev)
- [TypeScript Documentation](https://www.typescriptlang.org/docs)

## 🎯 快速参考

### 文件扩展名

| 扩展名 | 用途 |
|--------|------|
| `.tsx` | React 组件（TSX） |
| `.ts` | TypeScript 文件 |
| `.js` | JavaScript 文件（罕见） |

### 导入别名

```tsx
// tsconfig.json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./*"],
      "@/components/*": ["./components/*"],
      "@/lib/*": ["./lib/*"]
    }
  }
}

// 使用
import { Button } from '@/components/ui/button';
import { formatDate } from '@/lib/utils';
```

### 环境变量

```bash
# .env.local（本地）
NEXTAUTH_URL=http://localhost:3000
REMOVEBG_API_KEY=your_key_here

# .env.production（生产）
NEXTAUTH_URL=https://yourdomain.com
REMOVEBG_API_KEY=your_production_key
```

---

**记住：** Next.js 的强大来自于正确使用它的特性。错误的使用会导致性能问题和用户体验下降。

**最佳实践总结：**
1. 默认使用 Server Components
2. 只在需要时使用 Client Components
3. 优化图片、字体和代码分割
4. 实施适当的错误处理
5. 保持类型安全
6. 编写测试
7. 监控性能

**遵循这些原则，你的 Next.js 应用将快速、可维护且用户友好。**
