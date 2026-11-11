import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { join } from 'node:path'
import { defineConfig, type Plugin } from 'vite'
import vue from '@vitejs/plugin-vue'
import { companies, projects } from './src/content'

function staticDetailPages(): Plugin {
  return {
    name: 'static-detail-pages',
    apply: 'build',
    async writeBundle({ dir }) {
      if (!dir) return
      const shell = await readFile(join(dir, 'index.html'), 'utf8')
      const entries = [
        ...projects.map((entry) => ({ section: 'projects', entry })),
        ...companies.map((entry) => ({ section: 'experience', entry })),
      ]
      await Promise.all(entries.map(async ({ section, entry }) => {
        const folder = join(dir, section, entry.slug)
        const title = entry.name.replace(/[&<>]/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' })[char]!)
        await mkdir(folder, { recursive: true })
        const page = shell.replace(/<title>[^<]*<\/title>/, () => '<title>' + title + ' · Still Evolving</title>')
        await writeFile(join(folder, 'index.html'), page)
      }))
    },
  }
}

export default defineConfig({ plugins: [vue(), staticDetailPages()] })
