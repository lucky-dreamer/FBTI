// pages/quiz/quiz.js
const questions = require('../../utils/questions')
const { calculateType } = require('../../utils/mbti')
const { shuffle, getMatchPeriod } = require('../../utils/helpers')

Page({
  data: {
    current: 1,
    total: 32,
    currentQuestion: null,
    selected: '',
    showHalfTime: false,
    animClass: 'slide-in',
    period: '上半场',
    progressPercent: 0,
    dimLabel: '',
    isStoppageTime: false,
    questionIndex: 0,
    dots: []
  },

  onLoad() {
    const dims = { EI: [], SN: [], TF: [], JP: [] }
    questions.forEach(q => dims[q.dimension].push(q))
    Object.keys(dims).forEach(k => { dims[k] = shuffle(dims[k]) })
    this.questions = [...dims.EI, ...dims.SN, ...dims.TF, ...dims.JP]

    this.answers = new Array(32).fill(null)
    this.isTransitioning = false
    this.autoTimer = null
    this.setQuestion(0)
  },

  // 计算底部小圆点状态（直接映射每个答案）
  computeDots() {
    const dots = []
    for (let i = 0; i < 32; i++) {
      dots.push({
        idx: i,
        filled: this.answers[i] !== null,
        active: i === this.questionIndex
      })
    }
    return dots
  },

  setQuestion(index) {
    this.questionIndex = index
    const q = this.questions[index]
    const current = index + 1
    const period = getMatchPeriod(current, 32)
    const progressPercent = (current / 32) * 100
    const dimLabels = { EI: '外倾 vs 内倾', SN: '实感 vs 直觉', TF: '思考 vs 情感', JP: '判断 vs 感知' }

    const selected = this.answers[index] || ''

    this.setData({
      current,
      currentQuestion: q,
      selected,
      animClass: 'slide-in',
      period,
      progressPercent,
      dimLabel: dimLabels[q.dimension] || '',
      isStoppageTime: current >= 28,
      questionIndex: index,
      dots: this.computeDots()
    })
    this.isTransitioning = false
  },

  selectOption(e) {
    const opt = e.currentTarget.dataset.opt
    if (this.isTransitioning) return

    const isNewQuestion = this.answers[this.questionIndex] === null

    // 新题目：点击相同选项 → 忽略（防连点）
    if (isNewQuestion && this.answers[this.questionIndex] === opt) return

    // 选项有变更时更新答案
    if (this.answers[this.questionIndex] !== opt) {
      this.answers[this.questionIndex] = opt
    }

    this.setData({
      selected: opt,
      dots: this.computeDots()
    })

    if (this.autoTimer) clearTimeout(this.autoTimer)
    this.autoTimer = setTimeout(() => this.advance(), 400)
  },

  advance() {
    if (this.isTransitioning) return

    if (this.questionIndex === 15) {
      this.setData({ showHalfTime: true })
      return
    }

    if (this.questionIndex >= 31) {
      this.finishQuiz()
      return
    }

    this.isTransitioning = true
    this.setData({ animClass: 'slide-out' })
    setTimeout(() => this.setQuestion(this.questionIndex + 1), 250)
  },

  prevQuestion() {
    if (this.isTransitioning || this.questionIndex <= 0) return
    if (this.autoTimer) clearTimeout(this.autoTimer)

    this.isTransitioning = true
    this.setData({ animClass: 'slide-out' })
    setTimeout(() => this.setQuestion(this.questionIndex - 1), 250)
  },

  jumpToQuestion(e) {
    const idx = parseInt(e.currentTarget.dataset.idx)
    if (this.isTransitioning) return
    const maxReachable = this.computeDots().filter(d => d.filled).length
    if (idx > maxReachable) return
    if (idx === this.questionIndex) return
    if (this.autoTimer) clearTimeout(this.autoTimer)

    this.isTransitioning = true
    this.setData({ animClass: 'slide-out' })
    setTimeout(() => this.setQuestion(idx), 250)
  },

  continueQuiz() {
    this.setData({ showHalfTime: false })
    this.setQuestion(16)
  },

  finishQuiz() {
    const result = calculateType(this.answers)

    getApp().globalData.quizResult = result

    // 立即跳转到结果页（不等待服务器）
    wx.redirectTo({
      url: '/pages/result/result?type=' + result.type + '&starId=' + result.starId + '&matchRate=' + Math.round(result.matchRate * 100)
    })

    // 异步保存记录到 VPS
    wx.request({
      url: 'https://mateng.site/api/saveResult',
      method: 'POST',
      data: {
        type: result.type,
        starId: result.starId,
        matchRate: Math.round(result.matchRate * 100),
        answers: this.answers,
        scores: result.scores
      },
      fail: () => {}
    })
  },

  onShareAppMessage() {
    return {
      title: '32道题测出你的世界杯球星人格！来试试 ⚽',
      path: '/pages/index/index'
    }
  },

  onShareTimeline() {
    return {
      title: 'FBTI 足球人格测试 - 测测你是哪位世界杯球星'
    }
  }
})
