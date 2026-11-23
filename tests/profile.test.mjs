import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {buildCards,summarize} from "../scripts/render.mjs";
const cfg=JSON.parse(readFileSync(new URL("../profile.json",import.meta.url),"utf8"));
const assets=()=>buildCards(cfg,null,null);
test("exactly 23 projects are displayed, including all user-listed repositories",()=>{
 assert.equal(cfg.repositories.length,23);
 assert.equal(cfg.repositories.filter(r=>r.visibility==="public").length,12);
 assert.equal(cfg.repositories.filter(r=>r.visibility==="private").length,11);
 assert.equal(new Set(cfg.repositories.map(r=>r.name)).size,23);
 for(const repo of cfg.repositories){assert.ok(assets()["cards/project-"+repo.name+".svg"]);assert.ok(assets()["cards/project-"+repo.name+"-mobile.svg"])}
});
test("header counts real public/private split and build tile no longer says three",()=>{
 const a=assets();
 assert.ok(a["cards/repositories-title.svg"].includes("23"));
 assert.ok(a["cards/repositories-title.svg"].includes("12 PUBLIC"));
 assert.ok(a["cards/repositories-title.svg"].includes("11 PRIVATE"));
 assert.equal(cfg.tiles.find(t=>t.id==="build").metric,"23");
 assert.ok(a["cards/build.svg"].includes("23"));
});
test("private projects do not contain undisclosed details",()=>{
 const a=assets();
 for(const p of cfg.repositories.filter(r=>r.visibility==="private")){
  const body=a["cards/project-"+p.name+".svg"];
  assert.ok(body.includes("Private repository"));
  assert.ok(!body.includes("https://github.com/yusufaliaskin/"+p.name));
 }
});
test("generated SVGs are accessible, complete and optimized",()=>{
 const a=assets();
 assert.equal(Object.keys(a).length,86);
 for(const [path,svg] of Object.entries(a)){
  assert.ok(svg.startsWith("<svg "),path);
  assert.ok(svg.endsWith("</svg>"),path);
  assert.ok(svg.includes("viewBox="),path);
  assert.ok(svg.includes("role=\"img\""),path);
  assert.ok(!svg.includes("<script"),path);
  assert.ok(!svg.includes("NaN"),path);
  assert.ok(!svg.includes("undefined"),path);
 }
});
test("all 23 project rows have reduced mobile variants and escaped input",()=>{
 const copy=structuredClone(cfg);
 copy.repositories[0].description='<script>alert("x")</script>';
 const a=buildCards(copy,null,null);
 assert.ok(a["cards/project-yusufaliaskin.svg"].includes("&lt;script&gt;"));
 assert.ok(!a["cards/project-yusufaliaskin.svg"].includes("<script>"));
 for(const p of cfg.repositories)assert.ok(a["cards/project-"+p.name+"-mobile.svg"].includes('viewBox="0 0 360 66"'));
});
test("no fake contribution counts; daily totals are derived from real days",()=>{
 const a=assets();
 assert.ok(a["cards/activity.svg"].includes("Syncing real activity"));
 const data=summarize([{date:"2026-11-20",count:2},{date:"2026-11-21",count:0},{date:"2026-11-22",count:3}]);
 assert.equal(data.total_contributions,5);
 assert.equal(data.best_day.count,3);
});
test("every footer link remains the user's real URL",()=>{
 const a=assets();
 for(const [id,url] of cfg.links){assert.ok(a["cards/footer-nav-"+id+".svg"].includes(url));assert.ok(a["cards/footer-nav-"+id+"-mobile.svg"].includes(url))}
 assert.ok(!Object.keys(a).some(s=>s.includes("footer-focus")));
});
