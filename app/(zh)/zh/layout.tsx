import Link from "@/components/InternalLink";
import type { Metadata } from "next";
import type { CSSProperties } from "react";
import { metadata as base } from "@/app/(en)/layout";
import { ChineseHeader } from "@/components/ChineseHeader";
import { Analytics } from "@/components/Analytics";
import { googleAnalyticsId, siteUrl } from "@/lib/site-url";
import site from "@/config/site.json";
import "../../globals.css";
export const metadata: Metadata = { ...base, title: { default: `${site.gameName} 中文攻略 — 隐藏要素、钥匙与结局`, template: `%s | ${site.siteName}` }, description: `${site.gameName} 中文流程、谜题、隐藏要素与结局攻略，附物品英文名和核对来源。`, openGraph: {...base.openGraph, locale: "zh_CN"} };
export default function ChineseLayout({ children }: { children: React.ReactNode }) {
 return <html lang="zh-Hans" style={Object.fromEntries(Object.entries(site.theme).map(([k,v])=>[`--${k}`,v])) as CSSProperties}><body><Link className="skip-link" href="#main-content">跳到正文</Link><div className="site-noise" aria-hidden="true"/><ChineseHeader/><main id="main-content">{children}</main><footer className="site-footer"><div className="section-shell"><Link className="brand" href="/zh">{site.gameName} 中文攻略</Link><p>独立玩家攻略站，与游戏开发者无隶属关系。保留物品英文名，方便对照游戏界面。</p><p><Link href="/zh/wiki">全部攻略</Link> · <Link href="/about">关于本站（英文）</Link> · <Link href="/contact">纠错与联系（英文）</Link> · <Link href="/privacy">隐私与统计设置（英文）</Link></p><p>© {site.copyrightYear} {site.siteName}</p></div></footer><Analytics measurementId={googleAnalyticsId()} origin={siteUrl.origin} language="zh"/></body></html>;
}
