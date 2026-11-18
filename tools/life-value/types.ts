export type LifeEntry = {
  id: string
  category: string
  number: number
  title: string
  rating: string | null
  tags: Record<string, string>
  fields: Record<string, string>
  sourcePath: string
}
export type LifeLibrary = {
  title: string
  repo: string
  commit: string
  sourceUpdatedAt: string
  syncedOn: string
  license: string
  categories: { id: string; title: string; count: number }[]
  entries: LifeEntry[]
}
export type Profile = { age: string; region: string }
export type SearchResult = { entry: LifeEntry; score: number; matched: number; total: number }
