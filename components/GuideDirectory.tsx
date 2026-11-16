import Script from "next/script";
import { getHeadings } from "@/components/MdxContent";
import { getGuides, categoryLabel, categoryOrder } from "@/lib/guides";

export function GuideDirectory({ language = "en" }: { language?: "en" | "zh" }) {
  const zh = language === "zh";
  const guides = getGuides(language);
  const categories = categoryOrder.filter(category => guides.some(guide => guide.category === category));
  return <section className="guide-search" id="find-a-guide" aria-labelledby="guide-search-title" data-guide-search data-language={language}>
    <h2 id="guide-search-title">{zh ? "查找攻略" : `Search all ${guides.length} guides`}</h2>
    <p id="guide-search-note">{zh ? "标题可能包含物品或角色名称；答案只在你选择后展开。" : "Guide titles may name discoveries. Answers stay closed until you choose to reveal them."}</p>
    <form role="search" action="#find-a-guide" data-directory-form>
      <label htmlFor="guide-search-input">{zh ? "按物品、谜题、角色或区域搜索" : "Search by item, puzzle, character or area"}</label>
      <div className="directory-search-field"><input id="guide-search-input" name="q" type="search" placeholder={zh ? "搜索攻略…" : "Type a name or a question…"} autoComplete="off" maxLength={120} aria-controls="guide-search-results" aria-describedby="guide-search-note" /><button type="button" data-search-clear hidden>{zh ? "清空筛选" : "Clear filters"}</button></div>
    </form>
    <div className="search-topics" data-search-topics role="group" aria-label="Filter guides by topic" hidden>
      <button type="button" data-search-category="" aria-pressed="true" aria-controls="guide-search-results">{zh ? "全部攻略" : "All guides"}</button>
      {categories.map(category => <button type="button" key={category} data-search-category={category.toLowerCase()} aria-pressed="false" aria-controls="guide-search-results">{categoryLabel(category)}</button>)}
    </div>
    <p data-search-status role="status" aria-atomic="true">{guides.length}{zh ? " 篇攻略" : " guides to browse"}</p>
    <ul id="guide-search-results">{guides.map((guide) => <li key={guide.slug} data-search-category={guide.category.toLowerCase()} data-search-title={guide.title} data-search-keywords={guide.keyword} data-search-text={`${guide.title} ${guide.description} ${guide.category} ${guide.keyword} ${guide.quickAnswer ?? ""} ${getHeadings(guide.body).map(heading => heading.text).join(" ")}`}><a href={`/${guide.slug}`}><span className="search-result-meta"><small>{categoryLabel(guide.category)}</small>{guide.hints && <small className="search-hint-label">{zh ? "含分级提示" : "Hints available"}</small>}</span><strong>{guide.title}</strong><span className="search-result-description">{guide.description}</span></a></li>)}</ul>
    <div className="search-empty" data-search-empty hidden><p>{zh ? "没有匹配攻略。试试简短的物品名称，或清空筛选以查看全部攻略。" : "No matching guide. Try a shorter item name, choose another topic, or clear the filters to browse every guide."}</p><button type="button" data-search-reset className="button button-quiet">{zh ? "查看全部攻略" : "Show all guides"}</button></div>
    <noscript><p>{zh ? "所有攻略链接均列于上方，可直接浏览。" : "All guide links are listed above. You can browse them or use your browser’s Find command."}</p></noscript>
    <Script src="/guide-search.js" strategy="afterInteractive" />
  </section>;
}
