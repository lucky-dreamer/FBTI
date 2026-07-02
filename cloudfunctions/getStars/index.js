// cloudfunctions/getStars/index.js
const cloud = require('wx-server-sdk')
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })
const db = cloud.database()

exports.main = async (event, context) => {
  try {
    const { type } = event
    if (type) {
      const res = await db.collection('stars').where({ mbti: type }).limit(1).get()
      return { code: 0, data: res.data[0] || null }
    }
    const res = await db.collection('stars').limit(100).get()
    return { code: 0, data: res.data }
  } catch (err) {
    console.error('getStars 异常:', err)
    return { code: -99, msg: '获取球星数据失败' }
  }
}
