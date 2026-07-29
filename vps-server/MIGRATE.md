# 小程序端迁移指南

## 需要修改的文件

### 1. `app.js` — 删除云开发初始化

**修改前：**
```javascript
App({
  onLaunch() {
    wx.cloud.init({
      env: 'cloudbase-d2g45ak5c15c694e4',
      traceUser: true
    })
  },
  globalData: {
    userResult: null
  }
})
```

**修改后：**
```javascript
App({
  onLaunch() {},
  globalData: {
    userResult: null
  }
})
```

> 也可以保留 `wx.cloud.init()`，云开发过期后它只是初始化失败，不影响 `wx.request`。但删了更干净。

---

### 2. `pages/quiz/quiz.js` — 答题结果改存到 VPS

**修改前（finishQuiz 内）：**
```javascript
wx.cloud.callFunction({
  name: 'calculateResult',
  data: { answers: this.data.answers }
}).then(() => {
  wx.hideLoading()
  wx.redirectTo({
    url: '/pages/result/result?type=' + result.type + '&starId=' + result.starId + '&matchRate=' + Math.round(result.matchRate * 100)
  })
}).catch(() => {
  wx.hideLoading()
  wx.redirectTo({
    url: '/pages/result/result?type=' + result.type + '&starId=' + result.starId + '&matchRate=' + Math.round(result.matchRate * 100)
  })
})
```

**修改后：**
```javascript
// 先用本地计算结果跳转，同时异步存到 VPS（不阻塞跳转）
wx.redirectTo({
  url: '/pages/result/result?type=' + result.type + '&starId=' + result.starId + '&matchRate=' + Math.round(result.matchRate * 100)
})

// 异步保存记录到 VPS（不影响用户体验）
wx.request({
  url: 'https://你的域名.com/api/saveResult',
  method: 'POST',
  data: {
    type: result.type,
    starId: result.starId,
    matchRate: Math.round(result.matchRate * 100),
    answers: this.data.answers,
    scores: result.scores
  },
  fail: () => {}  // 静默处理
})
```

---

### 3. `pages/result/result.js` — 二维码从 VPS 获取

**把 `fetchQRCode` 方法改成：**
```javascript
fetchQRCode() {
  return new Promise((resolve, reject) => {
    wx.request({
      url: 'https://你的域名.com/api/getQRCode',
      success: (res) => {
        if (res.data && res.data.code === 0 && res.data.data.tempFileURL) {
          resolve(res.data.data.tempFileURL)
        } else {
          reject('QR unavailable')
        }
      },
      fail: () => reject('network error')
    })
  })
},
```

---

### 4. 可选：删除云函数目录

项目里的 `cloudfunctions/` 目录用不上了，可以删掉。

---

## 微信后台配置

登录 [mp.weixin.qq.com](https://mp.weixin.qq.com)

**「开发」→「开发管理」→「服务器域名」**

在 **「request 合法域名」** 添加：
```
https://你的域名.com
```

---

## 修改完成后需要重新上传发布

```
上传代码（版本号如 1.0.4）
  → 提交审核
  → 审核通过后发布
```
