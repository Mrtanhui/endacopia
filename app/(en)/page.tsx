import type { Metadata } from "next";
import Link from "@/components/InternalLink";
import site from "@/config/site.json";
import home from "@/content/home.json";

export const metadata: Metadata = { alternates: { canonical: "/" } };

export default function Home() {
  const officialGame = site.officialLinks[0];
  return <>
    <section className="hero guide-home-hero section-shell">
      <div className="hero-copy">
        <p className="eyebrow">Independent fan guide</p>
        <h1>{site.gameName}<span>hints and guides</span></h1>
        <p className="hero-lead">{home.heroLead}</p>
        <form action="/wiki#find-a-guide" method="get" role="search" className="home-search">
          <label htmlFor="home-query">What has you stuck?</label>
          <div><input id="home-query" name="q" type="search" placeholder="An item, puzzle or character…" maxLength={120} /><button type="submit" className="button button-primary">Find a guide →</button></div>
        </form>
        <nav className="home-fast-links" aria-label="Choose a guide topic">{site.navigation.filter(([, href]) => href !== "/wiki").slice(0, 4).map(([label, href]) => <Link href={href} key={href}>{label}</Link>)}</nav>
      </div>
      <aside className="help-preview" aria-labelledby="help-preview-title">
        <p className="eyebrow">You choose how much to reveal</p>
        <h2 id="help-preview-title">A nudge, or the whole answer.</h2>
        <ol>
          <li><span>01</span><div><h3>A small hint</h3><p>A direction to try, without the full sequence.</p></div></li>
          <li><span>02</span><div><h3>One section</h3><p>Open the step you need. Later answers stay closed.</p></div></li>
          <li><span>03</span><div><h3>All the steps</h3><p>Choose the full route when you are ready.</p></div></li>
        </ol>
        <p className="help-preview-note">Selected guides offer hints first. You can read every guide without an account.</p>
      </aside>
    </section>
    <section className="section-shell home-browse" id="browse-guides" aria-labelledby="browse-title">
      <span id="stuck-title" className="anchor-alias" aria-hidden="true" /><span id="quick-paths-title" className="anchor-alias" aria-hidden="true" />
      <div className="section-heading"><p className="eyebrow">Browse by topic</p><h2 id="browse-title">Find the help you need</h2><p>Guide titles name items and encounters. Choose a topic when you are ready to see its directory.</p></div>
      <div className="start-grid">{home.starts.map(item => <Link className="start-card" href={item.href} key={item.href}>
        <span className="card-number">{item.number}</span><h3>{item.title}</h3><p>{item.description}</p><span className="text-link">{item.label} →</span>
      </Link>)}</div>
      <p className="home-directory-link"><Link href="/wiki">Browse all guide titles →</Link></p>
    </section>
    <section className="section-shell home-game-intro" aria-labelledby="game-intro-title"><h2 id="game-intro-title">New to {site.gameName}?</h2><p>{home.about.lead} Start with the <Link href="/wiki">guide directory</Link>{officialGame && <>, or visit the <a href={officialGame[1]} target="_blank" rel="noreferrer">official {officialGame[0]} page ↗</a> for the game</>}.</p></section>
    <section className="section-shell home-editorial" aria-labelledby="editorial-title">
      <div><p className="eyebrow">About these guides</p><h2 id="editorial-title">Know what each answer is based on.</h2></div>
      <div><p>These guides organize official information and credited community walkthroughs, with AI assistance. Source review is separate from playing through a route ourselves.</p><p>Each guide explains its evidence and limitations. If a step behaves differently in your game, you can report the version and what happened.</p><Link className="text-link" href="/about">Read our source and correction policy →</Link></div>
    </section>
  </>;
}
