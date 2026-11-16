export function GuideSearchForm({ id = "home-query", label = "What has you stuck?" }: { id?: string; label?: string }) {
  return <form action="/wiki#find-a-guide" method="get" role="search" className="home-search">
    <label htmlFor={id}>{label}</label>
    <div><input id={id} name="q" type="search" placeholder="An item, puzzle or character…" maxLength={120} /><button type="submit" className="button button-primary">Find a guide →</button></div>
  </form>;
}
