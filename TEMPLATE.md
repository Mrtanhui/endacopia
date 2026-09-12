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

## 统计校准与信息页（2026-09-11）

新增 `/about`、`/contact`、`/privacy`，与攻略数量分开统计。维护者、GitHub 联系地址在 `config/site.json` 的 `maintainer` 中配置；复用时必须替换。`informationUpdated` 是信息页更新日期，不能用部署时间自动冒充政策更新。新增页面进入 sitemap，替换测试现在验证 7 个页面。

统计由 `components/Analytics.tsx` 与 `public/analytics.js` 管理。仅正式 `SITE_URL` 域名、用户明确允许统计后加载 GA4；本地和 Vercel 预览不发正式统计。页面链接使用完整文档导航，只有一次 `gtag config` 自动发送 page_view，没有第二份手动 page_view。GA4 后台关闭基于浏览器历史的 page_view，避免页内目录操作混入浏览量。标准滚动事件保留；没有表单、搜索、嵌入视频/下载功能时不启用相应自动事件。

- `guide_card_click`：攻略卡片。
- `internal_link_click`：其他站内页面链接；页内锚点不算。
- `outbound_source_click`：正文及来源区的外部引用。
- 参数：`page_path`、`destination_path`、`link_placement`；不发送链接文字、查询参数或片段。

自测排除：打开正式站 `/?analytics=off`，当前浏览器后续访问将停止加载 GA。每个浏览器/设备需分别设置。恢复为正常访客：`/?analytics=on`，仍需用户允许统计。`?analytics=debug` 仅供明确需要向 GA4 DebugView 发送测试事件时使用，事件标记 `debug_mode` 和 `traffic_type=internal`；完成后立即恢复排除模式。不要把 debug 事件当真实用户访问。

`npm run test:analytics` 验证 consent、正式域名限制、测试访问排除、事件去重、参数去敏和撤回后的停止收集。`CHECK_ORIGIN=https://your-domain CHECK_REPORT=/tmp/crawl.json node scripts/check-live.mjs` 复查全部公开页面、canonical、内链、锚点、sitemap 和真实 404。

统计口径：从此版本起仅计同意统计且未被排除的访问，不能直接拿改版前后的原始 PV 涨跌判断搜索增长。GA4 按页面路径比较完整 7 天（不足则延长），GSC 独立看同一 URL/查询的展示、点击、CTR 与抓取时间。GA4 中的 Internal Traffic 过滤器仍在 Testing，源头排除是日常维护的主要方式；不根据共享代理 IP 直接开启永久过滤。
