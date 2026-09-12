import type { Metadata } from "next";
import Link from "@/components/InternalLink";
import { InfoPage } from "@/components/InfoPage";
import { AnalyticsChoices } from "@/components/Analytics";
import site from "@/config/site.json";

export const metadata: Metadata = { title: "Privacy", description: "How this site uses optional analytics, browser storage and hosting services, and how to change your choice.", alternates: { canonical: "/privacy" } };
export default function PrivacyPage() {
  return <InfoPage title="Privacy" description={`Privacy information for ${site.siteName}. Updated ${site.informationUpdated}.`}>
    <p>This site is maintained by {site.maintainer.name}. You can read guides without creating an account. We do not operate an on-site contact form, newsletter, checkout or advertising service.</p>
    <h2>Optional Google Analytics</h2>
    <p>Google Analytics 4 is loaded only after you choose “Allow analytics”. Before that choice, or if you decline, this site does not load the Google Analytics tag or send analytics events. Declining does not limit access to guides.</p>
    <p>When enabled, analytics measures page views, session and interaction information, approximate location, browser/device information, and clicks on guide cards, internal page links and cited sources. We use aggregate reports to improve navigation and identify guides that need work. We do not intentionally send names, email addresses or form input to Analytics. Our custom events omit URL queries and fragments.</p>
    <p>Analytics uses first-party cookies such as <code>_ga</code> and <code>_ga_*</code> to distinguish visits and sessions. Our tag sets a cookie lifetime of up to one year, refreshed during use. Browser settings can shorten that period. Cookies and server-side analytics retention are different: Google’s retention settings apply to data already received.</p>
    <p>Google processes analytics data on its infrastructure, which can be outside your country. Read <a href="https://policies.google.com/technologies/partner-sites" rel="noreferrer" target="_blank">how Google uses information from sites using its services</a> and <a href="https://policies.google.com/privacy" rel="noreferrer" target="_blank">Google’s privacy policy</a>. Google Signals and advertising personalization are disabled in our tag.</p>
    <AnalyticsChoices />
    <p>Your choice is stored in this browser under <code>guide-analytics-consent-v1</code>. It remains until changed or browser storage is cleared. Withdrawing consent stops subsequent Analytics collection and attempts to remove this site’s Analytics cookies; it does not erase data previously sent to Google. Clearing browser storage resets your choice, and analytics stays off until allowed again.</p>
    <h2>Hosting and essential storage</h2>
    <p>Vercel hosts the site and processes request information, such as IP address, requested URL, browser information and timestamps, to deliver pages, secure the service and troubleshoot errors. This can occur even when analytics is declined. Hosting records are handled under Vercel’s service settings and <a href="https://vercel.com/legal/privacy-policy" rel="noreferrer" target="_blank">privacy policy</a>.</p>
    <p>We store your analytics preference locally so it can be respected. A separate <code>guide-analytics-excluded</code> browser setting is used to exclude the maintainer’s test visits. It contains an on/off value, not an account identifier. During an explicit maintainer debug session, session storage holds a temporary debug flag so test events remain labelled when navigating between pages. Local and preview domains do not send analytics through this site’s loader.</p>
    <h2>External links and contact</h2>
    <p>Opening Steam, YouTube, GitHub or another external link takes you to a service with its own privacy practices. Contact takes place through public GitHub Issues; this site does not receive a private contact form submission. Please avoid sharing personal information in an issue.</p>
    <h2>Advertising and changes</h2>
    <p>No AdSense, Adsterra or other third-party advertising scripts are currently active. If advertising is introduced, this page and the relevant privacy choices will be updated before it is enabled.</p>
    <h2>Questions or requests</h2>
    <p>For a privacy question, correction or a request relating to data, use the <Link href="/contact">contact page</Link>. Do not post personal data publicly; ask for a private follow-up method first. Any request will be assessed against the data we can identify and the requirements that apply.</p>
  </InfoPage>;
}
