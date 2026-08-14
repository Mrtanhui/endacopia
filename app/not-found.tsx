import Link from "next/link";

export default function NotFound() {
  return (
    <section className="not-found section-shell">
      <p className="eyebrow">Signal lost · 404</p>
      <h1>This route is not in the guide.</h1>
      <p>The page may be unpublished, renamed, or outside the areas we have verified.</p>
      <div className="button-row"><Link className="button button-primary" href="/wiki">Open the wiki</Link><Link className="button button-quiet" href="/">Return home</Link></div>
    </section>
  );
}
