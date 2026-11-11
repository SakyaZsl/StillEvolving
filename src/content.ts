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
export type Company = Entry & {
  period: string
  line: string
  tags: string[]
  projectSlugs?: string[]
  issueFlow?: { sources: string[]; resolution: string }
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
    line: '现任工作经历',
    intro: '凯盛是我目前任职的公司。',
    tags: [],
    facts: [{ label: '任职状态', value: '当前任职' }],
  },
  {
    slug: 'zhongfei',
    name: '中飞',
    period: '上一段经历',
    line: 'App 重构、多机型适配与线上问题处理',
    intro: '在中飞，我主要负责 App 重构，也处理日常测试问题、Android 多机型兼容适配，以及在线客服收到的用户反馈。',
    tags: ['App 重构', 'Android 多机型', '线上支持'],
    facts: [
      { label: '主要职责', value: 'App 重构' },
      { label: '日常工作', value: '测试反馈、机型适配与用户问题跟进' },
    ],
    steps: [
      { title: '推进 App 重构', text: '负责 App 的重构工作，同时处理日常测试发现的问题。' },
      { title: '适配不同 Android 机型', text: '根据不同机型的表现调整代码，处理兼容性问题。' },
      { title: '跟进线上用户问题', text: '通过在线客服接收用户反馈，及时跟进并处理实际使用中遇到的问题。' },
    ],
    issueFlow: {
      sources: ['日常测试反馈', '不同 Android 机型', '在线客服反馈'],
      resolution: '定位、修复或适配，跟进处理结果',
    },
  },
]

export const releaseSteps = ['梳理市场要求', '准备资质材料', '提交与跟进审核', '按反馈补齐']
