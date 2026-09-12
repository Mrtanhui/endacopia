import type { Metadata } from "next";
import Script from "next/script";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { googleAnalyticsId, googleSiteVerification, siteUrl } from "@/lib/site-url";
import "./globals.css";
import site from "@/config/site.json";

const verificationToken = googleSiteVerification();
const gaMeasurementId = googleAnalyticsId();

export const metadata: Metadata = {
  metadataBase: siteUrl,
  title: { default: site.title, template: `%s | ${site.siteName}` },
  description: site.description,
  keywords: site.keywords,
  icons: { icon: site.favicon, shortcut: site.favicon, apple: site.favicon },
  robots: { index: true, follow: true },
  openGraph: {
    type: "website", locale: site.locale, siteName: site.siteName,
    title: site.title, description: site.description,
    images: [{ url: site.socialImage, width: 1200, height: 630, alt: site.title }],
  },
  twitter: { card: "summary", title: site.siteName, description: site.description, images: [site.socialImage] },
  verification: verificationToken ? { google: verificationToken } : undefined,
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang={site.language}>
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
