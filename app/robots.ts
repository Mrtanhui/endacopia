import type { MetadataRoute } from "next";
import { absoluteUrl, siteUrl } from "@/lib/site-url";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/" },
    host: siteUrl.origin,
    sitemap: absoluteUrl("/sitemap.xml"),
  };
}
