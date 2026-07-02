// pages/index/index.js
Page({
  data: {
    userCount: '3,642'
  },

  onLoad() {
    // 从云存储缓存中读取测试人数（备用）
  },

  onShow() {
    // 每次回到首页小幅度更新，看起来更真实
    const raw = parseInt(this.data.userCount.replace(/,/g, ''))
    const growth = Math.random() < 0.3 ? 1 : 0  // 30%概率增长1人
    this.setData({
      userCount: (raw + growth).toLocaleString()
    })
  },

  startQuiz() {
    wx.navigateTo({
      url: '/pages/quiz/quiz'
    })
  }
})
