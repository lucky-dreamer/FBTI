// app.js
App({
  onLaunch() {
    wx.cloud.init({
      env: 'cloudbase-d2g45ak5c15c694e4', // 云环境ID
      traceUser: true
    })
  },

  globalData: {
    userResult: null // 临时存储测试结果
  }
})
