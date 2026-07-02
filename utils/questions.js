// utils/questions.js
const questions = [
  // ===== E/I 维度 (8题) - 足球社交方式 =====
  {
    id: 'q01', dimension: 'EI',
    question: '世界杯决赛夜，你准备怎么看？',
    optionA: '约一帮兄弟去酒吧，越热闹越好 🍻',
    optionB: '自己在家安安静静看，泡杯茶慢慢享受 ☕',
    dimensionA: 'E', dimensionB: 'I'
  },
  {
    id: 'q02', dimension: 'EI',
    question: '遇到一个不太懂球的朋友问越位是啥，你会？',
    optionA: '热情科普，恨不得画战术板给他讲明白 📢',
    optionB: '简单说两句，然后默默转移话题 😏',
    dimensionA: 'E', dimensionB: 'I'
  },
  {
    id: 'q03', dimension: 'EI',
    question: '世界杯期间你的朋友圈画风是什么样的？',
    optionA: '每场必发，进球就发小视频，互动拉满 📱',
    optionB: '偶尔发一张看球照，或者干脆不发声 🤫',
    dimensionA: 'E', dimensionB: 'I'
  },
  {
    id: 'q04', dimension: 'EI',
    question: '去现场看球你更喜欢坐在哪个区？',
    optionA: '死忠球迷区，又唱又跳全场一起嗨 🎵',
    optionB: '找个视野好的安静位置，专注看比赛 👀',
    dimensionA: 'E', dimensionB: 'I'
  },
  {
    id: 'q05', dimension: 'EI',
    question: '球友微信群里你通常是哪种存在？',
    optionA: '表情包大户，话题发起者，气氛组担当 😂',
    optionB: '万年潜水，偶尔冒泡回个"收到" 🙋',
    dimensionA: 'E', dimensionB: 'I'
  },
  {
    id: 'q06', dimension: 'EI',
    question: '看球时旁边有人一直刷手机剧透比分，你会？',
    optionA: '和他一起讨论分析，聊得热火朝天 🗣️',
    optionB: '默默戴上耳机，假装没听见 🎧',
    dimensionA: 'E', dimensionB: 'I'
  },
  {
    id: 'q07', dimension: 'EI',
    question: '如果只能选一种看球方式过周末？',
    optionA: '拉上朋友去球场野球+烧烤一条龙 🏟️',
    optionB: '自己在家打开电视，配上零食啤酒 🛋️',
    dimensionA: 'E', dimensionB: 'I'
  },
  {
    id: 'q08', dimension: 'EI',
    question: '去国外旅游遇到当地球队比赛日，你会？',
    optionA: '必须去凑热闹！买围巾混进球迷酒吧 🎉',
    optionB: '看情况，如果太挤就算了，远远拍个照 📸',
    dimensionA: 'E', dimensionB: 'I'
  },

  // ===== S/N 维度 (8题) - 看球方式 =====
  {
    id: 'q09', dimension: 'SN',
    question: '预测比赛结果你更依赖什么？',
    optionA: '看近期战绩、伤病名单、历史交锋数据 📊',
    optionB: '看球队气质、更衣室氛围、直觉告诉我谁会赢 🔮',
    dimensionA: 'S', dimensionB: 'N'
  },
  {
    id: 'q10', dimension: 'SN',
    question: '评价一个球员你优先看什么？',
    optionA: '进球和助攻数、跑动距离等硬数据 📈',
    optionB: '球风好不好看、有没有灵性、够不够帅 ✨',
    dimensionA: 'S', dimensionB: 'N'
  },
  {
    id: 'q11', dimension: 'SN',
    question: '你记住一场世界杯经典比赛的方式是？',
    optionA: '清楚记得比分、谁进的球、第几分钟 🧮',
    optionB: '记得那天在哪看的、和谁一起、有多激动 💭',
    dimensionA: 'S', dimensionB: 'N'
  },
  {
    id: 'q12', dimension: 'SN',
    question: '如果让你设计一件球衣，你更看重？',
    optionA: '面料透气、排汗功能、穿着舒服 👕',
    optionB: '配色潮不潮、设计帅不帅、上身好不好看 🎨',
    dimensionA: 'S', dimensionB: 'N'
  },
  {
    id: 'q13', dimension: 'SN',
    question: '朋友说某某球星很强，你的第一反应是？',
    optionA: '搜一下他的数据和集锦，自己验证 🔍',
    optionB: '群众的眼睛是雪亮的，被吹肯定有道理 👍',
    dimensionA: 'S', dimensionB: 'N'
  },
  {
    id: 'q14', dimension: 'SN',
    question: '看争议判罚回放时你最关注的是？',
    optionA: '越位了多少厘米、犯规动作到底够不够清晰 📐',
    optionB: '这个判罚对比赛走势的影响和戏剧性 🎭',
    dimensionA: 'S', dimensionB: 'N'
  },
  {
    id: 'q15', dimension: 'SN',
    question: '哪种足球内容最能吸引你？',
    optionA: '有数据图表支撑的深度战术分析 📊',
    optionB: '有情怀有故事的人物纪录片 🎬',
    dimensionA: 'S', dimensionB: 'N'
  },
  {
    id: 'q16', dimension: 'SN',
    question: '世界杯主题曲你更爱哪种风格？',
    optionA: '节奏动感的，一听就想跟着摇头晃脑 🎵',
    optionB: '旋律动人的，歌词有故事感 🎤',
    dimensionA: 'S', dimensionB: 'N'
  },

  // ===== T/F 维度 (8题) - 足球情感态度 =====
  {
    id: 'q17', dimension: 'TF',
    question: '主队输了一场不该输的比赛，你的反应是？',
    optionA: '理性分析哪里出了问题、谁在梦游 🧠',
    optionB: '情绪低落一整天，不想理任何人 😢',
    dimensionA: 'T', dimensionB: 'F'
  },
  {
    id: 'q18', dimension: 'TF',
    question: '好朋友支持的是你主队的死敌，你怎么看？',
    optionA: '互呛开玩笑，看球归看球，友谊第一 😄',
    optionB: '心里有点小隔阂，聊球时尽量避开这个话题 😅',
    dimensionA: 'T', dimensionB: 'F'
  },
  {
    id: 'q19', dimension: 'TF',
    question: '喜欢的球星转会去了死敌球队，你什么感受？',
    optionA: '职业选择而已，球员有权为自己打算 💼',
    optionB: '心里不是滋味，感觉像被背叛了 💔',
    dimensionA: 'T', dimensionB: 'F'
  },
  {
    id: 'q20', dimension: 'TF',
    question: '裁判给了你主队一个莫须有的点球，你会？',
    optionA: '虽然得利但承认这判罚有问题 ⚖️',
    optionB: '裁判英明！终于还我们一次了！不管了先庆祝 🎉',
    dimensionA: 'T', dimensionB: 'F'
  },
  {
    id: 'q21', dimension: 'TF',
    question: '朋友因为主队输球闷闷不乐，你会怎么安慰他？',
    optionA: '帮他理性分析"其实踢得不差，运气差了点" 📝',
    optionB: '啥也不说直接拉去喝酒撸串 🍻',
    dimensionA: 'T', dimensionB: 'F'
  },
  {
    id: 'q22', dimension: 'TF',
    question: '你为什么支持现在这支球队？',
    optionA: '打法好看、管理专业、有冠军气质 🏆',
    optionB: '因为爸爸或者喜欢的球星就是这队的，传承 ❤️',
    dimensionA: 'T', dimensionB: 'F'
  },
  {
    id: 'q23', dimension: 'TF',
    question: '看到天才小将表现不佳被全网喷，你什么态度？',
    optionA: '竞技体育成绩说话，确实没踢好就该接受批评 🎯',
    optionB: '心疼他，希望他别被影响，下次加油 🤗',
    dimensionA: 'T', dimensionB: 'F'
  },
  {
    id: 'q24', dimension: 'TF',
    question: '和网友在评论区吵起来了，你会？',
    optionA: '摆数据讲道理，逐条反驳，直到对方无话可说 🗣️',
    optionB: '吵两句就觉得没意思，撤了不看了 🕊️',
    dimensionA: 'T', dimensionB: 'F'
  },

  // ===== J/P 维度 (8题) - 看球生活方式 =====
  {
    id: 'q25', dimension: 'JP',
    question: '世界杯赛程你是怎么安排的？',
    optionA: '抽签结束就把赛程表打印出来贴墙上了 📅',
    optionB: '每天打开手机看看今天有啥比赛 📱',
    dimensionA: 'J', dimensionB: 'P'
  },
  {
    id: 'q26', dimension: 'JP',
    question: '看到朋友圈有人晒中了世界杯体彩大奖，你的第一反应是？',
    optionA: '默默算了下概率，然后继续刷手机 📊',
    optionB: '赶紧点个赞蹭蹭好运，下次我也买一注 🍀',
    dimensionA: 'J', dimensionB: 'P'
  },
  {
    id: 'q27', dimension: 'JP',
    question: '看球必备零食饮料你啥时候准备？',
    optionA: '提前两天就买好囤着，万事俱备 📋',
    optionB: '比赛开始前半小时才冲去楼下便利店 🏃',
    dimensionA: 'J', dimensionB: 'P'
  },
  {
    id: 'q28', dimension: 'JP',
    question: '世界杯竞猜你一般怎么下注？',
    optionA: '研究球队状态和赔率，理性分析后再选 📊',
    optionB: '看队名和国旗，哪个顺眼选哪个 🎲',
    dimensionA: 'J', dimensionB: 'P'
  },
  {
    id: 'q29', dimension: 'JP',
    question: '买足球彩票你一般是哪种风格？',
    optionA: '仔细研究数据赔率再下注，讲究策略 📈',
    optionB: '凭感觉和眼缘随便买，主打一个缘分 🍀',
    dimensionA: 'J', dimensionB: 'P'
  },
  {
    id: 'q30', dimension: 'JP',
    question: '约朋友踢球你通常是哪种风格？',
    optionA: '提前一周定好时间地点，所有人确认 ✅',
    optionB: '当天临时群里喊"有人踢球吗？" 📢',
    dimensionA: 'J', dimensionB: 'P'
  },
  {
    id: 'q31', dimension: 'JP',
    question: '你刷足球新闻的习惯是？',
    optionA: '每天早上固定时间刷一遍各大媒体 🔄',
    optionB: '有空就刷，随缘看，不刻意 🎲',
    dimensionA: 'J', dimensionB: 'P'
  },
  {
    id: 'q32', dimension: 'JP',
    question: '比赛日开始前你怎么安排？',
    optionA: '提前把事全办完，确保比赛时完全空出来 📋',
    optionB: '到点打开电视，边看球边做别的事也不耽误 🔄',
    dimensionA: 'J', dimensionB: 'P'
  }
]

module.exports = questions
