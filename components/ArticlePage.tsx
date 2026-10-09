import site from "@/config/site.json";
import Link from "@/components/InternalLink";
import { GuideCard } from "@/components/GuideCard";
import { getHeadings, MdxContent } from "@/components/MdxContent";
import { categoryLabel, categoryOrder, getGuides, type Guide } from "@/lib/guides";
import { absoluteUrl } from "@/lib/site-url";
import { GuideDirectory } from "@/components/GuideDirectory";

export function ArticlePage({ guide }: { guide: Guide }) {
  const headings = getHeadings(guide.body);
  const guides = getGuides();
  const categoryRoute = site.navigation.find(([label]) => label.toLowerCase() === guide.category.toLowerCase());
  const parent = categoryRoute && categoryRoute[1] !== `/${guide.slug}`
    ? { name: categoryLabel(guide.category), path: categoryRoute[1] }
    : guide.slug === "wiki" ? null : { name: "Wiki", path: "/wiki" };
  const crumbs = [{ name: "Home", path: "/" }, ...(parent ? [parent] : []), { name: guide.title, path: `/${guide.slug}` }];
  const correction = new URL(`${site.maintainer.issuesUrl}/new`);
  correction.searchParams.set("title", `Guide correction: ${guide.title}`);
  correction.searchParams.set("body", `Page: ${absoluteUrl(`/${guide.slug}`)}\nGuide updated: ${guide.updated}\n\nGame version / platform:\nStep or heading:\nWhat happened:\nSuggested correction and source:\n\nPlease do not include personal information or save files in this public issue.`);
  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      { "@type": "Article", "@id": `${absoluteUrl(`/${guide.slug}`)}#article`, headline: guide.title, description: guide.description,
        mainEntityOfPage: absoluteUrl(`/${guide.slug}`), image: [absoluteUrl(site.socialImage)], inLanguage: site.language,
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
          <div className="article-stamp"><span>UPDATED</span><b>{guide.updated}</b></div>
        </div>
        {guide.spoiler && <div className="spoiler-warning"><strong>Spoilers ahead</strong><span>Steps below reveal puzzle solutions and route details.</span></div>}
        {guide.quickAnswer && <section className="quick-answer" aria-label="Quick answer"><p>QUICK ANSWER</p><strong>{guide.quickAnswer}</strong></section>}
        {guide.scope && <p className="guide-scope">{guide.scope}</p>}
        <p className="guide-byline">Maintained by <a href={site.maintainer.profileUrl} rel="noreferrer" target="_blank">{site.maintainer.name}</a> · <a href="#guide-sources">Sources & corrections</a></p>
        {guide.taskLinks && <nav className="task-links" aria-label="Choose your next step">{guide.taskLinks.map((task) => <a key={task.anchor} href={`#${task.anchor}`}>{task.label}<span aria-hidden="true"> ↓</span></a>)}</nav>}
      </section>

      <div className="article-layout section-shell">
        <aside className="article-sidebar">
          <nav className="desktop-toc" aria-label="Table of contents">
            <p className="sidebar-title">ON THIS PAGE</p>
            {headings.map((heading, index) => <a href={`#${heading.id}`} key={heading.id}><span>{String(index + 1).padStart(2, "0")}</span>{heading.text}</a>)}
          </nav>
          <details className="article-toc">
          <summary className="sidebar-title">ON THIS PAGE</summary>
          <nav aria-label="Mobile table of contents">
            {headings.map((heading, index) => <a href={`#${heading.id}`} key={heading.id}><span>{String(index + 1).padStart(2, "0")}</span>{heading.text}</a>)}
          </nav>
          </details>
        </aside>

        <article className="article-body">
          {guide.checklist && <nav className="collection-shortcuts" aria-label="Collection shortcuts"><a href={`#${guide.checklist.id}-checklist`}>18-fish checklist</a><a href="#use-the-key-on-the-hidden-window-lock">Use the key</a><a href="#if-a-step-does-not-work">Troubleshooting</a></nav>}
          {guide.slug === "wiki" && <><GuideDirectory /><WikiNavigator /></>}
          <MdxContent body={guide.body} checklist={guide.checklist} />
          <section className="source-panel" id="guide-sources">
            <p className="eyebrow">Sources used</p>
            <h2>Where this guide was checked</h2>
            <p>Facts are rewritten and organized for this guide. Official sources are preferred for game data; community guides are used for route details.</p>
            <ol>
              {guide.sources.map((source) => <li key={source.url}><a href={source.url} rel="noreferrer" target="_blank">{source.label} ↗</a></li>)}
            </ol>
            <div className="guide-correction"><h3>Does your game behave differently?</h3><p>Include the heading, game version, platform and what you expected. Source review does not mean every route was replayed on every build.</p><a href={correction.toString()} target="_blank" rel="noreferrer">Report a correction on GitHub ↗</a><p>Opens a draft public issue for you to review and submit. A GitHub account is needed. <Link href="/contact">Contact details</Link></p></div>
          </section>
          <a className="back-to-top" href="#main-content">Back to top ↑</a>
        </article>
      </div>

      {related.length > 0 && (
        <section className="related section-shell section-pad">
          <div className="section-heading split-heading"><div><p className="eyebrow">Keep exploring</p><h2>Related guides</h2></div></div>
          <div className="guide-grid">{related.map((item) => <GuideCard guide={item} key={item.slug} />)}</div>
        </section>
      )}
    </>
  );
}

function WikiNavigator() {
  const guides = getGuides().filter((guide) => guide.slug !== "wiki");
  const groups = categoryOrder.filter((category) => guides.some((guide) => guide.category === category));
  return (
    <section className="wiki-navigator" aria-labelledby="wiki-directory-title">
      <p className="eyebrow">Directory</p>
      <h2 id="wiki-directory-title">All published {site.gameName} guides</h2>
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
