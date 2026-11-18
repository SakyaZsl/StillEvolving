<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, shallowRef } from 'vue'
import type { LifeLibrary, Profile, SearchResult } from './types'
import { createSearchIndex, hasNegatedAction, searchLibrary } from './search.mjs'
import type { SearchIndex } from './search.mjs'
import EntryCard from './EntryCard.vue'
import { plainText } from './library.mjs'

const base = import.meta.env.BASE_URL
const library = shallowRef<LifeLibrary>()
const index = shallowRef<SearchIndex>([])
const loading = ref(true)
const loadError = ref('')
const profile = ref<Profile>({ age: '', region: '' })
const profileOpen = ref(false)
const mode = ref<'ask' | 'browse'>('ask')
const question = ref('')
const category = ref('')
const submittedQuestion = ref('')
const submittedCategory = ref('')
const matches = shallowRef<SearchResult[]>([])
const submitted = ref(false)
const formError = ref('')
const selectedId = ref('')
const pageNumber = ref(1)
const output = ref<HTMLElement>()
const entryOutput = ref<HTMLElement>()
const profileForm = ref<HTMLDetailsElement>()

const selected = computed(() => library.value?.entries.find(entry => entry.id === selectedId.value))
const filteredEntries = computed(() => library.value?.entries.filter(entry => !category.value || entry.category === category.value) ?? [])
const totalPages = computed(() => Math.max(1, Math.ceil(filteredEntries.value.length / 12)))
const visibleEntries = computed(() => filteredEntries.value.slice((pageNumber.value - 1) * 12, pageNumber.value * 12))
const categoryTitle = computed(() => library.value?.categories.find(item => item.id === submittedCategory.value)?.title ?? '全部分类')
const incomplete = computed(() => matches.value[0] && matches.value[0].matched < matches.value[0].total)
const negated = computed(() => hasNegatedAction(submittedQuestion.value))

function selectEntry(id: string) {
  selectedId.value = id
  const url = new URL(window.location.href)
  if (id) url.searchParams.set('entry', id)
  else url.searchParams.delete('entry')
  window.history.replaceState(null, '', url)
}
function restoreEntry() {
  selectedId.value = new URLSearchParams(window.location.search).get('entry') ?? ''
}
function switchMode(value: 'ask' | 'browse') {
  if (mode.value === value) return
  mode.value = value
  submitted.value = false
  selectEntry('')
}
function changeCategory() {
  pageNumber.value = 1
  selectEntry('')
  submitted.value = false
}
async function search() {
  if (!library.value) return
  formError.value = question.value.trim() ? '' : '先输入一个具体行为或问题。'
  if (formError.value) return
  submittedQuestion.value = question.value.trim()
  submittedCategory.value = category.value
  matches.value = searchLibrary(index.value, submittedQuestion.value, category.value)
  submitted.value = true
  selectEntry(matches.value[0]?.entry.id ?? '')
  await nextTick()
  output.value?.focus({ preventScroll: true })
  output.value?.scrollIntoView({ block: 'start' })
}
function useExample(text: string) {
  mode.value = 'ask'
  question.value = text
  category.value = ''
  void search()
}
function browseRelated() {
  mode.value = 'browse'
  pageNumber.value = 1
  selectEntry('')
}
function paginate(value: number) {
  pageNumber.value = value
  selectEntry('')
}
async function openFromBrowse(id: string) {
  selectEntry(id)
  await nextTick()
  entryOutput.value?.focus({ preventScroll: true })
  entryOutput.value?.scrollIntoView({ block: 'start' })
}
async function load() {
  loading.value = true
  loadError.value = ''
  try {
    const response = await fetch(base + 'tools/life-value/library.json')
    if (!response.ok) throw new Error('HTTP ' + response.status)
    const data: LifeLibrary = await response.json()
    if (!Array.isArray(data.entries) || !Array.isArray(data.categories) || !data.commit) throw new Error('Invalid library')
    library.value = data
    index.value = createSearchIndex(data.entries)
    restoreEntry()
  } catch {
    loadError.value = '资料暂时没有加载成功，请检查网络后重试。'
  } finally {
    loading.value = false
  }
}
onMounted(() => { void load(); window.addEventListener('popstate', restoreEntry) })
onBeforeUnmount(() => window.removeEventListener('popstate', restoreEntry))
</script>

