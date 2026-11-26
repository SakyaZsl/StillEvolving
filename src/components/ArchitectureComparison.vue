<script setup lang="ts">
import type { ArchitectureComparison } from '../content'

defineProps<{ comparison: ArchitectureComparison }>()
</script>

<template>
  <section class="career-article-section architecture" aria-labelledby="architecture-title">
    <h2 id="architecture-title">从 MVC、MVP 逐步转向 MVVM</h2>
    <p>{{ comparison.intro }}</p>

    <details class="architecture-code">
      <summary>查看三种写法共用的数据和渲染代码</summary>
      <pre tabindex="0" aria-label="公共 Kotlin 代码"><code>{{ comparison.sharedCode }}</code></pre>
    </details>

    <div class="architecture-examples">
      <article v-for="example in comparison.examples" :key="example.name" class="architecture-example">
        <h3>{{ example.name }}</h3>
        <p>{{ example.responsibility }}</p>
        <dl class="career-article-points">
          <div><dt>优点</dt><dd>{{ example.strength }}</dd></div>
          <div><dt>代价</dt><dd>{{ example.tradeoff }}</dd></div>
        </dl>
        <details class="architecture-code">
          <summary>查看 {{ example.name }} 的 Activity 示例</summary>
          <pre tabindex="0" :aria-label="example.name + ' Kotlin Activity 示例'"><code>{{ example.code }}</code></pre>
        </details>
      </article>
    </div>

    <div class="architecture-decision">
      <h3>为什么用 MVVM</h3>
      <p>{{ comparison.decision }}</p>
      <p>{{ comparison.boundary }}</p>
    </div>
  </section>
</template>

<style scoped>
.architecture-examples { display: grid; gap: 12px; margin-top: 16px; }
.architecture-example { min-width: 0; border: 1px solid var(--line); border-radius: 10px; padding: clamp(12px, 3vw, 18px); background: #fffdf5; }
h3 { margin: 0 0 6px; font-size: 18px; }
.architecture-code { min-width: 0; margin-top: 12px; border: 1px solid #d7ddcc; border-radius: 7px; background: #edf0e3; }
.architecture-code summary { padding: 10px 12px; color: #2a4634; font-size: 14px; font-weight: 650; cursor: pointer; }
.architecture-code summary:focus-visible, .architecture-code pre:focus-visible { outline: 2px solid #496448; outline-offset: 2px; }
.architecture-code pre { margin: 0; max-width: 100%; max-height: 27rem; overflow: auto; padding: 13px; border-radius: 0 0 6px 6px; background: #25342d; color: #f7f7ed; font: 13px/1.65 var(--mono); }
.architecture-decision { margin-top: 16px; border-left: 3px solid #80946c; padding: 12px 15px; background: #eef2e9; }
.architecture-decision p + p { margin-top: 8px; }
</style>
