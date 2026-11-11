<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { companies, profile, projects } from '../content'
import { publicUrl } from '../public-url'
import ProjectVisual from '../components/ProjectVisual.vue'
import Missing from './Missing.vue'

const props = defineProps<{ slug: string }>()
const route = useRoute()
const project = computed(() => route.name === 'project' ? projects.find((item) => item.slug === props.slug) : undefined)
const company = computed(() => route.name === 'company' ? companies.find((item) => item.slug === props.slug) : undefined)
const entry = computed(() => project.value ?? company.value)
const related = computed(() => projects.filter((item) => company.value?.projectSlugs?.includes(item.slug)))
const back = computed(() => ({ name: 'home', hash: route.name === 'company' ? '#experience' : '#projects' }))
</script>

<template>
  <article v-if="entry" class="shell detail">
    <RouterLink class="back-link" :to="back"><span aria-hidden="true">←</span> {{ company ? '全部经历' : '全部作品' }}</RouterLink>
    <div class="detail-hero">
      <div>
        <p class="section-index">{{ company ? 'EXPERIENCE / 工作经历' : 'PROJECT / 项目案例' }}</p>
        <h1>{{ entry.name }}</h1>
        <p class="detail-lead">{{ entry.intro }}</p>
        <ul v-if="entry.tags.length" class="tags" aria-label="关键词"><li v-for="tag in entry.tags" :key="tag">{{ tag }}</li></ul>
        <a v-if="project?.demoUrl" class="button button-primary detail-demo" :href="project.demoUrl">体验项目 <span aria-hidden="true">↗</span></a>
      </div>
      <ProjectVisual v-if="project" :project="project" />
      <div v-else class="company-cover" aria-hidden="true">
        <span>WORK EXPERIENCE</span><strong>{{ entry.name.slice(0, 1) }}<i>.</i></strong><span>{{ company?.period }}</span>
      </div>
    </div>
    <dl class="fact-strip">
      <div v-for="fact in entry.facts" :key="fact.label"><dt>{{ fact.label }}</dt><dd>{{ fact.value }}</dd></div>
    </dl>

    <section v-if="entry.steps?.length" class="detail-section" aria-labelledby="contribution">
      <p class="section-index">CONTRIBUTIONS</p>
      <h2 id="contribution">{{ company ? '我负责的工作' : '我的项目贡献' }}</h2>
      <ol class="step-grid">
        <li v-for="(step, index) in entry.steps" :key="step.title">
          <span class="step-number">{{ String(index + 1).padStart(2, '0') }}</span>
          <h3>{{ step.title }}</h3><p>{{ step.text }}</p>
        </li>
      </ol>
    </section>

    <section v-if="company?.issueFlow" class="detail-section detail-flow" aria-labelledby="support-title">
      <p class="section-index">ISSUE SOURCES</p>
      <h2 id="support-title">问题从哪里来</h2>
      <ul><li v-for="source in company.issueFlow.sources" :key="source">{{ source }}</li></ul>
      <p class="flow-result"><span aria-hidden="true">↓<br /></span><strong>{{ company.issueFlow.resolution }}</strong></p>
    </section>

    <section v-if="entry.media?.length" class="detail-section" aria-labelledby="media-title">
      <p class="section-index">VISUAL NOTES</p>
      <h2 id="media-title">图文记录</h2>
      <div class="media-grid">
        <figure v-for="item in entry.media" :key="item.path">
          <img :src="publicUrl(item.path)" :alt="item.alt" loading="lazy" />
          <figcaption>{{ item.caption }}</figcaption>
        </figure>
      </div>
    </section>

    <section v-if="related.length" class="detail-section" aria-labelledby="related-title">
      <h2 id="related-title">相关项目</h2>
      <RouterLink v-for="item in related" :key="item.slug" class="simple-link" :to="{ name: 'project', params: { slug: item.slug } }">{{ item.name }} <span aria-hidden="true">↗</span></RouterLink>
    </section>
    <div class="detail-end">
      <RouterLink class="button button-secondary" :to="back"><span aria-hidden="true">←</span> {{ company ? '返回工作经历' : '返回代表项目' }}</RouterLink>
      <a v-if="profile.email" class="button button-primary" :href="'mailto:' + profile.email">联系我 <span aria-hidden="true">↗</span></a>
    </div>
  </article>
  <Missing v-else />
</template>
