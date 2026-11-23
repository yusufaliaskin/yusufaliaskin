
import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {buildCards,summarize} from "../scripts/render.mjs";
const cfg=JSON.parse(readFileSync(new URL("../profile.json",import.meta.url),"utf8"));
const assets=()=>buildCards(cfg,null,null);
test("exactly three featured projects, not every repository",()=>{
 assert.equal(cfg.projects.length,3);
 const a=assets();
 assert.equal(Object.keys(a).filter(k=>k.startsWith("cards/repo-")).length,6);
 assert.ok(!Object.keys(a).some(k=>k.startsWith("cards/project-")||k.startsWith("cards/repositories-")));
 assert.equal(Object.keys(a).length,40);
});
test("repository total is accurate without listing them all",()=>{
 assert.equal(cfg.tiles.find(t=>t.id==="build").metric,"23");
 assert.equal(cfg.tiles.find(t=>t.id==="build").unit,"repositories");
 assert.ok(assets()["cards/build.svg"].includes("23"));
});
test("four personal links remain clickable and have staged entrance animations",()=>{
 const a=assets();
 for(let i=0;i<cfg.links.length;i++){
  const [id,url]=cfg.links[i];
  for(const suffix of ["","-mobile"]){
   const x=a["cards/footer-nav-"+id+suffix+".svg"];
   assert.ok(x.includes(url));assert.ok(x.includes("animation-delay:"));assert.ok(x.includes("@keyframes rise"));
  }
 }
});
test("language links appear as five slim animated options",()=>{
 const a=assets();
 for(const lang of ["en","tr","de","ru","zh"]){
  for(const suffix of ["","-mobile"]){
   const svg=a["cards/footer-language-"+lang+suffix+".svg"];
   assert.ok(svg.includes("animation-delay:"));
   assert.ok(svg.length<6000);
  }
 }
 assert.ok(!Object.keys(a).some(k=>k.includes("footer-heading")));
});
test("README translations preserve mobile sources, links, and three featured projects",()=>{
 for(const filename of ["README.md","README_TR.md","README_DE.md","README_RU.md","README_ZH.md"]){
  const s=readFileSync(new URL("../"+filename,import.meta.url),"utf8");
  for(const p of cfg.projects)assert.ok(s.includes("./cards/repo-"+p.name+"-mobile.svg"),filename+" "+p.name);
  for(const [id,url] of cfg.links){assert.ok(s.includes('href="'+url+'"'),filename+" "+id);assert.ok(s.includes("footer-nav-"+id+"-mobile.svg"),filename+" "+id)}
  for(const lang of ["en","tr","de","ru","zh"])assert.ok(s.includes("footer-language-"+lang+"-mobile.svg"),filename+" "+lang);
  assert.ok(!s.includes("cards/project-"),filename);
  assert.ok(!s.includes("cards/footer-focus-"),filename);
  assert.ok(s.includes("hero-mobile.svg"),filename);
  assert.ok(s.includes("title-coding-dark-mobile.svg"),filename);
 }
});
test("all SVGs are complete and reduced motion supported",()=>{
 for(const [name,svg] of Object.entries(assets())){
  assert.ok(svg.startsWith("<svg "),name);
  assert.ok(svg.endsWith("</svg>"),name);
  assert.ok(svg.includes("viewBox="),name);
  assert.ok(svg.includes("prefers-reduced-motion"),name);
  assert.ok(!svg.includes("<script"),name);
  assert.ok(!svg.includes("undefined"),name);
 }
});
test("no fabricated contributions and real streak calculations",()=>{
 const a=assets();
 assert.ok(a["cards/activity.svg"].includes("Syncing real activity"));
 const m=summarize([{date:"2026-11-20",count:2},{date:"2026-11-21",count:0},{date:"2026-11-22",count:3}]);
 assert.equal(m.total_contributions,5);
});
test("featured project content is XML escaped",()=>{
 const copy=structuredClone(cfg);copy.projects[0].description='<script>unsafe</script>';
 const svg=buildCards(copy,null,null)["cards/repo-AIStudio.svg"];
 assert.ok(svg.includes("&lt;script&gt;"));assert.ok(!svg.includes("<script>"));
});

