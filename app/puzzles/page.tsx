import site from "@/config/site.json";
import type { Metadata } from "next";
import Link from "@/components/InternalLink";
import { GuideCard } from "@/components/GuideCard";
import { getGuides } from "@/lib/guides";

export const metadata: Metadata = {
  title: site.puzzles.title,
  description: site.puzzles.description,
  alternates: { canonical: "/puzzles" },
};

export default function PuzzlesPage() {
  const puzzles = getGuides().filter((guide) => guide.category === "Puzzles");
  return (
    <>
      <section className="listing-hero section-shell">
        <nav className="breadcrumbs"><Link href="/">Home</Link><span>/</span><Link href="/wiki">Wiki</Link><span>/</span><span>Puzzles</span></nav>
        <p className="eyebrow">Focused answers</p>
        <h1>{site.puzzles.heading}</h1>
        <p>{site.puzzles.intro}</p>
      </section>
      <section className="section-shell section-pad listing-grid">
        {puzzles.map((guide) => <GuideCard guide={guide} key={guide.slug} />)}
        {site.puzzles.callout.links.length > 0 && <article className="deferred-card">
          <span>{site.puzzles.callout.label}</span>
          <h2>{site.puzzles.callout.title}</h2>
          <p>{site.puzzles.callout.description}</p>
          {site.puzzles.callout.links.map(([label, href]) => <Link key={href} href={href}>{label} →</Link>)}
        </article>}

      </section>
    </>
  );
}
