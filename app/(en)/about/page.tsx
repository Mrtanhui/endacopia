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
    <ul><li>Separate different items and routes, even when players use similar names for them.</li><li>Keep solutions, screenshots and section directories closed until the reader chooses to reveal them.</li><li>Offer a small hint and a more specific clue on selected guides.</li><li>Identify platform or version limits and label unresolved steps.</li></ul>
    <h2>What the review labels mean</h2>
    <p><strong>Source review</strong> means the page is based on the credited materials, with any cross-checks described in its source notes. It does not mean we personally completed the route. <strong>First-hand playtest</strong> means a maintainer played the relevant steps; we would identify the platform, game build, date and steps tested. No guide currently records such a playtest.</p>
    <p>When an exact game build is unknown, we say so. Conflicting community accounts remain labelled rather than being treated as a confirmed solution. Page update dates describe edits to the page; the source notes retain the dates and scope of earlier checks.</p>
    <h2>Reading without accidental spoilers</h2>
    <p>The homepage uses broad topics. Directories and individual guide titles can name items, characters or discoveries, so they are not completely spoiler-free. On a guide page, hints, the full answer and source titles have separate reveal controls. The full answer contains the short solution, detailed steps, images and related guides.</p>
    <p>Community screenshots are credited to their original authors and are not presented as our own gameplay captures. Original diagrams are labelled as diagrams. This is an independent fan resource; a community allowing a link does not imply its endorsement of the site.</p>
    <h2>Corrections and attribution</h2>
    <p>If a step fails in your version, please include the page URL, game version, platform and the step that differs. We review corrections against available evidence. <Link href="/contact">Send a correction</Link> or report a missing credit through the same contact page.</p>
    <h2>Analytics and advertising</h2>
    <p>Optional analytics helps us understand which guides and links are useful. You can use the site without enabling it. No third-party advertising is currently running. Any future advertising will be labelled, and the <Link href="/privacy">privacy page</Link> will be updated before the relevant scripts are enabled.</p>
  </InfoPage>;
}
