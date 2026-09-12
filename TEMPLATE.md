# 攻略站模板使用说明

模板保留当前 Vinext + React + Vercel 架构。Endacopia 正式站仍使用原域名和原有 URL。模板复用应在新目录、新仓库和新的 Vercel 项目中进行。

## 三层结构

| 层 | 文件 | 修改范围 |
| --- | --- | --- |
| 游戏与站点配置 | `config/site.json` | 游戏名、SEO、语言、导航、分类、官方链接、图标、分享图、谜题目录介绍 |
| 游戏内容 | `content/home.json`、`content/guides/*.mdx`、`public/` | 首页文案、推荐入口、游戏资料、攻略和有权使用的截图 |
| 通用框架 | `app/`、`components/`、`lib/` | 页面布局、目录、表格、关联攻略、路由、站点地图和统计脚本 |

替换游戏不需要修改页面组件。`/` 和 `/puzzles` 是保留页面；`/wiki` 是内容中的总目录，模板默认导航和面包屑依赖该页面，需保留。其他攻略 URL 由 frontmatter 中的 `slug` 自动生成。分类在 `site.categories` 中声明，目录按实际内容生成。

## 新游戏步骤

1. 在新的工作目录复制源码，排除 `.git`、`.env.local`、`.vercel`、`.next`、`.wrangler`、`dist`、`node_modules` 等身份、环境和生成文件。
2. 改 `config/site.json` 和 `content/home.json`，替换 `public/` 中图标、分享图及截图。不要只替换标题而保留旧游戏的描述、官方链接和素材。
3. 移除旧攻略，按已验证的玩家问题加入新攻略，保留一篇 `slug: "wiki"` 的总目录。`relatedSlugs`、导航、首页推荐必须指向真实存在的页面。
4. 新建自己的环境配置：`SITE_URL` 为新站的唯一正式域名；GA 和 GSC 使用新站自己的 ID。未配置统计 ID 时不加载统计脚本。不要复制 Endacopia 的 `.env.local`。
5. 执行 `npm ci`、`npm run check:content`、`npm run typecheck`、`npm run lint`、`npm run test:template` 和 `npm run build:vercel`。当前 Endacopia 的内容回归测试在 `npm run test:vercel`，换游戏后也需替换其中针对 Old Key/Secrets 的断言。
6. 本地预览核对文案和素材，再绑定新 Vercel 项目。正式发布后验证 canonical、robots、sitemap，并在新站 GSC 中提交 sitemap。

## 攻略格式

`.mdx` 文件使用 JSON frontmatter 和受限 Markdown，不执行 MDX/JSX。支持二、三级标题、段落、引用、有序/无序列表、加粗、行内代码、链接、表格、本地图片。

必填：`slug`、`title`、`description`、`category`、`updated`、`readTime`、`sources`。
可选：`spoiler`、`quickAnswer`、`scope`、`relatedSlugs`。

`updated` 是该篇攻略实际更新日期，不能为了 SEO 批量刷新。首页更新时间在 `content/home.json`。页脚数量和最新攻略日期自动计算；它不表示所有攻略均已重新研究。

截图写法：`![说明文字](/images/example.webp "来源和图注")`。请使用亲自截取或已获许可的图片。不要将推测或生成图片当作游戏内证据。

## 模板验收

`npm run test:template` 在临时目录中把配置、首页和攻略全部替换为虚构的 Moon Archive，真实执行生产构建，并验证首页、目录、谜题列表和详情页。它检查新域名、正确的 4 个 sitemap URL、旧游戏文字不残留、旧攻略返回 404、未配置统计时不加载 GA。测试不部署，结束后移除临时目录。

## 广告接入位置

首个普通 Banner 放在攻略正文/来源之后、关联攻略之前。不要遮挡 Quick Answer、步骤或导航。需要广告平台审核后的真实代码、尺寸及域名配置，再接入并验证移动端、加载失败和拒绝追踪时的行为。现在尚未收到广告代码，正式站不加载广告脚本，也不展示空白广告占位。广告账户、隐私说明、同意机制和 ads.txt 按最终选定平台的实际要求配置，不能使用示例广告 ID。
