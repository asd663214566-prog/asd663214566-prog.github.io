const LINKS=[
 {cat:'ai',title:'2D Anime-Style Art (AI-Assisted)',desc:'2D Japanese anime-style character illustrations created with an AI-assisted workflow, then refined and finished by hand. Hosted externally.',url:'https://drive.google.com/drive/folders/1T2UPp_312KpDKcYWwseq76BCTgn0SSXo',mature:true}
].concat(window.EXTRA_LINKS||[]);
const CATS={featured:'Featured','2d':'2D Artwork',slot:'Slot','3d':'3D Portfolio',anim:'Animation',logo:'Game Logo Design'};
const R18TABS=[{k:'spine',label:'Spine / HCG (R18)',url:'https://drive.google.com/drive/folders/1ezEzhXOIHc9iuIyjUHb3hdM-IAVJ0bRC'},{k:'ai',label:'2D Anime · AI-Assisted (R18)'}];
const esc=s=>String(s==null?'':s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const items=window.GALLERY||[];const grid=document.getElementById('grid'),tabs=document.getElementById('tabs');let cur='featured',sub='',vis=[];
const SUBS={'':'All 2D',concept:'Concept Design',ui:'UI',illus:'Illustration'};const subtabs=document.createElement('div');subtabs.className='tabs subtabs';subtabs.id='subtabs';tabs.after(subtabs);
Object.entries(SUBS).forEach(([k,v])=>{const b=document.createElement('button');b.type='button';b.textContent=v;b.dataset.s=k;b.onclick=()=>{sub=k;render()};subtabs.appendChild(b)});
Object.entries(CATS).forEach(([k,v])=>{const b=document.createElement('button');b.type='button';b.textContent=v;b.onclick=()=>{cur=k;sub='';render()};b.dataset.k=k;tabs.appendChild(b)});
R18TABS.forEach((t,n)=>{const b=document.createElement('button');b.type='button';b.className='r18tab'+(n?'':' r18first');b.textContent=t.label;b.dataset.k=t.k;
 b.onclick=e=>{e.stopPropagation();if(t.url)window.r18open(t.url);else window.r18open(null,()=>{cur=t.k;render()})};tabs.appendChild(b)});
const vio='IntersectionObserver' in window?new IntersectionObserver(es=>es.forEach(e=>{const v=e.target;if(e.isIntersecting){if(!v.src)v.src=v.dataset.src;v.play().catch(()=>{})}else v.pause()}),{rootMargin:'200px'}):null;
function render(){if(vio)vio.disconnect();tabs.querySelectorAll('button').forEach(b=>b.classList.toggle('on',b.dataset.k===cur));grid.innerHTML='';
 vis=cur==='featured'?items.filter(i=>i.feat).sort((a,b)=>a.feat-b.feat):items.filter(i=>cur==='all'?i.cat!=='ai':i.cat===cur&&(cur!=='2d'||!sub||(sub==='illus'?!i.sub:i.sub===sub)));
 subtabs.hidden=cur!=='2d';subtabs.querySelectorAll('button').forEach(b=>b.classList.toggle('on',b.dataset.s===sub));
 vis.forEach((it,ix)=>{const a=document.createElement('div');a.className='card';const t=esc(it.title);
  a.innerHTML=it.type==='video'?`<video data-src="${it.src}" ${it.poster?`poster="${it.poster}"`:''} ${it.w?`width="${it.w}" height="${it.h}"`:''} muted loop playsinline autoplay preload="none" aria-label="${t}"></video>`:`<img src="${it.thumb}" alt="${t}" loading="lazy" ${it.w?`width="${it.w}" height="${it.h}"`:''}>`;
  a.onclick=()=>open(ix);
  grid.appendChild(a);if(it.type==='video'){const v=a.querySelector('video');v.muted=true;vio?vio.observe(v):(v.src=v.dataset.src)}});
 LINKS.filter(l=>cur!=='featured'&&(cur==='all'?!l.mature:l.cat===cur)).forEach(l=>{const a=document.createElement('a');a.className='card link'+(l.mature?' mature':'');a.href=l.url;a.target='_blank';a.rel='noopener';
  a.innerHTML=`${l.mature?'<div class="badge">R18 · MATURE CONTENT</div>':''}<h3>${l.title}</h3><p>${l.desc}${l.mature?' Contains mature content — viewer discretion advised.':''}</p><span>Open Google Drive folder →</span>`;grid.appendChild(a)})}
render();
const lb=document.getElementById('lb'),stage=document.getElementById('stage'),cap=lb.querySelector('.c');let li=0;
function open(i){li=i;show();lb.classList.add('open')}
function show(){const it=vis[li];stage.innerHTML=it.type==='video'?`<video src="${it.src}" ${it.poster?`poster="${it.poster}"`:''} controls autoplay loop playsinline></video>`:`<img src="${it.src}" alt="${esc(it.title)}">`;cap.textContent=`${li+1} / ${vis.length}`}
function step(d){li=(li+d+vis.length)%vis.length;show()}
function close(){lb.classList.remove('open');stage.innerHTML=''}
lb.querySelector('.x').onclick=close;lb.querySelector('.p').onclick=()=>step(-1);lb.querySelector('.n').onclick=()=>step(1);
lb.onclick=e=>{if(e.target===lb)close()};
document.addEventListener('keydown',e=>{if(!lb.classList.contains('open'))return;if(e.key==='Escape')close();if(e.key==='ArrowLeft')step(-1);if(e.key==='ArrowRight')step(1)});
document.getElementById('yr').textContent=new Date().getFullYear();
