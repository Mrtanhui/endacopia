import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArticlePage } from "@/components/ArticlePage";
import { getGuide, getGuides } from "@/lib/guides";

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
    openGraph: { title: guide.title, description: guide.description, type: "article" },
  };
}

export default async function GuideRoute({ params }: PageProps) {
  const { slug } = await params;
  const guide = getGuide(slug.join("/"));
  if (!guide) notFound();
  return <ArticlePage guide={guide} />;
}
