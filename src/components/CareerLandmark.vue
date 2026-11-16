<script setup lang="ts">
import type { Company } from '../content'

defineProps<{ kind?: Company['landmark'] }>()
</script>

<template>
  <svg class="career-landmark" viewBox="0 0 200 148" fill="none" aria-hidden="true" focusable="false">
    <ellipse cx="100" cy="123" rx="75" ry="15" fill="#918568" opacity=".13"/>
    <path d="M24 114c11-16 38-18 60-20 31-4 56 0 83 11l13 8v7c-23 17-52 20-82 19-34-1-62-8-75-18v-7Z" fill="#c5b18a" stroke="#8d7b5a" stroke-width="1.2"/>
    <path d="M24 114c12-15 36-19 60-21 30-4 58 1 82 12l14 8c-21 15-54 17-82 16-29 0-56-6-74-15Z" fill="#e1d5ad" stroke="#9e8a63" stroke-width="1.2"/>
    <path d="M34 123l18 5m81 1 23-5m-66 10 21 1" stroke="#ae9770" stroke-width="1.2" stroke-linecap="round"/>
    <path d="m37 108 10-2m-7 5 7-1m104-2 11 3m-21 7 7-1" stroke="#9a8d67" stroke-linecap="round"/>

    <g v-if="kind === 'tower'" stroke-linejoin="round">
      <path d="M88 12v30m0-28c11-3 16 7 29 4l-7 7 5 7c-12 3-17-7-27-4" stroke="#616b53" stroke-width="1.3" fill="#a4b281"/>
      <path d="m46 93 39-17 67 16v14l-36 18-69-17-1-14Z" fill="#a7ac91" stroke="#54634f" stroke-width="1.4"/>
      <path d="m46 93 66 17 40-18-66-17-40 18Z" fill="#cbd0ad" stroke="#54634f" stroke-width="1.4"/>
      <path d="M67 49v48l42 13 28-14V48L95 34 67 49Z" fill="#e1d5ad" stroke="#54634f" stroke-width="1.4"/>
      <path d="m109 61 28-13v48l-28 14V61Z" fill="#a8b294" stroke="#54634f" stroke-width="1.4"/>
      <path d="m67 49 42 12 28-13-42-14-28 15Z" fill="#788d71" stroke="#54634f" stroke-width="1.4"/>
      <path d="m61 48 33-25 51 24-36 17-48-16Z" fill="#7c946e" stroke="#54634f" stroke-width="1.6"/>
      <path d="m94 23 15 41 36-17-51-24Z" fill="#637d5e" stroke="#54634f" stroke-width="1.3"/>
      <path d="m75 48 22-16m1 6 8 17m15-3 9-4" stroke="#c0c8a0" stroke-linecap="round"/>
      <path d="m78 65 10 3v12l-10-3V65Zm17 5 8 2v12l-8-3V70Z" fill="#617d65" stroke="#54634f" stroke-width="1.1"/>
      <path d="M78 71l10 3m7 2 8 3m16-5 9-4m-9 10 9-4m-9 10 9-4" stroke="#eef0d0" stroke-width="1.1"/>
      <path d="M84 102V91c0-7 12-3 12 4v11l-12-4Z" fill="#67705a" stroke="#54634f" stroke-width="1.2"/>
      <path d="m91 105-7 6 14 4 8-5m-26 4 16 5 11-6" stroke="#8a805f" stroke-width="1.3" stroke-linecap="round"/>
      <path d="M148 87v24m0-25-11 17 11-3 10 2-10-16Zm0-11-9 15 9-2 8 1-8-14Z" fill="#8b9b6e" stroke="#59694f" stroke-width="1.3"/>
      <path d="M53 82v23m0-28-10 17 10-3 9 2-9-16Zm0-9-8 14 8-2 7 1-7-13Z" fill="#9ca879" stroke="#697657" stroke-width="1.2"/>
    </g>

    <g v-else stroke-linejoin="round">
      <path d="M61 18v43m0-42c9-3 17 6 30 2l-6 7 5 6c-13 4-21-5-29-2" stroke="#775f42" stroke-width="1.3" fill="#c79561"/>
      <path d="m47 80 49-20 57 20v24l-45 18-61-16V80Z" fill="#d9b880" stroke="#805f43" stroke-width="1.4"/>
      <path d="m108 96 45-16v24l-45 18V96Z" fill="#b99567" stroke="#805f43" stroke-width="1.4"/>
      <path d="m42 81 38-39 64 17-37 40-65-18Z" fill="#b77955" stroke="#805f43" stroke-width="1.5"/>
      <path d="m107 99 37-40 16 22-53 18Z" fill="#cd9266" stroke="#805f43" stroke-width="1.5"/>
      <path d="m50 78 31-31 54 14m-64 23 31-31m-20 35 31-30m-18 34 31-31m-64 5 53 15" stroke="#ddaa80" stroke-width="1.1" stroke-linecap="round"/>
      <path d="m50 96 56 16m-56-9 56 16m7-15 36-14m-36 22 36-14" stroke="#9b7751" stroke-width="1.05"/>
      <path d="M76 113v-13c0-8 14-5 14 4v13l-14-4Z" fill="#775e47" stroke="#805f43" stroke-width="1.2"/>
      <path d="m53 89 10 3v10l-10-3V89Zm71 10 12-4v9l-12 5v-10Z" fill="#65735a" stroke="#805f43" stroke-width="1.2"/>
      <path d="m58 92v8m72-2v8m-50 8-10 4 16 5 9-4" stroke="#e2d8a9" stroke-width="1.1"/>
      <path d="M151 83v25m0-27-12 18 12-3 11 3-11-18Zm0-11-10 16 10-3 9 2-9-15Z" fill="#839063" stroke="#5e6b4c" stroke-width="1.3"/>
      <path d="M40 88v22m0-25-10 17 10-3 9 2-9-16Zm0-10-8 15 8-3 7 2-7-14Z" fill="#9aa273" stroke="#697652" stroke-width="1.2"/>
    </g>
  </svg>
</template>
