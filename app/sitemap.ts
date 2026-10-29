import type { MetadataRoute } from "next";
import { getGuides } from "@/lib/guides";
import { absoluteUrl } from "@/lib/site-url";
import home from "@/content/home.json";
import site from "@/config/site.json";
export const dynamic = "force-static";
export default function sitemap(): MetadataRoute.Sitemap {
 const guides=getGuides();
 const updated=new Date(Math.max(new Date(home.updated).valueOf(),...guides.map(g=>new Date(g.updated).valueOf())));
 return [
  ...["/","/puzzles"].map(path=>({url:absoluteUrl(path),lastModified:updated})),
  ...site.informationPages.map(([,path])=>({url:absoluteUrl(path),lastModified:new Date(path==="/privacy" ? site.privacyUpdated : site.informationUpdated)})),
  ...guides.map(g=>({url:absoluteUrl(`/${g.slug}`),lastModified:new Date(g.updated)})),
 ];
}
