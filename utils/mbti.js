// utils/mbti.js
const stars = require('./stars')

/**
 * 根据 32 题答案计算 MBTI 类型
 * @param {string[]} answers - 32 个元素的数组，每个元素是 'A' 或 'B'
 * @returns {{ type: string, starId: string, dimensions: object, matchRate: number }}
 */
function calculateType(answers) {
  const questions = require('./questions')
  const scores = { E: 0, I: 0, S: 0, N: 0, T: 0, F: 0, J: 0, P: 0 }

  answers.forEach((answer, i) => {
    const q = questions[i]
    if (answer === 'A') {
      scores[q.dimensionA] += 1
    } else {
      scores[q.dimensionB] += 1
    }
  })

  const dimensions = {
    EI: scores.E >= scores.I ? 'E' : 'I',
    SN: scores.S >= scores.N ? 'S' : 'N',
    TF: scores.T >= scores.F ? 'T' : 'F',
    JP: scores.J >= scores.P ? 'J' : 'P'
  }

  const type = dimensions.EI + dimensions.SN + dimensions.TF + dimensions.JP

  // 匹配度计算：每个维度胜出比例的平均值
  const dimRates = [
    Math.max(scores.E, scores.I) / 8,
    Math.max(scores.S, scores.N) / 8,
    Math.max(scores.T, scores.F) / 8,
    Math.max(scores.J, scores.P) / 8
  ]
  const matchRate = dimRates.reduce((a, b) => a + b, 0) / 4

  // 找到对应球星
  const matched = stars.find(s => s.mbti === type)

  return {
    type,
    starId: matched ? matched.id : 'default',
    dimensions,
    scores,
    matchRate
  }
}

module.exports = { calculateType }
