import {readFileSync,writeFileSync,mkdirSync} from "node:fs";
import {resolve} from "node:path";
import {pathToFileURL} from "node:url";
const CFG=JSON.parse(readFileSync(new URL("../profile.json",import.meta.url),"utf8"));
const PAPER="#f3f3f1",INK="#111111",SOFT="#3a3a3c",MUTED="#6e6e73",BLUE="#2f55ff",RED="#ef3b2d",YELLOW="#ffc81a",W=880;
const FONTS={"serif":"Georgia, 'Times New Roman', serif","sans":"Arial, Helvetica, sans-serif","mono":"Consolas, Menlo, monospace"};
const BASE_CSS="\n@keyframes rise{0%{opacity:0;transform:translateY(12px)}100%{opacity:1;transform:none}}\n@keyframes fade{0%{opacity:0}100%{opacity:1}}\n@keyframes tilein{0%{opacity:0;transform:translateY(16px) scale(.985)}100%{opacity:1;transform:none}}\n@keyframes barin{0%{transform:scaleY(0)}100%{transform:scaleY(1)}}\n@keyframes linein{0%{opacity:.25;transform:scaleX(0)}100%{opacity:1;transform:scaleX(1)}}\n@keyframes shine{0%{transform:translateX(-220px) skewX(-18deg)}100%{transform:translateX(270px) skewX(-18deg)}}\n@keyframes glow{0%{opacity:0}35%{opacity:.55}100%{opacity:0}}\n@keyframes pulse{0%,100%{opacity:1}50%{opacity:.4}}\n@keyframes nudge{0%{opacity:0;transform:translateX(-5px)}100%{opacity:1;transform:none}}\n@keyframes nudgeup{0%{opacity:0;transform:translate(-3px,4px)}100%{opacity:1;transform:none}}\n@keyframes sheen{0%{transform:translateX(-270px) skewX(-18deg)}100%{transform:translateX(460px) skewX(-18deg)}}\n@keyframes ring{0%{opacity:.5;transform:scale(.65)}100%{opacity:0;transform:scale(1.35)}}\n@keyframes draw{0%{transform:scaleX(0);opacity:.3}100%{transform:scaleX(1);opacity:1}}\n.r,.btn-reveal,.repo-reveal,.lang-pill-reveal,.portrait-reveal{opacity:0;animation:rise .72s cubic-bezier(.22,1,.36,1) forwards}\n.f{opacity:0;animation:fade .58s ease-out forwards}\n.ti{opacity:0;animation:tilein .83s cubic-bezier(.22,1,.36,1) forwards;transform-box:fill-box;transform-origin:center}\n.ba{animation:barin .77s cubic-bezier(.22,1,.36,1) both;transform-box:fill-box;transform-origin:center bottom}\n.heat-col{opacity:0;animation:rise .46s cubic-bezier(.22,1,.36,1) forwards}\n.nav-border-reveal,.line-draw{transform:scaleX(0);transform-box:fill-box;transform-origin:left center;animation:linein .66s cubic-bezier(.22,1,.36,1) forwards}\n.shine{animation:shine 1.25s ease-in-out 1 forwards}\n.soft-glow{animation:glow 1.2s ease-out 1 forwards}\n.nu{animation:nudge .66s ease-out both}\n.nup{animation:nudgeup .66s ease-out both}\n.li{animation:pulse 1.6s ease-in-out 2}\n.sh{animation:sheen 1.25s ease-out .8s 1 forwards}\n.rg{animation:ring 1.25s ease-out .8s 1 forwards;transform-box:fill-box;transform-origin:center}\n.draw{transform:scaleX(0);transform-box:fill-box;transform-origin:left center;animation:draw .55s cubic-bezier(.22,1,.36,1) forwards}\n@media(prefers-reduced-motion:reduce){*,*::before,*::after{animation:none!important;opacity:1!important;transform:none!important}}\n";
function esc(x){return String(x).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&apos;")};
function svg(w,h,body,label){return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" role="img" aria-label="${esc(label)}"><title>${esc(label)}</title><style><![CDATA[${BASE_CSS}]]></style>${body}</svg>`};
function t(x,y,val,size,color=INK,family=FONTS.sans,extra=""){return `<text x="${x}" y="${y}" font-family="${esc(family)}" font-size="${size}" fill="${color}" ${extra}>${esc(val)}</text>`};
function r(x,y,w,h,fill,rx=0,extra=""){return `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${rx}" fill="${fill}" ${extra}/>`};
function wrapped(str,max=34){const words=String(str).split(" "),rows=[];let line="";for(const w of words){if((line+" "+w).trim().length>max&&line){rows.push(line);line=w}else line=(line+" "+w).trim()}if(line)rows.push(line);return rows};
function asciiFallback(){const out=[];for(let y=0;y<53;y++){let row="";for(let x=0;x<65;x++){let ax=(x-32)/21.5,ay=(y-23)/21,head=ax*ax+ay*ay<1,shoulder=y>39&&((x-32)/31)**2+((y-57)/18)**2<1;row+=head||shoulder?"@#*+=-:"[(x*11+y*5+x*y)%7]:" "}out.push(row)}return out};
function hero(cfg,lines){
 const rows=lines?.length?lines:asciiFallback();
 let b=`<defs><linearGradient id="title-shine" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="540" y2="0"><stop offset="0" stop-color="${INK}"/><stop offset=".39" stop-color="${INK}"/><stop offset=".50" stop-color="${BLUE}"/><stop offset=".61" stop-color="${INK}"/><stop offset="1" stop-color="${INK}"/><animateTransform attributeName="gradientTransform" type="translate" values="-530 0;530 0" dur="3.5s" begin="1.05s" repeatCount="1"/></linearGradient><clipPath id="portrait-window"><rect x="0" y="0" width="362" height="338"/></clipPath></defs>`;
 b+=r(0,0,W,420,PAPER,14);
 b+=r(48,49,8,8,BLUE,2,'class="li"');
 b+=t(66,57,cfg.eyebrow,12,MUTED,FONTS.mono,'class="f" style="animation-delay:.08s" letter-spacing=".65"');
 b+=t(44,190,cfg.first,116,INK,FONTS.serif,'class="r" style="animation-delay:.24s" letter-spacing="-2.3"');
 b+=t(44,288,cfg.last,100,"url(#title-shine)",FONTS.serif,'class="r" style="animation-delay:.43s" font-style="italic" letter-spacing="-3.2"');
 cfg.description.slice(0,2).forEach((text,i)=>b+=t(48,337+i*27,text,17,SOFT,FONTS.sans,`class="r" style="animation-delay:${(.70+i*.14).toFixed(2)}s"`));
 b+=t(48,396,cfg.url,13,INK,FONTS.mono,'class="f" style="animation-delay:1.05s"');
 b+=t(213,397,"↗",16,BLUE,FONTS.mono,'class="nup" style="animation-delay:1.10s"');
 b+='<g transform="translate(529 43) scale(.96 .99)" clip-path="url(#portrait-window)"><g class="portrait-reveal" style="animation-delay:.52s" font-family="'+FONTS.mono+'">';
 rows.slice(0,53).forEach((row,i)=>b+=`<text x="0" y="${(i+1)*6.03}" font-size="8.6" textLength="350" lengthAdjust="spacing" xml:space="preserve" fill="${INK}">${esc(row)}</text>`);
 b+='</g></g>';
 b+=`<path d="M 525 40 L 858 40" fill="none" stroke="${BLUE}" stroke-opacity=".65" stroke-width="2" class="line-draw" style="animation-delay:.75s"/>`;
 return svg(W,432,b,cfg.display_name+" — AI, cybersecurity and engineering");
};

function calendar(days){
 const map=new Map((days||[]).map(d=>[d.date,d.count]));
 const today0=new Date(),today=new Date(Date.UTC(today0.getUTCFullYear(),today0.getUTCMonth(),today0.getUTCDate()));
 const last=new Date(today);last.setUTCDate(today.getUTCDate()+(6-today.getUTCDay()+7)%7);
 const first=new Date(last);first.setUTCDate(last.getUTCDate()-370);
 const gx=44,gy=99,step=15,colors=["#e2e2de","#c8d3ff","#94a8ff","#6280ff",BLUE,"#1a3be0"];
 let b=r(0,0,W,249,PAPER,14);
 b+=t(42,61,"Every day,",34,INK,FONTS.serif,'class="r" style="animation-delay:.12s"');
 b+=t(217,61,"in blue",34,BLUE,FONTS.serif,'font-style="italic" class="r" style="animation-delay:.32s"');
 b+=t(836,60,map.size?"REFRESHED DAILY":"AWAITING FIRST SYNC",11,MUTED,FONTS.mono,'text-anchor="end"');
 let seen=new Set();
 for(let col=0;col<53;col++){
  let cells="";
  for(let row=0;row<7;row++){
   const d=new Date(first);d.setUTCDate(first.getUTCDate()+7*col+row);
   if(d>today)continue;
   const key=d.toISOString().slice(0,10),num=map.get(key);
   const level=num===undefined||num===0?0:num<=2?1:num<=5?2:num<=10?3:num<=20?4:5;
   cells+=`<rect x="${gx+col*step}" y="${gy+row*step}" width="12" height="12" rx="3" fill="${colors[level]}">${num===undefined?"":`<title>${key}: ${num} contribution(s)</title>`}</rect>`;
  }
  b+=`<g class="heat-col" style="animation-delay:${(.32+col*.014).toFixed(3)}s">${cells}</g>`;
 }
 for(let col=0;col<53;col++){
  const d=new Date(first);d.setUTCDate(first.getUTCDate()+col*7);
  const key=d.getUTCFullYear()+"-"+d.getUTCMonth();
  if(d.getUTCDate()<=7&&!seen.has(key)){
   seen.add(key);
   b+=t(gx+col*step,224,d.toLocaleString("en-US",{month:"short",timeZone:"UTC"}),11,MUTED,FONTS.mono,'class="f" style="animation-delay:.8s"');
  }
 }
 b+=t(662,243,"less",10,MUTED,FONTS.mono);
 colors.forEach((c,i)=>b+=r(700+i*15,233,11,11,c,2));
 b+=t(798,243,"more",10,MUTED,FONTS.mono);
 return svg(W,261,b,"Real GitHub contribution graph with flowing columns");
};

function activity(data){
 let b=r(0,0,W,340,PAPER,14);
 b+=t(42,57,"THE LAST 12 MONTHS ON GITHUB",12,MUTED,FONTS.mono,'class="f" style="animation-delay:.12s" letter-spacing="1"');
 if(!data?.days?.length){
  b+=t(42,122,"Syncing real activity",48,INK,FONTS.serif,'class="r" style="animation-delay:.25s" font-style="italic"');
  b+=t(42,165,"Real numbers appear after the first refresh.",15,SOFT,FONTS.sans);
  return svg(W,352,b,"Live GitHub activity awaiting refresh");
 }
 const monthly=new Map((data.monthly||[]).map(x=>[x.month,x.total])),now=new Date(),months=[];
 for(let i=11;i>=0;i--){const d=new Date(Date.UTC(now.getUTCFullYear(),now.getUTCMonth()-i,1));months.push({n:monthly.get(d.toISOString().slice(0,7))||0,label:d.toLocaleString("en-US",{month:"short",timeZone:"UTC"})})}
 const total=String(data.total_contributions);
 b+=countUp(40,115,total,"",INK,.38);
 b+=t(40+Math.min(200,total.length*31),115,"contributions",46,INK,FONTS.serif,'class="r" style="animation-delay:.42s" font-style="italic"');
 const peak=Math.max(1,...months.map(x=>x.n)),base=284;
 months.forEach((m,i)=>{
  const height=Math.max(2,140*m.n/peak),x=42+i*46;
  b+=r(x,base-height,28,height,BLUE,3,`class="ba" style="animation-delay:${(.4+i*.065).toFixed(3)}s"`);
  b+=t(x+14,309,m.label,10,MUTED,FONTS.mono,'text-anchor="middle"');
  if(m.n)b+=t(x+14,base-height-10,m.n,10,BLUE,FONTS.mono,`text-anchor="middle" class="f" style="animation-delay:${(.72+i*.065).toFixed(3)}s"`);
 });
 b+=t(649,137,data.current_streak.length+" days",40,INK,FONTS.serif,'class="r" style="animation-delay:.65s"');
 b+=t(649,164,"current streak",13,MUTED,FONTS.sans,'class="f" style="animation-delay:.84s"');
 b+=t(649,226,String(data.best_day.count),40,INK,FONTS.serif,'class="r" style="animation-delay:.83s"');
 b+=t(649,252,"busiest day · "+data.best_day.date.slice(5),13,MUTED,FONTS.sans,'class="f" style="animation-delay:1.04s"');
 return svg(W,352,b,total+" contributions in last 12 months");
};

function countUp(x,y,metric,unit,color,delay){const m=/^(\d+(?:\.\d+)?)(.*)$/.exec(metric);const base=`font-family="${esc(FONTS.serif)}" font-size="${metric.length>4?37:46}" font-style="italic" fill="${color}"`;const suffix=unit?` <tspan font-size="18">${esc(unit)}</tspan>`:"";if(!m)return `<text x="${x}" y="${y}" ${base} class="r" style="animation-delay:${delay}s">${esc(metric)}${suffix}</text>`;let out="",val=Number(m[1]),dec=(m[1].split(".")[1]||"").length;for(let i=0;i<=8;i++){let n=i===8?metric:(val*(1-Math.pow(1-i/8,3))).toFixed(dec)+m[2],start=delay+i*.11,end=delay+(i+1)*.11;out+=`<text x="${x}" y="${y}" ${base} opacity="0">${esc(n)}${suffix}<set attributeName="opacity" to="1" begin="${start.toFixed(3)}s"/>${i===8?"":`<set attributeName="opacity" to="0" begin="${end.toFixed(3)}s"/>`}</text>`}return out};
function tile(world,i){const span=W/3,gutter=i*4,cardw=span-8,col=[BLUE,RED,YELLOW][i],ink=i===2?INK:"#fff";let b=`<defs><clipPath id="card"><rect x="${gutter}" y="0" width="${cardw}" height="210" rx="14"/></clipPath><linearGradient id="gl"><stop offset="0" stop-color="#fff" stop-opacity="0"/><stop offset=".5" stop-color="#fff" stop-opacity=".28"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient></defs>`;
b+=`<g class="ti" style="animation-delay:${(.24+i*.15).toFixed(2)}s"><g clip-path="url(#card)">`+r(gutter,0,cardw,210,col,14)+`<circle class="rg" cx="${gutter+243}" cy="165" r="63" fill="none" stroke="${ink}" stroke-opacity=".55" stroke-width="1.5"/>`+r(gutter-250,-20,85,260,"url(#gl)",0,'class="sh"')+"</g>";
b+=t(gutter+23,37,world.tag,12,ink,FONTS.mono,'letter-spacing="1.15" class="f" style="animation-delay:.54s"');b+=t(gutter+255,37,"→",16,ink,FONTS.mono,'class="nu"');
b+=countUp(gutter+22,112,world.metric,world.unit,ink,(.68+i*.15));
wrapped(world.text,34).slice(0,3).forEach((x,j)=>b+=t(gutter+23,153+j*20,x,13,ink,FONTS.sans,`class="r" style="animation-delay:${(1.11+i*.15+j*.09).toFixed(2)}s"`));
b+="</g>";return svg(span,222,b,world.tag+" — "+world.text)};
function titleCard(dark){const fg=dark?"#e6edf3":INK;const b=t(2,47,"What I'm",35,fg,FONTS.serif,'class="r" style="animation-delay:.16s"')+t(184,47,"coding",35,fg,FONTS.serif,'font-style="italic" class="r" style="animation-delay:.34s"');return svg(W,64,b,"What I'm coding")};
function repo(p,i){const span=W/3,left=i*4,w=span-8;let b=r(left,0,w,190,PAPER,14);b+=`<g class="r" style="animation-delay:${((.26+i*.16)).toFixed(2)}s">`+r(left+24,29,8,8,p.color,2)+t(left+39,39,p.name,17,INK,FONTS.sans,'font-weight="bold"');
wrapped(p.description,31).slice(0,4).forEach((s,j)=>b+=t(left+24,75+j*20,s,13,SOFT,FONTS.sans));b+=t(left+24,167,p.lang+"   ·   OPEN SOURCE",11,MUTED,FONTS.mono)+"</g>";return svg(span,202,b,p.name+" — "+p.description)};

const FOOTER_FOCUS={"en":"Software engineering · AI · cybersecurity · automation","tr":"Yazılım mühendisliği · yapay zekâ · siber güvenlik · otomasyon","de":"Softwareentwicklung · KI · Cybersicherheit · Automatisierung","ru":"Разработка ПО · ИИ · кибербезопасность · автоматизация","zh":"软件工程 · 人工智能 · 网络安全 · 自动化"};
const FOOTER_LANGUAGES=[{"key":"en","label":"English","file":"README.md"},{"key":"tr","label":"Türkçe","file":"README_TR.md"},{"key":"de","label":"Deutsch","file":"README_DE.md"},{"key":"ru","label":"Русский","file":"README_RU.md"},{"key":"zh","label":"中文","file":"README_ZH.md"}];
function footerNav(link,i,mobile=false){
 const [id,url]=link;
 const label={portfolio:"Portfolio",linkedin:"LinkedIn",projects:"Projects",contact:"Contact"}[id]||id;
 const accent={portfolio:BLUE,linkedin:"#1b1b1c",projects:RED,contact:"#bd9200"}[id]||BLUE;
 const w=mobile?90:220,h=mobile?53:67,inner=mobile?86:215,cardH=mobile?47:60;
 const delay=(.26+i*.15).toFixed(2);
 const arrowX=mobile?73:190,arrowY=mobile?31:38;
 let b=`<defs><clipPath id="clip"><rect width="${inner}" height="${cardH}" rx="${mobile?8:11}"/></clipPath><linearGradient id="shimmer"><stop offset="0" stop-color="#fff" stop-opacity="0"/><stop offset=".5" stop-color="#fff" stop-opacity=".3"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient></defs>`;
 b+=r(0,0,inner,cardH,PAPER,mobile?8:11);
 b+=`<rect x=".6" y=".6" width="${inner-1.2}" height="${cardH-1.2}" rx="${mobile?7.4:10.4}" fill="none" stroke="${accent}" stroke-opacity=".35" stroke-width="1.2"/>`;
 b+=r(0,0,inner,3,accent,0,`class="nav-border-reveal" style="animation-delay:${(.20+i*.15).toFixed(2)}s"`);
 b+=`<g class="btn-reveal" style="animation-delay:${delay}s">`;
 b+=t(mobile?8:15,mobile?29:38,label,mobile?11.6:19,INK,FONTS.sans,'font-weight="600"');
 b+=`<circle cx="${arrowX}" cy="${arrowY-(mobile?5:7)}" r="${mobile?8:12}" fill="${accent}" fill-opacity=".10"/>`;
 b+=t(arrowX,arrowY,"↗",mobile?10:16,accent,FONTS.mono,'text-anchor="middle"');
 b+='</g>';
 b+=`<g clip-path="url(#clip)">${r(-220,-4,42,cardH+8,"url(#shimmer)",0,`class="shine" style="animation-delay:${(.85+i*.15).toFixed(2)}s"`)}</g>`;
 return svg(w,h,b,label+" button — "+url);
};

function footerSpecialties(locale,mobile=false){let sentence=FOOTER_FOCUS[locale]||FOOTER_FOCUS.en;if(mobile){const l={en:["Software engineering · AI","Cybersecurity · Automation"],tr:["Yazılım mühendisliği · Yapay zekâ","Siber güvenlik · Otomasyon"],de:["Softwareentwicklung · KI","Cybersicherheit · Automatisierung"],ru:["Разработка ПО · ИИ","Кибербезопасность · Автоматизация"],zh:["软件工程 · 人工智能","网络安全 · 自动化"]}[locale];let b=r(0,0,360,56,PAPER,8)+r(12,10,5,5,BLUE,2);b+=t(25,17,"FOCUS",10,MUTED,FONTS.mono)+t(12,34,l[0],locale==="ru"?11.5:13,INK,FONTS.sans,'font-weight="600"')+t(12,50,l[1],locale==="ru"?11.5:13,SOFT,FONTS.sans);return svg(360,60,b,sentence)}
let b=r(0,0,880,62,PAPER,10)+r(22,12,6,6,BLUE,2);b+=t(38,19,"FOCUS",11,MUTED,FONTS.mono)+t(22,46,sentence,locale==="zh"?23:locale==="ru"?19:20,INK,FONTS.sans,'font-weight="600"')+t(844,20,"05 LANGUAGES",10,BLUE,FONTS.mono,'text-anchor="end"');return svg(880,67,b,sentence)};

function footerLanguage(lang,i,mobile=false){
 const w=mobile?72:176,h=mobile?39:50,inner=w-(mobile?3:5);
 let b=r(0,0,inner,h-4,PAPER,mobile?7:9);
 b+=`<rect x=".7" y=".7" width="${inner-1.4}" height="${h-5.4}" rx="${mobile?6.3:8.3}" fill="none" stroke="#d1d2d4" stroke-width="1"/>`;
 b+=`<g class="lang-pill-reveal" style="animation-delay:${(.45+i*.11).toFixed(2)}s">`;
 b+=t(inner/2,mobile?24:31,lang.label,mobile?(lang.key==="ru"?10:11.7):(lang.key==="ru"?14:16),INK,FONTS.sans,'text-anchor="middle" font-weight="600"');
 b+='</g>';
 b+=r(mobile?11:24,h-7,inner-(mobile?22:48),2,BLUE,1,`class="line-draw" style="animation-delay:${(.63+i*.11).toFixed(2)}s"`);
 return svg(w,h,b,"Language button "+lang.label);
};

function mobileHero(cfg,portrait){
 const rows=portrait?.length?portrait:asciiFallback();
 let b=r(0,0,360,157,PAPER,8)+r(12,12,5,5,BLUE,2);
 b+=t(24,20,cfg.eyebrow,9,MUTED,FONTS.mono,'class="f" style="animation-delay:.08s"');
 b+=t(12,69,cfg.first,53,INK,FONTS.serif,'class="r" style="animation-delay:.23s"');
 b+=t(12,108,cfg.last,39,INK,FONTS.serif,'font-style="italic" class="r" style="animation-delay:.42s"');
 b+=t(12,131,"AI  ·  CYBERSECURITY  ·  AUTOMATION",9,SOFT,FONTS.mono,'class="r" style="animation-delay:.69s"');
 b+=t(12,147,cfg.url,10,BLUE,FONTS.mono,'class="f" style="animation-delay:.87s"');
 b+='<defs><clipPath id="mobileportrait"><rect x="0" y="0" width="115" height="130"/></clipPath></defs>';
 b+='<g transform="translate(242 18)" clip-path="url(#mobileportrait)"><g class="portrait-reveal" style="animation-delay:.48s" font-family="'+FONTS.mono+'">';
 rows.slice(6,49).forEach((row,i)=>b+=`<text x="0" y="${(i+1)*3.02}" font-size="3.6" textLength="114" lengthAdjust="spacing" fill="${INK}" opacity=".78" xml:space="preserve">${esc(row)}</text>`);
 b+='</g></g>';
 return svg(360,163,b,cfg.display_name+" compact animated portrait");
};

function mobileHeatmap(days){
 const map=new Map((days||[]).map(d=>[d.date,d.count]));
 const colors=["#e2e2de","#c8d3ff","#94a8ff","#6280ff",BLUE,"#1a3be0"];
 let b=r(0,0,360,115,PAPER,8)+t(12,24,"Every day,",22,INK,FONTS.serif,'class="r" style="animation-delay:.1s"')+t(117,24,"in blue",22,BLUE,FONTS.serif,'font-style="italic" class="r" style="animation-delay:.27s"');
 const now=new Date(),today=new Date(Date.UTC(now.getUTCFullYear(),now.getUTCMonth(),now.getUTCDate()));
 const last=new Date(today);last.setUTCDate(today.getUTCDate()+(6-today.getUTCDay()+7)%7);
 const first=new Date(last);first.setUTCDate(last.getUTCDate()-370);
 for(let col=0;col<53;col++){
  let cells="";
  for(let row=0;row<7;row++){
   const d=new Date(first);d.setUTCDate(first.getUTCDate()+col*7+row);
   if(d>today)continue;
   const n=map.get(d.toISOString().slice(0,10)),level=n===undefined||n===0?0:n<=2?1:n<=5?2:n<=10?3:n<=20?4:5;
   cells+=r(14+col*6.2,42+row*8.1,5.3,6.1,colors[level],1.2);
  }
  b+=`<g class="heat-col" style="animation-delay:${(.25+col*.012).toFixed(3)}s">${cells}</g>`;
 }
 b+=t(14,106,map.size?"GITHUB  /  LAST 12 MONTHS":"AWAITING DATA SYNC",9,MUTED,FONTS.mono,'class="f" style="animation-delay:.70s"');
 return svg(360,121,b,"Compact animated GitHub heatmap");
};

function mobileActivity(data){
 let b=r(0,0,360,125,PAPER,8)+t(13,20,"GITHUB ACTIVITY  /  12 MONTHS",10,MUTED,FONTS.mono,'class="f" style="animation-delay:.12s"');
 if(!data?.days?.length){b+=t(13,64,"Syncing activity",29,INK,FONTS.serif,'class="r" style="animation-delay:.35s"');return svg(360,131,b,"Mobile GitHub activity awaiting data")}
 const total=Number(data.total_contributions||0),streak=Number(data.current_streak?.length||0),months=(data.monthly||[]).slice(-12);
 b+=t(13,63,total.toLocaleString("en-US"),43,INK,FONTS.serif,'class="r" style="animation-delay:.28s"');
 b+=t(14,82,"contributions",13,SOFT,FONTS.sans,'class="f" style="animation-delay:.52s"');
 b+=t(196,59,streak+" days",25,INK,FONTS.serif,'class="r" style="animation-delay:.43s"');
 b+=t(198,78,"current streak",11,MUTED,FONTS.sans,'class="f" style="animation-delay:.6s"');
 const max=Math.max(1,...months.map(m=>m.total));
 for(let i=0;i<12;i++){const height=Math.max(2,19*(months[i]?.total||0)/max);b+=r(14+i*27.6,114-height,16,height,BLUE,2,`class="ba" style="animation-delay:${(.38+i*.06).toFixed(2)}s"`)}
 b+=t(345,122,"MONTHLY",9,MUTED,FONTS.mono,'text-anchor="end"');
 return svg(360,131,b,"Compact animated GitHub activity "+total);
};

function mobileTile(p,i){
 const bg=[BLUE,RED,YELLOW][i],ink=i===2?INK:"#fff";
 let b='<g class="ti" style="animation-delay:'+(.23+i*.14).toFixed(2)+'s">';
 b+=r(0,0,111,64,bg,8);
 b+=t(9,16,p.tag,10,ink,FONTS.mono,'font-weight="600"');
 b+=t(9,41,p.metric,24,ink,FONTS.serif,'font-style="italic"');
 b+=t(9,57,p.unit.slice(0,15),9.5,ink,FONTS.sans);
 b+=t(100,16,"↗",11,ink,FONTS.mono,'text-anchor="end"');
 b+='</g>';
 return svg(116,69,b,"Animated mobile "+p.tag+" card");
};

function mobileRepo(p,i=0){
 let b='<g class="repo-reveal" style="animation-delay:'+(.25+i*.15).toFixed(2)+'s">';
 b+=r(0,0,111,61,PAPER,8)+r(9,10,7,7,p.color,2);
 b+=t(9,35,p.name,p.name.length>12?10:12,INK,FONTS.sans,'font-weight="600"');
 b+=t(9,52,p.lang,10,MUTED,FONTS.mono);
 b+=t(101,52,"↗",12,BLUE,FONTS.mono,'text-anchor="end"');
 b+='</g>';
 return svg(116,66,b,"Animated mobile repository "+p.name);
};

function mobileTitle(dark){
 const ink=dark?"#e6edf3":INK;
 const body=t(9,29,"What I'm",23,ink,FONTS.serif,'class="r" style="animation-delay:.15s"')+t(122,29,"coding",23,ink,FONTS.serif,'font-style="italic" class="r" style="animation-delay:.35s"');
 return svg(360,38,body,"Animated mobile coding section");
};

function buildCards(cfg,data,portrait){
 const a={"cards/hero.svg":hero(cfg,portrait),"cards/hero-mobile.svg":mobileHero(cfg,portrait),
 "cards/heatmap.svg":calendar(data?.days),"cards/heatmap-mobile.svg":mobileHeatmap(data?.days),
 "cards/activity.svg":activity(data),"cards/activity-mobile.svg":mobileActivity(data),
 "cards/title-coding-light.svg":titleCard(false),"cards/title-coding-dark.svg":titleCard(true),
 "cards/title-coding-light-mobile.svg":mobileTitle(false),"cards/title-coding-dark-mobile.svg":mobileTitle(true),
 };
 cfg.tiles.forEach((p,i)=>{a["cards/"+p.id+".svg"]=tile(p,i);a["cards/"+p.id+"-mobile.svg"]=mobileTile(p,i)});
 cfg.projects.forEach((p,i)=>{a["cards/repo-"+p.name+".svg"]=repo(p,i);a["cards/repo-"+p.name+"-mobile.svg"]=mobileRepo(p,i)});
 cfg.links.forEach((p,i)=>{a["cards/footer-nav-"+p[0]+".svg"]=footerNav(p,i);a["cards/footer-nav-"+p[0]+"-mobile.svg"]=footerNav(p,i,true)});
 FOOTER_LANGUAGES.forEach((p,i)=>{a["cards/footer-language-"+p.key+".svg"]=footerLanguage(p,i);a["cards/footer-language-"+p.key+"-mobile.svg"]=footerLanguage(p,i,true)});
 return a;
};

function summarize(days){if(!days?.length)throw new Error("Empty contribution series");days=[...days].map(d=>({date:d.date,count:Number(d.count)})).sort((a,b)=>a.date.localeCompare(b.date));if(days.some(d=>!Number.isFinite(d.count)||d.count<0))throw new Error("Invalid contributions");let monthly=new Map(),max={date:"",count:-1},run=0,longest=0;for(const d of days){const m=d.date.slice(0,7);monthly.set(m,(monthly.get(m)||0)+d.count);if(d.count>max.count)max=d;run=d.count>0?run+1:0;longest=Math.max(longest,run)}let idx=days.length-1;const today=new Date().toISOString().slice(0,10);if(days[idx].count===0&&days[idx].date>=new Date(Date.now()-86400000).toISOString().slice(0,10))idx--;let current=0;if(idx>=0&&days[idx].date>=new Date(Date.now()-86400000).toISOString().slice(0,10))for(let i=idx;i>=0&&days[i].count>0;i--)current++;return{days,monthly:[...monthly].map(([month,total])=>({month,total})),total_contributions:days.reduce((a,b)=>a+b.count,0),best_day:max,current_streak:{length:current},longest_streak:{length:longest},updated_at:new Date().toISOString()}};
export {buildCards,summarize,asciiFromGrayscale};
async function fetchContributions(){
 const token=process.env.GITHUB_TOKEN;if(!token)throw new Error("GITHUB_TOKEN not provided");
 const now=new Date(),from=new Date(now.getTime()-364*86400000);
 const query="query($login:String!,$from:DateTime!,$to:DateTime!){user(login:$login){contributionsCollection(from:$from,to:$to){contributionCalendar{totalContributions weeks{contributionDays{date contributionCount}}}}}}";
 const res=await fetch("https://api.github.com/graphql",{method:"POST",headers:{"Authorization":"Bearer "+token,"Accept":"application/vnd.github+json","User-Agent":"yusuf-animated-readme"},body:JSON.stringify({query,variables:{login:"yusufaliaskin",from:from.toISOString(),to:now.toISOString()}})});
 if(!res.ok)throw new Error("GraphQL status "+res.status);const out=await res.json();if(out.errors)throw new Error(JSON.stringify(out.errors));
 const cal=out?.data?.user?.contributionsCollection?.contributionCalendar;if(!cal?.weeks?.length)throw new Error("No contribution calendar");
 const days=cal.weeks.flatMap(w=>w.contributionDays.map(d=>({date:d.date,count:d.contributionCount})));
 return summarize(days);
}
function asciiFromGrayscale(pixels,width,height){
 if(!Number.isInteger(width)||!Number.isInteger(height)||width<1||height<1||pixels.length!==width*height)throw new Error("Invalid portrait pixels");
 const ramp="@%#*+=-:. ",rows=[];
 for(let y=0;y<height;y++){
  let row="";
  for(let x=0;x<width;x++){
   const at=(xx,yy)=>pixels[Math.max(0,Math.min(height-1,yy))*width+Math.max(0,Math.min(width-1,xx))];
   const light=at(x,y);
   const edge=Math.abs(at(x-1,y)-at(x+1,y))*.43+Math.abs(at(x,y-1)-at(x,y+1))*.43;
   const detail=Math.min(43,edge*.40);
   const adjusted=Math.max(0,Math.min(255,light-detail));
   const idx=Math.max(0,Math.min(ramp.length-1,Math.round(adjusted*(ramp.length-1)/255)));
   row+=ramp[idx];
  }
  rows.push(row);
 }
 return rows;
};
async function fetchPortrait(){
 return (async ()=>{
  try{
   const res=await fetch("https://github.com/yusufaliaskin.png?size=768",{headers:{"User-Agent":"yusuf-animated-github-profile"}});
   if(!res.ok)throw new Error("GitHub avatar status "+res.status);
   const input=Buffer.from(await res.arrayBuffer());
   const {default:sharp}=await import("sharp");
   const {data,info}=await sharp(input).rotate()
    .resize(65,53,{fit:"cover",position:"attention"})
    .grayscale().normalize().gamma(1.15).sharpen()
    .raw().toBuffer({resolveWithObject:true});
   if(info.channels!==1)throw new Error("Expected grayscale portrait");
   return asciiFromGrayscale(data,info.width,info.height);
  }catch(e){console.warn("Avatar refresh failed, preserving existing portrait:",e.message);return null}
 })();
};

async function main(){
 const root=resolve(import.meta.dirname||".","..");
 const live=process.argv.includes("--live");const dataPath=resolve(root,"data/contributions.json");
 let data=null;try{data=JSON.parse(readFileSync(dataPath,"utf8"))}catch{}
 if(live){data=await fetchContributions();mkdirSync(resolve(root,"data"),{recursive:true});writeFileSync(dataPath,JSON.stringify(data,null,2)+"\n");}
 let portrait=null;try{portrait=JSON.parse(readFileSync(resolve(root,"data/portrait_ascii.json"),"utf8"))}catch{}
 if(live){const latest=await fetchPortrait();if(latest){portrait=latest;writeFileSync(resolve(root,"data/portrait_ascii.json"),JSON.stringify(latest)+"\n")}}
 const cards=buildCards(CFG,data,portrait);for(const [name,content] of Object.entries(cards)){const dest=resolve(root,name);mkdirSync(resolve(root,"cards"),{recursive:true});writeFileSync(dest,content)}console.log("Rendered",Object.keys(cards).length,"SVG cards; live data:",!!data?.days);
}
if(process.argv[1]&&import.meta.url===pathToFileURL(resolve(process.argv[1])).href){main().catch(e=>{console.error(e);process.exitCode=1})}