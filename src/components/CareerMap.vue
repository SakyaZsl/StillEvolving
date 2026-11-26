<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { companies, companyPages } from '../content'
import { companyLink } from '../experience-links'
import CareerLandmark from './CareerLandmark.vue'

const route = useRoute()
const router = useRouter()
const active = computed(() => companies.find((company) => company.slug === route.query.station))

function select(slug?: string, restoreFocus = false) {
  const previous = active.value?.slug
  const query = { ...route.query }
  if (slug && slug !== previous) query.station = slug
  else delete query.station
  void router.replace({ query, hash: route.hash })
  if (restoreFocus && previous) document.getElementById('career-stop-' + previous)?.focus()
}

const trail = computed(() => {
  const points = companies.map((_, index) => ({
    x: (index + 0.5) * 1000 / companies.length,
    y: index % 2 ? 221 : 184,
  }))
  return points.map((point, index) => {
    const last = points[index - 1]
    if (!last) return 'M ' + point.x + ' ' + point.y
    const middle = (last.x + point.x) / 2
    return 'C ' + middle + ' ' + last.y + ', ' + middle + ' ' + point.y + ', ' + point.x + ' ' + point.y
  }).join(' ')
})
</script>

<template>
  <div class="career-board" @keydown.esc="active && select(undefined, true)">
    <div class="career-field">
      <div class="career-field-label"><span>职业地图</span><span aria-hidden="true">最近经历 → 更早经历</span></div>
      <svg class="career-relief" viewBox="0 0 960 410" preserveAspectRatio="none" fill="none" aria-hidden="true" focusable="false">
        <g stroke="currentColor" stroke-width="1.35" vector-effect="non-scaling-stroke" stroke-linecap="round" stroke-linejoin="round">
          <path d="M-32 270C73 230 114 261 147 323s123 88 206 60m-384-90c96-40 133-4 158 49s124 93 205 63m-361-87c70-27 114-6 139 52s98 64 166 47M694-41c-14 73 64 118 148 108s133 36 153 98M720-41c-13 55 56 95 124 86 83-11 139 26 165 88M746-39c-7 49 49 72 103 66 68-7 126 9 158 59"/>
          <path d="m362 123 27-24 25 7 35-40 35 40 15-5 27 22m-101-29 13-3 10-14 16 21 10 2m-107 23h155m-94 0 21-13 15 13"/>
          <path d="M129 84v18m-10-4 10-15 10 15m22-8v15m-8-4 8-12 8 12m564 194v18m-11-4 11-17 11 17m25-4v14m-8-3 8-13 8 13"/>
          <circle cx="883" cy="321" r="24"/><path d="M883 284v74m-36-37h72m-36-21 7 21-7 21-7-21 7-21Z"/>
          <path d="m255 68 5-6 5 6-5 5-5-5Zm388 255 5-6 5 6-5 5-5-5Zm-201 29 5-6 5 6-5 5-5-5Z"/>
        </g>
      </svg>
      <svg class="career-trail" viewBox="0 0 1000 300" preserveAspectRatio="none" aria-hidden="true" focusable="false">
        <path :d="trail" fill="none" vector-effect="non-scaling-stroke" />
      </svg>
      <ol class="career-nodes" :style="{ '--career-stops': companies.length }" role="list" aria-label="从最近到最早的公司经历">
        <li v-for="(company, index) in companies" :key="company.slug" class="career-station-entry">
          <button
            :id="'career-stop-' + company.slug"
            type="button"
            class="career-node"
            :class="{ 'is-current': company.current }"
            :aria-expanded="active?.slug === company.slug"
            :aria-controls="active?.slug === company.slug ? 'career-panel' : undefined"
            @click="select(company.slug)"
          >
            <span class="career-node-art">
              <span class="career-node-number" aria-hidden="true">{{ String(index + 1).padStart(2, '0') }}</span>
              <CareerLandmark :kind="company.landmark" />
            </span>
            <span class="career-node-text">
              <span class="career-node-heading"><strong>{{ company.name }}</strong><span class="career-node-period">{{ company.period }}</span></span>
              <span class="career-node-summary">{{ company.line }}</span>
            </span>
            <span class="career-node-arrow" aria-hidden="true">
              <svg viewBox="0 0 16 16" fill="none"><path d="m4 6 4 4 4-4" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/></svg>
            </span>
          </button>
          <section v-if="active?.slug === company.slug" id="career-panel" class="career-panel" aria-labelledby="career-panel-title">
            <div class="career-panel-head">
              <div><p class="career-kicker">STATION {{ String(index + 1).padStart(2, '0') }} / {{ company.period }}</p><h3 id="career-panel-title">{{ company.name }}</h3></div>
              <button type="button" class="career-close" aria-label="关闭履历菜单" @click="select(undefined, true)">×</button>
            </div>
            <ul class="career-panel-links">
              <li v-for="page in companyPages(company)" :key="page.slug ?? 'overview'">
                <RouterLink :to="companyLink(company.slug, page.slug)">
                  <span><strong>{{ page.title }}</strong><small>{{ page.summary }}</small></span>
                  <span aria-hidden="true">↗</span>
                </RouterLink>
              </li>
            </ul>
          </section>
        </li>
      </ol>
    </div>
    <aside v-if="!active" class="career-panel career-guide">
      <span class="career-guide-icon" aria-hidden="true">⌖</span>
      <p class="career-kicker">CAREER MAP</p>
      <h3>选择一站</h3>
      <p>点击一座城堡，查看这段工作经历里的项目、难点和我的贡献。</p>
    </aside>
  </div>
</template>
