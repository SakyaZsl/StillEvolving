type AiTool = {
  slug: string
  name: string
  description: string
  cover: string
  coverFit?: 'cover' | 'contain'
  tags: string[]
}

export const aiTools: AiTool[] = [
  {
    slug: 'work-encourager',
    name: '上班收入鼓励器',
    description: '输入月薪，看看上班时每秒赚多少。午休、下班和休息日，计时也跟着休息。',
    cover: 'tools/work-encourager/assets/cow-office.jpg',
    tags: ['实时计时', '本地保存'],
  },
  {
    slug: 'life-value',
    name: '生活性价比助手',
    description: '这件事值得做吗？查阅生活建议的成本、收益和证据，找到与你的问题相关的依据。',
    cover: 'tools/life-value/poster.webp',
    coverFit: 'contain',
    tags: ['本地检索', '分类浏览'],
  },
]

export function toolPath(slug: string) {
  return `tools/${slug}/`
}