<template>
  <a class="skip" href="#tool-main">跳到工具</a>
  <header class="tool-header wrap">
    <a :href="base + '#tools'" class="back">← 返回 AI 小工具</a>
    <a :href="base" class="site-name">Still Evolving<span>.</span></a>
  </header>
  <main id="tool-main" class="wrap">
    <div class="tool-layout">
      <div class="tool-workspace">
    <section class="intro">
      <div>
        <p class="overline"><span class="spark" aria-hidden="true">✦</span> LIFE VALUE / 生活性价比助手</p>
        <h1>这件事，<br />值得做吗<span>？</span></h1>
        <p class="lead">把日常选择，放回成本与收益里看。</p>
        <p class="intro-copy">查一查资料怎么说、依据是什么，再决定是否适合自己。</p>
      </div>
      <div class="library-note">
        <span class="note-mark" aria-hidden="true">↗</span>
        <div v-if="library" class="library-stats"><strong>{{ library.entries.length }}<small>条建议</small></strong><span>来自 {{ library.categories.length }} 个生活分类</span></div>
        <p v-else>一个可以查阅依据的生活资料库</p>
        <p>资料来自《高性价比人生指南》<br />在当前浏览器内检索</p>
      </div>
    </section>

    <div v-if="loading" class="load-state" role="status">正在准备本地资料库…</div>
    <div v-else-if="loadError" class="load-state" role="alert"><p>{{ loadError }}</p><button class="primary" @click="load">重新加载</button></div>
      <section v-else-if="library" class="workbench" aria-label="查阅生活建议">
        <details ref="profileForm" class="profile-panel" :open="profileOpen" @toggle="profileOpen = profileForm?.open ?? false">
          <summary>先补充一点信息 <span>选填，可以跳过</span></summary>
          <div class="profile-fields">
            <label>年龄段<select v-model="profile.age"><option value="">暂不填写</option><option>未满 18 岁</option><option>18–29 岁</option><option>30–44 岁</option><option>45–59 岁</option><option>60 岁及以上</option></select></label>
            <label>所在国家或地区<input v-model="profile.region" maxlength="40" placeholder="例如：中国大陆" autocomplete="off" /></label>
          </div>
          <p>只用于核对资料的适用条件，本次输入不上传、不保存。</p>
        </details>
        <div class="mode-switch" role="group" aria-label="查阅方式">
          <button :aria-pressed="mode === 'ask'" @click="switchMode('ask')">提个问题 <span aria-hidden="true">↗</span></button>
          <button :aria-pressed="mode === 'browse'" @click="switchMode('browse')">浏览分类 <span aria-hidden="true">≡</span></button>
        </div>
        <form class="query-form" @submit.prevent="search">
          <label class="category-label">查找范围<select v-model="category" @change="changeCategory"><option value="">全部分类</option><option v-for="item in library.categories" :key="item.id" :value="item.id">{{ item.id }}. {{ item.title }}（{{ item.count }}）</option></select></label>
          <template v-if="mode === 'ask'">
            <label class="question-label" for="life-question">你在考虑什么？</label>
            <div class="question-row"><input id="life-question" v-model="question" maxlength="160" placeholder="例如：每天下午喝咖啡，会影响睡眠吗？" :aria-invalid="Boolean(formError)" :aria-describedby="formError ? 'query-error' : undefined" /><button class="primary" type="submit">查找依据 <span aria-hidden="true">↗</span></button></div>
            <p v-if="formError" id="query-error" class="form-error" role="alert">{{ formError }}</p>
            <div class="examples"><span>试着问</span><button v-for="example in ['下午喝咖啡会影响睡眠吗', '给手机设锁屏密码值不值', '每天快走半小时值不值']" :key="example" type="button" @click="useExample(example)">{{ example }} ↗</button></div>
          </template>
        </form>
      </section>
      </div>
      <aside class="tool-sidebar" aria-label="生活性价比助手主题海报">
        <a class="poster-preview" :href="base + 'tools/life-value/poster.webp'" target="_blank" rel="noopener noreferrer" aria-label="查看生活性价比助手完整海报（新窗口打开）">
          <img :src="base + 'tools/life-value/poster.webp'" width="941" height="1672" decoding="async" alt="生活性价比助手主题海报，展示居住、美食、出行、学习成长等生活场景" />
        </a>
        <div class="poster-mobile-copy"><p class="overline">LIFE INSPIRATION / 生活灵感</p><p>让每一份选择，<br />都更有价值。</p><a :href="base + 'tools/life-value/poster.webp'" target="_blank" rel="noopener noreferrer">查看完整海报 ↗</a></div>
      </aside>
    </div>

    <template v-if="!loading && !loadError && library">
      <section v-if="mode === 'ask' && submitted" ref="output" tabindex="-1" class="result-section" aria-label="检索结果">
        <div class="result-heading"><p class="overline">{{ categoryTitle }} / 检索结果</p><h2>关于「{{ submittedQuestion }}」</h2></div>
        <template v-if="matches.length">
          <p class="match-notice">{{ incomplete ? '找到部分相关资料：它们可能只回答问题的一部分。' : '找到相关资料，请先核对条目里的具体行为。' }}下方档位对应原条目，不是对整个问题的综合判断。</p>
          <p v-if="negated" class="match-notice">你的问题包含“不做、停止或避免”等表达。检索也可能找到同一主题的相反做法，需结合条目原文判断。</p>
        </template>
        <div v-else class="empty-state"><span aria-hidden="true">⌕</span><h3>暂时没有找到相关依据</h3><p>问题可能超出当前收录范围，也可能是表达方式不同。可以换个具体关键词，或等待后续资料补充后重试。</p><button class="secondary" @click="browseRelated">去分类里看看 ↗</button></div>
      </section>

      <div v-if="selected" ref="entryOutput" tabindex="-1" class="selected-entry">
        <button v-if="mode === 'browse'" class="text-button" @click="selectEntry('')">← 收起条目，继续浏览</button>
        <EntryCard :key="selected.id" :entry="selected" :library="library" :profile="profile" />
      </div>
      <p v-else-if="selectedId" class="match-notice">没有找到这个条目，可以重新提问或浏览分类。</p>

      <section v-if="mode === 'ask' && submitted && matches.length > 1" class="alternatives" aria-labelledby="alternatives-title">
        <h2 id="alternatives-title">也可能与你的问题有关</h2>
        <div class="alternatives-grid"><button v-for="result in matches.filter(item => item.entry.id !== selectedId)" :key="result.entry.id" @click="openFromBrowse(result.entry.id)"><span class="overline">第 {{ result.entry.category }} 章 · 第 {{ result.entry.number }} 条</span><strong>{{ result.entry.title }}</strong><span>查看这条依据 ↗</span></button></div>
      </section>

      <section v-if="mode === 'browse'" class="browse-section" aria-labelledby="browse-title">
        <div class="browse-heading"><div><p class="overline">EXPLORE / 按原章节顺序浏览</p><h2 id="browse-title">{{ category ? library.categories.find(item => item.id === category)?.title : '全部生活建议' }}</h2></div><span>{{ filteredEntries.length }} 条建议</span></div>
        <div class="browse-grid">
          <button v-for="entry in visibleEntries" :key="entry.id" @click="openFromBrowse(entry.id)">
            <span class="overline">第 {{ entry.category }} 章 · 第 {{ entry.number }} 条</span><strong>{{ entry.title }}</strong><p>{{ plainText(entry.fields['说人话'] ?? entry.fields.成本) }}</p><span class="browse-rating">原资料性价比：{{ entry.rating ?? '未提供' }} <i aria-hidden="true">↗</i></span>
          </button>
        </div>
        <div class="pagination"><button class="secondary" :disabled="pageNumber <= 1" @click="paginate(pageNumber - 1)">← 上一页</button><span>第 {{ pageNumber }} / {{ totalPages }} 页</span><button class="secondary" :disabled="pageNumber >= totalPages" @click="paginate(pageNumber + 1)">下一页 →</button></div>
      </section>
    </template>

    <footer class="tool-footer">
      <div><h2>资料从哪里来</h2><p>正文来自 <a href="https://github.com/eternity4719/HowToLiveBetter" target="_blank" rel="noopener noreferrer">eternity4719 / HowToLiveBetter ↗</a>，依 <a href="https://creativecommons.org/licenses/by/4.0/deed.zh-hans" target="_blank" rel="noopener noreferrer">CC BY 4.0</a> 许可整理。本工具重新组织了分类和检索界面，保留原文与原项目的性价比计算规则。</p><p v-if="library">本地资料版本：<a :href="library.repo + '/tree/' + library.commit" target="_blank" rel="noopener noreferrer">{{ library.commit.slice(0, 7) }}</a> · 同步于 {{ library.syncedOn }}。资料有适用范围和时效限制，具体条件请结合原文及来源核对。</p></div>
      <a class="back" :href="base + '#tools'">← 返回 AI 小工具</a>
    </footer>
  </main>
</template>
