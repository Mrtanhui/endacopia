import Script from "next/script";
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
  const isWiki = (guide.originalSlug ?? guide.slug) === "wiki";
  const gated = !isWiki;
  const anchorPrefix = gated ? "guide-section-" : "";
  // Public fragment IDs sit outside details so browser navigation cannot reveal answers.
  const sectionLinks = [
    ...(gated ? getHeadings(guide.body, true).map(heading => ({ id: heading.id, target: `${anchorPrefix}${heading.id}` })) : []),
    ...(guide.anchorAliases ?? []).map(alias => ({ id: alias.id, target: `${anchorPrefix}${alias.target}` })),
    ...(gated && guide.checklist ? [{ id: `${guide.checklist.id}-checklist`, target: `${anchorPrefix}${guide.checklist.id}-checklist` }] : []),
  ];
  const categoryRoute = site.navigation.find(([label]) => label.toLowerCase() === guide.category.toLowerCase());
  const parent = categoryRoute && categoryRoute[1] !== `/${guide.slug}`
    ? { name: categoryLabel(guide.category), path: local(categoryRoute[1]) }
    : isWiki ? null : { name: "Wiki", path: local("/wiki") };
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

  const contents = <>
    {guide.quickAnswer && <section className="quick-answer" aria-label="Quick answer"><p>{t("QUICK ANSWER", "直接答案")}</p><strong>{guide.quickAnswer}</strong></section>}
    {guide.taskLinks && <nav className="task-links" aria-label="Choose your next step">{guide.taskLinks.map((task) => <a key={task.anchor} href={`#${task.anchor}`}>{task.label}<span aria-hidden="true"> ↓</span></a>)}</nav>}
    <div className="article-layout">
      <aside className="article-sidebar">
        <nav className="desktop-toc" aria-label="Table of contents"><p className="sidebar-title">{t("ON THIS PAGE", "本页目录")}</p>{headings.map((heading, index) => <a href={`#${heading.id}`} key={heading.id}><span>{String(index + 1).padStart(2, "0")}</span>{heading.text}</a>)}</nav>
        <details className="article-toc"><summary className="sidebar-title">{t("ON THIS PAGE", "本页目录")}</summary><nav aria-label="Mobile table of contents">{headings.map((heading, index) => <a href={`#${heading.id}`} key={heading.id}><span>{String(index + 1).padStart(2, "0")}</span>{heading.text}</a>)}</nav></details>
      </aside>
      <article className="article-body">
        {guide.checklist && <nav className="collection-shortcuts" aria-label="Collection shortcuts"><a href={`#${guide.checklist.id}-checklist`}>{t("18-fish checklist", "18 种鱼收集清单")}</a><a href="#use-the-key-on-the-hidden-window-lock">{t("Use the key", "使用钥匙")}</a><a href="#if-a-step-does-not-work">{t("Troubleshooting", "问题排查")}</a></nav>}
        {isWiki && <><GuideDirectory language={zh ? "zh" : "en"} /><WikiNavigator language={zh ? "zh" : "en"} /></>}
        <MdxContent body={guide.body} checklist={guide.checklist} language={zh ? "zh" : "en"} anchorPrefix={anchorPrefix} />
        <div className="guide-correction inline-correction"><h3>{t("Did a step fail in your game?", "某一步没有成功？")}</h3><p>{t("Tell us the step, game version and what happened. A GitHub account is needed to submit a correction.", "请提供步骤、游戏版本和实际结果。提交纠错需要 GitHub 账号。")}</p><a href={correction.toString()} rel="noreferrer" target="_blank">{t("Report this step on GitHub ↗", "到 GitHub 提交这一步的纠错 ↗")}</a></div>
        <a className="back-to-top" href="#main-content">{t("Back to top ↑", "返回顶部 ↑")}</a>
      </article>
    </div>
    {related.length > 0 && <section className="related" aria-labelledby="related-title"><h2 id="related-title">{t("Related guides", "相关攻略")}</h2><div className="guide-grid">{related.map(item => <GuideCard guide={item} key={item.slug} />)}</div></section>}
  </>;

  return <div data-guide-reveal>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema).replace(/</g, "\\u003c") }} />
    <section className="article-hero section-shell">
      <nav className="breadcrumbs" aria-label="Breadcrumb">{crumbs.map((crumb, i) => <span className="breadcrumb-item" key={crumb.path}>{i > 0 && <span aria-hidden="true">/</span>}{i === crumbs.length - 1 ? <span aria-current="page">{crumb.name}</span> : <Link href={crumb.path}>{crumb.name}</Link>}</span>)}</nav>
      <div className="article-title-row"><div><p className="eyebrow">{guide.category} · {guide.readTime}</p><h1>{guide.title}</h1><p className="article-description">{guide.description}</p></div><div className="article-stamp"><span>{t("PAGE UPDATED", "页面更新")}</span><b>{guide.updated}</b></div></div>
      <p className="guide-byline">{t("Maintained by", "维护者")} <a href={site.maintainer.profileUrl} rel="noreferrer" target="_blank">{site.maintainer.name}</a> · <a href="#guide-sources">{t("Sources & corrections", "来源与纠错")}</a></p>
      {guide.review && <dl className="guide-review" aria-label="Guide evidence">
        <div><dt>{t("Evidence", "资料依据")}</dt><dd>{guide.review.method}</dd></div>
        <div><dt>{t("Playtest status", "实机验证")}</dt><dd>{guide.review.playtest}</dd></div>
        <div><dt>{t("Version / platform", "版本与平台")}</dt><dd>{guide.review.version}</dd></div>
      </dl>}
    </section>
    <div className="section-shell guide-reading">
      {sectionLinks.map(link => <span key={link.id} id={link.id} data-anchor-target={link.target} className="anchor-alias" aria-hidden="true" />)}
      {gated && <section className="guide-help" aria-labelledby="guide-help-title">
        <p className="eyebrow">{t("Choose your level of help", "选择提示程度")}</p><h2 id="guide-help-title">{t("How much would you like to reveal?", "你想看到多少提示？")}</h2>
        <p>{t("The full guide includes solutions, screenshots and later discoveries. Open only what you need.", "完整攻略包含答案、截图和后续发现，请按需展开。")}</p>
        {guide.hints && <div className="hint-panels"><details data-guide-panel className="hint-panel"><summary>{t("Give me a small hint", "给我一点提示")}</summary><p>{guide.hints.gentle}</p></details><details data-guide-panel className="hint-panel"><summary>{t("Give me a more specific hint", "给我更具体的提示")}</summary><p>{guide.hints.detailed}</p></details></div>}
      </section>}
      <div className="linked-section-notice" data-linked-notice hidden role="status"><p>{t("Your link points to a section inside a closed guide. Reveal that section to continue; it may contain spoilers.", "链接指向尚未展开的内容。继续查看可能包含剧透。")}</p><button type="button" className="button button-primary" data-reveal-linked>{t("Reveal linked section", "展开链接章节")}</button></div>
      {gated ? <details id="full-guide" className="full-guide" data-guide-panel><summary><span>{t("Reveal the full guide", "展开完整攻略")}</span><small>{t("Solutions, images and section directory · spoilers", "答案、图片与目录 · 包含剧透")}</small></summary><div className="full-guide-content">{contents}</div></details> : <div className="open-guide">{contents}</div>}
      <details className="source-disclosure" id="guide-sources" data-guide-panel>
        <summary>{t("Sources, review notes & corrections", "来源、核对说明与纠错")}<small>{t("Source titles may name discoveries", "来源标题可能包含剧透")}</small></summary>
        <section className="source-panel">
          <h2>{t("What this guide is based on", "本攻略的资料依据")}</h2>
          <p>{t("Official sources support game information; credited community walkthroughs support route details. We use AI assistance for drafting and organization. Source review is not a first-hand playtest.", "基本信息参考官方资料，路线参考署名社区攻略；使用 AI 辅助起草与整理。资料核对不等于亲自游玩验证。")}</p>
          {guide.scope && <p className="guide-scope">{guide.scope}</p>}
          {guide.reviewNote && <p className="guide-scope">{zh ? guide.reviewNoteZh ?? guide.reviewNote : guide.reviewNote}</p>}
          <ol>{guide.sources.map(source => <li key={source.url}><a href={source.url} rel="noreferrer" target="_blank">{source.label} ↗</a></li>)}</ol>
          <div className="guide-correction"><h3>{t("Does your game behave differently?", "游戏表现与攻略不同？")}</h3><p>{t("Include the heading, game version, platform and what happened. Source review does not mean every route was replayed on every build.", "请提供小节、游戏版本、平台和实际结果。资料核对不代表在所有版本中重玩了每条路线。")}</p><a href={correction.toString()} target="_blank" rel="noreferrer">{t("Report a correction on GitHub ↗", "到 GitHub 提交纠错 ↗")}</a><p>{t("Opens a public issue draft for you to review and submit. A GitHub account is needed.", "打开公开议题草稿，由你确认后提交，需要 GitHub 账号。")} <Link href="/contact">{t("Contact details", "联系方式")}</Link></p></div>
        </section>
      </details>
    </div>
    <Script src="/guide-reveal.js" strategy="afterInteractive" />
  </div>;
}

function WikiNavigator({ language = "en" }: { language?: "en" | "zh" }) {
  const guides = getGuides(language).filter(guide => (guide.originalSlug ?? guide.slug) !== "wiki");
  const groups = categoryOrder.filter(category => guides.some(guide => guide.category === category));
  return <section className="wiki-navigator" aria-labelledby="wiki-directory-title"><h2 id="wiki-directory-title">{language === "zh" ? `${site.gameName} 全部攻略` : `Browse ${site.gameName} guides by topic`}</h2><div className="wiki-groups">{groups.map(group => <div key={group}><h3>{categoryLabel(group)}</h3>{guides.filter(guide => guide.category === group).map(guide => <Link href={`/${guide.slug}`} key={guide.slug}>{guide.title}<span>→</span></Link>)}</div>)}</div></section>;
}
