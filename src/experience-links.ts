export function companyLink(slug: string, topic?: string) {
  return { name: 'company', params: { slug, topic: topic ?? '' } }
}

export const careerMapLink = (station?: string) => ({
  name: 'home',
  query: station ? { station } : {},
  hash: '#experience',
})
