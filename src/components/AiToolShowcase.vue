<script setup lang="ts">
import { aiTools, toolPath } from '../tools'
import { publicUrl } from '../public-url'
</script>

<template>
  <section id="tools" class="home-section" aria-labelledby="tools-title">
    <div class="section-head">
      <div><p class="section-index">02 / AI TOOLBOX</p><h2 id="tools-title">AI 小工具</h2></div>
      <p>从日常的小问题出发，借助 AI 做成打开就能用的工具。</p>
    </div>
    <ul class="tool-showcase">
      <li v-for="(tool, index) in aiTools" :key="tool.slug">
        <a class="tool-card" :href="publicUrl(toolPath(tool.slug))" :aria-label="'立即体验' + tool.name">
          <div class="tool-card-copy">
            <p class="tool-card-index"><span aria-hidden="true">✦</span> TOOL {{ String(index + 1).padStart(2, '0') }}</p>
            <h3>{{ tool.name }}</h3>
            <p class="tool-card-description">{{ tool.description }}</p>
            <ul class="tags" aria-label="工具特点"><li v-for="tag in tool.tags" :key="tag">{{ tag }}</li></ul>
            <span class="button tool-card-button">立即体验 <span aria-hidden="true">↗</span></span>
          </div>
          <div class="tool-card-art">
            <img :src="publicUrl(tool.cover)" width="1200" height="800" loading="lazy" decoding="async" alt="" />
          </div>
        </a>
      </li>
    </ul>
  </section>
</template>
