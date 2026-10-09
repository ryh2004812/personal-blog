import { createContentLoader } from 'vitepress'
import { CATEGORIES, categoryOf } from './categories'

export interface Post {
  title: string
  url: string
  date: string
  tags: string[]
  description: string
  category: string
  categoryLabel: string
  accent: string
  year: string
}

declare const data: Post[]
export { data }

function formatDate(d: Date): string {
  const y = d.getUTCFullYear()
  const m = String(d.getUTCMonth() + 1).padStart(2, '0')
  const day = String(d.getUTCDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

export default createContentLoader('**/*.md', {
  transform(raw) {
    return raw
      .filter((page) => Boolean(page.frontmatter.date && page.frontmatter.title))
      .map((page) => {
        const key = categoryOf(page.url)
        const category = CATEGORIES[key]
        const raw = page.frontmatter.date
        const dateObj = raw instanceof Date ? raw : new Date(raw)
        const date = formatDate(dateObj)
        return {
          title: page.frontmatter.title,
          url: page.url,
          date,
          tags: (page.frontmatter.tags as string[]) ?? [],
          description: (page.frontmatter.description as string) ?? '',
          category: key,
          categoryLabel: category?.label ?? '未分类',
          accent: category?.accent ?? '#6a8cff',
          year: String(dateObj.getUTCFullYear())
        }
      })
      .sort((a, b) => (a.date < b.date ? 1 : -1))
  }
})
