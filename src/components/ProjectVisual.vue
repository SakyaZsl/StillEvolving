<script setup lang="ts">
import type { Project } from '../content'
import { publicUrl } from '../public-url'
defineProps<{ project: Project }>()
</script>

<template>
  <div v-if="project.screenshot" class="project-visual project-preview" :class="'visual-' + (project.visual ?? 'default')" aria-hidden="true">
    <img
      :src="publicUrl(project.screenshot.path)"
      :width="project.screenshot.width"
      :height="project.screenshot.height"
      alt=""
      loading="lazy"
      decoding="async"
    />
  </div>
  <div v-else class="project-visual" :class="'visual-' + (project.visual ?? 'default')" aria-hidden="true">
    <span class="visual-label">{{ project.visual === 'delivery' ? 'PRODUCT DELIVERY' : project.visual === 'commerce' ? 'CROSS-PLATFORM COMMERCE' : 'PROJECT NOTES' }}</span>
    <div v-if="project.visual === 'delivery'" class="delivery-art">
      <div class="delivery-tile"><span class="petal-symbol">✳</span></div>
      <div class="delivery-stack">
        <span><i></i> DESIGN</span><span><i></i> BUILD</span><span><i></i> RELEASE</span>
      </div>
    </div>
    <div v-else-if="project.visual === 'commerce'" class="commerce-art">
      <div class="art-window">
        <div class="art-window-head"><i></i><i></i><i></i><span>H5</span></div>
        <div class="art-window-grid"><i></i><i></i><i></i><i></i></div>
      </div>
      <div class="art-phone">
        <div class="art-phone-top"></div><div class="art-phone-img">↗</div><i></i><i></i><strong></strong>
      </div>
    </div>
    <div v-else class="fallback-art">↗</div>
    <span class="visual-foot">项目示意</span>
  </div>
</template>
