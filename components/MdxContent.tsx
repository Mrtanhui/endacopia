import Link from "next/link";

type Block =
  | { type: "h2" | "h3"; text: string }
  | { type: "p" | "quote"; text: string }
  | { type: "ul" | "ol"; items: string[] };

function anchor(text: string) {
  return text.toLowerCase().replace(/[^a-z0-9\s-]/g, "").trim().replace(/\s+/g, "-");
}

function inline(text: string) {
  const chunks = text.split(/(\[[^\]]+\]\([^)]+\)|`[^`]+`|\*\*[^*]+\*\*)/g).filter(Boolean);
  return chunks.map((chunk, index) => {
    const link = chunk.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
    if (link) {
      const external = link[2].startsWith("http");
      return external
        ? <a href={link[2]} key={index} rel="noreferrer" target="_blank">{link[1]} ↗</a>
        : <Link href={link[2]} key={index}>{link[1]}</Link>;
    }
    if (chunk.startsWith("`") && chunk.endsWith("`")) return <code key={index}>{chunk.slice(1, -1)}</code>;
    if (chunk.startsWith("**") && chunk.endsWith("**")) return <strong key={index}>{chunk.slice(2, -2)}</strong>;
    return chunk;
  });
}

function parse(body: string): Block[] {
  const lines = body.split("\n");
  const blocks: Block[] = [];
  let paragraph: string[] = [];
  let list: string[] = [];
  let listType: "ul" | "ol" | null = null;

  const flushParagraph = () => {
    if (paragraph.length) blocks.push({ type: "p", text: paragraph.join(" ") });
    paragraph = [];
  };
  const flushList = () => {
    if (listType && list.length) blocks.push({ type: listType, items: list });
    list = [];
    listType = null;
  };

  for (const line of lines) {
    const trimmed = line.trim();
    const unordered = trimmed.match(/^[-*]\s+(.+)$/);
    const ordered = trimmed.match(/^\d+\.\s+(.+)$/);
    if (trimmed.startsWith("## ")) {
      flushParagraph(); flushList(); blocks.push({ type: "h2", text: trimmed.slice(3) });
    } else if (trimmed.startsWith("### ")) {
      flushParagraph(); flushList(); blocks.push({ type: "h3", text: trimmed.slice(4) });
    } else if (trimmed.startsWith("> ")) {
      flushParagraph(); flushList(); blocks.push({ type: "quote", text: trimmed.slice(2) });
    } else if (unordered) {
      flushParagraph();
      if (listType && listType !== "ul") flushList();
      listType = "ul"; list.push(unordered[1]);
    } else if (ordered) {
      flushParagraph();
      if (listType && listType !== "ol") flushList();
      listType = "ol"; list.push(ordered[1]);
    } else if (!trimmed) {
      flushParagraph(); flushList();
    } else {
      flushList(); paragraph.push(trimmed);
    }
  }
  flushParagraph(); flushList();
  return blocks;
}

export function MdxContent({ body }: { body: string }) {
  const blocks = parse(body);
  return (
    <div className="mdx-content">
      {blocks.map((block, index) => {
        if (block.type === "h2") return <h2 id={anchor(block.text)} key={index}>{block.text}</h2>;
        if (block.type === "h3") return <h3 id={anchor(block.text)} key={index}>{block.text}</h3>;
        if (block.type === "quote") return <blockquote key={index}>{inline(block.text)}</blockquote>;
        if (block.type === "ul") return <ul key={index}>{block.items.map((item) => <li key={item}>{inline(item)}</li>)}</ul>;
        if (block.type === "ol") return <ol key={index}>{block.items.map((item) => <li key={item}>{inline(item)}</li>)}</ol>;
        return <p key={index}>{inline(block.text)}</p>;
      })}
    </div>
  );
}

export function getHeadings(body: string) {
  return parse(body)
    .filter((block): block is Extract<Block, { type: "h2" }> => block.type === "h2")
    .map((block) => ({ text: block.text, id: anchor(block.text) }));
}
