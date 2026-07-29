// pages/result/result.js
const stars = require('../../utils/stars')

const starEmojis = {
  haaland: '👻', lautaro: '🐂', pedri: '🎯', salah: '🐱',
  vandijk: '🛡️', messi: '🐐', yamal: '🌈', debruyne: '🧠',
  mbappe: '⚡', vinicius: '💃', neymar: '🎭', musiala: '🌀',
  kane: '🦁', griezmann: '🎪', bellingham: '👑', ronaldo: '🐐'
}

function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath()
  ctx.moveTo(x + r, y)
  ctx.lineTo(x + w - r, y)
  ctx.quadraticCurveTo(x + w, y, x + w, y + r)
  ctx.lineTo(x + w, y + h - r)
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h)
  ctx.lineTo(x + r, y + h)
  ctx.quadraticCurveTo(x, y + h, x, y + h - r)
  ctx.lineTo(x, y + r)
  ctx.quadraticCurveTo(x, y, x + r, y)
  ctx.closePath()
}

Page({
  data: {
    star: null,
    matchRate: 0,
    showResult: false,
    starEmoji: '⚽',
    dimensions: []
  },

  onLoad(options) {
    options = options || {}
    const { type, starId, matchRate } = options

    let star = stars.find(s => s.id === starId)
    if (!star) {
      star = stars.find(s => s.mbti === type) || stars[0]
    }

    const finalType = type || star.mbti || 'ISFP'

    const quizResult = getApp().globalData.quizResult
    let dimensions
    if (quizResult && quizResult.scores) {
      const s = quizResult.scores
      const calc = (a, b) => Math.round(Math.max(a, b) / 8 * 100)
      dimensions = [
        { label: finalType[0] === 'E' ? '外倾' : '内倾', value: finalType[0], percent: calc(s.E, s.I) },
        { label: finalType[1] === 'S' ? '实感' : '直觉', value: finalType[1], percent: calc(s.S, s.N) },
        { label: finalType[2] === 'T' ? '思考' : '情感', value: finalType[2], percent: calc(s.T, s.F) },
        { label: finalType[3] === 'J' ? '判断' : '感知', value: finalType[3], percent: calc(s.J, s.P) }
      ]
    } else {
      dimensions = [
        { label: finalType[0] === 'E' ? '外倾' : '内倾', value: finalType[0], percent: 75 },
        { label: finalType[1] === 'S' ? '实感' : '直觉', value: finalType[1], percent: 70 },
        { label: finalType[2] === 'T' ? '思考' : '情感', value: finalType[2], percent: 80 },
        { label: finalType[3] === 'J' ? '判断' : '感知', value: finalType[3], percent: 65 }
      ]
    }

    this.setData({
      star,
      matchRate: parseInt(matchRate) || 85,
      starEmoji: starEmojis[star.id] || '⚽',
      dimensions,
      showResult: true
    })
  },

  retryTest() {
    wx.redirectTo({ url: '/pages/quiz/quiz' })
  },

  // ==================== 海报生成 ====================

  savePoster() {
    this.drawPoster()
      .then(tempPath => this.saveToAlbum(tempPath))
      .catch(err => {
        wx.hideLoading()
        if (typeof err === 'string') {
          wx.showToast({ title: err, icon: 'none' })
        } else {
          wx.showToast({ title: '生成海报失败', icon: 'none' })
        }
      })
  },

  // 第一步：获取 QR 码（3s 超时），然后画海报
  async drawPoster() {
    const star = this.data.star
    if (!star) throw '暂无球星数据'
    wx.showLoading({ title: '生成海报中...', mask: true })

    // 尝试获取 QR 码，5 秒超时
    let qrImgPath = ''
    try {
      const url = await Promise.race([
        this.fetchQRCode(),
        new Promise((_, rj) => setTimeout(() => rj('timeout'), 10000))
      ])
      if (url) {
        const info = await wx.getImageInfo({ src: url })
        qrImgPath = info.path
      }
    } catch (e) { /* QR 码不可用，跳过 */ }

    return this.renderPoster(star, qrImgPath)
  },

  // 第二步：等待 QR 码图片加载完成，再绘制和导出
  renderPoster(star, qrImgPath) {
    return new Promise((resolve, reject) => {
      wx.createSelectorQuery().select('#posterCanvas')
        .fields({ node: true, size: true })
        .exec((res) => {
          try {
            const canvas = res[0].node
            const ctx = canvas.getContext('2d')
            const W = 540, H = 780
            const dpr = wx.getDeviceInfo().pixelRatio || 2
            canvas.width = W * dpr
            canvas.height = H * dpr
            ctx.scale(dpr, dpr)

            // 先加载 QR 码图片（等待完成）
            const drawAll = (qrImg) => {
              // 1. 背景
              const bg = ctx.createLinearGradient(0, 0, 0, H)
              bg.addColorStop(0, '#0D3010'); bg.addColorStop(0.4, '#1B5E20')
              bg.addColorStop(0.7, '#1a3a2a'); bg.addColorStop(1, '#0D3010')
              ctx.fillStyle = bg; ctx.fillRect(0, 0, W, H)
              ctx.strokeStyle = 'rgba(255,255,255,0.03)'; ctx.lineWidth = 1
              for (let y = 0; y < H; y += 30) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke() }

              // 2. 金色边框
              ctx.strokeStyle = '#FFD700'; ctx.lineWidth = 4; ctx.strokeRect(16, 16, W - 32, H - 32)
              ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(50, 50, 20, Math.PI, Math.PI * 1.5); ctx.stroke()

              // 3. 顶部
              ctx.textAlign = 'center'; ctx.textBaseline = 'top'
              ctx.font = 'bold 26px sans-serif'; ctx.fillStyle = '#FFD700'
              ctx.fillText('⚽ FBTI', W / 2, 42)

              // 4. emoji
              ctx.font = '120px sans-serif'; ctx.textBaseline = 'middle'
              ctx.fillText(this.data.starEmoji, W / 2, 200)
              ctx.beginPath(); ctx.arc(W / 2, 200, 90, 0, Math.PI * 2)
              ctx.strokeStyle = 'rgba(255,215,0,0.2)'; ctx.lineWidth = 2; ctx.stroke()

              // 5. 姓名
              ctx.textBaseline = 'top'
              ctx.font = 'bold 38px sans-serif'; ctx.fillStyle = '#FFD700'
              ctx.fillText(star.name + '型人格', W / 2, 285)
              ctx.font = '20px sans-serif'; ctx.fillStyle = 'rgba(255,255,255,0.75)'
              ctx.fillText(star.mbti + ' · ' + star.title, W / 2, 330)

              // 6. 分隔线
              ctx.strokeStyle = 'rgba(255,215,0,0.15)'; ctx.lineWidth = 1
              ctx.beginPath(); ctx.moveTo(80, 375); ctx.lineTo(W - 80, 375); ctx.stroke()

              // 7. 匹配度
              const mr = this.data.matchRate
              ctx.font = 'bold 54px sans-serif'; ctx.fillStyle = '#FFD700'
              ctx.fillText(mr + '%', W / 2, 400)
              ctx.font = '16px sans-serif'; ctx.fillStyle = 'rgba(255,255,255,0.5)'
              ctx.fillText('匹 配 度', W / 2, 460)
              const bw = 280, bh = 14, bx = (W - bw) / 2, by = 490
              ctx.fillStyle = 'rgba(255,255,255,0.1)'; roundRect(ctx, bx, by, bw, bh, 7); ctx.fill()
              const fw = bw * (mr / 100)
              if (fw > 0) {
                const fg = ctx.createLinearGradient(bx, 0, bx + bw, 0)
                fg.addColorStop(0, '#4CAF50'); fg.addColorStop(1, '#FFD700')
                ctx.fillStyle = fg; roundRect(ctx, bx, by, fw, bh, 7); ctx.fill()
              }

              // 8. 金句
              ctx.textAlign = 'center'; ctx.textBaseline = 'top'
              ctx.font = 'italic 17px sans-serif'; ctx.fillStyle = 'rgba(255,255,255,0.8)'
              const lines = this.wrapText(ctx, '"' + star.matchQuote + '"', W - 100)
              lines.forEach((l, i) => ctx.fillText(l, W / 2, 530 + i * 26))

              // 9. 品牌（上移给右下角 QR 码留空间）
              const brandY = H - 150
              ctx.font = '15px sans-serif'; ctx.fillStyle = 'rgba(255,255,255,0.25)'
              ctx.fillText('—  FBTI · 足球人格测试  —', W / 2, brandY)
              ctx.font = '13px sans-serif'; ctx.fillStyle = 'rgba(255,215,0,0.45)'
              ctx.fillText('MBTI已经过时，FBTI来啦^_^!', W / 2, brandY + 28)

              // 10. QR 码（右下角，在金色边框内）
              if (qrImg) {
                const qs = 75, margin = 28
                const qx = W - qs - margin, qy = H - qs - margin
                ctx.fillStyle = '#fff'; roundRect(ctx, qx - 4, qy - 4, qs + 8, qs + 8, 8); ctx.fill()
                ctx.strokeStyle = 'rgba(255,215,0,0.15)'; ctx.lineWidth = 2
                roundRect(ctx, qx - 4, qy - 4, qs + 8, qs + 8, 8); ctx.stroke()
                ctx.drawImage(qrImg, qx, qy, qs, qs)
              }

              // 11. 水印
              ctx.font = '11px sans-serif'; ctx.fillStyle = 'rgba(255,255,255,0.12)'
              ctx.textAlign = 'left'; ctx.textBaseline = 'bottom'
              ctx.fillText('FBTI @ 2026', 30, H - 30)

              // 导出
              let st = false
              setTimeout(() => { if (!st) { st = true; reject('生成超时') } }, 8000)
              wx.canvasToTempFilePath({
                canvas, width: W * dpr, height: H * dpr,
                destWidth: W * dpr, destHeight: H * dpr,
                fileType: 'jpg', quality: 0.92,
                success: (r) => { if (!st) { st = true; resolve(r.tempFilePath) } },
                fail: () => { if (!st) { st = true; reject('生成失败') } }
              }, this)
            }

            // 如果有 QR 码，先等图片加载完成再画全部内容
            if (qrImgPath) {
              const img = canvas.createImage()
              img.onload = () => drawAll(img)
              img.onerror = () => drawAll(null)
              img.src = qrImgPath
            } else {
              drawAll(null)
            }
          } catch (e) { reject('生成海报异常') }
        })
    })
  },

  wrapText(ctx, text, maxWidth) {
    const lines = []; let cur = ''
    for (const ch of text) {
      const t = cur + ch
      if (ctx.measureText(t).width > maxWidth && cur) { lines.push(cur); cur = ch }
      else cur = t
    }
    if (cur) lines.push(cur)
    return lines.length ? lines : [text]
  },

  // 保存到相册（含权限处理）
  saveToAlbum(tempPath) {
    wx.hideLoading()
    wx.showLoading({ title: '保存中...', mask: true })

    // 转存为持久文件（线上环境临时路径可能不可写）
    wx.saveFile({
      tempFilePath: tempPath,
      success: (saveRes) => {
        wx.saveImageToPhotosAlbum({
          filePath: saveRes.savedFilePath,
          success: () => {
            wx.hideLoading()
            wx.showModal({
              title: '✅ 保存成功',
              content: '海报已保存到相册，快去朋友圈炫耀吧！',
              showCancel: false
            })
          },
          fail: (err) => {
            wx.hideLoading()
            if (err.errMsg && err.errMsg.indexOf('auth deny') !== -1) {
              wx.showModal({
                title: '需要相册权限',
                content: '保存图片需要访问你的相册，是否去设置开启？',
                success: (res) => { if (res.confirm) wx.openSetting() }
              })
            } else {
              wx.showToast({ title: '保存失败，请手动截图', icon: 'none' })
            }
          }
        })
      },
      fail: () => {
        // saveFile 失败时直接用原路径
        wx.saveImageToPhotosAlbum({
          filePath: tempPath,
          success: () => {
            wx.hideLoading()
            wx.showModal({
              title: '✅ 保存成功',
              content: '海报已保存到相册，快去朋友圈炫耀吧！',
              showCancel: false
            })
          },
          fail: (err) => {
            wx.hideLoading()
            if (err.errMsg && err.errMsg.indexOf('auth deny') !== -1) {
              wx.showModal({
                title: '需要相册权限',
                content: '保存图片需要访问你的相册，是否去设置开启？',
                success: (res) => { if (res.confirm) wx.openSetting() }
              })
            } else {
              wx.showToast({ title: '保存失败，请手动截图', icon: 'none' })
            }
          }
        })
      }
    })
  },

  fetchQRCode() {
    return new Promise((resolve, reject) => {
      wx.request({
        url: 'https://mateng.site/api/getQRCode',
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

  onShareAppMessage() {
    const star = this.data.star
    return { title: '我是' + star.name + '型人格！来测测你的FBTI足球人格 🔥', path: '/pages/index/index' }
  },

  onShareTimeline() {
    const star = this.data.star
    return {
      title: '我是' + star.name + '型人格！⚽ FBTI 足球人格测试'
    }
  }
})
