// vps-server/index.js
const express = require('express')
const cors = require('cors')
const path = require('path')
const fs = require('fs-extra')
const axios = require('axios')
require('dotenv').config()

const app = express()
app.use(cors())
app.use(express.json())

const PORT = process.env.PORT || 3000
const APPID = process.env.WX_APPID
const SECRET = process.env.WX_SECRET
const DATA_DIR = path.join(__dirname, 'data')

// ===== 缓存 access_token =====
let cachedToken = ''
let tokenExpireAt = 0

async function getAccessToken() {
  if (cachedToken && Date.now() < tokenExpireAt) return cachedToken

  const res = await axios.get('https://api.weixin.qq.com/cgi-bin/token', {
    params: { grant_type: 'client_credential', appid: APPID, secret: SECRET }
  })
  if (res.data.errcode) throw new Error(`token 获取失败: ${JSON.stringify(res.data)}`)

  cachedToken = res.data.access_token
  tokenExpireAt = Date.now() + (res.data.expires_in - 200) * 1000  // 提前 200s 过期
  return cachedToken
}

// ===== API: 生成小程序码 =====
app.get('/api/getQRCode', async (req, res) => {
  try {
    const token = await getAccessToken()

    const wxRes = await axios.post(
      `https://api.weixin.qq.com/wxa/getwxacodeunlimit?access_token=${token}`,
      {
        scene: 'from=poster',
        page: 'pages/index/index',
        width: 280,
        auto_color: true
      },
      { responseType: 'arraybuffer' }
    )

    // 判断返回的是图片还是 JSON 错误
    const firstByte = wxRes.data[0]
    if (firstByte === 0x7b) {
      const err = JSON.parse(Buffer.from(wxRes.data).toString('utf-8'))
      return res.status(500).json({ code: -1, msg: '微信API返回错误', detail: err })
    }

    // 保存图片到本地
    const fileName = `qr_${Date.now()}.png`
    const filePath = path.join(DATA_DIR, 'qrcodes', fileName)
    await fs.outputFile(filePath, wxRes.data)

    // 返回可访问的 URL（强制 https，微信要求必须 https + 白名单域名）
    const host = req.get('host')
    const url = `https://${host}/qrcodes/${fileName}`

    res.json({ code: 0, data: { tempFileURL: url } })
  } catch (err) {
    console.error('生成二维码失败:', err)
    res.status(500).json({ code: -1, msg: '生成失败', detail: err.message })
  }
})

// ===== API: 保存测试记录 =====
app.post('/api/saveResult', async (req, res) => {
  try {
    const { type, starId, matchRate, answers, scores } = req.body
    if (!type) return res.status(400).json({ code: -1, msg: '缺少 type 参数' })

    const record = {
      type,
      starId,
      matchRate,
      answers: answers || [],
      scores: scores || {},
      createTime: new Date().toISOString()
    }

    // 追加存储到 JSON 文件（简单够用）
    const recordsPath = path.join(DATA_DIR, 'records.json')
    let records = []
    try {
      records = await fs.readJSON(recordsPath)
    } catch (e) { /* 文件还不存在 */ }
    records.push(record)
    await fs.writeJSON(recordsPath, records, { spaces: 2 })

    res.json({ code: 0, msg: '记录已保存' })
  } catch (err) {
    console.error('保存记录失败:', err)
    res.json({ code: -1, msg: '保存失败' })
  }
})

// ===== 静态文件：二维码图片 =====
app.use('/qrcodes', express.static(path.join(DATA_DIR, 'qrcodes')))

// ===== 启动前创建目录 =====
async function init() {
  await fs.ensureDir(path.join(DATA_DIR, 'qrcodes'))
  console.log('✅ 数据目录已就绪')
}

init().then(() => {
  app.listen(PORT, () => {
    console.log(`FBTI 服务已启动: http://localhost:${PORT}`)
    console.log(`API 接口:`)
    console.log(`  GET  /api/getQRCode  → 生成小程序码`)
    console.log(`  POST /api/saveResult  → 保存测试记录`)
  })
})
