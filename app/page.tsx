import site from "@/config/site.json";
import home from "@/content/home.json";
import type { Metadata } from "next";
import Link from "@/components/InternalLink";
import { GuideCard } from "@/components/GuideCard";
import { getGuides } from "@/lib/guides";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};







export default function Home() {
  const featured = home.featuredSlugs.flatMap((slug) => getGuides().filter((guide) => guide.slug === slug));
  const priorityGuides = home.prioritySlugs.flatMap((slug) => getGuides().filter((guide) => guide.slug === slug));

  return (
    <>
      <section className="hero section-shell">
        <div className="hero-copy">
          <p className="eyebrow"><span className="pulse" /> Independent game guide · v0.1</p>
          <h1>Find your way through <span>{site.gameName}</span></h1>
          <p className="hero-lead">
            {home.heroLead}
          </p>
          <div className="button-row">
            <Link className="button button-primary" href={home.primaryLink.href}>{home.primaryLink.label} <span aria-hidden="true">→</span></Link>
            <Link className="button button-quiet" href="/wiki">Browse the wiki</Link>
          </div>
          <dl className="hero-stats">
            {home.stats.map(([label, value]) => (
              <div key={label}>
                <dt>{label}</dt>
                <dd>{value}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="hero-console" aria-label="Guide coverage overview">
          <div className="console-bar">
            <span>{home.consoleName}</span>
            <span className="console-dots" aria-hidden="true"><i /><i /><i /></span>
          </div>
          <div className="eye-mark" aria-hidden="true"><span /></div>
          <p className="console-kicker">CURRENT OBJECTIVE</p>
          <p className="console-objective">{home.objective}</p>
          <div className="signal-grid" aria-hidden="true">
            {home.areas.map(([name, status]) => <div className="signal-row" key={name}><span>{name}</span><b>{status}</b></div>)}
          </div>
        </div>
      </section>

      <section className="section-shell section-pad" aria-labelledby="stuck-title">
        <div className="section-heading"><p className="eyebrow">Stuck on a secret?</p><h2 id="stuck-title">Find the missing step</h2></div>
        <div className="guide-grid">{priorityGuides.map((guide) => <GuideCard guide={guide} key={guide.slug} />)}</div>
      </section>

      <section className="start-section section-shell section-pad">
        <div className="section-heading split-heading">
          <div>
            <p className="eyebrow">Start here</p>
            <h2>Choose your next move</h2>
          </div>
          <p>Four ways into the guide. Each route brings you back to the larger map when you need more context.</p>
        </div>
        <div className="start-grid">
          {home.starts.map((item) => (
            <Link className="start-card" href={item.href} key={item.number}>
              <span className="card-number">{item.number}</span>
              <h3>{item.title}</h3>
              <p>{item.description}</p>
              <span className="text-link">{item.label} →</span>
            </Link>
          ))}
        </div>
      </section>

      <section className="archive-section section-pad">
        <div className="section-shell">
          <div className="section-heading split-heading">
            <div>
              <p className="eyebrow">Guide archive</p>
              <h2>Search by intent, not by accident</h2>
            </div>
            <Link className="text-link header-link" href="/wiki">View every published guide →</Link>
          </div>
          <div className="category-grid">
            {home.categories.map(([eyebrow, title, description, href], index) => (
              <Link className="category-card" href={href} key={title}>
                <span>0{index + 1} / {eyebrow}</span>
                <h3>{title}</h3>
                <p>{description}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="about-section section-shell section-pad">
        <div className="about-label">
          <span className="vertical-word">ABOUT THE GAME</span>
        </div>
        <div className="about-copy">
          <p className="eyebrow">{home.about.eyebrow}</p>
          <h2>{home.about.title}</h2>
          <p className="about-lead">
            {home.about.lead}
          </p>
          <p>
            {home.about.description}
          </p>
          <ul className="feature-list">
            {home.about.features.map((feature) => <li key={feature}>{feature}</li>)}
          </ul>
          <a className="button button-quiet" href={home.about.trailer} rel="noreferrer" target="_blank">Watch the official trailer ↗</a>
        </div>
        <aside className="game-file">
          <p>FILE / {home.about.fileLabel}</p>
          <dl>
            {home.about.facts.map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}
          </dl>
        </aside>
      </section>

      <section className="featured-section section-shell section-pad">
        <div className="section-heading split-heading">
          <div>
            <p className="eyebrow">Frequently needed</p>
            <h2>Guides worth bookmarking</h2>
          </div>
          <p>These pages cover the routes and missable details that are hardest to reconstruct after the fact.</p>
        </div>
        <div className="guide-grid">
          {featured.map((guide) => <GuideCard guide={guide} key={guide.slug} />)}
        </div>
      </section>

      <section className="final-cta section-shell">
        <div>
          <p className="eyebrow">{home.cta.eyebrow}</p>
          <h2>{home.cta.title}</h2>
          <p>Begin with the full route, or jump straight to the exact character, boss, ending, or puzzle that brought you here.</p>
        </div>
        <div className="button-row">
          <Link className="button button-primary" href={home.primaryLink.href}>{home.primaryLink.label} →</Link>
          <Link className="button button-quiet" href="/wiki">View all guides</Link>
        </div>
      </section>
    </>
  );
}
