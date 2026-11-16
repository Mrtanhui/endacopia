import Link from "@/components/InternalLink";
import { GuideSearchForm } from "@/components/GuideSearchForm";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Page not found", description: "Find another guide by searching for an item, puzzle or character." };

export default function NotFound() {
  return (
    <section className="not-found section-shell">
      <p className="eyebrow">Signal lost · 404</p>
      <h1>This route is not in the guide.</h1>
      <p>We could not find this page. Search for the item or character you need, or choose a guide directory below.</p>
      <GuideSearchForm id="missing-page-query" label="Find another guide" />
      <nav className="button-row" aria-label="Guide directories"><Link className="button button-quiet" href="/walkthrough">Walkthrough</Link><Link className="button button-quiet" href="/puzzles">Puzzle guides</Link><Link className="button button-quiet" href="/">Return home</Link></nav>
    </section>
  );
}
