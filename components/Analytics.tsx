import Link from "@/components/InternalLink";
import Script from "next/script";

export function Analytics({ measurementId, origin }: { measurementId?: string; origin: string }) {
  if (!measurementId) return null;
  return <>
    <section id="analytics-banner" data-measurement-id={measurementId} data-production-origin={origin} className="analytics-banner" aria-label="Analytics preferences" hidden>
      <p>Allow optional analytics to help us improve these guides? Google Analytics measures page visits and guide links. The site works without it. <Link href="/privacy">Privacy details</Link></p>
      <div className="button-row">
        <button type="button" className="button button-quiet" data-analytics-choice="denied">Decline analytics</button>
        <button type="button" className="button button-quiet" data-analytics-choice="granted">Allow analytics</button>
      </div>
    </section>
    <Script id="site-analytics" src="/analytics.js" strategy="afterInteractive" />
  </>;
}

export function AnalyticsChoices() {
  return <section id="analytics-choices" className="analytics-choices" aria-labelledby="analytics-choices-title">
    <h2 id="analytics-choices-title">Your analytics choice</h2>
    <p id="analytics-status" role="status">Optional analytics stays off until you allow it. JavaScript is needed to save a choice.</p>
    <div className="button-row">
      <button type="button" className="button button-quiet" data-analytics-choice="denied">Decline analytics</button>
      <button type="button" className="button button-quiet" data-analytics-choice="granted">Allow analytics</button>
    </div>
  </section>;
}
