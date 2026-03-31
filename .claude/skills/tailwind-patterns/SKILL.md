---
name: tailwind-patterns
description: Tailwind CSS 高效模式、组件设计和性能优化
origin: Based on ECC patterns and Tailwind CSS best practices
trigger: when styling components, designing UI, creating reusable components
tools: Read, Write, Edit
---

# Tailwind CSS Patterns

适用于 Tailwind CSS 的高效开发模式和组件设计指南。

## 🎯 核心原则

1. **实用性优先** - 使用实用类而非自定义 CSS
2. **可复用性** - 通过 @apply 创建组件
3. **响应式** - 移动优先设计
4. **性能** - 使用 PurgeCSS 优化
5. **一致性** - 遵循设计系统

## 🎨 基础模式

### 1. 布局模式

#### Flexbox 居中
```tsx
<div className="flex items-center justify-center h-screen">
  <div>居中内容</div>
</div>
```

#### Grid 布局
```tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  <div>项目 1</div>
  <div>项目 2</div>
  <div>项目 3</div>
</div>
```

#### 响应式容器
```tsx
<div className="container mx-auto px-4 sm:px-6 lg:px-8">
  内容
</div>
```

### 2. 卡片组件

**基础卡片：**
```tsx
<div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
  <h3 className="text-lg font-semibold mb-2">标题</h3>
  <p className="text-gray-600">描述文本</p>
</div>
```

**带边框的卡片：**
```tsx
<div className="bg-white rounded-xl border-2 border-gray-200 p-6 hover:border-blue-400 transition-colors">
  <h3 className="text-lg font-semibold mb-2">标题</h3>
  <p className="text-gray-600">描述文本</p>
</div>
```

**渐变卡片：**
```tsx
<div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-2xl p-6 border border-purple-200">
  <h3 className="text-lg font-semibold text-purple-900 mb-2">标题</h3>
  <p className="text-purple-700">描述文本</p>
</div>
```

### 3. 按钮组件

**主要按钮：**
```tsx
<button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold">
  点击我
</button>
```

**渐变按钮：**
```tsx
<button className="px-6 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:shadow-lg transition-all font-semibold">
  点击我
</button>
```

**轮廓按钮：**
```tsx
<button className="px-6 py-2 border-2 border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors font-semibold">
  点击我
</button>
```

**图标按钮：**
```tsx
<button className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
  </svg>
</button>
```

### 4. 输入组件

**文本输入：**
```tsx
<input
  type="text"
  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
  placeholder="输入文本..."
/>
```

**文件上传区域：**
```tsx
<div className="border-2 border-dashed border-gray-300 rounded-xl p-12 text-center hover:border-purple-400 transition-colors cursor-pointer">
  <div className="flex flex-col items-center gap-4">
    <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center">
      <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    </div>
    <p className="text-lg font-semibold text-gray-700">上传图片</p>
    <p className="text-sm text-gray-500">拖放或点击选择</p>
  </div>
</div>
```

## 🎭 高级模式

### 1. 玻璃态效果

```tsx
<div className="backdrop-blur-md bg-white/30 border border-white/20 rounded-xl shadow-xl">
  <div className="p-6">
    <h3 className="text-xl font-bold text-gray-900">玻璃态卡片</h3>
    <p className="text-gray-700 mt-2">半透明背景和模糊效果</p>
  </div>
</div>
```

### 2. 悬停效果

**缩放效果：**
```tsx
<div className="transform hover:scale-105 transition-transform duration-200">
  悬停时放大
</div>
```

**旋转效果：**
```tsx
<div className="hover:rotate-180 transition-transform duration-500">
  悬停时旋转
</div>
```

**滑动效果：**
```tsx
<div className="hover:translate-x-2 transition-transform duration-200">
  悬停时向右滑动
</div>
```

### 3. 加载动画

**旋转加载器：**
```tsx
<div className="w-8 h-8 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin"></div>
```

**脉冲加载器：**
```tsx
<div className="w-4 h-4 bg-purple-600 rounded-full animate-ping"></div>
```

**进度条：**
```tsx
<div className="w-full bg-purple-200 rounded-full h-4 overflow-hidden">
  <div className="bg-gradient-to-r from-purple-600 to-blue-600 h-full rounded-full transition-all duration-300 animate-pulse" style={{ width: '60%' }}></div>
</div>
```

