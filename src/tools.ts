type AiTool = {
  slug: string
  name: string
  description: string
  cover: string
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
]

export function toolPath(slug: string) {
  return `tools/${slug}/`
}
