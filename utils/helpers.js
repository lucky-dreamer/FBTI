// utils/helpers.js

/**
 * 打乱数组顺序（Fisher-Yates）
 */
function shuffle(arr) {
  const result = [...arr]
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]]
  }
  return result
}

/**
 * 进度阶段转换
 * 1-16 -> '上半场', 17-32 -> '下半场', 最后5题 -> '伤停补时'
 */
function getMatchPeriod(current, total) {
  if (current >= total - 4) return '伤停补时'
  if (current <= total / 2) return '上半场'
  return '下半场'
}

/**
 * 格式化匹配度（保留整数）
 */
function formatMatchRate(rate) {
  return Math.min(100, Math.max(0, Math.round(rate * 100)))
}

/**
 * 延迟函数（ms）
 */
function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

module.exports = {
  shuffle,
  getMatchPeriod,
  formatMatchRate,
  delay
}
