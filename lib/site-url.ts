function configuredSiteUrl(): string {
  const explicitUrl = process.env.SITE_URL?.trim();
  if (explicitUrl) return explicitUrl;

  const vercelProductionUrl = process.env.VERCEL_PROJECT_PRODUCTION_URL?.trim();
  if (vercelProductionUrl) return `https://${vercelProductionUrl}`;

  return "http://localhost:3000";
}

export const siteUrl = (() => {
  const url = new URL(configuredSiteUrl());
  if (url.protocol !== "http:" && url.protocol !== "https:") {
    throw new Error("SITE_URL must be an absolute HTTP(S) URL.");
  }

  url.pathname = "/";
  url.search = "";
  url.hash = "";
  return url;
})();

export function absoluteUrl(pathname = "/"): string {
  return new URL(pathname, siteUrl).toString();
}

export function googleSiteVerification(): string | undefined {
  return process.env.GOOGLE_SITE_VERIFICATION?.trim() || undefined;
}

export function googleAnalyticsId(): string | undefined {
  const measurementId = process.env.NEXT_PUBLIC_GA_ID?.trim();
  if (!measurementId) return undefined;
  if (!/^G-[A-Z0-9]+$/.test(measurementId)) {
    throw new Error("NEXT_PUBLIC_GA_ID must be a valid GA4 measurement ID.");
  }
  return measurementId;
}
