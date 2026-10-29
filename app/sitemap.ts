import type { MetadataRoute } from "next";
import { getGuides } from "@/lib/guides";
import { absoluteUrl } from "@/lib/site-url";
import home from "@/content/home.json";
import site from "@/config/site.json";
export const dynamic = "force-static";
export default function sitemap(): MetadataRoute.Sitemap {
 const all=[...getGuides(),...getGuides("zh")];
 const updated=new Date(Math.max(new Date(home.updated).valueOf(),...all.map(g=>new Date(g.updated).valueOf())));
 const paired=(en:string,zh:string)=>({languages:{en:absoluteUrl(en),"zh-Hans":absoluteUrl(zh)}});
 return [
  ...[["/","/zh"],["/puzzles","/zh/puzzles"]].flatMap(([en,zh])=>[en,zh].map(path=>({url:absoluteUrl(path),lastModified:updated,alternates:paired(en,zh)}))),
  ...site.informationPages.map(([,path])=>({url:absoluteUrl(path),lastModified:new Date(path==="/privacy" ? site.privacyUpdated : site.informationUpdated)})),
  ...all.map(g=>({url:absoluteUrl(`/${g.slug}`),lastModified:new Date(g.updated),alternates:paired(`/${g.originalSlug??g.slug}`,`/zh/${g.originalSlug??g.slug}`)})),
 ];
}
