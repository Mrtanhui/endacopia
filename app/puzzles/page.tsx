import type { Metadata } from "next";
import Link from "@/components/InternalLink";
import { GuideCard } from "@/components/GuideCard";
import { getGuides } from "@/lib/guides";

export const metadata: Metadata = {
  title: "Endacopia Puzzle Solutions",
  description: "Direct, source-checked answers for Endacopia's key, projector, clown, password, switch, soccer ball, and blue inflatable man puzzles.",
  alternates: { canonical: "/puzzles" },
};

export default function PuzzlesPage() {
  const puzzles = getGuides().filter((guide) => guide.category === "Puzzles");
  return (
    <>
      <section className="listing-hero section-shell">
        <nav className="breadcrumbs"><Link href="/">Home</Link><span>/</span><Link href="/wiki">Wiki</Link><span>/</span><span>Puzzles</span></nav>
        <p className="eyebrow">Focused answers</p>
        <h1>Endacopia puzzle solutions</h1>
        <p>Choose the scene that has you stuck. Every answer begins with the shortest verified route, then explains the item chain or timing behind it.</p>
      </section>
      <section className="section-shell section-pad listing-grid">
        {puzzles.map((guide) => <GuideCard guide={guide} key={guide.slug} />)}
        <article className="deferred-card">
          <span>KEY CHECK</span>
          <h2>Which Endacopia key are you missing?</h2>
          <p>The Old or Lost Key belongs to the Ending C fishing route. The Core Key comes from the Office plant, Wrench, and water-cooler chain.</p>
          <Link href="/puzzles/old-key">Find the Old Key →</Link>
          <Link href="/puzzles/core-key">Find the Core Key →</Link>
        </article>
      </section>
    </>
  );
}
