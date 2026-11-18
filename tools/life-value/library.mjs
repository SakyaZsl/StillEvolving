// The rating calculation follows HowToLiveBetter/tools/lib/book.mjs.
// Original code © eternity4719 contributors; see source/LICENSE-CODE (MIT).
export function originalRating(tags) {
  const weights = {
    money: { '0': 0, '少': 1, '多': 2 },
    time: { '少': 0, '中': 1, '多': 2 },
    will: { '否': 0, '些': 1, '是': 2 },
  };
  const parts = [weights.money[tags.钱], weights.time[tags.时间], weights.will[tags.毅力]];
  if (parts.some(value => value === undefined) || !['大', '中', '小'].includes(tags.收益)) return null;
  const cost = parts.reduce((a, b) => a + b, 0);
  if (tags.收益 === '大') return cost === 0 ? '极高' : cost <= 2 ? '高' : '一般';
  return tags.收益 === '中' && cost === 0 ? '高' : '一般';
}

export function parseLibrary(chapters, metadata) {
  const categories = [];
  const entries = [];
  for (const chapter of chapters.sort((a, b) => Number(a.path.match(/\d+/)[0]) - Number(b.path.match(/\d+/)[0]))) {
    const text = chapter.text.replace(/\r\n/g, '\n');
    const heading = text.match(/^#\s+(\d+)[.、]\s*(.+)$/m);
    if (!heading) throw new Error('Missing chapter heading: ' + chapter.path);
    const category = { id: heading[1], title: heading[2].trim(), count: 0 };
    const blocks = [...text.matchAll(/^###\s+(\d+)[.、]\s*(.+)\n([\s\S]*?)(?=^###\s|$(?![\s\S]))/gm)];
    for (const block of blocks) {
      const body = block[3];
      const tags = Object.fromEntries([...(body.match(/<!--\s*成本标签:\s*([\s\S]*?)-->/)?.[1] ?? '').matchAll(/([^\s=]+)=([^\s]+)/g)].map(m => [m[1], m[2]]));
      const fields = {};
      const rows = [...body.matchAll(/^-\s+([^：:\n]+)[：:]\s*([\s\S]*?)(?=^-\s+[^：:\n]+[：:]|$(?![\s\S]))/gm)];
      for (const row of rows) fields[row[1].trim()] = row[2].trim();
      if (!fields.成本 || !fields.收益 || !fields['证据等级']) throw new Error('Missing required fields: ' + chapter.path + ' #' + block[1]);
      entries.push({
        id: category.id + '-' + block[1],
        category: category.id, number: Number(block[1]), title: block[2].trim(),
        fields, tags, rating: originalRating(tags), sourcePath: chapter.path,
      });
      category.count++;
    }
    if (!category.count) throw new Error('Empty chapter: ' + chapter.path);
    categories.push(category);
  }
  if (new Set(entries.map(entry => entry.id)).size !== entries.length) throw new Error('Duplicate entry IDs');
  return { ...metadata, title: '高性价比人生指南', license: 'CC BY 4.0', categories, entries };
}

export function plainText(text = '') {
  return text.replace(/<!--[^]*?-->/g, '')
    .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
    .replace(/<((?:https?:\/\/)[^>]+)>/g, '$1')
    .replace(/\*\*|__|\x60/g, '').trim();
}

export function sourceLinks(text = '') {
  return [...new Set((text.match(/https?:\/\/[^\s<>）\]"]+/g) ?? []).map(url => url.replace(/[);；，。]+$/, '')))];
}
