import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {buildCards,summarize,asciiFromGrayscale} from "../scripts/render.mjs";
const cfg=JSON.parse(readFileSync(new URL("../profile.json",import.meta.url),"utf8"));
const cards=(data=null)=>buildCards(cfg,data,null);
test("only three featured projects and forty responsive SVG assets",()=>{
 assert.equal(cfg.projects.length,3);
 const v=cards();assert.equal(Object.keys(v).length,40);
 assert.equal(Object.keys(v).filter(k=>k.startsWith("cards/repo-")).length,6);
 assert.ok(!Object.keys(v).some(k=>k.startsWith("cards/project-")||k.includes("footer-heading")));
});
test("the reference has thirteen distinct motion primitives",()=>{
 const s=cards()["cards/build.svg"];
 for(const anim of ["rise","fade","grow","pop","pulse","nudge","nudgeup","tilein","slidein","arrowin","roll","sheen","ring"]){
  assert.ok(s.includes("@keyframes "+anim),anim);
 }
 assert.ok(s.includes("translateY(90px) scale(.6) rotate(-9deg)"));
 assert.ok(s.includes("scale(1.15)"));
});
test("ASCII hero prints portrait rows at progressively later times",()=>{
 const s=cards()["cards/hero.svg"];
 assert.equal((s.match(/animation-duration:\.35s/g)||[]).length,53);
 assert.ok(s.includes("animation-delay:0.250s"));
 assert.ok(s.includes("animation-delay:1.186s"));
 assert.ok(s.includes('repeatCount="indefinite"'));
 assert.ok(s.includes("animation-delay:.15s"));
 assert.ok(s.includes("animation-delay:.30s"));
});
test("desktop contribution heatmap pops independent daily cells",()=>{
 const s=cards()["cards/heatmap.svg"];
 assert.ok((s.match(/<rect class="p" style="animation-delay:/g)||[]).length>=360);
 assert.ok(s.includes("animation-delay:1.00s"));
 assert.ok(s.includes("animation-delay:1.02s"));
 assert.ok(s.includes('style="animation-delay:2.4s"'));
});
test("compact mobile heatmap uses 53 timed groups for performance",()=>{
 const s=cards()["cards/heatmap-mobile.svg"];
 assert.equal((s.match(/<g class="p" style="animation-delay:/g)||[]).length,53);
 assert.ok(s.includes("animation-delay:1.00s"));
 assert.ok(s.includes("animation-delay:2.56s"));
});
test("tiles launch at 3.1 3.35 and 3.6 seconds with layered effects",()=>{
 for(const [i,name] of ["build","secure","learn"].entries()){
  const s=cards()["cards/"+name+".svg"],d=(3.1+i*.25).toFixed(2);
  assert.ok(s.includes('class="ti" style="animation-delay:'+d+'s"'),name);
  for(const cls of ["sl","ai","ro","sh","rg"])assert.ok(s.includes('class="'+cls+'"'),name+" "+cls);
  assert.ok(s.includes('clip-path="url(#slot)"'));
  if(/^\d/.test(cfg.tiles[i].metric)){
   assert.ok(s.includes("<set attributeName="),name);
   assert.ok((s.match(/<set attributeName="opacity" to="1"/g)||[]).length>=19,name);
  }else{
   assert.ok(s.includes('class="sl"'),name+" text-only value slides in");
  }
 }
});
test("activity chart grows 12 monthly bars and unveils three stats",()=>{
 const data=summarize([{date:"2026-11-20",count:4},{date:"2026-11-21",count:0},{date:"2026-11-22",count:2}]);
 const s=cards(data)["cards/activity.svg"];
 assert.equal((s.match(/<rect class="g" style="animation-delay:/g)||[]).length,12);
 assert.ok(s.includes("animation-delay:2.20s"));
 assert.ok(s.includes("animation-delay:2.60s")||s.includes("animation-delay:2.6s"));
 assert.ok(s.includes("days with a contribution"));
 assert.ok(s.includes("busiest day"));
 assert.equal(data.total_contributions,6);
});
test("section title and repositories follow reference delays",()=>{
 const a=cards();
 assert.ok(a["cards/title-coding-light.svg"].includes("animation-delay:4.4s"));
 for(const [i,p] of cfg.projects.entries()){
  assert.ok(a["cards/repo-"+p.name+".svg"].includes("animation-delay:"+(4.6+i*.12).toFixed(2)+"s"));
  assert.ok(a["cards/repo-"+p.name+"-mobile.svg"].includes("animation-delay:"+(4.6+i*.12).toFixed(2)+"s"));
 }
});
test("link buttons and all five languages are animated and clickable",()=>{
 const a=cards();
 for(const [i,[key,url]] of cfg.links.entries()){
  const p=a["cards/footer-nav-"+key+".svg"],m=a["cards/footer-nav-"+key+"-mobile.svg"];
  assert.ok(p.includes(url));assert.ok(m.includes(url));
  assert.ok(p.includes('class="ti"'),key);
  assert.ok(p.includes("animation-delay:"+(5.05+i*.16).toFixed(2)+"s"),key);
 }
 for(const [i,id] of ["en","tr","de","ru","zh"].entries()){
  const s=a["cards/footer-language-"+id+".svg"];
  assert.ok(s.includes('class="p"'),id);
  assert.ok(s.includes("animation-delay:"+(5.85+i*.12).toFixed(2)+"s"),id);
 }
});
test("all languages preserve three projects, mobile art and all user URLs",()=>{
 for(const name of ["README.md","README_TR.md","README_DE.md","README_RU.md","README_ZH.md"]){
  const readme=readFileSync(new URL("../"+name,import.meta.url),"utf8");
  for(const p of cfg.projects)assert.ok(readme.includes("cards/repo-"+p.name+"-mobile.svg"),name+" "+p.name);
  for(const [key,url] of cfg.links){assert.ok(readme.includes('href="'+url+'"'),name+" "+key);assert.ok(readme.includes("footer-nav-"+key+"-mobile.svg"))}
  assert.ok(!readme.includes("Find me online"));
  assert.ok(!readme.includes("cards/project-"));
 }
});
test("reduced motion is supported and SVGs use no scripts",()=>{
 for(const [name,s] of Object.entries(cards())){
  assert.ok(s.startsWith("<svg "),name);
  assert.ok(s.endsWith("</svg>"),name);
  assert.ok(s.includes("prefers-reduced-motion"),name);
  assert.ok(!s.includes("<script"),name);
  assert.ok(!s.includes("undefined"),name);
 }
});
test("real avatar pixel data maps to ASCII without making up the portrait",()=>{
 const pix=Uint8Array.from([0,255,100,200,50,100]);
 const art=asciiFromGrayscale(pix,3,2);
 assert.equal(art.length,2);assert.equal(art[0].length,3);
 assert.notEqual(art[0][0],art[0][1]);
 assert.throws(()=>asciiFromGrayscale(pix,2,2));
});
test("escaping keeps external descriptions from injecting SVG scripts",()=>{
 const c=structuredClone(cfg);c.projects[0].description='<script>bad</script>';
 const s=buildCards(c,null,null)["cards/repo-AIStudio.svg"];
 assert.ok(s.includes("&lt;script&gt;"));assert.ok(!s.includes("<script>"));
});

test("mobile activity matches reference graph and right stat timing",()=>{
 const data=summarize([{date:"2026-11-20",count:3},{date:"2026-11-21",count:1},{date:"2026-11-22",count:0}]);
 const a=buildCards(cfg,data,null),m=a["cards/activity-mobile.svg"];
 assert.equal((m.match(/class="g" style="animation-delay:/g)||[]).length,12);
 assert.ok(m.includes("animation-delay:1.9s"));
 assert.ok(m.includes("animation-delay:2.6s"));
 assert.ok(a["cards/title-coding-light-mobile.svg"].includes("animation-delay:4.4s"));
});
test("entire contact buttons bounce instead of just their labels",()=>{
 const a=cards();
 for(const id of ["portfolio","linkedin","projects","contact"]){
  const x=a["cards/footer-nav-"+id+".svg"];
  const p=x.indexOf('class="ti"'),background=x.indexOf('fill="#f3f3f1"');
  assert.ok(p>=0&&background>p,id);
  assert.ok(x.includes('class="sl"'),id);
  assert.ok(x.includes('class="ai"'),id);
  assert.ok(x.includes('class="sh"'),id);
 }
 for(const id of ["en","tr","de","ru","zh"]){
  const x=a["cards/footer-language-"+id+".svg"];
  const g=x.indexOf('class="p"'),bg=x.indexOf('fill="#f3f3f1"');
  assert.ok(g>=0&&bg>g,id);
 }
});
