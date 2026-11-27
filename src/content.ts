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
  screenshot?: Media & { width: number; height: number }
  productFlow?: { title: string; steps: string[] }
  technicalCase?: { title: string; intro: string; flow: Step[]; notes: Step[] }
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
    slug: 'xiangouhua',
    name: '享购花',
    category: 'Flutter + H5 商城',
    line: '搭建 Flutter 外壳和内嵌 H5，交付从商品浏览到下单支付的商城流程。',
    intro: '我负责搭建 Flutter App 外壳和内嵌 H5 商城，并完成从商品浏览、下单到支付结果的流程。App 管理登录状态，H5 承担商城页面和购买流程。',
    tags: ['Flutter', 'WebView', '登录态同步', '下单支付'],
    visual: 'commerce',
    featured: true,
    screenshot: {
      path: 'media/xiangouhua-mall.webp',
      width: 818,
      height: 1742,
      alt: '享购花商城首页，展示商品搜索、分类导航和好物推荐',
      caption: '商城首页。搜索、商品分类和推荐分别为用户提供按关键词找货、按类目浏览和直接选购的入口。',
    },
    facts: [
      { label: '技术组合', value: 'Flutter App + 内嵌 H5' },
      { label: '我的职责', value: 'Flutter 外壳、H5 搭建与购买流程开发' },
    ],
    steps: [
      { title: '组织商城入口', text: '在首页把商品搜索、类目和推荐摆在用户能直接找到的位置，再接入商品列表与详情。' },
      { title: '搭建 Flutter 与 H5 的分工', text: 'Flutter 承载 WebView 和 App 登录，H5 开发商城页面，通过桥接同步会话。' },
      { title: '接通订单和支付', text: '把选购、下单、支付和支付结果串成一条流程，用户可以从商品页一路走到结果页。' },
    ],
    productFlow: {
      title: '商城购买流程',
      steps: ['搜索或浏览商品', '查看商品详情', '确认并提交订单', '支付与查看结果'],
    },
    technicalCase: {
      title: 'Flutter 与 H5 的登录态同步',
      intro: 'App 登录成功后，WebView 里的商城仍需拿到凭证才能请求订单等接口。页面加载和会话同步是异步的，首个请求可能早于凭证到达。',
      flow: [
        { title: 'Flutter · 管理登录', text: '在 App 完成登录，持有当前会话凭证。' },
        { title: 'WebView · 同步会话', text: 'Flutter 将凭证同步到受信任的商城页面，H5 也可以通过桥接主动查询登录状态。' },
        { title: 'H5 · 统一处理请求', text: '公共请求层对需要登录的请求等待凭证，在可用时填入请求头，再调用业务接口。' },
      ],
      notes: [
        { title: '为什么放在公共请求层', text: '订单等页面共享同一套逻辑。公开接口可跳过凭证等待。受保护接口的等待有超时，超时后若接口返回 401，就走已有的登录失效处理。' },
        { title: '401 排障演示', text: '在同一次 WebView 加载里，记录凭证同步和首个订单请求的时间，只记录请求头是否带凭证。请求先发出就查时序，凭证始终没到就查桥接。带上凭证仍返回 401，再核对凭证有效性和请求头格式。' },
        { title: '怎么验证', text: '用首次进入商城、重新登录、凭证延迟和凭证失效四种情况，对照 H5 的请求头和接口响应。另测公开商品页的请求，确认它可以跳过凭证等待。' },
      ],
    },
  },
  {
    slug: 'huahua-youbei',
    name: '花花有贝',
    category: 'Flutter App 设计与交付',
    line: '负责 App 和图标设计、开发与测试，完成六个 Android 渠道的签名打包。',
    intro: '我负责 App 和图标设计、Flutter 开发、测试、应用市场上架及后续更新。这里用记账首页说明产品设计，再用 Android 多渠道构建说明发布过程。',
    tags: ['产品设计', 'Flutter', 'Android 多渠道发布'],
    visual: 'delivery',
    featured: true,
    screenshot: {
      path: 'media/huahua-youbei-ledger.webp',
      width: 900,
      height: 2000,
      alt: '花花有贝记账首页，展示本月收支、预算、最近记录和记一笔入口',
      caption: '记账首页。从月度收支、预算到最近记录，按用户打开账本时最常看的顺序排列。',
    },
    facts: [
      { label: '展示界面', value: '记账首页' },
      { label: '交付记录', value: '六个 Android 渠道的签名 APK' },
    ],
    steps: [
      { title: '把账本做成打开就能看', text: '把本月结余、收入和支出放在首屏，接着展示预算余额和最近记录。空账本也留出「记一笔」入口，让新用户知道下一步怎么做。' },
      { title: '完成 App 设计和开发', text: '负责应用图标和页面设计，搭建 Flutter 应用结构，开发记账、预算、统计等功能并跟进测试。' },
      { title: '跟进上架与更新', text: '根据不同市场准备材料、提交并处理审核反馈，后续版本继续核对渠道包和更新配置。' },
    ],
    technicalCase: {
      title: '一套 App 如何交付六个 Android 渠道',
      intro: '同一版 App 要交付给官方、小米、华为、OPPO、vivo 和 360。构建产物需要能对应目标渠道，应用内检查更新也要知道当前安装的是哪个渠道和版本。',
      flow: [
        { title: '按渠道构建', text: '通过 Gradle Flavor 写入对应的渠道资源，从同一套项目批量生成各渠道的 Release APK。' },
        { title: '逐包核对', text: '打包后逐个核对实际产物中的渠道标识、版本号和签名，再交付对应的 APK。' },
        { title: '检查更新', text: '客户端按构建号 versionCode 判断是否有更新，用 versionName 展示版本，并在安装前检查下载包。' },
      ],
      notes: [
        { title: '构建和运行时共用渠道标识', text: 'Flutter 从 Android 包里读取渠道标识，让构建配置和运行时使用同一个值。' },
        { title: '怎么验证交付', text: '1.0.2（构建号 5）共生成六个签名 APK，逐个核对了版本号、渠道和签名。应用内更新还检查下载包的包名、版本和记账版标识，发布时需要确认对应渠道的更新配置指向正确文件。' },
      ],
    },
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
