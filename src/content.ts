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
export type CompanyPage = {
  slug?: string
  title: string
  summary: string
  intro: string
  sections?: Step[]
  facts?: Entry['facts']
  media?: Media[]
  flow?: { title: string; items: string[] }
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
    slug: 'zhongfei',
    name: '中飞',
    period: '上一段经历',
    line: 'App 重构、多机型适配与线上问题处理',
    landmark: 'workshop',
    overview: {
      title: '公司与项目介绍',
      summary: '我在中飞负责什么',
      intro: '在中飞，我主要负责已有 Android App 的重构，也处理日常测试问题、多机型兼容适配，以及在线客服收到的用户反馈。',
      facts: [
        { label: '主要职责', value: 'App 重构' },
        { label: '工作范围', value: '开发、测试问题处理与线上支持' },
      ],
      sections: [
        { title: '维护和改造已有应用', text: '我的工作既涉及重构已有代码，也包括处理测试时发现的问题。重构和日常维护都围绕同一款 App 展开。' },
        { title: '跟进真实使用环境中的问题', text: '对于不同 Android 机型的兼容问题，我负责做代码适配。用户在线上遇到问题时，也可以通过在线客服反馈，由我跟进处理。' },
      ],
    },
    topics: [
      {
        slug: 'app-refactor',
        title: 'App 重构',
        summary: '改造既有 App，处理日常测试反馈',
        intro: '重构是我在中飞的主要职责。除了改造既有 App，我也处理日常测试反馈，跟进应用在测试中的实际表现。',
        facts: [{ label: '负责范围', value: '既有 App 的重构与日常问题处理' }],
        sections: [
          { title: '既有应用的改造', text: '工作对象是已有的 App。我负责对现有代码进行重构，处理改造工作中的开发问题。' },
          { title: '日常测试问题', text: '测试发现问题后，我负责跟进对应的代码问题。涉及不同设备表现的问题，也会按 Android 机型兼容适配来处理。' },
        ],
      },
      {
        slug: 'android-compatibility',
        title: 'Android 多机型适配',
        summary: '针对不同 Android 机型调整代码',
        intro: '我负责处理同一款 App 在不同 Android 机型上的兼容问题，并根据设备的实际表现做代码适配。',
        facts: [{ label: '适配对象', value: '同一款 App 在不同 Android 机型上的表现' }],
        sections: [
          { title: '难点：差异来自实际设备', text: '同一套代码需要在多种机型上运行。遇到机型兼容问题时，具体设备上的表现是判断适配范围的依据。' },
          { title: '个人贡献：代码适配', text: '我根据不同机型的表现调整 App 代码，处理兼容性问题。' },
        ],
      },
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
]

export function companyPages(company: Company): CompanyPage[] {
  return [company.overview, ...(company.topics ?? [])]
}

export function findCompanyPage(company: Company, topic?: string): CompanyPage | undefined {
  return topic ? company.topics?.find((page) => page.slug === topic) : company.overview
}

export const releaseSteps = ['梳理市场要求', '准备资质材料', '提交与跟进审核', '按反馈补齐']
