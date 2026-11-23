import {readFileSync,writeFileSync,mkdirSync} from "node:fs";
import {resolve} from "node:path";
import {pathToFileURL} from "node:url";
const CFG=JSON.parse(readFileSync(new URL("../profile.json",import.meta.url),"utf8"));
const PAPER="#f3f3f1",INK="#111111",SOFT="#3a3a3c",MUTED="#6e6e73",BLUE="#2f55ff",RED="#ef3b2d",YELLOW="#ffc81a",W=880;
const FONTS={"serif":"Georgia, 'Times New Roman', serif","sans":"Arial, Helvetica, sans-serif","mono":"Consolas, Menlo, monospace"};
const BASE_CSS="\n@keyframes rise{0%{opacity:0;transform:translateY(18px)}100%{opacity:1;transform:none}}\n@keyframes fade{0%{opacity:0}100%{opacity:1}}\n@keyframes tilein{0%{opacity:0;transform:translateY(90px) scale(.6) rotate(-9deg)}55%{opacity:1;transform:translateY(-11px) scale(1.045) rotate(2deg)}75%{transform:translateY(3px) scale(.98) rotate(-.8deg)}100%{opacity:1;transform:none}}\n@keyframes barin{0%{transform:scaleY(0)}100%{transform:scaleY(1)}}\n@keyframes pulse{0%,100%{opacity:1}50%{opacity:.22}}\n@keyframes nudge{0%,100%{transform:none}50%{transform:translateX(5px)}}\n@keyframes nudgeup{0%,100%{transform:none}50%{transform:translate(3px,-3px)}}\n@keyframes sheen{0%,10%{transform:translateX(-270px) skewX(-18deg)}48%,100%{transform:translateX(450px) skewX(-18deg)}}\n@keyframes ring{0%{opacity:.8;transform:scale(.25)}100%{opacity:0;transform:scale(2.25)}}\n@keyframes rotatein{0%{opacity:0;transform:translateX(-20px) rotate(-4deg)}100%{opacity:1;transform:none}}\n@keyframes blink{0%,49%{opacity:1}50%,100%{opacity:.12}}\n@keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-3px)}}\n.r{opacity:0;animation:rise .82s cubic-bezier(.18,.8,.23,1) forwards}\n.f{opacity:0;animation:fade .72s ease forwards}\n.ti{opacity:0;animation:tilein 1.1s cubic-bezier(.19,.9,.23,1) forwards;transform-origin:center center}\n.ba{animation:barin .8s cubic-bezier(.18,.9,.27,1) both;transform-box:fill-box;transform-origin:center bottom}\n.nu{animation:nudge 1.2s ease-in-out 1}\n.nup{animation:nudgeup 1.2s ease-in-out 1}\n.li{animation:pulse 1.6s ease-in-out 2}\n.sh{animation:sheen 1.5s ease-out 1.2s 1}\n.rg{animation:ring 1.5s ease-out 1;transform-box:fill-box;transform-origin:center}\n.fl{animation:float 2.5s ease-in-out 2}\n@media(prefers-reduced-motion:reduce){*,*::before,*::after{animation:none!important;opacity:1!important;transform:none!important}}\n";
function esc(x){return String(x).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&apos;")};
function svg(w,h,body,label){return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" role="img" aria-label="${esc(label)}"><title>${esc(label)}</title><style><![CDATA[${BASE_CSS}]]></style>${body}</svg>`};
function t(x,y,val,size,color=INK,family=FONTS.sans,extra=""){return `<text x="${x}" y="${y}" font-family="${esc(family)}" font-size="${size}" fill="${color}" ${extra}>${esc(val)}</text>`};
function r(x,y,w,h,fill,rx=0,extra=""){return `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${rx}" fill="${fill}" ${extra}/>`};
function wrapped(str,max=34){const words=String(str).split(" "),rows=[];let line="";for(const w of words){if((line+" "+w).trim().length>max&&line){rows.push(line);line=w}else line=(line+" "+w).trim()}if(line)rows.push(line);return rows};
function asciiFallback(){const out=[];for(let y=0;y<53;y++){let row="";for(let x=0;x<65;x++){let ax=(x-32)/21.5,ay=(y-23)/21,head=ax*ax+ay*ay<1,shoulder=y>39&&((x-32)/31)**2+((y-57)/18)**2<1;row+=head||shoulder?"@#*+=-:"[(x*11+y*5+x*y)%7]:" "}out.push(row)}return out};
function hero(cfg,lines){const rows=lines?.length?lines:asciiFallback();let b=`<defs><linearGradient id="title-shine" gradientUnits="userSpaceOnUse" x1="10" y1="0" x2="580" y2="0"><stop offset="0" stop-color="${INK}"/><stop offset=".42" stop-color="${INK}"/><stop offset=".50" stop-color="${BLUE}"/><stop offset=".58" stop-color="${INK}"/><stop offset="1" stop-color="${INK}"/><animateTransform attributeName="gradientTransform" type="translate" values="-580 0;580 0;580 0" keyTimes="0;.46;1" dur="7s" begin="1.3s" repeatCount="indefinite"/></linearGradient><clipPath id="portrait-window">${r(0,0,365,335,"#fff",0)}</clipPath></defs>`;
b+=r(0,0,W,420,PAPER,14);b+=r(48,49,8,8,BLUE,2,'class="li"');
b+=t(66,57,cfg.eyebrow,12,MUTED,FONTS.mono,'class="f" style="animation-delay:.1s" letter-spacing=".65"');
b+=t(44,190,cfg.first,116,INK,FONTS.serif,'class="r" style="animation-delay:.15s" letter-spacing="-2.3"');
b+=t(44,288,cfg.last,100,"url(#title-shine)",FONTS.serif,'class="r" style="animation-delay:.29s" font-style="italic" letter-spacing="-3.2"');
cfg.description.slice(0,2).forEach((s,i)=>b+=t(48,337+i*27,s,17,SOFT,FONTS.sans,`class="r" style="animation-delay:${.58+i*.12}s"`));
b+=t(48,396,cfg.url,13,INK,FONTS.mono,'class="f" style="animation-delay:.95s"');
b+=t(213,397,"↗",16,BLUE,FONTS.mono,'class="nup"');
b+=`<g transform="translate(529 43) scale(.96 .99)" clip-path="url(#portrait-window)" font-family="${FONTS.mono}">`;
rows.slice(0,53).forEach((row,i)=>{b+=`<text x="0" y="${(i+1)*6.03}" font-size="8.6" textLength="350" lengthAdjust="spacing" xml:space="preserve" fill="${INK}" class="f" style="animation-delay:${(.24+i*.019).toFixed(3)}s;animation-duration:.4s">${esc(row)}</text>`});b+="</g>";
return svg(W,432,b,cfg.display_name+" — software engineering, AI and security")};
function calendar(days){let b=r(0,0,W,249,PAPER,14),gx=44,gy=99,step=15,cell=12;const map=new Map((days||[]).map(d=>[d.date,d.count]));let now=new Date(),today=new Date(Date.UTC(now.getUTCFullYear(),now.getUTCMonth(),now.getUTCDate()));let nextSat=new Date(today);nextSat.setUTCDate(today.getUTCDate()+(6-today.getUTCDay()+7)%7);let first=new Date(nextSat);first.setUTCDate(nextSat.getUTCDate()-370);let colors=["#e2e2de","#c8d3ff","#94a8ff","#6280ff",BLUE,"#1a3be0"];b+=t(42,61,"Every day,",34,INK,FONTS.serif,'class="r" style="animation-delay:.3s"');b+=t(217,61,"in blue",34,BLUE,FONTS.serif,'font-style="italic" class="r" style="animation-delay:.43s"');b+=t(836,60,map.size?"REFRESHED DAILY":"AWAITING FIRST SYNC",11,MUTED,FONTS.mono,'text-anchor="end" letter-spacing=".6"');
let seen=new Set();
for(let col=0;col<53;col++){for(let row=0;row<7;row++){let d=new Date(first);d.setUTCDate(first.getUTCDate()+7*col+row);if(d>today)continue;const day=d.toISOString().slice(0,10);const n=map.get(day),i=n===undefined?0:n===0?0:n<=2?1:n<=5?2:n<=10?3:n<=20?4:5;const tag=n===undefined?"":`<title>${day}: ${n} contribution${n===1?"":"s"}</title>`;b+=`<rect x="${gx+col*step}" y="${gy+row*step}" width="${cell}" height="${cell}" rx="3" fill="${colors[i]}" >${tag}</rect>`}}
for(let col=0;col<53;col++){const d=new Date(first);d.setUTCDate(first.getUTCDate()+col*7);const key=d.getUTCFullYear()+"-"+d.getUTCMonth();if(d.getUTCDate()<=7&&!seen.has(key)){seen.add(key);b+=t(gx+col*step,224,d.toLocaleString("en-US",{month:"short",timeZone:"UTC"}),11,MUTED,FONTS.mono)}}
b+=t(662,243,"less",10,MUTED,FONTS.mono);colors.forEach((c,i)=>b+=r(700+i*15,233,11,11,c,2));b+=t(798,243,"more",10,MUTED,FONTS.mono);
return svg(W,261,b,"Real GitHub contribution calendar — daily refresh")};
function activity(data){let b=r(0,0,W,340,PAPER,14);b+=t(42,57,"THE LAST 12 MONTHS ON GITHUB",12,MUTED,FONTS.mono,'letter-spacing="1" class="f" style="animation-delay:.15s"');if(!data?.days?.length){b+=t(41,122,"Syncing real activity",51,INK,FONTS.serif,'font-style="italic" class="r" style="animation-delay:.2s"');b+=t(43,163,"Real numbers appear after the first scheduled refresh.",15,SOFT,FONTS.sans);for(let i=0;i<12;i++)b+=r(45+i*46,261,24,26,"#e2e2de",4,'class="ba"');b+=t(652,140,"—",42,INK,FONTS.serif);b+=t(652,164,"current streak",13,MUTED);b+=t(652,230,"—",42,INK,FONTS.serif);b+=t(652,252,"busiest day",13,MUTED);return svg(W,352,b,"Activity data is not available until first sync")}
const total=data.total_contributions;const mt=new Map((data.monthly||[]).map(x=>[x.month,x.total]));let now=new Date(),months=[];for(let i=11;i>=0;i--){let d=new Date(Date.UTC(now.getUTCFullYear(),now.getUTCMonth()-i,1)),key=d.toISOString().slice(0,7);months.push({key,n:mt.get(key)||0,label:d.toLocaleString("en-US",{month:"short",timeZone:"UTC"})})}
b+=t(40,115,total.toLocaleString("en-US"),52,INK,FONTS.serif,'class="r" style="animation-delay:.34s"');b+=t(40+Math.min(215,String(total).length*30),115,"contributions",49,INK,FONTS.serif,'font-style="italic" class="r" style="animation-delay:.52s"');
const peak=Math.max(...months.map(x=>x.n),1),base=284;
months.forEach((m,i)=>{let h=Math.max(2,140*m.n/peak),x=42+i*46;b+=r(x,base-h,28,h,BLUE,3,`class="ba" style="animation-delay:${(.55+i*.09).toFixed(2)}s"`);b+=t(x+14,309,m.label,10,MUTED,FONTS.mono,'text-anchor="middle"');if(m.n)b+=t(x+14,base-h-10,m.n,10,BLUE,FONTS.mono,`text-anchor="middle" class="f" style="animation-delay:${(1.05+i*.09).toFixed(2)}s"`)}); 
b+=t(649,137,data.current_streak.length+" days",41,INK,FONTS.serif,'class="r" style="animation-delay:1.4s"');b+=t(649,164,"current streak",13,MUTED);
b+=t(649,226,String(data.best_day.count),41,INK,FONTS.serif,'class="r" style="animation-delay:1.55s"');b+=t(649,252,"busiest day · "+data.best_day.date.slice(5),13,MUTED);
return svg(W,352,b,`${total} contributions in the last 12 months`)};
function countUp(x,y,metric,unit,color,delay){const m=/^(\d+(?:\.\d+)?)(.*)$/.exec(metric);const base=`font-family="${esc(FONTS.serif)}" font-size="${metric.length>4?37:46}" font-style="italic" fill="${color}"`;const suffix=unit?` <tspan font-size="18">${esc(unit)}</tspan>`:"";if(!m)return `<text x="${x}" y="${y}" ${base} class="r" style="animation-delay:${delay}s">${esc(metric)}${suffix}</text>`;let out="",val=Number(m[1]),dec=(m[1].split(".")[1]||"").length;for(let i=0;i<=8;i++){let n=i===8?metric:(val*(1-Math.pow(1-i/8,3))).toFixed(dec)+m[2],start=delay+i*.115,end=delay+(i+1)*.115;out+=`<text x="${x}" y="${y}" ${base} opacity="0">${esc(n)}${suffix}<set attributeName="opacity" to="1" begin="${start.toFixed(3)}s"/>${i===8?"":`<set attributeName="opacity" to="0" begin="${end.toFixed(3)}s"/>`}</text>`}return out};
function tile(world,i){const span=W/3,gutter=i*4,cardw=span-8,col=[BLUE,RED,YELLOW][i],ink=i===2?INK:"#fff";let b=`<defs><clipPath id="card"><rect x="${gutter}" y="0" width="${cardw}" height="210" rx="14"/></clipPath><linearGradient id="gl"><stop offset="0" stop-color="#fff" stop-opacity="0"/><stop offset=".5" stop-color="#fff" stop-opacity=".28"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient></defs>`;
b+=`<g class="ti" style="animation-delay:${(2.2+i*.23).toFixed(2)}s"><g clip-path="url(#card)">`+r(gutter,0,cardw,210,col,14)+`<circle class="rg" cx="${gutter+243}" cy="165" r="63" fill="none" stroke="${ink}" stroke-opacity=".55" stroke-width="1.5"/>`+r(gutter-250,-20,85,260,"url(#gl)",0,'class="sh"')+"</g>";
b+=t(gutter+23,37,world.tag,12,ink,FONTS.mono,'letter-spacing="1.15" class="f" style="animation-delay:2.7s"');b+=t(gutter+255,37,"→",16,ink,FONTS.mono,'class="nu"');
b+=countUp(gutter+22,112,world.metric,world.unit,ink,2.85+i*.22);
wrapped(world.text,34).slice(0,3).forEach((x,j)=>b+=t(gutter+23,153+j*20,x,13,ink,FONTS.sans,`class="r" style="animation-delay:${(3.2+i*.23+j*.12).toFixed(2)}s"`));
b+="</g>";return svg(span,222,b,world.tag+" — "+world.text)};
function titleCard(dark){const fg=dark?"#e6edf3":INK;const b=t(2,47,"What I'm",35,fg,FONTS.serif,'class="r" style="animation-delay:4.15s"')+t(184,47,"coding",35,fg,FONTS.serif,'font-style="italic" class="r" style="animation-delay:4.32s"');return svg(W,64,b,"What I'm coding")};
function repo(p,i){const span=W/3,left=i*4,w=span-8;let b=r(left,0,w,190,PAPER,14);b+=`<g class="r" style="animation-delay:${(4.65+i*.16).toFixed(2)}s">`+r(left+24,29,8,8,p.color,2)+t(left+39,39,p.name,17,INK,FONTS.sans,'font-weight="bold"');
wrapped(p.description,31).slice(0,4).forEach((s,j)=>b+=t(left+24,75+j*20,s,13,SOFT,FONTS.sans));b+=t(left+24,167,p.lang+"   ·   OPEN SOURCE",11,MUTED,FONTS.mono)+"</g>";return svg(span,202,b,p.name+" — "+p.description)};

const FOOTER_FOCUS={"en":"Software engineering · AI · cybersecurity · automation","tr":"Yazılım mühendisliği · yapay zekâ · siber güvenlik · otomasyon","de":"Softwareentwicklung · KI · Cybersicherheit · Automatisierung","ru":"Разработка ПО · ИИ · кибербезопасность · автоматизация","zh":"软件工程 · 人工智能 · 网络安全 · 自动化"};
const FOOTER_LANGUAGES=[{"key":"en","label":"English","file":"README.md"},{"key":"tr","label":"Türkçe","file":"README_TR.md"},{"key":"de","label":"Deutsch","file":"README_DE.md"},{"key":"ru","label":"Русский","file":"README_RU.md"},{"key":"zh","label":"中文","file":"README_ZH.md"}];
function footerHeading(cfg,mobile=false){
 const w=mobile?360:880,h=mobile?63:80;
 let b=r(0,0,w,h-5,PAPER,mobile?9:12);
 b+=r(mobile?12:23,mobile?12:16,6,6,BLUE,2);
 b+=t(mobile?26:39,mobile?19:24,"OUTSIDE GITHUB  /  "+cfg.first.toUpperCase(),mobile?10:11,MUTED,FONTS.mono,'letter-spacing=".8"');
 b+=t(mobile?13:25,mobile?46:62,"Elsewhere on the web.",mobile?23:37,INK,FONTS.serif,'font-style="italic" class="r" style="animation-delay:.18s"');
 if(!mobile)b+=t(834,61,"LINKS  ↗",12,BLUE,FONTS.mono,'text-anchor="end"');
 return svg(w,h,b,"Personal links for "+cfg.display_name);
};

function footerNav(link,i,mobile=false){
 const [id,url]=link,names={portfolio:"Portfolio",linkedin:"LinkedIn",projects:"Projects",contact:"Email"};
 const cols={portfolio:BLUE,linkedin:INK,projects:RED,contact:"#B58A00"},accent=cols[id]||BLUE;
 const w=mobile?90:220,h=mobile?41:49,innerW=mobile?86:214;
 let b=r(0,0,innerW,h-4,PAPER,mobile?7:9);
 b+=r(0,0,innerW,mobile?2:3,accent);
 b+=t(mobile?8:15,mobile?26:29,names[id]||id,mobile?11:16,INK,FONTS.sans,'font-weight="600" class="r" style="animation-delay:.16s"');
 b+=t(mobile?80:201,mobile?26:29,"↗",mobile?12:16,accent,FONTS.mono,'text-anchor="end"');
 return svg(w,h,b,(names[id]||id)+" link "+url);
};

function footerSpecialties(locale,mobile=false){let sentence=FOOTER_FOCUS[locale]||FOOTER_FOCUS.en;if(mobile){const l={en:["Software engineering · AI","Cybersecurity · Automation"],tr:["Yazılım mühendisliği · Yapay zekâ","Siber güvenlik · Otomasyon"],de:["Softwareentwicklung · KI","Cybersicherheit · Automatisierung"],ru:["Разработка ПО · ИИ","Кибербезопасность · Автоматизация"],zh:["软件工程 · 人工智能","网络安全 · 自动化"]}[locale];let b=r(0,0,360,56,PAPER,8)+r(12,10,5,5,BLUE,2);b+=t(25,17,"FOCUS",10,MUTED,FONTS.mono)+t(12,34,l[0],locale==="ru"?11.5:13,INK,FONTS.sans,'font-weight="600"')+t(12,50,l[1],locale==="ru"?11.5:13,SOFT,FONTS.sans);return svg(360,60,b,sentence)}
let b=r(0,0,880,62,PAPER,10)+r(22,12,6,6,BLUE,2);b+=t(38,19,"FOCUS",11,MUTED,FONTS.mono)+t(22,46,sentence,locale==="zh"?23:locale==="ru"?19:20,INK,FONTS.sans,'font-weight="600"')+t(844,20,"05 LANGUAGES",10,BLUE,FONTS.mono,'text-anchor="end"');return svg(880,67,b,sentence)};

function footerLanguage(lang,i,mobile=false){
 const w=mobile?72:176,h=mobile?36:43,innerW=mobile?68:171;
 let b=r(0,0,innerW,h-4,PAPER,mobile?7:8);
 b+=r(7,4,innerW-14,1.5,BLUE);
 b+=t(innerW/2,mobile?23:27,lang.label,mobile?(lang.key==="ru"?10:11):(lang.key==="ru"?14:16),INK,FONTS.sans,'text-anchor="middle" font-weight="600" class="f" style="animation-delay:.2s"');
 return svg(w,h,b,"Read profile in "+lang.label);
};

function mobileFooterHeading(cfg){let b=r(0,0,360,43,PAPER,8)+r(12,9,5,5,BLUE,2);b+=t(25,16,"CONNECT",9,MUTED,FONTS.mono)+t(12,35,"Let's connect.",25,INK,FONTS.serif,'font-style="italic"')+t(347,34,cfg.first.toUpperCase(),10,BLUE,FONTS.mono,'text-anchor="end"');return svg(360,47,b,"Compact contact header")};
function mobileHero(cfg,portrait){
 const lines=portrait?.length?portrait:asciiFallback();
 let b=r(0,0,360,157,PAPER,8)+r(12,12,5,5,BLUE,2);
 b+=t(24,20,cfg.eyebrow,9,MUTED,FONTS.mono);
 b+=t(12,69,cfg.first,53,INK,FONTS.serif,'class="r" style="animation-delay:.15s"');
 b+=t(12,108,cfg.last,39,INK,FONTS.serif,'font-style="italic" class="r" style="animation-delay:.3s"');
 b+=t(12,131,"AI  ·  CYBERSECURITY  ·  AUTOMATION",9,SOFT,FONTS.mono);
 b+=t(12,147,cfg.url,10,BLUE,FONTS.mono);
 b+='<defs><clipPath id="mobileportrait"><rect x="0" y="0" width="115" height="130"/></clipPath></defs>';
 b+='<g transform="translate(242 18)" clip-path="url(#mobileportrait)" font-family="'+FONTS.mono+'">';
 lines.slice(6,49).forEach((line,i)=>{b+=`<text x="0" y="${(i+1)*3.02}" font-size="3.6" textLength="114" lengthAdjust="spacing" fill="${INK}" opacity=".72" xml:space="preserve">${esc(line)}</text>`});
 b+='</g>';
 return svg(360,163,b,cfg.display_name+" mobile engineer profile");
};
function mobileHeatmap(days){
 const map=new Map((days||[]).map(d=>[d.date,d.count]));
 const colors=["#e2e2de","#c8d3ff","#94a8ff","#6280ff",BLUE,"#1a3be0"];
 let b=r(0,0,360,115,PAPER,8)+t(12,24,"Every day,",22,INK,FONTS.serif)+t(117,24,"in blue",22,BLUE,FONTS.serif,'font-style="italic"');
 const today=new Date(),current=new Date(Date.UTC(today.getUTCFullYear(),today.getUTCMonth(),today.getUTCDate()));
 const lastSat=new Date(current);lastSat.setUTCDate(current.getUTCDate()+(6-current.getUTCDay()+7)%7);
 const first=new Date(lastSat);first.setUTCDate(lastSat.getUTCDate()-370);
 for(let col=0;col<53;col++)for(let row=0;row<7;row++){
  const d=new Date(first);d.setUTCDate(first.getUTCDate()+col*7+row);if(d>current)continue;
  const n=map.get(d.toISOString().slice(0,10)),level=n===undefined||n===0?0:n<=2?1:n<=5?2:n<=10?3:n<=20?4:5;
  b+=r(14+col*6.2,42+row*8.1,5.3,6.1,colors[level],1.2);
 }
 b+=t(14,106,map.size?"GITHUB  /  LAST 12 MONTHS":"AWAITING DATA SYNC",9,MUTED,FONTS.mono);
 return svg(360,121,b,"Compact real GitHub contribution graph");
};
function mobileActivity(data){
 let b=r(0,0,360,125,PAPER,8)+t(13,20,"GITHUB ACTIVITY  /  12 MONTHS",10,MUTED,FONTS.mono);
 if(!data?.days?.length){b+=t(13,64,"Syncing activity",29,INK,FONTS.serif);return svg(360,131,b,"GitHub activity awaiting sync")}
 const total=Number(data.total_contributions||0),streak=Number(data.current_streak?.length||0),months=(data.monthly||[]).slice(-12);
 b+=t(13,63,total.toLocaleString("en-US"),43,INK,FONTS.serif,'class="r" style="animation-delay:.2s"')+t(14,82,"contributions",13,SOFT,FONTS.sans);
 b+=t(196,59,streak+" days",25,INK,FONTS.serif)+t(198,78,"current streak",11,MUTED,FONTS.sans);
 const max=Math.max(1,...months.map(m=>m.total));
 for(let i=0;i<12;i++){const h=Math.max(2,19*(months[i]?.total||0)/max);b+=r(14+i*27.6,114-h,16,h,BLUE,2)}
 b+=t(345,122,"MONTHLY",9,MUTED,FONTS.mono,'text-anchor="end"');
 return svg(360,131,b,"Mobile activity "+total+" contributions");
};
function mobileTile(p,i){
 const background=[BLUE,RED,YELLOW][i],ink=i===2?INK:"#fff";
 let b=r(0,0,111,64,background,8);
 b+=t(9,16,p.tag,10,ink,FONTS.mono,'font-weight="600"');
 b+=t(9,41,p.metric,24,ink,FONTS.serif,'font-style="italic"');
 b+=t(9,57,p.unit.slice(0,15),9.5,ink,FONTS.sans);
 b+=t(100,16,"↗",11,ink,FONTS.mono,'text-anchor="end"');
 return svg(116,69,b,"Mobile "+p.tag+" card");
};
function mobileRepo(p){
 let b=r(0,0,111,61,PAPER,8)+r(9,10,7,7,p.color,2);
 b+=t(9,35,p.name,p.name.length>12?10:12,INK,FONTS.sans,'font-weight="600"');
 b+=t(9,52,p.lang,10,MUTED,FONTS.mono)+t(101,52,"↗",12,BLUE,FONTS.mono,'text-anchor="end"');
 return svg(116,66,b,"Mobile repository "+p.name);
};
function mobileTitle(dark){
 const ink=dark?"#e6edf3":INK;
 return svg(360,38,t(9,29,"What I'm",23,ink,FONTS.serif)+t(122,29,"coding",23,ink,FONTS.serif,'font-style="italic"'),"Mobile coding section");
};
function repoDirectoryTitle(cfg,mobile=false){
 const total=cfg.repositories.length,open=cfg.repositories.filter(p=>p.visibility==="public").length,privateCount=total-open;
 const w=mobile?360:880,h=mobile?96:133,x=mobile?14:42;
 let b=r(0,0,w,h-(mobile?5:10),PAPER,mobile?9:14);
 b+=r(x,mobile?13:22,mobile?6:8,mobile?6:8,BLUE,2,'class="li"');
 b+=t(x+(mobile?14:20),mobile?20:30,"REPOSITORY DIRECTORY",mobile?10:12,MUTED,FONTS.mono,'letter-spacing="1"');
 b+=t(x,mobile?66:96,String(total),mobile?53:83,INK,FONTS.serif,'font-style="italic" class="r" style="animation-delay:.22s"');
 b+=t(x+(mobile?70:126),mobile?65:94,"repositories",mobile?28:53,INK,FONTS.serif,'class="r" style="animation-delay:.36s"');
 b+=t(w-x,mobile?86:121,open+" PUBLIC  ·  "+privateCount+" PRIVATE",mobile?10:12,BLUE,FONTS.mono,'text-anchor="end"');
 return svg(w,h,b,`${total} GitHub repositories: ${open} public, ${privateCount} private`);
};
function repoDirectorySection(kind,count,mobile=false){
 const w=mobile?360:880,h=mobile?34:54,accent=kind==="public"?BLUE:RED;
 let b=r(0,0,w,h-3,PAPER,mobile?7:10);
 b+=r(mobile?13:25,mobile?11:17,mobile?5:7,mobile?5:7,accent,2);
 b+=t(mobile?27:44,mobile?19:29,kind==="public"?"PUBLIC REPOSITORIES":"PRIVATE PROJECTS",mobile?10.5:14,INK,FONTS.mono,'font-weight="600" letter-spacing=".75"');
 b+=t(w-(mobile?14:30),mobile?20:30,String(count).padStart(2,"0"),mobile?12:17,accent,FONTS.mono,'text-anchor="end"');
 return svg(w,h,b,`${kind}: ${count} repositories`);
};
function repoDirectoryCard(p,i,mobile=false){
 const w=mobile?360:880,h=mobile?66:79,cardH=mobile?62:73;
 const priv=p.visibility!=="public";
 const theme={AI:BLUE,Security:RED,Network:"#23839b",Web:"#ad8418",App:"#8170c1",Tools:"#238b60",Mobile:"#bc5e72",Desktop:"#555d92",IT:"#6565a9",Systems:"#555d92",Campus:"#a98c30",Automation:"#5e85ac",Media:"#a45ca2",Profile:BLUE,Utilities:"#707078"};
 const accent=priv?"#7e8188":(theme[p.category]||BLUE);
 let b=r(0,0,w,cardH,PAPER,mobile?9:12);
 b+=`<defs><clipPath id="line"><rect x="0" y="0" width="${w}" height="${cardH}" rx="${mobile?9:12}"/></clipPath></defs>`;
 b+=`<g clip-path="url(#line)">`+r(0,0,mobile?3:4,cardH,accent);
 b+=`<rect x="${mobile?3:4}" y="0" width="${mobile?28:51}" height="2" fill="${accent}" class="f" style="animation-delay:.12s"/>`;
 b+="</g>";
 // Each SVG animates one content group, not hundreds of child nodes.
 b+=`<g class="r" style="animation-delay:${(0.10+i%6*.065).toFixed(2)}s">`;
 if(mobile){
  b+=t(12,18,String(i+1).padStart(2,"0"),9,MUTED,FONTS.mono);
  b+=t(38,26,p.name,p.name.length>19?15:p.name.length>14?17:20,INK,FONTS.sans,'font-weight="600"');
  b+=t(39,47,p.language||"Other",10,MUTED,FONTS.mono);
  b+=t(344,15,priv?"PRIVATE":"PUBLIC",9,priv?MUTED:BLUE,FONTS.mono,'text-anchor="end" font-weight="600"');
  b+=t(344,49,priv?"●":"↗",17,priv?MUTED:accent,FONTS.mono,'text-anchor="end"');
 }else{
  b+=t(20,45,String(i+1).padStart(2,"0"),13,MUTED,FONTS.mono);
  b+=r(59,21,7,7,accent,2);
  b+=t(79,38,p.name,p.name.length>23?20:24,INK,FONTS.sans,'font-weight="600"');
  b+=t(79,59,priv?"Private repository  ·  source not public":(p.description||"Public repository"),12,SOFT,FONTS.sans);
  b+=t(800,25,(p.language||"OTHER").toUpperCase()+"  /  "+(priv?"PRIVATE":"PUBLIC"),10,priv?MUTED:BLUE,FONTS.mono,'text-anchor="end"');
  b+=t(826,51,priv?"●":"↗",22,priv?MUTED:accent,FONTS.mono,'text-anchor="end"');
 }
 b+="</g>";
 return svg(w,h,b,p.name+" — "+(priv?"private, not publicly accessible":"public")+(p.language?", "+p.language:""));
};
function footerLanguageBar(mobile=false){
 const w=mobile?360:880,h=mobile?31:40;
 let b=r(0,0,w,h-3,PAPER,mobile?7:9);
 b+=r(mobile?12:22,mobile?9:12,5,5,BLUE,2);
 b+=t(mobile?25:37,mobile?17:23,"LANGUAGE / SPRACHE / ЯЗЫК",mobile?9:11,MUTED,FONTS.mono);
 b+=t(w-(mobile?12:24),mobile?18:24,"05",mobile?11:13,BLUE,FONTS.mono,'text-anchor="end"');
 return svg(w,h,b,"Choose README language");
};
function buildCards(cfg,data,portrait){
 const all=cfg.repositories||[];
 const open=all.filter(x=>x.visibility==="public");
 const closed=all.filter(x=>x.visibility==="private");
 const assets={
  "cards/hero.svg":hero(cfg,portrait),"cards/hero-mobile.svg":mobileHero(cfg,portrait),
  "cards/heatmap.svg":calendar(data?.days),"cards/heatmap-mobile.svg":mobileHeatmap(data?.days),
  "cards/activity.svg":activity(data),"cards/activity-mobile.svg":mobileActivity(data),
  "cards/repositories-title.svg":repoDirectoryTitle(cfg),"cards/repositories-title-mobile.svg":repoDirectoryTitle(cfg,true),
  "cards/repositories-public.svg":repoDirectorySection("public",open.length),
  "cards/repositories-public-mobile.svg":repoDirectorySection("public",open.length,true),
  "cards/repositories-private.svg":repoDirectorySection("private",closed.length),
  "cards/repositories-private-mobile.svg":repoDirectorySection("private",closed.length,true),
  "cards/footer-heading.svg":footerHeading(cfg),"cards/footer-heading-mobile.svg":footerHeading(cfg,true),
  "cards/footer-languages.svg":footerLanguageBar(),"cards/footer-languages-mobile.svg":footerLanguageBar(true)
 };
 cfg.tiles.forEach((p,i)=>{assets["cards/"+p.id+".svg"]=tile(p,i);assets["cards/"+p.id+"-mobile.svg"]=mobileTile(p,i)});
 all.forEach((p,i)=>{assets["cards/project-"+p.name+".svg"]=repoDirectoryCard(p,i);assets["cards/project-"+p.name+"-mobile.svg"]=repoDirectoryCard(p,i,true)});
 cfg.links.forEach((p,i)=>{assets["cards/footer-nav-"+p[0]+".svg"]=footerNav(p,i);assets["cards/footer-nav-"+p[0]+"-mobile.svg"]=footerNav(p,i,true)});
 FOOTER_LANGUAGES.forEach((p,i)=>{assets["cards/footer-language-"+p.key+".svg"]=footerLanguage(p,i);assets["cards/footer-language-"+p.key+"-mobile.svg"]=footerLanguage(p,i,true)});
 return assets;
};

function summarize(days){if(!days?.length)throw new Error("Empty contribution series");days=[...days].map(d=>({date:d.date,count:Number(d.count)})).sort((a,b)=>a.date.localeCompare(b.date));if(days.some(d=>!Number.isFinite(d.count)||d.count<0))throw new Error("Invalid contributions");let monthly=new Map(),max={date:"",count:-1},run=0,longest=0;for(const d of days){const m=d.date.slice(0,7);monthly.set(m,(monthly.get(m)||0)+d.count);if(d.count>max.count)max=d;run=d.count>0?run+1:0;longest=Math.max(longest,run)}let idx=days.length-1;const today=new Date().toISOString().slice(0,10);if(days[idx].count===0&&days[idx].date>=new Date(Date.now()-86400000).toISOString().slice(0,10))idx--;let current=0;if(idx>=0&&days[idx].date>=new Date(Date.now()-86400000).toISOString().slice(0,10))for(let i=idx;i>=0&&days[i].count>0;i--)current++;return{days,monthly:[...monthly].map(([month,total])=>({month,total})),total_contributions:days.reduce((a,b)=>a+b.count,0),best_day:max,current_streak:{length:current},longest_streak:{length:longest},updated_at:new Date().toISOString()}};
export {buildCards,summarize};
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
async function fetchPortrait(){try{const res=await fetch("https://avatars.githubusercontent.com/u/223726244?v=4&size=512");if(!res.ok)throw new Error("avatar "+res.status);const buf=Buffer.from(await res.arrayBuffer());const {default:sharp}=await import("sharp");const {data,info}=await sharp(buf).resize(65,53,{fit:"cover",position:"attention"}).grayscale().normalize().raw().toBuffer({resolveWithObject:true});const ramp="@%#*+=-:. ";const rows=[];for(let y=0;y<info.height;y++){let s="";for(let x=0;x<info.width;x++){let v=data[y*info.width+x];s+=ramp[Math.min(ramp.length-1,Math.floor(v*(ramp.length-1)/255))]}rows.push(s)}return rows}catch(e){console.warn("Avatar conversion unavailable:",e.message);return null}}
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