import Script from "next/script";
import { getHeadings } from "@/components/MdxContent";
import { getGuides, categoryLabel } from "@/lib/guides";

export function GuideDirectory({ language = "en" }: { language?: "en" | "zh" }) {
  const zh = language === "zh";
  const guides = getGuides(language);
  return <section className="guide-search" id="find-a-guide" aria-labelledby="guide-search-title" data-guide-search data-language={language}>
    <h2 id="guide-search-title">{zh ? "查找攻略" : "Find a guide"}</h2>
    <label htmlFor="guide-search-input">{zh ? "按物品、谜题、角色或区域搜索" : "Search by item, puzzle, character or area"}</label>
    <input id="guide-search-input" type="search" placeholder={zh ? "搜索攻略…" : "Search guides…"} autoComplete="off" aria-controls="guide-search-results" />
    <p data-search-status role="status">{guides.length}{zh ? " 篇攻略。输入关键词筛选，或直接浏览下方链接。" : " guides. Type to filter with JavaScript enabled, or browse the links below."}</p>
    <ul id="guide-search-results">{guides.map((guide) => <li key={guide.slug} data-search-text={`${guide.title} ${guide.description} ${guide.category} ${guide.keyword} ${guide.quickAnswer ?? ""} ${getHeadings(guide.body).map(heading => heading.text).join(" ")}`}><a href={`/${guide.slug}`}><span>{guide.title}</span><small>{categoryLabel(guide.category)}</small></a></li>)}</ul>
    <p data-search-empty hidden>{zh ? "没有匹配攻略。请尝试较短的物品或区域名称，或清空搜索。" : "No matching guide. Try a shorter item or area name, or clear your search."}</p>
    <Script src="/guide-search.js" strategy="afterInteractive" />
  </section>;
}
