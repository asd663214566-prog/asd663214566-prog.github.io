const LINKS=[
 {cat:'ai',title:'2D Anime-Style Art (AI-Assisted)',desc:'2D Japanese anime-style character illustrations created with an AI-assisted workflow, then refined and finished by hand. Hosted externally.',url:'https://drive.google.com/drive/folders/1T2UPp_312KpDKcYWwseq76BCTgn0SSXo',mature:true}
].concat(window.EXTRA_LINKS||[]);
const CATS={all:'All','2d':'2D Artwork','3d':'3D Portfolio',anim:'Animation',logo:'Game Logo Design',ai:'2D Anime · AI-Assisted (R18)'};
const items=window.GALLERY||[];const grid=document.getElementById('grid'),tabs=document.getElementById('tabs');let cur='all',sub='all',vis=[];
const SUBS={'2d':{all:'All 2D',slot:'Slot'}};const PARENT={slot:'2d'};const subtabs=document.createElement('div');subtabs.className='tabs subtabs';tabs.after(subtabs);
Object.entries(CATS).forEach(([k,v])=>{const b=document.createElement('button');b.textContent=v;b.onclick=()=>{cur=k;sub='all';render()};b.dataset.k=k;tabs.appendChild(b)});
const vio='IntersectionObserver' in window?new IntersectionObserver(es=>es.forEach(e=>{const v=e.target;if(e.isIntersecting){if(!v.src)v.src=v.dataset.src;v.play().catch(()=>{})}else v.pause()}),{rootMargin:'200px'}):null;
function render(){if(vio)vio.disconnect();tabs.querySelectorAll('button').forEach(b=>b.classList.toggle('on',b.dataset.k===cur));grid.innerHTML='';
 subtabs.innerHTML='';if(SUBS[cur]){Object.entries(SUBS[cur]).forEach(([k,v])=>{const b=document.createElement('button');b.textContent=v;b.dataset.k=k;b.classList.toggle('on',k===sub);b.onclick=()=>{sub=k;render()};subtabs.appendChild(b)});subtabs.style.display=''}else subtabs.style.display='none';
 vis=items.filter(i=>{const top=PARENT[i.cat]||i.cat;if(cur!=='all'&&top!==cur)return false;if(cur==='2d'&&sub!=='all'&&i.cat!==sub)return false;return true});
 vis.forEach((it,ix)=>{const a=document.createElement('div');a.className='card';
  a.innerHTML=it.type==='video'?`<video data-src="${it.src}" ${it.poster?`poster="${it.poster}"`:''} ${it.w?`width="${it.w}" height="${it.h}"`:''} muted loop playsinline autoplay preload="none"></video>`:`<img src="${it.thumb}" alt="${it.title}" loading="lazy" ${it.w?`width="${it.w}" height="${it.h}"`:''}>`;
  a.innerHTML+=`<span class="tag">${it.title}</span>`;a.onclick=()=>open(ix);
  grid.appendChild(a);if(it.type==='video'){const v=a.querySelector('video');v.muted=true;vio?vio.observe(v):(v.src=v.dataset.src)}});
 LINKS.filter(l=>cur==='all'||l.cat===cur).forEach(l=>{const a=document.createElement('a');a.className='card link'+(l.mature?' mature':'');a.href=l.url;a.target='_blank';a.rel='noopener';
  a.innerHTML=`${l.mature?'<div class="badge">R18 · MATURE CONTENT</div>':''}<h3>${l.title}</h3><p>${l.desc}${l.mature?' Contains mature content — viewer discretion advised.':''}</p><span>Open Google Drive folder →</span>`;grid.appendChild(a)})}
render();
const lb=document.getElementById('lb'),stage=document.getElementById('stage'),cap=lb.querySelector('.c');let li=0;
function open(i){li=i;show();lb.classList.add('open')}
function show(){const it=vis[li];stage.innerHTML=it.type==='video'?`<video src="${it.src}" ${it.poster?`poster="${it.poster}"`:''} controls autoplay loop playsinline></video>`:`<img src="${it.src}" alt="${it.title}">`;cap.textContent=`${it.title} — ${li+1} / ${vis.length}`}
function step(d){li=(li+d+vis.length)%vis.length;show()}
function close(){lb.classList.remove('open');stage.innerHTML=''}
lb.querySelector('.x').onclick=close;lb.querySelector('.p').onclick=()=>step(-1);lb.querySelector('.n').onclick=()=>step(1);
lb.onclick=e=>{if(e.target===lb)close()};
document.addEventListener('keydown',e=>{if(!lb.classList.contains('open'))return;if(e.key==='Escape')close();if(e.key==='ArrowLeft')step(-1);if(e.key==='ArrowRight')step(1)});
document.getElementById('yr').textContent=new Date().getFullYear();
