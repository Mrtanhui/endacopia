import Link from "@/components/InternalLink";

import site from "@/config/site.json";

const navigation = site.navigation;

export function SiteHeader() {
  return (
    <header className="site-header">
      <div className="header-inner section-shell">
        <Link className="brand" href="/" aria-label={`${site.siteName} home`}>
          <span className="brand-eye" aria-hidden="true"><i /></span>
          <span><b>{site.gameName.toUpperCase()}</b><small>{site.brandSubtitle}</small></span>
        </Link>
        <nav className="desktop-nav" aria-label="Primary navigation">
          {navigation.map(([label, href]) => <Link href={href} key={href}>{label}</Link>)}
        </nav>
        <div className="language-status" title={site.languageLabel}>
          <span>{site.languageCode}</span><i aria-hidden="true" />
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
