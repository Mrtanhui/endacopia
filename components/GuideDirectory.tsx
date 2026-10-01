import Script from "next/script";
import { getGuides, categoryLabel } from "@/lib/guides";

export function GuideDirectory() {
  const guides = getGuides();
  return <section className="guide-search" id="find-a-guide" aria-labelledby="guide-search-title" data-guide-search>
    <h2 id="guide-search-title">Find a guide</h2>
    <label htmlFor="guide-search-input">Search by item, puzzle, character or area</label>
    <input id="guide-search-input" type="search" placeholder="Search guides…" autoComplete="off" aria-controls="guide-search-results" />
    <p data-search-status role="status">{guides.length} guides. Type to filter with JavaScript enabled, or browse the links below.</p>
    <ul id="guide-search-results">{guides.map((guide) => <li key={guide.slug} data-search-text={`${guide.title} ${guide.description} ${guide.category} ${guide.keyword}`}><a href={`/${guide.slug}`}><span>{guide.title}</span><small>{categoryLabel(guide.category)}</small></a></li>)}</ul>
    <p data-search-empty hidden>No matching guide. Try a shorter item or area name, or clear your search.</p>
    <Script src="/guide-search.js" strategy="afterInteractive" />
  </section>;
}
