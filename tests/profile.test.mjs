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

test("README lists every public and private repository without fake private links",()=>{
 const targets=["README.md","README_TR.md","README_DE.md","README_RU.md","README_ZH.md"];
 for(const filename of targets){
  const s=readFileSync(new URL("../"+filename,import.meta.url),"utf8");
  const pictureCount=(s.match(/project-[^"]+\.svg/g)||[]).length;
  assert.ok(pictureCount>=46,filename+" responsive project images");
  for(const p of cfg.repositories){
   assert.ok(s.includes("./cards/project-"+p.name+".svg"),filename+" "+p.name);
   assert.ok(s.includes("./cards/project-"+p.name+"-mobile.svg"),filename+" mobile "+p.name);
   const link='href="https://github.com/yusufaliaskin/'+encodeURIComponent(p.name)+'"';
   if(p.visibility==="public")assert.ok(s.includes(link),filename+" expected public link "+p.name);
   else assert.ok(!s.includes(link),filename+" must not link private "+p.name);
  }
  assert.ok(s.includes("repositories-title-mobile.svg"),filename);
  assert.ok(s.includes("repositories-public-mobile.svg"),filename);
  assert.ok(s.includes("repositories-private-mobile.svg"),filename);
  for(const [id,url] of cfg.links)assert.ok(s.includes('href="'+url+'"'),filename+" "+id);
  for(const link of ["README.md","README_TR.md","README_DE.md","README_RU.md","README_ZH.md"])assert.ok(s.includes('href="'+link+'"'),filename+" "+link);
  assert.ok(!s.includes("title-coding-"),filename);
  assert.ok(!s.includes("footer-focus-"),filename);
  assert.ok(!s.includes("repo-AIStudio"),filename);
 }
});
test("finite animations and reduced-motion support protect mobile performance",()=>{
 const a=buildCards(cfg,null,null);
 assert.ok(!a["cards/hero.svg"].includes('repeatCount="indefinite"'));
 assert.ok(a["cards/hero.svg"].includes('repeatCount="2"'));
 assert.ok(a["cards/project-AIStudio-mobile.svg"].includes("prefers-reduced-motion"));
 assert.ok(a["cards/project-AIStudio-mobile.svg"].length<5000);
});