test("remove Find me online from all README translations and generation",()=>{
 const a=assets();assert.equal(Object.keys(a).length,40);
 assert.ok(!Object.keys(a).some(k=>k.includes("footer-heading")));
 for(const name of ["README.md","README_TR.md","README_DE.md","README_RU.md","README_ZH.md"]){
 const txt=readFileSync(new URL("../"+name,import.meta.url),"utf8");
 assert.ok(!txt.includes("Find me online"));assert.ok(!txt.includes("footer-heading"));
 }
});
test("staggered reveal and draw effect on four links and five languages",()=>{
 const a=assets();
 for(const id of ["portfolio","linkedin","projects","contact"]){
  for(const suff of ["","-mobile"]){
   const x=a["cards/footer-nav-"+id+suff+".svg"];
   assert.ok(x.includes('class="nav-border-reveal"'));assert.ok(x.includes("animation-delay:"));
   assert.ok(x.includes("@keyframes draw"));
  }
 }
 for(const id of ["en","tr","de","ru","zh"]){
  assert.ok(a["cards/footer-language-"+id+".svg"].includes('class="line-draw"'));
 }
});
test("gentle finite animations and accessible reduced motion",()=>{
 const a=assets();
 assert.ok(a["cards/hero.svg"].includes('repeatCount="1"'));
 assert.ok(!a["cards/hero.svg"].includes('repeatCount="indefinite"'));
 assert.ok(a["cards/build.svg"].includes("translateY(16px) scale(.985)"));
 assert.ok(a["cards/repo-AIStudio.svg"].includes("animation-delay:0.26s"));
 assert.ok(a["cards/footer-nav-contact-mobile.svg"].includes("prefers-reduced-motion"));
});

test("real GitHub profile picture gets edge-enhanced ASCII output",async()=>{
 const source=readFileSync(new URL("../scripts/render.mjs",import.meta.url),"utf8");
 assert.ok(source.includes("https://github.com/yusufaliaskin.png?size=768"));
 const {asciiFromGrayscale}=await import("../scripts/render.mjs");
 const pixels=Uint8Array.from([0,255,128,255,0,128]);
 const lines=asciiFromGrayscale(pixels,3,2);
 assert.equal(lines.length,2);assert.equal(lines[0].length,3);
 assert.notEqual(lines[0][0],lines[0][1]);
 assert.throws(()=>asciiFromGrayscale(pixels,2,2));
});
test("all main sections animate as grouped components on mobile and desktop",()=>{
 const a=assets();
 for(const key of ["hero","hero-mobile","heatmap","heatmap-mobile","activity","activity-mobile","build","build-mobile","repo-AIStudio","repo-AIStudio-mobile","title-coding-light-mobile"]){
  assert.ok(a["cards/"+key+".svg"].includes("@keyframes rise"),key);
 }
 assert.equal((a["cards/heatmap.svg"].match(/class="heat-col"/g)||[]).length,53);
 assert.equal((a["cards/heatmap-mobile.svg"].match(/class="heat-col"/g)||[]).length,53);
 assert.ok(a["cards/repo-AIStudio-mobile.svg"].includes('class="repo-reveal"'));
 assert.ok(a["cards/hero.svg"].includes('class="portrait-reveal"'));
});
test("four rounded link buttons and five animated language pills",()=>{
 const a=assets();
 for(const id of ["portfolio","linkedin","projects","contact"]){
  for(const suffix of ["","-mobile"]){
   const v=a["cards/footer-nav-"+id+suffix+".svg"];
   assert.ok(v.includes('class="btn-reveal"'),id+suffix);
   assert.ok(v.includes('class="nav-border-reveal"'),id+suffix);
   assert.ok(v.includes('stroke-opacity=".35"'),id+suffix);
  }
 }
 for(const lang of ["en","tr","de","ru","zh"]){
  const v=a["cards/footer-language-"+lang+".svg"];
  assert.ok(v.includes('class="lang-pill-reveal"'),lang);
  assert.ok(v.includes('class="line-draw"'),lang);
 }
});
test("animations are bounded and motion preferences are respected",()=>{
 for(const [key,svg] of Object.entries(assets())){
  assert.ok(svg.includes("prefers-reduced-motion"),key);
  assert.ok(!svg.includes("infinite"),key);
 }
});
