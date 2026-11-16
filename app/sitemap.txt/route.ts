import sitemap from "@/app/sitemap";

export const dynamic = "force-static";

// A plain-text discovery fallback, generated from the same canonical URL set.
export function GET() {
  return new Response(`${sitemap().map((entry) => entry.url).join("\n")}\n`, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
