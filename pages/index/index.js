// pages/index/index.js
Page({
  data: {
    userCount: '3,642'
  },

  onLoad() {},

  onShow() {
    const raw = parseInt(this.data.userCount.replace(/,/g, ''))
    const growth = Math.random() < 0.3 ? 1 : 0
    this.setData({
      userCount: (raw + growth).toLocaleString()
    })
  },

  startQuiz() {
    wx.navigateTo({ url: '/pages/quiz/quiz' })
  },

  // 转发给朋友
  onShareAppMessage() {
    return {
      title: 'MBTI已经过时，FBTI来啦！测测你是哪位世界杯球星 ⚽',
      path: '/pages/index/index'
    }
  },

  // 分享到朋友圈
  onShareTimeline() {
    return {
      title: 'FBTI 足球人格测试 - 测测你是哪位世界杯球星'
    }
  }
})
