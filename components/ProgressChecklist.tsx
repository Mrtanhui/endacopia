import Script from "next/script";
import Link from "@/components/InternalLink";
import type { GuideChecklist } from "@/lib/guides";

export function ProgressChecklist({ checklist }: { checklist: GuideChecklist }) {
  const count = checklist.groups.reduce((total, group) => total + group.items.length, 0);
  return <section className="progress-checklist" data-checklist={checklist.id} aria-labelledby={`${checklist.id}-title`}>
    <div className="checklist-heading">
      <h3 id={`${checklist.id}-title`}>{checklist.title}</h3>
      <output data-checklist-count aria-live="polite" aria-atomic="true" hidden>0 / {count} collected</output>
    </div>
    <p data-checklist-status>Tick the items you have collected. With JavaScript enabled, progress is saved only in this browser.</p>
    <progress data-checklist-progress max={count} value={0} aria-label="Collection progress" hidden />
    <div className="checklist-groups">
      {checklist.groups.map((group) => <fieldset key={group.title}><legend>{group.title}</legend>
        {group.items.map((item) => <label key={item.id}><input type="checkbox" value={item.id} /> <span>{item.label}</span></label>)}
      </fieldset>)}
    </div>
    <div className="checklist-actions" data-checklist-actions hidden>
      <button type="button" className="button button-quiet" data-checklist-reset>Reset checklist</button>
      <span data-checklist-confirm hidden>Clear all saved checks? <button type="button" data-checklist-clear>Clear progress</button> <button type="button" data-checklist-cancel>Keep progress</button></span>
    </div>
    <p className="checklist-note">This is your personal checklist; it does not read or change your game save. <Link href="/privacy#checklist-storage">Storage details</Link></p>
    <Script src="/checklist.js" strategy="afterInteractive" />
  </section>;
}
