// components/progressBar/progressBar.js
Component({
  properties: {
    current: { type: Number, value: 1 },
    total: { type: Number, value: 32 },
    period: { type: String, value: '上半场' },
    isStoppageTime: { type: Boolean, value: false }
  },

  data: {
    percent: 0
  },

  observers: {
    'current, total': function (current, total) {
      if (total <= 0) return
      this.setData({
        percent: (current / total) * 100
      })
    }
  },

  lifetimes: {
    attached() {
      this.updatePercent()
    }
  },

  methods: {
    updatePercent() {
      const { current, total } = this.properties
      if (total <= 0) return
      this.setData({
        percent: (current / total) * 100
      })
    }
  }
})
