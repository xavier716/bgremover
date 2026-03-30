# 快速测试指南

## 🎯 新逻辑说明

**所有用户共享 3 次免费机会**

无论匿名还是注册，总共只有 3 次免费使用机会。

---

## 📋 测试场景

### ✅ 场景 1：匿名使用 2 次 → 注册 → 还有 1 次

```bash
# 1. 清除数据
localStorage.clear()
location.reload()

# 2. 匿名使用 2 次
上传图片 → 处理 → 剩余 2
上传图片 → 处理 → 剩余 1

# 3. 注册
点击右上角 "Sign In" → Google 登录

# 4. 验证
登录后应该显示: 剩余次数: 1
不应该重置为 3！

# 5. 继续使用
上传图片 → 处理 → 剩余 0
再尝试 → 提示需要购买
```

### ✅ 场景 2：匿名使用 1 次 → 注册 → 还有 2 次

```bash
# 1. 清除数据
localStorage.clear()
location.reload()

# 2. 匿名使用 1 次
上传图片 → 处理 → 剩余 2

# 3. 注册
点击 "Sign In" → Google 登录

# 4. 验证
登录后应该显示: 剩余次数: 2

# 5. 继续使用
还可以使用 2 次
```

### ✅ 场景 3：匿名用完 3 次 → 注册 → 需要 0 次（需购买）

```bash
# 1. 清除数据
localStorage.clear()
location.reload()

# 2. 匿名用完 3 次
上传图片 → 处理 × 3 → 剩余 0

# 3. 注册
点击 "Sign In" → Google 登录

# 4. 验证
登录后应该显示: 剩余次数: 0
尝试处理 → 提示需要购买
```

### ✅ 场景 4：直接注册（未使用）→ 3 次免费

```bash
# 1. 清除数据
localStorage.clear()
location.reload()

# 2. 直接注册（先不使用）
点击 "Sign In" → Google 登录

# 3. 验证
登录后应该显示: 剩余次数: 3

# 4. 使用
可以使用 3 次
```

---

## 🧪 如何测试

### 在浏览器控制台运行

```javascript
// 查看当前数据
console.log(JSON.parse(localStorage.getItem('usage_data')))

// 计算剩余次数
const data = JSON.parse(localStorage.getItem('usage_data'))
console.log('已使用:', data.usageCount)
console.log('总次数:', data.totalCredits)
console.log('剩余:', data.totalCredits - data.usageCount)
console.log('是否登录:', !!data.currentUserId)

// 清除数据（重新测试）
localStorage.removeItem('usage_data')
location.reload()
```

---

## ✅ 验证要点

测试时重点验证：

1. **匿名使用次数正确**
   - 初始显示 3 次
   - 每次处理后 -1

2. **注册后保留剩余次数**
   - 匿名用 2 次 → 注册 → 还剩 1 次 ✅
   - 匿名用 1 次 → 注册 → 还剩 2 次 ✅
   - **不应该重置为 3** ❌

3. **用完后提示购买**
   - 3 次用完后显示升级提示
   - 注册也无法继续免费使用

4. **数据持久化**
   - 刷新页面次数不变
   - 关闭浏览器重新打开次数不变

---

## 🚀 开始测试

```bash
# 启动开发服务器
npm run dev

# 访问
http://localhost:3000

# 清除数据开始测试
# 按 F12 打开控制台，运行：
localStorage.removeItem('usage_data')
location.reload()
```

---

## 📊 数据存储位置

**浏览器 localStorage**
- 键名: `usage_data`
- 路径: F12 → Application → Local Storage

**数据示例：**
```json
{
  "currentUserId": "user_xxx",     // 如果已登录
  "anonymousId": "anon_xxx",       // 始终存在
  "usageCount": 2,                 // 已使用 2 次
  "totalCredits": 3,               // 总共 3 次
  "planType": "free",              // 免费套餐
  "lastReset": "2026-03-30..."
}
```

---

## ❌ 常见误解

### 错误理解 1
> "注册后会重置为 3 次免费"

**错误！** 注册后应该保留已使用的次数。

### 错误理解 2
> "匿名用户和注册用户各自有 3 次免费"

**错误！** 总共只有 3 次免费，共享。

### 错误理解 3
> "注册后可以获得额外免费次数"

**错误！** 注册不会增加免费次数，只是保留剩余次数。

---

## ✅ 正确理解

1. 总共 3 次免费机会（所有用户共享）
2. 匿名使用会扣除这 3 次
3. 注册后保留剩余次数
4. 3 次用完需要购买

---

**测试时如果发现任何问题，请告诉我！**
