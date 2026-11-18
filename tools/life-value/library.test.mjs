import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createSearchIndex, searchLibrary, applicabilityNote, hasNegatedAction } from './search.mjs';
import { originalRating, parseLibrary, plainText, sourceLinks } from './library.mjs';

const root = new URL('../../public/tools/life-value/', import.meta.url);
const data = JSON.parse(readFileSync(new URL('library.json', root), 'utf8'));
const index = createSearchIndex(data.entries);

test('the snapshot contains all source chapters and uniquely traceable entries', () => {
  assert.equal(data.categories.length, 34);
  assert.equal(data.entries.length, 772);
  assert.equal(new Set(data.entries.map(entry => entry.id)).size, 772);
  assert.match(data.commit, /^[a-f0-9]{40}$/);
  for (const entry of data.entries) {
    const original = readFileSync(new URL('source/' + entry.sourcePath, root), 'utf8');
    assert.ok(original.includes(entry.title), entry.id);
    assert.ok(entry.fields.来源 && entry.fields.成本 && entry.fields.收益, entry.id);
  }
});

test('rebuilding from the stored source preserves the complete snapshot', () => {
  const paths = [...new Set(data.entries.map(entry => entry.sourcePath))];
  const rebuilt = parseLibrary(paths.map(path => ({
    path, text: readFileSync(new URL('source/' + path, root), 'utf8'),
  })), { commit: data.commit });
  assert.deepEqual(rebuilt.entries, data.entries);
  assert.deepEqual(rebuilt.categories, data.categories);
});

test('an exact actionable phone question finds its evidence first', () => {
  const results = searchLibrary(index, '给手机设锁屏密码值不值');
  assert.equal(results[0].entry.id, '14-3');
  assert.ok(results.length <= 3);
});

test('walking questions find walking evidence rather than unrelated duration mentions', () => {
  const results = searchLibrary(index, '每天快走半小时值不值');
  assert.equal(results[0].entry.id, '2-11');
  assert.ok(results[0].matched < results[0].total);
  assert.ok(results.every(result => /快走|走路|步行/.test(result.entry.title)));
});

test('category filtering does not silently search outside the selected chapter', () => {
  const results = searchLibrary(index, '下午喝咖啡会影响睡眠吗', '3');
  assert.equal(results[0].entry.id, '3-4');
  assert.ok(results.every(result => result.entry.category === '3'));
  assert.deepEqual(searchLibrary(index, '锁屏密码', '20'), []);
});

test('unknown subjects and question-only phrases return no fabricated candidates', () => {
  for (const question of ['星际跃迁量子飞船', '这个值不值', '', '     ']) {
    assert.deepEqual(searchLibrary(index, question), [], question);
  }
});

test('negative queries keep source action wording and source ratings', () => {
  const results = searchLibrary(index, '不运动能长寿吗');
  assert.ok(results.length);
  for (const result of results) {
    assert.deepEqual(result.entry, data.entries.find(entry => entry.id === result.entry.id));
  }
});

test('question qualifiers do not trigger a warning about the opposite action', () => {
  for (const question of ['每天快走半小时值不值', '要不要设置手机密码', '喝咖啡会不会影响睡眠']) {
    assert.equal(hasNegatedAction(question), false, question);
  }
  for (const question of ['不运动能长寿吗', '停止喝咖啡值不值', '避免熬夜']) {
    assert.equal(hasNegatedAction(question), true, question);
  }
});

test('browsers without Intl.Segmenter can still search the local library', async () => {
  const original = Intl.Segmenter;
  try {
    Intl.Segmenter = undefined;
    const fallback = await import('./search.mjs?without-segmenter');
    assert.equal(fallback.searchLibrary(fallback.createSearchIndex(data.entries), '给手机设锁屏密码值不值')[0].entry.id, '14-3');
    assert.deepEqual(fallback.searchLibrary(fallback.createSearchIndex(data.entries), '星际跃迁量子飞船'), []);
  } finally {
    Intl.Segmenter = original;
  }
});

test('source value and evidence strength remain independent', () => {
  const strongEvidenceModerateValue = data.entries.find(entry => entry.rating === '一般' && entry.fields.证据等级 === 'A');
  assert.ok(strongEvidenceModerateValue);
  assert.equal(originalRating({ 钱: '0', 时间: '少', 毅力: '否', 收益: '大' }), '极高');
  assert.equal(originalRating({ 钱: '多', 时间: '多', 毅力: '是', 收益: '大' }), '一般');
  assert.equal(originalRating({}), null);
});

test('unknown applicability is retained and foreign-policy scope is explicit', () => {
  assert.equal(applicabilityNote({age:'',region:''}, {}).title, '适用范围尚不能确认');
  assert.match(applicabilityNote({age:'30–44 岁',region:'中国大陆'}, {}).text, /不足以确认/);
  assert.match(applicabilityNote({age:'',region:'加拿大'}, {}).text, /中国大陆.*当地/);
});

test('sources preserve outbound references and display raw text safely', () => {
  assert.deepEqual(sourceLinks('资料 <https://example.com/study>；[论文](https://doi.org/10.1/demo)。'),
    ['https://example.com/study', 'https://doi.org/10.1/demo']);
  assert.equal(plainText('**建议**：[原文](https://example.com)'), '建议：原文');
});
