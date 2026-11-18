import { plainText } from './library.mjs';

const STOP_WORDS = new Set(['我', '你', '的', '了', '是', '有', '在', '和', '与', '就', '都', '也', '要', '吗', '呢', '不', '没',
  '什么', '怎么', '怎样', '如何', '为什么', '是否', '可以', '需要', '应该', '还是', '这个', '那个', '这样', '一下',
  '每天', '每次', '平时', '现在', '想要', '请问', '知道', '觉得', '比较', '问题', '建议', '值得', '划算', '值不值', '不值', '性价比']);
const CONTEXT = new Set(['上班', '下班', '下午', '上午', '半小时', '小时', '分钟', '长期', '提高', '影响', '减少', '增加', '成本', '收益', '生活']);
const ALIASES = [
  ['骑车', '骑行', '自行车', '单车'],
  ['快走', '步行', '走路', '散步'],
  ['医保', '医疗保险'],
  ['社保', '社会保险'],
  ['锁屏', '屏幕密码', '手机密码'],
  ['抽烟', '吸烟', '香烟'],
  ['辞职', '离职'],
  ['通知', '消息提醒', '推送'],
  ['熬夜', '晚睡'],
  ['健身', '运动', '锻炼'],
  ['午睡', '午休'],
];
const segmenter = typeof Intl.Segmenter === 'function'
  ? new Intl.Segmenter('zh-CN', { granularity: 'word' }) : null;
const normalize = value => plainText(value).toLowerCase().replace(/\s+/g, '');

function fallbackWords(text) {
  return (text.match(/[a-z\d]+|[\u3400-\u9fff]+/g) ?? []).flatMap(run =>
    /^[a-z\d]+$/.test(run) ? [run]
      : Array.from({ length: Math.max(0, run.length - 1) }, (_, i) => run.slice(i, i + 2)));
}

export function queryTerms(question) {
  const questionText = normalize(question);
  const words = segmenter
    ? [...segmenter.segment(questionText)].filter(part => part.isWordLike).map(part => part.segment)
    : fallbackWords(questionText);
  const terms = words.filter(word => word.length > 1 && !STOP_WORDS.has(word) && !/^\d+$/.test(word));
  const groups = [];
  for (const aliases of ALIASES) {
    if (aliases.some(alias => questionText.includes(alias))) groups.push(aliases);
  }
  for (const word of new Set(terms)) {
    if (!groups.some(group => group.includes(word))) groups.push([word]);
  }
  return groups;
}

export function hasNegatedAction(question) {
  const action = question.replace(/值不值|要不要|该不该|需不需要|好不好|能不能|会不会|有没有|是不是|划不划算/g, '');
  return /不|没|别|停止|放弃|戒|取消|避免/.test(action);
}

export function createSearchIndex(entries) {
  return entries.map(entry => ({
    entry,
    title: normalize(entry.title),
    summary: normalize(entry.fields['说人话'] ?? ''),
    body: normalize([entry.fields.成本, entry.fields.收益, entry.fields.备注].filter(Boolean).join(' ')),
  }));
}

export function searchLibrary(index, question, category = '') {
  const terms = queryTerms(question);
  if (!terms.length) return [];
  const ranked = [];
  for (const row of index) {
    if (category && row.entry.category !== category) continue;
    let score = 0;
    let matched = 0;
    let subjectMatched = false;
    for (const variants of terms) {
      const weight = variants.some(term => row.title.includes(term)) ? 7
        : variants.some(term => row.summary.includes(term)) ? 3
          : variants.some(term => row.body.includes(term)) ? 1 : 0;
      if (weight) {
        matched++;
        const contextual = variants.every(term => CONTEXT.has(term));
        score += contextual ? weight * 0.25 : weight;
        if (!contextual) subjectMatched = true;
      }
    }
    // A long article mentioning a generic word once is not enough to answer a query.
    if (!subjectMatched || score < 3) continue;
    const coverage = matched / terms.length;
    ranked.push({ entry: row.entry, score: score * (0.45 + coverage * 0.55), matched, total: terms.length });
  }
  return ranked.sort((a, b) => b.score - a.score || a.entry.id.localeCompare(b.entry.id, 'zh', { numeric: true })).slice(0, 3);
}

export function applicabilityNote(profile, fields) {
  const notes = plainText(fields.备注 ?? '');
  const region = profile.region?.trim();
  return {
    title: '适用范围尚不能确认',
    text: region
      ? '当前填写：' + [profile.age, region].filter(Boolean).join('，') + '。这些信息仍不足以确认个人适用性。资料中的法律、医保和社保等制度内容主要按中国大陆规定编写；如果所在地并非中国大陆，需要核对当地规定。'
      : profile.age || region
        ? '当前填写：' + [profile.age, region].filter(Boolean).join('，') + '。原资料没有完整、统一的适用条件，仍不足以确认是否适用于你。'
        : '你可以直接查阅资料。原条目没有统一、完整的年龄和地区适用条件，当前不足以确认是否适用于你。',
    notes,
  };
}
