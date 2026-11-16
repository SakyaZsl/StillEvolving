<script setup lang="ts">
import { computed } from 'vue'
import { companies, companyPages, findCompanyPage, projects } from '../content'
import { careerMapLink, companyLink } from '../experience-links'
import { publicUrl } from '../public-url'
import CareerLandmark from '../components/CareerLandmark.vue'
import Missing from './Missing.vue'

const props = defineProps<{ slug: string; topic?: string }>()
const company = computed(() => companies.find((item) => item.slug === props.slug))
const page = computed(() => company.value && findCompanyPage(company.value, props.topic))
const related = computed(() => projects.filter((item) => page.value?.projectSlugs?.includes(item.slug)))
</script>

<template>
  <article v-if="company && page" class="shell detail career-detail">
    <div class="career-crumbs">
      <RouterLink class="back-link" :to="careerMapLink(company.slug)"><span aria-hidden="true">←</span> 返回职业地图</RouterLink>
      <template v-if="page.slug">
        <span aria-hidden="true">/</span>
        <RouterLink class="back-link" :to="companyLink(company.slug)">{{ company.name }}</RouterLink>
      </template>
    </div>

    <header class="career-detail-banner">
      <div>
        <p class="section-index">WORK EXPERIENCE / {{ company.name }} · {{ company.period }}</p>
        <h1>{{ page.title }}</h1>
        <p class="detail-lead">{{ page.intro }}</p>
      </div>
      <CareerLandmark :kind="company.landmark" />
    </header>

    <div class="career-detail-layout">
      <div>
        <dl v-if="page.facts?.length" class="career-facts">
          <div v-for="fact in page.facts" :key="fact.label"><dt>{{ fact.label }}</dt><dd>{{ fact.value }}</dd></div>
        </dl>

        <section v-for="section in page.sections" :key="section.title" class="career-article-section">
          <h2>{{ section.title }}</h2><p>{{ section.text }}</p>
        </section>

        <section v-if="page.flow?.items.length" class="career-article-section" aria-labelledby="career-flow-title">
          <h2 id="career-flow-title">{{ page.flow.title }}</h2>
          <ol class="career-article-flow">
            <li v-for="(item, index) in page.flow.items" :key="item"><span aria-hidden="true">{{ index + 1 }}</span>{{ item }}</li>
          </ol>
        </section>

        <section v-if="page.media?.length" class="career-article-section" aria-labelledby="career-media-title">
          <h2 id="career-media-title">图文记录</h2>
          <div class="media-grid">
            <figure v-for="item in page.media" :key="item.path">
              <img :src="publicUrl(item.path)" :alt="item.alt" loading="lazy" />
              <figcaption>{{ item.caption }}</figcaption>
            </figure>
          </div>
        </section>

        <section v-if="related.length" class="career-article-section" aria-labelledby="career-related-title">
          <h2 id="career-related-title">相关项目</h2>
          <RouterLink v-for="item in related" :key="item.slug" class="simple-link" :to="{ name: 'project', params: { slug: item.slug } }">{{ item.name }} <span aria-hidden="true">↗</span></RouterLink>
        </section>
      </div>

      <nav v-if="company.topics?.length" class="career-detail-nav" :aria-label="company.name + '履历目录'">
        <h2>{{ company.name }} · 履历目录</h2>
        <ul class="career-panel-links">
          <li v-for="item in companyPages(company)" :key="item.slug ?? 'overview'">
            <RouterLink :to="companyLink(company.slug, item.slug)">
              <strong>{{ item.title }}</strong><span aria-hidden="true">↗</span>
            </RouterLink>
          </li>
        </ul>
      </nav>
    </div>

    <div class="detail-end">
      <RouterLink class="button button-secondary" :to="careerMapLink(company.slug)"><span aria-hidden="true">←</span> 返回职业地图</RouterLink>
    </div>
  </article>
  <Missing v-else />
</template>
