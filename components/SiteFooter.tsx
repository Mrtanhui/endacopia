import Link from "@/components/InternalLink";
import site from "@/config/site.json";
import { getGuides } from "@/lib/guides";

export function SiteFooter() {
  const guides = getGuides();
  const latest = guides.map((guide) => guide.updated).sort((a, b) => new Date(b).valueOf() - new Date(a).valueOf())[0];
  return (
    <footer className="site-footer">
      <div className="section-shell footer-grid">
        <div>
          <Link className="brand footer-brand" href="/">
            <span className="brand-eye" aria-hidden="true"><i /></span>
            <span><b>{site.gameName.toUpperCase()}</b><small>{site.brandSubtitle}</small></span>
          </Link>
          <p>{site.footerDescription}</p>
          <p className="disclaimer">{site.disclaimer}</p>
        </div>
        <div>
          <h2>Explore</h2>
          {site.navigation.map(([label, href]) => <Link key={href} href={href}>{label}</Link>)}
        </div>
        <div>
          <h2>Official links</h2>
          {site.officialLinks.map(([label, href]) => <a key={href} href={href} rel="noreferrer" target="_blank">{label} ↗</a>)}
        </div>
        <div className="footer-status">
          <span className="pulse" />
          <p>GUIDE STATUS</p>
          <strong>{guides.length} GUIDES ONLINE</strong>
          <small>Latest guide update: {latest}</small>
        </div>
      </div>
      <div className="section-shell footer-bottom">
        <span>© {site.copyrightYear} {site.siteName}</span>
        <nav className="footer-info" aria-label="Site information">{site.informationPages.map(([label, href]) => <Link key={href} href={href}>{label}</Link>)}<Link href="/privacy#analytics-choices">Analytics preferences</Link></nav>
      </div>
    </footer>
  );
}
