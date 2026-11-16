import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import App from './App.vue'
import Home from './views/Home.vue'
import Detail from './views/Detail.vue'
import CompanyDetail from './views/CompanyDetail.vue'
import Missing from './views/Missing.vue'
import { companies, findCompanyPage, projects } from './content'
import './style.css'
import './career.css'
import './tools.css'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', name: 'home', component: Home },
    { path: '/projects/:slug', name: 'project', component: Detail, props: true },
    { path: '/experience/:slug/:topic?', name: 'company', component: CompanyDetail, props: true },
    { path: '/:pathMatch(.*)*', component: Missing },
  ],
  scrollBehavior(to, from, saved) {
    if (saved) return saved
    if (to.path === from.path && to.hash === from.hash) return false
    if (to.hash) return { el: to.hash, top: 95 }
    return { top: 0 }
  },
})

router.afterEach((to) => {
  if (to.name === 'home') {
    document.title = 'Still Evolving · 跨端产品工程师作品集'
    return
  }
  let title: string | undefined
  if (to.name === 'project') title = projects.find((item) => item.slug === to.params.slug)?.name
  if (to.name === 'company') {
    const company = companies.find((item) => item.slug === to.params.slug)
    const topic = typeof to.params.topic === 'string' ? to.params.topic : undefined
    const page = company && findCompanyPage(company, topic)
    if (company && page) title = topic ? page.title + ' · ' + company.name : company.name
  }
  document.title = (title ?? '页面未找到') + ' · Still Evolving'
})

createApp(App).use(router).mount('#app')
