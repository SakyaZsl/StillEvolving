import type { LifeLibrary } from './types'
export function plainText(text?: string): string
export function sourceLinks(text?: string): string[]
export function originalRating(tags: Record<string, string>): string | null
export function parseLibrary(chapters: { path: string; text: string }[], metadata: Omit<LifeLibrary, 'title' | 'license' | 'categories' | 'entries'>): LifeLibrary
