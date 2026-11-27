<script setup lang="ts">
import { computed } from 'vue'
import { profile, projects } from '../content'
import { publicUrl } from '../public-url'
import ProjectVisual from '../components/ProjectVisual.vue'
import Missing from './Missing.vue'

const props = defineProps<{ slug: string }>()
const entry = computed(() => projects.find((item) => item.slug === props.slug))
const back = { name: 'home', hash: '#projects' }
</script>

<template>
  <article v-if="entry" class="shell detail">
    <RouterLink class="back-link" :to="back"><span aria-hidden="true">←</span> 全部作品</RouterLink>
    <div class="detail-hero">
      <div>
        <p class="section-index">PROJECT / 项目案例</p>
        <h1>{{ entry.name }}</h1>
        <p class="detail-lead">{{ entry.intro }}</p>
        <ul v-if="entry.tags.length" class="tags" aria-label="关键词"><li v-for="tag in entry.tags" :key="tag">{{ tag }}</li></ul>
        <a v-if="entry.demoUrl" class="button button-primary detail-demo" :href="entry.demoUrl">体验项目 <span aria-hidden="true">↗</span></a>
      </div>
      <figure v-if="entry.screenshot" class="project-screenshot" :class="'visual-' + (entry.visual ?? 'default')">
        <a
          :href="publicUrl(entry.screenshot.path)"
          target="_blank"
          rel="noopener noreferrer"
          :aria-label="'在新标签查看' + entry.name + '完整截图'"
        >
          <img
            :src="publicUrl(entry.screenshot.path)"
            :alt="entry.screenshot.alt"
            :width="entry.screenshot.width"
            :height="entry.screenshot.height"
            decoding="async"
          />
          <span>查看完整截图 <span aria-hidden="true">↗</span></span>
        </a>
        <figcaption>{{ entry.screenshot.caption }}</figcaption>
      </figure>
      <ProjectVisual v-else :project="entry" />
    </div>
    <dl class="fact-strip">
      <div v-for="fact in entry.facts" :key="fact.label"><dt>{{ fact.label }}</dt><dd>{{ fact.value }}</dd></div>
    </dl>

    <section v-if="entry.steps?.length" class="detail-section" aria-labelledby="contribution">
      <p class="section-index">CONTRIBUTIONS</p>
      <h2 id="contribution">我的项目贡献</h2>
      <ol class="step-grid">
        <li v-for="(step, index) in entry.steps" :key="step.title">
          <span class="step-number">{{ String(index + 1).padStart(2, '0') }}</span>
          <h3>{{ step.title }}</h3><p>{{ step.text }}</p>
        </li>
      </ol>
    </section>

    <section v-if="entry.productFlow" class="detail-section" aria-labelledby="product-flow">
      <h2 id="product-flow">{{ entry.productFlow.title }}</h2>
      <ol class="project-flow">
        <li v-for="step in entry.productFlow.steps" :key="step">{{ step }}</li>
      </ol>
    </section>

    <section v-if="entry.technicalCase" class="detail-section project-case" aria-labelledby="technical-case">
      <h2 id="technical-case">{{ entry.technicalCase.title }}</h2>
      <p class="case-intro">{{ entry.technicalCase.intro }}</p>
      <ol class="project-flow">
        <li v-for="step in entry.technicalCase.flow" :key="step.title">
          <h3>{{ step.title }}</h3>
          <p>{{ step.text }}</p>
        </li>
      </ol>
      <dl class="case-notes">
        <div v-for="note in entry.technicalCase.notes" :key="note.title">
          <dt>{{ note.title }}</dt>
          <dd>{{ note.text }}</dd>
        </div>
      </dl>
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

    <div class="detail-end">
      <RouterLink class="button button-secondary" :to="back"><span aria-hidden="true">←</span> 返回代表项目</RouterLink>
      <a v-if="profile.email" class="button button-primary" :href="'mailto:' + profile.email">联系我 <span aria-hidden="true">↗</span></a>
    </div>
  </article>
  <Missing v-else />
</template>
