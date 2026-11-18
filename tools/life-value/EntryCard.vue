<script setup lang="ts">
import { computed } from 'vue'
import { plainText, sourceLinks } from './library.mjs'
import { applicabilityNote } from './search.mjs'
import type { LifeEntry, LifeLibrary, Profile } from './types'

const props = defineProps<{ entry: LifeEntry; library: LifeLibrary; profile: Profile }>()
const chapter = computed(() => props.library.categories.find(category => category.id === props.entry.category))
const applicability = computed(() => applicabilityNote(props.profile, props.entry.fields))
const originalUrl = computed(() => props.library.repo + '/blob/' + props.library.commit + '/' + props.entry.sourcePath.split('/').map(encodeURIComponent).join('/'))
const localUrl = computed(() => import.meta.env.BASE_URL + 'tools/life-value/source/' + props.entry.sourcePath.split('/').map(encodeURIComponent).join('/'))
const links = computed(() => sourceLinks(props.entry.fields.来源))
</script>

<template>
  <article class="entry-card" aria-labelledby="entry-title">
    <p class="overline">第 {{ entry.category }} 章 · 第 {{ entry.number }} 条 / {{ chapter?.title }}</p>
    <h2 id="entry-title">{{ entry.title }}</h2>
    <div class="entry-badges">
      <span class="rating-badge">原资料性价比：{{ entry.rating ?? '未提供' }}</span>
      <span class="evidence-badge">证据等级：{{ entry.fields.证据等级 }}</span>
    </div>
    <p v-if="entry.fields['说人话']" class="entry-summary">{{ plainText(entry.fields['说人话']) }}</p>
    <p class="rating-explainer">性价比档位沿用原项目的成本与收益规则；证据等级单独表示依据的强弱。</p>
    <div class="cost-benefit">
      <section><h3>要付出什么</h3><p>{{ plainText(entry.fields.成本) }}</p></section>
      <section><h3>能换来什么</h3><p>{{ plainText(entry.fields.收益) }}</p></section>
    </div>
    <section class="applicability">
      <h3>{{ applicability.title }}</h3>
      <p>{{ applicability.text }}</p>
      <p v-if="applicability.notes"><strong>原资料的备注：</strong>{{ applicability.notes }}</p>
    </section>
    <details class="entry-sources">
      <summary>查看依据与原文 <span>{{ links.length }} 个来源链接</span></summary>
      <p>{{ plainText(entry.fields.来源) }}</p>
      <ul v-if="links.length">
        <li v-for="(link, index) in links" :key="link"><a :href="link" target="_blank" rel="noopener noreferrer">原始来源 {{ index + 1 }} ↗ <span class="source-url">{{ link }}</span></a></li>
      </ul>
      <div class="source-actions"><a :href="originalUrl" target="_blank" rel="noopener noreferrer">核对 GitHub 原文 ↗</a><a :href="localUrl" download>下载本地章节 ↓</a></div>
    </details>
  </article>
</template>
