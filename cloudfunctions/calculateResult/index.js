// cloudfunctions/calculateResult/index.js
const cloud = require('wx-server-sdk')
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })
const db = cloud.database()

/**
 * 计算 MBTI 类型并匹配球星
 * 输入: { answers: ['A','B',...] } (32个元素的数组)
 * 输出: { type, star, matchRate, dimensions }
 */
exports.main = async (event, context) => {
  try {
    const { answers } = event
    const wxContext = cloud.getWXContext()

    if (!answers || answers.length !== 32) {
      return { code: -1, msg: '答案数量不正确' }
    }

    // 获取所有题目
    let questions
    try {
      questions = (await db.collection('questions').limit(100).get()).data
    } catch (e) {
      return { code: -2, msg: '获取题目失败，请确认云数据库 questions 集合已创建' }
    }

    // 计分
    const scores = { E: 0, I: 0, S: 0, N: 0, T: 0, F: 0, J: 0, P: 0 }
    answers.forEach((answer, i) => {
      const q = questions[i]
      if (!q) return
      if (answer === 'A') {
        scores[q.dimensionA] += 1
      } else {
        scores[q.dimensionB] += 1
      }
    })

    // 算类型
    const type = [
      scores.E >= scores.I ? 'E' : 'I',
      scores.S >= scores.N ? 'S' : 'N',
      scores.T >= scores.F ? 'T' : 'F',
      scores.J >= scores.P ? 'J' : 'P'
    ].join('')

    // 匹配度
    const dimRates = [
      Math.max(scores.E, scores.I) / 8,
      Math.max(scores.S, scores.N) / 8,
      Math.max(scores.T, scores.F) / 8,
      Math.max(scores.J, scores.P) / 8
    ]
    const matchRate = Math.round(dimRates.reduce((a, b) => a + b, 0) / 4 * 100)

    // 查球星
    let star = null
    try {
      const starsData = (await db.collection('stars').limit(100).get()).data
      star = starsData.find(s => s.mbti === type) || null
    } catch (e) {
      // stars 集合不存在时静默降级
    }

    // 保存记录
    try {
      await db.collection('records').add({
        data: {
          openid: wxContext.OPENID,
          result: type,
          matchedStar: star ? star._id : null,
          answers,
          scores,
          matchRate,
          createTime: db.serverDate()
        }
      })
    } catch (e) {
      // 记录保存失败不影响结果返回
      console.error('保存记录失败:', e)
    }

    return {
      code: 0,
      data: {
        type,
        star,
        matchRate,
        dimensions: {
          EI: type[0], SN: type[1], TF: type[2], JP: type[3]
        },
        scores
      }
    }
  } catch (err) {
    console.error('calculateResult 异常:', err)
    return { code: -99, msg: '服务器内部错误' }
  }
}
