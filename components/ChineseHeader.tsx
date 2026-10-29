import Link from "@/components/InternalLink";
import site from "@/config/site.json";
export function ChineseHeader() {
 const labels:Record<string,string>={Wiki:"攻略总览",Walkthrough:"流程",Endings:"结局",Characters:"角色",Puzzles:"谜题",Bosses:"Boss"};
 const links=site.navigation.map(([label,path])=>[labels[label]??label,`/zh${path}`]);
 return <header className="site-header"><div className="header-inner section-shell"><Link className="brand" href="/zh"><span className="brand-eye" aria-hidden="true"><i /></span><span><b>{site.gameName.toUpperCase()}</b><small>中文攻略</small></span></Link><nav className="desktop-nav" aria-label="主导航">{links.map(([label, href])=><Link key={href} href={href}>{label}</Link>)}</nav><Link className="language-status" href="/" hrefLang="en">English</Link><Link className="search-link" href="/zh/wiki#find-a-guide">搜索</Link><details className="mobile-menu"><summary aria-label="展开导航"><span/><span/><span/></summary><nav aria-label="移动端导航">{links.map(([label,href])=><Link key={href} href={href}>{label}</Link>)}<Link href="/" hrefLang="en">English</Link></nav></details></div></header>;
}
