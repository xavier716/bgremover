# 使用量系统说明

## 📊 当前配置

### 匿名用户
- **免费次数**: 3 次
- **重置周期**: 每月
- **存储方式**: localStorage

### 注册用户
- **免费次数**: 0 次（需要购买）
- **购买选项**:
  - Starter: $4.99 / 100 次
  - Pro: $19.99 / 500 次
- **存储方式**: localStorage

## 🔧 工作原理

### 1. 客户端追踪
- 使用 localStorage 存储使用数据
- 键名格式:
  - 匿名用户: `usage_anon_{anonymousId}`
  - 注册用户: `usage_user_{userId}`

### 2. API 路由
- `GET /api/usage/check` - 检查剩余次数
- `POST /api/remove-background` - 使用一次（扣除次数）

### 3. 自动重置
- 每月自动重置使用次数
- 重置日期保存在 `lastReset` 字段

## 🧪 测试步骤

### 测试匿名用户（3 次免费）

1. **清除浏览器数据**
   ```
   打开浏览器开发者工具 (F12)
   → Application 标签
   → Local Storage
   → 删除所有以 "usage_" 开头的键
   ```

2. **访问应用**
   ```
   http://localhost:3000
   ```

3. **验证显示**
   - 右上角应显示: "剩余次数: 3"
   - 或 "Remaining Credits: 3"

4. **上传并处理图片**
   - 上传一张图片
   - 点击 "Remove Background"
   - 等待处理完成
   - 剩余次数应变为 2

5. **重复测试**
   - 再处理 2 张图片
   - 第 3 次处理后，剩余次数应变为 0

6. **测试限制**
   - 尝试处理第 4 张图片
   - 应显示 "免费次数已用完" 的弹窗
   - 提示注册或购买

### 测试注册用户（0 次免费，需购买）

1. **注册/登录**
   ```
   访问: http://localhost:3000/sign-in
   点击: "Continue with Google"
   ```

2. **验证显示**
   - 登录后，右上角应显示: "剩余次数: 0"
   - 或 "Remaining Credits: 0"

3. **尝试处理图片**
   - 上传图片并点击 "Remove Background"
   - 应立即显示升级提示
   - 提示购买积分

4. **购买积分**
   ```
   点击升级弹窗中的 "Upgrade" 按钮
   或访问: /pricing
   选择套餐并完成支付
   ```

## 🐛 故障排除

### 问题 1: 显示剩余次数，但处理时报错

**原因**: localStorage 和服务器端数据不同步

**解决方案**:
1. 清除浏览器缓存
2. 删除 localStorage 中的 `usage_*` 键
3. 刷新页面重新开始

### 问题 2: 剩余次数不更新

**原因**: 前端未正确更新状态

**解决方案**:
1. 打开浏览器控制台 (F12)
2. 检查 Network 标签
3. 查看 `/api/usage/check` 响应
4. 查看 `/api/remove-background` 响应中的 `remaining` 字段

### 问题 3: 登录后仍显示匿名用户次数

**原因**: Session 未正确更新

**解决方案**:
1. 检查 `session` 对象是否包含 `user.id`
2. 在控制台运行:
   ```javascript
   localStorage.clear()
   location.reload()
   ```
3. 重新登录

## 📝 数据结构

### localStorage 数据格式
```json
{
  "userId": "user_123",
  "anonymousId": "anon_456",
  "usageCount": 2,
  "limit": 3,
  "planType": "free",
  "lastReset": "2026-03-30T00:00:00.000Z"
}
```

## 🔄 重置使用数据

### 开发测试用
```javascript
// 在浏览器控制台运行
localStorage.clear()
location.reload()
```

### 重置特定用户
```javascript
// 匿名用户
localStorage.removeItem('usage_anon_xxx')

// 注册用户
localStorage.removeItem('usage_user_xxx')
```

## ✅ 验证清单

测试时确保以下功能正常：

- [ ] 匿名用户显示 3 次免费
- [ ] 处理图片后次数正确减少
- [ ] 用完 3 次后正确阻止使用
- [ ] 显示升级提示
- [ ] 注册用户显示 0 次免费
- [ ] 注册用户无法免费处理
- [ ] 购买后次数正确增加
- [ ] 登录/登出次数正确切换
- [ ] 中英文切换正常显示
