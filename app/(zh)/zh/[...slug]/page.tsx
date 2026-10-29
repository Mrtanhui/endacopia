import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getGuide, getGuides } from "@/lib/guides";
import { ArticlePage } from "@/components/ArticlePage";
import site from "@/config/site.json";
type Props = { params: Promise<{ slug: string[] }> };
export const dynamicParams = false;
export function generateStaticParams() { return getGuides("zh").map(g=>({slug: g.originalSlug!.split("/")})); }
export async function generateMetadata({params}:Props):Promise<Metadata> {
 const {slug}=await params; const g=getGuide(`zh/${slug.join("/")}`); if(!g) return {};
 return { title:g.title,description:g.description,alternates:{canonical:`/${g.slug}`,languages:{en:`/${g.originalSlug}`,"zh-Hans":`/${g.slug}`,"x-default":`/${g.originalSlug}`}},openGraph:{title:g.title,description:g.description,type:"article",locale:"zh_CN",url:`/${g.slug}`,images:[site.socialImage],modifiedTime:new Date(g.updated).toISOString()},twitter:{card:"summary_large_image",title:g.title,description:g.description,images:[site.socialImage]} };
}
export default async function Page({params}:Props) {const {slug}=await params;const g=getGuide(`zh/${slug.join("/")}`);if(!g)notFound();return <ArticlePage guide={g}/>;}
