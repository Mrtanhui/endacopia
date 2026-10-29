import Script from "next/script";
import Link from "@/components/InternalLink";
import type { GuideChecklist } from "@/lib/guides";

export function ProgressChecklist({ checklist, language = "en" }: { checklist: GuideChecklist; language?: "en" | "zh" }) {
  const t = (en: string, zh: string) => language === "zh" ? zh : en;
  const count = checklist.groups.reduce((total, group) => total + group.items.length, 0);
  return <section className="progress-checklist" id={`${checklist.id}-checklist`} data-checklist={checklist.id} data-language={language} aria-labelledby={`${checklist.id}-title`}>
    <div className="checklist-heading">
      <h3 id={`${checklist.id}-title`}>{checklist.title}</h3>
      <output data-checklist-count aria-live="polite" aria-atomic="true" hidden>0 / {count} collected</output>
    </div>
    <p data-checklist-status>{t("Tick the items you have collected. With JavaScript enabled, progress is saved only in this browser.", "勾选已收集的鱼。启用 JavaScript 后，进度仅保存在当前浏览器。")}</p>
    <progress data-checklist-progress max={count} value={0} aria-label="Collection progress" hidden />
    <div className="checklist-filter" data-checklist-tools hidden>
      <button type="button" className="button button-quiet" data-checklist-filter aria-pressed="false" aria-controls={`${checklist.id}-items`}>{t("Show missing only", "仅显示未收集")}</button>
      <span data-checklist-remaining role="status" aria-live="polite" />
    </div>
    <p data-checklist-empty hidden>{t("All 18 fish are checked. Show all to review them against your Fishing Paper, then ", "18 种鱼均已勾选。显示全部并与 Fishing Paper 核对后，")}<a href="#claim-the-old-or-lost-key">{t("claim the key", "领取钥匙")}</a>.</p>
    <div className="checklist-groups" id={`${checklist.id}-items`}>
      {checklist.groups.map((group) => <fieldset key={group.title} data-checklist-group><legend>{group.title}</legend>
        {group.items.map((item) => <label key={item.id}><input type="checkbox" value={item.id} /> <span>{item.label}</span></label>)}
      </fieldset>)}
    </div>
    <p className="checklist-note"><a href="#read-the-clock-and-advance-time">{t("Check the clock positions", "查看时钟位置")}</a> · <a href="#use-the-key-on-the-hidden-window-lock">{t("Already have the key? Find the lock", "已有钥匙？查找隐藏锁孔")}</a></p>
    <div className="checklist-actions" data-checklist-actions hidden>
      <button type="button" className="button button-quiet" data-checklist-reset>{t("Reset checklist", "重置清单")}</button>
      <span data-checklist-confirm hidden>{t("Clear all saved checks? ", "清除全部已保存的勾选？")}<button type="button" data-checklist-clear>{t("Clear progress", "清除进度")}</button> <button type="button" data-checklist-cancel>{t("Keep progress", "保留进度")}</button></span>
    </div>
    <p className="checklist-note">{t("This is your personal checklist; it does not read or change your game save. ", "这是个人检查清单，不会读取或修改游戏存档。")}<Link href="/privacy#checklist-storage">{t("Storage details", "存储说明（英文）")}</Link></p>
    <Script src="/checklist.js" strategy="afterInteractive" />
  </section>;
}
