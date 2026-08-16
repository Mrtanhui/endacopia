import Link from "@/components/InternalLink";
import { GuideCard } from "@/components/GuideCard";
import { getHeadings, MdxContent } from "@/components/MdxContent";
import { categoryLabel, getGuides, type Guide } from "@/lib/guides";

export function ArticlePage({ guide }: { guide: Guide }) {
  const headings = getHeadings(guide.body);
  const related = getGuides()
    .filter((item) => item.category === guide.category && item.slug !== guide.slug)
    .slice(0, 3);

  return (
    <>
      <section className="article-hero section-shell">
        <nav className="breadcrumbs" aria-label="Breadcrumb">
          <Link href="/">Home</Link><span>/</span><Link href="/wiki">Wiki</Link><span>/</span><span>{categoryLabel(guide.category)}</span>
        </nav>
        <div className="article-title-row">
          <div>
            <p className="eyebrow">{guide.category} · {guide.readTime}</p>
            <h1>{guide.title}</h1>
            <p className="article-description">{guide.description}</p>
          </div>
          <div className="article-stamp"><span>RESEARCHED</span><b>{guide.updated}</b></div>
        </div>
        {guide.spoiler && <div className="spoiler-warning"><strong>Spoiler warning</strong><span>This guide discusses story events, routes, or character identities. Continue when you are ready.</span></div>}
      </section>

      <div className="article-layout section-shell">
        <aside className="article-sidebar">
          <p className="sidebar-title">ON THIS PAGE</p>
          <nav aria-label="Table of contents">
            {headings.map((heading, index) => <a href={`#${heading.id}`} key={heading.id}><span>0{index + 1}</span>{heading.text}</a>)}
          </nav>
          <div className="sidebar-meta">
            <span>Target query</span>
            <strong>{guide.keyword}</strong>
            <span>Last checked</span>
            <strong>{guide.updated}</strong>
          </div>
        </aside>

        <article className="article-body">
          {guide.quickAnswer && (
            <section className="quick-answer">
              <p>QUICK ANSWER</p>
              <strong>{guide.quickAnswer}</strong>
            </section>
          )}
          {guide.slug === "wiki" && <WikiNavigator />}
          <MdxContent body={guide.body} />
          <section className="source-panel">
            <p className="eyebrow">Sources used</p>
            <h2>Where this guide was checked</h2>
            <p>Facts are rewritten and organized for this guide. Official sources are preferred for game data; community guides are used for route details.</p>
            <ol>
              {guide.sources.map((source) => <li key={source.url}><a href={source.url} rel="noreferrer" target="_blank">{source.label} ↗</a></li>)}
            </ol>
          </section>
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
  const groups = ["Walkthrough", "Endings", "Characters", "Puzzles", "Bosses"] as const;
  return (
    <section className="wiki-navigator" aria-labelledby="wiki-directory-title">
      <p className="eyebrow">Directory</p>
      <h2 id="wiki-directory-title">All published Endacopia guides</h2>
      <div className="wiki-groups">
        {groups.map((group) => (
          <div key={group}>
            <h3>{group}</h3>
            {guides.filter((guide) => guide.category === group).map((guide) => <Link href={`/${guide.slug}`} key={guide.slug}>{guide.title}<span>→</span></Link>)}
          </div>
        ))}
      </div>
    </section>
  );
}
