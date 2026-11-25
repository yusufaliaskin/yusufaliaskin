import {readFileSync,writeFileSync,mkdirSync} from "node:fs";
import {resolve} from "node:path";
import {pathToFileURL} from "node:url";
const CFG=JSON.parse(readFileSync(new URL("../profile.json",import.meta.url),"utf8"));
const PAPER="#f3f3f1",INK="#111111",SOFT="#3a3a3c",MUTED="#6e6e73",BLUE="#2f55ff",RED="#ef3b2d",YELLOW="#ffc81a",W=880;
const FONTS={"serif":"Georgia, 'Times New Roman', serif","sans":"Arial, Helvetica, sans-serif","mono":"Consolas, Menlo, monospace"};
const BASE_CSS="@keyframes rise{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:none}}\n@keyframes fade{from{opacity:0}to{opacity:1}}\n@keyframes grow{from{transform:scaleY(0)}to{transform:scaleY(1)}}\n@keyframes pop{0%{opacity:0;transform:scale(.3)}70%{opacity:1;transform:scale(1.15)}100%{opacity:1;transform:none}}\n@keyframes pulse{0%,100%{opacity:1}50%{opacity:.25}}\n@keyframes nudge{0%,100%{transform:none}50%{transform:translateX(4px)}}\n@keyframes nudgeup{0%,100%{transform:none}50%{transform:translate(3px,-3px)}}\n@keyframes tilein{0%{opacity:0;transform:translateY(90px) scale(.6) rotate(-9deg)}55%{opacity:1;transform:translateY(-10px) scale(1.05) rotate(2deg)}75%{transform:translateY(3px) scale(.98) rotate(-.8deg)}90%{transform:translateY(-1px) scale(1.01) rotate(.2deg)}100%{opacity:1;transform:none}}\n@keyframes slidein{from{opacity:0;transform:translateX(-26px)}to{opacity:1;transform:none}}\n@keyframes arrowin{0%{opacity:0;transform:translateX(-30px)}60%{opacity:1;transform:translateX(6px)}100%{opacity:1;transform:none}}\n@keyframes roll{from{transform:translateY(60px)}to{transform:none}}\n@keyframes sheen{0%{transform:translateX(-260px) skewX(-20deg)}22%,100%{transform:translateX(420px) skewX(-20deg)}}\n@keyframes ring{0%{opacity:.7;transform:scale(.2)}100%{opacity:0;transform:scale(2.4)}}\n.r{opacity:0;animation:rise .8s cubic-bezier(.2,.7,.2,1) both;transform-box:fill-box}\n.f{opacity:0;animation:fade .9s ease-out both}\n.g{transform-box:fill-box;transform-origin:bottom;transform:scaleY(0);animation:grow .8s cubic-bezier(.2,.7,.2,1) both}\n.p{opacity:0;transform-box:fill-box;transform-origin:center;animation:pop .4s ease-out both}\n.live{animation:pulse 1.6s ease-in-out infinite}\n.n{transform-box:fill-box;animation:nudge 1.8s ease-in-out infinite}\n.nu{transform-box:fill-box;animation:nudgeup 1.8s ease-in-out infinite}\n.ti{opacity:0;transform-box:fill-box;transform-origin:50% 60%;animation:tilein 1.1s cubic-bezier(.2,.8,.2,1) both}\n.sl{opacity:0;transform-box:fill-box;animation:slidein .6s cubic-bezier(.2,.7,.2,1) both}\n.ai{opacity:0;transform-box:fill-box;animation:arrowin .7s cubic-bezier(.2,.7,.2,1) both}\n.ro{transform-box:fill-box;animation:roll .8s cubic-bezier(.15,.8,.2,1) both}\n.sh{animation:sheen 5s ease-in-out infinite}\n.rg{opacity:0;transform-box:fill-box;transform-origin:center;animation:ring 1s ease-out both}\n@media(prefers-reduced-motion:reduce){.r,.f,.g,.p,.live,.n,.nu,.ti,.sl,.ai,.ro,.sh,.rg{animation:none!important;opacity:1!important;transform:none!important}.sh,.rg{display:none!important}}\n\n@keyframes buttonIn{0%{opacity:0;transform:translateY(18px) scale(.87)}65%{opacity:1;transform:translateY(-1px) scale(1.025)}100%{opacity:1;transform:none}}\n@media(max-width:400px){.sh,.n,.nu,.live{animation-iteration-count:2!important}}\n";
function esc(x){return String(x).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&apos;")};
function svg(w,h,body,label){return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" role="img" aria-label="${esc(label)}"><title>${esc(label)}</title><style><![CDATA[${BASE_CSS}]]></style>${body}</svg>`};
function t(x,y,val,size,color=INK,family=FONTS.sans,extra=""){return `<text x="${x}" y="${y}" font-family="${esc(family)}" font-size="${size}" fill="${color}" ${extra}>${esc(val)}</text>`};
function r(x,y,w,h,fill,rx=0,extra=""){return `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${rx}" fill="${fill}" ${extra}/>`};
function wrapped(str,max=34){const words=String(str).split(" "),rows=[];let line="";for(const w of words){if((line+" "+w).trim().length>max&&line){rows.push(line);line=w}else line=(line+" "+w).trim()}if(line)rows.push(line);return rows};
function asciiFallback(){const out=[];for(let y=0;y<53;y++){let row="";for(let x=0;x<65;x++){let ax=(x-32)/21.5,ay=(y-23)/21,head=ax*ax+ay*ay<1,shoulder=y>39&&((x-32)/31)**2+((y-57)/18)**2<1;row+=head||shoulder?"@#*+=-:"[(x*11+y*5+x*y)%7]:" "}out.push(row)}return out};
function portraitArt(portrait,x,y,size,mobile=false){
 const p=Array.isArray(portrait)?{rows:portrait}:portrait;
 const rows=p?.rows?.length?p.rows:asciiFallback();
 const png=mobile?(p?.mobilePng||p?.png):p?.png;
 const valid=typeof png==="string"&&/^[A-Za-z0-9+/]+={0,2}$/.test(png);
 const step=size/rows.length;
 let b=`<g transform="translate(${x} ${y})">`;
 if(valid)b+=`<g class="f" style="animation-delay:.22s"><image href="data:image/png;base64,${png}" x="0" y="0" width="${size}" height="${size}" preserveAspectRatio="xMidYMid meet" opacity="${mobile?.80:.60}"/></g>`;
 b+=`<g font-family="Consolas, Menlo, monospace" opacity="${valid?(mobile?.30:.55):1}">`;
 rows.forEach((line,i)=>{b+=`<text class="f" style="animation-delay:${(.25+i*.018).toFixed(3)}s;animation-duration:.35s" x="0" y="${((i+.87)*step).toFixed(3)}" font-size="${(step*1.03).toFixed(3)}" textLength="${size}" lengthAdjust="spacingAndGlyphs" xml:space="preserve" fill="${INK}">${esc(line)}</text>`});
 return b+"</g></g>";
};
function hero(cfg,lines){
 const rows=lines?.length?lines:asciiFallback();
 let b=`<defs><linearGradient id="shine" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="600" y2="0"><stop offset="0" stop-color="${INK}"/><stop offset=".42" stop-color="${INK}"/><stop offset=".5" stop-color="${BLUE}"/><stop offset=".58" stop-color="${INK}"/><stop offset="1" stop-color="${INK}"/><animateTransform attributeName="gradientTransform" type="translate" values="-600 0;600 0;600 0" keyTimes="0;.45;1" dur="7s" begin="1.6s" repeatCount="indefinite"/></linearGradient></defs>`;
 b+=r(0,0,W,420,PAPER,14);
 b+=`<g class="f" style="animation-delay:0s">${r(48,49,8,8,BLUE,2,'class="live"')}${t(66,57,cfg.eyebrow,12,MUTED,FONTS.mono,'letter-spacing="1"')}</g>`;
 b+=t(44,190,cfg.first,116,INK,FONTS.serif,'class="r" style="animation-delay:.15s" letter-spacing="-2.5"');
 b+=t(44,288,cfg.last,100,"url(#shine)",FONTS.serif,'class="r" style="animation-delay:.30s" font-style="italic" letter-spacing="-2.5"');
 b+='<g class="r" style="animation-delay:.55s">';
 cfg.description.slice(0,2).forEach((line,i)=>b+=t(48,338+i*27,line,17,SOFT,FONTS.sans));
 b+='</g><g class="f" style="animation-delay:.8s">';
 b+=t(48,396,cfg.url,13,INK,FONTS.mono)+t(213,396,"↗",15,BLUE,FONTS.mono,'class="nu"')+'</g>';
 b+=portraitArt(lines,540,58,310);
 return svg(W,432,b,cfg.display_name+" animated hero");
};

function calendar(days){
 const map=new Map((days||[]).map(d=>[d.date,d.count])),now=new Date(),today=new Date(Date.UTC(now.getUTCFullYear(),now.getUTCMonth(),now.getUTCDate()));
 const end=new Date(today);end.setUTCDate(today.getUTCDate()+(6-today.getUTCDay()+7)%7);
 const first=new Date(end);first.setUTCDate(end.getUTCDate()-370);
 const colors=["#e2e2de","#c8d3ff","#94a8ff","#6280ff",BLUE,"#1a3be0"],gx=44,gy=99;
 let b=r(0,0,W,249,PAPER,14);
 b+=`<g class="r" style="animation-delay:.8s">${t(42,61,"Every day,",34,INK,FONTS.serif)}${t(217,61,"in blue",34,BLUE,FONTS.serif,'font-style="italic"')}</g>`;
 b+=t(836,60,map.size?"REFRESHED DAILY":"AWAITING FIRST SYNC",11,MUTED,FONTS.mono,'class="f" style="animation-delay:.8s" text-anchor="end"');
 const seen=new Set(),months=[];
 for(let col=0;col<53;col++){
  for(let row=0;row<7;row++){
   const d=new Date(first);d.setUTCDate(first.getUTCDate()+7*col+row);if(d>today)continue;
   const date=d.toISOString().slice(0,10),n=map.get(date),level=n===undefined||n===0?0:n<=5?1:n<=15?2:n<=30?3:n<=50?4:5;
   b+=`<rect class="p" style="animation-delay:${(1+col*.03+row*.02).toFixed(2)}s" x="${gx+col*15}" y="${gy+row*15}" width="12" height="12" rx="3" fill="${colors[level]}">${n===undefined?"":`<title>${date}: ${n} contribution(s)</title>`}</rect>`;
  }
  const d=new Date(first);d.setUTCDate(first.getUTCDate()+col*7);const key=d.getUTCFullYear()+"-"+d.getUTCMonth();
  if(d.getUTCDate()<=7&&!seen.has(key)){seen.add(key);months.push({col,label:d.toLocaleString("en-US",{month:"short",timeZone:"UTC"})})}
 }
 b+='<g class="f" style="animation-delay:2.4s">';
 months.forEach(m=>b+=t(gx+m.col*15,224,m.label,11,MUTED,FONTS.mono));
 b+=t(662,243,"less",10,MUTED,FONTS.mono);colors.forEach((c,i)=>b+=r(700+i*15,233,11,11,c,2));b+=t(798,243,"more",10,MUTED,FONTS.mono);
 b+='</g>';return svg(W,261,b,"GitHub contribution cells pop in order");
};

function activity(data){
 let b=r(0,0,W,340,PAPER,14)+t(40,58,"THE LAST 12 MONTHS ON GITHUB",12,MUTED,FONTS.mono,'class="f" style="animation-delay:1.9s"');
 if(!data?.days?.length){b+=t(38,114,"Syncing real activity",52,INK,FONTS.serif,'class="r" style="animation-delay:2.0s"');return svg(W,352,b,"Pending contribution data")}
 const monthly=new Map((data.monthly||[]).map(x=>[x.month,x.total])),now=new Date(),months=[];
 for(let i=11;i>=0;i--){const dt=new Date(Date.UTC(now.getUTCFullYear(),now.getUTCMonth()-i,1));months.push({n:monthly.get(dt.toISOString().slice(0,7))||0,label:dt.toLocaleString("en-US",{month:"short",timeZone:"UTC"})})}
 const total=Number(data.total_contributions||0),max=Math.max(1,...months.slice(0,11).map(x=>x.n));
 b+=`<g class="r" style="animation-delay:2.0s">${t(38,114,total.toLocaleString("en-US"),52,INK,FONTS.serif)}${t(38+Math.min(180,String(total).length*31),114,"contributions",52,INK,FONTS.serif,'font-style="italic"')}</g>`;
 months.forEach((m,i)=>{const x=40+i*47,height=Math.max(4,Math.round(m.n/max*140)),highlight=i<11&&m.n===max;
 b+=`<rect class="g" style="animation-delay:${(2.2+i*.07).toFixed(2)}s" x="${x}" y="${292-height}" width="37" height="${height}" rx="4" fill="${highlight?BLUE:i===11?"#c9c9c4":INK}"><title>${m.label}: ${m.n}</title></rect>`;
 b+=t(x+18,314,m.label,11,MUTED,FONTS.mono,`text-anchor="middle" class="f" style="animation-delay:${(2.2+i*.07).toFixed(2)}s"`);
 if(highlight)b+=t(x+18,292-height-10,m.n,11,BLUE,FONTS.mono,'text-anchor="middle" class="p" style="animation-delay:3.2s"');});
 const active=data.days.filter(d=>d.count>0).length,stats=[[data.current_streak?.length||0,"current streak"],[active+" / "+data.days.length,"days with a contribution"],[data.best_day?.count||0,"busiest day"]];
 stats.forEach(([val,label],i)=>{const y=104+i*92;b+=`<g class="r" style="animation-delay:${(2.6+i*.15).toFixed(2)}s">${t(650,y,val,40,INK,FONTS.serif)}${t(650,y+24,label,13,MUTED,FONTS.sans)}</g>`;if(i<2)b+=r(650,y+44,190,1,"#dcdcd7",0,'class="f" style="animation-delay:2.6s"')});
 return svg(W,352,b,total+" contributions");
};

function countUp(x,y,metric,unit,color,delay){const m=/^(\d+(?:\.\d+)?)(.*)$/.exec(metric);const base=`font-family="${esc(FONTS.serif)}" font-size="${metric.length>4?37:46}" font-style="italic" fill="${color}"`;const suffix=unit?` <tspan font-size="18">${esc(unit)}</tspan>`:"";if(!m)return `<text x="${x}" y="${y}" ${base} class="r" style="animation-delay:${delay}s">${esc(metric)}${suffix}</text>`;let out="",val=Number(m[1]),dec=(m[1].split(".")[1]||"").length;for(let i=0;i<=18;i++){let n=i===18?metric:(val*(1-Math.pow(1-i/18,3))).toFixed(dec)+m[2],start=delay+i*1.1/18,end=delay+(i+1)*1.1/18;out+=`<text x="${x}" y="${y}" ${base} opacity="0">${esc(n)}${suffix}<set attributeName="opacity" to="1" begin="${start.toFixed(3)}s"/>${i===18?"":`<set attributeName="opacity" to="0" begin="${end.toFixed(3)}s"/>`}</text>`}return out};
function tile(item,i){
 const span=W/3,left=i*4,w=span-8,bg=[BLUE,RED,YELLOW][i],ink=i===2?INK:"#fff",delay=3.1+i*.25;
 let b=`<defs><clipPath id="card">${r(left,0,w,210,"#fff",14)}</clipPath><clipPath id="slot">${r(left,62,w,62,"#fff")}</clipPath><linearGradient id="gl"><stop offset="0" stop-color="#fff" stop-opacity="0"/><stop offset=".5" stop-color="#fff" stop-opacity=".35"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient></defs>`;
 b+=`<g class="ti" style="animation-delay:${delay.toFixed(2)}s"><g clip-path="url(#card)">${r(left,0,w,210,bg,14)}<circle class="rg" style="animation-delay:${(delay+.5).toFixed(2)}s" cx="${left+w-40}" cy="170" r="60" fill="none" stroke="${ink}" stroke-opacity=".5" stroke-width="2"/>${r(left,-20,90,250,"url(#gl)",0,`class="sh" style="animation-delay:${(delay+1.4).toFixed(2)}s"`)}</g>`;
 b+=t(left+24,38,item.tag,12,ink,FONTS.mono,`class="sl" style="animation-delay:${(delay+.35).toFixed(2)}s"`);
 b+=`<g class="ai" style="animation-delay:${(delay+.5).toFixed(2)}s">${t(left+251,38,"→",14,ink,FONTS.mono,'class="n"')}</g>`;
 b+=`<g clip-path="url(#slot)"><g class="ro" style="animation-delay:${(delay+.45).toFixed(2)}s">${countUp(left+22,112,String(item.metric),item.unit,ink,delay+.45)}</g></g>`;
 wrapped(item.text,34).slice(0,3).forEach((line,j)=>b+=t(left+24,150+j*20,line,13,ink,FONTS.sans,`class="r" style="animation-delay:${(delay+.75+j*.1).toFixed(2)}s"`));
 return svg(span,222,b+'</g>',item.tag+" "+item.metric);
};

function titleCard(dark){const fg=dark?"#e6edf3":INK;const b=t(2,47,"What I'm",35,fg,FONTS.serif,'class="r" style="animation-delay:4.4s"')+t(184,47,"coding",35,fg,FONTS.serif,'font-style="italic" class="r" style="animation-delay:4.4s"');return svg(W,64,b,"What I'm coding")};
function repo(p,i){const span=W/3,left=i*4,w=span-8;let b=r(left,0,w,190,PAPER,14);b+=`<g class="r" style="animation-delay:${((4.6+i*.12)).toFixed(2)}s">`+r(left+24,29,8,8,p.color,2)+t(left+39,39,p.name,17,INK,FONTS.sans,'font-weight="bold"');
wrapped(p.description,31).slice(0,4).forEach((s,j)=>b+=t(left+24,75+j*20,s,13,SOFT,FONTS.sans));b+=t(left+24,167,p.lang+"   ·   OPEN SOURCE",11,MUTED,FONTS.mono)+"</g>";return svg(span,202,b,p.name+" — "+p.description)};

const FOOTER_FOCUS={"en":"Software engineering · AI · cybersecurity · automation","tr":"Yazılım mühendisliği · yapay zekâ · siber güvenlik · otomasyon","de":"Softwareentwicklung · KI · Cybersicherheit · Automatisierung","ru":"Разработка ПО · ИИ · кибербезопасность · автоматизация","zh":"软件工程 · 人工智能 · 网络安全 · 自动化"};
const FOOTER_LANGUAGES=[{"key":"en","label":"English","file":"README.md"},{"key":"tr","label":"Türkçe","file":"README_TR.md"},{"key":"de","label":"Deutsch","file":"README_DE.md"},{"key":"ru","label":"Русский","file":"README_RU.md"},{"key":"zh","label":"中文","file":"README_ZH.md"}];
function footerNav(link,i,mobile=false){
 const [id,url]=link,label={portfolio:"Portfolio",linkedin:"LinkedIn",projects:"Projects",contact:"Contact"}[id]||id;
 const accent={portfolio:BLUE,linkedin:"#1268aa",projects:INK,contact:RED}[id]||BLUE;
 const w=mobile?90:220,h=mobile?43:59,inner=w-(mobile?4:8),ch=h-(mobile?5:7),rad=mobile?9:13,delay=5.05+i*.16;
 const paths={portfolio:'<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c-5 5-5 13 0 18M12 3c5 5 5 13 0 18"/>',linkedin:'<rect x="3" y="3" width="18" height="18" rx="3"/><path d="M7.5 10v7M12 17v-7m0 3c0-4 6-4 6 0v4"/><circle cx="7.5" cy="7" r=".8" fill="currentColor" stroke="none"/>',projects:'<path d="M8 6 3 12l5 6m8-12 5 6-5 6m-3-14-2 16"/>',contact:'<rect x="3" y="5" width="18" height="14" rx="3"/><path d="m4 7 8 6 8-6"/>'};
 let b=`<defs><clipPath id="card">${r(0,0,inner,ch,"#fff",rad)}</clipPath><linearGradient id="gl"><stop offset="0" stop-color="${accent}" stop-opacity="0"/><stop offset=".5" stop-color="${accent}" stop-opacity=".16"/><stop offset="1" stop-color="${accent}" stop-opacity="0"/></linearGradient></defs>`;
 b+=`<g class="ti" style="animation-delay:${delay.toFixed(2)}s;animation-name:buttonIn">`;
 b+=r(0,0,inner,ch,PAPER,rad);
 b+=`<rect x=".65" y=".65" width="${inner-1.3}" height="${ch-1.3}" rx="${rad-.65}" fill="none" stroke="${accent}" stroke-opacity=".55" stroke-width="1.3"/>`;
 b+=`<g class="sl" style="animation-delay:${(delay+.18).toFixed(2)}s">`;
 if(!mobile)b+=`<rect x="10" y="10" width="32" height="32" rx="10" fill="${accent}" fill-opacity=".08"/>`;
 b+=`<g class="button-icon" transform="translate(${mobile?7:15} ${mobile?4:15}) scale(${mobile?.53:.83})" fill="none" color="${accent}" stroke="${accent}" stroke-width="1.7" stroke-linejoin="round" stroke-linecap="round">${paths[id]||paths.portfolio}</g>`;
 b+=t(mobile?inner/2:51,mobile?29:33,label,mobile?10.8:17,INK,FONTS.sans,`class="button-label" font-weight="600" ${mobile?'text-anchor="middle"':""}`);
 b+='</g>';
 b+=`<g class="ai" style="animation-delay:${(delay+.35).toFixed(2)}s">${t(inner-(mobile?9:16),mobile?14:32,"↗",mobile?10:15,accent,FONTS.mono,'class="n" text-anchor="end"')}</g>`;
 b+=`<g clip-path="url(#card)" class="button-glint">${r(0,-4,65,ch+8,"url(#gl)",0,`class="sh" style="animation-delay:${(delay+.65).toFixed(2)}s"`)}</g>`;
 return svg(w,h,b+'</g>',label+" — "+url);
};

function footerSpecialties(locale,mobile=false){let sentence=FOOTER_FOCUS[locale]||FOOTER_FOCUS.en;if(mobile){const l={en:["Software engineering · AI","Cybersecurity · Automation"],tr:["Yazılım mühendisliği · Yapay zekâ","Siber güvenlik · Otomasyon"],de:["Softwareentwicklung · KI","Cybersicherheit · Automatisierung"],ru:["Разработка ПО · ИИ","Кибербезопасность · Автоматизация"],zh:["软件工程 · 人工智能","网络安全 · 自动化"]}[locale];let b=r(0,0,360,56,PAPER,8)+r(12,10,5,5,BLUE,2);b+=t(25,17,"FOCUS",10,MUTED,FONTS.mono)+t(12,34,l[0],locale==="ru"?11.5:13,INK,FONTS.sans,'font-weight="600"')+t(12,50,l[1],locale==="ru"?11.5:13,SOFT,FONTS.sans);return svg(360,60,b,sentence)}
let b=r(0,0,880,62,PAPER,10)+r(22,12,6,6,BLUE,2);b+=t(38,19,"FOCUS",11,MUTED,FONTS.mono)+t(22,46,sentence,locale==="zh"?23:locale==="ru"?19:20,INK,FONTS.sans,'font-weight="600"')+t(844,20,"05 LANGUAGES",10,BLUE,FONTS.mono,'text-anchor="end"');return svg(880,67,b,sentence)};

function footerLanguage(lang,i,mobile=false){
 const w=mobile?72:176,h=mobile?32:42,inner=w-(mobile?4:8),ch=h-4,delay=5.85+i*.12;
 let b=`<g class="p" style="animation-delay:${delay.toFixed(2)}s">`;
 b+=r(0,0,inner,ch,PAPER,ch/2);
 b+=`<rect x=".6" y=".6" width="${inner-1.2}" height="${ch-1.2}" rx="${ch/2-.6}" fill="none" stroke="#b4b5ba"/>`;
 b+=`<g class="r" style="animation-delay:${(delay+.12).toFixed(2)}s">`;
 b+=t(inner/2,mobile?18:25,lang.label,mobile?(lang.key==="ru"?10:11):(lang.key==="ru"?14:16),INK,FONTS.sans,'class="language-label" text-anchor="middle" font-weight="600"');
 return svg(w,h,b+'</g></g>',"Language "+lang.label);
};

function mobileHero(cfg,portrait){
 const rows=portrait?.length?portrait:asciiFallback();
 let b=r(0,0,360,157,PAPER,8)+r(12,12,5,5,BLUE,2);
 b+=t(24,20,cfg.eyebrow,9,MUTED,FONTS.mono,'class="f" style="animation-delay:.08s"');
 b+=t(12,69,cfg.first,53,INK,FONTS.serif,'class="r" style="animation-delay:.15s"');
 b+=t(12,108,cfg.last,39,INK,FONTS.serif,'font-style="italic" class="r" style="animation-delay:.30s"');
 b+=t(12,131,"AI  ·  CYBERSECURITY  ·  AUTOMATION",9,SOFT,FONTS.mono,'class="r" style="animation-delay:.69s"');
 b+=t(12,147,cfg.url,10,BLUE,FONTS.mono,'class="f" style="animation-delay:.87s"');
 b+=portraitArt(portrait,237,29,116,true);
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
  b+=`<g class="p" style="animation-delay:${(1+col*.03).toFixed(2)}s">${cells}</g>`;
 }
 b+=t(14,106,map.size?"GITHUB  /  LAST 12 MONTHS":"AWAITING DATA SYNC",9,MUTED,FONTS.mono,'class="f" style="animation-delay:2.4s"');
 return svg(360,121,b,"Compact animated GitHub heatmap");
};

function mobileActivity(data){
 let b=r(0,0,360,125,PAPER,8);
 b+=t(13,20,"GITHUB ACTIVITY / 12 MONTHS",10,MUTED,FONTS.mono,'class="f" style="animation-delay:1.9s"');
 if(!data?.days?.length){b+=t(13,63,"Syncing activity",29,INK,FONTS.serif,'class="r" style="animation-delay:2.0s"');return svg(360,131,b,"Mobile GitHub activity pending")}
 const total=Number(data.total_contributions||0),streak=data.current_streak?.length||0,months=(data.monthly||[]).slice(-12);
 b+=`<g class="r" style="animation-delay:2.0s">${t(13,63,total.toLocaleString("en-US"),43,INK,FONTS.serif)}${t(14,82,"contributions",13,SOFT,FONTS.sans)}</g>`;
 b+=`<g class="r" style="animation-delay:2.6s">${t(196,59,streak+" days",25,INK,FONTS.serif)}${t(198,78,"current streak",11,MUTED,FONTS.sans)}</g>`;
 const top=Math.max(1,...months.map(m=>m.total));
 for(let i=0;i<12;i++){const height=Math.max(2,19*(months[i]?.total||0)/top);b+=r(14+i*27.6,114-height,16,height,BLUE,2,`class="g" style="animation-delay:${(2.2+i*.07).toFixed(2)}s"`)}
 b+=t(345,122,"MONTHLY",9,MUTED,FONTS.mono,'class="f" style="animation-delay:2.4s" text-anchor="end"');
 return svg(360,131,b,"Animated mobile GitHub activity");
};

function mobileTile(p,i){
 const bg=[BLUE,RED,YELLOW][i],on=i===2?INK:"#fff",delay=3.1+i*.25;
 let b=`<g class="ti" style="animation-delay:${delay.toFixed(2)}s">`;
 b+=r(0,0,111,64,bg,8);
 b+=t(9,16,p.tag,10,on,FONTS.mono,`class="sl" style="animation-delay:${(delay+.35).toFixed(2)}s"`);
 b+=`<g class="ro" style="animation-delay:${(delay+.45).toFixed(2)}s">${t(9,41,p.metric,24,on,FONTS.serif,'font-style="italic"')}${t(9,57,p.unit.slice(0,14),9.5,on,FONTS.sans)}</g>`;
 b+=t(100,16,"↗",11,on,FONTS.mono,`class="ai" style="animation-delay:${(delay+.5).toFixed(2)}s" text-anchor="end"`);
 b+='</g>';return svg(116,69,b,"Mobile "+p.tag+" card");
};

function mobileRepo(p,i=0){
 let b='<g class="r" style="animation-delay:'+(4.6+i*.12).toFixed(2)+'s">';
 b+=r(0,0,111,61,PAPER,8)+r(9,10,7,7,p.color,2);
 b+=t(9,35,p.name,p.name.length>12?10:12,INK,FONTS.sans,'font-weight="600"');
 b+=t(9,52,p.lang,10,MUTED,FONTS.mono);
 b+=t(101,52,"↗",12,BLUE,FONTS.mono,'text-anchor="end"');
 b+='</g>';
 return svg(116,66,b,"Animated mobile repository "+p.name);
};

function mobileTitle(dark){
 const ink=dark?"#e6edf3":INK;
 return svg(360,38,`<text class="r" style="animation-delay:4.4s" x="9" y="29" font-family="${esc(FONTS.serif)}" font-size="23" fill="${ink}">What I'm <tspan font-style="italic">coding</tspan></text>`,"What I'm coding");
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
   const detail=Math.min(14,edge*.12);
   const adjusted=Math.max(0,Math.min(255,light-detail));
   const idx=Math.max(0,Math.min(ramp.length-1,Math.round(adjusted*(ramp.length-1)/255)));
   row+=ramp[idx];
  }
  rows.push(row);
 }
 return rows;
};
async function fetchPortrait(){
 try{
  const res=await fetch("https://github.com/yusufaliaskin.png?size=768",{headers:{"User-Agent":"yusuf-animated-github-profile"},signal:AbortSignal.timeout(15000)});
  if(!res.ok)throw new Error("Avatar HTTP "+res.status);
  const {default:sharp}=await import("sharp");
  const input=Buffer.from(await res.arrayBuffer());
  const square=await sharp(input).rotate().flatten({background:"#f3f3f1"}).resize(320,320,{fit:"contain",background:"#f3f3f1"}).greyscale().toColourspace("b-w").png().toBuffer();
  const {data,info}=await sharp(square).resize(120,60,{fit:"fill"}).toColourspace("b-w").raw().toBuffer({resolveWithObject:true});
  if(info.channels!==1)throw Error("Expected one grayscale channel");
  const png=await sharp(square).png({palette:true,colours:64}).toBuffer();
  const mobile=await sharp(square).resize(144,144).png({palette:true,colours:48}).toBuffer();
  console.log("Portrait v2: 120 x 60, preserved source proportions");
  return {rows:asciiFromGrayscale(data,120,60),png:png.toString("base64"),mobilePng:mobile.toString("base64"),version:2};
 }catch(e){console.warn("Avatar refresh failed, preserving existing portrait:",e.message);return null}
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