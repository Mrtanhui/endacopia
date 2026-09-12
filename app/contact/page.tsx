import type { Metadata } from "next";
import { InfoPage } from "@/components/InfoPage";
import site from "@/config/site.json";

export const metadata: Metadata = { title: "Contact", description: "Report an incorrect puzzle step, broken link, accessibility issue or attribution concern.", alternates: { canonical: "/contact" } };
export default function ContactPage() {
  return <InfoPage title="Contact" description="Help us correct a guide or fix a problem with the site.">
    <h2>Report an issue</h2>
    <p>Contact {site.maintainer.name}, the maintainer of {site.siteName}, through the project’s GitHub Issues. A GitHub account is required to submit an issue.</p>
    <p><a className="button button-primary" href={site.maintainer.issuesUrl} rel="noreferrer" target="_blank">Open GitHub Issues ↗</a></p>
    <h2>What to include</h2>
    <ul><li>The URL of the guide or page.</li><li>Your game version and platform, if relevant.</li><li>The step you tried, what you expected and what happened.</li><li>A source link or screenshot you have the right to share, if it helps explain the correction.</li></ul>
    <h2>Privacy and attribution concerns</h2>
    <p>GitHub Issues are public. Do not post passwords, save files containing personal data, payment information, personal email addresses or other private details. For a concern that requires private follow-up, open a brief issue asking for a private contact method without including the sensitive information.</p>
    <p>You can also report accessibility problems, broken links, missing credits or a rights concern. Please identify the affected page and material. Responses depend on maintainer availability; no response time is guaranteed.</p>
  </InfoPage>;
}
