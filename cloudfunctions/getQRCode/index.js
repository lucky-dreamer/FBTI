// cloudfunctions/getQRCode/index.js
const cloud = require('wx-server-sdk')
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })
const https = require('https')
const db = cloud.database()

exports.main = async (event) => {
  try {
    const secret = process.env.WX_SECRET
    if (!secret) return { code: -1, msg: '未配置 WX_SECRET 环境变量' }

    const appid = 'wxc509ae6ed33bbbfc'

    // 1. 从缓存取 access_token（key 查询，不依赖 doc id）
    let accessToken = ''
    try {
      const { data: list } = await db.collection('token_cache')
        .where({ key: 'wx_access_token' })
        .limit(1)
        .get()
      if (list.length > 0 && list[0].token && list[0].expireAt > Date.now()) {
        accessToken = list[0].token
        console.log('✅ 使用缓存的 access_token')
      }
    } catch (e) { /* 无缓存 */ }

    // 2. 缓存失效则重新获取
    if (!accessToken) {
      const raw = await httpGet(
        `https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${appid}&secret=${secret}`
      )
      const td = JSON.parse(raw)
      if (td.errcode) return { code: -1, msg: 'token 获取失败', detail: td }
      accessToken = td.access_token
      console.log('✅ 新获取 access_token')

      // 存入缓存：更新已存在的或新建
      try {
        const { data: list } = await db.collection('token_cache')
          .where({ key: 'wx_access_token' })
          .limit(1)
          .get()
        if (list.length > 0) {
          await db.collection('token_cache').doc(list[0]._id).update({
            data: { token: accessToken, expireAt: Date.now() + 7000 * 1000 }
          })
        } else {
          await db.collection('token_cache').add({
            data: { key: 'wx_access_token', token: accessToken, expireAt: Date.now() + 7000 * 1000 }
          })
        }
      } catch (e) {
        console.error('缓存写入失败:', e)
      }
    }

    // 3. 生成小程序码
    const qrBuf = await httpPost(
      `https://api.weixin.qq.com/wxa/getwxacodeunlimit?access_token=${accessToken}`,
      { scene: 'from=poster', page: 'pages/index/index', width: 280, auto_color: true }
    )

    if (qrBuf[0] === 0x7b) {
      const err = JSON.parse(qrBuf.toString('utf-8'))
      return { code: -1, msg: '生成小程序码失败', detail: err }
    }

    // 4. 上传到云存储
    const cloudPath = 'qrcode/poster_qr_' + Date.now() + '.png'
    const uploadRes = await cloud.uploadFile({ cloudPath, fileContent: qrBuf })
    const fileInfo = await cloud.getTempFileURL({ fileList: [uploadRes.fileID] })

    return { code: 0, data: { fileID: uploadRes.fileID, tempFileURL: fileInfo.fileList[0].tempFileURL } }
  } catch (err) {
    console.error('生成失败:', err)
    return { code: -1, msg: '生成失败', detail: err.message }
  }
}

function httpGet(url) {
  return new Promise((resolve, reject) => {
    https.get(url, res => { let d = ''; res.on('data', c => d += c); res.on('end', () => resolve(d)) }).on('error', reject)
  })
}

function httpPost(url, body) {
  return new Promise((resolve, reject) => {
    const buf = Buffer.from(JSON.stringify(body), 'utf-8')
    const u = new URL(url)
    const req = https.request({
      hostname: u.hostname, path: u.pathname + u.search, method: 'POST',
      headers: { 'Content-Type': 'application/json; charset=utf-8', 'Content-Length': buf.length }
    }, res => { const c = []; res.on('data', d => c.push(d)); res.on('end', () => resolve(Buffer.concat(c))) })
    req.write(buf); req.end(); req.on('error', reject)
  })
}
