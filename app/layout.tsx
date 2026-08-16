import type { Metadata } from "next";
import Script from "next/script";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { googleAnalyticsId, googleSiteVerification, siteUrl } from "@/lib/site-url";
import "./globals.css";

const verificationToken = googleSiteVerification();
const gaMeasurementId = googleAnalyticsId();

export const metadata: Metadata = {
  metadataBase: siteUrl,
  title: {
    default: "Endacopia Wiki — Walkthrough, Endings & Puzzle Guides",
    template: "%s | Endacopia Guide",
  },
  description: "An independent Endacopia guide with a complete walkthrough, endings, character profiles, achievements, bosses, and puzzle solutions.",
  keywords: ["endacopia", "endacopia wiki", "endacopia walkthrough", "endacopia endings", "endacopia characters", "endacopia puzzle guide"],
  icons: {
    icon: "/favicon.png",
    shortcut: "/favicon.png",
    apple: "/favicon.png",
  },
  robots: { index: true, follow: true },
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "Endacopia Guide",
    title: "Endacopia Wiki — Walkthrough, Endings & Puzzle Guides",
    description: "A spoiler-aware route through Endacopia: walkthroughs, endings, characters, achievements, bosses, and direct puzzle answers.",
    images: [{ url: "/og.png", width: 1200, height: 630, alt: "Endacopia Guide — Walkthroughs, Endings, Puzzle Answers" }],
  },
  twitter: {
    card: "summary",
    title: "Endacopia Guide",
    description: "Walkthroughs, endings, characters, bosses, and focused puzzle answers for Endacopia.",
    images: ["/og.png"],
  },
  verification: verificationToken ? { google: verificationToken } : undefined,
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <a className="skip-link" href="#main-content">Skip to content</a>
        <div className="site-noise" aria-hidden="true" />
        <SiteHeader />
        <main id="main-content">{children}</main>
        <SiteFooter />
        {gaMeasurementId ? (
          <>
            <Script
              id="ga4-loader"
              src={`https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(gaMeasurementId)}`}
              strategy="afterInteractive"
            />
            <Script id="ga4-init" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', ${JSON.stringify(gaMeasurementId)});
              `}
            </Script>
          </>
        ) : null}
      </body>
    </html>
  );
}