### 4. 徽章和标签

**徽章：**
```tsx
<span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
  新功能
</span>
```

**标签：**
```tsx
<span className="inline-flex items-center px-3 py-1 rounded-md text-sm font-medium bg-gray-100 text-gray-800">
  标签
</span>
```

## 🧱 可复用组件模式

### 1. 使用 @apply 创建组件

```css
/* styles/globals.css */
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer components {
  .btn-primary {
    @apply px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold;
  }

  .btn-secondary {
    @apply px-6 py-2 border-2 border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors font-semibold;
  }

  .card {
    @apply bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow;
  }

  .input {
    @apply w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all;
  }
}
```

**使用：**
```tsx
<button className="btn-primary">主要按钮</button>
<button className="btn-secondary">次要按钮</button>
<div className="card">卡片内容</div>
<input type="text" className="input" />
```

### 2. TypeScript 组件

**按钮组件：**
```tsx
// components/ui/button.tsx
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

export function Button({
  variant = 'primary',
  size = 'md',
  children,
  className = '',
  ...props
}: ButtonProps) {
  const baseStyles = 'rounded-lg font-semibold transition-colors';

  const variantStyles = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700',
    secondary: 'border-2 border-blue-600 text-blue-600 hover:bg-blue-50',
    danger: 'bg-red-600 text-white hover:bg-red-700',
  };

  const sizeStyles = {
    sm: 'px-4 py-1 text-sm',
    md: 'px-6 py-2 text-base',
    lg: 'px-8 py-3 text-lg',
  };

  return (
    <button
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
```

**使用：**
```tsx
<Button variant="primary" size="lg">
  大号主要按钮
</Button>
```

## 📱 响应式模式

### 移动优先设计

```tsx
<div className="text-sm sm:text-base md:text-lg lg:text-xl">
  响应式文本大小
</div>
```

### 隐藏/显示

```tsx
<div className="hidden md:block">
  只在中等屏幕以上显示
</div>

<div className="block md:hidden">
  只在移动设备上显示
</div>
```

### 响应式网格

```tsx
<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
  {items.map(item => (
    <div key={item.id}>{item.name}</div>
  ))}
</div>
```

## 🎨 设计系统

### 颜色方案

**主色调：**
```tsx
// 蓝色主题
<div className="bg-blue-600">主要</div>
<div className="bg-blue-500">hover</div>
<div className="bg-blue-400">活跃</div>
<div className="bg-blue-100/20">背景</div>

// 紫色主题
<div className="bg-purple-600">主要</div>
<div className="bg-purple-500">hover</div>
<div className="bg-purple-400">活跃</div>
<div className="bg-purple-100/20">背景</div>
```

**渐变：**
```tsx
// 蓝紫渐变
<div className="bg-gradient-to-r from-blue-600 to-purple-600">

// 多色渐变
<div className="bg-gradient-to-r from-purple-600 via-pink-500 to-blue-600">
```

### 间距系统

```tsx
// 使用 Tailwind 的间距比例
<p className="mb-4">底部外边距 1rem (16px)</p>
<p className="mb-8">底部外边距 2rem (32px)</p>
<p className="px-6">左右内边距 1.5rem (24px)</p>
<p className="py-2">上下内边距 0.5rem (8px)</p>
```

### 圆角系统

```tsx
<div className="rounded-sm">小圆角 (2px)</div>
<div className="rounded">标准圆角 (4px)</div>
<div className="rounded-lg">大圆角 (8px)</div>
<div className="rounded-xl">超大圆角 (12px)</div>
<div className="rounded-2xl">双倍大圆角 (16px)</div>
<div className="rounded-full">完全圆角</div>
```

## 🚀 性能优化

### 1. JIT 模式配置

```javascript
// tailwind.config.js
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
    './app/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
```

### 2. 避免动态类名

**❌ 错误：**
```tsx
<div className={`bg-${color}-600`}>
  // JIT 编译器无法识别动态类名
</div>
```

**✅ 正确：**
```tsx
<div className={color === 'blue' ? 'bg-blue-600' : 'bg-red-600'}>
  // 使用完整的类名
</div>
```

