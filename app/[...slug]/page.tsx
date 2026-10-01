import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArticlePage } from "@/components/ArticlePage";
import { getGuide, getGuides } from "@/lib/guides";
import site from "@/config/site.json";

type PageProps = { params: Promise<{ slug: string[] }> };

export function generateStaticParams() {
  return getGuides().map((guide) => ({ slug: guide.slug.split("/") }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const guide = getGuide(slug.join("/"));
  if (!guide) return {};
  return {
    title: guide.title,
    description: guide.description,
    alternates: { canonical: `/${guide.slug}` },
    openGraph: { title: guide.title, description: guide.description, type: "article", url: `/${guide.slug}`, modifiedTime: new Date(guide.updated).toISOString(), images: [{ url: site.socialImage, width: 1200, height: 630, alt: site.siteName }] },
    twitter: { card: "summary_large_image", title: guide.title, description: guide.description, images: [site.socialImage] },
  };
}

export default async function GuideRoute({ params }: PageProps) {
  const { slug } = await params;
  const guide = getGuide(slug.join("/"));
  if (!guide) notFound();
  return <ArticlePage guide={guide} />;
}
