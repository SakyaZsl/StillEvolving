import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { join, resolve } from 'node:path'
import { defineConfig, type Plugin } from 'vite'
import vue from '@vitejs/plugin-vue'
import { companies, companyPages, projects } from './src/content'
import { aiTools, toolPath } from './src/tools'

function staticDetailPages(): Plugin {
  return {
    name: 'static-detail-pages',
    apply: 'build',
    async writeBundle({ dir }) {
      if (!dir) return
      const shell = await readFile(join(dir, 'index.html'), 'utf8')
      const entries = [
        ...projects.map((project) => ({ path: ['projects', project.slug], title: project.name })),
        ...companies.flatMap((company) => companyPages(company).map((page) => ({
          path: page.slug ? ['experience', company.slug, page.slug] : ['experience', company.slug],
          title: page.slug ? page.title + ' · ' + company.name : company.name,
        }))),
      ]
      await Promise.all(entries.map(async ({ path, title }) => {
        const folder = join(dir, ...path)
        const escapedTitle = title.replace(/[&<>]/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' })[char]!)
        await mkdir(folder, { recursive: true })
        const page = shell.replace(/<title>[^<]*<\/title>/, () => '<title>' + escapedTitle + ' · Still Evolving</title>')
        await writeFile(join(folder, 'index.html'), page)
      }))
    },
  }
}

export default defineConfig({
  plugins: [vue(), staticDetailPages()],
  build: {
    rollupOptions: {
      input: [
        resolve(import.meta.dirname, 'index.html'),
        ...aiTools.map((tool) => resolve(import.meta.dirname, toolPath(tool.slug), 'index.html')),
      ],
    },
  },
})
