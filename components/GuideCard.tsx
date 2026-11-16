import Link from "@/components/InternalLink";
import type { Guide } from "@/lib/guides";

export function GuideCard({ guide, headingLevel = "h3" }: { guide: Guide; headingLevel?: "h2" | "h3" }) {
  const Heading = headingLevel;
  return (
    <Link className="guide-card" href={`/${guide.slug}`}>
      <div className="guide-card-top">
        <span>{guide.category}</span>
        <span>{guide.readTime}</span>
      </div>
      <Heading>{guide.title}</Heading>
      <p>{guide.description}</p>
      <span className="text-link">{guide.language === "zh" ? "阅读攻略 →" : "Read guide →"}</span>
    </Link>
  );
}
