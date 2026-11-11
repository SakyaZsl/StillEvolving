# Still Evolving

面向招聘方和技术负责人的个人作品集。以十余年 Android 开发经验为基础，展示产品设计、Flutter 与 H5 开发、多款 App 发布与更新，以及借助 AI 扩展开发范围的实践。

## 本地运行

需要 Node.js 22.12 或更新版本。

```sh
npm ci
npm run dev
```

运行 `npm run build` 会先检查 TypeScript，再把可发布文件写到 `dist/`。构建会为每个项目和公司生成独立入口，支持直接打开或刷新详情页。将 `dist/` 发布到支持目录索引（`index.html`）的静态服务器即可。部署到子目录时，指定站点路径，例如 `npm run build -- --base /StillEvolving/`。

## 发布到 GitHub Pages

1. 在仓库的 [Settings → Pages](https://github.com/SakyaZsl/StillEvolving/settings/pages) 中，将 **Build and deployment → Source** 设为 **GitHub Actions**。
2. 将站点源码和工作流提交到 `main` 并推送。工作流会读取 Pages 的站点路径、构建并发布 `dist/`。如果先推送后开启 Pages，可在 **Actions → Deploy to GitHub Pages → Run workflow** 手动触发。
3. 部署成功后，打开 [https://sakyazsl.github.io/StillEvolving/](https://sakyazsl.github.io/StillEvolving/)。

如果希望使用根地址 `https://sakyazsl.github.io/`，可用名为 `SakyaZsl.github.io` 的仓库部署同一份代码。

## 更新内容

- 在 `src/content.ts` 的 `projects` 里新增作品，使用唯一的短横线 slug。设置 `featured: true` 可加入首页代表项目；其他作品自动进入「更多作品」。有公开体验地址时可填写 `demoUrl`。
- 在同一文件的 `companies` 中维护经历，按时间倒序排列。确认项目归属后，可通过 `projectSlugs` 将公司页链接到对应作品。可补充职责、事实、问题处理流程和配图。
- 将可公开的 App 截图和工作配图放进 `public/media/`，在条目的 `media` 中填入 `path`（例如 `media/catalog.png`）、替代文字和图注。
- 有可公开的简历和邮箱时，填写 `profile.resumePath` 和 `profile.email`。简历文件放在 `public/` 内，未配置时不会显示下载或联系入口。
