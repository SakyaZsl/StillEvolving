<script setup lang="ts">
import { ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { profile } from './content'
import { publicUrl } from './public-url'

const route = useRoute()
const main = ref<HTMLElement>()
const navigation = [
  { hash: '#projects', label: '作品' },
  { hash: '#experience', label: '经历' },
  { hash: '#about', label: '关于' },
]

watch(() => route.path, () => main.value?.focus({ preventScroll: true }), { flush: 'post' })
</script>

<template>
  <a class="skip-link" href="#main-content">跳到主要内容</a>
  <header class="site-header">
    <div class="shell header-inner">
      <RouterLink class="brand" to="/" aria-label="Still Evolving 首页">
        <img :src="publicUrl('mark.svg')" width="32" height="32" alt="" />
        <span>Still Evolving<span class="brand-period">.</span></span>
      </RouterLink>
      <nav aria-label="主导航">
        <RouterLink v-for="item in navigation" :key="item.hash" :to="{ name: 'home', hash: item.hash }" custom v-slot="{ href, navigate }">
          <a :href="href" :aria-current="route.name === 'home' && route.hash === item.hash ? 'location' : undefined" @click="navigate">{{ item.label }}</a>
        </RouterLink>
        <a v-if="profile.email" :href="'mailto:' + profile.email">联系 ↗</a>
      </nav>
    </div>
  </header>
  <main id="main-content" ref="main" tabindex="-1"><RouterView /></main>
  <footer class="site-footer">
    <div class="shell footer-inner">
      <RouterLink class="brand" to="/">Still Evolving<span class="brand-period">.</span></RouterLink>
      <span>一个持续更新的个人作品集</span>
      <a v-if="profile.email" :href="'mailto:' + profile.email">联系我 ↗</a>
    </div>
  </footer>
</template>
