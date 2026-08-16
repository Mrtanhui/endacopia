import Link from "@/components/InternalLink";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="section-shell footer-grid">
        <div>
          <Link className="brand footer-brand" href="/">
            <span className="brand-eye" aria-hidden="true"><i /></span>
            <span><b>ENDACOPIA</b><small>FIELD GUIDE</small></span>
          </Link>
          <p>Independent, source-aware guides for Mellow&apos;s surreal puzzle adventure.</p>
          <p className="disclaimer">Fan-made and not affiliated with or endorsed by Andyland.</p>
        </div>
        <div>
          <h2>Explore</h2>
          <Link href="/walkthrough">Walkthrough</Link>
          <Link href="/endings">Endings</Link>
          <Link href="/characters">Characters</Link>
          <Link href="/bosses">Bosses</Link>
        </div>
        <div>
          <h2>Official links</h2>
          <a href="https://store.steampowered.com/app/2684630/Endacopia/" rel="noreferrer" target="_blank">Steam ↗</a>
          <a href="https://www.youtube.com/watch?v=_wJsmY8huvk" rel="noreferrer" target="_blank">Official trailer ↗</a>
          <a href="https://www.kickstarter.com/projects/endacopia/endacopia" rel="noreferrer" target="_blank">Kickstarter ↗</a>
          <a href="https://andyl4nd.itch.io/endacopiademo" rel="noreferrer" target="_blank">Original demo ↗</a>
        </div>
        <div className="footer-status">
          <span className="pulse" />
          <p>GUIDE STATUS</p>
          <strong>18 PAGES ONLINE</strong>
          <small>Last research review: Aug 14, 2026</small>
        </div>
      </div>
      <div className="section-shell footer-bottom">
        <span>© 2026 Endacopia Guide</span>
        <span>English edition · Localization-ready</span>
      </div>
    </footer>
  );
}
