# Still Evolving

面向招聘方和技术负责人的个人作品集。以十余年 Android 开发经验为基础，展示产品设计、Flutter 与 H5 开发、多款 App 发布与更新，以及借助 AI 扩展开发范围的实践。

## 本地运行

需要 Node.js 22.12 或更新版本。

```sh
npm ci
npm run dev
```

运行 `npm run build` 会先检查 TypeScript，再把可发布文件写到 `dist/`。构建会为每个项目、公司和履历专题生成独立入口，支持直接打开或刷新详情页。将 `dist/` 发布到支持目录索引（`index.html`）的静态服务器即可。部署到子目录时，指定站点路径，例如 `npm run build -- --base /StillEvolving/`。

运行 `npm test` 可以验证收入鼓励器的计时、节假日和补班逻辑，以及生活性价比助手的资料完整性、评级规则、检索和适用范围提示。

## 生活性价比助手

本地启动后打开 `/tools/life-value/`，也可从首页「AI 小工具」卡片进入。支持输入问题、限定分类、直接浏览章节，以及通过 `?entry=14-3` 分享单条资料。

当前收录 [HowToLiveBetter](https://github.com/eternity4719/HowToLiveBetter) 的全部 34 个章节、772 条建议，固定于版本 [`49fceab`](https://github.com/eternity4719/HowToLiveBetter/tree/49fceab4254c8c2df0f7cdb1b2959cab6c451b96)。完整章节原文、项目说明和许可保存在 `public/tools/life-value/source/`，可检索快照保存在同目录的 `library.json`。正文按 CC BY 4.0 许可整理，原项目评级代码按 MIT 许可使用；界面保留原文入口、资料版本与许可说明。

资料加载后，检索在浏览器内通过关键词和常用同义词完成，不调用在线模型或后台。年龄段与地区选填，问题和个人信息均不保存、不上传。检索用于定位相关条目，无法完整理解所有问法或代替适用性判断；性价比档位对应原条目，证据等级单独展示。缺少适用条件时会明确提示，部分匹配和无结果也有对应说明。

更新上游资料需要 Node.js 和 `curl`，运行：

```sh
npm run sync:life-data
# 或指定需要复现的上游提交
npm run sync:life-data -- 49fceab4254c8c2df0f7cdb1b2959cab6c451b96
```

同步脚本会先下载并解析全部章节，校验成功后再替换本地资料。更新后需核对条目数量、解析格式与上游评级规则，更新对应的快照测试及说明，再运行 `npm test` 和 `npm run build -- --base /StillEvolving/`。构建和访问时都不需要连接上游仓库。

## 发布到 GitHub Pages

1. 在仓库的 [Settings → Pages](https://github.com/SakyaZsl/StillEvolving/settings/pages) 中，将 **Build and deployment → Source** 设为 **GitHub Actions**。
2. 将站点源码和工作流提交到 `main` 并推送。工作流会读取 Pages 的站点路径、构建并发布 `dist/`。如果先推送后开启 Pages，可在 **Actions → Deploy to GitHub Pages → Run workflow** 手动触发。
3. 部署成功后，打开 [https://sakyazsl.github.io/StillEvolving/](https://sakyazsl.github.io/StillEvolving/)。

如果希望使用根地址 `https://sakyazsl.github.io/`，可用名为 `SakyaZsl.github.io` 的仓库部署同一份代码。

## 更新内容

- 在 `src/content.ts` 的 `projects` 里新增作品，使用唯一的短横线 slug。设置 `featured: true` 可加入首页代表项目；其他作品自动进入「更多作品」。有公开体验地址时可填写 `demoUrl`。
- 在同一文件的 `companies` 中按任职时间从最近到最早维护公司；地图会按这个顺序放置节点。公司有一页 `overview`，并可通过 `topics` 添加独立专题。公司、专题各自使用唯一的短横线 slug。栏目可以配置图文段落、流程和配图，也可以通过 `projectSlugs` 链接到已确认归属的作品。
- 在 `src/tools.ts` 添加小工具的名称、封面和简介，并在 `tools/<slug>/index.html` 放置工具入口。构建会自动生成这个工具的独立页面。需要在运行时读取的数据和封面放在 `public/tools/<slug>/` 下。鼓励器的节假日数据在对应的 `data/` 目录中。
- 将可公开的 App 截图和工作配图放进 `public/media/`，在条目的 `media` 中填入 `path`（例如 `media/catalog.png`）、替代文字和图注。
- 有可公开的简历和邮箱时，填写 `profile.resumePath` 和 `profile.email`。简历文件放在 `public/` 内，未配置时不会显示下载或联系入口。
