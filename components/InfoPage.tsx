import type { ReactNode } from "react";
import Link from "@/components/InternalLink";

export function InfoPage({ title, description, children }: { title: string; description: string; children: ReactNode }) {
  return <>
    <section className="article-hero section-shell">
      <nav className="breadcrumbs" aria-label="Breadcrumb"><Link href="/">Home</Link><span>/</span><span>{title}</span></nav>
      <p className="eyebrow">Site information</p><h1>{title}</h1><p className="article-description">{description}</p>
    </section>
    <article className="info-page section-shell"><div className="mdx-content">{children}</div></article>
  </>;
}
