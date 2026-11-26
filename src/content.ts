import { zhongfeiRefactor } from './content/zhongfei-refactor'
import { zhongfeiCompatibility } from './content/zhongfei-compatibility'

export type Step = { title: string; text: string }
export type Media = { path: string; alt: string; caption: string }
type Entry = {
  slug: string
  name: string
  intro: string
  steps?: Step[]
  facts: { label: string; value: string }[]
  media?: Media[]
}
export type Project = Entry & {
  category: string
  line: string
  tags: string[]
  visual?: 'delivery' | 'commerce'
  featured?: boolean
  demoUrl?: string
}
export type ArchitectureComparison = {
  intro: string
  sharedCode: string
  examples: { name: string; responsibility: string; strength: string; tradeoff: string; code: string }[]
  decision: string
  boundary: string
}

export type CompanyPage = {
  slug?: string
  title: string
  summary: string
  intro: string
  sections?: (Step & { points?: Step[]; link?: { label: string; url: string } })[]
  facts?: Entry['facts']
  media?: Media[]
  flow?: { title: string; items: string[] }
  architecture?: ArchitectureComparison
  projectSlugs?: string[]
}
export type Company = {
  slug: string
  name: string
  period: string
  line: string
  landmark?: 'workshop' | 'tower'
  current?: boolean
  overview: Omit<CompanyPage, 'slug'>
  topics?: (CompanyPage & { slug: string })[]
}

// 有可公开的资料时填写。未填写的链接不会出现在页面上。
export const profile: { resumePath?: string; email?: string } = {}

export const projects: Project[] = [
  {
    slug: 'huahua-youbei',
    name: '花花有贝',
    category: 'App 产品设计与交付',
    line: '从 App 和图标设计，到架构、开发、测试、上架与后续更新。',
    intro: '这是一款结合工具功能与贷款业务的 App。我负责整个 App 的设计和开发，也负责测试、上架和后续更新。',
    tags: ['产品设计', '代码架构', '应用上架'],
    visual: 'delivery',
    featured: true,
    facts: [
      { label: '产品类型', value: '工具功能 + 贷款业务' },
      { label: '我的角色', value: 'App 设计、开发、测试与发布' },
    ],
    steps: [
      { title: '产品与图标设计', text: '负责 App 整体设计和应用图标设计，组织产品中的工具功能和贷款功能。' },
      { title: '架构与功能开发', text: '设计 App 的代码架构，完成产品功能的开发。' },
      { title: '测试、发布与迭代', text: '完成项目测试，处理 App 上架工作，并负责后续版本的更新。' },
    ],
  },
  {
    slug: 'xiangouhua',
    name: '享购花',
    category: 'Flutter + H5 商城',
    line: '搭建 Flutter 外壳和内嵌 H5，做通从商品列表到下单支付的购买流程。',
    intro: '这是一个将 H5 商城嵌入 Flutter App 的项目。我负责搭建 Flutter App 外壳与内嵌 H5 项目，并完成商城购买流程的开发。',
    tags: ['Flutter', '内嵌 H5', '下单支付'],
    visual: 'commerce',
    featured: true,
    facts: [
      { label: '技术组合', value: 'Flutter App + 内嵌 H5' },
      { label: '负责范围', value: '两端项目搭建与购买流程开发' },
    ],
    steps: [
      { title: '搭建 Flutter App 外壳', text: '搭建外层 Flutter App 框架，为内嵌 H5 商城提供承载入口。' },
      { title: '搭建内嵌 H5', text: '搭建内部 H5 项目，开发商城的商品列表等业务页面。' },
      { title: '完成购买流程', text: '打通商品展示、下单和支付，完成从浏览到购买的核心链路。' },
    ],
  },
]

export const companies: Company[] = [
  {
    slug: 'kaisheng',
    name: '凯盛',
    period: '当前任职',
    current: true,
    line: '现在的工作经历',
    landmark: 'tower',
    overview: {
      title: '工作经历概览',
      summary: '当前任职信息',
      intro: '凯盛是我目前任职的公司。',
      facts: [{ label: '任职状态', value: '当前任职' }],
    },
  },
  {
    slug: 'zhongfei',
    name: '中飞赛维',
    period: '上一段经历',
    line: '无人机飞巡 App · Android 重构与多机型适配',
    landmark: 'workshop',
    overview: {
      title: '公司与项目介绍',
      summary: '电科院无人机飞巡 App 与我的职责',
      intro: '在中飞赛维，我参与了电科院无人机飞巡 App 项目。这款 App 用于协助四川电科院开展电力杆塔巡检。',
      sections: [
        {
          title: '公司介绍',
          text: '中飞赛维智能科技有限公司面向泛能源行业提供数智化解决方案，涵盖数字化运营管理、智能场景应用和 AI 辅助决策，服务于电力、能源、政府等领域的客户。',
          link: { label: '公司官网', url: 'https://www.zfuav.com/#/home' },
        },
        {
          title: '项目介绍 · 电科院无人机飞巡 App',
          text: '巡检人员在 App 中获取无人机平台下发的飞巡任务，按任务要求对指定杆塔开展无人机巡检，并在巡检完成后上传现场多媒体资料。',
        },
        {
          title: '我的职责',
          text: '我主要负责飞巡 App 的 Android 端重构，同时处理日常测试反馈、不同 Android 机型的兼容问题，以及通过在线客服收到的用户反馈。',
        },
      ],
      flow: { title: '巡检流程', items: ['获取飞巡任务', '巡检指定杆塔', '上传现场资料'] },
    },
    topics: [
      zhongfeiRefactor,
      zhongfeiCompatibility,
      {
        slug: 'online-support',
        title: '线上用户问题处理',
        summary: '通过在线客服跟进 App 使用问题',
        intro: '除了开发和测试，我也通过在线客服直接接收用户反馈，跟进用户在实际使用 App 时遇到的问题。',
        sections: [
          { title: '接收一线反馈', text: '在线客服是我接触用户反馈的入口。通过这个渠道，我能了解用户在日常使用中遇到的问题。' },
          { title: '跟进对应的问题', text: '我负责及时跟进并处理收到的使用问题。遇到与设备兼容有关的问题时，也需要回到 App 代码做适配。' },
        ],
        flow: { title: '从反馈到处理', items: ['接收在线客服反馈', '跟进用户遇到的问题', '处理并跟进结果'] },
      },
    ],
  },
]

export function companyPages(company: Company): CompanyPage[] {
  return [company.overview, ...(company.topics ?? [])]
}

export function findCompanyPage(company: Company, topic?: string): CompanyPage | undefined {
  return topic ? company.topics?.find((page) => page.slug === topic) : company.overview
}

export const releaseSteps = ['梳理市场要求', '准备资质材料', '提交与跟进审核', '按反馈补齐']
