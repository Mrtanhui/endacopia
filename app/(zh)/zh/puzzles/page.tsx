import Link from "@/components/InternalLink";
import type { Metadata } from "next";
import { getGuides } from "@/lib/guides";
import { GuideCard } from "@/components/GuideCard";
export const metadata:Metadata={title:"谜题解法与物品链",description:"查找钥匙、投影仪遥控器、密码、开关与场景谜题的中文步骤。",alternates:{canonical:"/zh/puzzles",languages:{en:"/puzzles","zh-Hans":"/zh/puzzles","x-default":"/puzzles"}}};
export default function Page(){return <><section className="listing-hero section-shell"><p className="eyebrow">针对具体问题</p><h1>谜题解法与物品链</h1><p>先确认当前场景与物品名称，再查看对应步骤。</p><Link href="/zh/wiki#find-a-guide">搜索全部攻略 →</Link></section><section className="section-shell section-pad listing-grid">{getGuides("zh").filter(g=>g.category==="Puzzles").map(g=><GuideCard key={g.slug} guide={g}/>)}</section></>;}
