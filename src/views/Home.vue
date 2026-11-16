<script setup lang="ts">
import { profile, projects, releaseSteps } from '../content'
import { publicUrl } from '../public-url'
import ProjectVisual from '../components/ProjectVisual.vue'
import CareerMap from '../components/CareerMap.vue'
import AiToolShowcase from '../components/AiToolShowcase.vue'

const featured = projects.filter((project) => project.featured)
const other = projects.filter((project) => !project.featured)
</script>

<template>
  <div class="shell">
    <section class="hero" aria-labelledby="hero-title">
      <div class="hero-copy">
        <p class="eyebrow"><span class="status-dot"></span> 个人作品集 <span class="eyebrow-rule"></span> PORTFOLIO</p>
        <h1 id="hero-title">跨端产品<span class="hero-break">工程师<span class="hero-dot">.</span></span></h1>
        <p class="hero-lead">十余年 Android 开发经验，从产品设计一路做到应用上线。</p>
        <p class="hero-text">最近半年借助 AI 将开发实践拓展到 iOS、H5 和小程序，也在 Flutter 与 H5 结合的项目里交付过完整的商城购买流程。</p>
        <div class="actions">
          <RouterLink class="button button-primary" :to="{ name: 'home', hash: '#projects' }">查看代表项目 <span aria-hidden="true">↘</span></RouterLink>
          <RouterLink class="button button-secondary" :to="{ name: 'home', hash: '#tools' }">体验 AI 小工具 <span aria-hidden="true">↘</span></RouterLink>
          <a v-if="profile.resumePath" class="button button-secondary" :href="publicUrl(profile.resumePath)" download>下载简历 <span aria-hidden="true">↓</span></a>
        </div>
      </div>
      <div class="hero-art" aria-hidden="true">
        <div class="hero-art-head"><span><i></i> ENGINEER IN PRACTICE</span><span>FIG. 01</span></div>
        <div class="art-orbit">
          <div class="orbit-outer"></div><div class="orbit-inner"></div><div class="orbit-cross"></div>
          <div class="orbit-core">
            <svg viewBox="0 0 48 48" fill="none"><path d="M10 38 37 11M17 11h20v20" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/><circle cx="10" cy="38" r="2.5" fill="currentColor"/></svg>
          </div>
          <span class="orbit-label orbit-android">Android</span>
          <span class="orbit-label orbit-flutter">Flutter</span>
          <span class="orbit-label orbit-h5">H5</span>
          <span class="orbit-label orbit-more">iOS / 小程序</span>
        </div>
        <div class="hero-art-foot"><strong>Build. Ship. Evolve.</strong><span>从想法到上线</span></div>
      </div>
    </section>

    <section id="projects" class="home-section" aria-labelledby="projects-title">
      <div class="section-head">
        <div><p class="section-index">01 / SELECTED WORK</p><h2 id="projects-title">代表项目</h2></div>
        <p>一个从设计做到上架，一个把跨端商城的购买流程做完整。</p>
      </div>
      <div class="project-grid">
        <RouterLink v-for="project in featured" :key="project.slug" class="project-card" :to="{ name: 'project', params: { slug: project.slug } }">
          <ProjectVisual :project="project" />
          <div class="card-body">
            <div class="card-heading"><div><p>{{ project.category }}</p><h3>{{ project.name }}</h3></div><span class="circle-arrow" aria-hidden="true">↗</span></div>
            <p class="card-description">{{ project.line }}</p>
            <ul class="tags" aria-label="项目方向"><li v-for="tag in project.tags" :key="tag">{{ tag }}</li></ul>
          </div>
        </RouterLink>
      </div>
      <div v-if="other.length" class="other-work">
        <h3>更多作品</h3>
        <RouterLink v-for="project in other" :key="project.slug" class="simple-link" :to="{ name: 'project', params: { slug: project.slug } }">{{ project.name }} <span aria-hidden="true">↗</span></RouterLink>
      </div>
    </section>

    <AiToolShowcase />

    <section id="experience" class="home-section" aria-labelledby="experience-title">
      <div class="section-head">
        <div><p class="section-index">03 / EXPERIENCE</p><h2 id="experience-title">工作经历</h2></div>
        <p>沿着时间路线，看看每一站做过的项目和解决过的问题。</p>
      </div>
      <CareerMap />
    </section>

    <section class="home-section release" aria-labelledby="release-title">
      <p class="section-index">04 / RELEASE PRACTICE</p>
      <h2 id="release-title">把 App 推到上线</h2>
      <p class="release-intro">参与多款 App 的上架与更新。面对不同应用市场的要求，我逐项梳理资质材料，提交后根据审核反馈继续补齐。</p>
      <ol class="release-flow"><li v-for="(step, index) in releaseSteps" :key="step"><span>{{ '0' + (index + 1) }}</span>{{ step }}</li></ol>
    </section>

    <section id="about" class="home-section about" aria-labelledby="about-title">
      <div><p class="section-index">05 / ABOUT THIS SITE</p><h2 id="about-title">关于这个作品集</h2></div>
      <div>
        <p>这是我设计和开发的个人作品集，开发过程也借助了 AI。首页先呈现代表作，让第一次来的人迅速看到我交付过什么；项目详情讲清我的贡献，工作经历则补上每段工作的背景。</p>
        <p>这里会继续更新，记录跨端作品和用 AI 做的小工具。</p>
        <a v-if="profile.email" class="simple-link" :href="'mailto:' + profile.email">联系我 <span aria-hidden="true">↗</span></a>
      </div>
    </section>
  </div>
</template>
