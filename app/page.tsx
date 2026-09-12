import type { Metadata } from "next";
import Link from "@/components/InternalLink";
import { GuideCard } from "@/components/GuideCard";
import { getGuides } from "@/lib/guides";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

const stats = [
  ["Released", "Jul 27, 2026"],
  ["Creator", "Andyland"],
  ["Achievements", "16"],
  ["Steam Deck", "Playable"],
];

const starts = [
  {
    number: "01",
    title: "Complete walkthrough",
    description: "Follow the prologue and three chapters, with key items and route warnings called out before they cost you time.",
    href: "/walkthrough",
    label: "Start the route",
  },
  {
    number: "02",
    title: "Endings",
    description: "Compare the main outcomes without spoilers first, then open the exact route you want when you are ready.",
    href: "/endings",
    label: "Choose an ending",
  },
  {
    number: "03",
    title: "Characters",
    description: "Meet Mellow and the strange residents of the House, Misery Town, Timesville, and the Office.",
    href: "/characters",
    label: "Open the index",
  },
  {
    number: "04",
    title: "Puzzle solutions",
    description: "Get focused help for the clown room, blue inflatable man, password, soccer ball, and switch puzzle.",
    href: "/puzzles",
    label: "Solve a puzzle",
  },
];

const categories = [
  ["Routes", "Walkthrough & endings", "Move through the game in order, then branch only when a decision matters.", "/walkthrough"],
  ["People", "Characters", "A spoiler-aware directory of allies, antagonists, bosses, and uncertain faces.", "/characters"],
  ["Answers", "Puzzle solutions", "Short, direct fixes for the questions players search while they are stuck.", "/puzzles"],
  ["Combat", "Boss archive", "Main bosses, optional encounters, pacifist options, and achievement links.", "/bosses"],
];

export default function Home() {
  const featured = getGuides()
    .filter((guide) => ["guide/secrets", "guide/achievements", "endings/ending-c"].includes(guide.slug))
    .slice(0, 3);
  const prioritySlugs = ["guide/secrets", "puzzles/old-key", "puzzles/projector-remote", "endings/ending-c"];
  const priorityGuides = prioritySlugs.flatMap((slug) => getGuides().filter((guide) => guide.slug === slug));

  return (
    <>
      <section className="hero section-shell">
        <div className="hero-copy">
          <p className="eyebrow"><span className="pulse" /> Independent game guide · v0.1</p>
          <h1>Find your way through <span>Endacopia</span></h1>
          <p className="hero-lead">
            A precise, spoiler-aware field guide for Mellow&apos;s surreal adventure—built around the question you have now, not a wall of lore.
          </p>
          <div className="button-row">
            <Link className="button button-primary" href="/walkthrough">Start the walkthrough <span aria-hidden="true">→</span></Link>
            <Link className="button button-quiet" href="/wiki">Browse the wiki</Link>
          </div>
          <dl className="hero-stats">
            {stats.map(([label, value]) => (
              <div key={label}>
                <dt>{label}</dt>
                <dd>{value}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="hero-console" aria-label="Guide coverage overview">
          <div className="console-bar">
            <span>GUARDIAN_LINK</span>
            <span className="console-dots" aria-hidden="true"><i /><i /><i /></span>
          </div>
          <div className="eye-mark" aria-hidden="true"><span /></div>
          <p className="console-kicker">CURRENT OBJECTIVE</p>
          <p className="console-objective">Help Mellow recover what is missing and find a place to call home.</p>
          <div className="signal-grid" aria-hidden="true">
            <span>HOUSE</span><b>ONLINE</b>
            <span>MISERY TOWN</span><b>INDEXED</b>
            <span>TIMESVILLE</span><b>INDEXED</b>
            <span>THE OFFICE</span><b>INDEXED</b>
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
          {starts.map((item) => (
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
            {categories.map(([eyebrow, title, description, href], index) => (
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
          <p className="eyebrow">Something is wrong underneath</p>
          <h2>A childhood computer adventure with a darker signal</h2>
          <p className="about-lead">
            Endacopia is a surreal point-and-click puzzle adventure presented through Mellow, a lost boy guided by the player as his Guardian Angel.
          </p>
          <p>
            Its early-computer edutainment look hides abstract puzzles, unsettling characters, first-person fights, optional minigames, collectible tools, and secrets that reward careful exploration.
          </p>
          <ul className="feature-list">
            <li>Explore major areas in a flexible order</li>
            <li>Solve environmental and inventory puzzles</li>
            <li>Fight—or avoid—several important bosses</li>
            <li>Unlock multiple endings and 16 achievements</li>
          </ul>
          <a className="button button-quiet" href="https://www.youtube.com/watch?v=_wJsmY8huvk" rel="noreferrer" target="_blank">Watch the official trailer ↗</a>
        </div>
        <aside className="game-file">
          <p>FILE / ENDACOPIA.EXE</p>
          <dl>
            <div><dt>Developer</dt><dd>Andyland</dd></div>
            <div><dt>Platform</dt><dd>Windows · Steam</dd></div>
            <div><dt>Genre</dt><dd>Puzzle adventure</dd></div>
            <div><dt>Players</dt><dd>Single-player</dd></div>
            <div><dt>Language</dt><dd>English</dd></div>
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
          <p className="eyebrow">Guardian Angel, connected</p>
          <h2>Ready to help Mellow find a way home?</h2>
          <p>Begin with the full route, or jump straight to the exact character, boss, ending, or puzzle that brought you here.</p>
        </div>
        <div className="button-row">
          <Link className="button button-primary" href="/walkthrough">Open walkthrough →</Link>
          <Link className="button button-quiet" href="/wiki">View all guides</Link>
        </div>
      </section>
    </>
  );
}
