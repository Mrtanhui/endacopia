import site from "@/config/site.json";
import Link from "@/components/InternalLink";
import { GuideCard } from "@/components/GuideCard";
import { getHeadings, MdxContent } from "@/components/MdxContent";
import { categoryLabel, categoryOrder, getGuides, type Guide } from "@/lib/guides";
import { absoluteUrl } from "@/lib/site-url";
import { GuideDirectory } from "@/components/GuideDirectory";

export function ArticlePage({ guide }: { guide: Guide }) {
  const zh = guide.language === "zh";
  const local = (path: string) => zh ? `/zh${path === "/" ? "" : path}` : path;
  const t = (en: string, cn: string) => zh ? cn : en;
  const headings = getHeadings(guide.body);
  const guides = getGuides(zh ? "zh" : "en");
  const categoryRoute = site.navigation.find(([label]) => label.toLowerCase() === guide.category.toLowerCase());
  const parent = categoryRoute && categoryRoute[1] !== `/${guide.slug}`
    ? { name: categoryLabel(guide.category), path: local(categoryRoute[1]) }
    : (guide.originalSlug ?? guide.slug) === "wiki" ? null : { name: "Wiki", path: local("/wiki") };
  const crumbs = [{ name: t("Home", "首页"), path: local("/") }, ...(parent ? [parent] : []), { name: guide.title, path: `/${guide.slug}` }];
  const correction = new URL(`${site.maintainer.issuesUrl}/new`);
  correction.searchParams.set("title", `Guide correction: ${guide.title}`);
  correction.searchParams.set("body", `Page: ${absoluteUrl(`/${guide.slug}`)}\nGuide updated: ${guide.updated}\n\nGame version / platform:\nStep or heading:\nWhat happened:\nSuggested correction and source:\n\nPlease do not include personal information or save files in this public issue.`);
  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      { "@type": "Article", "@id": `${absoluteUrl(`/${guide.slug}`)}#article`, headline: guide.title, description: guide.description,
        mainEntityOfPage: absoluteUrl(`/${guide.slug}`), image: [absoluteUrl(site.socialImage)], inLanguage: zh ? "zh-Hans" : site.language,
        dateModified: new Date(guide.updated).toISOString().slice(0, 10),
        author: { "@type": "Person", name: site.maintainer.name, url: site.maintainer.profileUrl },
        publisher: { "@type": "Organization", name: site.siteName, url: absoluteUrl() } },
      { "@type": "BreadcrumbList", itemListElement: crumbs.map((crumb, i) => ({ "@type": "ListItem", position: i + 1, name: crumb.name, item: absoluteUrl(crumb.path) })) },
    ],
  };
  const related = guide.relatedSlugs
    ? guide.relatedSlugs.flatMap((slug) => guides.filter((item) => item.slug === slug && item.slug !== guide.slug))
    : guides.filter((item) => item.category === guide.category && item.slug !== guide.slug).slice(0, 3);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema).replace(/</g, "\\u003c") }} />
      <section className="article-hero section-shell">
        <nav className="breadcrumbs" aria-label="Breadcrumb">
          {crumbs.map((crumb, i) => <span className="breadcrumb-item" key={crumb.path}>{i > 0 && <span aria-hidden="true">/</span>}{i === crumbs.length - 1 ? <span aria-current="page">{crumb.name}</span> : <Link href={crumb.path}>{crumb.name}</Link>}</span>)}
        </nav>
        <div className="article-title-row">
          <div>
            <p className="eyebrow">{guide.category} · {guide.readTime}</p>
            <h1>{guide.title}</h1>
            <p className="article-description">{guide.description}</p>
          </div>
          <div className="article-stamp"><span>{t("UPDATED", "更新日期")}</span><b>{guide.updated}</b></div>
        </div>
        {guide.spoiler && <div className="spoiler-warning"><strong>{t("Spoilers ahead", "剧透提示")}</strong><span>{t("Steps below reveal puzzle solutions and route details.", "以下内容包含谜题解法与路线细节。")}</span></div>}
        {guide.quickAnswer && <section className="quick-answer" aria-label="Quick answer"><p>{t("QUICK ANSWER", "直接答案")}</p><strong>{guide.quickAnswer}</strong></section>}
        {guide.scope && <p className="guide-scope">{guide.scope}</p>}
        <p className="guide-language"><Link href={zh ? `/${guide.originalSlug}` : `/zh/${guide.slug}`} hrefLang={zh ? "en" : "zh-Hans"}>{zh ? "Read in English" : "简体中文"}</Link></p>
        <p className="guide-byline">{t("Maintained by", "维护者")} <a href={site.maintainer.profileUrl} rel="noreferrer" target="_blank">{site.maintainer.name}</a> · <a href="#guide-sources">{t("Sources & corrections", "来源与纠错")}</a></p>
        {guide.taskLinks && <nav className="task-links" aria-label="Choose your next step">{guide.taskLinks.map((task) => <a key={task.anchor} href={`#${task.anchor}`}>{task.label}<span aria-hidden="true"> ↓</span></a>)}</nav>}
      </section>

      <div className="article-layout section-shell">
        <aside className="article-sidebar">
          <nav className="desktop-toc" aria-label="Table of contents">
            <p className="sidebar-title">{t("ON THIS PAGE", "本页目录")}</p>
            {headings.map((heading, index) => <a href={`#${heading.id}`} key={heading.id}><span>{String(index + 1).padStart(2, "0")}</span>{heading.text}</a>)}
          </nav>
          <details className="article-toc">
          <summary className="sidebar-title">{t("ON THIS PAGE", "本页目录")}</summary>
          <nav aria-label="Mobile table of contents">
            {headings.map((heading, index) => <a href={`#${heading.id}`} key={heading.id}><span>{String(index + 1).padStart(2, "0")}</span>{heading.text}</a>)}
          </nav>
          </details>
        </aside>

        <article className="article-body">
          {guide.checklist && <nav className="collection-shortcuts" aria-label="Collection shortcuts"><a href={`#${guide.checklist.id}-checklist`}>{t("18-fish checklist", "18 种鱼收集清单")}</a><a href="#use-the-key-on-the-hidden-window-lock">{t("Use the key", "使用钥匙")}</a><a href="#if-a-step-does-not-work">{t("Troubleshooting", "问题排查")}</a></nav>}
          {(guide.originalSlug ?? guide.slug) === "wiki" && <><GuideDirectory language={zh ? "zh" : "en"} /><WikiNavigator language={zh ? "zh" : "en"} /></>}
          <MdxContent body={guide.body} checklist={guide.checklist} language={zh ? "zh" : "en"} />
          <section className="source-panel" id="guide-sources">
            <p className="eyebrow">{t("Sources used", "参考资料")}</p>
            <h2>{t("Where this guide was checked", "本攻略的核对来源")}</h2>
            <p>{t("Facts are rewritten and organized for this guide. Official sources are preferred for game data; community guides are used for route details.", "本攻略根据资料重新整理。游戏基本信息优先核对官方来源，路线细节参考署名社区攻略。中文物品名保留英文对照，方便匹配游戏界面。")}</p>
            {guide.reviewNote && <p className="guide-scope">{zh ? guide.reviewNoteZh ?? guide.reviewNote : guide.reviewNote}</p>}
            <ol>
              {guide.sources.map((source) => <li key={source.url}><a href={source.url} rel="noreferrer" target="_blank">{source.label} ↗</a></li>)}
            </ol>
            <div className="guide-correction"><h3>{t("Does your game behave differently?", "游戏表现与攻略不同？")}</h3><p>{t("Include the heading, game version, platform and what you expected. Source review does not mean every route was replayed on every build.", "请提供对应小节、游戏版本、平台和实际结果。资料核对不代表在所有版本中重玩了每条路线。")}</p><a href={correction.toString()} target="_blank" rel="noreferrer">{t("Report a correction on GitHub ↗", "到 GitHub 提交纠错 ↗")}</a><p>{t("Opens a draft public issue for you to review and submit. A GitHub account is needed.", "链接会打开公开议题草稿，由你确认后提交，需要 GitHub 账号。")} <Link href="/contact">{t("Contact details", "联系方式（英文）")}</Link></p></div>
          </section>
          <a className="back-to-top" href="#main-content">{t("Back to top ↑", "返回顶部 ↑")}</a>
        </article>
      </div>

      {related.length > 0 && (
        <section className="related section-shell section-pad">
          <div className="section-heading split-heading"><div><p className="eyebrow">{t("Keep exploring", "继续探索")}</p><h2>{t("Related guides", "相关攻略")}</h2></div></div>
          <div className="guide-grid">{related.map((item) => <GuideCard guide={item} key={item.slug} />)}</div>
        </section>
      )}
    </>
  );
}

function WikiNavigator({ language = "en" }: { language?: "en" | "zh" }) {
  const guides = getGuides(language).filter((guide) => (guide.originalSlug ?? guide.slug) !== "wiki");
  const groups = categoryOrder.filter((category) => guides.some((guide) => guide.category === category));
  return (
    <section className="wiki-navigator" aria-labelledby="wiki-directory-title">
      <p className="eyebrow">{language === "zh" ? "攻略目录" : "Directory"}</p>
      <h2 id="wiki-directory-title">{language === "zh" ? `${site.gameName} 全部已发布攻略` : `All published ${site.gameName} guides`}</h2>
      <div className="wiki-groups">
        {groups.map((group) => (
          <div key={group}>
            <h3>{categoryLabel(group)}</h3>
            {guides.filter((guide) => guide.category === group).map((guide) => <Link href={`/${guide.slug}`} key={guide.slug}>{guide.title}<span>→</span></Link>)}
          </div>
        ))}
      </div>
    </section>
  );
}
