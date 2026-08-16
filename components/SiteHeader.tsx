import Link from "@/components/InternalLink";

const navigation = [
  ["Wiki", "/wiki"],
  ["Walkthrough", "/walkthrough"],
  ["Endings", "/endings"],
  ["Characters", "/characters"],
  ["Puzzles", "/puzzles"],
  ["Bosses", "/bosses"],
];

export function SiteHeader() {
  return (
    <header className="site-header">
      <div className="header-inner section-shell">
        <Link className="brand" href="/" aria-label="Endacopia Guide home">
          <span className="brand-eye" aria-hidden="true"><i /></span>
          <span><b>ENDACOPIA</b><small>FIELD GUIDE</small></span>
        </Link>
        <nav className="desktop-nav" aria-label="Primary navigation">
          {navigation.map(([label, href]) => <Link href={href} key={href}>{label}</Link>)}
        </nav>
        <div className="language-status" title="English edition">
          <span>EN</span><i aria-hidden="true" />
        </div>
        <details className="mobile-menu">
          <summary aria-label="Open navigation"><span /><span /><span /></summary>
          <nav aria-label="Mobile navigation">
            {navigation.map(([label, href]) => <Link href={href} key={href}>{label}</Link>)}
          </nav>
        </details>
      </div>
    </header>
  );
}
