import test from "node:test";import assert from "node:assert/strict";import {buildCards,summarize} from "../scripts/render.mjs";import {readFileSync} from "node:fs";
const cfg=JSON.parse(readFileSync(new URL("../profile.json",import.meta.url),"utf8"));
test("all self-contained animated SVGs including responsive footer",()=>{const cards=buildCards(cfg,null,null);assert.equal(Object.keys(cards).length,26);for(const svg of Object.values(cards)){assert.ok(svg.includes("<svg "));assert.ok(svg.includes("viewBox="));assert.ok(svg.includes("@keyframes"));assert.ok(!svg.includes("<script"));assert.ok(svg.endsWith("</svg>"))}});
test("no invented GitHub numbers without data",()=>{const c=buildCards(cfg,null,null);assert.ok(c["cards/activity.svg"].includes("Syncing real activity"));assert.ok(c["cards/heatmap.svg"].includes("AWAITING FIRST SYNC"))});
test("counts and streaks use supplied real days",()=>{const x=summarize([{date:"2026-11-20",count:4},{date:"2026-11-21",count:0},{date:"2026-11-22",count:2}]);assert.equal(x.total_contributions,6);assert.equal(x.best_day.count,4);assert.equal(x.longest_streak.length,1)});
test("escape untrusted project descriptions",()=>{const copy=JSON.parse(JSON.stringify(cfg));copy.projects[0].description='<script>alert("bad")</script>';const s=buildCards(copy,null,null)["cards/repo-AIStudio.svg"];assert.ok(!s.includes("<script>"));assert.ok(s.includes("&lt;script&gt;"))});

test("footer shows real user links and five languages",()=>{
 const cards=buildCards(cfg,null,null);
 const ids=["portfolio","linkedin","projects","contact"];
 for(const id of ids){const p="cards/footer-nav-"+id+".svg";assert.ok(cards[p]?.includes('<svg '),p);assert.ok(cards[p].includes("@keyframes"),p)}
 const langs=["en","tr","de","ru","zh"];
 for(const id of langs){assert.ok(cards["cards/footer-focus-"+id+".svg"],id);assert.ok(cards["cards/footer-language-"+id+".svg"],id)}
 assert.ok(cards["cards/footer-heading.svg"].includes("YUSUF ALI AŞKIN"));
});
test("every translated README has clickable personal footer links and language links",()=>{
 for(const filename of ["README.md","README_TR.md","README_DE.md","README_RU.md","README_ZH.md"]){
  const s=readFileSync(new URL("../"+filename,import.meta.url),"utf8");
  for(const [id,url] of cfg.links){assert.ok(s.includes('href="'+url+'"'),filename+" "+id);assert.ok(s.includes("./cards/footer-nav-"+id+".svg"),filename+" "+id)}
  for(const path of ["README.md","README_TR.md","README_DE.md","README_RU.md","README_ZH.md"])assert.ok(s.includes('href="'+path+'"'),filename+" "+path);
  assert.ok(s.includes("./cards/footer-focus-"),filename);
  assert.ok(!s.includes('<p align="center"><sub>'),filename);
 }
});