### 3. 使用 @layer 优化

```css
/* styles/globals.css */
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer components {
  /* 可复用组件样式 */
  .card {
    @apply bg-white rounded-lg shadow-md p-6;
  }
}

@layer utilities {
  /* 自定义工具类 */
  .text-shadow {
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.1);
  }
}
```

## 🎯 常见 UI 模式

### 1. 模态框

```tsx
<div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
  <div className="bg-white rounded-2xl shadow-xl p-6 max-w-md w-full">
    <h2 className="text-2xl font-bold mb-4">模态框标题</h2>
    <p className="text-gray-600 mb-6">模态框内容</p>
    <div className="flex gap-4">
      <button className="flex-1 btn-primary">确认</button>
      <button className="flex-1 btn-secondary">取消</button>
    </div>
  </div>
</div>
```

### 2. Toast 通知

```tsx
<div className="fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg">
  <div className="flex items-center gap-2">
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
    </svg>
    <span>操作成功！</span>
  </div>
</div>
```

### 3. 标签页

```tsx
<div className="border-b border-gray-200">
  <nav className="-mb-px flex space-x-8">
    <a className="border-blue-500 text-blue-600 whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm">
      标签 1
    </a>
    <a className="border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm">
      标签 2
    </a>
  </nav>
</div>
```

## 🔧 实用工具

### 1. 文本截断

```tsx
<p className="truncate">单行文本截断...</p>
<p className="line-clamp-3">多行文本截断，最多显示 3 行...</p>
```

### 2. 焦点状态

```tsx
<input className="focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none" />
```

### 3. 过渡动画

```tsx
<div className="transition-all duration-300 ease-in-out">
  所有属性变化都有过渡
</div>
```

## 📊 常用配色方案

### 蓝色主题（专业）
```tsx
bg-blue-600   // 主色
bg-blue-500   // hover
bg-blue-100   // 背景
text-blue-600 // 文本
border-blue-600 // 边框
```

### 紫色主题（创意）
```tsx
bg-purple-600   // 主色
bg-purple-500   // hover
bg-purple-100   // 背景
text-purple-600 // 文本
border-purple-600 // 边框
```

### 绿色主题（成功）
```tsx
bg-green-600   // 主色
bg-green-500   // hover
bg-green-100   // 背景
text-green-600 // 文本
border-green-600 // 边框
```

### 红色主题（错误）
```tsx
bg-red-600   // 主色
bg-red-500   // hover
bg-red-100   // 背景
text-red-600 // 文本
border-red-600 // 边框
```

## 🎯 最佳实践清单

在使用 Tailwind CSS 时，确保：

- [ ] 使用实用类而非自定义 CSS
- [ ] 遵循响应式设计原则
- [ ] 保持一致的间距和颜色
- [ ] 使用 TypeScript 组件
- [ ] 避免动态类名
- [ ] 使用 @layer 组织样式
- [ ] 优化包大小（PurgeCSS）
- [ ] 保持可读性（不要过度嵌套）
- [ ] 使用语义化的类名顺序
- [ ] 测试响应式断点

## 🔗 相关资源

- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Tailwind UI Components](https://tailwindui.com/components)
- [Headwind UI](https://headlessui.com/)
- [Heroicons](https://heroicons.com/)

## 🎯 快速参考

### 常用间距
- `p-4` = padding: 1rem (16px)
- `m-4` = margin: 1rem (16px)
- `gap-4` = gap: 1rem (16px)

### 常用颜色
- `gray-500` = 中性灰
- `blue-600` = 主要蓝
- `red-500` = 错误红
- `green-500` = 成功绿

### 响应式断点
- `sm:` = 640px
- `md:` = 768px
- `lg:` = 1024px
- `xl:` = 1280px

---

**记住：** Tailwind CSS 的强大来自于一致性和可复用性。建立一套设计系统并坚持使用它。

**快速总结：**
1. 使用实用类构建 UI
2. 通过 @apply 创建可复用组件
3. 遵循移动优先响应式设计
4. 保持一致的间距和颜色
5. 使用 TypeScript 增强类型安全
6. 优化包大小和性能

**遵循这些模式，你的 UI 将快速、一致且易于维护。**
