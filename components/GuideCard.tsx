import Link from "next/link";
import type { Guide } from "@/lib/guides";

export function GuideCard({ guide }: { guide: Guide }) {
  return (
    <Link className="guide-card" href={`/${guide.slug}`}>
      <div className="guide-card-top">
        <span>{guide.category}</span>
        <span>{guide.readTime}</span>
      </div>
      <h3>{guide.title}</h3>
      <p>{guide.description}</p>
      <span className="text-link">Read guide →</span>
    </Link>
  );
}
