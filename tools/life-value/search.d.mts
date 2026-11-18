import type { LifeEntry, Profile, SearchResult } from './types'
export function queryTerms(question: string): string[][]
export function hasNegatedAction(question: string): boolean
export type SearchIndex = { entry: LifeEntry; title: string; summary: string; body: string }[]
export function createSearchIndex(entries: LifeEntry[]): SearchIndex
export function searchLibrary(index: SearchIndex, question: string, category?: string): SearchResult[]
export function applicabilityNote(profile: Profile, fields: Record<string, string>): { title: string; text: string; notes: string }
