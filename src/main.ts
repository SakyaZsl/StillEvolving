import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import App from './App.vue'
import Home from './views/Home.vue'
import Detail from './views/Detail.vue'
import Missing from './views/Missing.vue'
import { companies, projects } from './content'
import './style.css'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', name: 'home', component: Home },
    { path: '/projects/:slug', name: 'project', component: Detail, props: true },
    { path: '/experience/:slug', name: 'company', component: Detail, props: true },
    { path: '/:pathMatch(.*)*', component: Missing },
  ],
  scrollBehavior(to, _from, saved) {
    if (saved) return saved
    if (to.hash) return { el: to.hash, top: 95 }
    return { top: 0 }
  },
})

router.afterEach((to) => {
  const entry = to.name === 'project'
    ? projects.find((item) => item.slug === to.params.slug)
    : to.name === 'company'
      ? companies.find((item) => item.slug === to.params.slug)
      : undefined
  document.title = entry ? entry.name + ' · Still Evolving'
    : to.name === 'home' ? 'Still Evolving · 跨端产品工程师作品集' : '页面未找到 · Still Evolving'
})

createApp(App).use(router).mount('#app')
