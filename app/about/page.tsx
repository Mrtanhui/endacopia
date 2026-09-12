import type { Metadata } from "next";
import Link from "@/components/InternalLink";
import { InfoPage } from "@/components/InfoPage";
import site from "@/config/site.json";

export const metadata: Metadata = { title: "About", description: "Who maintains this guide, how sources are checked, and how corrections are handled.", alternates: { canonical: "/about" } };
export default function AboutPage() {
  return <InfoPage title={`About ${site.siteName}`} description="Independent guides built around the step you are trying to complete.">
    <h2>Who maintains this site</h2>
    <p>{site.siteName} is maintained by <a href={site.maintainer.profileUrl} rel="noreferrer" target="_blank">{site.maintainer.name}</a>. {site.disclaimer} Game names, characters and artwork belong to their respective rights holders.</p>
    <h2>How we prepare a guide</h2>
    <p>We use official game pages for release information and credited community walkthroughs for puzzle routes. Each guide includes its sources. We use AI assistance for drafting, organization and site development; source links and stated uncertainties help readers check the result.</p>
    <ul><li>Separate different items and routes, even when players use similar names for them.</li><li>Put the short answer before the longer steps.</li><li>Identify platform or version limits when the available evidence supports them.</li><li>Label uncertainty instead of presenting an unverified step as confirmed.</li></ul>
    <p>A source-backed guide does not mean every step has been personally tested in the game. We do not claim first-hand verification where it has not been done. Update dates describe changes to the individual guide.</p>
    <h2>Corrections and attribution</h2>
    <p>If a step fails in your version, please include the page URL, game version, platform and the step that differs. We review corrections against available evidence. <Link href="/contact">Send a correction</Link> or report a missing credit through the same contact page.</p>
    <h2>Analytics and advertising</h2>
    <p>Optional analytics helps us understand which guides and links are useful. You can use the site without enabling it. No third-party advertising is currently running. Any future advertising will be labelled, and the <Link href="/privacy">privacy page</Link> will be updated before the relevant scripts are enabled.</p>
  </InfoPage>;
}
